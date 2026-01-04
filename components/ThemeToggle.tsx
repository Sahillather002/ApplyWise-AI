
import React from 'react';
import { Sun, Moon } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';

const ThemeToggle: React.FC = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className="p-2 rounded-xl transition-all duration-300 bg-white dark:bg-slate-800 border border-slate-200 dark:border-white/10 shadow-sm hover:shadow-md active:scale-95 flex items-center justify-center group"
      aria-label="Toggle Theme"
    >
      {theme === 'light' ? (
        <Moon size={18} className="text-slate-600 group-hover:text-indigo-600 transition-colors" />
      ) : (
        <Sun size={18} className="text-amber-400 group-hover:text-amber-300 transition-colors" />
      )}
    </button>
  );
};

export default ThemeToggle;
