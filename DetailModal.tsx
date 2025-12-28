
import React from 'react';
import { Part } from './types';

interface DetailModalProps {
  part: Part;
  onClose: () => void;
  onAddToCart: (part: Part) => void;
  onMessage: (part: Part) => void;
  onNegotiate: (part: Part) => void;
}

const DetailModal: React.FC<DetailModalProps> = ({ part, onClose, onAddToCart, onMessage, onNegotiate }) => {
  const protectionFee = 0.70 + (part.price * 0.05);

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
      <div className="bg-white rounded-3xl w-full max-w-5xl max-h-[95vh] overflow-hidden flex flex-col md:flex-row shadow-2xl animate-in fade-in slide-in-from-bottom-4 duration-300">
        <div className="md:w-1/2 bg-slate-100 flex items-center justify-center relative">
          <img src={part.imageUrl} alt={part.title} className="w-full h-full object-cover" />
          <button onClick={onClose} className="absolute top-4 left-4 p-2 bg-white/80 hover:bg-white rounded-full shadow-lg md:hidden">
            <svg className="w-6 h-6 text-slate-800" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
          </button>
        </div>

        <div className="md:w-1/2 flex flex-col bg-white">
          <div className="p-4 border-b flex justify-between items-center bg-slate-50">
             <div className="flex items-center gap-3">
               <img src={part.seller.avatar || 'https://picsum.photos/seed/user/100/100'} alt={part.seller.name} className="w-12 h-12 rounded-2xl object-cover border-2 border-white shadow-sm" />
               <div>
                 <div className="text-sm font-black text-slate-800 uppercase italic tracking-tight">{part.seller.name}</div>
                 <div className="flex items-center gap-2">
                    <div className="flex items-center text-orange-500">
                      {[...Array(5)].map((_, i) => (
                        <svg key={i} className={`w-2.5 h-2.5 fill-current ${i < Math.floor(part.seller.rating) ? '' : 'text-slate-200'}`} viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/></svg>
                      ))}
                    </div>
                    <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">{part.seller.reviewCount} Atsiliepimai</span>
                 </div>
               </div>
             </div>
             <button onClick={onClose} className="p-2 hover:bg-slate-200 rounded-full transition-colors hidden md:block">
              <svg className="w-6 h-6 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-8 space-y-8">
            <div>
              {part.partCode && (
                <div className="mb-2">
                   <span className="bg-indigo-600 text-white text-[10px] font-black px-2.5 py-1 rounded-md uppercase tracking-widest italic">Kodas: #{part.partCode}</span>
                </div>
              )}
              <div className="flex justify-between items-start gap-4 mb-4">
                 <h1 className="text-3xl font-black text-slate-900 uppercase italic tracking-tighter leading-none">{part.title}</h1>
                 <div className="text-right flex-shrink-0">
                    <div className="text-3xl font-black text-orange-600 tracking-tighter leading-none">€{part.price.toFixed(2)}</div>
                    <div className="text-[8px] text-slate-400 font-black uppercase tracking-widest mt-1">+ €{protectionFee.toFixed(2)} Apsauga</div>
                 </div>
              </div>
              <div className="flex flex-wrap gap-2">
                 <span className="bg-slate-900 text-white text-[9px] font-black px-3 py-1.5 rounded-lg uppercase tracking-widest">{part.condition}</span>
                 <span className="bg-orange-50 text-orange-600 text-[9px] font-black px-3 py-1.5 rounded-lg uppercase tracking-widest">{part.brand}</span>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
                <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
                  <div className="text-[8px] text-slate-400 font-black uppercase tracking-widest mb-1">Suderinama su</div>
                  <div className="text-sm font-black text-slate-800 uppercase">{part.compatibility.brand} {part.compatibility.model}</div>
                </div>
                <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
                  <div className="text-[8px] text-slate-400 font-black uppercase tracking-widest mb-1">Vietovė</div>
                  <div className="text-sm font-black text-slate-800 uppercase">{part.location}</div>
                </div>
            </div>
            <div className="space-y-3">
              <h2 className="text-[10px] font-black text-slate-900 uppercase tracking-widest flex items-center gap-2">
                <div className="w-1.5 h-1.5 bg-orange-600 rounded-full"></div>
                Aprašymas
              </h2>
              <p className="text-sm text-slate-600 leading-relaxed font-medium">{part.description}</p>
            </div>
          </div>

          <div className="p-8 bg-slate-900 flex flex-col gap-3">
            <div className="grid grid-cols-2 gap-3">
              <button className="py-4 px-6 bg-slate-800 border border-slate-700 text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-slate-700 transition-all" onClick={() => onMessage(part)}>Žinutė</button>
              <button className="py-4 px-6 bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl font-black text-xs uppercase tracking-widest transition-all shadow-lg" onClick={() => onNegotiate(part)}>Derybos</button>
            </div>
            <button className="py-4 px-6 bg-orange-600 hover:bg-orange-700 text-white rounded-2xl font-black text-sm uppercase tracking-widest transition-all shadow-lg shadow-orange-900/40" onClick={() => { onAddToCart(part); }}>Pirkti saugiai</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DetailModal;
