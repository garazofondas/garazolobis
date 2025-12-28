
import React from 'react';

export default function Footer() {
  return (
    <footer className="bg-slate-900 text-slate-500 py-12 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-6 flex justify-between items-center">
        <p className="text-[10px] font-black uppercase tracking-widest">© 2025 Garažo Lobis</p>
        <div className="flex gap-6 text-[10px] font-black uppercase tracking-widest">
          <a href="#" className="hover:text-white transition-colors">Taisyklės</a>
          <a href="#" className="hover:text-white transition-colors">Privatumas</a>
        </div>
      </div>
    </footer>
  );
}
