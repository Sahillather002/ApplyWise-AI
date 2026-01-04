
import React, { useState } from 'react';
import { Tag, X, Plus, Cpu } from 'lucide-react';

interface SkillsTabProps {
  skills: string[];
  onUpdate: (skills: string[]) => void;
}

const SkillsTab: React.FC<SkillsTabProps> = ({ skills, onUpdate }) => {
  const [newSkill, setNewSkill] = useState("");

  const handleRemove = (skillToRemove: string) => {
    onUpdate(skills.filter(s => s !== skillToRemove));
  };

  const handleAdd = () => {
    if (newSkill.trim() && !skills.includes(newSkill.trim())) {
      onUpdate([...skills, newSkill.trim()]);
      setNewSkill("");
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-300">
      <div className="bg-indigo-600 rounded-3xl p-8 text-white shadow-xl shadow-indigo-500/20 relative overflow-hidden">
        <div className="absolute -right-8 -bottom-8 opacity-10">
          <Cpu size={160} />
        </div>
        <div className="relative z-10">
          <div className="flex items-center space-x-3 mb-3">
            <Cpu size={24} />
            <h3 className="font-bold text-xl tracking-tight">Skill Ontology</h3>
          </div>
          <p className="text-indigo-100 text-sm leading-relaxed max-w-md">
            The ApplyWise AI uses this high-dimensional skill graph to find semantically relevant matches in complex job descriptions.
          </p>
        </div>
      </div>

      <div className="space-y-6">
        <div className="flex flex-wrap gap-2.5">
          {skills.map((skill, i) => (
            <div key={i} className="flex items-center space-x-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 px-4 py-2.5 rounded-2xl text-sm font-bold text-slate-700 dark:text-slate-200 group hover:border-indigo-500/50 transition-all shadow-sm">
              <span>{skill}</span>
              <button 
                onClick={() => handleRemove(skill)}
                className="text-slate-300 hover:text-red-500 transition-colors"
              >
                <X size={14} />
              </button>
            </div>
          ))}
        </div>
        
        <div className="flex items-center space-x-3 pt-4 border-t border-slate-100 dark:border-white/5">
          <input 
            value={newSkill}
            onChange={(e) => setNewSkill(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleAdd()}
            placeholder="Add a new skill (e.g. Kubernetes)..."
            className="flex-1 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-white/5 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-indigo-500/20 transition-all text-sm font-medium"
          />
          <button 
            onClick={handleAdd}
            className="bg-indigo-600 hover:bg-indigo-500 text-white p-3 rounded-xl transition-all shadow-lg active:scale-95"
          >
            <Plus size={20} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default SkillsTab;
