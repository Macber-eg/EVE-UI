// Base type definitions
export interface DatabaseTable<T> {
  Row: T;
  Insert: Partial<T>;
  Update: Partial<T>;
}

export interface DatabaseConfig {
  url: string;
  key: string;
  schema?: string;
  maxRetries?: number;
  retryDelay?: number;
}

export interface DatabaseOptions {
  schema?: string;
  maxRetries?: number;
  retryDelay?: number;
}

export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];