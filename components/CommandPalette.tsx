import React, { useState, useEffect } from 'react';
import { Search, Home, LayoutDashboard, Box, Globe, FileText, Send, Mic, User, Command, Zap } from 'lucide-react';

interface CommandPaletteProps {
    isOpen: boolean;
    onClose: () => void;
    onSelect: (route: string) => void;
}

const COMMANDS = [
    { id: 'landing', label: 'Home', icon: Home, route: 'landing' },
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, route: 'dashboard' },
    { id: 'main', label: 'Apply Central', icon: Box, route: 'main' },
    { id: 'research', label: 'Company Research', icon: Globe, route: 'research' },
    { id: 'optimize', label: 'Resume Optimizer', icon: FileText, route: 'optimize' },
    { id: 'letter', label: 'Cover Letter Architect', icon: Send, route: 'letter' },
    { id: 'coach', label: 'Interview Coach', icon: Mic, route: 'coach' },
    { id: 'profile', label: 'User Profile', icon: User, route: 'profile' },
];

const CommandPalette: React.FC<CommandPaletteProps> = ({ isOpen, onClose, onSelect }) => {
    const [query, setQuery] = useState('');

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
                e.preventDefault();
                if (isOpen) onClose();
                else setQuery(''); // Reset query when opening
            }
            if (e.key === 'Escape') onClose();
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [isOpen, onClose]);

    if (!isOpen) return null;

    const filteredCommands = COMMANDS.filter(cmd =>
        cmd.label.toLowerCase().includes(query.toLowerCase())
    );

    return (
        <div className="fixed inset-0 z-[500] flex items-start justify-center pt-[15vh] px-4 bg-slate-950/40 backdrop-blur-md animate-in fade-in duration-300">
            <div
                className="w-full max-w-2xl bg-white dark:bg-slate-900 rounded-[2rem] shadow-2xl border border-slate-200 dark:border-white/10 overflow-hidden"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="relative flex items-center p-6 border-b border-slate-100 dark:border-white/5">
                    <Search size={24} className="text-indigo-500 mr-4" />
                    <input
                        autoFocus
                        placeholder="Search commands (Ctrl+K to toggle)..."
                        className="flex-1 bg-transparent text-xl font-bold text-slate-900 dark:text-white outline-none placeholder:text-slate-400"
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                    />
                    <div className="hidden sm:flex items-center space-x-1 px-2 py-1 bg-slate-100 dark:bg-slate-800 rounded-lg">
                        <Command size={12} className="text-slate-500" />
                        <span className="text-[10px] font-black text-slate-500">ESC</span>
                    </div>
                </div>

                <div className="max-h-[400px] overflow-y-auto custom-scrollbar p-3">
                    {filteredCommands.length > 0 ? (
                        <div className="space-y-1">
                            {filteredCommands.map((cmd) => (
                                <button
                                    key={cmd.id}
                                    onClick={() => {
                                        onSelect(cmd.route);
                                        onClose();
                                    }}
                                    className="w-full flex items-center justify-between p-4 rounded-2xl hover:bg-indigo-600 group transition-all"
                                >
                                    <div className="flex items-center">
                                        <div className="w-10 h-10 bg-slate-50 dark:bg-slate-800 rounded-xl flex items-center justify-center text-slate-500 group-hover:bg-white/20 group-hover:text-white transition-all mr-4">
                                            <cmd.icon size={20} />
                                        </div>
                                        <span className="font-bold text-slate-700 dark:text-slate-300 group-hover:text-white">{cmd.label}</span>
                                    </div>
                                    <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                                        <Zap size={14} className="text-indigo-200 fill-indigo-200" />
                                    </div>
                                </button>
                            ))}
                        </div>
                    ) : (
                        <div className="py-12 text-center">
                            <p className="text-slate-500 font-bold uppercase tracking-widest text-xs italic">No matching commands found</p>
                        </div>
                    )}
                </div>

                <div className="bg-slate-50 dark:bg-slate-950/50 p-4 flex items-center justify-center space-x-6 text-[10px] font-black text-slate-400 uppercase tracking-widest border-t border-slate-100 dark:border-white/5">
                    <span className="flex items-center"><span className="px-1.5 py-0.5 bg-slate-200 dark:bg-slate-800 rounded mr-2">↑↓</span> Navigate</span>
                    <span className="flex items-center"><span className="px-1.5 py-0.5 bg-slate-200 dark:bg-slate-800 rounded mr-2">ENTER</span> Select</span>
                    <span className="flex items-center"><span className="px-1.5 py-0.5 bg-slate-200 dark:bg-slate-800 rounded mr-3">ESC</span> Close</span>
                </div>
            </div>

            {/* Background overlay click to close */}
            <div className="absolute inset-0 -z-10" onClick={onClose} />
        </div>
    );
};

export default CommandPalette;
