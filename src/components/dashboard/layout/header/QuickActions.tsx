import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ChevronDown, Plus, Search, Settings } from 'lucide-react';

export function QuickActions() {
  const [showQuickActions, setShowQuickActions] = useState(false);

  const quickActions = [
    { name: 'Create New EVE™', icon: Plus, link: '/dashboard/agents' },
    { name: 'View Reports', icon: Search, link: '/dashboard/reports' },
    { name: 'System Settings', icon: Settings, link: '/dashboard/settings' },
  ];

  return (
    <div className="relative">
      <button
        onClick={() => setShowQuickActions(!showQuickActions)}
        className="flex items-center text-gray-400 hover:text-white transition-colors"
      >
        <Plus className="h-5 w-5" />
        <ChevronDown className="h-4 w-4 ml-1" />
      </button>

      {showQuickActions && (
        <div className="absolute right-0 mt-2 w-48 bg-brand-accent border border-white/10 rounded-lg shadow-lg py-1 z-50">
          {quickActions.map((action) => (
            <Link
              key={action.name}
              to={action.link}
              className="flex items-center px-4 py-2 text-sm text-gray-300 hover:bg-brand-primary/10 hover:text-brand-primary transition-colors"
              onClick={() => setShowQuickActions(false)}
            >
              <action.icon className="h-4 w-4 mr-2" />
              {action.name}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}