import React, { useState } from 'react';
import { useForm } from '../../hooks/useForm';
import { useAuthStore } from '../../store/authStore';
import { AuthFormSchema } from '../../types/auth';
import { Input } from '../common/Input';
import { Button } from '../common/Button';
import { Mail, Lock, Building2 } from 'lucide-react';
import { Alert } from '../common/Alert';

export function SignUpForm() {
  const { signUp } = useAuthStore();
  const [error, setError] = useState<string | null>(null);
  const [emailSent, setEmailSent] = useState(false);

  const { values, handleChange, handleSubmit, isSubmitting } = useForm({
    initialValues: {
      email: '',
      password: ''
    },
    validationSchema: AuthFormSchema,
    onSubmit: async (values) => {
      try {
        const { error: signUpError } = await signUp(values.email, values.password);
        if (signUpError) {
          setError(signUpError.message);
        } else {
          setEmailSent(true);
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to sign up');
      }
    }
  });

  if (emailSent) {
    return (
      <div className="space-y-6">
        <div className="bg-[#72f68e]/10 border border-[#72f68e]/20 rounded-lg p-6">
          <h3 className="text-lg font-medium text-white mb-4">Check Your Email</h3>
          <p className="text-gray-400 mb-4">
            We've sent a confirmation link to your email address. Please click the link to activate your account.
          </p>
          <div className="space-y-2 text-sm text-gray-400">
            <p>• Check your spam folder if you don't see the email</p>
            <p>• The link will expire in 24 hours</p>
            <p>• You can sign in after confirming your email</p>
          </div>
        </div>
      </div>
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

      <div className="bg-[#72f68e]/10 border border-[#72f68e]/20 rounded-lg p-4 mb-6">
        <div className="flex items-center text-[#72f68e] mb-2">
          <Building2 className="h-4 w-4 mr-2" />
          <h3 className="font-medium">Start Your Company Journey</h3>
        </div>
        <p className="text-sm text-gray-400">
          Create your account to start building your EVE™-powered company
        </p>
      </div>

      <Input
        label="Work email"
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
        autoComplete="new-password"
      />

      <div className="text-sm text-gray-400">
        Password must contain:
        <ul className="mt-2 space-y-1 list-disc list-inside">
          <li>At least 8 characters</li>
          <li>One uppercase letter</li>
          <li>One lowercase letter</li>
          <li>One number</li>
        </ul>
      </div>

      <Button
        type="submit"
        disabled={isSubmitting}
        loading={isSubmitting}
        fullWidth
      >
        Create account
      </Button>
    </form>
  );
}