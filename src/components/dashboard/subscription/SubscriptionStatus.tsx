
import { AlertTriangle, CheckCircle, Clock } from 'lucide-react';

interface SubscriptionStatusProps {
  status: 'active' | 'canceled' | 'past_due' | 'trialing';
}

export default function SubscriptionStatus({ status }: SubscriptionStatusProps) {
  const getStatusConfig = () => {
    switch (status) {
      case 'active':
        return {
          icon: CheckCircle,
          color: 'text-[#72f68e]',
          bg: 'bg-[#72f68e]/10',
          text: 'Active'
        };
      case 'canceled':
        return {
          icon: AlertTriangle,
          color: 'text-red-500',
          bg: 'bg-red-500/10',
          text: 'Canceled'
        };
      case 'past_due':
        return {
          icon: AlertTriangle,
          color: 'text-yellow-500',
          bg: 'bg-yellow-500/10',
          text: 'Past Due'
        };
      case 'trialing':
        return {
          icon: Clock,
          color: 'text-blue-500',
          bg: 'bg-blue-500/10',
          text: 'Trial'
        };
    }
  };

  const config = getStatusConfig();
  const Icon = config.icon;

  return (
    <div className={`inline-flex items-center px-3 py-1 rounded-full ${config.bg}`}>
      <Icon className={`h-4 w-4 ${config.color} mr-2`} />
      <span className={`text-sm font-medium ${config.color}`}>{config.text}</span>
    </div>
  );
}