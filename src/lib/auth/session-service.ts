import { supabase } from '../supabase';
import { TokenService } from './token-service';
import { TimerService } from './timer-service';
import { AppError } from '../../utils/error-handling';

export class SessionService {
  private static instance: SessionService;
  private tokenService: TokenService;
  private timerService: TimerService;
  private refreshing: boolean = false;

  private constructor() {
    this.tokenService = TokenService.getInstance();
    this.timerService = TimerService.getInstance();
  }

  public static getInstance(): SessionService {
    if (!SessionService.instance) {
      SessionService.instance = new SessionService();
    }
    return SessionService.instance;
  }

  public async getCurrentSession() {
    try {
      const { data: { session }, error } = await supabase.auth.getSession();
      
      if (error) throw error;
      
      if (session?.access_token) {
        this.tokenService.setTokens(session.access_token, session.refresh_token);
        this.scheduleRefresh(session.access_token);
      }

      return session;
    } catch (error) {
      console.error('Get session error:', error);
      throw new AppError('Failed to get current session', 'AUTH_ERROR', 401);
    }
  }

  private async scheduleRefresh(token: string) {
    try {
      const payload = await this.tokenService.verifyToken(token);
      const expiresIn = (payload.exp * 1000) - Date.now();
      const refreshTime = expiresIn - (5 * 60 * 1000); // 5 minutes before expiry

      if (refreshTime > 0) {
        this.timerService.setTimer(
          'session_refresh',
          () => this.refreshSession(),
          refreshTime
        );
      } else {
        await this.refreshSession();
      }
    } catch (error) {
      console.warn('Session refresh scheduling failed:', error);
      this.tokenService.clearTokens();
    }
  }

  public async refreshSession() {
    if (this.refreshing) return;
    this.refreshing = true;

    try {
      const { data: { session }, error } = await supabase.auth.refreshSession();
      
      if (error || !session) {
        throw new Error('Session refresh failed');
      }

      this.tokenService.setTokens(session.access_token, session.refresh_token);
      this.scheduleRefresh(session.access_token);

      return session;
    } catch (error) {
      console.error('Session refresh failed:', error);
      this.tokenService.clearTokens();
      window.location.href = '/auth';
    } finally {
      this.refreshing = false;
    }
  }
}

export const sessionService = SessionService.getInstance();