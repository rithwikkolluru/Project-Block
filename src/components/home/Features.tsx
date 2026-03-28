import React from 'react';
import FeatureCard from '../ui/FeatureCard';
import { Shield, Zap, Globe, Lock } from 'lucide-react';
import { motion } from 'framer-motion';

const Features = () => {
  const features = [
    {
      title: "Algorand Security",
      description: "Leverage the power of the Algorand blockchain for immutable, tamper-proof security protocols.",
      icon: Shield
    },
    {
      title: "Instant Verification",
      description: "Fast transaction speeds and near-instant finality for all your security operations.",
      icon: Zap
    },
    {
      title: "Decentralized Identity",
      description: "Maintain full control over your data with advanced decentralized identity solutions.",
      icon: Globe
    },
    {
      title: "Quantum Resilience",
      description: "Built with future-proof algorithms to stay ahead of emerging computational threats.",
      icon: Lock
    }
  ];

  return (
    <section id="features" className="py-24 px-6 relative overflow-hidden">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl lg:text-5xl font-bold mb-4"
          >
            Why Choose <span className="gradient-text">BlockShield?</span>
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-slate-400 text-lg max-w-2xl mx-auto"
          >
            We combine cutting-edge cryptography with the world's most efficient blockchain to provide unparalleled protection.
          </motion.p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => (
            <FeatureCard 
              key={index}
              index={index}
              {...feature}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;
