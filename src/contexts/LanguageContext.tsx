import React, { createContext, useContext, useState, useEffect } from 'react';

type Language = 'en' | 'da' | 'ps';

interface Translations {
  [key: string]: {
    en: string;
    da: string;
    ps: string;
  };
}

export const translations: Translations = {
  home: { en: 'Home', da: 'خانه', ps: 'کور' },
  appointments: { en: 'Appointments', da: 'نوبت ها', ps: 'نوبتونه' },
  ai_assistant: { en: 'AI Assistant', da: 'هوش مصنوعی', ps: 'مصنوعي هوښیارتیا' },
  blog: { en: 'Blog', da: 'بلاگ صحی', ps: 'روغتیایی بلاګ' },
  profile: { en: 'Profile', da: 'حساب', ps: 'پروفایل' },
  search_placeholder: { en: 'Search doctors, hospitals...', da: 'جستجوی داکتر، شفاخانه یا بیماری...', ps: 'ډاکټر، روغتون یا نښې وپلټئ...' },
  specialties: { en: 'Specialties', da: 'تخصص‌ها', ps: 'تخصصونه' },
  top_doctors: { en: 'Top Doctors', da: 'بهترین داکتران', ps: 'غوره ډاکټران' },
  pharmacy: { en: 'Pharmacy', da: 'درملتون', ps: 'درملتون' },
  book_appointment: { en: 'Book Appointment', da: 'اخذ نوبت', ps: 'نوبت نیول' },
  favorite_doctors: { en: 'Favorite Doctors', da: 'داکتران مورد علاقه', ps: 'د خوښې ډاکټران' },
  settings: { en: 'Settings', da: 'تنظیمات', ps: 'تنظیمات' },
  language: { en: 'Language', da: 'زبان', ps: 'ژبه' },
  health_blog: { en: 'Health Blog', da: 'بلاگ صحی', ps: 'روغتیایی بلاګ' },
  latest_articles: { en: 'Latest Articles', da: 'آخرین مقالات', ps: 'وروستۍ مقالې' },
  read_more: { en: 'Read More', da: 'ادامه مطلب', ps: 'نور ولولئ' },
  timings_locations: { en: 'Timings & Locations', da: 'اوقات کاری و موقعیت‌ها', ps: 'کاري وختونه او موقعیتونه' },
  
  // New Additions:
  see_all: { en: 'See All', da: 'مشاهده همه', ps: 'ټول وګورئ' },
  ai_desc: { en: 'Check symptoms for free in multiple languages.', da: 'بررسی علایم بیماری به زبان‌های دری و پشتو به صورت رایگان.', ps: 'په وړیا توګه په پښتو او دري ژبو کې نښې وڅیړئ.' },
  start_chat: { en: 'Start Chat', da: 'شروع گفتگو', ps: 'خبرې پیل کړئ' },
  current_location: { en: 'Current Location', da: 'موقعیت فعلی', ps: 'اوسنی موقعیت' },
  doctor_profile: { en: 'Doctor Profile', da: 'پروفایل داکتر', ps: 'د ډاکټر پروفایل' },
  ratings: { en: 'Ratings', da: 'امتیازات', ps: 'درجې' },
  patients: { en: 'Patients', da: 'مریضان', ps: 'ناروغان' },
  experience: { en: 'Experience', da: 'تجربه کاری', ps: 'کاري تجربه' },
  years: { en: 'Years', da: 'سال', ps: 'کاله' },
  about_doctor: { en: 'About Doctor', da: 'درباره داکتر', ps: 'د ډاکټر په اړه' },
  doctor_calendar: { en: 'Doctor Calendar', da: 'تقویم حضور داکتر', ps: 'د ډاکټر مهالویش' },
  current_week: { en: 'Current Week', da: 'هفته جاری', ps: 'اوسنۍ اونۍ' },
  main_clinic_location: { en: 'Main Clinic Location', da: 'موقعیت معاینه‌خانه اصلی', ps: 'د اصلي کلینیک موقعیت' },
  next_appointment: { en: 'Next Token', da: 'نوبت بعدی', ps: 'راتلونکی نوبت' },
  medical_records: { en: 'Medical Records', da: 'سوابق صحی (نسخه‌ها)', ps: 'طبي ریکارډونه' },
  notifications: { en: 'Notifications', da: 'آگاه‌سازی‌ها', ps: 'خبرتیاوې' },
  privacy_security: { en: 'Privacy & Security', da: 'حریم خصوصی و امنیت', ps: 'محرمیت او امنیت' },
  logout: { en: 'Logout', da: 'خروج از حساب', ps: 'له حساب څخه وتل' },
  no_favorites: { en: 'No Favorite Doctors Yet', da: 'شما هنوز لیست علاقه‌مندی ندارید', ps: 'تاسو لاهم د خوښې ډاکټر نلرئ' },
  favorites_desc: { en: 'Add trusted doctors to this list for quicker access.', da: 'برای دسترسی سریعتر به داکتران معتمد خود، آنها را به این لیست اضافه کنید.', ps: 'د ګړندي لاسرسي لپاره پدې لیست کې باوري ډاکټران اضافه کړئ.' },
  search_doctor: { en: 'Search Doctor', da: 'جستجوی داکتر', ps: 'ډاکټر وپلټئ' },
  upcoming: { en: 'Upcoming', da: 'در آینده', ps: 'راتلونکی' },
  completed: { en: 'Completed', da: 'تکمیل شده', ps: 'بشپړ شوی' },
  cancelled: { en: 'Cancelled', da: 'لغو شده', ps: 'لغوه شوی' },
  date_filter: { en: 'Date Filter:', da: 'فیلتر تاریخ:', ps: 'د نیټې فلټر:' },
  all: { en: 'All', da: 'همه', ps: 'ټول' },
  this_week: { en: 'This Week', da: 'این هفته', ps: 'پدې اونۍ کې' },
  this_month: { en: 'This Month', da: 'این ماه', ps: 'پدې میاشت کې' },
  custom_date: { en: 'Custom Date', da: 'تاریخ دلخواه', ps: 'دودیزه نیټه' },
  no_upcoming: { en: 'No upcoming appointments', da: 'شما هیچ نوبت پیش‌رو ندارید', ps: 'تاسو هیڅ راتلونکی نوبت نلرئ' },
  history_empty: { en: 'Appointment history is empty', da: 'تاریخچه نوبت‌ها خالی است', ps: 'د نوبتونو تاریخچه خالي ده' },
  no_cancelled: { en: 'No cancelled appointments', da: 'نوبت لغو شده‌ای یافت نشد', ps: 'هیڅ لغوه شوی نوبت ونه موندل شو' },
  upcoming_empty_desc: { en: 'Your upcoming schedule is clear. Book a new appointment.', da: 'برنامه ملاقات آینده شما خالی است. میتوانید از بخش جستجو داکتر جدید پیدا کنید.', ps: 'ستاسو راتلونکی مهالویش خالي دی. نوی نوبت ونیسئ.' },
  completed_empty_desc: { en: 'Check other status tabs for past records.', da: 'برای مشاهده لیست، وضعیت‌های دیگر را بررسی کنید.', ps: 'د تیرو ریکارډونو لپاره د نورو حالت ټبونه چیک کړئ.' },
  reschedule: { en: 'Reschedule', da: 'تغییر زمان', ps: 'وخت بدلول' },
  cancel_appointment: { en: 'Cancel', da: 'لغو نوبت', ps: 'نوبت لغوه کول' },
  advanced_search: { en: 'Advanced Search', da: 'جستجوی پیشرفته', ps: 'پرمختللې پلټنه' },
  no_results: { en: 'No results found.', da: 'نتیجه‌ای یافت نشد.', ps: 'هیڅ پایله ونه موندل شوه.' },
  chat_placeholder: { en: 'Message AI Assistant...', da: 'پیام خود را بنویسید...', ps: 'خپل پیغام ولیکئ...' },
  active: { en: 'Active', da: 'فعال', ps: 'فعال' },
  reminder_settings: { en: 'Appointment Reminders', da: 'یادآوری نوبت‌ها', ps: 'د نوبت یادونې' },
  blog_settings: { en: 'New Blog Articles', da: 'مقالات جدید بلاگ', ps: 'د بلاګ نوې مقالې' },
  ai_settings: { en: 'AI Messages', da: 'پیام‌های هوش مصنوعی', ps: 'د AI پیغامونه' },
  offline_banner: { en: 'You are offline (Cached data available)', da: 'شما آفلاین هستید (دسترسی به اطلاعات ذخیره شده)', ps: 'تاسو آفلاین یاست (خوندي شوي معلومات شتون لري)' },
  onboarding_title: { en: 'Welcome to our App', da: 'به اپلیکیشن ما خوش آمدید', ps: 'زموږ کاریال ته ښه راغلاست' },
  onboarding_desc: { en: 'Find the best doctors, book appointments easily, and use our AI health assistant in Dari and Pashto.', da: 'بهترین داکتران را پیدا کنید، به راحتی نوبت بگیرید و از دستیار هوشمند صحی ما به زبان‌های دری و پشتو استفاده کنید.', ps: 'غوره ډاکټران ومومئ، په اسانۍ سره نوبت ونیسئ او زموږ روغتیایی AI مرستیال په پښتو او دري کې وکاروئ.' },
  onboarding_start: { en: 'Get Started', da: 'شروع کنید', ps: 'پیل کړئ' },
  dark_mode: { en: 'Dark Mode', da: 'حالت تاریک (Dark Mode)', ps: 'تیاره حالت (Dark Mode)' },
  near_me: { en: 'Near me', da: 'نزدیک من', ps: 'زما سره نږدې' },
  today_tomorrow: { en: 'Today/Tomorrow', da: 'امروز/فردا', ps: 'نن/سبا' },
  availability_today: { en: 'Today', da: 'امروز', ps: 'نن' },
  availability_tomorrow: { en: 'Tomorrow', da: 'فردا', ps: 'سبا' },
  online_booking: { en: 'Online Booking', da: 'نوبت آنلاین', ps: 'انلاین نوبت' },
};

interface LanguageContextType {
  lang: Language;
  setLang: (lang: Language) => void;
  t: (key: string) => string;
  isRtl: boolean;
}

const LanguageContext = createContext<LanguageContextType>({
  lang: 'da',
  setLang: () => {},
  t: (key: string) => key,
  isRtl: true,
});

export const useLanguage = () => useContext(LanguageContext);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLang] = useState<Language>('da'); // Default to Dari

  useEffect(() => {
    const isRtl = lang === 'da' || lang === 'ps';
    document.documentElement.dir = isRtl ? 'rtl' : 'ltr';
    document.documentElement.lang = lang;
  }, [lang]);

  const t = (key: string) => {
    return translations[key]?.[lang] || key;
  };

  return (
    <LanguageContext.Provider value={{ lang, setLang, t, isRtl: lang === 'da' || lang === 'ps' }}>
      {children}
    </LanguageContext.Provider>
  );
}
