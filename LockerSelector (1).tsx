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

  const getLockerIcon = (type: Locker['type']) => {
    switch (type) {
      case 'Omniva': return <div className="w-8 h-8 bg-orange-600 rounded flex items-center justify-center font-black text-white text-[8px]">O</div>;
      case 'DPD': return <div className="w-8 h-8 bg-red-600 rounded flex items-center justify-center font-black text-white text-[8px]">DPD</div>;
      case 'LP Express': return <div className="w-8 h-8 bg-slate-900 rounded flex items-center justify-center font-black text-white text-[8px]">LP</div>;
    }
  };

  return (
    <div className="space-y-4">
      <div className="relative">
        <input 
          type="text"
          placeholder="Ieškoti miesto, gatvės ar pavadinimo..."
          className="w-full bg-slate-100 border-2 border-transparent focus:border-orange-500 focus:bg-white rounded-xl py-3 px-10 text-xs font-bold outline-none transition-all"
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
        <svg className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
      </div>

      <div className="max-h-60 overflow-y-auto space-y-2 pr-2 scrollbar-thin">
        {loading ? (
          <div className="py-10 text-center text-[10px] font-black text-slate-400 uppercase animate-pulse">Kraunami terminalai...</div>
        ) : lockers.length === 0 ? (
          <div className="py-10 text-center text-[10px] font-black text-slate-300 uppercase italic">Terminalų nerasta</div>
        ) : (
          lockers.map(locker => (
            <div 
              key={locker.id}
              onClick={() => onSelect(locker)}
              className={`p-3 rounded-xl border-2 transition-all cursor-pointer flex items-center justify-between group ${selectedLockerId === locker.id ? 'border-orange-600 bg-orange-50' : 'border-slate-100 hover:border-slate-200'}`}
            >
              <div className="flex items-center gap-3">
                {getLockerIcon(locker.type)}
                <div>
                  <div className="text-[10px] font-black text-slate-900 uppercase">{locker.name}</div>
                  <div className="text-[9px] text-slate-500">{locker.address}, {locker.city}</div>
                </div>
              </div>
              <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${selectedLockerId === locker.id ? 'border-orange-600' : 'border-slate-200'}`}>
                {selectedLockerId === locker.id && <div className="w-2 h-2 bg-orange-600 rounded-full"></div>}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default LockerSelector;