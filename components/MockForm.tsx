import React from 'react';
import { Sparkles, Loader2 } from 'lucide-react';

interface MockFormProps {
  onFieldChange: (id: string, value: string) => void;
  onRewrite: (id: string, currentText: string) => Promise<void>;
  fieldValues: Record<string, string>;
  interimText?: string;
  dictatingId?: string | null;
  isRewriting?: boolean;
}

const MockForm: React.FC<MockFormProps> = ({ 
  onFieldChange, 
  onRewrite, 
  fieldValues, 
  interimText, 
  dictatingId,
  isRewriting = false 
}) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    onFieldChange(e.target.id, e.target.value);
  };

  const getDisplayValue = (id: string) => {
    const base = fieldValues[id] || '';
    if (dictatingId === id && interimText) {
      return base + (base ? ' ' : '') + interimText;
    }
    return base;
  };

  const handleRewriteClick = async () => {
    const currentText = fieldValues['why-join'] || '';
    if (!currentText.trim()) return;
    await onRewrite('why-join', currentText);
  };

  return (
    <div className="space-y-12">
      {/* Personal Info */}
      <div className="space-y-6">
        <h2 className="text-xl font-bold text-slate-800 flex items-center">
          <span className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center text-slate-500 text-sm mr-3">01</span>
          Personal Information
        </h2>
        
        <div className="grid grid-cols-2 gap-6">
          <div className="space-y-2">
            <label htmlFor="full-name" className="text-sm font-semibold text-slate-700">Full Name</label>
            <input 
              id="full-name"
              type="text" 
              placeholder="e.g. John Doe"
              value={getDisplayValue('full-name')}
              onChange={handleChange}
              className="w-full px-4 py-2.5 rounded-lg border border-slate-200 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
            />
          </div>
          <div className="space-y-2">
            <label htmlFor="email-address" className="text-sm font-semibold text-slate-700">Email Address</label>
            <input 
              id="email-address"
              type="email" 
              placeholder="e.g. john@example.com"
              value={getDisplayValue('email-address')}
              onChange={handleChange}
              className="w-full px-4 py-2.5 rounded-lg border border-slate-200 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-6">
          <div className="space-y-2">
            <label htmlFor="phone-number" className="text-sm font-semibold text-slate-700">Phone Number</label>
            <input 
              id="phone-number"
              type="tel" 
              placeholder="+1 (555) 000-0000"
              value={getDisplayValue('phone-number')}
              onChange={handleChange}
              className="w-full px-4 py-2.5 rounded-lg border border-slate-200 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
            />
          </div>
          <div className="space-y-2">
            <label htmlFor="portfolio-url" className="text-sm font-semibold text-slate-700">Portfolio Website</label>
            <input 
              id="portfolio-url"
              type="url" 
              placeholder="https://yourportfolio.com"
              value={getDisplayValue('portfolio-url')}
              onChange={handleChange}
              className="w-full px-4 py-2.5 rounded-lg border border-slate-200 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
            />
          </div>
        </div>
      </div>

      {/* Professional Background */}
      <div className="space-y-6 pt-6 border-t border-slate-100">
        <h2 className="text-xl font-bold text-slate-800 flex items-center">
          <span className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center text-slate-500 text-sm mr-3">02</span>
          Work Experience
        </h2>

        <div className="space-y-2">
          <label htmlFor="current-role" className="text-sm font-semibold text-slate-700">Current Role & Company</label>
          <input 
            id="current-role"
            type="text" 
            placeholder="e.g. Software Engineer at Innovate"
            value={getDisplayValue('current-role')}
            onChange={handleChange}
            className="w-full px-4 py-2.5 rounded-lg border border-slate-200 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
          />
        </div>

        <div className="space-y-2">
          <label htmlFor="years-react" className="text-sm font-semibold text-slate-700">Years of experience with React</label>
          <select 
            id="years-react"
            value={getDisplayValue('years-react')}
            onChange={handleChange}
            className="w-full px-4 py-2.5 rounded-lg border border-slate-200 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all bg-white"
          >
            <option value="">Select...</option>
            <option value="0-1">0-1 years</option>
            <option value="2-4">2-4 years</option>
            <option value="5+">5+ years</option>
          </select>
        </div>
      </div>

      {/* Essays */}
      <div className="space-y-6 pt-6 border-t border-slate-100">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-slate-800 flex items-center">
            <span className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center text-slate-500 text-sm mr-3">03</span>
            Questions for the Candidate
          </h2>
          {fieldValues['why-join'] && fieldValues['why-join'].length > 10 && (
            <button 
              onClick={handleRewriteClick}
              disabled={isRewriting}
              className="flex items-center space-x-2 px-3 py-1.5 bg-indigo-50 text-indigo-600 rounded-lg border border-indigo-100 hover:bg-indigo-100 hover:border-indigo-200 transition-all text-xs font-bold disabled:opacity-50 disabled:cursor-not-allowed group"
            >
              {isRewriting ? (
                <Loader2 size={14} className="animate-spin" />
              ) : (
                <Sparkles size={14} className="group-hover:scale-110 transition-transform" />
              )}
              <span>{isRewriting ? 'Refining...' : 'Rewrite with AI'}</span>
            </button>
          )}
        </div>

        <div className="space-y-2 relative">
          <label htmlFor="why-join" className="text-sm font-semibold text-slate-700">Why are you interested in joining InnovateTech?</label>
          <textarea 
            id="why-join"
            rows={4}
            placeholder="Share your motivation..."
            value={getDisplayValue('why-join')}
            onChange={handleChange}
            className={`w-full px-4 py-2.5 rounded-lg border focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all ${isRewriting ? 'bg-indigo-50/30 border-indigo-200 italic text-slate-500' : 'border-slate-200'}`}
          />
          {isRewriting && (
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="bg-white/80 px-4 py-2 rounded-full shadow-lg border border-indigo-100 flex items-center space-x-2">
                <Loader2 size={16} className="animate-spin text-indigo-600" />
                <span className="text-xs font-bold text-indigo-900">ApplyWise is thinking...</span>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="pt-8">
        <button className="w-full bg-slate-900 text-white rounded-xl py-4 font-bold text-lg hover:bg-slate-800 transition-all shadow-xl shadow-slate-200">
          Submit Application
        </button>
      </div>
    </div>
  );
};

export default MockForm;