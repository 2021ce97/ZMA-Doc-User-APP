import React, { useState, useEffect } from "react";
import {
  ChevronRight,
  Heart,
  Share2,
  MapPin,
  Award,
  Users,
  CreditCard,
  Calendar as CalendarIcon,
  Clock,
  Star,
  ShieldCheck,
  Building2,
  ChevronLeft,
} from "lucide-react";
import { DOCTORS } from "../../data/mockData";
import { useLanguage } from "../../contexts/LanguageContext";

interface DoctorProfileScreenProps {
  doctorId: string;
  onBack: () => void;
  onBook: (doctorId: string) => void;
  isFavorite: boolean;
  onToggleFavorite: () => void;
}

export function DoctorProfileScreen({
  doctorId,
  onBack,
  onBook,
  isFavorite,
  onToggleFavorite,
}: DoctorProfileScreenProps) {
  const doctor = DOCTORS.find((d) => d.id === doctorId);
  const { t, isRtl, lang } = useLanguage();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 800);
    return () => clearTimeout(timer);
  }, [doctorId]);

  if (!doctor) return <div>Doctor not found</div>;

  // Simple parser to guess available days for the visual calendar
  // Week in Afghanistan starts on Saturday (شنبه)
  const weekDays = [
    { id: 0, labelFa: "ش", labelEn: "Sa" },
    { id: 1, labelFa: "ی", labelEn: "Su" },
    { id: 2, labelFa: "د", labelEn: "Mo" },
    { id: 3, labelFa: "س", labelEn: "Tu" },
    { id: 4, labelFa: "چ", labelEn: "We" },
    { id: 5, labelFa: "پ", labelEn: "Th" },
    { id: 6, labelFa: "ج", labelEn: "Fr" },
  ];

  const getAvailableDays = () => {
    const timingStr = JSON.stringify(doctor.timings);
    const available = new Set<number>();

    // Very rough heuristic mapping to show interaction in prototype
    if (
      timingStr.includes("همه") ||
      timingStr.includes("تمام روزها") ||
      timingStr.includes("هر روز")
    ) {
      [0, 1, 2, 3, 4, 5, 6].forEach((d) => available.add(d));
    }
    if (timingStr.includes("بجز جمعه") || timingStr.includes("تا پنجشنبه")) {
      [0, 1, 2, 3, 4, 5].forEach((d) => available.add(d));
      available.delete(6);
    }
    if (timingStr.includes("تا چهارشنبه")) {
      [0, 1, 2, 3, 4].forEach((d) => available.add(d));
    }
    if (timingStr.includes("پنجشنبه")) available.add(5);
    if (timingStr.includes("دوشنبه")) available.add(2);
    if (timingStr.includes("چهارشنبه")) available.add(4);
    if (available.size === 0) [0, 1, 2].forEach((d) => available.add(d)); // fallback
    return available;
  };

  const availableDays = getAvailableDays();

  return (
    <div className="flex flex-col pb-24 relative bg-slate-50 min-h-full">
      {/* App Bar */}
      <div className="bg-white flex items-center justify-between p-4 sticky top-0 z-20 shadow-sm border-b border-slate-100">
        <button
          onClick={onBack}
          className="w-10 h-10 flex items-center justify-center rounded-full bg-slate-100 hover:bg-slate-200"
        >
          {isRtl ? (
            <ChevronRight size={24} className="text-slate-700" />
          ) : (
            <ChevronLeft size={24} className="text-slate-700" />
          )}
        </button>
        <h1 className="font-bold text-slate-900">{t("doctor_profile")}</h1>
        <div className="flex gap-2">
          <button className="w-10 h-10 flex items-center justify-center rounded-full bg-slate-100 text-slate-600 hover:bg-slate-200">
            <Share2 size={18} />
          </button>
          <button
            onClick={onToggleFavorite}
            className={`w-10 h-10 flex items-center justify-center rounded-full transition-colors ${
              isFavorite
                ? "bg-rose-50 text-rose-500 hover:bg-rose-100"
                : "bg-slate-100 text-slate-400 hover:bg-slate-200"
            }`}
          >
            <Heart size={18} className={isFavorite ? "fill-rose-500" : ""} />
          </button>
        </div>
      </div>

      {/* Profile Header */}
      {isLoading ? (
        <div className="bg-white p-5 shadow-sm animate-pulse">
          <div className="flex gap-4">
            <div className="w-24 h-24 rounded-2xl bg-slate-200"></div>
            <div className="flex-1 py-1 space-y-3 mt-2">
              <div className="h-5 bg-slate-200 rounded w-2/3"></div>
              <div className="h-4 bg-slate-200 rounded w-1/2"></div>
              <div className="h-4 bg-slate-200 rounded w-1/3"></div>
            </div>
          </div>
          <div className="flex justify-between mt-6 bg-slate-50 p-2 rounded-xl border border-slate-100">
            <div className="flex-1 h-14 bg-slate-200 rounded mx-1"></div>
            <div className="flex-1 h-14 bg-slate-200 rounded mx-1"></div>
            <div className="flex-1 h-14 bg-slate-200 rounded mx-1"></div>
          </div>
        </div>
      ) : (
        <div className="bg-white p-5 shadow-sm">
          <div className="flex gap-4">
            <img
              src={doctor.avatar}
              alt={doctor.name}
              className="w-24 h-24 rounded-2xl object-cover bg-slate-100 shadow-sm border-2 border-slate-50"
            />
            <div className="flex-1 py-1">
              <h2 className="text-xl font-bold text-slate-900">
                {doctor.name}
              </h2>
              <div className="text-sm text-sky-600 font-medium mt-1">
                {doctor.specialty}
              </div>
              <div className="flex items-center gap-1.5 mt-2 bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded text-[10px] font-bold w-max">
                <ShieldCheck size={12} />
                شماره ثبت: {doctor.pmdc}
              </div>
              <div className="text-[11px] text-slate-500 mt-1 font-mono uppercase">
                {doctor.nameEn}
              </div>
            </div>
          </div>

          {/* Stats */}
          <div className="flex justify-between mt-6 bg-slate-50 p-2 rounded-xl border border-slate-100">
            <div className="flex flex-col items-center flex-1 border-e border-slate-200 last:border-0 pe-2">
              <div className="w-8 h-8 rounded-full bg-amber-100 flex items-center justify-center mb-1">
                <Star size={14} className="fill-amber-500 text-amber-500" />
              </div>
              <div className="font-bold text-slate-900 text-sm">
                {doctor.rating}
              </div>
              <div className="text-[9px] text-slate-500 tracking-tight uppercase">
                {t("ratings")}
              </div>
            </div>
            <div className="flex flex-col items-center flex-1 border-e border-slate-200 last:border-0 px-2">
              <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center mb-1">
                <Users size={14} className="text-blue-600" />
              </div>
              <div className="font-bold text-slate-900 text-sm">
                {doctor.patients}+
              </div>
              <div className="text-[9px] text-slate-500 tracking-tight uppercase">
                {t("patients")}
              </div>
            </div>
            <div className="flex flex-col items-center flex-1 ps-2">
              <div className="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center mb-1">
                <Award size={14} className="text-purple-600" />
              </div>
              <div className="font-bold text-slate-900 text-sm">
                {doctor.experience} {t("years")}
              </div>
              <div className="text-[9px] text-slate-500 tracking-tight uppercase">
                {t("experience")}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Visual Calendar */}
      <div className="p-5 mt-2 bg-white border-y border-slate-100 shadow-sm">
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-bold text-slate-900 flex items-center gap-2">
            <CalendarIcon size={16} className="text-sky-600" />
            {t("doctor_calendar")}
          </h3>
          <span className="text-[10px] bg-slate-100 text-slate-600 px-2 py-1 rounded-md font-bold">
            {t("current_week")}
          </span>
        </div>

        <div className="flex justify-between items-center bg-slate-50 p-3 rounded-xl border border-slate-100">
          {weekDays.map((day) => {
            const isAvail = availableDays.has(day.id);
            return (
              <div key={day.id} className="flex flex-col items-center gap-1.5">
                <span
                  className={`text-[10px] font-bold ${isAvail ? "text-slate-700" : "text-slate-400"}`}
                >
                  {isRtl ? day.labelFa : day.labelEn}
                </span>
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center border-2 transition-colors ${
                    isAvail
                      ? "border-sky-200 bg-sky-100 text-sky-700 shadow-sm"
                      : "border-slate-100 bg-white text-slate-200 opacity-50"
                  }`}
                >
                  {isAvail ? (
                    <div className="w-2 h-2 rounded-full bg-sky-500"></div>
                  ) : (
                    <div className="w-1.5 h-0.5 rounded-full bg-slate-200"></div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
        <div className="mt-3 flex justify-center gap-4 text-[10px] text-slate-500 font-medium">
          <div className="flex items-center gap-1.5">
            <div className="w-2 h-2 rounded-full bg-sky-500"></div>{" "}
            {lang === "en" ? "Available" : "روزهای حضور"}
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-2 h-0.5 rounded-full bg-slate-300"></div>{" "}
            {lang === "en" ? "Unavailable" : "روزهای عدم حضور"}
          </div>
        </div>
      </div>

      {/* Skills / Areas of Expertise */}
      {doctor.skills && doctor.skills.length > 0 && (
        <div className="p-5 pb-0">
          <h3 className="font-bold text-slate-900 mb-3 flex items-center gap-2">
            <Award size={16} className="text-purple-600" />
            {lang === "en" ? "Skills & Expertise" : "مهارت‌ها و تخصص‌ها"}
          </h3>
          <div className="flex flex-wrap gap-2">
            {doctor.skills.map((skill, idx) => (
              <span
                key={idx}
                className="bg-purple-50 text-purple-700 border border-purple-100 px-3 py-1.5 rounded-lg text-xs font-medium"
              >
                {lang === "en" ? skill : skill}{" "}
                {/* Assume English translating skills separately if needed, leave as is for now */}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Conditions Treated */}
      <div className="p-5 pb-0">
        <h3 className="font-bold text-slate-900 mb-3 flex items-center gap-2">
          <Heart size={16} className="text-rose-600" />
          {lang === "en" ? "Conditions Treated" : "بیماری‌های تحت درمان"}
        </h3>
        <div className="flex flex-wrap gap-2">
          {["Hypertension", "Diabetes", "Heart Disease", "Asthma"].map(
            (condition, idx) => (
              <span
                key={idx}
                className="bg-rose-50 text-rose-700 border border-rose-100 px-3 py-1.5 rounded-lg text-xs font-medium"
              >
                {lang === "en" ? condition : condition}
              </span>
            ),
          )}
        </div>
      </div>

      {/* Affiliations & Timings */}
      <div className="p-5 pb-0">
        <h3 className="font-bold text-slate-900 mb-3 flex items-center gap-2">
          <Building2 size={16} className="text-indigo-600" />
          {t("timings_locations")}
        </h3>
        <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden divide-y divide-slate-100">
          {doctor.timings?.map((timing, idx) => (
            <div
              key={idx}
              className="p-4 flex flex-col gap-3 hover:bg-slate-50 transition-colors"
            >
              <div className="flex justify-between items-start">
                <div className="font-bold text-sm text-slate-900">
                  {timing.clinic}
                </div>
                <div className="bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded text-[10px] font-bold">
                  {lang === "en" ? "Active" : "فعال"}
                </div>
              </div>

              <div className="flex flex-wrap gap-2">
                <div className="flex items-center gap-1.5 text-xs text-indigo-700 bg-indigo-50 px-2.5 py-1.5 rounded-md font-medium border border-indigo-100/50">
                  <CalendarIcon size={14} className="opacity-70" />
                  <span>{timing.day}</span>
                </div>
                <div className="flex items-center gap-1.5 text-xs text-sky-700 bg-sky-50 px-2.5 py-1.5 rounded-md font-medium border border-sky-100/50">
                  <Clock size={14} className="opacity-70" />
                  <span dir="ltr">{timing.hours}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* About */}
      <div className="p-5 pb-0">
        <h3 className="font-bold text-slate-900 mb-2">{t("about_doctor")}</h3>
        <p className="text-sm text-slate-600 leading-relaxed bg-white p-4 rounded-xl shadow-sm border border-slate-100 flex flex-col gap-2">
          <span>{doctor.about}</span>
          <span className="font-semibold text-sky-700 mt-2">
            {lang === "en" ? "Professional Philosophy:" : "فلسفه حرفه‌ای:"}
          </span>
          <span className="italic">
            {lang === "en"
              ? '"Providing compassionate and evidence-based care to improve the quality of life for all my patients."'
              : '"ارائه مراقبت‌های دلسوزانه و مبتنی بر شواهد علمی برای بهبود کیفیت زندگی تمام بیمارانم."'}
          </span>
        </p>
      </div>

      {/* Patient Testimonials */}
      <div className="p-5 pb-0">
        <h3 className="font-bold text-slate-900 mb-3 flex items-center gap-2">
          <Star size={16} className="text-amber-500 fill-amber-500" />
          {lang === "en" ? "Patient Testimonials" : "نظرات بیماران"}
        </h3>
        <div className="flex overflow-x-auto gap-4 hide-scrollbar -mx-5 px-5 pb-2">
          {[
            {
              name: "John Doe",
              rating: 5,
              comment:
                lang === "en"
                  ? "Very professional and caring."
                  : "بسیار حرفه‌ای و دلسوز.",
              date: "2 weeks ago",
            },
            {
              name: "Ahmad S.",
              rating: 5,
              comment:
                lang === "en"
                  ? "Listens carefully to all concerns."
                  : "به دقت به صحبت‌های بیمار گوش می‌دهند.",
              date: "1 month ago",
            },
            {
              name: "M. Ali",
              rating: 4,
              comment:
                lang === "en"
                  ? "Great experience, highly recommend."
                  : "تجربه عالی بود، پیشنهاد می‌کنم.",
              date: "3 months ago",
            },
          ].map((review, idx) => (
            <div
              key={idx}
              className="bg-white rounded-xl shadow-sm border border-slate-100 p-4 min-w-[240px] shrink-0"
            >
              <div className="flex justify-between items-start mb-2">
                <div className="font-bold text-sm text-slate-900">
                  {review.name}
                </div>
                <div className="flex gap-0.5">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      size={12}
                      className={
                        i < review.rating
                          ? "fill-amber-400 text-amber-400"
                          : "text-slate-200"
                      }
                    />
                  ))}
                </div>
              </div>
              <p className="text-xs text-slate-600 italic mb-2">
                "{review.comment}"
              </p>
              <div className="text-[10px] text-slate-400">{review.date}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Location (Static Map approach) */}
      <div className="p-5">
        <h3 className="font-bold text-slate-900 mb-2">
          {t("main_clinic_location")}
        </h3>
        <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
          <div className="h-32 bg-slate-200 relative flex items-center justify-center">
            {/* Mocked Static Map Image -> Low Bandwidth */}
            <div className="absolute inset-0 bg-sky-50 opacity-50 pattern-grid"></div>
            <div className="relative bg-white/80 backdrop-blur px-3 py-1.5 rounded-lg border border-slate-200 text-[10px] font-bold text-slate-700 flex items-center gap-1.5 z-10 shadow-sm">
              <MapPin size={12} className="text-rose-500" />
              {lang === "en"
                ? "Map disabled to save data"
                : "جهت ذخیره اینترنت نقشه غیرفعال است"}
            </div>
          </div>
          <div className="p-4">
            <div className="font-bold text-sm text-slate-900">
              {doctor.hospital}
            </div>
            <div className="text-sm text-slate-500 mt-1 flex items-start gap-2">
              <MapPin size={16} className="text-slate-400 shrink-0 mt-0.5" />
              <span>{doctor.location}</span>
            </div>
            <div className="text-sm text-slate-500 mt-2 flex items-start gap-2">
              <CreditCard
                size={16}
                className="text-slate-400 shrink-0 mt-0.5"
              />
              <span>
                {lang === "en" ? "Consultation Fee: " : "فیس معاینه: "}
                <strong className="text-slate-900 text-base">
                  {doctor.fees} AFN
                </strong>
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Floating Action Button */}
      <div className="fixed bottom-0 inset-x-0 p-4 bg-white border-t border-slate-200 z-30 flex gap-3 max-w-[400px] mx-auto pb-safe">
        <div className="flex flex-col justify-center px-4 bg-slate-50 rounded-xl border border-slate-100">
          <span className="text-[10px] text-slate-500 text-center">
            {t("next_appointment")}
          </span>
          <span
            className="text-xs font-bold text-sky-700 whitespace-nowrap pt-0.5"
            dir="ltr"
          >
            {doctor.nextAvailable.split("،")[1]}
          </span>
        </div>
        <button
          onClick={() => onBook(doctor.id)}
          className="flex-1 bg-sky-600 hover:bg-sky-700 active:bg-sky-800 text-white font-bold py-4 rounded-xl shadow-[0_4px_15px_rgba(2,132,199,0.3)] transition-all flex items-center justify-center gap-2"
        >
          <CalendarIcon size={18} />
          {t("book_appointment")}
        </button>
      </div>
    </div>
  );
}
