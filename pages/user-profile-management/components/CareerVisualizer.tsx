
import React, { useMemo } from 'react';
import { UserProfile } from '../../../types';
import { Cpu, History, Briefcase, Zap } from 'lucide-react';

interface CareerVisualizerProps {
  profile: UserProfile;
}

const CareerVisualizer: React.FC<CareerVisualizerProps> = ({ profile }) => {
  // Logic for Neural Map Layout
  const skillNodes = useMemo(() => {
    return profile.skills.map((skill, i) => {
      const angle = (i / profile.skills.length) * Math.PI * 2;
      const radius = 60 + Math.random() * 60;
      return {
        name: skill,
        x: 200 + Math.cos(angle) * radius,
        y: 150 + Math.sin(angle) * radius,
        size: 10 + Math.min(skill.length, 12),
        opacity: 0.4 + (Math.random() * 0.6)
      };
    });
  }, [profile.skills]);

  // Logic for Experience Timeline
  const timelineData = useMemo(() => {
    return [...profile.experience].reverse().map((exp, i) => {
      // Very simple heuristic to find a "year" for positioning
      const startYearMatch = exp.duration.match(/\d{4}/);
      const year = startYearMatch ? parseInt(startYearMatch[0]) : 2018 + i;
      return { ...exp, year };
    }).sort((a, b) => a.year - b.year);
  }, [profile.experience]);

  return (
    <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Neural Skills Map */}
      <section>
        <div className="flex items-center justify-between mb-8">
           <div className="flex items-center space-x-3">
             <div className="p-2 bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 rounded-xl">
               <Cpu size={20} />
             </div>
             <h3 className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-widest italic">Neural Skill Architecture</h3>
           </div>
           <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">{profile.skills.length} Active Nodes</span>
        </div>

        <div className="relative h-[320px] bg-slate-50 dark:bg-slate-950/40 rounded-[2rem] border border-slate-100 dark:border-white/5 overflow-hidden flex items-center justify-center">
          <svg viewBox="0 0 400 300" className="w-full h-full max-w-xl overflow-visible">
            {/* Connection Lines */}
            <g className="opacity-20 stroke-indigo-500/30" strokeWidth="0.5">
              {skillNodes.map((node, i) => (
                <line 
                  key={`line-${i}`} 
                  x1="200" y1="150" 
                  x2={node.x} y2={node.y} 
                  className="animate-pulse" 
                  style={{ animationDelay: `${i * 0.1}s` }}
                />
              ))}
              {skillNodes.map((node, i) => {
                 const next = skillNodes[(i + 1) % skillNodes.length];
                 return <line key={`arc-${i}`} x1={node.x} y1={node.y} x2={next.x} y2={next.y} />;
              })}
            </g>

            {/* Core Node */}
            <g className="relative z-10">
               <circle cx="200" cy="150" r="12" className="fill-indigo-600 shadow-xl" />
               <circle cx="200" cy="150" r="20" className="fill-indigo-600/10 animate-ping" />
            </g>

            {/* Skill Nodes */}
            {skillNodes.map((node, i) => (
              <g key={i} className="cursor-default group">
                <circle 
                  cx={node.x} 
                  cy={node.y} 
                  r={node.size / 2} 
                  className="fill-indigo-500/20 group-hover:fill-indigo-500/40 transition-all" 
                />
                <text 
                  x={node.x} 
                  y={node.y + 20} 
                  textAnchor="middle" 
                  className="text-[8px] font-black uppercase tracking-tighter fill-slate-400 dark:fill-slate-500 group-hover:fill-indigo-600 dark:group-hover:fill-indigo-400 transition-all"
                  style={{ opacity: node.opacity }}
                >
                  {node.name}
                </text>
              </g>
            ))}
          </svg>
          
          <div className="absolute inset-0 bg-gradient-to-t from-slate-50 dark:from-slate-950/80 to-transparent pointer-events-none" />
        </div>
      </section>

      {/* Experience Progression Timeline */}
      <section>
        <div className="flex items-center space-x-3 mb-8">
           <div className="p-2 bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 rounded-xl">
             <History size={20} />
           </div>
           <h3 className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-widest italic">Experience Vector Progression</h3>
        </div>

        <div className="relative py-12 px-6 bg-slate-50 dark:bg-slate-950/40 rounded-[2rem] border border-slate-100 dark:border-white/5">
          <div className="relative">
            {/* Timeline Base line */}
            <div className="absolute top-1/2 left-0 w-full h-px bg-slate-200 dark:bg-white/10 -translate-y-1/2" />
            
            <div className="flex justify-between items-center relative z-10 px-4">
              {timelineData.map((exp, i) => (
                <div key={i} className="flex flex-col items-center space-y-4 group">
                  {/* Info Box (Top) - staggered */}
                  {i % 2 === 0 && (
                    <div className="mb-4 text-center animate-in slide-in-from-top-4 duration-500">
                      <p className="text-[10px] font-black text-indigo-500 uppercase tracking-widest">{exp.year}</p>
                      <p className="text-xs font-bold text-slate-900 dark:text-white truncate max-w-[100px]">{exp.company}</p>
                    </div>
                  )}
                  
                  {/* Point */}
                  <div className="relative">
                    <div className="w-5 h-5 bg-white dark:bg-slate-900 border-2 border-indigo-600 rounded-full group-hover:scale-125 transition-transform" />
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-2 h-2 bg-indigo-600 rounded-full" />
                  </div>

                  {/* Info Box (Bottom) - staggered */}
                  {i % 2 !== 0 && (
                    <div className="mt-4 text-center animate-in slide-in-from-bottom-4 duration-500">
                      <p className="text-[10px] font-black text-indigo-500 uppercase tracking-widest">{exp.year}</p>
                      <p className="text-xs font-bold text-slate-900 dark:text-white truncate max-w-[100px]">{exp.company}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Comparative Insights */}
      <div className="grid grid-cols-2 gap-6">
        <div className="p-6 bg-indigo-600/5 dark:bg-indigo-600/10 rounded-3xl border border-indigo-500/20 flex items-center space-x-4">
           <div className="w-12 h-12 bg-indigo-600 text-white rounded-2xl flex items-center justify-center shadow-lg shadow-indigo-500/20">
             <Zap size={24} />
           </div>
           <div>
             <p className="text-[10px] font-black text-indigo-400 uppercase tracking-widest mb-1">Career Velocity</p>
             <p className="text-lg font-black text-slate-900 dark:text-white tracking-tight">Top 5% Candidate</p>
           </div>
        </div>
        <div className="p-6 bg-emerald-600/5 dark:bg-emerald-600/10 rounded-3xl border border-emerald-500/20 flex items-center space-x-4">
           <div className="w-12 h-12 bg-emerald-600 text-white rounded-2xl flex items-center justify-center shadow-lg shadow-emerald-500/20">
             <Briefcase size={24} />
           </div>
           <div>
             <p className="text-[10px] font-black text-emerald-400 uppercase tracking-widest mb-1">Domain Mastery</p>
             <p className="text-lg font-black text-slate-900 dark:text-white tracking-tight">Lead/Architect Tier</p>
           </div>
        </div>
      </div>
    </div>
  );
};

export default CareerVisualizer;
