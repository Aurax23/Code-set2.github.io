
import React from 'react';
import { Link, useLocation } from 'react-router-dom';

interface NavbarProps {
  isAuthenticated: boolean;
  currentUser: { email: string } | null;
  onLogout: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ isAuthenticated, currentUser, onLogout }) => {
  const location = useLocation();
  const isActive = (path: string) => location.pathname === path;

  return (
    <nav className="sticky top-0 z-[100] glass-nav py-5">
      <div className="max-w-7xl mx-auto px-8">
        <div className="flex justify-between items-center">
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-11 h-11 bg-black rounded-xl flex items-center justify-center text-white font-black text-xl transition-all group-hover:bg-blue-600 group-hover:scale-105 shadow-xl shadow-black/10">CS</div>
            <span className="text-2xl font-black tracking-tighter text-black uppercase">
              Code-Set
            </span>
          </Link>
          
          <div className="hidden md:flex items-center bg-slate-100/60 p-1.5 rounded-2xl gap-1">
            <Link 
              to="/" 
              className={`px-6 py-2 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${isActive('/') ? 'bg-white text-black shadow-sm' : 'text-slate-500 hover:text-black'}`}
            >
              Home
            </Link>
            <Link 
              to="/planner" 
              className={`px-6 py-2 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${isActive('/planner') ? 'bg-white text-black shadow-sm' : 'text-slate-400 hover:text-black'}`}
            >
              Architect
            </Link>
            <Link 
              to="/portfolio" 
              className={`px-6 py-2 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${isActive('/portfolio') ? 'bg-white text-black shadow-sm' : 'text-slate-400 hover:text-black'}`}
            >
              Showcase
            </Link>
          </div>

          <div className="flex items-center gap-6">
            {currentUser ? (
              <div className="flex items-center gap-6">
                <div className="hidden lg:flex flex-col items-end">
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none">Authenticated</span>
                  <span className="text-xs font-bold text-black">{currentUser.email}</span>
                </div>
                <button 
                  onClick={onLogout}
                  className="text-xs font-black text-rose-500 hover:text-rose-600 uppercase tracking-widest"
                >
                  Sign Out
                </button>
              </div>
            ) : (
              <Link 
                to="/login" 
                className="text-xs font-black text-slate-400 hover:text-black uppercase tracking-widest"
              >
                Admin
              </Link>
            )}
            <Link 
              to="/planner" 
              className="bg-black text-white px-7 py-3 rounded-xl text-xs font-black uppercase tracking-widest hover:bg-blue-600 transition-all shadow-xl shadow-black/5 active:scale-95"
            >
              Deploy Project
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
