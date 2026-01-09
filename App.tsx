
import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { HashRouter, Routes, Route, useLocation, Navigate, Link } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './components/Home';
import AIPlanner from './components/AIPlanner';
import Portfolio from './components/Portfolio';
import Dashboard from './components/Dashboard';
import Login from './components/Login';
import AIDeveloper from './components/AIDeveloper';
import { WebsiteProposal } from './types';

// --- Global Context ---
interface UserContextType {
  isAuthenticated: boolean;
  currentUser: { email: string } | null;
  activeProposal: WebsiteProposal | null;
  login: (email: string) => void;
  logout: () => void;
  setActiveProposal: (proposal: WebsiteProposal | null) => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) throw new Error("useUser must be used within a UserProvider");
  return context;
};

const UserProvider = ({ children }: { children?: ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentUser, setCurrentUser] = useState<{ email: string } | null>(null);
  const [activeProposal, setActiveProposal] = useState<WebsiteProposal | null>(null);

  const login = (email: string) => {
    setCurrentUser({ email });
    setIsAuthenticated(true);
  };

  const logout = () => {
    setIsAuthenticated(false);
    setCurrentUser(null);
  };

  return (
    <UserContext.Provider value={{ isAuthenticated, currentUser, activeProposal, login, logout, setActiveProposal }}>
      {children}
    </UserContext.Provider>
  );
};

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

const ProtectedRoute = ({ children }: { children?: ReactNode }) => {
  const { currentUser } = useUser();
  return currentUser ? <>{children}</> : <Navigate to="/planner" replace />;
};

function AppContent() {
  const { isAuthenticated, currentUser, logout } = useUser();

  return (
    <div className="min-h-screen flex flex-col selection:bg-blue-100 selection:text-blue-600">
      <Navbar 
        isAuthenticated={isAuthenticated} 
        currentUser={currentUser}
        onLogout={logout} 
      />
      <main className="flex-grow">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/planner" element={<AIPlanner />} />
          <Route path="/portfolio" element={<Portfolio />} />
          <Route 
            path="/developer" 
            element={<ProtectedRoute><AIDeveloper /></ProtectedRoute>} 
          />
          <Route 
            path="/dashboard" 
            element={isAuthenticated ? <Dashboard /> : <Navigate to="/login" replace />} 
          />
          <Route 
            path="/login" 
            element={isAuthenticated ? <Navigate to="/dashboard" replace /> : <Login />} 
          />
        </Routes>
      </main>
      
      <footer className="bg-black text-slate-500 py-24 px-8 mt-32 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-blue-600/5 rounded-full blur-[120px] -mr-32 -mt-32"></div>
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-12 gap-20 relative z-10">
          <div className="md:col-span-6">
            <Link to="/" className="flex items-center gap-4 mb-10 group">
              <div className="w-12 h-12 bg-white text-black rounded-xl flex items-center justify-center font-black text-2xl shadow-2xl shadow-white/10 group-hover:bg-blue-600 group-hover:text-white transition-colors">CS</div>
              <span className="text-3xl font-black tracking-tighter text-white uppercase">Code-Set</span>
            </Link>
            <p className="text-xl leading-relaxed mb-12 max-w-md font-medium text-slate-400">
              The era of slow development is over. Code-Set is the autonomous ecosystem for elite digital products.
            </p>
          </div>
          
          <div className="md:col-span-2">
            <h4 className="text-white font-black mb-8 text-[10px] uppercase tracking-[0.3em]">Agency</h4>
            <ul className="space-y-5 text-sm font-bold">
              <li><Link to="/planner" className="hover:text-blue-500 transition-colors">Architect</Link></li>
              <li><Link to="/portfolio" className="hover:text-blue-500 transition-colors">Repository</Link></li>
              <li><Link to="/developer" className="hover:text-blue-500 transition-colors">Builder</Link></li>
            </ul>
          </div>
          
          <div className="md:col-span-2">
            <h4 className="text-white font-black mb-8 text-[10px] uppercase tracking-[0.3em]">Connect</h4>
            <ul className="space-y-5 text-sm font-bold">
              <li><a href="#" className="hover:text-blue-500 transition-colors">HQ / SF</a></li>
              <li><a href="#" className="hover:text-blue-500 transition-colors">Twitter</a></li>
              <li><a href="#" className="hover:text-blue-500 transition-colors">Discord</a></li>
            </ul>
          </div>

          <div className="md:col-span-2">
            <h4 className="text-white font-black mb-8 text-[10px] uppercase tracking-[0.3em]">Terminal</h4>
            <p className="text-xs mb-6 font-medium leading-relaxed">Join the autonomous waitlist.</p>
            <div className="flex flex-col gap-3">
              <input type="email" placeholder="email@address" className="bg-white/5 border border-white/10 rounded-xl px-5 py-3 text-xs w-full focus:ring-2 focus:ring-blue-600 outline-none text-white font-bold" />
              <button className="bg-white text-black px-5 py-3 rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-blue-600 hover:text-white transition-all">Join</button>
            </div>
          </div>
        </div>
        <div className="max-w-7xl mx-auto mt-24 pt-12 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-8 text-[10px] font-black uppercase tracking-[0.4em] text-slate-600">
          <p>&copy; 2025 CODE-SET AUTONOMOUS AGENCY. ALL RIGHTS RESERVED.</p>
          <div className="flex gap-12">
            <a href="#" className="hover:text-white transition-colors">Legal</a>
            <a href="#" className="hover:text-white transition-colors">Security</a>
          </div>
        </div>
      </footer>
    </div>
  );
}

function App() {
  return (
    <UserProvider>
      <HashRouter>
        <ScrollToTop />
        <AppContent />
      </HashRouter>
    </UserProvider>
  );
}

export default App;
