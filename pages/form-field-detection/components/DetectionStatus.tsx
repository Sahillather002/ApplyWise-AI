
import React from 'react';
import { Target, Zap } from 'lucide-react';

interface DetectionStatusProps {
  fieldCount: number;
}

const DetectionStatus: React.FC<DetectionStatusProps> = ({ fieldCount }) => {
  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/5 rounded-3xl p-8 shadow-sm">
      <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-8 flex items-center">
         <Target size={14} className="mr-2" /> Coverage Metrics
      </h3>
      
      <div className="space-y-6">
         <div className="flex items-end justify-between">
            <span className="text-5xl font-black text-slate-900 dark:text-white tracking-tighter">{fieldCount}</span>
            <span className="text-xs font-bold text-indigo-500 uppercase tracking-widest pb-1">Nodes Active</span>
         </div>
         
         <div className="space-y-4 pt-4">
            {[
              { label: 'Inputs', val: 100, color: 'bg-indigo-500' },
              { label: 'Selects', val: 85, color: 'bg-amber-500' },
              { label: 'Uploads', val: 0, color: 'bg-slate-200 dark:bg-slate-800' }
            ].map((stat, i) => (
              <div key={i} className="space-y-1.5">
                <div className="flex justify-between text-[10px] font-bold">
                  <span className="text-slate-500 uppercase tracking-widest">{stat.label}</span>
                  <span className="text-slate-900 dark:text-white">{stat.val}%</span>
                </div>
                <div className="h-1 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                  <div className={`h-full ${stat.color} transition-all duration-1000`} style={{ width: `${stat.val}%` }} />
                </div>
              </div>
            ))}
         </div>
         
         <div className="pt-4 flex items-center justify-between text-[10px] font-bold text-slate-400 italic">
            <span className="flex items-center"><Zap size={10} className="mr-1 fill-emerald-500 text-emerald-500" /> Precision: 98.4%</span>
            <span>Latency: 12ms</span>
         </div>
      </div>
    </div>
  );
};

export default DetectionStatus;
