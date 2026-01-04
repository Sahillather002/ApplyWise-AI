
import React from 'react';
import { History, Search, SlidersHorizontal } from 'lucide-react';
import ApplicationCard from './components/ApplicationCard';
import AnalyticsPanel from './components/AnalyticsPanel';
import FilterPanel from './components/FilterPanel';

const ApplicationHistory: React.FC = () => {
  return (
    <div className="p-8 max-w-7xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500">
      <header className="flex items-center justify-between mb-12">
        <div className="flex items-center space-x-4">
          <div className="p-3 bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 rounded-2xl">
            <History size={24} />
          </div>
          <div>
            <h1 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">Application History</h1>
            <p className="text-slate-500 dark:text-slate-400">Review your past submissions and AI assistance logs.</p>
          </div>
        </div>
        
        <div className="flex items-center space-x-4">
          <div className="relative">
            <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
            <input 
              placeholder="Search companies..." 
              className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/5 rounded-2xl pl-12 pr-4 py-3 text-sm outline-none focus:ring-2 focus:ring-indigo-500/20 w-64"
            />
          </div>
          <button className="p-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/5 rounded-2xl text-slate-500 hover:text-indigo-600 transition-all">
            <SlidersHorizontal size={20} />
          </button>
        </div>
      </header>

      <div className="grid grid-cols-12 gap-8">
        <div className="col-span-8 space-y-4">
          <FilterPanel />
          <ApplicationCard 
            company="Google" 
            role="Senior UX Engineer" 
            status="interviewing" 
            date="Mar 15, 2024"
            matchScore={94}
          />
          <ApplicationCard 
            company="Stripe" 
            role="Frontend Architect" 
            status="applied" 
            date="Mar 10, 2024"
            matchScore={88}
          />
          <ApplicationCard 
            company="Vercel" 
            role="Developer Relations" 
            status="rejected" 
            date="Feb 28, 2024"
            matchScore={91}
          />
        </div>

        <div className="col-span-4">
          <AnalyticsPanel />
        </div>
      </div>
    </div>
  );
};

export default ApplicationHistory;
