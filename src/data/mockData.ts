export const DOCTORS = [
  {
    id: 'd1',
    name: 'دکتر احمد نوری',
    nameEn: 'Dr. Ahmad Noori',
    specialty: 'متخصص قلب (Cardiologist)',
    location: 'کابل، شهر نو (Kabul, Shahr-e-Naw)',
    hospital: 'شفاخانه بین‌المللی کابل',
    fees: '500',
    rating: 4.8,
    patients: 1200,
    experience: 12,
    gender: 'M',
    pmdc: 'PMC-84920',
    avatar: 'https://i.pravatar.cc/150?u=ahmad',
    nextAvailable: 'امروز، ۲:۰۰ ب.ظ',
    about: 'دکتر احمد نوری متخصص بیماری‌های قلبی و عروقی فارغ‌التحصیل از پوهنتون کابل با ۱۲ سال تجربه کاری در شفاخانه‌های دولتی و خصوصی.',
    affiliations: ['شفاخانه بین‌المللی کابل', 'کلینیک قلب شهر نو'],
    timings: [
      { day: 'شنبه تا چهارشنبه', hours: '۸:۰۰ صبح - ۴:۰۰ عصر', clinic: 'شفاخانه بین‌المللی کابل' },
      { day: 'پنجشنبه', hours: '۲:۰۰ عصر - ۸:۰۰ شب', clinic: 'کلینیک قلب شهر نو' }
    ],
    city: 'کابل',
    diseases: ['فشار خون', 'سکته قلبی', 'تپش قلب', 'بیماری‌های عروقی'],
    symptoms: ['درد قفسه سینه', 'تنگی نفس', 'خستگی زودرس', 'تپش قلب']
  },
  {
    id: 'd2',
    name: 'دکتر مریم سادات',
    nameEn: 'Dr. Maryam Sadat',
    specialty: 'متخصص زنان و زایمان (Gynecologist)',
    location: 'مزارشریف، کارته صلح (Mazar-e-Sharif)',
    hospital: 'کلینیک تخصصی مادر',
    fees: '400',
    rating: 4.9,
    patients: 3400,
    experience: 8,
    gender: 'F',
    pmdc: 'PMC-21044',
    avatar: 'https://i.pravatar.cc/150?u=maryam',
    nextAvailable: 'فردا، ۹:۰۰ ق.ظ',
    about: 'دکتر مریم سادات متخصص نسائی ولادی با تجربه طولانی در بخش مراقبت‌های مادر و کودک.',
    affiliations: ['کلینیک تخصصی مادر', 'شفاخانه حوزوی بلخ'],
    timings: [
      { day: 'هر روز بجز جمعه', hours: '۹:۰۰ صبح - ۱:۰۰ عصر', clinic: 'کلینیک تخصصی مادر' },
      { day: 'دوشنبه و چهارشنبه', hours: '۴:۰۰ عصر - ۷:۰۰ شب', clinic: 'شفاخانه حوزوی بلخ' }
    ],
    city: 'مزارشریف',
    diseases: ['کیست تخمدان', 'عفونت زنان', 'ناباروری'],
    symptoms: ['درد لگن', 'خونریزی غیرطبیعی', 'مشاوره بارداری']
  },
  {
    id: 'd3',
    name: 'دکتر فرهاد مجیدی',
    nameEn: 'Dr. Farhad Majidi',
    specialty: 'داکتر عمومی (General Physician)',
    location: 'هرات، جاده ولایت (Herat)',
    hospital: 'شفاخانه حوزوی هرات',
    fees: '300',
    rating: 4.5,
    patients: 890,
    experience: 5,
    gender: 'M',
    pmdc: 'PMC-53902',
    avatar: 'https://i.pravatar.cc/150?u=farhad',
    nextAvailable: 'امروز، ۴:۳۰ ب.ظ',
    about: 'داکتر عمومی برای تداوی امراض داخله، مشاوره صحی و رهنمایی مریضان به متخصصین.',
    affiliations: ['شفاخانه حوزوی هرات'],
    timings: [
      { day: 'تمام روزهای هفته', hours: '۲:۰۰ عصر - ۱۰:۰۰ شب', clinic: 'شفاخانه حوزوی هرات' }
    ],
    city: 'هرات',
    diseases: ['دیابت', 'عفونت معده', 'کم خونی'],
    symptoms: ['سردرد', 'تب', 'دل درد', 'خستگی']
  },
  {
    id: 'd4',
    name: 'دکتر زحل امیری',
    nameEn: 'Dr. Zohal Amiri',
    specialty: 'متخصص اطفال (Pediatrician)',
    location: 'کابل، دشت برچی (Kabul)',
    hospital: 'شفاخانه اطفال آتاترک',
    fees: '450',
    rating: 4.7,
    patients: 2100,
    experience: 10,
    gender: 'F',
    pmdc: 'PMC-11923',
    avatar: 'https://i.pravatar.cc/150?u=zohal',
    nextAvailable: 'جمعه، ۱۰:۰۰ ق.ظ',
    about: 'متخصص امراض اطفال، واکسیناسیون و تغذیه سالم برای کودکان از بدو تولد تا ۱۸ سالگی.',
    affiliations: ['شفاخانه اطفال آتاترک', 'پلی کلینیک شفا'],
    timings: [
      { day: 'یکشنبه تا پنجشنبه', hours: '۸:۰۰ صبح - ۲:۰۰ عصر', clinic: 'شفاخانه اطفال آتاترک' },
      { day: 'پنجشنبه و جمعه', hours: '۴:۰۰ عصر - ۸:۰۰ شب', clinic: 'پلی کلینیک شفا' }
    ],
    city: 'کابل',
    diseases: ['سرخکان', 'سوء تغذیه', 'عفونت گوش اطفال'],
    symptoms: ['تب اطفال', 'سرفه طفل', 'بی اشتهایی']
  }
];

export const CATEGORIES = [
  { id: 'c1', name: 'داکتران', nameEn: 'Doctors', icon: 'Stethoscope', color: 'bg-sky-100 text-sky-600', route: 'search' },
  { id: 'c2', name: 'شفاخانه‌ها', nameEn: 'Hospitals', icon: 'Hospital', color: 'bg-emerald-100 text-emerald-600', route: 'search' },
  { id: 'c3', name: 'لابراتوار', nameEn: 'Labs', icon: 'FlaskConical', color: 'bg-purple-100 text-purple-600', route: 'search' },
  { id: 'c4', name: 'درملتون', nameEn: 'Pharmacy', icon: 'Pill', color: 'bg-rose-100 text-rose-600', route: 'pharmacies' },
];

export const HOSPITALS = [
  { id: 'h1', name: 'شفاخانه بین‌المللی کابل', location: 'کابل' },
  { id: 'h2', name: 'شفاخانه حوزوی هرات', location: 'هرات' },
];

export const PHARMACIES = [
  {
    id: 'p1',
    name: 'درملتون ابن سینا',
    location: 'کابل، پل سرخ',
    rating: 4.6,
    isOpen: true,
    distance: '۱.۲ کیلومتر',
    categories: ['داروهای عمومی', 'نسخه داکتر', 'لوازم بهداشتی'],
    delivery: true
  },
  {
    id: 'p2',
    name: 'شفا فارمسی',
    location: 'مزارشریف، مرکز شهر',
    rating: 4.8,
    isOpen: true,
    distance: '۲.۵ کیلومتر',
    categories: ['داروهای تخصصی', 'گیاهی', 'شیر خشک'],
    delivery: false
  },
  {
    id: 'p3',
    name: 'درملتون افغان',
    location: 'هرات، چوک گلها',
    rating: 4.2,
    isOpen: false,
    distance: '۵.۰ کیلومتر',
    categories: ['عمومی', 'آرایشی بهداشتی'],
    delivery: true
  }
];
