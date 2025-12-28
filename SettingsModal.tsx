
import React, { useState } from 'react';
import { CloudDB } from './apiService';

export default function SettingsModal({ onClose }: { onClose: () => void }) {
  const [config, setConfig] = useState({
    url: localStorage.getItem('config_supabase_url') || '',
    key: localStorage.getItem('config_supabase_key') || ''
  });
  const [status, setStatus] = useState<{msg: string, type: 'info'|'success'|'error'}>({msg: '', type: 'info'});
  const [showSql, setShowSql] = useState(false);
  const [isTesting, setIsTesting] = useState(false);

  const handleSave = async () => {
    if (!config.url || !config.key) {
      setStatus({msg: 'Užpildykite abu laukus.', type: 'error'});
      return;
    }

    setIsTesting(true);
    setStatus({msg: 'Tikrinamas ryšys su duomenų baze...', type: 'info'});
    
    localStorage.setItem('config_supabase_url', config.url.trim());
    localStorage.setItem('config_supabase_key', config.key.trim());
    
    try {
      const res = await CloudDB.testConnection();
      setStatus({msg: res.message, type: res.success ? 'success' : 'error'});
      if (res.success) {
        setTimeout(onClose, 1500);
      }
    } catch (e) {
      setStatus({msg: 'Ryšio klaida. Patikrinkite internetą.', type: 'error'});
    } finally {
      setIsTesting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[999] flex items-center justify-center p-4 bg-slate-900/95 backdrop-blur-xl animate-in fade-in duration-300">
      <div className="bg-white rounded-[3.5rem] w-full max-w-lg p-10 shadow-2xl animate-in zoom-in duration-300 overflow-y-auto max-h-[90vh] scrollbar-hide border border-slate-100">
        <div className="flex justify-between items-start mb-8">
          <div>
            <h2 className="text-4xl font-black italic text-slate-900 leading-none uppercase tracking-tighter">Garažo<br/><span className="text-orange-600">Pajungimas</span></h2>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-4">Susiek savo paskyrą su duomenų baze</p>
          </div>
          <button onClick={onClose} className="p-3 hover:bg-slate-100 rounded-full transition-colors">
             <svg className="w-8 h-8 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
        </div>
        
        <div className="space-y-6">
          <div className="bg-slate-900 text-white p-6 rounded-3xl border-b-4 border-orange-600">
            <h3 className="text-[10px] font-black text-orange-500 uppercase tracking-widest mb-4">Svarbus žingsnis:</h3>
            <p className="text-[11px] text-slate-300 leading-relaxed uppercase font-bold italic">
              Ar jau nukopijavote žemiau esantį SQL kodą į Supabase <span className="text-white">"SQL Editor"</span> ir paspaudėte <span className="text-orange-500">RUN</span>? 
              <br/><br/>
              Be šio žingsnio programėlė negalės išsaugoti skelbimų.
            </p>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-[9px] font-black text-slate-400 uppercase mb-2 ml-4 tracking-widest">Supabase URL</label>
              <input 
                className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl p-5 text-xs font-mono outline-none focus:border-orange-500 focus:bg-white transition-all shadow-sm" 
                placeholder="https://byrj...supabase.co"
                value={config.url} 
                onChange={e => setConfig({...config, url: e.target.value})}
              />
            </div>
            <div>
              <label className="block text-[9px] font-black text-slate-400 uppercase mb-2 ml-4 tracking-widest">Anon Key (Publishable)</label>
              <input 
                type="password"
                className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl p-5 text-xs font-mono outline-none focus:border-orange-500 focus:bg-white transition-all shadow-sm" 
                placeholder="sb_publishable_..."
                value={config.key} 
                onChange={e => setConfig({...config, key: e.target.value})}
              />
            </div>
          </div>

          {status.msg && (
            <div className={`p-4 rounded-2xl text-[10px] font-black uppercase tracking-widest text-center animate-in slide-in-from-top-2 border ${status.type === 'success' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : status.type === 'error' ? 'bg-rose-50 text-rose-600 border-rose-100' : 'bg-slate-50 text-slate-500 border-slate-100'}`}>
              {isTesting && <span className="inline-block w-3 h-3 border-2 border-slate-300 border-t-slate-600 rounded-full animate-spin mr-3 align-middle"></span>}
              {status.msg}
            </div>
          )}

          <div className="grid grid-cols-1 gap-3 pt-4">
            <button 
              onClick={handleSave} 
              disabled={isTesting}
              className={`w-full py-6 bg-slate-900 text-white rounded-[2rem] font-black uppercase tracking-widest text-xs transition-all shadow-xl active:scale-95 flex items-center justify-center gap-3 ${isTesting ? 'opacity-50 cursor-not-allowed' : 'hover:bg-orange-600'}`}
            >
              {isTesting ? 'Tikrinama...' : 'Pajungti Garažą'}
            </button>
            
            <button 
              onClick={() => setShowSql(!showSql)}
              className="w-full py-3 text-[9px] font-black text-indigo-600 uppercase tracking-widest flex items-center justify-center gap-2"
            >
              {showSql ? 'Slėpti SQL kodą' : 'Rodyti SQL kodą lentelės sukūrimui'}
            </button>

            {showSql && (
              <div className="bg-slate-900 p-4 rounded-2xl animate-in fade-in slide-in-from-top-4">
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
          </div>
        </div>
      </div>
    </div>
  );
}

import React, { useState } from 'react';
import { CloudDB } from './apiService';

export default function SettingsModal({ onClose }: { onClose: () => void }) {
  const [config, setConfig] = useState({
    url: localStorage.getItem('config_supabase_url') || '',
    key: localStorage.getItem('config_supabase_key') || ''
  });
  const [status, setStatus] = useState<{msg: string, type: 'info'|'success'|'error'}>({msg: '', type: 'info'});
  const [showSql, setShowSql] = useState(false);
  const [isTesting, setIsTesting] = useState(false);

  const handleSave = async () => {
    if (!config.url || !config.key) {
      setStatus({msg: 'Užpildykite abu laukus.', type: 'error'});
      return;
    }

    setIsTesting(true);
    setStatus({msg: 'Tikrinamas ryšys su duomenų baze...', type: 'info'});
    
    localStorage.setItem('config_supabase_url', config.url.trim());
    localStorage.setItem('config_supabase_key', config.key.trim());
    
    try {
      const res = await CloudDB.testConnection();
      setStatus({msg: res.message, type: res.success ? 'success' : 'error'});
      if (res.success) {
        setTimeout(onClose, 1500);
      }
    } catch (e) {
      setStatus({msg: 'Ryšio klaida. Patikrinkite internetą.', type: 'error'});
    } finally {
      setIsTesting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[999] flex items-center justify-center p-4 bg-slate-900/95 backdrop-blur-xl animate-in fade-in duration-300">
      <div className="bg-white rounded-[3.5rem] w-full max-w-lg p-10 shadow-2xl animate-in zoom-in duration-300 overflow-y-auto max-h-[90vh] scrollbar-hide border border-slate-100">
        <div className="flex justify-between items-start mb-8">
          <div>
            <h2 className="text-4xl font-black italic text-slate-900 leading-none uppercase tracking-tighter">Garažo<br/><span className="text-orange-600">Pajungimas</span></h2>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-4">Susiek savo paskyrą su duomenų baze</p>
          </div>
          <button onClick={onClose} className="p-3 hover:bg-slate-100 rounded-full transition-colors">
             <svg className="w-8 h-8 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
        </div>
        
        <div className="space-y-6">
          <div className="bg-slate-900 text-white p-6 rounded-3xl border-b-4 border-orange-600">
            <h3 className="text-[10px] font-black text-orange-500 uppercase tracking-widest mb-4">Svarbus žingsnis:</h3>
            <p className="text-[11px] text-slate-300 leading-relaxed uppercase font-bold italic">
              Ar jau nukopijavote žemiau esantį SQL kodą į Supabase <span className="text-white">"SQL Editor"</span> ir paspaudėte <span className="text-orange-500">RUN</span>? 
              <br/><br/>
              Be šio žingsnio programėlė negalės išsaugoti skelbimų.
            </p>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-[9px] font-black text-slate-400 uppercase mb-2 ml-4 tracking-widest">Supabase URL</label>
              <input 
                className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl p-5 text-xs font-mono outline-none focus:border-orange-500 focus:bg-white transition-all shadow-sm" 
                placeholder="https://byrj...supabase.co"
                value={config.url} 
                onChange={e => setConfig({...config, url: e.target.value})}
              />
            </div>
            <div>
              <label className="block text-[9px] font-black text-slate-400 uppercase mb-2 ml-4 tracking-widest">Anon Key (Publishable)</label>
              <input 
                type="password"
                className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl p-5 text-xs font-mono outline-none focus:border-orange-500 focus:bg-white transition-all shadow-sm" 
                placeholder="sb_publishable_..."
                value={config.key} 
                onChange={e => setConfig({...config, key: e.target.value})}
              />
            </div>
          </div>

          {status.msg && (
            <div className={`p-4 rounded-2xl text-[10px] font-black uppercase tracking-widest text-center animate-in slide-in-from-top-2 border ${status.type === 'success' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : status.type === 'error' ? 'bg-rose-50 text-rose-600 border-rose-100' : 'bg-slate-50 text-slate-500 border-slate-100'}`}>
              {isTesting && <span className="inline-block w-3 h-3 border-2 border-slate-300 border-t-slate-600 rounded-full animate-spin mr-3 align-middle"></span>}
              {status.msg}
            </div>
          )}

          <div className="grid grid-cols-1 gap-3 pt-4">
            <button 
              onClick={handleSave} 
              disabled={isTesting}
              className={`w-full py-6 bg-slate-900 text-white rounded-[2rem] font-black uppercase tracking-widest text-xs transition-all shadow-xl active:scale-95 flex items-center justify-center gap-3 ${isTesting ? 'opacity-50 cursor-not-allowed' : 'hover:bg-orange-600'}`}
            >
              {isTesting ? 'Tikrinama...' : 'Pajungti Garažą'}
            </button>
            
            <button 
              onClick={() => setShowSql(!showSql)}
              className="w-full py-3 text-[9px] font-black text-indigo-600 uppercase tracking-widest flex items-center justify-center gap-2"
            >
              {showSql ? 'Slėpti SQL kodą' : 'Rodyti SQL kodą lentelės sukūrimui'}
            </button>

            {showSql && (
              <div className="bg-slate-900 p-4 rounded-2xl animate-in fade-in slide-in-from-top-4">
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
          </div>
        </div>
      </div>
    </div>
  );
}
