import React, { useState } from 'react';
import { Sparkles, FileText, Copy, Loader2, Download, Send, RefreshCw, Type as TypeIcon } from 'lucide-react';
import { geminiService } from '../../services/geminiService';
import { UserProfile } from '../../types';

interface CoverLetterArchitectProps {
    profile: UserProfile;
}

const CoverLetterArchitect: React.FC<CoverLetterArchitectProps> = ({ profile }) => {
    const [jobDescription, setJobDescription] = useState('');
    const [tone, setTone] = useState<'formal' | 'enthusiastic' | 'creative'>('formal');
    const [isGenerating, setIsGenerating] = useState(false);
    const [coverLetter, setCoverLetter] = useState('');

    const handleGenerate = async () => {
        if (!jobDescription.trim()) return;
        setIsGenerating(true);
        try {
            const prompt = `Write a tailored cover letter for me based on my profile and this job description.
      Tone: ${tone}
      
      My Profile: ${JSON.stringify(profile)}
      Job Description: ${jobDescription}
      
      Format the output as a professional letter. Include placeholders for today's date and the hiring manager's name if not provided.`;

            const response = await geminiService.chat(prompt, [], profile);
            setCoverLetter(response);
        } catch (error) {
            console.error('Generation failed:', error);
        } finally {
            setIsGenerating(false);
        }
    };

    const copyToClipboard = () => {
        navigator.clipboard.writeText(coverLetter);
    };

    const downloadAsTxt = () => {
        const element = document.createElement("a");
        const file = new Blob([coverLetter], { type: 'text/plain' });
        element.href = URL.createObjectURL(file);
        element.download = "cover_letter.txt";
        document.body.appendChild(element);
        element.click();
    };

    return (
        <div className="p-8 max-w-6xl mx-auto animate-fade-in h-[calc(100vh-64px)] overflow-hidden flex flex-col">
            <div className="mb-8 flex-shrink-0">
                <h1 className="text-3xl font-black text-slate-900 dark:text-white uppercase tracking-tighter mb-2 italic flex items-center">
                    <Send size={28} className="mr-3 text-indigo-600" />
                    Cover Letter Architect
                </h1>
                <p className="text-slate-500 font-medium">Create professional, high-impact cover letters tailored to any job in seconds.</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 flex-1 overflow-hidden">
                {/* Input Panel */}
                <div className="flex flex-col space-y-6 overflow-hidden">
                    <div className="bg-white dark:bg-slate-900 p-6 rounded-[2.5rem] shadow-xl border border-slate-100 dark:border-white/5 flex flex-col flex-1">
                        <div className="flex items-center justify-between mb-4">
                            <label className="text-[10px] font-black uppercase tracking-widest text-indigo-500">Job Requirements</label>
                            <div className="flex space-x-2">
                                {(['formal', 'enthusiastic', 'creative'] as const).map((t) => (
                                    <button
                                        key={t}
                                        onClick={() => setTone(t)}
                                        className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-tighter transition-all ${tone === t
                                                ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/20'
                                                : 'bg-slate-100 dark:bg-slate-800 text-slate-500 hover:text-slate-900 dark:hover:text-white'
                                            }`}
                                    >
                                        {t}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <textarea
                            value={jobDescription}
                            onChange={(e) => setJobDescription(e.target.value)}
                            placeholder="Paste the job description or specific requirements here..."
                            className="flex-1 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-white/10 rounded-2xl p-4 text-sm outline-none focus:border-indigo-500 transition-colors resize-none custom-scrollbar"
                        />

                        <button
                            onClick={handleGenerate}
                            disabled={isGenerating || !jobDescription.trim()}
                            className="w-full mt-6 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white font-black py-4 rounded-2xl shadow-xl shadow-indigo-500/20 transition-all flex items-center justify-center space-x-2 group"
                        >
                            {isGenerating ? <Loader2 className="animate-spin" /> : <Sparkles size={18} className="group-hover:rotate-12 transition-transform" />}
                            <span className="uppercase tracking-widest text-xs">{isGenerating ? 'Architecting...' : 'Generate Letter'}</span>
                        </button>
                    </div>
                </div>

                {/* Output Panel */}
                <div className="flex flex-col space-y-6 overflow-hidden">
                    {!coverLetter && !isGenerating ? (
                        <div className="flex-1 flex flex-col items-center justify-center text-center p-12 border-2 border-dashed border-slate-200 dark:border-white/5 rounded-[2.5rem]">
                            <div className="w-16 h-16 bg-slate-100 dark:bg-slate-900 rounded-3xl flex items-center justify-center mb-6 text-slate-400">
                                <FileText size={32} />
                            </div>
                            <p className="text-slate-400 font-bold uppercase tracking-widest text-xs">Waiting for requirements</p>
                            <p className="text-[10px] text-slate-500 mt-2 max-w-[200px]">Provide job details on the left to start architecting your letter.</p>
                        </div>
                    ) : (
                        <div className="bg-white dark:bg-slate-900 p-8 rounded-[2.5rem] shadow-xl border border-slate-100 dark:border-white/5 flex flex-col flex-1 overflow-hidden relative group">
                            <div className="flex items-center justify-between mb-6 flex-shrink-0">
                                <div className="flex items-center space-x-2">
                                    <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                                    <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Generated Draft</span>
                                </div>
                                <div className="flex items-center space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <button onClick={handleGenerate} className="p-2 text-slate-400 hover:text-indigo-500 transition-colors" title="Regenerate">
                                        <RefreshCw size={14} />
                                    </button>
                                    <button onClick={copyToClipboard} className="p-2 text-slate-400 hover:text-indigo-500 transition-colors" title="Copy to Clipboard">
                                        <Copy size={14} />
                                    </button>
                                    <button onClick={downloadAsTxt} className="p-2 text-slate-400 hover:text-indigo-500 transition-colors" title="Download TXT">
                                        <Download size={14} />
                                    </button>
                                </div>
                            </div>

                            <div className="flex-1 overflow-y-auto custom-scrollbar pr-2 whitespace-pre-wrap text-sm text-slate-700 dark:text-slate-300 leading-relaxed font-serif">
                                {isGenerating ? (
                                    <div className="space-y-4 animate-pulse">
                                        <div className="h-4 bg-slate-100 dark:bg-slate-800 rounded w-1/3 mb-8"></div>
                                        <div className="h-4 bg-slate-100 dark:bg-slate-800 rounded w-full"></div>
                                        <div className="h-4 bg-slate-100 dark:bg-slate-800 rounded w-full"></div>
                                        <div className="h-4 bg-slate-100 dark:bg-slate-800 rounded w-5/6"></div>
                                        <div className="h-4 bg-slate-100 dark:bg-slate-800 rounded w-4/5 mt-8"></div>
                                    </div>
                                ) : (
                                    coverLetter
                                )}
                            </div>

                            <div className="mt-6 pt-6 border-t border-slate-50 dark:border-white/5 flex items-center justify-between flex-shrink-0">
                                <div className="flex items-center space-x-3">
                                    <div className="w-8 h-8 rounded-full bg-indigo-600/10 flex items-center justify-center text-indigo-600">
                                        <TypeIcon size={14} />
                                    </div>
                                    <div>
                                        <p className="text-[9px] font-black uppercase tracking-tighter text-slate-400 leading-none mb-1">Estimated Read Time</p>
                                        <p className="text-xs font-bold text-slate-900 dark:text-white leading-none">~2 minutes</p>
                                    </div>
                                </div>
                                <button
                                    onClick={copyToClipboard}
                                    className="flex items-center space-x-2 px-6 py-3 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:scale-105 transition-all shadow-lg active:scale-95"
                                >
                                    <Copy size={14} />
                                    <span>Copy Content</span>
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default CoverLetterArchitect;
