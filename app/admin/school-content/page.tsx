'use client';

import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { Eye, ImageIcon } from 'lucide-react';
import MediaPicker from '@/components/admin/MediaPicker';
import ViewDrawer from '@/components/admin/ViewDrawer';
import StatusBadge from '@/components/admin/StatusBadge';
import { DetailMessage } from '@/components/admin/DetailSection';

type SchoolPost = {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  imageUrl: string;
  category: 'news' | 'activity' | 'event';
  status: 'draft' | 'published';
  sortOrder: number;
};

const emptyForm = {
  title: '',
  excerpt: '',
  content: '',
  imageUrl: '',
  category: 'news' as 'news' | 'activity' | 'event',
  status: 'draft' as 'draft' | 'published',
  sortOrder: 0,
};

export default function AdminSchoolContentPage() {
  const [posts, setPosts] = useState<SchoolPost[]>([]);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [pickerOpen, setPickerOpen] = useState(false);
  const [viewing, setViewing] = useState<SchoolPost | null>(null);

  const load = () => {
    fetch('/api/admin/school-posts')
      .then((r) => r.json())
      .then((d) => setPosts(d.posts || []));
  };

  useEffect(load, []);

  const save = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await fetch('/api/admin/school-posts', {
      method: editingId ? 'PATCH' : 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(editingId ? { id: editingId, ...form } : form),
    });
    if (res.ok) {
      toast.success(editingId ? 'Updated' : 'Created');
      setForm(emptyForm);
      setEditingId(null);
      load();
    } else {
      toast.error('Save failed');
    }
  };

  const edit = (post: SchoolPost) => {
    setEditingId(post.id);
    setForm({
      title: post.title,
      excerpt: post.excerpt,
      content: post.content,
      imageUrl: post.imageUrl,
      category: post.category,
      status: post.status,
      sortOrder: post.sortOrder,
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const remove = async (id: string) => {
    if (!confirm('Delete this post?')) return;
    await fetch(`/api/admin/school-posts?id=${id}`, { method: 'DELETE' });
    toast.success('Deleted');
    load();
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">School News & Activities</h1>
        <p className="text-gray-600 text-sm">Manage news, activities, and events shown on the school website.</p>
      </div>

      <form onSubmit={save} className="bg-white rounded-xl shadow-sm border p-6 grid md:grid-cols-2 gap-4">
        <div className="md:col-span-2">
          <h2 className="font-semibold mb-1">{editingId ? 'Edit post' : 'Create post'}</h2>
          <p className="text-xs text-gray-500">Use the media picker to choose a gallery image.</p>
        </div>
        <input
          className="border rounded-lg px-3 py-2 md:col-span-2"
          placeholder="Title *"
          required
          value={form.title}
          onChange={(e) => setForm({ ...form, title: e.target.value })}
        />
        <textarea
          className="border rounded-lg px-3 py-2 md:col-span-2"
          placeholder="Short excerpt *"
          required
          rows={2}
          value={form.excerpt}
          onChange={(e) => setForm({ ...form, excerpt: e.target.value })}
        />
        <textarea
          className="border rounded-lg px-3 py-2 md:col-span-2"
          placeholder="Full content"
          rows={5}
          value={form.content}
          onChange={(e) => setForm({ ...form, content: e.target.value })}
        />
        <div className="md:col-span-2 flex gap-3 items-start">
          {form.imageUrl && (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={form.imageUrl} alt="" className="w-24 h-20 object-cover rounded-lg border" />
          )}
          <button
            type="button"
            onClick={() => setPickerOpen(true)}
            className="inline-flex items-center gap-2 border border-dashed rounded-lg px-4 py-3 text-sm text-gray-600 hover:border-[#4169E1] hover:text-[#4169E1]"
          >
            <ImageIcon size={16} /> {form.imageUrl ? 'Change image' : 'Pick image from library *'}
          </button>
        </div>
        <select
          className="border rounded-lg px-3 py-2"
          value={form.category}
          onChange={(e) => setForm({ ...form, category: e.target.value as SchoolPost['category'] })}
        >
          <option value="news">News</option>
          <option value="activity">Activity</option>
          <option value="event">Event</option>
        </select>
        <select
          className="border rounded-lg px-3 py-2"
          value={form.status}
          onChange={(e) => setForm({ ...form, status: e.target.value as SchoolPost['status'] })}
        >
          <option value="draft">Draft</option>
          <option value="published">Published</option>
        </select>
        <input
          type="number"
          className="border rounded-lg px-3 py-2"
          placeholder="Sort order"
          value={form.sortOrder}
          onChange={(e) => setForm({ ...form, sortOrder: Number(e.target.value) })}
        />
        <div className="flex gap-2 md:col-span-2">
          <button type="submit" className="bg-[#4169E1] text-white px-5 py-2 rounded-lg" disabled={!form.imageUrl}>
            {editingId ? 'Update' : 'Publish'}
          </button>
          {editingId && (
            <button
              type="button"
              onClick={() => {
                setEditingId(null);
                setForm(emptyForm);
              }}
              className="border px-5 py-2 rounded-lg"
            >
              Cancel
            </button>
          )}
        </div>
      </form>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {posts.map((post) => (
          <div key={post.id} className="bg-white rounded-xl shadow-sm border overflow-hidden hover:shadow-md transition">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={post.imageUrl} alt="" className="w-full h-36 object-cover" />
            <div className="p-4">
              <div className="flex items-start justify-between gap-2 mb-2">
                <h3 className="font-semibold line-clamp-2">{post.title}</h3>
                <StatusBadge status={post.status} />
              </div>
              <p className="text-xs text-gray-500 capitalize mb-3">{post.category}</p>
              <p className="text-sm text-gray-600 line-clamp-2 mb-4">{post.excerpt}</p>
              <div className="flex gap-2">
                <button
                  onClick={() => setViewing(post)}
                  className="inline-flex items-center gap-1 text-[#4169E1] text-xs font-medium px-2 py-1 rounded-lg hover:bg-blue-50"
                >
                  <Eye size={14} /> View
                </button>
                <button onClick={() => edit(post)} className="text-xs text-gray-600 hover:underline">
                  Edit
                </button>
                <button onClick={() => remove(post.id)} className="text-xs text-red-600 hover:underline">
                  Delete
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      <MediaPicker open={pickerOpen} onClose={() => setPickerOpen(false)} onSelect={(url) => setForm({ ...form, imageUrl: url })} />

      <ViewDrawer
        open={!!viewing}
        onClose={() => setViewing(null)}
        title={viewing?.title || ''}
        subtitle={viewing?.category}
        badge={viewing ? <StatusBadge status={viewing.status} /> : undefined}
        width="lg"
      >
        {viewing && (
          <>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={viewing.imageUrl} alt="" className="w-full rounded-xl object-cover max-h-48" />
            <p className="text-gray-700">{viewing.excerpt}</p>
            {viewing.content && <DetailMessage>{viewing.content}</DetailMessage>}
          </>
        )}
      </ViewDrawer>
    </div>
  );
}
