import { describe, it, expect } from 'vitest';
import { validateEmail, validatePassword, validateApiKey } from './validation';

describe('Validation Utils', () => {
  describe('validateEmail', () => {
    it('accepts valid email addresses', () => {
      expect(validateEmail('test@example.com')).toBe(true);
      expect(validateEmail('user.name+tag@example.co.uk')).toBe(true);
    });

    it('rejects invalid email addresses', () => {
      expect(validateEmail('invalid')).toBe(false);
      expect(validateEmail('test@')).toBe(false);
      expect(validateEmail('@example.com')).toBe(false);
    });
  });

  describe('validatePassword', () => {
    it('accepts valid passwords', () => {
      expect(validatePassword('StrongPass123!')).toBe(true);
      expect(validatePassword('ValidP@ssw0rd')).toBe(true);
    });

    it('rejects invalid passwords', () => {
      expect(validatePassword('weak')).toBe(false);
      expect(validatePassword('nodigits')).toBe(false);
      expect(validatePassword('12345678')).toBe(false);
    });
  });

  describe('validateApiKey', () => {
    it('validates OpenAI API keys', () => {
      expect(validateApiKey('sk-1234567890abcdef1234567890abcdef', 'openai')).toBe(true);
      expect(validateApiKey('invalid-key', 'openai')).toBe(false);
    });

    it('validates Anthropic API keys', () => {
      expect(validateApiKey('sk-ant-1234567890abcdef1234567890abcdef', 'anthropic')).toBe(true);
      expect(validateApiKey('invalid-key', 'anthropic')).toBe(false);
    });

    it('validates Stripe API keys', () => {
      expect(validateApiKey('sk_test_1234567890abcdef1234567890abcdef', 'stripe')).toBe(true);
      expect(validateApiKey('sk_live_1234567890abcdef1234567890abcdef', 'stripe')).toBe(true);
      expect(validateApiKey('invalid-key', 'stripe')).toBe(false);
    });
  });
});