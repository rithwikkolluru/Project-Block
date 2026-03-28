import React from 'react';
import { motion } from 'framer-motion';
import { Wallet, FileCode, Repeat, Globe } from 'lucide-react';

export type ScanType = 'wallet' | 'contract' | 'transaction' | 'url';

interface ScanTabsProps {
  activeTab: ScanType;
  onTabChange: (tab: ScanType) => void;
}

const tabs = [
  { id: 'wallet', label: 'Wallet', icon: Wallet },
  { id: 'contract', label: 'Contract', icon: FileCode },
  { id: 'transaction', label: 'Transaction', icon: Repeat },
  { id: 'url', label: 'Phishing Check', icon: Globe },
] as const;

const ScanTabs: React.FC<ScanTabsProps> = ({ activeTab, onTabChange }) => {
  return (
    <div className="flex flex-wrap justify-center gap-2 mb-8 p-1.5 glass-card rounded-2xl bg-white/5 border-white/10 max-w-fit mx-auto">
      {tabs.map((tab) => {
        const isActive = activeTab === tab.id;
        const Icon = tab.icon;
        
        return (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id as ScanType)}
            className={`
              relative flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-bold transition-all duration-300
              ${isActive ? 'text-white' : 'text-indigo-200/40 hover:text-indigo-200/60 hover:bg-white/5'}
            `}
          >
            {isActive && (
              <motion.div
                layoutId="activeScanTab"
                className="absolute inset-0 bg-indigo-600 rounded-xl -z-10 shadow-[0_0_15px_rgba(79,70,229,0.5)]"
                transition={{ type: 'spring', bounce: 0.2, duration: 0.6 }}
              />
            )}
            <Icon size={16} className={isActive ? 'text-white' : 'text-indigo-400/50'} />
            <span className="whitespace-nowrap">{tab.label}</span>
          </button>
        );
      })}
    </div>
  );
};

export default ScanTabs;
