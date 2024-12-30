import React, { useState } from 'react';
import { useForm } from '../../hooks/useForm';
import { useAuthStore } from '../../store/authStore';
import { AuthFormSchema } from '../../types/auth';
import { Input } from '../common/Input';
import { Button } from '../common/Button';
import { Mail, Lock, ArrowRight } from 'lucide-react';
import { Alert } from '../common/Alert';
import { useNavigate, useLocation } from 'react-router-dom';

export function SignInForm() {
  const { signIn } = useAuthStore();
  const [needsEmailConfirmation, setNeedsEmailConfirmation] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const location = useLocation();
  
  const { values, handleChange, handleSubmit, isSubmitting } = useForm({
    initialValues: {
      email: '',
      password: ''
    },
    validationSchema: AuthFormSchema,
    onSubmit: async (values) => {
      try {
        const { error: signInError } = await signIn(values.email, values.password);
        if (signInError) {
          if (signInError.message?.includes('Email not confirmed')) {
            setNeedsEmailConfirmation(true);
          } else {
            setError(signInError.message);
          }
        } else {
          const from = (location.state as any)?.from?.pathname || '/dashboard';
          navigate(from, { replace: true });
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to sign in');
      }
    }
  });

  if (needsEmailConfirmation) {
    return (
      <Alert
        type="warning"
        message="Please confirm your email address before signing in. Check your inbox for the confirmation link."
      />
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <Alert
          type="error"
          message={error}
          onClose={() => setError(null)}
        />
      )}

      <Input
        label="Email address"
        type="email"
        name="email"
        value={values.email}
        onChange={(e) => handleChange('email', e.target.value)}
        icon={<Mail className="h-5 w-5 text-gray-400" />}
        required
        autoComplete="email"
        autoFocus
      />

      <Input
        label="Password"
        type="password"
        name="password"
        value={values.password}
        onChange={(e) => handleChange('password', e.target.value)}
        icon={<Lock className="h-5 w-5 text-gray-400" />}
        required
        autoComplete="current-password"
      />

      <div className="flex items-center justify-between">
        <label className="flex items-center">
          <input
            type="checkbox"
            className="h-4 w-4 rounded border-white/10 bg-white/5 text-[#72f68e] focus:ring-[#72f68e] focus:ring-offset-[#040707]"
          />
          <span className="ml-2 text-sm text-gray-300">Remember me</span>
        </label>

        <a
          href="/forgot-password"
          className="text-sm text-[#72f68e] hover:text-[#72f68e]/80 transition-colors"
        >
          Forgot password?
        </a>
      </div>

      <Button
        type="submit"
        disabled={isSubmitting}
        loading={isSubmitting}
        icon={ArrowRight}
        fullWidth
      >
        Sign in
      </Button>
    </form>
  );
}