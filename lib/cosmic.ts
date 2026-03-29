import { createBucketClient } from '@cosmicjs/sdk';
import type { Contact, Company, Deal, Activity, hasStatus as HasStatusType } from '@/types';
import { hasStatus } from '@/types';

export const cosmic = createBucketClient({
  bucketSlug: process.env.COSMIC_BUCKET_SLUG as string,
  readKey: process.env.COSMIC_READ_KEY as string,
  writeKey: process.env.COSMIC_WRITE_KEY as string,
  apiEnvironment: 'staging',
});

// Helper to safely extract metafield values that might be objects
export function getMetafieldValue(field: unknown): string {
  if (field === null || field === undefined) return '';
  if (typeof field === 'string') return field;
  if (typeof field === 'number' || typeof field === 'boolean') return String(field);
  if (typeof field === 'object' && field !== null && 'value' in field) {
    return String((field as { value: unknown }).value);
  }
  if (typeof field === 'object' && field !== null && 'key' in field) {
    return String((field as { key: unknown }).key);
  }
  return '';
}

// Fetch all contacts
export async function getContacts(): Promise<Contact[]> {
  try {
    const response = await cosmic.objects
      .find({ type: 'contacts' })
      .props(['id', 'title', 'slug', 'metadata', 'created_at', 'modified_at'])
      .depth(1);
    return response.objects as Contact[];
  } catch (error: unknown) {
    if (hasStatus(error) && error.status === 404) {
      return [];
    }
    throw new Error('Failed to fetch contacts');
  }
}

// Fetch single contact by slug
export async function getContactBySlug(slug: string): Promise<Contact | null> {
  try {
    const response = await cosmic.objects
      .findOne({ type: 'contacts', slug })
      .props(['id', 'title', 'slug', 'metadata', 'created_at', 'modified_at'])
      .depth(1);
    return response.object as Contact;
  } catch (error: unknown) {
    if (hasStatus(error) && error.status === 404) {
      return null;
    }
    throw new Error('Failed to fetch contact');
  }
}

// Fetch all companies
export async function getCompanies(): Promise<Company[]> {
  try {
    const response = await cosmic.objects
      .find({ type: 'companies' })
      .props(['id', 'title', 'slug', 'metadata', 'created_at', 'modified_at'])
      .depth(1);
    return response.objects as Company[];
  } catch (error: unknown) {
    if (hasStatus(error) && error.status === 404) {
      return [];
    }
    throw new Error('Failed to fetch companies');
  }
}

// Fetch single company by slug
export async function getCompanyBySlug(slug: string): Promise<Company | null> {
  try {
    const response = await cosmic.objects
      .findOne({ type: 'companies', slug })
      .props(['id', 'title', 'slug', 'metadata', 'created_at', 'modified_at'])
      .depth(1);
    return response.object as Company;
  } catch (error: unknown) {
    if (hasStatus(error) && error.status === 404) {
      return null;
    }
    throw new Error('Failed to fetch company');
  }
}

// Fetch all deals
export async function getDeals(): Promise<Deal[]> {
  try {
    const response = await cosmic.objects
      .find({ type: 'deals' })
      .props(['id', 'title', 'slug', 'metadata', 'created_at', 'modified_at'])
      .depth(1);
    return response.objects as Deal[];
  } catch (error: unknown) {
    if (hasStatus(error) && error.status === 404) {
      return [];
    }
    throw new Error('Failed to fetch deals');
  }
}

// Fetch single deal by slug
export async function getDealBySlug(slug: string): Promise<Deal | null> {
  try {
    const response = await cosmic.objects
      .findOne({ type: 'deals', slug })
      .props(['id', 'title', 'slug', 'metadata', 'created_at', 'modified_at'])
      .depth(1);
    return response.object as Deal;
  } catch (error: unknown) {
    if (hasStatus(error) && error.status === 404) {
      return null;
    }
    throw new Error('Failed to fetch deal');
  }
}

// Fetch all activities
export async function getActivities(): Promise<Activity[]> {
  try {
    const response = await cosmic.objects
      .find({ type: 'activities' })
      .props(['id', 'title', 'slug', 'metadata', 'created_at', 'modified_at'])
      .depth(2);
    const activities = response.objects as Activity[];
    return activities.sort((a, b) => {
      const dateA = new Date(a.metadata?.date || a.created_at).getTime();
      const dateB = new Date(b.metadata?.date || b.created_at).getTime();
      return dateB - dateA;
    });
  } catch (error: unknown) {
    if (hasStatus(error) && error.status === 404) {
      return [];
    }
    throw new Error('Failed to fetch activities');
  }
}

// Fetch single activity by slug
export async function getActivityBySlug(slug: string): Promise<Activity | null> {
  try {
    const response = await cosmic.objects
      .findOne({ type: 'activities', slug })
      .props(['id', 'title', 'slug', 'metadata', 'created_at', 'modified_at'])
      .depth(2);
    return response.object as Activity;
  } catch (error: unknown) {
    if (hasStatus(error) && error.status === 404) {
      return null;
    }
    throw new Error('Failed to fetch activity');
  }
}