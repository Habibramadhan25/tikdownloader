import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Key, Eye, EyeOff } from 'lucide-react';

export default function AdminLogin() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loginError, setLoginError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    if (localStorage.getItem('tikdown_admin_auth') === 'true') {
      navigate('/admin');
    }
  }, [navigate]);

  const handleLogin = (e) => {
    e.preventDefault();
    if (username === 'admin' && password === 'admin123') {
      localStorage.setItem('tikdown_admin_auth', 'true');
      navigate('/admin');
    } else {
      setLoginError('Username atau password salah');
    }
  };

  return (
    <div className="w-full flex flex-col items-center justify-center min-h-[75vh] animate-in fade-in">
      <div className="w-full max-w-md p-8 bg-[hsl(var(--card))] border border-[hsl(var(--border))] rounded-3xl shadow-2xl">
        <div className="flex justify-center mb-6">
          <div className="p-4 bg-indigo-500/10 rounded-2xl text-indigo-500">
            <Key className="w-10 h-10" />
          </div>
        </div>
        <h1 className="text-2xl font-bold text-center text-[hsl(var(--foreground))]">TikDown</h1>
        <h2 className="text-lg font-medium text-center text-[hsl(var(--muted-foreground))] mb-8">Admin Portal</h2>
        
        <form onSubmit={handleLogin} className="flex flex-col gap-4">
          <div>
            <label className="text-sm font-medium text-[hsl(var(--muted-foreground))] mb-1 block">Username</label>
            <input 
              type="text" 
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full px-4 py-3 bg-[hsl(var(--muted))] border border-[hsl(var(--border))] rounded-xl focus:outline-none focus:ring-2 ring-indigo-500 transition-all"
              placeholder="Masukkan username"
              required
            />
          </div>
          <div>
            <label className="text-sm font-medium text-[hsl(var(--muted-foreground))] mb-1 block">Password</label>
            <div className="relative">
              <input 
                type={showPassword ? "text" : "password"} 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-4 pr-12 py-3 bg-[hsl(var(--muted))] border border-[hsl(var(--border))] rounded-xl focus:outline-none focus:ring-2 ring-indigo-500 transition-all"
                placeholder="Masukkan password"
                required
              />
              <button 
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-[hsl(var(--muted-foreground))] hover:text-[hsl(var(--foreground))] transition-colors"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>
          {loginError && (
            <p className="text-red-500 text-sm mt-1">{loginError}</p>
          )}
          <button 
            type="submit"
            className="mt-4 w-full py-3.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl transition-colors shadow-lg shadow-indigo-500/20"
          >
            Login
          </button>
        </form>
      </div>
    </div>
  );
}
