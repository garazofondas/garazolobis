
import React, { useState } from 'react';
import { Part } from '../types';

interface CheckoutModalProps {
  part: Part;
  onClose: () => void;
  onComplete: () => void;
}

const CheckoutModal: React.FC<CheckoutModalProps> = ({ part, onClose, onComplete }) => {
  const protectionFee = 0.70 + (part.price * 0.05);
  const shippingFee = 2.99;
  const total = part.price + protectionFee + shippingFee;
  
  const [step, setStep] = useState(1);

  return (
    <div className="fixed inset-0 z-[130] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
      <div className="bg-white rounded-3xl w-full max-w-md shadow-2xl overflow-hidden animate-in zoom-in duration-200">
        <div className="p-6 bg-slate-50 border-b flex justify-between items-center">
          <h2 className="text-xl font-black text-slate-900 uppercase">Saugus apmokėjimas</h2>
          <button onClick={onClose} className="p-2 hover:bg-slate-200 rounded-full">
             <svg className="w-6 h-6 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
        </div>

        <div className="p-8">
          {step === 1 ? (
            <div className="space-y-6">
              <div className="bg-orange-50 border border-orange-100 p-4 rounded-2xl flex gap-4">
                 <div className="w-12 h-12 bg-white rounded-xl shadow-sm border border-orange-100 flex items-center justify-center text-orange-600">
                   <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>
                 </div>
                 <div className="text-xs text-orange-800 font-medium">Pinigai bus saugomi „Garažo Lobio“ sąskaitoje iki kol gausite prekę ir patvirtinsite jos kokybę.</div>
              </div>

              <div className="space-y-3">
                 <div className="flex justify-between text-sm">
                    <span className="text-slate-500 font-bold uppercase tracking-widest text-[10px]">Prekė</span>
                    <span className="font-bold">€{part.price.toFixed(2)}</span>
                 </div>
                 <div className="flex justify-between text-sm">
                    <span className="text-slate-500 font-bold uppercase tracking-widest text-[10px]">Apsauga</span>
                    <span className="font-bold">€{protectionFee.toFixed(2)}</span>
                 </div>
                 <div className="flex justify-between text-sm">
                    <span className="text-slate-500 font-bold uppercase tracking-widest text-[10px]">Siuntimas (Omniva)</span>
                    <span className="font-bold">€{shippingFee.toFixed(2)}</span>
                 </div>
                 <div className="pt-4 border-t flex justify-between items-center">
                    <span className="text-sm font-black text-slate-900 uppercase tracking-tight">Iš viso</span>
                    <span className="text-3xl font-black text-slate-900 tracking-tighter">€{total.toFixed(2)}</span>
                 </div>
              </div>

              <button 
                onClick={() => setStep(2)}
                className="w-full bg-slate-900 text-white py-5 rounded-2xl font-black text-sm uppercase tracking-widest hover:bg-slate-800 transition-all shadow-xl shadow-slate-200"
              >
                Tęsti apmokėjimą
              </button>
            </div>
          ) : (
            <div className="space-y-6 animate-in slide-in-from-right-4">
              <div className="space-y-4">
                 <div>
                    <label className="block text-[10px] font-black text-slate-400 uppercase mb-1 tracking-widest">Kortelės numeris</label>
                    <div className="relative">
                       <input className="w-full bg-slate-50 border border-slate-200 rounded-xl py-4 px-4 pl-12 text-sm focus:ring-2 focus:ring-orange-500 outline-none" placeholder="0000 0000 0000 0000" />
                       <svg className="w-6 h-6 absolute left-4 top-3.5 text-slate-300" fill="currentColor" viewBox="0 0 24 24"><path d="M20 4H4c-1.11 0-1.99.89-1.99 2L2 18c0 1.11.89 2 2 2h16c1.11 0 2-.89 2-2V6c0-1.11-.89-2-2-2zm0 14H4v-6h16v6zm0-10H4V6h16v2z"/></svg>
                    </div>
                 </div>
                 <div className="grid grid-cols-2 gap-4">
                    <div>
                       <label className="block text-[10px] font-black text-slate-400 uppercase mb-1 tracking-widest">Galioja iki</label>
                       <input className="w-full bg-slate-50 border border-slate-200 rounded-xl py-4 px-4 text-sm focus:ring-2 focus:ring-orange-500 outline-none" placeholder="MM/YY" />
                    </div>
                    <div>
                       <label className="block text-[10px] font-black text-slate-400 uppercase mb-1 tracking-widest">CVC</label>
                       <input className="w-full bg-slate-50 border border-slate-200 rounded-xl py-4 px-4 text-sm focus:ring-2 focus:ring-orange-500 outline-none" placeholder="123" />
                    </div>
                 </div>
              </div>

              <button 
                onClick={onComplete}
                className="w-full bg-orange-600 text-white py-5 rounded-2xl font-black text-sm uppercase tracking-widest hover:bg-orange-700 transition-all shadow-xl shadow-orange-100"
              >
                Apmokėti €{total.toFixed(2)}
              </button>
              <button onClick={() => setStep(1)} className="w-full text-slate-400 text-xs font-bold uppercase hover:text-slate-600 transition-all">Grįžti atgal</button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CheckoutModal;
