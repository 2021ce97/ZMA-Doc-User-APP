import React, { useState } from 'react';
import { Search, ChevronRight, MapPin, Star, Clock, Filter, Heart } from 'lucide-react';
import { DOCTORS } from '../../data/mockData';

interface SearchScreenProps {
  onBack: () => void;
  onDoctorSelect: (id: string) => void;
  favorites: string[];
  onToggleFavorite: (id: string) => void;
}

export function SearchScreen({ onBack, onDoctorSelect, favorites, onToggleFavorite }: SearchScreenProps) {
  const [query, setQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('همه');

  const tags = ['همه', 'کابل', 'هرات', 'مزارشریف', 'قلب', 'اطفال', 'فشار خون', 'سردرد', 'دیابت'];

  const results = DOCTORS.filter(d => {
    const searchStr = `${d.name} ${d.specialty} ${d.hospital} ${d.city} ${(d.diseases||[]).join(' ')} ${(d.symptoms||[]).join(' ')}`.toLowerCase();
    const matchesQuery = searchStr.includes(query.toLowerCase());
    
    let matchesFilter = true;
    if (selectedFilter !== 'همه') {
      matchesFilter = searchStr.includes(selectedFilter.toLowerCase());
    }

    return matchesQuery && matchesFilter;
  });

  return (
    <div className="flex flex-col h-full bg-slate-50 pb-safe">
      {/* Header */}
      <div className="bg-white flex items-center justify-between p-4 sticky top-0 z-20 shadow-sm border-b border-slate-200">
        <button onClick={onBack} className="w-10 h-10 flex items-center justify-center rounded-full bg-slate-100 hover:bg-slate-200">
          <ChevronRight size={24} className="text-slate-700" />
        </button>
        <h1 className="font-bold text-slate-900">جستجوی پیشرفته</h1>
        <div className="w-10"></div>
      </div>

      <div className="flex-1 overflow-y-auto">
        <div className="bg-white p-5 border-b border-slate-100 shadow-sm">
          <div className="relative mb-4">
            <input 
              type="text" 
              autoFocus
              placeholder="جستجوی داکتر، شهر، بیماری یا علایم..."
              className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 px-4 pe-11 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
            <Search size={18} className="absolute end-4 top-3.5 text-slate-400" />
          </div>

          <div className="flex items-center gap-2 overflow-x-auto hide-scrollbar pb-1">
             <div className="p-2 bg-slate-100 rounded-lg text-slate-500 shrink-0">
                <Filter size={16} />
             </div>
             {tags.map(tag => (
               <button 
                 key={tag}
                 onClick={() => setSelectedFilter(tag)}
                 className={`px-4 py-2 rounded-lg text-xs font-bold whitespace-nowrap transition-colors ${
                   selectedFilter === tag
                   ? 'bg-sky-600 text-white' 
                   : 'bg-slate-50 border border-slate-200 text-slate-600'
                 }`}
               >
                 {tag}
               </button>
             ))}
          </div>
        </div>

        <div className="p-4 space-y-3">
          {results.length === 0 && (
            <div className="text-center py-10 text-slate-500 text-sm">
              نتیجه‌ای یافت نشد.
            </div>
          )}
          {results.map(doctor => {
            const isFav = favorites.includes(doctor.id);
            return (
              <button 
                key={doctor.id} 
                onClick={() => onDoctorSelect(doctor.id)}
                className="bg-white w-full rounded-2xl p-4 shadow-sm border border-slate-100 focus:outline-none focus:ring-2 focus:ring-sky-500 text-start text-slate-900 relative"
              >
                <div 
                  className="absolute top-3 start-3 p-1.5 rounded-full bg-slate-50 border border-slate-100 z-10"
                  onClick={(e) => {
                    e.stopPropagation();
                    onToggleFavorite(doctor.id);
                  }}
                >
                  <Heart size={16} className={isFav ? "fill-rose-500 text-rose-500" : "text-slate-400"} />
                </div>
                <div className="flex gap-3 mb-3">
                  <img src={doctor.avatar} alt={doctor.name} className="w-12 h-12 rounded-xl object-cover bg-slate-100" loading="lazy" />
                  <div>
                    <h3 className="font-bold text-sm text-slate-900">{doctor.name}</h3>
                    <p className="text-[11px] text-sky-600 font-medium mt-0.5">{doctor.specialty.split('(')[0]}</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-1.5 text-xs text-slate-500 mb-2">
                  <MapPin size={12} className="text-slate-400" />
                  <span className="truncate">{doctor.hospital} - {doctor.city}</span>
                </div>
                
                <div className="flex items-center justify-between border-t border-slate-50 pt-3 mt-1">
                  <div className="flex items-center gap-1.5 bg-amber-50 text-amber-700 px-2 py-1 rounded-md">
                    <Star size={10} className="fill-amber-500 text-amber-500" />
                    <span className="text-[10px] font-bold">{doctor.rating}</span>
                  </div>
                  <div className="flex items-center gap-1.5 bg-sky-50 text-sky-700 px-2 py-1 rounded-md">
                    <Clock size={10} />
                    <span className="text-[10px] font-bold">{doctor.nextAvailable.split('،')[0]}</span>
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
