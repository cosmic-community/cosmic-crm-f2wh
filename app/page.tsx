import { getContacts, getCompanies, getDeals, getActivities, getMetafieldValue } from '@/lib/cosmic';
import type { Deal, Activity } from '@/types';
import StatCard from '@/components/StatCard';
import StatusBadge from '@/components/StatusBadge';
import Link from 'next/link';

function formatCurrency(value: unknown): string {
  const num = typeof value === 'number' ? value : parseFloat(String(value || '0'));
  if (isNaN(num)) return '$0';
  if (num >= 1000000) return `$${(num / 1000000).toFixed(1)}M`;
  if (num >= 1000) return `$${(num / 1000).toFixed(0)}K`;
  return `$${num.toLocaleString()}`;
}

function formatDate(dateStr: string | undefined): string {
  if (!dateStr) return '';
  try {
    return new Date(dateStr).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  } catch {
    return dateStr;
  }
}

export default async function Dashboard() {
  const [contacts, companies, deals, activities] = await Promise.all([
    getContacts(),
    getCompanies(),
    getDeals(),
    getActivities(),
  ]);

  const totalPipeline = deals.reduce((sum: number, deal: Deal) => {
    const val = getMetafieldValue(deal.metadata?.value);
    const num = typeof val === 'number' ? val : parseFloat(String(val || '0'));
    return sum + (isNaN(num) ? 0 : num);
  }, 0);

  const wonDeals = deals.filter((d: Deal) => getMetafieldValue(d.metadata?.stage) === 'Closed Won');
  const wonValue = wonDeals.reduce((sum: number, deal: Deal) => {
    const val = getMetafieldValue(deal.metadata?.value);
    const num = typeof val === 'number' ? val : parseFloat(String(val || '0'));
    return sum + (isNaN(num) ? 0 : num);
  }, 0);

  const recentActivities = [...activities]
    .sort((a: Activity, b: Activity) => {
      const dateA = String(getMetafieldValue(a.metadata?.date) || '');
      const dateB = String(getMetafieldValue(b.metadata?.date) || '');
      return dateB.localeCompare(dateA);
    })
    .slice(0, 5);

  const activeDeals = deals.filter((d: Deal) => {
    const stage = getMetafieldValue(d.metadata?.stage);
    return stage !== 'Closed Won' && stage !== 'Closed Lost';
  });

  return (
    <div className="space-y-6 sm:space-y-8">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-sm sm:text-base text-gray-500 mt-1">Welcome back! Here&apos;s your CRM overview.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-6">
        <StatCard
          title="Contacts"
          value={contacts.length}
          subtitle={`${contacts.filter((c: any) => getMetafieldValue(c.metadata?.status) === 'Lead').length} leads`}
          icon={
            <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" />
            </svg>
          }
        />
        <StatCard
          title="Companies"
          value={companies.length}
          colorClass="text-violet-600"
          icon={
            <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 21h16.5M4.5 3h15M5.25 3v18m13.5-18v18M9 6.75h1.5m-1.5 3h1.5m-1.5 3h1.5m3-6H15m-1.5 3H15m-1.5 3H15M9 21v-3.375c0-.621.504-1.125 1.125-1.125h3.75c.621 0 1.125.504 1.125 1.125V21" />
            </svg>
          }
        />
        <StatCard
          title="Pipeline"
          value={formatCurrency(totalPipeline)}
          subtitle={`${activeDeals.length} active deals`}
          colorClass="text-emerald-600"
          icon={
            <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12m-3-2.818l.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          }
        />
        <StatCard
          title="Won Revenue"
          value={formatCurrency(wonValue)}
          subtitle={`${wonDeals.length} closed deals`}
          colorClass="text-amber-600"
          icon={
            <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 18.75h-9m9 0a3 3 0 013 3h-15a3 3 0 013-3m9 0v-3.375c0-.621-.503-1.125-1.125-1.125h-.871M7.5 18.75v-3.375c0-.621.504-1.125 1.125-1.125h.872m5.007 0H9.497m5.007 0a7.454 7.454 0 01-.982-3.172M9.497 14.25a7.454 7.454 0 00.981-3.172M5.25 4.236c-.982.143-1.954.317-2.916.52A6.003 6.003 0 007.73 9.728M5.25 4.236V4.5c0 2.108.966 3.99 2.48 5.228M5.25 4.236V2.721C7.456 2.41 9.71 2.25 12 2.25c2.291 0 4.545.16 6.75.47v1.516M18.75 4.236c.982.143 1.954.317 2.916.52A6.003 6.003 0 0016.27 9.728M18.75 4.236V4.5c0 2.108-.966 3.99-2.48 5.228m0 0a6.023 6.023 0 01-2.77.568c-.994 0-1.932-.2-2.77-.568" />
            </svg>
          }
        />
      </div>

      {/* Two column layout for recent items */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
        {/* Active Deals */}
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm">
          <div className="p-4 sm:p-6 border-b border-gray-100">
            <div className="flex items-center justify-between">
              <h2 className="text-base sm:text-lg font-semibold text-gray-900">Active Deals</h2>
              <Link href="/deals" className="text-sm text-brand-600 hover:text-brand-700 font-medium">View all</Link>
            </div>
          </div>
          <div className="divide-y divide-gray-50">
            {activeDeals.slice(0, 5).map((deal: Deal) => (
              <Link key={deal.slug} href={`/deals/${deal.slug}`} className="flex items-center justify-between p-4 sm:px-6 hover:bg-gray-50 transition-colors">
                <div className="min-w-0 flex-1">
                  <p className="font-medium text-sm text-gray-900 truncate">{deal.title}</p>
                  <p className="text-xs text-gray-500 mt-0.5">
                    Close: {formatDate(String(getMetafieldValue(deal.metadata?.close_date) || ''))}
                  </p>
                </div>
                <div className="text-right ml-4 flex-shrink-0">
                  <p className="font-semibold text-sm text-gray-900">{formatCurrency(getMetafieldValue(deal.metadata?.value))}</p>
                  <StatusBadge status={String(getMetafieldValue(deal.metadata?.stage) || '')} />
                </div>
              </Link>
            ))}
            {activeDeals.length === 0 && (
              <div className="p-6 text-center text-gray-500 text-sm">No active deals</div>
            )}
          </div>
        </div>

        {/* Recent Activities */}
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm">
          <div className="p-4 sm:p-6 border-b border-gray-100">
            <div className="flex items-center justify-between">
              <h2 className="text-base sm:text-lg font-semibold text-gray-900">Recent Activities</h2>
              <Link href="/activities" className="text-sm text-brand-600 hover:text-brand-700 font-medium">View all</Link>
            </div>
          </div>
          <div className="divide-y divide-gray-50">
            {recentActivities.map((activity: Activity) => (
              <Link key={activity.slug} href={`/activities/${activity.slug}`} className="flex items-center gap-3 sm:gap-4 p-4 sm:px-6 hover:bg-gray-50 transition-colors">
                <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg bg-gray-100 flex items-center justify-center flex-shrink-0">
                  <span className="text-sm sm:text-lg">
                    {getMetafieldValue(activity.metadata?.activity_type) === 'Call' ? '📞' :
                     getMetafieldValue(activity.metadata?.activity_type) === 'Email' ? '✉️' :
                     getMetafieldValue(activity.metadata?.activity_type) === 'Meeting' ? '🤝' : '📝'}
                  </span>
                </div>
                <div className="min-w-0 flex-1">
                  <p className="font-medium text-sm text-gray-900 truncate">{activity.title}</p>
                  <p className="text-xs text-gray-500 mt-0.5">
                    {String(getMetafieldValue(activity.metadata?.activity_type) || '')} · {formatDate(String(getMetafieldValue(activity.metadata?.date) || ''))}
                  </p>
                </div>
              </Link>
            ))}
            {recentActivities.length === 0 && (
              <div className="p-6 text-center text-gray-500 text-sm">No activities yet</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
