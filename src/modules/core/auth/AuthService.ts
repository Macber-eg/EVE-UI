import { User } from '@supabase/auth-helpers-react';
import { supabase } from '../database/supabase';
import { AppError } from '../error';
import { validateEmail, validatePassword } from '../validation';

export class AuthService {
  private static instance: AuthService;

  private constructor() {}

  public static getInstance(): AuthService {
    if (!AuthService.instance) {
      AuthService.instance = new AuthService();
    }
    return AuthService.instance;
  }

  async signIn(email: string, password: string): Promise<{ user: User | null; error: Error | null }> {
    try {
      if (!validateEmail(email)) {
        throw new AppError('Invalid email format', 'VALIDATION_ERROR', 400);
      }

      if (!validatePassword(password)) {
        throw new AppError('Invalid password format', 'VALIDATION_ERROR', 400);
      }

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

      return { user: data?.user || null, error: null };
    } catch (error) {
      console.error('Sign in error:', error);
      return { user: null, error: error as Error };
    }
  }

  // Add other auth methods (signUp, signOut, etc.)
}