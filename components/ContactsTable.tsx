'use client';

import Link from 'next/link';
import type { Contact } from '@/types';
import { getMetafieldValue } from '@/lib/cosmic';
import StatusBadge from '@/components/StatusBadge';
import SearchFilter from '@/components/SearchFilter';

export default function ContactsTable({ contacts }: { contacts: Contact[] }) {
  return (
    <SearchFilter<Contact>
      items={contacts}
      searchKey={(contact) =>
        `${getMetafieldValue(contact.metadata?.first_name)} ${getMetafieldValue(contact.metadata?.last_name)} ${getMetafieldValue(contact.metadata?.email)} ${contact.title}`
      }
      filterOptions={[
        {
          label: 'Status',
          key: 'status',
          options: ['Active', 'Inactive', 'Lead', 'Prospect'],
          getValue: (contact) => getMetafieldValue(contact.metadata?.status),
        },
        {
          label: 'Source',
          key: 'source',
          options: ['Website', 'Referral', 'Social Media', 'Cold Call', 'Email Campaign', 'Event', 'Other'],
          getValue: (contact) => getMetafieldValue(contact.metadata?.source),
        },
      ]}
    >
      {(filteredContacts) => (
        <>
          {/* Mobile Card Layout */}
          <div className="space-y-3 lg:hidden">
            {filteredContacts.length === 0 ? (
              <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-8 text-center">
                <p className="text-sm text-gray-400">No contacts match your search criteria</p>
              </div>
            ) : (
              filteredContacts.map((contact) => {
                const firstName = getMetafieldValue(contact.metadata?.first_name);
                const lastName = getMetafieldValue(contact.metadata?.last_name);
                const email = getMetafieldValue(contact.metadata?.email);
                const phone = getMetafieldValue(contact.metadata?.phone);
                const companyName = contact.metadata?.company?.title || '';
                const initials = `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase() || contact.title.charAt(0).toUpperCase();

                return (
                  <Link
                    key={contact.id}
                    href={`/contacts/${contact.slug}`}
                    className="block bg-white rounded-xl border border-gray-100 shadow-sm p-4 hover:shadow-md transition-shadow"
                  >
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 bg-brand-100 text-brand-700 rounded-full flex items-center justify-center text-sm font-semibold flex-shrink-0">
                        {initials}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-2">
                          <p className="text-sm font-semibold text-gray-900 truncate">
                            {firstName || lastName ? `${firstName} ${lastName}`.trim() : contact.title}
                          </p>
                          <StatusBadge status={contact.metadata?.status} type="contact" />
                        </div>
                        {email && <p className="text-xs text-gray-500 mt-1 truncate">{email}</p>}
                        <div className="flex items-center gap-3 mt-2 text-xs text-gray-400">
                          {companyName && <span>{companyName}</span>}
                          {phone && <span>{phone}</span>}
                        </div>
                        {getMetafieldValue(contact.metadata?.source) && (
                          <p className="text-xs text-gray-400 mt-1">Source: {getMetafieldValue(contact.metadata?.source)}</p>
                        )}
                      </div>
                    </div>
                  </Link>
                );
              })
            )}
          </div>

          {/* Desktop Table Layout */}
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden hidden lg:block">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-100 bg-gray-50/50">
                    <th className="text-left px-6 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wider">Name</th>
                    <th className="text-left px-6 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wider">Email</th>
                    <th className="text-left px-6 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wider">Company</th>
                    <th className="text-left px-6 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                    <th className="text-left px-6 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wider">Source</th>
                    <th className="text-left px-6 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wider">Phone</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredContacts.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="px-6 py-12 text-center text-sm text-gray-400">
                        No contacts match your search criteria
                      </td>
                    </tr>
                  ) : (
                    filteredContacts.map((contact) => {
                      const firstName = getMetafieldValue(contact.metadata?.first_name);
                      const lastName = getMetafieldValue(contact.metadata?.last_name);
                      const email = getMetafieldValue(contact.metadata?.email);
                      const phone = getMetafieldValue(contact.metadata?.phone);
                      const companyName = contact.metadata?.company?.title || '';
                      const initials = `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase() || contact.title.charAt(0).toUpperCase();

                      return (
                        <tr key={contact.id} className="table-row">
                          <td className="px-6 py-4">
                            <Link
                              href={`/contacts/${contact.slug}`}
                              className="flex items-center gap-3 group"
                            >
                              <div className="w-9 h-9 bg-brand-100 text-brand-700 rounded-full flex items-center justify-center text-sm font-semibold flex-shrink-0">
                                {initials}
                              </div>
                              <div>
                                <p className="text-sm font-medium text-gray-900 group-hover:text-brand-600 transition-colors">
                                  {firstName || lastName ? `${firstName} ${lastName}`.trim() : contact.title}
                                </p>
                              </div>
                            </Link>
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-600">{email}</td>
                          <td className="px-6 py-4">
                            {companyName ? (
                              <Link
                                href={`/companies/${contact.metadata?.company?.slug || ''}`}
                                className="text-sm text-brand-600 hover:text-brand-700 font-medium"
                              >
                                {companyName}
                              </Link>
                            ) : (
                              <span className="text-sm text-gray-400">—</span>
                            )}
                          </td>
                          <td className="px-6 py-4">
                            <StatusBadge status={contact.metadata?.status} type="contact" />
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-600">
                            {getMetafieldValue(contact.metadata?.source) || '—'}
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-600">{phone || '—'}</td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}
    </SearchFilter>
  );
}