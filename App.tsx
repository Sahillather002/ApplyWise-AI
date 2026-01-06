
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { ApplicationState, FormFieldMetadata, AISuggestion, SidebarTab, UserProfile } from './types';
import { MOCK_USER_PROFILE } from './constants';
import { geminiService } from './services/geminiService';
import { ThemeProvider } from './contexts/ThemeContext';
import BrowserSimulation from './components/BrowserSimulation';
import MockForm from './components/MockForm';
import Sidebar from './components/Sidebar';
import SuggestionCard from './components/SuggestionCard';
import ThemeToggle from './components/ThemeToggle';
import { Zap, User, History, Home, Code, LayoutGrid, Box } from 'lucide-react';

import UserProfileManagement from './pages/user-profile-management/index';
import ApplicationHistory from './pages/application-history/index';
import FormFieldDetection from './pages/form-field-detection/index';
import ExtensionPopup from './pages/extension-popup-dashboard/index';
import AISuggestionCardsPage from './pages/ai-suggestion-cards/index';
import NotFound from './pages/NotFound';
import LandingPage from './pages/LandingPage';

const STORAGE_KEY = 'applywise_always_use_map';

type AppRoute = 'landing' | 'main' | 'profile' | 'history' | 'detection' | 'popup' | 'interaction-studio' | '404';

const App: React.FC = () => {
  const [route, setRoute] = useState<AppRoute>(() => {
    // Optionally stay on landing unless the user is "returning" or we want a fresh experience
    return 'landing';
  });
  const [userProfile, setUserProfile] = useState<UserProfile>(MOCK_USER_PROFILE);
  const [state, setState] = useState<ApplicationState>({
    fields: [],
    suggestions: {},
    filledStatus: {},
    isAnalyzing: false,
    activeTab: 'apply',
    companyInfo: null,
    isResearching: false,
    videoState: { isGenerating: false, progress: 0, statusMessage: "", videoUrl: null, error: null },
    interview: { isActive: false, transcription: [], isListening: false }
  });

  const [focusedFieldId, setFocusedFieldId] = useState<string | null>(null);
  const [fieldValues, setFieldValues] = useState<Record<string, string>>({});
  const [isRewriting, setIsRewriting] = useState(false);
  const observerRef = useRef<MutationObserver | null>(null);

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

    // Check for 'Always Use' saved preferences
    const savedPreferences = localStorage.getItem(STORAGE_KEY);
    if (savedPreferences) {
      try {
        const preferences = JSON.parse(savedPreferences);
        const autoFilledValues: Record<string, string> = {};
        const autoFilledStatus: Record<string, boolean> = {};
        let updated = false;

        newFields.forEach(field => {
          if (preferences[field.id] && !fieldValues[field.id]) {
            autoFilledValues[field.id] = preferences[field.id];
            autoFilledStatus[field.id] = true;
            updated = true;
          }
        });

        if (updated) {
          setFieldValues(v => ({ ...v, ...autoFilledValues }));
          setState(s => ({ ...s, filledStatus: { ...s.filledStatus, ...autoFilledStatus } }));
        }
      } catch (e) {
        console.error("Failed to parse saved preferences", e);
      }
    }
  }, [fieldValues]);

  useEffect(() => {
    detectFields();
    observerRef.current = new MutationObserver(detectFields);
    const formElement = document.getElementById('application-form');
    if (formElement) observerRef.current.observe(formElement, { childList: true, subtree: true });
    window.addEventListener('resize', detectFields);
    const handleFocus = (e: FocusEvent) => {
        const target = e.target as HTMLElement;
        if (target.id && (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.tagName === 'SELECT')) setFocusedFieldId(target.id);
    };
    window.addEventListener('focusin', handleFocus);
    return () => {
      observerRef.current?.disconnect();
      window.removeEventListener('resize', detectFields);
      window.removeEventListener('focusin', handleFocus);
    };
  }, [detectFields]);

  useEffect(() => {
    if (state.fields.length > 0 && !state.isAnalyzing && Object.keys(state.suggestions).length === 0) {
      (async () => {
        setState(prev => ({ ...prev, isAnalyzing: true }));
        const suggestions = await geminiService.analyzeForm(state.fields, userProfile);
        setState(prev => ({ ...prev, suggestions, isAnalyzing: false }));
      })();
    }
  }, [state.fields.length, userProfile]);

  const handleManualChange = (id: string, value: string) => {
    setFieldValues(v => ({ ...v, [id]: value }));
    setState(s => ({ ...s, filledStatus: { ...s.filledStatus, [id]: !!value } }));
  };

  const handleAcceptSuggestion = (id: string) => {
    const s = state.suggestions[id];
    if (s) {
      handleManualChange(id, s.value);
      setFocusedFieldId(null);
    }
  };

  const handleAlwaysUse = (id: string) => {
    const s = state.suggestions[id];
    if (s) {
      const savedPreferences = localStorage.getItem(STORAGE_KEY);
      const preferences = savedPreferences ? JSON.parse(savedPreferences) : {};
      preferences[id] = s.value;
      localStorage.setItem(STORAGE_KEY, JSON.stringify(preferences));
      handleAcceptSuggestion(id);
    }
  };

  const handleRewriteEssay = async (id: string, text: string) => {
    setIsRewriting(true);
    try {
      const refined = await geminiService.rewriteEssay(text, userProfile, "Senior Frontend Engineer");
      handleManualChange(id, refined);
    } catch (e) { console.error(e); } finally { setIsRewriting(false); }
  };

  const renderContent = () => {
    switch (route) {
      case 'landing': return <LandingPage onStart={() => setRoute('main')} />;
      case 'profile': return <UserProfileManagement profile={userProfile} onUpdate={setUserProfile} />;
      case 'history': return <ApplicationHistory />;
      case 'detection': return <FormFieldDetection fields={state.fields} />;
      case 'interaction-studio': return <AISuggestionCardsPage />;
      case 'popup': return <ExtensionPopup />;
      case 'main': return (
        <div className="flex-1 flex overflow-hidden">
          <BrowserSimulation>
            <MockForm 
              onFieldChange={handleManualChange} 
              onRewrite={handleRewriteEssay} 
              fieldValues={fieldValues} 
              isRewriting={isRewriting} 
            />
            {state.fields.map(field => {
              if (!field.rect || focusedFieldId !== field.id || state.filledStatus[field.id]) return null;
              return state.suggestions[field.id] && (
                <SuggestionCard 
                  key={`card-${field.id}`}
                  suggestion={state.suggestions[field.id]}
                  rect={field.rect}
                  onAccept={() => handleAcceptSuggestion(field.id)}
                  onSkip={() => setFocusedFieldId(null)}
                  onAlwaysUse={() => handleAlwaysUse(field.id)}
                />
              );
            })}
          </BrowserSimulation>
          <Sidebar 
            state={state} 
            userProfile={userProfile}
            onAutoFillAll={() => state.fields.forEach(f => handleAcceptSuggestion(f.id))}
            onTabChange={(t) => setState(s => ({ ...s, activeTab: t }))}
            onVideoStateUpdate={(v) => setState(s => ({ ...s, videoState: v }))}
            onInterviewUpdate={(i) => setState(s => ({ ...s, interview: i }))}
          />
        </div>
      );
      default: return <NotFound onGoHome={() => setRoute('main')} />;
    }
  };

  return (
    <ThemeProvider>
      <div className="flex h-screen w-full bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white overflow-hidden transition-colors duration-300 font-sans">
        <div className="fixed top-6 left-6 z-[100] flex items-center space-x-2 bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl p-2 rounded-2xl border border-slate-200 dark:border-white/10 shadow-2xl">
          <button onClick={() => setRoute('landing')} className={`p-2 rounded-xl transition-all ${route === 'landing' ? 'bg-indigo-600 text-white shadow-lg' : 'text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800'}`}><Home size={18}/></button>
          <button onClick={() => setRoute('main')} className={`p-2 rounded-xl transition-all ${route === 'main' ? 'bg-indigo-600 text-white shadow-lg' : 'text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800'}`}><Box size={18}/></button>
          <button onClick={() => setRoute('profile')} className={`p-2 rounded-xl transition-all ${route === 'profile' ? 'bg-indigo-600 text-white shadow-lg' : 'text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800'}`}><User size={18}/></button>
          <button onClick={() => setRoute('history')} className={`p-2 rounded-xl transition-all ${route === 'history' ? 'bg-indigo-600 text-white shadow-lg' : 'text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800'}`}><History size={18}/></button>
          <button onClick={() => setRoute('detection')} className={`p-2 rounded-xl transition-all ${route === 'detection' ? 'bg-indigo-600 text-white shadow-lg' : 'text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800'}`}><Code size={18}/></button>
          <button onClick={() => setRoute('popup')} className={`p-2 rounded-xl transition-all ${route === 'popup' ? 'bg-indigo-600 text-white shadow-lg' : 'text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800'}`}><LayoutGrid size={18}/></button>
          <div className="w-px h-6 bg-slate-200 dark:bg-white/10 mx-1" />
          <ThemeToggle />
        </div>
        {renderContent()}
      </div>
    </ThemeProvider>
  );
};

export default App;
