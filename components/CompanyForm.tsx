'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import type { Company } from '@/types';
import { getMetafieldValue } from '@/lib/cosmic';

interface CompanyFormProps {
  company?: Company;
  onClose: () => void;
}

const INDUSTRY_OPTIONS = ['Technology', 'Finance', 'Healthcare', 'Education', 'Retail', 'Manufacturing', 'Consulting', 'Other'];
const SIZE_OPTIONS = ['1-10', '11-50', '51-200', '201-1000', '1000+'];

export default function CompanyForm({ company, onClose }: CompanyFormProps) {
  const router = useRouter();
  const isEdit = !!company;

  const [saving, setSaving] = useState(false);
  const [name, setName] = useState(company?.title || '');
  const [industry, setIndustry] = useState(getMetafieldValue(company?.metadata?.industry) || '');
  const [website, setWebsite] = useState(getMetafieldValue(company?.metadata?.website) || '');
  const [size, setSize] = useState(getMetafieldValue(company?.metadata?.size) || '');
  const [address, setAddress] = useState(getMetafieldValue(company?.metadata?.address) || '');
  const [notes, setNotes] = useState(getMetafieldValue(company?.metadata?.notes) || '');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    setSaving(true);
    try {
      const metadata: Record<string, unknown> = {
        industry: industry || undefined,
        website: website.trim() || undefined,
        size: size || undefined,
        address: address.trim() || undefined,
        notes: notes.trim() || undefined,
      };

      const url = isEdit ? `/api/companies/${company.id}` : '/api/companies';
      const method = isEdit ? 'PUT' : 'POST';
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: name.trim(), metadata }),
      });
      if (res.ok) {
        onClose();
        router.refresh();
      } else {
        alert('Failed to save company. Please try again.');
      }
    } catch {
      alert('Failed to save company. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Company Name *</label>
        <input type="text" value={name} onChange={e => setName(e.target.value)} required className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent" />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Industry</label>
          <select value={industry} onChange={e => setIndustry(e.target.value)} className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent bg-white">
            <option value="">Select...</option>
            {INDUSTRY_OPTIONS.map(i => <option key={i} value={i}>{i}</option>)}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Size</label>
          <select value={size} onChange={e => setSize(e.target.value)} className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent bg-white">
            <option value="">Select...</option>
            {SIZE_OPTIONS.map(s => <option key={s} value={s}>{s}</option>)}
          </select>
        </div>
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Website</label>
        <input type="text" value={website} onChange={e => setWebsite(e.target.value)} placeholder="https://" className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent" />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
        <textarea value={address} onChange={e => setAddress(e.target.value)} rows={2} className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent resize-none" />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Notes</label>
        <textarea value={notes} onChange={e => setNotes(e.target.value)} rows={3} className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent resize-none" />
      </div>
      <div className="flex justify-end gap-3 pt-2">
        <button type="button" onClick={onClose} className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors">Cancel</button>
        <button type="submit" disabled={saving || !name.trim()} className="px-4 py-2 text-sm font-medium text-white bg-brand-600 hover:bg-brand-700 rounded-lg transition-colors disabled:opacity-50">{saving ? 'Saving...' : isEdit ? 'Update Company' : 'Create Company'}</button>
      </div>
    </form>
  );
}
