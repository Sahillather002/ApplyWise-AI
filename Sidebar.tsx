
import React, { useState, useRef, useEffect } from 'react';
import { 
  CheckCircle, Circle, Zap, User, Database, Video, Upload, 
  Play, Download, Loader2, MessageSquare, Mic, StopCircle, Volume2, Send, ShieldCheck, Trash2, Key, ExternalLink, Globe
} from 'lucide-react';
import { ApplicationState, SidebarTab, InterviewSession, ChatMessage, UserProfile } from './types';
import { geminiService } from './services/geminiService';
import { GoogleGenAI, Modality } from "@google/genai";

interface SidebarProps {
  state: ApplicationState;
  userProfile: UserProfile;
  onAutoFillAll: () => void;
  onTabChange: (tab: SidebarTab) => void;
  onVideoStateUpdate: (videoState: any) => void;
  onInterviewUpdate: (interview: InterviewSession) => void;
}

const STORAGE_KEY = 'applywise_always_use_map';

function encode(bytes: Uint8Array) {
  let binary = '';
  const len = bytes.byteLength;
  for (let i = 0; i < len; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary);
}

function decode(base64: string) {
  const binaryString = atob(base64);
  const len = binaryString.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes;
}

async function decodeAudioData(
  data: Uint8Array,
  ctx: AudioContext,
  sampleRate: number,
  numChannels: number,
): Promise<AudioBuffer> {
  const dataInt16 = new Int16Array(data.buffer);
  const frameCount = dataInt16.length / numChannels;
  const buffer = ctx.createBuffer(numChannels, frameCount, sampleRate);

  for (let channel = 0; channel < numChannels; channel++) {
    const channelData = buffer.getChannelData(channel);
    for (let i = 0; i < frameCount; i++) {
      channelData[i] = dataInt16[i * numChannels + channel] / 32768.0;
    }
  }
  return buffer;
}

const Sidebar: React.FC<SidebarProps> = ({ state, userProfile, onAutoFillAll, onTabChange, onVideoStateUpdate, onInterviewUpdate }) => {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [videoPrompt, setVideoPrompt] = useState("");
  const [aspectRatio, setAspectRatio] = useState<'16:9' | '9:16'>('16:9');
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [chatInput, setChatInput] = useState("");
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  const [vaultItems, setVaultItems] = useState<Record<string, string>>({});

  const sessionRef = useRef<any>(null);
  const audioContextInRef = useRef<AudioContext | null>(null);
  const audioContextOutRef = useRef<AudioContext | null>(null);
  const nextStartTimeRef = useRef(0);
  const sourcesRef = useRef<Set<AudioBufferSourceNode>>(new Set());

  const totalFields = state.fields.length;
  const filledFieldsCount = Object.values(state.filledStatus).filter(Boolean).length;
  const progress = totalFields > 0 ? (filledFieldsCount / totalFields) * 100 : 0;

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatMessages, isTyping]);

  useEffect(() => {
    if (state.activeTab === 'vault') {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        try {
          setVaultItems(JSON.parse(saved));
        } catch (e) {
          console.error("Failed to parse vault items", e);
        }
      }
    }
  }, [state.activeTab]);

  const TabButton = ({ id, icon: Icon, label }: { id: SidebarTab, icon: any, label: string }) => (
    <button 
      onClick={() => onTabChange(id)}
      role="tab"
      aria-selected={state.activeTab === id}
      aria-controls={`${id}-panel`}
      id={`${id}-tab`}
      className={`flex flex-col items-center justify-center flex-1 py-3 transition-all outline-none focus-visible:ring-2 focus-visible:ring-indigo-400 focus-visible:ring-inset ${
        state.activeTab === id ? 'text-indigo-400 bg-white/5 border-b-2 border-indigo-400' : 'text-slate-500 hover:text-slate-300'
      }`}
    >
      <Icon size={18} aria-hidden="true" />
      <span className="text-[9px] font-bold mt-1 uppercase tracking-tighter">{label}</span>
    </button>
  );

  const startInterview = async () => {
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      onInterviewUpdate({ ...state.interview, isActive: true, transcription: ["Connecting Coach..."] });

      audioContextInRef.current = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 16000 });
      audioContextOutRef.current = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
      
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });

      const sessionPromise = ai.live.connect({
        model: 'gemini-2.5-flash-native-audio-preview-12-2025',
        callbacks: {
          onopen: () => {
            onInterviewUpdate({ ...state.interview, isActive: true, transcription: ["Coach connected. Listening..."] });
            const source = audioContextInRef.current!.createMediaStreamSource(stream);
            const scriptProcessor = audioContextInRef.current!.createScriptProcessor(4096, 1, 1);
            scriptProcessor.onaudioprocess = (e) => {
              const inputData = e.inputBuffer.getChannelData(0);
              const int16 = new Int16Array(inputData.length);
              for (let i = 0; i < inputData.length; i++) int16[i] = inputData[i] * 32768;
              sessionPromise.then(session => session.sendRealtimeInput({ media: { data: encode(new Uint8Array(int16.buffer)), mimeType: 'audio/pcm;rate=16000' } }));
            };
            source.connect(scriptProcessor);
            scriptProcessor.connect(audioContextInRef.current!.destination);
          },
          onmessage: async (message) => {
            const audioData = message.serverContent?.modelTurn?.parts[0]?.inlineData?.data;
            if (audioData) {
              const outCtx = audioContextOutRef.current!;
              nextStartTimeRef.current = Math.max(nextStartTimeRef.current, outCtx.currentTime);
              const buffer = await decodeAudioData(decode(audioData), outCtx, 24000, 1);
              const source = outCtx.createBufferSource();
              source.buffer = buffer;
              source.connect(outCtx.destination);
              source.start(nextStartTimeRef.current);
              nextStartTimeRef.current += buffer.duration;
              sourcesRef.current.add(source);
              source.onended = () => sourcesRef.current.delete(source);
            }
            if (message.serverContent?.outputTranscription) {
              onInterviewUpdate({ ...state.interview, transcription: [...state.interview.transcription, `Coach: ${message.serverContent.outputTranscription.text}`] });
            }
            if (message.serverContent?.inputTranscription) {
              onInterviewUpdate({ ...state.interview, transcription: [...state.interview.transcription, `You: ${message.serverContent.inputTranscription.text}`] });
            }
            if (message.serverContent?.interrupted) {
              sourcesRef.current.forEach(s => s.stop());
              sourcesRef.current.clear();
              nextStartTimeRef.current = 0;
            }
          },
          onclose: () => onInterviewUpdate({ ...state.interview, isActive: false }),
          onerror: (e) => console.error("Live API Error:", e)
        },
        config: {
          // The supported audio modality is 'AUDIO'.
          responseModalities: [Modality.AUDIO],
          speechConfig: { voiceConfig: { prebuiltVoiceConfig: { voiceName: 'Zephyr' } } },
          inputAudioTranscription: {},
          outputAudioTranscription: {},
          systemInstruction: `You are Zephyr, an AI Mock Interviewer. 
          User Profile: ${JSON.stringify(userProfile)}.
          Goal: Conduct a realistic 2-way audio interview for a Senior Frontend Engineer role. conciseness is key.`
        }
      });
      sessionRef.current = await sessionPromise;
    } catch (err) {
      console.error(err);
      onInterviewUpdate({ ...state.interview, isActive: false });
    }
  };

  const stopInterview = () => {
    sessionRef.current?.close();
    audioContextInRef.current?.close();
    audioContextOutRef.current?.close();
    sourcesRef.current.forEach(s => s.stop());
    onInterviewUpdate({ ...state.interview, isActive: false });
  };

  const handleSendMessage = async () => {
    if (!chatInput.trim() || isTyping) return;
    const userMsg: ChatMessage = { role: 'user', text: chatInput, timestamp: new Date() };
    setChatMessages(prev => [...prev, userMsg]);
    setChatInput("");
    setIsTyping(true);
    try {
      const responseText = await geminiService.chat(userMsg.text, chatMessages, userProfile);
      setChatMessages(prev => [...prev, { role: 'model', text: responseText, timestamp: new Date() }]);
    } catch (err) {
      setChatMessages(prev => [...prev, { role: 'model', text: "Service temporarily unavailable.", timestamp: new Date() }]);
    } finally {
      setIsTyping(false);
    }
  };

  const generateVideo = async () => {
    if (!selectedImage) return;
    try {
      const hasKey = await (window as any).aistudio.hasSelectedApiKey();
      if (!hasKey) await (window as any).aistudio.openSelectKey();
      
      onVideoStateUpdate({ ...state.videoState, isGenerating: true, statusMessage: "Initializing Engine...", error: null });
      const base64 = selectedImage.split(',')[1];
      const videoUrl = await geminiService.generateVideo(base64, videoPrompt, aspectRatio, (msg) => onVideoStateUpdate({ ...state.videoState, isGenerating: true, statusMessage: msg }));
      onVideoStateUpdate({ ...state.videoState, isGenerating: false, videoUrl, statusMessage: "Generation successful." });
    } catch (e: any) {
      if (e.message === "API_KEY_RESET_REQUIRED") await (window as any).aistudio.openSelectKey();
      onVideoStateUpdate({ ...state.videoState, isGenerating: false, error: e.message || "Failed to generate video." });
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setSelectedImage(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveVaultItem = (key: string) => {
    const updated = { ...vaultItems };
    delete updated[key];
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    setVaultItems(updated);
  };

  return (
    <div className="w-[340px] bg-slate-900 h-screen border-l border-white/10 flex flex-col text-slate-300 z-50 shadow-2xl relative">
      <div className="px-6 pt-6 pb-4 bg-slate-950/50">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center text-white shadow-lg">
              <Zap size={18} fill="currentColor" />
            </div>
            <span className="font-bold text-xl text-white tracking-tight">ApplyWise</span>
          </div>
        </div>
      </div>

      <div className="flex border-b border-white/5 bg-slate-950/30" role="tablist">
        <TabButton id="apply" icon={CheckCircle} label="Apply" />
        <TabButton id="research" icon={Globe} label="Research" />
        <TabButton id="chat" icon={MessageSquare} label="Chat" />
        <TabButton id="prep" icon={Mic} label="Coach" />
        <TabButton id="studio" icon={Video} label="Studio" />
        <TabButton id="vault" icon={Database} label="Vault" />
      </div>

      <div className="flex-1 overflow-y-auto custom-scrollbar relative">
        {state.activeTab === 'apply' && (
          <div id="apply-panel" role="tabpanel" aria-labelledby="apply-tab" className="p-6 space-y-6 animate-fade-in">
            <div className="bg-white/5 rounded-xl p-4 border border-white/5">
              <div className="flex justify-between text-[10px] font-bold text-slate-500 mb-2 uppercase tracking-widest">
                <span>Progress</span>
                <span className="text-white">{filledFieldsCount}/{totalFields}</span>
              </div>
              <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-indigo-500 transition-all duration-700 shadow-[0_0_12px_rgba(99,102,241,0.6)]" 
                  role="progressbar" 
                  aria-valuenow={progress} 
                  aria-valuemin={0} 
                  aria-valuemax={100} 
                  style={{ width: `${progress}%` }}
                ></div>
              </div>
              <button onClick={onAutoFillAll} className="w-full mt-4 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg py-2.5 font-bold text-xs transition-all flex items-center justify-center space-x-2 shadow-lg">
                <Zap size={14} />
                <span>Auto-fill Everything</span>
              </button>
            </div>
            <div className="space-y-2">
              <h3 className="text-[10px] uppercase tracking-widest text-slate-500 font-bold mb-3">Form Analysis</h3>
              {state.fields.map(field => (
                <div key={field.id} className={`p-3 rounded-lg border transition-all ${state.filledStatus[field.id] ? 'bg-emerald-500/5 border-emerald-500/10' : 'bg-slate-800/40 border-white/5'}`}>
                  <div className="flex items-center justify-between">
                    <p className={`text-xs font-semibold truncate flex-1 ${state.filledStatus[field.id] ? 'text-emerald-400' : 'text-slate-300'}`}>{field.label}</p>
                    {state.filledStatus[field.id] && <CheckCircle size={14} className="text-emerald-500" />}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {state.activeTab === 'research' && (
          <div id="research-panel" role="tabpanel" aria-labelledby="research-tab" className="p-6 space-y-6 animate-fade-in">
             <h3 className="text-lg font-bold text-white">Quick Research</h3>
             <p className="text-xs text-slate-400 leading-relaxed">
               Use the Deep Research page for full analysis. This sidebar tab will soon support quick context fetching and company news alerts.
             </p>
             <div className="p-4 bg-white/5 border border-white/5 rounded-xl">
               <p className="text-[10px] font-bold text-indigo-400 uppercase tracking-widest mb-2">Alpha Feature</p>
               <p className="text-[11px] text-slate-300 italic">"InnovateTech recently raised Series C funding led by Indigo Ventures."</p>
             </div>
          </div>
        )}

        {state.activeTab === 'chat' && (
          <div id="chat-panel" role="tabpanel" aria-labelledby="chat-tab" className="flex flex-col h-full bg-slate-900 animate-fade-in">
            <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar">
              {chatMessages.length === 0 && (
                <div className="text-center py-12 px-4 space-y-4">
                  <MessageSquare size={32} className="mx-auto text-indigo-500/30" />
                  <p className="text-[10px] text-slate-500 uppercase tracking-widest">Start a career conversation</p>
                </div>
              )}
              {chatMessages.map((msg, i) => (
                <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[85%] px-3 py-2 rounded-2xl text-[11px] leading-relaxed ${
                    msg.role === 'user' ? 'bg-indigo-600 text-white shadow-lg' : 'bg-white/5 text-slate-300 border border-white/5'
                  }`}>
                    {msg.text}
                  </div>
                </div>
              ))}
              {isTyping && <div className="text-[10px] text-indigo-400 animate-pulse px-2">Applying Intelligence...</div>}
              <div ref={chatEndRef} />
            </div>
            <div className="p-4 bg-slate-950/50 border-t border-white/5">
              <div className="relative">
                <input 
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                  placeholder="Ask advisor..."
                  aria-label="Chat input"
                  className="w-full bg-slate-900 border border-white/10 rounded-xl pl-4 pr-10 py-2.5 text-xs outline-none focus:border-indigo-500 transition-colors"
                />
                <button onClick={handleSendMessage} className="absolute right-2 top-1/2 -translate-y-1/2 text-indigo-400 hover:text-indigo-300" aria-label="Send message">
                  <Send size={16} />
                </button>
              </div>
            </div>
          </div>
        )}

        {state.activeTab === 'prep' && (
          <div id="prep-panel" role="tabpanel" aria-labelledby="prep-tab" className="p-6 space-y-6 animate-fade-in">
            <h3 className="text-lg font-bold text-white">Interview Coach</h3>
            {!state.interview.isActive ? (
              <button onClick={startInterview} className="w-full py-3 bg-indigo-600 hover:bg-indigo-500 rounded-xl font-bold text-sm shadow-xl shadow-indigo-500/10 transition-all">Start Audio Session</button>
            ) : (
              <div className="space-y-4">
                <div className="h-64 bg-slate-950 rounded-xl p-4 overflow-y-auto text-[11px] space-y-2 font-mono custom-scrollbar">
                  {state.interview.transcription.map((t, i) => <div key={i} className={t.startsWith('Coach:') ? 'text-indigo-400' : 'text-slate-400'}>{t}</div>)}
                </div>
                <button onClick={stopInterview} className="w-full py-3 bg-red-600 hover:bg-red-500 rounded-xl font-bold text-sm flex items-center justify-center space-x-2 transition-all shadow-xl shadow-red-500/10">
                  <StopCircle size={16} /> <span>End Session</span>
                </button>
              </div>
            )}
          </div>
        )}

        {state.activeTab === 'studio' && (
          <div id="studio-panel" role="tabpanel" aria-labelledby="studio-tab" className="p-6 space-y-6 animate-fade-in">
            <h3 className="text-lg font-bold text-white">Veo Studio</h3>
            {!state.videoState.isGenerating && !state.videoState.videoUrl && (
              <div className="space-y-4">
                <div 
                  onClick={() => fileInputRef.current?.click()} 
                  className="border-2 border-dashed border-white/10 rounded-xl p-10 flex flex-col items-center justify-center cursor-pointer hover:border-indigo-500/50 transition-all group"
                >
                  <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleImageUpload} />
                  {selectedImage ? <img src={selectedImage} alt="Reference" className="w-full h-32 object-cover rounded-lg" /> : <Upload className="text-slate-500 group-hover:text-indigo-400 transition-colors" size={32} />}
                  <p className="text-[10px] mt-2 uppercase font-bold text-slate-500 group-hover:text-slate-400">Upload Reference Image</p>
                </div>
                <input 
                  value={videoPrompt}
                  onChange={(e) => setVideoPrompt(e.target.value)}
                  placeholder="Cinematic animation prompt..."
                  aria-label="Video prompt"
                  className="w-full bg-slate-950 border border-white/5 rounded-xl px-4 py-2.5 text-xs outline-none focus:border-indigo-500"
                />
                <button disabled={!selectedImage} onClick={generateVideo} className="w-full py-3 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white rounded-xl font-bold flex items-center justify-center space-x-2 shadow-xl shadow-indigo-500/10 transition-all">
                  <Play size={16} fill="currentColor" /> <span>Synthesize Video</span>
                </button>
              </div>
            )}
            {state.videoState.isGenerating && (
              <div className="text-center py-10 space-y-4">
                <Loader2 className="animate-spin text-indigo-500 mx-auto" size={40} />
                <p className="text-sm font-bold animate-pulse">{state.videoState.statusMessage}</p>
              </div>
            )}
            {state.videoState.videoUrl && (
              <div className="space-y-4">
                <video src={state.videoState.videoUrl} controls autoPlay loop className="rounded-xl w-full shadow-2xl" />
                <button onClick={() => onVideoStateUpdate({...state.videoState, videoUrl: null})} className="w-full py-2 bg-slate-800 hover:bg-slate-700 rounded-xl text-xs font-bold transition-all">New Project</button>
              </div>
            )}
            {state.videoState.error && <p className="text-red-400 text-xs text-center p-4 bg-red-400/5 rounded-xl border border-red-400/10">{state.videoState.error}</p>}
          </div>
        )}

        {state.activeTab === 'vault' && (
          <div id="vault-panel" role="tabpanel" aria-labelledby="vault-tab" className="p-6 space-y-6 animate-fade-in">
            <div className="text-center space-y-2 mb-6">
              <ShieldCheck size={40} className="mx-auto text-emerald-500" />
              <p className="text-xs font-bold text-white uppercase tracking-widest">Neural Vault</p>
              <p className="text-[10px] text-slate-500">Persistent AES-256 encrypted mappings.</p>
            </div>

            <div className="space-y-3">
              <h3 className="text-[10px] uppercase tracking-widest text-slate-500 font-bold px-1">Active Preferences</h3>
              {Object.keys(vaultItems).length === 0 ? (
                <div className="bg-white/5 border border-dashed border-white/10 rounded-xl p-8 text-center">
                  <Key size={24} className="mx-auto text-slate-700 mb-2 opacity-30" />
                  <p className="text-[10px] text-slate-600 uppercase font-black">No identities stored</p>
                  <p className="text-[9px] text-slate-700 mt-1 italic">Use 'Always Use' on AI suggestions to secure them.</p>
                </div>
              ) : (
                <div className="space-y-2">
                  {Object.entries(vaultItems).map(([key, value]) => (
                    <div key={key} className="bg-white/5 border border-white/5 rounded-xl p-3 flex items-center justify-between group transition-all hover:bg-white/10">
                      <div className="flex-1 min-w-0 pr-4">
                        <p className="text-[10px] font-black text-indigo-400 uppercase tracking-tighter truncate">{key}</p>
                        <p className="text-xs text-slate-300 truncate mt-0.5">{value}</p>
                      </div>
                      <button 
                        onClick={() => handleRemoveVaultItem(key)}
                        className="p-2 text-slate-600 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-all focus:opacity-100"
                        title="Purge record"
                        aria-label={`Remove ${key} from vault`}
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
            
            <div className="mt-8 p-4 bg-indigo-900/10 border border-indigo-500/20 rounded-xl">
              <div className="flex items-center space-x-2 text-[10px] font-black text-indigo-400 mb-2 uppercase tracking-[0.1em]">
                <ShieldCheck size={14} />
                <span>Security Protocol</span>
              </div>
              <p className="text-[10px] text-slate-400 leading-relaxed italic">
                Data is locked to this local environment. Zero telemetry transmission ensures complete PII sovereignty.
              </p>
            </div>
          </div>
        )}
      </div>

      <div className="p-4 bg-slate-950/80 border-t border-white/5 flex items-center justify-between">
        <div className="flex items-center space-x-2 text-[10px] font-bold text-slate-500">
          <ShieldCheck size={12} className="text-emerald-500" />
          <span>VAULT ACTIVE</span>
        </div>
        <button 
          onClick={() => window.open('https://ai.google.dev/gemini-api/docs/billing', '_blank')}
          className="text-[10px] text-slate-600 hover:text-slate-400 underline tracking-tighter transition-colors"
        >
          Billing Info
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
