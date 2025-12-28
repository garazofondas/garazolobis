
import React, { useState } from 'react';
import { Order, OrderStatus } from '../types';
import { ShippingAPI } from '../apiService';

interface OrderInstructionsProps {
  order: Order;
  onClose: () => void;
}

const OrderInstructions: React.FC<OrderInstructionsProps> = ({ order, onClose }) => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [labelUrl, setLabelUrl] = useState<string | null>(order.labelUrl || null);

  const handleGenerateLabel = async () => {
    setIsGenerating(true);
    try {
      const url = await ShippingAPI.generateLabel(order);
      setLabelUrl(url);
    } catch (e) {
      alert("Nepavyko susisiekti su paštomatų serveriu.");
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
      <div className="bg-white rounded-3xl w-full max-w-md shadow-2xl overflow-hidden animate-in zoom-in duration-200">
        <div className="p-6 text-center">
          <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h2 className="text-2xl font-black text-slate-800 mb-2 uppercase italic tracking-tighter">DALIS PARDUOTA!</h2>
          <p className="text-slate-500 text-sm mb-6 font-medium">Pirkėjas apmokėjo. Paruošk siuntą išsiuntimui.</p>
          
          <div className="bg-slate-50 border-2 border-dashed border-slate-200 rounded-2xl p-6 mb-6">
            <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{order.lockerType} durelių kodas</div>
            <div className="text-4xl font-black tracking-widest text-orange-600">{order.shippingCode}</div>
          </div>

          <div className="space-y-4 mb-8">
            {labelUrl ? (
              <a 
                href={labelUrl} target="_blank" rel="noreferrer"
                className="w-full flex items-center justify-center gap-3 py-4 bg-indigo-600 text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-100"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" /></svg>
                Spausdinti lipduką
              </a>
            ) : (
              <button 
                onClick={handleGenerateLabel}
                disabled={isGenerating}
                className="w-full flex items-center justify-center gap-3 py-4 bg-slate-900 text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-slate-800 transition-all disabled:opacity-50"
              >
                {isGenerating ? (
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                ) : (
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
                )}
                Sugeneruoti DPD manifestą
              </button>
            )}
            <p className="text-[9px] text-slate-400 font-bold uppercase tracking-widest">* Lipdukas nebūtinas, jei naudosi tik spintelės kodą viršuje.</p>
          </div>

          <button 
            onClick={onClose}
            className="w-full py-4 text-slate-400 font-black text-[10px] uppercase tracking-widest hover:text-slate-600 transition-all"
          >
            Grįžti į mano skelbimus
          </button>
        </div>
      </div>
    </div>
  );
};

export default OrderInstructions;
