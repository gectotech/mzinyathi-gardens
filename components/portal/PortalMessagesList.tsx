'use client';

import { useEffect, useState } from 'react';
import { MessageSquare, Send } from 'lucide-react';
import { PortalSection, PortalEmptyState } from './PortalSection';
import type { PortalRole } from '@/lib/portal-auth';

type Message = {
  id: string;
  subject: string;
  body: string;
  senderName: string;
  senderAccountId: string | null;
  isRead: boolean;
  createdAt: string;
  studentId?: string;
  studentName?: string;
};

type Recipient = {
  accountId: string;
  name: string;
  role: PortalRole;
  detail?: string;
};

function formatWhen(iso: string) {
  return new Date(iso).toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

type PortalMessagesListProps = {
  title: string;
  description: string;
};

export default function PortalMessagesList({ title, description }: PortalMessagesListProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [recipients, setRecipients] = useState<Recipient[]>([]);
  const [selected, setSelected] = useState<Message | null>(null);
  const [loading, setLoading] = useState(true);
  const [composing, setComposing] = useState(false);
  const [sending, setSending] = useState(false);
  const [composeError, setComposeError] = useState('');
  const [form, setForm] = useState({
    recipientAccountId: '',
    subject: '',
    body: '',
    studentId: '',
  });

  const load = () => {
    setLoading(true);
    fetch('/api/portal/messages')
      .then((r) => r.json())
      .then((d) => {
        setMessages(d.messages || []);
        setRecipients(d.recipients || []);
      })
      .catch(() => {
        setMessages([]);
        setRecipients([]);
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    load();
  }, []);

  const openMessage = async (message: Message) => {
    setComposing(false);
    setSelected(message);
    if (!message.isRead) {
      await fetch('/api/portal/messages', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messageId: message.id, action: 'mark_read' }),
      });
      setMessages((prev) =>
        prev.map((m) => (m.id === message.id ? { ...m, isRead: true } : m))
      );
    }
  };

  const startReply = (message: Message) => {
    if (!message.senderAccountId) return;
    setSelected(message);
    setComposing(true);
    setComposeError('');
    setForm({
      recipientAccountId: message.senderAccountId,
      subject: message.subject.startsWith('Re:') ? message.subject : `Re: ${message.subject}`,
      body: '',
      studentId: message.studentId || '',
    });
  };

  const startCompose = () => {
    setSelected(null);
    setComposing(true);
    setComposeError('');
    setForm({ recipientAccountId: '', subject: '', body: '', studentId: '' });
  };

  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    setSending(true);
    setComposeError('');
    try {
      const res = await fetch('/api/portal/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          recipientAccountId: form.recipientAccountId,
          subject: form.subject,
          body: form.body,
          studentId: form.studentId || undefined,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to send');
      setComposing(false);
      setForm({ recipientAccountId: '', subject: '', body: '', studentId: '' });
      load();
    } catch (err) {
      setComposeError(err instanceof Error ? err.message : 'Failed to send');
    } finally {
      setSending(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center py-16">
        <div className="h-9 w-9 rounded-full border-2 border-[var(--color-nav-primary)] border-t-transparent animate-spin" />
      </div>
    );
  }

  return (
    <div className="max-w-4xl space-y-6">
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-xl bg-[var(--color-nav-primary-muted)] flex items-center justify-center shrink-0">
            <MessageSquare size={24} className="text-[var(--color-nav-primary)]" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-[var(--color-text-primary)]">{title}</h2>
            <p className="text-sm text-[var(--color-text-secondary)] mt-1">{description}</p>
          </div>
        </div>
        {recipients.length > 0 && (
          <button
            type="button"
            onClick={startCompose}
            className="inline-flex items-center gap-2 rounded-lg bg-[var(--color-nav-primary)] text-white px-4 py-2 text-sm font-medium hover:opacity-90"
          >
            <Send size={16} /> Compose
          </button>
        )}
      </div>

      {composing && (
        <PortalSection title="New message">
          <form onSubmit={sendMessage} className="space-y-3 text-sm">
            <label className="block">
              <span className="text-[var(--color-text-muted)]">To</span>
              <select
                className="mt-1 w-full rounded-lg border border-[var(--color-border-default)] px-3 py-2"
                value={form.recipientAccountId}
                onChange={(e) => setForm((f) => ({ ...f, recipientAccountId: e.target.value }))}
                required
              >
                <option value="">Select recipient</option>
                {recipients.map((r) => (
                  <option key={r.accountId} value={r.accountId}>
                    {r.name} ({r.role}){r.detail ? ` — ${r.detail}` : ''}
                  </option>
                ))}
              </select>
            </label>
            <label className="block">
              <span className="text-[var(--color-text-muted)]">Subject</span>
              <input
                className="mt-1 w-full rounded-lg border border-[var(--color-border-default)] px-3 py-2"
                value={form.subject}
                onChange={(e) => setForm((f) => ({ ...f, subject: e.target.value }))}
                required
              />
            </label>
            <label className="block">
              <span className="text-[var(--color-text-muted)]">Message</span>
              <textarea
                className="mt-1 w-full rounded-lg border border-[var(--color-border-default)] px-3 py-2 min-h-[100px]"
                value={form.body}
                onChange={(e) => setForm((f) => ({ ...f, body: e.target.value }))}
                required
              />
            </label>
            {composeError && <p className="text-sm text-red-600">{composeError}</p>}
            <div className="flex gap-2">
              <button
                type="submit"
                disabled={sending}
                className="inline-flex items-center gap-2 rounded-lg bg-[var(--color-nav-primary)] text-white px-4 py-2 text-sm font-medium disabled:opacity-60"
              >
                <Send size={14} /> {sending ? 'Sending…' : 'Send'}
              </button>
              <button
                type="button"
                onClick={() => setComposing(false)}
                className="px-4 py-2 text-sm rounded-lg border border-[var(--color-border-default)]"
              >
                Cancel
              </button>
            </div>
          </form>
        </PortalSection>
      )}

      {messages.length === 0 && !composing ? (
        <PortalEmptyState
          title="No messages"
          description="When teachers or the school office send you a message, it will appear here."
        />
      ) : (
        <div className="grid lg:grid-cols-2 gap-6">
          <PortalSection title="Inbox">
            <ul className="divide-y divide-[var(--color-border-default)]">
              {messages.map((m) => (
                <li key={m.id}>
                  <button
                    type="button"
                    onClick={() => openMessage(m)}
                    className={`w-full text-left py-3 px-1 transition ${
                      selected?.id === m.id ? 'bg-[var(--color-bg-secondary)] rounded-lg px-2' : ''
                    }`}
                  >
                    <div className="flex justify-between gap-2">
                      <p className={`text-sm ${m.isRead ? 'font-medium' : 'font-bold'}`}>
                        {m.senderName}
                      </p>
                      <span
                        className={`text-[10px] uppercase tracking-wide shrink-0 ${
                          m.isRead ? 'text-[var(--color-text-muted)]' : 'text-[var(--color-nav-primary)]'
                        }`}
                      >
                        {m.isRead ? 'Read' : 'Unread'}
                      </span>
                    </div>
                    <p className="text-sm text-[var(--color-text-primary)] mt-0.5">{m.subject}</p>
                    <p className="text-xs text-[var(--color-text-muted)] mt-1">{formatWhen(m.createdAt)}</p>
                  </button>
                </li>
              ))}
            </ul>
          </PortalSection>

          <PortalSection title={selected ? selected.subject : 'Message'}>
            {selected ? (
              <div className="space-y-3 text-sm">
                <p className="text-[var(--color-text-muted)]">
                  From <strong>{selected.senderName}</strong>
                  {selected.studentName ? ` · re ${selected.studentName}` : ''}
                  <br />
                  {formatWhen(selected.createdAt)}
                </p>
                <p className="whitespace-pre-wrap leading-relaxed">{selected.body}</p>
                {selected.senderAccountId && recipients.some((r) => r.accountId === selected.senderAccountId) && (
                  <button
                    type="button"
                    onClick={() => startReply(selected)}
                    className="inline-flex items-center gap-2 text-sm font-semibold text-[var(--color-nav-primary)]"
                  >
                    <Send size={14} /> Reply
                  </button>
                )}
              </div>
            ) : (
              <p className="text-sm text-[var(--color-text-muted)]">Select a message to read.</p>
            )}
          </PortalSection>
        </div>
      )}
    </div>
  );
}
