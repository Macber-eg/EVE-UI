
import { Users, Building2, CreditCard, Shield } from 'lucide-react';

export default function AdminOverview() {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-[#040707]/30 backdrop-blur-sm rounded-lg p-6 border border-white/10">
          <div className="flex items-center justify-between">
            <div className="w-12 h-12 rounded-lg bg-[#72f68e]/20 p-3">
              <Building2 className="w-full h-full text-[#72f68e]" />
            </div>
            <span className="text-[#72f68e]">+12%</span>
          </div>
          <div className="mt-4">
            <h3 className="text-2xl font-bold text-white">1,234</h3>
            <p className="text-sm text-gray-400">Active Tenants</p>
          </div>
        </div>

        <div className="bg-[#040707]/30 backdrop-blur-sm rounded-lg p-6 border border-white/10">
          <div className="flex items-center justify-between">
            <div className="w-12 h-12 rounded-lg bg-[#72f68e]/20 p-3">
              <Users className="w-full h-full text-[#72f68e]" />
            </div>
            <span className="text-[#72f68e]">+8%</span>
          </div>
          <div className="mt-4">
            <h3 className="text-2xl font-bold text-white">5,678</h3>
            <p className="text-sm text-gray-400">Total Users</p>
          </div>
        </div>

        <div className="bg-[#040707]/30 backdrop-blur-sm rounded-lg p-6 border border-white/10">
          <div className="flex items-center justify-between">
            <div className="w-12 h-12 rounded-lg bg-[#72f68e]/20 p-3">
              <CreditCard className="w-full h-full text-[#72f68e]" />
            </div>
            <span className="text-[#72f68e]">+15%</span>
          </div>
          <div className="mt-4">
            <h3 className="text-2xl font-bold text-white">$123.4k</h3>
            <p className="text-sm text-gray-400">Monthly Revenue</p>
          </div>
        </div>

        <div className="bg-[#040707]/30 backdrop-blur-sm rounded-lg p-6 border border-white/10">
          <div className="flex items-center justify-between">
            <div className="w-12 h-12 rounded-lg bg-[#72f68e]/20 p-3">
              <Shield className="w-full h-full text-[#72f68e]" />
            </div>
            <span className="text-[#72f68e]">99.9%</span>
          </div>
          <div className="mt-4">
            <h3 className="text-2xl font-bold text-white">Secure</h3>
            <p className="text-sm text-gray-400">System Status</p>
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-[#040707]/30 backdrop-blur-sm rounded-lg p-6 border border-white/10">
        <h2 className="text-lg font-semibold text-white mb-4">Recent Activity</h2>
        <div className="space-y-4">
          {/* Activity items would go here */}
        </div>
      </div>

      {/* System Alerts */}
      <div className="bg-[#040707]/30 backdrop-blur-sm rounded-lg p-6 border border-white/10">
        <h2 className="text-lg font-semibold text-white mb-4">System Alerts</h2>
        <div className="space-y-4">
          {/* Alert items would go here */}
        </div>
      </div>
    </div>
  );
}