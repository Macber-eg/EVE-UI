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