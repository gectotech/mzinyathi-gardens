'use client';

import { useState } from 'react';
import toast from 'react-hot-toast';
import { Trash2 } from 'lucide-react';

type ApplicationBulkToolsProps = {
  endpoint: string;
  selectedIds: string[];
  onSelectionChange: (ids: string[]) => void;
  onDeleted: () => void;
  totalCount: number;
  /** When true, selection delete is handled by FloatingActionBar elsewhere */
  hideDeleteSelected?: boolean;
};

export default function ApplicationBulkTools({
  endpoint,
  selectedIds,
  onSelectionChange,
  onDeleted,
  totalCount,
  hideDeleteSelected = false,
}: ApplicationBulkToolsProps) {
  const [purgeBefore, setPurgeBefore] = useState('');
  const [purgeFrom, setPurgeFrom] = useState('');
  const [purgeTo, setPurgeTo] = useState('');
  const [deleting, setDeleting] = useState(false);

  const deleteSelected = async () => {
    if (!selectedIds.length) {
      toast.error('Select at least one application');
      return;
    }
    if (!confirm(`Delete ${selectedIds.length} selected application(s)? This cannot be undone.`)) return;
    setDeleting(true);
    try {
      const res = await fetch(endpoint, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ids: selectedIds }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Delete failed');
      toast.success(`Deleted ${data.deleted || selectedIds.length} application(s)`);
      onSelectionChange([]);
      onDeleted();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Delete failed');
    } finally {
      setDeleting(false);
    }
  };

  const deleteByDate = async (mode: 'before' | 'range') => {
    const body =
      mode === 'before'
        ? { before: purgeBefore }
        : { from: purgeFrom, to: purgeTo };

    const label =
      mode === 'before'
        ? `all applications before ${purgeBefore}`
        : `applications from ${purgeFrom} to ${purgeTo}`;

    if (mode === 'before' && !purgeBefore) {
      toast.error('Select a date');
      return;
    }
    if (mode === 'range' && (!purgeFrom || !purgeTo)) {
      toast.error('Select both start and end dates');
      return;
    }

    if (!confirm(`Delete ${label}? This cannot be undone.`)) return;

    setDeleting(true);
    try {
      const res = await fetch(endpoint, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Delete failed');
      toast.success(`Deleted ${data.deleted || 0} application(s)`);
      onSelectionChange([]);
      onDeleted();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Delete failed');
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow border p-4 space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h3 className="text-sm font-semibold text-gray-800">Data clearance</h3>
          <p className="text-xs text-gray-500">
            {selectedIds.length} of {totalCount} selected
          </p>
        </div>
        {!hideDeleteSelected && (
        <button
          type="button"
          onClick={deleteSelected}
          disabled={deleting || !selectedIds.length}
          className="inline-flex items-center gap-1.5 bg-red-600 text-white px-3 py-2 rounded-md text-xs font-medium hover:bg-red-700 disabled:opacity-50"
        >
          <Trash2 size={14} /> Delete selected
        </button>
        )}
      </div>

      <div className="grid md:grid-cols-2 gap-4 pt-2 border-t">
        <div className="space-y-2">
          <p className="text-xs font-medium text-gray-600">Delete all before date</p>
          <div className="flex gap-2">
            <input
              type="date"
              value={purgeBefore}
              onChange={(e) => setPurgeBefore(e.target.value)}
              className="border rounded px-2 py-1.5 text-sm flex-1"
            />
            <button
              type="button"
              onClick={() => deleteByDate('before')}
              disabled={deleting}
              className="bg-red-50 text-red-700 border border-red-200 px-3 py-1.5 rounded text-xs font-medium hover:bg-red-100"
            >
              Purge
            </button>
          </div>
        </div>
        <div className="space-y-2">
          <p className="text-xs font-medium text-gray-600">Delete within date range</p>
          <div className="flex flex-wrap gap-2">
            <input
              type="date"
              value={purgeFrom}
              onChange={(e) => setPurgeFrom(e.target.value)}
              className="border rounded px-2 py-1.5 text-sm"
            />
            <input
              type="date"
              value={purgeTo}
              onChange={(e) => setPurgeTo(e.target.value)}
              className="border rounded px-2 py-1.5 text-sm"
            />
            <button
              type="button"
              onClick={() => deleteByDate('range')}
              disabled={deleting}
              className="bg-red-50 text-red-700 border border-red-200 px-3 py-1.5 rounded text-xs font-medium hover:bg-red-100"
            >
              Purge range
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
