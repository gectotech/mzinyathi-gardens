const STATUS_STYLES: Record<string, string> = {
  new: 'bg-blue-100 text-blue-800',
  read: 'bg-gray-100 text-gray-700',
  replied: 'bg-green-100 text-green-800',
  archived: 'bg-slate-100 text-slate-600',
  submitted: 'bg-blue-100 text-blue-800',
  under_review: 'bg-amber-100 text-amber-800',
  shortlisted: 'bg-purple-100 text-purple-800',
  accepted: 'bg-green-100 text-green-800',
  waitlisted: 'bg-yellow-100 text-yellow-800',
  rejected: 'bg-red-100 text-red-800',
  hired: 'bg-emerald-100 text-emerald-800',
  draft: 'bg-gray-100 text-gray-600',
  published: 'bg-green-100 text-green-700',
};

export default function StatusBadge({ status }: { status: string }) {
  const label = status.replace(/_/g, ' ');
  const style = STATUS_STYLES[status] || 'bg-gray-100 text-gray-700';
  return (
    <span className={`inline-flex items-center text-xs font-medium px-2.5 py-1 rounded-full capitalize ${style}`}>
      {label}
    </span>
  );
}
