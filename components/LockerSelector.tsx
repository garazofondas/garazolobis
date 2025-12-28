import React, { useState, useEffect } from 'react';
import { Locker } from '../types';
import { LockerAPI } from '../apiService';

interface LockerSelectorProps {
  onSelect: (locker: Locker) => void;
  selectedLockerId?: string;
}

const LockerSelector: React.FC<LockerSelectorProps> = ({ onSelect, selectedLockerId }) => {
  const [search, setSearch] = useState('');
  const [lockers, setLockers] = useState<Locker[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(true);
      LockerAPI.fetchLockers(search).then(res => {
        setLockers(res);
        setLoading(false);
      });
    }, 300);
    return () => clearTimeout(timer);
  }, [search]);

  return (
    <div className="space-y-4">
      <div className="relative">
        <input 
          type="text"
          placeholder="Ieškoti pagal miestą ar gatvę..."
          className="w-full bg-slate-100 border border-transparent focus:bg-white focus:border-orange-500 rounded-xl py-3 px-10 text-xs font-bold outline-none transition-all"
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
        <svg className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
      </div>

      <div className="max-h-60 overflow-y-auto space-y-2 pr-2 scrollbar-thin scrollbar-thumb-slate-200">
        {loading ? (
          <div className="py-10 text-center animate-pulse text-[10px] font-black text-slate-400 uppercase tracking-widest">Ieškoma spintelių...</div>
        ) : lockers.length === 0 ? (
          <div className="py-10 text-center text-[10px] font-black text-slate-300 uppercase">Paštomatų nerasta</div>
        ) : (
          lockers.map(locker => (
            <div 
              key={locker.id}
              onClick={() => onSelect(locker)}
              className={`p-3 rounded-xl border-2 transition-all cursor-pointer flex items-center justify-between group ${selectedLockerId === locker.id ? 'border-orange-600 bg-orange-50 shadow-sm' : 'border-slate-100 hover:border-slate-200 hover:bg-slate-50'}`}
            >
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center font-black text-[8px] uppercase ${locker.type === 'Omniva' ? 'bg-orange-600 text-white' : locker.type === 'DPD' ? 'bg-red-600 text-white' : 'bg-slate-900 text-white'}`}>
                  {locker.type}
                </div>
                <div>
                  <div className="text-[10px] font-black text-slate-900 uppercase tracking-tight">{locker.name}</div>
                  <div className="text-[10px] text-slate-500 font-medium">{locker.address}, {locker.city}</div>
                </div>
              </div>
              <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center transition-all ${selectedLockerId === locker.id ? 'border-orange-600 bg-orange-600' : 'border-slate-200 group-hover:border-slate-300'}`}>
                {selectedLockerId === locker.id && <div className="w-1.5 h-1.5 bg-white rounded-full"></div>}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default LockerSelector;