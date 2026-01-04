
import React from 'react';
import { Briefcase, Trash2, Plus, Calendar } from 'lucide-react';

interface WorkExperienceTabProps {
  experience: any[];
  onUpdate: (experience: any[]) => void;
}

const WorkExperienceTab: React.FC<WorkExperienceTabProps> = ({ experience, onUpdate }) => {
  const handleChange = (index: number, field: string, value: string) => {
    const newExp = [...experience];
    newExp[index] = { ...newExp[index], [field]: value };
    onUpdate(newExp);
  };

  const handleAdd = () => {
    onUpdate([...experience, { company: '', role: '', duration: '2024 - Present', description: '' }]);
  };

  const handleRemove = (index: number) => {
    onUpdate(experience.filter((_, i) => i !== index));
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em]">Career Timeline</h3>
        <button 
          onClick={handleAdd}
          className="flex items-center space-x-2 text-indigo-600 font-bold text-xs hover:text-indigo-500 transition-colors"
        >
          <Plus size={14} />
          <span>Add Position</span>
        </button>
      </div>

      <div className="space-y-4">
        {experience.map((exp, i) => (
          <div key={i} className="group bg-slate-50 dark:bg-slate-800/20 border border-slate-200 dark:border-white/5 rounded-2xl p-6 relative hover:border-indigo-500/30 transition-all">
            <button 
              onClick={() => handleRemove(i)}
              className="absolute top-4 right-4 p-2 text-slate-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all"
            >
              <Trash2 size={16} />
            </button>
            <div className="flex items-start space-x-4">
              <div className="w-12 h-12 bg-white dark:bg-slate-800 rounded-xl shadow-sm flex items-center justify-center text-slate-400 border border-slate-100 dark:border-white/5">
                <Briefcase size={24} />
              </div>
              <div className="flex-1 space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase">Role</label>
                    <input 
                      value={exp.role} 
                      onChange={(e) => handleChange(i, 'role', e.target.value)}
                      className="w-full bg-transparent border-b border-slate-200 dark:border-white/10 py-1 font-bold text-slate-900 dark:text-white outline-none focus:border-indigo-500 transition-colors" 
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase">Company</label>
                    <input 
                      value={exp.company} 
                      onChange={(e) => handleChange(i, 'company', e.target.value)}
                      className="w-full bg-transparent border-b border-slate-200 dark:border-white/10 py-1 font-bold text-slate-900 dark:text-white outline-none focus:border-indigo-500 transition-colors" 
                    />
                  </div>
                </div>
                <div className="flex items-center space-x-2 text-xs text-slate-500 font-medium">
                  <Calendar size={14} />
                  <input 
                    value={exp.duration} 
                    onChange={(e) => handleChange(i, 'duration', e.target.value)}
                    className="bg-transparent border-none p-0 outline-none focus:text-indigo-500"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase">Key Achievements</label>
                  <textarea 
                    value={exp.description} 
                    onChange={(e) => handleChange(i, 'description', e.target.value)}
                    rows={3} 
                    className="w-full bg-transparent text-sm text-slate-600 dark:text-slate-400 leading-relaxed outline-none resize-none focus:text-slate-900 dark:focus:text-white transition-colors" 
                  />
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default WorkExperienceTab;
