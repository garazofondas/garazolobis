
import React, { useState, useMemo, useEffect } from 'react';
import Header from './components/Header';
import Footer from './components/Footer';
import PartCard from './components/PartCard';
import UploadModal from './components/UploadModal';
import DetailModal from './components/DetailModal';
import GarageModal from './components/GarageModal';
import AuthModal from './components/AuthModal';
import SettingsModal from './components/SettingsModal';
import AIAssistantModal from './components/AIAssistantModal';
import { CloudDB } from './apiService';
import { Part, Vehicle } from './types';

const App: React.FC = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [showAI, setShowAI] = useState(false);
  
  const [parts, setParts] = useState<Part[]>([]);
  const [favorites, setFavorites] = useState<string[]>([]);
  const [myGarage, setMyGarage] = useState<Vehicle[]>([]);
  const [activeVehicleId, setActiveVehicleId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [isGarageModalOpen, setIsGarageModalOpen] = useState(false);
  const [selectedPart, setSelectedPart] = useState<Part | null>(null);

  const loadData = async () => {
    setIsLoading(true);
    try {
      const remoteParts = await CloudDB.fetchAllParts();
      setParts(remoteParts);
    } catch (err) {
      console.error("Fetch error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
    const hasConfig = localStorage.getItem('config_supabase_url');
    if (!hasConfig) {
      const timer = setTimeout(() => setIsSettingsOpen(true), 1500);
      return () => clearTimeout(timer);
    }
  }, []);

  const activeVehicle = useMemo(() => myGarage.find(v => v.id === activeVehicleId) || null, [myGarage, activeVehicleId]);

  const filteredParts = useMemo(() => {
    return parts.filter(part => {
      const term = searchTerm.toLowerCase();
      return part.title.toLowerCase().includes(term) || 
             part.brand.toLowerCase().includes(term) ||
             part.category.toLowerCase().includes(term);
    });
  }, [parts, searchTerm]);

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 selection:bg-orange-200">
      <Header 
        isLoggedIn={isLoggedIn}
        onAuthClick={() => setShowAuthModal(true)}
        onAddClick={() => setIsUploadModalOpen(true)} 
        onGarageClick={() => setIsGarageModalOpen(true)}
        onSearch={setSearchTerm}
        onManualClick={() => {}}
        activeVehicle={activeVehicle}
        viewMode="buy"
        onViewModeChange={() => {}}
        walletBalance={0}
        notifications={[]}
        onNotificationClick={() => {}}
        onSettingsClick={() => setIsSettingsOpen(true)}
      />

      <main className="flex-1 max-w-7xl mx-auto px-6 py-16 w-full">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-40">
            <div className="w-12 h-12 border-4 border-slate-200 border-t-orange-600 rounded-full animate-spin mb-4"></div>
            <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest text-center">Kraunami garažo lobiai...</p>
          </div>
        ) : (
          <>
            <div className="mb-10 flex flex-col sm:flex-row justify-between items-start sm:items-end gap-6">
              <div>
                <h2 className="text-4xl font-black text-slate-900 uppercase italic tracking-tighter leading-none">LOBIAI <br/><span className="text-orange-600">PROJEKTUI</span></h2>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-3">Iš žmonių garažų - į tavo garažą</p>
              </div>
              <button 
                onClick={() => setShowAI(true)}
                className="bg-slate-900 text-white p-5 rounded-3xl hover:bg-orange-600 transition-all shadow-xl flex items-center gap-3 group"
              >
                <div className="relative">
                  <svg className="w-6 h-6 group-hover:animate-bounce" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                  <span className="absolute -top-1 -right-1 w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></span>
                </div>
                <span className="text-[10px] font-black uppercase tracking-widest">AI Mechanikas</span>
              </button>
            </div>
            
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-8 animate-in fade-in duration-700">
              {filteredParts.map(part => (
                <PartCard 
                  key={part.id} 
                  part={part} 
                  onClick={setSelectedPart} 
                  isFavorite={favorites.includes(part.id)}
                  onToggleFavorite={(e, id) => { 
                    e.stopPropagation(); 
                    setFavorites(prev => prev.includes(id) ? prev.filter(f => f !== id) : [...prev, id]); 
                  }}
                />
              ))}
            </div>
            {filteredParts.length === 0 && (
              <div className="py-40 text-center border-4 border-dashed border-slate-200 rounded-[3rem]">
                <p className="text-slate-400 font-black uppercase italic tracking-widest text-xs">Šiuo metu tokių dalių garaže nerasta</p>
              </div>
            )}
          </>
        )}
      </main>

      <Footer />

      {isSettingsOpen && <SettingsModal onClose={() => setIsSettingsOpen(false)} />}
      {isUploadModalOpen && (
        <UploadModal 
          onClose={() => setIsUploadModalOpen(false)} 
          onAdd={async (p) => { 
            await CloudDB.savePart(p); 
            loadData(); 
            setIsUploadModalOpen(false); 
          }} 
        />
      )}
      {selectedPart && <DetailModal part={selectedPart} onClose={() => setSelectedPart(null)} onAddToCart={() => {}} onMessage={() => {}} onNegotiate={() => {}} />}
      {showAuthModal && <AuthModal onClose={() => setShowAuthModal(false)} onSuccess={() => { setIsLoggedIn(true); setShowAuthModal(false); }} />}
      {isGarageModalOpen && (
        <GarageModal 
          vehicles={myGarage} 
          activeVehicleId={activeVehicleId} 
          onClose={() => setIsGarageModalOpen(false)} 
          onAdd={(v) => setMyGarage(prev => [...prev, { ...v, id: Date.now().toString() }])} 
          onSelect={setActiveVehicleId} 
          onRemove={(id) => setMyGarage(prev => prev.filter(v => v.id !== id))} 
        />
      )}
      {showAI && <AIAssistantModal onClose={() => setShowAI(false)} availableParts={parts} onSelectPart={setSelectedPart} />}
    </div>
  );
};

export default App;
