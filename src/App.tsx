import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import Home from './pages/Home';
import { NetworkMapPage } from './pages/NetworkMapPage';
import { RegistryPage } from './pages/RegistryPage';
import LoginPage from './pages/Auth/LoginPage';
import LogoutPage from './pages/Auth/LogoutPage';
import Scene from './components/visuals/Scene';
import ProtectedRoute from './components/auth/ProtectedRoute';

function App() {
  return (
    <BrowserRouter>
      <div className="flex flex-col min-h-screen relative overflow-hidden">
        <div className="fixed inset-0 -z-10 pointer-events-none">
          <Scene />
        </div>
        <Navbar />
        <main className="flex-grow relative z-10 pt-24">
          <Routes>
            <Route 
              path="/" 
              element={
                <ProtectedRoute>
                  <Home />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/networkmap" 
              element={
                <ProtectedRoute>
                  <NetworkMapPage />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/registry" 
              element={
                <ProtectedRoute>
                  <RegistryPage />
                </ProtectedRoute>
              } 
            />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/logout" element={<LogoutPage />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </BrowserRouter>
  );
}

export default App;
