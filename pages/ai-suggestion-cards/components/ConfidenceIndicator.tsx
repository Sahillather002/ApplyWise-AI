
import React from 'react';
import { Zap, ShieldCheck, AlertCircle } from 'lucide-react';

interface ConfidenceIndicatorProps {
  confidence: 'high' | 'medium' | 'low';
}

const ConfidenceIndicator: React.FC<ConfidenceIndicatorProps> = ({ confidence }) => {
  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/5 rounded-3xl p-8 shadow-sm text-center">
      <div className="flex justify-center mb-6">
        {confidence === 'high' ? (
          <div className="w-20 h-20 bg-emerald-100 dark:bg-emerald-900/20 text-emerald-600 rounded-[2.5rem] flex items-center justify-center animate-pulse shadow-lg shadow-emerald-500/10">
            <ShieldCheck size={40} />
          </div>
        ) : (
          <div className="w-20 h-20 bg-amber-100 dark:bg-amber-900/20 text-amber-600 rounded-[2.5rem] flex items-center justify-center">
            <AlertCircle size={40} />
          </div>
        )}
      </div>
      <h3 className="text-2xl font-black text-slate-900 dark:text-white tracking-tighter mb-1 capitalize">{confidence} Match</h3>
      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.3em] mb-4">Semantic Accuracy</p>
      
      <div className="space-y-4 pt-4 border-t border-slate-50 dark:border-white/5">
        <div className="flex justify-between text-xs font-bold">
           <span className="text-slate-500">Source Credibility</span>
           <span className="text-emerald-500">High</span>
        </div>
        <div className="flex justify-between text-xs font-bold">
           <span className="text-slate-500">Contextual Fit</span>
           <span className="text-emerald-500">Verified</span>
        </div>
      </div>
    </div>
  );
};

export default ConfidenceIndicator;
