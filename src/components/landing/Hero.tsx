import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Brain, ArrowRight, Building2, Globe2, Zap } from 'lucide-react';

export default function Hero() {
  const navigate = useNavigate();

  const handleGetStarted = (e: React.MouseEvent) => {
    e.preventDefault();
    navigate('/auth', { state: { isSignUp: true } });
  };

  const handleLearnMore = (e: React.MouseEvent) => {
    e.preventDefault();
    const featuresSection = document.getElementById('features');
    if (featuresSection) {
      featuresSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="relative bg-[#040707] text-white">
      {/* Background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-4 -left-4 w-64 h-64 bg-[#72f68e] rounded-full blur-[128px] opacity-20 animate-pulse"></div>
        <div className="absolute top-1/2 right-1/4 w-96 h-96 bg-[#f4f4f4] rounded-full blur-[128px] opacity-20 animate-pulse delay-700"></div>
        <div className="absolute bottom-1/4 left-1/3 w-80 h-80 bg-[#72f68e] rounded-full blur-[128px] opacity-20 animate-pulse delay-1000"></div>
      </div>

      {/* Hero Content */}
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="pt-20 pb-16 text-center lg:pt-32">
          <div className="mx-auto max-w-4xl">
            <div className="inline-flex items-center space-x-2 px-4 py-2 rounded-full bg-white/5 backdrop-blur-sm border border-white/10 mb-8">
              <Brain className="h-4 w-4 text-[#72f68e]" />
              <span className="text-sm">Next-Gen Business Automation</span>
            </div>
            
            <h1 className="text-4xl font-bold tracking-tight sm:text-6xl md:text-7xl">
              <span className="block">Run Your Company with</span>
              <span className="block mt-2 bg-gradient-to-r from-[#72f68e] to-[#f4f4f4] text-transparent bg-clip-text">
                AI-Powered EVEs™
              </span>
            </h1>

            <p className="mt-6 text-lg sm:text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
              Transform your business with Enterprise Virtual Employees™. From incorporation to full automation, our EVEs™ handle everything while keeping you in strategic control.
            </p>

            <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={handleGetStarted}
                className="inline-flex items-center px-6 py-3 rounded-lg bg-[#72f68e] text-[#040707] font-medium hover:bg-[#72f68e]/90 transition-all shadow-lg shadow-[#72f68e]/20"
              >
                Launch Your Company
                <ArrowRight className="ml-2 h-5 w-5" />
              </button>
              <button
                onClick={handleLearnMore}
                className="inline-flex items-center px-6 py-3 rounded-lg bg-white/5 backdrop-blur-sm border border-white/10 text-white font-medium hover:bg-white/10 transition-all"
              >
                Explore Features
              </button>
            </div>
          </div>
        </div>

        {/* Key Features */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 py-20">
          <div className="relative group">
            <div className="absolute inset-0 bg-gradient-to-r from-[#72f68e]/20 to-transparent rounded-xl blur-xl transition-all group-hover:blur-2xl"></div>
            <div className="relative p-8 rounded-xl bg-white/5 backdrop-blur-sm border border-white/10">
              <div className="rounded-lg bg-[#72f68e]/10 p-3 w-12 h-12 flex items-center justify-center mb-4">
                <Building2 className="h-6 w-6 text-[#72f68e]" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Instant Setup</h3>
              <p className="text-gray-400">Launch your company in minutes with automated incorporation and EVE™ deployment.</p>
            </div>
          </div>

          <div className="relative group">
            <div className="absolute inset-0 bg-gradient-to-r from-[#72f68e]/20 to-transparent rounded-xl blur-xl transition-all group-hover:blur-2xl"></div>
            <div className="relative p-8 rounded-xl bg-white/5 backdrop-blur-sm border border-white/10">
              <div className="rounded-lg bg-[#72f68e]/10 p-3 w-12 h-12 flex items-center justify-center mb-4">
                <Brain className="h-6 w-6 text-[#72f68e]" />
              </div>
              <h3 className="text-xl font-semibold mb-2">AI-First Operations</h3>
              <p className="text-gray-400">EVEs™ handle day-to-day operations while you focus on strategic decisions.</p>
            </div>
          </div>

          <div className="relative group">
            <div className="absolute inset-0 bg-gradient-to-r from-[#72f68e]/20 to-transparent rounded-xl blur-xl transition-all group-hover:blur-2xl"></div>
            <div className="relative p-8 rounded-xl bg-white/5 backdrop-blur-sm border border-white/10">
              <div className="rounded-lg bg-[#72f68e]/10 p-3 w-12 h-12 flex items-center justify-center mb-4">
                <Zap className="h-6 w-6 text-[#72f68e]" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Full Automation</h3>
              <p className="text-gray-400">From customer service to operations, EVEs™ work 24/7 to grow your business.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}