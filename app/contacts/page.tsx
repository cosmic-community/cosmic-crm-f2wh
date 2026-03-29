import { getContacts, getCompanies, getMetafieldValue } from '@/lib/cosmic';
import type { Contact } from '@/types';
import PageHeader from '@/components/PageHeader';
import StatusBadge from '@/components/StatusBadge';
import EmptyState from '@/components/EmptyState';
import ContactsTable from '@/components/ContactsTable';
import ContactsPageClient from '@/components/ContactsPageClient';

export const dynamic = 'force-dynamic';

export default async function ContactsPage() {
  const [contacts, companies] = await Promise.all([getContacts(), getCompanies()]);

  return (
    <div>
      <PageHeader
        title="Contacts"
        description="Manage your contacts and leads"
        count={contacts.length}
      />

      <ContactsPageClient companies={companies}>
        {contacts.length === 0 ? (
          <EmptyState
            title="No contacts yet"
            description="Click 'Add Contact' to create your first contact."
            icon={
              <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" />
              </svg>
            }
          />
        ) : (
          <ContactsTable contacts={contacts} />
        )}
      </ContactsPageClient>
    </div>
  );
}
