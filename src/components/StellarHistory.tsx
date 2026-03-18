import React from 'react';
import { useCosmicStore } from '../stores/useCosmicStore';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowDownToLine } from 'lucide-react';

export const StellarHistory = () => {
  const { scanHistory } = useCosmicStore();

  if (scanHistory.length === 0) return null;

  return (
    <div className="max-w-6xl mx-auto py-12 px-4 relative z-10">
      <div className="flex items-center justify-between mb-8 text-white">
        <h2 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-gray-100 to-gray-400">Scan Pipeline</h2>
        <motion.button 
          whileHover={{ scale: 1.05 }}
          className="flex items-center gap-2 bg-white/10 hover:bg-white/20 px-4 py-2 rounded-lg backdrop-blur-md transition border border-white/5"
        >
          <ArrowDownToLine size={16} /> Export CSV
        </motion.button>
      </div>
      
      <div className="overflow-x-auto rounded-xl border border-white/10 bg-white/[0.02] backdrop-blur-xl">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-white/10 text-white/50 bg-black/20">
              <th className="p-4 rounded-tl-xl font-medium">Address</th>
              <th className="p-4 font-medium">Risk Score</th>
              <th className="p-4 font-medium">Evaluation</th>
              <th className="p-4 rounded-tr-xl font-medium">Time (UTC)</th>
            </tr>
          </thead>
          <tbody>
            <AnimatePresence>
              {scanHistory.map((scan, i) => (
                <motion.tr 
                  key={scan.timestamp + i}
                  initial={{ opacity: 0, x: -20, scale: 0.95 }}
                  animate={{ opacity: 1, x: 0, scale: 1 }}
                  whileHover={{ 
                    scale: 1.01, 
                    backgroundColor: 'rgba(255,255,255,0.05)',
                    transition: { duration: 0.2 } 
                  }}
                  className="border-b border-white/5 text-sm text-gray-300 transition-colors"
                >
                  <td className="p-4 font-mono select-all truncate max-w-[200px]">{scan.address}</td>
                  <td className="p-4 align-middle">
                    <div className="flex items-center gap-2">
                       <span className="font-bold">{scan.score}</span>/100
                    </div>
                  </td>
                  <td className="p-4">
                    <span className={`px-2 py-1 rounded text-xs font-bold uppercase tracking-wider shadow-md ${
                      scan.level === 'danger' ? 'bg-dangerCollapse/20 text-dangerCollapse border border-dangerCollapse/50' :
                      scan.level === 'warning' ? 'bg-warnWobble/20 text-warnWobble border border-warnWobble/50' :
                      'bg-safeFloat/20 text-safeFloat border border-safeFloat/50'
                    }`}>
                      {scan.level}
                    </span>
                  </td>
                  <td className="p-4 text-white/40">{new Date(scan.timestamp).toISOString().split('T')[1].slice(0, 8)}</td>
                </motion.tr>
              ))}
            </AnimatePresence>
          </tbody>
        </table>
      </div>
    </div>
  );
};
