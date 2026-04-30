import React, { useState, useEffect } from 'react';
import { Search, ChevronRight, ChevronLeft, MapPin, Star, Clock, Filter, Heart, Navigation, Calendar, Video } from 'lucide-react';
import { DOCTORS } from '../../data/mockData';
import { useLanguage } from '../../contexts/LanguageContext';
import { triggerHaptic } from '../../utils/haptics';

interface SearchScreenProps {
  onBack: () => void;
  onDoctorSelect: (id: string) => void;
  favorites: string[];
  onToggleFavorite: (id: string) => void;
}

export function SearchScreen({ onBack, onDoctorSelect, favorites, onToggleFavorite }: SearchScreenProps) {
  const [query, setQuery] = useState('');
  const { t, isRtl, lang } = useLanguage();
  
  const getTags = () => {
    if (lang === 'en') {
      return ['All', 'Kabul', 'Herat', 'Mazar-e-Sharif', 'Cardiology', 'Pediatrics', 'Blood Pressure', 'Headache', 'Diabetes'];
    }
    return ['همه', 'کابل', 'هرات', 'مزارشریف', 'قلب', 'اطفال', 'فشار خون', 'سردرد', 'دیابت'];
  };
  const tags = getTags();

  const [selectedFilter, setSelectedFilter] = useState(tags[0]);
  const [isLoading, setIsLoading] = useState(true);

  // Advanced filters
  const [useLocation, setUseLocation] = useState(false);
  const [availFilter, setAvailFilter] = useState<'all' | 'today' | 'tomorrow'>('all');
  const [onlineBooking, setOnlineBooking] = useState(false);

  useEffect(() => {
    setIsLoading(true);
    const timer = setTimeout(() => setIsLoading(false), 800);
    return () => clearTimeout(timer);
  }, [query, selectedFilter, useLocation, availFilter, onlineBooking]);

  // Make sure the filter logic maps back to Persian for matching with mock text since the mock data contains Persian texts.
  const mapFilterToPersian = (filter: string) => {
    switch (filter) {
      case 'All': return 'همه';
      case 'Kabul': return 'کابل';
      case 'Herat': return 'هرات';
      case 'Mazar-e-Sharif': return 'مزارشریف';
      case 'Cardiology': return 'قلب';
      case 'Pediatrics': return 'اطفال';
      case 'Blood Pressure': return 'فشار خون';
      case 'Headache': return 'سردرد';
      case 'Diabetes': return 'دیابت';
      default: return filter;
    }
  };

  const normalize = (text: string) => {
    if (!text) return '';
    return text.toLowerCase()
      .replace(/ي/g, 'ی')
      .replace(/ك/g, 'ک')
      .replace(/ؤ/g, 'و')
      .replace(/آ/g, 'ا')
      .replace(/\s+/g, ' ')
      .trim();
  };

  const handleLocationToggle = () => {
    triggerHaptic('medium');
    if (!useLocation) {
      if ('geolocation' in navigator) {
        navigator.geolocation.getCurrentPosition(
          () => setUseLocation(true),
          () => alert('Please allow location access to use this feature.')
        );
      }
    } else {
      setUseLocation(false);
    }
  };

  const results = DOCTORS.filter(d => {
    const rawSearchStr = `${d.name} ${d.specialty} ${d.hospital} ${d.city} ${(d.diseases||[]).join(' ')} ${(d.symptoms||[]).join(' ')} ${(d.skills||[]).join(' ')}`;
    const searchStr = normalize(rawSearchStr);
    const normalizedQuery = normalize(query);
    const matchesQuery = searchStr.includes(normalizedQuery);
    
    let matchesFilter = true;
    if (selectedFilter !== 'همه') {
      matchesFilter = searchStr.includes(normalize(selectedFilter));
    }
    
    // Implement advanced filters
    let advancedMatch = true;
    if (useLocation) advancedMatch = advancedMatch && d.city === 'کابل'; // simulate nearby
    
    if (availFilter === 'today') {
      advancedMatch = advancedMatch && d.nextAvailable.includes('امروز');
    } else if (availFilter === 'tomorrow') {
      advancedMatch = advancedMatch && d.nextAvailable.includes('فردا');
    }

    if (onlineBooking) advancedMatch = advancedMatch && d.onlineBooking === true;

    return matchesQuery && matchesFilter && advancedMatch;
  });

  return (
    <div className="flex flex-col h-full bg-slate-50 dark:bg-slate-900 pb-safe transition-colors">
      {/* Header */}
      <div className="bg-white dark:bg-slate-800 flex items-center justify-between p-4 sticky top-0 z-20 shadow-sm border-b border-slate-200 dark:border-slate-700 transition-colors">
        <button onClick={() => { triggerHaptic('light'); onBack(); }} className="w-10 h-10 flex items-center justify-center rounded-full bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors">
          {isRtl ? <ChevronRight size={24} className="text-slate-700 dark:text-slate-200" /> : <ChevronLeft size={24} className="text-slate-700 dark:text-slate-200" />}
        </button>
        <h1 className="font-bold text-slate-900">{t('advanced_search')}</h1>
        <div className="w-10"></div>
      </div>

      <div className="flex-1 overflow-y-auto hide-scrollbar">
        <div className="bg-white dark:bg-slate-800 p-5 border-b border-slate-100 dark:border-slate-700 shadow-sm transition-colors">
          <div className="relative mb-4">
            <input 
              type="text" 
              autoFocus
              placeholder={t('search_placeholder')}
              className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl py-3 px-4 pe-11 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500 text-slate-900 dark:text-white dark:placeholder-slate-500 transition-colors"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              dir={isRtl ? 'rtl' : 'ltr'}
            />
            <Search size={18} className="absolute end-4 top-3.5 text-slate-400" />
          </div>

          <div className="flex flex-wrap gap-2 mb-4">
             <button 
                onClick={handleLocationToggle}
                className={`py-1.5 px-3 rounded-lg text-xs font-bold transition-colors flex items-center gap-1.5 border ${
                   useLocation ? 'bg-sky-100 dark:bg-sky-900/40 text-sky-700 dark:text-sky-300 border-transparent' : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-600 text-slate-600 dark:text-slate-300'
                }`}
             >
                <Navigation size={12} className={useLocation ? "fill-current" : ""} />
                {t('near_me')}
             </button>
             <div className="flex bg-slate-100 dark:bg-slate-700 p-0.5 rounded-lg border border-slate-200 dark:border-slate-600">
               <button 
                  onClick={() => { triggerHaptic('light'); setAvailFilter(availFilter === 'today' ? 'all' : 'today'); }}
                  className={`py-1 px-3 rounded-md text-xs font-bold transition-colors flex items-center gap-1.5 ${
                     availFilter === 'today' ? 'bg-sky-500 text-white shadow-sm' : 'text-slate-600 dark:text-slate-300'
                  }`}
               >
                  <Calendar size={12} />
                  {t('availability_today') || 'امروز'}
               </button>
               <button 
                  onClick={() => { triggerHaptic('light'); setAvailFilter(availFilter === 'tomorrow' ? 'all' : 'tomorrow'); }}
                  className={`py-1 px-3 rounded-md text-xs font-bold transition-colors flex items-center gap-1.5 ${
                     availFilter === 'tomorrow' ? 'bg-sky-500 text-white shadow-sm' : 'text-slate-600 dark:text-slate-300'
                  }`}
               >
                  <Calendar size={12} />
                  {t('availability_tomorrow') || 'فردا'}
               </button>
             </div>
             <button 
                onClick={() => { triggerHaptic('light'); setOnlineBooking(!onlineBooking); }}
                className={`py-1 px-3 rounded-lg text-xs font-bold transition-colors flex items-center gap-1.5 border relative overflow-hidden ${
                   onlineBooking ? 'bg-indigo-50 dark:bg-indigo-900/40 text-indigo-700 dark:text-indigo-300 border-indigo-200 dark:border-indigo-700' : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-600 text-slate-600 dark:text-slate-300'
                }`}
             >
                <Video size={12} />
                {t('online_booking')}
                {onlineBooking && <span className="absolute bottom-0 right-0 w-2 h-2 bg-indigo-500 rounded-tl-full"></span>}
             </button>
          </div>

          <div className="flex items-center gap-2 overflow-x-auto hide-scrollbar pb-1">
             <div className="p-2 bg-slate-100 dark:bg-slate-700 rounded-lg text-slate-500 dark:text-slate-400 shrink-0">
                <Filter size={16} />
             </div>
             {tags.map(tag => (
               <button 
                 key={tag}
                 onClick={() => { triggerHaptic('light'); setSelectedFilter(tag); }}
                 className={`px-4 py-2 rounded-lg text-xs font-bold whitespace-nowrap transition-colors border ${
                   selectedFilter === tag
                   ? 'bg-slate-800 dark:bg-slate-200 text-white dark:text-slate-900 border-transparent' 
                   : 'bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400'
                 }`}
               >
                 {tag}
               </button>
             ))}
          </div>
        </div>

        <div className="p-4 space-y-3">
          {isLoading ? (
             Array.from({ length: 4 }).map((_, idx) => (
                <div key={idx} className="bg-white dark:bg-slate-800 w-full rounded-2xl p-4 shadow-sm border border-slate-100 dark:border-slate-700 flex flex-col relative animate-pulse transition-colors">
                   <div className="flex gap-3 mb-3">
                     <div className="w-12 h-12 rounded-xl bg-slate-200 dark:bg-slate-700"></div>
                     <div className="flex-1 py-1">
                        <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-1/3 mb-2"></div>
                        <div className="h-3 bg-slate-100 dark:bg-slate-800 rounded w-1/4"></div>
                     </div>
                   </div>
                   <div className="h-3 bg-slate-100 dark:bg-slate-800 rounded w-3/4 mb-3"></div>
                   <div className="flex items-center justify-between border-t border-slate-50 dark:border-slate-700 pt-3 mt-1">
                     <div className="h-5 bg-slate-100 dark:bg-slate-800 rounded w-12"></div>
                     <div className="h-5 bg-slate-100 dark:bg-slate-800 rounded w-20"></div>
                   </div>
                </div>
             ))
          ) : results.length === 0 ? (
            <div className="text-center py-10 text-slate-500 dark:text-slate-400 text-sm">
              {t('no_results')}
            </div>
          ) : (
          results.map(doctor => {
            const isFav = favorites.includes(doctor.id);
            return (
              <button 
                key={doctor.id} 
                onClick={() => { triggerHaptic('light'); onDoctorSelect(doctor.id); }}
                className="bg-white dark:bg-slate-800 w-full rounded-2xl p-4 shadow-sm border border-slate-100 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-sky-500 text-start text-slate-900 dark:text-slate-100 relative transition-colors block"
              >
                <div 
                  className="absolute top-3 start-3 p-1.5 rounded-full bg-slate-50 dark:bg-slate-700 border border-slate-100 dark:border-slate-600 z-10 transition-colors"
                  onClick={(e) => {
                    e.stopPropagation();
                    onToggleFavorite(doctor.id);
                  }}
                >
                  <Heart size={16} className={isFav ? "fill-rose-500 text-rose-500" : "text-slate-400 dark:text-slate-500"} />
                </div>
                <div className="flex gap-3 mb-3">
                  <img src={doctor.avatar} alt={doctor.name} className="w-12 h-12 rounded-xl object-cover bg-slate-100 dark:bg-slate-700" loading="lazy" />
                  <div>
                    <h3 className="font-bold text-sm text-slate-900 dark:text-white">{doctor.name}</h3>
                    <p className="text-[11px] text-sky-600 dark:text-sky-400 font-medium mt-0.5">{doctor.specialty.split('(')[0]}</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400 mb-2">
                  <MapPin size={12} className="text-slate-400" />
                  <span className="truncate">{doctor.hospital} - {doctor.city}</span>
                </div>
                
                <div className="flex items-center justify-between border-t border-slate-50 dark:border-slate-700 pt-3 mt-1 transition-colors">
                  <div className="flex items-center gap-1.5 bg-amber-50 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 px-2 py-1 rounded-md">
                    <Star size={10} className="fill-amber-500 text-amber-500" />
                    <span className="text-[10px] font-bold">{doctor.rating}</span>
                  </div>
                  <div className="flex items-center gap-1.5 bg-sky-50 dark:bg-sky-900/30 text-sky-700 dark:text-sky-400 px-2 py-1 rounded-md">
                    <Clock size={10} className="text-sky-600 dark:text-sky-400" />
                    <span className="text-[10px] font-bold">{doctor.nextAvailable.split('،')[1]}</span>
                  </div>
                </div>
              </button>
            );
          }))}
        </div>
      </div>
    </div>
  );
}
