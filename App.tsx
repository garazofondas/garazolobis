
import React, { useState, useEffect, useMemo } from 'react';
import Header from './Header';
import Footer from './Footer';
import PartCard from './PartCard';
import UploadModal from './UploadModal';
import DetailModal from './DetailModal';
import SettingsModal from './SettingsModal';
import AIAssistantModal from './AIAssistantModal';
import { CloudDB } from './apiService';
import { Part } from './types';

const App: React.FC = () => {
  const [parts, setParts] = useState<Part[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [showAI, setShowAI] = useState(false);
  const [selectedPart, setSelectedPart] = useState<Part | null>(null);

  const loadParts = async () => {
    setIsLoading(true);
    try {
      const data = await CloudDB.fetchAllParts();
      setParts(data);
    } catch (error) {
      console.error("Nepavyko užkrauti dalių:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadParts();
    const hasUrl = !!localStorage.getItem('config_supabase_url');
    const hasPrompted = sessionStorage.getItem('settings_prompted');
    
    if (!hasUrl && !hasPrompted) {
      const timer = setTimeout(() => {
        setIsSettingsOpen(true);
        sessionStorage.setItem('settings_prompted', 'true');
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, []);

  const filteredParts = useMemo(() => {
    return parts.filter(p => 
      p.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.brand.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.category?.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [parts, searchTerm]);

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 selection:bg-orange-200">
      <Header 
        onSearch={setSearchTerm} 
        onAddClick={() => setIsUploadOpen(true)}
        onSettingsClick={() => setIsSettingsOpen(true)}
      />

      <main className="flex-1 max-w-7xl mx-auto px-6 py-12 w-full">
        <div className="flex flex-col md:flex-row justify-between items-end gap-6 mb-12">
          <div>
            <h2 className="text-5xl italic font-black text-slate-900 leading-none tracking-tighter uppercase">
              Garažo <span className="text-orange-600">Lobis</span>
            </h2>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.4em] mt-4">
              DETALĖS IR ĮRANKIAI IŠ ŽMONIŲ GARAŽŲ
            </p>
          </div>
          
          <button 
            onClick={() => setShowAI(true)}
            className="flex items-center gap-3 bg-slate-900 text-white px-6 py-4 rounded-2xl hover:bg-orange-600 transition-all shadow-xl group active:scale-95"
          >
            <div className="w-2.5 h-2.5 bg-emerald-500 rounded-full animate-pulse shadow-[0_0_10px_rgba(16,185,129,0.5)]"></div>
            <span className="text-[10px] font-black uppercase tracking-widest">AI Mechanikas</span>
          </button>
        </div>

        {isLoading ? (
          <div className="py-40 flex flex-col items-center justify-center space-y-6">
             <div className="w-16 h-16 border-[6px] border-slate-200 border-t-orange-600 rounded-full animate-spin"></div>
             <p className="text-[10px] font-black uppercase text-slate-400 tracking-[0.3em]">Kraunami lobių skrynios...</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6 animate-in fade-in duration-700">
            {filteredParts.map(part => (
              <PartCard key={part.id} part={part} onClick={setSelectedPart} />
            ))}
            {filteredParts.length === 0 && (
              <div className="col-span-full py-40 text-center border-4 border-dashed border-slate-200 rounded-[3rem]">
                <p className="text-slate-400 font-black italic text-sm uppercase tracking-widest">Šiuo metu nieko nerasta...</p>
              </div>
            )}
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
          onAddToCart={() => alert('Netrukus galėsite pirkti')}
          onMessage={() => alert('Žinutės bus pasiekiamos vėliau')}
          onNegotiate={() => alert('Derybos bus pasiekiamos vėliau')}
        />
      )}
      {showAI && <AIAssistantModal onClose={() => setShowAI(false)} availableParts={parts} onSelectPart={setSelectedPart} />}
    </div>
  );
};

export default App;
