
import React, { useState } from 'react';
import { AISuggestion } from '../types';
import { Check, X, Edit2, Zap, Info, FileText, Search, Quote, ShieldCheck } from 'lucide-react';

interface SuggestionCardProps {
  suggestion: AISuggestion;
  rect: DOMRect;
  onAccept: () => void;
  onSkip: () => void;
  onAlwaysUse: () => void;
}

const SuggestionCard: React.FC<SuggestionCardProps> = ({ suggestion, rect, onAccept, onSkip, onAlwaysUse }) => {
  const [showSource, setShowSource] = useState(false);

  // Positioning logic: try to place below the field
  const style: React.CSSProperties = {
    position: 'absolute',
    top: rect.bottom + 8,
    left: rect.left,
    zIndex: 9999,
  };

  const confidenceColor = 
    suggestion.confidence === 'high' ? 'text-emerald-600 bg-emerald-50 border-emerald-100' : 
    suggestion.confidence === 'medium' ? 'text-amber-600 bg-amber-50 border-amber-100' : 
    'text-red-600 bg-red-50 border-red-100';

  return (
    <div 
      style={style}
      className="w-[340px] bg-white rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.15)] border border-slate-200 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-300"
    >
      {/* Header */}
      <div className="px-5 py-3.5 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
        <div className="flex items-center space-x-2.5">
          <div className="p-1.5 bg-indigo-100 rounded-lg text-indigo-600">
            <Zap size={14} className="fill-indigo-600" />
          </div>
          <span className="text-xs font-bold text-slate-700 uppercase tracking-widest">AI Match</span>
        </div>
        <div className={`text-[10px] font-bold px-2.5 py-1 rounded-full border uppercase tracking-tight ${confidenceColor}`}>
          {suggestion.confidence} match
        </div>
      </div>

      {/* Body */}
      <div className="p-5 space-y-4">
        {/* Suggested Value */}
        <div className="bg-slate-50 border border-slate-100 rounded-xl p-4 group hover:bg-white hover:border-indigo-100 transition-all">
          <p className="text-sm text-slate-900 leading-relaxed font-semibold italic text-balance">
            "{suggestion.value}"
          </p>
        </div>
        
        {/* Reasoning */}
        <div className="flex items-start space-x-3 text-[11px] text-slate-500 bg-slate-50/30 p-3 rounded-lg border border-slate-100/50">
          <Info size={16} className="text-indigo-400 mt-0.5 shrink-0" />
          <p className="leading-normal">{suggestion.reasoning}</p>
        </div>

        {/* Retractable Source Insight Panel */}
        {showSource && suggestion.sourceExcerpt && (
          <div className="mt-2 space-y-2 animate-in slide-in-from-top-1 duration-200">
            <div className="flex items-center space-x-2 px-1">
              <FileText size={12} className="text-amber-600" />
              <span className="text-[10px] font-bold text-amber-700 uppercase tracking-tighter">Extracted from {suggestion.source}</span>
            </div>
            <div className="p-4 bg-amber-50/50 border border-amber-200/40 rounded-xl relative overflow-hidden group">
              <Quote size={24} className="absolute -right-1 -bottom-1 text-amber-200/50 -rotate-12 group-hover:scale-110 transition-transform" />
              <p className="text-[11px] text-slate-600 leading-relaxed italic relative z-10">
                "{suggestion.sourceExcerpt}"
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Footer Actions */}
      <div className="px-5 py-4 bg-slate-50/80 border-t border-slate-100 flex flex-col space-y-3">
        {/* Toggle Button for Source Section */}
        <div className="flex space-x-2">
          <button 
            onClick={() => setShowSource(!showSource)}
            className={`flex-1 py-2.5 px-4 rounded-xl text-[11px] font-bold transition-all flex items-center justify-center space-x-2 border shadow-sm ${
              showSource 
              ? 'bg-amber-100 text-amber-700 border-amber-200 shadow-amber-100' 
              : 'bg-white text-slate-600 border-slate-200 hover:border-indigo-300 hover:text-indigo-600'
            }`}
          >
            {showSource ? (
              <>
                <Search size={14} className="rotate-45" />
                <span>Hide Evidence</span>
              </>
            ) : (
              <>
                <FileText size={14} />
                <span>View Source</span>
              </>
            )}
          </button>
          
          <button 
            onClick={onAlwaysUse}
            className="flex-1 py-2.5 px-4 rounded-xl text-[11px] font-bold transition-all flex items-center justify-center space-x-2 border border-slate-200 bg-white text-slate-600 hover:bg-emerald-50 hover:text-emerald-600 hover:border-emerald-200 shadow-sm"
          >
            <ShieldCheck size={14} />
            <span>Always Use</span>
          </button>
        </div>

        <div className="flex items-center space-x-2">
          <button 
            onClick={onSkip}
            className="flex-1 p-2.5 hover:bg-white hover:text-slate-900 text-slate-400 rounded-xl border border-transparent hover:border-slate-200 transition-all flex items-center justify-center"
            title="Dismiss"
          >
            <X size={20} />
          </button>
          
          <button className="flex-[2] px-4 py-2.5 text-xs font-semibold text-slate-600 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors flex items-center justify-center space-x-2 shadow-sm">
            <Edit2 size={14} />
            <span>Edit</span>
          </button>
          
          <button 
            onClick={onAccept}
            className="flex-[3] px-4 py-2.5 text-xs font-bold text-white bg-indigo-600 rounded-xl hover:bg-indigo-700 transition-all flex items-center justify-center space-x-2 shadow-lg shadow-indigo-100 active:scale-[0.98]"
          >
            <Check size={18} />
            <span>Accept</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default SuggestionCard;
