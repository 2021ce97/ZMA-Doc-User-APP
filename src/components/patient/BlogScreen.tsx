import React, { useState } from "react";
import {
  ChevronRight,
  ChevronLeft,
  Heart,
  Share2,
  Search,
  BookOpen,
  Clock,
} from "lucide-react";
import { useLanguage } from "../../contexts/LanguageContext";

export function BlogScreen() {
  const { t, isRtl } = useLanguage();
  const [selectedArticleId, setSelectedArticleId] = useState<number | null>(
    null,
  );

  const articles = [
    {
      id: 1,
      title: "چگونه سیستم ایمنی خود را تقویت کنیم؟",
      category: "تغذیه سالم",
      readTime: "۵ دقیقه",
      image:
        "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=400&q=80",
      content:
        "سیستم ایمنی بدن نقش حیاتی در حفظ سلامتی ما دارد. برای تقویت آن، باید به تغذیه، خواب و ورزش اهمیت زیادی بدهیم...\n\nمصرف ویتامین C و مرکبات، خواب کافی حداقل هفت ساعت در طول شب و ورزش منظم میتواند کمک شایانی در بهبود عملکرد سیستم ایمنی داشته باشد. همچنین مصرف آب به مقدار کافی در طول روز به دفع سموم از بدن کمک میکند.",
    },
    {
      id: 2,
      title: "راهنمای کامل مراقبت از پوست در فصل زمستان",
      category: "زیبایی و پوست",
      readTime: "۸ دقیقه",
      image:
        "https://images.unsplash.com/photo-1556228578-0d85b1a4d571?w=400&q=80",
      content: "در فصل زمستان، پوست مستعد خشکی و آسیب‌های بیشتر است...",
    },
    {
      id: 3,
      title: "علایم اولیه فشار خون بالا که باید بدانید",
      category: "قلب و عروق",
      readTime: "۴ دقیقه",
      image:
        "https://images.unsplash.com/photo-1505751172876-fa1923c5c528?w=400&q=80",
      content:
        "فشار خون بالا قاتل خاموش نامیده می‌شود زیرا در بسیاری از مواقع بدون علامت است...",
    },
  ];

  if (selectedArticleId !== null) {
    const article = articles.find((a) => a.id === selectedArticleId);
    if (!article) return null;
    return (
      <div className="flex flex-col h-full bg-white pb-safe overflow-y-auto">
        <div className="relative">
          <img
            src={article.image}
            alt={article.title}
            className="w-full h-64 object-cover"
          />
          <div className="absolute top-0 inset-x-0 p-4 bg-gradient-to-b from-black/50 to-transparent flex justify-between">
            <button
              onClick={() => setSelectedArticleId(null)}
              className="w-10 h-10 flex items-center justify-center rounded-full bg-black/20 backdrop-blur-sm text-white hover:bg-black/30 transition-colors"
            >
              {isRtl ? <ChevronRight size={24} /> : <ChevronLeft size={24} />}
            </button>
            <button className="w-10 h-10 flex items-center justify-center rounded-full bg-black/20 backdrop-blur-sm text-white hover:bg-black/30 transition-colors">
              <Share2 size={20} />
            </button>
          </div>
        </div>

        <div className="p-5 -mt-6 bg-white rounded-t-3xl relative z-10">
          <span className="text-xs font-bold text-sky-700 bg-sky-50 px-3 py-1 rounded-full">
            {article.category}
          </span>
          <h1 className="font-bold text-slate-900 text-xl leading-relaxed mt-4 mb-3">
            {article.title}
          </h1>

          <div className="flex items-center gap-4 text-xs text-slate-500 mb-6 border-b border-slate-100 pb-4">
            <div className="flex items-center gap-1.5 font-medium">
              <Clock size={16} className="text-slate-400" /> {article.readTime}{" "}
              مطالعه
            </div>
            <div className="w-1 h-1 bg-slate-300 rounded-full"></div>
            <div className="font-medium">۱۴ محرم ۱۴۴۶</div>
          </div>

          <div className="prose prose-slate prose-sm max-w-none text-slate-700 leading-loose">
            {article.content.split("\n").map((paragraph, idx) => (
              <p key={idx} className="mb-4">
                {paragraph}
              </p>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-slate-50 pb-safe">
      <div className="bg-white flex items-center justify-between p-4 sticky top-0 z-20 shadow-sm border-b border-slate-200">
        <h1 className="font-bold text-slate-900 text-lg mx-auto">
          {t("health_blog")}
        </h1>
      </div>

      <div className="flex-1 overflow-y-auto">
        <div className="p-4">
          <div className="relative mb-6">
            <input
              type="text"
              placeholder="جستجوی مقالات..."
              className="w-full bg-white border border-slate-200 rounded-xl py-3 px-4 pe-11 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500 shadow-sm"
            />
            <Search
              size={18}
              className="absolute end-4 top-3.5 text-slate-400"
            />
          </div>

          <h2 className="font-bold text-slate-800 mb-4">
            {t("latest_articles")}
          </h2>

          <div className="space-y-4">
            {articles.map((article) => (
              <div
                key={article.id}
                className="bg-white rounded-2xl overflow-hidden shadow-sm border border-slate-100 flex flex-col cursor-pointer hover:shadow-md transition-shadow"
                onClick={() => setSelectedArticleId(article.id)}
              >
                <img
                  src={article.image}
                  alt={article.title}
                  className="w-full h-40 object-cover"
                  loading="lazy"
                />
                <div className="p-4">
                  <span className="text-[10px] font-bold text-sky-600 bg-sky-50 px-2 py-1 rounded-md">
                    {article.category}
                  </span>
                  <h3 className="font-bold text-slate-900 mt-2 mb-2 leading-relaxed hover:text-sky-700 transition-colors">
                    {article.title}
                  </h3>
                  <div className="flex items-center justify-between mt-3 text-xs text-slate-500">
                    <div className="flex items-center gap-1">
                      <Clock size={14} />
                      <span>{article.readTime} مطالعه</span>
                    </div>
                    <span className="text-sky-600 font-bold flex items-center gap-1">
                      {t("read_more")}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
