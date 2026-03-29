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

export default function KanbanBoard({ dealsByStage, stages }: KanbanBoardProps) {
  return (
    <div className="flex gap-4 overflow-x-auto pb-4">
      {stages.map((stage) => {
        const stageDeals = dealsByStage[stage];
        if (!stageDeals) return null;

        const stageTotal = stageDeals.reduce((sum, d) => {
          const v = typeof d.metadata?.value === 'number' ? d.metadata.value : parseFloat(String(d.metadata?.value || '0'));
          return sum + (isNaN(v) ? 0 : v);
        }, 0);

        const borderColor = stageColors[stage] || 'border-t-gray-400';
        const bgColor = stageBgColors[stage] || 'bg-gray-50';

        return (
          <div key={stage} className="flex-shrink-0 w-72">
            <div className={`kanban-column border-t-4 ${borderColor}`}>
              {/* Column Header */}
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <h3 className="text-sm font-semibold text-gray-900">{stage}</h3>
                  <span className={`w-6 h-6 ${bgColor} rounded-full flex items-center justify-center text-xs font-bold text-gray-700`}>
                    {stageDeals.length}
                  </span>
                </div>
                <span className="text-xs font-medium text-gray-400">
                  ${stageTotal.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
                </span>
              </div>

              {/* Deal Cards */}
              <div className="space-y-3">
                {stageDeals.length === 0 ? (
                  <div className="border-2 border-dashed border-gray-200 rounded-lg p-6 text-center">
                    <p className="text-xs text-gray-400">No deals</p>
                  </div>
                ) : (
                  stageDeals.map((deal) => {
                    const value = typeof deal.metadata?.value === 'number' ? deal.metadata.value : parseFloat(String(deal.metadata?.value || '0'));
                    const contactName = deal.metadata?.contact?.title || '';
                    const companyName = deal.metadata?.company?.title || '';
                    const closeDate = deal.metadata?.close_date;

                    return (
                      <Link key={deal.id} href={`/deals/${deal.slug}`} className="deal-card block">
                        <h4 className="text-sm font-medium text-gray-900 mb-2 line-clamp-2">
                          {deal.title}
                        </h4>
                        <div className="flex items-center justify-between mb-3">
                          <span className="text-lg font-bold text-gray-900">
                            ${isNaN(value) ? '0' : value.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
                          </span>
                        </div>
                        <div className="space-y-1.5">
                          {contactName && (
                            <div className="flex items-center gap-1.5 text-xs text-gray-500">
                              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
                              </svg>
                              <span className="truncate">{contactName}</span>
                            </div>
                          )}
                          {companyName && (
                            <div className="flex items-center gap-1.5 text-xs text-gray-500">
                              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 21h19.5M3.75 3v18m4.5-18v18m4.5-18v18m4.5-18v18m4.5-18v18" />
                              </svg>
                              <span className="truncate">{companyName}</span>
                            </div>
                          )}
                          {closeDate && (
                            <div className="flex items-center gap-1.5 text-xs text-gray-500">
                              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" />
                              </svg>
                              <span>
                                {new Date(closeDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                              </span>
                            </div>
                          )}
                        </div>
                      </Link>
                    );
                  })
                )}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}