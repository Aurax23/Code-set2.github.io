
import React from 'react';
import { Link } from 'react-router-dom';

const Home: React.FC = () => {
  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative pt-40 pb-48 px-8 overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full hero-gradient pointer-events-none -z-10"></div>
        <div className="max-w-6xl mx-auto text-center animate-slide-up">
          <div className="inline-flex items-center gap-3 px-5 py-2.5 mb-10 text-[10px] font-black uppercase tracking-[0.3em] text-blue-600 bg-blue-50/50 rounded-full border border-blue-100/50 shadow-sm backdrop-blur-sm">
            <span className="w-2 h-2 rounded-full bg-blue-600 animate-pulse"></span>
            The Autonomous Web Agency
          </div>
          
          <h1 className="text-7xl md:text-9xl font-black text-black tracking-tighter mb-10 leading-[0.9]">
            Build. Deploy.<br/><span className="text-blue-600 italic">Scale.</span>
          </h1>
          
          <p className="text-xl md:text-2xl text-slate-500 mb-14 max-w-2xl mx-auto leading-relaxed font-medium">
            Code-Set is the world's first autonomous agency. We leverage specialized Gemini models to plan, design, and develop enterprise-grade digital ecosystems in real-time.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
            <Link 
              to="/planner" 
              className="group bg-black text-white px-12 py-6 rounded-2xl text-lg font-black uppercase tracking-widest hover:bg-blue-600 transition-all shadow-2xl shadow-black/20 flex items-center gap-4"
            >
              Start Architecting
              <svg className="w-5 h-5 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M14 5l7 7m0 0l-7 7m7-7H3"></path></svg>
            </Link>
            <Link 
              to="/portfolio" 
              className="text-black px-12 py-6 rounded-2xl text-lg font-black uppercase tracking-widest border-2 border-slate-100 hover:border-black transition-all"
            >
              The Repository
            </Link>
          </div>
        </div>
      </section>

      {/* Trust Bar */}
      <section className="py-16 border-y border-slate-100 bg-slate-50/30">
        <div className="max-w-7xl mx-auto px-8 overflow-hidden">
          <p className="text-center text-[9px] uppercase tracking-[0.4em] font-black text-slate-300 mb-12">Powering Next-Gen Founders</p>
          <div className="flex flex-wrap justify-center items-center gap-16 md:gap-32 opacity-30">
            {['SYNERGY', 'NEXUS', 'VECTOR', 'QUANTUM', 'VERTEX'].map(name => (
              <span key={name} className="text-2xl font-black tracking-widest text-black uppercase">{name}</span>
            ))}
          </div>
        </div>
      </section>

      {/* Feature Grid */}
      <section className="py-40 px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
            {[
              { 
                title: "Architectural AI", 
                desc: "Every project starts with a deep structural audit by our Planner agent.", 
                icon: "M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
              },
              { 
                title: "Autonomous Dev", 
                desc: "Zero boilerplate. Our Developer agent generates production code directly from strategy.", 
                icon: "M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"
              },
              { 
                title: "Infinite Iteration", 
                desc: "Talk to your codebase. Refine designs through a simple chat interface.", 
                icon: "M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
              }
            ].map((feat, i) => (
              <div key={i} className="premium-card p-12 rounded-[3rem]">
                <div className="w-16 h-16 bg-slate-50 rounded-[2rem] flex items-center justify-center text-blue-600 mb-10">
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d={feat.icon} />
                  </svg>
                </div>
                <h3 className="text-2xl font-black text-black mb-4 tracking-tight">{feat.title}</h3>
                <p className="text-slate-500 font-medium leading-relaxed">{feat.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Dark Section */}
      <section className="py-32 px-8 bg-black mx-8 rounded-[4rem] text-center relative overflow-hidden">
        <div className="absolute inset-0 bg-blue-600/5 blur-[120px] rounded-full transform -translate-y-1/2"></div>
        <div className="max-w-3xl mx-auto relative z-10">
          <h2 className="text-5xl md:text-7xl font-black text-white mb-10 tracking-tighter leading-none">The era of templates is over.</h2>
          <p className="text-xl text-slate-400 mb-14 font-medium">Build something that belongs to you. Join the elite founders using Code-Set to dominate their niche.</p>
          <Link 
            to="/planner" 
            className="inline-block bg-blue-600 text-white px-14 py-6 rounded-2xl font-black text-lg uppercase tracking-widest hover:bg-blue-500 transition-all shadow-2xl shadow-blue-600/20"
          >
            Launch My Project
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Home;
