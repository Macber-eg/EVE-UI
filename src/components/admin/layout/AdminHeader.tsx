import React from 'react';
import { useAdminStore } from '../../../store/adminStore';
import { Bell, Settings, LogOut } from 'lucide-react';

export function AdminHeader() {
  const { adminUser } = useAdminStore();

  return (
    <header className="bg-[#040707]/30 backdrop-blur-sm border-b border-white/10 relative z-50">
      <div className="px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-white font-semibold">Admin Dashboard</h1>
            <p className="text-sm text-gray-400">
              {adminUser?.role === 'super_admin' ? 'Super Administrator' : 'Administrator'}
            </p>
          </div>

          <div className="flex items-center space-x-4">
            <button className="text-gray-400 hover:text-white transition-colors">
              <Bell className="h-5 w-5" />
            </button>
            <button className="text-gray-400 hover:text-white transition-colors">
              <Settings className="h-5 w-5" />
            </button>
            <button className="text-gray-400 hover:text-white transition-colors">
              <LogOut className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}