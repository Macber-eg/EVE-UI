import { Pool } from 'pg';
import { environmentService } from '../../config/environment';
import { AppError } from '../../utils/error-handling';

class DatabasePool {
  private static instance: DatabasePool;
  private pool: Pool;
  private initialized: boolean = false;

  private constructor() {
    const url = environmentService.get('SUPABASE_URL');
    if (!url) {
      throw new AppError('Missing database configuration', 'CONFIG_ERROR', 500);
    }

    this.pool = new Pool({
      connectionString: url,
      ssl: {
        rejectUnauthorized: false
      },
      max: 20,
      idleTimeoutMillis: 30000,
      connectionTimeoutMillis: 2000,
    });

    this.setupErrorHandling();
  }

  private setupErrorHandling() {
    this.pool.on('error', (err) => {
      console.error('Unexpected error on idle client', err);
      throw new AppError('Database connection error', 'DB_ERROR', 500);
    });

    this.pool.on('connect', () => {
      console.debug('New database connection established');
    });
  }

  public static getInstance(): DatabasePool {
    if (!DatabasePool.instance) {
      DatabasePool.instance = new DatabasePool();
    }
    return DatabasePool.instance;
  }

  public async initialize(): Promise<void> {
    if (this.initialized) return;

    try {
      // Test connection
      const client = await this.pool.connect();
      await client.query('SELECT NOW()');
      client.release();
      this.initialized = true;
      console.debug('Database pool initialized successfully');
    } catch (error) {
      console.error('Failed to initialize database pool:', error);
      throw new AppError('Database initialization failed', 'DB_ERROR', 500);
    }
  }

  public async query<T = any>(
    text: string,
    params?: any[],
    options?: { singleRow?: boolean }
  ): Promise<T> {
    if (!this.initialized) {
      await this.initialize();
    }

    const client = await this.pool.connect();
    try {
      const result = await client.query(text, params);
      return options?.singleRow ? result.rows[0] : result.rows;
    } catch (error) {
      console.error('Query error:', error);
      throw new AppError(
        'Database query failed',
        'DB_ERROR',
        500,
        { query: text, params }
      );
    } finally {
      client.release();
    }
  }

  public async transaction<T>(
    callback: (client: any) => Promise<T>
  ): Promise<T> {
    const client = await this.pool.connect();
    try {
      await client.query('BEGIN');
      const result = await callback(client);
      await client.query('COMMIT');
      return result;
    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }
  }

  public async end(): Promise<void> {
    await this.pool.end();
    this.initialized = false;
  }
}

export const dbPool = DatabasePool.getInstance();