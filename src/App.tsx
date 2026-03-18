import React from 'react';
import { BrowserRouter, Routes, Route, Link, useLocation } from 'react-router-dom';
import { GravityProvider } from './GravityProvider';
import { GravityHero } from './components/GravityHero';
import { RiskNebula } from './components/RiskNebula';
import { StellarHistory } from './components/StellarHistory';
import { ScamRegistry as OriginalScamRegistry } from './components/ScamRegistry';
import { MobilePhysics } from './components/MobilePhysics';
import { NetworkMapPage } from './pages/NetworkMapPage';
import { RegistryPage } from './pages/RegistryPage';

const Navigation = () => {
  const location = useLocation();
  
  const isActive = (path: string) => 
    location.pathname === path ? 'text-white font-bold drop-shadow-[0_0_8px_rgba(255,255,255,0.8)]' : 'text-white/50 hover:text-white';

  return (
    <nav className="p-6 flex items-center justify-between border-b border-white/5 relative z-20 w-full mb-4">
      <Link to="/" className="font-bold text-xl tracking-tighter text-white flex items-center gap-2 cursor-pointer transition-all hover:scale-105">
        <span className="w-4 h-4 rounded-full bg-gravityAccent animate-pulse shadow-[0_0_10px_#6366F1]" />
        CryptoShield
      </Link>
      <div className="flex gap-6 items-center text-sm uppercase tracking-wider font-semibold">
        <Link to="/" className={`transition-all ${isActive('/')}`}>Scanner</Link>
        <Link to="/networkmap" className={`transition-all ${isActive('/networkmap')}`}>Network Map</Link>
        <Link to="/registry" className={`transition-all border px-4 py-1.5 rounded border-white/20 hover:border-gravityAccent hover:bg-white/5 ${isActive('/registry')}`}>Registry</Link>
      </div>
    </nav>
  );
};

const HomePage = () => (
  <>
    <GravityHero />
    <RiskNebula />
    <StellarHistory />
    <OriginalScamRegistry />
  </>
);

function App() {
  return (
    <GravityProvider>
      <BrowserRouter>
        <main className="min-h-screen relative overflow-x-hidden bg-cosmic-gradient flex flex-col">
          {/* Core gravity wrapper */}
          <div className="max-w-screen-2xl mx-auto w-full flex flex-col flex-grow relative">
            <MobilePhysics />
            <Navigation />
            
            <div className="flex flex-col flex-grow w-full relative">
              <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/networkmap" element={<NetworkMapPage />} />
                <Route path="/registry" element={<RegistryPage />} />
              </Routes>
            </div>
          </div>
        </main>
      </BrowserRouter>
    </GravityProvider>
  );
}

export default App;
