import { databaseClient } from './client';
import { AppError } from '../../utils/error-handling';
import { MigrationError } from './errors';

export class MigrationService {
  private static instance: MigrationService;
  private retryAttempts = 3;
  private retryDelay = 1000;
  private client;

  private constructor() {
    this.client = null;
  }

  public static getInstance(): MigrationService {
    if (!MigrationService.instance) {
      MigrationService.instance = new MigrationService();
    }
    return MigrationService.instance;
  }

  private async getClient() {
    if (!this.client) {
      await databaseClient.initialize();
      this.client = databaseClient.getClient();
    }
    return this.client;
  }

  async setupBaseFunctions(): Promise<void> {
    try {
      console.debug('Starting base functions setup...');
      const client = await this.getClient();

      // First try to verify if functions already exist
      const functionsExist = await this.verifyBaseFunctions();
      if (functionsExist) {
        console.debug('Base functions already exist');
        return;
      }

      // Create functions using direct SQL
      const setupSql = `
        DO $$ 
        BEGIN
          -- Create version function if it doesn't exist
          CREATE OR REPLACE FUNCTION public.version()
          RETURNS text AS $$
          BEGIN
              RETURN current_setting('server_version');
          END;
          $$ LANGUAGE plpgsql SECURITY DEFINER;

          -- Grant permissions for version function
          GRANT EXECUTE ON FUNCTION public.version() TO authenticated;
          GRANT EXECUTE ON FUNCTION public.version() TO anon;

          -- Create exec_sql function if it doesn't exist
          CREATE OR REPLACE FUNCTION public.exec_sql(sql text) 
          RETURNS void AS $$
          BEGIN
              EXECUTE sql;
          END;
          $$ LANGUAGE plpgsql SECURITY DEFINER;

          -- Grant permissions for exec_sql function
          GRANT EXECUTE ON FUNCTION public.exec_sql(text) TO authenticated;
          GRANT EXECUTE ON FUNCTION public.exec_sql(text) TO anon;
        END $$;
      `;

      // Execute setup using direct fetch to avoid RPC
      const response = await fetch(`${client.supabaseUrl}/rest/v1/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${client.supabaseKey}`,
          'apikey': client.supabaseKey,
          'Prefer': 'return=minimal'
        },
        body: JSON.stringify({ query: setupSql })
      });

      if (!response.ok) {
        throw new Error(`Failed to execute base setup: ${response.statusText}`);
      }

      // Verify functions were created successfully
      const verified = await this.verifyBaseFunctions();
      if (!verified) {
        throw new Error('Failed to verify base functions after creation');
      }

      console.debug('Base functions setup completed successfully');
    } catch (error) {
      console.error('Failed to create base functions:', error);
      throw new MigrationError('Failed to create base database functions', error);
    }
  }

  async runPendingMigrations(): Promise<void> {
    try {
      const client = await this.getClient();
      
      // Create migrations table if it doesn't exist
      await client.rpc('exec_sql', {
        sql: `
          CREATE TABLE IF NOT EXISTS public._migrations (
            id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
            name TEXT NOT NULL UNIQUE,
            applied_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
          );
        `
      });

      // Get list of applied migrations
      const { data: appliedMigrations } = await client
        .from('_migrations')
        .select('name')
        .order('applied_at', { ascending: true });

      const appliedNames = new Set(appliedMigrations?.map(m => m.name) || []);

      // Run any pending migrations
      console.debug('Checking for pending migrations...');
      
      // Migrations will be handled by Supabase directly
      console.debug('Migrations are managed by Supabase');

    } catch (error) {
      console.error('Failed to run migrations:', error);
      throw new MigrationError('Failed to run database migrations', error);
    }
  }

  private async verifyBaseFunctions(): Promise<boolean> {
    const client = await this.getClient();
    try {
      // Try to call version function
      const { data: versionData, error: versionError } = await client.rpc('version');
      if (versionError) {
        console.debug('Version function verification failed:', versionError);
        return false;
      }

      // Try to call exec_sql function with a simple query
      const { error: execError } = await client.rpc('exec_sql', {
        sql: 'SELECT 1;'
      });
      if (execError) {
        console.debug('Exec_sql function verification failed:', execError);
        return false;
      }

      return true;
    } catch (error) {
      console.debug('Function verification failed:', error);
      return false;
    }
  }
}

export const migrationService = MigrationService.getInstance();