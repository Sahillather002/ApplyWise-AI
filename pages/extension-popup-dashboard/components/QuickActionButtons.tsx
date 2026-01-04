
import React from 'react';
import { Sparkles, Globe, User } from 'lucide-react';

const QuickActionButtons: React.FC = () => {
  return (
    <div className="space-y-3">
      <button className="w-full bg-indigo-600 hover:bg-indigo-500 text-white rounded-2xl py-3 font-black text-xs uppercase tracking-widest flex items-center justify-center space-x-2 transition-all shadow-xl shadow-indigo-500/10 active:scale-95">
        <Sparkles size={16} />
        <span>Auto-Fill All</span>
      </button>
      <div className="grid grid-cols-2 gap-3">
        <button className="bg-white/5 hover:bg-white/10 text-white border border-white/5 rounded-2xl py-3 text-[10px] font-black uppercase tracking-widest flex items-center justify-center space-x-2 transition-all">
          <Globe size={14} className="text-slate-400" />
          <span>Research</span>
        </button>
        <button className="bg-white/5 hover:bg-white/10 text-white border border-white/5 rounded-2xl py-3 text-[10px] font-black uppercase tracking-widest flex items-center justify-center space-x-2 transition-all">
          <User size={14} className="text-slate-400" />
          <span>Profile</span>
        </button>
      </div>
    </div>
  );
};

export default QuickActionButtons;
