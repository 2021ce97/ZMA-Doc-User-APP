import React, { useState, useEffect } from "react";
import {
  ChevronRight,
  ChevronLeft,
  CalendarClock,
  CreditCard,
  ArrowLeft,
  CheckCircle2,
  WifiOff,
} from "lucide-react";
import { DOCTORS } from "../../data/mockData";
import { useLanguage } from "../../contexts/LanguageContext";
import { triggerHaptic } from "../../utils/haptics";

interface BookingScreenProps {
  doctorId: string;
  onBack: () => void;
  onHome: () => void;
}

export function BookingScreen({
  doctorId,
  onBack,
  onHome,
}: BookingScreenProps) {
  const doctor = DOCTORS.find((d) => d.id === doctorId);
  const [step, setStep] = useState<1 | 2>(1);
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null);
  const [bookingError, setBookingError] = useState<string | null>(null);
  const [offlineQueued, setOfflineQueued] = useState(false);
  const { t, isRtl, lang } = useLanguage();

  useEffect(() => {
    // Permission handled in App.tsx now
  }, [lang]);

  if (!doctor) return <div>Doctor not found</div>;

  const dates = [
    { day: lang === "en" ? "Today" : "امروز", date: "۱۵ ثور" },
    { day: lang === "en" ? "Tomorrow" : "فردا", date: "۱۶ ثور" },
    { day: lang === "en" ? "Monday" : "دوشنبه", date: "۱۷ ثور" },
    { day: lang === "en" ? "Tuesday" : "سه‌شنبه", date: "۱۸ ثور" },
  ];

  const slots = [
    "۰۹:۰۰ ق.ظ",
    "۰۹:۳۰ ق.ظ",
    "۱۰:۰۰ ق.ظ",
    "۱۰:۳۰ ق.ظ",
    "۰۲:۰۰ ب.ظ",
    "۰۲:۳۰ ب.ظ",
    "۰۳:۰۰ ب.ظ",
    "۰۳:۳۰ ب.ظ",
  ];

  const handleBooking = () => {
    if (!navigator.onLine) {
      triggerHaptic("success");
      localStorage.setItem(
        "offline_booking",
        JSON.stringify({
          doctorId,
          slot: selectedSlot,
          date: new Date().toISOString(),
        }),
      );
      setOfflineQueued(true);
      setStep(2);
      return;
    }

    // Request permission and schedule notification
    if ("Notification" in window) {
      if (Notification.permission === "granted") {
        new Notification(lang === "en" ? "Appointment Booked" : "نوبت ثبت شد", {
          body:
            lang === "en"
              ? `Reminder scheduled for ${doctor.name} at ${selectedSlot}`
              : `یادآوری برای ${doctor.name} تنظیم شد ساعت ${selectedSlot}`,
        });
      } else if (Notification.permission !== "denied") {
        Notification.requestPermission().then((permission) => {
          if (permission === "granted") {
            new Notification(
              lang === "en" ? "Appointment Booked" : "نوبت ثبت شد",
              {
                body:
                  lang === "en"
                    ? `Reminder scheduled for ${doctor.name} at ${selectedSlot}`
                    : `یادآوری برای ${doctor.name} تنظیم شد ساعت ${selectedSlot}`,
              },
            );
          }
        });
      }
    }

    triggerHaptic("success");
    setStep(2);
  };

  if (step === 2) {
    return (
      <div className="flex flex-col items-center justify-center h-full p-6 text-center bg-slate-50 dark:bg-slate-900 transition-colors">
        <div
          className={`w-24 h-24 ${offlineQueued ? "bg-amber-100 dark:bg-amber-900/40 text-amber-500" : "bg-emerald-100 dark:bg-emerald-900/40 text-emerald-500 dark:text-emerald-400"} border border-transparent rounded-full flex items-center justify-center mb-6`}
        >
          {offlineQueued ? <WifiOff size={48} /> : <CheckCircle2 size={48} />}
        </div>
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">
          {offlineQueued
            ? lang === "en"
              ? "Booking Queued"
              : "درخواست در انتظار شبکه"
            : lang === "en"
              ? "Booking Confirmed!"
              : "نوبت شما تایید شد!"}
        </h2>
        <p className="text-slate-500 dark:text-slate-400 mb-8 max-w-[280px]">
          {offlineQueued
            ? lang === "en"
              ? "Your booking is queued. It will be submitted automatically when you reconnect."
              : "درخواست شما ثبت شد و به محض اتصال مجدد به اینترنت به صورت خودکار نهایی خواهد شد."
            : lang === "en"
              ? "A confirmation SMS with your token number has been sent. Please arrive 30 minutes early."
              : "پیامک (SMS) تایید حاوی شماره توکن برای شما ارسال گردید. لطفا نیم ساعت قبل در کلینیک حاضر باشید."}
        </p>

        {!offlineQueued && (
          <div className="bg-white dark:bg-slate-800 w-full rounded-2xl p-5 shadow-sm border border-slate-100 dark:border-slate-700 mb-8 max-w-sm text-start transition-colors">
            <div className="flex justify-between items-center border-b border-slate-100 dark:border-slate-700 pb-3 mb-3">
              <span className="text-slate-500 dark:text-slate-400 text-sm">
                {lang === "en" ? "Token Number:" : "شماره توکن:"}
              </span>
              <span className="font-bold text-xl text-sky-600 dark:text-sky-400">
                ۴۵
              </span>
            </div>
            <div className="flex justify-between items-center pb-2">
              <span className="text-slate-500 dark:text-slate-400 text-sm">
                {lang === "en" ? "Doctor:" : "داکتر:"}
              </span>
              <span className="font-semibold text-slate-900 dark:text-slate-100">
                {doctor.name}
              </span>
            </div>
            <div className="flex justify-between items-center pb-2">
              <span className="text-slate-500 dark:text-slate-400 text-sm">
                {lang === "en" ? "Time:" : "زمان:"}
              </span>
              <span className="font-semibold text-slate-900 dark:text-slate-100">
                {lang === "en"
                  ? `Today, ${selectedSlot}`
                  : `امروز، ${selectedSlot}`}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-slate-500 dark:text-slate-400 text-sm">
                {lang === "en" ? "Payment:" : "پرداخت:"}
              </span>
              <span className="font-semibold text-emerald-600 dark:text-emerald-400">
                {lang === "en"
                  ? `Cash (${doctor.fees} AFN)`
                  : `نقدی (${doctor.fees} AFN)`}
              </span>
            </div>
          </div>
        )}

        <button
          onClick={() => {
            triggerHaptic("light");
            onHome();
          }}
          className="w-full max-w-sm bg-sky-600 hover:bg-sky-700 active:scale-95 text-white font-bold py-4 rounded-xl shadow-lg shadow-sky-600/30 transition-all text-sm"
        >
          {lang === "en" ? "Back to Home" : "بازگشت به صفحه اصلی"}
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col pb-24 relative bg-slate-50 dark:bg-slate-900 min-h-full transition-colors">
      {/* App Bar */}
      <div className="bg-white dark:bg-slate-800 flex items-center justify-between p-4 sticky top-0 z-20 shadow-sm border-b border-slate-200 dark:border-slate-700 transition-colors">
        <button
          onClick={() => {
            triggerHaptic("light");
            onBack();
          }}
          className="w-10 h-10 flex items-center justify-center rounded-full bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors"
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
        <h1 className="font-bold text-slate-900 dark:text-white">
          {lang === "en" ? "Appointment Details" : "مشخصات نوبت"}
        </h1>
        <div className="w-10"></div>
      </div>

      {/* Offline Toast Error */}
      {bookingError && (
        <div className="mx-5 mt-4 p-3 bg-rose-50 dark:bg-rose-900/30 border border-rose-200 dark:border-rose-800 rounded-xl flex items-center gap-3 animate-in fade-in slide-in-from-top-4 z-10 transition-colors">
          <div className="p-2 bg-rose-100 dark:bg-rose-900/50 rounded-lg shrink-0">
            <WifiOff size={16} className="text-rose-600 dark:text-rose-400" />
          </div>
          <p className="text-xs text-rose-700 dark:text-rose-300 font-medium leading-relaxed">
            {bookingError}
          </p>
        </div>
      )}

      <div className="p-5">
        <div className="bg-white dark:bg-slate-800 rounded-2xl p-4 shadow-sm border border-slate-100 dark:border-slate-700 flex items-center gap-4 mb-6 transition-colors">
          <img
            src={doctor.avatar}
            alt=""
            className="w-16 h-16 rounded-xl object-cover bg-slate-100 dark:bg-slate-700"
            loading="lazy"
          />
          <div>
            <h3 className="font-bold text-slate-900 dark:text-white">
              {doctor.name}
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              {doctor.specialty}
            </p>
          </div>
        </div>

        <h3 className="font-bold text-slate-900 dark:text-white mb-3 flex items-center gap-2">
          <CalendarClock size={16} className="text-sky-600 dark:text-sky-400" />
          {lang === "en" ? "Select Date" : "انتخاب روز"}
        </h3>

        <div className="flex gap-3 overflow-x-auto pb-4 snap-x hide-scrollbar mb-4">
          {dates.map((d, i) => (
            <button
              key={i}
              onClick={() => triggerHaptic("light")}
              className={`min-w-[80px] p-3 rounded-xl border snap-center text-center transition-colors ${
                i === 0
                  ? "bg-sky-600 border-sky-600 text-white shadow-[0_4px_14px_rgba(2,132,199,0.3)]"
                  : "bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:border-sky-300 dark:hover:border-sky-700"
              }`}
            >
              <div
                className={`text-xs mb-1 ${i === 0 ? "text-sky-100" : "text-slate-500 dark:text-slate-400"}`}
              >
                {d.day}
              </div>
              <div
                className={`font-bold ${i === 0 ? "text-white" : "text-slate-900 dark:text-white"}`}
              >
                {d.date}
              </div>
            </button>
          ))}
        </div>

        <h3 className="font-bold text-slate-900 dark:text-white mb-3 mt-2">
          {lang === "en" ? "Select Time" : "انتخاب ساعت"}
        </h3>
        <div className="grid grid-cols-3 gap-3 mb-8">
          {slots.map((slot, i) => (
            <button
              key={i}
              onClick={() => {
                triggerHaptic("light");
                setSelectedSlot(slot);
              }}
              className={`py-2.5 rounded-xl border text-sm font-medium transition-all ${
                selectedSlot === slot
                  ? "bg-sky-50 dark:bg-sky-900/30 border-sky-600 dark:border-sky-400 text-sky-700 dark:text-sky-300 ring-1 ring-sky-600 dark:ring-sky-400 scale-[1.02]"
                  : "bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:border-slate-300"
              }`}
            >
              {slot}
            </button>
          ))}
        </div>

        <h3 className="font-bold text-slate-900 dark:text-white mb-3 flex items-center gap-2">
          <CreditCard
            size={16}
            className="text-emerald-600 dark:text-emerald-400"
          />
          {lang === "en" ? "Payment Method" : "شیوه پرداخت"}
        </h3>

        <div className="bg-white dark:bg-slate-800 rounded-xl border border-sky-200 dark:border-sky-800 p-4 relative overflow-hidden ring-1 ring-sky-600 dark:ring-sky-700 shadow-sm transition-colors">
          <div className="absolute top-0 end-0 w-8 h-8 bg-sky-50 dark:bg-sky-900/30 rounded-es-xl flex items-center justify-center transition-colors">
            <div className="w-3 h-3 bg-sky-600 dark:bg-sky-400 rounded-full"></div>
          </div>
          <div className="font-bold text-slate-900 dark:text-white text-base mb-1.5">
            {lang === "en" ? "Cash Payment" : "پرداخت نقدی (Cash)"}
          </div>
          <div className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed max-w-[85%]">
            {lang === "en"
              ? "Please pay the fee at the clinic."
              : "فیس نوبت را پس از مراجعه به معاینه خانه نقداً پرداخت نمایید."}
          </div>
          <div className="mt-4 font-black flex items-center gap-2 text-emerald-600 dark:text-emerald-400 text-base">
            <span className="bg-emerald-50 dark:bg-emerald-900/20 px-2 py-0.5 rounded border border-emerald-100 dark:border-emerald-800">
              {doctor.fees} AFN
            </span>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="fixed bottom-0 inset-x-0 p-4 bg-white dark:bg-slate-800 border-t border-slate-200 dark:border-slate-700 z-30 max-w-[400px] mx-auto pb-safe transition-colors">
        <button
          onClick={() => selectedSlot && handleBooking()}
          disabled={!selectedSlot}
          className={`w-full font-bold py-4 text-sm rounded-xl transition-all ${
            selectedSlot
              ? "bg-sky-600 hover:bg-sky-700 active:scale-[0.98] text-white shadow-[0_4px_14px_rgba(2,132,199,0.3)]"
              : "bg-slate-100 dark:bg-slate-700 text-slate-400 dark:text-slate-500 cursor-not-allowed"
          }`}
        >
          {lang === "en" ? "Confirm & Get Token" : "تایید و اخذ توکن پیامکی"}
        </button>
      </div>
    </div>
  );
}
