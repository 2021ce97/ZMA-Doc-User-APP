import React, { useState } from 'react';
import { ChevronRight, CalendarClock, CreditCard, ArrowLeft, CheckCircle2 } from 'lucide-react';
import { DOCTORS } from '../../data/mockData';

interface BookingScreenProps {
  doctorId: string;
  onBack: () => void;
  onHome: () => void;
}

export function BookingScreen({ doctorId, onBack, onHome }: BookingScreenProps) {
  const doctor = DOCTORS.find(d => d.id === doctorId);
  const [step, setStep] = useState<1 | 2>(1);
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null);

  if (!doctor) return <div>Doctor not found</div>;

  const dates = [
    { day: 'امروز', date: '۱۵ ثور' },
    { day: 'فردا', date: '۱۶ ثور' },
    { day: 'دوشنبه', date: '۱۷ ثور' },
    { day: 'سه‌شنبه', date: '۱۸ ثور' },
  ];

  const slots = [
    '۰۹:۰۰ ق.ظ', '۰۹:۳۰ ق.ظ', '۱۰:۰۰ ق.ظ', '۱۰:۳۰ ق.ظ',
    '۰۲:۰۰ ب.ظ', '۰۲:۳۰ ب.ظ', '۰۳:۰۰ ب.ظ', '۰۳:۳۰ ب.ظ'
  ];

  if (step === 2) {
    return (
      <div className="flex flex-col items-center justify-center h-full p-6 text-center bg-slate-50">
        <div className="w-24 h-24 bg-emerald-100 rounded-full flex items-center justify-center mb-6">
          <CheckCircle2 size={48} className="text-emerald-500" />
        </div>
        <h2 className="text-2xl font-bold text-slate-900 mb-2">نوبت شما تایید شد!</h2>
        <p className="text-slate-500 mb-8 max-w-[280px]">
          پیامک (SMS) تایید حاوی شماره توکن برای شما ارسال گردید. لطفا نیم ساعت قبل در کلینیک حاضر باشید.
        </p>

        <div className="bg-white w-full rounded-2xl p-5 shadow-sm border border-slate-100 mb-8 max-w-sm text-start">
          <div className="flex justify-between items-center border-b border-slate-100 pb-3 mb-3">
             <span className="text-slate-500 text-sm">شماره توکن:</span>
             <span className="font-bold text-xl text-sky-600">۴۵</span>
          </div>
          <div className="flex justify-between items-center pb-2">
             <span className="text-slate-500 text-sm">داکتر:</span>
             <span className="font-semibold text-slate-900">{doctor.name}</span>
          </div>
          <div className="flex justify-between items-center pb-2">
             <span className="text-slate-500 text-sm">زمان:</span>
             <span className="font-semibold text-slate-900">امروز، {selectedSlot}</span>
          </div>
          <div className="flex justify-between items-center">
             <span className="text-slate-500 text-sm">پرداخت:</span>
             <span className="font-semibold text-emerald-600">نقدی در کلینیک ({doctor.fees} AFN)</span>
          </div>
        </div>

        <button 
          onClick={onHome}
          className="w-full max-w-sm bg-sky-600 text-white font-bold py-4 rounded-xl shadow-lg shadow-sky-600/30"
        >
          بازگشت به صفحه اصلی
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col pb-24 relative bg-slate-50 min-h-full">
      {/* App Bar */}
      <div className="bg-white flex items-center justify-between p-4 sticky top-0 z-20 shadow-sm border-b border-slate-200">
        <button onClick={onBack} className="w-10 h-10 flex items-center justify-center rounded-full bg-slate-100 hover:bg-slate-200">
           <ChevronRight size={24} className="text-slate-700" />
        </button>
        <h1 className="font-bold text-slate-900">مشخصات نوبت</h1>
        <div className="w-10"></div>
      </div>

      <div className="p-5">
        <div className="bg-white rounded-xl p-4 shadow-sm border border-slate-100 flex items-center gap-4 mb-6">
          <img src={doctor.avatar} alt="" className="w-16 h-16 rounded-xl object-cover" />
          <div>
            <h3 className="font-bold text-slate-900">{doctor.name}</h3>
            <p className="text-xs text-slate-500">{doctor.specialty}</p>
          </div>
        </div>

        <h3 className="font-bold text-slate-900 mb-3 flex items-center gap-2">
          <CalendarClock size={16} className="text-sky-600" />
          انتخاب روز
        </h3>
        
        <div className="flex gap-3 overflow-x-auto pb-4 snap-x hide-scrollbar mb-4">
          {dates.map((d, i) => (
            <button 
              key={i}
              className={`min-w-[80px] p-3 rounded-xl border snap-center text-center transition-colors ${
                i === 0 
                ? 'bg-sky-600 border-sky-600 text-white shadow-md' 
                : 'bg-white border-slate-200 text-slate-700 hover:border-sky-300'
              }`}
            >
              <div className={`text-xs mb-1 ${i === 0 ? 'text-sky-100' : 'text-slate-500'}`}>{d.day}</div>
              <div className="font-bold">{d.date}</div>
            </button>
          ))}
        </div>

        <h3 className="font-bold text-slate-900 mb-3 mt-2">انتخاب ساعت</h3>
        <div className="grid grid-cols-3 gap-3 mb-8">
          {slots.map((slot, i) => (
            <button 
              key={i}
              onClick={() => setSelectedSlot(slot)}
              className={`py-2.5 rounded-lg border text-sm font-medium transition-all ${
                selectedSlot === slot 
                ? 'bg-sky-50 border-sky-600 text-sky-700 ring-1 ring-sky-600' 
                : 'bg-white border-slate-200 text-slate-600 hover:border-slate-300'
              }`}
            >
              {slot}
            </button>
          ))}
        </div>

        <h3 className="font-bold text-slate-900 mb-3 flex items-center gap-2">
          <CreditCard size={16} className="text-emerald-600" />
          شیوه پرداخت
        </h3>
        
        <div className="bg-white rounded-xl border border-sky-200 p-4 relative overflow-hidden ring-1 ring-sky-600 shadow-sm">
          <div className="absolute top-0 end-0 w-8 h-8 bg-sky-50 rounded-es-xl flex items-center justify-center">
            <div className="w-3 h-3 bg-sky-600 rounded-full"></div>
          </div>
          <div className="font-bold text-slate-900 text-lg mb-1">پرداخت نقدی (Cash)</div>
          <div className="text-xs text-slate-500 leading-relaxed max-w-[85%]">
            فیس نوبت را پس از مراجعه به معاینه خانه نقداً پرداخت نمایید.
          </div>
          <div className="mt-3 font-bold text-emerald-600 text-lg">{doctor.fees} AFN</div>
        </div>
      </div>

      {/* Footer */}
      <div className="fixed bottom-0 inset-x-0 p-4 bg-white border-t border-slate-200 z-30 max-w-[400px] mx-auto pb-safe">
        <button 
          onClick={() => selectedSlot && setStep(2)}
          disabled={!selectedSlot}
          className={`w-full font-bold py-4 rounded-xl transition-all ${
            selectedSlot 
            ? 'bg-sky-600 text-white shadow-lg shadow-sky-600/30' 
            : 'bg-slate-100 text-slate-400 cursor-not-allowed'
          }`}
        >
          تایید و اخذ توکن پیامکی
        </button>
      </div>
    </div>
  );
}
