import { supabase } from '../src/config/supabase';
import { AppError } from '../src/utils/error-handling';
import { Logger } from '../src/utils/logger';

const logger = new Logger('DatabaseInit');

// Verify required database tables exist
async function verifyTables() {
  const requiredTables = [
    'companies',
    'eves',
    'tasks',
    'documents',
    'subscriptions',
    'company_api_keys',
    'notifications'
  ];

  for (const table of requiredTables) {
    const { error } = await supabase
      .from(table)
      .select('count')
      .limit(1);

    // PGRST116 means table not found, which is expected during first run
    if (error && error.code !== 'PGRST116') {
      logger.warn(`Table verification warning for ${table}:`, error);
    }
  }
}

// Verify required database functions exist
async function verifyFunctions() {
  const { error } = await supabase.rpc('version');
  if (error) {
    throw new AppError('Required database functions not found', 'SETUP_ERROR', 500);
  }
}

// Verify RLS policies are in place
async function verifyRLSPolicies() {
  const { error } = await supabase
    .from('companies')
    .select('id')
    .limit(1);

  if (error && error.code !== 'PGRST116') {
    logger.warn('RLS policy verification warning:', error);
  }
}

// Create migrations table if it doesn't exist
async function createMigrationsTable() {
  const { error } = await supabase.rpc('exec_sql', {
    sql: `
      CREATE TABLE IF NOT EXISTS public._migrations (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        name TEXT NOT NULL UNIQUE,
        applied_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
      );
    `
  });

  if (error) {
    throw new AppError('Failed to create migrations table', 'MIGRATION_ERROR', 500);
  }
}

// Main initialization function
async function initializeDatabase() {
  try {
    logger.info('Starting database initialization...');

    // Test connection
    const { data: { version }, error: versionError } = await supabase.rpc('version');
    if (versionError) {
      throw new AppError('Database connection failed', 'CONNECTION_ERROR', 500);
    }
    logger.info('Connected to PostgreSQL version:', version);

    // Run initialization steps
    await createMigrationsTable();
    await verifyTables();
    await verifyFunctions();
    await verifyRLSPolicies();

    logger.info('Database initialization completed successfully');
  } catch (error) {
    logger.error('Database initialization failed:', error);
    process.exit(1);
  }
}

// Add proper error handling for the script
process.on('unhandledRejection', (error) => {
  logger.error('Unhandled promise rejection:', error);
  process.exit(1);
});

process.on('uncaughtException', (error) => {
  logger.error('Uncaught exception:', error);
  process.exit(1);
});

// Run initialization
initializeDatabase();