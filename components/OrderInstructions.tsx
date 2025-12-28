
import React, { useState } from 'react';
import { Order, OrderStatus, ParcelSize } from '../types';
import { ShippingAPI } from '../apiService';

interface OrderInstructionsProps {
  order: Order;
  onClose: () => void;
  onUpdate?: () => void;
}

const OrderInstructions: React.FC<OrderInstructionsProps> = ({ order, onClose, onUpdate }) => {
  const [step, setStep] = useState(order.status === OrderStatus.AWAITING_REGISTRATION ? 1 : 2);
  const [selectedSize, setSelectedSize] = useState<ParcelSize>('S');
  const [isProcessing, setIsProcessing] = useState(false);

  const handleRegister = async () => {
    setIsProcessing(true);
    try {
      const result = await ShippingAPI.registerShipment(order.id, selectedSize);
      
      const saved = localStorage.getItem('my_orders');
      if (saved) {
        const orders: Order[] = JSON.parse(saved);
        const updated = orders.map(o => o.id === order.id ? { 
          ...o, 
          status: OrderStatus.LABEL_READY, 
          trackingNumber: result.trackingNumber, 
          labelUrl: result.labelUrl,
          parcelSize: selectedSize
        } : o);
        localStorage.setItem('my_orders', JSON.stringify(updated));
      }
      await ShippingAPI.updateStatus(order.id, OrderStatus.LABEL_READY);
      setStep(2);
      if (onUpdate) onUpdate();
    } catch (e) {
      alert("Sistemos klaida registruojant siuntą kurjerio tinkluose.");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleMarkAsShipped = async () => {
    setIsProcessing(true);
    try {
      await ShippingAPI.updateStatus(order.id, OrderStatus.IN_TRANSIT);
      if (onUpdate) onUpdate();
      onClose();
    } catch (e) {
      alert("Nepavyko atnaujinti būsenos. Patikrinkite ryšį.");
    } finally {
      setIsProcessing(false);
    }
  };

  const getPackageInfo = (size: ParcelSize) => {
    switch(size) {
      case 'S': return 'Iki 8cm (Mažos detalės, davikliai, įrankiai)';
      case 'M': return 'Iki 17cm (Generatoriai, siurbliai, kaladėlės)';
      case 'L': return 'Iki 38cm (Bamperio grotelės, filtrai, batai)';
      case 'XL': return 'Iki 64cm (Ratai, stambios kėbulo dalys)';
    }
  };

  return (
    <div className="fixed inset-0 z-[150] flex items-center justify-center p-4 bg-slate-900/90 backdrop-blur-xl">
      <div className="bg-white rounded-[3.5rem] w-full max-w-2xl shadow-2xl overflow-hidden animate-in zoom-in duration-300">
        
        {/* Header */}
        <div className="bg-slate-900 p-12 text-white flex justify-between items-start">
           <div>
             <h2 className="text-4xl font-black uppercase italic leading-none">SIUNTŲ VALDYMAS</h2>
             <p className="text-[10px] text-orange-500 font-black uppercase mt-4 tracking-[0.4em]">LOGISTIKOS INTEGRACIJA: {order.locker.type}</p>
           </div>
           <button onClick={onClose} className="p-3 hover:bg-white/10 rounded-full transition-colors">
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
           </button>
        </div>

        <div className="p-12 space-y-10">
          {step === 1 ? (
            <div className="space-y-10 animate-in fade-in">
              <div className="flex items-center gap-6">
                 <div className="w-16 h-16 bg-orange-100 text-orange-600 rounded-3xl flex items-center justify-center text-2xl">📦</div>
                 <div>
                    <h3 className="text-xl font-black text-slate-900 uppercase italic">PASIRINKITE PAKUOTĘ</h3>
                    <p className="text-xs text-slate-500 font-bold uppercase tracking-widest mt-1">Privaloma pagal kurjerio taisykles</p>
                 </div>
              </div>

              <div className="grid grid-cols-1 gap-4">
                {(['S', 'M', 'L', 'XL'] as ParcelSize[]).map(size => (
                  <button 
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    className={`flex items-center justify-between p-6 rounded-[2rem] border-4 transition-all ${selectedSize === size ? 'border-orange-600 bg-orange-50' : 'border-slate-100 hover:border-slate-200'}`}
                  >
                    <div className="flex items-center gap-6">
                       <span className={`text-3xl font-black ${selectedSize === size ? 'text-orange-600' : 'text-slate-300'}`}>{size}</span>
                       <div className="text-left">
                          <div className="text-xs font-black text-slate-800 uppercase">Dydis {size}</div>
                          <div className="text-[10px] text-slate-500 font-bold uppercase">{getPackageInfo(size)}</div>
                       </div>
                    </div>
                    {selectedSize === size && <div className="w-4 h-4 bg-orange-600 rounded-full"></div>}
                  </button>
                ))}
              </div>

              <button 
                onClick={handleRegister}
                disabled={isProcessing}
                className="w-full py-6 bg-orange-600 text-white rounded-[2rem] font-black text-sm uppercase tracking-widest hover:bg-orange-700 transition-all flex items-center justify-center gap-4 shadow-2xl shadow-orange-900/20"
              >
                {isProcessing ? <div className="w-6 h-6 border-4 border-white/30 border-t-white rounded-full animate-spin"></div> : 'REGISTRUOTI SIUNTĄ'}
              </button>
            </div>
          ) : (
            <div className="space-y-10 animate-in slide-in-from-right-8">
              <div className="bg-slate-50 border-4 border-slate-100 rounded-[3rem] p-10 flex flex-col items-center shadow-inner relative overflow-hidden group">
                 <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity">
                    <svg className="w-32 h-32" fill="currentColor" viewBox="0 0 24 24"><path d="M3 13h18V5H3v8zm0 6h18v-4H3v4z"/></svg>
                 </div>
                 
                 <div className="w-full flex justify-between items-start mb-10">
                    <div className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">PARDAVĖJAS: {order.part.seller.name.toUpperCase()}</div>
                    <div className="text-sm font-black text-orange-600 uppercase italic">{order.locker.type} EXPRESS</div>
                 </div>
                 
                 <img src={order.labelUrl} className="w-56 h-56 mb-8 mix-blend-multiply" alt="Shipping QR" />
                 
                 <div className="text-3xl font-black tracking-[0.4em] text-slate-900 mb-4">{order.trackingNumber}</div>
                 <div className="bg-slate-900 text-white px-8 py-3 rounded-2xl">
                    <span className="text-[10px] font-black uppercase tracking-widest">Durelių kodas: </span>
                    <span className="text-xl font-black text-orange-500 ml-4">{order.shippingCode}</span>
                 </div>
              </div>

              <div className="flex flex-col gap-4">
                 <button 
                   onClick={() => window.print()}
                   className="w-full py-6 bg-slate-900 text-white rounded-[2rem] font-black text-sm uppercase tracking-widest hover:bg-slate-800 transition-all flex items-center justify-center gap-6 shadow-xl"
                 >
                   <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" /></svg>
                   SPAUSDINTI LIPDUKĄ (PDF)
                 </button>

                 {order.status === OrderStatus.LABEL_READY && (
                   <button 
                     onClick={handleMarkAsShipped}
                     className="w-full py-5 border-4 border-slate-900 text-slate-900 rounded-[2rem] font-black text-xs uppercase tracking-widest hover:bg-slate-900 hover:text-white transition-all"
                   >
                     PATVIRTINTI: DETALĖ JAU PAŠTOMATE
                   </button>
                 )}
              </div>
            </div>
          )}

          <div className="p-8 bg-blue-50 rounded-[2rem] border-2 border-blue-100 flex items-start gap-6">
             <div className="text-3xl">💡</div>
             <p className="text-[12px] text-blue-800 font-bold leading-relaxed uppercase">
               SVARBU: Lipduką privalote užklijuoti ant pakuotės. Jei neturite spausdintuvo, galite naudoti terminalo spausdinimo paslaugą įvedę durelių kodą.
             </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderInstructions;
