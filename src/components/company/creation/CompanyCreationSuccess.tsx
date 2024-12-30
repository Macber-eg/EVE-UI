
import { CheckCircle, ArrowRight } from 'lucide-react';
import { Company } from '../../../types/company';
import { Button } from '../../common/Button';

interface CompanyCreationSuccessProps {
  company: Company;
  onComplete: () => void;
}

export function CompanyCreationSuccess({ company, onComplete }: CompanyCreationSuccessProps) {
  return (
    <div className="text-center">
      <div className="mb-8">
        <div className="w-16 h-16 rounded-full bg-[#72f68e]/20 flex items-center justify-center mx-auto mb-6">
          <CheckCircle className="h-8 w-8 text-[#72f68e]" />
        </div>
        <h2 className="text-2xl font-bold text-white mb-2">Company Created Successfully!</h2>
        <p className="text-gray-400">
          {company.name} has been set up and is ready for EVE™ automation
        </p>
      </div>

      <div className="bg-white/5 rounded-lg p-6 mb-8 text-left">
        <h3 className="text-lg font-medium text-white mb-4">Company Details</h3>
        <dl className="space-y-4">
          <div>
            <dt className="text-sm text-gray-400">Company Name</dt>
            <dd className="text-white mt-1">{company.name}</dd>
          </div>
          <div>
            <dt className="text-sm text-gray-400">Type</dt>
            <dd className="text-white mt-1 capitalize">{company.type}</dd>
          </div>
          <div>
            <dt className="text-sm text-gray-400">Jurisdiction</dt>
            <dd className="text-white mt-1">{company.jurisdiction}</dd>
          </div>
          <div>
            <dt className="text-sm text-gray-400">Industry</dt>
            <dd className="text-white mt-1">{company.settings.industry}</dd>
          </div>
          <div>
            <dt className="text-sm text-gray-400">Automation Level</dt>
            <dd className="text-white mt-1 capitalize">{company.settings.autonomy_level}</dd>
          </div>
        </dl>
      </div>

      <div className="bg-[#72f68e]/10 border border-[#72f68e]/20 rounded-lg p-6 mb-8">
        <h3 className="text-lg font-medium text-[#72f68e] mb-4">Next Steps</h3>
        <ul className="space-y-3 text-left">
          <li className="flex items-start">
            <div className="flex-shrink-0 h-6 w-6 rounded-full bg-[#72f68e]/20 flex items-center justify-center mt-0.5">
              <span className="text-[#72f68e] text-sm">1</span>
            </div>
            <span className="ml-3 text-gray-300">
              Complete your company profile in the dashboard
            </span>
          </li>
          <li className="flex items-start">
            <div className="flex-shrink-0 h-6 w-6 rounded-full bg-[#72f68e]/20 flex items-center justify-center mt-0.5">
              <span className="text-[#72f68e] text-sm">2</span>
            </div>
            <span className="ml-3 text-gray-300">
              Set up your first EVE™ to begin automation
            </span>
          </li>
          <li className="flex items-start">
            <div className="flex-shrink-0 h-6 w-6 rounded-full bg-[#72f68e]/20 flex items-center justify-center mt-0.5">
              <span className="text-[#72f68e] text-sm">3</span>
            </div>
            <span className="ml-3 text-gray-300">
              Configure integrations with your existing tools
            </span>
          </li>
        </ul>
      </div>

      <Button
        onClick={onComplete}
        fullWidth
        icon={ArrowRight}
      >
        Continue to Dashboard
      </Button>
    </div>
  );
}