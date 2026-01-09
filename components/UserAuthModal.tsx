
import React, { useState, useEffect } from 'react';

interface UserAuthModalProps {
  onSuccess: (email: string) => void;
  onClose: () => void;
}

interface UserRecord {
  email: string;
  password: string;
}

const STORAGE_KEY = 'pixelperfect_db_users';

const UserAuthModal: React.FC<UserAuthModalProps> = ({ onSuccess, onClose }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  // Load existing users (simulating reading from a JSON file)
  const getUsers = (): UserRecord[] => {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  };

  // Save users (simulating writing to a JSON file)
  const saveUsers = (users: UserRecord[]) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(users));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    const users = getUsers();

    if (isLogin) {
      const user = users.find(u => u.email === email && u.password === password);
      if (user) {
        onSuccess(email);
      } else {
        setError('Invalid credentials. Check your email or password.');
      }
    } else {
      const userExists = users.some(u => u.email === email);
      if (userExists) {
        setError('An account with this email already exists.');
      } else {
        const newUsers = [...users, { email, password }];
        saveUsers(newUsers);
        onSuccess(email);
      }
    }
  };

  return (
    <div className="fixed inset-0 z-[250] flex items-center justify-center px-6">
      <div className="absolute inset-0 bg-slate-900/80 backdrop-blur-sm" onClick={onClose}></div>
      <div className="relative bg-white w-full max-w-md rounded-[2.5rem] shadow-2xl overflow-hidden animate-fade-in p-10">
        <div className="text-center mb-10">
          <div className="w-12 h-12 bg-indigo-100 text-indigo-600 rounded-xl flex items-center justify-center mx-auto mb-4">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 11c0 1.105-1.12 2-2.5 2S7 12.105 7 11s1.12-2 2.5-2 2.5.895 2.5 2zM12 11c0 1.105 1.12 2 2.5 2s2.5-.895 2.5-2-1.12-2-2.5-2-2.5.895-2.5 2z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 21c4.97 0 9-3.582 9-8s-4.03-8-9-8-9 3.582-9 8 4.03 8 9 8z" />
            </svg>
          </div>
          <h3 className="text-3xl font-black text-slate-900 mb-2">
            {isLogin ? 'Welcome Back' : 'Create Account'}
          </h3>
          <p className="text-slate-500 font-medium">
            {isLogin ? 'Log in to deploy your AI roadmap.' : 'Join to start building with Gemini.'}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Email</label>
            <input 
              type="email" 
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@company.com"
              className="w-full px-5 py-4 rounded-xl bg-slate-50 border border-slate-100 focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none transition-all font-medium"
            />
          </div>
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Password</label>
            <input 
              type="password" 
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full px-5 py-4 rounded-xl bg-slate-50 border border-slate-100 focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none transition-all font-medium"
            />
          </div>

          {error && (
            <p className="text-rose-500 text-xs font-bold text-center animate-pulse">{error}</p>
          )}

          <button 
            type="submit"
            className="w-full bg-slate-900 text-white py-4 rounded-xl font-black text-lg hover:bg-indigo-600 transition-all shadow-xl shadow-slate-900/10 active:scale-95"
          >
            {isLogin ? 'Log In & Build' : 'Sign Up & Build'}
          </button>
        </form>

        <div className="mt-8 text-center">
          <button 
            onClick={() => {
              setIsLogin(!isLogin);
              setError('');
            }}
            className="text-sm font-bold text-slate-400 hover:text-indigo-600 transition-colors"
          >
            {isLogin ? "Don't have an account? Sign Up" : "Already have an account? Log In"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default UserAuthModal;
