import React, { useState } from 'react';
import { Mail, Check, AlertTriangle } from 'lucide-react';
import { Input } from '../../common/Input';
import { Button } from '../../common/Button';
import { Alert } from '../../common/Alert';

export default function EmailIntegrationSettings() {
  const [microsoftConnected, setMicrosoftConnected] = useState(false);
  const [googleConnected, setGoogleConnected] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleMicrosoftConnect = async () => {
    setLoading(true);
    setError(null);
    try {
      // Microsoft OAuth flow will be handled here
      setMicrosoftConnected(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to connect Microsoft account');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleConnect = async () => {
    setLoading(true);
    setError(null);
    try {
      // Google OAuth flow will be handled here
      setGoogleConnected(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to connect Google account');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-[#040707]/30 backdrop-blur-sm rounded-lg p-6">
      <div className="flex items-center mb-6">
        <Mail className="h-5 w-5 text-[#72f68e] mr-2" />
        <h2 className="text-xl font-semibold text-white">Email Integration</h2>
      </div>

      {error && (
        <Alert
          type="error"
          message={error}
          onClose={() => setError(null)}
          className="mb-6"
        />
      )}

      <div className="space-y-6">
        {/* Microsoft Integration */}
        <div className="bg-white/5 rounded-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-white font-medium">Microsoft 365</h3>
              <p className="text-sm text-gray-400 mt-1">
                Connect your Microsoft 365 account for email integration
              </p>
            </div>
            <Button
              onClick={handleMicrosoftConnect}
              disabled={loading || microsoftConnected}
              loading={loading}
              icon={microsoftConnected ? Check : undefined}
            >
              {microsoftConnected ? 'Connected' : 'Connect'}
            </Button>
          </div>
          {microsoftConnected && (
            <div className="text-sm text-[#72f68e]">
              ✓ Microsoft 365 integration is active
            </div>
          )}
        </div>

        {/* Google Integration */}
        <div className="bg-white/5 rounded-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-white font-medium">Google Workspace</h3>
              <p className="text-sm text-gray-400 mt-1">
                Connect your Google Workspace account for email integration
              </p>
            </div>
            <Button
              onClick={handleGoogleConnect}
              disabled={loading || googleConnected}
              loading={loading}
              icon={googleConnected ? Check : undefined}
            >
              {googleConnected ? 'Connected' : 'Connect'}
            </Button>
          </div>
          {googleConnected && (
            <div className="text-sm text-[#72f68e]">
              ✓ Google Workspace integration is active
            </div>
          )}
        </div>
      </div>
    </div>
  );
}