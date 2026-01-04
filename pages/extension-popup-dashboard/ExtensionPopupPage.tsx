
import React from 'react';
import { LayoutDashboard, Zap, Activity, ShieldCheck, Settings } from 'lucide-react';

const ExtensionPopupPage: React.FC = () => {
  return (
    <div className="w-[360px] h-[500px] bg-slate-950 text-white overflow-hidden flex flex-col mx-auto my-10 rounded-3xl shadow-2xl border border-white/10 animate-in zoom-in-95 duration-500">
      {/* Header */}
      <div className="p-6 flex items-center justify-between border-b border-white/5 bg-slate-900/50">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center">
            <Zap size={18} fill="currentColor" />
          </div>
          <span className="font-bold text-lg tracking-tight">ApplyWise</span>
        </div>
        <Settings size={18} className="text-slate-500 hover:text-white cursor-pointer" />
      </div>

      {/* Stats */}
      <div className="p-6 flex-1 space-y-6 overflow-y-auto">
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-white/5 p-4 rounded-2xl border border-white/5 text-center">
            <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">Applied</p>
            <p className="text-2xl font-black">24</p>
          </div>
          <div className="bg-white/5 p-4 rounded-2xl border border-white/5 text-center">
            <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">Time Saved</p>
            <p className="text-2xl font-black text-indigo-400">12h</p>
          </div>
        </div>

        <div className="bg-indigo-600/10 border border-indigo-500/30 rounded-2xl p-4 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center"><Activity size={20} /></div>
            <div>
              <p className="text-xs font-bold">Current Detection</p>
              <p className="text-[10px] text-indigo-400 uppercase tracking-tighter">InnovateTech Application</p>
            </div>
          </div>
          <div className="text-xs font-black text-white bg-indigo-600 px-3 py-1 rounded-full">ACTIVE</div>
        </div>

        <div className="space-y-3">
          <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Recent Activity</h3>
          {[1, 2, 3].map(i => (
            <div key={i} className="flex items-center justify-between p-3 hover:bg-white/5 rounded-xl transition-colors cursor-pointer group">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 rounded-lg bg-slate-800 flex items-center justify-center text-slate-500 group-hover:bg-indigo-600/20 group-hover:text-indigo-400">
                  <LayoutDashboard size={14} />
                </div>
                <div>
                  <p className="text-xs font-bold">Stripe Submission</p>
                  <p className="text-[10px] text-slate-500">2 days ago</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Footer */}
      <div className="p-4 bg-slate-900 flex items-center justify-between">
        <div className="flex items-center space-x-2 text-[10px] font-bold text-slate-500">
          <ShieldCheck size={12} className="text-emerald-500" />
          <span>VAULT ENCRYPTION ACTIVE</span>
        </div>
        <button className="text-[10px] font-black text-indigo-400 hover:text-indigo-300">OPEN DASHBOARD</button>
      </div>
    </div>
  );
};

export default ExtensionPopupPage;
