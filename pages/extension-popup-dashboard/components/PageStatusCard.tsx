
import React from 'react';
import { Activity } from 'lucide-react';

const PageStatusCard: React.FC = () => {
  return (
    <div className="bg-indigo-600/10 border border-indigo-500/30 rounded-[1.5rem] p-5 flex items-center justify-between shadow-xl shadow-indigo-500/5">
      <div className="flex items-center space-x-4">
        <div className="w-12 h-12 bg-indigo-600 rounded-2xl flex items-center justify-center shadow-lg shadow-indigo-500/20">
          <Activity size={24} />
        </div>
        <div>
          <p className="text-xs font-black uppercase tracking-widest text-indigo-400 mb-0.5">Detection Active</p>
          <p className="text-sm font-bold text-white truncate w-32">InnovateTech Form</p>
        </div>
      </div>
      <div className="flex flex-col items-end">
        <span className="text-[10px] font-black text-white bg-emerald-500 px-3 py-1 rounded-full animate-pulse shadow-lg shadow-emerald-500/20">LIVE</span>
      </div>
    </div>
  );
};

export default PageStatusCard;
