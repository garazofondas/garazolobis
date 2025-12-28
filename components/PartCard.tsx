
import React from 'react';
import { Part, Condition } from '../types';

interface PartCardProps {
  part: Part;
  onClick: (part: Part) => void;
  isFavorite: boolean;
  onToggleFavorite: (e: React.MouseEvent, partId: string) => void;
}

const PartCard: React.FC<PartCardProps> = ({ part, onClick, isFavorite, onToggleFavorite }) => {
  const getConditionColor = (cond: Condition) => {
    switch (cond) {
      case Condition.NEW: return 'bg-emerald-100 text-emerald-700';
      case Condition.LIKE_NEW: return 'bg-cyan-100 text-cyan-700';
      case Condition.GOOD: return 'bg-lime-100 text-lime-700';
      case Condition.USED: return 'bg-slate-100 text-slate-700';
      case Condition.WORKS_LOOKS_BAD: return 'bg-amber-100 text-amber-800 border border-amber-200';
      case Condition.JUNK: return 'bg-zinc-200 text-zinc-600';
      default: return 'bg-slate-100 text-slate-700';
    }
  };

  return (
    <div 
      className={`bg-white rounded-2xl overflow-hidden border border-slate-200 hover:shadow-2xl hover:-translate-y-1 transition-all cursor-pointer group flex flex-col h-full shadow-sm relative ${part.condition === Condition.JUNK ? 'opacity-90' : ''}`}
      onClick={() => onClick(part)}
    >
      <button 
        onClick={(e) => onToggleFavorite(e, part.id)}
        className={`absolute top-3 left-3 z-10 p-2 rounded-full backdrop-blur-md transition-all ${isFavorite ? 'bg-orange-600 text-white' : 'bg-black/20 text-white hover:bg-black/40'}`}
      >
        <svg className={`w-4 h-4 ${isFavorite ? 'fill-current' : 'fill-none'}`} stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
        </svg>
      </button>

      <div className="relative aspect-[4/3] overflow-hidden">
        <img 
          src={part.imageUrl} 
          alt={part.title} 
          className={`w-full h-full object-cover group-hover:scale-110 transition-transform duration-500 ${part.condition === Condition.JUNK ? 'grayscale contrast-75' : ''}`}
        />
        <div className="absolute top-3 right-3">
          <span className={`text-[8px] font-black px-2 py-1 rounded shadow-sm uppercase tracking-wider ${getConditionColor(part.condition)}`}>
            {part.condition}
          </span>
        </div>
        <div className="absolute bottom-3 left-3 flex items-center gap-1.5 bg-black/60 backdrop-blur-md rounded-full px-2.5 py-1.5 border border-white/20">
          <img src={part.seller.avatar} alt={part.seller.name} className="w-4 h-4 rounded-full border border-white" />
          <div className="flex items-center gap-1">
             <span className="text-white text-[9px] font-black uppercase tracking-tight">{part.seller.name}</span>
          </div>
        </div>
      </div>
      
      <div className="p-4 flex-1 flex flex-col">
        <div className="flex justify-between items-start mb-2">
          <h3 className="text-sm font-black text-slate-800 line-clamp-2 flex-1 leading-tight uppercase italic">{part.title}</h3>
          <span className={`text-lg font-black ml-2 tracking-tighter ${part.condition === Condition.JUNK ? 'text-slate-400' : 'text-orange-600'}`}>€{part.price}</span>
        </div>

        {part.partCode && (
          <div className="mb-2 text-[10px] font-black text-indigo-600 uppercase tracking-tighter bg-indigo-50 inline-block px-1.5 py-0.5 rounded border border-indigo-100 w-fit">
            #{part.partCode}
          </div>
        )}
        
        <div className="text-[10px] text-slate-400 font-black uppercase tracking-widest mb-3 flex items-center gap-1">
          <svg className="w-3 h-3 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
          </svg>
          {part.location}
        </div>

        <div className="mt-auto pt-3 border-t border-slate-50 flex flex-wrap gap-1.5">
          <span className="text-[9px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded-md uppercase font-black tracking-wider">
            {part.compatibility.brand} {part.compatibility.model}
          </span>
          <span className="text-[9px] bg-indigo-50 text-indigo-700 px-2 py-0.5 rounded-md uppercase font-black tracking-wider">
            {part.category}
          </span>
        </div>
      </div>
    </div>
  );
};

export default PartCard;
