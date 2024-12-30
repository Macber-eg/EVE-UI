import React from 'react';
import { Users, Brain, Zap, Globe2 } from 'lucide-react';

export default function StatsSection() {
  return (
    <div className="bg-[#040707] py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-lg bg-[#72f68e]/20 mb-4">
              <Users className="h-6 w-6 text-[#72f68e]" />
            </div>
            <div className="text-3xl font-bold text-white mb-2">1,000+</div>
            <div className="text-gray-400">Companies Automated</div>
          </div>

          <div className="text-center">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-lg bg-[#72f68e]/20 mb-4">
              <Brain className="h-6 w-6 text-[#72f68e]" />
            </div>
            <div className="text-3xl font-bold text-white mb-2">50M+</div>
            <div className="text-gray-400">Tasks Automated</div>
          </div>

          <div className="text-center">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-lg bg-[#72f68e]/20 mb-4">
              <Zap className="h-6 w-6 text-[#72f68e]" />
            </div>
            <div className="text-3xl font-bold text-white mb-2">99.9%</div>
            <div className="text-gray-400">Uptime</div>
          </div>

          <div className="text-center">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-lg bg-[#72f68e]/20 mb-4">
              <Globe2 className="h-6 w-6 text-[#72f68e]" />
            </div>
            <div className="text-3xl font-bold text-white mb-2">25+</div>
            <div className="text-gray-400">Countries Served</div>
          </div>
        </div>
      </div>
    </div>
  );
}