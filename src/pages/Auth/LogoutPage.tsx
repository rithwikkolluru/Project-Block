import { useEffect } from 'react';
import { motion } from 'framer-motion';
import { Shield, LogOut } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useWallet } from '../../hooks/useWallet';

const LogoutPage: React.FC = () => {
  const navigate = useNavigate();
  const { disconnect } = useWallet();

  useEffect(() => {
    // Clear the session immediately
    disconnect();
    // Then redirect to login after a brief confirmation delay
    const timer = setTimeout(() => {
      navigate('/login', { replace: true });
    }, 2000);
    return () => clearTimeout(timer);
  }, [navigate, disconnect]);

  return (
    <div className="min-h-screen flex items-center justify-center p-6 relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-indigo-600/5 blur-[120px] rounded-full" />
      </div>

      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-md glass-card rounded-[2.5rem] p-12 text-center border border-white/10 shadow-3xl flex flex-col items-center"
      >
        {/* Spinning ring + icon */}
        <div className="w-20 h-20 rounded-full bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center mb-8 relative">
          <motion.div 
            initial={{ rotate: 0 }}
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
            className="absolute inset-0 border-2 border-indigo-500/20 border-t-indigo-500 rounded-full"
          />
          <LogOut className="w-8 h-8 text-indigo-400" />
        </div>

        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 mb-6">
          <Shield className="w-3.5 h-3.5 text-indigo-400" />
          <span className="text-[10px] font-black uppercase tracking-[0.2em] text-indigo-300">BlockShield</span>
        </div>

        <h1 className="text-3xl font-black text-white tracking-tight mb-4">Signing Out...</h1>
        <p className="text-indigo-200/40 font-medium mb-10">
          Your secure session is being cleared. <br />
          You'll be redirected to the login screen.
        </p>

        {/* Animated progress bar */}
        <div className="w-full h-1 bg-white/5 rounded-full overflow-hidden">
          <motion.div 
            initial={{ width: '0%' }}
            animate={{ width: '100%' }}
            transition={{ duration: 2, ease: 'linear' }}
            className="h-full bg-gradient-to-r from-indigo-500 to-violet-500"
          />
        </div>
      </motion.div>
    </div>
  );
};

export default LogoutPage;
