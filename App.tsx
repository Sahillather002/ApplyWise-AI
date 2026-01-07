
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
import { GoogleGenAI, Modality } from "@google/genai";

import UserProfileManagement from './pages/user-profile-management/index';
import ApplicationHistory from './pages/application-history/index';
import FormFieldDetection from './pages/form-field-detection/index';
import ExtensionPopup from './pages/extension-popup-dashboard/index';
import AISuggestionCardsPage from './pages/ai-suggestion-cards/index';
import LandingPage from './pages/LandingPage';
import NotFound from './pages/NotFound';

const STORAGE_KEY = 'applywise_always_use_map';

type AppRoute = 'landing' | 'main' | 'profile' | 'history' | 'detection' | 'popup' | 'interaction-studio' | '404';

// Helper for Base64 encoding
function encode(bytes: Uint8Array) {
  let binary = '';
  const len = bytes.byteLength;
  for (let i = 0; i < len; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary);
}

const App: React.FC = () => {
  const [route, setRoute] = useState<AppRoute>('landing');
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
    interview: { isActive: false, transcription: [], isListening: false },
    dictation: { id: null, interimText: "", isListening: false }
  });

  const [focusedFieldId, setFocusedFieldId] = useState<string | null>(null);
  const [fieldValues, setFieldValues] = useState<Record<string, string>>({});
  const [isRewriting, setIsRewriting] = useState(false);
  const observerRef = useRef<MutationObserver | null>(null);

  // Dictation Session Refs
  const dictationSessionRef = useRef<any>(null);
  const dictationAudioInRef = useRef<AudioContext | null>(null);

  // Advanced Recursive Field Detection with Shadow DOM Piercing
  const detectFieldsRecursive = useCallback((root: ParentNode | ShadowRoot): FormFieldMetadata[] => {
    let fields: FormFieldMetadata[] = [];
    const selectors = 'input:not([type="hidden"]), select, textarea, [role="textbox"], [contenteditable="true"]';
    const elements = root.querySelectorAll(selectors);
    
    elements.forEach((el) => {
      const input = el as HTMLElement;
      const style = window.getComputedStyle(input);
      if (style.display === 'none' || style.visibility === 'hidden' || style.opacity === '0') return;

      let labelText = '';
      if (input.id) {
        const label = document.querySelector(`label[for="${input.id}"]`);
        labelText = label?.textContent?.trim() || '';
      }
      
      if (!labelText) {
        labelText = input.getAttribute('aria-label') || 
                  input.getAttribute('placeholder') || 
                  input.getAttribute('name') || 
                  input.title || 
                  'Unknown Field';
      }

      fields.push({
        id: input.id || `field-${Math.random().toString(36).substr(2, 9)}`,
        type: (input as HTMLInputElement).type || input.getAttribute('role') || 'text',
        label: labelText,
        placeholder: (input as HTMLInputElement).placeholder,
        name: (input as HTMLInputElement).name,
        tagName: input.tagName.toLowerCase(),
        rect: input.getBoundingClientRect(),
      });
    });

    const allElements = root.querySelectorAll('*');
    allElements.forEach(el => {
      if (el.shadowRoot) {
        fields = [...fields, ...detectFieldsRecursive(el.shadowRoot)];
      }
    });

    return fields;
  }, []);

  const detectFields = useCallback(() => {
    const formContainer = document.getElementById('application-form');
    if (!formContainer) return;

    const newFields = detectFieldsRecursive(formContainer);

    setState(prev => {
      const currentIds = prev.fields.map(f => f.id).join(',');
      const nextIds = newFields.map(f => f.id).join(',');
      if (currentIds === nextIds) return prev;
      return { ...prev, fields: newFields };
    });

    const savedPreferences = localStorage.getItem(STORAGE_KEY);
    if (savedPreferences) {
      try {
        const preferences = JSON.parse(savedPreferences);
        const autoFilledValues: Record<string, string> = {};
        const autoFilledStatus: Record<string, boolean> = {};
        let updated = false;

        newFields.forEach(field => {
          const prefValue = preferences[field.id] || preferences[field.label];
          if (prefValue && !fieldValues[field.id]) {
            autoFilledValues[field.id] = prefValue;
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
  }, [fieldValues, detectFieldsRecursive]);

  useEffect(() => {
    detectFields();
    const simulationContainer = document.querySelector('.browser-simulation-content');
    if (simulationContainer) {
      observerRef.current = new MutationObserver((mutations) => {
        const hasNodeChanges = mutations.some(m => m.addedNodes.length > 0 || m.removedNodes.length > 0);
        if (hasNodeChanges) {
          detectFields();
        }
      });
      observerRef.current.observe(simulationContainer, { childList: true, subtree: true });
    }

    window.addEventListener('resize', detectFields);
    
    const handleFocus = (e: FocusEvent) => {
        const target = e.target as HTMLElement;
        const isInput = ['INPUT', 'TEXTAREA', 'SELECT'].includes(target.tagName) || 
                        target.getAttribute('role') === 'textbox' || 
                        target.getAttribute('contenteditable') === 'true';
                        
        if (target.id && isInput) {
          setFocusedFieldId(target.id);
        }
    };
    
    window.addEventListener('focusin', handleFocus);
    
    return () => {
      observerRef.current?.disconnect();
      window.removeEventListener('resize', detectFields);
      window.removeEventListener('focusin', handleFocus);
    };
  }, [detectFields]);

  useEffect(() => {
    if (state.fields.length > 0 && !state.isAnalyzing) {
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

  const startDictation = async (fieldId: string) => {
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      setState(s => ({ ...s, dictation: { id: fieldId, interimText: "", isListening: true } }));

      dictationAudioInRef.current = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 16000 });
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });

      const sessionPromise = ai.live.connect({
        model: 'gemini-2.5-flash-native-audio-preview-09-2025',
        callbacks: {
          onopen: () => {
            const source = dictationAudioInRef.current!.createMediaStreamSource(stream);
            const scriptProcessor = dictationAudioInRef.current!.createScriptProcessor(4096, 1, 1);
            scriptProcessor.onaudioprocess = (e) => {
              const inputData = e.inputBuffer.getChannelData(0);
              const int16 = new Int16Array(inputData.length);
              for (let i = 0; i < inputData.length; i++) int16[i] = inputData[i] * 32768;
              sessionPromise.then(session => session.sendRealtimeInput({ 
                media: { data: encode(new Uint8Array(int16.buffer)), mimeType: 'audio/pcm;rate=16000' } 
              }));
            };
            source.connect(scriptProcessor);
            scriptProcessor.connect(dictationAudioInRef.current!.destination);
          },
          onmessage: async (message) => {
            if (message.serverContent?.inputTranscription) {
              const text = message.serverContent.inputTranscription.text;
              setState(s => ({
                ...s,
                dictation: s.dictation ? { ...s.dictation, interimText: s.dictation.interimText + text } : s.dictation
              }));
            }
          },
          onclose: () => stopDictation(),
          onerror: (e) => {
            console.error("Dictation Error:", e);
            stopDictation();
          }
        },
        config: {
          responseModalities: [Modality.AUDIO],
          inputAudioTranscription: {},
          systemInstruction: "You are a transcription assistant. Only transcribe the user's speech accurately into text. No conversation."
        }
      });
      dictationSessionRef.current = await sessionPromise;
    } catch (err) {
      console.error(err);
      stopDictation();
    }
  };

  const stopDictation = () => {
    if (state.dictation?.id && state.dictation?.interimText) {
      const currentVal = fieldValues[state.dictation.id] || "";
      const space = currentVal ? " " : "";
      handleManualChange(state.dictation.id, currentVal + space + state.dictation.interimText);
    }

    dictationSessionRef.current?.close();
    dictationAudioInRef.current?.close();
    setState(s => ({ ...s, dictation: { id: null, interimText: "", isListening: false } }));
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
    const field = state.fields.find(f => f.id === id);
    if (s && field) {
      const savedPreferences = localStorage.getItem(STORAGE_KEY);
      const preferences = savedPreferences ? JSON.parse(savedPreferences) : {};
      preferences[id] = s.value;
      if (field.label) preferences[field.label] = s.value;
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
            <div id="application-form">
              <MockForm 
                onFieldChange={handleManualChange} 
                onRewrite={handleRewriteEssay} 
                onStartDictation={startDictation}
                onStopDictation={stopDictation}
                fieldValues={fieldValues} 
                isRewriting={isRewriting} 
                dictatingId={state.dictation?.id}
                interimText={state.dictation?.interimText}
              />
            </div>
            {state.fields.map(field => {
              if (!field.rect || focusedFieldId !== field.id || state.filledStatus[field.id]) return null;
              const suggestion = state.suggestions[field.id];
              if (!suggestion) return null;
              return (
                <SuggestionCard 
                  key={`card-${field.id}`}
                  suggestion={suggestion}
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
