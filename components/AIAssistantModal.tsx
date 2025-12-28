import React, { useState, useRef, useEffect } from 'react';
import { GoogleGenAI } from "@google/genai";
import { Part } from './types';
import { CATEGORIES } from './constants';

interface AIAssistantModalProps {
  onClose: () => void;
  availableParts: Part[];
  onSelectPart: (part: Part) => void;
}

const AIAssistantModal: React.FC<AIAssistantModalProps> = ({ onClose, availableParts, onSelectPart }) => {
  const [messages, setMessages] = useState<{role: 'user' | 'model', text: string}[]>([
    { role: 'model', text: 'Sveikas! Esu tavo skaitmeninis mechanikas. Kas nutiko tavo bolidui? Padėsiu rasti reikiamas dalis.' }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isTyping) return;
    
    const userMsg = input;
    setInput('');
    setMessages(prev => [...prev, { role: 'user', text: userMsg }]);
    setIsTyping(true);

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const context = availableParts.map(p => `${p.title} (€${p.price}, ${p.compatibility.brand} ${p.compatibility.model})`).join(', ');
      
      const prompt = `Tu esi profesionalus mechanikas platformoje "Garažo Lobis". 
      Vartotojas sako: "${userMsg}". 
      Mūsų turguje dabar yra šios dalys: ${context}.
      
      Tavo tikslas:
      1. Diagnozuoti problemą trumpai ir aiškiai.
      2. Pasiūlyti dalis iš pateikto sąrašo, jei jos tinka.
      3. Jei tinkamos dalies nėra, pasiūlyti ieškoti kategorijose: ${CATEGORIES.join(', ')}.
      
      Atsakyk draugiškai, "garažo" stiliumi, bet profesionaliai. Atsakymą pateik tik lietuvių kalba.`;

      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: prompt,
      });

      setMessages(prev => [...prev, { role: 'model', text: response.text || 'Atsiprašau, dingo ryšys su garažu.' }]);
    } catch (err) {
      setMessages(prev => [...prev, { role: 'model', text: 'Panašu, kad variklis užgeso (API klaida). Pabandyk vėliau.' }]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-[200] flex flex-col items-end">
      <div className="bg-white rounded-3xl w-[350px] sm:w-[400px] h-[500px] shadow-2xl border border-slate-200 flex flex-col overflow-hidden animate-in slide-in-from-bottom-10">
        <div className="bg-slate-900 p-4 flex justify-between items-center text-white">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-orange-600 rounded-lg flex items-center justify-center">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
            </div>
            <div>
              <h4 className="text-xs font-black uppercase tracking-widest italic">AI Mechanikas</h4>
              <div className="flex items-center gap-1">
                <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"></div>
                <span className="text-[8px] font-bold text-slate-400 uppercase">Garaže (Online)</span>
              </div>
            </div>
          </div>
          <button onClick={onClose} className="hover:bg-white/10 p-1 rounded-full transition-colors">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
        </div>

        <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50">
          {messages.map((m, i) => (
            <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[85%] p-3 rounded-2xl text-xs font-medium shadow-sm ${m.role === 'user' ? 'bg-orange-600 text-white rounded-br-none' : 'bg-white text-slate-800 rounded-bl-none border border-slate-200'}`}>
                {m.text}
              </div>
            </div>
          ))}
          {isTyping && (
            <div className="flex justify-start">
              <div className="bg-white p-3 rounded-2xl border border-slate-200 flex gap-1">
                <div className="w-1 h-1 bg-slate-300 rounded-full animate-bounce"></div>
                <div className="w-1 h-1 bg-slate-300 rounded-full animate-bounce delay-75"></div>
                <div className="w-1 h-1 bg-slate-300 rounded-full animate-bounce delay-150"></div>
              </div>
            </div>
          )}
        </div>

        <div className="p-4 bg-white border-t flex gap-2">
          <input 
            type="text" 
            placeholder="Klauski mechaniko..." 
            className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 outline-none focus:ring-2 focus:ring-orange-500 text-xs"
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleSend()}
          />
          <button 
            onClick={handleSend}
            className="bg-slate-900 text-white p-2 rounded-xl hover:bg-orange-600 transition-all"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" /></svg>
          </button>
        </div>
      </div>
    </div>
  );
};

export default AIAssistantModal;
