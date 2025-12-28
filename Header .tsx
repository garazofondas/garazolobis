
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
  const isDbConnected = !!localStorage.getItem('config_supabase_url');

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-slate-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 h-24 flex items-center justify-between gap-4">
        {/* LOGO */}
        <div 
          className="flex items-center gap-3 flex-shrink-0 cursor-pointer group" 
          onClick={() => onViewModeChange('buy')}
        >
          <div className="bg-slate-900 p-3 rounded-2xl shadow-xl shadow-slate-200 relative group-hover:scale-110 transition-transform duration-300">
            <svg className="w-8 h-8 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
            </svg>
            {isDbConnected && (
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-emerald-500 border-2 border-white rounded-full animate-pulse shadow-sm shadow-emerald-200"></span>
            )}
          </div>
          <div>
            <span className="text-2xl font-black tracking-tighter hidden sm:block uppercase italic leading-none text-slate-900">GARAŽO <br/><span className="text-orange-600">LOBIS</span></span>
            <span className={`text-[8px] font-black uppercase tracking-widest hidden sm:block mt-1 ${isDbConnected ? 'text-emerald-600' : 'text-slate-400'}`}>
              {isDbConnected ? '● CLOUD SYNC ACTIVE' : '○ LOCAL MODE'}
            </span>
          </div>
        </div>

        {/* SEARCH (TIK DESKTOPE) */}
        <div className="flex-1 max-w-md relative hidden lg:block">
           <input 
             onChange={(e) => onSearch(e.target.value)}
             className="w-full bg-slate-100 border-2 border-transparent focus:bg-white focus:border-orange-500 rounded-3xl py-4 px-14 text-sm font-bold outline-none transition-all shadow-inner"
             placeholder="Ieškoti dalies..."
           />
           <svg className="w-6 h-6 text-slate-400 absolute left-5 top-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
        </div>

        {/* ACTIONS */}
        <div className="flex items-center gap-3">
          {/* KONFIGŪRACIJOS KRUMPLIARATIS */}
          <button 
            onClick={onSettingsClick}
            className={`p-4 rounded-2xl transition-all flex items-center gap-2 group relative ${!isDbConnected ? 'bg-orange-600 text-white animate-bounce shadow-xl shadow-orange-300 scale-110' : 'bg-slate-100 text-slate-500 hover:bg-slate-900 hover:text-white'}`}
            title="Sistemos nustatymai"
          >
            <svg className="w-7 h-7 group-hover:rotate-90 transition-transform duration-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            {!isDbConnected && <span className="text-[10px] font-black uppercase hidden xl:block tracking-widest ml-1">PAJUNGTI DEBESĮ</span>}
          </button>

          {isLoggedIn && (
            <button 
              onClick={onAddClick}
              className="bg-emerald-600 text-white p-4 rounded-2xl hover:bg-emerald-700 transition-all shadow-xl shadow-emerald-100"
            >
              <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M12 4v16m8-8H4" /></svg>
            </button>
          )}

          {!isLoggedIn ? (
            <button onClick={onAuthClick} className="bg-slate-900 text-white px-8 py-3 rounded-2xl text-xs font-black uppercase tracking-widest hover:bg-orange-600 transition-all shadow-lg">PRISIJUNGTI</button>
          ) : (
            <button onClick={onGarageClick} className="bg-white border-2 border-slate-200 px-6 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:border-orange-500 transition-all">
              {activeVehicle ? activeVehicle.model : 'GARAŽAS'}
            </button>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
