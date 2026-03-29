import { getCompanies, getMetafieldValue } from '@/lib/cosmic';
import Link from 'next/link';
import PageHeader from '@/components/PageHeader';
import EmptyState from '@/components/EmptyState';

export default async function CompaniesPage() {
  const companies = await getCompanies();

  return (
    <div>
      <PageHeader
        title="Companies"
        description="Manage your organizations"
        count={companies.length}
      />

      {companies.length === 0 ? (
        <EmptyState
          title="No companies yet"
          description="Add your first company in Cosmic CMS to see them here."
          icon={
            <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 21h19.5M3.75 3v18m4.5-18v18m4.5-18v18m4.5-18v18m4.5-18v18M6 6.75h.008v.008H6V6.75zm0 3.75h.008v.008H6v-.008zm0 3.75h.008v.008H6v-.008zm4.5-7.5h.008v.008H10.5V6.75zm0 3.75h.008v.008H10.5v-.008zm0 3.75h.008v.008H10.5v-.008zm4.5-7.5h.008v.008H15V6.75zm0 3.75h.008v.008H15v-.008zm0 3.75h.008v.008H15v-.008z" />
            </svg>
          }
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {companies.map((company) => {
            const industry = getMetafieldValue(company.metadata?.industry);
            const website = getMetafieldValue(company.metadata?.website);
            const size = getMetafieldValue(company.metadata?.size);
            const address = getMetafieldValue(company.metadata?.address);

            return (
              <Link
                key={company.id}
                href={`/companies/${company.slug}`}
                className="bg-white rounded-xl border border-gray-100 shadow-sm p-6 hover:shadow-md hover:border-brand-200 transition-all group"
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 bg-indigo-100 text-indigo-700 rounded-xl flex items-center justify-center text-lg font-bold flex-shrink-0">
                    {company.title.charAt(0).toUpperCase()}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-base font-semibold text-gray-900 group-hover:text-brand-600 transition-colors truncate">
                      {company.title}
                    </h3>
                    {industry && (
                      <p className="text-xs text-gray-500">{industry}</p>
                    )}
                  </div>
                </div>

                <div className="space-y-2">
                  {size && (
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <svg className="w-4 h-4 text-gray-400 flex-shrink-0" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" />
                      </svg>
                      <span className="truncate">{size}</span>
                    </div>
                  )}
                  {website && (
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <svg className="w-4 h-4 text-gray-400 flex-shrink-0" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 21a9.004 9.004 0 008.716-6.747M12 21a9.004 9.004 0 01-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 017.843 4.582M12 3a8.997 8.997 0 00-7.843 4.582m15.686 0A11.953 11.953 0 0112 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0121 12c0 .778-.099 1.533-.284 2.253m0 0A17.919 17.919 0 0112 16.5c-3.162 0-6.133-.815-8.716-2.247m0 0A9.015 9.015 0 013 12c0-1.605.42-3.113 1.157-4.418" />
                      </svg>
                      <span className="truncate">{website}</span>
                    </div>
                  )}
                  {address && (
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <svg className="w-4 h-4 text-gray-400 flex-shrink-0" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
                      </svg>
                      <span className="truncate">{address}</span>
                    </div>
                  )}
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}