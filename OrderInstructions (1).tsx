import React, { useState } from 'react';
import { Order, OrderStatus } from '../types';
import { ShippingAPI } from '../apiService';

interface OrderInstructionsProps {
  order: Order;
  onClose: () => void;
  onUpdate?: () => void;
}

const OrderInstructions: React.FC<OrderInstructionsProps> = ({ order, onClose, onUpdate }) => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [labelUrl, setLabelUrl] = useState<string | null>(order.labelUrl || null);

  const handleGenerateLabel = async () => {
    setIsGenerating(true);
    try {
      const url = await ShippingAPI.generateLabel(order);
      setLabelUrl(url);
    } catch (e) {
      alert("Klaida generuojant lipduką.");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleMarkAsShipped = async () => {
    setIsUpdating(true);
    try {
      await ShippingAPI.updateStatus(order.id, OrderStatus.IN_TRANSIT);
      if (onUpdate) onUpdate();
      onClose();
    } catch (e) {
      alert("Klaida atnaujinant būseną.");
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
      <div className="bg-white rounded-3xl w-full max-w-md shadow-2xl overflow-hidden animate-in zoom-in duration-200">
        <div className="bg-slate-900 p-6 text-white flex justify-between items-center">
           <div>
             <h2 className="text-xl font-black uppercase italic italic leading-none">Siuntimas</h2>
             <p className="text-[10px] text-slate-400 font-bold uppercase mt-1 tracking-widest">{order.locker.type} terminas</p>
           </div>
           <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-full">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
           </button>
        </div>

        <div className="p-8 space-y-6">
          {/* Label Preview */}
          {labelUrl ? (
            <div className="bg-white border-2 border-slate-200 rounded-2xl p-6 flex flex-col items-center shadow-inner">
               <div className="flex justify-between w-full mb-4 items-start">
                  <div className="text-[8px] font-black uppercase text-slate-400">Pardavėjas: Mano Garažas</div>
                  <div className="text-[10px] font-black uppercase">{order.locker.type}</div>
               </div>
               <img src={labelUrl} className="w-32 h-32 mb-4" alt="Shipping QR" />
               <div className="text-sm font-black tracking-widest text-slate-800">{order.trackingNumber}</div>
               <div className="text-[8px] font-black text-slate-400 uppercase mt-2">Durelių kodas: <span className="text-orange-600 text-sm">{order.shippingCode}</span></div>
            </div>
          ) : (
            <div className="bg-slate-50 border-2 border-dashed border-slate-200 rounded-2xl p-12 text-center">
               <svg className="w-10 h-10 text-slate-200 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
               <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Lipdukas dar nesugeneruotas</p>
            </div>
          )}

          <div className="space-y-3">
             {!labelUrl ? (
                <button 
                  onClick={handleGenerateLabel}
                  disabled={isGenerating}
                  className="w-full py-4 bg-orange-600 text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-orange-700 transition-all flex items-center justify-center gap-3"
                >
                  {isGenerating ? <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin"></div> : 'Sugeneruoti lipduką'}
                </button>
             ) : (
                <button 
                  className="w-full py-4 bg-indigo-600 text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-indigo-700 transition-all flex items-center justify-center gap-3 shadow-lg"
                  onClick={() => window.print()}
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" /></svg>
                  Spausdinti lipduką
                </button>
             )}

             {order.status === OrderStatus.PENDING_SHIPMENT && (
               <button 
                 onClick={handleMarkAsShipped}
                 disabled={isUpdating}
                 className="w-full py-4 border-2 border-slate-900 text-slate-900 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-slate-900 hover:text-white transition-all flex items-center justify-center gap-3"
               >
                 {isUpdating ? <div className="w-4 h-4 border-2 border-slate-900 border-t-transparent rounded-full animate-spin"></div> : 'Įdėjau į paštomatą'}
               </button>
             )}
          </div>
          
          <div className="p-4 bg-orange-50 rounded-xl border border-orange-100 flex items-start gap-3">
             <span className="text-xl">ℹ️</span>
             <p className="text-[10px] text-orange-800 font-medium leading-relaxed">
               Nunešk siuntą į bet kurį <span className="font-black">{order.locker.type}</span> paštomatą, įvesk kodą <span className="font-black text-orange-600">{order.shippingCode}</span> ir užklijuok lipduką.
             </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderInstructions;