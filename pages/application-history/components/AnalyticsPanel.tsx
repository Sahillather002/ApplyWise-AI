
import React from 'react';
import { BarChart3, TrendingUp, PieChart } from 'lucide-react';

const AnalyticsPanel: React.FC = () => {
  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/5 rounded-3xl p-8 shadow-sm h-full">
      <div className="flex items-center justify-between mb-8">
        <h3 className="text-sm font-black text-slate-400 uppercase tracking-widest">Global Analytics</h3>
        <TrendingUp size={18} className="text-emerald-500" />
      </div>

      <div className="space-y-8">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
             <p className="text-3xl font-black text-slate-900 dark:text-white">12%</p>
             <p className="text-[10px] font-bold text-slate-400 uppercase">Response Rate</p>
          </div>
          <div className="w-16 h-16 rounded-full border-4 border-slate-100 dark:border-slate-800 border-t-indigo-500 -rotate-45" />
        </div>

        <div className="space-y-4">
          <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Industry Breakdown</h4>
          {[
            { label: 'SaaS', val: 65 },
            { label: 'FinTech', val: 20 },
            { label: 'AI/ML', val: 15 },
          ].map((item, i) => (
            <div key={i} className="space-y-1.5">
              <div className="flex justify-between text-[10px] font-bold">
                <span className="text-slate-500">{item.label}</span>
                <span className="text-slate-900 dark:text-white">{item.val}%</span>
              </div>
              <div className="h-1 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                <div className="h-full bg-indigo-500" style={{ width: `${item.val}%` }} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AnalyticsPanel;
