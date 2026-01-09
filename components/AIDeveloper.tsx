
import React, { useState, useEffect, useRef } from 'react';
import { GoogleGenAI, LiveServerMessage, Modality } from "@google/genai";
import { iterateWebsiteCode, generateBrandAsset, startLaunchVideoGeneration } from '../services/gemini';
import { useUser } from '../App';

interface BuildFile { name: string; content: string; language: string; }
interface Commit { id: string; message: string; timestamp: number; files: BuildFile[]; previewHtml: string; }

const STORAGE_KEY = 'codeset_active_project';

const AIDeveloper: React.FC = () => {
  const { activeProposal: proposal, setActiveProposal } = useUser();
  const [status, setStatus] = useState<'idle' | 'generating' | 'completed' | 'editing'>('idle');
  const [activeTab, setActiveTab] = useState<'source' | 'assets' | 'consultant' | 'launch'>('source');
  const [view, setView] = useState<'code' | 'preview'>('code');
  const [files, setFiles] = useState<BuildFile[]>([]);
  const [activeFileIndex, setActiveFileIndex] = useState(0);
  const [previewHtml, setPreviewHtml] = useState<string>('');
  const [logs, setLogs] = useState<string[]>([]);
  const [assetPrompt, setAssetPrompt] = useState('');
  const [assets, setAssets] = useState<string[]>([]);
  const [isConsulting, setIsConsulting] = useState(false);
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [videoLoading, setVideoLoading] = useState(false);

  const editorRef = useRef<HTMLTextAreaElement>(null);
  const preRef = useRef<HTMLPreElement>(null);
  const logEndRef = useRef<HTMLDivElement>(null);
  const audioSources = useRef<Set<AudioBufferSourceNode>>(new Set());

  useEffect(() => {
    if (proposal && status === 'idle' && files.length === 0) startBuilding();
  }, [proposal]);

  useEffect(() => {
    logEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [logs]);

  const addLog = (msg: string) => setLogs(prev => [...prev, `[${new Date().toLocaleTimeString()}] ${msg}`]);

  const startBuilding = async () => {
    if (!proposal) return;
    setStatus('generating');
    addLog(`Engine: Initializing Autonomous Builder for ${proposal.businessName}...`);
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });
      const prompt = `Lead architect Code-Set. Generate modern site for ${proposal.businessName}. Return 4 files in JSON: App.tsx, Home.tsx, global.css, preview.html.`;
      const response = await ai.models.generateContent({ model: "gemini-3-pro-preview", contents: prompt, config: { responseMimeType: "application/json" } });
      const result = JSON.parse(response.text || '{"files": []}');
      const mainFiles = result.files.filter((f: any) => f.name !== 'preview.html');
      setFiles(mainFiles);
      setPreviewHtml(result.files.find((f: any) => f.name === 'preview.html')?.content || '');
      addLog("Success: Build logic verified. Site live.");
      setStatus('completed');
    } catch (e) { addLog("Error: Build failed."); setStatus('completed'); }
  };

  const handleGenerateAsset = async () => {
    if (!assetPrompt) return;
    addLog(`Assets: Requesting brand visual for "${assetPrompt}"...`);
    const url = await generateBrandAsset(assetPrompt);
    if (url) {
      setAssets(prev => [url, ...prev]);
      addLog("Assets: Visual identity synthesized.");
    }
  };

  const startConsultation = async () => {
    if (isConsulting) return;
    setIsConsulting(true);
    addLog("Consultant: Opening Live native audio session...");
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });
    const outputCtx = new AudioContext({ sampleRate: 24000 });
    const inputCtx = new AudioContext({ sampleRate: 16000 });
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    
    let nextStartTime = 0;
    const sessionPromise = ai.live.connect({
      model: 'gemini-2.5-flash-native-audio-preview-12-2025',
      callbacks: {
        onopen: () => {
          const source = inputCtx.createMediaStreamSource(stream);
          const processor = inputCtx.createScriptProcessor(4096, 1, 1);
          processor.onaudioprocess = (e) => {
            const input = e.inputBuffer.getChannelData(0);
            const int16 = new Int16Array(input.length);
            for (let i = 0; i < input.length; i++) int16[i] = input[i] * 32768;
            sessionPromise.then(s => s.sendRealtimeInput({ media: { data: btoa(String.fromCharCode(...new Uint8Array(int16.buffer))), mimeType: 'audio/pcm;rate=16000' } }));
          };
          source.connect(processor);
          processor.connect(inputCtx.destination);
        },
        onmessage: async (msg: LiveServerMessage) => {
          const audio = msg.serverContent?.modelTurn?.parts[0]?.inlineData?.data;
          if (audio) {
            nextStartTime = Math.max(nextStartTime, outputCtx.currentTime);
            const binary = atob(audio);
            const bytes = new Uint8Array(binary.length);
            for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
            const dataInt16 = new Int16Array(bytes.buffer);
            const buffer = outputCtx.createBuffer(1, dataInt16.length, 24000);
            const channelData = buffer.getChannelData(0);
            for (let i = 0; i < dataInt16.length; i++) channelData[i] = dataInt16[i] / 32768.0;
            const source = outputCtx.createBufferSource();
            source.buffer = buffer;
            source.connect(outputCtx.destination);
            source.start(nextStartTime);
            nextStartTime += buffer.duration;
            audioSources.current.add(source);
          }
        },
        onclose: () => setIsConsulting(false),
        onerror: () => setIsConsulting(false),
      },
      config: {
        responseModalities: [Modality.AUDIO],
        systemInstruction: `You are the Lead Architect at Code-Set. You are discussing the project "${proposal?.businessName}" with the lead engineer. Be technical, helpful, and innovative.`
      }
    });
  };

  const handleGenerateLaunchVideo = async () => {
    if (!window.aistudio.hasSelectedApiKey()) {
      await window.aistudio.openSelectKey();
    }
    setVideoLoading(true);
    addLog("Launch: Initiating Veo 3.1 high-quality video generation...");
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });
      let op = await startLaunchVideoGeneration(`${proposal?.businessName} branding video`);
      while (!op.done) {
        await new Promise(r => setTimeout(r, 5000));
        op = await ai.operations.getVideosOperation({ operation: op });
      }
      const uri = op.response?.generatedVideos?.[0]?.video?.uri;
      const res = await fetch(`${uri}&key=${process.env.API_KEY}`);
      const blob = await res.blob();
      setVideoUrl(URL.createObjectURL(blob));
      addLog("Launch: Professional brand video synthesized.");
    } catch (e) { addLog("Launch: Error generating video."); } finally { setVideoLoading(false); }
  };

  return (
    <div className="py-20 px-8 max-w-7xl mx-auto min-h-screen">
      <div className="flex justify-between items-end mb-14">
        <div>
          <span className="text-blue-600 font-black uppercase tracking-[0.4em] text-[9px] block mb-2">Autonomous Studio</span>
          <h1 className="text-5xl font-black text-black tracking-tighter uppercase">{proposal?.businessName || 'Active Module'}</h1>
        </div>
        <div className="flex bg-slate-100 p-1.5 rounded-2xl gap-1 border">
          {['source', 'assets', 'consultant', 'launch'].map(tab => (
            <button key={tab} onClick={() => setActiveTab(tab as any)} className={`px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === tab ? 'bg-white text-black shadow-lg' : 'text-slate-400'}`}>{tab}</button>
          ))}
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        <div className="lg:w-1/3 flex flex-col gap-8">
          {activeTab === 'source' && (
            <div className="bg-black rounded-[2.5rem] h-[400px] flex flex-col overflow-hidden shadow-2xl">
               <div className="p-6 border-b border-white/5 bg-slate-900 flex justify-between">
                  <span className="text-[9px] font-black text-slate-500 uppercase">system_vcs</span>
                  <div className="flex gap-1.5"><div className="w-2 h-2 rounded-full bg-rose-500/50"></div><div className="w-2 h-2 rounded-full bg-emerald-500/50"></div></div>
               </div>
               <div className="p-8 overflow-y-auto font-mono text-[11px] text-slate-400 space-y-4 flex-grow">
                 {logs.map((l, i) => <div key={i}><span className="text-blue-500/50">root:</span> {l}</div>)}
                 <div ref={logEndRef}></div>
               </div>
            </div>
          )}

          {activeTab === 'assets' && (
            <div className="bg-white p-10 rounded-[2.5rem] shadow-xl border border-slate-100 flex flex-col gap-6">
               <h3 className="font-black uppercase tracking-widest text-[10px] text-blue-600">Brand Asset Synthesis</h3>
               <textarea value={assetPrompt} onChange={e => setAssetPrompt(e.target.value)} placeholder="Hero background, abstract glass textures..." className="w-full h-32 bg-slate-50 border p-5 rounded-2xl text-xs font-bold outline-none" />
               <button onClick={handleGenerateAsset} className="bg-black text-white py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-blue-600 transition-all shadow-xl">Synthesize Image</button>
               <div className="grid grid-cols-2 gap-4 max-h-[200px] overflow-y-auto">
                 {assets.map((a, i) => <img key={i} src={a} className="rounded-xl border shadow-sm aspect-square object-cover" />)}
               </div>
            </div>
          )}

          {activeTab === 'consultant' && (
            <div className="bg-slate-900 p-10 rounded-[2.5rem] shadow-xl border border-white/5 flex flex-col items-center text-center gap-8">
               <div className={`w-20 h-20 rounded-full border-4 ${isConsulting ? 'border-blue-500 animate-pulse' : 'border-white/10'} flex items-center justify-center`}>
                 <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" /></svg>
               </div>
               <div>
                 <h3 className="text-white font-black text-xl mb-2">Live AI Consultant</h3>
                 <p className="text-slate-400 text-xs font-medium px-4 leading-relaxed">Discuss technical architecture, UI refinements, and brand direction in real-time voice.</p>
               </div>
               <button onClick={startConsultation} disabled={isConsulting} className={`w-full py-5 rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all ${isConsulting ? 'bg-blue-600 text-white' : 'bg-white text-black hover:bg-blue-600 hover:text-white'}`}>
                 {isConsulting ? 'Live Session Active' : 'Start Voice Consultation'}
               </button>
            </div>
          )}

          {activeTab === 'launch' && (
            <div className="bg-indigo-600 p-10 rounded-[2.5rem] shadow-xl text-white flex flex-col gap-6">
               <h3 className="font-black uppercase tracking-widest text-[10px]">Veo Cinema Studio</h3>
               {videoUrl ? (
                 <video src={videoUrl} controls className="rounded-2xl border-4 border-white/20 shadow-2xl" />
               ) : (
                 <div className="aspect-video bg-black/20 rounded-2xl flex items-center justify-center border-2 border-dashed border-white/30">
                   {videoLoading ? <div className="animate-spin w-10 h-10 border-4 border-white border-t-transparent rounded-full"></div> : <span className="text-[10px] uppercase font-black opacity-50">Studio Ready</span>}
                 </div>
               )}
               <button onClick={handleGenerateLaunchVideo} disabled={videoLoading} className="bg-white text-indigo-600 py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-indigo-50 transition-all shadow-xl">
                 {videoLoading ? 'Rendering Cinema...' : 'Generate Launch Video'}
               </button>
            </div>
          )}
        </div>

        <div className="lg:w-2/3 flex flex-col">
          <div className="rounded-[3rem] border shadow-2xl overflow-hidden min-h-[700px] flex flex-col bg-white">
            <div className="px-8 py-5 border-b flex justify-between items-center bg-slate-50">
               <div className="flex bg-slate-200 p-1 rounded-xl">
                 <button onClick={() => setView('code')} className={`px-5 py-2 rounded-lg text-[9px] font-black uppercase tracking-widest ${view === 'code' ? 'bg-white text-black' : 'text-slate-500'}`}>Source</button>
                 <button onClick={() => setView('preview')} className={`px-5 py-2 rounded-lg text-[9px] font-black uppercase tracking-widest ${view === 'preview' ? 'bg-white text-black' : 'text-slate-500'}`}>Preview</button>
               </div>
               <div className="flex gap-4">
                 <button onClick={startBuilding} className="p-2 text-slate-400 hover:text-black transition-colors"><svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg></button>
                 <button onClick={() => window.open("", "_blank")?.document.write(previewHtml)} className="bg-black text-white px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest">Deploy Live</button>
               </div>
            </div>
            {view === 'code' ? (
              <div className="flex-grow flex flex-col">
                <div className="flex border-b overflow-x-auto bg-slate-50 px-4">
                  {files.map((f, i) => (
                    <button key={i} onClick={() => setActiveFileIndex(i)} className={`px-6 py-4 text-[10px] font-black uppercase tracking-widest transition-all ${activeFileIndex === i ? 'border-b-2 border-blue-600 text-black bg-white' : 'text-slate-400 hover:text-slate-600'}`}>{f.name}</button>
                  ))}
                </div>
                <textarea spellCheck={false} value={files[activeFileIndex]?.content} onChange={e => {
                  const newFiles = [...files]; newFiles[activeFileIndex].content = e.target.value; setFiles(newFiles);
                }} className="flex-grow p-12 bg-transparent outline-none font-mono text-sm leading-relaxed resize-none" />
              </div>
            ) : (
              <div className="flex-grow bg-slate-100 p-12 overflow-hidden flex items-center justify-center">
                <iframe srcDoc={previewHtml} className="w-full h-full bg-white rounded-[2rem] shadow-2xl border-none" />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AIDeveloper;
