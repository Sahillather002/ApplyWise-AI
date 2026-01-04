
import React from 'react';

const FieldTypeFilter: React.FC = () => {
  return (
    <div className="flex items-center space-x-3 overflow-x-auto no-scrollbar pb-2">
      {['All Nodes', 'Text Inputs', 'Selection Lists', 'Radio/Check', 'File Handles', 'Buttons'].map((f, i) => (
        <button 
          key={i} 
          className={`whitespace-nowrap px-4 py-2 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all border ${i === 0 ? 'bg-slate-900 text-white border-slate-900 shadow-xl shadow-slate-900/20' : 'bg-white dark:bg-slate-900 text-slate-500 border-slate-200 dark:border-white/5 hover:border-indigo-500/30'}`}
        >
          {f}
        </button>
      ))}
    </div>
  );
};

export default FieldTypeFilter;
