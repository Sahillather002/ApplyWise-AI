
import React, { useState, useEffect, useRef } from 'react';
import { AISuggestion } from '../types';
import { Check, X, Edit2, Zap, Info, FileText, Search, Quote, ShieldCheck, CheckCheck, Save, ChevronDown, ChevronUp } from 'lucide-react';

interface SuggestionCardProps {
  suggestion: AISuggestion;
  rect: DOMRect;
  onAccept: (value: string) => void;
  onSkip: () => void;
  onAlwaysUse: (value: string) => void;
}

const SuggestionCard: React.FC<SuggestionCardProps> = ({ suggestion, rect, onAccept, onSkip, onAlwaysUse }) => {
  const [showSource, setShowSource] = useState(false);
  const [isVaulted, setIsVaulted] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editedValue, setEditedValue] = useState(suggestion.value);
  const cardRef = useRef<HTMLDivElement>(null);

  // Positioning logic: try to place below the field
  const style: React.CSSProperties = {
    position: 'absolute',
    top: rect.bottom + 8,
    left: rect.left,
    zIndex: 9999,
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onSkip();
      if (e.key === 'Enter' && e.ctrlKey) handleAccept();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const confidenceColor = 
    suggestion.confidence === 'high' ? 'text-emerald-600 bg-emerald-50 border-emerald-100' : 
    suggestion.confidence === 'medium' ? 'text-amber-600 bg-amber-50 border-amber-100' : 
    'text-red-600 bg-red-50 border-red-100';

  const handleAlwaysUse = () => {
    setIsVaulted(true);
    onAlwaysUse(editedValue);
  };

  const handleAccept = () => {
    onAccept(editedValue);
  };

  return (
    <div 
      ref={cardRef}
      style={style}
      role="dialog"
      aria-labelledby="ai-suggestion-title"
      aria-describedby="ai-suggestion-description"
      className="w-[340px] bg-white rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.15)] border border-slate-200 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-300 focus-within:ring-2 focus-within:ring-indigo-500/20"
    >
      {/* Header */}
      <div className="px-5 py-3.5 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
        <div className="flex items-center space-x-2.5">
          <div className="p-1.5 bg-indigo-100 rounded-lg text-indigo-600">
            <Zap size={14} className="fill-indigo-600" aria-hidden="true" />
          </div>
          <span id="ai-suggestion-title" className="text-xs font-bold text-slate-700 uppercase tracking-widest">AI Match</span>
        </div>
        <div 
          role="status"
          className={`text-[10px] font-bold px-2.5 py-1 rounded-full border uppercase tracking-tight ${confidenceColor}`}
        >
          {suggestion.confidence} match
        </div>
      </div>

      {/* Body */}
      <div className="p-5 space-y-4">
        {/* Suggested Value / Editor */}
        <div className={`bg-slate-50 border rounded-xl transition-all ${isEditing ? 'border-indigo-500 ring-4 ring-indigo-500/10 p-2' : 'border-slate-100 p-4 hover:bg-white hover:border-indigo-100'}`}>
          {isEditing ? (
            <textarea 
              value={editedValue}
              onChange={(e) => setEditedValue(e.target.value)}
              className="w-full bg-white text-sm text-slate-900 leading-relaxed font-semibold italic resize-none outline-none min-h-[60px]"
              autoFocus
              aria-label="Edit suggested value"
            />
          ) : (
            <p className="text-sm text-slate-900 leading-relaxed font-semibold italic text-balance">
              "{editedValue}"
            </p>
          )}
        </div>
        
        {/* Reasoning */}
        <div id="ai-suggestion-description" className="flex items-start space-x-3 text-[11px] text-slate-500 bg-slate-50/30 p-3 rounded-lg border border-slate-100/50">
          <Info size={16} className="text-indigo-400 mt-0.5 shrink-0" aria-hidden="true" />
          <p className="leading-normal">{suggestion.reasoning}</p>
        </div>

        {/* Expandable Source Insight Panel */}
        {showSource && (
          <div className="mt-2 space-y-3 p-4 bg-amber-50/40 border border-amber-100 rounded-xl animate-in slide-in-from-top-1 duration-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <FileText size={12} className="text-amber-600" />
                <span className="text-[10px] font-black text-amber-700 uppercase tracking-tighter">Verified Source: {suggestion.source}</span>
              </div>
              <ShieldCheck size={12} className="text-emerald-500" aria-label="Verified security source" />
            </div>
            
            <div className="relative group">
              <Quote size={20} className="absolute -left-1 -top-1 text-amber-200/50 -rotate-12" aria-hidden="true" />
              <p className="text-[11px] text-slate-600 leading-relaxed italic pl-5 pr-2">
                {suggestion.sourceExcerpt || "No specific excerpt was provided for this suggestion."}
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Footer Actions */}
      <div className="px-5 py-4 bg-slate-50/80 border-t border-slate-100 flex flex-col space-y-3">
        <div className="flex space-x-2">
          <button 
            onClick={() => setShowSource(!showSource)}
            aria-expanded={showSource}
            className={`flex-1 py-2.5 px-4 rounded-xl text-[11px] font-bold transition-all flex items-center justify-center space-x-2 border shadow-sm ${
              showSource 
              ? 'bg-amber-100 text-amber-700 border-amber-200 shadow-amber-100' 
              : 'bg-white text-slate-600 border-slate-200 hover:border-indigo-300 hover:text-indigo-600'
            }`}
          >
            {showSource ? (
              <>
                <ChevronUp size={14} />
                <span>Hide Evidence</span>
              </>
            ) : (
              <>
                <ChevronDown size={14} />
                <span>View Source Section</span>
              </>
            )}
          </button>
          
          <button 
            onClick={handleAlwaysUse}
            disabled={isVaulted}
            aria-pressed={isVaulted}
            className={`flex-1 py-2.5 px-4 rounded-xl text-[11px] font-bold transition-all flex items-center justify-center space-x-2 border shadow-sm ${
              isVaulted 
              ? 'bg-emerald-600 text-white border-emerald-600 scale-[1.02] shadow-emerald-500/20' 
              : 'bg-white text-slate-600 border-slate-200 hover:bg-emerald-50 hover:text-emerald-600 hover:border-emerald-200'
            }`}
          >
            {isVaulted ? (
              <>
                <CheckCheck size={14} />
                <span>Vaulted!</span>
              </>
            ) : (
              <>
                <ShieldCheck size={14} />
                <span>Always Use</span>
              </>
            )}
          </button>
        </div>

        <div className="flex items-center space-x-2">
          <button 
            onClick={onSkip}
            className="flex-1 p-2.5 hover:bg-white hover:text-slate-900 text-slate-400 rounded-xl border border-transparent hover:border-slate-200 transition-all flex items-center justify-center"
            aria-label="Dismiss suggestion"
          >
            <X size={20} />
          </button>
          
          <button 
            onClick={() => setIsEditing(!isEditing)}
            aria-pressed={isEditing}
            className={`flex-[2] px-4 py-2.5 text-xs font-semibold rounded-xl border transition-all flex items-center justify-center space-x-2 shadow-sm ${
              isEditing 
              ? 'bg-indigo-50 text-indigo-600 border-indigo-200' 
              : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
            }`}
          >
            {isEditing ? (
              <>
                <Check size={14} />
                <span>Done</span>
              </>
            ) : (
              <>
                <Edit2 size={14} />
                <span>Edit</span>
              </>
            )}
          </button>
          
          <button 
            onClick={handleAccept}
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
