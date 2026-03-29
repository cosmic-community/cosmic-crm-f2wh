import { getDeals, getContacts, getCompanies, getMetafieldValue } from '@/lib/cosmic';
import type { Deal } from '@/types';
import PageHeader from '@/components/PageHeader';
import EmptyState from '@/components/EmptyState';
import KanbanBoard from '@/components/KanbanBoard';
import DealsPageClient from '@/components/DealsPageClient';

export const dynamic = 'force-dynamic';

const PIPELINE_STAGES = ['Lead', 'Qualified', 'Proposal', 'Negotiation', 'Closed Won', 'Closed Lost'];

export default async function DealsPage() {
  const [deals, contacts, companies] = await Promise.all([getDeals(), getContacts(), getCompanies()]);

  const dealsByStage: Record<string, Deal[]> = {};
  PIPELINE_STAGES.forEach((stage) => {
    dealsByStage[stage] = deals.filter(
      (deal) => getMetafieldValue(deal.metadata?.stage) === stage
    );
  });

  const totalPipeline = deals.reduce((sum, deal) => {
    const v = typeof deal.metadata?.value === 'number' ? deal.metadata.value : parseFloat(String(deal.metadata?.value || '0'));
    return sum + (isNaN(v) ? 0 : v);
  }, 0);

  return (
    <div>
      <PageHeader
        title="Deals Pipeline"
        description="Track your sales opportunities"
        count={deals.length}
      >
        <div className="text-right">
          <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">Total Pipeline</p>
          <p className="text-lg font-bold text-gray-900">
            ${totalPipeline.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
          </p>
        </div>
      </PageHeader>

      <DealsPageClient contacts={contacts} companies={companies}>
        {deals.length === 0 ? (
          <EmptyState
            title="No deals yet"
            description="Click 'Add Deal' to create your first deal."
            icon={
              <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12m-3-2.818l.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            }
          />
        ) : (
          <KanbanBoard dealsByStage={dealsByStage} stages={PIPELINE_STAGES} />
        )}
      </DealsPageClient>
    </div>
  );
}
