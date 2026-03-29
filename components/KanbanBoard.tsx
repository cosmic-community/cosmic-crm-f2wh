import Link from 'next/link';
import type { Deal } from '@/types';
import { getMetafieldValue } from '@/lib/cosmic';
import StatusBadge from '@/components/StatusBadge';

interface KanbanBoardProps {
  dealsByStage: Record<string, Deal[]>;
  stages: string[];
}

const stageColors: Record<string, string> = {
  Lead: 'border-t-blue-400',
  Qualified: 'border-t-indigo-400',
  Proposal: 'border-t-amber-400',
  Negotiation: 'border-t-orange-400',
  'Closed Won': 'border-t-emerald-400',
  'Closed Lost': 'border-t-red-400',
};

const stageBgColors: Record<string, string> = {
  Lead: 'bg-blue-50',
  Qualified: 'bg-indigo-50',
  Proposal: 'bg-amber-50',
  Negotiation: 'bg-orange-50',
  'Closed Won': 'bg-emerald-50',
  'Closed Lost': 'bg-red-50',
};

function formatCurrency(value: unknown): string {
  const num = typeof value === 'number' ? value : parseFloat(String(value || '0'));
  if (isNaN(num)) return '$0';
  return `$${num.toLocaleString()}`;
}

export default function KanbanBoard({ dealsByStage, stages }: KanbanBoardProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
      {stages.map((stage) => {
        const deals = dealsByStage[stage] || [];
        const total = deals.reduce((sum, d) => {
          const val = getMetafieldValue(d.metadata?.value);
          return sum + (typeof val === 'number' ? val : parseFloat(String(val || '0')) || 0);
        }, 0);

        return (
          <div
            key={stage}
            className={`rounded-xl border-t-4 ${stageColors[stage] || 'border-t-gray-400'} bg-white shadow-sm`}
          >
            <div className={`px-4 py-3 ${stageBgColors[stage] || 'bg-gray-50'} rounded-t-lg`}>
              <div className="flex items-center justify-between">
                <h3 className="font-semibold text-gray-900 text-sm">{stage}</h3>
                <span className="text-xs font-medium text-gray-500 bg-white px-2 py-0.5 rounded-full">
                  {deals.length}
                </span>
              </div>
              <p className="text-xs text-gray-500 mt-1">{formatCurrency(total)}</p>
            </div>
            <div className="p-3 space-y-2 max-h-80 overflow-y-auto">
              {deals.length === 0 ? (
                <p className="text-xs text-gray-400 text-center py-4">No deals</p>
              ) : (
                deals.map((deal) => (
                  <Link
                    key={deal.slug}
                    href={`/deals/${deal.slug}`}
                    className="block p-3 rounded-lg border border-gray-100 hover:border-brand-200 hover:shadow-sm transition-all"
                  >
                    <p className="font-medium text-sm text-gray-900 truncate">{deal.title}</p>
                    <p className="text-sm font-semibold text-brand-600 mt-1">
                      {formatCurrency(getMetafieldValue(deal.metadata?.value))}
                    </p>
                  </Link>
                ))
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
