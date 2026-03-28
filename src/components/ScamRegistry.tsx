import { useState } from 'react';
import { motion } from 'framer-motion';
import { UserX, ThumbsUp, ThumbsDown } from 'lucide-react';

export const ScamRegistry = () => {
  const [filter, setFilter] = useState('');

  // Mock data representing global real-time community reports
  const mockScams = [
    { address: '0x12..Xf9', reason: 'Phishing Drop', votes: -45 },
    { address: '0x99..Kk1', reason: 'Honey Pot Token', votes: -128 },
    { address: '0x32..Zp9', reason: 'Fake Uniswap Router', votes: -890 }
  ];

  return (
    <div className="max-w-4xl mx-auto py-12 px-4 relative z-10 w-full">
      <div className="glass-card rounded-[2rem] p-8 md:p-12 relative overflow-hidden backdrop-blur-3xl border-white/5 shadow-2xl">
        <div className="absolute inset-0 bg-indigo-500/5 blur-[100px] -z-10" />
        <h2 className="text-3xl font-bold text-white mb-3 flex items-center gap-4">
          <div className="p-2 bg-red-500/20 rounded-xl">
            <UserX className="text-red-500" size={32} />
          </div>
          Community Scam Registry
        </h2>
        <p className="text-indigo-200/50 mb-8 font-medium ml-1">Real-time crowdsourced malicious actors & verified reports</p>

        <div className="relative mb-8">
          <input
            type="text"
            placeholder="Search addresses or reasons..."
            className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white placeholder-white/30 focus:outline-none focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/20 transition-all backdrop-blur-md"
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
          />
        </div>

        <div className="flex flex-col gap-4">
          {mockScams.map((scam, i) => (
            <motion.div 
              key={i}
              whileHover={{ x: 10, backgroundColor: 'rgba(255,255,255,0.05)' }}
              className="bg-white/5 border border-white/5 rounded-2xl p-6 flex justify-between items-center transition-all duration-300 hover:border-white/10"
            >
              <div>
                <div className="font-mono text-white text-lg tracking-wider">{scam.address}</div>
                <div className="text-sm text-red-400 mt-2 font-medium flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-red-500" />
                  {scam.reason}
                </div>
              </div>
              <div className="flex items-center gap-6">
                <div className="flex gap-3">
                  <button className="p-2 rounded-lg bg-white/5 text-white/40 hover:text-emerald-400 hover:bg-emerald-400/10 transition-all"><ThumbsUp size={20} /></button>
                  <button className="p-2 rounded-lg bg-white/5 text-white/40 hover:text-red-400 hover:bg-red-400/10 transition-all"><ThumbsDown size={20} /></button>
                </div>
                <div className="text-white/90 font-mono font-bold text-xl px-4 py-1 bg-white/5 rounded-lg border border-white/5">{scam.votes}</div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};
