
import React, { useState, useRef, useEffect } from 'react';
import { 
  CheckCircle, Circle, AlertCircle, Zap, User, FileText, 
  Settings, ChevronRight, ShieldCheck, Search, Database, History,
  Globe, Sparkles, Building2, Lightbulb, Video, Upload, Image as ImageIcon,
  Play, Download, Loader2, Key, MessageSquare, Mic, StopCircle, Volume2
} from 'lucide-react';
import { ApplicationState, SidebarTab, InterviewSession } from '../types';
import { geminiService } from '../services/geminiService';
import { GoogleGenAI, Modality } from "@google/genai";
import { MOCK_USER_PROFILE } from '../constants';

interface SidebarProps {
  state: ApplicationState;
  onAutoFillAll: () => void;
  onTabChange: (tab: SidebarTab) => void;
  onVideoStateUpdate: (videoState: any) => void;
  onInterviewUpdate: (interview: InterviewSession) => void;
}

// Helper functions for audio encoding/decoding as required by Live API
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

const Sidebar: React.FC<SidebarProps> = ({ state, onAutoFillAll, onTabChange, onVideoStateUpdate, onInterviewUpdate }) => {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [videoPrompt, setVideoPrompt] = useState("");
  const [aspectRatio, setAspectRatio] = useState<'16:9' | '9:16'>('16:9');
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // Interview state refs
  const sessionRef = useRef<any>(null);
  const audioContextInRef = useRef<AudioContext | null>(null);
  const audioContextOutRef = useRef<AudioContext | null>(null);
  const nextStartTimeRef = useRef(0);
  const sourcesRef = useRef<Set<AudioBufferSourceNode>>(new Set());

  const totalFields = state.fields.length;
  const filledFieldsCount = Object.values(state.filledStatus).filter(Boolean).length;
  const progress = totalFields > 0 ? (filledFieldsCount / totalFields) * 100 : 0;

  const TabButton = ({ id, icon: Icon, label }: { id: SidebarTab, icon: any, label: string }) => (
    <button 
      onClick={() => onTabChange(id)}
      className={`flex flex-col items-center justify-center flex-1 py-3 transition-all ${
        state.activeTab === id ? 'text-indigo-400 bg-white/5 border-b-2 border-indigo-400' : 'text-slate-500 hover:text-slate-300'
      }`}
    >
      <Icon size={18} />
      <span className="text-[9px] font-bold mt-1 uppercase tracking-tighter">{label}</span>
    </button>
  );

  const startInterview = async () => {
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      
      onInterviewUpdate({ ...state.interview, isActive: true, transcription: ["Connecting to ApplyWise Career Coach..."] });

      audioContextInRef.current = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 16000 });
      audioContextOutRef.current = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
      
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });

      const sessionPromise = ai.live.connect({
        model: 'gemini-2.5-flash-native-audio-preview-09-2025',
        callbacks: {
          onopen: () => {
            onInterviewUpdate({ ...state.interview, isActive: true, transcription: ["Coach connected. Listening..."] });
            
            const source = audioContextInRef.current!.createMediaStreamSource(stream);
            const scriptProcessor = audioContextInRef.current!.createScriptProcessor(4096, 1, 1);
            
            scriptProcessor.onaudioprocess = (e) => {
              const inputData = e.inputBuffer.getChannelData(0);
              const int16 = new Int16Array(inputData.length);
              for (let i = 0; i < inputData.length; i++) {
                int16[i] = inputData[i] * 32768;
              }
              const pcmBlob = {
                data: encode(new Uint8Array(int16.buffer)),
                mimeType: 'audio/pcm;rate=16000',
              };
              sessionPromise.then(session => session.sendRealtimeInput({ media: pcmBlob }));
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
              const text = message.serverContent.outputTranscription.text;
              onInterviewUpdate({ 
                ...state.interview, 
                isActive: true, 
                transcription: [...state.interview.transcription, `Coach: ${text}`] 
              });
            }
            if (message.serverContent?.inputTranscription) {
              const text = message.serverContent.inputTranscription.text;
              onInterviewUpdate({ 
                ...state.interview, 
                isActive: true, 
                transcription: [...state.interview.transcription, `You: ${text}`] 
              });
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
          responseModalities: [Modality.AUDIO],
          speechConfig: { voiceConfig: { prebuiltVoiceConfig: { voiceName: 'Zephyr' } } },
          inputAudioTranscription: {},
          outputAudioTranscription: {},
          systemInstruction: `You are a professional mock interviewer named Zephyr. 
            User Profile: ${JSON.stringify(MOCK_USER_PROFILE)}.
            Job: Senior Frontend Engineer at InnovateTech.
            Goal: Conduct a realistic 2-way audio interview. Ask challenging technical and behavioral questions. 
            Keep responses concise (1-2 sentences) so the user can speak more. 
            Begin by greeting them and asking them to tell you about their experience with React migration.`
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

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setSelectedImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const checkAndOpenKeyDialog = async () => {
    const hasKey = await (window as any).aistudio.hasSelectedApiKey();
    if (!hasKey) {
      await (window as any).aistudio.openSelectKey();
      return true;
    }
    return true;
  };

  const generateVideo = async () => {
    if (!selectedImage) return;
    try {
      await checkAndOpenKeyDialog();
      onVideoStateUpdate({ ...state.videoState, isGenerating: true, statusMessage: "Waking up the neural engine...", error: null });
      const base64 = selectedImage.split(',')[1];
      const videoUrl = await geminiService.generateVideo(base64, videoPrompt, aspectRatio, (msg) => onVideoStateUpdate({ ...state.videoState, isGenerating: true, statusMessage: msg }));
      onVideoStateUpdate({ ...state.videoState, isGenerating: false, videoUrl, statusMessage: "Complete!" });
    } catch (e: any) {
      if (e.message === "API_KEY_RESET_REQUIRED") await (window as any).aistudio.openSelectKey();
      onVideoStateUpdate({ ...state.videoState, isGenerating: false, error: e.message || "Something went wrong" });
    }
  };

  return (
    <div className="w-[340px] bg-slate-900 h-screen border-l border-white/10 flex flex-col text-slate-300 z-50 shadow-2xl relative">
      <div className="px-6 pt-6 pb-4 bg-slate-950/50">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center text-white shadow-lg">
              <Zap size={18} fill="currentColor" />
            </div>
            <span className="font-bold text-xl text-white">ApplyWise</span>
          </div>
          <div className="flex items-center space-x-2">
             <div className="px-2 py-1 rounded bg-emerald-500/10 text-emerald-400 text-[10px] font-bold border border-emerald-500/20">LIVE</div>
             <Settings size={16} className="text-slate-500 hover:text-white cursor-pointer" />
          </div>
        </div>
      </div>

      <div className="flex border-b border-white/5 bg-slate-950/30">
        <TabButton id="apply" icon={CheckCircle} label="Apply" />
        <TabButton id="research" icon={Globe} label="Intel" />
        <TabButton id="prep" icon={MessageSquare} label="Prep" />
        <TabButton id="studio" icon={Video} label="Studio" />
        <TabButton id="vault" icon={Database} label="Vault" />
      </div>

      <div className="flex-1 overflow-y-auto custom-scrollbar">
        {state.activeTab === 'apply' && (
          <div className="p-6 space-y-6">
            <div className="bg-white/5 rounded-xl p-4 border border-white/5">
              <div className="flex justify-between text-[10px] font-bold text-slate-500 mb-2 uppercase tracking-widest">
                <span>Progress</span>
                <span className="text-white">{filledFieldsCount}/{totalFields}</span>
              </div>
              <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
                <div className="h-full bg-indigo-500 transition-all duration-700 shadow-[0_0_12px_rgba(99,102,241,0.6)]" style={{ width: `${progress}%` }}></div>
              </div>
              <button onClick={onAutoFillAll} className="w-full mt-4 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg py-2.5 font-bold text-xs transition-all flex items-center justify-center space-x-2 shadow-lg">
                <Sparkles size={14} />
                <span>Auto-fill Everything</span>
              </button>
            </div>
            <div className="space-y-2">
              <h3 className="text-[10px] uppercase tracking-widest text-slate-500 font-bold mb-3">Field Analysis</h3>
              {state.fields.map(field => (
                <div key={field.id} className={`p-3 rounded-lg border transition-all ${state.filledStatus[field.id] ? 'bg-emerald-500/5 border-emerald-500/10' : 'bg-slate-800/40 border-white/5'}`}>
                  <div className="flex items-center justify-between">
                    <div className="truncate pr-2">
                      <p className={`text-xs font-semibold ${state.filledStatus[field.id] ? 'text-emerald-400' : 'text-slate-300'}`}>{field.label}</p>
                    </div>
                    {state.filledStatus[field.id] ? <CheckCircle size={14} className="text-emerald-500" /> : <Circle size={14} className="text-slate-700" />}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {state.activeTab === 'prep' && (
          <div className="p-6 space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
             <div>
              <h3 className="text-lg font-bold text-white mb-1">Interview Coach</h3>
              <p className="text-[11px] text-slate-400 mb-4 italic">Live voice-to-voice mock interview with Gemini.</p>
              
              {!state.interview.isActive ? (
                <div className="bg-white/5 border border-white/10 rounded-xl p-6 text-center space-y-4">
                  <div className="w-16 h-16 bg-indigo-600/20 rounded-full flex items-center justify-center mx-auto text-indigo-400">
                    <Volume2 size={32} />
                  </div>
                  <div className="space-y-2">
                    <p className="text-xs font-semibold text-white">Ready for a mock interview?</p>
                    <p className="text-[10px] text-slate-500">Practice your React and Frontend knowledge with a real-time AI coach.</p>
                  </div>
                  <button 
                    onClick={startInterview}
                    className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-xs font-bold transition-all shadow-lg"
                  >
                    Start Audio Session
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="bg-slate-950 border border-indigo-500/30 rounded-xl overflow-hidden shadow-2xl">
                    <div className="bg-indigo-600/10 px-4 py-2 border-b border-indigo-500/20 flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
                        <span className="text-[10px] font-bold text-indigo-400 uppercase tracking-widest">Live Coaching</span>
                      </div>
                      <Mic size={14} className="text-indigo-400" />
                    </div>
                    <div className="h-64 p-4 overflow-y-auto space-y-3 custom-scrollbar text-[11px]">
                      {state.interview.transcription.map((line, i) => (
                        <div key={i} className={`${line.startsWith('Coach:') ? 'text-indigo-300' : 'text-slate-400 italic'}`}>
                          {line}
                        </div>
                      ))}
                      <div className="flex justify-center pt-4">
                         <div className="flex space-x-1">
                            {[1, 2, 3, 4, 5].map(n => <div key={n} className="w-1 h-4 bg-indigo-500 rounded-full animate-bounce" style={{ animationDelay: `${n * 0.1}s` }} />)}
                         </div>
                      </div>
                    </div>
                  </div>
                  <button 
                    onClick={stopInterview}
                    className="w-full py-2.5 bg-red-600 hover:bg-red-500 text-white rounded-lg text-xs font-bold transition-all flex items-center justify-center space-x-2 shadow-lg"
                  >
                    <StopCircle size={16} />
                    <span>End Session</span>
                  </button>
                </div>
              )}
            </div>
            <div className="bg-emerald-600/5 p-4 rounded-xl border border-emerald-500/10">
              <h4 className="text-[10px] font-bold text-emerald-400 uppercase tracking-widest mb-2 flex items-center">
                <CheckCircle size={12} className="mr-1" /> Prep Strategy
              </h4>
              <p className="text-[9px] text-slate-500 leading-relaxed">
                Coach Zephyr uses your Master Resume and the target Job Description to simulate real-world curveballs. Focus on your TTI improvement metric.
              </p>
            </div>
          </div>
        )}

        {state.activeTab === 'studio' && (
          <div className="p-6 space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
            <div>
              <h3 className="text-lg font-bold text-white mb-1">Veo Studio</h3>
              <p className="text-[11px] text-slate-400 mb-4 italic">Bring your headshot or portfolio to life with AI animation.</p>
              {!state.videoState.isGenerating && !state.videoState.videoUrl && (
                <div className="space-y-4">
                  <div onClick={() => fileInputRef.current?.click()} className="group border-2 border-dashed border-white/10 hover:border-indigo-500/50 bg-white/5 rounded-xl p-8 flex flex-col items-center justify-center cursor-pointer transition-all">
                    <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleImageUpload} />
                    {selectedImage ? (
                      <div className="relative w-full aspect-video rounded-lg overflow-hidden border border-white/10">
                        <img src={selectedImage} alt="Preview" className="w-full h-full object-cover" />
                      </div>
                    ) : (
                      <>
                        <Upload className="text-slate-600 mb-3 group-hover:text-indigo-400 transition-colors" size={32} />
                        <p className="text-xs font-semibold text-slate-400">Click to upload photo</p>
                      </>
                    )}
                  </div>
                  <button disabled={!selectedImage} onClick={generateVideo} className="w-full py-3 bg-indigo-600 hover:bg-indigo-500 disabled:bg-slate-800 disabled:text-slate-600 text-white rounded-xl font-bold text-sm transition-all shadow-xl flex items-center justify-center space-x-2">
                    <Play size={16} fill="currentColor" />
                    <span>Animate Image with Veo</span>
                  </button>
                </div>
              )}
              {state.videoState.isGenerating && (
                <div className="text-center py-20 space-y-6 animate-in fade-in duration-500">
                  <Loader2 className="animate-spin text-indigo-500 mx-auto" size={48} />
                  <p className="text-sm font-bold text-white">{state.videoState.statusMessage}</p>
                </div>
              )}
              {state.videoState.videoUrl && (
                <div className="space-y-4 animate-in zoom-in-95 duration-300">
                  <video src={state.videoState.videoUrl} controls autoPlay loop className="rounded-xl overflow-hidden w-full aspect-video" />
                  <a href={state.videoState.videoUrl} download className="w-full py-2 bg-indigo-600 rounded-lg text-xs font-bold text-white flex items-center justify-center space-x-2">
                    <Download size={14} /> <span>Download MP4</span>
                  </a>
                </div>
              )}
            </div>
          </div>
        )}

        {state.activeTab === 'research' && (
          <div className="p-6 space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
            {state.isResearching ? (
              <div className="text-center py-20 space-y-4"><Loader2 className="animate-spin h-10 w-10 text-indigo-500 mx-auto" /><p className="text-sm text-slate-400">Deep-diving into company data...</p></div>
            ) : state.companyInfo ? (
              <div className="space-y-6">
                <div className="flex items-center space-x-3 mb-2">
                  <Building2 size={20} className="text-indigo-400" />
                  <div><h2 className="text-lg font-bold text-white leading-tight">{state.companyInfo.name}</h2></div>
                </div>
                <section className="bg-white/5 p-4 rounded-xl border border-white/5">
                  <h4 className="text-[10px] text-slate-500 font-bold uppercase mb-2">Core Mission</h4>
                  <p className="text-xs italic text-slate-300">"{state.companyInfo.mission}"</p>
                </section>
              </div>
            ) : (
              <div className="text-center py-20"><Globe size={40} className="mx-auto text-slate-800 mb-4" /><p className="text-sm text-slate-500 mb-4">Enable Company Intel to auto-generate personalized answer hooks.</p></div>
            )}
          </div>
        )}

        {state.activeTab === 'vault' && (
          <div className="p-6 text-center py-20">
             <Database size={40} className="mx-auto text-slate-800 mb-4" />
             <p className="text-sm text-slate-400 mb-6">Your data is locally encrypted.</p>
             <div className="bg-white/5 p-3 rounded-lg text-left border border-white/5 flex items-center justify-between">
                <FileText size={16} className="text-indigo-400" />
                <span className="text-xs font-semibold flex-1 ml-3">Master Resume v2.pdf</span>
                <CheckCircle size={14} className="text-emerald-500" />
             </div>
          </div>
        )}
      </div>

      <div className="p-4 bg-slate-950/80 border-t border-white/5 flex items-center justify-between">
        <div className="flex items-center space-x-2 text-[10px] font-bold text-slate-500">
          <ShieldCheck size={12} className="text-emerald-500" />
          <span>PRIVATE MODE ACTIVE</span>
        </div>
        <span className="text-[10px] text-slate-600">v1.3.0-stable</span>
      </div>
    </div>
  );
};

export default Sidebar;
