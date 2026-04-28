import React from 'react';
import { ChevronRight, Heart, Share2, MapPin, Award, Users, CreditCard, Calendar, Clock, Star, ShieldCheck, Building2 } from 'lucide-react';
import { DOCTORS } from '../../data/mockData';

interface DoctorProfileScreenProps {
  doctorId: string;
  onBack: () => void;
  onBook: (doctorId: string) => void;
  isFavorite: boolean;
  onToggleFavorite: () => void;
}

export function DoctorProfileScreen({ doctorId, onBack, onBook, isFavorite, onToggleFavorite }: DoctorProfileScreenProps) {
  const doctor = DOCTORS.find(d => d.id === doctorId);

  if (!doctor) return <div>Doctor not found</div>;

  return (
    <div className="flex flex-col pb-24 relative bg-slate-50 min-h-full">
      {/* App Bar */}
      <div className="bg-white flex items-center justify-between p-4 sticky top-0 z-20 shadow-sm">
        <button onClick={onBack} className="w-10 h-10 flex items-center justify-center rounded-full bg-slate-100 hover:bg-slate-200">
           <ChevronRight size={24} className="text-slate-700" />
        </button>
        <h1 className="font-bold text-slate-900">پروفایل داکتر</h1>
        <div className="flex gap-2">
          <button className="w-10 h-10 flex items-center justify-center rounded-full bg-slate-100 text-slate-600">
            <Share2 size={18} />
          </button>
          <button 
            onClick={onToggleFavorite}
            className={`w-10 h-10 flex items-center justify-center rounded-full transition-colors ${
              isFavorite ? 'bg-rose-50 text-rose-500' : 'bg-slate-100 text-slate-400'
            }`}
          >
            <Heart size={18} className={isFavorite ? "fill-rose-500" : ""} />
          </button>
        </div>
      </div>

      {/* Profile Header */}
      <div className="bg-white p-5 rounded-b-3xl shadow-sm border-b border-slate-100">
        <div className="flex gap-4">
          <img src={doctor.avatar} alt={doctor.name} className="w-24 h-24 rounded-2xl object-cover bg-slate-100 shadow-sm border-2 border-white" />
          <div className="flex-1 py-1">
            <h2 className="text-xl font-bold text-slate-900">{doctor.name}</h2>
            <div className="text-sm text-sky-600 font-medium mt-1">{doctor.specialty}</div>
            <div className="flex items-center gap-1.5 mt-2 bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded text-[10px] font-bold w-max">
              <ShieldCheck size={12} />
              شماره ثبت: {doctor.pmdc}
            </div>
            <div className="text-[11px] text-slate-500 mt-1 font-mono uppercase">{doctor.nameEn}</div>
          </div>
        </div>

        {/* Stats */}
        <div className="flex justify-between mt-6 bg-slate-50 p-3 rounded-xl border border-slate-100">
          <div className="flex flex-col items-center flex-1 border-e border-slate-200 last:border-0 pe-2">
            <div className="w-8 h-8 rounded-full bg-amber-100 flex items-center justify-center mb-1">
              <Star size={14} className="fill-amber-500 text-amber-500" />
            </div>
            <div className="font-bold text-slate-900">{doctor.rating}</div>
            <div className="text-[10px] text-slate-500 tracking-tight">امتیازات</div>
          </div>
          <div className="flex flex-col items-center flex-1 border-l border-slate-200 last:border-0 px-2">
            <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center mb-1">
              <Users size={14} className="text-blue-600" />
            </div>
            <div className="font-bold text-slate-900">{doctor.patients}+</div>
            <div className="text-[10px] text-slate-500 tracking-tight">مریضان</div>
          </div>
          <div className="flex flex-col items-center flex-1 ps-2">
            <div className="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center mb-1">
              <Award size={14} className="text-purple-600" />
            </div>
            <div className="font-bold text-slate-900">{doctor.experience} سال</div>
            <div className="text-[10px] text-slate-500 tracking-tight">تجربه کاری</div>
          </div>
        </div>
      </div>

      {/* About */}
      <div className="p-5 mt-2">
        <h3 className="font-bold text-slate-900 mb-2">درباره داکتر</h3>
        <p className="text-sm text-slate-600 leading-relaxed bg-white p-4 rounded-xl shadow-sm border border-slate-100">
          {doctor.about}
        </p>
      </div>
      
      {/* Affiliations & Timings */}
      <div className="p-5 pt-0">
        <h3 className="font-bold text-slate-900 mb-2 flex items-center gap-2">
           <Building2 size={16} className="text-sky-600" />
           شفاخانه‌ها و اوقات کاری
        </h3>
        <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden divide-y divide-slate-100">
          {doctor.timings?.map((timing, idx) => (
            <div key={idx} className="p-4 flex flex-col gap-2">
              <div className="flex justify-between items-start">
                 <div className="font-bold text-sm text-slate-900">{timing.clinic}</div>
              </div>
              <div className="flex items-center gap-2 text-xs text-slate-500">
                 <Calendar size={14} className="text-slate-400" />
                 <span>{timing.day}</span>
              </div>
              <div className="flex items-center gap-2 text-xs text-slate-500 bg-slate-50 w-max px-2 py-1 rounded-md mt-1">
                 <Clock size={14} className="text-sky-500" />
                 <span className="font-medium text-slate-700">{timing.hours}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Location (Static Map approach) */}
      <div className="p-5 pt-0">
        <h3 className="font-bold text-slate-900 mb-2">موقعیت معاینه‌خانه اصلی</h3>
        <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
          <div className="h-32 bg-slate-200 relative flex items-center justify-center">
            {/* Mocked Static Map Image -> Low Bandwidth */}
            <div className="absolute inset-0 bg-sky-50 opacity-50 pattern-grid"></div>
            <div className="relative bg-white/80 backdrop-blur px-3 py-1.5 rounded-lg border border-slate-200 text-[10px] font-bold text-slate-700 flex items-center gap-1.5 z-10 shadow-sm">
               <MapPin size={12} className="text-rose-500" />
               جهت ذخیره اینترنت نقشه غیرفعال است
            </div>
          </div>
          <div className="p-4">
            <div className="font-bold text-sm text-slate-900">{doctor.hospital}</div>
            <div className="text-sm text-slate-500 mt-1 flex items-start gap-2">
              <MapPin size={16} className="text-slate-400 shrink-0 mt-0.5" />
              <span>{doctor.location}</span>
            </div>
            <div className="text-sm text-slate-500 mt-2 flex items-start gap-2">
              <CreditCard size={16} className="text-slate-400 shrink-0 mt-0.5" />
              <span>فیس معاینه: <strong className="text-slate-900 text-base">{doctor.fees} AFN</strong> (پرداخت نقدی)</span>
            </div>
          </div>
        </div>
      </div>

      {/* Floating Action Button */}
      <div className="fixed bottom-0 inset-x-0 p-4 bg-white border-t border-slate-200 z-30 flex gap-3 max-w-[400px] mx-auto pb-safe">
        <div className="flex flex-col justify-center px-4 bg-slate-50 rounded-xl border border-slate-100">
           <span className="text-[10px] text-slate-500">نوبت بعدی</span>
           <span className="text-xs font-bold text-sky-700">{doctor.nextAvailable.split('،')[1]}</span>
        </div>
        <button 
          onClick={() => onBook(doctor.id)}
          className="flex-1 bg-sky-600 hover:bg-sky-700 active:bg-sky-800 text-white font-bold py-4 rounded-xl shadow-[0_4px_15px_rgba(2,132,199,0.3)] transition-all flex items-center justify-center gap-2"
        >
          <Calendar size={18} />
          اخذ نوبت (Book Token)
        </button>
      </div>

    </div>
  );
}
