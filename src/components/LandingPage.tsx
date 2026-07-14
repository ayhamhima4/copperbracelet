import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { TRANSLATIONS } from '../translations';
import { Order } from '../types';
import TrustBadges from './TrustBadges';
import Reviews from './Reviews';
import CheckoutForm from './CheckoutForm';
// @ts-ignore
import mainProductImage from '../assets/images/image_0_1783729640178.png';
// @ts-ignore
import productThumb1 from '../assets/images/product_thumb_1.png';
// @ts-ignore
import productThumb2 from '../assets/images/product_thumb_2.png';
// @ts-ignore
import productThumb3 from '../assets/images/product_thumb_3.png';
// @ts-ignore
import logoImage from '../assets/logo.jpg';
import {
  Flame, ShoppingCart, Check, Heart, ShieldCheck, HelpCircle,
  ChevronLeft, ChevronRight, Settings, Globe, ArrowDown, CreditCard, Sparkles
} from 'lucide-react';

interface LandingPageProps {
  lang: 'ar' | 'fr';
  setLang: (lang: 'ar' | 'fr') => void;
  onOrderSuccess: (order: Order) => void;
  onGoToAdmin: () => void;
}

export default function LandingPage({ lang, setLang, onOrderSuccess, onGoToAdmin }: LandingPageProps) {
  const t = TRANSLATIONS[lang];

  // Image Gallery State
  const productImages = [
      { src: mainProductImage, alt: 'el fakhir artisanal - السوار النحاسي المغناطيسي الفاخر' },
      { src: productThumb1, alt: '100% Pure Copper Brass & Magnets close-up' },
      { src: productThumb2, alt: 'Inner magnets side view' },
      { src: productThumb3, alt: 'Lifestyle wear male wrist shot' }
  ];
  const [activeImageIndex, setActiveImageIndex] = useState(0);

  // Scarcity Countdown Timer (Exactly 3 days, persisted in localStorage)
  const [timeLeft, setTimeLeft] = useState({ days: 3, hours: 0, minutes: 0, seconds: 0 });

  useEffect(() => {
    const COUNTDOWN_KEY = 'el_fakhir_promo_target';
    let targetTime = localStorage.getItem(COUNTDOWN_KEY);

    if (!targetTime) {
      const now = Date.now();
      const threeDays = 3 * 24 * 60 * 60 * 1000;
      targetTime = String(now + threeDays);
      localStorage.setItem(COUNTDOWN_KEY, targetTime);
    }

    const targetTimestamp = Number(targetTime);

    const updateTimer = () => {
      const now = Date.now();
      const diff = targetTimestamp - now;

      if (diff <= 0) {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
        return;
      }

      const days = Math.floor(diff / (24 * 60 * 60 * 1000));
      const hours = Math.floor((diff % (24 * 60 * 60 * 1000)) / (60 * 60 * 1000));
      const minutes = Math.floor((diff % (60 * 60 * 1000)) / (60 * 1000));
      const seconds = Math.floor((diff % (60 * 1000)) / 1000);

      setTimeLeft({ days, hours, minutes, seconds });
    };

    updateTimer();
    const interval = setInterval(updateTimer, 1000);
    return () => clearInterval(interval);
  }, []);

  // Format with leading zero
  const padZero = (num: number) => String(num).padStart(2, '0');

  // Handle Quick Scroll to checkout
  const scrollToCheckout = () => {
    const el = document.getElementById('checkout-form-container');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-[#f8f9fa] text-slate-800 selection:bg-[#B87333] selection:text-white pb-12">
      {/* Dynamic Background Glows */}
      <div className="absolute top-[5%] left-[-15%] w-[60%] h-[40%] rounded-full bg-[#B87333] opacity-[0.03] blur-[140px] pointer-events-none" />
      <div className="absolute top-[35%] right-[-15%] w-[60%] h-[40%] rounded-full bg-slate-300 opacity-[0.2] blur-[140px] pointer-events-none" />

      {/* Elegant Header Navbar */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-20 shadow-xs">
        <div className="max-w-6xl mx-auto px-4 md:px-6 h-16 flex items-center justify-between">
          {/* Logo / Branding in luxury Professional style */}
          <div className="flex items-center gap-3">
            <img src={logoImage} alt="El Fakhir Artisanal" className="h-10 md:h-12 w-auto object-contain rounded-md" />
          </div>

          {/* Controls: Language Swap & Support */}
          <div className="flex items-center gap-3">
            {/* Customer Service info */}
            <div className="flex items-center gap-1.5 text-xs text-slate-500 mr-2">
              <span>Service Client:</span>
              <a href="tel:0794322582" className="font-bold text-[#B87333] hover:underline font-mono">0794322582</a>
            </div>

            {/* Language Selection Quick Switcher */}
            <button
              onClick={() => setLang(lang === 'ar' ? 'fr' : 'ar')}
              className="px-3 py-1.5 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-bold rounded-xl flex items-center gap-1.5 transition-all cursor-pointer shadow-xs"
            >
              <Globe className="w-3.5 h-3.5 text-[#B87333]" />
              <span>{lang === 'ar' ? 'Français' : 'العربية'}</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-5xl mx-auto px-4 md:px-6 py-8">
        {/* Product Details Section: Split into 2 columns on desktop */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">

          {/* COLUMN 1: Image Gallery & Previews (5 Cols) */}
          <div className="lg:col-span-5 space-y-4">
            <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm relative group">
              {/* Product Badge */}
              <div className="absolute top-4 left-4 z-10 bg-red-600 text-white text-[11px] font-bold px-3 py-1 rounded-full shadow-md uppercase tracking-wider flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5 text-white animate-spin" />
                <span>{lang === 'ar' ? 'الأكثر مبيعاً' : 'Best Seller'}</span>
              </div>

              {/* Main Image View */}
              <div className="aspect-[4/5] relative bg-slate-50 flex items-center justify-center">
                <motion.img
                  key={activeImageIndex}
                  src={productImages[activeImageIndex].src}
                  alt={productImages[activeImageIndex].alt}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover select-none"
                  initial={{ opacity: 0, scale: 1.01 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.28, ease: 'easeOut' }}
                />
              </div>

              {/* Swipe/Prev/Next Controllers */}
              <button
                onClick={() => setActiveImageIndex(prev => prev === 0 ? productImages.length - 1 : prev - 1)}
                className="absolute left-3 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-white/90 hover:bg-white text-slate-800 flex items-center justify-center border border-slate-200 shadow-xs cursor-pointer transition-all"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                onClick={() => setActiveImageIndex(prev => prev === productImages.length - 1 ? 0 : prev + 1)}
                className="absolute right-3 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-white/90 hover:bg-white text-slate-800 flex items-center justify-center border border-slate-200 shadow-xs cursor-pointer transition-all"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>

            {/* Thumbnail Preview strip */}
            <div className="grid grid-cols-4 gap-2.5">
              {productImages.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveImageIndex(idx)}
                  className={`aspect-[4/5] rounded-xl overflow-hidden border bg-slate-50 transition-all cursor-pointer relative ${activeImageIndex === idx
                      ? 'border-[#B87333] ring-2 ring-[#B87333]/15 scale-95'
                      : 'border-slate-200 hover:border-[#B87333]'
                    }`}
                >
                  <img
                    src={img.src}
                    alt={img.alt}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover object-center select-none"
                  />
                  {activeImageIndex === idx && (
                    <div className="absolute inset-0 bg-[#B87333]/5 flex items-center justify-center" />
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* COLUMN 2: Pricing, Badging, Description & Marketing Copys (7 Cols) */}
          <div className="lg:col-span-7 space-y-6 text-right rtl:text-right ltr:text-left">
            <div className="space-y-4">
              <div className="flex justify-start" style={{ direction: lang === 'ar' ? 'rtl' : 'ltr' }}>
                <img 
                  src={logoImage} 
                  alt="El Fakhir Artisanal Logo" 
                  className="h-16 md:h-20 w-auto object-contain rounded-xl shadow-sm border border-slate-200/50" 
                />
              </div>
              <h1 className="text-2xl md:text-3.5xl font-serif font-bold tracking-tight text-[#1a1a1a] leading-tight">
                {t.tagline}
              </h1>
              <p className="text-sm text-slate-500 font-sans leading-relaxed">
                {t.subtagline}
              </p>
            </div>

            {/* Price Tags & Scarcity */}
            <div className="bg-white border border-slate-200 rounded-2xl p-6 space-y-5 shadow-xs relative overflow-hidden">
              <div className="flex items-center justify-between gap-4 flex-wrap">
                {/* Sale and Regular Price details */}
                <div className="space-y-1">
                  <span className="text-[11px] text-slate-400 block uppercase font-bold tracking-wider font-sans">
                    {t.discountPrice}
                  </span>
                  <div className="flex items-baseline gap-2">
                    <span className="text-3xl md:text-4xl font-extrabold text-red-600 font-mono">
                      1990 {t.currency}
                    </span>
                    <span className="text-sm text-slate-400 line-through font-mono">
                      3000 {t.currency}
                    </span>
                  </div>
                </div>

                {/* Percentage Off Badge */}
                <div className="bg-red-50 border border-red-100 text-red-600 font-sans font-bold text-sm px-4 py-2 rounded-xl flex items-center gap-1.5 animate-pulse">
                  <Flame className="w-4 h-4 fill-red-600 text-red-600" />
                  <span>{t.discountBadge}</span>
                </div>
              </div>

              <div className="h-px bg-slate-100" />

              {/* Countdown Timer Visual (Red theme from design) */}
              <div className="bg-red-50/80 border border-red-100 p-4 rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-center gap-2 text-xs font-bold text-red-700 font-sans">
                  <Flame className="w-4 h-4 animate-bounce text-red-600" />
                  <span>{t.limitedOffer}</span>
                </div>

                {/* Digital Boxed Timer Numbers */}
                <div className="flex gap-2.5 self-end sm:self-auto" style={{ direction: 'ltr' }}>
                  {/* Days */}
                  <div className="flex flex-col items-center">
                    <div className="w-10 h-10 bg-white border border-red-100 rounded-lg flex items-center justify-center font-mono text-base font-bold text-red-800 shadow-xs">
                      {padZero(timeLeft.days)}
                    </div>
                    <span className="text-[9px] text-red-600/70 mt-0.5 font-sans font-medium">{t.days}</span>
                  </div>
                  <div className="text-red-400 text-base font-bold self-center -mt-4">:</div>

                  {/* Hours */}
                  <div className="flex flex-col items-center">
                    <div className="w-10 h-10 bg-white border border-red-100 rounded-lg flex items-center justify-center font-mono text-base font-bold text-red-800 shadow-xs">
                      {padZero(timeLeft.hours)}
                    </div>
                    <span className="text-[9px] text-red-600/70 mt-0.5 font-sans font-medium">{t.hours}</span>
                  </div>
                  <div className="text-red-400 text-base font-bold self-center -mt-4">:</div>

                  {/* Minutes */}
                  <div className="flex flex-col items-center">
                    <div className="w-10 h-10 bg-white border border-red-100 rounded-lg flex items-center justify-center font-mono text-base font-bold text-red-800 shadow-xs">
                      {padZero(timeLeft.minutes)}
                    </div>
                    <span className="text-[9px] text-red-600/70 mt-0.5 font-sans font-medium">{t.minutes}</span>
                  </div>
                  <div className="text-red-400 text-base font-bold self-center -mt-4">:</div>

                  {/* Seconds */}
                  <div className="flex flex-col items-center">
                    <div className="w-10 h-10 bg-white border border-red-200 rounded-lg flex items-center justify-center font-mono text-base font-bold text-red-600 shadow-xs animate-pulse">
                      {padZero(timeLeft.seconds)}
                    </div>
                    <span className="text-[9px] text-red-600 mt-0.5 font-sans font-bold">{t.seconds}</span>
                  </div>
                </div>
              </div>

              {/* Fast Jump Checkout CTA Button (Luxury Copper) */}
              <button
                onClick={scrollToCheckout}
                className="w-full py-4 bg-[#B87333] hover:bg-[#a36329] text-white font-bold text-base rounded-xl shadow-xs hover:shadow-md transition-all duration-200 cursor-pointer flex items-center justify-center gap-2 font-sans"
              >
                <ShoppingCart className="w-5 h-5 text-white animate-bounce" />
                <span>{t.orderBtn}</span>
                <ArrowDown className="w-4 h-4" />
              </button>
            </div>

            {/* Description & Technical details */}
            <div className="bg-white border border-slate-200 rounded-2xl p-6 md:p-8 space-y-6 shadow-xs">
              <div className="space-y-3">
                <h3 className="text-lg font-bold text-[#1a1a1a] font-sans">
                  {t.descTitle}
                </h3>
                <p className="text-sm text-slate-600 font-sans leading-relaxed text-justify">
                  {t.descDetail}
                </p>
              </div>

              {/* Specs bullet-list */}
              <div className="space-y-3 pt-4 border-t border-slate-100">
                <h4 className="text-sm font-bold text-[#1a1a1a] font-sans">
                  {t.specsTitle}
                </h4>
                <ul className="grid grid-cols-1 md:grid-cols-2 gap-2.5 text-xs text-slate-600 font-sans">
                  {[t.spec1, t.spec2, t.spec3, t.spec4, t.spec5].map((spec, i) => (
                    <li key={i} className="flex items-center gap-2">
                      <div className="w-4 h-4 rounded-full bg-[#B87333]/10 flex items-center justify-center text-[#B87333] shrink-0">
                        <Check className="w-2.5 h-2.5" />
                      </div>
                      <span>{spec}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Local Trust Badges Widget */}
        <TrustBadges lang={lang} />

        {/* Fast Checkout Form Section */}
        <CheckoutForm lang={lang} onOrderSuccess={onOrderSuccess} />

        {/* Customer Reviews Section */}
        <Reviews lang={lang} />
      </main>

      {/* Aesthetic Footer - Professional Slate 900 Dark Bottom Trust/Copyright bar */}
      <footer className="border-t border-slate-800 bg-slate-900 text-slate-300 mt-20 py-12 font-sans text-center text-xs">
        <div className="max-w-5xl mx-auto px-4 md:px-6 space-y-5">
          {/* Bottom Trust Row in Footer */}
          <div className="flex flex-wrap justify-center items-center gap-6 text-slate-400 font-medium pb-6 border-b border-slate-800 text-[11px] sm:text-xs">
            <div className="flex items-center gap-1.5">
              <span className="w-5 h-5 rounded-full bg-green-500/10 text-green-400 flex items-center justify-center font-bold text-xs">✓</span>
              <span>منتج أصلي 100%</span>
            </div>
            <div className="hidden sm:block h-3 w-[1px] bg-slate-800" />
            <div className="flex items-center gap-1.5">
              <span className="w-5 h-5 rounded-full bg-blue-500/10 text-blue-400 flex items-center justify-center font-bold text-[9px]">COD</span>
              <span>الدفع عند الاستلام</span>
            </div>
            <div className="hidden sm:block h-3 w-[1px] bg-slate-800" />
            <div className="flex items-center gap-1.5">
              <span className="w-5 h-5 rounded-full bg-yellow-500/10 text-yellow-400 flex items-center justify-center text-xs">★</span>
              <span>ضمان الجودة</span>
            </div>
          </div>

          <p className="font-mono text-[9px] tracking-wider uppercase text-slate-500">
            © 2026 EL FAKHIR ARTISANAL ALGERIA. ALL RIGHTS RESERVED.
          </p>
          <p className="leading-relaxed max-w-md mx-auto text-slate-400 text-[11px]">
            {lang === 'ar'
              ? 'تلتزم شركتنا بتقديم أفضل المنتجات الأصلية عالية الجودة مع خدمة شحن ممتازة وبأسعار تنافسية. خدمة العملاء متوفرة طيلة أيام الأسبوع.'
              : 'Notre entreprise s\'engage à fournir les meilleurs produits authentiques de haute qualité avec un service de livraison d\'élite.'}
          </p>
          <div className="flex justify-center gap-4 text-[10px] font-bold">
            <button onClick={onGoToAdmin} className="text-[#B87333] hover:underline cursor-pointer">
              {t.adminLink}
            </button>
            <span>•</span>
            <span className="text-slate-500">COD - الدفع عند الاستلام</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
