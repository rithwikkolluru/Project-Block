import React from 'react';
import { motion } from 'framer-motion';
import { useCosmicStore } from '../stores/useCosmicStore';
import { ShieldAlert, History, Code, Users } from 'lucide-react';

export const RiskNebula = () => {
  const { currentScan, isWarping } = useCosmicStore();

  if (!currentScan && !isWarping) return null;

  const colorMap = {
    safe: '#10B981',
    warning: '#F59E0B',
    danger: '#EF4444'
  };

  const orbColor = currentScan ? colorMap[currentScan.level] : '#6366F1';

  return (
    <div className="relative py-20 min-h-[500px] flex items-center justify-center overflow-hidden">
      
      {/* Central Black Hole / Sun */}
      <motion.div
        animate={isWarping ? { scale: [1, 1.5, 0.8, 1.2], rotate: 360 } : { scale: 1, rotate: 0 }}
        transition={{ duration: 4, repeat: isWarping ? Infinity : 0 }}
        className="absolute w-40 h-40 md:w-64 md:h-64 rounded-full flex items-center justify-center shadow-[0_0_80px_currentColor] z-10"
        style={{ color: orbColor, background: `radial-gradient(circle, ${orbColor} 0%, rgba(0,0,0,0) 70%)` }}
      >
        {!isWarping && currentScan && (
          <div className="text-center font-bold text-white drop-shadow-md">
            <div className="text-5xl">{currentScan.score}</div>
            <div className="text-sm uppercase tracking-widest mt-2">{currentScan.level}</div>
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
      className="absolute border border-white/10 bg-white/5 backdrop-blur-md p-4 rounded-xl flex items-center gap-3 shadow-xl hidden md:flex"
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
      <div className="text-gravityAccent">{icon}</div>
      <div className="text-sm font-semibold truncate text-white">{label}</div>
    </motion.div>
  );
};
