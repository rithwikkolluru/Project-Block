import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, ShieldCheck, Zap, Lock } from 'lucide-react';

const Hero = () => {
  return (
    <section className="relative pt-32 pb-20 px-6 overflow-hidden min-h-screen flex items-center">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        
        {/* Text Content */}
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-bold uppercase tracking-widest mb-6">
            <Zap className="w-3 h-3" />
            Powered by Algorand
          </div>
          
          <h1 className="text-5xl lg:text-7xl font-bold font-display tracking-tight leading-[1.1] mb-6">
            The Future of <br />
            <span className="gradient-text">Web3 Security</span> <br />
            is Here.
          </h1>
          
          <p className="text-lg text-slate-400 mb-10 max-w-lg leading-relaxed">
            Secure your assets with the next generation of Algorand-powered shielding. 
            Minimalist, powerful, and built for everyone.
          </p>
          
          <div className="flex flex-wrap gap-4">
            <button className="bg-white text-slate-950 px-8 py-4 rounded-full font-bold text-lg hover:scale-105 active:scale-95 transition-all flex items-center gap-2">
              Launch App
              <ArrowRight className="w-5 h-5" />
            </button>
            <button className="glass-pill px-8 py-4 font-bold text-lg hover:bg-white/10 transition-all">
              View Documentation
            </button>
          </div>
        </motion.div>

        {/* Visual Mockup/Abstract */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, ease: "easeOut", delay: 0.2 }}
          className="relative"
        >
          <div className="glass-card aspect-square rounded-[2rem] p-8 flex items-center justify-center relative">
            <div className="absolute inset-0 bg-indigo-600/10 blur-3xl rounded-full" />
            <div className="relative z-10 text-center">
              <ShieldCheck className="w-32 h-32 text-indigo-500 mb-6 mx-auto animate-pulse" />
              <div className="text-2xl font-bold bg-white/5 px-6 py-2 rounded-full border border-white/10">
                100% On-Chain Security
              </div>
            </div>
          </div>
          
          {/* Floating elements */}
          <motion.div 
            animate={{ y: [0, -20, 0] }}
            transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
            className="absolute -top-10 -right-10 glass-card p-4 rounded-2xl flex items-center gap-3 border-indigo-500/20"
          >
            <Lock className="w-5 h-5 text-indigo-400" />
            <span className="text-sm font-medium">Encrypted Data</span>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default Hero;
