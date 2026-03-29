'use client';

import { useState } from 'react';
import type { Contact, Deal } from '@/types';
import Modal from '@/components/Modal';
import ActivityForm from '@/components/ActivityForm';
import AddButton from '@/components/AddButton';

interface Props {
  contacts: Contact[];
  deals: Deal[];
  children: React.ReactNode;
}

export default function ActivitiesPageClient({ contacts, deals, children }: Props) {
  const [showForm, setShowForm] = useState(false);

  return (
    <>
      <div className="flex justify-end mb-4 -mt-4">
        <AddButton onClick={() => setShowForm(true)} label="Log Activity" />
      </div>
      {children}
      <Modal isOpen={showForm} onClose={() => setShowForm(false)} title="New Activity">
        <ActivityForm contacts={contacts} deals={deals} onClose={() => setShowForm(false)} />
      </Modal>
    </>
  );
}
