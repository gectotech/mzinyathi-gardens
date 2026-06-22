'use client';

import { useEffect, useState } from 'react';
import { Mail, MessageCircle, Phone, User } from 'lucide-react';
import toast from 'react-hot-toast';
import StatusBadge from '@/components/admin/StatusBadge';
import { DetailMessage } from '@/components/admin/DetailSection';
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
      if (selected?.id === id) setSelected({ ...selected, status });
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
          Select a message to view details and reply. Emails send from <strong>{replyEmail}</strong>.
        </p>
      </div>

      <div className="grid lg:grid-cols-5 gap-6">
        <div className="lg:col-span-3 bg-white rounded-xl shadow-sm border overflow-hidden">
          <table className="min-w-full text-sm">
            <thead className="bg-slate-50 border-b">
              <tr>
                <th className="px-4 py-3 text-left font-semibold text-gray-600">Name</th>
                <th className="px-4 py-3 text-left font-semibold text-gray-600">Email</th>
                <th className="px-4 py-3 text-left font-semibold text-gray-600">Preferred</th>
                <th className="px-4 py-3 text-left font-semibold text-gray-600">Status</th>
                <th className="px-4 py-3 text-left font-semibold text-gray-600">Date</th>
              </tr>
            </thead>
            <tbody>
              {contacts.map((c) => (
                <tr
                  key={c.id}
                  className={`border-t cursor-pointer transition ${selected?.id === c.id ? 'bg-blue-50' : 'hover:bg-slate-50/80'}`}
                  onClick={() => setSelected(c)}
                >
                  <td className="px-4 py-3 font-medium">{c.name}</td>
                  <td className="px-4 py-3 text-gray-600">{c.email}</td>
                  <td className="px-4 py-3">
                    <span className="text-xs bg-gray-100 px-2 py-1 rounded-full">
                      {contactPreferenceLabels[c.preferredContact || 'email']}
                    </span>
                  </td>
                  <td className="px-4 py-3" onClick={(e) => e.stopPropagation()}>
                    <select
                      value={c.status}
                      onChange={(e) => updateStatus(c.id, e.target.value)}
                      className="border rounded-lg px-2 py-1 text-xs bg-white"
                    >
                      <option value="new">New</option>
                      <option value="read">Read</option>
                      <option value="replied">Replied</option>
                      <option value="archived">Archived</option>
                    </select>
                  </td>
                  <td className="px-4 py-3 text-gray-500">{new Date(c.createdAt).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="lg:col-span-2">
          <div className="bg-white rounded-xl shadow-sm border overflow-hidden sticky top-6">
            {selected && replyLinks ? (
              <>
                <div className="bg-gradient-to-r from-[#1a1a2e] to-[#2d2d4a] text-white px-5 py-4">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center shrink-0">
                      <User size={20} />
                    </div>
                    <div className="min-w-0">
                      <h2 className="font-bold text-lg truncate">{selected.name}</h2>
                      <p className="text-sm text-white/70 truncate">{selected.email}</p>
                      <div className="mt-2">
                        <StatusBadge status={selected.status} />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="p-5 space-y-4">
                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div>
                      <p className="text-xs text-gray-500">Phone</p>
                      <p className="font-medium">{selected.phone}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Preferred contact</p>
                      <p className="font-medium">{contactPreferenceLabels[selected.preferredContact || 'email']}</p>
                    </div>
                    {selected.propertyInterest && (
                      <div className="col-span-2">
                        <p className="text-xs text-gray-500">Property interest</p>
                        <p className="font-medium">{selected.propertyInterest}</p>
                      </div>
                    )}
                  </div>

                  <div>
                    <p className="text-xs font-semibold uppercase text-gray-500 mb-2">Message</p>
                    <DetailMessage>{selected.message}</DetailMessage>
                  </div>

                  <div className="space-y-2 pt-2">
                    <p className="text-sm font-semibold text-gray-700">Reply</p>
                    <a
                      href={replyLinks.email}
                      onClick={() => markReplied(selected)}
                      className="flex items-center justify-center gap-2 w-full bg-[#4169E1] text-white py-2.5 rounded-lg text-sm font-medium hover:bg-blue-700"
                    >
                      <Mail size={16} /> Email
                    </a>
                    <div className="grid grid-cols-2 gap-2">
                      <a
                        href={replyLinks.whatsapp}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={() => markReplied(selected)}
                        className="flex items-center justify-center gap-1 border rounded-lg py-2 text-xs hover:bg-green-50"
                      >
                        <MessageCircle size={14} /> WhatsApp
                      </a>
                      <a
                        href={replyLinks.call}
                        onClick={() => markReplied(selected)}
                        className="flex items-center justify-center gap-1 border rounded-lg py-2 text-xs hover:bg-gray-50"
                      >
                        <Phone size={14} /> Call
                      </a>
                    </div>
                  </div>

                  <button onClick={() => remove(selected.id)} className="text-red-600 text-sm hover:underline">
                    Delete message
                  </button>
                </div>
              </>
            ) : (
              <div className="p-8 text-center text-gray-500">
                <Mail className="mx-auto mb-3 text-gray-300" size={40} />
                <p>Select a message to view details and reply</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
