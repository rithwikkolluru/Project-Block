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
    <div className="max-w-4xl mx-auto py-12 px-4 relative z-10">
      <div className="bg-gradient-to-b from-white/5 to-transparent rounded-2xl border border-white/10 p-8 backdrop-blur-2xl">
        <h2 className="text-2xl font-bold text-white mb-2 flex items-center gap-3">
          <UserX className="text-dangerCollapse" /> Scam Registry
        </h2>
        <p className="text-white/60 mb-6">Real-time crowdsourced malicious actors</p>

        <input
          type="text"
          placeholder="Filter addresses or reasons (Black Hole Filter)..."
          className="w-full bg-black/40 border border-white/20 rounded-xl px-4 py-3 text-white placeholder-white/30 focus:outline-none focus:border-gravityAccent mb-6 transition"
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
        />

        <div className="flex flex-col gap-4">
          {mockScams.map((scam, i) => (
            <motion.div 
              key={i}
              whileHover={{ x: 10, backgroundColor: 'rgba(255,255,255,0.08)' }}
              className="bg-white/5 border border-white/10 rounded-xl p-4 flex justify-between items-center transition"
            >
              <div>
                <div className="font-mono text-white text-lg">{scam.address}</div>
                <div className="text-sm text-dangerCollapse mt-1">{scam.reason}</div>
              </div>
              <div className="flex items-center gap-4">
                <div className="flex gap-2">
                  <button className="text-white/40 hover:text-safeFloat transition"><ThumbsUp size={18} /></button>
                  <button className="text-white/40 hover:text-dangerCollapse transition"><ThumbsDown size={18} /></button>
                </div>
                <div className="text-white/80 font-mono font-bold">{scam.votes}</div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};
