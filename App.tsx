
import React, { useState, useEffect, useMemo } from 'react';
import Header from './components/Header';
import Footer from './components/Footer';
import PartCard from './components/PartCard';
import UploadModal from './components/UploadModal';
import DetailModal from './components/DetailModal';
import SettingsModal from './components/SettingsModal';
import { CloudDB } from './apiService';
import { Part } from './types';

const App: React.FC = () => {
  const [parts, setParts] = useState<Part[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [selectedPart, setSelectedPart] = useState<Part | null>(null);

  const loadParts = async () => {
    setIsLoading(true);
    const data = await CloudDB.fetchAllParts();
    setParts(data);
    setIsLoading(false);
  };

  useEffect(() => {
    loadParts();
    if (!localStorage.getItem('config_supabase_url')) {
      setTimeout(() => setIsSettingsOpen(true), 1500);
    }
  }, []);

  const filteredParts = useMemo(() => {
    return parts.filter(p => 
      p.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.brand.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [parts, searchTerm]);

  // Added handler for adding part to cart
  const handleAddToCart = (part: Part) => {
    alert(`Saugus pirkimas pradėtas: ${part.title}`);
    setSelectedPart(null);
  };

  // Added handler for messaging seller
  const handleMessage = (part: Part) => {
    alert(`Pokalbis su pardavėju pradėtas: ${part.title}`);
    setSelectedPart(null);
  };

  // Added handler for price negotiation
  const handleNegotiate = (part: Part) => {
    alert(`Derybos pradėtos: ${part.title}`);
    setSelectedPart(null);
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Header 
        onSearch={setSearchTerm} 
        onAddClick={() => setIsUploadOpen(true)}
        onSettingsClick={() => setIsSettingsOpen(true)}
      />

      <main className="flex-1 max-w-7xl mx-auto px-6 py-12 w-full">
        <div className="mb-10">
          <h2 className="text-4xl font-black text-slate-900 uppercase italic tracking-tighter">GARAŽO <span className="text-orange-600">LOBIAI</span></h2>
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] mt-2">Atliekamos dalys ir įrankiai tavo projektui</p>
        </div>

        {isLoading ? (
          <div className="py-40 text-center text-slate-400 font-black uppercase tracking-widest text-xs animate-pulse">Kraunamas turgus...</div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
            {filteredParts.map(part => (
              <PartCard key={part.id} part={part} onClick={setSelectedPart} />
            ))}
          </div>
        )}
      </main>

      <Footer />

      {isSettingsOpen && <SettingsModal onClose={() => setIsSettingsOpen(false)} />}
      {isUploadOpen && <UploadModal onClose={() => setIsUploadOpen(false)} onAdd={loadParts} />}
      {selectedPart && (
        <DetailModal 
          part={selectedPart} 
          onClose={() => setSelectedPart(null)} 
          onAddToCart={handleAddToCart}
          onMessage={handleMessage}
          onNegotiate={handleNegotiate}
        />
      )}
    </div>
  );
};

export default App;
