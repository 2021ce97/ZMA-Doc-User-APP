import React, { useState, useEffect, useRef } from 'react';
import { Bot, User, Send, ChevronRight, ChevronLeft, Activity, Sparkles } from 'lucide-react';
import { useLanguage } from '../../contexts/LanguageContext';

export function AIChatScreen({ onBack }: { onBack?: () => void }) {
  const { t, isRtl } = useLanguage();
  const [messages, setMessages] = useState(() => {
    const saved = localStorage.getItem('ai_chat_history');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error('Failed to parse chat history', e);
      }
    }
    return [
      { id: 1, text: 'سلام! من دستیار هوشمند صحی شما هستم. چه علایمی دارید؟ (مثال: سر دردی، تب، سرفه)', sender: 'bot' }
    ];
  });
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    localStorage.setItem('ai_chat_history', JSON.stringify(messages));
    endRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  const handleSend = () => {
    if (!input.trim()) return;
    
    const userMsg = { id: Date.now(), text: input, sender: 'user' };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsTyping(true);

    setTimeout(() => {
      setIsTyping(false);
      setMessages(prev => [...prev, {
        id: Date.now() + 1,
        text: 'بر اساس علایم شما (سر دردی و تب)، احتمال ابتلا به ریزش فصلی وجود دارد. لطفا مایعات گرم زیاد بنوشید. آیا نیاز به نوبت داکتر عمومی دارید؟',
        sender: 'bot'
      }]);
    }, 1500);
  };

  return (
    <div className="flex flex-col h-full bg-slate-50 pb-safe">
      {/* App Bar */}
      <div className="bg-white flex items-center p-4 shadow-[0_2px_10px_rgba(0,0,0,0.02)] z-20 sticky top-0">
        {onBack && (
          <button onClick={onBack} className={`w-10 h-10 flex items-center justify-center rounded-full bg-slate-100 hover:bg-slate-200 ${isRtl ? 'ms-2' : 'me-2'}`}>
            {isRtl ? <ChevronRight size={24} className="text-slate-700" /> : <ChevronLeft size={24} className="text-slate-700" />}
          </button>
        )}
        <div className={`w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center ${isRtl ? 'me-2' : 'ms-2'}`}>
           <Sparkles size={20} className="text-indigo-600" />
        </div>
        <div className={`${isRtl ? 'me-3' : 'ms-3'}`}>
          <h1 className="font-bold text-slate-900">{t('ai_assistant')}</h1>
          <div className="text-[10px] text-green-600 font-medium flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></span>
            {t('active')}
          </div>
        </div>
      </div>

      {/* Chat Area */}
      <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-4 relative">
         <div className="absolute inset-0 bg-indigo-50 opacity-30 pattern-grid pointer-events-none"></div>
         
         {/* Low Bandwidth Notice */}
         <div className="bg-amber-50 border border-amber-200 rounded-lg p-2 text-[10px] text-amber-700 text-center mx-auto w-3/4 shadow-sm z-10">
            این چت برای اینترنت ضعیف بهینه‌سازی شده است (حجم بسیار کم).
         </div>

         {messages.map((msg) => (
           <div key={msg.id} className={`flex max-w-[85%] relative z-10 ${msg.sender === 'user' ? 'self-end flex-row-reverse' : 'self-start'}`}>
             <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${msg.sender === 'user' ? 'bg-slate-200 ms-2' : 'bg-indigo-600 me-2'}`}>
               {msg.sender === 'user' ? <User size={16} className="text-slate-600"/> : <Sparkles size={16} className="text-white" />}
             </div>
             <div className={`p-3 rounded-2xl text-sm leading-relaxed shadow-sm ${
               msg.sender === 'user' 
               ? 'bg-white border border-slate-100 text-slate-800 rounded-se-sm' 
               : 'bg-indigo-600 text-white rounded-ss-sm'
             }`}>
               {msg.text}
             </div>
           </div>
         ))}
         
         {isTyping && (
            <div className="flex max-w-[85%] self-start relative z-10">
              <div className="w-8 h-8 rounded-full bg-sky-600 flex items-center justify-center shrink-0 me-2">
                 <Bot size={16} className="text-white" />
              </div>
              <div className="bg-white border border-slate-100 p-3 rounded-2xl rounded-ss-sm flex items-center gap-1 shadow-sm">
                <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce"></span>
                <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce delay-75"></span>
                <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce delay-150"></span>
              </div>
            </div>
         )}
         <div ref={endRef} />
      </div>

      {/* Input Area */}
      <div className="bg-white p-3 border-t border-slate-200 flex gap-2 items-end z-20 pb-safe">
        <textarea 
          placeholder={t('chat_placeholder')}
          className="flex-1 bg-slate-50 border border-slate-200 rounded-xl p-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-none h-12 min-h-[48px] max-h-[120px]"
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={(e) => {
            if(e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend(); }
          }}
          dir="rtl"
        />
        <button 
          onClick={handleSend}
          disabled={!input.trim()}
          className="w-12 h-12 bg-indigo-600 text-white rounded-xl flex items-center justify-center shrink-0 shadow-sm disabled:opacity-50 disabled:bg-slate-300 transition-colors"
        >
          <Send size={20} className={`${isRtl ? 'me-1 rtl:-scale-x-100' : 'ms-1'}`} />
        </button>
      </div>
    </div>
  );
}
