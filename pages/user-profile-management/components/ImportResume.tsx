
import React, { useRef, useState } from 'react';
import { Upload, FileText, Loader2 } from 'lucide-react';

interface ImportResumeProps {
  onImport: (file: File) => Promise<void>;
  isImporting: boolean;
}

const ImportResume: React.FC<ImportResumeProps> = ({ onImport, isImporting }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      await onImport(file);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  return (
    <div className="relative">
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        className="hidden"
        accept=".pdf,.docx,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
      />
      <button 
        onClick={() => fileInputRef.current?.click()}
        disabled={isImporting}
        className="flex items-center space-x-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-white/10 text-slate-700 dark:text-slate-200 px-6 py-3 rounded-2xl font-bold transition-all shadow-sm hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed group active:scale-95"
      >
        {isImporting ? (
          <Loader2 size={18} className="text-indigo-500 animate-spin" />
        ) : (
          <FileText size={18} className="text-indigo-500 group-hover:scale-110 transition-transform" />
        )}
        <span>{isImporting ? 'Parsing with AI...' : 'Import Resume (PDF/DOCX)'}</span>
      </button>
    </div>
  );
};

export default ImportResume;
