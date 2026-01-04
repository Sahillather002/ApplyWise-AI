
import React, { useState, useEffect } from 'react';
import { Layers, Activity, Search, ShieldAlert, Cpu, Terminal } from 'lucide-react';
import DetectionStatus from './components/DetectionStatus';
import FieldMetadataPanel from './components/FieldMetadataPanel';
import AutomationBlockers from './components/AutomationBlockers';
import FieldTypeFilter from './components/FieldTypeFilter';

const FormFieldDetection: React.FC<{ fields: any[] }> = ({ fields }) => {
  const [logs, setLogs] = useState<{ id: number, text: string }[]>([]);
  
  useEffect(() => {
    if (fields.length > 0) {
      const newLog = { 
        id: Date.now(), 
        text: `[ENGINE] Recalibrated semantic map. Detected ${fields.length} interactive nodes.` 
      };
      setLogs(prev => [newLog, ...prev].slice(0, 5));
    }
  }, [fields.length]);

  return (
    <div className="flex-1 h-full overflow-y-auto custom-scrollbar bg-slate-50 dark:bg-slate-950 transition-colors">
      <div className="p-8 max-w-7xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500">
        <header className="mb-12 flex flex-col md:flex-row items-center justify-between space-y-6 md:space-y-0">
          <div>
            <h1 className="text-4xl font-black text-slate-900 dark:text-white tracking-tighter mb-2 flex items-center italic uppercase">
              <Layers size={36} className="mr-3 text-indigo-600" />
              Mapping Engine
            </h1>
            <p className="text-slate-500 dark:text-slate-400 font-medium max-w-lg">
              Low-latency DOM inspection, shadow-piercing traversal, and semantic node classification.
            </p>
          </div>
          <div className="bg-indigo-600/5 dark:bg-indigo-600/10 px-8 py-5 rounded-[2rem] border border-indigo-500/20 flex items-center space-x-5 shadow-2xl shadow-indigo-500/5">
             <div className="p-3 bg-indigo-600 rounded-2xl text-white">
                <Cpu size={28} />
             </div>
             <div>
                <p className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em]">Processor Kernel</p>
                <p className="text-lg font-black text-indigo-900 dark:text-indigo-300 tracking-tight">V2 Neural Mapper</p>
             </div>
          </div>
        </header>

        <div className="grid grid-cols-12 gap-8">
          <div className="col-span-12 xl:col-span-8 space-y-8">
            <FieldTypeFilter />
            <FieldMetadataPanel fields={fields} />
          </div>

          <div className="col-span-12 xl:col-span-4 space-y-8">
            <DetectionStatus fieldCount={fields.length} />
            <AutomationBlockers />
            
            <div className="bg-slate-900 rounded-[2.5rem] p-8 text-white overflow-hidden relative group shadow-2xl">
              <div className="absolute -top-10 -right-10 w-48 h-48 bg-indigo-500/20 rounded-full blur-[80px] group-hover:scale-150 transition-transform duration-1000" />
              <div className="flex items-center justify-between mb-8 relative z-10">
                 <div className="flex items-center space-x-3">
                    <Terminal size={20} className="text-indigo-400" />
                    <h3 className="font-black text-lg uppercase tracking-tight italic">Mutation Log</h3>
                 </div>
                 <div className="flex space-x-1.5">
                    <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                    <div className="w-2.5 h-2.5 rounded-full bg-slate-700" />
                 </div>
              </div>
              
              <div className="space-y-4 relative z-10">
                 {logs.length === 0 ? (
                   <p className="text-xs text-slate-500 font-mono italic">Awaiting DOM events...</p>
                 ) : logs.map(log => (
                   <div key={log.id} className="flex items-start space-x-3 animate-in fade-in slide-in-from-left-2">
                      <span className="text-[10px] font-mono text-emerald-400 shrink-0 opacity-50">[{new Date(log.id).toLocaleTimeString([], { hour12: false, hour: '2-digit', minute:'2-digit', second: '2-digit' })}]</span>
                      <span className="text-[10px] font-mono text-slate-300 leading-relaxed uppercase tracking-tighter">{log.text}</span>
                   </div>
                 ))}
              </div>
              
              <div className="mt-8 pt-6 border-t border-white/5 flex items-center justify-between text-[10px] font-bold text-slate-500 relative z-10">
                 <span className="uppercase tracking-widest">Active Observers: 4</span>
                 <span className="text-indigo-400">FPS: 60.0</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FormFieldDetection;
