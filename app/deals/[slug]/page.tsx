import { getDealBySlug, getContacts, getCompanies, getMetafieldValue } from '@/lib/cosmic';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import StatusBadge from '@/components/StatusBadge';
import DealDetailClient from '@/components/DealDetailClient';

export const dynamic = 'force-dynamic';

export default async function DealDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const [deal, contacts, companies] = await Promise.all([getDealBySlug(slug), getContacts(), getCompanies()]);

  if (!deal) {
    notFound();
  }

  const value = typeof deal.metadata?.value === 'number' ? deal.metadata.value : parseFloat(String(deal.metadata?.value || '0'));
  const stage = getMetafieldValue(deal.metadata?.stage);
  const closeDate = deal.metadata?.close_date;
  const notes = getMetafieldValue(deal.metadata?.notes);
  const contact = deal.metadata?.contact;
  const company = deal.metadata?.company;

  return (
    <div>
      <nav className="flex items-center gap-2 text-sm text-gray-500 mb-6">
        <Link href="/deals" className="hover:text-brand-600 transition-colors">Deals</Link>
        <span>/</span>
        <span className="text-gray-900 font-medium">{deal.title}</span>
      </nav>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h1 className="text-xl font-bold text-gray-900">{deal.title}</h1>
                <p className="text-3xl font-bold text-brand-600 mt-2">
                  ${isNaN(value) ? '0' : value.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
                </p>
              </div>
              <div className="flex items-center gap-3">
                <StatusBadge status={deal.metadata?.stage} type="deal" />
                <DealDetailClient deal={deal} contacts={contacts} companies={companies} />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">Stage</p>
                <p className="text-sm text-gray-900 font-medium">{stage || '—'}</p>
              </div>
              <div>
                <p className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">Close Date</p>
                <p className="text-sm text-gray-900">
                  {closeDate ? new Date(closeDate).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }) : '—'}
                </p>
              </div>
              <div>
                <p className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">Created</p>
                <p className="text-sm text-gray-900">
                  {new Date(deal.created_at).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                </p>
              </div>
              <div>
                <p className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">Last Updated</p>
                <p className="text-sm text-gray-900">
                  {new Date(deal.modified_at).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
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
                {contact.metadata?.email && <p className="text-xs text-gray-500 mt-0.5">{getMetafieldValue(contact.metadata.email)}</p>}
              </Link>
            </div>
          )}
          {company && (
            <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
              <h3 className="text-sm font-semibold text-gray-900 mb-3">Company</h3>
              <Link href={`/companies/${company.slug}`} className="block p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                <p className="text-sm font-medium text-gray-900">{company.title}</p>
                {company.metadata?.industry && <p className="text-xs text-gray-500 mt-0.5">{getMetafieldValue(company.metadata.industry)}</p>}
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
