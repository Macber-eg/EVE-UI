
import { Clock, Users, Database, Zap } from 'lucide-react';
import { useSubscriptionStore } from '../../../store/subscriptionStore';
import { format } from 'date-fns';

export default function SubscriptionDetails() {
  const { subscription } = useSubscriptionStore();

  if (!subscription) return null;

  return (
    <div className="space-y-6">
      {/* Current Plan */}
      <div className="bg-white/5 rounded-lg p-6">
        <h3 className="text-lg font-medium text-white mb-4">Current Plan</h3>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <span className="text-gray-400">Plan</span>
            <p className="text-white font-medium capitalize">{subscription.tier}</p>
          </div>
          <div>
            <span className="text-gray-400">Status</span>
            <p className="text-white font-medium capitalize">{subscription.status}</p>
          </div>
          <div>
            <span className="text-gray-400">Current Period</span>
            <p className="text-white font-medium">
              {format(new Date(subscription.current_period_start), 'MMM d, yyyy')} -{' '}
              {format(new Date(subscription.current_period_end), 'MMM d, yyyy')}
            </p>
          </div>
          <div>
            <span className="text-gray-400">Auto-renew</span>
            <p className="text-white font-medium">
              {subscription.cancel_at_period_end ? 'No' : 'Yes'}
            </p>
          </div>
        </div>
      </div>

      {/* Usage & Limits */}
      <div className="bg-white/5 rounded-lg p-6">
        <h3 className="text-lg font-medium text-white mb-4">Usage & Limits</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="flex items-center space-x-3">
            <div className="p-2 rounded-lg bg-[#72f68e]/20">
              <Brain className="h-5 w-5 text-[#72f68e]" />
            </div>
            <div>
              <p className="text-sm text-gray-400">EVEs™</p>
              <p className="text-white font-medium">
                {subscription.features.max_eves === -1 
                  ? 'Unlimited' 
                  : `${subscription.features.max_eves} max`}
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <div className="p-2 rounded-lg bg-[#72f68e]/20">
              <Users className="h-5 w-5 text-[#72f68e]" />
            </div>
            <div>
              <p className="text-sm text-gray-400">Team Members</p>
              <p className="text-white font-medium">
                {subscription.features.max_users === -1 
                  ? 'Unlimited' 
                  : `${subscription.features.max_users} max`}
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <div className="p-2 rounded-lg bg-[#72f68e]/20">
              <Database className="h-5 w-5 text-[#72f68e]" />
            </div>
            <div>
              <p className="text-sm text-gray-400">Storage</p>
              <p className="text-white font-medium">
                {subscription.features.max_storage_gb}GB
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <div className="p-2 rounded-lg bg-[#72f68e]/20">
              <Zap className="h-5 w-5 text-[#72f68e]" />
            </div>
            <div>
              <p className="text-sm text-gray-400">API Calls</p>
              <p className="text-white font-medium">
                {subscription.features.api_calls_per_month} / month
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Features */}
      <div className="bg-white/5 rounded-lg p-6">
        <h3 className="text-lg font-medium text-white mb-4">Included Features</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {subscription.features.features.map((feature, index) => (
            <div key={index} className="flex items-center space-x-2">
              <Check className="h-5 w-5 text-[#72f68e]" />
              <span className="text-gray-300">{feature}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}