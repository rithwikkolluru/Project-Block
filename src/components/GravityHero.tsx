import React from 'react';
import { motion } from 'framer-motion';
import { Search } from 'lucide-react';
import { useCosmicStore } from '../stores/useCosmicStore';
import { useScanWarp } from '../hooks/useScanWarp';

export const GravityHero = () => {
  const [address, setAddress] = React.useState('');
  const { executeScan, isAnimating } = useScanWarp();
  
  const handleScan = () => {
    if (address) executeScan(address);
  };

  return (
    <div className="relative h-[40vh] min-h-[400px] flex flex-col items-center justify-center p-4">
      {/* Background Star Particles Mock */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-40">
        <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-white rounded-full animate-pulse shadow-[0_0_10px_#fff]" />
        <div className="absolute top-2/3 left-1/2 w-1 h-1 bg-gravityAccent rounded-full animate-ping shadow-[0_0_8px_#6366F1]" />
        <div className="absolute top-1/3 right-1/4 w-3 h-3 bg-safeFloat rounded-full animate-pulse shadow-[0_0_15px_#10B981]" />
      </div>

      <motion.div 
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 1, type: "spring" }}
        className="z-10 text-center"
      >
        <h1 className="text-5xl md:text-7xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-gravityAccent to-white mb-6">
          CryptoShield
        </h1>
        <p className="text-lg md:text-xl text-white/70 max-w-2xl mx-auto mb-10">
          AI-Based Scam Detection physics engine. Keep your transactions safe in the cosmic web3 space.
        </p>

        <motion.div 
          className="relative max-w-xl mx-auto flex items-center bg-white/5 border border-white/20 rounded-full p-2 backdrop-blur-md shadow-2xl transition-all"
          whileHover={{ scale: 1.02, boxShadow: "0 0 40px rgba(99,102,241,0.4)" }}
        >
          <Search className="text-white/50 ml-4 hidden sm:block" />
          <input 
            type="text"
            className="w-full bg-transparent border-none outline-none text-white px-4 placeholder-white/40 font-mono text-sm sm:text-base"
            placeholder="0x... Enter Wallet or Contract Address"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleScan()}
            disabled={isAnimating}
          />
          <motion.button 
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className={`px-6 py-3 rounded-full font-semibold transition-all ${isAnimating ? 'bg-warnWobble animate-pulse' : 'bg-gravityAccent hover:bg-[#4F46E5]'} text-white shadow-[0_0_15px_rgba(99,102,241,0.6)]`}
            onClick={handleScan}
            disabled={isAnimating}
          >
            {isAnimating ? 'Warping...' : 'Scan'}
          </motion.button>
        </motion.div>
      </motion.div>
    </div>
  );
};
