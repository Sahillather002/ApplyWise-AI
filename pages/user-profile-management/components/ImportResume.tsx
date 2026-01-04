
import React from 'react';
import { Upload, FileText } from 'lucide-react';

const ImportResume: React.FC = () => {
  return (
    <button className="flex items-center space-x-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-white/10 text-slate-700 dark:text-slate-200 px-6 py-3 rounded-2xl font-bold transition-all shadow-sm hover:shadow-md">
      <FileText size={18} className="text-indigo-500" />
      <span>Import PDF</span>
    </button>
  );
};

export default ImportResume;
