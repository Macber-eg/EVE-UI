import { User } from '@supabase/supabase-js';
import { supabase } from '../supabase';
import { TokenService } from './token-service';
import { SessionService } from './session-service';
import { AppError } from '../../utils/error-handling';

export class AuthService {
  private static instance: AuthService;
  private tokenService: TokenService;
  private sessionService: SessionService;

  private constructor() {
    this.tokenService = TokenService.getInstance();
    this.sessionService = SessionService.getInstance();
  }

  public static getInstance(): AuthService {
    if (!AuthService.instance) {
      AuthService.instance = new AuthService();
    }
    return AuthService.instance;
  }

  public async signIn(email: string, password: string): Promise<{ user: User | null; error: Error | null }> {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email.trim().toLowerCase(),
        password
      });

      if (error) {
        throw new AppError(
          error.message === 'Invalid login credentials' 
            ? 'Invalid email or password' 
            : error.message,
          'AUTH_ERROR',
          401
        );
      }

      if (!data.user?.email_confirmed_at) {
        throw new AppError('Please confirm your email address before signing in', 'AUTH_ERROR', 401);
      }

      if (data?.session) {
        this.tokenService.setTokens(
          data.session.access_token,
          data.session.refresh_token
        );
      }

      return { user: data?.user || null, error: null };
    } catch (error) {
      console.error('Sign in error:', error);
      return { user: null, error: error as Error };
    }
  }

  public async signUp(email: string, password: string): Promise<{ user: User | null; error: Error | null }> {
    try {
      const { data, error } = await supabase.auth.signUp({
        email: email.trim().toLowerCase(),
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/callback`,
          data: {
            created_at: new Date().toISOString()
          }
        }
      });

      if (error) {
        throw new AppError(
          error.message === 'User already registered'
            ? 'An account with this email already exists'
            : error.message,
          'AUTH_ERROR',
          400
        );
      }

      // Don't set tokens until email is confirmed
      return { user: data?.user || null, error: null };
    } catch (error) {
      console.error('Sign up error:', error);
      return { user: null, error: error as Error };
    }
  }

  public async signOut(): Promise<void> {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      this.tokenService.clearTokens();
    } catch (error) {
      console.error('Sign out error:', error);
      throw error;
    }
  }

  public async getCurrentSession() {
    return this.sessionService.getCurrentSession();
  }

  public async refreshSession() {
    return this.sessionService.refreshSession();
  }

  public isAuthenticated(): boolean {
    return this.tokenService.hasValidToken();
  }
}

export const authService = AuthService.getInstance();