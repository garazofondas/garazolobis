
import React, { useState } from 'react';
import { Vehicle } from '../types';

interface GarageModalProps {
  vehicles: Vehicle[];
  activeVehicleId: string | null;
  onClose: () => void;
  onAdd: (vehicle: Omit<Vehicle, 'id'>) => void;
  onSelect: (id: string | null) => void;
  onRemove: (id: string) => void;
}

const GarageModal: React.FC<GarageModalProps> = ({ vehicles, activeVehicleId, onClose, onAdd, onSelect, onRemove }) => {
  const [isAdding, setIsAdding] = useState(false);
  const [newCar, setNewCar] = useState({
    brand: '',
    model: '',
    configuration: 'Sedanas',
    displacement: '',
    power: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAdd(newCar);
    setIsAdding(false);
    setNewCar({ brand: '', model: '', configuration: 'Sedanas', displacement: '', power: '' });
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
      <div className="bg-white rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden flex flex-col max-h-[80vh]">
        <div className="p-4 border-b flex justify-between items-center bg-slate-50">
          <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
            <svg className="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
            </svg>
            Mano Garažas
          </h2>
          <button onClick={onClose} className="p-2 hover:bg-slate-200 rounded-full transition-colors">
            <svg className="w-5 h-5 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="p-6 overflow-y-auto space-y-4">
          {vehicles.length === 0 && !isAdding ? (
            <div className="text-center py-8">
              <p className="text-slate-500 mb-4">Tavo garažas tuščias. Pridėk automobilį, kad matytum tik jam tinkamas dalis!</p>
              <button 
                onClick={() => setIsAdding(true)}
                className="bg-orange-600 text-white px-6 py-2 rounded-xl font-bold hover:bg-orange-700 transition-all"
              >
                Pridėti pirmą auto
              </button>
            </div>
          ) : (
            <>
              {vehicles.map(car => (
                <div 
                  key={car.id}
                  className={`relative p-4 rounded-xl border-2 transition-all cursor-pointer flex justify-between items-center ${activeVehicleId === car.id ? 'border-orange-600 bg-orange-50' : 'border-slate-100 hover:border-slate-200 bg-white'}`}
                  onClick={() => onSelect(activeVehicleId === car.id ? null : car.id)}
                >
                  <div>
                    <div className="font-bold text-slate-800">{car.brand} {car.model}</div>
                    <div className="text-xs text-slate-500 uppercase tracking-wide">
                      {car.configuration} • {car.displacement} • {car.power}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {activeVehicleId === car.id && (
                      <span className="bg-orange-600 text-white text-[10px] px-2 py-0.5 rounded-full font-bold uppercase">Aktyvus</span>
                    )}
                    <button 
                      onClick={(e) => { e.stopPropagation(); onRemove(car.id); }}
                      className="p-1.5 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                </div>
              ))}
              
              {!isAdding && (
                <button 
                  onClick={() => setIsAdding(true)}
                  className="w-full py-3 border-2 border-dashed border-slate-200 rounded-xl text-slate-400 hover:text-orange-600 hover:border-orange-200 font-bold transition-all flex items-center justify-center gap-2"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                  Pridėti dar vieną
                </button>
              )}
            </>
          )}

          {isAdding && (
            <form onSubmit={handleSubmit} className="bg-slate-50 p-4 rounded-xl border border-slate-200 animate-in slide-in-from-top-2 duration-200">
              <div className="grid grid-cols-2 gap-3 mb-3">
                <input 
                  required placeholder="Markė (BMW)" 
                  className="bg-white border p-2 rounded-lg text-sm"
                  value={newCar.brand} onChange={e => setNewCar({...newCar, brand: e.target.value})}
                />
                <input 
                  required placeholder="Modelis (E46)" 
                  className="bg-white border p-2 rounded-lg text-sm"
                  value={newCar.model} onChange={e => setNewCar({...newCar, model: e.target.value})}
                />
              </div>
              <div className="grid grid-cols-3 gap-2 mb-3">
                <input 
                  placeholder="Kubatūra (2.0)" 
                  className="bg-white border p-2 rounded-lg text-sm"
                  value={newCar.displacement} onChange={e => setNewCar({...newCar, displacement: e.target.value})}
                />
                <input 
                  placeholder="Galia (110kW)" 
                  className="bg-white border p-2 rounded-lg text-sm"
                  value={newCar.power} onChange={e => setNewCar({...newCar, power: e.target.value})}
                />
                <select 
                   className="bg-white border p-2 rounded-lg text-sm"
                   value={newCar.configuration} onChange={e => setNewCar({...newCar, configuration: e.target.value})}
                >
                  <option>Sedanas</option>
                  <option>Universalas</option>
                  <option>Kupė</option>
                  <option>Hečbekas</option>
                  <option>SUV</option>
                </select>
              </div>
              <div className="flex gap-2">
                <button type="button" onClick={() => setIsAdding(false)} className="flex-1 py-2 text-sm text-slate-500 font-semibold">Atšaukti</button>
                <button type="submit" className="flex-1 py-2 text-sm bg-orange-600 text-white rounded-lg font-bold">Išsaugoti</button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default GarageModal;
