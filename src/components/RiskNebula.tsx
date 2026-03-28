import React from 'react';
import { motion } from 'framer-motion';
import { useCosmicStore } from '../stores/useCosmicStore';
import { History, Code, Users } from 'lucide-react';

export const RiskNebula = () => {
  const { currentScan, isWarping } = useCosmicStore();

  if (!currentScan && !isWarping) return null;

  const colorMap = {
    safe: '#10B981', // Emerald-500
    warning: '#F59E0B', // Amber-500
    danger: '#EF4444' // Red-500
  };

  const orbColor = currentScan ? colorMap[currentScan.level] : '#6366F1';

  return (
    <div className="relative py-20 min-h-[500px] flex items-center justify-center overflow-hidden">
      
      {/* Central Black Hole / Sun */}
      <motion.div
        animate={isWarping ? { scale: [1, 1.2, 0.9, 1.1], rotate: 360 } : { scale: 1, rotate: 0 }}
        transition={{ duration: 4, repeat: isWarping ? Infinity : 0 }}
        className="absolute w-48 h-48 md:w-72 md:h-72 rounded-full flex items-center justify-center shadow-[0_0_100px_currentColor] z-10 backdrop-blur-sm"
        style={{ 
          color: orbColor, 
          background: `radial-gradient(circle, ${orbColor}33 0%, rgba(0,0,0,0) 75%)`,
          border: `1px solid ${orbColor}22` 
        }}
      >
        {!isWarping && currentScan && (
          <div className="text-center font-bold text-white drop-shadow-2xl">
            <div className="text-6xl tracking-tight">{currentScan.score}</div>
            <div className="text-xs uppercase tracking-[0.3em] mt-3 text-white/50">{currentScan.level} Score</div>
          </div>
        )}
      </motion.div>

      {/* Orbiting Cards */}
      {!isWarping && currentScan && (
        <>
          <OrbitCard icon={<History />} label="Wallet History" delay={1.2} radius={180} />
          <OrbitCard icon={<Code />} label="Contract Audit" delay={2.1} radius={260} />
          <OrbitCard icon={<Users />} label="Community Alerts" delay={3.4} radius={340} />
        </>
      )}

      {/* Warp Particles */}
      {isWarping && (
        <motion.div 
          className="absolute inset-0"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          {Array.from({ length: 20 }).map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-1 h-32 bg-white/50 rounded-full"
              style={{
                top: '50%',
                left: '50%',
                transformOrigin: '0 0',
                rotate: `${(i * 360) / 20}deg`,
              }}
              animate={{
                y: [0, 1000],
                opacity: [1, 0]
              }}
              transition={{
                duration: Math.random() * 0.5 + 0.5,
                repeat: Infinity,
                ease: 'linear'
              }}
            />
          ))}
        </motion.div>
      )}
    </div>
  );
};

const OrbitCard = ({ icon, label, delay, radius }: { icon: React.ReactNode, label: string, delay: number, radius: number }) => {
  return (
    <motion.div
      className="absolute glass-card backdrop-blur-2xl p-4 rounded-2xl flex items-center gap-4 shadow-2xl hidden md:flex border border-white/5 hover:border-indigo-500/20 transition-all cursor-default"
      initial={{ opacity: 0, x: 0, y: 0 }}
      animate={{ 
        opacity: 1, 
        rotate: 360,
      }}
      transition={{ 
        duration: 20 + delay * 5, 
        repeat: Infinity, 
        ease: "linear" 
      }}
      style={{
        width: 180,
        height: 64,
        transformOrigin: `-${radius}px center`,
        marginLeft: `${radius * 2}px`
      }}
    >
      <div className="text-indigo-400 p-2 bg-indigo-500/10 rounded-lg">{icon}</div>
      <div className="text-sm font-bold truncate text-white uppercase tracking-wider">{label}</div>
    </motion.div>
  );
};
