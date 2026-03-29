'use client';

import { useState } from 'react';
import type { Deal, Contact, Company } from '@/types';
import Modal from '@/components/Modal';
import DealForm from '@/components/DealForm';
import DeleteButton from '@/components/DeleteButton';

interface Props {
  deal: Deal;
  contacts: Contact[];
  companies: Company[];
}

export default function DealDetailClient({ deal, contacts, companies }: Props) {
  const [showEdit, setShowEdit] = useState(false);

  return (
    <>
      <div className="flex items-center gap-2">
        <button
          onClick={() => setShowEdit(true)}
          className="px-3 py-1.5 text-sm font-medium text-brand-600 hover:text-brand-700 hover:bg-brand-50 rounded-lg transition-colors"
        >
          <svg className="w-4 h-4 inline mr-1" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
          </svg>
          Edit
        </button>
        <DeleteButton id={deal.id} entityType="deals" entityName={deal.title} redirectTo="/deals" />
      </div>
      <Modal isOpen={showEdit} onClose={() => setShowEdit(false)} title="Edit Deal">
        <DealForm deal={deal} contacts={contacts} companies={companies} onClose={() => setShowEdit(false)} />
      </Modal>
    </>
  );
}
