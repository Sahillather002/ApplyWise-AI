
import React from 'react';
import { Activity, Clock, Zap, Target } from 'lucide-react';

const UsageStatistics: React.FC = () => {
  const stats = [
    { label: 'Applications', value: '142', icon: Activity, color: 'text-indigo-500' },
    { label: 'Time Saved', value: '48h', icon: Clock, color: 'text-emerald-500' },
    { label: 'AI Matches', value: '1,204', icon: Zap, color: 'text-amber-500' },
    { label: 'Success Rate', value: '12%', icon: Target, color: 'text-indigo-500' },
  ];

  return (
    <div className="grid grid-cols-4 gap-4">
      {stats.map((stat, i) => (
        <div key={i} className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/5 p-6 rounded-3xl shadow-sm">
          <div className={`${stat.color} mb-4`}>
            <stat.icon size={24} />
          </div>
          <p className="text-2xl font-black text-slate-900 dark:text-white mb-1">{stat.value}</p>
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{stat.label}</p>
        </div>
      ))}
    </div>
  );
};

export default UsageStatistics;
