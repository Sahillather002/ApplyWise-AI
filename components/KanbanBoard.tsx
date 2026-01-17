
import React from 'react';
import { Target, Zap, Clock, CheckCircle, XCircle, MoreVertical } from 'lucide-react';

import { Application, ApplicationStage } from '../types';

interface KanbanBoardProps {
  applications: Application[];
  onStageChange: (id: string, newStage: ApplicationStage) => void;
}

const STAGES: { id: ApplicationStage, label: string, color: string }[] = [
  { id: 'discovery', label: 'Discovery', color: 'bg-slate-400' },
  { id: 'applied', label: 'Applied', color: 'bg-indigo-500' },
  { id: 'interview', label: 'Interview', color: 'bg-amber-500' },
  { id: 'offer', label: 'Offer', color: 'bg-emerald-500' },
  { id: 'rejected', label: 'Rejected', color: 'bg-rose-500' },
];

const KanbanBoard: React.FC<KanbanBoardProps> = ({ applications, onStageChange }) => {
  const cardsByStage = STAGES.reduce((acc, stage) => {
    acc[stage.id] = applications.filter(app => app.stage === stage.id);
    return acc;
  }, {} as Record<ApplicationStage, Application[]>);

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6 min-h-[600px]">
      {STAGES.map((stage) => (
        <div key={stage.id} className="flex flex-col space-y-4">
          <div className="flex items-center justify-between px-2">
            <div className="flex items-center space-x-2">
              <div className={`w-2 h-2 rounded-full ${stage.color}`} />
              <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-widest">{stage.label}</h3>
            </div>
            <span className="text-[10px] font-black text-slate-400 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded-full">
              {cardsByStage[stage.id]?.length || 0}
            </span>
          </div>

          <div className="flex-1 bg-slate-50 dark:bg-slate-900/40 rounded-3xl p-3 space-y-3 border-2 border-dashed border-slate-200 dark:border-white/5">
            {cardsByStage[stage.id]?.map((card) => (
              <div key={card.id} className="bg-white dark:bg-slate-900 p-5 rounded-2xl shadow-sm border border-slate-200 dark:border-white/5 group hover:border-indigo-500/30 transition-all cursor-grab active:cursor-grabbing">
                <div className="flex justify-between items-start mb-4">
                  <div className="w-10 h-10 bg-slate-100 dark:bg-slate-800 rounded-xl flex items-center justify-center font-black text-slate-400 group-hover:bg-indigo-600 group-hover:text-white transition-all text-sm">
                    {card.company[0]}
                  </div>
                  <button className="text-slate-400 hover:text-slate-600"><MoreVertical size={14} /></button>
                </div>

                <h4 className="text-sm font-bold text-slate-900 dark:text-white truncate mb-1">{card.role}</h4>
                <p className="text-[10px] font-bold text-slate-500 uppercase tracking-tighter mb-4">{card.company}</p>

                <div className="flex items-center justify-between pt-4 border-t border-slate-100 dark:border-white/5">
                  <div className="flex items-center space-x-1 text-indigo-500">
                    <Zap size={10} className="fill-indigo-500" />
                    <span className="text-[10px] font-black">{card.matchScore}% Match</span>
                  </div>
                  <div className="flex items-center space-x-1 text-slate-400">
                    <Clock size={10} />
                    <span className="text-[10px] font-bold">{card.date}</span>
                  </div>
                </div>
              </div>
            ))}
            {cardsByStage[stage.id]?.length === 0 && (
              <div className="h-20 flex items-center justify-center opacity-20">
                <span className="text-[9px] font-black uppercase tracking-widest">Empty Stage</span>
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

export default KanbanBoard;
