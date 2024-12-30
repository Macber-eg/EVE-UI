import { supabase } from '../supabase';
import { AppError } from '../../utils/error-handling';
import { validateDatabaseSetup, validateDatabaseMigrations, validateDatabaseIndexes } from './validation';
import { dbPool } from './pool';

export class DatabaseHealth {
  private static instance: DatabaseHealth;
  private healthCheckInterval: NodeJS.Timer | null = null;
  private readonly HEALTH_CHECK_INTERVAL = 60000; // 1 minute

  private constructor() {}

  public static getInstance(): DatabaseHealth {
    if (!DatabaseHealth.instance) {
      DatabaseHealth.instance = new DatabaseHealth();
    }
    return DatabaseHealth.instance;
  }

  async checkHealth(): Promise<{
    status: 'healthy' | 'degraded' | 'unhealthy';
    details: Record<string, any>;
  }> {
    try {
      const [
        connectionStatus,
        poolStatus,
        migrationStatus,
        performanceMetrics
      ] = await Promise.all([
        this.checkConnection(),
        this.checkConnectionPool(),
        this.checkMigrations(),
        this.getPerformanceMetrics()
      ]);

      const status = this.determineOverallStatus({
        connectionStatus,
        poolStatus,
        migrationStatus,
        performanceMetrics
      });

      return {
        status,
        details: {
          connection: connectionStatus,
          pool: poolStatus,
          migrations: migrationStatus,
          performance: performanceMetrics,
          timestamp: new Date().toISOString()
        }
      };
    } catch (error) {
      console.error('Health check failed:', error);
      return {
        status: 'unhealthy',
        details: {
          error: error instanceof Error ? error.message : 'Unknown error',
          timestamp: new Date().toISOString()
        }
      };
    }
  }

  private async checkConnection(): Promise<{
    connected: boolean;
    latency?: number;
    error?: string;
  }> {
    const start = Date.now();
    try {
      const { data, error } = await supabase.rpc('version');
      if (error) throw error;
      
      return {
        connected: true,
        latency: Date.now() - start
      };
    } catch (error) {
      return {
        connected: false,
        latency: Date.now() - start,
        error: error instanceof Error ? error.message : 'Connection failed'
      };
    }
  }

  private async checkConnectionPool(): Promise<{
    total: number;
    idle: number;
    waiting: number;
    status: 'healthy' | 'degraded' | 'unhealthy';
  }> {
    try {
      const pool = await dbPool.query('SELECT * FROM pg_stat_activity');
      const total = pool.length;
      const idle = pool.filter((c: any) => c.state === 'idle').length;
      const waiting = pool.filter((c: any) => c.wait_event_type !== null).length;

      return {
        total,
        idle,
        waiting,
        status: this.determinePoolStatus(total, waiting)
      };
    } catch (error) {
      throw new AppError('Failed to check connection pool', 'DB_ERROR', 500);
    }
  }

  private async checkMigrations(): Promise<{
    status: 'up_to_date' | 'pending' | 'error';
    pendingMigrations?: string[];
  }> {
    try {
      const isValid = await validateDatabaseMigrations();
      if (!isValid) {
        const { data: migrations } = await supabase
          .from('_migrations')
          .select('name')
          .order('applied_at', { ascending: false });

        return {
          status: 'pending',
          pendingMigrations: migrations?.map(m => m.name) || []
        };
      }

      return { status: 'up_to_date' };
    } catch (error) {
      return {
        status: 'error',
        pendingMigrations: []
      };
    }
  }

  private async getPerformanceMetrics(): Promise<{
    queryLatency: number;
    activeConnections: number;
    cacheHitRatio: number;
  }> {
    try {
      const metrics = await dbPool.query(`
        SELECT 
          (SELECT AVG(EXTRACT(EPOCH FROM now() - query_start) * 1000)
           FROM pg_stat_activity 
           WHERE state = 'active'
          ) as avg_query_latency,
          (SELECT count(*) 
           FROM pg_stat_activity 
           WHERE state = 'active'
          ) as active_connections,
          (SELECT sum(heap_blks_hit) / (sum(heap_blks_hit) + sum(heap_blks_read))
           FROM pg_statio_user_tables
          ) as cache_hit_ratio
      `);

      return {
        queryLatency: metrics[0].avg_query_latency || 0,
        activeConnections: metrics[0].active_connections || 0,
        cacheHitRatio: metrics[0].cache_hit_ratio || 0
      };
    } catch (error) {
      throw new AppError('Failed to get performance metrics', 'DB_ERROR', 500);
    }
  }

  private determinePoolStatus(
    total: number,
    waiting: number
  ): 'healthy' | 'degraded' | 'unhealthy' {
    const waitingRatio = waiting / total;
    if (waitingRatio > 0.5) return 'unhealthy';
    if (waitingRatio > 0.2) return 'degraded';
    return 'healthy';
  }

  private determineOverallStatus(metrics: any): 'healthy' | 'degraded' | 'unhealthy' {
    if (!metrics.connectionStatus.connected) return 'unhealthy';
    if (metrics.poolStatus.status === 'unhealthy') return 'unhealthy';
    if (metrics.migrationStatus.status === 'error') return 'unhealthy';
    if (metrics.poolStatus.status === 'degraded') return 'degraded';
    if (metrics.migrationStatus.status === 'pending') return 'degraded';
    return 'healthy';
  }

  startHealthCheck(): void {
    if (this.healthCheckInterval) return;
    
    this.healthCheckInterval = setInterval(async () => {
      const health = await this.checkHealth();
      console.debug('Database health status:', health);
      
      if (health.status === 'unhealthy') {
        console.error('Database health check failed:', health.details);
        // Implement alert/notification system here
      }
    }, this.HEALTH_CHECK_INTERVAL);
  }

  stopHealthCheck(): void {
    if (this.healthCheckInterval) {
      clearInterval(this.healthCheckInterval);
      this.healthCheckInterval = null;
    }
  }
}

export const databaseHealth = DatabaseHealth.getInstance();