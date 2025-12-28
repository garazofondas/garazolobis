
import React, { useState, useMemo, useEffect } from 'react';
import Header from './components/Header';
import Footer from './components/Footer';
import PartCard from './components/PartCard';
import UploadModal from './components/UploadModal';
import DetailModal from './components/DetailModal';
import GarageModal from './components/GarageModal';
import OrderInstructions from './components/OrderInstructions';
import AuthModal from './components/AuthModal';
import ChatModal from './components/ChatModal';
import CheckoutModal from './components/CheckoutModal';
import WithdrawModal from './components/WithdrawModal';
import NegotiateModal from './components/NegotiateModal';
import ManualModal from './components/ManualModal';
import AIAssistantModal from './components/AIAssistantModal';
import { CloudDB, ShippingAPI } from './apiService';
import { Part, Vehicle, Order, OrderStatus, Chat, Message, AppNotification, Locker } from './types';

type ViewMode = 'buy' | 'sell' | 'inbox' | 'wallet' | 'favorites' | 'notifications' | 'orders';

const App: React.FC = () => {
  const [viewMode, setViewMode] = useState<ViewMode>('buy');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [isManualOpen, setIsManualOpen] = useState(false);
  const [isAIActive, setIsAIActive] = useState(false);
  
  const [parts, setParts] = useState<Part[]>([]);
  const [favorites, setFavorites] = useState<string[]>(() => {
    const saved = localStorage.getItem('my_favorites');
    return saved ? JSON.parse(saved) : [];
  });
  
  const [myOrders, setMyOrders] = useState<Order[]>(() => {
    const saved = localStorage.getItem('my_orders');
    return saved ? JSON.parse(saved) : [];
  });

  const [notifications] = useState<AppNotification[]>([
    { id: '1', title: 'Sveiki atvykę!', message: 'Tavo garažas paruoštas lobiams. Iškelk pirmą detalę jau dabar!', type: 'match', read: false, timestamp: new Date().toISOString() }
  ]);

  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [isGarageModalOpen, setIsGarageModalOpen] = useState(false);
  const [selectedPart, setSelectedPart] = useState<Part | null>(null);
  const [showNegotiate, setShowNegotiate] = useState<Part | null>(null);
  const [activeOrder, setActiveOrder] = useState<Order | null>(null);
  const [showCheckout, setShowCheckout] = useState<Part | null>(null);
  const [showWithdraw, setShowWithdraw] = useState(false);
  
  const [walletBalance, setWalletBalance] = useState(() => {
    const saved = localStorage.getItem('wallet_balance');
    return saved ? parseFloat(saved) : 0.00;
  });

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
    localStorage.setItem('wallet_balance', walletBalance.toString());
    localStorage.setItem('my_orders', JSON.stringify(myOrders));
    if (activeVehicleId) localStorage.setItem('active_vehicle_id', activeVehicleId);
  }, [favorites, myGarage, activeVehicleId, walletBalance, myOrders]);

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
        
      let matchesGarage = true;
      if (activeVehicle && viewMode === 'buy') {
        matchesGarage = part.compatibility.brand.toLowerCase() === activeVehicle.brand.toLowerCase();
      }
      return matchesSearch && matchesGarage;
    });
  }, [parts, searchTerm, activeVehicle, viewMode, favorites]);

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

  const handleCheckoutComplete = (locker: Locker, method: any) => {
    if (!showCheckout) return;
    const newOrder: Order = {
      id: 'ORD-'+Date.now(),
      part: showCheckout,
      status: OrderStatus.AWAITING_REGISTRATION,
      shippingCode: Math.floor(100000 + Math.random() * 900000).toString(),
      trackingNumber: 'Laukiama...',
      createdAt: new Date().toISOString(),
      locker: locker,
      paymentMethod: method,
      trackingHistory: [
        { status: 'Užsakymas patvirtintas', location: 'Garažo Mazgas', timestamp: new Date().toISOString(), description: 'Pirkėjas apmokėjo. Pardavėjas turi paruošti siuntą.' }
      ]
    };
    setMyOrders(prev => [newOrder, ...prev]);
    setActiveOrder(newOrder);
    setShowCheckout(null);
  };

  const refreshOrders = () => {
    const saved = localStorage.getItem('my_orders');
    if (saved) setMyOrders(JSON.parse(saved));
  };

  const getStatusColor = (status: OrderStatus) => {
    switch (status) {
      case OrderStatus.AWAITING_REGISTRATION: return 'bg-rose-100 text-rose-700';
      case OrderStatus.LABEL_READY: return 'bg-amber-100 text-amber-700';
      case OrderStatus.IN_TRANSIT: return 'bg-blue-100 text-blue-700';
      case OrderStatus.READY_FOR_PICKUP: return 'bg-orange-100 text-orange-700';
      case OrderStatus.DELIVERED: return 'bg-emerald-100 text-emerald-700';
      default: return 'bg-slate-100 text-slate-700';
    }
  };

  const renderMainContent = () => {
    if (isLoading) {
      return (
        <div className="flex flex-col items-center justify-center py-32">
          <div className="w-12 h-12 border-4 border-orange-200 border-t-orange-600 rounded-full animate-spin mb-4"></div>
          <p className="font-black text-xs uppercase text-slate-400 tracking-widest">Atidarom garažo vartus...</p>
        </div>
      );
    }

    switch (viewMode) {
      case 'inbox':
        return (
          <div className="max-w-4xl mx-auto space-y-4 animate-in fade-in slide-in-from-bottom-4">
            <h2 className="text-2xl font-black text-slate-900 uppercase italic mb-6">Žinutės</h2>
            {chats.length === 0 ? (
              <div className="bg-white p-12 rounded-3xl border border-dashed border-slate-300 text-center text-slate-400">
                <p className="font-black uppercase tracking-widest text-xs">Kol kas žinučių nėra</p>
              </div>
            ) : (
              chats.map(chat => (
                <div key={chat.id} onClick={() => setActiveChat(chat)} className="bg-white p-4 rounded-2xl border border-slate-200 flex items-center gap-4 cursor-pointer hover:border-orange-500 transition-all">
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
        );

      case 'wallet':
        return (
          <div className="max-w-3xl mx-auto animate-in fade-in slide-in-from-bottom-4">
             <div className="bg-slate-900 rounded-3xl p-8 md:p-12 text-white shadow-2xl relative overflow-hidden">
                <div className="absolute -top-10 -right-10 w-40 h-40 bg-orange-600/20 rounded-full blur-3xl"></div>
                <h4 className="text-[10px] font-black uppercase text-slate-400 tracking-widest mb-2">Tavo balansas</h4>
                <h2 className="text-6xl font-black mb-10 tracking-tighter italic">€{walletBalance.toFixed(2)}</h2>
                <div className="flex flex-col sm:flex-row gap-4">
                  <button 
                    disabled={walletBalance <= 0}
                    onClick={() => setShowWithdraw(true)} 
                    className={`px-8 py-4 rounded-2xl font-black uppercase text-xs tracking-widest shadow-lg transition-all ${walletBalance > 0 ? 'bg-orange-600 hover:bg-orange-700 shadow-orange-900/40' : 'bg-slate-700 text-slate-500 cursor-not-allowed'}`}
                  >
                    Išsigryninti į banką
                  </button>
                  <p className="text-[10px] text-slate-500 font-bold uppercase self-center italic">Pinigai saugiai saugomi Stripe</p>
                </div>
             </div>
          </div>
        );

      case 'orders':
        return (
          <div className="max-w-5xl mx-auto space-y-12 animate-in fade-in slide-in-from-bottom-8">
            <div>
               <h2 className="text-4xl font-black text-slate-900 uppercase italic tracking-tighter">SIUNTŲ RADARAS</h2>
               <p className="text-[10px] text-slate-400 font-black uppercase tracking-[0.3em] mt-3">Tavo detalių kelionė realiu laiku</p>
            </div>

            {myOrders.length === 0 ? (
              <div className="bg-white p-20 rounded-[3rem] border-2 border-dashed border-slate-100 text-center">
                <p className="font-black uppercase tracking-widest text-xs text-slate-400">Pirkimų istorija tuščia</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-8">
                {myOrders.map(order => (
                  <div key={order.id} className="bg-white rounded-[3rem] border border-slate-100 shadow-xl overflow-hidden group hover:shadow-2xl transition-all duration-500">
                     <div className="bg-slate-900 p-8 flex flex-col md:flex-row md:items-center justify-between gap-6">
                        <div className="flex items-center gap-6">
                           <div className={`w-16 h-16 rounded-3xl flex items-center justify-center font-black text-white text-xl shadow-lg ${order.locker.type === 'Omniva' ? 'bg-orange-600 shadow-orange-900/40' : order.locker.type === 'DPD' ? 'bg-red-600 shadow-red-900/40' : 'bg-slate-700 shadow-slate-900/40'}`}>
                             {order.locker.type[0]}
                           </div>
                           <div>
                              <div className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">SIUNTOS NUMERIS</div>
                              <div className="text-white font-black uppercase italic tracking-wider text-lg">{order.trackingNumber}</div>
                           </div>
                        </div>
                        <div className="flex items-center gap-6">
                           <div className="text-right hidden md:block">
                              <div className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">STATUSAS</div>
                              <div className={`text-[11px] font-black px-4 py-1.5 rounded-xl uppercase tracking-widest ${getStatusColor(order.status)}`}>
                                {order.status}
                              </div>
                           </div>
                           <button 
                             onClick={() => setActiveOrder(order)} 
                             className="bg-white text-slate-900 px-10 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-orange-500 hover:text-white transition-all shadow-xl active:scale-95"
                           >
                             LOGISTIKA
                           </button>
                        </div>
                     </div>
                     
                     <div className="p-10 md:p-14">
                        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
                           <div className="lg:col-span-4 space-y-8">
                              <div className="flex items-center gap-6">
                                 <img src={order.part.imageUrl} className="w-24 h-24 rounded-[2rem] object-cover shadow-2xl group-hover:scale-110 transition-transform duration-500" />
                                 <div>
                                    <h4 className="font-black text-slate-900 uppercase italic text-xl leading-tight mb-2">{order.part.title}</h4>
                                    <div className="flex items-center gap-2">
                                       <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Parduoda:</span>
                                       <span className="text-[9px] font-black text-slate-900 uppercase">{order.part.seller.name}</span>
                                    </div>
                                 </div>
                              </div>
                              <div className="bg-slate-50 p-8 rounded-[2.5rem] border border-slate-100 space-y-6">
                                 <div>
                                    <span className="text-[9px] text-slate-400 font-black uppercase tracking-widest block mb-2">TERMINALAS</span>
                                    <span className="text-sm font-black text-slate-800 uppercase leading-tight">{order.locker.name}</span>
                                 </div>
                                 <div>
                                    <span className="text-[9px] text-slate-400 font-black uppercase tracking-widest block mb-2">KOORDINATĖS</span>
                                    <span className="text-xs font-bold text-slate-500">{order.locker.address}, {order.locker.city}</span>
                                 </div>
                              </div>
                           </div>
                           
                           <div className="lg:col-span-8 relative pl-10 border-l-4 border-slate-50 space-y-12 py-4">
                              {(order.trackingHistory || []).slice().reverse().map((event, idx) => (
                                 <div key={idx} className="relative group/event animate-in slide-in-from-left-6 duration-700" style={{ animationDelay: `${idx * 200}ms` }}>
                                    <div className={`absolute -left-[54px] top-1.5 w-6 h-6 rounded-full border-4 border-white shadow-xl transition-all duration-500 ${idx === 0 ? 'bg-orange-600 scale-125 ring-4 ring-orange-100' : 'bg-slate-200 group-hover/event:bg-slate-300'}`}></div>
                                    <div className="flex justify-between items-start mb-2">
                                      <div className={`text-[13px] font-black uppercase tracking-tight ${idx === 0 ? 'text-slate-900' : 'text-slate-400'}`}>{event.status}</div>
                                      <div className="text-[10px] text-slate-400 font-bold uppercase">{new Date(event.timestamp).toLocaleString()}</div>
                                    </div>
                                    <div className="text-[11px] text-slate-500 font-medium leading-relaxed max-w-xl">{event.description}</div>
                                    <div className="text-[9px] text-orange-600 font-black uppercase tracking-[0.3em] mt-2 italic">{event.location} HUB</div>
                                 </div>
                              ))}
                           </div>
                        </div>
                     </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        );

      default:
        return (
          <>
            <div className="flex justify-between items-end mb-8">
              <div>
                <h2 className="text-3xl font-black text-slate-900 uppercase italic tracking-tighter leading-none">
                  {viewMode === 'favorites' ? 'Mėgstamos Dalys' : viewMode === 'sell' ? 'Mano Garažas' : 'Naujausi Lobiai'}
                </h2>
                <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest mt-2">
                  {filteredParts.length} rastų elementų
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
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
          </>
        );
    }
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
        onNotificationClick={() => setViewMode('notifications')}
      />

      <main className="flex-1 max-w-7xl mx-auto px-4 py-8 w-full">
        {renderMainContent()}
      </main>

      <Footer />

      {/* AI Assistant FAB */}
      <button 
        onClick={() => setIsAIActive(!isAIActive)}
        className="fixed bottom-8 right-8 z-[190] w-16 h-16 bg-slate-900 text-white rounded-2xl shadow-2xl flex items-center justify-center hover:bg-orange-600 transition-all hover:scale-110 active:scale-95 group"
      >
        <svg className="w-8 h-8 group-hover:rotate-12 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
        <span className="absolute -top-2 -right-2 bg-orange-600 text-white text-[8px] font-black px-2 py-1 rounded-full animate-bounce">AI</span>
      </button>

      {/* Modals */}
      {isAIActive && (
        <AIAssistantModal 
          onClose={() => setIsAIActive(false)} 
          availableParts={parts} 
          onSelectPart={(p) => { setSelectedPart(p); setIsAIActive(false); }}
        />
      )}
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
      {showCheckout && <CheckoutModal part={showCheckout} onClose={() => setShowCheckout(null)} onComplete={handleCheckoutComplete} />}
      {activeOrder && <OrderInstructions order={activeOrder} onClose={() => setActiveOrder(null)} onUpdate={refreshOrders} />}
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
