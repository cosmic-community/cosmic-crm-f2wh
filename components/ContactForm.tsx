'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import type { Contact, Company } from '@/types';
import { getMetafieldValue } from '@/lib/cosmic';

interface ContactFormProps {
  contact?: Contact;
  companies: Company[];
  onClose: () => void;
}

const STATUS_OPTIONS = ['Lead', 'Qualified', 'Customer', 'Churned', 'Inactive'];
const SOURCE_OPTIONS = ['Website', 'Referral', 'LinkedIn', 'Cold Outreach', 'Event', 'Other'];

export default function ContactForm({ contact, companies, onClose }: ContactFormProps) {
  const router = useRouter();
  const isEdit = !!contact;

  const [saving, setSaving] = useState(false);
  const [firstName, setFirstName] = useState(getMetafieldValue(contact?.metadata?.first_name) || '');
  const [lastName, setLastName] = useState(getMetafieldValue(contact?.metadata?.last_name) || '');
  const [email, setEmail] = useState(getMetafieldValue(contact?.metadata?.email) || '');
  const [phone, setPhone] = useState(getMetafieldValue(contact?.metadata?.phone) || '');
  const [status, setStatus] = useState(getMetafieldValue(contact?.metadata?.status) || 'Lead');
  const [source, setSource] = useState(getMetafieldValue(contact?.metadata?.source) || '');
  const [companyId, setCompanyId] = useState(contact?.metadata?.company?.id || '');
  const [notes, setNotes] = useState(getMetafieldValue(contact?.metadata?.notes) || '');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!firstName.trim() || !lastName.trim()) return;
    setSaving(true);
    try {
      const title = `${firstName.trim()} ${lastName.trim()}`;
      const metadata: Record<string, unknown> = {
        first_name: firstName.trim(),
        last_name: lastName.trim(),
        email: email.trim(),
        phone: phone.trim(),
        status,
        source: source || undefined,
        notes: notes.trim() || undefined,
      };
      if (companyId) metadata.company = companyId;

      const url = isEdit ? `/api/contacts/${contact.id}` : '/api/contacts';
      const method = isEdit ? 'PUT' : 'POST';
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, metadata }),
      });
      if (res.ok) {
        onClose();
        router.refresh();
      } else {
        alert('Failed to save contact. Please try again.');
      }
    } catch {
      alert('Failed to save contact. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">First Name *</label>
          <input type="text" value={firstName} onChange={e => setFirstName(e.target.value)} required className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Last Name *</label>
          <input type="text" value={lastName} onChange={e => setLastName(e.target.value)} required className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent" />
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
          <input type="email" value={email} onChange={e => setEmail(e.target.value)} className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
          <input type="tel" value={phone} onChange={e => setPhone(e.target.value)} className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent" />
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
          <select value={status} onChange={e => setStatus(e.target.value)} className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent bg-white">
            {STATUS_OPTIONS.map(s => <option key={s} value={s}>{s}</option>)}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Source</label>
          <select value={source} onChange={e => setSource(e.target.value)} className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent bg-white">
            <option value="">Select...</option>
            {SOURCE_OPTIONS.map(s => <option key={s} value={s}>{s}</option>)}
          </select>
        </div>
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Company</label>
        <select value={companyId} onChange={e => setCompanyId(e.target.value)} className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent bg-white">
          <option value="">No company</option>
          {companies.map(c => <option key={c.id} value={c.id}>{c.title}</option>)}
        </select>
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Notes</label>
        <textarea value={notes} onChange={e => setNotes(e.target.value)} rows={3} className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent resize-none" />
      </div>
      <div className="flex justify-end gap-3 pt-2">
        <button type="button" onClick={onClose} className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors">Cancel</button>
        <button type="submit" disabled={saving || !firstName.trim() || !lastName.trim()} className="px-4 py-2 text-sm font-medium text-white bg-brand-600 hover:bg-brand-700 rounded-lg transition-colors disabled:opacity-50">{saving ? 'Saving...' : isEdit ? 'Update Contact' : 'Create Contact'}</button>
      </div>
    </form>
  );
}
