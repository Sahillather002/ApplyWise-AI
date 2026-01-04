
import React from 'react';

const FilterPanel: React.FC = () => {
  return (
    <div className="flex items-center space-x-3 pb-4 overflow-x-auto custom-scrollbar no-scrollbar">
      {['All Apps', 'In Progress', 'Interviewing', 'Offers', 'Archived'].map((f, i) => (
        <button 
          key={i} 
          className={`whitespace-nowrap px-4 py-2 rounded-xl text-xs font-bold transition-all border ${i === 0 ? 'bg-indigo-600 text-white border-indigo-500 shadow-lg shadow-indigo-500/20' : 'bg-white dark:bg-slate-900 text-slate-500 border-slate-200 dark:border-white/5 hover:border-indigo-500/30'}`}
        >
          {f}
        </button>
      ))}
    </div>
  );
};

export default FilterPanel;
