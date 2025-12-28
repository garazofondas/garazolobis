
import React, { useState, useRef } from 'react';
import { analyzePartImage } from '../geminiService';
import { CloudDB } from '../apiService';
import { Condition } from '../types';

export default function UploadModal({ onClose, onAdd }: any) {
  const [image, setImage] = useState<string | null>(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [formData, setFormData] = useState({ title: '', price: '', category: '', brand: '', description: '' });
  const inputRef = useRef<HTMLInputElement>(null);

  const handleImage = (e: any) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => setImage(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const startAI = async () => {
    if (!image) return;
    setAnalyzing(true);
    try {
      const res = await analyzePartImage(image);
      setFormData({
        title: res.title,
        price: res.suggestedPrice.toString(),
        category: res.category,
        brand: res.brand,
        description: res.description
      });
    } catch (e) {
      alert("AI nepavyko, įvesk ranka");
    } finally {
      setAnalyzing(false);
    }
  };

  const handleSave = async () => {
    const part = {
      ...formData,
      id: Math.random().toString(36).substr(2, 9),
      price: parseFloat(formData.price),
      imageUrl: image!,
      condition: Condition.GOOD,
      location: 'Vilnius',
      createdAt: new Date().toISOString(),
      compatibility: { brand: formData.brand, model: 'Universalu', configurations: [] },
      seller: { name: 'Mano Garažas', rating: 5, reviewCount: 0, avatar: '' }
    };
    await CloudDB.savePart(part as any);
    onAdd();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[150] flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-md">
      <div className="bg-white rounded-[2.5rem] w-full max-w-4xl p-10 flex flex-col md:flex-row gap-10 shadow-2xl overflow-y-auto max-h-[95vh]">
        <div className="md:w-1/2 space-y-6">
           <div 
             onClick={() => inputRef.current?.click()}
             className="aspect-square bg-slate-50 border-4 border-dashed rounded-[2rem] flex items-center justify-center cursor-pointer overflow-hidden relative group"
           >
             {image ? <img src={image} className="w-full h-full object-cover" /> : <p className="text-[10px] font-black uppercase text-slate-400">Įkelk nuotrauką</p>}
             <input type="file" className="hidden" ref={inputRef} onChange={handleImage} />
           </div>
           {image && (
             <button onClick={startAI} disabled={analyzing} className="w-full py-5 bg-slate-900 text-white rounded-2xl font-black uppercase text-xs tracking-widest shadow-xl">
               {analyzing ? 'AI Analizuoja...' : 'AI Atpažinimas'}
             </button>
           )}
        </div>
        <div className="md:w-1/2 space-y-4">
          <input className="w-full bg-slate-50 p-4 rounded-xl text-xs font-bold border-2 border-transparent focus:border-orange-500" placeholder="Pavadinimas" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} />
          <div className="grid grid-cols-2 gap-4">
            <input className="w-full bg-slate-50 p-4 rounded-xl text-xs font-bold border-2 border-transparent focus:border-orange-500" placeholder="Kaina (€)" value={formData.price} onChange={e => setFormData({...formData, price: e.target.value})} />
            <input className="w-full bg-slate-50 p-4 rounded-xl text-xs font-bold border-2 border-transparent focus:border-orange-500" placeholder="Markė" value={formData.brand} onChange={e => setFormData({...formData, brand: e.target.value})} />
          </div>
          <textarea className="w-full bg-slate-50 p-4 rounded-xl text-xs font-medium border-2 border-transparent focus:border-orange-500 h-32" placeholder="Aprašymas" value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} />
          <div className="flex gap-4">
             <button onClick={onClose} className="flex-1 text-[10px] font-black uppercase text-slate-400">Atšaukti</button>
             <button onClick={handleSave} className="flex-1 py-5 bg-orange-600 text-white rounded-2xl font-black uppercase text-xs tracking-widest shadow-xl">Skelbti</button>
          </div>
        </div>
      </div>
    </div>
  );
}
