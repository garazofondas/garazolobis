
import React, { useState, useMemo, useEffect } from 'react';
import Header from './components/Header';
import PartCard from './components/PartCard';
import UploadModal from './components/UploadModal';
import DetailModal from './components/DetailModal';
import GarageModal from './components/GarageModal';
import OrderInstructions from './components/OrderInstructions';
import AuthModal from './components/AuthModal';
import ChatModal from './components/ChatModal';
import CheckoutModal from './components/CheckoutModal';
import WithdrawModal from './components/WithdrawModal';
import RatingModal from './components/RatingModal';
import NegotiateModal from './components/NegotiateModal';
import ManualModal from './components/ManualModal';
import { CloudDB } from './apiService';
import { Part, Vehicle, Order, OrderStatus, Chat, Message, AppNotification } from './types';

type ViewMode = 'buy' | 'sell' | 'inbox' | 'wallet' | 'favorites' | 'notifications';

const App: React.FC = () => {
  const [viewMode, setViewMode] = useState<ViewMode>('buy');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [isManualOpen, setIsManualOpen] = useState(false);
  
  const [parts, setParts] = useState<Part[]>([]);
  const [favorites, setFavorites] = useState<string[]>(() => {
    const saved = localStorage.getItem('my_favorites');
    return saved ? JSON.parse(saved) : [];
  });
  const [notifications] = useState<AppNotification[]>([]);

  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory] = useState<string | null>(null);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [isGarageModalOpen, setIsGarageModalOpen] = useState(false);
  const [selectedPart, setSelectedPart] = useState<Part | null>(null);
  const [showNegotiate, setShowNegotiate] = useState<Part | null>(null);
  const [activeOrder, setActiveOrder] = useState<Order | null>(null);
  const [showCheckout, setShowCheckout] = useState<Part | null>(null);
  const [showWithdraw, setShowWithdraw] = useState(false);
  
  const [walletBalance, setWalletBalance] = useState(145.00);
  const [chats, setChats] = useState<Chat[]>([]);
  const [activeChat, setActiveChat] = useState<Chat | null>(null);

  const [myGarage, setMyGarage] = useState<Vehicle[]>(() => {
    const saved = localStorage.getItem('my_garage');
    return saved ? JSON.parse(saved) : [];
  });
  const [activeVehicleId, setActiveVehicleId] = useState<string | null>(() => {
    return localStorage.getItem('active_vehicle_id');
  });

  useEffect(() => {
    console.log("🛠️ Garažo Lobis užsikūrė sėkmingai!");
    const loadData = async () => {
      setIsLoading(true);
      const remoteParts = await CloudDB.fetchAllParts();
      setParts(remoteParts);
      setIsLoading(false);
    };
    loadData();
    
    if (!localStorage.getItem('manual_seen')) {
      setIsManualOpen(true);
      localStorage.setItem('manual_seen', 'true');
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('my_favorites', JSON.stringify(favorites));
    localStorage.setItem('my_garage', JSON.stringify(myGarage));
    if (activeVehicleId) localStorage.setItem('active_vehicle_id', activeVehicleId);
  }, [favorites, myGarage, activeVehicleId]);

  const activeVehicle = useMemo(() => 
    myGarage.find(v => v.id === activeVehicleId) || null
  , [myGarage, activeVehicleId]);

  const filteredParts = useMemo(() => {
    return parts.filter(part => {
      if (viewMode === 'sell') return part.seller.name === 'Mano Garažas';
      if (viewMode === 'favorites') return favorites.includes(part.id);
      
      const term = searchTerm.toLowerCase();
      const matchesSearch = 
        part.title.toLowerCase().includes(term) ||
        part.brand.toLowerCase().includes(term) ||
        (part.partCode && part.partCode.toLowerCase().includes(term));
        
      const matchesCategory = !selectedCategory || part.category === selectedCategory;
      let matchesGarage = true;
      if (activeVehicle && viewMode === 'buy') {
        matchesGarage = part.compatibility.brand.toLowerCase() === activeVehicle.brand.toLowerCase();
      }
      return matchesSearch && matchesCategory && matchesGarage;
    });
  }, [parts, searchTerm, selectedCategory, activeVehicle, viewMode, favorites]);

  const handleAddPart = async (newPart: Part) => {
    setIsLoading(true);
    await CloudDB.savePart(newPart);
    setParts(prev => [newPart, ...prev]);
    setIsUploadModalOpen(false);
    setViewMode('sell');
    setIsLoading(false);
  };

  const handleOpenChat = (part: Part) => {
    if (!isLoggedIn) { setShowAuthModal(true); return; }
    setSelectedPart(null);
    let existingChat = chats.find(c => c.part.id === part.id);
    if (!existingChat) {
      existingChat = {
        id: Math.random().toString(36).substr(2, 9),
        part: part,
        buyer: { name: 'Mano Garažas', rating: 5, avatar: '', reviewCount: 0 },
        messages: [],
        lastMessageAt: new Date().toISOString()
      };
      setChats(prev => [...prev, existingChat!]);
    }
    setActiveChat(existingChat);
  };

  const handleOffer = (part: Part, amount: number) => {
    handleOpenChat(part);
    const offerMsg = `Sveiki, siūlau €${amount} už šią dalį. Ar sutiktumėte?`;
    handleSendMessage(offerMsg);
    setShowNegotiate(null);
  };

  const handleSendMessage = (text: string) => {
    if (!activeChat) return;
    const newMessage: Message = {
      id: Date.now().toString(),
      senderId: 'me',
      text,
      timestamp: new Date().toISOString()
    };
    const updatedChat = {
      ...activeChat,
      messages: [...activeChat.messages, newMessage],
      lastMessageAt: new Date().toISOString()
    };
    setChats(prev => prev.map(c => c.id === activeChat.id ? updatedChat : c));
    setActiveChat(updatedChat);
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Header 
        isLoggedIn={isLoggedIn}
        onAuthClick={() => setShowAuthModal(true)}
        onAddClick={() => isLoggedIn ? setIsUploadModalOpen(true) : setShowAuthModal(true)} 
        onGarageClick={() => setIsGarageModalOpen(true)}
        onSearch={setSearchTerm}
        onManualClick={() => setIsManualOpen(true)}
        activeVehicle={activeVehicle}
        viewMode={viewMode}
        onViewModeChange={(mode) => setViewMode(mode as any)}
        walletBalance={walletBalance}
        notifications={notifications}
        onNotificationClick={() => setViewMode('notifications' as any)}
      />

      <main className="flex-1 max-w-7xl mx-auto px-4 py-6 w-full">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-20">
             <div className="w-12 h-12 border-4 border-orange-200 border-t-orange-600 rounded-full animate-spin mb-4"></div>
             <p className="font-black text-xs uppercase text-slate-400 tracking-widest">Atidarom garažo vartus...</p>
          </div>
        ) : viewMode === 'inbox' ? (
          <div className="max-w-4xl mx-auto space-y-4 animate-in fade-in slide-in-from-bottom-4">
             <h2 className="text-2xl font-black text-slate-900 uppercase italic mb-6">Žinutės</h2>
             {chats.length === 0 ? (
               <div className="bg-white p-12 rounded-3xl border border-dashed border-slate-300 text-center text-slate-400">
                  <p className="font-black uppercase tracking-widest text-xs">Kol kas žinučių nėra</p>
               </div>
             ) : (
               chats.map(chat => (
                 <div 
                   key={chat.id} 
                   onClick={() => setActiveChat(chat)}
                   className="bg-white p-4 rounded-2xl border border-slate-200 flex items-center gap-4 cursor-pointer hover:border-orange-500 transition-all"
                 >
                    <img src={chat.part.imageUrl} className="w-16 h-16 rounded-xl object-cover" />
                    <div className="flex-1">
                       <h4 className="font-bold text-slate-900">{chat.part.title}</h4>
                       <p className="text-xs text-slate-500">{chat.messages[chat.messages.length-1]?.text || 'Pradėkite pokalbį'}</p>
                    </div>
                    <div className="text-[10px] font-black text-slate-400 uppercase">{new Date(chat.lastMessageAt).toLocaleDateString()}</div>
                 </div>
               ))
             )}
          </div>
        ) : (
          <>
            {filteredParts.length === 0 ? (
              <div className="text-center py-20 bg-white rounded-3xl border-2 border-dashed border-slate-100">
                <p className="text-slate-400 font-black uppercase text-xs tracking-widest">Šiuo metu nieko nerasta</p>
                <button onClick={() => {setSearchTerm(''); setViewMode('buy');}} className="mt-4 text-orange-600 font-bold uppercase text-[10px] tracking-widest hover:underline">Rodyti viską</button>
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                {filteredParts.map(part => (
                  <PartCard 
                    key={part.id} 
                    part={part} 
                    onClick={setSelectedPart} 
                    isFavorite={favorites.includes(part.id)}
                    onToggleFavorite={(e, id) => { e.stopPropagation(); setFavorites(prev => prev.includes(id) ? prev.filter(f => f !== id) : [...prev, id]); }}
                  />
                ))}
              </div>
            )}
          </>
        )}
      </main>

      {/* Modals */}
      {isManualOpen && <ManualModal onClose={() => setIsManualOpen(false)} />}
      {isUploadModalOpen && <UploadModal onClose={() => setIsUploadModalOpen(false)} onAdd={handleAddPart} />}
      {selectedPart && (
        <DetailModal 
          part={selectedPart} 
          onClose={() => setSelectedPart(null)} 
          onAddToCart={(p) => { setSelectedPart(null); setShowCheckout(p); }} 
          onMessage={handleOpenChat} 
          onNegotiate={(p) => setShowNegotiate(p)} 
        />
      )}
      {showNegotiate && <NegotiateModal part={showNegotiate} onClose={() => setShowNegotiate(null)} onSubmitOffer={(amt) => handleOffer(showNegotiate, amt)} />}
      {showCheckout && <CheckoutModal part={showCheckout} onClose={() => setShowCheckout(null)} onComplete={() => {
        setActiveOrder({ id: 'ORD-'+Date.now(), part: showCheckout, status: OrderStatus.PENDING_SHIPMENT, shippingCode: '778-991', createdAt: new Date().toISOString(), lockerType: 'Omniva' });
        setShowCheckout(null);
      }} />}
      {activeOrder && <OrderInstructions order={activeOrder} onClose={() => setActiveOrder(null)} />}
      {showAuthModal && <AuthModal onClose={() => setShowAuthModal(false)} onSuccess={() => { setIsLoggedIn(true); setShowAuthModal(false); }} />}
      {isGarageModalOpen && (
        <GarageModal 
          vehicles={myGarage} 
          activeVehicleId={activeVehicleId} 
          onClose={() => setIsGarageModalOpen(false)} 
          onAdd={(v) => setMyGarage(prev => [...prev, { ...v, id: Date.now().toString() }])} 
          onSelect={(id) => setActiveVehicleId(id)} 
          onRemove={(id) => { setMyGarage(prev => prev.filter(v => v.id !== id)); if(activeVehicleId === id) setActiveVehicleId(null); }} 
        />
      )}
      {activeChat && <ChatModal chat={activeChat} onClose={() => setActiveChat(null)} onSend={handleSendMessage} />}
      {viewMode === 'wallet' && (
        <div className="max-w-3xl mx-auto p-6">
           <div className="bg-slate-900 rounded-3xl p-8 text-white shadow-2xl">
              <h4 className="text-[10px] font-black uppercase text-slate-400 tracking-widest mb-2">Tavo balansas</h4>
              <h2 className="text-5xl font-black mb-8 tracking-tighter">€{walletBalance.toFixed(2)}</h2>
              <button onClick={() => setShowWithdraw(true)} className="bg-orange-600 hover:bg-orange-700 transition-all px-8 py-4 rounded-2xl font-black uppercase text-xs tracking-widest shadow-lg shadow-orange-900/40">Išsigryninti į banką</button>
           </div>
        </div>
      )}
      {showWithdraw && (
        <WithdrawModal 
          balance={walletBalance} 
          initialIban="" 
          onClose={() => setShowWithdraw(false)} 
          onWithdraw={(amt) => { setWalletBalance(prev => prev - amt); setShowWithdraw(false); alert('Pervedimas sėkmingai pradėtas!'); }} 
        />
      )}
    </div>
  );
};

export default App;
