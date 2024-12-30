import React from 'react';
import { Company } from '../../../types/company';
import { useEVEStore } from '../../../store/eveStore';
import { Brain, Target, Activity, Users, Plus, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import EVEPerformanceMetrics from '../analytics/EVEPerformanceMetrics';
import RecentActivities from './RecentActivities';

interface DashboardContentProps {
  company: Company;
}

export default function DashboardContent({ company }: DashboardContentProps) {
  const { eves } = useEVEStore();
  const hasAtlas = eves.some(eve => eve.name === 'Atlas');

  if (!hasAtlas) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-[#040707]/30 backdrop-blur-sm rounded-lg p-8 border border-white/10">
          <div className="max-w-2xl mx-auto text-center">
            <div className="w-16 h-16 rounded-lg bg-[#72f68e]/20 p-4 mx-auto mb-6">
              <Brain className="w-full h-full text-[#72f68e]" />
            </div>

            <h2 className="text-2xl font-bold text-white mb-4">
              Welcome to maverika
            </h2>
            <p className="text-gray-400 mb-8">
              Let's create Atlas, your Chief EVE™ Orchestrator, to begin automating your operations.
            </p>

            <Link
              to="/setup"
              className="inline-flex items-center px-6 py-3 bg-[#72f68e] text-[#040707] rounded-lg hover:bg-[#72f68e]/90 transition-colors"
            >
              Complete Setup
              <ArrowRight className="h-5 w-5 ml-2" />
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold text-white">{company.name}</h1>
          <p className="mt-1 text-sm text-gray-400">
            EVE™-powered operations dashboard
          </p>
        </div>
        <Link
          to="/dashboard/agents"
          className="inline-flex items-center px-4 py-2 bg-[#72f68e] text-[#040707] rounded-lg hover:bg-[#72f68e]/90 transition-colors"
        >
          <Plus className="h-5 w-5 mr-2" />
          Create EVE™
        </Link>
      </div>

      {/* Rest of the component remains unchanged */}
    </div>
  );
}