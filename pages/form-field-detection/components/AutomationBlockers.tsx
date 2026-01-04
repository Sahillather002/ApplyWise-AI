
import React from 'react';
import { ShieldAlert, Fingerprint, EyeOff, Info } from 'lucide-react';

const AutomationBlockers: React.FC = () => {
  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/5 rounded-3xl p-8 shadow-sm">
      <div className="flex items-center space-x-3 mb-8">
        <ShieldAlert size={20} className="text-amber-500" />
        <h3 className="text-sm font-black text-slate-400 uppercase tracking-widest">Heuristic Warnings</h3>
      </div>

      <div className="space-y-6">
        <div className="flex items-start space-x-4 p-4 rounded-2xl bg-amber-50 dark:bg-amber-900/10 border border-amber-100 dark:border-amber-900/30">
          <Fingerprint size={20} className="text-amber-600 shrink-0 mt-0.5" />
          <div className="space-y-1">
             <p className="text-xs font-bold text-amber-900 dark:text-amber-200">Shadow DOM Detected</p>
             <p className="text-[10px] text-amber-700/80 leading-relaxed">Some fields are isolated. Applying recursive pierce strategy.</p>
          </div>
        </div>

        <div className="flex items-start space-x-4 p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-white/5 opacity-50">
          <EyeOff size={20} className="text-slate-400 shrink-0 mt-0.5" />
          <div className="space-y-1">
             <p className="text-xs font-bold text-slate-600 dark:text-slate-300">No Captcha Found</p>
             <p className="text-[10px] text-slate-500 leading-relaxed">Automation flow unobstructed by bot mitigation.</p>
          </div>
        </div>

        <div className="flex items-center space-x-2 text-[10px] font-bold text-indigo-500 cursor-pointer hover:underline pl-1">
           <Info size={12} />
           <span>Learn about anti-bot measures</span>
        </div>
      </div>
    </div>
  );
};

export default AutomationBlockers;
