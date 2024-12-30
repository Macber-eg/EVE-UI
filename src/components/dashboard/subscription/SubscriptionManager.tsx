import React, { useState } from 'react';
import { useSubscriptionStore } from '../../../store/subscriptionStore';
import SubscriptionDetails from './SubscriptionDetails';
import PlanComparison from './PlanComparison';
import BillingHistory from './BillingHistory';
import { Alert } from '../../common/Alert';

export default function SubscriptionManager() {
  const { subscription, updateSubscription, error } = useSubscriptionStore();
  const [loading, setLoading] = useState(false);

  const handlePlanChange = async (newPlan: string) => {
    if (!confirm(`Are you sure you want to switch to the ${newPlan} plan?`)) {
      return;
    }

    setLoading(true);
    try {
      await updateSubscription(subscription.company_id, {
        tier: newPlan
      });
    } catch (err) {
      console.error('Failed to update subscription:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold text-white">Subscription & Billing</h1>
          <p className="mt-1 text-sm text-gray-400">
            Manage your subscription plan and billing details
          </p>
        </div>
      </div>

      {error && (
        <Alert
          type="error"
          message={error}
          className="mb-6"
        />
      )}

      <div className="space-y-8">
        {/* Current Subscription Details */}
        <SubscriptionDetails />

        {/* Plan Comparison */}
        <div>
          <h2 className="text-xl font-semibold text-white mb-6">Available Plans</h2>
          <PlanComparison
            currentPlan={subscription.tier}
            onSelectPlan={handlePlanChange}
          />
        </div>

        {/* Billing History */}
        <div>
          <h2 className="text-xl font-semibold text-white mb-6">Billing History</h2>
          <BillingHistory companyId={subscription.company_id} />
        </div>
      </div>
    </div>
  );
}