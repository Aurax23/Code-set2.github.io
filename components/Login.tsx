
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../App';

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { login } = useUser();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // Default Admin Credentials
    if (email === 'fsemipe@gmail.com' && password === 'Aurax_32') {
      login(email);
      navigate('/dashboard');
    } else {
      setError('Invalid credentials. Please verify your identity.');
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-6">
      <div className="max-w-md w-full animate-slide-up">
        <div className="bg-white p-10 rounded-[2.5rem] border border-slate-100 shadow-2xl shadow-slate-200/50">
          <div className="text-center mb-10">
            <div className="w-16 h-16 bg-black rounded-2xl flex items-center justify-center text-white font-black text-2xl mx-auto mb-6 shadow-xl shadow-black/10">CS</div>
            <h1 className="text-3xl font-black text-black tracking-tight mb-2 uppercase">Internal Access</h1>
            <p className="text-slate-500 font-medium">Code-Set Admin Terminal</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Identity</label>
              <input 
                type="email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email address"
                className="w-full px-5 py-4 rounded-xl bg-slate-50 border border-slate-100 focus:ring-4 focus:ring-blue-500/10 focus:border-blue-600 outline-none transition-all font-medium"
                required
              />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Access Key</label>
              <input 
                type="password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
                className="w-full px-5 py-4 rounded-xl bg-slate-50 border border-slate-100 focus:ring-4 focus:ring-blue-500/10 focus:border-blue-600 outline-none transition-all font-medium"
                required
              />
            </div>

            {error && (
              <div className="bg-rose-50 border border-rose-100 text-rose-600 px-4 py-3 rounded-xl text-xs font-bold animate-pulse">
                {error}
              </div>
            )}

            <button 
              type="submit"
              className="w-full bg-black text-white py-4 rounded-xl font-black text-lg hover:bg-blue-600 transition-all shadow-xl shadow-black/10 active:scale-[0.98]"
            >
              Unlock Terminal
            </button>
          </form>
          
          <div className="mt-8 text-center">
            <button onClick={() => navigate('/')} className="text-slate-400 hover:text-black text-sm font-bold transition-colors">
              Return to Public Interface
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
