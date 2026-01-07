
import React from 'react';
import { Sparkles, Loader2, Mic, MicOff, StopCircle } from 'lucide-react';

interface MockFormProps {
  onFieldChange: (id: string, value: string) => void;
  onRewrite: (id: string, currentText: string) => Promise<void>;
  onStartDictation: (id: string) => void;
  onStopDictation: () => void;
  fieldValues: Record<string, string>;
  interimText?: string;
  dictatingId?: string | null;
  isRewriting?: boolean;
}

const MockForm: React.FC<MockFormProps> = ({ 
  onFieldChange, 
  onRewrite, 
  onStartDictation,
  onStopDictation,
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

  const DictationAddon = ({ id }: { id: string }) => (
    <button 
      onClick={() => onStartDictation(id)}
      disabled={!!dictatingId}
      className="p-1.5 text-slate-400 hover:text-indigo-600 transition-colors disabled:opacity-30"
      title="Dictate"
    >
      <Mic size={16} />
    </button>
  );

  const DictatingOverlay = ({ id }: { id: string }) => {
    if (dictatingId !== id) return null;
    return (
      <div className="absolute inset-0 bg-indigo-600/5 backdrop-blur-[2px] rounded-lg border-2 border-indigo-500 z-10 flex flex-col items-center justify-center p-4 animate-in fade-in zoom-in-95">
        <div className="flex items-center space-x-3 mb-3">
          <div className="relative">
            <Mic size={24} className="text-indigo-600" />
            <div className="absolute inset-0 animate-ping rounded-full bg-indigo-400 opacity-20 scale-150" />
          </div>
          <p className="text-[11px] font-black text-indigo-700 uppercase tracking-widest">Listening...</p>
        </div>
        
        <div className="w-full bg-white/90 rounded-xl p-3 mb-3 border border-indigo-100 shadow-sm min-h-[60px] max-h-[100px] overflow-y-auto">
          <p className="text-xs text-slate-700 leading-relaxed italic">
            {interimText || "Start speaking to see transcription..."}
          </p>
        </div>

        <button 
          onClick={onStopDictation}
          className="flex items-center space-x-2 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-xl text-[11px] font-bold shadow-lg shadow-red-200 transition-all active:scale-95"
        >
          <StopCircle size={14} />
          <span>Stop Dictation</span>
        </button>
      </div>
    );
  };

  return (
    <div className="space-y-12">
      {/* Personal Info */}
      <div className="space-y-6">
        <h2 className="text-xl font-bold text-slate-800 flex items-center">
          <span className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center text-slate-500 text-sm mr-3">01</span>
          Personal Information
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2 relative group">
            <div className="flex justify-between items-center">
              <label htmlFor="full-name" className="text-sm font-semibold text-slate-700">Full Name</label>
              <DictationAddon id="full-name" />
            </div>
            <input 
              id="full-name"
              type="text" 
              placeholder="e.g. John Doe"
              value={getDisplayValue('full-name')}
              onChange={handleChange}
              className="w-full px-4 py-2.5 rounded-lg border border-slate-200 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
            />
            <DictatingOverlay id="full-name" />
          </div>
          <div className="space-y-2 relative group">
            <div className="flex justify-between items-center">
              <label htmlFor="email-address" className="text-sm font-semibold text-slate-700">Email Address</label>
              <DictationAddon id="email-address" />
            </div>
            <input 
              id="email-address"
              type="email" 
              placeholder="e.g. john@example.com"
              value={getDisplayValue('email-address')}
              onChange={handleChange}
              className="w-full px-4 py-2.5 rounded-lg border border-slate-200 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
            />
            <DictatingOverlay id="email-address" />
          </div>

          <div className="space-y-2 relative group">
            <div className="flex justify-between items-center">
              <label htmlFor="phone-number" className="text-sm font-semibold text-slate-700">Phone Number</label>
              <DictationAddon id="phone-number" />
            </div>
            <input 
              id="phone-number"
              type="tel" 
              placeholder="+1 (555) 000-0000"
              value={getDisplayValue('phone-number')}
              onChange={handleChange}
              className="w-full px-4 py-2.5 rounded-lg border border-slate-200 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
            />
            <DictatingOverlay id="phone-number" />
          </div>
          <div className="space-y-2 relative group">
            <div className="flex justify-between items-center">
              <label htmlFor="portfolio-url" className="text-sm font-semibold text-slate-700">Portfolio Website</label>
              <DictationAddon id="portfolio-url" />
            </div>
            <input 
              id="portfolio-url"
              type="url" 
              placeholder="https://yourportfolio.com"
              value={getDisplayValue('portfolio-url')}
              onChange={handleChange}
              className="w-full px-4 py-2.5 rounded-lg border border-slate-200 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
            />
            <DictatingOverlay id="portfolio-url" />
          </div>

          {/* New Address Field */}
          <div className="space-y-2 relative group md:col-span-2">
            <div className="flex justify-between items-center">
              <label htmlFor="home-address" className="text-sm font-semibold text-slate-700">Residential Address</label>
              <DictationAddon id="home-address" />
            </div>
            <input 
              id="home-address"
              type="text" 
              placeholder="e.g. 123 Tech Lane, San Francisco, CA"
              value={getDisplayValue('home-address')}
              onChange={handleChange}
              className="w-full px-4 py-2.5 rounded-lg border border-slate-200 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
            />
            <DictatingOverlay id="home-address" />
          </div>
        </div>
      </div>

      {/* Professional Background */}
      <div className="space-y-6 pt-6 border-t border-slate-100">
        <h2 className="text-xl font-bold text-slate-800 flex items-center">
          <span className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center text-slate-500 text-sm mr-3">02</span>
          Work Experience
        </h2>

        <div className="space-y-2 relative group">
          <div className="flex justify-between items-center">
            <label htmlFor="current-role" className="text-sm font-semibold text-slate-700">Current Role & Company</label>
            <DictationAddon id="current-role" />
          </div>
          <input 
            id="current-role"
            type="text" 
            placeholder="e.g. Software Engineer at Innovate"
            value={getDisplayValue('current-role')}
            onChange={handleChange}
            className="w-full px-4 py-2.5 rounded-lg border border-slate-200 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
          />
          <DictatingOverlay id="current-role" />
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
          <div className="flex items-center space-x-3">
            <DictationAddon id="why-join" />
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
        </div>

        <div className="space-y-2 relative group">
          <label htmlFor="why-join" className="text-sm font-semibold text-slate-700">Why are you interested in joining InnovateTech?</label>
          <textarea 
            id="why-join"
            rows={4}
            placeholder="Share your motivation..."
            value={getDisplayValue('why-join')}
            onChange={handleChange}
            className={`w-full px-4 py-2.5 rounded-lg border focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all ${isRewriting ? 'bg-indigo-50/30 border-indigo-200 italic text-slate-500' : 'border-slate-200'}`}
          />
          <DictatingOverlay id="why-join" />
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
