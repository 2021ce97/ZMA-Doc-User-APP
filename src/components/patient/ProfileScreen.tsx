import React, { useState } from "react";
import {
  User,
  Settings,
  Heart,
  Bell,
  Shield,
  ChevronRight,
  LogOut,
  FileText,
  ChevronLeft,
  MapPin,
  Star,
  Clock,
  Globe,
  Moon,
  MessageSquare,
  X,
} from "lucide-react";
import { DOCTORS } from "../../data/mockData";
import { useLanguage } from "../../contexts/LanguageContext";
import { useTheme } from "../../contexts/ThemeContext";
import { triggerHaptic } from "../../utils/haptics";

interface ProfileScreenProps {
  favorites: string[];
  onNavigate: (screen: string, params?: any) => void;
  onToggleFavorite: (id: string) => void;
}

export function ProfileScreen({
  favorites,
  onNavigate,
  onToggleFavorite,
}: ProfileScreenProps) {
  const { t, lang, setLang, isRtl } = useLanguage();
  const { theme, toggleTheme } = useTheme();
  const favoriteDoctors = DOCTORS.filter((d) => favorites.includes(d.id));
  const [showLangMenu, setShowLangMenu] = useState(false);
  const [showNotifMenu, setShowNotifMenu] = useState(false);
  const [showFeedbackModal, setShowFeedbackModal] = useState(false);
  const [feedbackText, setFeedbackText] = useState("");
  const [rating, setRating] = useState(0);
  const [notifSettings, setNotifSettings] = useState({
    appointments: true,
    blog: false,
    ai: true,
  });

  const submitFeedback = () => {
    triggerHaptic("success");
    console.log("Submitted log:", { feedbackText, rating });
    setShowFeedbackModal(false);
    setFeedbackText("");
    setRating(0);
    // In a real app we would POST this to /api/feedback
    alert(
      isRtl
        ? "بازخورد شما با موفقیت ارسال شد!"
        : "Feedback submitted successfully!",
    );
  };

  return (
    <div className="flex flex-col h-full bg-slate-50 dark:bg-slate-900 pb-safe transition-colors">
      <div className="bg-sky-600 dark:bg-slate-800 pt-10 pb-20 px-5 relative overflow-hidden shrink-0 transition-colors">
        <div className="absolute end-0 top-0 w-32 h-32 bg-white/10 rounded-full translate-x-12 -translate-y-8 blur-2xl"></div>
        <h1 className="text-xl font-bold text-white text-center">
          {t("profile")}
        </h1>
      </div>

      <div className="flex-1 overflow-y-auto px-4 -mt-14 relative z-10 hide-scrollbar pb-10">
        {/* Profile Card */}
        <div className="bg-white dark:bg-slate-800 p-5 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700 flex items-center gap-4 mb-6 transition-colors">
          <div className="w-16 h-16 bg-sky-100 dark:bg-slate-700 rounded-full flex items-center justify-center border-4 border-white dark:border-slate-800 shadow-sm shrink-0 transition-colors">
            <User size={32} className="text-sky-600 dark:text-sky-400" />
          </div>
          <div className="flex-1 text-start">
            <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100">
              احمد جواد
            </h2>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              ۰۷۹ ۱۲۳ ۴۵۶۷
            </p>
          </div>
          <button className="w-10 h-10 bg-slate-50 dark:bg-slate-700 rounded-full flex items-center justify-center text-slate-400 dark:text-slate-300">
            <Settings size={20} />
          </button>
        </div>

        {/* Favorites Section */}
        <div className="mb-6">
          <h3 className="font-bold text-slate-800 dark:text-slate-200 mb-3 flex items-center gap-2 px-1 text-start">
            <Heart size={18} className="text-rose-500 fill-rose-500" />
            {t("favorite_doctors")}
          </h3>

          {favoriteDoctors.length === 0 ? (
            <div className="bg-white dark:bg-slate-800 rounded-3xl p-8 text-center shadow-sm border border-slate-100 dark:border-slate-700 flex flex-col items-center justify-center gap-4 relative overflow-hidden transition-colors">
              <div className="absolute top-0 end-0 w-32 h-32 bg-sky-50 dark:bg-sky-900/20 rounded-full translate-x-12 -translate-y-12 blur-2xl"></div>
              <div className="absolute bottom-0 start-0 w-24 h-24 bg-rose-50 dark:bg-rose-900/20 rounded-full -translate-x-8 translate-y-8 blur-2xl"></div>

              <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-rose-100 to-sky-100 dark:from-slate-700 dark:to-slate-600 flex items-center justify-center border-4 border-white dark:border-slate-800 shadow-sm z-10 animate-bounce">
                <Heart
                  size={28}
                  className="text-rose-400 dark:text-rose-300 fill-rose-200 dark:fill-rose-400"
                />
              </div>
              <div className="z-10">
                <h4 className="font-bold text-slate-800 dark:text-slate-200 text-base mb-1">
                  {t("no_favorites")}
                </h4>
                <p className="text-xs text-slate-500 dark:text-slate-400 max-w-[220px] leading-relaxed mx-auto">
                  {t("favorites_desc")}
                </p>
              </div>
              <button
                onClick={() => onNavigate("search")}
                className="mt-2 text-sm font-bold text-white bg-sky-600 hover:bg-sky-700 dark:bg-sky-500 dark:hover:bg-sky-600 transition-colors px-6 py-2.5 rounded-xl shadow-sm z-10 flex items-center gap-2"
              >
                {t("search_doctor")}
              </button>
            </div>
          ) : (
            <div className="flex overflow-x-auto gap-4 pb-2 snap-x hide-scrollbar">
              {favoriteDoctors.map((doctor) => (
                <button
                  key={doctor.id}
                  onClick={() =>
                    onNavigate("doctor_profile", { doctorId: doctor.id })
                  }
                  className="bg-white dark:bg-slate-800 rounded-2xl p-4 min-w-[240px] shadow-sm border border-slate-100 dark:border-slate-700 snap-center focus:outline-none focus:ring-2 focus:ring-sky-500 text-start text-slate-900 dark:text-slate-100 relative transition-colors"
                >
                  <div
                    className="absolute top-3 start-3 p-1.5 rounded-full bg-slate-50 dark:bg-slate-700 border border-slate-100 dark:border-slate-600 z-10"
                    onClick={(e) => {
                      e.stopPropagation();
                      onToggleFavorite(doctor.id);
                    }}
                  >
                    <Heart size={16} className="fill-rose-500 text-rose-500" />
                  </div>
                  <div className="flex gap-3 mb-3">
                    <img
                      src={doctor.avatar}
                      alt={doctor.name}
                      className="w-12 h-12 rounded-xl object-cover bg-slate-100 dark:bg-slate-700"
                      loading="lazy"
                    />
                    <div>
                      <h3 className="font-bold text-sm text-slate-900 dark:text-slate-100">
                        {doctor.name}
                      </h3>
                      <p className="text-[11px] text-sky-600 dark:text-sky-400 font-medium mt-0.5">
                        {doctor.specialty.split("(")[0]}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400 mb-2">
                    <MapPin size={12} className="text-slate-400" />
                    <span className="truncate">{doctor.hospital}</span>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Menu List */}
        <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700 overflow-hidden mb-6 flex flex-col transition-colors">
          <MenuRow
            icon={<FileText />}
            color="text-blue-500"
            bg="bg-blue-50 dark:bg-blue-900/30"
            title={t("medical_records")}
            isRtl={isRtl}
          />

          {/* Dark Mode Toggle */}
          <div className="relative border-b border-slate-50 dark:border-slate-700">
            <div
              className="w-full flex items-center justify-between p-4 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors cursor-pointer"
              onClick={toggleTheme}
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-purple-50 dark:bg-purple-900/30 text-purple-500 dark:text-purple-400">
                  <Moon size={20} />
                </div>
                <span className="font-medium text-slate-700 dark:text-slate-200 text-sm">
                  {t("dark_mode")}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <ToggleSwitch
                  checked={theme === "dark"}
                  onChange={toggleTheme}
                />
              </div>
            </div>
          </div>

          {/* Language Toggle */}
          <div className="relative border-b border-slate-50 dark:border-slate-700">
            <button
              className="w-full flex items-center justify-between p-4 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
              onClick={() => {
                triggerHaptic("light");
                setShowLangMenu(!showLangMenu);
              }}
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-indigo-50 dark:bg-indigo-900/30 text-indigo-500">
                  <Globe size={20} />
                </div>
                <span className="font-medium text-slate-700 dark:text-slate-200 text-sm">
                  {t("language")}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs text-slate-400 font-bold uppercase">
                  {lang}
                </span>
                {isRtl ? (
                  <ChevronLeft size={18} className="text-slate-300" />
                ) : (
                  <ChevronRight size={18} className="text-slate-300" />
                )}
              </div>
            </button>
            {showLangMenu && (
              <div className="bg-slate-50 dark:bg-slate-900/50 p-2 flex flex-col gap-1 border-t border-slate-100 dark:border-slate-700">
                <button
                  onClick={() => {
                    triggerHaptic("light");
                    setLang("da");
                    setShowLangMenu(false);
                  }}
                  className={`p-2 text-sm text-start rounded-md ${lang === "da" ? "bg-sky-100 dark:bg-sky-900/40 text-sky-700 dark:text-sky-300 font-bold" : "text-slate-600 dark:text-slate-400"}`}
                >
                  دری (Dari)
                </button>
                <button
                  onClick={() => {
                    triggerHaptic("light");
                    setLang("ps");
                    setShowLangMenu(false);
                  }}
                  className={`p-2 text-sm text-start rounded-md ${lang === "ps" ? "bg-sky-100 dark:bg-sky-900/40 text-sky-700 dark:text-sky-300 font-bold" : "text-slate-600 dark:text-slate-400"}`}
                >
                  پښتو (Pashto)
                </button>
                <button
                  onClick={() => {
                    triggerHaptic("light");
                    setLang("en");
                    setShowLangMenu(false);
                  }}
                  className={`p-2 text-sm text-start rounded-md ${lang === "en" ? "bg-sky-100 dark:bg-sky-900/40 text-sky-700 dark:text-sky-300 font-bold" : "text-slate-600 dark:text-slate-400"}`}
                >
                  English
                </button>
              </div>
            )}
          </div>

          {/* Notification Settings Toggle */}
          <div className="relative border-b border-slate-50 dark:border-slate-700">
            <button
              className="w-full flex items-center justify-between p-4 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
              onClick={() => {
                triggerHaptic("light");
                setShowNotifMenu(!showNotifMenu);
              }}
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-amber-50 dark:bg-amber-900/30 text-amber-500">
                  <Bell size={20} />
                </div>
                <span className="font-medium text-slate-700 dark:text-slate-200 text-sm">
                  {t("notifications")}
                </span>
              </div>
              <div className="flex items-center gap-2">
                {isRtl ? (
                  <ChevronLeft
                    size={18}
                    className={`text-slate-300 transition-transform ${showNotifMenu ? "-rotate-90" : ""}`}
                  />
                ) : (
                  <ChevronRight
                    size={18}
                    className={`text-slate-300 transition-transform ${showNotifMenu ? "rotate-90" : ""}`}
                  />
                )}
              </div>
            </button>
            {showNotifMenu && (
              <div className="bg-slate-50 dark:bg-slate-900/50 p-4 flex flex-col gap-4 border-t border-slate-100 dark:border-slate-700">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                    {t("reminder_settings")}
                  </span>
                  <ToggleSwitch
                    checked={notifSettings.appointments}
                    onChange={() => {
                      triggerHaptic("light");
                      setNotifSettings((p) => ({
                        ...p,
                        appointments: !p.appointments,
                      }));
                    }}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                    {t("blog_settings")}
                  </span>
                  <ToggleSwitch
                    checked={notifSettings.blog}
                    onChange={() => {
                      triggerHaptic("light");
                      setNotifSettings((p) => ({ ...p, blog: !p.blog }));
                    }}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                    {t("ai_settings")}
                  </span>
                  <ToggleSwitch
                    checked={notifSettings.ai}
                    onChange={() => {
                      triggerHaptic("light");
                      setNotifSettings((p) => ({ ...p, ai: !p.ai }));
                    }}
                  />
                </div>
              </div>
            )}
          </div>

          <button
            className="w-full flex items-center justify-between p-4 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors border-b border-slate-50 dark:border-slate-700"
            onClick={() => {
              triggerHaptic("light");
              setShowFeedbackModal(true);
            }}
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-teal-50 dark:bg-teal-900/30 text-teal-500">
                <MessageSquare size={20} />
              </div>
              <span className="font-medium text-slate-700 dark:text-slate-200 text-sm">
                ارسال بازخورد (Feedback)
              </span>
            </div>
            {isRtl ? (
              <ChevronLeft size={18} className="text-slate-300" />
            ) : (
              <ChevronRight size={18} className="text-slate-300" />
            )}
          </button>

          <MenuRow
            icon={<Shield />}
            color="text-emerald-500"
            bg="bg-emerald-50 dark:bg-emerald-900/30"
            title={t("privacy_security")}
            isRtl={isRtl}
          />
          <MenuRow
            icon={<LogOut />}
            color="text-slate-400 dark:text-slate-500"
            bg="bg-slate-50 dark:bg-slate-800"
            title={t("logout")}
            last
            isRtl={isRtl}
          />
        </div>
      </div>

      {showFeedbackModal && (
        <div className="absolute inset-0 z-50 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-800 w-full max-w-sm p-6 rounded-3xl shadow-xl">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-bold text-slate-900 dark:text-white">
                ارسال بازخورد
              </h3>
              <button
                onClick={() => setShowFeedbackModal(false)}
                className="text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700 p-1.5 rounded-full"
              >
                <X size={20} />
              </button>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-4">
              لطفا نظر، باگ یا پیشنهاد خود را وارد کنید.
            </p>

            <div className="flex justify-center gap-2 mb-4">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  onClick={() => {
                    triggerHaptic("light");
                    setRating(star);
                  }}
                  className="focus:outline-none"
                >
                  <Star
                    size={28}
                    className={
                      star <= rating
                        ? "fill-amber-400 text-amber-400"
                        : "text-slate-300 dark:text-slate-600"
                    }
                  />
                </button>
              ))}
            </div>

            <textarea
              value={feedbackText}
              onChange={(e) => setFeedbackText(e.target.value)}
              className="w-full h-32 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl p-3 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500 dark:text-white mb-4"
              placeholder="اینجا بنویسید..."
            />
            <button
              onClick={submitFeedback}
              disabled={!feedbackText.trim() && rating === 0}
              className="w-full bg-sky-600 hover:bg-sky-700 disabled:opacity-50 disabled:bg-slate-400 text-white font-bold py-3 rounded-xl transition-colors"
            >
              ارسال
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

function MenuRow({ icon, color, bg, title, last = false, isRtl }: any) {
  return (
    <button
      className={`w-full flex items-center justify-between p-4 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors ${!last ? "border-b border-slate-50 dark:border-slate-700" : ""}`}
    >
      <div className="flex items-center gap-3">
        <div
          className={`w-10 h-10 rounded-xl flex items-center justify-center ${bg} ${color}`}
        >
          {icon}
        </div>
        <span className="font-medium text-slate-700 dark:text-slate-200 text-sm">
          {title}
        </span>
      </div>
      {isRtl ? (
        <ChevronLeft size={18} className="text-slate-300" />
      ) : (
        <ChevronRight size={18} className="text-slate-300" />
      )}
    </button>
  );
}

function ToggleSwitch({
  checked,
  onChange,
}: {
  checked: boolean;
  onChange: () => void;
}) {
  return (
    <button
      onClick={onChange}
      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${checked ? "bg-sky-500" : "bg-slate-200 dark:bg-slate-600"}`}
    >
      <span
        className={`inline-block w-4 h-4 transform bg-white rounded-full transition-transform ${checked ? "translate-x-6 rtl:-translate-x-6" : "translate-x-1 rtl:-translate-x-1"}`}
      />
    </button>
  );
}
