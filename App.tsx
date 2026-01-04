
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { ApplicationState, FormFieldMetadata, AISuggestion, SidebarTab, VideoState } from './types';
import { MOCK_USER_PROFILE } from './constants';
import { geminiService } from './services/geminiService';
import { ThemeProvider } from './contexts/ThemeContext';
import BrowserSimulation from './components/BrowserSimulation';
import MockForm from './components/MockForm';
import Sidebar from './components/Sidebar';
import SuggestionCard from './components/SuggestionCard';
import ThemeToggle from './components/ThemeToggle';
import { Zap, Sparkles, Mic, Check, Code, LayoutGrid, User, History, Home, Box } from 'lucide-react';

// Structured Pages
import UserProfileManagement from './pages/user-profile-management';
import ApplicationHistory from './pages/application-history';
import FormFieldDetection from './pages/form-field-detection';
import ExtensionPopup from './pages/extension-popup-dashboard';
import AISuggestionCardsPage from './pages/ai-suggestion-cards';
import NotFound from './pages/NotFound';

const STORAGE_KEY = 'applywise_always_use';

type AppRoute = 'main' | 'profile' | 'history' | 'detection' | 'popup' | 'studio' | '404';

const App: React.FC = () => {
  const [route, setRoute] = useState<AppRoute>('main');
  const [state, setState] = useState<ApplicationState>({
    fields: [],
    suggestions: {},
    filledStatus: {},
    isAnalyzing: false,
    activeTab: 'apply',
    companyInfo: null,
    isResearching: false,
    videoState: {
      isGenerating: false,
      progress: 0,
      statusMessage: "",
      videoUrl: null,
      error: null
    },
    interview: {
      isActive: false,
      transcription: [],
      isListening: false
    }
  });

  const [focusedFieldId, setFocusedFieldId] = useState<string | null>(null);
  const [hoveredFieldId, setHoveredFieldId] = useState<string | null>(null);
  const [dictatingFieldId, setDictatingFieldId] = useState<string | null>(null);
  const [interimTranscript, setInterimTranscript] = useState<string>("");
  const [fieldValues, setFieldValues] = useState<Record<string, string>>({});
  const [isRewriting, setIsRewriting] = useState(false);
  
  const observerRef = useRef<MutationObserver | null>(null);
  const recognitionRef = useRef<any>(null);

  // Initialize Speech Recognition
  useEffect(() => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (SpeechRecognition) {
      const recognition = new SpeechRecognition();
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = 'en-US';
      recognition.onresult = (event: any) => {
        let interim = '';
        let final = '';
        for (let i = event.resultIndex; i < event.results.length; ++i) {
          if (event.results[i].isFinal) final += event.results[i][0].transcript;
          else interim += event.results[i][0].transcript;
        }
        setInterimTranscript(interim);
        if (final && dictatingFieldId) {
          setFieldValues(prev => {
            const current = prev[dictatingFieldId] || '';
            const updated = (current + (current ? ' ' : '') + final.trim()).trim();
            return { ...prev, [dictatingFieldId]: updated };
          });
          setState(prev => ({ ...prev, filledStatus: { ...prev.filledStatus, [dictatingFieldId!]: true } }));
        }
      };
      recognitionRef.current = recognition;
    }
  }, [dictatingFieldId]);

  const startDictation = (fieldId: string) => {
    if (dictatingFieldId) recognitionRef.current?.stop();
    setDictatingFieldId(fieldId);
    setInterimTranscript("");
    recognitionRef.current?.start();
  };

  const stopDictation = () => {
    recognitionRef.current?.stop();
    setDictatingFieldId(null);
    setInterimTranscript("");
  };

  const detectFields = useCallback(() => {
    const formElement = document.getElementById('application-form');
    if (!formElement) return;

    const inputElements = formElement.querySelectorAll('input, select, textarea');
    const newFields: FormFieldMetadata[] = Array.from(inputElements).map((el) => {
      const input = el as HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement;
      let labelText = '';
      if (input.id) {
        const label = document.querySelector(`label[for="${input.id}"]`);
        labelText = label?.textContent || '';
      }
      return {
        id: input.id,
        type: input.type,
        label: labelText || input.name || (input as HTMLInputElement).placeholder || 'Unknown Field',
        tagName: input.tagName.toLowerCase(),
        rect: input.getBoundingClientRect(),
      };
    });

    setState(prev => {
      if (JSON.stringify(prev.fields.map(f => f.id)) === JSON.stringify(newFields.map(f => f.id))) return prev;
      return { ...prev, fields: newFields };
    });

    const alwaysUseData = localStorage.getItem(STORAGE_KEY);
    if (alwaysUseData) {
      const parsed = JSON.parse(alwaysUseData);
      setFieldValues(prev => {
        const nextValues = { ...prev };
        newFields.forEach(f => { if (parsed[f.id] && !nextValues[f.id]) nextValues[f.id] = parsed[f.id]; });
        return nextValues;
      });
      setState(prev => {
        const nextFilled = { ...prev.filledStatus };
        newFields.forEach(f => { if (parsed[f.id] && !nextFilled[f.id]) nextFilled[f.id] = true; });
        return { ...prev, filledStatus: nextFilled };
      });
    }
  }, []);

  useEffect(() => {
    detectFields();
    observerRef.current = new MutationObserver(detectFields);
    const formElement = document.getElementById('application-form');
    if (formElement) observerRef.current.observe(formElement, { childList: true, subtree: true });
    window.addEventListener('resize', detectFields);
    return () => {
      observerRef.current?.disconnect();
      window.removeEventListener('resize', detectFields);
    };
  }, [detectFields]);

  useEffect(() => {
    if (state.fields.length > 0 && !state.isAnalyzing && Object.keys(state.suggestions).length === 0) {
      (async () => {
        setState(prev => ({ ...prev, isAnalyzing: true }));
        const suggestions = await geminiService.analyzeForm(state.fields, MOCK_USER_PROFILE);
        setState(prev => ({ ...prev, suggestions, isAnalyzing: false }));
      })();
    }
  }, [state.fields.length]);

  const handleAcceptSuggestion = (fieldId: string) => {
    const suggestion = state.suggestions[fieldId];
    if (suggestion) {
      setFieldValues(prev => ({ ...prev, [fieldId]: suggestion.value }));
      setState(prev => ({ ...prev, filledStatus: { ...prev.filledStatus, [fieldId]: true } }));
      setFocusedFieldId(null);
    }
  };

  const handleAlwaysUse = (fieldId: string) => {
    const suggestion = state.suggestions[fieldId];
    if (suggestion) {
      const existing = localStorage.getItem(STORAGE_KEY);
      const data = existing ? JSON.parse(existing) : {};
      data[fieldId] = suggestion.value;
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
      handleAcceptSuggestion(fieldId);
    }
  };

  const handleManualChange = (fieldId: string, value: string) => {
    setFieldValues(prev => ({ ...prev, [fieldId]: value }));
    setState(prev => ({ ...prev, filledStatus: { ...prev.filledStatus, [fieldId]: value.length > 0 } }));
  };

  const handleRewriteEssay = async (fieldId: string, currentText: string) => {
    setIsRewriting(true);
    try {
      const rewritten = await geminiService.rewriteEssay(currentText, MOCK_USER_PROFILE, "Senior Frontend Engineer");
      setFieldValues(prev => ({ ...prev, [fieldId]: rewritten }));
      setState(prev => ({ ...prev, filledStatus: { ...prev.filledStatus, [fieldId]: true } }));
    } catch (e) { console.error(e); } finally { setIsRewriting(false); }
  };

  const handleAutoFillAll = () => {
    const nV = { ...fieldValues };
    const nS = { ...state.filledStatus };
    state.fields.forEach(f => {
      const s = state.suggestions[f.id];
      if (s && s.confidence === 'high') { nV[f.id] = s.value; nS[f.id] = true; }
    });
    setFieldValues(nV);
    setState(prev => ({ ...prev, filledStatus: nS }));
  };

  const renderContent = () => {
    switch (route) {
      case 'profile': return <UserProfileManagement />;
      case 'history': return <ApplicationHistory />;
      case 'detection': return <FormFieldDetection fields={state.fields} />;
      case 'studio': return <AISuggestionCardsPage />;
      case 'popup': return <ExtensionPopup />;
      case 'main': return (
        <>
          <BrowserSimulation>
            <MockForm 
              onFieldChange={handleManualChange}
              onRewrite={handleRewriteEssay}
              fieldValues={fieldValues}
              interimText={interimTranscript}
              dictatingId={dictatingFieldId}
              isRewriting={isRewriting}
            />
            {state.fields.map(field => {
              if (!field.rect) return null;
              const isFocused = focusedFieldId === field.id;
              const isFilled = state.filledStatus[field.id];
              return (
                <div key={`overlay-${field.id}`} style={{ position: 'absolute', top: field.rect.top + window.scrollY, left: field.rect.left + window.scrollX, width: field.rect.width, height: field.rect.height, pointerEvents: 'none', zIndex: 10 }} className={`rounded-lg border-2 transition-all ${dictatingFieldId === field.id ? 'border-red-500 animate-pulse' : isFocused ? 'border-indigo-500' : isFilled ? 'border-emerald-500/30' : 'border-transparent'}`}>
                  <div className="absolute right-2 top-1/2 -translate-y-1/2 pointer-events-auto flex items-center space-x-1">
                     {(isFocused || hoveredFieldId === field.id) && <button onClick={() => startDictation(field.id)} className="p-1.5 bg-white dark:bg-slate-800 rounded shadow hover:text-indigo-600"><Mic size={14}/></button>}
                     {isFilled && <div className="p-1.5 bg-emerald-500 text-white rounded"><Check size={14}/></div>}
                  </div>
                </div>
              );
            })}
            {focusedFieldId && state.suggestions[focusedFieldId] && !state.filledStatus[focusedFieldId] && (
              <SuggestionCard 
                suggestion={state.suggestions[focusedFieldId]}
                rect={state.fields.find(f => f.id === focusedFieldId)!.rect!}
                onAccept={() => handleAcceptSuggestion(focusedFieldId)}
                onSkip={() => setFocusedFieldId(null)}
                onAlwaysUse={() => handleAlwaysUse(focusedFieldId)}
              />
            )}
          </BrowserSimulation>
          <Sidebar state={state} onAutoFillAll={handleAutoFillAll} onTabChange={(t) => setState(p => ({ ...p, activeTab: t }))} onVideoStateUpdate={(v) => setState(p => ({ ...p, videoState: v }))} onInterviewUpdate={(i) => setState(p => ({ ...p, interview: i }))} />
        </>
      );
      default: return <NotFound onGoHome={() => setRoute('main')} />;
    }
  };

  return (
    <ThemeProvider>
      <div className="flex h-screen w-full overflow-hidden bg-slate-50 dark:bg-slate-950 font-sans transition-colors duration-300">
        
        {/* Global Floating Nav for Demo */}
        <div className="fixed top-6 left-6 z-[100] flex items-center space-x-2 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl p-2 rounded-2xl border border-slate-200 dark:border-white/10 shadow-2xl">
          <button onClick={() => setRoute('main')} className={`p-2 rounded-xl transition-all ${route === 'main' ? 'bg-indigo-600 text-white shadow-lg' : 'text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800'}`}><Home size={18}/></button>
          <button onClick={() => setRoute('profile')} className={`p-2 rounded-xl transition-all ${route === 'profile' ? 'bg-indigo-600 text-white shadow-lg' : 'text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800'}`}><User size={18}/></button>
          <button onClick={() => setRoute('history')} className={`p-2 rounded-xl transition-all ${route === 'history' ? 'bg-indigo-600 text-white shadow-lg' : 'text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800'}`}><History size={18}/></button>
          <button onClick={() => setRoute('detection')} className={`p-2 rounded-xl transition-all ${route === 'detection' ? 'bg-indigo-600 text-white shadow-lg' : 'text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800'}`}><Code size={18}/></button>
          <button onClick={() => setRoute('studio')} className={`p-2 rounded-xl transition-all ${route === 'studio' ? 'bg-indigo-600 text-white shadow-lg' : 'text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800'}`}><Box size={18}/></button>
          <button onClick={() => setRoute('popup')} className={`p-2 rounded-xl transition-all ${route === 'popup' ? 'bg-indigo-600 text-white shadow-lg' : 'text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800'}`}><LayoutGrid size={18}/></button>
          <div className="w-px h-6 bg-slate-200 dark:bg-white/10 mx-1" />
          <ThemeToggle />
        </div>

        {renderContent()}

        {/* Global HUD - only visible on main */}
        {route === 'main' && (
          <div className="fixed bottom-8 left-1/2 -translate-x-1/2 bg-slate-900/90 backdrop-blur-xl border border-white/10 rounded-2xl px-6 py-4 flex items-center space-x-8 shadow-[0_32px_64px_-16px_rgba(0,0,0,0.5)] z-50">
            <div className="flex items-center space-x-3 pr-8 border-r border-white/10">
              <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center text-white shadow-lg">
                <Zap size={20} fill="currentColor" />
              </div>
              <div>
                <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">Application Assistant</p>
                <p className="text-sm font-bold text-white">ApplyWise Engine <span className="text-indigo-400">v1.3</span></p>
              </div>
            </div>
            <button onClick={handleAutoFillAll} className="bg-indigo-600 hover:bg-indigo-500 text-white px-5 py-2.5 rounded-xl text-xs font-bold flex items-center space-x-2 transition-all shadow-lg active:scale-95">
              <Sparkles size={14} />
              <span>Hyper-Fill</span>
            </button>
          </div>
        )}
      </div>
    </ThemeProvider>
  );
};

export default App;
