import React, { useState, useMemo, useEffect } from 'react';
import { Calendar, Clock, ChevronLeft, ChevronRight, X, CalendarCheck, CalendarX2 } from 'lucide-react';
import { useLanguage } from '../../contexts/LanguageContext';

export function AppointmentsScreen() {
  const { t, isRtl, lang } = useLanguage();
  const [selectedStatus, setSelectedStatus] = useState<'upcoming' | 'completed' | 'cancelled'>('upcoming');
  const [dateRange, setDateRange] = useState<'all' | 'this_week' | 'this_month' | 'custom'>('all');
  const [customRange, setCustomRange] = useState({ start: '', end: '' });
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedAppId, setExpandedAppId] = useState<string | null>(null);

  // Custom Calendar State
  const [currentMonth, setCurrentMonth] = useState(new Date());
  
  const getDaysInMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  };
  
  const getFirstDayOfMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
  };
  
  const handleDayClick = (day: number) => {
    const dStr = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day, 12).toISOString().split('T')[0];
    
    if (!customRange.start || (customRange.start && customRange.end)) {
      setCustomRange({ start: dStr, end: '' });
    } else {
      if (new Date(dStr) < new Date(customRange.start)) {
        setCustomRange({ start: dStr, end: customRange.start });
      } else {
        setCustomRange(p => ({ ...p, end: dStr }));
      }
    }
  };
  
  const isSelectedDate = (day: number) => {
    const dStr = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day, 12).toISOString().split('T')[0];
    return dStr === customRange.start || dStr === customRange.end;
  };
  
  const isInRange = (day: number) => {
    if (!customRange.start || !customRange.end) return false;
    const dStr = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day, 12).toISOString().split('T')[0];
    return dStr > customRange.start && dStr < customRange.end;
  };

  const nextMonth = () => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1));
  const prevMonth = () => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1));

  const [appointments, setAppointments] = useState(() => {
    const saved = localStorage.getItem('user_appointments');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch(e) {}
    }
    return [
      {
        id: '1',
        doctorName: 'احمد جواد',
        specialty: 'متخصص قلب',
        date: '۲۰۲۶-۰۴-۳۰',
        time: '۱۰:۰۰ صبح',
        status: 'upcoming',
        hospital: 'شفاخانه بین‌المللی کابل',
        address: 'سرک دارالامان، کابل، افغانستان',
        phone: '۰۷۸۱۲۳۴۵۶۷',
        instructions: 'لطفاً ۱۵ دقیقه قبل از زمان تعیین شده در شفاخانه حاضر باشید. سوابق پزشکی و نسخه قبلی خود را به همراه داشته باشید.'
      },
      {
        id: '2',
        doctorName: 'داکتر مریم',
        specialty: 'متخصص اطفال',
        date: '۲۰۲۶-۰۴-۱۵',
        time: '۲:۳۰ عصر',
        status: 'completed',
        hospital: 'کلینیک اطفال شهر نو',
        address: 'شهر نو، چهارراهی انصاری، کابل',
        phone: '۰۷۹۹۸۷۶۵۴۳',
        instructions: 'کارت واکسیناسیون طفل را حتما با خود بیاورید.'
      },
      {
        id: '3',
        doctorName: 'داکتر نجیب',
        specialty: 'متخصص اعصاب',
        date: '۲۰۲۶-۰۴-۰۵',
        time: '۹:۰۰ صبح',
        status: 'cancelled',
        hospital: 'شفاخانه حوزوی',
        address: 'ناحیه اول، هرات، افغانستان',
        phone: '۰۷۰۱۱۲۲۳۳۴',
        instructions: ''
      }
    ];
  });

  useEffect(() => {
    localStorage.setItem('user_appointments', JSON.stringify(appointments));
  }, [appointments]);

  const translateData = (val: string) => {
    if (lang !== 'en') return val;
    const dict: Record<string, string> = {
      'احمد جواد': 'Ahmad Javad',
      'متخصص قلب': 'Cardiologist',
      'شفاخانه بین‌المللی کابل': 'Kabul International Hospital',
      'سرک دارالامان، کابل، افغانستان': 'Darullaman Rd, Kabul, Afghanistan',
      'لطفاً ۱۵ دقیقه قبل از زمان تعیین شده در شفاخانه حاضر باشید. سوابق پزشکی و نسخه قبلی خود را به همراه داشته باشید.': 'Please arrive 15 minutes early. Bring your medical records.',
      'داکتر مریم': 'Dr. Maryam',
      'متخصص اطفال': 'Pediatrician',
      'کلینیک اطفال شهر نو': 'Shahr-e-Naw Pediatric Clinic',
      'شهر نو، چهارراهی انصاری، کابل': 'Ansari Square, Shahr-e-Naw, Kabul',
      'کارت واکسیناسیون طفل را حتما با خود بیاورید.': 'Bring the child\'s vaccination card.',
      'داکتر نجیب': 'Dr. Najib',
      'متخصص اعصاب': 'Neurologist',
      'شفاخانه حوزوی': 'Regional Hospital',
      'ناحیه اول، هرات، افغانستان': 'District 1, Herat, Afghanistan',
      'داکتر ذخیره شده': 'Saved Doctor',
      'عمومی': 'General',
      '۱۰:۰۰ صبح': '10:00 AM',
      '۲:۳۰ عصر': '2:30 PM',
      '۹:۰۰ صبح': '9:00 AM'
    };
    return dict[val] || val.replace(/[۰-۹]/g, c => '0123456789'['۰۱۲۳۴۵۶۷۸۹'.indexOf(c)]);
  };

  const handleCancel = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    if (window.confirm(lang === 'en' ? 'Are you sure you want to cancel this appointment?' : 'آیا مطمئن هستید که می‌خواهید این نوبت را لغو کنید؟')) {
      setAppointments(prev => prev.map(app => app.id === id ? { ...app, status: 'cancelled' } : app));
    }
  };

  const handleReschedule = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    const newDate = window.prompt(lang === 'en' ? 'Enter new date (e.g., 2026-05-01):' : 'تاریخ جدید را وارد کنید (مثال: ۲۰۲۶-۰۵-۰۱):');
    if (newDate) {
      setAppointments(prev => prev.map(app => app.id === id ? { ...app, date: newDate } : app));
      alert(lang === 'en' ? 'Appointment rescheduled successfully.' : 'نوبت با موفقیت تغییر یافت.');
    }
  };

  const filteredAppointments = useMemo(() => {
    return appointments.filter(app => {
      // Basic mock filtering
      const statusMatch = app.status === selectedStatus;
      let dateMatch = true; // Placeholder for real date math
      
      const normalizedQuery = searchQuery.toLowerCase().trim();
      const textMatch = !normalizedQuery || 
        app.doctorName.toLowerCase().includes(normalizedQuery) || 
        app.specialty.toLowerCase().includes(normalizedQuery);
        
      return statusMatch && dateMatch && textMatch;
    });
  }, [selectedStatus, dateRange, searchQuery]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'upcoming': return 'bg-sky-50 dark:bg-sky-900/30 text-sky-700 dark:text-sky-400 border-sky-100 dark:border-sky-800';
      case 'completed': return 'bg-emerald-50 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 border-emerald-100 dark:border-emerald-800';
      case 'cancelled': return 'bg-rose-50 dark:bg-rose-900/30 text-rose-700 dark:text-rose-400 border-rose-100 dark:border-rose-800';
      default: return 'bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-100 dark:border-slate-700';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'upcoming': return t('upcoming');
      case 'completed': return t('completed');
      case 'cancelled': return t('cancelled');
      default: return status;
    }
  };

  return (
    <div className="flex flex-col h-full bg-slate-50 dark:bg-slate-900 pb-safe transition-colors">
      <div className="bg-white dark:bg-slate-800 flex items-center justify-center p-4 sticky top-0 z-20 shadow-sm border-b border-slate-200 dark:border-slate-700 transition-colors">
        <h1 className="font-bold text-slate-900 dark:text-white text-lg">{t('appointments')}</h1>
      </div>

      <div className="flex-1 overflow-y-auto">
        <div className="bg-white dark:bg-slate-800 p-4 shadow-sm border-b border-slate-100 dark:border-slate-700 sticky top-0 z-10 transition-colors">
          <div className="flex gap-2 p-1 bg-slate-100 dark:bg-slate-900 rounded-xl overflow-x-auto hide-scrollbar transition-colors">
            {['upcoming', 'completed', 'cancelled'].map((status) => (
              <button
                key={status}
                onClick={() => setSelectedStatus(status as any)}
                className={`flex-1 min-w-[90px] py-2 px-3 text-sm font-bold rounded-lg transition-colors text-center ${
                  selectedStatus === status ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm' : 'text-slate-500 dark:text-slate-400'
                }`}
              >
                {getStatusLabel(status)}
              </button>
            ))}
          </div>
          
          <div className="mt-4 flex flex-col gap-3">
            <div className="relative">
              <input 
                type="text" 
                placeholder={lang === 'en' ? 'Search by doctor or specialty...' : 'جستجو با نام داکتر یا تخصص...'}
                className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl py-2 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500 text-slate-900 dark:text-white transition-colors"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-500 dark:text-slate-400">{t('date_filter')}</span>
              <select 
                value={dateRange}
                onChange={(e) => setDateRange(e.target.value as any)}
                className="bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-sm rounded-lg px-2 py-1 text-slate-700 dark:text-slate-300 font-medium focus:ring-2 focus:outline-none transition-colors"
                dir={isRtl ? 'rtl' : 'ltr'}
              >
                <option value="all">{t('all')}</option>
                <option value="this_week">{t('this_week')}</option>
                <option value="this_month">{t('this_month')}</option>
                <option value="custom">{t('custom_date')}</option>
              </select>
            </div>
            
            {dateRange === 'custom' && (
               <div className="mt-3 bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-xl p-3 shadow-sm animate-in fade-in slide-in-from-top-2 transition-colors">
                 <div className="flex items-center justify-between mb-3">
                   <button onClick={prevMonth} className="p-1 hover:bg-slate-50 dark:hover:bg-slate-700 rounded-md transition-colors text-slate-700 dark:text-slate-300">
                     <ChevronRight size={16} className={`${!isRtl ? 'rotate-180' : ''}`} />
                   </button>
                   <span className="font-bold text-sm text-slate-800 dark:text-slate-200" dir="ltr">
                     {currentMonth.toLocaleString('en-US', { month: 'long', year: 'numeric' })}
                   </span>
                   <button onClick={nextMonth} className="p-1 hover:bg-slate-50 dark:hover:bg-slate-700 rounded-md transition-colors text-slate-700 dark:text-slate-300">
                     <ChevronLeft size={16} className={`${!isRtl ? 'rotate-180' : ''}`} />
                   </button>
                 </div>
                 
                 <div className="grid grid-cols-7 gap-1 text-center mb-1">
                   {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map(d => (
                     <span key={d} className="text-[10px] font-bold text-slate-400 dark:text-slate-500">{d}</span>
                   ))}
                  </div>
                 <div className="grid grid-cols-7 gap-y-1">
                   {Array.from({ length: getFirstDayOfMonth(currentMonth) }).map((_, i) => (
                     <div key={`empty-${i}`} />
                   ))}
                   {Array.from({ length: getDaysInMonth(currentMonth) }).map((_, i) => {
                     const d = i + 1;
                     const isSel = isSelectedDate(d);
                     const inRng = isInRange(d);
                     return (
                       <button
                         key={d}
                         onClick={() => handleDayClick(d)}
                         className={`w-full aspect-square flex items-center justify-center text-xs transition-colors rounded-full ${
                           isSel ? 'bg-sky-600 text-white font-bold' : 
                           inRng ? 'bg-sky-50 dark:bg-sky-900/30 text-sky-800 dark:text-sky-300' : 
                           'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700'
                         }`}
                         dir="ltr"
                       >
                         {d}
                       </button>
                     )
                   })}
                 </div>
               </div>
            )}
          </div>
        </div>

        <div className="p-4 space-y-4">
          {filteredAppointments.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 px-6 text-center bg-white dark:bg-slate-800 rounded-3xl border border-slate-100 dark:border-slate-700 shadow-sm relative overflow-hidden mt-4 transition-colors">
              <div className="absolute top-0 end-0 w-32 h-32 bg-sky-50 dark:bg-sky-900/20 rounded-full translate-x-12 -translate-y-12 blur-2xl pointer-events-none"></div>
              <div className="absolute bottom-0 start-0 w-24 h-24 bg-rose-50 dark:bg-rose-900/20 rounded-full -translate-x-8 translate-y-8 blur-2xl pointer-events-none"></div>

              <div className={`w-20 h-20 flex items-center justify-center rounded-3xl mb-4 relative z-10 animate-bounce shadow-sm transition-colors ${
                selectedStatus === 'cancelled' ? 'bg-rose-100 dark:bg-rose-900/40 border-4 border-white dark:border-slate-800' : 
                selectedStatus === 'completed' ? 'bg-emerald-100 dark:bg-emerald-900/40 border-4 border-white dark:border-slate-800' : 
                'bg-sky-100 dark:bg-sky-900/40 border-4 border-white dark:border-slate-800'
              }`}>
                {selectedStatus === 'cancelled' ? (
                  <CalendarX2 size={36} className="text-rose-500 dark:text-rose-400" />
                ) : selectedStatus === 'completed' ? (
                  <CalendarCheck size={36} className="text-emerald-500 dark:text-emerald-400" />
                ) : (
                  <Calendar size={36} className="text-sky-500 dark:text-sky-400" />
                )}
              </div>
              <h3 className="text-slate-900 dark:text-white font-bold mb-2 text-base relative z-10">
                {selectedStatus === 'upcoming' && t('no_upcoming')}
                {selectedStatus === 'completed' && t('history_empty')}
                {selectedStatus === 'cancelled' && t('no_cancelled')}
              </h3>
              <p className="text-slate-500 dark:text-slate-400 text-xs max-w-[250px] leading-relaxed relative z-10 mb-6">
                {selectedStatus === 'upcoming' 
                  ? t('upcoming_empty_desc') 
                  : t('completed_empty_desc')}
              </p>
              
              {selectedStatus === 'upcoming' && (
                <button className="bg-sky-600 hover:bg-sky-700 active:scale-95 text-white font-bold text-sm px-6 py-3 rounded-xl shadow-sm transition-all relative z-10">
                  {t('search_doctor')}
                </button>
              )}
            </div>
          ) : (
            filteredAppointments.map(app => {
              const isExpanded = expandedAppId === app.id;
              return (
              <div 
                key={app.id} 
                onClick={() => setExpandedAppId(isExpanded ? null : app.id)}
                className="bg-white dark:bg-slate-800 rounded-2xl p-4 shadow-sm border border-slate-100 dark:border-slate-700 relative transition-colors cursor-pointer"
              >
                <div className={`absolute top-4 ${isRtl ? 'end-4' : 'start-4'} text-[10px] font-bold px-2 py-1 rounded border transition-colors ${getStatusColor(app.status)}`}>
                  {getStatusLabel(app.status)}
                </div>
                
                <div className={`flex flex-col flex-wrap ${isRtl ? 'pe-24' : 'ps-24'}`}>
                  <h3 className="font-bold text-slate-900 dark:text-white text-sm">{translateData(app.doctorName)}</h3>
                  <p className="text-xs text-sky-600 dark:text-sky-400 font-medium">{translateData(app.specialty)}</p>
                </div>

                <div className="mt-4 pt-4 border-t border-slate-50 dark:border-slate-700/50 space-y-2">
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-slate-500 dark:text-slate-400 flex items-center gap-1.5"><Calendar size={14} /> {t('date_filter').replace(':', '')}</span>
                    <span className="font-bold text-slate-700 dark:text-slate-300" dir="ltr">{translateData(app.date)}</span>
                  </div>
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-slate-500 dark:text-slate-400 flex items-center gap-1.5"><Clock size={14} /> {lang === 'en' ? 'Time:' : 'زمان:'}</span>
                    <span className="font-bold text-slate-700 dark:text-slate-300">{translateData(app.time)}</span>
                  </div>
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-slate-500 flex items-center gap-1.5 dark:text-slate-400"><X size={14} className="opacity-0"/> {lang === 'en' ? 'Location:' : 'موقعیت:'}</span>
                    <span className="font-medium text-slate-700 dark:text-slate-300 text-xs text-end">{translateData(app.hospital)}</span>
                  </div>
                </div>

                {isExpanded && (
                  <div className="mt-3 pt-3 border-t border-slate-100 dark:border-slate-700/50 space-y-3 animate-in fade-in slide-in-from-top-2">
                    {app.address && (
                      <div className="text-sm">
                        <span className="text-slate-500 dark:text-slate-400 font-medium block mb-1">{lang === 'en' ? 'Address:' : 'آدرس دقیق:'}</span>
                        <span className="text-slate-700 dark:text-slate-300 block">{translateData(app.address)}</span>
                      </div>
                    )}
                    {app.phone && (
                      <div className="text-sm">
                        <span className="text-slate-500 dark:text-slate-400 font-medium block mb-1">{lang === 'en' ? 'Contact:' : 'شماره تماس:'}</span>
                        <span className="text-slate-700 dark:text-slate-300 block" dir="ltr">{translateData(app.phone)}</span>
                      </div>
                    )}
                    {app.instructions && (
                      <div className="text-sm bg-amber-50 dark:bg-amber-900/20 p-3 rounded-lg border border-amber-100 dark:border-amber-800/30">
                        <span className="text-amber-700 dark:text-amber-400 font-medium block mb-1">{lang === 'en' ? 'Pre-appointment Instructions:' : 'دستورالعمل‌های قبل از نوبت:'}</span>
                        <span className="text-amber-600 dark:text-amber-300/80 block leading-relaxed text-xs">{translateData(app.instructions)}</span>
                      </div>
                    )}
                  </div>
                )}

                {app.status === 'upcoming' && (
                  <div className="mt-4 flex gap-2">
                    <button onClick={(e) => handleReschedule(e, app.id)} className="flex-1 bg-sky-50 hover:bg-sky-100 dark:bg-sky-900/30 dark:hover:bg-sky-900/50 text-sky-700 dark:text-sky-400 py-2.5 rounded-xl text-sm font-bold transition-colors active:scale-[0.98]">
                      {t('reschedule')}
                    </button>
                    <button onClick={(e) => handleCancel(e, app.id)} className="flex-1 bg-white hover:bg-rose-50 dark:bg-slate-800 dark:hover:bg-rose-900/20 border border-rose-200 dark:border-rose-900/50 text-rose-600 dark:text-rose-400 py-2.5 rounded-xl text-sm font-bold transition-colors active:scale-[0.98]">
                      {t('cancel_appointment')}
                    </button>
                  </div>
                )}
              </div>
            )})
          )}
        </div>
      </div>
    </div>
  );
}
