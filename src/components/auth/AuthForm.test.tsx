import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '../test/utils/test-utils';
import AuthForm from './AuthForm';
import { useAuthStore } from '../../store/authStore';

describe('AuthForm', () => {
  beforeEach(() => {
    useAuthStore.setState({
      user: null,
      loading: false,
      error: null
    });
  });

  it('renders sign in form by default', () => {
    render(<AuthForm />);
    expect(screen.getByText('Welcome back')).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/email/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/password/i)).toBeInTheDocument();
  });

  it('switches to sign up form', async () => {
    render(<AuthForm />);
    fireEvent.click(screen.getByText(/don't have an account/i));
    
    await waitFor(() => {
      expect(screen.getByText('Create your account')).toBeInTheDocument();
    });
  });

  it('validates email format', async () => {
    render(<AuthForm />);
    const emailInput = screen.getByPlaceholderText(/email/i);
    
    fireEvent.change(emailInput, { target: { value: 'invalid-email' } });
    fireEvent.blur(emailInput);
    
    await waitFor(() => {
      expect(screen.getByText(/invalid email/i)).toBeInTheDocument();
    });
  });

  it('validates password requirements', async () => {
    render(<AuthForm />);
    const passwordInput = screen.getByPlaceholderText(/password/i);
    
    fireEvent.change(passwordInput, { target: { value: 'weak' } });
    fireEvent.blur(passwordInput);
    
    await waitFor(() => {
      expect(screen.getByText(/password must be at least 8 characters/i)).toBeInTheDocument();
    });
  });
});