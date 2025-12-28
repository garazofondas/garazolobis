
import React from 'react';

interface ManualModalProps {
  onClose: () => void;
}

const ManualModal: React.FC<ManualModalProps> = ({ onClose }) => {
  return (
    <div className="fixed inset-0 z-[150] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
      <div className="bg-white rounded-3xl w-full max-w-2xl shadow-2xl overflow-hidden animate-in zoom-in duration-300">
        <div className="p-8">
          <div className="flex justify-between items-start mb-8">
            <div>
              <h2 className="text-2xl font-black text-slate-900 uppercase italic tracking-tight">Mechaniko Manualas</h2>
              <p className="text-slate-500 text-sm font-bold uppercase tracking-widest mt-1">Kaip čia viskas sukasi?</p>
            </div>
            <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-full transition-all">
              <svg className="w-6 h-6 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-6">
              <h3 className="text-orange-600 font-black uppercase text-xs tracking-widest flex items-center gap-2">
                <div className="w-2 h-2 bg-orange-600 rounded-full"></div>
                Noriu parduoti
              </h3>
              <div className="space-y-4">
                <div className="flex gap-4">
                  <div className="w-8 h-8 rounded-lg bg-slate-900 text-white flex items-center justify-center font-black flex-shrink-0">1</div>
                  <p className="text-sm text-slate-600 font-medium">Nufotografuok detalę ar įrankį. AI pats atpažins markę, kodą ir būklę.</p>
                </div>
                <div className="flex gap-4">
                  <div className="w-8 h-8 rounded-lg bg-slate-900 text-white flex items-center justify-center font-black flex-shrink-0">2</div>
                  <p className="text-sm text-slate-600 font-medium">Nustatyk teisingą būklę (nuo naujos iki šlamšto) ir kainą.</p>
                </div>
                <div className="flex gap-4">
                  <div className="w-8 h-8 rounded-lg bg-slate-900 text-white flex items-center justify-center font-black flex-shrink-0">3</div>
                  <p className="text-sm text-slate-600 font-medium">Gavęs apmokėjimą, tiesiog nunešk siuntą į paštomatą su gautu kodu.</p>
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <h3 className="text-indigo-600 font-black uppercase text-xs tracking-widest flex items-center gap-2">
                <div className="w-2 h-2 bg-indigo-600 rounded-full"></div>
                Noriu pirkti
              </h3>
              <div className="space-y-4">
                <div className="flex gap-4">
                  <div className="w-8 h-8 rounded-lg bg-slate-100 text-slate-900 flex items-center justify-center font-black flex-shrink-0">1</div>
                  <p className="text-sm text-slate-600 font-medium">Išsirink prekę. Gali derėtis – siūlyk savo kainą tiesiai pardavėjui.</p>
                </div>
                <div className="flex gap-4">
                  <div className="w-8 h-8 rounded-lg bg-slate-100 text-slate-900 flex items-center justify-center font-black flex-shrink-0">2</div>
                  <p className="text-sm text-slate-600 font-medium">Mokėk saugiai per platformą. Pinigai bus įšaldyti, kol gausi prekę.</p>
                </div>
                <div className="flex gap-4">
                  <div className="w-8 h-8 rounded-lg bg-slate-100 text-slate-900 flex items-center justify-center font-black flex-shrink-0">3</div>
                  <p className="text-sm text-slate-600 font-medium">Gavęs dalį, patvirtink kokybę. Tik tada pardavėjas gaus pinigus.</p>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-12 bg-orange-50 border border-orange-100 p-6 rounded-2xl flex items-center gap-6">
            <div className="text-3xl">🛡️</div>
            <div>
              <h4 className="font-black text-orange-800 uppercase text-xs mb-1">Pirkėjo apsauga</h4>
              <p className="text-[11px] text-orange-700 font-medium">Visos operacijos stebimos. Jei detalė neatitinka aprašymo – pinigus grąžiname.</p>
            </div>
          </div>
          
          <button 
            onClick={onClose}
            className="w-full mt-8 bg-slate-900 text-white py-4 rounded-2xl font-black uppercase text-xs tracking-widest hover:bg-slate-800 transition-all"
          >
            Sutinku, einam į garažą!
          </button>
        </div>
      </div>
    </div>
  );
};

export default ManualModal;
