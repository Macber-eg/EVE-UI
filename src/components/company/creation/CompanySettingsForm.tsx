
import { useForm } from '../../../hooks/useForm';
import { Company } from '../../../types/company';
import { Input } from '../../common/Input';
import { Select } from '../../common/Select';
import { Button } from '../../common/Button';
import { Alert } from '../../common/Alert';
import { Settings, Bell, Shield } from 'lucide-react';

interface CompanySettingsFormProps {
  companyType: Company['type'];
  onSubmit: (settings: Company['settings']) => void;
  error: string | null;
}

export function CompanySettingsForm({ companyType, onSubmit, error }: CompanySettingsFormProps) {
  const { values, handleChange, handleSubmit, errors, isSubmitting } = useForm({
    initialValues: {
      industry: '',
      autonomy_level: 'medium',
      human_oversight_required: ['financial_decisions', 'legal_matters'],
      notification_preferences: {
        email: true,
        push: true,
        urgency_threshold: 'medium'
      }
    },
    onSubmit: async (values) => {
      onSubmit(values);
    }
  });

  const autonomyLevels = [
    { value: 'low', label: 'Low - High Human Oversight' },
    { value: 'medium', label: 'Medium - Balanced Automation' },
    { value: 'high', label: 'High - Minimal Human Oversight' },
    { value: 'full', label: 'Full - Complete Automation' }
  ];

  const oversightAreas = [
    { value: 'financial_decisions', label: 'Financial Decisions' },
    { value: 'legal_matters', label: 'Legal Matters' },
    { value: 'strategic_planning', label: 'Strategic Planning' },
    { value: 'human_resources', label: 'Human Resources' },
    { value: 'external_communications', label: 'External Communications' }
  ];

  return (
    <div>
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-white">Company Settings</h2>
        <p className="text-gray-400 mt-2">
          Configure your company's automation and oversight preferences
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
          label="Industry"
          name="industry"
          value={values.industry}
          onChange={(e) => handleChange('industry', e.target.value)}
          icon={<Settings className="h-5 w-5 text-gray-400" />}
          error={errors.industry}
          required
        />

        <Select
          label="Autonomy Level"
          value={values.autonomy_level}
          onChange={(e) => handleChange('autonomy_level', e.target.value)}
          options={autonomyLevels}
          icon={<Shield className="h-5 w-5 text-gray-400" />}
          error={errors.autonomy_level}
        />

        <div>
          <label className="block text-sm font-medium text-gray-200 mb-2">
            Human Oversight Areas
          </label>
          <div className="grid grid-cols-2 gap-4">
            {oversightAreas.map(({ value, label }) => (
              <label key={value} className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={values.human_oversight_required.includes(value)}
                  onChange={(e) => {
                    const newAreas = e.target.checked
                      ? [...values.human_oversight_required, value]
                      : values.human_oversight_required.filter(area => area !== value);
                    handleChange('human_oversight_required', newAreas);
                  }}
                  className="rounded border-white/10 text-[#72f68e] focus:ring-[#72f68e]"
                />
                <span className="text-gray-300">{label}</span>
              </label>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-200 mb-2">
            <div className="flex items-center space-x-2">
              <Bell className="h-5 w-5 text-gray-400" />
              <span>Notification Preferences</span>
            </div>
          </label>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={values.notification_preferences.email}
                onChange={(e) => handleChange('notification_preferences.email', e.target.checked)}
                className="rounded border-white/10 text-[#72f68e] focus:ring-[#72f68e]"
              />
              <span className="text-gray-300">Email Notifications</span>
            </label>
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={values.notification_preferences.push}
                onChange={(e) => handleChange('notification_preferences.push', e.target.checked)}
                className="rounded border-white/10 text-[#72f68e] focus:ring-[#72f68e]"
              />
              <span className="text-gray-300">Push Notifications</span>
            </label>
          </div>
        </div>

        <Select
          label="Urgency Threshold"
          value={values.notification_preferences.urgency_threshold}
          onChange={(e) => handleChange('notification_preferences.urgency_threshold', e.target.value)}
          options={[
            { value: 'low', label: 'Low - Minimal Notifications' },
            { value: 'medium', label: 'Medium - Balanced Notifications' },
            { value: 'high', label: 'High - important Updates Only' },
            { value: 'critical', label: 'Critical - Emergency Updates Only' }
          ]}
          error={errors['notification_preferences.urgency_threshold']}
        />

        <div className="flex justify-end">
          <Button
            type="submit"
            loading={isSubmitting}
            fullWidth
          >
            Create Company
          </Button>
        </div>
      </form>
    </div>
  );
}