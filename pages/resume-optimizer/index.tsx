import React, { useState } from 'react';
import { Sparkles, ArrowRight, FileText, CheckCircle2, Loader2, Copy } from 'lucide-react';
import { geminiService } from '../../services/geminiService';
import { UserProfile } from '../../types';

interface ResumeOptimizerProps {
    profile: UserProfile;
}

const ResumeOptimizer: React.FC<ResumeOptimizerProps> = ({ profile }) => {
    const [jobDescription, setJobDescription] = useState('');
    const [isOptimizing, setIsOptimizing] = useState(false);
    const [optimizations, setOptimizations] = useState<{ original: string, optimized: string, reasoning: string }[]>([]);

    const handleOptimize = async () => {
        if (!jobDescription.trim()) return;
        setIsOptimizing(true);
        try {
            // In a real app, we'd call a dedicated service method. 
            // For now, we'll use a specific prompt with the general chat or audit method logic.
            const prompt = `Based on this job description: "${jobDescription}", optimize the following work experience bullet points from my profile to better align with the requirements:
      ${profile.experience.map(e => `- ${e.company}: ${e.description}`).join('\n')}
      
      Format the output as a JSON array of objects: { "original": string, "optimized": string, "reasoning": string }`;

            const response = await geminiService.chat(prompt, [], profile);
            // Clean up the response to extract JSON
            const jsonStr = response.replace(/```json|```/g, '').trim();
            setOptimizations(JSON.parse(jsonStr));
        } catch (error) {
            console.error('Optimization failed:', error);
        } finally {
            setIsOptimizing(false);
        }
    };

    return (
        <div className="p-8 max-w-4xl mx-auto animate-fade-in">
            <div className="mb-8">
                <h1 className="text-3xl font-black text-slate-900 dark:text-white uppercase tracking-tighter mb-2">Resume Optimizer</h1>
                <p className="text-slate-500 font-medium">Tailor your experience bullet points for specific job requirements using AI.</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="space-y-6">
                    <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl shadow-xl border border-slate-200 dark:border-white/10">
                        <label className="block text-xs font-black uppercase tracking-widest text-indigo-500 mb-4">Target Job Description</label>
                        <textarea
                            value={jobDescription}
                            onChange={(e) => setJobDescription(e.target.value)}
                            placeholder="Paste the job description here..."
                            className="w-full h-64 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-white/10 rounded-2xl p-4 text-sm outline-none focus:border-indigo-500 transition-colors resize-none"
                        />
                        <button
                            onClick={handleOptimize}
                            disabled={isOptimizing || !jobDescription.trim()}
                            className="w-full mt-6 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white font-bold py-4 rounded-2xl shadow-xl shadow-indigo-500/20 transition-all flex items-center justify-center space-x-2"
                        >
                            {isOptimizing ? <Loader2 className="animate-spin" /> : <Sparkles size={20} />}
                            <span>{isOptimizing ? 'Analyzing Skills...' : 'Optimize Bullet Points'}</span>
                        </button>
                    </div>
                </div>

                <div className="space-y-6">
                    {!optimizations.length && !isOptimizing && (
                        <div className="h-full flex flex-col items-center justify-center text-center p-12 border-2 border-dashed border-slate-200 dark:border-white/5 rounded-3xl">
                            <FileText size={48} className="text-slate-300 dark:text-slate-800 mb-4" />
                            <p className="text-slate-400 font-bold uppercase tracking-widest text-xs">Enter a job description to see AI optimizations</p>
                        </div>
                    )}

                    {isOptimizing && (
                        <div className="space-y-4">
                            {[1, 2, 3].map(i => (
                                <div key={i} className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-white/10 animate-pulse">
                                    <div className="h-4 w-3/4 bg-slate-100 dark:bg-slate-800 rounded-full mb-4"></div>
                                    <div className="h-4 w-1/2 bg-slate-100 dark:bg-slate-800 rounded-full"></div>
                                </div>
                            ))}
                        </div>
                    )}

                    {optimizations.map((opt, i) => (
                        <div key={i} className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-white/10 shadow-lg hover:shadow-xl transition-shadow group">
                            <div className="space-y-4">
                                <div>
                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Original</p>
                                    <p className="text-sm text-slate-500 italic line-through decoration-red-500/30">{opt.original}</p>
                                </div>
                                <div className="relative">
                                    <p className="text-[10px] font-black text-emerald-500 uppercase tracking-widest mb-1">Optimized</p>
                                    <p className="text-sm text-slate-900 dark:text-slate-100 font-medium leading-relaxed">{opt.optimized}</p>
                                    <button
                                        onClick={() => navigator.clipboard.writeText(opt.optimized)}
                                        className="absolute top-0 right-0 p-2 text-slate-400 hover:text-indigo-500 opacity-0 group-hover:opacity-100 transition-opacity"
                                    >
                                        <Copy size={16} />
                                    </button>
                                </div>
                                <div className="pt-4 border-t border-slate-100 dark:border-white/5 flex items-start space-x-2">
                                    <CheckCircle2 size={14} className="text-indigo-500 mt-1 flex-shrink-0" />
                                    <p className="text-[11px] text-slate-500 leading-tight">{opt.reasoning}</p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default ResumeOptimizer;
