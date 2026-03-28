import React from 'react';
import { motion } from 'framer-motion';
import { LucideIcon } from 'lucide-react';

interface FeatureCardProps {
  title: string;
  description: string;
  icon: LucideIcon;
  index: number;
}

const FeatureCard = ({ title, description, icon: Icon, index }: FeatureCardProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.1, duration: 0.5 }}
      whileHover={{ y: -5, scale: 1.02 }}
      className="glass-card p-8 rounded-3xl relative overflow-hidden group border border-white/5 hover:border-indigo-500/30 transition-all duration-300"
    >
      <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-600/10 blur-3xl -z-10 group-hover:bg-indigo-600/20 transition-colors" />
      
      <div className="w-12 h-12 rounded-xl bg-indigo-500/10 flex items-center justify-center mb-6 border border-indigo-500/20">
        <Icon className="w-6 h-6 text-indigo-400" />
      </div>
      
      <h3 className="text-xl font-semibold mb-3 text-white">{title}</h3>
      <p className="text-slate-400 leading-relaxed text-sm">
        {description}
      </p>
    </motion.div>
  );
};

export default FeatureCard;
