'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import type { Activity, Contact, Deal } from '@/types';
import { getMetafieldValue } from '@/lib/cosmic';

interface ActivityFormProps {
  activity?: Activity;
  contacts: Contact[];
  deals: Deal[];
  onClose: () => void;
}

const TYPE_OPTIONS = ['Call', 'Email', 'Meeting', 'Note', 'Task'];

export default function ActivityForm({ activity, contacts, deals, onClose }: ActivityFormProps) {
  const router = useRouter();
  const isEdit = !!activity;

  const [saving, setSaving] = useState(false);
  const [title, setTitle] = useState(activity?.title || '');
  const [activityType, setActivityType] = useState(getMetafieldValue(activity?.metadata?.activity_type) || 'Call');
  const [date, setDate] = useState(activity?.metadata?.date ? new Date(activity.metadata.date).toISOString().split('T')[0] : new Date().toISOString().split('T')[0]);
  const [contactId, setContactId] = useState(activity?.metadata?.contact?.id || '');
  const [dealId, setDealId] = useState(activity?.metadata?.deal?.id || '');
  const [notes, setNotes] = useState(getMetafieldValue(activity?.metadata?.notes) || '');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;
    setSaving(true);
    try {
      const metadata: Record<string, unknown> = {
        activity_type: activityType,
        date: date || undefined,
        notes: notes.trim() || undefined,
      };
      if (contactId) metadata.contact = contactId;
      if (dealId) metadata.deal = dealId;

      const url = isEdit ? `/api/activities/${activity.id}` : '/api/activities';
      const method = isEdit ? 'PUT' : 'POST';
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: title.trim(), metadata }),
      });
      if (res.ok) {
        onClose();
        router.refresh();
      } else {
        alert('Failed to save activity. Please try again.');
      }
    } catch {
      alert('Failed to save activity. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Title *</label>
        <input type="text" value={title} onChange={e => setTitle(e.target.value)} required placeholder="e.g. Follow-up call with Sarah" className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent" />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Type *</label>
          <select value={activityType} onChange={e => setActivityType(e.target.value)} className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent bg-white">
            {TYPE_OPTIONS.map(t => <option key={t} value={t}>{t}</option>)}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Date *</label>
          <input type="date" value={date} onChange={e => setDate(e.target.value)} required className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent" />
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Contact</label>
          <select value={contactId} onChange={e => setContactId(e.target.value)} className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent bg-white">
            <option value="">None</option>
            {contacts.map(c => <option key={c.id} value={c.id}>{c.title}</option>)}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Deal</label>
          <select value={dealId} onChange={e => setDealId(e.target.value)} className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent bg-white">
            <option value="">None</option>
            {deals.map(d => <option key={d.id} value={d.id}>{d.title}</option>)}
          </select>
        </div>
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Notes</label>
        <textarea value={notes} onChange={e => setNotes(e.target.value)} rows={3} className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent resize-none" />
      </div>
      <div className="flex justify-end gap-3 pt-2">
        <button type="button" onClick={onClose} className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors">Cancel</button>
        <button type="submit" disabled={saving || !title.trim()} className="px-4 py-2 text-sm font-medium text-white bg-brand-600 hover:bg-brand-700 rounded-lg transition-colors disabled:opacity-50">{saving ? 'Saving...' : isEdit ? 'Update Activity' : 'Create Activity'}</button>
      </div>
    </form>
  );
}
