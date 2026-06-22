'use client';

import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { Pencil, Trash2 } from 'lucide-react';
import { USER_ROLES, ROLE_LABELS, ROLE_DESCRIPTIONS, type UserRole } from '@/lib/roles';

type User = {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  isActive: boolean;
  createdAt?: string;
};

const emptyForm = { email: '', password: '', name: '', role: 'admin' as UserRole };

export default function AdminUsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [form, setForm] = useState(emptyForm);
  const [editing, setEditing] = useState<User | null>(null);
  const [editForm, setEditForm] = useState({ name: '', role: 'admin' as UserRole, password: '', isActive: true });

  const load = () => {
    fetch('/api/admin/users')
      .then((r) => r.json())
      .then((d) => setUsers(d.users || []));
  };

  useEffect(load, []);

  const createUser = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await fetch('/api/admin/users', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    });
    if (res.ok) {
      toast.success('User created');
      setForm(emptyForm);
      load();
    } else {
      const d = await res.json();
      toast.error(d.error || 'Failed to create user');
    }
  };

  const openEdit = (user: User) => {
    setEditing(user);
    setEditForm({ name: user.name, role: user.role, password: '', isActive: user.isActive });
  };

  const saveEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editing) return;

    const payload: Record<string, unknown> = {
      id: editing.id,
      name: editForm.name,
      role: editForm.role,
      isActive: editForm.isActive,
    };
    if (editForm.password) payload.password = editForm.password;

    const res = await fetch('/api/admin/users', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    if (res.ok) {
      toast.success('User updated');
      setEditing(null);
      load();
    } else {
      const d = await res.json();
      toast.error(d.error || 'Failed to update');
    }
  };

  const deleteUser = async (user: User) => {
    if (!confirm(`Delete ${user.name}? This cannot be undone.`)) return;
    const res = await fetch(`/api/admin/users?id=${user.id}`, { method: 'DELETE' });
    if (res.ok) {
      toast.success('User deleted');
      load();
    } else {
      const d = await res.json();
      toast.error(d.error || 'Failed to delete');
    }
  };

  const toggleActive = async (user: User) => {
    await fetch('/api/admin/users', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: user.id, name: user.name, role: user.role, isActive: !user.isActive }),
    });
    load();
  };

  const roleBadgeClass = (role: UserRole) => {
    if (role === 'super_admin') return 'bg-red-100 text-red-800';
    if (role === 'admin') return 'bg-blue-100 text-blue-800';
    if (role === 'property_admin') return 'bg-green-100 text-green-800';
    if (role === 'school_admin') return 'bg-purple-100 text-purple-800';
    if (role === 'content_editor') return 'bg-amber-100 text-amber-800';
    return 'bg-gray-100 text-gray-700';
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">User Management</h1>
        <p className="text-gray-600 text-sm mt-1">Create staff accounts with role-based access to admin areas.</p>
      </div>

      <form onSubmit={createUser} className="bg-white rounded-lg shadow p-6 grid md:grid-cols-2 gap-4 max-w-4xl">
        <h2 className="md:col-span-2 font-semibold">Create New User</h2>
        <input
          placeholder="Full name *"
          required
          className="border rounded px-3 py-2"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
        />
        <input
          placeholder="Email *"
          type="email"
          required
          className="border rounded px-3 py-2"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
        />
        <input
          placeholder="Password *"
          type="password"
          required
          minLength={8}
          className="border rounded px-3 py-2"
          value={form.password}
          onChange={(e) => setForm({ ...form, password: e.target.value })}
        />
        <select
          className="border rounded px-3 py-2"
          value={form.role}
          onChange={(e) => setForm({ ...form, role: e.target.value as UserRole })}
        >
          {USER_ROLES.map((role) => (
            <option key={role} value={role}>
              {ROLE_LABELS[role]}
            </option>
          ))}
        </select>
        <p className="md:col-span-2 text-xs text-gray-500">{ROLE_DESCRIPTIONS[form.role]}</p>
        <button type="submit" className="bg-[#4169E1] text-white px-4 py-2 rounded md:col-span-2 w-fit">
          Create User
        </button>
      </form>

      {editing && (
        <form onSubmit={saveEdit} className="bg-white rounded-lg shadow p-6 grid md:grid-cols-2 gap-4 max-w-4xl border-l-4 border-[#4169E1]">
          <h2 className="md:col-span-2 font-semibold">Edit {editing.email}</h2>
          <input
            required
            className="border rounded px-3 py-2"
            value={editForm.name}
            onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
          />
          <select
            className="border rounded px-3 py-2"
            value={editForm.role}
            onChange={(e) => setEditForm({ ...editForm, role: e.target.value as UserRole })}
          >
            {USER_ROLES.map((role) => (
              <option key={role} value={role}>
                {ROLE_LABELS[role]}
              </option>
            ))}
          </select>
          <input
            placeholder="New password (leave blank to keep)"
            type="password"
            minLength={8}
            className="border rounded px-3 py-2 md:col-span-2"
            value={editForm.password}
            onChange={(e) => setEditForm({ ...editForm, password: e.target.value })}
          />
          <label className="flex items-center gap-2 text-sm md:col-span-2">
            <input
              type="checkbox"
              checked={editForm.isActive}
              onChange={(e) => setEditForm({ ...editForm, isActive: e.target.checked })}
            />
            Account active
          </label>
          <div className="md:col-span-2 flex gap-2">
            <button type="submit" className="bg-green-700 text-white px-4 py-2 rounded text-sm">
              Save Changes
            </button>
            <button type="button" onClick={() => setEditing(null)} className="border px-4 py-2 rounded text-sm">
              Cancel
            </button>
          </div>
        </form>
      )}

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="min-w-full text-sm">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-3 text-left">Name</th>
              <th className="px-4 py-3 text-left">Email</th>
              <th className="px-4 py-3 text-left">Role</th>
              <th className="px-4 py-3 text-left">Status</th>
              <th className="px-4 py-3 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id} className="border-t">
                <td className="px-4 py-3 font-medium">{user.name}</td>
                <td className="px-4 py-3">{user.email}</td>
                <td className="px-4 py-3">
                  <span className={`text-xs px-2 py-1 rounded ${roleBadgeClass(user.role)}`}>
                    {ROLE_LABELS[user.role] || user.role}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <button
                    onClick={() => toggleActive(user)}
                    className={`text-xs px-2 py-1 rounded ${user.isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100'}`}
                  >
                    {user.isActive ? 'Active' : 'Disabled'}
                  </button>
                </td>
                <td className="px-4 py-3 space-x-2">
                  <button onClick={() => openEdit(user)} className="text-[#4169E1] hover:underline inline-flex items-center gap-1">
                    <Pencil size={12} /> Edit
                  </button>
                  <button onClick={() => deleteUser(user)} className="text-red-600 hover:underline inline-flex items-center gap-1">
                    <Trash2 size={12} /> Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="bg-blue-50 rounded-lg p-4 max-w-4xl">
        <h3 className="font-semibold text-sm mb-2">Role guide</h3>
        <ul className="text-xs text-gray-700 space-y-1">
          {USER_ROLES.map((role) => (
            <li key={role}>
              <strong>{ROLE_LABELS[role]}:</strong> {ROLE_DESCRIPTIONS[role]}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
