
import React, { useState } from 'react';
import { History, Search, SlidersHorizontal, LayoutGrid, List } from 'lucide-react';
import { Application, ApplicationStage } from '../../types';
import ApplicationCard from './components/ApplicationCard';
import AnalyticsPanel from './components/AnalyticsPanel';
import FilterPanel from './components/FilterPanel';
import KanbanBoard from '../../components/KanbanBoard';

interface ApplicationHistoryProps {
  applications: Application[];
  onUpdateStage: (id: string, stage: ApplicationStage) => void;
}

const ApplicationHistory: React.FC<ApplicationHistoryProps> = ({ applications, onUpdateStage }) => {
  const [view, setView] = useState<'list' | 'kanban'>('list');

  return (
    <div className="p-8 max-w-7xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500">
      <header className="flex items-center justify-between mb-12">
        <div className="flex items-center space-x-4">
          <div className="p-3 bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 rounded-2xl">
            <History size={24} />
          </div>
          <div>
            <h1 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">Career Pipeline</h1>
            <p className="text-slate-500 dark:text-slate-400">Strategic tracking of every opportunity and AI assistance log.</p>
          </div>
        </div>

        <div className="flex items-center space-x-4">
          <div className="flex bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/5 rounded-2xl p-1">
            <button
              onClick={() => setView('list')}
              className={`p-2 rounded-xl transition-all ${view === 'list' ? 'bg-indigo-600 text-white shadow-lg' : 'text-slate-500 hover:text-indigo-400'}`}
            >
              <List size={20} />
            </button>
            <button
              onClick={() => setView('kanban')}
              className={`p-2 rounded-xl transition-all ${view === 'kanban' ? 'bg-indigo-600 text-white shadow-lg' : 'text-slate-500 hover:text-indigo-400'}`}
            >
              <LayoutGrid size={20} />
            </button>
          </div>
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

      {view === 'list' ? (
        <div className="grid grid-cols-12 gap-8">
          <div className="col-span-12 lg:col-span-8 space-y-4">
            <FilterPanel />
            {applications.map(app => (
              <ApplicationCard
                key={app.id}
                company={app.company}
                role={app.role}
                status={app.stage}
                date={app.date}
                matchScore={app.matchScore}
              />
            ))}
          </div>

          <div className="col-span-12 lg:col-span-4">
            <AnalyticsPanel />
          </div>
        </div>
      ) : (
        <KanbanBoard applications={applications} onStageChange={onUpdateStage} />
      )}
    </div>
  );
};

export default ApplicationHistory;
