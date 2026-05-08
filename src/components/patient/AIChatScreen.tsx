import React, { useState, useEffect, useRef, useMemo } from "react";
import {
  Bot,
  User,
  Send,
  ChevronRight,
  ChevronLeft,
  Sparkles,
  Stethoscope,
  Check,
  CheckCheck,
  Mic,
  Search,
  Download,
  X,
  MicOff,
  BookOpen,
  Tag,
  Clock,
  MessageSquare,
  Share2,
} from "lucide-react";
import { useLanguage } from "../../contexts/LanguageContext";
import { triggerHaptic } from "../../utils/haptics";
import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

interface ChatMessage {
  id: number;
  text: string;
  sender: "user" | "bot";
  status?: "sent" | "delivered" | "read";
}

export function AIChatScreen({ onBack }: { onBack?: () => void }) {
  const { t, isRtl, lang } = useLanguage();

  const initialMessage =
    lang === "en"
      ? "Hello! I am your AI health assistant. What are your symptoms?"
      : lang === "ps"
        ? "سلام! زه ستاسو د روغتیا AI معاون یم. ستاسو نښې څه دي؟"
        : "سلام! من دستیار هوشمند صحی شما هستم. چه علایمی دارید؟";

  const [messages, setMessages] = useState<ChatMessage[]>(() => {
    const saved = localStorage.getItem("ai_chat_history");
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error("Failed to parse chat history", e);
      }
    }
    return [{ id: 1, text: initialMessage, sender: "bot" }];
  });
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const endRef = useRef<HTMLDivElement>(null);

  // New states for features
  const [isListening, setIsListening] = useState(false);
  const recognitionRef = useRef<any>(null);
  const [isSearching, setIsSearching] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState<"chat" | "insights">("chat");
  const [insightSearchQuery, setInsightSearchQuery] = useState("");
  const [insightDateFilter, setInsightDateFilter] = useState<
    "all" | "week" | "month"
  >("all");

  // Insights Tags extraction hook
  const insights = useMemo(() => {
    return messages
      .filter((m) => m.sender === "bot" && m.id !== 1 && m.text.length > 50)
      .map((msg) => {
        const text = msg.text.toLowerCase();
        const tags: string[] = [];
        if (
          text.includes("fever") ||
          text.includes("تب") ||
          text.includes("حرارت")
        )
          tags.push(lang === "en" ? "Fever" : "تب");
        if (
          text.includes("pain") ||
          text.includes("درد") ||
          text.includes("ache")
        )
          tags.push(lang === "en" ? "Pain/Discomfort" : "درد");
        if (
          text.includes("doctor") ||
          text.includes("appointment") ||
          text.includes("داکتر") ||
          text.includes("پزشک")
        )
          tags.push(lang === "en" ? "Consult Doctor" : "مراجعه به داکتر");
        if (
          text.includes("water") ||
          text.includes("hydration") ||
          text.includes("آب") ||
          text.includes("مایعات") ||
          text.includes("drink")
        )
          tags.push(lang === "en" ? "Hydration" : "مایعات");
        if (
          text.includes("cough") ||
          text.includes("سرفه") ||
          text.includes("خس خس") ||
          text.includes("chest")
        )
          tags.push(lang === "en" ? "Cough/Respiratory" : "سرفه/تنفسی");
        if (
          text.includes("allergy") ||
          text.includes("حساسیت") ||
          text.includes("آلرژی") ||
          text.includes("rash")
        )
          tags.push(lang === "en" ? "Allergies" : "حساسیت");
        if (
          text.includes("medication") ||
          text.includes("دارو") ||
          text.includes("دوا") ||
          text.includes("قرص") ||
          text.includes("pill")
        )
          tags.push(lang === "en" ? "Medication" : "دارو/دوا");
        if (
          text.includes("nausea") ||
          text.includes("تهوع") ||
          text.includes("vomit") ||
          text.includes("استفراغ") ||
          text.includes("stomach")
        )
          tags.push(lang === "en" ? "Stomach/Nausea" : "معده/تهوع");
        if (
          text.includes("sleep") ||
          text.includes("خواب") ||
          text.includes("rest") ||
          text.includes("استراحت")
        )
          tags.push(lang === "en" ? "Rest/Sleep" : "استراحت/خواب");
        if (
          text.includes("diet") ||
          text.includes("غذا") ||
          text.includes("food") ||
          text.includes("خوراک") ||
          text.includes("eat")
        )
          tags.push(lang === "en" ? "Diet" : "رژیم غذایی");

        if (tags.length === 0)
          tags.push(lang === "en" ? "General Advice" : "توصیه عمومی");

        return {
          ...msg,
          tags: Array.from(new Set(tags)),
        };
      })
      .reverse();
  }, [messages, lang]);

  const [selectedTags, setSelectedTags] = useState<string[]>(() => {
    const saved = localStorage.getItem("ai_insight_filters");
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem("ai_insight_filters", JSON.stringify(selectedTags));
  }, [selectedTags]);

  const handleToggleTag = (tag: string) => {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag],
    );
  };

  const filteredInsights = useMemo(() => {
    let result = insights;

    if (selectedTags.length > 0) {
      // Must include at least one of the selected tags (OR filtering)
      // or we can do AND filtering if preferred. Let's do OR for now
      result = result.filter((i) =>
        selectedTags.some((tag) => i.tags.includes(tag)),
      );
    }

    if (insightSearchQuery.trim()) {
      const q = insightSearchQuery.toLowerCase();
      result = result.filter((i) => i.text.toLowerCase().includes(q));
    }

    if (insightDateFilter !== "all") {
      const now = Date.now();
      const oneWeek = 7 * 24 * 60 * 60 * 1000;
      const oneMonth = 30 * 24 * 60 * 60 * 1000;
      result = result.filter((i) => {
        if (insightDateFilter === "week") return now - i.id <= oneWeek;
        if (insightDateFilter === "month") return now - i.id <= oneMonth;
        return true;
      });
    }

    return result;
  }, [insights, selectedTags, insightSearchQuery, insightDateFilter]);

  const handleShare = async (insight: any) => {
    try {
      if (navigator.share) {
        await navigator.share({
          title: lang === "en" ? "Health Insight" : "توصیه پزشکی",
          text: insight.text,
        });
      } else {
        await navigator.clipboard.writeText(insight.text);
        alert(lang === "en" ? "Copied to clipboard!" : "در کلیپ‌بورد کپی شد!");
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleShareMessage = async (text: string) => {
    try {
      if (navigator.share) {
        await navigator.share({
          text: text,
        });
      } else {
        await navigator.clipboard.writeText(text);
        alert(lang === "en" ? "Copied to clipboard!" : "در کلیپ‌بورد کپی شد!");
      }
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    if (typeof window !== "undefined") {
      const SpeechRecognition =
        (window as any).SpeechRecognition ||
        (window as any).webkitSpeechRecognition;
      if (SpeechRecognition) {
        recognitionRef.current = new SpeechRecognition();
        recognitionRef.current.continuous = false;
        recognitionRef.current.interimResults = false;

        recognitionRef.current.onresult = (event: any) => {
          const transcript = event.results[0][0].transcript;
          const command = transcript.toLowerCase().trim();

          if (
            command.includes("clear chat") ||
            command.includes("پاکسازی چت") ||
            command.includes("پاک کردن پیام ها")
          ) {
            if (
              window.confirm(
                lang === "en" ? "Clear chat history?" : "تاریخچه چت پاک شود؟",
              )
            ) {
              setMessages([
                { id: Date.now(), text: initialMessage, sender: "bot" },
              ]);
            }
          } else if (
            command.includes("show my insights") ||
            command.includes("show insights") ||
            command.includes("نمایش توصیه ها") ||
            command.includes("توصیه های من")
          ) {
            setActiveTab("insights");
          } else {
            setInput((prev) => (prev + " " + transcript).trim());
          }
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
        alert(
          lang === "en"
            ? "Microphone is not supported in this browser."
            : "مرورگر شما از میکروفون پشتیبانی نمی‌کند.",
        );
        return;
      }
      try {
        recognitionRef.current.lang =
          lang === "en" ? "en-US" : lang === "ps" ? "ps-AF" : "fa-AF";
        recognitionRef.current?.start();
        setIsListening(true);
      } catch (e) {
        console.error(e);
      }
    }
  };

  const handleExport = () => {
    let historyText = "";
    let filename = "";

    if (activeTab === "insights") {
      historyText = filteredInsights
        .map(
          (m) =>
            `[${new Date(m.id).toLocaleString(lang === "en" ? "en-US" : "fa-IR")}]\nTags: ${m.tags.join(", ")}\nInsight: ${m.text}`,
        )
        .join("\n\n-------------------\n\n");
      filename = "health-insights.txt";
    } else {
      historyText = messages
        .map(
          (m) =>
            `[${new Date(m.id).toLocaleString(lang === "en" ? "en-US" : "fa-IR")}] ${m.sender === "user" ? "User" : "AI Assistant"}: ${m.text}`,
        )
        .join("\n\n");
      filename = "health-chat-history.txt";
    }

    const blob = new Blob([historyText], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
    triggerHaptic("light");
  };

  // Real-time sync via BroadcastChannel (simulates WebSockets)
  useEffect(() => {
    const channel = new BroadcastChannel("ai_chat_channel");
    channel.onmessage = (event) => {
      if (event.data.type === "sync_needed") {
        const saved = localStorage.getItem("ai_chat_history");
        if (saved) {
          setMessages((prev) => {
            if (JSON.stringify(prev) !== saved) {
              return JSON.parse(saved);
            }
            return prev;
          });
        }
      } else if (event.data.type === "typing") {
        setIsTyping(event.data.isTyping);
      }
    };
    return () => channel.close();
  }, []);

  const notifySync = () => {
    const channel = new BroadcastChannel("ai_chat_channel");
    channel.postMessage({ type: "sync_needed" });
    channel.close();
  };

  const notifyTyping = (typing: boolean) => {
    const channel = new BroadcastChannel("ai_chat_channel");
    channel.postMessage({ type: "typing", isTyping: typing });
    channel.close();
  };

  useEffect(() => {
    localStorage.setItem("ai_chat_history", JSON.stringify(messages));
    notifySync();
  }, [messages]);

  // Read receipts simulation
  useEffect(() => {
    const sentMsg = messages.find(
      (m) => m.sender === "user" && m.status === "sent",
    );
    if (sentMsg) {
      const timer = setTimeout(() => {
        setMessages((prev) =>
          prev.map((m) =>
            m.id === sentMsg.id ? { ...m, status: "delivered" } : m,
          ),
        );
      }, 500);
      return () => clearTimeout(timer);
    }

    const deliveredMsg = messages.find(
      (m) => m.sender === "user" && m.status === "delivered",
    );
    if (deliveredMsg && isTyping) {
      setMessages((prev) =>
        prev.map((m) =>
          m.id === deliveredMsg.id ? { ...m, status: "read" } : m,
        ),
      );
    }
  }, [messages, isTyping]);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  const quickReplies =
    lang === "en"
      ? ["I have a headache", "Stomach ache", "Fever and chills"]
      : lang === "ps"
        ? ["زه سر درد لرم", "د ګېډې درد", "تبه او ساړه احساسوم"]
        : ["سر دردی شدید دارم", "دل دردی", "تب و لرز دارم"];

  const handleSend = async (textToSend = input) => {
    if (!textToSend.trim() || isTyping) return;

    triggerHaptic("light");
    const userMsg: ChatMessage = {
      id: Date.now(),
      text: textToSend,
      sender: "user",
      status: "sent",
    };
    setMessages((prev) => [...prev, userMsg]);
    if (textToSend === input) setInput("");
    setIsTyping(true);
    notifyTyping(true);

    try {
      const historyText = messages
        .map((m) => `${m.sender === "user" ? "User" : "Assistant"}: ${m.text}`)
        .join("\n");
      const prompt = `You are an expert AI medical symptom checker and triage assistant for an app in Afghanistan. You MUST answer in the user's language (${lang === "en" ? "English" : lang === "ps" ? "Pashto" : "Dari/Persian"}). 
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
      setMessages((prev) => [
        ...prev,
        {
          id: botMsgId,
          text: "",
          sender: "bot",
        },
      ]);

      const stream = await ai.models.generateContentStream({
        model: "gemini-2.5-flash",
        contents: prompt,
      });

      triggerHaptic("medium");
      setIsTyping(false);
      notifyTyping(false);

      let fullResponse = "";
      for await (const chunk of stream) {
        fullResponse += chunk.text;
        setMessages((prev) =>
          prev.map((m) =>
            m.id === botMsgId ? { ...m, text: fullResponse } : m,
          ),
        );
      }
    } catch (e) {
      console.error(e);
      triggerHaptic("medium");
      setIsTyping(false);
      notifyTyping(false);
      setMessages((prev) => [
        ...prev.filter((m) => m.id !== Date.now() + 1),
        {
          id: Date.now() + 1,
          text:
            lang === "en"
              ? "I'm having trouble connecting right now. Please consult a doctor."
              : "ارتباط با مشکل مواجه شد. لطفا به داکتر مراجعه کنید.",
          sender: "bot",
        },
      ]);
    }
  };

  const filteredMessages = searchQuery.trim()
    ? messages.filter((m) =>
        m.text.toLowerCase().includes(searchQuery.toLowerCase()),
      )
    : messages;

  return (
    <div className="flex flex-col h-full bg-slate-50 dark:bg-slate-900 pb-safe transition-colors">
      {/* App Bar */}
      <div className="bg-white dark:bg-slate-800 flex flex-col shadow-[0_2px_10px_rgba(0,0,0,0.02)] z-20 sticky top-0 transition-colors border-b border-slate-100 dark:border-slate-700">
        <div className="flex items-center p-4">
          {onBack && (
            <button
              onClick={() => {
                triggerHaptic("light");
                onBack();
              }}
              className={`w-10 h-10 flex items-center justify-center rounded-full bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors ${isRtl ? "ms-2" : "me-2"}`}
            >
              {isRtl ? (
                <ChevronRight
                  size={24}
                  className="text-slate-700 dark:text-slate-200"
                />
              ) : (
                <ChevronLeft
                  size={24}
                  className="text-slate-700 dark:text-slate-200"
                />
              )}
            </button>
          )}
          <div
            className={`w-12 h-12 bg-gradient-to-tr from-teal-400 to-emerald-500 rounded-full flex items-center justify-center shadow-md relative ${isRtl ? "me-2" : "ms-2"}`}
          >
            <Stethoscope size={24} className="text-white drop-shadow-sm" />
            <div className="absolute -bottom-1 -right-1 bg-white dark:bg-slate-800 p-0.5 rounded-full">
              <Sparkles size={14} className="text-amber-400" />
            </div>
          </div>
          <div className={`flex-1 ${isRtl ? "me-3" : "ms-3"}`}>
            <h1 className="font-bold text-slate-900 dark:text-white text-lg">
              {t("ai_assistant")}
            </h1>
            <div className="text-[11px] text-emerald-600 dark:text-emerald-400 font-medium flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.8)]"></span>
              {t("active")}
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                triggerHaptic("light");
                setActiveTab(activeTab === "chat" ? "insights" : "chat");
              }}
              className={`w-10 h-10 flex items-center justify-center rounded-full transition-colors ${activeTab === "insights" ? "bg-emerald-100 text-emerald-600 dark:bg-emerald-900/40 dark:text-emerald-400" : "bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700"}`}
              title={lang === "en" ? "Past Insights" : "توصیه‌های قبلی"}
            >
              <BookOpen size={20} />
            </button>
            {activeTab === "chat" && (
              <button
                onClick={() => setIsSearching(!isSearching)}
                className="w-10 h-10 flex items-center justify-center rounded-full bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
                title={lang === "en" ? "Search Chat" : "جستجوی پیام"}
              >
                <Search
                  size={20}
                  className="text-slate-600 dark:text-slate-400"
                />
              </button>
            )}
            <button
              onClick={handleExport}
              className="w-10 h-10 flex items-center justify-center rounded-full bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
              title={lang === "en" ? "Export Chat" : "خروجی چت"}
            >
              <Download
                size={20}
                className="text-slate-600 dark:text-slate-400"
              />
            </button>
          </div>
        </div>

        {isSearching && activeTab === "chat" && (
          <div className="px-4 pb-4 animate-in fade-in slide-in-from-top-2">
            <div className="relative">
              <input
                type="text"
                placeholder={
                  lang === "en" ? "Search messages..." : "جستجو در پیام‌ها..."
                }
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-slate-100 dark:bg-slate-900 border border-transparent focus:border-emerald-500 dark:focus:border-emerald-500 rounded-xl py-2 px-4 pe-10 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 text-slate-900 dark:text-white transition-colors"
                dir={isRtl ? "rtl" : "ltr"}
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className={`absolute top-1/2 -translate-y-1/2 p-1.5 ${isRtl ? "left-2" : "right-2"}`}
                >
                  <X size={16} className="text-slate-400" />
                </button>
              )}
            </div>
          </div>
        )}
      </div>

      {activeTab === "insights" ? (
        <div className="flex-1 overflow-y-auto p-4 bg-slate-50 dark:bg-slate-900 transition-colors">
          <div className="mb-4 space-y-3">
            <div className="relative">
              <input
                type="text"
                placeholder={
                  lang === "en" ? "Search insights..." : "جستجو در توصیه‌ها..."
                }
                value={insightSearchQuery}
                onChange={(e) => setInsightSearchQuery(e.target.value)}
                className="w-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:border-emerald-500 rounded-xl py-2 px-4 pe-10 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 text-slate-900 dark:text-white transition-colors"
                dir={isRtl ? "rtl" : "ltr"}
              />
              <Search
                size={16}
                className={`absolute top-1/2 -translate-y-1/2 text-slate-400 ${isRtl ? "left-3" : "right-3"}`}
              />
            </div>

            <div className="flex items-center gap-2 overflow-x-auto hide-scrollbar pb-1">
              <select
                value={insightDateFilter}
                onChange={(e) => setInsightDateFilter(e.target.value as any)}
                className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 text-xs rounded-lg px-2 py-1.5 focus:outline-none shrink-0"
              >
                <option value="all">
                  {lang === "en" ? "All Time" : "همه زمان‌ها"}
                </option>
                <option value="week">
                  {lang === "en" ? "Past Week" : "هفته گذشته"}
                </option>
                <option value="month">
                  {lang === "en" ? "Past Month" : "ماه گذشته"}
                </option>
              </select>

              <div className="w-px h-4 bg-slate-200 dark:bg-slate-700 mx-1 shrink-0"></div>

              <button
                onClick={() => setSelectedTags([])}
                className={`px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-colors border ${selectedTags.length === 0 ? "bg-emerald-600 text-white border-emerald-600" : "bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700"}`}
              >
                {lang === "en" ? "All Insights" : "همه"}
              </button>
              {Array.from(new Set(insights.flatMap((i) => i.tags))).map(
                (tag) => (
                  <button
                    key={tag}
                    onClick={() => handleToggleTag(tag)}
                    className={`px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-colors border ${selectedTags.includes(tag) ? "bg-emerald-600 text-white border-emerald-600" : "bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700"}`}
                  >
                    {tag}
                  </button>
                ),
              )}
            </div>
          </div>

          <div className="space-y-4">
            {filteredInsights.length === 0 ? (
              <div className="text-center py-10 opacity-50 flex flex-col items-center">
                <Bot size={48} className="mb-4 text-slate-400" />
                <p className="text-slate-500 dark:text-slate-400">
                  {lang === "en" ? "No insights found." : "توصیه‌ای یافت نشد."}
                </p>
              </div>
            ) : (
              filteredInsights.map((insight) => (
                <div
                  key={insight.id}
                  className="bg-white dark:bg-slate-800 rounded-xl p-4 shadow-sm border border-slate-100 dark:border-slate-700"
                >
                  <div className="flex items-start gap-3 mb-3">
                    <div className="w-8 h-8 rounded-full bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center shrink-0">
                      <Stethoscope
                        size={16}
                        className="text-emerald-600 dark:text-emerald-400"
                      />
                    </div>
                    <div className="flex-1">
                      <div className="flex justify-between items-start gap-2 mb-2">
                        <div className="flex gap-1.5 flex-wrap">
                          {insight.tags.map((tag) => (
                            <span
                              key={tag}
                              className="flex items-center gap-1 bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 px-2 py-0.5 rounded-md text-[10px] font-medium"
                            >
                              <Tag size={10} />
                              {tag}
                            </span>
                          ))}
                        </div>
                        <button
                          onClick={() => handleShare(insight)}
                          className="shrink-0 p-1.5 text-slate-400 hover:text-emerald-600 dark:hover:text-emerald-400 bg-slate-50 dark:bg-slate-700/50 hover:bg-emerald-50 dark:hover:bg-emerald-900/30 rounded-md transition-colors"
                          title={lang === "en" ? "Share" : "اشتراک‌گذاری"}
                        >
                          <Share2 size={14} />
                        </button>
                      </div>
                      <p className="text-sm text-slate-800 dark:text-slate-200 leading-relaxed whitespace-pre-wrap">
                        {insight.text}
                      </p>
                    </div>
                  </div>
                  <div className="text-[10px] text-slate-400 dark:text-slate-500 flex items-center gap-1 mt-2 pt-2 border-t border-slate-50 dark:border-slate-700/50 justify-end">
                    <Clock size={12} />
                    {new Date(insight.id).toLocaleString(
                      lang === "en" ? "en-US" : "fa-IR",
                      { dateStyle: "medium", timeStyle: "short" },
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      ) : (
        <>
          <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-5 relative bg-slate-50 dark:bg-slate-900 transition-colors">
            {/* Optimization Notice */}
            <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800/50 rounded-xl p-2.5 text-[11px] text-amber-700 dark:text-amber-400 text-center mx-auto w-3/4 shadow-sm z-10 transition-colors">
              {lang === "en"
                ? "AI responses are generated. Avoid sharing exact PII."
                : isRtl && lang === "ps"
                  ? "د AI ځوابونه جوړ شوي دي. ریښتیني شخصي معلومات مه شریکوئ."
                  : "پاسخ‌هاتوسط هوش مصنوعی تولید می‌شوند. از اشتراک‌گذاری اطلاعات شخصی بپرهیزید."}
            </div>

            {filteredMessages.map((msg) => (
              <div
                key={msg.id}
                className={`flex max-w-[90%] relative z-10 ${msg.sender === "user" ? "self-end flex-row-reverse" : "self-start"}`}
              >
                <div
                  className={`w-9 h-9 rounded-full flex items-center justify-center shrink-0 shadow-sm ${msg.sender === "user" ? "bg-slate-200 dark:bg-slate-700 ms-3" : "bg-gradient-to-tr from-teal-500 to-emerald-500 me-3"}`}
                >
                  {msg.sender === "user" ? (
                    <User
                      size={18}
                      className="text-slate-600 dark:text-slate-300"
                    />
                  ) : (
                    <Bot size={18} className="text-white" />
                  )}
                </div>
                <div
                  className={`p-3.5 rounded-2xl text-sm leading-relaxed shadow-sm flex flex-col ${
                    msg.sender === "user"
                      ? "bg-sky-600 dark:bg-sky-700 border border-sky-500 dark:border-sky-600 text-white rounded-se-sm"
                      : "bg-white dark:bg-slate-800 border-slate-100 dark:border-slate-700 text-slate-800 dark:text-slate-200 rounded-ss-sm shadow-[0_4px_14px_rgba(0,0,0,0.05)]"
                  }`}
                >
                  <span>{msg.text}</span>
                  <div
                    className={`flex justify-end items-center gap-1 mt-1 opacity-70 ${isRtl ? "me-auto ms-0" : "ms-auto me-0"}`}
                  >
                    <button
                      onClick={() => handleShareMessage(msg.text)}
                      className="p-1 cursor-pointer transition-colors"
                      title={lang === "en" ? "Share" : "اشتراک‌گذاری"}
                    >
                      <Share2 size={12} />
                    </button>
                    {msg.sender === "user" && msg.status && (
                      <div className="flex">
                        {msg.status === "sent" && <Check size={14} />}
                        {msg.status === "delivered" && <CheckCheck size={14} />}
                        {msg.status === "read" && (
                          <CheckCheck size={14} className="text-emerald-300" />
                        )}
                      </div>
                    )}
                  </div>
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
          {activeTab === "chat" && (
            <div className="bg-white dark:bg-slate-800 p-3 pt-3 border-t border-slate-200 dark:border-slate-700 flex flex-col gap-2 z-20 pb-safe transition-colors shadow-[0_-4px_20px_rgba(0,0,0,0.02)]">
              {/* Quick Replies */}
              {!isTyping &&
                messages.filter((m) => m.sender === "user").length < 2 && (
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
                      ? "bg-rose-50 border-rose-200 text-rose-500 animate-pulse dark:bg-rose-900/30 dark:border-rose-800 dark:text-rose-400"
                      : "bg-slate-100 hover:bg-slate-200 border-slate-200 text-slate-600 dark:bg-slate-800 dark:hover:bg-slate-700 dark:border-slate-700 dark:text-slate-400"
                  }`}
                >
                  {isListening ? <MicOff size={22} /> : <Mic size={22} />}
                </button>

                <textarea
                  placeholder={
                    isListening
                      ? lang === "en"
                        ? "Listening..."
                        : "در حال شنیدن..."
                      : t("chat_placeholder")
                  }
                  className="flex-1 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-2xl p-3.5 px-4 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent resize-none h-14 min-h-[56px] max-h-[140px] text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 transition-colors shadow-inner"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault();
                      handleSend();
                    }
                  }}
                  dir={isRtl ? "rtl" : "ltr"}
                  disabled={isTyping}
                />
                <button
                  onClick={() => handleSend()}
                  disabled={!input.trim() || isTyping}
                  className="w-14 h-14 bg-emerald-600 hover:bg-emerald-700 text-white rounded-2xl flex items-center justify-center shrink-0 shadow-md disabled:opacity-50 disabled:bg-slate-300 dark:disabled:bg-slate-700 transition-all active:scale-95"
                >
                  <Send
                    size={22}
                    className={`${isRtl ? "me-1 rtl:-scale-x-100" : "ms-1"}`}
                  />
                </button>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
