import React, { useState, useEffect } from 'react';
import { LayoutDashboard, TrendingUp, Zap, Calendar, Target, Clock, Star, ArrowUpRight, CheckCircle2, AlertCircle } from 'lucide-react';
import { geminiService } from '../../services/geminiService';
import { UserProfile, JobOpportunity } from '../../types';

interface DashboardPageProps {
   profile: UserProfile;
}

const DashboardPage: React.FC<DashboardPageProps> = ({ profile }) => {
   const [opportunities, setOpportunities] = useState<JobOpportunity[]>([]);
   const [isScouting, setIsScouting] = useState(false);

   const handleScout = async () => {
      setIsScouting(true);
      try {
         const jobs = await geminiService.findOpportunities(profile);
         setOpportunities(jobs);
      } catch (error) {
         console.error("Scouting failed:", error);
      } finally {
         setIsScouting(false);
      }
   };

   useEffect(() => {
      handleScout();
   }, []);

   return (
      <div className="flex-1 h-full overflow-y-auto custom-scrollbar bg-slate-50 dark:bg-slate-950 p-8">
         <div className="max-w-7xl mx-auto space-y-10 animate-in fade-in slide-in-from-bottom-6 duration-700">

            <header className="flex flex-col md:flex-row md:items-end justify-between space-y-4 md:space-y-0">
               <div>
                  <div className="flex items-center space-x-2 px-4 py-2 bg-indigo-600/10 rounded-full mb-6 w-fit">
                     <Zap size={14} className="text-indigo-600" />
                     <span className="text-[10px] font-black text-indigo-600 uppercase tracking-widest italic">Smart Career Engine Active</span>
                  </div>
                  <h1 className="text-5xl font-black text-slate-900 dark:text-white tracking-tighter uppercase italic">
                     Welcome back, {profile.fullName.split(' ')[0]}
                  </h1>
                  <p className="text-slate-500 dark:text-slate-400 mt-2 font-medium">Your career hunt is currently operating at <span className="text-emerald-500 font-bold">peak velocity</span>.</p>
               </div>
               <div className="flex items-center space-x-3">
                  <div className="text-right">
                     <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Global Rank</p>
                     <p className="text-xl font-black text-slate-900 dark:text-white tracking-tight">Top 2% Candidate</p>
                  </div>
                  <div className="w-14 h-14 bg-indigo-600 rounded-2xl flex items-center justify-center text-white shadow-xl shadow-indigo-500/20">
                     <TrendingUp size={28} />
                  </div>
               </div>
            </header>

            {/* Bento Grid */}
            <div className="grid grid-cols-12 gap-8">

               {/* AI Briefing */}
               <div className="col-span-12 lg:col-span-8 bg-slate-900 rounded-[3rem] p-10 text-white relative overflow-hidden group shadow-2xl">
                  <div className="absolute top-0 right-0 p-10 opacity-5 group-hover:scale-125 transition-transform duration-1000">
                     <Star size={200} fill="white" />
                  </div>
                  <div className="relative z-10 flex flex-col h-full">
                     <div className="flex items-center space-x-3 mb-8">
                        <Target size={24} className="text-indigo-400" />
                        <h2 className="text-xl font-black uppercase italic tracking-tight">Today's Strategic Focus</h2>
                     </div>
                     <div className="flex-1 space-y-6">
                        <div className="bg-white/5 border border-white/5 p-6 rounded-3xl hover:bg-white/10 transition-all cursor-pointer">
                           <div className="flex items-center justify-between mb-2">
                              <p className="text-xs font-black text-indigo-400 uppercase tracking-widest">Priority Application</p>
                              <span className="text-[10px] bg-indigo-600 px-2 py-1 rounded-full">HIGH CONTEXT MATCH</span>
                           </div>
                           <h3 className="text-2xl font-bold mb-1">Stripe &middot; Staff Frontend Architect</h3>
                           <p className="text-slate-400 text-sm italic">"Your experience with React 18 migrations perfectly aligns with their Infrastructure roadmap. Apply by EOD for maximum exposure."</p>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                           <div className="bg-white/5 border border-white/5 p-5 rounded-3xl">
                              <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">Prep Needed</p>
                              <p className="text-sm font-bold">Google Interview (Round 2)</p>
                              <div className="mt-3 flex items-center text-emerald-400 space-x-1">
                                 <Clock size={12} />
                                 <span className="text-[10px] font-black uppercase tracking-tighter">Starts in 4h</span>
                              </div>
                           </div>
                           <div className="bg-white/5 border border-white/5 p-5 rounded-3xl">
                              <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">Network Intel</p>
                              <p className="text-sm font-bold">3 Vercel employees matched</p>
                              <p className="text-[10px] text-slate-500 mt-2 uppercase font-black cursor-pointer hover:text-indigo-400 transition-colors">Request Intro &rarr;</p>
                           </div>
                        </div>
                     </div>
                  </div>
               </div>

               {/* Core Analytics */}
               <div className="col-span-12 lg:col-span-4 space-y-8">
                  <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/5 rounded-[3rem] p-8 shadow-sm">
                     <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-8">Pipeline Health</h3>
                     <div className="space-y-6">
                        <div className="flex items-end justify-between">
                           <span className="text-5xl font-black tracking-tighter">88%</span>
                           <span className="text-xs font-bold text-indigo-600 uppercase tracking-widest pb-1">Response Rate</span>
                        </div>
                        <div className="h-2 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                           <div className="h-full bg-indigo-600" style={{ width: '88%' }} />
                        </div>
                        <div className="grid grid-cols-2 gap-4 pt-4">
                           <div>
                              <p className="text-2xl font-black">14</p>
                              <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Active Leads</p>
                           </div>
                           <div>
                              <p className="text-2xl font-black text-emerald-500">2</p>
                              <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Active Offers</p>
                           </div>
                        </div>
                     </div>
                  </div>

                  <div className="bg-indigo-600 rounded-[2.5rem] p-8 text-white shadow-2xl shadow-indigo-500/30">
                     <div className="flex items-center space-x-3 mb-4">
                        <CheckCircle2 size={24} className="text-indigo-200" />
                        <h4 className="font-black text-lg tracking-tight uppercase italic leading-none">Profile Optimized</h4>
                     </div>
                     <p className="text-sm text-indigo-100 leading-relaxed font-medium mb-6">
                        Your profile has been analyzed for the latest industry keywords. Visibility is up <span className="font-bold text-white">40%</span> this week.
                     </p>
                     <button className="w-full py-3 bg-white text-indigo-600 rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-lg hover:scale-[1.02] transition-all">Audit Now</button>
                  </div>
               </div>

               {/* Recent Opportunities */}
               <div className="col-span-12 space-y-6">
                  <div className="flex items-center justify-between">
                     <h3 className="text-sm font-black text-slate-400 uppercase tracking-widest italic">Recommended Opportunities</h3>
                     <button className="text-[10px] font-black text-indigo-600 uppercase tracking-widest hover:underline flex items-center space-x-1">
                        <span>Explore All Hub</span>
                        <ArrowUpRight size={12} />
                     </button>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                     {isScouting ? (
                        [1, 2, 3].map(i => (
                           <div key={i} className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/5 p-6 rounded-[2.5rem] h-48 animate-pulse" />
                        ))
                     ) : opportunities.length > 0 ? (
                        opportunities.slice(0, 3).map((job, i) => (
                           <div key={job.id || i} className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/5 p-6 rounded-[2.5rem] shadow-sm hover:border-indigo-500/30 transition-all cursor-pointer group">
                              <div className="flex justify-between items-start mb-6">
                                 <div className="w-12 h-12 bg-slate-50 dark:bg-slate-800 rounded-2xl flex items-center justify-center font-black text-slate-400 group-hover:bg-indigo-600 group-hover:text-white transition-all">
                                    {job.company[0]}
                                 </div>
                                 <div className="flex items-center space-x-1 text-emerald-500">
                                    <Zap size={12} className="fill-emerald-500" />
                                    <span className="text-[10px] font-black">{job.matchScore}%</span>
                                 </div>
                              </div>
                              <h4 className="font-bold text-slate-900 dark:text-white mb-1 truncate">{job.title}</h4>
                              <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">{job.company} &middot; {job.location}</p>
                           </div>
                        ))
                     ) : (
                        <div className="col-span-3 text-center py-12 bg-white dark:bg-slate-900 border border-dashed border-slate-200 dark:border-white/5 rounded-[2.5rem]">
                           <p className="text-slate-400 font-bold uppercase tracking-widest text-xs">No opportunities found</p>
                           <button onClick={handleScout} className="mt-4 text-indigo-600 font-black text-[10px] uppercase tracking-widest hover:underline">Retry Scouting</button>
                        </div>
                     )}
                  </div>
               </div>
            </div>
         </div>
      </div>
   );
};

export default DashboardPage;
