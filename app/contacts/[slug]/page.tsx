import { getContactBySlug, getCompanies, getMetafieldValue } from '@/lib/cosmic';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import StatusBadge from '@/components/StatusBadge';
import ContactDetailClient from '@/components/ContactDetailClient';

export const dynamic = 'force-dynamic';

export default async function ContactDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const [contact, companies] = await Promise.all([getContactBySlug(slug), getCompanies()]);

  if (!contact) {
    notFound();
  }

  const firstName = getMetafieldValue(contact.metadata?.first_name);
  const lastName = getMetafieldValue(contact.metadata?.last_name);
  const email = getMetafieldValue(contact.metadata?.email);
  const phone = getMetafieldValue(contact.metadata?.phone);
  const notes = getMetafieldValue(contact.metadata?.notes);
  const source = getMetafieldValue(contact.metadata?.source);
  const company = contact.metadata?.company;
  const initials = `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase() || contact.title.charAt(0).toUpperCase();

  return (
    <div>
      <nav className="flex items-center gap-2 text-sm text-gray-500 mb-6">
        <Link href="/contacts" className="hover:text-brand-600 transition-colors">Contacts</Link>
        <span>/</span>
        <span className="text-gray-900 font-medium">{firstName || lastName ? `${firstName} ${lastName}`.trim() : contact.title}</span>
      </nav>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-16 h-16 bg-brand-100 text-brand-700 rounded-2xl flex items-center justify-center text-xl font-bold">
                {initials}
              </div>
              <div className="flex-1">
                <h1 className="text-xl font-bold text-gray-900">
                  {firstName || lastName ? `${firstName} ${lastName}`.trim() : contact.title}
                </h1>
                {company && (
                  <Link href={`/companies/${company.slug}`} className="text-sm text-brand-600 hover:text-brand-700 font-medium">
                    {company.title}
                  </Link>
                )}
              </div>
              <div className="flex items-center gap-3">
                <StatusBadge status={contact.metadata?.status} type="contact" />
                <ContactDetailClient contact={contact} companies={companies} />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">Email</p>
                <p className="text-sm text-gray-900">{email || '—'}</p>
              </div>
              <div>
                <p className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">Phone</p>
                <p className="text-sm text-gray-900">{phone || '—'}</p>
              </div>
              <div>
                <p className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">Source</p>
                <p className="text-sm text-gray-900">{source || '—'}</p>
              </div>
              <div>
                <p className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">Added</p>
                <p className="text-sm text-gray-900">
                  {new Date(contact.created_at).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
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
          {company && (
            <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
              <h3 className="text-sm font-semibold text-gray-900 mb-3">Company</h3>
              <Link href={`/companies/${company.slug}`} className="block p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                <p className="text-sm font-medium text-gray-900">{company.title}</p>
                {company.metadata?.industry && (
                  <p className="text-xs text-gray-500 mt-0.5">{getMetafieldValue(company.metadata.industry)}</p>
                )}
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
