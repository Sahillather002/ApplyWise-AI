
import React from 'react';
import { Zap, Sparkles, ArrowRight, ShieldCheck, Cpu, Globe as GlobeIcon } from 'lucide-react';
import Globe from '../components/Globe';
import Particles from '../components/Particles';

interface LandingPageProps {
  onStart: () => void;
}

const LandingPage: React.FC<LandingPageProps> = ({ onStart }) => {
  return (
    <div className="relative min-h-screen w-full flex flex-col items-center overflow-hidden bg-slate-50 dark:bg-slate-950 transition-colors duration-700">
      <Particles />

      {/* Decorative background gradients */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[800px] bg-gradient-to-b from-indigo-500/5 via-transparent to-transparent pointer-events-none" />
      <div className="absolute -top-[10%] -left-[10%] w-[40%] h-[40%] bg-indigo-600/5 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute -bottom-[10%] -right-[10%] w-[40%] h-[40%] bg-purple-600/5 blur-[120px] rounded-full pointer-events-none" />

      {/* Navigation */}
      <nav className="relative z-10 w-full max-w-7xl px-8 py-8 flex items-center justify-between">
        <div className="flex items-center space-x-3 group cursor-pointer" onClick={() => window.location.reload()}>
          <div className="w-11 h-11 bg-indigo-600 rounded-2xl flex items-center justify-center text-white shadow-xl shadow-indigo-500/30 group-hover:scale-110 group-hover:rotate-3 transition-all duration-300">
            <Zap size={24} fill="currentColor" />
          </div>
          <span className="font-black text-2xl tracking-tighter text-slate-900 dark:text-white uppercase italic">ApplyWise</span>
        </div>
        <div className="hidden lg:flex items-center space-x-10 text-[11px] font-black uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400">
          <a href="#" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors py-2">Platform</a>
          <a href="#" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors py-2">Intelligence</a>
          <a href="#" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors py-2">Security</a>
          <button
            onClick={onStart}
            className="bg-slate-900 dark:bg-white text-white dark:text-slate-900 px-8 py-3 rounded-2xl font-black text-[11px] uppercase tracking-[0.2em] hover:shadow-2xl hover:shadow-indigo-500/20 hover:-translate-y-1 transition-all active:scale-95"
          >
            Launch Hub
          </button>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="relative z-10 flex-1 w-full max-w-7xl px-8 flex flex-col lg:flex-row items-center justify-center lg:justify-between py-12 lg:py-0 space-y-20 lg:space-y-0">
        <div className="flex-1 text-center lg:text-left space-y-10 animate-in fade-in slide-in-from-left-12 duration-1000">
          <div className="inline-flex items-center space-x-2 px-5 py-2.5 bg-indigo-600/5 dark:bg-indigo-400/10 border border-indigo-500/20 rounded-full">
            <Sparkles size={16} className="text-indigo-600 dark:text-indigo-400 animate-pulse" />
            <span className="text-[10px] font-black text-indigo-600 dark:text-indigo-400 uppercase tracking-[0.3em]">Next-Gen Career Intelligence</span>
          </div>

          <div className="space-y-4">
            <h1 className="text-6xl md:text-8xl xl:text-9xl font-black text-slate-900 dark:text-white tracking-tighter leading-[0.85] italic">
              APPLY <span className="text-indigo-600 drop-shadow-[0_0_30px_rgba(79,70,229,0.3)]">SMARTER</span>,<br />
              HIRE FASTER.
            </h1>
            <div className="h-1.5 w-24 bg-indigo-600 rounded-full lg:mx-0 mx-auto" />
          </div>

          <p className="text-xl md:text-2xl text-slate-500 dark:text-slate-400 max-w-2xl font-medium leading-relaxed mx-auto lg:mx-0 text-balance">
            ApplyWise leverages advanced AI to map your career journey to global opportunities with <span className="text-slate-900 dark:text-white font-bold">99% accuracy</span>. Securely store your data and automate the tedious.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start space-y-5 sm:space-y-0 sm:space-x-6 pt-6">
            <button
              onClick={onStart}
              className="group bg-indigo-600 hover:bg-indigo-500 text-white px-12 py-6 rounded-[2.5rem] font-black text-xl uppercase tracking-tighter transition-all shadow-[0_20px_50px_rgba(79,70,229,0.4)] flex items-center space-x-4 active:scale-95 hover:-translate-y-1"
            >
              <span>Get Started</span>
              <ArrowRight size={24} className="group-hover:translate-x-2 transition-transform duration-300" />
            </button>
            <button className="px-12 py-6 rounded-[2.5rem] font-black text-xl uppercase tracking-tighter transition-all text-slate-900 dark:text-white border-2 border-slate-200 dark:border-white/10 hover:bg-slate-100 dark:hover:bg-slate-900 hover:border-slate-300 dark:hover:border-white/20">
              View Specs
            </button>
          </div>

          <div className="flex items-center justify-center lg:justify-start space-x-12 pt-16">
            <div className="flex flex-col space-y-2">
              <span className="text-3xl font-black text-slate-900 dark:text-white tracking-tighter italic">142k+</span>
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Applications Filed</span>
            </div>
            <div className="w-px h-12 bg-slate-200 dark:bg-white/10" />
            <div className="flex flex-col space-y-2">
              <span className="text-3xl font-black text-slate-900 dark:text-white tracking-tighter italic">48h</span>
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Avg Time Saved</span>
            </div>
          </div>
        </div>

        <div className="flex-1 flex justify-center lg:justify-end animate-in fade-in slide-in-from-right-12 duration-1000 delay-300 relative">
          {/* Subtle rotating glow behind globe */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-indigo-500/5 rounded-full animate-[spin_30s_linear_infinite]" />
          <Globe />
        </div>
      </main>

      {/* Floating Badges */}
      <div className="relative z-10 w-full max-w-7xl px-8 pb-16 pt-24 lg:pt-0 flex flex-wrap items-center justify-center lg:justify-start gap-12 opacity-60 grayscale hover:grayscale-0 transition-all duration-1000">
        <div className="flex items-center space-x-3 font-black text-[11px] text-slate-400 dark:text-slate-500 uppercase tracking-[0.3em] group">
          <div className="p-2 rounded-lg bg-slate-100 dark:bg-slate-900 group-hover:text-indigo-500 transition-colors"><ShieldCheck size={18} /></div>
          <span>Secure Data Storage</span>
        </div>
        <div className="flex items-center space-x-3 font-black text-[11px] text-slate-400 dark:text-slate-500 uppercase tracking-[0.3em] group">
          <div className="p-2 rounded-lg bg-slate-100 dark:bg-slate-900 group-hover:text-indigo-500 transition-colors"><Cpu size={18} /></div>
          <span>Smart Field Mapping</span>
        </div>
        <div className="flex items-center space-x-3 font-black text-[11px] text-slate-400 dark:text-slate-500 uppercase tracking-[0.3em] group">
          <div className="p-2 rounded-lg bg-slate-100 dark:bg-slate-900 group-hover:text-indigo-500 transition-colors"><GlobeIcon size={18} /></div>
          <span>Global Opportunity Finder</span>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;
