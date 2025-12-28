
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
      // Atnaujiname lokaliai order objektą (realybėje tai darytų Backend)
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
      alert("Sistemos klaida registruojant siuntą.");
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
      alert("Nepavyko atnaujinti būsenos.");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[150] flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-md">
      <div className="bg-white rounded-[3rem] w-full max-w-xl shadow-2xl overflow-hidden animate-in zoom-in duration-300">
        
        {/* Header */}
        <div className="bg-slate-900 p-10 text-white flex justify-between items-center">
           <div>
             <h2 className="text-3xl font-black uppercase italic italic leading-none">Pristatymo Centras</h2>
             <p className="text-[10px] text-orange-500 font-black uppercase mt-3 tracking-[0.3em]">Logistikos mazgas # {order.id.split('-')[1]}</p>
           </div>
           <button onClick={onClose} className="p-3 hover:bg-white/10 rounded-full transition-colors">
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
           </button>
        </div>

        <div className="p-10 space-y-8">
          {step === 1 ? (
            <div className="space-y-8 animate-in fade-in">
              <div>
                <h3 className="text-xl font-black text-slate-900 uppercase italic mb-2">1. Pasirinkite pakuotės dydį</h3>
                <p className="text-xs text-slate-500 font-medium">Nuo dydžio priklauso skiriamos durelės paštomate.</p>
              </div>

              <div className="grid grid-cols-4 gap-4">
                {(['S', 'M', 'L', 'XL'] as ParcelSize[]).map(size => (
                  <button 
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    className={`aspect-square rounded-3xl border-4 flex flex-col items-center justify-center transition-all ${selectedSize === size ? 'border-orange-600 bg-orange-50' : 'border-slate-100 hover:border-slate-200'}`}
                  >
                    <span className={`text-2xl font-black ${selectedSize === size ? 'text-orange-600' : 'text-slate-400'}`}>{size}</span>
                    <span className="text-[8px] font-black uppercase mt-1 text-slate-400">Pakuotė</span>
                  </button>
                ))}
              </div>

              <button 
                onClick={handleRegister}
                disabled={isProcessing}
                className="w-full py-5 bg-orange-600 text-white rounded-2xl font-black text-sm uppercase tracking-widest hover:bg-orange-700 transition-all flex items-center justify-center gap-3 shadow-xl shadow-orange-100"
              >
                {isProcessing ? <div className="w-5 h-5 border-3 border-white/30 border-t-white rounded-full animate-spin"></div> : 'REGISTRUOTI KURJERIO SISTEMOJE'}
              </button>
            </div>
          ) : (
            <div className="space-y-8 animate-in slide-in-from-right-4">
              <div className="bg-slate-50 border-2 border-slate-100 rounded-[2rem] p-8 flex flex-col items-center shadow-inner relative overflow-hidden">
                 <div className="absolute top-4 left-6 text-[8px] font-black text-slate-300 uppercase tracking-[0.2em]">{order.locker.type} OFFICIAL LABEL</div>
                 <div className="w-full flex justify-between items-start mb-6 pt-4">
                    <div className="text-[9px] font-black text-slate-400 uppercase">Pardavėjas: {order.part.seller.name}</div>
                    <div className="text-[12px] font-black text-slate-900 uppercase italic">{order.locker.type}</div>
                 </div>
                 
                 <img src={order.labelUrl} className="w-48 h-48 mb-6 mix-blend-multiply" alt="Shipping Label" />
                 
                 <div className="text-2xl font-black tracking-[0.3em] text-slate-900 mb-2">{order.trackingNumber}</div>
                 <div className="text-[10px] font-black text-slate-400 uppercase">Durelių kodas: <span className="text-orange-600 text-lg tracking-widest ml-2">{order.shippingCode}</span></div>
              </div>

              <div className="flex flex-col gap-4">
                 <button 
                   onClick={() => window.print()}
                   className="w-full py-5 bg-slate-900 text-white rounded-2xl font-black text-sm uppercase tracking-widest hover:bg-slate-800 transition-all flex items-center justify-center gap-4"
                 >
                   <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" /></svg>
                   SPAUSDINTI LIPDUKĄ (PDF)
                 </button>

                 {order.status === OrderStatus.LABEL_READY && (
                   <button 
                     onClick={handleMarkAsShipped}
                     className="w-full py-4 border-2 border-slate-900 text-slate-900 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-slate-900 hover:text-white transition-all"
                   >
                     DETALĖ ĮDĖTA Į TERMINALĄ
                   </button>
                 )}
              </div>
            </div>
          )}

          <div className="p-6 bg-orange-50 rounded-2xl border border-orange-100 flex items-start gap-4">
             <div className="text-2xl">📦</div>
             <p className="text-[11px] text-orange-800 font-bold leading-relaxed">
               Supakuokite detalę saugiai. Jei neturite spausdintuvo, galite nuskenuoti kodą terminale - kai kurie {order.locker.type} terminalai atspausdins lipduką už jus.
             </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderInstructions;
