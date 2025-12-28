
import React, { useState, useEffect } from 'react';
import { Locker } from '../types';
import { LockerAPI } from '../apiService';

interface LockerSelectorProps {
  onSelect: (locker: Locker) => void;
  selectedLockerId?: string;
}

const LockerSelector: React.FC<LockerSelectorProps> = ({ onSelect, selectedLockerId }) => {
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState<'All' | 'Omniva' | 'DPD' | 'LP Express'>('All');
  const [lockers, setLockers] = useState<Locker[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(true);
      LockerAPI.fetchLockers(search).then(res => {
        const filtered = filter === 'All' ? res : res.filter(l => l.type === filter);
        setLockers(filtered);
        setLoading(false);
      });
    }, 300);
    return () => clearTimeout(timer);
  }, [search, filter]);

  const getLockerIcon = (type: Locker['type']) => {
    switch (type) {
      case 'Omniva': return <div className="w-8 h-8 bg-orange-600 rounded-lg flex items-center justify-center font-black text-white text-[8px]">OMN</div>;
      case 'DPD': return <div className="w-8 h-8 bg-red-600 rounded-lg flex items-center justify-center font-black text-white text-[8px]">DPD</div>;
      case 'LP Express': return <div className="w-8 h-8 bg-slate-900 rounded-lg flex items-center justify-center font-black text-white text-[8px]">LP</div>;
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex gap-2 mb-4 overflow-x-auto pb-2 scrollbar-hide">
        {['All', 'Omniva', 'DPD', 'LP Express'].map(type => (
          <button 
            key={type}
            onClick={() => setFilter(type as any)}
            className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest whitespace-nowrap transition-all border-2 ${filter === type ? 'bg-slate-900 text-white border-slate-900' : 'bg-white text-slate-400 border-slate-100 hover:border-slate-200'}`}
          >
            {type === 'All' ? 'Visi' : type}
          </button>
        ))}
      </div>

      <div className="relative">
        <input 
          type="text"
          placeholder="Ieškoti miesto ar gatvės..."
          className="w-full bg-slate-100 border-2 border-transparent focus:border-orange-500 focus:bg-white rounded-xl py-3 px-10 text-xs font-bold outline-none transition-all"
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
        <svg className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
      </div>

      <div className="max-h-64 overflow-y-auto space-y-2 pr-2 scrollbar-thin scrollbar-thumb-slate-200">
        {loading ? (
          <div className="py-12 text-center text-[10px] font-black text-slate-400 uppercase animate-pulse tracking-[0.2em]">Kraunami terminalai...</div>
        ) : lockers.length === 0 ? (
          <div className="py-12 text-center">
            <p className="text-[10px] font-black text-slate-300 uppercase italic">Terminalų šioje vietovėje nerasta</p>
          </div>
        ) : (
          lockers.map(locker => (
            <div 
              key={locker.id}
              onClick={() => onSelect(locker)}
              className={`p-3 rounded-xl border-2 transition-all cursor-pointer flex items-center justify-between group ${selectedLockerId === locker.id ? 'border-orange-600 bg-orange-50 shadow-sm' : 'border-slate-100 hover:border-slate-200 bg-white'}`}
            >
              <div className="flex items-center gap-3">
                {getLockerIcon(locker.type)}
                <div>
                  <div className="text-[10px] font-black text-slate-900 uppercase leading-none mb-1">{locker.name}</div>
                  <div className="text-[9px] text-slate-500 font-bold">{locker.address}, {locker.city}</div>
                </div>
              </div>
              <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all ${selectedLockerId === locker.id ? 'border-orange-600 bg-orange-600' : 'border-slate-200'}`}>
                {selectedLockerId === locker.id && <div className="w-2 h-2 bg-white rounded-full"></div>}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default LockerSelector;
