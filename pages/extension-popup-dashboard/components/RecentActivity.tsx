
import React from 'react';
import { ExternalLink, CheckCircle } from 'lucide-react';

const RecentActivity: React.FC = () => {
  return (
    <div className="space-y-3 pt-2">
      <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Recent Activity</h3>
      {[
        { company: 'Stripe', time: '2h ago', status: 'Applied' },
        { company: 'Google', time: '1d ago', status: 'Interviewing' },
        { company: 'Vercel', time: '3d ago', status: 'Drafted' }
      ].map((act, i) => (
        <div key={i} className="flex items-center justify-between p-3 hover:bg-white/5 rounded-2xl transition-all cursor-pointer group border border-transparent hover:border-white/5">
          <div className="flex items-center space-x-3">
            <div className="w-9 h-9 rounded-xl bg-slate-800 flex items-center justify-center text-slate-500 group-hover:bg-indigo-600/20 group-hover:text-indigo-400 transition-all font-black text-sm">
              {act.company[0]}
            </div>
            <div>
              <p className="text-xs font-bold flex items-center">
                {act.company}
                <ExternalLink size={10} className="ml-1.5 text-slate-600 opacity-0 group-hover:opacity-100 transition-opacity" />
              </p>
              <p className="text-[10px] text-slate-500 font-medium">{act.time}</p>
            </div>
          </div>
          <div className="flex items-center space-x-1.5">
             <span className="text-[10px] font-bold text-slate-500 uppercase tracking-tighter">{act.status}</span>
             <CheckCircle size={12} className="text-emerald-500/50" />
          </div>
        </div>
      ))}
    </div>
  );
};

export default RecentActivity;
