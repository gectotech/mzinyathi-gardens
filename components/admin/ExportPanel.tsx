'use client';

type ExportPanelProps = {
  endpoint: string;
  filename: string;
  label?: string;
};

export default function ExportPanel({
  endpoint,
  filename,
  label = 'Export to Excel (CSV)',
}: ExportPanelProps) {
  const download = () => {
    const from = (document.getElementById(`${endpoint}-from`) as HTMLInputElement)?.value;
    const to = (document.getElementById(`${endpoint}-to`) as HTMLInputElement)?.value;
    const params = new URLSearchParams({ format: 'csv' });
    if (from) params.set('from', from);
    if (to) params.set('to', to);
    window.open(`${endpoint}?${params.toString()}`, '_blank');
  };

  return (
    <div className="bg-white rounded-lg shadow p-4 flex flex-wrap items-end gap-3">
      <div>
        <label className="block text-xs font-medium text-gray-600 mb-1">From date</label>
        <input id={`${endpoint}-from`} type="date" className="border rounded px-2 py-1.5 text-sm" />
      </div>
      <div>
        <label className="block text-xs font-medium text-gray-600 mb-1">To date</label>
        <input id={`${endpoint}-to`} type="date" className="border rounded px-2 py-1.5 text-sm" />
      </div>
      <button
        type="button"
        onClick={download}
        className="bg-green-700 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-green-800"
      >
        {label}
      </button>
      <p className="text-xs text-gray-500 w-full">Opens a CSV file with all fields and document links. Excel compatible.</p>
    </div>
  );
}
