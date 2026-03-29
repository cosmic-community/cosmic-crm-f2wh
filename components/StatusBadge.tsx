import { getMetafieldValue } from '@/lib/cosmic';

interface StatusBadgeProps {
  status: unknown;
  type?: 'contact' | 'deal' | 'activity';
}

const statusColors: Record<string, string> = {
  // Contact statuses
  Active: 'bg-emerald-50 text-emerald-700 ring-1 ring-emerald-600/10',
  Inactive: 'bg-gray-50 text-gray-600 ring-1 ring-gray-500/10',
  Lead: 'bg-blue-50 text-blue-700 ring-1 ring-blue-600/10',
  Prospect: 'bg-purple-50 text-purple-700 ring-1 ring-purple-600/10',
  // Deal stages
  Qualified: 'bg-indigo-50 text-indigo-700 ring-1 ring-indigo-600/10',
  Proposal: 'bg-amber-50 text-amber-700 ring-1 ring-amber-600/10',
  Negotiation: 'bg-orange-50 text-orange-700 ring-1 ring-orange-600/10',
  'Closed Won': 'bg-emerald-50 text-emerald-700 ring-1 ring-emerald-600/10',
  'Closed Lost': 'bg-red-50 text-red-700 ring-1 ring-red-600/10',
  // Activity types
  Call: 'bg-sky-50 text-sky-700 ring-1 ring-sky-600/10',
  Email: 'bg-violet-50 text-violet-700 ring-1 ring-violet-600/10',
  Meeting: 'bg-teal-50 text-teal-700 ring-1 ring-teal-600/10',
  Note: 'bg-gray-50 text-gray-700 ring-1 ring-gray-500/10',
  Task: 'bg-rose-50 text-rose-700 ring-1 ring-rose-600/10',
};

export default function StatusBadge({ status }: StatusBadgeProps) {
  const statusValue = getMetafieldValue(status);
  if (!statusValue) return null;

  const colorClass = statusColors[statusValue] || 'bg-gray-50 text-gray-600 ring-1 ring-gray-500/10';

  return (
    <span className={`badge ${colorClass}`}>
      {statusValue}
    </span>
  );
}