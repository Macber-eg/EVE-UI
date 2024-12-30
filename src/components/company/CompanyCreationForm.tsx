import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCompanyStore } from '../../store/companyStore';
import { CompanySchema } from '../../types/company';
import { Building2, AlertTriangle } from 'lucide-react';
import { LoadingState } from '../common/LoadingState';

export default function CompanyCreationForm({ onComplete }: { onComplete: () => void }) {
  const [formData, setFormData] = useState({
    name: '',
    type: 'corporation',
    jurisdiction: '',
    contact: {
      email: '',
      phone: ''
    },
    settings: {
      autonomy_level: 'medium',
      human_oversight_required: ['financial_decisions', 'legal_matters'],
      notification_preferences: {
        email: true,
        push: true,
        urgency_threshold: 'medium'
      },
      industry: ''
    }
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { createCompany } = useCompanyStore();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // Validate form data
      const validatedData = CompanySchema.parse(formData);
      
      // Create company
      await createCompany(validatedData);
      
      // Move to next step
      onComplete();
    } catch (err) {
      console.error('Error creating company:', err);
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('An unexpected error occurred. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <LoadingState message="Creating your company..." />;
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-white">Create Your Company</h2>
        <p className="text-gray-400 mt-2">
          Set up your company profile to get started with EVE™ automation
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="bg-white/5 backdrop-blur-sm rounded-lg p-6 border border-white/10">
          <div className="space-y-6">
            {/* Company Name */}
            <div>
              <label className="block text-sm font-medium text-gray-200 mb-2">
                Company Name
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-[#72f68e]"
                placeholder="Enter company name"
                required
              />
            </div>

            {/* Company Type */}
            <div>
              <label className="block text-sm font-medium text-gray-200 mb-2">
                Company Type
              </label>
              <select
                value={formData.type}
                onChange={(e) => setFormData({ ...formData, type: e.target.value as any })}
                className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-[#72f68e]"
              >
                <option value="corporation">Corporation</option>
                <option value="llc">LLC</option>
                <option value="nonprofit">Non-Profit</option>
              </select>
            </div>

            {/* Jurisdiction */}
            <div>
              <label className="block text-sm font-medium text-gray-200 mb-2">
                Jurisdiction
              </label>
              <input
                type="text"
                value={formData.jurisdiction}
                onChange={(e) => setFormData({ ...formData, jurisdiction: e.target.value })}
                className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-[#72f68e]"
                placeholder="e.g., Delaware, USA"
                required
              />
            </div>

            {/* Industry */}
            <div>
              <label className="block text-sm font-medium text-gray-200 mb-2">
                Industry
              </label>
              <input
                type="text"
                value={formData.settings.industry}
                onChange={(e) => setFormData({
                  ...formData,
                  settings: { ...formData.settings, industry: e.target.value }
                })}
                className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-[#72f68e]"
                placeholder="e.g., Technology, Healthcare"
                required
              />
            </div>

            {/* Contact Email */}
            <div>
              <label className="block text-sm font-medium text-gray-200 mb-2">
                Contact Email
              </label>
              <input
                type="email"
                value={formData.contact.email}
                onChange={(e) => setFormData({
                  ...formData,
                  contact: { ...formData.contact, email: e.target.value }
                })}
                className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-[#72f68e]"
                required
              />
            </div>

            {/* Autonomy Level */}
            <div>
              <label className="block text-sm font-medium text-gray-200 mb-2">
                Autonomy Level
              </label>
              <select
                value={formData.settings.autonomy_level}
                onChange={(e) => setFormData({
                  ...formData,
                  settings: { ...formData.settings, autonomy_level: e.target.value as any }
                })}
                className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-[#72f68e]"
              >
                <option value="full">Full - Complete Automation</option>
                <option value="high">High - Minimal Human Oversight</option>
                <option value="medium">Medium - Balanced Automation</option>
                <option value="low">Low - High Human Oversight</option>
              </select>
            </div>
          </div>
        </div>

        {error && (
          <div className="bg-red-500/10 border border-red-500 text-red-400 px-4 py-3 rounded-lg flex items-center">
            <AlertTriangle className="h-5 w-5 mr-2" />
            {error}
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-[#040707] bg-[#72f68e] hover:bg-[#72f68e]/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#72f68e] disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? (
            <div className="h-5 w-5 border-2 border-[#040707]/20 border-t-[#040707] rounded-full animate-spin" />
          ) : (
            'Create Company'
          )}
        </button>
      </form>
    </div>
  );
}