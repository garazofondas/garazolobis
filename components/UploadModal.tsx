
import React, { useState, useRef } from 'react';
import { analyzePartImage } from '../geminiService';
import { Condition } from '../types';
import { CATEGORIES } from '../constants';

interface UploadModalProps {
  onClose: () => void;
  onAdd: (partData: any) => void;
}

const UploadModal: React.FC<UploadModalProps> = ({ onClose, onAdd }) => {
  const [image, setImage] = useState<string | null>(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    partCode: '',
    brand: '',
    category: '',
    price: '',
    description: '',
    condition: Condition.GOOD,
    location: 'Vilnius',
    compatibility: {
      brand: '',
      model: '',
      configurations: ['Universalu'],
      minDisplacement: '',
      minPower: ''
    }
  });

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setImage(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleAnalyze = async () => {
    if (!image) return;
    setAnalyzing(true);
    try {
      const result = await analyzePartImage(image);
      
      // Tikslus būklės mapinimas iš AI teksto
      let conditionEnum = Condition.GOOD;
      const aiCond = result.condition;
      
      if (aiCond === 'Nauja') conditionEnum = Condition.NEW;
      else if (aiCond === 'Kaip nauja') conditionEnum = Condition.LIKE_NEW;
      else if (aiCond === 'Gera') conditionEnum = Condition.GOOD;
      else if (aiCond === 'Naudota') conditionEnum = Condition.USED;
      else if (aiCond === 'Atrodo ne kaip, bet funkciją atlieka') conditionEnum = Condition.WORKS_LOOKS_BAD;
      else if (aiCond === 'Šlamštas') conditionEnum = Condition.JUNK;

      setFormData(prev => ({
        ...prev,
        title: result.title,
        partCode: result.partCode || '',
        brand: result.brand,
        category: result.category,
        condition: conditionEnum,
        price: result.suggestedPrice.toString(),
        description: result.description,
        compatibility: {
          ...prev.compatibility,
          brand: result.compatibility?.brand || result.brand,
          model: result.compatibility?.model || 'Visiems modeliams',
          configurations: result.compatibility?.configurations || ['Universalu']
        }
      }));
    } catch (error) {
      console.error("AI analysis failed", error);
      alert("AI nepavyko. Užpildyk rankiniu būdu.");
    } finally {
      setAnalyzing(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!image || !formData.title || !formData.price) return;
    onAdd({
      ...formData,
      price: parseFloat(formData.price),
      imageUrl: image,
      id: Math.random().toString(36).substr(2, 9),
      createdAt: new Date().toISOString(),
      seller: { name: 'Mano Garažas', rating: 5.0, avatar: 'https://picsum.photos/seed/me/100/100', reviewCount: 0 }
    });
  };

  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
      <div className="bg-white rounded-3xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col shadow-2xl animate-in zoom-in duration-200">
        <div className="p-6 border-b flex justify-between items-center bg-slate-50">
          <div>
            <h2 className="text-xl font-black text-slate-900 uppercase tracking-tight">Iškelti lobį</h2>
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Garažo dalys, įrankiai, medžiagos</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-slate-200 rounded-full transition-colors">
            <svg className="w-6 h-6 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <div className="space-y-6">
              <div 
                onClick={() => fileInputRef.current?.click()}
                className={`relative border-2 border-dashed rounded-3xl h-80 flex flex-col items-center justify-center cursor-pointer transition-all overflow-hidden ${image ? 'border-orange-500 ring-4 ring-orange-50' : 'border-slate-200 hover:border-orange-400 bg-slate-50'}`}
              >
                {image ? <img src={image} alt="Preview" className="w-full h-full object-cover p-2 rounded-3xl" /> : <p className="text-xs font-black uppercase text-slate-400 text-center px-6">Paspauskite ir įkelkite nuotrauką<br/><span className="text-[9px] opacity-50 text-orange-600">AI atpažins įrankį ar detalę</span></p>}
                <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleImageChange} />
              </div>
              {image && (
                <button 
                  onClick={handleAnalyze} disabled={analyzing}
                  className="w-full py-4 px-6 bg-slate-900 text-white rounded-2xl font-black text-sm uppercase tracking-widest flex items-center justify-center gap-3 transition-all hover:bg-slate-800"
                >
                  {analyzing ? (
                    <><div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin"></div> ŽIŪRIM KAS ČIA...</>
                  ) : 'Išanalizuoti su AI'}
                </button>
              )}
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-[10px] font-black text-slate-400 uppercase mb-1 tracking-widest">Pavadinimas / Gamintojas</label>
                  <input required className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 px-4 text-sm font-bold" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} placeholder="pvz. Makita suktuvas arba BMW generatorius" />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] font-black text-slate-400 uppercase mb-1 tracking-widest">Kategorija</label>
                    <select 
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 px-4 text-sm font-bold"
                      value={formData.category}
                      onChange={e => setFormData({...formData, category: e.target.value})}
                    >
                      <option value="">Pasirinkti</option>
                      {CATEGORIES.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-[10px] font-black text-slate-400 uppercase mb-1 tracking-widest">Kaina (€)</label>
                    <input required type="number" className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 px-4 text-sm font-bold" value={formData.price} onChange={e => setFormData({...formData, price: e.target.value})} />
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] font-black text-slate-400 uppercase mb-1 tracking-widest">Būklė (Kaip mechanikas mechanikui)</label>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                    {Object.values(Condition).map(cond => (
                      <button 
                        key={cond} type="button"
                        onClick={() => setFormData({...formData, condition: cond})}
                        className={`py-2 px-1 rounded-lg text-[9px] font-black uppercase transition-all flex items-center justify-center text-center h-12 leading-tight ${formData.condition === cond ? 'bg-orange-600 text-white shadow-lg' : 'bg-slate-100 text-slate-500 hover:bg-slate-200'}`}
                      >
                        {cond}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] font-black text-slate-400 uppercase mb-1 tracking-widest">Aprašymas</label>
                  <textarea className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 px-4 text-sm min-h-[80px]" value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} placeholder="Papasakok, kaip veikia, kodėl parduodi..." />
                </div>
              </div>

              <button type="submit" className="w-full bg-orange-600 hover:bg-orange-700 text-white py-5 rounded-2xl font-black text-sm uppercase tracking-widest shadow-xl transition-all active:scale-95">
                Skelbti Garaže
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UploadModal;
