
import React, { useState, useEffect, useRef } from 'react';
import { Chat } from '../types';

interface ChatModalProps {
  chat: Chat;
  onClose: () => void;
  onSend: (text: string) => void;
}

const ChatModal: React.FC<ChatModalProps> = ({ chat, onClose, onSend }) => {
  const [inputText, setInputText] = useState('');
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [chat.messages]);

  const handleSend = () => {
    if (!inputText.trim()) return;
    onSend(inputText);
    setInputText('');
  };

  return (
    <div className="fixed inset-0 z-[130] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
      <div className="bg-white rounded-3xl w-full max-w-xl h-[80vh] shadow-2xl overflow-hidden flex flex-col animate-in zoom-in duration-200">
        <div className="p-4 border-b bg-slate-50 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img src={chat.part.imageUrl} className="w-12 h-12 rounded-xl object-cover" alt="" />
            <div>
              <h4 className="font-bold text-slate-900 text-sm">{chat.part.title}</h4>
              <p className="text-[10px] text-slate-500 uppercase font-black">Pardavėjas: {chat.part.seller.name}</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-slate-200 rounded-full transition-colors">
            <svg className="w-6 h-6 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
        </div>

        <div ref={scrollRef} className="flex-1 overflow-y-auto p-6 space-y-4 bg-slate-50/50">
          {chat.messages.length === 0 && (
            <div className="text-center py-12 text-slate-400">
               <svg className="w-12 h-12 mx-auto mb-2 opacity-20" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" /></svg>
               <p className="font-bold uppercase text-[10px] tracking-widest">Sveiki! Pasiteiraukite apie detalės būklę ar pristatymą.</p>
            </div>
          )}
          {chat.messages.map(msg => (
            <div key={msg.id} className={`flex ${msg.senderId === 'me' ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[80%] p-4 rounded-2xl text-sm font-medium shadow-sm ${msg.senderId === 'me' ? 'bg-orange-600 text-white rounded-br-none' : 'bg-white text-slate-800 rounded-bl-none border border-slate-100'}`}>
                {msg.text}
                <div className={`text-[9px] mt-1 opacity-60 ${msg.senderId === 'me' ? 'text-white' : 'text-slate-400'}`}>
                  {new Date(msg.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="p-4 bg-white border-t flex gap-2">
          <input 
            type="text" 
            placeholder="Rašyti žinutę..." 
            className="flex-1 bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3 outline-none focus:ring-2 focus:ring-orange-500 text-sm"
            value={inputText}
            onChange={e => setInputText(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleSend()}
          />
          <button 
            onClick={handleSend}
            className="bg-orange-600 text-white p-3 rounded-2xl hover:bg-orange-700 transition-all shadow-lg shadow-orange-100"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" /></svg>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatModal;
