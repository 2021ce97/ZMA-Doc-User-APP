import React, { useState } from 'react';
import { Search, MapPin, Pill, Star, ChevronRight, Filter, Clock, Phone, Navigation } from 'lucide-react';
import { PHARMACIES } from '../../data/mockData';

interface PharmacyScreenProps {
  onBack: () => void;
}

export function PharmacyScreen({ onBack }: PharmacyScreenProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const filterCategories = ['همه', 'داروهای عمومی', 'گیاهی', 'آرایشی بهداشتی', 'نسخه داکتر'];

  const filteredPharmacies = PHARMACIES.filter(p => {
    const matchesSearch = p.name.includes(searchQuery) || p.location.includes(searchQuery);
    const matchesCategory = selectedCategory && selectedCategory !== 'همه' 
      ? p.categories.includes(selectedCategory) 
      : true;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="flex flex-col h-full bg-slate-50 pb-safe">
      {/* App Bar */}
      <div className="bg-white flex items-center justify-between p-4 sticky top-0 z-20 shadow-sm border-b border-slate-200">
        <button onClick={onBack} className="w-10 h-10 flex items-center justify-center rounded-full bg-slate-100 hover:bg-slate-200">
           <ChevronRight size={24} className="text-slate-700" />
        </button>
        <h1 className="font-bold text-slate-900">جستجوی درملتون (Pharmacy)</h1>
        <div className="w-10"></div>
      </div>

      <div className="flex-1 overflow-y-auto">
        {/* Search Header */}
        <div className="bg-white p-5 border-b border-slate-100 shadow-sm">
          <div className="relative mb-4">
            <input 
              type="text" 
              placeholder="نام درملتون یا منطقه..."
              className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 px-4 pe-11 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <Search size={18} className="absolute end-4 top-3.5 text-slate-400" />
          </div>

          <div className="flex items-center gap-2 overflow-x-auto hide-scrollbar pb-1">
             <div className="p-2 bg-slate-100 rounded-lg text-slate-500 shrink-0">
                <Filter size={16} />
             </div>
             {filterCategories.map(cat => (
               <button 
                 key={cat}
                 onClick={() => setSelectedCategory(cat)}
                 className={`px-4 py-2 rounded-lg text-xs font-bold whitespace-nowrap transition-colors ${
                   (selectedCategory === cat) || (!selectedCategory && cat === 'همه')
                   ? 'bg-sky-600 text-white' 
                   : 'bg-slate-50 border border-slate-200 text-slate-600'
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
             <div key={pharmacy.id} className="bg-white rounded-2xl border border-slate-100 p-4 shadow-sm flex flex-col gap-3">
                <div className="flex justify-between items-start">
                   <div className="flex items-center gap-3">
                     <div className="w-12 h-12 bg-rose-50 text-rose-500 rounded-xl flex items-center justify-center shrink-0">
                        <Pill size={24} />
                     </div>
                     <div>
                       <h3 className="font-bold text-slate-900">{pharmacy.name}</h3>
                       <div className="flex items-center gap-1.5 text-[11px] text-slate-500 mt-1">
                         <Star size={12} className="fill-amber-500 text-amber-500" />
                         <span>{pharmacy.rating}</span>
                         <span className="w-1 h-1 bg-slate-300 rounded-full mx-1"></span>
                         <MapPin size={12} />
                         <span>{pharmacy.distance}</span>
                       </div>
                     </div>
                   </div>
                   {pharmacy.isOpen ? (
                     <div className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded">باز است</div>
                   ) : (
                     <div className="text-[10px] font-bold text-rose-600 bg-rose-50 px-2 py-1 rounded">بسته است</div>
                   )}
                </div>

                <div className="flex gap-2 text-xs text-slate-500 items-start mt-1">
                   <MapPin size={14} className="mt-0.5 shrink-0" />
                   <span>{pharmacy.location}</span>
                </div>

                <div className="flex flex-wrap gap-1 mt-1">
                  {pharmacy.categories.map((cat, i) => (
                    <span key={i} className="text-[10px] bg-slate-50 border border-slate-100 text-slate-600 px-2 py-0.5 rounded-md">
                      {cat}
                    </span>
                  ))}
                  {pharmacy.delivery && (
                    <span className="text-[10px] bg-sky-50 border border-sky-100 text-sky-700 px-2 py-0.5 rounded-md font-medium">
                      ارسال دارو (Delivery)
                    </span>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-2 mt-2 pt-3 border-t border-slate-50">
                   <button className="flex items-center justify-center gap-2 py-2 rounded-lg border border-slate-200 text-slate-700 text-xs font-bold hover:bg-slate-50 transition-colors">
                     <Phone size={14} />
                     تماس
                   </button>
                   <button className="flex items-center justify-center gap-2 py-2 rounded-lg bg-sky-50 text-sky-700 text-xs font-bold hover:bg-sky-100 transition-colors">
                     <Navigation size={14} />
                     مسیریابی
                   </button>
                </div>
             </div>
           ))}
           
           {filteredPharmacies.length === 0 && (
             <div className="text-center py-10 text-slate-500 text-sm">
               درملتونی با این مشخصات یافت نشد.
             </div>
           )}
        </div>
      </div>
    </div>
  );
}
