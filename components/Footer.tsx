import React from 'react';

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-slate-900 text-slate-400 py-16 mt-20 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center gap-2 mb-6">
              <div className="bg-orange-600 p-2 rounded-xl">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                </svg>
              </div>
              <span className="text-xl font-black text-white tracking-tighter uppercase italic">Garažo <span className="text-orange-500">Lobis</span></span>
            </div>
            <p className="max-w-xs text-sm leading-relaxed mb-6 font-medium">
              Didžiausia Lietuvoje C2C platforma automobilių dalims, įrankiams ir garažo įrangai. Parduok tai, kas užima vietą, pirk tai, ko reikia tavo projektui.
            </p>
            <div className="flex gap-4">
              <a href="#" className="hover:text-white transition-colors">Instagram</a>
              <a href="#" className="hover:text-white transition-colors">Facebook</a>
              <a href="#" className="hover:text-white transition-colors">TikTok</a>
            </div>
          </div>

          <div>
            <h4 className="text-white font-black text-xs uppercase tracking-widest mb-6">Platforma</h4>
            <ul className="space-y-4 text-sm font-bold">
              <li><a href="#" className="hover:text-orange-500 transition-colors">Kaip tai veikia?</a></li>
              <li><a href="#" className="hover:text-orange-500 transition-colors">Apsauga pirkėjui</a></li>
              <li><a href="#" className="hover:text-orange-500 transition-colors">Apsauga pardavėjui</a></li>
              <li><a href="#" className="hover:text-orange-500 transition-colors">Siuntimas</a></li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-black text-xs uppercase tracking-widest mb-6">Teisinė informacija</h4>
            <ul className="space-y-4 text-sm font-bold">
              <li><a href="#" className="hover:text-orange-500 transition-colors">Naudojimo taisyklės</a></li>
              <li><a href="#" className="hover:text-orange-500 transition-colors">Privatumo politika</a></li>
              <li><a href="#" className="hover:text-orange-500 transition-colors">Slapukų nustatymai</a></li>
              <li><a href="#" className="hover:text-orange-500 transition-colors">Ginčų sprendimas</a></li>
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-slate-800 flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="text-[10px] font-black uppercase tracking-widest">
            © {currentYear} Garažo Lobis. Visos teisės saugomos.
          </div>
          <div className="flex items-center gap-6 opacity-50 grayscale hover:grayscale-0 transition-all">
             <img src="https://upload.wikimedia.org/wikipedia/commons/b/b5/PayPal.svg" className="h-4" alt="PayPal" />
             <img src="https://upload.wikimedia.org/wikipedia/commons/5/5e/Visa_Inc._logo.svg" className="h-4" alt="Visa" />
             <img src="https://upload.wikimedia.org/wikipedia/commons/2/2a/Mastercard-logo.svg" className="h-4" alt="Mastercard" />
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
