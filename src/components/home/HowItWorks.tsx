import React from 'react';
import { motion } from 'framer-motion';
import { UserPlus, Wallet, ShieldCheck } from 'lucide-react';

const steps = [
  {
    title: "Connect Wallet",
    description: "Securely link your Algorand wallet (Pera, Defly, etc.) to the platform.",
    icon: Wallet
  },
  {
    title: "Configure Shield",
    description: "Set up your custom security parameters and choose what to protect.",
    icon: UserPlus
  },
  {
    title: "Active Protection",
    description: "Your assets are now shielded by our on-chain security protocols.",
    icon: ShieldCheck
  }
];

const HowItWorks = () => {
  return (
    <section id="how-it-works" className="py-24 px-6 bg-slate-900/50">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold mb-4">How It Works</h2>
          <p className="text-slate-400">Three simple steps to institutional-grade security.</p>
        </div>

        <div className="relative">
          {/* Connector Line (Desktop) */}
          <div className="hidden lg:block absolute top-1/2 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-indigo-500/20 to-transparent -translate-y-1/2 z-0" />
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 relative z-10">
            {steps.map((step, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.2 }}
                className="flex flex-col items-center text-center"
              >
                <div className="w-20 h-20 rounded-full bg-slate-950 border border-indigo-500/30 flex items-center justify-center mb-6 shadow-[0_0_30px_-10px_rgba(79,70,229,0.3)]">
                  <step.icon className="w-10 h-10 text-indigo-400" />
                  <div className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-indigo-600 flex items-center justify-center text-sm font-bold border-2 border-slate-900">
                    {index + 1}
                  </div>
                </div>
                <h3 className="text-xl font-bold mb-3">{step.title}</h3>
                <p className="text-slate-400 leading-relaxed max-w-xs">{step.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
