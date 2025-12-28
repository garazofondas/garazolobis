
import React, { useState, useEffect } from 'react';

interface SettingsModalProps {
  onClose: () => void;
}

const SettingsModal: React.FC<SettingsModalProps> = ({ onClose }) => {
  const [keys, setKeys] = useState({
    supabaseUrl: localStorage.getItem('config_supabase_url') || '',
    supabaseKey: localStorage.getItem('config_supabase_key') || '',
    dpdUser: localStorage.getItem('config_dpd_user') || '',
    dpdPass: localStorage.getItem('config_dpd_pass') || '',
  });

  const [status, setStatus] = useState({
    db: !!keys.supabaseUrl,
    logistics: !!keys.dpdUser
  });

  const handleSave = () => {
    localStorage.setItem('config_supabase_url', keys.supabaseUrl);
    localStorage.setItem('config_supabase_key', keys.supabaseKey);
    localStorage.setItem('config_dpd_user', keys.dpdUser);
    localStorage.setItem('config_dpd_pass', keys.dpdPass);
    alert('Sistemos parametrai atnaujinti. Perkraunama...');
    onClose();
    window.location.reload();
  };

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-slate-900/95 backdrop-blur-2xl">
      <div className="bg-white rounded-[3rem] w-full max-w-xl shadow-2xl overflow-hidden animate-in zoom-in duration-300 border border-white/20">
        <div className="bg-slate-900 p-10 text-white flex justify-between items-center">
          <div>
            <h2 className="text-3xl font-black uppercase italic tracking-tighter">SISTEMOS MAZGAS</h2>
            <p className="text-[10px] text-red-500 font-black uppercase tracking-[0.3em] mt-2 italic">Konfigūracija ir diagnostika</p>
          </div>
          <button onClick={onClose} className="p-3 hover:bg-white/10 rounded-full transition-colors">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
        </div>

        <div className="p-10 space-y-8">
          <div className="grid grid-cols-2 gap-4">
             <div className={`p-4 rounded-2xl border-2 flex items-center gap-3 ${status.db ? 'bg-emerald-50 border-emerald-100' : 'bg-slate-50 border-slate-100 opacity-50'}`}>
                <div className={`w-3 h-3 rounded-full ${status.db ? 'bg-emerald-500 animate-pulse' : 'bg-slate-300'}`}></div>
                <span className="text-[10px] font-black uppercase text-slate-700 tracking-widest">Debesų DB</span>
             </div>
             <div className={`p-4 rounded-2xl border-2 flex items-center gap-3 ${status.logistics ? 'bg-red-50 border-red-100' : 'bg-slate-50 border-slate-100 opacity-50'}`}>
                <div className={`w-3 h-3 rounded-full ${status.logistics ? 'bg-red-500 animate-pulse' : 'bg-slate-300'}`}></div>
                <span className="text-[10px] font-black uppercase text-slate-700 tracking-widest">DPD Ryšys</span>
             </div>
          </div>

          <div className="space-y-6">
             <div className="space-y-5">
               <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest border-b pb-2">Logistika (DPD Lietuva)</h4>
               <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] font-black text-slate-400 uppercase mb-2 tracking-widest">Vartotojas</label>
                    <input 
                      className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl px-5 py-4 text-sm font-bold focus:border-red-600 outline-none transition-all"
                      placeholder="PVZ: DPD_API_USER"
                      value={keys.dpdUser}
                      onChange={e => setKeys({...keys, dpdUser: e.target.value})}
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-black text-slate-400 uppercase mb-2 tracking-widest">Slaptažodis</label>
                    <input 
                      type="password"
                      className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl px-5 py-4 text-sm font-bold focus:border-red-600 outline-none transition-all"
                      placeholder="••••••••"
                      value={keys.dpdPass}
                      onChange={e => setKeys({...keys, dpdPass: e.target.value})}
                    />
                  </div>
               </div>

               <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest border-b pb-2 pt-4">Duomenų Saugykla (Supabase)</h4>
               <div className="space-y-4">
                  <div>
                    <label className="block text-[10px] font-black text-slate-400 uppercase mb-2 tracking-widest">Supabase URL</label>
                    <input 
                      className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl px-5 py-4 text-sm font-mono focus:border-orange-500 outline-none transition-all"
                      placeholder="https://your-id.supabase.co"
                      value={keys.supabaseUrl}
                      onChange={e => setKeys({...keys, supabaseUrl: e.target.value})}
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-black text-slate-400 uppercase mb-2 tracking-widest">Anon Key</label>
                    <input 
                      type="password"
                      className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl px-5 py-4 text-sm font-mono focus:border-orange-500 outline-none transition-all"
                      placeholder="eyJhbG..."
                      value={keys.supabaseKey}
                      onChange={e => setKeys({...keys, supabaseKey: e.target.value})}
                    />
                  </div>
               </div>
             </div>
          </div>

          <button 
            onClick={handleSave}
            className="w-full py-6 bg-slate-900 text-white rounded-[2rem] font-black text-sm uppercase tracking-widest hover:bg-orange-600 transition-all shadow-2xl active:scale-95"
          >
            IŠSAUGOTI IR AKTYVUOTI
          </button>
        </div>
      </div>
    </div>
  );
};

export default SettingsModal;
