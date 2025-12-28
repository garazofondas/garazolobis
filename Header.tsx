
import React from 'react';
import { Vehicle, AppNotification } from '../types';

interface HeaderProps {
  isLoggedIn: boolean;
  onAuthClick: () => void;
  onAddClick: () => void;
  onGarageClick: () => void;
  onSearch: (term: string) => void;
  onManualClick: () => void;
  activeVehicle: Vehicle | null;
  viewMode: string;
  onViewModeChange: (mode: any) => void;
  walletBalance: number;
  notifications: AppNotification[];
  onNotificationClick: () => void;
  onSettingsClick: () => void;
}

const Header: React.FC<HeaderProps> = ({ 
  isLoggedIn, 
  onAuthClick, 
  onAddClick, 
  onGarageClick, 
  onSearch, 
  onManualClick,
  activeVehicle,
  viewMode,
  onViewModeChange,
  walletBalance,
  notifications,
  onNotificationClick,
  onSettingsClick,
}) => {
  const isConnected = !!localStorage.getItem('config_dpd_user');

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 h-20 flex items-center justify-between gap-4">
        <div 
          className="flex items-center gap-2 flex-shrink-0 cursor-pointer" 
          onClick={() => onViewModeChange('buy')}
        >
          <div className="bg-slate-900 p-2 rounded-xl shadow-lg shadow-slate-200 relative">
            <svg className="w-6 h-6 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
            </svg>
            {isConnected && (
              <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-600 border-2 border-white rounded-full animate-pulse shadow-sm shadow-red-200"></span>
            )}
          </div>
          <span className="text-xl font-black tracking-tight hidden sm:block uppercase italic leading-none">GARAŽO <br/><span className="text-orange-600">LOBIS</span></span>
        </div>

        <div className="flex-1 max-w-md relative hidden md:block">
           <input 
             onChange={(e) => onSearch(e.target.value)}
             className="w-full bg-slate-100 border border-transparent focus:bg-white focus:border-orange-500 rounded-2xl py-3 px-12 text-sm outline-none transition-all font-bold"
             placeholder="Ieškoti dalies arba kodo..."
           />
           <svg className="w-5 h-5 text-slate-400 absolute left-4 top-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
        </div>

        <div className="flex items-center gap-2">
          <button 
            onClick={onSettingsClick}
            className={`p-3 rounded-xl transition-all ${isConnected ? 'text-red-600 bg-red-50 hover:bg-red-100' : 'text-slate-400 hover:text-slate-900 hover:bg-slate-100'}`}
            title="Logistikos valdymas (DPD)"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
          </button>

          {isLoggedIn && (
            <div className="flex items-center gap-1">
              <button 
                onClick={() => onViewModeChange('orders')}
                className={`p-3 rounded-xl transition-all ${viewMode === 'orders' ? 'bg-orange-50 text-orange-600' : 'hover:bg-slate-50 text-slate-400'}`}
                title="Mano užsakymai"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" /></svg>
              </button>
              
              <button 
                onClick={() => onViewModeChange('wallet')}
                className={`hidden sm:flex items-center gap-2 px-3 py-2 rounded-xl transition-all ${viewMode === 'wallet' ? 'bg-orange-600 text-white shadow-lg shadow-orange-100' : 'bg-slate-900 text-white'}`}
              >
                <span className="text-xs font-black">€{walletBalance.toFixed(0)}</span>
              </button>
            </div>
          )}

          <button onClick={onGarageClick} className={`flex items-center gap-2 px-3 py-2 rounded-xl text-[10px] font-black uppercase transition-all border-2 ${activeVehicle ? 'bg-orange-50 border-orange-600 text-orange-700' : 'bg-white border-slate-100 text-slate-600'}`}>
             {activeVehicle ? activeVehicle.model : 'Garažas'}
          </button>

          {!isLoggedIn ? (
            <button onClick={onAuthClick} className="bg-slate-900 text-white px-5 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-orange-600 transition-all">Jungtis</button>
          ) : (
            <button 
              onClick={onAddClick}
              className="bg-orange-600 text-white p-2 rounded-xl hover:bg-orange-700 transition-all shadow-lg shadow-orange-100"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
            </button>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
