import React, { useState } from 'react';
import { Search, MapPin, Pill, Star, ChevronRight, ChevronLeft, Filter, Phone, Navigation } from 'lucide-react';
import { PHARMACIES } from '../../data/mockData';
import { useLanguage } from '../../contexts/LanguageContext';
import { triggerHaptic } from '../../utils/haptics';

interface PharmacyScreenProps {
  onBack: () => void;
}

export function PharmacyScreen({ onBack }: PharmacyScreenProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const { isRtl, t, lang } = useLanguage();

  const getFilterCategories = () => {
    if (lang === 'en') {
      return ['All', 'General Medicine', 'Herbal', 'Cosmetics & Hygiene', 'Prescription'];
    }
    return ['همه', 'داروهای عمومی', 'گیاهی', 'آرایشی بهداشتی', 'نسخه داکتر'];
  };
  const filterCategories = getFilterCategories();

  // Maps filtered category back for comparison since mock data `PHARMACIES[].categories` is in Persian.
  const mapCategoryToPersian = (cat: string) => {
    switch (cat) {
      case 'All': return 'همه';
      case 'General Medicine': return 'داروهای عمومی';
      case 'Herbal': return 'گیاهی';
      case 'Cosmetics & Hygiene': return 'آرایشی بهداشتی';
      case 'Prescription': return 'نسخه داکتر';
      default: return cat;
    }
  };

  const filteredPharmacies = PHARMACIES.filter(p => {
    const matchesSearch = p.name.includes(searchQuery) || p.location.includes(searchQuery);
    const mappedSelected = selectedCategory ? mapCategoryToPersian(selectedCategory) : 'همه';
    const matchesCategory = mappedSelected && mappedSelected !== 'همه' 
      ? p.categories.includes(mappedSelected) 
      : true;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="flex flex-col h-full bg-slate-50 dark:bg-slate-900 pb-safe transition-colors">
      {/* App Bar */}
      <div className="bg-white dark:bg-slate-800 flex items-center justify-between p-4 sticky top-0 z-20 shadow-sm border-b border-slate-200 dark:border-slate-700 transition-colors">
        <button onClick={() => { triggerHaptic('light'); onBack(); }} className="w-10 h-10 flex items-center justify-center rounded-full bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors">
           {isRtl ? <ChevronRight size={24} className="text-slate-700 dark:text-slate-200" /> : <ChevronLeft size={24} className="text-slate-700 dark:text-slate-200" />}
        </button>
        <h1 className="font-bold text-slate-900 dark:text-white">{lang === 'en' ? 'Pharmacy Search' : 'جستجوی درملتون (Pharmacy)'}</h1>
        <div className="w-10"></div>
      </div>

      <div className="flex-1 overflow-y-auto">
        {/* Search Header */}
        <div className="bg-white dark:bg-slate-800 p-5 border-b border-slate-100 dark:border-slate-700 shadow-sm transition-colors">
          <div className="relative mb-4">
            <input 
              type="text" 
              placeholder={lang === 'en' ? 'Pharmacy name or area...' : 'نام درملتون یا منطقه...'}
              className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl py-3 px-4 pe-11 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500 text-slate-900 dark:text-white dark:placeholder-slate-500 transition-colors"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              dir={isRtl ? 'rtl' : 'ltr'}
            />
            <Search size={18} className="absolute end-4 top-3.5 text-slate-400" />
          </div>

          <div className="flex items-center gap-2 overflow-x-auto hide-scrollbar pb-1">
             <div className="p-2 bg-slate-100 dark:bg-slate-700 rounded-lg text-slate-500 dark:text-slate-400 shrink-0">
                <Filter size={16} />
             </div>
             {filterCategories.map((cat, idx) => (
               <button 
                 key={cat}
                 onClick={() => { triggerHaptic('light'); setSelectedCategory(cat); }}
                 className={`px-4 py-2 rounded-lg text-xs font-bold whitespace-nowrap transition-colors border ${
                   (selectedCategory === cat) || (!selectedCategory && idx === 0)
                   ? 'bg-slate-800 dark:bg-slate-200 text-white dark:text-slate-900 border-transparent' 
                   : 'bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400'
                 }`}
               >
                 {cat}
               </button>
             ))}
          </div>
        </div>

        {/* Results */}
        <div className="p-4 space-y-4">
           {filteredPharmacies.map(pharmacy => (
             <div key={pharmacy.id} className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700 p-4 shadow-sm flex flex-col gap-3 transition-colors">
                <div className="flex justify-between items-start">
                   <div className="flex items-center gap-3">
                     <div className="w-12 h-12 bg-rose-50 dark:bg-rose-900/30 text-rose-500 dark:text-rose-400 rounded-xl flex items-center justify-center shrink-0">
                        <Pill size={24} />
                     </div>
                     <div>
                       <h3 className="font-bold text-slate-900 dark:text-white text-sm">{pharmacy.name}</h3>
                       <div className="flex items-center gap-1.5 text-[11px] text-slate-500 dark:text-slate-400 mt-1">
                         <Star size={12} className="fill-amber-500 text-amber-500" />
                         <span>{pharmacy.rating}</span>
                         <span className="w-1 h-1 bg-slate-300 dark:bg-slate-600 rounded-full mx-1"></span>
                         <MapPin size={12} />
                         <span>{pharmacy.distance.replace('کیلومتر', lang === 'en' ? 'km' : 'کیلومتر').replace(/[۰-۹]/g, c => lang === 'en' ? String('۰۱۲۳۴۵۶۷۸۹'.indexOf(c)) : c)}</span>
                       </div>
                     </div>
                   </div>
                   {pharmacy.isOpen ? (
                     <div className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-900/30 px-2 py-1 rounded">{lang === 'en' ? 'Open' : 'باز است'}</div>
                   ) : (
                     <div className="text-[10px] font-bold text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-900/30 px-2 py-1 rounded">{lang === 'en' ? 'Closed' : 'بسته است'}</div>
                   )}
                </div>

                <div className="flex gap-2 text-xs text-slate-500 dark:text-slate-400 items-start mt-1">
                   <MapPin size={14} className="mt-0.5 shrink-0" />
                   <span>{pharmacy.location}</span>
                </div>

                <div className="flex flex-wrap gap-1 mt-1">
                  {pharmacy.categories.map((cat, i) => {
                    const dict: Record<string, string> = { 'داروهای عمومی': 'General Medicine', 'نسخه داکتر': 'Prescription', 'لوازم بهداشتی': 'Hygiene Supplies', 'داروهای تخصصی': 'Specialized', 'گیاهی': 'Herbal', 'شیر خشک': 'Baby Formula', 'عمومی': 'General', 'آرایشی بهداشتی': 'Cosmetics' };
                    return (
                      <span key={i} className="text-[10px] bg-slate-50 dark:bg-slate-700 border border-slate-100 dark:border-slate-600 text-slate-600 dark:text-slate-300 px-2 py-0.5 rounded-md transition-colors">
                        {lang === 'en' && dict[cat] ? dict[cat] : cat}
                      </span>
                    );
                  })}
                  {pharmacy.delivery && (
                    <span className="text-[10px] bg-sky-50 dark:bg-sky-900/30 border border-sky-100 dark:border-sky-800 text-sky-700 dark:text-sky-400 px-2 py-0.5 rounded-md font-medium transition-colors">
                      {lang === 'en' ? 'Delivery' : 'ارسال دارو (Delivery)'}
                    </span>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-2 mt-2 pt-3 border-t border-slate-50 dark:border-slate-700/50">
                   <button className="flex items-center justify-center gap-2 py-2 rounded-lg border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 text-xs font-bold hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors active:scale-95">
                     <Phone size={14} />
                     {lang === 'en' ? 'Call' : 'تماس'}
                   </button>
                   <button className="flex items-center justify-center gap-2 py-2 rounded-lg bg-sky-50 dark:bg-sky-900/30 text-sky-700 dark:text-sky-400 text-xs font-bold hover:bg-sky-100 dark:hover:bg-sky-900/50 transition-colors active:scale-95">
                     <Navigation size={14} />
                     {lang === 'en' ? 'Directions' : 'مسیریابی'}
                   </button>
                </div>
             </div>
           ))}
           
           {filteredPharmacies.length === 0 && (
             <div className="text-center py-10 text-slate-500 dark:text-slate-400 text-sm">
               {t('no_results')}
             </div>
           )}
        </div>
      </div>
    </div>
  );
}
