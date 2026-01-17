
import React, { useState, lazy, Suspense, useRef } from 'react';
import { Home, Box, Globe, User, Mic, Loader2, LayoutDashboard, Sparkles, FileText, Send, Command } from 'lucide-react';
import { ApplicationState, UserProfile } from './types';
import { MOCK_USER_PROFILE } from './constants';
import { GoogleGenAI, Modality } from "@google/genai";
import { geminiService } from './services/geminiService';

// Lazy load pages
const LandingPage = lazy(() => import('./pages/LandingPage'));
const UserProfileManagement = lazy(() => import('./pages/user-profile-management/index'));
import ApplicationHistory from './pages/application-history/index';
const FormFieldDetection = lazy(() => import('./pages/form-field-detection/index'));
const AISuggestionCardsPage = lazy(() => import('./pages/ai-suggestion-cards/index'));
const CompanyResearch = lazy(() => import('./pages/company-research/index'));
const CareerCoachPage = lazy(() => import('./pages/career-coach/index'));
const DashboardPage = lazy(() => import('./pages/dashboard/index'));
const ResumeOptimizer = lazy(() => import('./pages/resume-optimizer/index'));
const CoverLetterArchitect = lazy(() => import('./pages/cover-letter/index'));
const NotFound = lazy(() => import('./pages/NotFound'));

// Components
import Sidebar from './components/Sidebar';
import BrowserSimulation from './components/BrowserSimulation';
import MockForm from './components/MockForm';
import ThemeToggle from './components/ThemeToggle';
import CommandPalette from './components/CommandPalette';

const App: React.FC = () => {
  const [route, setRoute] = useState<string>('landing');
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState(false);
  const [userProfile, setUserProfile] = useState<UserProfile>(MOCK_USER_PROFILE);
  const [fieldValues, setFieldValues] = useState<Record<string, string>>({});
  const [state, setState] = useState<ApplicationState>({
    fields: [
      { id: 'full-name', type: 'text', label: 'Full Name', tagName: 'input', rect: null },
      { id: 'email-address', type: 'email', label: 'Email Address', tagName: 'input', rect: null },
      { id: 'phone-number', type: 'tel', label: 'Phone Number', tagName: 'input', rect: null },
      { id: 'portfolio-url', type: 'url', label: 'Portfolio Website', tagName: 'input', rect: null },
      { id: 'home-address', type: 'text', label: 'Residential Address', tagName: 'input', rect: null },
      { id: 'current-role', type: 'text', label: 'Current Role & Company', tagName: 'input', rect: null },
      { id: 'years-react', type: 'select', label: 'Years of experience with React', tagName: 'select', rect: null },
      { id: 'why-join', type: 'textarea', label: 'Why are you interested in joining InnovateTech?', tagName: 'textarea', rect: null },
    ],
    suggestions: {},
    filledStatus: {},
    isAnalyzing: false,
    activeTab: 'apply',
    companyInfo: null,
    isResearching: false,
    videoState: { isGenerating: false, progress: 0, statusMessage: '', videoUrl: null, error: null },
    interview: { isActive: false, transcription: [], isListening: false },
    dictation: { id: null, interimText: '', isListening: false },
    history: [
      { id: '1', company: 'Google', role: 'Senior UX Engineer', stage: 'interview', matchScore: 94, date: 'Mar 15, 2024' },
      { id: '2', company: 'Stripe', role: 'Frontend Architect', stage: 'applied', matchScore: 88, date: 'Mar 10, 2024' },
      { id: '3', company: 'Vercel', role: 'Developer Relations', stage: 'rejected', matchScore: 91, date: 'Feb 28, 2024' },
      { id: '4', company: 'Linear', role: 'Staff Engineer', stage: 'discovery', matchScore: 92, date: 'Mar 18, 2024' },
    ]
  });

  // Neural Dictation Session Refs
  const dictSessionRef = useRef<any>(null);
  const audioInRef = useRef<AudioContext | null>(null);

  const startDictation = async (fieldId: string) => {
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      setState(prev => ({ ...prev, dictation: { id: fieldId, interimText: 'Opening voice channel...', isListening: true } }));
      audioInRef.current = new AudioContext({ sampleRate: 16000 });
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const source = audioInRef.current.createMediaStreamSource(stream);
      const sessionPromise = ai.live.connect({
        model: 'gemini-2.0-flash',
        callbacks: {
          onopen: () => {
            const processor = audioInRef.current!.createScriptProcessor(4096, 1, 1);
            processor.onaudioprocess = (e) => {
              const data = e.inputBuffer.getChannelData(0);
              const int16 = new Int16Array(data.length);
              for (let i = 0; i < data.length; i++) int16[i] = data[i] * 32768;
              sessionPromise.then(s => s.sendRealtimeInput({ media: { data: btoa(String.fromCharCode(...new Uint8Array(int16.buffer))), mimeType: 'audio/pcm;rate=16000' } }));
            };
            source.connect(processor);
            processor.connect(audioInRef.current!.destination);
          },
          onmessage: (msg) => {
            if (msg.serverContent?.inputTranscription) {
              const text = msg.serverContent.inputTranscription.text;
              setFieldValues(prev => ({ ...prev, [fieldId]: (prev[fieldId] || '') + text }));
              setState(prev => ({ ...prev, dictation: { ...prev.dictation!, interimText: text } }));
            }
          }
        },
        config: { responseModalities: [Modality.AUDIO], inputAudioTranscription: {} }
      });
      dictSessionRef.current = await sessionPromise;
    } catch (e) {
      stopDictation();
    }
  };

  const stopDictation = () => {
    dictSessionRef.current?.close();
    audioInRef.current?.close();
    setState(prev => ({ ...prev, dictation: { id: null, interimText: '', isListening: false } }));
  };

  const handleAutoFillAll = async () => {
    setState(prev => ({ ...prev, isAnalyzing: true }));
    try {
      const result = await geminiService.analyzeForm(state.fields, userProfile);
      Object.entries(result).forEach(([fieldId, suggestion], index) => {
        setTimeout(() => {
          setFieldValues(prev => ({ ...prev, [fieldId]: suggestion.value }));
          setState(prev => ({ ...prev, filledStatus: { ...prev.filledStatus, [fieldId]: true } }));
        }, index * 400); // Cinematic ghost-typing effect
      });
    } catch (e) {
      console.error(e);
    } finally {
      setState(prev => ({ ...prev, isAnalyzing: false }));
    }
  };

  const handleFieldChange = (id: string, value: string) => {
    setFieldValues(prev => ({ ...prev, [id]: value }));
    setState(prev => ({ ...prev, filledStatus: { ...prev.filledStatus, [id]: !!value.trim() } }));
  };

  const renderContent = () => {
    switch (route) {
      case 'landing': return <LandingPage onStart={() => setRoute('dashboard')} />;
      case 'dashboard': return <DashboardPage profile={userProfile} />;
      case 'profile': return <UserProfileManagement profile={userProfile} onUpdate={setUserProfile} />;
      case 'history': return (
        <ApplicationHistory
          applications={state.history}
          onUpdateStage={(id, stage) => setState(prev => ({
            ...prev,
            history: prev.history.map(app => app.id === id ? { ...app, stage } : app)
          }))}
        />
      );
      case 'coach': return <CareerCoachPage profile={userProfile} />;
      case 'research': return <CompanyResearch />;
      case 'optimize': return <ResumeOptimizer profile={userProfile} />;
      case 'letter': return <CoverLetterArchitect profile={userProfile} />;
      case 'main': return (
        <div className="flex h-screen bg-white dark:bg-slate-900 transition-colors">
          <BrowserSimulation>
            <MockForm
              fieldValues={fieldValues}
              onFieldChange={handleFieldChange}
              onRewrite={async () => { }}
              onStartDictation={startDictation}
              onStopDictation={stopDictation}
              dictatingId={state.dictation?.id}
              interimText={state.dictation?.interimText}
            />
          </BrowserSimulation>
          <Sidebar
            state={state}
            userProfile={userProfile}
            onAutoFillAll={handleAutoFillAll}
            onTabChange={(tab) => {
              if (tab === 'prep') setRoute('coach');
              else setState(prev => ({ ...prev, activeTab: tab }));
            }}
            onVideoStateUpdate={(videoState) => setState(prev => ({ ...prev, videoState }))}
            onInterviewUpdate={(interview) => setState(prev => ({ ...prev, interview }))}
          />
        </div>
      );
      default: return <NotFound onGoHome={() => setRoute('dashboard')} />;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 transition-colors duration-500">
      <Suspense fallback={<div className="flex items-center justify-center h-screen"><Loader2 className="animate-spin text-indigo-500" /></div>}>
        {renderContent()}
      </Suspense>

      <div className="fixed top-6 left-6 z-[100] flex items-center space-x-2 bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl p-2 rounded-2xl border border-slate-200 dark:border-white/10 shadow-2xl">
        <button onClick={() => setRoute('landing')} className={`p-2 rounded-xl transition-all ${route === 'landing' ? 'bg-indigo-600 text-white shadow-lg' : 'text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800'}`}><Home size={18} /></button>
        <button onClick={() => setRoute('dashboard')} className={`p-2 rounded-xl transition-all ${route === 'dashboard' ? 'bg-indigo-600 text-white shadow-lg' : 'text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800'}`}><LayoutDashboard size={18} /></button>
        <button onClick={() => setRoute('main')} className={`p-2 rounded-xl transition-all ${route === 'main' ? 'bg-indigo-600 text-white shadow-lg' : 'text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800'}`}><Box size={18} /></button>
        <button onClick={() => setRoute('research')} className={`p-2 rounded-xl transition-all ${route === 'research' ? 'bg-indigo-600 text-white shadow-lg' : 'text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800'}`}><Globe size={18} /></button>
        <button onClick={() => setRoute('optimize')} className={`p-2 rounded-xl transition-all ${route === 'optimize' ? 'bg-indigo-600 text-white shadow-lg' : 'text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800'}`}><FileText size={18} /></button>
        <button onClick={() => setRoute('letter')} className={`p-2 rounded-xl transition-all ${route === 'letter' ? 'bg-indigo-600 text-white shadow-lg' : 'text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800'}`}><Send size={18} /></button>
        <button onClick={() => setRoute('profile')} className={`p-2 rounded-xl transition-all ${route === 'profile' ? 'bg-indigo-600 text-white shadow-lg' : 'text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800'}`}><User size={18} /></button>
        <div className="w-px h-6 bg-slate-200 dark:bg-slate-700 mx-1" />
        <ThemeToggle />
      </div>

      <CommandPalette
        isOpen={isCommandPaletteOpen}
        onClose={() => setIsCommandPaletteOpen(false)}
        onSelect={setRoute}
      />

      <button
        onClick={() => setIsCommandPaletteOpen(true)}
        className="fixed bottom-6 right-6 z-[400] w-12 h-12 bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 rounded-2xl flex items-center justify-center text-slate-500 hover:text-indigo-600 transition-all shadow-2xl hover:scale-110 active:scale-95"
      >
        <Command size={20} />
      </button>
      {state.dictation?.isListening && (
        <div className="fixed bottom-12 left-1/2 -translate-x-1/2 z-[200] animate-in slide-in-from-bottom-4 duration-300">
          <div className="bg-slate-900 text-white px-8 py-4 rounded-[2rem] shadow-2xl flex items-center space-x-4 border border-indigo-500/30">
            <div className="relative">
              <Mic size={20} className="text-indigo-400" />
              <div className="absolute inset-0 bg-indigo-500/20 rounded-full animate-ping" />
            </div>
            <p className="text-xs font-black uppercase tracking-widest text-indigo-100">Voice Dictation Active</p>
            <button onClick={stopDictation} className="text-[10px] font-black text-red-400 hover:text-red-300 uppercase tracking-tighter">STOP</button>
          </div>
        </div>
      )}

      {state.isAnalyzing && (
        <div className="fixed inset-0 z-[300] bg-white/40 dark:bg-slate-950/40 backdrop-blur-sm flex items-center justify-center cursor-wait animate-in fade-in duration-300">
          <div className="bg-white dark:bg-slate-900 p-8 rounded-[2.5rem] shadow-2xl border border-slate-200 dark:border-white/10 flex flex-col items-center space-y-4">
            <div className="relative">
              <Sparkles size={48} className="text-indigo-600 animate-pulse" />
              <Loader2 size={64} className="absolute -top-2 -left-2 text-indigo-500/20 animate-spin" />
            </div>
            <p className="text-lg font-black text-slate-900 dark:text-white uppercase italic tracking-tighter">Form Analysis in Progress...</p>
            <p className="text-xs text-slate-500 font-bold uppercase tracking-widest">Applying career heuristics to DOM nodes</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;
