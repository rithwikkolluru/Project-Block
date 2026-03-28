import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Shield, Mail, Lock, Wallet, ArrowRight } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useWallet } from '../../hooks/useWallet';

const LoginPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { loginEmail, connect } = useWallet();
  const navigate = useNavigate();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    loginEmail(email);
    navigate('/', { replace: true });
  };

  const handleWalletConnect = async () => {
    await connect();
    navigate('/', { replace: true });
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6 relative overflow-hidden">
      {/* Background Decorative Elements */}
      <div className="absolute top-0 left-0 w-full h-full -z-10">
        <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-indigo-600/10 blur-[150px] rounded-full animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-violet-600/10 blur-[150px] rounded-full animate-pulse" delay-1000="" />
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md glass-card rounded-[2.5rem] p-10 border-white/10 shadow-3xl backdrop-blur-3xl relative overflow-hidden"
      >
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-600/5 to-transparent pointer-events-none" />
        
        <div className="flex flex-col items-center mb-10">
          <div className="w-16 h-16 rounded-2xl bg-indigo-600 flex items-center justify-center mb-6 shadow-[0_0_30px_rgba(79,70,229,0.5)]">
            <Shield className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-3xl font-black text-white tracking-tight mb-2">Welcome Back</h1>
          <p className="text-indigo-200/40 text-sm font-medium">Access your personalized security dashboard</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-6">
          <div className="space-y-2">
            <label className="text-xs font-bold text-indigo-300 uppercase tracking-widest ml-1">Email Address</label>
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20 w-5 h-5" />
              <input 
                type="email"
                required
                className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-white placeholder-white/20 outline-none focus:border-indigo-500/50 transition-all font-medium"
                placeholder="name@company.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold text-indigo-300 uppercase tracking-widest ml-1">Password</label>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20 w-5 h-5" />
              <input 
                type="password"
                required
                className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-white placeholder-white/20 outline-none focus:border-indigo-500/50 transition-all font-medium"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>

          <button 
            type="submit"
            className="w-full bg-indigo-600 hover:bg-indigo-500 text-white py-4 rounded-2xl font-black tracking-wide transition-all shadow-[0_10px_20px_rgba(79,70,229,0.3)] flex items-center justify-center gap-2 group"
          >
            SIGN IN
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </button>
        </form>

        <div className="relative my-8">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-white/5"></div>
          </div>
          <div className="relative flex justify-center text-xs uppercase tracking-[0.3em] font-bold text-white/20">
            <span className="px-4 bg-transparent backdrop-blur-xl">Or Continue with</span>
          </div>
        </div>

        <button 
          onClick={handleWalletConnect}
          className="w-full bg-white/5 border border-white/10 hover:bg-white/10 text-white py-4 rounded-2xl font-bold transition-all flex items-center justify-center gap-3 group"
        >
          <Wallet className="w-5 h-5 text-indigo-400 group-hover:text-indigo-300" />
          Connect Pera Wallet
        </button>

        <p className="mt-10 text-center text-indigo-200/30 text-xs font-bold uppercase tracking-widest">
          Don't have an account? <Link to="#" className="text-indigo-400 hover:text-indigo-300 transition-colors">Create Account</Link>
        </p>
      </motion.div>
    </div>
  );
};

export default LoginPage;
