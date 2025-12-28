
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
  // Fix: Added missing onNotificationClick property to the interface
  onNotificationClick: () => void;
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
  // Fix: Destructured the missing onNotificationClick prop
  onNotificationClick,
}) => {
  return (
    <header className="sticky top-0 z-50 bg-white border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 h-20 flex items-center justify-between gap-4">
        <div 
          className="flex items-center gap-2 flex-shrink-0 cursor-pointer" 
          onClick={() => onViewModeChange('buy')}
        >
          <div className="bg-slate-900 p-2 rounded-xl shadow-lg shadow-slate-200">
            <svg className="w-6 h-6 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
            </svg>
          </div>
          <span className="text-xl font-black tracking-tight hidden sm:block uppercase italic leading-none">GARAŽO <br/><span className="text-orange-600">LOBIS</span></span>
        </div>

        <div className="flex-1 max-w-md relative hidden md:block">
           <input 
             onChange={(e) => onSearch(e.target.value)}
             className="w-full bg-slate-100 border border-transparent focus:bg-white focus:border-orange-500 rounded-2xl py-3 px-12 text-sm outline-none transition-all"
             placeholder="Ieškoti dalies arba kodo..."
           />
           <svg className="w-5 h-5 text-slate-400 absolute left-4 top-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
        </div>

        <div className="flex items-center gap-2">
          <button 
            onClick={onManualClick}
            className="p-3 text-slate-400 hover:text-orange-600 hover:bg-orange-50 rounded-xl transition-all"
            title="Kaip tai veikia?"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" /></svg>
          </button>

          {isLoggedIn && (
            <div className="flex items-center gap-1">
              {/* Added notification icon button */}
              <button 
                onClick={onNotificationClick}
                className={`p-3 rounded-xl transition-all relative ${viewMode === 'notifications' ? 'bg-orange-50 text-orange-600' : 'hover:bg-slate-50 text-slate-400'}`}
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" /></svg>
                {notifications.length > 0 && (
                  <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-red-500 rounded-full border border-white"></span>
                )}
              </button>

              <button 
                onClick={() => onViewModeChange('inbox')}
                className={`p-3 rounded-xl transition-all ${viewMode === 'inbox' ? 'bg-orange-50 text-orange-600' : 'hover:bg-slate-50 text-slate-400'}`}
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" /></svg>
              </button>
              
              <button 
                onClick={() => onViewModeChange('wallet')}
                className={`hidden sm:flex items-center gap-2 px-3 py-2 rounded-xl transition-all ${viewMode === 'wallet' ? 'bg-orange-600 text-white shadow-lg' : 'bg-slate-900 text-white'}`}
              >
                <span className="text-xs font-black">€{walletBalance.toFixed(0)}</span>
              </button>
            </div>
          )}

          <button onClick={onGarageClick} className={`flex items-center gap-2 px-3 py-2 rounded-xl text-[10px] font-black uppercase transition-all border-2 ${activeVehicle ? 'bg-orange-50 border-orange-600 text-orange-700' : 'bg-white border-slate-100 text-slate-600'}`}>
             {activeVehicle ? activeVehicle.model : 'Garažas'}
          </button>

          {!isLoggedIn ? (
            <button onClick={onAuthClick} className="bg-slate-900 text-white px-4 py-2 rounded-xl text-[10px] font-black uppercase">Jungtis</button>
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
