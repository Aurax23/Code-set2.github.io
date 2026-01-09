
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { generateWebsiteProposal, generateStrategyAudio } from '../services/gemini';
import { WebsiteProposal } from '../types';
import UserAuthModal from './UserAuthModal';
import { useUser } from '../App';

const AIPlanner: React.FC = () => {
  const navigate = useNavigate();
  const { setActiveProposal, currentUser, login } = useUser();
  const [prompt, setPrompt] = useState('');
  const [loading, setLoading] = useState(false);
  const [proposal, setProposal] = useState<WebsiteProposal | null>(null);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [audioLoading, setAudioLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt) return;
    setLoading(true);
    try {
      const result = await generateWebsiteProposal(prompt);
      setProposal(result);
      setActiveProposal(result);
    } catch (error) { console.error(error); } finally { setLoading(false); }
  };

  const playSummary = async () => {
    if (!proposal || audioLoading) return;
    setAudioLoading(true);
    try {
      const base64Audio = await generateStrategyAudio(proposal);
      const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
      const binary = atob(base64Audio);
      const len = binary.length;
      const bytes = new Uint8Array(len);
      for (let i = 0; i < len; i++) bytes[i] = binary.charCodeAt(i);
      
      const dataInt16 = new Int16Array(bytes.buffer);
      const buffer = audioCtx.createBuffer(1, dataInt16.length, 24000);
      const channelData = buffer.getChannelData(0);
      for (let i = 0; i < dataInt16.length; i++) channelData[i] = dataInt16[i] / 32768.0;

      const source = audioCtx.createBufferSource();
      source.buffer = buffer;
      source.connect(audioCtx.destination);
      source.start();
    } catch (e) { console.error(e); } finally { setAudioLoading(false); }
  };

  return (
    <div className="py-24 px-8 max-w-6xl mx-auto min-h-screen">
      <div className="text-center mb-20">
        <h1 className="text-6xl font-black text-black mb-8 tracking-tighter uppercase">The Architect Engine</h1>
        <p className="text-xl text-slate-500 max-w-2xl mx-auto font-medium">Synthesize structural strategy, technical roadmaps, and global market insights in real-time.</p>
      </div>

      <div className="bg-white p-1 rounded-[3rem] shadow-2xl border border-slate-100 mb-24 overflow-hidden">
        <form onSubmit={handleSubmit} className="p-10 md:p-14 space-y-10 bg-gradient-to-b from-blue-50/30 to-white rounded-[2.8rem]">
          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="A premium boutique brand for European collectors..."
            className="w-full h-48 p-8 rounded-[2rem] border border-slate-200 focus:ring-8 focus:ring-blue-500/5 focus:border-blue-600 outline-none transition-all text-xl font-medium"
          />
          <button type="submit" disabled={loading} className="w-full bg-black text-white py-8 rounded-[2rem] font-black text-xl uppercase tracking-widest hover:bg-blue-600 transition-all flex items-center justify-center gap-6 shadow-2xl">
            {loading ? "Analyzing Strategy..." : "Generate Digital Roadmap"}
          </button>
        </form>
      </div>

      {proposal && (
        <div className="animate-slide-up space-y-16">
          <div className="bg-white rounded-[4rem] overflow-hidden shadow-2xl border border-slate-100">
            <div className="bg-black p-16 text-white relative flex flex-col md:flex-row justify-between items-start md:items-end gap-10">
              <div>
                <h2 className="text-5xl font-black mb-4 tracking-tighter">{proposal.businessName}</h2>
                <p className="text-blue-500 font-black uppercase tracking-[0.4em] text-xs">Architectural Blueprint • v2.0</p>
              </div>
              <button 
                onClick={playSummary} 
                disabled={audioLoading}
                className="bg-blue-600 hover:bg-blue-500 px-8 py-4 rounded-2xl font-black text-xs uppercase tracking-widest transition-all flex items-center gap-3"
              >
                {audioLoading ? "Synthesizing Audio..." : "Play Summary Audio"}
              </button>
            </div>
            <div className="p-16 space-y-16">
              <section className="bg-blue-50/50 p-10 rounded-[3rem] border border-blue-100/50">
                <h3 className="text-[10px] font-black uppercase tracking-[0.4em] text-blue-600 mb-6">Market Intel Grounding</h3>
                <p className="text-slate-700 leading-relaxed font-semibold italic text-lg">"{proposal.marketInsights}"</p>
              </section>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
                <div>
                   <h3 className="text-[10px] font-black uppercase tracking-[0.4em] text-blue-600 mb-8 border-b pb-3">Strategic Insight</h3>
                   <div className="space-y-6">
                     <p><strong>Audience:</strong> {proposal.targetAudience}</p>
                     <p><strong>Tone:</strong> {proposal.suggestedStyle}</p>
                   </div>
                </div>
                <div>
                   <h3 className="text-[10px] font-black uppercase tracking-[0.4em] text-blue-600 mb-8 border-b pb-3">Sitemap</h3>
                   <div className="space-y-4">
                     {proposal.pages.map((p, i) => (
                       <div key={i} className="flex items-center gap-4">
                         <div className="w-2 h-2 rounded-full bg-blue-600"></div>
                         <span className="font-bold">{p.title}</span>
                       </div>
                     ))}
                   </div>
                </div>
              </div>
              <button onClick={() => navigate(currentUser ? '/developer' : '/developer')} className="w-full bg-black text-white py-8 rounded-[2rem] font-black text-xl uppercase tracking-widest shadow-2xl">Deploy Production Instance</button>
            </div>
          </div>
        </div>
      )}

      {showAuthModal && (
        <UserAuthModal onSuccess={(email) => { login(email); setShowAuthModal(false); navigate('/developer'); }} onClose={() => setShowAuthModal(false)} />
      )}
    </div>
  );
};

export default AIPlanner;
