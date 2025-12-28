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
    
    // Tikriname ar užpildyti pagrindiniai laukai
    if (!email || !password) {
      setError('Įveskite el. paštą ir slaptažodį!');
      return;
    }

    if (!isLogin && !name) {
      setError('Įveskite savo vardą!');
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

    // Jei viskas gerai - sėkmė
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
          </div>

          <div className="space-y-4">
            {error && (
              <div className="bg-rose-50 text-rose-600 p-3 rounded-xl text-[10px] font-black uppercase text-center border border-rose-100 animate-bounce">
                {error}
              </div>
            )}

            {!isLogin && (
              <div>
                <label className="block text-[9px] font-black text-slate-400 uppercase mb-1 tracking-widest">Vardas</label>
                <input 
                  type="text" 
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-orange-500 outline-none transition-all text-sm font-bold" 
                  placeholder="Vardenis" 
                />
              </div>
            )}
            
            <div>
              <label className="block text-[9px] font-black text-slate-400 uppercase mb-1 tracking-widest">El. paštas</label>
              <input 
                type="email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-orange-500 outline-none transition-all text-sm font-bold" 
                placeholder="pavyzdys@pastas.lt" 
              />
            </div>

            <div>
              <label className="block text-[9px] font-black text-slate-400 uppercase mb-1 tracking-widest">Slaptažodis</label>
              <input 
                type="password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-orange-500 outline-none transition-all text-sm font-bold" 
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
                  Sutinku su taisyklėmis ir privatumo politika.
                </label>
              </div>
            )}

            <button 
              onClick={handleAction}
              className="w-full bg-orange-600 hover:bg-orange-700 text-white py-4 rounded-2xl font-black text-sm transition-all shadow-lg shadow-orange-100 mt-4 uppercase tracking-wider active:scale-95"
            >
              {isLogin ? 'Prisijungti' : 'Registruotis'}
            </button>
          </div>

          <div className="mt-8 pt-6 border-t border-slate-100 text-center">
            <button 
              onClick={() => { setIsLogin(!isLogin); setError(''); }}
              className="text-slate-500 text-[10px] font-black uppercase hover:text-orange-600 transition-colors tracking-widest"
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
