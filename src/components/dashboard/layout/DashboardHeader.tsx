import React from 'react';
import { NotificationsMenu } from './header/NotificationsMenu';
import { ProfileMenu } from './header/ProfileMenu';
import { QuickActions } from './header/QuickActions';
import { SearchBar } from './header/SearchBar';

export default function DashboardHeader() {
  return (
    <header className="bg-brand-accent/30 backdrop-blur-sm border-b border-white/10 relative z-50">
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <SearchBar />
          <div className="flex items-center space-x-4">
            <QuickActions />
            <NotificationsMenu />
            <ProfileMenu />
          </div>
        </div>
      </div>
    </header>
  );
}