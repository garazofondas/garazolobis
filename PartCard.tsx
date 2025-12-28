
import React from 'react';
import { Part } from '../types';

export default function PartCard({ part, onClick }: { part: Part, onClick: (p: Part) => void }) {
  return (
    <div 
      onClick={() => onClick(part)}
      className="bg-white rounded-2xl border border-slate-200 overflow-hidden hover:shadow-xl transition-all cursor-pointer group"
    >
      <div className="aspect-square relative overflow-hidden bg-slate-100">
        <img src={part.imageUrl} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" alt={part.title} />
        <div className="absolute top-2 right-2">
          <span className="bg-white/90 backdrop-blur shadow text-[8px] font-black px-2 py-1 rounded uppercase tracking-widest text-slate-900">{part.condition}</span>
        </div>
      </div>
      <div className="p-4">
        <div className="flex justify-between items-start mb-1">
          <h3 className="text-[11px] font-black text-slate-800 uppercase italic line-clamp-1 flex-1">{part.title}</h3>
          <span className="text-sm font-black text-orange-600 ml-2">€{part.price}</span>
        </div>
        <p className="text-[9px] text-slate-400 font-bold uppercase tracking-widest">{part.brand} • {part.location}</p>
      </div>
    </div>
  );
}
