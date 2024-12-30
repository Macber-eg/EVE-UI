import React from 'react';
import { Link } from 'react-router-dom';
import { Building2, Brain, Rocket, Plus } from 'lucide-react';

export default function CompanySetupPrompt() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="bg-[#040707]/30 backdrop-blur-sm rounded-lg p-8 border border-white/10">
        <div className="max-w-2xl mx-auto text-center">
          <div className="w-16 h-16 rounded-lg bg-[#72f68e]/20 p-4 mx-auto mb-6">
            <Building2 className="w-full h-full text-[#72f68e]" />
          </div>

          <h2 className="text-2xl font-bold text-white mb-4">
            Welcome to mavrika
          </h2>
          <p className="text-gray-400 mb-8">
            Let's get started by setting up your company. This will allow us to configure your EVEs™ and automate your operations.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-white/5 rounded-lg p-4">
              <div className="w-10 h-10 rounded-lg bg-[#72f68e]/20 p-2 mx-auto mb-3">
                <Building2 className="w-full h-full text-[#72f68e]" />
              </div>
              <h3 className="text-white font-medium mb-2">1. Company Setup</h3>
              <p className="text-sm text-gray-400">Create your company profile and configure basic settings</p>
            </div>

            <div className="bg-white/5 rounded-lg p-4">
              <div className="w-10 h-10 rounded-lg bg-[#72f68e]/20 p-2 mx-auto mb-3">
                <Brain className="w-full h-full text-[#72f68e]" />
              </div>
              <h3 className="text-white font-medium mb-2">2. EVE™ Creation</h3>
              <p className="text-sm text-gray-400">Set up your first EVEs™ to begin automation</p>
            </div>

            <div className="bg-white/5 rounded-lg p-4">
              <div className="w-10 h-10 rounded-lg bg-[#72f68e]/20 p-2 mx-auto mb-3">
                <Rocket className="w-full h-full text-[#72f68e]" />
              </div>
              <h3 className="text-white font-medium mb-2">3. Launch</h3>
              <p className="text-sm text-gray-400">Start automating your operations with EVE™ power</p>
            </div>
          </div>

          <Link
            to="/setup"
            className="inline-flex items-center px-6 py-3 bg-[#72f68e] text-[#040707] rounded-lg hover:bg-[#72f68e]/90 transition-colors"
          >
            <Plus className="h-5 w-5 mr-2" />
            Create Your Company
          </Link>
        </div>
      </div>
    </div>
  );
}