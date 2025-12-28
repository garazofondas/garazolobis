
import React, { useState } from 'react';
import { CloudDB } from './apiService';

export default function SettingsModal({ onClose }: { onClose: () => void }) {
  const [config, setConfig] = useState({
    url: localStorage.getItem('config_supabase_url') || '',
    key: localStorage.getItem('config_supabase_key') || ''
  });
  const [status, setStatus] = useState<{msg: string, type: 'info'|'success'|'error'}>({msg: '', type: 'info'});
  const [showSql, setShowSql] = useState(false);

  const handleSave = async () => {
    if (!config.url || !config.key) {
      setStatus({msg: 'Užpildykite abu laukus.', type: 'error'});
      return;
    }

    localStorage.setItem('config_supabase_url', config.url);
    localStorage.setItem('config_supabase_key', config.key);
    setStatus({msg: 'Tikrinamas ryšys...', type: 'info'});
    
    try {
      const res = await CloudDB.testConnection();
      setStatus({msg: res.message, type: res.success ? 'success' : 'error'});
      if (res.success) {
        setTimeout(onClose, 1500);
      }
    } catch (e) {
      setStatus({msg: 'Sistemos klaida jungiantis.', type: 'error'});
    }
  };

  return (
    <div className="fixed inset-0 z-[999] flex items-center justify-center p-4 bg-slate-900/95 backdrop-blur-xl animate-in fade-in duration-300">
      <div className="bg-white rounded-[3rem] w-full max-w-lg p-10 shadow-2xl animate-in zoom-in duration-300 overflow-y-auto max-h-[90vh] scrollbar-hide">
        <div className="flex justify-between items-start mb-8">
          <div>
            <h2 className="text-3xl font-black italic text-slate-900 leading-none uppercase tracking-tighter">Sistemos<br/><span className="text-orange-600">Konfigūracija</span></h2>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-3">Sujunk programėlę su savo duomenų baze</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-full transition-colors">
             <svg className="w-6 h-6 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
        </div>
        
        <div className="space-y-6">
          <div className="bg-orange-50 p-6 rounded-2xl border border-orange-100">
            <h3 className="text-[10px] font-black text-orange-800 uppercase tracking-widest mb-2 flex items-center gap-2">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
              Kur gauti raktus?
            </h3>
            <p className="text-[11px] text-orange-700 font-medium leading-relaxed">
              Užsiregistruokite <a href="https://supabase.com" target="_blank" className="underline font-bold">supabase.com</a>, sukurkite projektą ir skiltyje <b>Settings -> API</b> rasite URL bei "anon public" raktą.
            </p>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-[10px] font-black text-slate-400 uppercase mb-2 tracking-widest">Supabase URL</label>
              <input 
                className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl p-4 text-xs font-mono outline-none focus:border-orange-500 transition-all" 
                placeholder="https://xyz.supabase.co"
                value={config.url} 
                onChange={e => setConfig({...config, url: e.target.value})}
              />
            </div>
            <div>
              <label className="block text-[10px] font-black text-slate-400 uppercase mb-2 tracking-widest">Anon Key</label>
              <input 
                type="password"
                className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl p-4 text-xs font-mono outline-none focus:border-orange-500 transition-all" 
                placeholder="eyJhbGci..."
                value={config.key} 
                onChange={e => setConfig({...config, key: e.target.value})}
              />
            </div>
          </div>

          <button 
            onClick={() => setShowSql(!showSql)}
            className="w-full text-[9px] font-black text-indigo-600 uppercase tracking-widest flex items-center justify-center gap-2 py-2"
          >
            {showSql ? 'Slėpti SQL schemą' : 'Rodyti SQL schemą (lentelės sukūrimui)'}
          </button>

          {showSql && (
            <div className="bg-slate-900 p-4 rounded-xl">
              <pre className="text-[9px] text-emerald-400 overflow-x-auto font-mono whitespace-pre-wrap leading-relaxed">
{`create table parts (
  id text primary key,
  title text not null,
  price numeric not null,
  category text,
  brand text,
  description text,
  imageUrl text,
  condition text,
  location text,
  createdAt timestamp with time zone default now(),
  seller jsonb,
  compatibility jsonb,
  partCode text
);`}
              </pre>
            </div>
          )}

          {status.msg && (
            <div className={`p-4 rounded-2xl text-[10px] font-black uppercase tracking-widest text-center animate-in slide-in-from-top-2 ${status.type === 'success' ? 'bg-emerald-50 text-emerald-600' : status.type === 'error' ? 'bg-rose-50 text-rose-600' : 'bg-slate-50 text-slate-500'}`}>
              {status.msg}
            </div>
          )}

          <div className="grid grid-cols-1 gap-3">
            <button 
              onClick={handleSave} 
              className="w-full py-5 bg-slate-900 text-white rounded-[2rem] font-black uppercase tracking-widest text-xs hover:bg-orange-600 transition-all shadow-xl active:scale-95"
            >
              Išsaugoti ir Tikrinti
            </button>
            <button 
              onClick={onClose}
              className="w-full py-4 text-slate-400 font-black uppercase text-[10px] tracking-widest hover:text-slate-600 transition-all"
            >
              Testuoti be debesies (Local Storage)
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
