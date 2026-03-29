'use client';

import { useState } from 'react';
import type { Activity, Contact, Deal } from '@/types';
import Modal from '@/components/Modal';
import ActivityForm from '@/components/ActivityForm';
import DeleteButton from '@/components/DeleteButton';

interface Props {
  activity: Activity;
  contacts: Contact[];
  deals: Deal[];
}

export default function ActivityDetailClient({ activity, contacts, deals }: Props) {
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
        <DeleteButton id={activity.id} entityType="activities" entityName={activity.title} redirectTo="/activities" />
      </div>
      <Modal isOpen={showEdit} onClose={() => setShowEdit(false)} title="Edit Activity">
        <ActivityForm activity={activity} contacts={contacts} deals={deals} onClose={() => setShowEdit(false)} />
      </Modal>
    </>
  );
}
