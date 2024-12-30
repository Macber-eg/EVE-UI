// Database table definitions
import { DatabaseTable } from './base';

export interface CompanyTable extends DatabaseTable<{
  id: string;
  name: string;
  type: 'corporation' | 'llc' | 'nonprofit';
  jurisdiction: string;
  status: 'pending' | 'active' | 'paused' | 'terminated';
  owner_id: string;
  contact: {
    email: string;
    phone?: string;
  };
  settings: {
    industry: string;
    autonomy_level: 'full' | 'high' | 'medium' | 'low';
    human_oversight_required: string[];
    notification_preferences: {
      email: boolean;
      push: boolean;
      urgency_threshold: 'low' | 'medium' | 'high' | 'critical';
    };
  };
  created_at: string;
  updated_at: string;
}> {}

export interface EVETable extends DatabaseTable<{
  id: string;
  company_id: string;
  name: string;
  role: string;
  type: 'orchestrator' | 'specialist' | 'support';
  status: 'active' | 'busy' | 'idle';
  capabilities: string[];
  parent_id?: string;
  performance: {
    efficiency: number;
    accuracy: number;
    tasks_completed: number;
  };
  models: Array<{
    provider: 'openai' | 'anthropic';
    model: string;
    purpose: string;
  }>;
  created_at: string;
  updated_at: string;
}> {}

export interface TaskTable extends DatabaseTable<{
  id: string;
  company_id: string;
  title: string;
  description: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  status: 'pending' | 'scheduled' | 'in_progress' | 'completed' | 'failed' | 'cancelled';
  assigned_to: string;
  created_by: string;
  created_at: string;
  scheduled_for?: string;
  started_at?: string;
  completed_at?: string;
  deadline?: string;
  dependencies?: string[];
  result?: any;
  error?: string;
  metadata: {
    type: 'analysis' | 'communication' | 'decision' | 'action';
    category?: string;
    tags?: string[];
    required_capabilities?: string[];
    estimated_duration?: number;
    retry_count?: number;
    max_retries?: number;
    context?: Record<string, any>;
  };
}> {}

export interface SubscriptionTable extends DatabaseTable<{
  id: string;
  company_id: string;
  stripe_customer_id: string;
  stripe_subscription_id: string;
  tier: 'starter' | 'growth' | 'enterprise';
  status: 'active' | 'canceled' | 'past_due' | 'trialing';
  current_period_start: string;
  current_period_end: string;
  cancel_at_period_end: boolean;
  trial_end?: string;
  features: {
    max_eves: number;
    max_users: number;
    max_storage_gb: number;
    features: string[];
  };
  created_at: string;
  updated_at: string;
}> {}