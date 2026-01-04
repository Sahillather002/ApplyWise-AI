
import React from 'react';

const QuickStatsGrid: React.FC = () => {
  return (
    <div className="grid grid-cols-2 gap-4">
      <div className="bg-white/5 p-4 rounded-2xl border border-white/5 text-center group hover:bg-white/10 transition-colors cursor-default">
        <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">Applications</p>
        <p className="text-2xl font-black">24</p>
      </div>
      <div className="bg-white/5 p-4 rounded-2xl border border-white/5 text-center group hover:bg-white/10 transition-colors cursor-default">
        <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">Time Saved</p>
        <p className="text-2xl font-black text-indigo-400">12h</p>
      </div>
    </div>
  );
};

export default QuickStatsGrid;
