'use client';

import { useState } from 'react';
import type { Contact, Company } from '@/types';
import Modal from '@/components/Modal';
import ContactForm from '@/components/ContactForm';
import AddButton from '@/components/AddButton';

interface Props {
  companies: Company[];
  children: React.ReactNode;
}

export default function ContactsPageClient({ companies, children }: Props) {
  const [showForm, setShowForm] = useState(false);

  return (
    <>
      <div className="flex justify-end mb-4 -mt-4">
        <AddButton onClick={() => setShowForm(true)} label="Add Contact" />
      </div>
      {children}
      <Modal isOpen={showForm} onClose={() => setShowForm(false)} title="New Contact">
        <ContactForm companies={companies} onClose={() => setShowForm(false)} />
      </Modal>
    </>
  );
}
