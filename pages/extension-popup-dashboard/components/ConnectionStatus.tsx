
import React from 'react';
import { Wifi, Cpu } from 'lucide-react';

const ConnectionStatus: React.FC = () => {
  return (
    <div className="flex items-center justify-between px-2">
      <div className="flex items-center space-x-2">
        <Cpu size={14} className="text-slate-500" />
        <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">AI Hub</span>
      </div>
      <div className="flex items-center space-x-2">
        <span className="text-[10px] font-bold text-emerald-500">Connected</span>
        <Wifi size={14} className="text-emerald-500" />
      </div>
    </div>
  );
};

export default ConnectionStatus;
