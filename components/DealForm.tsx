'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import type { Deal, Contact, Company } from '@/types';
import { getMetafieldValue } from '@/lib/cosmic';

interface DealFormProps {
  deal?: Deal;
  contacts: Contact[];
  companies: Company[];
  onClose: () => void;
}

const STAGE_OPTIONS = ['Prospecting', 'Discovery', 'Proposal', 'Negotiation', 'Closed Won', 'Closed Lost'];

export default function DealForm({ deal, contacts, companies, onClose }: DealFormProps) {
  const router = useRouter();
  const isEdit = !!deal;

  const [saving, setSaving] = useState(false);
  const [title, setTitle] = useState(deal?.title || '');
  const [value, setValue] = useState(deal?.metadata?.value?.toString() || '');
  const [stage, setStage] = useState(getMetafieldValue(deal?.metadata?.stage) || 'Prospecting');
  const [contactId, setContactId] = useState(deal?.metadata?.contact?.id || '');
  const [companyId, setCompanyId] = useState(deal?.metadata?.company?.id || '');
  const [closeDate, setCloseDate] = useState(deal?.metadata?.close_date ? new Date(deal.metadata.close_date).toISOString().split('T')[0] : '');
  const [notes, setNotes] = useState(getMetafieldValue(deal?.metadata?.notes) || '');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !value) return;
    setSaving(true);
    try {
      const metadata: Record<string, unknown> = {
        value: parseFloat(value),
        stage,
        close_date: closeDate || undefined,
        notes: notes.trim() || undefined,
      };
      if (contactId) metadata.contact = contactId;
      if (companyId) metadata.company = companyId;

      const url = isEdit ? `/api/deals/${deal.id}` : '/api/deals';
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
        alert('Failed to save deal. Please try again.');
      }
    } catch {
      alert('Failed to save deal. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Deal Name *</label>
        <input type="text" value={title} onChange={e => setTitle(e.target.value)} required className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent" />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Value ($) *</label>
          <input type="number" value={value} onChange={e => setValue(e.target.value)} required min="0" step="0.01" className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Stage *</label>
          <select value={stage} onChange={e => setStage(e.target.value)} className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent bg-white">
            {STAGE_OPTIONS.map(s => <option key={s} value={s}>{s}</option>)}
          </select>
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
          <label className="block text-sm font-medium text-gray-700 mb-1">Company</label>
          <select value={companyId} onChange={e => setCompanyId(e.target.value)} className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent bg-white">
            <option value="">None</option>
            {companies.map(c => <option key={c.id} value={c.id}>{c.title}</option>)}
          </select>
        </div>
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Expected Close Date</label>
        <input type="date" value={closeDate} onChange={e => setCloseDate(e.target.value)} className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent" />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Notes</label>
        <textarea value={notes} onChange={e => setNotes(e.target.value)} rows={3} className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent resize-none" />
      </div>
      <div className="flex justify-end gap-3 pt-2">
        <button type="button" onClick={onClose} className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors">Cancel</button>
        <button type="submit" disabled={saving || !title.trim() || !value} className="px-4 py-2 text-sm font-medium text-white bg-brand-600 hover:bg-brand-700 rounded-lg transition-colors disabled:opacity-50">{saving ? 'Saving...' : isEdit ? 'Update Deal' : 'Create Deal'}</button>
      </div>
    </form>
  );
}
