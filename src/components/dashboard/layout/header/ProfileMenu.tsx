import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ChevronDown, LogOut, Settings, User } from 'lucide-react';
import { useAuthStore } from '../../../../store/authStore';
import { useSettingsStore } from '../../../../store/settingsStore';

export function ProfileMenu() {
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const { user, signOut } = useAuthStore();
  const { settings } = useSettingsStore();

  return (
    <div className="relative">
      <button
        onClick={() => setShowProfileMenu(!showProfileMenu)}
        className="flex items-center space-x-3 text-gray-400 hover:text-white transition-colors"
      >
        <div className="h-8 w-8 rounded-full bg-brand-primary/20 flex items-center justify-center">
          <User className="h-5 w-5 text-brand-primary" />
        </div>
        <ChevronDown className="h-4 w-4" />
      </button>

      {showProfileMenu && (
        <div className="absolute right-0 mt-2 w-48 bg-brand-accent border border-white/10 rounded-lg shadow-lg py-1 z-50">
          <div className="px-4 py-2 border-b border-white/10">
            <p className="text-sm font-medium text-white">{user?.email}</p>
            <p className="text-xs text-gray-400 mt-1">{settings.name}</p>
          </div>
          
          <Link
            to="/dashboard/settings"
            className="flex items-center px-4 py-2 text-sm text-gray-300 hover:bg-brand-primary/10 hover:text-brand-primary transition-colors"
            onClick={() => setShowProfileMenu(false)}
          >
            <Settings className="h-4 w-4 mr-2" />
            Settings
          </Link>

          <button
            onClick={() => {
              signOut();
              setShowProfileMenu(false);
            }}
            className="flex items-center w-full px-4 py-2 text-sm text-red-400 hover:bg-red-500/10 transition-colors"
          >
            <LogOut className="h-4 w-4 mr-2" />
            Sign out
          </button>
        </div>
      )}
    </div>
  );
}