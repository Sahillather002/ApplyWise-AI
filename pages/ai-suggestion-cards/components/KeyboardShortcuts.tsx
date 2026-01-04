
import React from 'react';
import { Command } from 'lucide-react';

const KeyboardShortcuts: React.FC = () => {
  const shortcuts = [
    { key: 'Tab', action: 'Move Focus' },
    { key: 'Enter', action: 'Accept Match' },
    { key: 'Esc', action: 'Dismiss Card' },
    { key: '⌘ E', action: 'Edit Mode' },
  ];

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/5 rounded-3xl p-6 shadow-sm">
      <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-6 flex items-center">
        <Command size={14} className="mr-2" /> Keyboard Shortcuts
      </h3>
      <div className="space-y-3">
        {shortcuts.map((s, i) => (
          <div key={i} className="flex justify-between items-center text-xs">
            <span className="text-slate-500 font-bold">{s.action}</span>
            <kbd className="bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded-md border border-slate-200 dark:border-white/5 font-mono font-black text-slate-900 dark:text-white">{s.key}</kbd>
          </div>
        ))}
      </div>
    </div>
  );
};

export default KeyboardShortcuts;
