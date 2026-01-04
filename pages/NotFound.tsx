
import React from 'react';
import { Home, AlertCircle } from 'lucide-react';

interface NotFoundProps {
  onGoHome: () => void;
}

const NotFound: React.FC<NotFoundProps> = ({ onGoHome }) => {
  return (
    <div className="flex flex-col items-center justify-center h-screen bg-slate-50 dark:bg-slate-950 px-6 text-center">
      <div className="w-20 h-20 bg-red-100 dark:bg-red-900/20 rounded-3xl flex items-center justify-center text-red-500 mb-8 animate-bounce">
        <AlertCircle size={40} />
      </div>
      <h1 className="text-4xl font-black text-slate-900 dark:text-white mb-4 tracking-tight">404 - Page Not Found</h1>
      <p className="text-slate-500 dark:text-slate-400 max-w-md mb-8 leading-relaxed">
        The application module you're looking for seems to have drifted into digital subspace.
      </p>
      <button
        onClick={onGoHome}
        className="flex items-center space-x-2 bg-indigo-600 hover:bg-indigo-500 text-white px-6 py-3 rounded-2xl font-bold transition-all shadow-lg shadow-indigo-500/20"
      >
        <Home size={18} />
        <span>Return to Dashboard</span>
      </button>
    </div>
  );
};

export default NotFound;
