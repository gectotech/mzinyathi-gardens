'use client';

import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';

type User = {
  id: string;
  email: string;
  name: string;
  role: string;
  isActive: boolean;
};

export default function AdminUsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [form, setForm] = useState({ email: '', password: '', name: '', role: 'admin' });

  const load = () => {
    fetch('/api/admin/users')
      .then((r) => r.json())
      .then((d) => setUsers(d.users || []));
  };

  useEffect(load, []);

  const createUser = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await fetch('/api/admin/settings', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    });
    if (res.ok) {
      toast.success('User created');
      setForm({ email: '', password: '', name: '', role: 'admin' });
      load();
    } else {
      const d = await res.json();
      toast.error(d.error || 'Failed');
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

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">User Management</h1>
      <form onSubmit={createUser} className="bg-white rounded-lg shadow p-6 grid md:grid-cols-2 gap-4 max-w-3xl">
        <input placeholder="Name" required className="border rounded px-3 py-2" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
        <input placeholder="Email" type="email" required className="border rounded px-3 py-2" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
        <input placeholder="Password" type="password" required className="border rounded px-3 py-2" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} />
        <select className="border rounded px-3 py-2" value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })}>
          <option value="admin">Admin</option>
          <option value="super_admin">Super Admin</option>
        </select>
        <button type="submit" className="bg-[#4169E1] text-white px-4 py-2 rounded md:col-span-2">Create User</button>
      </form>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="min-w-full text-sm">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-3 text-left">Name</th>
              <th className="px-4 py-3 text-left">Email</th>
              <th className="px-4 py-3 text-left">Role</th>
              <th className="px-4 py-3 text-left">Status</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id} className="border-t">
                <td className="px-4 py-3">{user.name}</td>
                <td className="px-4 py-3">{user.email}</td>
                <td className="px-4 py-3"><span className={`text-xs px-2 py-1 rounded ${user.role === 'super_admin' ? 'bg-red-100 text-red-800' : 'bg-blue-100 text-blue-800'}`}>{user.role}</span></td>
                <td className="px-4 py-3">
                  <button onClick={() => toggleActive(user)} className={`text-xs px-2 py-1 rounded ${user.isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100'}`}>
                    {user.isActive ? 'Active' : 'Disabled'}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
