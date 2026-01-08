
import React, { useMemo, useState } from 'react';
import { UserProfile } from '../../../types';
import { Cpu, History, Briefcase, Zap, TrendingUp, Award, Rocket } from 'lucide-react';

interface CareerVisualizerProps {
  profile: UserProfile;
}

const CareerVisualizer: React.FC<CareerVisualizerProps> = ({ profile }) => {
  const [hoveredSkill, setHoveredSkill] = useState<string | null>(null);

  // Advanced Word Cloud Algorithm for Skills
  const wordCloudNodes = useMemo(() => {
    return profile.skills.map((skill, i) => {
      // Create a pseudo-random but stable distribution for the cloud
      const seed = skill.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
      const angle = (seed % 360) * (Math.PI / 180);
      const distance = 40 + (seed % 80);
      
      // Weight size by length of the skill or importance (mocked here)
      const fontSize = 10 + (skill.length % 8);
      
      return {
        name: skill,
        x: 250 + Math.cos(angle) * distance,
        y: 150 + Math.sin(angle) * distance,
        size: fontSize,
        opacity: 0.6 + (seed % 40) / 100,
        color: i % 3 === 0 ? '#6366f1' : i % 3 === 1 ? '#8b5cf6' : '#ec4899'
      };
    });
  }, [profile.skills]);

  // Enhanced Timeline Logic
  const timelineData = useMemo(() => {
    return [...profile.experience]
      .reverse()
      .map((exp, i) => {
        const startYearMatch = exp.duration.match(/\d{4}/);
        const year = startYearMatch ? parseInt(startYearMatch[0]) : 2018 + i;
        return { ...exp, year };
      })
      .sort((a, b) => a.year - b.year);
  }, [profile.experience]);

  return (
    <div className="space-y-16 animate-in fade-in slide-in-from-bottom-6 duration-1000">
      
      {/* 01: Neural Skills Word Cloud */}
      <section>
        <div className="flex items-center justify-between mb-8">
           <div className="flex items-center space-x-4">
             <div className="w-12 h-12 bg-indigo-600/10 dark:bg-indigo-500/20 text-indigo-600 dark:text-indigo-400 rounded-2xl flex items-center justify-center shadow-inner">
               <Cpu size={24} />
             </div>
             <div>
               <h3 className="text-lg font-black text-slate-900 dark:text-white tracking-tight uppercase italic">Expertise Cluster</h3>
               <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em]">Neural Skill Distribution</p>
             </div>
           </div>
           <div className="flex items-center space-x-2 bg-slate-100 dark:bg-slate-800 px-4 py-2 rounded-xl border border-slate-200 dark:border-white/5">
             <TrendingUp size={14} className="text-emerald-500" />
             <span className="text-xs font-black text-slate-600 dark:text-slate-300">Top 3% Proficiency</span>
           </div>
        </div>

        <div className="relative h-[340px] bg-white dark:bg-slate-950/60 rounded-[3rem] border border-slate-200 dark:border-white/5 overflow-hidden shadow-2xl group/cloud">
          {/* Background Ambient Glows */}
          <div className="absolute top-1/4 left-1/4 w-32 h-32 bg-indigo-500/10 rounded-full blur-[80px]" />
          <div className="absolute bottom-1/4 right-1/4 w-32 h-32 bg-purple-500/10 rounded-full blur-[80px]" />

          <svg viewBox="0 0 500 300" className="w-full h-full select-none cursor-default">
            <defs>
              <filter id="textGlow">
                <feGaussianBlur stdDeviation="1" result="blur" />
                <feMerge>
                  <feMergeNode in="blur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
            </defs>
            
            {/* Connection Web (Subtle) */}
            <g className="opacity-10 dark:opacity-20" stroke="currentColor">
              {wordCloudNodes.map((node, i) => (
                <line 
                  key={`link-${i}`} 
                  x1="250" y1="150" 
                  x2={node.x} y2={node.y} 
                  strokeWidth="0.5" 
                  className="text-indigo-400"
                />
              ))}
            </g>

            {/* Word Cloud Particles */}
            {wordCloudNodes.map((node, i) => (
              <g 
                key={i} 
                onMouseEnter={() => setHoveredSkill(node.name)}
                onMouseLeave={() => setHoveredSkill(null)}
                className="transition-all duration-300"
                style={{ 
                  transform: hoveredSkill === node.name ? 'scale(1.15)' : 'scale(1)',
                  transformOrigin: `${node.x}px ${node.y}px`
                }}
              >
                <text
                  x={node.x}
                  y={node.y}
                  textAnchor="middle"
                  className="font-black tracking-tighter transition-all"
                  style={{
                    fontSize: `${node.size}px`,
                    fill: hoveredSkill === node.name ? '#6366f1' : (hoveredSkill ? '#94a3b8' : node.color),
                    opacity: hoveredSkill === node.name ? 1 : node.opacity,
                    filter: hoveredSkill === node.name ? 'url(#textGlow)' : 'none'
                  }}
                >
                  {node.name.toUpperCase()}
                </text>
                {hoveredSkill === node.name && (
                  <circle cx={node.x} cy={node.y - node.size - 2} r="2" fill="#6366f1" className="animate-bounce" />
                )}
              </g>
            ))}

            {/* Core Nexus */}
            <circle cx="250" cy="150" r="4" className="fill-indigo-600 shadow-xl" />
            <circle cx="250" cy="150" r="12" className="fill-indigo-600/10 animate-ping" />
          </svg>
          
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex items-center space-x-4 opacity-50">
            <span className="text-[9px] font-black text-slate-400 uppercase tracking-[0.3em]">Hover nodes to inspect proficiency</span>
          </div>
        </div>
      </section>

      {/* 02: Career Progression Timeline */}
      <section>
        <div className="flex items-center justify-between mb-10">
           <div className="flex items-center space-x-4">
             <div className="w-12 h-12 bg-purple-600/10 dark:bg-purple-500/20 text-purple-600 dark:text-purple-400 rounded-2xl flex items-center justify-center shadow-inner">
               <History size={24} />
             </div>
             <div>
               <h3 className="text-lg font-black text-slate-900 dark:text-white tracking-tight uppercase italic">Chronological Vector</h3>
               <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em]">Career Velocity Over Time</p>
             </div>
           </div>
           <div className="bg-indigo-600 dark:bg-indigo-500 text-white px-5 py-2 rounded-2xl flex items-center space-x-2 shadow-lg shadow-indigo-500/20">
             <Award size={16} />
             <span className="text-xs font-black uppercase italic tracking-tighter">6 Years Pro</span>
           </div>
        </div>

        <div className="relative py-20 px-8 bg-white dark:bg-slate-950/60 rounded-[3rem] border border-slate-200 dark:border-white/5 overflow-hidden shadow-xl">
          <div className="relative h-24">
            {/* Central Spine */}
            <div className="absolute top-1/2 left-0 w-full h-1 bg-gradient-to-r from-transparent via-slate-200 dark:via-white/10 to-transparent -translate-y-1/2" />
            
            <div className="flex justify-between items-center relative z-10">
              {timelineData.map((exp, i) => (
                <div key={i} className="relative flex flex-col items-center group">
                  {/* Event Tooltip (Alternating top/bottom) */}
                  <div className={`absolute whitespace-nowrap transition-all duration-500 transform ${
                    i % 2 === 0 
                      ? 'bottom-full mb-6 translate-y-2 group-hover:translate-y-0' 
                      : 'top-full mt-6 -translate-y-2 group-hover:translate-y-0'
                    } opacity-0 group-hover:opacity-100 flex flex-col items-center`}
                  >
                    <div className="bg-slate-900 dark:bg-indigo-950 text-white px-5 py-3 rounded-2xl shadow-2xl border border-white/10 text-center">
                      <p className="text-[10px] font-black text-indigo-400 uppercase tracking-[0.2em] mb-1">{exp.duration}</p>
                      <p className="text-sm font-black tracking-tight">{exp.role}</p>
                      <p className="text-xs text-slate-400 font-medium">{exp.company}</p>
                    </div>
                    {/* Arrow Pointer */}
                    <div className={`w-3 h-3 bg-slate-900 dark:bg-indigo-950 rotate-45 border-white/10 ${
                      i % 2 === 0 ? '-mt-1.5 border-r border-b' : '-mb-1.5 -order-1 border-l border-t'
                    }`} />
                  </div>

                  {/* Node */}
                  <div className="relative cursor-pointer">
                    <div className="w-8 h-8 bg-white dark:bg-slate-900 border-4 border-indigo-600 rounded-2xl group-hover:rotate-45 group-hover:scale-125 transition-all duration-300 shadow-xl flex items-center justify-center">
                       <Briefcase size={12} className="text-indigo-600 group-hover:-rotate-45" />
                    </div>
                    {/* Pulsing indicator for current role */}
                    {i === timelineData.length - 1 && (
                      <div className="absolute inset-0 bg-indigo-600/30 rounded-2xl animate-ping" />
                    )}
                  </div>

                  {/* Permanent Year Label */}
                  <div className="mt-4 text-center">
                     <span className="text-[11px] font-black text-slate-400 dark:text-slate-600 uppercase tracking-tighter italic">{exp.year}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          {/* Timeline Milestones Background Decorations */}
          <div className="absolute inset-x-0 top-0 h-1/2 bg-gradient-to-b from-indigo-500/5 to-transparent pointer-events-none" />
        </div>
      </section>

      {/* 03: Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="p-8 bg-indigo-600/5 dark:bg-indigo-600/10 rounded-[2rem] border border-indigo-500/20 flex flex-col justify-between h-48 relative overflow-hidden group">
           <Rocket className="absolute -right-4 -bottom-4 text-indigo-500/10 group-hover:scale-125 transition-transform duration-700" size={140} />
           <p className="text-[10px] font-black text-indigo-400 uppercase tracking-widest mb-1 relative z-10">Career Trajectory</p>
           <div className="relative z-10">
             <p className="text-3xl font-black text-slate-900 dark:text-white tracking-tighter italic">Exponential</p>
             <p className="text-xs text-slate-500 mt-2 font-medium">Growth rate consistent with Top 5% engineering leaders.</p>
           </div>
        </div>

        <div className="p-8 bg-emerald-600/5 dark:bg-emerald-600/10 rounded-[2rem] border border-emerald-500/20 flex flex-col justify-between h-48 relative overflow-hidden group">
           <Award className="absolute -right-4 -bottom-4 text-emerald-500/10 group-hover:scale-125 transition-transform duration-700" size={140} />
           <p className="text-[10px] font-black text-emerald-400 uppercase tracking-widest mb-1 relative z-10">Skill Saturation</p>
           <div className="relative z-10">
             <p className="text-3xl font-black text-slate-900 dark:text-white tracking-tighter italic">92nd Percentile</p>
             <p className="text-xs text-slate-500 mt-2 font-medium">Strong domain mastery in Modern UI/UX Architecture.</p>
           </div>
        </div>

        <div className="p-8 bg-amber-600/5 dark:bg-amber-600/10 rounded-[2rem] border border-amber-500/20 flex flex-col justify-between h-48 relative overflow-hidden group">
           <Zap className="absolute -right-4 -bottom-4 text-amber-500/10 group-hover:scale-125 transition-transform duration-700" size={140} />
           <p className="text-[10px] font-black text-amber-400 uppercase tracking-widest mb-1 relative z-10">Adaptability</p>
           <div className="relative z-10">
             <p className="text-3xl font-black text-slate-900 dark:text-white tracking-tighter italic">High Mobility</p>
             <p className="text-xs text-slate-500 mt-2 font-medium">High frequency of successful high-impact project pivots.</p>
           </div>
        </div>
      </div>
    </div>
  );
};

export default CareerVisualizer;
