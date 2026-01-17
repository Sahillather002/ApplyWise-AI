
import React, { useState } from 'react';
import { Search, Globe, Building2, Rocket, Newspaper, ExternalLink, Loader2, Sparkles, Target, Users } from 'lucide-react';
import { geminiService } from '../../services/geminiService';
import { CompanyResearch } from '../../types';

const CompanyResearchPage: React.FC = () => {
  const [query, setQuery] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [data, setData] = useState<{ research: CompanyResearch, sources: { title: string, uri: string }[] } | null>(null);

  const handleSearch = async () => {
    if (!query.trim()) return;
    setIsSearching(true);
    try {
      const result = await geminiService.researchCompany(query);
      setData(result);
    } catch (e) {
      console.error("Research failed", e);
    } finally {
      setIsSearching(false);
    }
  };

  return (
    <div className="flex-1 h-full overflow-y-auto custom-scrollbar bg-slate-50 dark:bg-slate-950 p-8">
      <div className="max-w-6xl mx-auto animate-in fade-in duration-500">
        <header className="mb-12">
          <div className="inline-flex items-center space-x-2 px-4 py-2 bg-indigo-600/10 rounded-full mb-6">
            <Globe size={14} className="text-indigo-600" />
            <span className="text-[10px] font-black text-indigo-600 uppercase tracking-widest">Real-time Search Grounding Active</span>
          </div>
          <h1 className="text-4xl font-black text-slate-900 dark:text-white tracking-tighter uppercase italic flex items-center">
            <Building2 size={36} className="mr-3 text-indigo-600" />
            Deep Research
          </h1>
          <p className="text-slate-500 dark:text-slate-400 mt-2 max-w-lg">
            Fetch real-time intelligence, cultural pillars, and tactical interview points using Google-grounded AI.
          </p>
        </header>

        <div className="relative mb-12">
          <div className="absolute inset-y-0 left-0 pl-6 flex items-center pointer-events-none text-slate-400">
            <Search size={20} />
          </div>
          <input 
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
            placeholder="Enter company name (e.g. Anthropic, Stripe, Vercel)..."
            className="w-full bg-white dark:bg-slate-900 border-2 border-slate-100 dark:border-white/5 rounded-[2rem] pl-16 pr-48 py-6 text-lg font-medium shadow-2xl shadow-indigo-500/5 focus:border-indigo-500 transition-all outline-none"
          />
          <button 
            onClick={handleSearch}
            disabled={isSearching}
            className="absolute right-3 top-1/2 -translate-y-1/2 bg-indigo-600 hover:bg-indigo-500 text-white px-8 py-4 rounded-2xl font-black text-xs uppercase tracking-widest transition-all disabled:opacity-50 flex items-center space-x-2"
          >
            {isSearching ? <Loader2 size={16} className="animate-spin" /> : <Sparkles size={16} />}
            <span>{isSearching ? 'Grounding Intelligence...' : 'Investigate'}</span>
          </button>
        </div>

        {data ? (
          <div className="grid grid-cols-12 gap-8 animate-in slide-in-from-bottom-6 duration-700">
            {/* Mission & Culture */}
            <div className="col-span-12 lg:col-span-8 space-y-8">
              <section className="bg-white dark:bg-slate-900 rounded-[2.5rem] p-10 border border-slate-200 dark:border-white/5 shadow-sm">
                <div className="flex items-center space-x-3 mb-6">
                  <Target size={24} className="text-indigo-600" />
                  <h2 className="text-xl font-black text-slate-900 dark:text-white uppercase italic">Mission Statement</h2>
                </div>
                <p className="text-xl text-slate-600 dark:text-slate-300 font-medium leading-relaxed italic">
                  "{data.research.mission}"
                </p>
                <div className="grid grid-cols-2 gap-4 mt-10 pt-10 border-t border-slate-100 dark:border-white/5">
                  {data.research.culturePoints.map((point, i) => (
                    <div key={i} className="flex items-start space-x-3 p-4 bg-slate-50 dark:bg-slate-800/50 rounded-2xl">
                      <Users size={18} className="text-indigo-500 shrink-0 mt-0.5" />
                      <p className="text-xs font-bold text-slate-700 dark:text-slate-200">{point}</p>
                    </div>
                  ))}
                </div>
              </section>

              <section className="bg-slate-900 rounded-[2.5rem] p-10 text-white relative overflow-hidden group">
                <div className="absolute top-0 right-0 p-10 opacity-10 group-hover:scale-110 transition-transform duration-1000">
                   <Newspaper size={160} />
                </div>
                <h2 className="text-xl font-black uppercase italic mb-8 relative z-10 flex items-center">
                  <Rocket size={20} className="mr-3 text-indigo-400" /> Strategic Talking Points
                </h2>
                <div className="space-y-4 relative z-10">
                  {data.research.talkingPoints.map((point, i) => (
                    <div key={i} className="flex items-start space-x-4 p-5 bg-white/5 border border-white/5 rounded-2xl hover:bg-white/10 transition-all">
                      <div className="w-8 h-8 rounded-full bg-indigo-600 flex items-center justify-center text-[10px] font-black shrink-0">0{i+1}</div>
                      <p className="text-sm font-medium leading-relaxed text-slate-300">{point}</p>
                    </div>
                  ))}
                </div>
              </section>
            </div>

            {/* Sources & Links */}
            <div className="col-span-12 lg:col-span-4 space-y-8">
              <section className="bg-white dark:bg-slate-900 rounded-[2.5rem] p-8 border border-slate-200 dark:border-white/5 shadow-sm">
                <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-6">Verification Sources</h3>
                <div className="space-y-3">
                  {data.sources.map((src, i) => (
                    <a 
                      key={i} 
                      href={src.uri} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-800 hover:bg-indigo-600 group transition-all rounded-2xl border border-slate-100 dark:border-white/5"
                    >
                      <div className="flex-1 min-w-0 pr-4">
                        <p className="text-[10px] font-bold text-slate-400 group-hover:text-indigo-200 uppercase tracking-tighter truncate">{src.title}</p>
                        <p className="text-xs font-medium text-slate-700 dark:text-slate-200 group-hover:text-white truncate mt-0.5">{src.uri}</p>
                      </div>
                      <ExternalLink size={14} className="text-slate-300 group-hover:text-white" />
                    </a>
                  ))}
                </div>
              </section>

              <div className="p-8 bg-indigo-600 rounded-[2.5rem] text-white shadow-2xl shadow-indigo-500/20">
                <Sparkles size={32} className="mb-4 text-indigo-200" />
                <h4 className="font-black text-lg mb-2 leading-tight">Advisor Insight</h4>
                <p className="text-sm text-indigo-100 leading-relaxed font-medium">
                  Based on these findings, emphasize your experience with scalable infrastructure during the technical screen.
                </p>
              </div>
            </div>
          </div>
        ) : !isSearching && (
          <div className="py-20 text-center flex flex-col items-center">
             <div className="w-24 h-24 bg-slate-100 dark:bg-slate-900 rounded-[2rem] flex items-center justify-center text-slate-300 dark:text-slate-800 mb-6">
                <Building2 size={48} />
             </div>
             <p className="text-slate-400 font-bold uppercase tracking-widest text-xs">Awaiting Intelligence Request</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default CompanyResearchPage;
