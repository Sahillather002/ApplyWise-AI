
import React from 'react';

interface BrowserSimulationProps {
  children: React.ReactNode;
}

const BrowserSimulation: React.FC<BrowserSimulationProps> = ({ children }) => {
  return (
    <div className="flex-1 h-screen overflow-auto bg-white shadow-inner relative">
      {/* Mock Browser Header */}
      <div className="sticky top-0 z-50 bg-slate-100 border-b border-slate-200 px-4 py-2 flex items-center space-x-4">
        <div className="flex space-x-1.5">
          <div className="w-3 h-3 rounded-full bg-red-400"></div>
          <div className="w-3 h-3 rounded-full bg-amber-400"></div>
          <div className="w-3 h-3 rounded-full bg-green-400"></div>
        </div>
        <div className="flex-1 bg-white rounded border border-slate-300 px-3 py-1 text-xs text-slate-500 flex items-center">
          <span className="opacity-50 mr-2">https://</span>
          <span>careers.innovatetech.ai/senior-frontend-engineer/apply</span>
        </div>
      </div>
      
      {/* Page Content */}
      <div className="browser-simulation-content max-w-3xl mx-auto py-12 px-8">
        <header className="mb-10">
          <div className="flex items-center space-x-3 mb-4">
            <div className="w-12 h-12 bg-indigo-600 rounded-xl flex items-center justify-center text-white font-bold text-2xl">I</div>
            <h1 className="text-3xl font-bold text-slate-900 tracking-tight">InnovateTech</h1>
          </div>
          <p className="text-slate-500">Apply for Senior Frontend Engineer &middot; Remote &middot; Full-time</p>
        </header>

        <section className="space-y-8">
          {children}
        </section>

        <footer className="mt-20 pt-8 border-t border-slate-100 text-center text-slate-400 text-xs pb-12">
          &copy; 2024 InnovateTech Inc. All rights reserved.
        </footer>
      </div>
    </div>
  );
};

export default BrowserSimulation;
