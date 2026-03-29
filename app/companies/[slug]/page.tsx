// app/companies/[slug]/page.tsx
import { getCompanyBySlug, getMetafieldValue } from '@/lib/cosmic';
import { notFound } from 'next/navigation';
import Link from 'next/link';

export default async function CompanyDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const company = await getCompanyBySlug(slug);

  if (!company) {
    notFound();
  }

  const industry = getMetafieldValue(company.metadata?.industry);
  const website = getMetafieldValue(company.metadata?.website);
  const size = getMetafieldValue(company.metadata?.size);
  const address = getMetafieldValue(company.metadata?.address);
  const notes = getMetafieldValue(company.metadata?.notes);

  return (
    <div>
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-sm text-gray-500 mb-6">
        <Link href="/companies" className="hover:text-brand-600 transition-colors">Companies</Link>
        <span>/</span>
        <span className="text-gray-900 font-medium">{company.title}</span>
      </nav>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-16 h-16 bg-indigo-100 text-indigo-700 rounded-2xl flex items-center justify-center text-2xl font-bold">
                {company.title.charAt(0).toUpperCase()}
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">{company.title}</h1>
                {industry && <p className="text-sm text-gray-500">{industry}</p>}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">Industry</p>
                <p className="text-sm text-gray-900">{industry || '—'}</p>
              </div>
              <div>
                <p className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">Size</p>
                <p className="text-sm text-gray-900">{size || '—'}</p>
              </div>
              <div>
                <p className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">Website</p>
                {website ? (
                  <a href={website.startsWith('http') ? website : `https://${website}`} target="_blank" rel="noopener noreferrer" className="text-sm text-brand-600 hover:text-brand-700">
                    {website}
                  </a>
                ) : (
                  <p className="text-sm text-gray-900">—</p>
                )}
              </div>
              <div>
                <p className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">Address</p>
                <p className="text-sm text-gray-900">{address || '—'}</p>
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
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
            <h3 className="text-sm font-semibold text-gray-900 mb-3">Quick Info</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-500">Created</span>
                <span className="text-gray-900 font-medium">
                  {new Date(company.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                </span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-500">Last Modified</span>
                <span className="text-gray-900 font-medium">
                  {new Date(company.modified_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}