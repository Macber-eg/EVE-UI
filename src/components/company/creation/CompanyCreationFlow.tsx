import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CompanyInfoForm } from './CompanyInfoForm';
import { CompanyTypeSelection } from './CompanyTypeSelection';
import { CompanySettingsForm } from './CompanySettingsForm';
import { CompanyCreationSuccess } from './CompanyCreationSuccess';
import { useCompanyStore } from '../../../store/companyStore';
import { Company } from '../../../types/company';
import { LoadingState } from '../../common/LoadingState';

type Step = 'type' | 'info' | 'settings' | 'success';

export default function CompanyCreationFlow() {
  const [currentStep, setCurrentStep] = useState<Step>('type');
  const [formData, setFormData] = useState<Partial<Company>>({});
  const { createCompany, loading, error } = useCompanyStore();
  const navigate = useNavigate();

  const handleTypeSelection = (type: Company['type']) => {
    setFormData(prev => ({ ...prev, type }));
    setCurrentStep('info');
  };

  const handleInfoSubmit = (info: Partial<Company>) => {
    setFormData(prev => ({ ...prev, ...info }));
    setCurrentStep('settings');
  };

  const handleSettingsSubmit = async (settings: Company['settings']) => {
    try {
      await createCompany({
        ...formData,
        settings,
      } as Company);
      setCurrentStep('success');
    } catch (err) {
      console.error('Company creation error:', err);
    }
  };

  const handleComplete = () => {
    navigate('/dashboard');
  };

  if (loading) {
    return <LoadingState message="Creating your company..." />;
  }

  return (
    <div className="min-h-screen bg-[#040707] py-12">
      <div className="max-w-4xl mx-auto px-4">
        {currentStep === 'type' && (
          <CompanyTypeSelection onSelect={handleTypeSelection} />
        )}

        {currentStep === 'info' && (
          <CompanyInfoForm 
            initialData={formData} 
            onSubmit={handleInfoSubmit}
            error={error}
          />
        )}

        {currentStep === 'settings' && (
          <CompanySettingsForm
            companyType={formData.type!}
            onSubmit={handleSettingsSubmit}
            error={error}
          />
        )}

        {currentStep === 'success' && (
          <CompanyCreationSuccess
            company={formData as Company}
            onComplete={handleComplete}
          />
        )}
      </div>
    </div>
  );
}