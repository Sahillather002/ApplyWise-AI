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

      {/* Hero background decoration */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full bg-[radial-gradient(circle_at_50%_0%,rgba(79,70,229,0.08),transparent_70%)] pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-indigo-500/5 blur-[120px] rounded-full pointer-events-none" />

      {/* Navigation */}
      <nav className="relative z-10 w-full max-w-7xl px-8 py-10 flex items-center justify-between">
        <div className="flex items-center space-x-3 group cursor-pointer" onClick={() => window.location.reload()}>
          <div className="w-11 h-11 bg-indigo-600 rounded-2xl flex items-center justify-center text-white shadow-xl shadow-indigo-500/20 group-hover:scale-105 group-hover:rotate-2 transition-all duration-500 overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
            <Zap size={22} fill="currentColor" />
          </div>
          <span className="font-black text-2xl tracking-tighter text-slate-900 dark:text-white uppercase italic">ApplyWise</span>
        </div>
        <div className="hidden lg:flex items-center space-x-12 text-[10px] font-black uppercase tracking-[0.25em] text-slate-400 dark:text-slate-500">
          <a href="#" className="hover:text-indigo-600 dark:hover:text-white transition-colors">Platform</a>
          <a href="#" className="hover:text-indigo-600 dark:hover:text-white transition-colors">Intelligence</a>
          <a href="#" className="hover:text-indigo-600 dark:hover:text-white transition-colors">Security</a>
          <button
            onClick={onStart}
            className="bg-slate-900 dark:bg-white text-white dark:text-slate-900 px-8 py-3 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:translate-y-[-2px] hover:shadow-2xl hover:shadow-indigo-500/10 transition-all active:scale-95"
          >
            Launch Hub
          </button>
        </div>
      </nav>

      {/* Hero Content */}
      <main className="relative z-10 flex-1 w-full max-w-7xl px-8 flex flex-col lg:flex-row items-center justify-center lg:justify-between py-12 lg:py-0">
        <div className="flex-1 text-center lg:text-left space-y-12 animate-in fade-in slide-in-from-bottom-12 duration-1000">
          <div className="inline-flex items-center space-x-3 px-4 py-2 bg-indigo-600/5 dark:bg-indigo-400/10 border border-indigo-500/10 dark:border-indigo-400/10 rounded-full">
            <Sparkles size={14} className="text-indigo-600 dark:text-indigo-400" />
            <span className="text-[9px] font-black text-indigo-600 dark:text-indigo-400 uppercase tracking-[0.3em]">Version 2.0 AI Architecture</span>
          </div>

          <div className="space-y-6">
            <h1 className="text-6xl md:text-8xl xl:text-9xl font-black text-slate-900 dark:text-white tracking-tighter leading-[0.85] italic">
              APPLY <span className="text-indigo-600">SMARTER</span>,<br />
              HIRE FASTER.
            </h1>
            <div className="h-1.5 w-24 bg-indigo-600 rounded-full lg:mx-0 mx-auto" />
          </div>

          <p className="text-xl md:text-2xl text-slate-500 dark:text-slate-400 max-w-2xl font-medium leading-relaxed mx-auto lg:mx-0">
            ApplyWise leverages advanced AI to map your career journey with <span className="text-slate-900 dark:text-white font-bold italic">peak precision</span>. Securely automate the tedious and focus on the interview.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start space-y-4 sm:space-y-0 sm:space-x-6">
            <button
              onClick={onStart}
              className="group relative bg-indigo-600 hover:bg-indigo-700 text-white px-14 py-6 rounded-[2.5rem] font-black text-xl uppercase tracking-tighter transition-all shadow-[0_20px_60px_-15px_rgba(79,70,229,0.5)] flex items-center space-x-4 active:scale-95 hover:-translate-y-1 overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-tr from-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
              <span className="relative">Get Started</span>
              <ArrowRight size={22} className="relative group-hover:translate-x-2 transition-transform duration-300" />
            </button>
            <button className="px-14 py-6 rounded-[2.5rem] font-black text-xl uppercase tracking-tighter transition-all text-slate-900 dark:text-white border border-slate-200 dark:border-white/10 hover:bg-slate-100 dark:hover:bg-white/5">
              View Specs
            </button>
          </div>

          <div className="flex items-center justify-center lg:justify-start space-x-16 pt-12 opacity-80">
            <div className="flex flex-col">
              <span className="text-3xl font-black text-slate-900 dark:text-white tracking-tighter italic">142k+</span>
              <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest mt-1">Applications</span>
            </div>
            <div className="flex flex-col">
              <span className="text-3xl font-black text-slate-900 dark:text-white tracking-tighter italic">48h</span>
              <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest mt-1">Time Saved</span>
            </div>
          </div>
        </div>

        <div className="flex-1 flex justify-center lg:justify-end animate-in fade-in zoom-in-95 duration-1000 delay-200">
          <Globe />
        </div>
      </main>

      {/* Floating Badges */}
      <footer className="relative z-10 w-full max-w-7xl px-8 py-16 flex flex-wrap items-center justify-center lg:justify-start gap-12 border-t border-slate-100 dark:border-white/5 mt-12 bg-white/30 dark:bg-transparent backdrop-blur-xl">
        <Badge icon={ShieldCheck} text="Secure Data Vault" />
        <Badge icon={Cpu} text="Neural Field Mapping" />
        <Badge icon={GlobeIcon} text="Global Scout Engine" />
      </footer>
    </div>
  );
};

const Badge = ({ icon: Icon, text }: { icon: any, text: string }) => (
  <div className="flex items-center space-x-3 text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em] hover:text-indigo-600 dark:hover:text-white transition-colors cursor-default">
    <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-white/5"><Icon size={16} /></div>
    <span>{text}</span>
  </div>
);

export default LandingPage;
