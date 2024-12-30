import * as jose from 'jose';
import { z } from 'zod';
import { AppError } from '../../utils/error-handling';
import { timerService } from './timer-service';

const TokenPayloadSchema = z.object({
  sub: z.string(),
  email: z.string().email(),
  exp: z.number(),
  iat: z.number(),
});

export class TokenService {
  private static instance: TokenService;
  private readonly TOKEN_KEY = 'auth_token';
  private readonly REFRESH_TOKEN_KEY = 'refresh_token';

  private constructor() {}

  public static getInstance(): TokenService {
    if (!TokenService.instance) {
      TokenService.instance = new TokenService();
    }
    return TokenService.instance;
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
    localStorage.setItem(this.TOKEN_KEY, token);
    localStorage.setItem(this.REFRESH_TOKEN_KEY, refreshToken);
  }

  public getToken(): string | null {
    return localStorage.getItem(this.TOKEN_KEY);
  }

  public getRefreshToken(): string | null {
    return localStorage.getItem(this.REFRESH_TOKEN_KEY);
  }

  public clearTokens() {
    localStorage.removeItem(this.TOKEN_KEY);
    localStorage.removeItem(this.REFRESH_TOKEN_KEY);
    timerService.clearAll();
  }

  public hasValidToken(): boolean {
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

export const tokenService = TokenService.getInstance();