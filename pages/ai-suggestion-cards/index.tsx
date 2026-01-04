
import React from 'react';
import { Sparkles, MessageSquare, Zap, Target, MousePointer2 } from 'lucide-react';
import SuggestionCard from '../../components/SuggestionCard';
import KeyboardShortcuts from './components/KeyboardShortcuts';
import AlternativeOptions from './components/AlternativeOptions';
import ConfidenceIndicator from './components/ConfidenceIndicator';

const AISuggestionCardsPage: React.FC = () => {
  const mockSuggestion = {
    fieldId: 'full-name',
    value: 'Alex Rivera',
    confidence: 'high' as const,
    source: 'Master Profile',
    reasoning: 'Direct match found in Personal Information block of your resume.',
    sourceExcerpt: 'Full Name: Alex Rivera | Senior Frontend Engineer'
  };

  return (
    <div className="p-8 max-w-7xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500">
      <header className="mb-12">
        <h1 className="text-4xl font-black text-slate-900 dark:text-white tracking-tighter italic uppercase flex items-center">
          <Sparkles size={36} className="mr-3 text-indigo-600" />
          UX Interaction Studio
        </h1>
        <p className="text-slate-500 dark:text-slate-400 font-medium">Testing in-page overlays and contextual suggestion cards.</p>
      </header>

      <div className="grid grid-cols-12 gap-8">
        <div className="col-span-8 space-y-12">
           <section className="space-y-6">
              <h2 className="text-sm font-black text-slate-400 uppercase tracking-widest flex items-center">
                <MousePointer2 size={16} className="mr-2" /> Live Interaction Preview
              </h2>
              <div className="bg-slate-100 dark:bg-slate-900/50 border border-slate-200 dark:border-white/5 rounded-[3rem] p-12 h-[600px] relative overflow-hidden pattern-grid">
                 <div className="max-w-md bg-white dark:bg-slate-900 p-8 rounded-3xl shadow-xl border border-slate-200 dark:border-white/5">
                    <label className="text-xs font-bold text-slate-500 mb-2 block">Full Name</label>
                    <input 
                      disabled 
                      className="w-full bg-slate-50 dark:bg-slate-800 border-2 border-indigo-500 rounded-xl px-4 py-3 outline-none" 
                      value="Alex Rivera"
                    />
                    
                    {/* Floating Suggestion Mock */}
                    <div className="relative mt-4">
                       <SuggestionCard 
                         suggestion={mockSuggestion}
                         rect={new DOMRect(0, 0, 300, 40)}
                         onAccept={() => {}}
                         onSkip={() => {}}
                         onAlwaysUse={() => {}}
                       />
                    </div>
                 </div>
              </div>
           </section>
        </div>

        <div className="col-span-4 space-y-8">
          <ConfidenceIndicator confidence="high" />
          <AlternativeOptions />
          <KeyboardShortcuts />
          
          <div className="bg-indigo-600 rounded-3xl p-8 text-white shadow-2xl shadow-indigo-500/30">
             <div className="flex items-center space-x-3 mb-4">
                <MessageSquare size={20} />
                <h3 className="font-bold text-lg">Interaction Rules</h3>
             </div>
             <ul className="space-y-4 text-xs font-medium text-indigo-100">
                <li className="flex items-start space-x-2">
                   <span className="w-1.5 h-1.5 bg-indigo-300 rounded-full mt-1.5 shrink-0" />
                   <span>Overlay never covers input content.</span>
                </li>
                <li className="flex items-start space-x-2">
                   <span className="w-1.5 h-1.5 bg-indigo-300 rounded-full mt-1.5 shrink-0" />
                   <span>Accept via Tab + Enter keyboard flow.</span>
                </li>
                <li className="flex items-start space-x-2">
                   <span className="w-1.5 h-1.5 bg-indigo-300 rounded-full mt-1.5 shrink-0" />
                   <span>Always show source attribution.</span>
                </li>
             </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AISuggestionCardsPage;
