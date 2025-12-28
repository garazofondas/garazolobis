
import React, { useState } from 'react';

interface WithdrawModalProps {
  balance: number;
  onClose: () => void;
  onWithdraw: (amount: number, iban: string) => void;
  initialIban: string;
}

const WithdrawModal: React.FC<WithdrawModalProps> = ({ balance, onClose, onWithdraw, initialIban }) => {
  const [amount, setAmount] = useState(balance.toString());
  const [iban, setIban] = useState(initialIban);
  const [name, setName] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const withdrawAmount = parseFloat(amount);
    if (withdrawAmount > 0 && withdrawAmount <= balance && iban.length > 10) {
      onWithdraw(withdrawAmount, iban);
    } else {
      alert("Patikrinkite suvestus duomenis.");
    }
  };

  return (
    <div className="fixed inset-0 z-[140] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
      <div className="bg-white rounded-3xl w-full max-w-md shadow-2xl overflow-hidden animate-in zoom-in duration-200">
        <div className="p-6 border-b bg-slate-50 flex justify-between items-center">
          <h2 className="text-xl font-black text-slate-900 uppercase">Išgryninti pinigus</h2>
          <button onClick={onClose} className="p-2 hover:bg-slate-200 rounded-full">
             <svg className="w-6 h-6 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-8 space-y-6">
          <div className="text-center p-4 bg-orange-50 rounded-2xl border border-orange-100">
            <div className="text-[10px] font-black text-orange-600 uppercase tracking-widest mb-1">Galima išgryni</div>
            <div className="text-3xl font-black text-orange-700 tracking-tighter">€{balance.toFixed(2)}</div>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-[10px] font-black text-slate-400 uppercase mb-1 tracking-widest">Suma (€)</label>
              <input 
                type="number" 
                max={balance}
                step="0.01"
                className="w-full bg-slate-50 border border-slate-200 rounded-xl py-4 px-4 text-lg font-bold focus:ring-2 focus:ring-orange-500 outline-none" 
                value={amount}
                onChange={e => setAmount(e.target.value)}
              />
            </div>

            <div>
              <label className="block text-[10px] font-black text-slate-400 uppercase mb-1 tracking-widest">Sąskaitos numeris (IBAN)</label>
              <input 
                required
                className="w-full bg-slate-50 border border-slate-200 rounded-xl py-4 px-4 text-sm font-bold focus:ring-2 focus:ring-orange-500 outline-none uppercase" 
                placeholder="LT00 0000 0000 0000 0000"
                value={iban}
                onChange={e => setIban(e.target.value)}
              />
            </div>

            <div>
              <label className="block text-[10px] font-black text-slate-400 uppercase mb-1 tracking-widest">Gavėjo vardas, pavardė</label>
              <input 
                required
                className="w-full bg-slate-50 border border-slate-200 rounded-xl py-4 px-4 text-sm font-bold focus:ring-2 focus:ring-orange-500 outline-none" 
                placeholder="VARDENIS PAVARDENIS"
                value={name}
                onChange={e => setName(e.target.value.toUpperCase())}
              />
            </div>
          </div>

          <div className="text-[10px] text-slate-400 font-medium leading-relaxed italic">
            * Pervedimai atliekami per 1-3 darbo dienas. Minimali suma – €5.00.
          </div>

          <button 
            type="submit"
            className="w-full bg-slate-900 text-white py-5 rounded-2xl font-black text-sm uppercase tracking-widest hover:bg-slate-800 transition-all shadow-xl shadow-slate-200"
          >
            Patvirtinti pervedimą
          </button>
        </form>
      </div>
    </div>
  );
};

export default WithdrawModal;
