import { useState } from 'react';
import { X } from 'lucide-react';
import PrebuiltEVEList from './PrebuiltEVEList';
import CreateEVEForm from './CreateEVEForm';

interface EVECreationModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function EVECreationModal({ isOpen, onClose }: EVECreationModalProps) {
  const [mode, setMode] = useState<'prebuilt' | 'custom'>('prebuilt');

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-[#040707]/95 rounded-lg w-full max-w-4xl m-4 border border-white/10">
        <div className="flex justify-between items-center p-6 border-b border-white/10">
          <div>
            <h2 className="text-xl font-semibold text-white">Create New EVE™</h2>
            <p className="text-sm text-gray-400 mt-1">Choose a creation method to get started</p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="p-6">
          <div className="flex space-x-4 mb-6">
            <button
              onClick={() => setMode('prebuilt')}
              className={`px-4 py-2 rounded-lg transition-colors ${
                mode === 'prebuilt'
                  ? 'bg-[#72f68e] text-[#040707]'
                  : 'bg-white/5 text-white hover:bg-white/10'
              }`}
            >
              Prebuilt EVEs™
            </button>
            <button
              onClick={() => setMode('custom')}
              className={`px-4 py-2 rounded-lg transition-colors ${
                mode === 'custom'
                  ? 'bg-[#72f68e] text-[#040707]'
                  : 'bg-white/5 text-white hover:bg-white/10'
              }`}
            >
              Custom EVE™
            </button>
          </div>

          {mode === 'prebuilt' ? (
            <PrebuiltEVEList onSelect={(eveId) => {
              // Handle prebuilt EVE selection
              onClose();
            }} />
          ) : (
            <CreateEVEForm onComplete={() => {
              onClose();
            }} />
          )}
        </div>
      </div>
    </div>
  );
}