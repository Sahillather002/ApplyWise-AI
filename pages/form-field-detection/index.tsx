
import React from 'react';
import { Layers, Activity, Search, ShieldAlert, Cpu } from 'lucide-react';
import DetectionStatus from './components/DetectionStatus';
import FieldMetadataPanel from './components/FieldMetadataPanel';
import AutomationBlockers from './components/AutomationBlockers';
import FieldTypeFilter from './components/FieldTypeFilter';

const FormFieldDetection: React.FC<{ fields: any[] }> = ({ fields }) => {
  return (
    <div className="p-8 max-w-7xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500">
      <header className="mb-12 flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-black text-slate-900 dark:text-white tracking-tighter mb-2 flex items-center italic uppercase">
            <Layers size={36} className="mr-3 text-indigo-600" />
            Mapping Engine
          </h1>
          <p className="text-slate-500 dark:text-slate-400 font-medium">Real-time DOM inspection and semantic node classification.</p>
        </div>
        <div className="bg-indigo-600/5 px-6 py-4 rounded-3xl border border-indigo-500/20 flex items-center space-x-4">
           <Cpu size={24} className="text-indigo-600" />
           <div>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Processor Status</p>
              <p className="text-sm font-bold text-indigo-900 dark:text-indigo-200">Neural-Net Mapping v2</p>
           </div>
        </div>
      </header>

      <div className="grid grid-cols-12 gap-8">
        <div className="col-span-8 space-y-6">
          <FieldTypeFilter />
          <FieldMetadataPanel fields={fields} />
        </div>

        <div className="col-span-4 space-y-8">
          <DetectionStatus fieldCount={fields.length} />
          <AutomationBlockers />
          
          <div className="bg-slate-900 rounded-3xl p-6 text-white overflow-hidden relative group">
            <div className="absolute -top-10 -right-10 w-40 h-40 bg-indigo-500/20 rounded-full blur-3xl group-hover:scale-150 transition-transform duration-1000" />
            <div className="flex items-center space-x-3 mb-4">
               <Activity size={20} className="text-indigo-400" />
               <h3 className="font-bold text-lg">Mutation Stream</h3>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed mb-6">
              Observing child list changes and attribute modifications in sub-trees.
            </p>
            <div className="space-y-3">
               {[1, 2].map(i => (
                 <div key={i} className="flex items-center space-x-3 text-[10px] font-mono text-emerald-400">
                    <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full" />
                    <span>[MUTATION] NODE_INSERTED :: INPUT_TEXT_0492</span>
                 </div>
               ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FormFieldDetection;
