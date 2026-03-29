// Base Cosmic object interface
export interface CosmicObject {
  id: string;
  slug: string;
  title: string;
  content?: string;
  metadata: Record<string, unknown>;
  type: string;
  created_at: string;
  modified_at: string;
}

// Contact object
export interface Contact extends CosmicObject {
  type: 'contacts';
  metadata: {
    first_name?: string;
    last_name?: string;
    email?: string;
    phone?: string;
    company?: Company;
    status?: ContactStatus;
    source?: ContactSource;
    notes?: string;
  };
}

// Company object
export interface Company extends CosmicObject {
  type: 'companies';
  metadata: {
    industry?: string;
    website?: string;
    size?: string;
    address?: string;
    notes?: string;
  };
}

// Deal object
export interface Deal extends CosmicObject {
  type: 'deals';
  metadata: {
    value?: number;
    stage?: DealStage;
    contact?: Contact;
    company?: Company;
    close_date?: string;
    notes?: string;
  };
}

// Activity object
export interface Activity extends CosmicObject {
  type: 'activities';
  metadata: {
    activity_type?: ActivityType;
    date?: string;
    contact?: Contact;
    deal?: Deal;
    notes?: string;
  };
}

// Type literals for select values
export type ContactStatus = 'Active' | 'Inactive' | 'Lead' | 'Prospect';
export type ContactSource = 'Website' | 'Referral' | 'Social Media' | 'Cold Call' | 'Email Campaign' | 'Event' | 'Other';
export type DealStage = 'Lead' | 'Qualified' | 'Proposal' | 'Negotiation' | 'Closed Won' | 'Closed Lost';
export type ActivityType = 'Call' | 'Email' | 'Meeting' | 'Note' | 'Task';

// Cosmic API response
export interface CosmicResponse<T> {
  objects: T[];
  total: number;
  limit: number;
  skip: number;
}

// Dashboard metrics
export interface DashboardMetrics {
  totalContacts: number;
  totalCompanies: number;
  totalDeals: number;
  totalRevenue: number;
  dealsByStage: Record<string, Deal[]>;
  recentActivities: Activity[];
}

// Type guard helper
export function hasStatus(error: unknown): error is { status: number } {
  return typeof error === 'object' && error !== null && 'status' in error;
}