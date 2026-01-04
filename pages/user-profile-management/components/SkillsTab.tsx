
import React from 'react';
import { Tag, X, Plus, Cpu } from 'lucide-react';

interface SkillsTabProps {
  skills: string[];
}

const SkillsTab: React.FC<SkillsTabProps> = ({ skills }) => {
  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-300">
      <div className="bg-indigo-600 rounded-2xl p-6 text-white shadow-xl shadow-indigo-500/20">
        <div className="flex items-center space-x-3 mb-2">
          <Cpu size={24} />
          <h3 className="font-bold text-lg">Skill Graph</h3>
        </div>
        <p className="text-indigo-100 text-xs leading-relaxed">
          The ApplyWise AI uses these keywords to find semantically relevant matches in job descriptions.
        </p>
      </div>

      <div className="space-y-4">
        <div className="flex flex-wrap gap-2">
          {skills.map((skill, i) => (
            <div key={i} className="flex items-center space-x-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 px-4 py-2 rounded-full text-sm font-bold text-slate-700 dark:text-slate-200 group hover:border-indigo-500/50 transition-all">
              <span>{skill}</span>
              <button className="text-slate-300 hover:text-red-500 transition-colors">
                <X size={14} />
              </button>
            </div>
          ))}
          <button className="flex items-center space-x-2 bg-slate-100 dark:bg-slate-800 border border-dashed border-slate-300 dark:border-white/10 px-4 py-2 rounded-full text-sm font-bold text-slate-500 hover:bg-slate-200 transition-all">
            <Plus size={14} />
            <span>Add Skill</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default SkillsTab;
