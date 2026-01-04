
import React from 'react';
import { Settings, ShieldCheck, Zap, ArrowUpRight } from 'lucide-react';
import QuickStatsGrid from './components/QuickStatsGrid';
import ConnectionStatus from './components/ConnectionStatus';
import RecentActivity from './components/RecentActivity';
import QuickActionButtons from './components/QuickActionButtons';
import PageStatusCard from './components/PageStatusCard';

const ExtensionPopup: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-full py-12 px-4 bg-slate-50 dark:bg-slate-950 transition-colors">
      <div className="w-[380px] h-[640px] bg-white dark:bg-slate-900 text-slate-900 dark:text-white overflow-hidden flex flex-col rounded-[3rem] shadow-[0_32px_128px_-32px_rgba(0,0,0,0.5)] border border-slate-200 dark:border-white/10 animate-in zoom-in-95 duration-500 relative">
        {/* Glow Effect */}
        <div className="absolute -top-24 -left-24 w-64 h-64 bg-indigo-500/10 dark:bg-indigo-500/20 rounded-full blur-[100px] pointer-events-none" />
        
        {/* Header */}
        <div className="p-6 flex items-center justify-between border-b border-slate-100 dark:border-white/5 bg-slate-50/50 dark:bg-slate-900/50 backdrop-blur-xl z-10">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-indigo-600 rounded-2xl flex items-center justify-center shadow-xl shadow-indigo-500/30">
              <Zap size={22} fill="currentColor" className="text-white" />
            </div>
            <div>
              <span className="font-black text-lg tracking-tighter block leading-none">ApplyWise</span>
              <span className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em]">Engine v1.3.2</span>
            </div>
          </div>
          <button className="p-2.5 bg-slate-100 dark:bg-slate-800 rounded-xl text-slate-400 hover:text-indigo-500 transition-all">
            <Settings size={20} />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto custom-scrollbar p-6 space-y-8 z-10">
          <PageStatusCard />
          <QuickStatsGrid />
          <div className="pt-2 border-t border-slate-100 dark:border-white/5">
            <ConnectionStatus />
          </div>
          <QuickActionButtons />
          <RecentActivity />
        </div>

        {/* Footer Navigation */}
        <div className="p-6 bg-slate-50 dark:bg-slate-900/80 border-t border-slate-100 dark:border-white/5 flex items-center justify-between backdrop-blur-2xl z-20">
          <div className="flex items-center space-x-2 text-[10px] font-black text-slate-400 dark:text-slate-500">
            <ShieldCheck size={14} className="text-emerald-500" />
            <span className="uppercase tracking-[0.1em]">Encrypted Vault Mode</span>
          </div>
          <button className="flex items-center space-x-1 text-[11px] font-black text-indigo-600 dark:text-indigo-400 hover:text-indigo-500 uppercase tracking-widest transition-colors">
            <span>DASHBOARD</span>
            <ArrowUpRight size={14} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ExtensionPopup;
