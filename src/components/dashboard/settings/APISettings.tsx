import { useState } from 'react';
import { Key, Check, AlertTriangle } from 'lucide-react';
import { Input } from '../../common/Input';
import { Button } from '../../common/Button';
import { Alert } from '../../common/Alert';
import { useApi } from '../../../hooks/useApi';

interface APISettingsProps {
  onComplete?: () => void;
}

export default function APISettings({ onComplete }: APISettingsProps) {
  const [apiKeys, setApiKeys] = useState({
    openai: '',
    anthropic: '',
    stripe: ''
  });
  const [useMaverikaKey, setUseMaverikaKey] = useState(false);
  const [validationStatus, setValidationStatus] = useState<Record<string, boolean>>({});
  const { request, loading, error } = useApi();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (useMaverikaKey) {
      onComplete?.();
      return;
    }

    const validations = await Promise.all(
      Object.entries(apiKeys).map(([provider, key]) => 
        key ? validateAndSaveKey(provider, key) : Promise.resolve(true)
      )
    );

    if (validations.every(Boolean)) {
      onComplete?.();
    }
  };

  const validateAndSaveKey = async (provider: string, key: string) => {
    try {
      await request({
        url: '/api/validate-key',
        method: 'POST',
        data: { provider, key }
      });
      
      setValidationStatus(prev => ({
        ...prev,
        [provider]: true
      }));
      
      return true;
    } catch (err) {
      setValidationStatus(prev => ({
        ...prev,
        [provider]: false
      }));
      return false;
    }
  };

  return (
    <div className="bg-[#040707]/30 backdrop-blur-sm rounded-lg p-6">
      <div className="flex items-center mb-6">
        <Key className="h-5 w-5 text-[#72f68e] mr-2" />
        <h2 className="text-xl font-semibold text-white">API Configuration</h2>
      </div>

      <div className="mb-6 bg-[#72f68e]/10 border border-[#72f68e]/20 rounded-lg p-4">
        <h3 className="text-[#72f68e] font-medium mb-2">Use maverika's API Keys</h3>
        <p className="text-sm text-gray-400 mb-4">
          You can use maverika's API keys for a 2x markup on usage costs, or provide your own keys for direct pricing.
        </p>
        <label className="flex items-center space-x-2">
          <input
            type="checkbox"
            checked={useMaverikaKey}
            onChange={(e) => setUseMaverikaKey(e.target.checked)}
            className="rounded border-white/10 text-[#72f68e] focus:ring-[#72f68e]"
          />
          <span className="text-white">Use maverika's API keys</span>
        </label>
      </div>

      {!useMaverikaKey && (
        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <Alert
              type="error"
              message={error instanceof Error ? error.message : 'Failed to save API keys'}
            />
          )}

          <Input
            label="OpenAI API Key"
            value={apiKeys.openai}
            onChange={(e) => setApiKeys(prev => ({ ...prev, openai: e.target.value }))}
            type="password"
            placeholder="sk-..."
            error={validationStatus.openai === false ? 'Invalid API key' : undefined}
          />

          <Input
            label="Anthropic API Key"
            value={apiKeys.anthropic}
            onChange={(e) => setApiKeys(prev => ({ ...prev, anthropic: e.target.value }))}
            type="password"
            placeholder="sk-ant-..."
            error={validationStatus.anthropic === false ? 'Invalid API key' : undefined}
          />

          <Input
            label="Stripe API Key"
            value={apiKeys.stripe}
            onChange={(e) => setApiKeys(prev => ({ ...prev, stripe: e.target.value }))}
            type="password"
            placeholder="sk_..."
            error={validationStatus.stripe === false ? 'Invalid API key' : undefined}
          />

          <Button
            type="submit"
            loading={loading}
            icon={Check}
            fullWidth
          >
            Save API Keys
          </Button>
        </form>
      )}

      {useMaverikaKey && (
        <div className="mt-6">
          <Button
            onClick={() => onComplete?.()}
            icon={Check}
            fullWidth
          >
            Continue with maverika's API Keys
          </Button>
          <p className="text-sm text-gray-400 mt-2 text-center">
            You can change this setting later in your dashboard
          </p>
        </div>
      )}
    </div>
  );
}