import { getActivityBySlug, getContacts, getDeals, getMetafieldValue } from '@/lib/cosmic';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import StatusBadge from '@/components/StatusBadge';
import ActivityDetailClient from '@/components/ActivityDetailClient';

export const dynamic = 'force-dynamic';

export default async function ActivityDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const [activity, contacts, deals] = await Promise.all([getActivityBySlug(slug), getContacts(), getDeals()]);

  if (!activity) {
    notFound();
  }

  const activityType = getMetafieldValue(activity.metadata?.activity_type);
  const activityDate = activity.metadata?.date;
  const notes = getMetafieldValue(activity.metadata?.notes);
  const contact = activity.metadata?.contact;
  const deal = activity.metadata?.deal;

  return (
    <div>
      <nav className="flex items-center gap-2 text-sm text-gray-500 mb-6">
        <Link href="/activities" className="hover:text-brand-600 transition-colors">Activities</Link>
        <span>/</span>
        <span className="text-gray-900 font-medium">{activity.title}</span>
      </nav>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h1 className="text-xl font-bold text-gray-900">{activity.title}</h1>
                {activityDate && (
                  <p className="text-sm text-gray-500 mt-1">
                    {new Date(activityDate).toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}
                  </p>
                )}
              </div>
              <div className="flex items-center gap-3">
                <StatusBadge status={activity.metadata?.activity_type} />
                <ActivityDetailClient activity={activity} contacts={contacts} deals={deals} />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">Type</p>
                <p className="text-sm text-gray-900 font-medium">{activityType || '—'}</p>
              </div>
              <div>
                <p className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">Date</p>
                <p className="text-sm text-gray-900">
                  {activityDate ? new Date(activityDate).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }) : '—'}
                </p>
              </div>
            </div>
          </div>

          {notes && (
            <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
              <h2 className="text-sm font-semibold text-gray-900 mb-3">Notes</h2>
              <p className="text-sm text-gray-600 leading-relaxed whitespace-pre-wrap">{notes}</p>
            </div>
          )}
        </div>

        <div className="space-y-6">
          {contact && (
            <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
              <h3 className="text-sm font-semibold text-gray-900 mb-3">Contact</h3>
              <Link href={`/contacts/${contact.slug}`} className="block p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                <p className="text-sm font-medium text-gray-900">{contact.title}</p>
              </Link>
            </div>
          )}
          {deal && (
            <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
              <h3 className="text-sm font-semibold text-gray-900 mb-3">Deal</h3>
              <Link href={`/deals/${deal.slug}`} className="block p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                <p className="text-sm font-medium text-gray-900">{deal.title}</p>
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
