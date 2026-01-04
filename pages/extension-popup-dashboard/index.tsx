
import React from 'react';
import { Settings, ShieldCheck, Zap } from 'lucide-react';
import QuickStatsGrid from './components/QuickStatsGrid';
import ConnectionStatus from './components/ConnectionStatus';
import RecentActivity from './components/RecentActivity';
import QuickActionButtons from './components/QuickActionButtons';
import PageStatusCard from './components/PageStatusCard';

const ExtensionPopup: React.FC = () => {
  return (
    <div className="w-[360px] h-[580px] bg-slate-950 text-white overflow-hidden flex flex-col mx-auto my-10 rounded-[2.5rem] shadow-2xl border border-white/10 animate-in zoom-in-95 duration-500">
      {/* Header */}
      <div className="p-6 flex items-center justify-between border-b border-white/5 bg-slate-900/50">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-500/20">
            <Zap size={22} fill="currentColor" />
          </div>
          <div>
            <span className="font-black text-lg tracking-tight block leading-none">ApplyWise</span>
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em]">Engine v1.3</span>
          </div>
        </div>
        <button className="p-2 hover:bg-white/5 rounded-xl transition-colors">
          <Settings size={20} className="text-slate-500" />
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto custom-scrollbar p-6 space-y-6">
        <PageStatusCard />
        <QuickStatsGrid />
        <ConnectionStatus />
        <QuickActionButtons />
        <RecentActivity />
      </div>

      {/* Footer */}
      <div className="p-4 bg-slate-900/80 border-t border-white/5 flex items-center justify-between backdrop-blur-xl">
        <div className="flex items-center space-x-2 text-[10px] font-bold text-slate-500">
          <ShieldCheck size={12} className="text-emerald-500" />
          <span className="uppercase tracking-widest">Vault Encrypted</span>
        </div>
        <button className="text-[10px] font-black text-indigo-400 hover:text-indigo-300 uppercase tracking-widest">
          Go To Dashboard
        </button>
      </div>
    </div>
  );
};

export default ExtensionPopup;
