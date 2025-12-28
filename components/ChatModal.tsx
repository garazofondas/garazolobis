import React, { useState } from 'react';
import { Part, Locker } from '../types';
import LockerSelector from './LockerSelector';
import { PaymentAPI } from '../apiService';

interface CheckoutModalProps {
  part: Part;
  onClose: () => void;
  onComplete: (locker: Locker, method: any) => void;
}

const CheckoutModal: React.FC<CheckoutModalProps> = ({ part, onClose, onComplete }) => {
  const [step, setStep] = useState(1);
  const [selectedLocker, setSelectedLocker] = useState<Locker | null>(null);
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'paypal' | 'bank'>('card');
  const [isProcessing, setIsProcessing] = useState(false);

  const protectionFee = 0.70 + (part.price * 0.05);
  const shippingFee = 2.99;
  const total = part.price + protectionFee + shippingFee;

  const handleFinalPay = async () => {
    if (!selectedLocker) return;
    setIsProcessing(true);
    const success = await PaymentAPI.processPayment(total, paymentMethod);
    if (success) {
      onComplete(selectedLocker, paymentMethod);
    }
    setIsProcessing(false);
  };

  return (
    <div className="fixed inset-0 z-[130] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
      <div className="bg-white rounded-3xl w-full max-w-md shadow-2xl overflow-hidden animate-in zoom-in duration-200">
        <div className="p-6 bg-slate-50 border-b flex justify-between items-center">
          <div>
            <div className="flex items-center gap-2 mb-1">
               <h2 className="text-xl font-black text-slate-900 uppercase">Saugus pirkimas</h2>
               <span className="bg-green-100 text-green-700 text-[8px] font-black px-1.5 py-0.5 rounded-full uppercase">Live</span>
            </div>
            <div className="flex gap-1 mt-1">
              {[1, 2, 3].map(s => (
                <div key={s} className={`h-1 w-8 rounded-full ${step >= s ? 'bg-orange-600' : 'bg-slate-200'}`}></div>
              ))}
            </div>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-slate-200 rounded-full">
             <svg className="w-6 h-6 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
        </div>

        <div className="p-8">
          {step === 1 && (
            <div className="space-y-6 animate-in fade-in">
              <h3 className="text-sm font-black text-slate-800 uppercase tracking-widest">1. Pasirinkite paštomatą</h3>
              <LockerSelector onSelect={setSelectedLocker} selectedLockerId={selectedLocker?.id} />
              <button 
                disabled={!selectedLocker}
                onClick={() => setStep(2)}
                className="w-full bg-slate-900 text-white py-4 rounded-2xl font-black text-sm uppercase tracking-widest hover:bg-slate-800 transition-all disabled:opacity-50"
              >
                Toliau į apmokėjimą
              </button>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-6 animate-in slide-in-from-right-4">
              <h3 className="text-sm font-black text-slate-800 uppercase tracking-widest">2. Apmokėjimo būdas</h3>
              <div className="grid grid-cols-1 gap-3">
                <button 
                  onClick={() => setPaymentMethod('card')}
                  className={`p-4 rounded-2xl border-2 flex items-center gap-4 transition-all ${paymentMethod === 'card' ? 'border-orange-600 bg-orange-50' : 'border-slate-100'}`}
                >
                  <div className="w-10 h-10 bg-white rounded-xl shadow-sm flex items-center justify-center">💳</div>
                  <span className="text-xs font-black uppercase">Banko kortelė</span>
                </button>
                <button 
                  onClick={() => setPaymentMethod('paypal')}
                  className={`p-4 rounded-2xl border-2 flex items-center gap-4 transition-all ${paymentMethod === 'paypal' ? 'border-orange-600 bg-orange-50' : 'border-slate-100'}`}
                >
                  <div className="w-10 h-10 bg-white rounded-xl shadow-sm flex items-center justify-center text-blue-600 font-bold italic">PP</div>
                  <span className="text-xs font-black uppercase">PayPal</span>
                </button>
                <button 
                  onClick={() => setPaymentMethod('bank')}
                  className={`p-4 rounded-2xl border-2 flex items-center gap-4 transition-all ${paymentMethod === 'bank' ? 'border-orange-600 bg-orange-50' : 'border-slate-100'}`}
                >
                  <div className="w-10 h-10 bg-white rounded-xl shadow-sm flex items-center justify-center">🏦</div>
                  <span className="text-xs font-black uppercase">Bank-Link</span>
                </button>
              </div>
              <button 
                onClick={() => setStep(3)}
                className="w-full bg-slate-900 text-white py-4 rounded-2xl font-black text-sm uppercase tracking-widest hover:bg-slate-800 transition-all"
              >
                Peržiūrėti užsakymą
              </button>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-6 animate-in slide-in-from-right-4">
              <h3 className="text-sm font-black text-slate-800 uppercase tracking-widest">3. Galutinis patvirtinimas</h3>
              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 space-y-2">
                <div className="flex justify-between text-[10px] uppercase font-black text-slate-400">
                  <span>Siuntimas į:</span>
                  <span className="text-slate-900">{selectedLocker?.name}</span>
                </div>
                <div className="flex justify-between text-[10px] uppercase font-black text-slate-400">
                  <span>Mokėjimas:</span>
                  <span className="text-slate-900">{paymentMethod.toUpperCase()}</span>
                </div>
                <div className="pt-2 border-t border-slate-200 flex justify-between items-center">
                  <span className="text-sm font-black uppercase italic">Iš viso mokėti:</span>
                  <span className="text-2xl font-black text-orange-600 tracking-tighter">€{total.toFixed(2)}</span>
                </div>
              </div>

              <div className="flex flex-col gap-3">
                <button 
                  disabled={isProcessing}
                  onClick={handleFinalPay}
                  className="w-full bg-orange-600 text-white py-5 rounded-2xl font-black text-sm uppercase tracking-widest hover:bg-orange-700 transition-all shadow-xl shadow-orange-100 flex items-center justify-center gap-3"
                >
                  {isProcessing ? (
                    <><div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin"></div> JUNGIAMĖS PER STRIPE...</>
                  ) : `SUMOKĖTI €${total.toFixed(2)}`}
                </button>
                <div className="flex items-center justify-center gap-2 opacity-40">
                   <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm4.59-12.42L10 14.17l-2.59-2.58L6 13l4 4 8-8z"/></svg>
                   <span className="text-[10px] font-black uppercase tracking-widest">Saugų mokėjimą užtikrina Stripe</span>
                </div>
              </div>
              <button onClick={() => setStep(2)} className="w-full text-slate-400 text-[10px] font-black uppercase hover:text-slate-600 transition-all">Keisti duomenis</button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CheckoutModal;
