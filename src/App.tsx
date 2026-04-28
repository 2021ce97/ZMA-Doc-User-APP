import React, { useState } from 'react';
import { HomeScreen } from './components/patient/HomeScreen';
import { DoctorProfileScreen } from './components/patient/DoctorProfileScreen';
import { BookingScreen } from './components/patient/BookingScreen';
import { AIChatScreen } from './components/patient/AIChatScreen';
import { BottomNav } from './components/patient/BottomNav';
import { PharmacyScreen } from './components/patient/PharmacyScreen';
import { ProfileScreen } from './components/patient/ProfileScreen';
import { SearchScreen } from './components/patient/SearchScreen';
import { BlogScreen } from './components/patient/BlogScreen';
import { AppointmentsScreen } from './components/patient/AppointmentsScreen';
import { useLanguage } from './contexts/LanguageContext';

type Screen = 
  | { name: 'tabs'; tab: string }
  | { name: 'doctor_profile'; doctorId: string }
  | { name: 'booking'; doctorId: string }
  | { name: 'search'; query?: string }
  | { name: 'pharmacies' };

export default function App() {
  const [screen, setScreen] = useState<Screen>({ name: 'tabs', tab: 'home' });
  const [favorites, setFavorites] = useState<string[]>([]);
  const { isRtl } = useLanguage();

  const toggleFavorite = (id: string) => {
    setFavorites(prev => 
      prev.includes(id) ? prev.filter(fId => fId !== id) : [...prev, id]
    );
  };

  // For PWA styling to add padding at the bottom on iPhones without home button
  // handled via Tailwind safelist or simple inline in index.css

  const renderScreen = () => {
    switch (screen.name) {
      case 'tabs':
        return (
          <div className="flex flex-col h-full bg-slate-50">
            <div className="flex-1 overflow-y-auto hide-scrollbar">
              {screen.tab === 'home' && (
                <HomeScreen 
                  onNavigate={(name, params) => setScreen({ name: name as any, ...params })}
                  favorites={favorites}
                  onToggleFavorite={toggleFavorite}
                />
              )}
              {screen.tab === 'appointments' && <AppointmentsScreen />}
              {screen.tab === 'ai' && <AIChatScreen />}
              {screen.tab === 'blog' && <BlogScreen />}
              {screen.tab === 'profile' && (
                <ProfileScreen 
                  favorites={favorites}
                  onNavigate={(name, params) => setScreen({ name: name as any, ...params })}
                  onToggleFavorite={toggleFavorite}
                />
              )}
            </div>
            <BottomNav 
              activeTab={screen.tab} 
              onChangeTab={(tab) => setScreen({ name: 'tabs', tab })} 
            />
          </div>
        );
      
      case 'doctor_profile':
        return (
          <DoctorProfileScreen 
            doctorId={screen.doctorId} 
            onBack={() => setScreen({ name: 'tabs', tab: 'home' })}
            onBook={(id) => setScreen({ name: 'booking', doctorId: id })}
            isFavorite={favorites.includes(screen.doctorId)}
            onToggleFavorite={() => toggleFavorite(screen.doctorId)}
          />
        );
      
      case 'booking':
        return (
          <BookingScreen 
            doctorId={screen.doctorId}
            onBack={() => setScreen({ name: 'doctor_profile', doctorId: screen.doctorId })}
            onHome={() => setScreen({ name: 'tabs', tab: 'home' })}
          />
        );
      
      case 'search':
        return (
          <SearchScreen 
            onBack={() => setScreen({ name: 'tabs', tab: 'home' })}
            onDoctorSelect={(id) => setScreen({ name: 'doctor_profile', doctorId: id })}
            favorites={favorites}
            onToggleFavorite={toggleFavorite}
          />
        );

      case 'pharmacies':
        return (
          <PharmacyScreen onBack={() => setScreen({ name: 'tabs', tab: 'home' })} />
        );

      default:
        return <div>Error: Unknown screen</div>;
    }
  };

  return (
    <div className="flex h-screen w-full bg-slate-900 justify-center items-center">
      {/* Mobile Wrapper */}
      <div 
        className="w-full max-w-[400px] h-full sm:h-[800px] bg-slate-50 sm:rounded-[2.5rem] sm:shadow-2xl overflow-hidden relative flex flex-col font-sans sm:border-[8px] sm:border-slate-800"
        dir={isRtl ? 'rtl' : 'ltr'}
      >
        {/* Status Bar Mock (Desktop only) */}
        <div className="hidden sm:flex bg-slate-900 text-slate-200 text-[10px] px-5 py-1.5 justify-between items-center z-50 shrink-0 font-mono tracking-widest" dir="ltr">
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
        
        {/* Main Content Area */}
        <div className="flex-1 w-full relative overflow-hidden bg-white">
          {renderScreen()}
        </div>
      </div>
    </div>
  );
}
