
import React from 'react';
import { Zap, Sparkles, ArrowRight, ShieldCheck, Cpu, Globe as GlobeIcon } from 'lucide-react';
import Globe from '../components/Globe';
import Particles from '../components/Particles';

interface LandingPageProps {
  onStart: () => void;
}

const LandingPage: React.FC<LandingPageProps> = ({ onStart }) => {
  return (
    <div className="relative min-h-screen w-full flex flex-col items-center overflow-hidden bg-slate-50 dark:bg-slate-950 transition-colors duration-500">
      <Particles />

      {/* Navigation */}
      <nav className="relative z-10 w-full max-w-7xl px-8 py-6 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-indigo-500/20">
            <Zap size={22} fill="currentColor" />
          </div>
          <span className="font-black text-2xl tracking-tighter text-slate-900 dark:text-white uppercase italic">ApplyWise</span>
        </div>
        <div className="hidden md:flex items-center space-x-8 text-sm font-bold text-slate-500 dark:text-slate-400">
          <a href="#" className="hover:text-indigo-600 transition-colors">Platform</a>
          <a href="#" className="hover:text-indigo-600 transition-colors">Intelligence</a>
          <a href="#" className="hover:text-indigo-600 transition-colors">Security</a>
          <button 
            onClick={onStart}
            className="bg-slate-900 dark:bg-white text-white dark:text-slate-900 px-6 py-2.5 rounded-xl font-black text-xs uppercase tracking-widest hover:scale-105 transition-transform active:scale-95 shadow-xl"
          >
            Launch Hub
          </button>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="relative z-10 flex-1 w-full max-w-7xl px-8 flex flex-col lg:flex-row items-center justify-center lg:justify-between py-12 md:py-24 space-y-16 lg:space-y-0">
        <div className="flex-1 text-center lg:text-left space-y-8 animate-in fade-in slide-in-from-left-8 duration-1000">
          <div className="inline-flex items-center space-x-2 px-4 py-2 bg-indigo-600/5 dark:bg-indigo-400/10 border border-indigo-500/20 rounded-full">
            <Sparkles size={14} className="text-indigo-600 dark:text-indigo-400" />
            <span className="text-[10px] font-black text-indigo-600 dark:text-indigo-400 uppercase tracking-[0.2em]">Next-Gen Career Intelligence</span>
          </div>
          
          <h1 className="text-5xl md:text-7xl xl:text-8xl font-black text-slate-900 dark:text-white tracking-tighter leading-[0.9] italic">
            APPLY <span className="text-indigo-600">SMARTER</span>,<br />
            HIRE FASTER.
          </h1>
          
          <p className="text-lg md:text-xl text-slate-500 dark:text-slate-400 max-w-xl font-medium leading-relaxed mx-auto lg:mx-0">
            ApplyWise leverages decentralized AI to map your career graph to global opportunities with 99% accuracy. Securely vault your data and automate the tedious.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start space-y-4 sm:space-y-0 sm:space-x-4 pt-4">
            <button 
              onClick={onStart}
              className="group bg-indigo-600 hover:bg-indigo-500 text-white px-10 py-5 rounded-[2rem] font-black text-lg uppercase tracking-tighter transition-all shadow-2xl shadow-indigo-500/30 flex items-center space-x-3 active:scale-95"
            >
              <span>Get Started</span>
              <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
            </button>
            <button className="px-10 py-5 rounded-[2rem] font-black text-lg uppercase tracking-tighter transition-all text-slate-900 dark:text-white border border-slate-200 dark:border-white/10 hover:bg-slate-100 dark:hover:bg-slate-900">
              View Specs
            </button>
          </div>

          <div className="flex items-center justify-center lg:justify-start space-x-8 pt-12">
            <div className="flex flex-col space-y-1">
               <span className="text-2xl font-black text-slate-900 dark:text-white">142k+</span>
               <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Applications Filed</span>
            </div>
            <div className="w-px h-10 bg-slate-200 dark:bg-white/10" />
            <div className="flex flex-col space-y-1">
               <span className="text-2xl font-black text-slate-900 dark:text-white">48h</span>
               <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Avg Time Saved</span>
            </div>
          </div>
        </div>

        <div className="flex-1 flex justify-center lg:justify-end animate-in fade-in slide-in-from-right-8 duration-1000 delay-300">
          <Globe />
        </div>
      </main>

      {/* Floating Badges */}
      <div className="relative z-10 w-full max-w-7xl px-8 pb-12 flex flex-wrap items-center justify-center lg:justify-start gap-8 opacity-50 grayscale hover:grayscale-0 transition-all duration-700">
        <div className="flex items-center space-x-2 font-black text-xs text-slate-400 dark:text-slate-500 uppercase tracking-widest">
           <ShieldCheck size={16} />
           <span>Military Grade Vaulting</span>
        </div>
        <div className="flex items-center space-x-2 font-black text-xs text-slate-400 dark:text-slate-500 uppercase tracking-widest">
           <Cpu size={16} />
           <span>Neural Mapping Engine</span>
        </div>
        <div className="flex items-center space-x-2 font-black text-xs text-slate-400 dark:text-slate-500 uppercase tracking-widest">
           <GlobeIcon size={16} />
           <span>Global Node Retrieval</span>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;
