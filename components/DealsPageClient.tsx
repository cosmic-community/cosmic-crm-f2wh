'use client';

import { useState } from 'react';
import type { Contact, Company } from '@/types';
import Modal from '@/components/Modal';
import DealForm from '@/components/DealForm';
import AddButton from '@/components/AddButton';

interface Props {
  contacts: Contact[];
  companies: Company[];
  children: React.ReactNode;
}

export default function DealsPageClient({ contacts, companies, children }: Props) {
  const [showForm, setShowForm] = useState(false);

  return (
    <>
      <div className="flex justify-end mb-4 -mt-4">
        <AddButton onClick={() => setShowForm(true)} label="Add Deal" />
      </div>
      {children}
      <Modal isOpen={showForm} onClose={() => setShowForm(false)} title="New Deal">
        <DealForm contacts={contacts} companies={companies} onClose={() => setShowForm(false)} />
      </Modal>
    </>
  );
}
