export const initialProducts = [
  {
    id: 1,
    name: 'لابتوب Dell XPS 15',
    category: 'laptops',
    price: 6500,
    originalPrice: 7200,
    imageUrl: 'https://picsum.photos/seed/laptop/400/300',
    rating: 4.8,
    reviewCount: 250,
    description: 'لابتوب قوي بشاشة OLED مذهلة، مثالي للمصممين والمطورين.',
    store: 'amazon',
    affiliateLink: 'https://www.amazon.sa',
    priceComparison: [
        { store: 'amazon', price: 6500, affiliateLink: 'https://www.amazon.sa' },
        { store: 'jarir', price: 6550, affiliateLink: 'https://www.jarir.com' },
        { store: 'noon', price: 6600, affiliateLink: 'https://www.noon.com/saudi-en/' },
    ]
  },
  {
    id: 2,
    name: 'هاتف Samsung Galaxy S23 Ultra',
    category: 'smartphones',
    price: 4300,
    imageUrl: 'https://picsum.photos/seed/phone/400/300',
    rating: 4.9,
    reviewCount: 890,
    description: 'كاميرا استثنائية وأداء فائق مع قلم S Pen لتجربة لا مثيل لها.',
    store: 'noon',
    affiliateLink: 'https://www.noon.com/saudi-en/',
  },
  {
    id: 3,
    name: 'سماعات Sony WH-1000XM5',
    category: 'headphones',
    price: 1450,
    originalPrice: 1600,
    imageUrl: 'https://picsum.photos/seed/headphones/400/300',
    rating: 4.7,
    reviewCount: 1200,
    description: 'أفضل تقنية لعزل الضوضاء في فئتها مع جودة صوت لا تضاهى.',
    store: 'jarir',
    affiliateLink: 'https://www.jarir.com',
    priceComparison: [
        { store: 'jarir', price: 1450, affiliateLink: 'https://www.jarir.com' },
        { store: 'amazon', price: 1475, affiliateLink: 'https://www.amazon.sa' },
    ]
  },
  {
    id: 4,
    name: 'شاشة ألعاب LG UltraGear 27"',
    category: 'monitors',
    price: 1800,
    imageUrl: 'https://picsum.photos/seed/monitor/400/300',
    rating: 4.6,
    reviewCount: 450,
    description: 'شاشة 4K بمعدل تحديث 144Hz لتجربة ألعاب سلسة وممتعة.',
    store: 'amazon',
    affiliateLink: 'https://www.amazon.sa',
  },
  {
    id: 5,
    name: 'Apple iPad Air',
    category: 'tablets',
    price: 2400,
    imageUrl: 'https://picsum.photos/seed/ipad/400/300',
    rating: 4.9,
    reviewCount: 1500,
    description: 'تصميم أنيق وأداء قوي مع شريحة M1.',
    store: 'extra',
    affiliateLink: 'https://www.extra.com',
  },
  {
    id: 6,
    name: 'كاميرا Canon EOS R6',
    category: 'cameras',
    price: 9800,
    originalPrice: 10500,
    imageUrl: 'https://picsum.photos/seed/camera/400/300',
    rating: 4.8,
    reviewCount: 320,
    description: 'كاميرا احترافية لتصوير الفيديو والصور بجودة عالية.',
    store: 'jarir',
    affiliateLink: 'https://www.jarir.com',
  },
  {
    id: 7,
    name: 'ماوس لوجيتك MX Master 3S',
    category: 'accessories',
    price: 450,
    imageUrl: 'https://picsum.photos/seed/mouse/400/300',
    rating: 4.9,
    reviewCount: 2100,
    description: 'أفضل ماوس للإنتاجية بتصميم مريح وميزات متقدمة.',
    store: 'amazon',
    affiliateLink: 'https://www.amazon.sa',
    priceComparison: [
        { store: 'amazon', price: 450, affiliateLink: 'https://www.amazon.sa' },
        { store: 'jarir', price: 449, affiliateLink: 'https://www.jarir.com' },
    ]
  },
  {
    id: 8,
    name: 'هاتف Google Pixel 8 Pro',
    category: 'smartphones',
    price: 3800,
    imageUrl: 'https://picsum.photos/seed/pixel8/400/300',
    rating: 4.7,
    reviewCount: 650,
    description: 'تجربة أندرويد خام مع كاميرا ذكية وميزات حصرية.',
    store: 'amazon',
    affiliateLink: 'https://www.amazon.sa',
  }
];

export const initialCoupons = [
  {
    id: 1,
    store: 'noon',
    storeLogoUrl: 'https://picsum.photos/seed/noonlogo/100/100',
    code: 'SAVE15',
    description: 'خصم 15% على الإلكترونيات',
    expiryDate: '2024-12-31',
  },
  {
    id: 2,
    store: 'amazon',
    storeLogoUrl: 'https://picsum.photos/seed/amazonlogo/100/100',
    code: 'TECHY10',
    description: 'خصم 10% على اللابتوبات',
    expiryDate: '2024-11-30',
  },
  {
    id: 3,
    store: 'shein',
    storeLogoUrl: 'https://picsum.photos/seed/sheinlogo/100/100',
    code: 'STYLE20',
    description: 'خصم 20% على اكسسوارات الجوال',
    expiryDate: '2025-01-15',
  },
];

export const categories = [
    { key: 'laptops', name: 'لابتوبات' },
    { key: 'smartphones', name: 'هواتف ذكية' },
    { key: 'headphones', name: 'سماعات' },
    { key: 'monitors', name: 'شاشات' },
    { key: 'tablets', name: 'أجهزة لوحية' },
    { key: 'cameras', name: 'كاميرات' },
    { key: 'accessories', name: 'ملحقات' },
];

// --- BLOG POSTS ---
export const initialBlogPosts = [
    {
        id: 1,
        title: 'كيف تختار اللابتوب المثالي لاحتياجاتك؟',
        author: 'فريق صفقات تك',
        date: '2024-07-15',
        imageUrl: 'https://picsum.photos/seed/blog1/800/400',
        content: `
عندما يتعلق الأمر بشراء لابتوب جديد، قد تكون الخيارات المتاحة مربكة. إليك دليل سريع لمساعدتك:

**1. حدد ميزانيتك:** تتراوح الأسعار بشكل كبير. معرفة ميزانيتك ستساعدك على تضييق الخيارات.

**2. نظام التشغيل:** هل تفضل Windows، macOS، أم ChromeOS؟ كل نظام له مميزاته وعيوبه.

**3. الأداء:**
   - **المعالج (CPU):** Intel Core i5 أو AMD Ryzen 5 كافٍ لمعظم المهام. للمهام الثقيلة (مونتاج، ألعاب)، ابحث عن Core i7/i9 أو Ryzen 7/9.
   - **الذاكرة (RAM):** 8GB هي الحد الأدنى. 16GB مثالية لمعظم المستخدمين. 32GB للمحترفين.
   - **التخزين (SSD):** اختر SSD بدلاً من HDD لسرعة فائقة. 256GB كافية للاستخدام الخفيف، لكن 512GB أو أكثر هي الأفضل.

**4. الشاشة:** الحجم والدقة والجودة مهمة. شاشات OLED تقدم أفضل الألوان، ومعدل التحديث العالي (120Hz+) مهم للألعاب.

نصيحة أخيرة: اقرأ المراجعات وشاهد الفيديوهات قبل اتخاذ قرارك النهائي!
        `,
    },
    {
        id: 2,
        title: 'أهم 5 ملحقات يجب أن تقتنيها لهاتفك الذكي',
        author: 'فريق صفقات تك',
        date: '2024-07-10',
        imageUrl: 'https://picsum.photos/seed/blog2/800/400',
        content: `
هاتفك الذكي هو أكثر من مجرد جهاز اتصال. إليك 5 ملحقات تعزز تجربتك:

1.  **شاحن محمول (Power Bank):** لا غنى عنه للبقاء على اتصال طوال اليوم، خاصة أثناء التنقل.
2.  **سماعات لاسلكية:** سواء كانت للاستماع للموسيقى أو إجراء المكالمات، السماعات اللاسلكية توفر حرية وراحة.
3.  **واقي شاشة عالي الجودة:** استثمار بسيط لحماية شاشة هاتفك من الخدوش والكسر.
4.  **شاحن لاسلكي:** لسهولة الشحن في المنزل أو المكتب دون الحاجة للكابلات.
5.  **حامل هاتف للسيارة:** للقيادة الآمنة واستخدام الخرائط بسهولة.

هذه الملحقات لا تحسن من وظائف هاتفك فحسب، بل تحافظ عليه أيضًا.
        `,
    }
];

// --- SITE SETTINGS ---
export const initialSiteSettings = {
  aboutUs: "Welcome to Tech Deals! We are dedicated to finding you the best prices and offers on the latest technology. Our mission is to make tech accessible and affordable for everyone.",
  privacyPolicy: "Your privacy is important to us. At Tech Deals, we are committed to protecting your personal information. This Privacy Policy outlines how we collect, use, and safeguard your data when you visit our website. We do not sell your personal information to third parties.",
  copyrightYear: new Date().getFullYear(),
  googleAdSenseId: 'ca-pub-XXXXXXXXXXXXXXXX',
  facebookPixelId: 'XXXXXXXXXXXXXXXX',
  affiliateCommissionRate: 5, // Default to 5%
  blogPosts: initialBlogPosts,
  showBlogSection: true,
  showCouponsSection: true,
};


// --- INTERNATIONALIZATION CONSTANTS ---

// Base currency is SAR (Saudi Riyal)
export const EXCHANGE_RATES = {
  SAR: 1,
  USD: 0.27,
  EUR: 0.25,
  AED: 0.98,
  EGP: 12.7,
  KWD: 0.082,
  LBP: 24000,
  RUB: 23,
  CNY: 1.93,
  KRW: 370,
  KPW: 370, // No official rate, using KRW as a placeholder
  INR: 22.3,
  PKR: 74,
};

export const LANGUAGES = [
  { code: 'ar', name: 'العربية', dir: 'rtl' },
  { code: 'en', name: 'English', dir: 'ltr' },
];

export const CURRENCIES = [
  { code: 'SAR', name: 'Saudi Riyal', symbol: 'ر.س' },
  { code: 'USD', name: 'US Dollar', symbol: '$' },
  { code: 'EUR', name: 'Euro', symbol: '€' },
  { code: 'AED', name: 'UAE Dirham', symbol: 'د.إ' },
  { code: 'EGP', name: 'Egyptian Pound', symbol: 'ج.م' },
  { code: 'KWD', name: 'Kuwaiti Dinar', symbol: 'د.ك' },
  { code: 'LBP', name: 'Lebanese Pound', symbol: 'L£' },
  { code: 'RUB', name: 'Russian Ruble', symbol: '₽' },
  { code: 'CNY', name: 'Chinese Yuan', symbol: '¥' },
  { code: 'KRW', name: 'South Korean Won', symbol: '₩' },
  { code: 'KPW', name: 'North Korean Won', symbol: '₩' },
  { code: 'INR', name: 'Indian Rupee', symbol: '₹' },
  { code: 'PKR', name: 'Pakistani Rupee', symbol: '₨' },
];

export const COUNTRIES = [
    { code: 'CN', name: 'China', flag: '🇨🇳', currencyCode: 'CNY', languageCode: 'en' },
    { code: 'EG', name: 'Egypt', flag: '🇪🇬', currencyCode: 'EGP', languageCode: 'ar' },
    { code: 'IN', name: 'India', flag: '🇮🇳', currencyCode: 'INR', languageCode: 'en' },
    { code: 'KW', name: 'Kuwait', flag: '🇰🇼', currencyCode: 'KWD', languageCode: 'ar' },
    { code: 'LB', name: 'Lebanon', flag: '🇱🇧', currencyCode: 'LBP', languageCode: 'ar' },
    { code: 'KP', name: 'North Korea', flag: '🇰🇵', currencyCode: 'KPW', languageCode: 'en' },
    { code: 'PK', name: 'Pakistan', flag: '🇵🇰', currencyCode: 'PKR', languageCode: 'en' },
    { code: 'RU', name: 'Russia', flag: '🇷🇺', currencyCode: 'RUB', languageCode: 'en' },
    { code: 'SA', name: 'Saudi Arabia', flag: '🇸🇦', currencyCode: 'SAR', languageCode: 'ar' },
    { code: 'KR', name: 'South Korea', flag: '🇰🇷', currencyCode: 'KRW', languageCode: 'en' },
    { code: 'AE', name: 'United Arab Emirates', flag: '🇦🇪', currencyCode: 'AED', languageCode: 'ar' },
    { code: 'US', name: 'United States', flag: '🇺🇸', currencyCode: 'USD', languageCode: 'en' },
];
