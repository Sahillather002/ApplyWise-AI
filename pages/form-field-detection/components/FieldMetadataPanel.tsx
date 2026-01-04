
import React from 'react';
import { Code, MousePointer2, Hash } from 'lucide-react';

interface FieldMetadataPanelProps {
  fields: any[];
}

const FieldMetadataPanel: React.FC<FieldMetadataPanelProps> = ({ fields }) => {
  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/5 rounded-[2rem] overflow-hidden shadow-xl">
      <div className="bg-slate-50 dark:bg-slate-800/50 px-8 py-5 border-b border-slate-200 dark:border-white/5 flex items-center justify-between">
        <span className="text-[10px] font-black text-slate-500 flex items-center uppercase tracking-[0.2em]">
          <Code size={14} className="mr-2" /> Node Registry ({fields.length})
        </span>
        <button className="text-[10px] font-black text-indigo-600 uppercase tracking-widest hover:underline">Export JSON</button>
      </div>
      <div className="divide-y divide-slate-100 dark:divide-white/5">
        {fields.length === 0 ? (
          <div className="p-20 text-center">
             <Hash size={48} className="mx-auto text-slate-100 dark:text-slate-800 mb-4" />
             <p className="text-slate-400 font-bold uppercase tracking-widest text-xs">Waiting for scan...</p>
          </div>
        ) : fields.map((field) => (
          <div key={field.id} className="p-6 flex items-center justify-between hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-all cursor-crosshair group">
            <div className="flex items-center space-x-5">
              <div className="w-12 h-12 bg-white dark:bg-slate-800 rounded-2xl flex items-center justify-center text-slate-400 border border-slate-100 dark:border-white/5 shadow-sm group-hover:scale-110 group-hover:bg-indigo-600 group-hover:text-white transition-all">
                <MousePointer2 size={20} />
              </div>
              <div className="space-y-1">
                <p className="text-base font-black text-slate-900 dark:text-white tracking-tight">{field.label || 'Unknown Fragment'}</p>
                <div className="flex items-center space-x-3 text-[10px] font-mono text-slate-500 uppercase tracking-tighter">
                  <span className="bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 rounded">ID: {field.id}</span>
                  <span className="bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400 px-1.5 py-0.5 rounded">TAG: {field.tagName}</span>
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-right">
                 <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Semantic Score</p>
                 <p className="text-xs font-bold text-emerald-500">0.992</p>
              </div>
              <div className="px-3 py-1.5 rounded-xl bg-slate-900 text-white text-[10px] font-black uppercase tracking-widest">
                {field.type}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FieldMetadataPanel;
