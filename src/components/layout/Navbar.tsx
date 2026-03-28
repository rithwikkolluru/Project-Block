import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useWallet } from '../../hooks/useWallet';
import { Wallet, Shield, Menu, X } from 'lucide-react';

const Navbar = () => {
  const { address, isConnected, connect, disconnect } = useWallet();
  const [isOpen, setIsOpen] = React.useState(false);



  return (
    <motion.nav 
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className="fixed top-0 left-0 right-0 z-50 px-6 py-4"
    >
      <div className="max-w-7xl mx-auto glass-pill flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center gap-2 cursor-pointer">
          <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center">
            <Shield className="w-5 h-5 text-white" />
          </div>
          <span className="font-bold text-lg tracking-tight hidden sm:block">BlockShield</span>
        </div>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-8">
          <Link to="/" className="text-sm font-medium text-slate-400 hover:text-white transition-colors">Home</Link>
          <Link to="/networkmap" className="text-sm font-medium text-slate-400 hover:text-white transition-colors">Network Map</Link>
          <Link to="/registry" className="text-sm font-medium text-slate-400 hover:text-white transition-colors">Scam Registry</Link>
        </div>

        {/* Auth / Wallet CTA */}
        <div className="flex items-center gap-4">
          {!isConnected ? (
            <Link to="/login" className="hidden sm:block text-sm font-bold text-slate-400 hover:text-white transition-colors">
              Sign In
            </Link>
          ) : (
            <div className="flex items-center gap-4">
               <Link to="/" className="hidden sm:block text-sm font-bold text-indigo-400 hover:text-indigo-300 transition-colors uppercase tracking-widest">
                Dashboard
              </Link>
              <Link to="/logout" className="text-xs font-bold text-red-400/60 hover:text-red-400 transition-colors uppercase tracking-widest">
                Logout
              </Link>
            </div>
          )}
          
          <button
            onClick={isConnected ? disconnect : connect}
            className="flex items-center gap-2 bg-white/5 border border-white/10 hover:bg-white/10 text-white px-4 py-2 rounded-full text-sm font-semibold transition-all hover:scale-105 active:scale-95 group"
          >
            <Wallet className="w-4 h-4 text-indigo-400 group-hover:text-indigo-300" />
            {isConnected ? `${address?.slice(0, 6)}...${address?.slice(-4)}` : 'Connect Wallet'}
          </button>
          
          <button className="md:hidden" onClick={() => setIsOpen(!isOpen)}>
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="absolute top-20 left-6 right-6 glass-card rounded-2xl p-6 flex flex-col gap-4 md:hidden z-50"
        >
          <Link to="/" className="text-base font-bold text-white/80 hover:text-white" onClick={() => setIsOpen(false)}>Home</Link>
          <Link to="/networkmap" className="text-base font-bold text-white/80 hover:text-white" onClick={() => setIsOpen(false)}>Network Map</Link>
          <Link to="/registry" className="text-base font-bold text-white/80 hover:text-white" onClick={() => setIsOpen(false)}>Scam Registry</Link>
          <div className="border-t border-white/10 pt-4 flex flex-col gap-3">
            {isConnected ? (
              <Link to="/logout" className="text-sm font-bold text-red-400 uppercase tracking-widest" onClick={() => setIsOpen(false)}>Logout</Link>
            ) : (
              <Link to="/login" className="text-sm font-bold text-indigo-400 uppercase tracking-widest" onClick={() => setIsOpen(false)}>Sign In</Link>
            )}
          </div>
        </motion.div>
      )}
    </motion.nav>
  );
};

export default Navbar;
