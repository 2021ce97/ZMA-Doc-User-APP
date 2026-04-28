import React from 'react';
import { User, Settings, Heart, Bell, Shield, ChevronRight, LogOut, FileText, ChevronLeft, MapPin, Star, Clock } from 'lucide-react';
import { DOCTORS } from '../../data/mockData';

interface ProfileScreenProps {
  favorites: string[];
  onNavigate: (screen: string, params?: any) => void;
  onToggleFavorite: (id: string) => void;
}

export function ProfileScreen({ favorites, onNavigate, onToggleFavorite }: ProfileScreenProps) {
  const favoriteDoctors = DOCTORS.filter(d => favorites.includes(d.id));

  return (
    <div className="flex flex-col h-full bg-slate-50 pb-safe">
      <div className="bg-sky-600 pt-10 pb-20 px-5 relative overflow-hidden shrink-0">
         <div className="absolute end-0 top-0 w-32 h-32 bg-white/10 rounded-full translate-x-12 -translate-y-8 blur-2xl"></div>
         <h1 className="text-xl font-bold text-white text-center">حساب کاربری</h1>
      </div>

      <div className="flex-1 overflow-y-auto px-4 -mt-14 relative z-10">
         {/* Profile Card */}
         <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100 flex items-center gap-4 mb-6">
            <div className="w-16 h-16 bg-sky-100 rounded-full flex items-center justify-center border-4 border-white shadow-sm shrink-0">
               <User size={32} className="text-sky-600" />
            </div>
            <div className="flex-1">
               <h2 className="text-lg font-bold text-slate-900">احمد جواد</h2>
               <p className="text-sm text-slate-500">۰۷۹ ۱۲۳ ۴۵۶۷</p>
            </div>
            <button className="w-10 h-10 bg-slate-50 rounded-full flex items-center justify-center text-slate-400">
               <Settings size={20} />
            </button>
         </div>

         {/* Favorites Section */}
         <div className="mb-6">
            <h3 className="font-bold text-slate-800 mb-3 flex items-center gap-2 px-1">
               <Heart size={18} className="text-rose-500 fill-rose-500" />
               داکتران مورد علاقه
            </h3>
            
            {favoriteDoctors.length === 0 ? (
               <div className="bg-white rounded-xl p-6 text-center shadow-sm border border-slate-100 text-slate-500 text-sm">
                  شما هنوز داکتری را نشانه گذاری نکرده‌اید.
               </div>
            ) : (
               <div className="flex overflow-x-auto gap-4 pb-2 snap-x hide-scrollbar">
                  {favoriteDoctors.map(doctor => (
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
                           <Heart size={16} className="fill-rose-500 text-rose-500" />
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
                     </button>
                  ))}
               </div>
            )}
         </div>

         {/* Menu List */}
         <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden mb-6">
            <MenuRow icon={<FileText />} color="text-blue-500" bg="bg-blue-50" title="سوابق صحی (نسخه‌ها)" />
            <MenuRow icon={<Bell />} color="text-amber-500" bg="bg-amber-50" title="آگاه‌سازی‌ها (Notifications)" />
            <MenuRow icon={<Shield />} color="text-emerald-500" bg="bg-emerald-50" title="حریم خصوصی و امنیت" />
            <MenuRow icon={<LogOut />} color="text-slate-400" bg="bg-slate-50" title="خروج از حساب" last />
         </div>
      </div>
    </div>
  );
}

function MenuRow({ icon, color, bg, title, last = false }: any) {
  return (
    <button className={`w-full flex items-center justify-between p-4 bg-white hover:bg-slate-50 transition-colors ${!last ? 'border-b border-slate-50' : ''}`}>
       <div className="flex items-center gap-3">
          <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${bg} ${color}`}>
             {icon}
          </div>
          <span className="font-medium text-slate-700 text-sm">{title}</span>
       </div>
       <ChevronLeft size={18} className="text-slate-300" />
    </button>
  );
}
