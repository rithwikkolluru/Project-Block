import React from 'react';
import { motion } from 'framer-motion';
import { useWallet } from '../../hooks/useWallet';
import { Wallet, Shield, Menu, X } from 'lucide-react';

const Navbar = () => {
  const { address, isConnected, connect, disconnect } = useWallet();
  const [isOpen, setIsOpen] = React.useState(false);

  const navLinks = [
    { name: 'Features', href: '#features' },
    { name: 'How It Works', href: '#how-it-works' },
    { name: 'Security', href: '#security' },
  ];

  return (
    <motion.nav 
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className="fixed top-0 left-0 right-0 z-50 px-6 py-4"
    >
      <div className="max-w-7xl mx-auto glass-pill flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center gap-2 cursor-pointer">
          <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center">
            <Shield className="w-5 h-5 text-white" />
          </div>
          <span className="font-bold text-lg tracking-tight hidden sm:block">BlockShield</span>
        </div>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <a 
              key={link.name} 
              href={link.href}
              className="text-sm font-medium text-slate-300 hover:text-white transition-colors"
            >
              {link.name}
            </a>
          ))}
        </div>

        {/* Wallet CTA */}
        <div className="flex items-center gap-4">
          <button
            onClick={isConnected ? disconnect : connect}
            className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-2 rounded-full text-sm font-semibold transition-all hover:scale-105 active:scale-95"
          >
            <Wallet className="w-4 h-4" />
            {isConnected ? `${address?.slice(0, 6)}...${address?.slice(-4)}` : 'Connect Wallet'}
          </button>
          
          <button className="md:hidden" onClick={() => setIsOpen(!isOpen)}>
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu (Skeleton) */}
      {isOpen && (
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="absolute top-20 left-6 right-6 glass-card rounded-2xl p-6 flex flex-col gap-4 md:hidden"
        >
          {navLinks.map((link) => (
            <a key={link.name} href={link.href} className="text-lg font-medium">{link.name}</a>
          ))}
        </motion.div>
      )}
    </motion.nav>
  );
};

export default Navbar;
