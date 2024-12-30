import React from 'react';
import { Clock, TrendingUp, Shield, Brain, Zap, Users } from 'lucide-react';

export default function BenefitsSection() {
  const benefits = [
    {
      icon: Clock,
      title: '85% Time Saved',
      description: 'EVEs™ handle routine tasks 24/7, freeing up your time for strategic decisions.'
    },
    {
      icon: TrendingUp,
      title: '3x Growth Rate',
      description: 'Companies using EVEs™ grow three times faster than traditional businesses.'
    },
    {
      icon: Shield,
      title: 'Enterprise Security',
      description: 'Bank-grade security with SOC 2 Type II compliance and end-to-end encryption.'
    },
    {
      icon: Brain,
      title: 'Advanced AI',
      description: 'Powered by latest AI models from OpenAI and Anthropic for optimal performance.'
    },
    {
      icon: Zap,
      title: 'Instant Scaling',
      description: 'Scale operations instantly by deploying new EVEs™ as needed.'
    },
    {
      icon: Users,
      title: 'Human Oversight',
      description: 'Maintain strategic control while EVEs™ handle day-to-day operations.'
    }
  ];

  return (
    <div className="bg-[#040707] py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Why Choose EVE™ Automation?
          </h2>
          <p className="text-gray-400 max-w-2xl mx-auto">
            Experience the future of business operations with our AI-powered Enterprise Virtual Employees™.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {benefits.map((benefit, index) => (
            <div key={index} className="relative group">
              <div className="absolute inset-0 bg-gradient-to-r from-[#72f68e]/20 to-transparent rounded-xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
              <div className="relative bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10">
                <div className="w-12 h-12 rounded-lg bg-[#72f68e]/20 p-3 mb-4">
                  <benefit.icon className="w-full h-full text-[#72f68e]" />
                </div>
                <h3 className="text-xl font-semibold text-white mb-2">{benefit.title}</h3>
                <p className="text-gray-400">{benefit.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}