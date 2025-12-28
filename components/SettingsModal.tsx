
import React, { useState } from 'react';
import { CloudDB } from '../apiService';

export default function SettingsModal({ onClose }: { onClose: () => void }) {
  const [config, setConfig] = useState({
    url: localStorage.getItem('config_supabase_url') || '',
    key: localStorage.getItem('config_supabase_key') || ''
  });
  const [status, setStatus] = useState('');

  const handleSave = async () => {
    localStorage.setItem('config_supabase_url', config.url);
    localStorage.setItem('config_supabase_key', config.key);
    setStatus('Tikrinamas ryšys...');
    const res = await CloudDB.testConnection();
    setStatus(res.message);
    if (res.success) setTimeout(onClose, 1000);
  };

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-slate-900/90 backdrop-blur-md">
      <div className="bg-white rounded-[2rem] w-full max-w-md p-10 shadow-2xl overflow-hidden">
        <h2 className="text-2xl font-black uppercase italic mb-8">Sistemos <span className="text-orange-600">Mazgas</span></h2>
        
        <div className="space-y-6">
          <div>
            <label className="block text-[10px] font-black text-slate-400 uppercase mb-2 tracking-widest">Supabase URL</label>
            <input 
              className="w-full bg-slate-50 border-2 rounded-xl p-4 text-xs font-mono outline-none focus:border-orange-500" 
              value={config.url} 
              onChange={e => setConfig({...config, url: e.target.value})}
            />
          </div>
          <div>
            <label className="block text-[10px] font-black text-slate-400 uppercase mb-2 tracking-widest">Anon Key</label>
            <input 
              type="password"
              className="w-full bg-slate-50 border-2 rounded-xl p-4 text-xs font-mono outline-none focus:border-orange-500" 
              value={config.key} 
              onChange={e => setConfig({...config, key: e.target.value})}
            />
          </div>
          {status && <p className="text-[10px] font-black text-orange-600 uppercase text-center">{status}</p>}
          <button onClick={handleSave} className="w-full py-5 bg-slate-900 text-white rounded-2xl font-black uppercase tracking-widest text-xs">Išsaugoti</button>
        </div>
      </div>
    </div>
  );
}
