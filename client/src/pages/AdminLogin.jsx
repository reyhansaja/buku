import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Lock, User, LogIn } from 'lucide-react';

const AdminLogin = ({ setIsAdmin }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('http://localhost:5000/api/auth/login', { username, password });
      localStorage.setItem('token', res.data.token);
      setIsAdmin(true);
      navigate('/admin/dashboard');
    } catch (err) {
      setError('Invalid username or password');
    }
  };

  return (
    <div className="animate-fade min-h-[80vh] flex items-start justify-center pt-10 sm:pt-20 px-4">
      <div className="glass p-8 sm:p-12 rounded-3xl w-full max-w-md shadow-2xl">
        <div className="text-center mb-10">
          <div className="bg-indigo-500/20 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4 text-indigo-400 border border-indigo-500/30">
            <Lock size={32} />
          </div>
          <h2 className="text-2xl font-bold text-white tracking-tight">Admin Access</h2>
          <p className="text-slate-400 mt-2">Secure portal for library management</p>
        </div>

        {error && (
          <div className="mb-6 py-3 px-4 bg-red-500/10 border border-red-500/20 text-red-400 text-sm rounded-xl text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4">
          <div className="relative group">
            <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-indigo-400 transition-colors" size={20} />
            <input
              type="text"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="input-field pl-12"
              required
            />
          </div>

          <div className="relative group">
            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-indigo-400 transition-colors" size={20} />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="input-field pl-12"
              required
            />
          </div>

          <button type="submit" className="w-full btn btn-primary mt-4 h-14 text-lg">
            <LogIn size={22} /> Login
          </button>
        </form>
      </div>
    </div>
  );
};

export default AdminLogin;
