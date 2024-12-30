import React, { useEffect } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAdminStore } from '../../../store/adminStore';
import { AdminSidebar } from './AdminSidebar';
import { AdminHeader } from './AdminHeader';
import { LoadingState } from '../../common/LoadingState';

export default function AdminLayout() {
  const { isAdmin, adminUser, loading, checkAdminStatus } = useAdminStore();

  useEffect(() => {
    checkAdminStatus();
  }, [checkAdminStatus]);

  if (loading) {
    return <LoadingState message="Verifying admin access..." />;
  }

  if (!isAdmin || !adminUser) {
    return <Navigate to="/auth" replace />;
  }

  return (
    <div className="min-h-screen bg-[#040707] flex">
      <AdminSidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <AdminHeader />
        <main className="flex-1 overflow-y-auto bg-[#040707]/10 p-6 relative z-0">
          <Outlet />
        </main>
      </div>
    </div>
  );
}