import React from 'react';
import { useCompanyStore } from '../../../store/companyStore';
import { Plus, Brain, Building2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { LoadingState } from '../../common/LoadingState';
import { useQuery } from '../../../hooks/useQuery';
import CompanySetupPrompt from './CompanySetupPrompt';
import DashboardContent from './DashboardContent';

export default function OverviewDashboard() {
  const { company } = useCompanyStore();
  const { data: companyData, isLoading, error } = useQuery(
    ['company', company?.id],
    `/api/companies/${company?.id}`,
    {
      enabled: !!company?.id
    }
  );

  if (isLoading) {
    return <LoadingState message="Loading company data..." />;
  }

  if (error) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-red-500/10 border border-red-500 text-red-400 px-4 py-3 rounded-lg">
          Failed to load company data. Please try again.
        </div>
      </div>
    );
  }

  if (!company) {
    return <CompanySetupPrompt />;
  }

  return <DashboardContent company={company} />;
}