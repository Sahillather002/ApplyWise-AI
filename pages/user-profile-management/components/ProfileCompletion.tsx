
import React from 'react';
import { CheckCircle2, Circle } from 'lucide-react';

const ProfileCompletion: React.FC = () => {
  const steps = [
    { label: 'Basic Info', done: true },
    { label: 'Work Experience', done: true },
    { label: 'Education Details', done: false },
    { label: 'Skills & Keywords', done: true },
    { label: 'Vault Verification', done: false },
  ];

  const progress = (steps.filter(s => s.done).length / steps.length) * 100;

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/5 rounded-3xl p-6 shadow-sm h-full">
      <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-6">Profile Strength</h3>
      
      <div className="flex items-end justify-between mb-2">
        <span className="text-4xl font-black text-slate-900 dark:text-white">{Math.round(progress)}%</span>
        <span className="text-xs font-bold text-indigo-500 mb-1">Elite Candidate</span>
      </div>
      
      <div className="h-2 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden mb-8">
        <div className="h-full bg-indigo-600 transition-all duration-1000" style={{ width: `${progress}%` }} />
      </div>

      <div className="space-y-4">
        {steps.map((step, i) => (
          <div key={i} className={`flex items-center space-x-3 text-xs font-bold ${step.done ? 'text-slate-900 dark:text-white' : 'text-slate-400'}`}>
            {step.done ? (
              <CheckCircle2 size={16} className="text-emerald-500" />
            ) : (
              <Circle size={16} className="text-slate-200 dark:text-slate-800" />
            )}
            <span>{step.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProfileCompletion;
