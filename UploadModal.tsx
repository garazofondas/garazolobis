import React, { useState, useRef } from 'react';
import { analyzePartImage } from './geminiService';
import { CloudDB } from './apiService';
import { Condition } from './types';

export default function UploadModal({ onClose, onAdd }: any) {
  const [image, setImage] = useState<string | null>(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({ title: '', price: '', category: '', brand: '', description: '' });
  const inputRef = useRef<HTMLInputElement>(null);

  const handleImage = (e: any) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => setImage(reader.result as string);
      reader.readAsDataURL(file);
      setError('');
    }
  };

  const startAI = async () => {
    if (!image) return;
    setAnalyzing(true);
    setError('');
    try {
      const res = await analyzePartImage(image);
      setFormData({
        title: res.title || '',
        price: (res.suggestedPrice || '').toString(),
        category: res.category || '',
        brand: res.brand || '',
        description: res.description || ''
      });
    } catch (e) {
      setError("AI nepavyko atpažinti nuotraukos. Įveskite duomenis ranka.");
    } finally {
      setAnalyzing(false);
    }
  };

  const handleSave = async () => {
    if (!image) {
      setError('Privalote įkelti nuotrauką!');
      return;
    }
    if (!formData.title || !formData.price) {
      setError('Užpildykite pavadinimą ir kainą!');
      return;
    }

    const priceNum = parseFloat(formData.price);
    if (isNaN(priceNum) || priceNum <= 0) {
      setError('Neteisinga kaina!');
      return;
    }

    const part = {
      ...formData,
      id: Math.random().toString(36).substr(2, 9),
      price: priceNum,
      imageUrl: image!,
      condition: Condition.GOOD,
      location: 'Vilnius',
      createdAt: new Date().toISOString(),
      compatibility: { brand: formData.brand || 'Universalu', model: 'Universalu', configurations: [] },
      seller: { name: 'Mano Garažas', rating: 5, reviewCount: 0, avatar: 'https://picsum.photos/seed/mygarage/100/100' }
    };

    try {
      await CloudDB.savePart(part as any);
      onAdd();
      onClose();
    } catch (err) {
      setError('Nepavyko išsaugoti duomenų bazėje.');
    }
  };

  return (
    <div className="fixed inset-0 z-[150] flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-md">
      <div className="bg-white rounded-[2.5rem] w-full max-w-4xl p-10 flex flex-col md:flex-row gap-10 shadow-2xl overflow-y-auto max-h-[95vh]">
        <div className="md:w-1/2 space-y-6">
           <div 
             onClick={() => inputRef.current?.click()}
             className={`aspect-square bg-slate-50 border-4 border-dashed rounded-[2rem] flex items-center justify-center cursor-pointer overflow-hidden relative group transition-all ${!image && error ? 'border-rose-300 bg-rose-50' : 'border-slate-100'}`}
           >
             {image ? <img src={image} className="w-full h-full object-cover" /> : <p className="text-[10px] font-black uppercase text-slate-400">Įkelk nuotrauką</p>}
             <input type="file" className="hidden" ref={inputRef} onChange={handleImage} />
           </div>
           {image && (
             <button onClick={startAI} disabled={analyzing} className="w-full py-5 bg-slate-900 text-white rounded-2xl font-black uppercase text-xs tracking-widest shadow-xl active:scale-95 transition-all disabled:opacity-50">
               {analyzing ? 'AI Analizuoja...' : 'AI Atpažinimas'}
             </button>
           )}
        </div>
        <div className="md:w-1/2 space-y-4">
          <h2 className="text-2xl font-black uppercase italic text-slate-900">Naujas skelbimas</h2>
          
          {error && (
            <div className="bg-rose-50 text-rose-600 p-4 rounded-xl text-[10px] font-black uppercase border border-rose-100">
              {error}
            </div>
          )}

          <input className="w-full bg-slate-50 p-4 rounded-xl text-xs font-bold border-2 border-transparent focus:border-orange-500 outline-none" placeholder="Pavadinimas" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} />
          <div className="grid grid-cols-2 gap-4">
            <input className="w-full bg-slate-50 p-4 rounded-xl text-xs font-bold border-2 border-transparent focus:border-orange-500 outline-none" placeholder="Kaina (€)" type="number" value={formData.price} onChange={e => setFormData({...formData, price: e.target.value})} />
            <input className="w-full bg-slate-50 p-4 rounded-xl text-xs font-bold border-2 border-transparent focus:border-orange-500 outline-none" placeholder="Markė" value={formData.brand} onChange={e => setFormData({...formData, brand: e.target.value})} />
          </div>
          <textarea className="w-full bg-slate-50 p-4 rounded-xl text-xs font-medium border-2 border-transparent focus:border-orange-500 h-32 outline-none" placeholder="Aprašymas" value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} />
          <div className="flex gap-4 pt-4">
             <button onClick={onClose} className="flex-1 text-[10px] font-black uppercase text-slate-400 hover:text-slate-600">Atšaukti</button>
             <button onClick={handleSave} className="flex-1 py-5 bg-orange-600 text-white rounded-2xl font-black uppercase text-xs tracking-widest shadow-xl active:scale-95 transition-all">Skelbti</button>
          </div>
        </div>
      </div>
    </div>
  );
}
