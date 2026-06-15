'use client';

import { useEffect, useState } from 'react';
import { Mail, MessageCircle, Phone } from 'lucide-react';
import toast from 'react-hot-toast';
import {
  buildCallLink,
  buildEmailReplyLink,
  buildWhatsAppReplyLink,
  contactPreferenceLabels,
  type ContactPreference,
} from '@/lib/contact-reply';

type Contact = {
  id: string;
  name: string;
  email: string;
  phone: string;
  message: string;
  propertyInterest: string | null;
  preferredContact: ContactPreference;
  status: string;
  createdAt: string;
};

export default function AdminContactsPage() {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [selected, setSelected] = useState<Contact | null>(null);
  const [replyEmail, setReplyEmail] = useState('info@mzinyathigardens.co.zw');
  const [siteName, setSiteName] = useState('Mzinyathi Gardens');

  const load = () => {
    fetch('/api/admin/contacts')
      .then((r) => r.json())
      .then((d) => setContacts(d.contacts || []));
  };

  useEffect(() => {
    load();
    fetch('/api/admin/settings')
      .then((r) => r.json())
      .then((d) => {
        const settings = d.settings || {};
        if (typeof settings.reply_email === 'string' && settings.reply_email) {
          setReplyEmail(settings.reply_email);
        } else if (typeof settings.contact_email === 'string' && settings.contact_email) {
          setReplyEmail(settings.contact_email);
        }
        if (typeof settings.site_name === 'string' && settings.site_name) {
          setSiteName(settings.site_name);
        }
      })
      .catch(() => {});
  }, []);

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

  const markReplied = async (contact: Contact) => {
    if (contact.status !== 'replied') {
      await updateStatus(contact.id, 'replied');
    }
  };

  const remove = async (id: string) => {
    if (!confirm('Delete this message?')) return;
    await fetch(`/api/admin/contacts?id=${id}`, { method: 'DELETE' });
    toast.success('Deleted');
    setSelected(null);
    load();
  };

  const replyLinks = selected
    ? {
        email: buildEmailReplyLink(selected, siteName),
        whatsapp: buildWhatsAppReplyLink(selected),
        call: buildCallLink(selected.phone),
      }
    : null;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Contact Messages</h1>
        <p className="text-sm text-gray-600 mt-1">
          Reply emails open in your mail app (send from <strong>{replyEmail}</strong>). Update this in Settings.
        </p>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white rounded-lg shadow overflow-hidden">
          <table className="min-w-full text-sm">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left">Name</th>
                <th className="px-4 py-3 text-left">Email</th>
                <th className="px-4 py-3 text-left">Preferred</th>
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
                    <span className="text-xs bg-gray-100 px-2 py-1 rounded">
                      {contactPreferenceLabels[c.preferredContact || 'email']}
                    </span>
                  </td>
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
          {selected && replyLinks ? (
            <>
              <h2 className="font-bold text-lg mb-2">{selected.name}</h2>
              <p className="text-sm text-gray-600">{selected.email} · {selected.phone}</p>
              <p className="text-xs mt-2 inline-block bg-blue-50 text-blue-800 px-2 py-1 rounded">
                Prefers: {contactPreferenceLabels[selected.preferredContact || 'email']}
              </p>
              {selected.propertyInterest && (
                <p className="text-sm mt-2"><strong>Property:</strong> {selected.propertyInterest}</p>
              )}
              <p className="mt-4 text-gray-800 whitespace-pre-wrap">{selected.message}</p>

              <div className="mt-5 space-y-2">
                <p className="text-sm font-semibold text-gray-700">Reply to customer</p>

                {(selected.preferredContact === 'email' || !selected.preferredContact) && (
                  <a
                    href={replyLinks.email}
                    onClick={() => markReplied(selected)}
                    className="flex items-center justify-center gap-2 w-full bg-blue-600 text-white py-2.5 rounded-md hover:bg-blue-700 text-sm font-medium"
                  >
                    <Mail size={16} />
                    Reply via Email
                  </a>
                )}

                {selected.preferredContact === 'whatsapp' && (
                  <a
                    href={replyLinks.whatsapp}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => markReplied(selected)}
                    className="flex items-center justify-center gap-2 w-full bg-green-600 text-white py-2.5 rounded-md hover:bg-green-700 text-sm font-medium"
                  >
                    <MessageCircle size={16} />
                    Reply via WhatsApp
                  </a>
                )}

                {selected.preferredContact === 'call' && (
                  <a
                    href={replyLinks.call}
                    onClick={() => markReplied(selected)}
                    className="flex items-center justify-center gap-2 w-full bg-gray-800 text-white py-2.5 rounded-md hover:bg-gray-900 text-sm font-medium"
                  >
                    <Phone size={16} />
                    Call Customer
                  </a>
                )}

                <div className="grid grid-cols-3 gap-2 pt-1">
                  <a
                    href={replyLinks.email}
                    onClick={() => markReplied(selected)}
                    className={`flex flex-col items-center gap-1 border rounded-md py-2 text-xs hover:bg-gray-50 ${
                      selected.preferredContact === 'email' ? 'border-blue-300 bg-blue-50' : ''
                    }`}
                  >
                    <Mail size={14} />
                    Email
                  </a>
                  <a
                    href={replyLinks.whatsapp}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => markReplied(selected)}
                    className={`flex flex-col items-center gap-1 border rounded-md py-2 text-xs hover:bg-gray-50 ${
                      selected.preferredContact === 'whatsapp' ? 'border-green-300 bg-green-50' : ''
                    }`}
                  >
                    <MessageCircle size={14} />
                    WhatsApp
                  </a>
                  <a
                    href={replyLinks.call}
                    onClick={() => markReplied(selected)}
                    className={`flex flex-col items-center gap-1 border rounded-md py-2 text-xs hover:bg-gray-50 ${
                      selected.preferredContact === 'call' ? 'border-gray-400 bg-gray-50' : ''
                    }`}
                  >
                    <Phone size={14} />
                    Call
                  </a>
                </div>
              </div>

              <button onClick={() => remove(selected.id)} className="mt-4 text-red-600 text-sm hover:underline">
                Delete message
              </button>
            </>
          ) : (
            <p className="text-gray-500">Select a message to view details and reply</p>
          )}
        </div>
      </div>
    </div>
  );
}
