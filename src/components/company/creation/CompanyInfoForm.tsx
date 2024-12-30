import React from 'react';
import { useForm } from '../../../hooks/useForm';
import { Company } from '../../../types/company';
import { Input } from '../../common/Input';
import { Button } from '../../common/Button';
import { Alert } from '../../common/Alert';
import { Building2, Globe2, Mail, Phone } from 'lucide-react';

interface CompanyInfoFormProps {
  initialData: Partial<Company>;
  onSubmit: (data: Partial<Company>) => void;
  error: string | null;
}

export function CompanyInfoForm({ initialData, onSubmit, error }: CompanyInfoFormProps) {
  const { values, handleChange, handleSubmit, errors, isSubmitting } = useForm({
    initialValues: {
      name: initialData.name || '',
      jurisdiction: initialData.jurisdiction || '',
      contact: {
        email: initialData.contact?.email || '',
        phone: initialData.contact?.phone || ''
      }
    },
    onSubmit: async (values) => {
      onSubmit({
        name: values.name,
        jurisdiction: values.jurisdiction,
        contact: values.contact
      });
    }
  });

  return (
    <div>
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-white">Company Information</h2>
        <p className="text-gray-400 mt-2">
          Provide the basic details about your company
        </p>
      </div>

      {error && (
        <Alert
          type="error"
          message={error}
          className="mb-6"
        />
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <Input
          label="Company Name"
          name="name"
          value={values.name}
          onChange={(e) => handleChange('name', e.target.value)}
          icon={<Building2 className="h-5 w-5 text-gray-400" />}
          error={errors.name}
          required
        />

        <Input
          label="Jurisdiction"
          name="jurisdiction"
          value={values.jurisdiction}
          onChange={(e) => handleChange('jurisdiction', e.target.value)}
          icon={<Globe2 className="h-5 w-5 text-gray-400" />}
          error={errors.jurisdiction}
          required
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Input
            label="Contact Email"
            name="contact.email"
            type="email"
            value={values.contact.email}
            onChange={(e) => handleChange('contact.email', e.target.value)}
            icon={<Mail className="h-5 w-5 text-gray-400" />}
            error={errors['contact.email']}
            required
          />

          <Input
            label="Contact Phone"
            name="contact.phone"
            type="tel"
            value={values.contact.phone}
            onChange={(e) => handleChange('contact.phone', e.target.value)}
            icon={<Phone className="h-5 w-5 text-gray-400" />}
            error={errors['contact.phone']}
          />
        </div>

        <div className="flex justify-end">
          <Button
            type="submit"
            loading={isSubmitting}
            fullWidth
          >
            Continue
          </Button>
        </div>
      </form>
    </div>
  );
}