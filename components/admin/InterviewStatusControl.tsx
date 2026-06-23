'use client';

import { useState } from 'react';
import toast from 'react-hot-toast';

type InterviewStatusControlProps = {
  status: string;
  interviewScheduledAt?: string | null;
  statusOptions: { value: string; label: string }[];
  onSave: (status: string, interviewScheduledAt: string | null) => Promise<void>;
};

function toLocalInputValue(iso: string | null | undefined) {
  if (!iso) return '';
  const d = new Date(iso);
  const pad = (n: number) => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

export default function InterviewStatusControl({
  status,
  interviewScheduledAt,
  statusOptions,
  onSave,
}: InterviewStatusControlProps) {
  const [localStatus, setLocalStatus] = useState(status);
  const [localInterview, setLocalInterview] = useState(toLocalInputValue(interviewScheduledAt));
  const [saving, setSaving] = useState(false);

  const save = async () => {
    if (localStatus === 'interview' && !localInterview) {
      toast.error('Select an interview date and time');
      return;
    }
    setSaving(true);
    try {
      await onSave(
        localStatus,
        localStatus === 'interview' && localInterview ? new Date(localInterview).toISOString() : null
      );
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-2">
      <select
        value={localStatus}
        onChange={(e) => setLocalStatus(e.target.value)}
        className="border rounded-lg px-2 py-1 text-xs bg-white w-full"
      >
        {statusOptions.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
      {localStatus === 'interview' && (
        <input
          type="datetime-local"
          value={localInterview}
          onChange={(e) => setLocalInterview(e.target.value)}
          className="border rounded-lg px-2 py-1 text-xs bg-white w-full"
        />
      )}
      {(localStatus !== status || toLocalInputValue(interviewScheduledAt) !== localInterview) && (
        <button
          type="button"
          onClick={save}
          disabled={saving}
          className="text-xs bg-[#4169E1] text-white px-2 py-1 rounded w-full hover:bg-blue-700 disabled:opacity-50"
        >
          {saving ? 'Saving…' : 'Save status'}
        </button>
      )}
    </div>
  );
}
