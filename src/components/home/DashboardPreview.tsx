import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Layout, PieChart, Activity, ShieldAlert, TrendingUp, CheckCircle2 } from 'lucide-react';

const DashboardPreview = () => {
  const [activeTab, setActiveTab] = useState(0);
  const [data, setData] = useState([40, 70, 45, 90, 65, 80, 50, 95, 75, 60]);

  // Simulate real-time data flow
  useEffect(() => {
    const interval = setInterval(() => {
      setData(prev => {
        const newData = [...prev.slice(1), Math.floor(Math.random() * 60) + 30];
        return newData;
      });
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  const stats = [
    { label: 'Total Shielded', value: '1,240.50 ALGO', icon: Layout, color: 'text-indigo-400' },
    { label: 'Security Status', value: 'Enhanced', icon: CheckCircle2, color: 'text-emerald-400' },
    { label: 'Threats Blocked', value: '12', icon: ShieldAlert, color: 'text-rose-400' },
    { label: 'Network Uptime', value: '99.99%', icon: Activity, color: 'text-sky-400' },
  ];

  const menuItems = [
    { Icon: Layout, label: 'Dashboard' },
    { Icon: Activity, label: 'Activity' },
    { Icon: PieChart, label: 'Analytics' },
    { Icon: ShieldAlert, label: 'Security' },
  ];

  return (
    <section className="py-24 px-6 overflow-hidden relative">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full bg-indigo-600/[0.02] blur-[120px] -z-10" />
      
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <motion.h2 
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            className="text-5xl md:text-6xl font-black mb-6 tracking-tighter"
          >
            Powerful <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-purple-400">Simplicity</span>
          </motion.h2>
          <p className="text-xl text-slate-400 max-w-2xl mx-auto font-medium">
            Full visibility, zero clutter. Manage your Algorand assets with institutional-grade security tools.
          </p>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="glass-card rounded-[3rem] p-4 lg:p-10 relative max-w-5xl mx-auto shadow-[0_0_100px_-20px_rgba(79,70,229,0.1)] border border-white/10"
        >
          {/* Header of Mockup */}
          <div className="flex items-center justify-between mb-10 pb-6 border-b border-white/5">
            <div className="flex gap-2">
              <div className="w-3 h-3 rounded-full bg-rose-500/30" />
              <div className="w-3 h-3 rounded-full bg-amber-500/30" />
              <div className="w-3 h-3 rounded-full bg-emerald-500/30" />
            </div>
            <div className="flex items-center gap-3">
              <div className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
              <div className="glass-pill text-[10px] font-black px-4 py-1.5 opacity-60 uppercase tracking-[0.2em] bg-white/5">
                Secured: Mainnet-v3.1
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
            {/* Sidebar Mockup */}
            <div className="lg:col-span-3 space-y-3">
              {menuItems.map(({ Icon, label }, i) => (
                <motion.button
                  key={i}
                  whileHover={{ x: 5 }}
                  onClick={() => setActiveTab(i)}
                  className={`w-full h-14 rounded-2xl flex items-center gap-4 px-5 transition-all ${
                    activeTab === i 
                      ? 'bg-indigo-600/20 border border-indigo-500/30 text-white shadow-lg' 
                      : 'text-slate-500 hover:text-slate-300 hover:bg-white/5'
                  }`}
                >
                  <Icon className={`w-5 h-5 ${activeTab === i ? 'text-indigo-400' : ''}`} />
                  <span className="text-xs font-bold uppercase tracking-widest">{label}</span>
                </motion.button>
              ))}
              
              <div className="pt-8 mt-8 border-t border-white/5 opacity-50">
                 <div className="p-4 rounded-2xl bg-indigo-500/10 border border-indigo-500/20">
                    <div className="text-[9px] font-black uppercase text-indigo-300 mb-2">Shield Status</div>
                    <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                       <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: '85%' }}
                        className="h-full bg-indigo-500 shadow-[0_0_10px_rgba(99,102,241,0.5)]" 
                       />
                    </div>
                 </div>
              </div>
            </div>

            {/* Main Content Mockup */}
            <div className="lg:col-span-9 space-y-8 text-left">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {stats.map((stat, i) => (
                  <motion.div 
                    key={i}
                    whileHover={{ y: -5, borderColor: 'rgba(255,255,255,0.2)' }}
                    className="group rounded-3xl bg-white/[0.03] border border-white/10 p-6 transition-all"
                  >
                    <div className="flex items-center justify-between mb-4">
                      <div className={`p-2 rounded-xl bg-white/5 ${stat.color}`}>
                        <stat.icon size={18} />
                      </div>
                      <TrendingUp size={14} className="text-emerald-500 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>
                    <div className="text-[10px] text-slate-500 font-black uppercase tracking-[0.2em] mb-1">{stat.label}</div>
                    <div className="text-2xl font-black tracking-tight">{stat.value}</div>
                  </motion.div>
                ))}
              </div>

              <div className="rounded-[2rem] bg-indigo-950/20 border border-indigo-500/10 p-8 relative overflow-hidden group">
                <div className="absolute top-0 right-0 p-8 opacity-10">
                  <Activity size={120} className="text-indigo-500" />
                </div>
                
                <div className="relative z-10">
                  <div className="flex items-center justify-between mb-8">
                     <h3 className="text-sm font-black uppercase tracking-[0.3em] text-indigo-200/50">Real-time Traffic Analysis</h3>
                     <div className="flex items-center gap-4 text-[10px] font-bold text-slate-500">
                        <div className="flex items-center gap-1.5">
                          <div className="w-2 h-2 rounded-full bg-indigo-500" /> Inbound
                        </div>
                        <div className="flex items-center gap-1.5">
                          <div className="w-2 h-2 rounded-full bg-white/10" /> Outbound
                        </div>
                     </div>
                  </div>
                  
                  <div className="flex items-end gap-2 h-40">
                    {data.map((h, i) => (
                      <motion.div
                        key={i}
                        layout
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1, scaleY: 1 }}
                        className="flex-1 bg-gradient-to-t from-indigo-600/40 to-indigo-400/10 border-t border-indigo-400/30 rounded-t-sm origin-bottom"
                        style={{ height: `${h}%` }}
                      />
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default DashboardPreview;
