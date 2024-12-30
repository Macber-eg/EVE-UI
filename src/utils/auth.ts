import * as jose from 'jose';
import { z } from 'zod';
import { AppError } from './error-handling';
import { supabase } from '../lib/supabase';

const TOKEN_KEY = 'auth_token';
const REFRESH_TOKEN_KEY = 'refresh_token';

// Validate token payload
const TokenPayloadSchema = z.object({
  sub: z.string(),
  email: z.string().email(),
  exp: z.number(),
  iat: z.number(),
});

export class AuthService {
  private static instance: AuthService;
  private refreshTimeout?: NodeJS.Timeout;
  private refreshing: boolean = false;

  private constructor() {
    // Initialize refresh token check
    this.setupTokenRefresh();
  }

  public static getInstance(): AuthService {
    if (!AuthService.instance) {
      AuthService.instance = new AuthService();
    }
    return AuthService.instance;
  }

  private setupTokenRefresh() {
    const token = this.getToken();
    if (token) {
      this.scheduleTokenRefresh(token);
    }
  }

  private async scheduleTokenRefresh(token: string) {
    try {
      const payload = await this.verifyToken(token);
      const expiresIn = (payload.exp * 1000) - Date.now();
      const refreshTime = expiresIn - (5 * 60 * 1000); // 5 minutes before expiry

      if (refreshTime > 0) {
        this.refreshTimeout = setTimeout(() => this.refreshToken(), refreshTime);
      } else {
        // Token is already expired or close to expiry, refresh now
        await this.refreshToken();
      }
    } catch (error) {
      console.warn('Token refresh scheduling failed:', error);
      this.clearTokens();
    }
  }

  private async refreshToken() {
    if (this.refreshing) return;
    this.refreshing = true;

    try {
      const refreshToken = localStorage.getItem(REFRESH_TOKEN_KEY);
      if (!refreshToken) throw new Error('No refresh token available');

      const { data: { session }, error } = await supabase.auth.refreshSession();
      
      if (error || !session) {
        throw new Error('Token refresh failed');
      }

      this.setTokens(session.access_token, session.refresh_token);
      this.scheduleTokenRefresh(session.access_token);
    } catch (error) {
      console.error('Token refresh failed:', error);
      this.clearTokens();
      window.location.href = '/auth'; // Redirect to login
    } finally {
      this.refreshing = false;
    }
  }

  public async verifyToken(token: string) {
    try {
      const { payload } = await jose.jwtVerify(
        token,
        new TextEncoder().encode(import.meta.env.VITE_SUPABASE_JWT_SECRET || 'your-fallback-secret')
      );
      
      return TokenPayloadSchema.parse(payload);
    } catch (error) {
      throw new AppError('Invalid token', 'AUTH_ERROR', 401);
    }
  }

  public setTokens(token: string, refreshToken: string) {
    localStorage.setItem(TOKEN_KEY, token);
    localStorage.setItem(REFRESH_TOKEN_KEY, refreshToken);
    this.scheduleTokenRefresh(token);
  }

  public getToken(): string | null {
    return localStorage.getItem(TOKEN_KEY);
  }

  public clearTokens() {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(REFRESH_TOKEN_KEY);
    if (this.refreshTimeout) {
      clearTimeout(this.refreshTimeout);
    }
  }

  public isAuthenticated(): boolean {
    const token = this.getToken();
    if (!token) return false;

    try {
      const payload = jose.decodeJwt(token);
      return payload.exp ? payload.exp * 1000 > Date.now() : false;
    } catch {
      return false;
    }
  }
}

export const authService = AuthService.getInstance();