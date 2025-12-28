import React, { useState } from 'react';

interface AuthModalProps {
  onClose: () => void;
  onSuccess: () => void;
}

const AuthModal: React.FC<AuthModalProps> = ({ onClose, onSuccess }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [agreed, setAgreed] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState('');

  const handleAction = () => {
    setError('');
    
    if (!email || !password || (!isLogin && !name)) {
      setError('Užpildykite visus laukus!');
      return;
    }

    if (!email.includes('@')) {
      setError('Neteisingas el. pašto formatas!');
      return;
    }

    if (password.length < 6) {
      setError('Slaptažodis turi būti bent 6 simbolių!');
      return;
    }

    if (!isLogin && !agreed) {
      setError('Privalote sutikti su taisyklėmis.');
      return;
    }

    // Imituojame sėkmingą prisijungimą
    onSuccess();
  };

  return (
    <div className="fixed inset-0 z-[120] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
      <div className="bg-white rounded-3xl w-full max-w-md shadow-2xl overflow-hidden animate-in zoom-in duration-200 relative">
        <div className="p-8">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-orange-600 text-white rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-orange-100 transform -rotate-6">
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>
            <h2 className="text-2xl font-black text-slate-900 uppercase tracking-tight">
              {isLogin ? 'Sveikas sugrįžęs!' : 'Prisijunk prie garažo'}
            </h2>
            <p className="text-slate-500 mt-2">Prisijunk, kad galėtum pirkti ir parduoti saugiai.</p>
          </div>

          <div className="space-y-4">
            {error && (
              <div className="bg-rose-50 text-rose-600 p-3 rounded-xl text-xs font-black uppercase text-center border border-rose-100 animate-bounce">
                {error}
              </div>
            )}

            {!isLogin && (
              <div>
                <label className="block text-xs font-black text-slate-400 uppercase mb-1 tracking-widest">Vardas</label>
                <input 
                  type="text" 
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className={`w-full bg-slate-50 border ${error && !name ? 'border-rose-500' : 'border-slate-200'} rounded-xl px-4 py-3 focus:ring-2 focus:ring-orange-500 outline-none transition-all`} 
                  placeholder="Vardenis" 
                />
              </div>
            )}
            <div>
              <label className="block text-xs font-black text-slate-400 uppercase mb-1 tracking-widest">El. paštas</label>
              <input 
                type="email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={`w-full bg-slate-50 border ${error && !email ? 'border-rose-500' : 'border-slate-200'} rounded-xl px-4 py-3 focus:ring-2 focus:ring-orange-500 outline-none transition-all`} 
                placeholder="pavyzdys@pastas.lt" 
              />
            </div>
            <div>
              <label className="block text-xs font-black text-slate-400 uppercase mb-1 tracking-widest">Slaptažodis</label>
              <input 
                type="password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className={`w-full bg-slate-50 border ${error && !password ? 'border-rose-500' : 'border-slate-200'} rounded-xl px-4 py-3 focus:ring-2 focus:ring-orange-500 outline-none transition-all`} 
                placeholder="••••••••" 
              />
            </div>

            {!isLogin && (
              <div className="flex items-start gap-3 mt-4">
                <input 
                  type="checkbox" 
                  id="terms" 
                  checked={agreed}
                  onChange={(e) => setAgreed(e.target.checked)}
                  className="mt-1 w-4 h-4 text-orange-600 border-slate-300 rounded focus:ring-orange-500"
                />
                <label htmlFor="terms" className="text-[10px] text-slate-500 leading-tight">
                  Sutinku su <a href="#" className="text-orange-600 underline">Taisyklėmis</a> ir patvirtinu, kad susipažinau su <a href="#" className="text-orange-600 underline">Privatumo politika</a>.
                </label>
              </div>
            )}

            <button 
              onClick={handleAction}
              className="w-full bg-orange-600 hover:bg-orange-700 text-white py-4 rounded-2xl font-black text-sm transition-all shadow-lg shadow-orange-100 mt-4 uppercase tracking-wider"
            >
              {isLogin ? 'Prisijungti' : 'Registruotis'}
            </button>
          </div>

          <div className="mt-8 pt-6 border-t border-slate-100 text-center">
            <button 
              onClick={() => { setIsLogin(!isLogin); setError(''); }}
              className="text-slate-500 text-sm font-medium hover:text-orange-600 transition-colors"
            >
              {isLogin ? 'Neturi paskyros? Registruokis' : 'Jau turi paskyrą? Prisijunk'}
            </button>
          </div>
        </div>

        <button 
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-slate-400 hover:bg-slate-100 rounded-full transition-all"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
        </button>
      </div>
    </div>
  );
};

export default AuthModal;
