import React from 'react';
import { Building2, Briefcase, Heart } from 'lucide-react';
import { Company } from '../../../types/company';

interface CompanyTypeSelectionProps {
  onSelect: (type: Company['type']) => void;
}

export function CompanyTypeSelection({ onSelect }: CompanyTypeSelectionProps) {
  const types = [
    {
      type: 'corporation' as const,
      title: 'Corporation',
      description: 'Traditional corporate structure with shareholders',
      icon: Building2,
      features: [
        'Limited liability protection',
        'Stock issuance capability',
        'Corporate tax structure',
        'Board of directors'
      ]
    },
    {
      type: 'llc' as const,
      title: 'LLC',
      description: 'Flexible business structure with pass-through taxation',
      icon: Briefcase,
      features: [
        'Pass-through taxation',
        'Operating agreement flexibility',
        'Limited liability protection',
        'Simplified management'
      ]
    },
    {
      type: 'nonprofit' as const,
      title: 'Non-Profit',
      description: 'Tax-exempt organization for charitable purposes',
      icon: Heart,
      features: [
        'Tax-exempt status',
        'Grant eligibility',
        'Public funding access',
        'Social impact focus'
      ]
    }
  ];

  return (
    <div>
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-white">Choose Your Company Type</h2>
        <p className="text-gray-400 mt-2">
          Select the legal structure that best fits your business needs
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {types.map(({ type, title, description, icon: Icon, features }) => (
          <button
            key={type}
            onClick={() => onSelect(type)}
            className="bg-white/5 rounded-lg p-6 text-left hover:bg-white/10 transition-colors border border-white/10 focus:outline-none focus:ring-2 focus:ring-[#72f68e]"
          >
            <div className="w-12 h-12 rounded-lg bg-[#72f68e]/20 p-2.5 mb-4">
              <Icon className="w-full h-full text-[#72f68e]" />
            </div>
            <h3 className="text-lg font-semibold text-white mb-2">{title}</h3>
            <p className="text-gray-400 text-sm mb-4">{description}</p>
            <ul className="space-y-2">
              {features.map((feature, index) => (
                <li key={index} className="text-sm text-gray-300 flex items-center">
                  <div className="w-1.5 h-1.5 rounded-full bg-[#72f68e] mr-2" />
                  {feature}
                </li>
              ))}
            </ul>
          </button>
        ))}
      </div>
    </div>
  );
}