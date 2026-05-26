'use client';

import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';

type Contact = {
  id: string;
  name: string;
  email: string;
  phone: string;
  message: string;
  propertyInterest: string | null;
  status: string;
  createdAt: string;
};

export default function AdminContactsPage() {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [selected, setSelected] = useState<Contact | null>(null);

  const load = () => {
    fetch('/api/admin/contacts')
      .then((r) => r.json())
      .then((d) => setContacts(d.contacts || []));
  };

  useEffect(load, []);

  const updateStatus = async (id: string, status: string) => {
    const res = await fetch('/api/admin/contacts', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, status }),
    });
    if (res.ok) {
      toast.success('Status updated');
      load();
    }
  };

  const remove = async (id: string) => {
    if (!confirm('Delete this message?')) return;
    await fetch(`/api/admin/contacts?id=${id}`, { method: 'DELETE' });
    toast.success('Deleted');
    setSelected(null);
    load();
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Contact Messages</h1>
      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white rounded-lg shadow overflow-hidden">
          <table className="min-w-full text-sm">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left">Name</th>
                <th className="px-4 py-3 text-left">Email</th>
                <th className="px-4 py-3 text-left">Status</th>
                <th className="px-4 py-3 text-left">Date</th>
              </tr>
            </thead>
            <tbody>
              {contacts.map((c) => (
                <tr
                  key={c.id}
                  className={`border-t cursor-pointer hover:bg-gray-50 ${selected?.id === c.id ? 'bg-blue-50' : ''}`}
                  onClick={() => setSelected(c)}
                >
                  <td className="px-4 py-3">{c.name}</td>
                  <td className="px-4 py-3">{c.email}</td>
                  <td className="px-4 py-3">
                    <select
                      value={c.status}
                      onClick={(e) => e.stopPropagation()}
                      onChange={(e) => updateStatus(c.id, e.target.value)}
                      className="border rounded p-1"
                    >
                      <option value="new">New</option>
                      <option value="read">Read</option>
                      <option value="replied">Replied</option>
                      <option value="archived">Archived</option>
                    </select>
                  </td>
                  <td className="px-4 py-3">{new Date(c.createdAt).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="bg-white rounded-lg shadow p-5">
          {selected ? (
            <>
              <h2 className="font-bold text-lg mb-2">{selected.name}</h2>
              <p className="text-sm text-gray-600">{selected.email} · {selected.phone}</p>
              {selected.propertyInterest && (
                <p className="text-sm mt-2"><strong>Property:</strong> {selected.propertyInterest}</p>
              )}
              <p className="mt-4 text-gray-800 whitespace-pre-wrap">{selected.message}</p>
              <button onClick={() => remove(selected.id)} className="mt-4 text-red-600 text-sm hover:underline">
                Delete message
              </button>
            </>
          ) : (
            <p className="text-gray-500">Select a message to view details</p>
          )}
        </div>
      </div>
    </div>
  );
}
