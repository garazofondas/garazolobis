
import React, { useState, useEffect } from 'react';
import { CloudDB } from '../apiService';

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

  const [testing, setTesting] = useState(false);
  const [testResult, setTestResult] = useState<{success?: boolean, message?: string}>({});

  const handleSave = async () => {
    localStorage.setItem('config_supabase_url', keys.supabaseUrl);
    localStorage.setItem('config_supabase_key', keys.supabaseKey);
    localStorage.setItem('config_dpd_user', keys.dpdUser);
    localStorage.setItem('config_dpd_pass', keys.dpdPass);
    
    setTesting(true);
    const result = await CloudDB.testConnection();
    setTestResult(result);
    setTesting(false);

    if (result.success) {
      setTimeout(() => {
        onClose();
        window.location.reload();
      }, 1500);
    }
  };

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-slate-900/95 backdrop-blur-2xl">
      <div className="bg-white rounded-[3rem] w-full max-w-xl shadow-2xl overflow-hidden animate-in zoom-in duration-300 border border-white/20">
        <div className="bg-slate-900 p-10 text-white flex justify-between items-center">
          <div>
            <h2 className="text-3xl font-black uppercase italic tracking-tighter leading-none">SISTEMOS <br/><span className="text-red-600">MAZGAS</span></h2>
            <p className="text-[10px] text-slate-400 font-black uppercase tracking-[0.3em] mt-3 italic">Konfigūracija ir diagnostika</p>
          </div>
          <button onClick={onClose} className="p-3 hover:bg-white/10 rounded-full transition-colors">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
        </div>

        <div className="p-10 space-y-8">
          {testResult.message && (
            <div className={`p-6 rounded-[2rem] border-2 animate-in slide-in-from-top-4 flex items-center gap-4 ${testResult.success ? 'bg-emerald-50 border-emerald-100 text-emerald-800' : 'bg-rose-50 border-rose-100 text-rose-800'}`}>
               <div className={`w-10 h-10 rounded-2xl flex items-center justify-center text-xl shadow-lg ${testResult.success ? 'bg-emerald-600 text-white' : 'bg-rose-600 text-white'}`}>
                  {testResult.success ? '✓' : '!'}
               </div>
               <div>
                  <div className="text-[10px] font-black uppercase tracking-widest opacity-60">Sistemos atsakas:</div>
                  <div className="text-sm font-black italic uppercase">{testResult.message}</div>
               </div>
            </div>
          )}

          <div className="space-y-6">
             <div className="space-y-5">
               <div className="flex justify-between items-center border-b pb-2">
                 <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Logistika (DPD Lietuva)</h4>
                 {keys.dpdUser && <span className="bg-red-600 text-white text-[8px] font-black px-2 py-0.5 rounded-full uppercase">Pajungta</span>}
               </div>
               <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] font-black text-slate-400 uppercase mb-2 tracking-widest">Vartotojas</label>
                    <input 
                      className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl px-5 py-4 text-sm font-bold focus:border-red-600 outline-none transition-all"
                      placeholder="API_USER"
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

               <div className="flex justify-between items-center border-b pb-2 pt-4">
                 <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Saugykla (Supabase)</h4>
                 {keys.supabaseUrl && <span className="bg-emerald-600 text-white text-[8px] font-black px-2 py-0.5 rounded-full uppercase">Cloud Active</span>}
               </div>
               <div className="space-y-4">
                  <div>
                    <label className="block text-[10px] font-black text-slate-400 uppercase mb-2 tracking-widest">Project URL</label>
                    <input 
                      className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl px-5 py-4 text-sm font-mono focus:border-orange-500 outline-none transition-all"
                      placeholder="https://xyz.supabase.co"
                      value={keys.supabaseUrl}
                      onChange={e => setKeys({...keys, supabaseUrl: e.target.value})}
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-black text-slate-400 uppercase mb-2 tracking-widest">Anon Public Key</label>
                    <input 
                      type="password"
                      className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl px-5 py-4 text-sm font-mono focus:border-orange-500 outline-none transition-all"
                      placeholder="eyJhbGci..."
                      value={keys.supabaseKey}
                      onChange={e => setKeys({...keys, supabaseKey: e.target.value})}
                    />
                  </div>
               </div>
             </div>
          </div>

          <button 
            onClick={handleSave}
            disabled={testing}
            className="w-full py-6 bg-slate-900 text-white rounded-[2rem] font-black text-sm uppercase tracking-widest hover:bg-orange-600 transition-all shadow-2xl active:scale-95 flex items-center justify-center gap-4"
          >
            {testing ? (
              <><div className="w-5 h-5 border-4 border-white/20 border-t-white rounded-full animate-spin"></div> TESTUOJAMAS RYŠYS...</>
            ) : 'IŠSAUGOTI IR TESTUOTI'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default SettingsModal;
