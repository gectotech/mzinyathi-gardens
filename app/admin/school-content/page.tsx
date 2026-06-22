'use client';

import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';

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

      <form onSubmit={save} className="bg-white rounded-lg shadow p-6 grid md:grid-cols-2 gap-4">
        <div className="md:col-span-2">
          <h2 className="font-semibold mb-3">{editingId ? 'Edit post' : 'Create post'}</h2>
        </div>
        <input
          className="border rounded px-3 py-2 md:col-span-2"
          placeholder="Title *"
          required
          value={form.title}
          onChange={(e) => setForm({ ...form, title: e.target.value })}
        />
        <textarea
          className="border rounded px-3 py-2 md:col-span-2"
          placeholder="Short excerpt *"
          required
          rows={2}
          value={form.excerpt}
          onChange={(e) => setForm({ ...form, excerpt: e.target.value })}
        />
        <textarea
          className="border rounded px-3 py-2 md:col-span-2"
          placeholder="Full content (optional)"
          rows={4}
          value={form.content}
          onChange={(e) => setForm({ ...form, content: e.target.value })}
        />
        <input
          className="border rounded px-3 py-2 md:col-span-2"
          placeholder="Image URL * (upload in Media Library, copy URL)"
          required
          value={form.imageUrl}
          onChange={(e) => setForm({ ...form, imageUrl: e.target.value })}
        />
        <select
          className="border rounded px-3 py-2"
          value={form.category}
          onChange={(e) => setForm({ ...form, category: e.target.value as SchoolPost['category'] })}
        >
          <option value="news">News</option>
          <option value="activity">Activity</option>
          <option value="event">Event</option>
        </select>
        <select
          className="border rounded px-3 py-2"
          value={form.status}
          onChange={(e) => setForm({ ...form, status: e.target.value as SchoolPost['status'] })}
        >
          <option value="draft">Draft</option>
          <option value="published">Published</option>
        </select>
        <input
          type="number"
          className="border rounded px-3 py-2"
          placeholder="Sort order"
          value={form.sortOrder}
          onChange={(e) => setForm({ ...form, sortOrder: Number(e.target.value) })}
        />
        <div className="flex gap-2 md:col-span-2">
          <button type="submit" className="bg-[#4169E1] text-white px-5 py-2 rounded-md">
            {editingId ? 'Update' : 'Publish'}
          </button>
          {editingId && (
            <button
              type="button"
              onClick={() => {
                setEditingId(null);
                setForm(emptyForm);
              }}
              className="border px-5 py-2 rounded-md"
            >
              Cancel
            </button>
          )}
        </div>
      </form>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="min-w-full text-sm">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-3 text-left">Title</th>
              <th className="px-4 py-3 text-left">Category</th>
              <th className="px-4 py-3 text-left">Status</th>
              <th className="px-4 py-3 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {posts.map((post) => (
              <tr key={post.id} className="border-t">
                <td className="px-4 py-3">{post.title}</td>
                <td className="px-4 py-3 capitalize">{post.category}</td>
                <td className="px-4 py-3">{post.status}</td>
                <td className="px-4 py-3 space-x-3">
                  <button onClick={() => edit(post)} className="text-[#4169E1] hover:underline">Edit</button>
                  <button onClick={() => remove(post.id)} className="text-red-600 hover:underline">Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
