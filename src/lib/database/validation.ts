import { supabase } from '../supabase';
import { AppError } from '../../utils/error-handling';

export async function validateDatabaseSetup(): Promise<void> {
  try {
    // Test basic connection
    const { error: versionError } = await supabase.rpc('version');
    if (versionError) {
      throw new AppError(
        'Database connection failed',
        'DB_ERROR',
        500,
        versionError
      );
    }

    // Verify required tables
    const requiredTables = [
      'companies',
      'eves',
      'tasks',
      'documents',
      'subscriptions',
      'company_api_keys',
      'audit_logs'
    ];

    for (const table of requiredTables) {
      const { error: tableError } = await supabase
        .from(table)
        .select('count')
        .limit(1);

      // PGRST116 means table not found, which is okay during first run
      if (tableError && tableError.code !== 'PGRST116') {
        console.warn(`Table verification warning for ${table}:`, tableError);
      }
    }

    console.debug('Database validation completed');
  } catch (error) {
    console.error('Database validation failed:', error);
    throw error;
  }
}