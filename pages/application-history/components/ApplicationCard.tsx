
import React from 'react';
import { Building2, Calendar, ChevronRight, Target, Zap } from 'lucide-react';

interface ApplicationCardProps {
  company: string;
  role: string;
  status: 'applied' | 'interviewing' | 'rejected' | 'offer';
  date: string;
  matchScore: number;
}

const ApplicationCard: React.FC<ApplicationCardProps> = ({ company, role, status, date, matchScore }) => {
  const statusColors = {
    applied: 'bg-indigo-50 text-indigo-600 border-indigo-100 dark:bg-indigo-900/10 dark:text-indigo-400 dark:border-indigo-900/30',
    interviewing: 'bg-amber-50 text-amber-600 border-amber-100 dark:bg-amber-900/10 dark:text-amber-400 dark:border-amber-900/30',
    rejected: 'bg-slate-50 text-slate-500 border-slate-100 dark:bg-slate-800 dark:text-slate-400 dark:border-white/5',
    offer: 'bg-emerald-50 text-emerald-600 border-emerald-100 dark:bg-emerald-900/10 dark:text-emerald-400 dark:border-emerald-900/30',
  };

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/5 rounded-3xl p-6 flex items-center justify-between group hover:border-indigo-500/30 transition-all hover:shadow-xl hover:shadow-indigo-500/5 cursor-pointer">
      <div className="flex items-center space-x-6">
        <div className="w-16 h-16 bg-slate-100 dark:bg-slate-800 rounded-2xl flex items-center justify-center font-black text-2xl text-slate-400 group-hover:bg-indigo-600 group-hover:text-white transition-all">
          {company[0]}
        </div>
        <div className="space-y-1">
          <div className="flex items-center space-x-3">
            <h3 className="text-xl font-bold text-slate-900 dark:text-white">{role}</h3>
            <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border ${statusColors[status]}`}>
              {status}
            </span>
          </div>
          <div className="flex items-center space-x-4 text-xs font-bold text-slate-400 uppercase tracking-tight">
            <span className="flex items-center"><Building2 size={12} className="mr-1.5" /> {company}</span>
            <span className="flex items-center"><Calendar size={12} className="mr-1.5" /> {date}</span>
            <span className="flex items-center text-indigo-500"><Zap size={12} className="mr-1.5 fill-indigo-500" /> {matchScore}% AI Match</span>
          </div>
        </div>
      </div>

      <div className="flex items-center space-x-4">
        <div className="text-right mr-4 hidden md:block">
           <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Confidence</p>
           <p className="text-sm font-black text-slate-900 dark:text-white">High</p>
        </div>
        <button className="p-3 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-2xl transition-all group-hover:translate-x-1">
          <ChevronRight size={20} className="text-slate-400" />
        </button>
      </div>
    </div>
  );
};

export default ApplicationCard;
