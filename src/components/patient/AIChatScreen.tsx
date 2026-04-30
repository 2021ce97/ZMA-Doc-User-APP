import React, { useState, useEffect, useRef } from 'react';
import { Bot, User, Send, ChevronRight, ChevronLeft, Sparkles, Stethoscope, Check, CheckCheck, Mic, Search, Download, X, MicOff } from 'lucide-react';
import { useLanguage } from '../../contexts/LanguageContext';
import { triggerHaptic } from '../../utils/haptics';
import { GoogleGenAI } from '@google/genai';

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

interface ChatMessage {
  id: number;
  text: string;
  sender: 'user' | 'bot';
  status?: 'sent' | 'delivered' | 'read';
}

export function AIChatScreen({ onBack }: { onBack?: () => void }) {
  const { t, isRtl, lang } = useLanguage();
  
  const initialMessage = lang === 'en' ? 'Hello! I am your AI health assistant. What are your symptoms?' : 
                         lang === 'ps' ? 'سلام! زه ستاسو د روغتیا AI معاون یم. ستاسو نښې څه دي؟' : 
                         'سلام! من دستیار هوشمند صحی شما هستم. چه علایمی دارید؟';

  const [messages, setMessages] = useState<ChatMessage[]>(() => {
    const saved = localStorage.getItem('ai_chat_history');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error('Failed to parse chat history', e);
      }
    }
    return [
      { id: 1, text: initialMessage, sender: 'bot' }
    ];
  });
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const endRef = useRef<HTMLDivElement>(null);

  // New states for features
  const [isListening, setIsListening] = useState(false);
  const recognitionRef = useRef<any>(null);
  const [isSearching, setIsSearching] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      if (SpeechRecognition) {
        recognitionRef.current = new SpeechRecognition();
        recognitionRef.current.continuous = false;
        recognitionRef.current.interimResults = false;
        
        recognitionRef.current.onresult = (event: any) => {
          const transcript = event.results[0][0].transcript;
          setInput(prev => (prev + ' ' + transcript).trim());
          setIsListening(false);
        };
        
        recognitionRef.current.onerror = (event: any) => {
          console.error("Speech recognition error", event.error);
          setIsListening(false);
        };
        
        recognitionRef.current.onend = () => {
          setIsListening(false);
        };
      }
    }
  }, []);

  const toggleListening = () => {
    if (isListening) {
      recognitionRef.current?.stop();
      setIsListening(false);
    } else {
      if (!recognitionRef.current) {
        alert(lang === 'en' ? 'Microphone is not supported in this browser.' : 'مرورگر شما از میکروفون پشتیبانی نمی‌کند.');
        return;
      }
      try {
        recognitionRef.current.lang = lang === 'en' ? 'en-US' : lang === 'ps' ? 'ps-AF' : 'fa-AF';
        recognitionRef.current?.start();
        setIsListening(true);
      } catch(e) {
        console.error(e);
      }
    }
  };

  const handleExport = () => {
    const historyText = messages.map(m => `[${m.sender === 'user' ? 'User' : 'AI Assistant'}]: ${m.text}`).join('\n\n');
    const blob = new Blob([historyText], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'chat-history.txt';
    a.click();
    URL.revokeObjectURL(url);
  };

  // Real-time sync via BroadcastChannel (simulates WebSockets)
  useEffect(() => {
    const channel = new BroadcastChannel('ai_chat_channel');
    channel.onmessage = (event) => {
      if (event.data.type === 'sync_needed') {
        const saved = localStorage.getItem('ai_chat_history');
        if (saved) {
          setMessages(prev => {
            if (JSON.stringify(prev) !== saved) {
              return JSON.parse(saved);
            }
            return prev;
          });
        }
      } else if (event.data.type === 'typing') {
        setIsTyping(event.data.isTyping);
      }
    };
    return () => channel.close();
  }, []);

  const notifySync = () => {
    const channel = new BroadcastChannel('ai_chat_channel');
    channel.postMessage({ type: 'sync_needed' });
    channel.close();
  };

  const notifyTyping = (typing: boolean) => {
    const channel = new BroadcastChannel('ai_chat_channel');
    channel.postMessage({ type: 'typing', isTyping: typing });
    channel.close();
  };

  useEffect(() => {
    localStorage.setItem('ai_chat_history', JSON.stringify(messages));
    notifySync();
  }, [messages]);

  // Read receipts simulation
  useEffect(() => {
    const sentMsg = messages.find(m => m.sender === 'user' && m.status === 'sent');
    if (sentMsg) {
      const timer = setTimeout(() => {
        setMessages(prev => prev.map(m => m.id === sentMsg.id ? { ...m, status: 'delivered' } : m));
      }, 500);
      return () => clearTimeout(timer);
    }

    const deliveredMsg = messages.find(m => m.sender === 'user' && m.status === 'delivered');
    if (deliveredMsg && isTyping) {
      setMessages(prev => prev.map(m => m.id === deliveredMsg.id ? { ...m, status: 'read' } : m));
    }
  }, [messages, isTyping]);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  const quickReplies = lang === 'en' ? ['I have a headache', 'Stomach ache', 'Fever and chills'] :
                       lang === 'ps' ? ['زه سر درد لرم', 'د ګېډې درد', 'تبه او ساړه احساسوم'] :
                       ['سر دردی شدید دارم', 'دل دردی', 'تب و لرز دارم'];

  const handleSend = async (textToSend = input) => {
    if (!textToSend.trim() || isTyping) return;
    
    triggerHaptic('light');
    const userMsg: ChatMessage = { id: Date.now(), text: textToSend, sender: 'user', status: 'sent' };
    setMessages(prev => [...prev, userMsg]);
    if (textToSend === input) setInput('');
    setIsTyping(true);
    notifyTyping(true);

    try {
      const historyText = messages.map(m => `${m.sender === 'user' ? 'User' : 'Assistant'}: ${m.text}`).join('\n');
      const prompt = `You are an expert AI medical symptom checker and triage assistant for an app in Afghanistan. You MUST answer in the user's language (${lang === 'en' ? 'English' : lang === 'ps' ? 'Pashto' : 'Dari/Persian'}). 
Follow a structured triage flow:
1. Acknowledge the user's symptoms empathetically.
2. If the user presents symptoms, ask 1-2 clarifying questions (e.g. duration, severity, accompanying symptoms).
3. Analyze potential common conditions based on the symptoms.
4. If symptoms sound severe (e.g., chest pain, shortness of breath), explicitly urge them to seek immediate emergency care.
5. Provide actionable but safe advice (e.g., hydration, rest).
6. ALWAYS conclude by recommending they consult a doctor or book an appointment through the app for a formal evaluation.
Keep the response structured, clear, and under 4-5 short sentences.

Chat History:
${historyText}

User: ${textToSend}
Assistant:`;

      const botMsgId = Date.now() + 1;
      setMessages(prev => [...prev, {
        id: botMsgId,
        text: '',
        sender: 'bot'
      }]);

      const stream = await ai.models.generateContentStream({
        model: 'gemini-2.5-flash',
        contents: prompt,
      });

      triggerHaptic('medium');
      setIsTyping(false);
      notifyTyping(false);
      
      let fullResponse = '';
      for await (const chunk of stream) {
        fullResponse += chunk.text;
        setMessages(prev => prev.map(m => 
          m.id === botMsgId ? { ...m, text: fullResponse } : m
        ));
      }
    } catch (e) {
      console.error(e);
      triggerHaptic('medium');
      setIsTyping(false);
      notifyTyping(false);
      setMessages(prev => [...prev.filter(m => m.id !== Date.now() + 1), {
        id: Date.now() + 1,
        text: lang === 'en' ? "I'm having trouble connecting right now. Please consult a doctor." : "ارتباط با مشکل مواجه شد. لطفا به داکتر مراجعه کنید.",
        sender: 'bot'
      }]);
    }
  };

  const filteredMessages = searchQuery.trim() 
    ? messages.filter(m => m.text.toLowerCase().includes(searchQuery.toLowerCase()))
    : messages;

  return (
    <div className="flex flex-col h-full bg-slate-50 dark:bg-slate-900 pb-safe transition-colors">
      {/* App Bar */}
      <div className="bg-white dark:bg-slate-800 flex flex-col shadow-[0_2px_10px_rgba(0,0,0,0.02)] z-20 sticky top-0 transition-colors border-b border-slate-100 dark:border-slate-700">
        <div className="flex items-center p-4">
          {onBack && (
            <button onClick={() => { triggerHaptic('light'); onBack(); }} className={`w-10 h-10 flex items-center justify-center rounded-full bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors ${isRtl ? 'ms-2' : 'me-2'}`}>
              {isRtl ? <ChevronRight size={24} className="text-slate-700 dark:text-slate-200" /> : <ChevronLeft size={24} className="text-slate-700 dark:text-slate-200" />}
            </button>
          )}
          <div className={`w-12 h-12 bg-gradient-to-tr from-teal-400 to-emerald-500 rounded-full flex items-center justify-center shadow-md relative ${isRtl ? 'me-2' : 'ms-2'}`}>
             <Stethoscope size={24} className="text-white drop-shadow-sm" />
             <div className="absolute -bottom-1 -right-1 bg-white dark:bg-slate-800 p-0.5 rounded-full">
                <Sparkles size={14} className="text-amber-400" />
             </div>
          </div>
          <div className={`flex-1 ${isRtl ? 'me-3' : 'ms-3'}`}>
            <h1 className="font-bold text-slate-900 dark:text-white text-lg">{t('ai_assistant')}</h1>
            <div className="text-[11px] text-emerald-600 dark:text-emerald-400 font-medium flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.8)]"></span>
              {t('active')}
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={() => setIsSearching(!isSearching)} className="w-10 h-10 flex items-center justify-center rounded-full bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors">
              <Search size={20} className="text-slate-600 dark:text-slate-400" />
            </button>
            <button onClick={handleExport} className="w-10 h-10 flex items-center justify-center rounded-full bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors" title={lang === 'en' ? 'Export Chat' : 'خروجی چت'}>
              <Download size={20} className="text-slate-600 dark:text-slate-400" />
            </button>
          </div>
        </div>
        
        {isSearching && (
          <div className="px-4 pb-4 animate-in fade-in slide-in-from-top-2">
            <div className="relative">
              <input
                type="text"
                placeholder={lang === 'en' ? 'Search messages...' : 'جستجو در پیام‌ها...'}
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="w-full bg-slate-100 dark:bg-slate-900 border border-transparent focus:border-emerald-500 dark:focus:border-emerald-500 rounded-xl py-2 px-4 pe-10 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 text-slate-900 dark:text-white transition-colors"
                dir={isRtl ? 'rtl' : 'ltr'}
              />
              {searchQuery && (
                <button onClick={() => setSearchQuery('')} className={`absolute top-1/2 -translate-y-1/2 p-1.5 ${isRtl ? 'left-2' : 'right-2'}`}>
                  <X size={16} className="text-slate-400" />
                </button>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Chat Area */}
      <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-5 relative bg-slate-50 dark:bg-slate-900 transition-colors">
         
         {/* Optimization Notice */}
         <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800/50 rounded-xl p-2.5 text-[11px] text-amber-700 dark:text-amber-400 text-center mx-auto w-3/4 shadow-sm z-10 transition-colors">
            {lang === 'en' ? 'AI responses are generated. Avoid sharing exact PII.' : isRtl && lang === 'ps' ? 'د AI ځوابونه جوړ شوي دي. ریښتیني شخصي معلومات مه شریکوئ.' : 'پاسخ‌هاتوسط هوش مصنوعی تولید می‌شوند. از اشتراک‌گذاری اطلاعات شخصی بپرهیزید.'}
         </div>

         {filteredMessages.map((msg) => (
           <div key={msg.id} className={`flex max-w-[90%] relative z-10 ${msg.sender === 'user' ? 'self-end flex-row-reverse' : 'self-start'}`}>
             <div className={`w-9 h-9 rounded-full flex items-center justify-center shrink-0 shadow-sm ${msg.sender === 'user' ? 'bg-slate-200 dark:bg-slate-700 ms-3' : 'bg-gradient-to-tr from-teal-500 to-emerald-500 me-3'}`}>
               {msg.sender === 'user' ? <User size={18} className="text-slate-600 dark:text-slate-300"/> : <Bot size={18} className="text-white" />}
             </div>
             <div className={`p-3.5 rounded-2xl text-sm leading-relaxed shadow-sm flex flex-col ${
               msg.sender === 'user' 
               ? 'bg-sky-600 dark:bg-sky-700 border border-sky-500 dark:border-sky-600 text-white rounded-se-sm' 
               : 'bg-white dark:bg-slate-800 border-slate-100 dark:border-slate-700 text-slate-800 dark:text-slate-200 rounded-ss-sm shadow-[0_4px_14px_rgba(0,0,0,0.05)]'
             }`}>
               <span>{msg.text}</span>
               {msg.sender === 'user' && msg.status && (
                 <div className={`flex justify-end mt-1 opacity-70 ${isRtl ? 'me-auto ms-0' : 'ms-auto me-0'}`}>
                   {msg.status === 'sent' && <Check size={14} />}
                   {msg.status === 'delivered' && <CheckCheck size={14} />}
                   {msg.status === 'read' && <CheckCheck size={14} className="text-emerald-300" />}
                 </div>
               )}
             </div>
           </div>
         ))}
         
         {isTyping && (
            <div className="flex max-w-[85%] self-start relative z-10">
              <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-teal-500 to-emerald-500 flex items-center justify-center shrink-0 shadow-sm me-3">
                 <Bot size={18} className="text-white" />
              </div>
              <div className="bg-white dark:bg-slate-800 p-4 rounded-2xl rounded-ss-sm flex items-center gap-1.5 shadow-[0_4px_14px_rgba(0,0,0,0.05)] border border-slate-100 dark:border-slate-700">
                <span className="w-2 h-2 bg-slate-300 dark:bg-slate-600 rounded-full animate-bounce"></span>
                <span className="w-2 h-2 bg-slate-300 dark:bg-slate-600 rounded-full animate-bounce delay-75"></span>
                <span className="w-2 h-2 bg-slate-300 dark:bg-slate-600 rounded-full animate-bounce delay-150"></span>
              </div>
            </div>
         )}
         <div ref={endRef} />
      </div>

      {/* Input Area */}
      <div className="bg-white dark:bg-slate-800 p-3 pt-3 border-t border-slate-200 dark:border-slate-700 flex flex-col gap-2 z-20 pb-safe transition-colors shadow-[0_-4px_20px_rgba(0,0,0,0.02)]">
        {/* Quick Replies */}
        {!isTyping && messages.filter(m => m.sender === 'user').length < 2 && (
          <div className="flex gap-2 mb-1 overflow-x-auto hide-scrollbar pb-1">
            {quickReplies.map((reply, idx) => (
              <button
                key={idx}
                onClick={() => handleSend(reply)}
                className="whitespace-nowrap bg-emerald-50 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800 rounded-full px-4 py-1.5 text-xs font-medium hover:bg-emerald-100 dark:hover:bg-emerald-900/50 transition-colors"
              >
                {reply}
              </button>
            ))}
          </div>
        )}
        <div className="flex gap-2 items-end">
          <button 
            onClick={toggleListening}
            className={`w-12 h-12 flex items-center justify-center rounded-2xl shrink-0 transition-colors shadow-md border ${
              isListening 
              ? 'bg-rose-50 border-rose-200 text-rose-500 animate-pulse dark:bg-rose-900/30 dark:border-rose-800 dark:text-rose-400' 
              : 'bg-slate-100 hover:bg-slate-200 border-slate-200 text-slate-600 dark:bg-slate-800 dark:hover:bg-slate-700 dark:border-slate-700 dark:text-slate-400'
            }`}
          >
            {isListening ? <MicOff size={22} /> : <Mic size={22} />}
          </button>
          
          <textarea 
            placeholder={isListening ? (lang === 'en' ? 'Listening...' : 'در حال شنیدن...') : t('chat_placeholder')}
            className="flex-1 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-2xl p-3.5 px-4 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent resize-none h-14 min-h-[56px] max-h-[140px] text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 transition-colors shadow-inner"
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={(e) => {
              if(e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend(); }
            }}
            dir={isRtl ? "rtl" : "ltr"}
            disabled={isTyping}
          />
          <button 
            onClick={() => handleSend()}
            disabled={!input.trim() || isTyping}
            className="w-14 h-14 bg-emerald-600 hover:bg-emerald-700 text-white rounded-2xl flex items-center justify-center shrink-0 shadow-md disabled:opacity-50 disabled:bg-slate-300 dark:disabled:bg-slate-700 transition-all active:scale-95"
          >
            <Send size={22} className={`${isRtl ? 'me-1 rtl:-scale-x-100' : 'ms-1'}`} />
          </button>
        </div>
      </div>
    </div>
  );
}
