import { z } from 'zod';

// Base types
export interface DatabaseTable<T> {
  Row: T;
  Insert: Partial<T>;
  Update: Partial<T>;
}

// Database schema
export interface Database {
  public: {
    Tables: {
      companies: DatabaseTable<{
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
      }>;
      // Add other tables here...
    };
    Functions: Record<string, never>;
    Enums: Record<string, never>;
  };
}

// Configuration types
export interface DatabaseConfig {
  url: string;
  key: string;
  schema?: string;
  maxRetries?: number;
  retryDelay?: number;
}

export const DatabaseConfigSchema = z.object({
  url: z.string().url('Invalid database URL'),
  key: z.string().min(1, 'Database key is required'),
  schema: z.string().optional(),
  maxRetries: z.number().min(0).optional(),
  retryDelay: z.number().min(0).optional()
});