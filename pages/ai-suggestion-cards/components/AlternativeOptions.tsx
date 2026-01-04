
import React from 'react';
import { ListFilter, Plus } from 'lucide-react';

const AlternativeOptions: React.FC = () => {
  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/5 rounded-3xl p-6 shadow-sm">
      <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-6 flex items-center">
        <ListFilter size={14} className="mr-2" /> Contextual Variants
      </h3>
      <div className="space-y-3">
        <div className="p-3 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-100 dark:border-white/5 cursor-pointer hover:border-indigo-500/30 transition-all">
           <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter mb-1">Casual Tone</p>
           <p className="text-xs font-medium text-slate-700 dark:text-slate-200">"Hey, I'm Alex. I love building React apps..."</p>
        </div>
        <div className="p-3 bg-indigo-600 rounded-xl text-white cursor-pointer shadow-lg shadow-indigo-500/20">
           <p className="text-[10px] font-bold text-indigo-200 uppercase tracking-tighter mb-1">Professional (Selected)</p>
           <p className="text-xs font-bold italic">"Experienced Frontend Engineer with a focus on React..."</p>
        </div>
        <button className="w-full flex items-center justify-center py-2 space-x-2 text-indigo-500 text-[10px] font-black uppercase tracking-widest border border-dashed border-indigo-200 dark:border-indigo-900/30 rounded-xl hover:bg-indigo-50 transition-all">
          <Plus size={12} />
          <span>Generate Variant</span>
        </button>
      </div>
    </div>
  );
};

export default AlternativeOptions;
