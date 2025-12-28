
import React, { useState } from 'react';
import { Part } from '../types';

interface NegotiateModalProps {
  part: Part;
  onClose: () => void;
  onSubmitOffer: (amount: number) => void;
}

const NegotiateModal: React.FC<NegotiateModalProps> = ({ part, onClose, onSubmitOffer }) => {
  const [offerPrice, setOfferPrice] = useState(part.price * 0.9); // Default 10% discount

  return (
    <div className="fixed inset-0 z-[150] flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-md">
      <div className="bg-white rounded-3xl w-full max-w-sm shadow-2xl overflow-hidden animate-in zoom-in duration-300">
        <div className="p-8 text-center">
          <div className="w-16 h-16 bg-orange-100 text-orange-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
             <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" /></svg>
          </div>
          <h2 className="text-xl font-black text-slate-900 uppercase italic mb-2 tracking-tight">Siūlyti kainą</h2>
          <p className="text-xs text-slate-500 mb-8 uppercase tracking-widest font-bold">Pardavėjas prašo: <span className="text-slate-900">€{part.price}</span></p>

          <div className="relative mb-8">
             <input 
               type="number"
               className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl py-6 px-4 text-4xl font-black text-center text-orange-600 outline-none focus:border-orange-500 transition-all"
               value={offerPrice}
               onChange={e => setOfferPrice(parseFloat(e.target.value))}
             />
             <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-white px-2 text-[10px] font-black text-slate-400 uppercase tracking-widest">Tavo pasiūlymas (€)</div>
          </div>

          <div className="flex gap-3">
             <button onClick={onClose} className="flex-1 py-4 text-xs font-black uppercase text-slate-400">Atšaukti</button>
             <button 
               onClick={() => onSubmitOffer(offerPrice)}
               className="flex-1 py-4 bg-orange-600 text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl shadow-orange-100"
             >
               Siųsti pasiūlymą
             </button>
          </div>
          
          <p className="mt-6 text-[9px] text-slate-400 font-bold uppercase tracking-widest leading-relaxed italic">
            * Pasiūlymas bus nusiųstas kaip žinutė pardavėjui. Pardavėjas turi teisę nesutikti.
          </p>
        </div>
      </div>
    </div>
  );
};

export default NegotiateModal;
