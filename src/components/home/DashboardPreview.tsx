import React from 'react';
import { motion } from 'framer-motion';
import { Layout, PieChart, Activity, ShieldAlert } from 'lucide-react';

const DashboardPreview = () => {
  return (
    <section className="py-24 px-6 overflow-hidden">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold mb-4">Powerful Simplicity</h2>
          <p className="text-slate-400">Our dashboard gives you full visibility without the clutter.</p>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="glass-card rounded-[2.5rem] p-4 lg:p-8 relative max-w-5xl mx-auto shadow-[0_0_100px_-20px_rgba(79,70,229,0.15)]"
        >
          {/* Header of Mockup */}
          <div className="flex items-center justify-between mb-8 pb-6 border-b border-white/5">
            <div className="flex gap-4">
              <div className="w-3 h-3 rounded-full bg-red-500/50" />
              <div className="w-3 h-3 rounded-full bg-amber-500/50" />
              <div className="w-3 h-3 rounded-full bg-emerald-500/50" />
            </div>
            <div className="glass-pill text-[10px] font-mono px-3 py-1 opacity-50 uppercase tracking-widest">
              Secured Connection: Mainnet-v3.1
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
            {/* Sidebar Mockup */}
            <div className="md:col-span-3 space-y-4">
              {[Layout, Activity, PieChart, ShieldAlert].map((Icon, i) => (
                <div key={i} className={`h-12 rounded-xl flex items-center gap-3 px-4 ${i === 0 ? 'bg-indigo-600/20 border border-indigo-500/30 text-white' : 'text-slate-500'}`}>
                  <Icon className="w-5 h-5" />
                  <div className={`h-2 rounded-full w-20 ${i === 0 ? 'bg-indigo-400/50' : 'bg-slate-700/30'}`} />
                </div>
              ))}
            </div>

            {/* Main Content Mockup */}
            <div className="md:col-span-9 space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="h-32 rounded-2xl bg-white/5 border border-white/10 p-4">
                  <div className="text-xs text-slate-500 uppercase tracking-wider mb-2">Total Shielded</div>
                  <div className="text-2xl font-bold">1,240.50 ALGO</div>
                </div>
                <div className="h-32 rounded-2xl bg-white/5 border border-white/10 p-4">
                  <div className="text-xs text-slate-500 uppercase tracking-wider mb-2">Security Status</div>
                  <div className="text-2xl font-bold text-emerald-400">Enhanced</div>
                </div>
              </div>
              <div className="h-64 rounded-2xl bg-white/5 border border-white/10 relative overflow-hidden">
                <div className="absolute inset-0 flex items-center justify-center">
                   <div className="w-full h-full p-8 flex flex-col justify-end gap-2">
                      <div className="flex items-end gap-1 h-32">
                         {[40, 70, 45, 90, 65, 80, 50, 95, 75, 60].map((h, i) => (
                           <div key={i} className="flex-1 bg-indigo-500/20 border-t border-indigo-500/40" style={{ height: `${h}%` }} />
                         ))}
                      </div>
                      <div className="text-[10px] text-slate-600 uppercase tracking-widest">Real-time Traffic Analysis</div>
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
