import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import CompanyInfoCollector from '../company/CompanyInfoCollector';
import APISettings from '../dashboard/settings/APISettings';
import EVECreationWizard from '../dashboard/eve/EVECreationWizard';
import SetupProgress from './SetupProgress';
import { LoadingState } from '../common/LoadingState';
import { useCompanyStore } from '../../store/companyStore';

type Step = 'company' | 'api' | 'eves' | 'complete';

export default function SetupWizard() {
  const [currentStep, setCurrentStep] = useState<Step>('company');
  const navigate = useNavigate();
  const { company, loading } = useCompanyStore();

  if (loading) {
    return <LoadingState message="Loading..." />;
  }

  const handleCompanyCreated = () => {
    setCurrentStep('api');
  };

  const handleAPIConfigured = () => {
    setCurrentStep('eves');
  };

  const handleEVEsCreated = () => {
    navigate('/dashboard');
  };

  return (
    <div className="min-h-screen bg-[#040707] py-12">
      <div className="max-w-4xl mx-auto px-4">
        <SetupProgress currentStep={currentStep} />
        
        {currentStep === 'company' && (
          <CompanyInfoCollector onComplete={handleCompanyCreated} />
        )}
        
        {currentStep === 'api' && (
          <APISettings onComplete={handleAPIConfigured} />
        )}
        
        {currentStep === 'eves' && (
          <EVECreationWizard onComplete={handleEVEsCreated} />
        )}
      </div>
    </div>
  );
}