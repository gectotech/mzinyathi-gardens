'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import toast from 'react-hot-toast';
import MediaUploader from '@/components/admin/MediaUploader';
import ViewDrawer from '@/components/admin/ViewDrawer';
import {
  Copy,
  Trash2,
  Eye,
  Pencil,
  ExternalLink,
  Image as ImageIcon,
  Search,
  FolderOpen,
  Plus,
  Link2,
  LayoutGrid,
  List,
} from 'lucide-react';
import { MEDIA_FOLDERS, SOURCE_LABELS, type SiteMediaItem } from '@/lib/site-media-types';

type FilterSource = 'all' | SiteMediaItem['source'];

export default function AdminMediaPage() {
  const [items, setItems] = useState<SiteMediaItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState<FilterSource>('all');
  const [folderFilter, setFolderFilter] = useState('all');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [uploadFolder, setUploadFolder] = useState('mzinyathi');
  const [viewing, setViewing] = useState<SiteMediaItem | null>(null);
  const [editing, setEditing] = useState<SiteMediaItem | null>(null);
  const [editForm, setEditForm] = useState({ caption: '', folder: '', originalName: '', showInGallery: false });

  const load = () => {
    setLoading(true);
    fetch('/api/admin/media?view=all')
      .then((r) => r.json())
      .then((d) => setItems(d.items || []))
      .finally(() => setLoading(false));
  };

  useEffect(load, []);

  const filtered = useMemo(() => {
    return items.filter((item) => {
      if (filter !== 'all' && item.source !== filter) return false;
      if (folderFilter !== 'all' && item.folder !== folderFilter) return false;
      const q = search.toLowerCase();
      if (!q) return true;
      return (
        item.name.toLowerCase().includes(q) ||
        item.url.toLowerCase().includes(q) ||
        (item.caption || '').toLowerCase().includes(q) ||
        item.sourceLabel.toLowerCase().includes(q)
      );
    });
  }, [items, filter, folderFilter, search]);

  const folders = useMemo(() => {
    const set = new Set(items.map((i) => i.folder));
    return ['all', ...Array.from(set).sort()];
  }, [items]);

  const stats = useMemo(
    () => ({
      total: items.length,
      uploads: items.filter((i) => i.source === 'upload').length,
      static: items.filter((i) => i.source === 'static').length,
      gallery: items.filter((i) => i.showInGallery).length,
    }),
    [items]
  );

  const copyUrl = (url: string) => {
    const full = url.startsWith('http') ? url : `${window.location.origin}${url}`;
    navigator.clipboard.writeText(full);
    toast.success('URL copied');
  };

  const openEdit = (item: SiteMediaItem) => {
    if (!item.editable) {
      toast.error('Register this file to the library first to edit metadata');
      return;
    }
    setEditing(item);
    setEditForm({
      caption: item.caption || '',
      folder: item.folder,
      originalName: item.name,
      showInGallery: item.showInGallery,
    });
    setViewing(null);
  };

  const saveEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editing?.id || !editing.editable) return;
    const res = await fetch('/api/admin/media', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        id: editing.id,
        caption: editForm.caption,
        folder: editForm.folder,
        originalName: editForm.originalName,
        showInGallery: editForm.showInGallery,
      }),
    });
    if (res.ok) {
      toast.success('Media updated');
      setEditing(null);
      load();
    } else {
      toast.error('Update failed');
    }
  };

  const registerToLibrary = async (item: SiteMediaItem) => {
    const res = await fetch('/api/admin/media', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        action: 'register',
        url: item.url,
        name: item.name,
        folder: item.folder,
        caption: item.caption,
        resourceType: item.resourceType,
      }),
    });
    if (res.ok) {
      toast.success('Added to media library — you can now edit it');
      load();
    } else {
      toast.error('Could not register');
    }
  };

  const remove = async (item: SiteMediaItem) => {
    if (!item.deletable || !item.editable) {
      toast.error('Only library uploads can be deleted from here');
      return;
    }
    if (!confirm('Delete this file from Cloudinary and the library?')) return;
    const res = await fetch(`/api/admin/media?id=${item.id}`, { method: 'DELETE' });
    if (res.ok) {
      toast.success('Deleted');
      setViewing(null);
      load();
    }
  };

  const previewUrl = (url: string) => (url.startsWith('http') ? url : url);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap justify-between items-start gap-4">
        <div>
          <h1 className="text-2xl font-bold">Media Library</h1>
          <p className="text-gray-600 text-sm max-w-2xl">
            All images across your website — uploads, static files in /public, properties, school posts, CMS galleries, and application documents.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <select
            className="border rounded-lg px-3 py-2 text-sm"
            value={uploadFolder}
            onChange={(e) => setUploadFolder(e.target.value)}
          >
            {MEDIA_FOLDERS.map((f) => (
              <option key={f} value={f}>
                Upload to: {f}
              </option>
            ))}
          </select>
          <MediaUploader folder={uploadFolder} onUploaded={() => load()} />
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 max-w-2xl">
        <StatCard label="Total assets" value={stats.total} />
        <StatCard label="Library uploads" value={stats.uploads} />
        <StatCard label="Static files" value={stats.static} />
        <StatCard label="In school gallery" value={stats.gallery} />
      </div>

      <div className="flex flex-wrap gap-3 items-center">
        <div className="relative flex-1 min-w-[200px] max-w-md">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            className="w-full border rounded-lg pl-9 pr-3 py-2 text-sm"
            placeholder="Search name, URL, caption..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <select className="border rounded-lg px-3 py-2 text-sm" value={filter} onChange={(e) => setFilter(e.target.value as FilterSource)}>
          <option value="all">All sources</option>
          {(Object.keys(SOURCE_LABELS) as SiteMediaItem['source'][]).map((s) => (
            <option key={s} value={s}>
              {SOURCE_LABELS[s]}
            </option>
          ))}
        </select>
        <select className="border rounded-lg px-3 py-2 text-sm" value={folderFilter} onChange={(e) => setFolderFilter(e.target.value)}>
          {folders.map((f) => (
            <option key={f} value={f}>
              {f === 'all' ? 'All folders' : f}
            </option>
          ))}
        </select>
        <div className="flex border rounded-lg overflow-hidden">
          <button
            type="button"
            onClick={() => setViewMode('grid')}
            className={`p-2 ${viewMode === 'grid' ? 'bg-slate-100' : ''}`}
            title="Grid view"
          >
            <LayoutGrid size={16} />
          </button>
          <button
            type="button"
            onClick={() => setViewMode('list')}
            className={`p-2 ${viewMode === 'list' ? 'bg-slate-100' : ''}`}
            title="List view"
          >
            <List size={16} />
          </button>
        </div>
      </div>

      {loading ? (
        <p className="text-center text-gray-500 py-12">Loading media...</p>
      ) : filtered.length === 0 ? (
        <p className="text-center text-gray-500 py-12">No media matches your filters.</p>
      ) : viewMode === 'grid' ? (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filtered.map((item) => (
            <MediaCard
              key={`${item.id}-${item.url}`}
              item={item}
              onView={() => setViewing(item)}
              onEdit={() => openEdit(item)}
              onCopy={() => copyUrl(item.url)}
              onRegister={() => registerToLibrary(item)}
              onDelete={() => remove(item)}
            />
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-xl border overflow-hidden">
          <table className="min-w-full text-sm">
            <thead className="bg-slate-50 border-b">
              <tr>
                <th className="px-4 py-3 text-left">Preview</th>
                <th className="px-4 py-3 text-left">Name</th>
                <th className="px-4 py-3 text-left">Source</th>
                <th className="px-4 py-3 text-left">Location</th>
                <th className="px-4 py-3 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((item) => (
                <tr key={`${item.id}-${item.url}`} className="border-t hover:bg-slate-50/80">
                  <td className="px-4 py-2">
                    <Thumb item={item} className="w-14 h-10" />
                  </td>
                  <td className="px-4 py-3">
                    <p className="font-medium truncate max-w-[200px]">{item.name}</p>
                    <p className="text-xs text-gray-400 truncate max-w-[240px]">{item.url}</p>
                  </td>
                  <td className="px-4 py-3">
                    <SourceBadge source={item.source} />
                  </td>
                  <td className="px-4 py-3 text-xs text-gray-500">{item.folder}</td>
                  <td className="px-4 py-3">
                    <RowActions
                      item={item}
                      onView={() => setViewing(item)}
                      onEdit={() => openEdit(item)}
                      onCopy={() => copyUrl(item.url)}
                      onRegister={() => registerToLibrary(item)}
                      onDelete={() => remove(item)}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {editing && (
        <form onSubmit={saveEdit} className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <button type="button" className="absolute inset-0 bg-black/40" onClick={() => setEditing(null)} />
          <div className="relative bg-white rounded-2xl shadow-xl w-full max-w-lg p-6 space-y-4">
            <h2 className="font-semibold text-lg">Edit media</h2>
            <Thumb item={editing} className="w-full h-40 rounded-xl" />
            <input
              className="w-full border rounded-lg px-3 py-2 text-sm"
              value={editForm.originalName}
              onChange={(e) => setEditForm({ ...editForm, originalName: e.target.value })}
              placeholder="Display name"
            />
            <input
              className="w-full border rounded-lg px-3 py-2 text-sm"
              value={editForm.caption}
              onChange={(e) => setEditForm({ ...editForm, caption: e.target.value })}
              placeholder="Caption / location notes"
            />
            <select
              className="w-full border rounded-lg px-3 py-2 text-sm"
              value={editForm.folder}
              onChange={(e) => setEditForm({ ...editForm, folder: e.target.value })}
            >
              {MEDIA_FOLDERS.map((f) => (
                <option key={f} value={f}>
                  {f}
                </option>
              ))}
            </select>
            <label className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={editForm.showInGallery}
                onChange={(e) => setEditForm({ ...editForm, showInGallery: e.target.checked })}
              />
              Show in school public gallery (/school/gallery)
            </label>
            <div className="flex gap-2">
              <button type="submit" className="bg-[#4169E1] text-white px-4 py-2 rounded-lg text-sm">
                Save
              </button>
              <button type="button" onClick={() => setEditing(null)} className="border px-4 py-2 rounded-lg text-sm">
                Cancel
              </button>
            </div>
          </div>
        </form>
      )}

      <ViewDrawer
        open={!!viewing}
        onClose={() => setViewing(null)}
        title={viewing?.name || ''}
        subtitle={viewing?.url}
        headerIcon={<ImageIcon size={22} className="text-white" />}
        width="lg"
        footer={
          viewing && (
            <div className="flex flex-wrap gap-2">
              <button type="button" onClick={() => copyUrl(viewing.url)} className="inline-flex items-center gap-2 border px-4 py-2 rounded-lg text-sm">
                <Copy size={14} /> Copy URL
              </button>
              <a
                href={previewUrl(viewing.url)}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 border px-4 py-2 rounded-lg text-sm"
              >
                <ExternalLink size={14} /> Open file
              </a>
              {viewing.editable ? (
                <button type="button" onClick={() => openEdit(viewing)} className="inline-flex items-center gap-2 bg-[#4169E1] text-white px-4 py-2 rounded-lg text-sm">
                  <Pencil size={14} /> Edit
                </button>
              ) : (
                <button type="button" onClick={() => registerToLibrary(viewing)} className="inline-flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg text-sm">
                  <Plus size={14} /> Add to library
                </button>
              )}
              {viewing.deletable && (
                <button type="button" onClick={() => remove(viewing)} className="inline-flex items-center gap-2 text-red-600 border border-red-200 px-4 py-2 rounded-lg text-sm ml-auto">
                  <Trash2 size={14} /> Delete
                </button>
              )}
            </div>
          )
        }
      >
        {viewing && (
          <div className="space-y-5">
            <div className="rounded-xl overflow-hidden border bg-gray-100">
              {viewing.resourceType === 'image' ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={previewUrl(viewing.url)} alt="" className="w-full max-h-80 object-contain mx-auto" />
              ) : viewing.resourceType === 'video' ? (
                <video src={previewUrl(viewing.url)} controls className="w-full max-h-80" />
              ) : (
                <div className="p-12 text-center text-gray-500">
                  <FolderOpen size={40} className="mx-auto mb-2 opacity-40" />
                  {viewing.resourceType.toUpperCase()} file
                </div>
              )}
            </div>

            <div className="grid grid-cols-2 gap-3 text-sm">
              <div>
                <p className="text-xs text-gray-500">Source</p>
                <SourceBadge source={viewing.source} />
              </div>
              <div>
                <p className="text-xs text-gray-500">Folder</p>
                <p className="font-medium">{viewing.folder}</p>
              </div>
              <div className="col-span-2">
                <p className="text-xs text-gray-500">URL / path</p>
                <p className="font-mono text-xs break-all bg-gray-100 p-2 rounded">{viewing.url}</p>
              </div>
              {viewing.caption && (
                <div className="col-span-2">
                  <p className="text-xs text-gray-500">Caption</p>
                  <p>{viewing.caption}</p>
                </div>
              )}
              {viewing.showInGallery && (
                <div className="col-span-2 text-green-700 text-sm">✓ Visible on school gallery</div>
              )}
            </div>

            {viewing.usages.length > 0 && (
              <div>
                <p className="text-xs font-semibold uppercase text-gray-500 mb-2">Used on website</p>
                <ul className="space-y-2">
                  {viewing.usages.map((u, i) => (
                    <li key={i} className="flex items-center justify-between gap-2 text-sm bg-white border rounded-lg px-3 py-2">
                      <span>{u.label}</span>
                      {u.href && (
                        <Link href={u.href} className="text-[#4169E1] text-xs flex items-center gap-1 shrink-0">
                          <Link2 size={12} /> Manage
                        </Link>
                      )}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}
      </ViewDrawer>
    </div>
  );
}

function StatCard({ label, value }: { label: string; value: number }) {
  return (
    <div className="bg-white border rounded-xl p-3 text-center">
      <p className="text-xl font-bold">{value}</p>
      <p className="text-xs text-gray-500">{label}</p>
    </div>
  );
}

function SourceBadge({ source }: { source: SiteMediaItem['source'] }) {
  const colors: Record<SiteMediaItem['source'], string> = {
    upload: 'bg-blue-100 text-blue-800',
    static: 'bg-slate-100 text-slate-700',
    property: 'bg-green-100 text-green-800',
    school: 'bg-purple-100 text-purple-800',
    cms: 'bg-amber-100 text-amber-800',
    application: 'bg-cyan-100 text-cyan-800',
  };
  return <span className={`text-xs px-2 py-0.5 rounded-full ${colors[source]}`}>{SOURCE_LABELS[source]}</span>;
}

function Thumb({ item, className }: { item: SiteMediaItem; className?: string }) {
  if (item.resourceType === 'image') {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img src={item.url.startsWith('http') ? item.url : item.url} alt="" className={`object-cover rounded ${className}`} />
    );
  }
  return (
    <div className={`bg-gray-100 flex items-center justify-center rounded text-xs text-gray-500 ${className}`}>
      {item.resourceType}
    </div>
  );
}

function RowActions({
  item,
  onView,
  onEdit,
  onCopy,
  onRegister,
  onDelete,
}: {
  item: SiteMediaItem;
  onView: () => void;
  onEdit: () => void;
  onCopy: () => void;
  onRegister: () => void;
  onDelete: () => void;
}) {
  return (
    <div className="flex flex-wrap gap-1">
      <MiniBtn icon={<Eye size={12} />} onClick={onView} />
      {item.editable ? <MiniBtn icon={<Pencil size={12} />} onClick={onEdit} /> : <MiniBtn icon={<Plus size={12} />} onClick={onRegister} title="Add to library" />}
      <MiniBtn icon={<Copy size={12} />} onClick={onCopy} />
      {item.deletable && <MiniBtn icon={<Trash2 size={12} />} onClick={onDelete} danger />}
    </div>
  );
}

function MiniBtn({ icon, onClick, danger, title }: { icon: React.ReactNode; onClick: () => void; danger?: boolean; title?: string }) {
  return (
    <button
      type="button"
      title={title}
      onClick={onClick}
      className={`p-1.5 rounded-lg border ${danger ? 'text-red-600 hover:bg-red-50' : 'hover:bg-slate-100'}`}
    >
      {icon}
    </button>
  );
}

function MediaCard({
  item,
  onView,
  onEdit,
  onCopy,
  onRegister,
  onDelete,
}: {
  item: SiteMediaItem;
  onView: () => void;
  onEdit: () => void;
  onCopy: () => void;
  onRegister: () => void;
  onDelete: () => void;
}) {
  return (
    <div className="bg-white rounded-xl border overflow-hidden hover:shadow-md transition group">
      <button type="button" onClick={onView} className="aspect-video bg-gray-100 w-full relative block">
        <Thumb item={item} className="w-full h-full" />
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition flex items-center justify-center opacity-0 group-hover:opacity-100">
          <Eye className="text-white" size={28} />
        </div>
        {item.showInGallery && (
          <span className="absolute top-2 left-2 text-[10px] bg-green-600 text-white px-1.5 py-0.5 rounded">Gallery</span>
        )}
      </button>
      <div className="p-3 space-y-2">
        <div className="flex items-start justify-between gap-2">
          <p className="text-sm font-medium truncate flex-1">{item.name}</p>
          <SourceBadge source={item.source} />
        </div>
        <p className="text-xs text-gray-400 truncate">{item.folder} · {item.usages[0]?.label || item.sourceLabel}</p>
        <div className="flex flex-wrap gap-1 pt-1">
          <MiniBtn icon={<Eye size={12} />} onClick={onView} />
          {item.editable ? <MiniBtn icon={<Pencil size={12} />} onClick={onEdit} /> : <MiniBtn icon={<Plus size={12} />} onClick={onRegister} title="Add to library" />}
          <MiniBtn icon={<Copy size={12} />} onClick={onCopy} />
          {item.deletable && <MiniBtn icon={<Trash2 size={12} />} onClick={onDelete} danger />}
        </div>
      </div>
    </div>
  );
}
