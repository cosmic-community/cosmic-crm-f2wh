'use client';

import { useState } from 'react';
import Modal from '@/components/Modal';
import CompanyForm from '@/components/CompanyForm';
import AddButton from '@/components/AddButton';

export default function CompaniesPageClient({ children }: { children: React.ReactNode }) {
  const [showForm, setShowForm] = useState(false);

  return (
    <>
      <div className="flex justify-end mb-4 -mt-4">
        <AddButton onClick={() => setShowForm(true)} label="Add Company" />
      </div>
      {children}
      <Modal isOpen={showForm} onClose={() => setShowForm(false)} title="New Company">
        <CompanyForm onClose={() => setShowForm(false)} />
      </Modal>
    </>
  );
}
