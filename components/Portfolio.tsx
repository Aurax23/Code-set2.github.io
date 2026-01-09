
import React, { useState } from 'react';

const projects = [
  {
    id: 1,
    title: "EcoFlow Energy",
    category: "Corporate",
    image: "https://images.unsplash.com/photo-1497215728101-856f4ea42174?q=80&w=2340&auto=format&fit=crop",
    tags: ["React", "Clean Tech", "Enterprise"]
  },
  {
    id: 2,
    title: "Veloce Watches",
    category: "E-Commerce",
    image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=80&w=2198&auto=format&fit=crop",
    tags: ["Headless Commerce", "Luxury", "UI Design"]
  },
  {
    id: 3,
    title: "The Urban Pantry",
    category: "Hospitality",
    image: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?q=80&w=2340&auto=format&fit=crop",
    tags: ["Reservation Engine", "SVG Animation"]
  },
  {
    id: 4,
    title: "Pixel Labs",
    category: "Creative Agency",
    image: "https://images.unsplash.com/photo-1558655146-d09347e92766?q=80&w=2328&auto=format&fit=crop",
    tags: ["GLSL Shaders", "GSAP"]
  },
  {
    id: 5,
    title: "SecureNet VPN",
    category: "SaaS",
    image: "https://images.unsplash.com/photo-1563986768609-322da13575f3?q=80&w=2340&auto=format&fit=crop",
    tags: ["Security Suite", "Node.js"]
  },
  {
    id: 6,
    title: "Aurora Skincare",
    category: "Health & Beauty",
    image: "https://images.unsplash.com/photo-1556228720-195a672e8a03?q=80&w=2187&auto=format&fit=crop",
    tags: ["Branding", "Direct-to-Consumer"]
  }
];

const Portfolio: React.FC = () => {
  const [filter, setFilter] = useState('All');
  const categories = ['All', 'Corporate', 'E-Commerce', 'Hospitality', 'SaaS', 'Health & Beauty'];

  const filteredProjects = filter === 'All' 
    ? projects 
    : projects.filter(p => p.category === filter);

  return (
    <div className="py-24 px-6 max-w-7xl mx-auto min-h-screen">
      <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-10">
        <div className="max-w-xl animate-fade-in">
          <span className="text-indigo-600 font-black uppercase tracking-[0.3em] text-[10px] mb-4 block">Selected Works</span>
          <h1 className="text-5xl md:text-6xl font-black text-slate-900 mb-6 tracking-tight leading-tight">Digital artifacts <br/>worth remembering.</h1>
          <p className="text-lg text-slate-500 font-medium">A collection of technical excellence and brand storytelling through code.</p>
        </div>
        
        <div className="flex flex-wrap gap-2 animate-fade-in" style={{animationDelay: '0.1s'}}>
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setFilter(cat)}
              className={`px-6 py-3 rounded-2xl text-xs font-black uppercase tracking-widest transition-all ${
                filter === cat 
                ? 'bg-slate-900 text-white shadow-xl shadow-slate-900/10' 
                : 'bg-white text-slate-400 border border-slate-100 hover:border-slate-300'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
        {filteredProjects.map((project, idx) => (
          <div 
            key={project.id} 
            className="group premium-card rounded-[2.5rem] overflow-hidden animate-fade-in"
            style={{animationDelay: `${idx * 0.05}s`}}
          >
            <div className="relative aspect-[4/5] overflow-hidden">
              <img 
                src={project.image} 
                alt={project.title} 
                className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700 ease-out group-hover:scale-110" 
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent opacity-0 group-hover:opacity-60 transition-opacity"></div>
              <div className="absolute bottom-0 left-0 p-8 transform translate-y-4 group-hover:translate-y-0 opacity-0 group-hover:opacity-100 transition-all delay-75">
                <button className="bg-white text-slate-900 px-6 py-3 rounded-xl font-black text-xs uppercase tracking-widest shadow-xl">Case Study</button>
              </div>
            </div>
            <div className="p-8">
              <div className="flex justify-between items-start mb-4">
                <div>
                   <span className="text-[10px] font-black text-indigo-500 uppercase tracking-widest block mb-1">{project.category}</span>
                   <h3 className="text-2xl font-black text-slate-900 tracking-tight leading-none">{project.title}</h3>
                </div>
                <div className="w-10 h-10 rounded-full border border-slate-100 flex items-center justify-center text-slate-400 group-hover:bg-slate-900 group-hover:text-white group-hover:border-slate-900 transition-all">
                   <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M14 5l7 7m0 0l-7 7m7-7H3"></path></svg>
                </div>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {project.tags.map((tag) => (
                  <span key={tag} className="text-[9px] font-black text-slate-400 bg-slate-50 px-2.5 py-1 rounded-lg uppercase tracking-tighter">
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Portfolio;
