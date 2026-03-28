import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Zap, Info, ArrowRight, ShieldAlert, CheckCircle2, XCircle, AlertTriangle } from 'lucide-react';
import { useScanWarp } from '../../hooks/useScanWarp';
import LightPillar from '../visuals/LightPillar';
import ScanTabs, { ScanType } from '../ui/ScanTabs';
import { useCosmicStore } from '../../stores/useCosmicStore';
import { validateAlgorandInput } from '../../utils/algorandValidator';

const Hero = () => {
  const [address, setAddress] = useState('');
  const [activeTab, setActiveTab] = useState<ScanType>('wallet');
  const [attemptedScan, setAttemptedScan] = useState(false);
  const { executeScan, isAnimating } = useScanWarp();
  const { currentScan } = useCosmicStore();

  // Run validation on every keystroke
  const validation = useMemo(() => {
    if (!address.trim()) return null;
    return validateAlgorandInput(address.trim());
  }, [address]);

  // Auto-switch the active tab to match what the user is typing
  const syncedValidation = useMemo(() => {
    if (!validation) return null;
    if (validation.type !== 'unknown' && validation.type !== activeTab) {
      setActiveTab(validation.type as ScanType);
    }
    return validation;
  }, [validation]);

  const canScan = !!address.trim() && (syncedValidation?.isValid ?? false);

  const handleScan = () => {
    setAttemptedScan(true);
    if (!canScan) return;         // Hard block — any violation rejects the scan
    executeScan(address.trim());
    setAttemptedScan(false);
  };

  const getPlaceholder = () => {
    switch (activeTab) {
      case 'wallet': return "e.g. 6BJ32SU3ABLWSBND7U5H2QI... (58-char Algorand address)";
      case 'contract': return "e.g. 123456789 (numeric App ID)";
      case 'transaction': return "e.g. XBTYD... (52-char Transaction ID)";
      case 'url': return "https://... (phishing URL check)";
      default: return "Enter wallet address, TxID, App ID, or URL...";
    }
  };

  // Determine border color based on validation state
  const getBorderClass = () => {
    if (!address.trim()) return 'border-white/10';
    if (!syncedValidation) return 'border-white/10';
    if (syncedValidation.isValid) return 'border-emerald-500/40';
    if (attemptedScan) return 'border-red-500/60';
    return 'border-amber-500/30';
  };

  return (
    <section className="relative pt-32 pb-20 px-6 min-h-screen flex flex-col items-center justify-center overflow-hidden">
      {/* Background Visuals */}
      <div className="absolute inset-0 -z-10 overflow-hidden pointer-events-none opacity-40">
        <LightPillar
          topColor="#6366F1"
          bottomColor="#A855F7"
          intensity={0.6}
          rotationSpeed={0.15}
          glowAmount={0.003}
          pillarWidth={4}
          pillarHeight={0.8}
          noiseIntensity={0.4}
          pillarRotation={20}
          interactive={false}
          mixBlendMode="screen"
          quality="high"
        />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1000px] h-[1000px] bg-indigo-600/5 blur-[160px] rounded-full" />
      </div>

      <div className="max-w-5xl mx-auto w-full text-center z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-card bg-indigo-500/10 border-indigo-500/20 mb-8">
            <Zap className="w-4 h-4 text-indigo-400" />
            <span className="text-xs font-bold text-indigo-300 uppercase tracking-[0.2em]">Validated by BlockShield AI</span>
          </div>
          
          <h1 className="text-6xl md:text-8xl lg:text-9xl font-black bg-clip-text text-transparent bg-gradient-to-b from-white to-white/40 mb-8 tracking-tighter leading-none">
            BlockShield
          </h1>
          
          <p className="text-xl md:text-2xl text-indigo-100/40 max-w-2xl mx-auto mb-16 font-medium leading-relaxed">
            The next generation of Algorand security. <br className="hidden md:block" />
            Immutable protection for every digital touchpoint.
          </p>
        </motion.div>

        {/* Scan Node Interface */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="w-full max-w-3xl mx-auto"
        >
          <ScanTabs activeTab={activeTab} onTabChange={(tab) => { setActiveTab(tab); setAddress(''); setAttemptedScan(false); }} />

          <div className="relative group mb-3">
            <motion.div 
              layout
              className={`relative flex items-center glass-card border rounded-[2.5rem] p-3 shadow-3xl transition-colors duration-300 bg-white/[0.02] backdrop-blur-3xl ${getBorderClass()}`}
            >
              {/* Input type icon / validation state */}
              <div className="p-3 rounded-full bg-indigo-500/10 ml-2 shrink-0">
                {!address.trim() && <Search className="text-indigo-300" size={22} />}
                {address.trim() && syncedValidation?.isValid && <CheckCircle2 className="text-emerald-400" size={22} />}
                {address.trim() && syncedValidation && !syncedValidation.isValid && <XCircle className="text-red-400" size={22} />}
              </div>
              
              <input 
                type="text"
                className="w-full bg-transparent border-none outline-none text-white px-5 placeholder-white/20 font-mono text-sm md:text-base"
                placeholder={getPlaceholder()}
                value={address}
                onChange={(e) => { setAddress(e.target.value); setAttemptedScan(false); }}
                onKeyDown={(e) => e.key === 'Enter' && handleScan()}
                disabled={isAnimating}
              />

              {/* Detected type badge */}
              <AnimatePresence>
                {syncedValidation && syncedValidation.badge && (
                  <motion.span
                    key={syncedValidation.badge}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    className={`hidden lg:flex items-center gap-1 px-3 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest shrink-0 mr-3 ${
                      syncedValidation.isValid
                        ? 'bg-emerald-500/10 text-emerald-300 border border-emerald-500/20'
                        : 'bg-red-500/10 text-red-300 border border-red-500/20'
                    }`}
                  >
                    {syncedValidation.badge}
                  </motion.span>
                )}
              </AnimatePresence>

              <motion.button 
                whileHover={canScan ? { scale: 1.02 } : {}}
                whileTap={canScan ? { scale: 0.98 } : { scale: 1 }}
                className={`px-8 py-4 rounded-[1.8rem] font-black tracking-widest transition-all min-w-[150px] flex items-center justify-center gap-2 shrink-0 ${
                  isAnimating
                    ? 'bg-amber-500 text-white animate-pulse cursor-wait'
                    : canScan
                    ? 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-[0_15px_40px_rgba(79,70,229,0.4)]'
                    : 'bg-white/5 text-white/20 cursor-not-allowed border border-white/10'
                }`}
                onClick={handleScan}
                disabled={isAnimating || !canScan}
              >
                {isAnimating ? 'ANALYZING...' : 'SECURE SCAN'}
                {!isAnimating && canScan && <ArrowRight size={18} />}
                {!isAnimating && !canScan && address.trim() && <ShieldAlert size={18} className="text-red-400/50" />}
              </motion.button>
            </motion.div>
            
            {/* Glow border for valid state */}
            <AnimatePresence>
              {canScan && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="absolute -inset-[2px] bg-gradient-to-r from-emerald-500/0 via-emerald-500/30 to-emerald-500/0 opacity-60 transition-opacity blur-lg pointer-events-none -z-10"
                />
              )}
            </AnimatePresence>
          </div>

          {/* Validation Hint Row */}
          <AnimatePresence mode="wait">
            {address.trim() && syncedValidation && (
              <motion.div
                key={syncedValidation.message}
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.2 }}
                className={`flex items-start gap-2.5 px-4 mb-8 text-left ${
                  syncedValidation.isValid ? 'text-emerald-400/60' : 'text-amber-400/60'
                }`}
              >
                {syncedValidation.isValid
                  ? <CheckCircle2 size={14} className="mt-0.5 shrink-0" />
                  : <AlertTriangle size={14} className="mt-0.5 shrink-0" />}
                <span className="text-xs font-medium">{syncedValidation.message}</span>
              </motion.div>
            )}
            {(!address.trim() || !syncedValidation) && (
              <div className="mb-8" />
            )}
          </AnimatePresence>

          {/* Rejection notice if user tries scanning invalid input */}
          <AnimatePresence>
            {attemptedScan && !canScan && address.trim() && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="p-4 mb-6 rounded-2xl bg-red-500/10 border border-red-500/20 flex items-center gap-3 text-left"
              >
                <XCircle size={20} className="text-red-400 shrink-0" />
                <div>
                  <div className="text-xs font-black uppercase tracking-widest text-red-300 mb-0.5">Scan Rejected</div>
                  <div className="text-xs text-red-400/60">{syncedValidation?.message ?? 'Invalid input. Fix the format to proceed.'}</div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Scan Results */}
          <AnimatePresence mode="wait">
            {!isAnimating && currentScan && currentScan.address === address.trim() && (
              <motion.div
                initial={{ opacity: 0, filter: 'blur(10px)', y: 20 }}
                animate={{ opacity: 1, filter: 'blur(0px)', y: 0 }}
                exit={{ opacity: 0, filter: 'blur(10px)', y: -20 }}
                className={`p-1 rounded-[2rem] bg-gradient-to-r ${
                  currentScan.level === 'danger' ? 'from-red-500/20 to-orange-500/20 border-red-500/30' : 
                  currentScan.level === 'warning' ? 'from-amber-500/20 to-yellow-500/20 border-amber-500/30' : 
                  'from-emerald-500/20 to-teal-500/20 border-emerald-500/30'
                } border backdrop-blur-3xl mb-12`}
              >
                <div className="px-10 py-8 flex items-center justify-between gap-6">
                  <div className="text-left flex-1">
                    <div className="text-[10px] font-black uppercase tracking-[0.3em] text-white/40 mb-2">Scan Result</div>
                    <div className={`text-2xl md:text-3xl font-black uppercase tracking-tight ${
                      currentScan.level === 'danger' ? 'text-red-400' : 
                      currentScan.level === 'warning' ? 'text-amber-400' : 
                      'text-emerald-400'
                    }`}>
                      {currentScan.level} Detected
                    </div>
                  </div>
                  
                  <div className="h-12 w-px bg-white/10 hidden md:block" />
                  
                  <div className="text-right flex-1">
                    <div className="text-[10px] font-black uppercase tracking-[0.3em] text-white/40 mb-2">Risk Score</div>
                    <div className="text-4xl md:text-5xl font-black text-white lining-nums">
                      {currentScan.score}%
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="mt-10 flex flex-wrap justify-center gap-6 md:gap-10 text-indigo-200/20 text-[10px] font-black uppercase tracking-[0.3em]">
             <div className="flex items-center gap-2.5">
               <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)] animate-pulse" />
               Live Chain Analysis
             </div>
             <div className="flex items-center gap-2.5">
               <div className="w-1.5 h-1.5 rounded-full bg-indigo-500/50" />
               Algorand Smart Guards
             </div>
             <div className="flex items-center gap-2.5">
               <div className="w-1.5 h-1.5 rounded-full bg-indigo-500/50" />
               Phishing Neural Net
             </div>
          </div>
        </motion.div>
      </div>
      
      <div className="absolute bottom-10 left-10 opacity-20 hidden lg:block">
        <Info size={16} className="text-white" />
      </div>
    </section>
  );
};

export default Hero;
