import React from 'react';
import { GravityProvider } from './GravityProvider';
import { GravityHero } from './components/GravityHero';
import { RiskNebula } from './components/RiskNebula';
import { StellarHistory } from './components/StellarHistory';
import { ScamRegistry } from './components/ScamRegistry';
import { MobilePhysics } from './components/MobilePhysics';

function App() {
  return (
    <GravityProvider>
      <main className="min-h-screen relative overflow-hidden bg-cosmic-gradient">
        {/* Core gravity wrapper */}
        <div className="max-w-screen-2xl mx-auto">
          <MobilePhysics />
          <nav className="p-6 flex items-center justify-between border-b border-white/5 relative z-20">
            <div className="font-bold text-xl tracking-tighter text-white flex items-center gap-2">
              <span className="w-4 h-4 rounded-full bg-gravityAccent animate-pulse" />
              CryptoShield
            </div>
            <div className="flex gap-6 text-sm text-white/50">
              <a href="#" className="hover:text-white transition">Network Map</a>
              <a href="#" className="hover:text-white transition">Registry</a>
              <a href="#" className="hover:text-white transition">API Integration</a>
            </div>
          </nav>
          
          <GravityHero />
          <RiskNebula />
          <StellarHistory />
          <ScamRegistry />
        </div>
      </main>
    </GravityProvider>
  );
}

export default App;
