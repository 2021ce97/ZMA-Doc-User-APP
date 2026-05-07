import React, { useState, useEffect } from "react";
import { HomeScreen } from "./components/patient/HomeScreen";
import { DoctorProfileScreen } from "./components/patient/DoctorProfileScreen";
import { BookingScreen } from "./components/patient/BookingScreen";
import { AIChatScreen } from "./components/patient/AIChatScreen";
import { BottomNav } from "./components/patient/BottomNav";
import { PharmacyScreen } from "./components/patient/PharmacyScreen";
import { ProfileScreen } from "./components/patient/ProfileScreen";
import { SearchScreen } from "./components/patient/SearchScreen";
import { BlogScreen } from "./components/patient/BlogScreen";
import { AppointmentsScreen } from "./components/patient/AppointmentsScreen";
import { useLanguage } from "./contexts/LanguageContext";
import { triggerHaptic } from "./utils/haptics";
import { WifiOff, ShieldCheck } from "lucide-react";

type Screen =
  | { name: "tabs"; tab: string }
  | { name: "doctor_profile"; doctorId: string }
  | { name: "booking"; doctorId: string }
  | { name: "search"; query?: string }
  | { name: "pharmacies" };

export default function App() {
  const [screen, setScreen] = useState<Screen>({ name: "tabs", tab: "home" });
  const [favorites, setFavorites] = useState<string[]>(() => {
    const saved = localStorage.getItem("user_favorites");
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {}
    }
    return [];
  });
  const { t, isRtl, lang } = useLanguage();
  const [isOffline, setIsOffline] = useState(!navigator.onLine);
  const [showOnboarding, setShowOnboarding] = useState(false);

  useEffect(() => {
    localStorage.setItem("user_favorites", JSON.stringify(favorites));
  }, [favorites]);

  useEffect(() => {
    const handleOnline = () => {
      setIsOffline(false);

      // Check for queued bookings
      const queuedBooking = localStorage.getItem("offline_booking");
      if (queuedBooking) {
        localStorage.removeItem("offline_booking");

        const notify = (title: string, body: string) => {
          if (
            "Notification" in window &&
            Notification.permission === "granted"
          ) {
            new Notification(title, { body });
          } else {
            alert(`${title}: ${body}`);
          }
        };

        const title = lang === "en" ? "Booking Completed" : "نوبت ثبت شد";
        const body =
          lang === "en"
            ? "Your queued appointment has been booked successfully."
            : "نوبت در انتظار شما با موفقیت ثبت شد.";
        notify(title, body);

        // Optionally update cached appointments
        try {
          const bookingData = JSON.parse(queuedBooking);
          const saved: any[] = JSON.parse(
            localStorage.getItem("user_appointments") || "[]",
          );

          saved.unshift({
            id: Math.random().toString(),
            doctorName: "داکتر ذخیره شده",
            specialty: "عمومی",
            date: bookingData.date || "۲۰۲۶-۰۵-۰۱",
            time: bookingData.slot || "۱۰:۰۰",
            status: "upcoming",
            hospital: "کلینیک",
            address: "",
            phone: "",
            instructions: "",
          });
          localStorage.setItem("user_appointments", JSON.stringify(saved));
        } catch (e) {}
      }
    };

    const handleOffline = () => setIsOffline(true);
    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    // Check onboarding
    if (!localStorage.getItem("onboarding_complete")) {
      setShowOnboarding(true);
    }

    // Request notification permission early for offline sync notifications
    if (
      "Notification" in window &&
      Notification.permission !== "granted" &&
      Notification.permission !== "denied"
    ) {
      Notification.requestPermission();
    }

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, [lang]);

  const finishOnboarding = () => {
    triggerHaptic("success");
    localStorage.setItem("onboarding_complete", "true");
    setShowOnboarding(false);
  };

  const toggleFavorite = (id: string) => {
    triggerHaptic("medium");
    setFavorites((prev) =>
      prev.includes(id) ? prev.filter((fId) => fId !== id) : [...prev, id],
    );
  };

  // For PWA styling to add padding at the bottom on iPhones without home button
  // handled via Tailwind safelist or simple inline in index.css

  const renderScreen = () => {
    switch (screen.name) {
      case "tabs":
        return (
          <div className="flex flex-col h-full bg-slate-50 dark:bg-slate-900 transition-colors">
            <div className="flex-1 overflow-y-auto hide-scrollbar">
              {screen.tab === "home" && (
                <HomeScreen
                  onNavigate={(name, params) =>
                    setScreen({ name: name as any, ...params })
                  }
                  favorites={favorites}
                  onToggleFavorite={toggleFavorite}
                />
              )}
              {screen.tab === "appointments" && <AppointmentsScreen />}
              {screen.tab === "ai" && <AIChatScreen />}
              {screen.tab === "blog" && <BlogScreen />}
              {screen.tab === "profile" && (
                <ProfileScreen
                  favorites={favorites}
                  onNavigate={(name, params) =>
                    setScreen({ name: name as any, ...params })
                  }
                  onToggleFavorite={toggleFavorite}
                />
              )}
            </div>
            <BottomNav
              activeTab={screen.tab}
              onChangeTab={(tab) => {
                triggerHaptic("light");
                setScreen({ name: "tabs", tab });
              }}
            />
          </div>
        );

      case "doctor_profile":
        return (
          <DoctorProfileScreen
            doctorId={screen.doctorId}
            onBack={() => setScreen({ name: "tabs", tab: "home" })}
            onBook={(id) => setScreen({ name: "booking", doctorId: id })}
            isFavorite={favorites.includes(screen.doctorId)}
            onToggleFavorite={() => toggleFavorite(screen.doctorId)}
          />
        );

      case "booking":
        return (
          <BookingScreen
            doctorId={screen.doctorId}
            onBack={() =>
              setScreen({ name: "doctor_profile", doctorId: screen.doctorId })
            }
            onHome={() => setScreen({ name: "tabs", tab: "home" })}
          />
        );

      case "search":
        return (
          <SearchScreen
            onBack={() => setScreen({ name: "tabs", tab: "home" })}
            onDoctorSelect={(id) =>
              setScreen({ name: "doctor_profile", doctorId: id })
            }
            favorites={favorites}
            onToggleFavorite={toggleFavorite}
          />
        );

      case "pharmacies":
        return (
          <PharmacyScreen
            onBack={() => setScreen({ name: "tabs", tab: "home" })}
          />
        );

      default:
        return <div>Error: Unknown screen</div>;
    }
  };

  return (
    <div className="flex h-screen w-full bg-slate-900 justify-center items-center">
      {/* Mobile Wrapper */}
      <div
        className="w-full max-w-[400px] h-full sm:h-[800px] bg-slate-50 dark:bg-slate-900 sm:rounded-[2.5rem] sm:shadow-2xl overflow-hidden relative flex flex-col font-sans sm:border-[8px] sm:border-slate-800 transition-colors"
        dir={isRtl ? "rtl" : "ltr"}
      >
        {/* Status Bar Mock (Desktop only) */}
        <div
          className="hidden sm:flex bg-slate-900 text-slate-200 text-[10px] px-5 py-1.5 justify-between items-center z-50 shrink-0 font-mono tracking-widest"
          dir="ltr"
        >
          <span>12:00</span>
          <div className="flex items-center gap-1.5 opacity-80">
            <div className="flex gap-[1px]">
              <div className="w-1 h-1.5 bg-white rounded-sm"></div>
              <div className="w-1 h-2 bg-white rounded-sm"></div>
              <div className="w-1 h-2.5 bg-white rounded-sm"></div>
              <div className="w-1 h-3 bg-white/40 rounded-sm"></div>
            </div>
            <span className="font-bold ms-1">3G</span>
            <div className="w-4 h-2.5 rounded-sm border border-white relative flex items-center p-[1px]">
              <div className="w-full h-full bg-white rounded-sm"></div>
              <div className="w-[1px] h-1 bg-white absolute -left-0.5 rounded-l-sm"></div>
            </div>
          </div>
        </div>

        {/* Offline Banner */}
        {isOffline && (
          <div className="bg-rose-500 text-white text-[10px] py-1 px-4 flex items-center justify-center gap-2 font-bold z-50 shrink-0">
            <WifiOff size={12} />
            {t("offline_banner")}
          </div>
        )}

        {/* Main Content Area */}
        <div className="flex-1 w-full relative overflow-hidden bg-white dark:bg-slate-900 transition-colors">
          {renderScreen()}
        </div>

        {/* Onboarding Overlay */}
        {showOnboarding && (
          <div className="absolute inset-0 z-[100] bg-white dark:bg-slate-900 flex flex-col p-6 items-center justify-center text-center">
            <div className="w-24 h-24 bg-sky-100 dark:bg-sky-900/40 rounded-full flex items-center justify-center mb-6">
              <ShieldCheck
                size={48}
                className="text-sky-600 dark:text-sky-400"
              />
            </div>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">
              {t("onboarding_title")}
            </h2>
            <p className="text-slate-600 dark:text-slate-400 text-sm mb-8 leading-relaxed max-w-xs">
              {t("onboarding_desc")}
            </p>
            <button
              onClick={finishOnboarding}
              className="w-full max-w-xs bg-sky-600 hover:bg-sky-700 text-white font-bold py-3.5 rounded-xl transition-colors shadow-sm"
            >
              {t("onboarding_start")}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
