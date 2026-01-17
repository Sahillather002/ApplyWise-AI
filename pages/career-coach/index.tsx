
import React, { useState, useRef, useEffect } from 'react';
import { Mic, StopCircle, Play, Info, Award, Brain, BarChart, ChevronRight, Loader2, MessageSquare, ShieldCheck, Sparkles } from 'lucide-react';
import { GoogleGenAI, Modality } from "@google/genai";
import { geminiService } from '../../services/geminiService';
import { UserProfile } from '../../types';

interface CareerCoachPageProps {
  profile: UserProfile;
}

const CareerCoachPage: React.FC<CareerCoachPageProps> = ({ profile }) => {
  const [isActive, setIsActive] = useState(false);
  const [transcription, setTranscription] = useState<string[]>([]);
  const [diagnostic, setDiagnostic] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  
  const sessionRef = useRef<any>(null);
  const audioContextInRef = useRef<AudioContext | null>(null);
  const audioContextOutRef = useRef<AudioContext | null>(null);
  const nextStartTimeRef = useRef(0);
  const sourcesRef = useRef<Set<AudioBufferSourceNode>>(new Set());

  // Visualizer refs
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const analyzerRef = useRef<AnalyserNode | null>(null);

  const startSession = async () => {
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      setIsActive(true);
      setTranscription(["System: Establishing neural link with Zephyr..."]);
      setDiagnostic(null);

      audioContextInRef.current = new AudioContext({ sampleRate: 16000 });
      audioContextOutRef.current = new AudioContext({ sampleRate: 24000 });
      
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const sourceNode = audioContextInRef.current.createMediaStreamSource(stream);
      
      // Setup Visualizer
      const analyzer = audioContextInRef.current.createAnalyser();
      analyzer.fftSize = 256;
      sourceNode.connect(analyzer);
      analyzerRef.current = analyzer;
      drawWaveform();

      const sessionPromise = ai.live.connect({
        model: 'gemini-2.5-flash-native-audio-preview-12-2025',
        callbacks: {
          onopen: () => {
            setTranscription(prev => [...prev, "Zephyr: Ready for the technical interview. Please state the role you're targeting."]);
            const scriptProcessor = audioContextInRef.current!.createScriptProcessor(4096, 1, 1);
            scriptProcessor.onaudioprocess = (e) => {
              const inputData = e.inputBuffer.getChannelData(0);
              const int16 = new Int16Array(inputData.length);
              for (let i = 0; i < inputData.length; i++) int16[i] = inputData[i] * 32768;
              const base64 = btoa(String.fromCharCode(...new Uint8Array(int16.buffer)));
              sessionPromise.then(session => session.sendRealtimeInput({ media: { data: base64, mimeType: 'audio/pcm;rate=16000' } }));
            };
            sourceNode.connect(scriptProcessor);
            scriptProcessor.connect(audioContextInRef.current!.destination);
          },
          onmessage: async (message) => {
            const audioData = message.serverContent?.modelTurn?.parts[0]?.inlineData?.data;
            if (audioData) {
              const outCtx = audioContextOutRef.current!;
              const binary = atob(audioData);
              const bytes = new Uint8Array(binary.length);
              for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
              
              const dataInt16 = new Int16Array(bytes.buffer);
              const buffer = outCtx.createBuffer(1, dataInt16.length, 24000);
              const channelData = buffer.getChannelData(0);
              for (let i = 0; i < dataInt16.length; i++) channelData[i] = dataInt16[i] / 32768.0;

              nextStartTimeRef.current = Math.max(nextStartTimeRef.current, outCtx.currentTime);
              const source = outCtx.createBufferSource();
              source.buffer = buffer;
              source.connect(outCtx.destination);
              source.start(nextStartTimeRef.current);
              nextStartTimeRef.current += buffer.duration;
              sourcesRef.current.add(source);
            }
            if (message.serverContent?.outputTranscription) {
              setTranscription(prev => [...prev, `Zephyr: ${message.serverContent?.outputTranscription?.text}`]);
            }
            if (message.serverContent?.inputTranscription) {
              setTranscription(prev => [...prev, `You: ${message.serverContent?.inputTranscription?.text}`]);
            }
          },
          onclose: () => setIsActive(false),
          onerror: (e) => console.error(e)
        },
        config: {
          responseModalities: [Modality.AUDIO],
          speechConfig: { voiceConfig: { prebuiltVoiceConfig: { voiceName: 'Zephyr' } } },
          inputAudioTranscription: {},
          outputAudioTranscription: {},
          systemInstruction: `You are Zephyr, an Elite Technical Recruiter. User: ${JSON.stringify(profile)}. Start with a warm but professional greeting.`
        }
      });
      sessionRef.current = await sessionPromise;
    } catch (e) {
      console.error(e);
      setIsActive(false);
    }
  };

  const stopSession = async () => {
    sessionRef.current?.close();
    audioContextInRef.current?.close();
    audioContextOutRef.current?.close();
    setIsActive(false);
    setIsAnalyzing(true);
    
    try {
      const diag = await geminiService.generateInterviewDiagnostic(transcription, profile);
      setDiagnostic(diag);
    } catch (e) {
      console.error(e);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const drawWaveform = () => {
    if (!canvasRef.current || !analyzerRef.current) return;
    const ctx = canvasRef.current.getContext('2d')!;
    const bufferLength = analyzerRef.current.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);

    const renderFrame = () => {
      if (!isActive) return;
      requestAnimationFrame(renderFrame);
      analyzerRef.current!.getByteFrequencyData(dataArray);

      ctx.clearRect(0, 0, canvasRef.current!.width, canvasRef.current!.height);
      const barWidth = (canvasRef.current!.width / bufferLength) * 2.5;
      let x = 0;

      for (let i = 0; i < bufferLength; i++) {
        const barHeight = dataArray[i] / 2;
        ctx.fillStyle = `rgba(99, 102, 241, ${dataArray[i] / 255})`;
        ctx.fillRect(x, canvasRef.current!.height - barHeight, barWidth, barHeight);
        x += barWidth + 1;
      }
    };
    renderFrame();
  };

  return (
    <div className="flex-1 h-full bg-slate-950 flex flex-col items-center p-8 overflow-y-auto custom-scrollbar">
      <header className="w-full max-w-5xl mb-12 flex justify-between items-end">
        <div>
          <div className="flex items-center space-x-2 px-4 py-2 bg-indigo-500/10 rounded-full mb-4 w-fit">
            <ShieldCheck size={14} className="text-indigo-400" />
            <span className="text-[10px] font-black text-indigo-400 uppercase tracking-widest">Biometric Encrypted Session</span>
          </div>
          <h1 className="text-5xl font-black text-white tracking-tighter italic uppercase flex items-center">
            <Brain size={48} className="mr-4 text-indigo-500" />
            Interview Hub
          </h1>
        </div>
        {!isActive && !diagnostic && (
          <button 
            onClick={startSession}
            className="px-10 py-5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-3xl font-black uppercase tracking-widest shadow-2xl shadow-indigo-500/20 transition-all flex items-center space-x-3"
          >
            <Mic size={20} />
            <span>Enter Studio</span>
          </button>
        )}
      </header>

      <div className="w-full max-w-6xl grid grid-cols-12 gap-8 flex-1">
        {/* Main Stage */}
        <div className="col-span-12 lg:col-span-8 space-y-8">
          <div className="aspect-video bg-slate-900 rounded-[3rem] border border-white/5 relative flex flex-col items-center justify-center shadow-2xl overflow-hidden group">
            {isActive ? (
              <>
                <div className="absolute inset-0 bg-gradient-to-t from-indigo-500/10 via-transparent to-transparent animate-pulse" />
                <canvas ref={canvasRef} width={800} height={200} className="w-3/4 opacity-50" />
                <div className="mt-8 flex flex-col items-center space-y-4">
                  <div className="w-24 h-24 bg-indigo-600 rounded-full flex items-center justify-center text-white animate-bounce shadow-[0_0_60px_rgba(79,70,229,0.5)]">
                    <Mic size={40} />
                  </div>
                  <p className="text-sm font-black text-indigo-400 uppercase tracking-[0.2em] animate-pulse">Live Link Active</p>
                </div>
                <button 
                  onClick={stopSession}
                  className="absolute bottom-12 px-8 py-3 bg-red-600 hover:bg-red-500 text-white rounded-2xl font-black uppercase tracking-widest transition-all shadow-xl shadow-red-500/20 flex items-center space-x-2"
                >
                  <StopCircle size={18} />
                  <span>End Interview</span>
                </button>
              </>
            ) : diagnostic ? (
              <div className="p-12 w-full h-full overflow-y-auto custom-scrollbar animate-in fade-in zoom-in-95 duration-500">
                <div className="flex items-center justify-between mb-8">
                  <h2 className="text-3xl font-black text-white uppercase italic flex items-center">
                    <BarChart size={28} className="mr-3 text-emerald-400" /> Performance Diagnostic
                  </h2>
                  <button onClick={() => setDiagnostic(null)} className="text-xs font-bold text-slate-500 hover:text-white uppercase tracking-widest">New Session</button>
                </div>
                <div className="prose prose-invert max-w-none prose-p:text-slate-400 prose-strong:text-emerald-400 prose-headings:text-indigo-400 whitespace-pre-wrap font-medium">
                   {diagnostic}
                </div>
              </div>
            ) : isAnalyzing ? (
              <div className="text-center space-y-4">
                <Loader2 className="animate-spin text-indigo-500 mx-auto" size={48} />
                <p className="text-lg font-black text-white animate-pulse uppercase tracking-widest">Synthesizing Diagnostic...</p>
              </div>
            ) : (
              <div className="text-center space-y-6">
                <div className="w-20 h-20 bg-slate-800 rounded-3xl flex items-center justify-center text-slate-600 mx-auto group-hover:bg-indigo-600/20 group-hover:text-indigo-400 transition-all">
                  <Play size={32} />
                </div>
                <div>
                  <p className="text-sm font-black text-slate-500 uppercase tracking-widest">Studio Idle</p>
                  <p className="text-xs text-slate-600 italic">Select your target role and click Enter Studio to begin.</p>
                </div>
              </div>
            )}
          </div>

          <div className="bg-slate-900/50 rounded-[2.5rem] p-8 border border-white/5">
             <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mb-6 flex items-center">
                <MessageSquare size={14} className="mr-2" /> Neural Transcription
             </h3>
             <div className="space-y-4 max-h-60 overflow-y-auto custom-scrollbar pr-4">
               {transcription.length === 0 && <p className="text-xs text-slate-700 italic">Session history will appear here...</p>}
               {transcription.map((line, i) => (
                 <div key={i} className={`flex ${line.startsWith('You:') ? 'justify-end' : 'justify-start'}`}>
                   <div className={`max-w-[80%] p-4 rounded-3xl text-xs font-medium leading-relaxed ${
                     line.startsWith('You:') ? 'bg-indigo-600 text-white' : 
                     line.startsWith('System:') ? 'bg-slate-800 text-slate-400 italic' : 
                     'bg-white/5 text-slate-300 border border-white/10'
                   }`}>
                     {line}
                   </div>
                 </div>
               ))}
             </div>
          </div>
        </div>

        {/* Sidebar Insights */}
        <div className="col-span-12 lg:col-span-4 space-y-8">
           <div className="p-8 bg-indigo-600 rounded-[2.5rem] text-white shadow-2xl shadow-indigo-500/20 relative overflow-hidden group">
              <Sparkles size={120} className="absolute -right-8 -bottom-8 opacity-10 group-hover:scale-125 transition-transform duration-1000" />
              <div className="relative z-10">
                <h3 className="text-xl font-black uppercase italic mb-4">Coach Zephyr</h3>
                <p className="text-sm text-indigo-100 leading-relaxed font-medium mb-6">
                  "I'll analyze your speech for technical confidence and cultural resonance. Speak clearly, I'm listening for data points."
                </p>
                <div className="space-y-3">
                   {['Adaptive Pacing', 'Technical Verification', 'Tone Analysis'].map((feat, i) => (
                     <div key={i} className="flex items-center space-x-2 text-[10px] font-black uppercase tracking-widest">
                       <Award size={14} className="text-indigo-300" />
                       <span>{feat}</span>
                     </div>
                   ))}
                </div>
              </div>
           </div>

           <div className="bg-slate-900 border border-white/5 rounded-[2.5rem] p-8">
              <h4 className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-6">Simulation Controls</h4>
              <div className="space-y-4">
                 <div className="p-4 bg-white/5 rounded-2xl border border-white/5 hover:bg-white/10 cursor-pointer transition-all">
                    <p className="text-[10px] font-black text-indigo-400 uppercase mb-1">Target Scenario</p>
                    <p className="text-sm font-bold text-white">Technical Deep Dive</p>
                 </div>
                 <div className="p-4 bg-white/5 rounded-2xl border border-white/5 hover:bg-white/10 cursor-pointer transition-all">
                    <p className="text-[10px] font-black text-indigo-400 uppercase mb-1">Difficulty Level</p>
                    <p className="text-sm font-bold text-white">Senior Staff Eng</p>
                 </div>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
};

export default CareerCoachPage;
