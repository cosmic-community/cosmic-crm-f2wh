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
          options: ['Lead', 'Prospect', 'Customer', 'Churned'],
          getValue: (contact) => String(getMetafieldValue(contact.metadata?.status) || ''),
        },
        {
          label: 'Source',
          key: 'source',
          options: ['Website', 'Referral', 'LinkedIn', 'Cold Call', 'Event', 'Other'],
          getValue: (contact) => String(getMetafieldValue(contact.metadata?.source) || ''),
        },
      ]}
    >
      {(filteredContacts) => (
        <div className="overflow-x-auto -mx-4 sm:mx-0">
          <div className="inline-block min-w-full align-middle">
            <table className="min-w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Name</th>
                  <th className="text-left py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider hidden sm:table-cell">Email</th>
                  <th className="text-left py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider hidden md:table-cell">Phone</th>
                  <th className="text-left py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="text-left py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider hidden lg:table-cell">Source</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredContacts.map((contact) => (
                  <tr key={contact.slug} className="hover:bg-gray-50 transition-colors">
                    <td className="py-3 px-4">
                      <Link href={`/contacts/${contact.slug}`} className="font-medium text-gray-900 hover:text-brand-600 transition-colors">
                        {getMetafieldValue(contact.metadata?.first_name)} {getMetafieldValue(contact.metadata?.last_name)}
                      </Link>
                      <p className="text-xs text-gray-500 sm:hidden mt-0.5">{String(getMetafieldValue(contact.metadata?.email) || '')}</p>
                    </td>
                    <td className="py-3 px-4 text-sm text-gray-600 hidden sm:table-cell">
                      {String(getMetafieldValue(contact.metadata?.email) || '')}
                    </td>
                    <td className="py-3 px-4 text-sm text-gray-600 hidden md:table-cell">
                      {String(getMetafieldValue(contact.metadata?.phone) || '')}
                    </td>
                    <td className="py-3 px-4">
                      <StatusBadge status={String(getMetafieldValue(contact.metadata?.status) || '')} />
                    </td>
                    <td className="py-3 px-4 text-sm text-gray-600 hidden lg:table-cell">
                      {String(getMetafieldValue(contact.metadata?.source) || '')}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </SearchFilter>
  );
}
