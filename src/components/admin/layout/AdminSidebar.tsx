import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  LayoutGrid, Users, Building2, CreditCard, Settings, 
  Shield, Activity, FileText, Bell
} from 'lucide-react';

const navigation = [
  { name: 'Overview', href: '/admin', icon: LayoutGrid },
  { name: 'Tenants', href: '/admin/tenants', icon: Building2 },
  { name: 'Users', href: '/admin/users', icon: Users },
  { name: 'Subscriptions', href: '/admin/subscriptions', icon: CreditCard },
  { name: 'Security', href: '/admin/security', icon: Shield },
  { name: 'System Health', href: '/admin/health', icon: Activity },
  { name: 'Audit Logs', href: '/admin/audit', icon: FileText },
  { name: 'Notifications', href: '/admin/notifications', icon: Bell },
  { name: 'Settings', href: '/admin/settings', icon: Settings },
];

export function AdminSidebar() {
  return (
    <div className="hidden md:flex md:flex-shrink-0">
      <div className="flex flex-col w-64">
        <div className="flex flex-col h-0 flex-1 bg-[#040707]/95 backdrop-blur-lg">
          <div className="flex items-center h-16 flex-shrink-0 px-4 bg-[#040707]">
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 rounded-full bg-[#72f68e]" />
              <span className="text-xl font-bold text-white">Admin</span>
            </div>
          </div>
          
          <div className="flex-1 flex flex-col overflow-y-auto">
            <nav className="flex-1 px-2 py-4 space-y-1">
              {navigation.map((item) => (
                <NavLink
                  key={item.name}
                  to={item.href}
                  className={({ isActive }) =>
                    `group flex items-center px-2 py-2 text-sm font-medium rounded-md transition-colors ${
                      isActive
                        ? 'bg-[#72f68e]/10 text-[#72f68e]'
                        : 'text-gray-300 hover:bg-white/5 hover:text-white'
                    }`
                  }
                >
                  <item.icon className="mr-3 h-5 w-5 flex-shrink-0" />
                  {item.name}
                </NavLink>
              ))}
            </nav>
          </div>
        </div>
      </div>
    </div>
  );
}