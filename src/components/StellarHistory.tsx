import { useCosmicStore } from '../stores/useCosmicStore';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowDownToLine } from 'lucide-react';

export const StellarHistory = () => {
  const { scanHistory } = useCosmicStore();

  if (scanHistory.length === 0) return null;

  return (
    <div className="max-w-6xl mx-auto py-12 px-4 relative z-10 w-full mb-12">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-10 gap-6">
        <div>
          <h2 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-b from-white to-white/40 tracking-tighter">
            Security Scan Pipeline
          </h2>
          <p className="text-indigo-200/40 mt-2 font-medium">Historical analysis of scanned nodes and risk evaluations</p>
        </div>
        <motion.button 
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="flex items-center gap-3 bg-indigo-500/10 hover:bg-indigo-500/20 px-6 py-3 rounded-2xl backdrop-blur-xl transition-all border border-indigo-500/20 text-indigo-300 font-bold shadow-lg"
        >
          <ArrowDownToLine size={20} /> Export Dataset (CSV)
        </motion.button>
      </div>
      
      <div className="glass-card rounded-[2rem] border-white/5 relative overflow-hidden shadow-2xl">
        <div className="absolute inset-0 bg-indigo-500/5 blur-[100px] -z-10" />
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
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    whileHover={{ 
                      backgroundColor: 'rgba(255,255,255,0.03)',
                    }}
                    className="border-b border-white/5 text-sm text-slate-300 transition-colors group"
                  >
                    <td className="p-5 font-mono select-all truncate max-w-[200px] text-indigo-200/60 group-hover:text-white transition-colors">{scan.address}</td>
                    <td className="p-5 align-middle">
                      <div className="flex items-center gap-2">
                         <span className="font-bold text-lg text-white">{scan.score}</span>
                         <span className="text-white/20">/ 100</span>
                      </div>
                    </td>
                    <td className="p-5">
                      <span className={`px-3 py-1.5 rounded-xl text-xs font-bold uppercase tracking-widest ${
                        scan.level === 'danger' ? 'bg-red-500/10 text-red-400 border border-red-500/30 shadow-[0_0_10px_rgba(239,68,68,0.2)]' :
                        scan.level === 'warning' ? 'bg-amber-500/10 text-amber-400 border border-amber-500/30' :
                        'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
                      }`}>
                        {scan.level}
                      </span>
                    </td>
                    <td className="p-5 text-indigo-100/30 font-medium">{new Date(scan.timestamp).toISOString().split('T')[1].slice(0, 8)}</td>
                  </motion.tr>
                ))}
            </AnimatePresence>
          </tbody>
        </table>
      </div>
    </div>
  );
};
