import React from 'react';
import { Search, MapPin, Bell, ChevronLeft, Star, Clock, Heart } from 'lucide-react';
import { DOCTORS, CATEGORIES } from '../../data/mockData';
import * as Icons from 'lucide-react';

interface HomeScreenProps {
  onNavigate: (screen: 'doctor_profile' | 'search' | 'pharmacies', params?: any) => void;
  favorites: string[];
  onToggleFavorite: (id: string) => void;
}

export function HomeScreen({ onNavigate, favorites, onToggleFavorite }: HomeScreenProps) {
  return (
    <div className="flex flex-col pb-8">
      {/* Header */}
      <div className="bg-slate-900 text-white px-5 pt-8 pb-6 rounded-b-3xl shadow-md relative overflow-hidden">
        <div className="absolute top-0 end-0 w-32 h-32 bg-white/5 rounded-full -translate-y-12 translate-x-8 blur-2xl"></div>
        <div className="absolute bottom-0 start-0 w-24 h-24 bg-sky-500/20 rounded-full translate-y-8 -translate-x-4 blur-xl"></div>
        
        <div className="flex justify-between items-center relative z-10">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center border border-white/20">
              <span className="text-lg">👋</span>
            </div>
            <div>
              <div className="text-[11px] text-sky-200 font-medium">سلام، صبحتان بخیر</div>
              <div className="font-bold text-lg">احمد جواد</div>
            </div>
          </div>
          <button className="relative w-10 h-10 bg-white/10 rounded-full flex items-center justify-center border border-white/20">
            <Bell size={20} className="text-white" />
            <span className="absolute top-2 end-2 w-2 h-2 bg-rose-500 rounded-full"></span>
          </button>
        </div>

        <div className="mt-6 flex items-center gap-2 bg-white/10 border border-white/20 rounded-xl p-3 relative z-10" onClick={() => onNavigate('search')}>
          <MapPin size={18} className="text-sky-300" />
          <div className="flex-1">
            <div className="text-[10px] text-sky-200">موقعیت فعلی</div>
            <div className="text-sm font-semibold text-white">مزارشریف، کارته صلح</div>
          </div>
          <ChevronLeft size={18} className="text-sky-300" />
        </div>
      </div>

      {/* Search Bar - overlap */}
      <div className="px-5 -mt-5 relative z-20">
        <button 
          onClick={() => onNavigate('search')}
          className="w-full bg-white rounded-xl shadow-[0_4px_20px_rgba(0,0,0,0.08)] border border-slate-100 p-4 flex items-center gap-3"
        >
          <Search size={20} className="text-slate-400" />
          <span className="text-slate-400 text-sm font-medium">جستجوی داکتر، شفاخانه یا بیماری...</span>
        </button>
      </div>

      {/* Quick Categories */}
      <div className="px-5 mt-8">
        <h2 className="text-sm font-bold text-slate-800 mb-4">خدمات صحی (Services)</h2>
        <div className="grid grid-cols-4 gap-3">
          {CATEGORIES.map((cat) => {
            // @ts-ignore
            const Icon = Icons[cat.icon];
            return (
              <button key={cat.id} className="flex flex-col items-center gap-2" onClick={() => onNavigate(cat.route as any)}>
                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center ${cat.color} shadow-sm`}>
                  {Icon && <Icon size={24} />}
                </div>
                <span className="text-[11px] font-bold text-slate-700">{cat.name}</span>
              </button>
            )
          })}
        </div>
      </div>

      {/* AI Telehealth Promo */}
      <div className="px-5 mt-8">
        <div className="bg-gradient-to-r from-sky-600 to-indigo-700 rounded-2xl p-5 text-white flex items-center justify-between shadow-lg shadow-sky-600/20 relative overflow-hidden">
        <div className="absolute end-0 top-0 w-24 h-24 bg-white/10 rounded-full translate-x-8 -translate-y-8 blur-lg"></div>
           <div className="relative z-10 w-2/3">
             <h3 className="font-bold text-base mb-1">دستیار هوشمند صحی</h3>
             <p className="text-xs text-sky-100 mb-3 leading-relaxed">بررسی علایم بیماری به زبان‌های دری و پشتو به صورت رایگان.</p>
             <button className="bg-white text-sky-700 text-xs font-bold px-4 py-2 rounded-lg shadow-sm">
               شروع گفتگو (Start)
             </button>
           </div>
           <div className="text-5xl drop-shadow-md">🤖</div>
        </div>
      </div>

      {/* Top Doctors */}
      <div className="mt-8">
        <div className="px-5 flex justify-between items-center mb-4">
          <h2 className="text-sm font-bold text-slate-800">برترین داکتران آفلاین (Cached)</h2>
          <button className="text-[11px] font-bold text-sky-600">مشاهده همه</button>
        </div>
        
        <div className="flex overflow-x-auto gap-4 px-5 pb-4 snap-x hide-scrollbar">
          {DOCTORS.map((doctor) => {
            const isFav = favorites.includes(doctor.id);
            return (
            <button 
              key={doctor.id} 
              onClick={() => onNavigate('doctor_profile', { doctorId: doctor.id })}
              className="bg-white rounded-2xl p-4 min-w-[240px] shadow-sm border border-slate-100 snap-center focus:outline-none focus:ring-2 focus:ring-sky-500 text-start text-slate-900 relative"
            >
              <div 
                className="absolute top-3 start-3 p-1.5 rounded-full bg-slate-50 border border-slate-100 z-10"
                onClick={(e) => {
                  e.stopPropagation();
                  onToggleFavorite(doctor.id);
                }}
              >
                <Heart size={16} className={isFav ? "fill-rose-500 text-rose-500" : "text-slate-400"} />
              </div>
              <div className="flex gap-3 mb-3">
                <img src={doctor.avatar} alt={doctor.name} className="w-12 h-12 rounded-xl object-cover bg-slate-100" loading="lazy" />
                <div>
                  <h3 className="font-bold text-sm text-slate-900">{doctor.name}</h3>
                  <p className="text-[11px] text-sky-600 font-medium mt-0.5">{doctor.specialty.split('(')[0]}</p>
                </div>
              </div>
              
              <div className="flex items-center gap-1.5 text-xs text-slate-500 mb-2">
                <MapPin size={12} className="text-slate-400" />
                <span className="truncate">{doctor.hospital}</span>
              </div>
              
              <div className="flex items-center justify-between border-t border-slate-50 pt-3 mt-1">
                <div className="flex items-center gap-1.5 bg-amber-50 text-amber-700 px-2 py-1 rounded-md">
                  <Star size={10} className="fill-amber-500 text-amber-500" />
                  <span className="text-[10px] font-bold">{doctor.rating}</span>
                </div>
                <div className="flex items-center gap-1.5 bg-sky-50 text-sky-700 px-2 py-1 rounded-md">
                  <Clock size={10} />
                  <span className="text-[10px] font-bold">{doctor.nextAvailable.split('،')[0]}</span>
                </div>
              </div>
            </button>
            )
          })}
        </div>
      </div>
    </div>
  );
}
