```tsx
import React from 'react';
import { Check, X } from 'lucide-react';

const plans = [
  {
    name: 'Starter',
    price: 499,
    features: [
      'Up to 5 EVEs™',
      'Basic EVE™ Customization',
      'Email & Chat Support',
      'Standard Analytics',
      'Core Integrations',
      'Basic Workflow Automation'
    ]
  },
  {
    name: 'Growth',
    price: 999,
    features: [
      'Up to 15 EVEs™',
      'Advanced EVE™ Customization',
      'Priority Support',
      'Advanced Analytics',
      'All Integrations + API',
      'Advanced Workflow Automation'
    ]
  },
  {
    name: 'Enterprise',
    price: 'Custom',
    features: [
      'Unlimited EVEs™',
      'Full EVE™ Customization',
      '24/7 Support',
      'Enterprise Analytics',
      'Custom Integrations',
      'Enterprise Workflow Automation'
    ]
  }
];

interface PlanComparisonProps {
  currentPlan: string;
  onSelectPlan: (plan: string) => void;
}

export default function PlanComparison({ currentPlan, onSelectPlan }: PlanComparisonProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
      {plans.map((plan) => (
        <div
          key={plan.name}
          className={`relative rounded-xl backdrop-blur-sm p-8 ${
            currentPlan === plan.name.toLowerCase()
              ? 'bg-white/10 border-2 border-[#72f68e]'
              : 'bg-white/5 border border-white/10'
          }`}
        >
          {currentPlan === plan.name.toLowerCase() && (
            <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
              <span className="bg-[#72f68e] text-[#040707] text-sm font-medium px-3 py-1 rounded-full">
                Current Plan
              </span>
            </div>
          )}

          <h3 className="text-xl font-semibold text-white mb-2">{plan.name}</h3>
          <div className="mb-6">
            <div className="flex items-baseline">
              {typeof plan.price === 'number' ? (
                <>
                  <span className="text-3xl font-bold text-white">${plan.price}</span>
                  <span className="text-gray-400 ml-2">/month</span>
                </>
              ) : (
                <span className="text-3xl font-bold text-white">{plan.price}</span>
              )}
            </div>
          </div>

          <ul className="space-y-4 mb-8">
            {plan.features.map((feature) => (
              <li key={feature} className="flex items-center">
                <Check className="h-5 w-5 text-[#72f68e] mr-2" />
                <span className="text-gray-300">{feature}</span>
              </li>
            ))}
          </ul>

          <button
            onClick={() => onSelectPlan(plan.name.toLowerCase())}
            disabled={currentPlan === plan.name.toLowerCase()}
            className={`w-full py-2 rounded-lg transition-colors ${
              currentPlan === plan.name.toLowerCase()
                ? 'bg-[#72f68e] text-[#040707] cursor-default'
                : 'bg-white/10 text-white hover:bg-white/20'
            }`}
          >
            {currentPlan === plan.name.toLowerCase() ? 'Current Plan' : 'Select Plan'}
          </button>
        </div>
      ))}
    </div>
  );
}
```