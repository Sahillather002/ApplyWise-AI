
import React from 'react';
import { Search, Code, Layers, MousePointer2, AlertCircle } from 'lucide-react';

const FieldDetectionPage: React.FC<{ fields: any[] }> = ({ fields }) => {
  return (
    <div className="p-8 max-w-5xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500">
      <header className="mb-12">
        <h1 className="text-4xl font-black text-slate-900 dark:text-white tracking-tighter mb-2 flex items-center">
          <Layers size={32} className="mr-3 text-indigo-600" />
          Field Mapping Intelligence
        </h1>
        <p className="text-slate-500 dark:text-slate-400">Diagnostic view of detected interactive elements.</p>
      </header>

      <div className="grid grid-cols-3 gap-8">
        <div className="col-span-2 space-y-4">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/5 rounded-3xl overflow-hidden shadow-xl">
            <div className="bg-slate-100 dark:bg-slate-800/50 px-6 py-4 border-b border-slate-200 dark:border-white/5 flex items-center justify-between">
              <span className="text-xs font-bold text-slate-500 flex items-center uppercase tracking-widest">
                <Code size={14} className="mr-2" /> Detected Elements ({fields.length})
              </span>
            </div>
            <div className="divide-y divide-slate-100 dark:divide-white/5">
              {fields.map((field) => (
                <div key={field.id} className="p-6 flex items-center justify-between hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors">
                  <div className="flex items-center space-x-4">
                    <div className="w-10 h-10 bg-slate-100 dark:bg-slate-800 rounded-xl flex items-center justify-center text-slate-400">
                      <MousePointer2 size={18} />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-slate-900 dark:text-white">{field.label || 'Unnamed Field'}</p>
                      <p className="text-[10px] font-mono text-slate-400 uppercase tracking-tighter">#{field.id} &middot; {field.tagName}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="px-2 py-1 rounded bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400 text-[10px] font-mono font-bold">
                      {field.type}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-indigo-600 rounded-3xl p-6 text-white shadow-xl shadow-indigo-500/20">
            <h3 className="font-black text-lg mb-2">Detection Engine</h3>
            <p className="text-indigo-100 text-xs leading-relaxed mb-4">
              ApplyWise uses a proprietary DOM-observer that monitors real-time mutations to support dynamic single-page applications.
            </p>
            <div className="flex items-center space-x-2 text-[10px] font-black uppercase tracking-[0.2em]">
              <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
              <span>Engine Status: Nominal</span>
            </div>
          </div>

          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/5 rounded-3xl p-6 shadow-sm">
            <h4 className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-4 flex items-center">
              <AlertCircle size={12} className="mr-2" /> Coverage Stats
            </h4>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-[10px] font-bold text-slate-400 mb-1">
                  <span>Input Fields</span>
                  <span className="text-slate-900 dark:text-white">100%</span>
                </div>
                <div className="h-1 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                  <div className="h-full bg-indigo-500" style={{ width: '100%' }} />
                </div>
              </div>
              <div>
                <div className="flex justify-between text-[10px] font-bold text-slate-400 mb-1">
                  <span>Select Menus</span>
                  <span className="text-slate-900 dark:text-white">85%</span>
                </div>
                <div className="h-1 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                  <div className="h-full bg-amber-500" style={{ width: '85%' }} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FieldDetectionPage;
