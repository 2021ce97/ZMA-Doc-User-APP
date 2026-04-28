import React, { useState, useMemo } from 'react';
import { Calendar, Clock, ChevronLeft, ChevronRight, X, CalendarCheck, CalendarX2 } from 'lucide-react';
import { useLanguage } from '../../contexts/LanguageContext';

export function AppointmentsScreen() {
  const { t, isRtl } = useLanguage();
  const [selectedStatus, setSelectedStatus] = useState<'upcoming' | 'completed' | 'cancelled'>('upcoming');
  const [dateRange, setDateRange] = useState<'all' | 'this_week' | 'this_month' | 'custom'>('all');
  const [customRange, setCustomRange] = useState({ start: '', end: '' });

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

  const appointments = [
    {
      id: '1',
      doctorName: 'احمد جواد',
      specialty: 'متخصص قلب',
      date: '۲۰۲۶-۰۴-۳۰',
      time: '۱۰:۰۰ صبح',
      status: 'upcoming',
      hospital: 'شفاخانه بین‌المللی کابل',
    },
    {
      id: '2',
      doctorName: 'داکتر مریم',
      specialty: 'متخصص اطفال',
      date: '۲۰۲۶-۰۴-۱۵',
      time: '۲:۳۰ عصر',
      status: 'completed',
      hospital: 'کلینیک اطفال شهر نو',
    },
    {
      id: '3',
      doctorName: 'داکتر نجیب',
      specialty: 'متخصص اعصاب',
      date: '۲۰۲۶-۰۴-۰۵',
      time: '۹:۰۰ صبح',
      status: 'cancelled',
      hospital: 'شفاخانه حوزوی',
    }
  ];

  const filteredAppointments = useMemo(() => {
    return appointments.filter(app => {
      // Very basic mock filtering
      const statusMatch = app.status === selectedStatus;
      // Pretend all data matches dateRange if this_month, if not we do simple filter
      let dateMatch = true; // Placeholder for real date math
      return statusMatch && dateMatch;
    });
  }, [selectedStatus, dateRange]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'upcoming': return 'bg-sky-50 text-sky-700 border-sky-100';
      case 'completed': return 'bg-emerald-50 text-emerald-700 border-emerald-100';
      case 'cancelled': return 'bg-rose-50 text-rose-700 border-rose-100';
      default: return 'bg-slate-50 text-slate-700 border-slate-100';
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
    <div className="flex flex-col h-full bg-slate-50 pb-safe">
      <div className="bg-white flex items-center justify-center p-4 sticky top-0 z-20 shadow-sm border-b border-slate-200">
        <h1 className="font-bold text-slate-900 text-lg">{t('appointments')}</h1>
      </div>

      <div className="flex-1 overflow-y-auto">
        <div className="bg-white p-4 shadow-sm border-b border-slate-100 sticky top-0 z-10">
          <div className="flex gap-2 p-1 bg-slate-100 rounded-xl overflow-x-auto hide-scrollbar">
            {['upcoming', 'completed', 'cancelled'].map((status) => (
              <button
                key={status}
                onClick={() => setSelectedStatus(status as any)}
                className={`flex-1 min-w-[90px] py-2 px-3 text-sm font-bold rounded-lg transition-colors text-center ${
                  selectedStatus === status ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500'
                }`}
              >
                {getStatusLabel(status)}
              </button>
            ))}
          </div>
          
          <div className="mt-4 flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-500">{t('date_filter')}</span>
              <select 
                value={dateRange}
                onChange={(e) => setDateRange(e.target.value as any)}
                className="bg-slate-50 border border-slate-200 text-sm rounded-lg px-2 py-1 text-slate-700 font-medium focus:ring-2 focus:outline-none"
              >
                <option value="all">{t('all')}</option>
                <option value="this_week">{t('this_week')}</option>
                <option value="this_month">{t('this_month')}</option>
                <option value="custom">{t('custom_date')}</option>
              </select>
            </div>
            
            {dateRange === 'custom' && (
               <div className="mt-3 bg-white border border-slate-100 rounded-xl p-3 shadow-sm animate-in fade-in slide-in-from-top-2">
                 <div className="flex items-center justify-between mb-3">
                   <button onClick={prevMonth} className="p-1 hover:bg-slate-50 rounded-md">
                     <ChevronRight size={16} className={`${!isRtl ? 'rotate-180' : ''}`} />
                   </button>
                   <span className="font-bold text-sm text-slate-800" dir="ltr">
                     {currentMonth.toLocaleString('en-US', { month: 'long', year: 'numeric' })}
                   </span>
                   <button onClick={nextMonth} className="p-1 hover:bg-slate-50 rounded-md">
                     <ChevronLeft size={16} className={`${!isRtl ? 'rotate-180' : ''}`} />
                   </button>
                 </div>
                 
                 <div className="grid grid-cols-7 gap-1 text-center mb-1">
                   {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map(d => (
                     <span key={d} className="text-[10px] font-bold text-slate-400">{d}</span>
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
                           inRng ? 'bg-sky-50 text-sky-800' : 
                           'text-slate-700 hover:bg-slate-100'
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
            <div className="flex flex-col items-center justify-center py-12 px-6 text-center bg-white rounded-3xl border border-slate-100 shadow-sm relative overflow-hidden mt-4">
              <div className="absolute top-0 end-0 w-32 h-32 bg-sky-50 rounded-full translate-x-12 -translate-y-12 blur-2xl pointer-events-none"></div>
              <div className="absolute bottom-0 start-0 w-24 h-24 bg-rose-50 rounded-full -translate-x-8 translate-y-8 blur-2xl pointer-events-none"></div>

              <div className={`w-20 h-20 flex items-center justify-center rounded-3xl mb-4 relative z-10 animate-bounce shadow-sm ${
                selectedStatus === 'cancelled' ? 'bg-rose-100 border-4 border-white' : 
                selectedStatus === 'completed' ? 'bg-emerald-100 border-4 border-white' : 
                'bg-sky-100 border-4 border-white'
              }`}>
                {selectedStatus === 'cancelled' ? (
                  <CalendarX2 size={36} className="text-rose-500" />
                ) : selectedStatus === 'completed' ? (
                  <CalendarCheck size={36} className="text-emerald-500" />
                ) : (
                  <Calendar size={36} className="text-sky-500" />
                )}
              </div>
              <h3 className="text-slate-900 font-bold mb-2 text-base relative z-10">
                {selectedStatus === 'upcoming' && t('no_upcoming')}
                {selectedStatus === 'completed' && t('history_empty')}
                {selectedStatus === 'cancelled' && t('no_cancelled')}
              </h3>
              <p className="text-slate-500 text-xs max-w-[250px] leading-relaxed relative z-10 mb-6">
                {selectedStatus === 'upcoming' 
                  ? t('upcoming_empty_desc') 
                  : t('completed_empty_desc')}
              </p>
              
              {selectedStatus === 'upcoming' && (
                <button className="bg-sky-600 hover:bg-sky-700 text-white font-bold text-sm px-6 py-3 rounded-xl shadow-sm transition-colors relative z-10">
                  {t('search_doctor')}
                </button>
              )}
            </div>
          ) : (
            filteredAppointments.map(app => (
              <div key={app.id} className="bg-white rounded-2xl p-4 shadow-sm border border-slate-100 relative">
                <div className={`absolute top-4 ${isRtl ? 'end-4' : 'start-4'} text-[10px] font-bold px-2 py-1 rounded border ${getStatusColor(app.status)}`}>
                  {getStatusLabel(app.status)}
                </div>
                
                <div className={`flex flex-col ${isRtl ? 'pe-24' : 'ps-24'}`}>
                  <h3 className="font-bold text-slate-900">{app.doctorName}</h3>
                  <p className="text-xs text-sky-600 font-medium">{app.specialty}</p>
                </div>

                <div className="mt-4 pt-4 border-t border-slate-50 space-y-2">
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-slate-500 flex items-center gap-1"><Calendar size={14} /> {t('date_filter').replace(':', '')}</span>
                    <span className="font-bold text-slate-700" dir="ltr">{app.date}</span>
                  </div>
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-slate-500 flex items-center gap-1"><Clock size={14} /> زمان:</span>
                    <span className="font-bold text-slate-700">{app.time}</span>
                  </div>
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-slate-500 flex items-center gap-1"><X size={14} className="opacity-0"/> موقعیت:</span>
                    <span className="font-medium text-slate-700 text-xs text-end">{app.hospital}</span>
                  </div>
                </div>

                {app.status === 'upcoming' && (
                  <div className="mt-4 flex gap-2">
                    <button className="flex-1 bg-sky-50 text-sky-700 py-2 rounded-xl text-sm font-bold">{t('reschedule')}</button>
                    <button className="flex-1 bg-white border border-rose-200 text-rose-600 py-2 rounded-xl text-sm font-bold hover:bg-rose-50 transition-colors">{t('cancel_appointment')}</button>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
