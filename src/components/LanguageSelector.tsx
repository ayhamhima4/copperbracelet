import { motion } from 'motion/react';
import { Heart } from 'lucide-react';
import logoImage from '../assets/logo.jpg';

interface LanguageSelectorProps {
  onSelectLanguage: (lang: 'ar' | 'fr') => void;
}

export default function LanguageSelector({ onSelectLanguage }: LanguageSelectorProps) {
  return (
    <div className="min-h-screen bg-[#f8f9fa] flex flex-col items-center justify-center relative overflow-hidden px-4 py-8 text-slate-800">
      {/* Decorative Subtle Glowing copper sphere in background */}
      <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full bg-[#B87333]/5 blur-[120px]" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full bg-slate-200 blur-[120px]" />

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
        className="max-w-md w-full bg-white rounded-2xl border border-slate-200 p-8 shadow-sm relative z-10 text-center flex flex-col items-center"
      >
        {/* Animated Main Visual Icon */}
        <div className="w-16 h-16 rounded-xl bg-[#B87333] flex items-center justify-center shadow-md mb-6">
          <img src={logoImage} alt="El Fakhir Artisanal" className="w-16 h-16 object-contain mx-auto" />
        </div>

        {/* Dynamic Titles */}
        <h1 className="text-2xl font-serif font-bold text-[#1a1a1a] tracking-tight mb-2">
          مرحباً بكم • Bienvenue
        </h1>
        <p className="text-slate-500 text-sm mb-8 px-4 font-sans leading-relaxed">
          الرجاء اختيار اللغة لتصفح العرض الخاص بالسوار النحاسي المغناطيسي الفاخر بالجزائر
          <span className="block mt-2 text-xs opacity-90 text-slate-400">
            Veuillez choisir votre langue pour découvrir l'offre exclusive du bracelet en Algérie.
          </span>
        </p>

        {/* Buttons Grid */}
        <div className="w-full space-y-3">
          <button
            onClick={() => onSelectLanguage('ar')}
            className="w-full py-3.5 px-6 rounded-xl font-medium text-base bg-[#B87333] hover:bg-[#a36329] text-white hover:shadow-md transition-all duration-200 flex items-center justify-between font-sans group cursor-pointer"
          >
            <span className="text-xs opacity-70 font-mono">AR</span>
            <span className="font-bold">العربية الفصحى / الدارجة</span>
            <span className="w-6 h-6 rounded-lg bg-white/20 flex items-center justify-center text-xs text-white">←</span>
          </button>

          <button
            onClick={() => onSelectLanguage('fr')}
            className="w-full py-3.5 px-6 rounded-xl font-medium text-base bg-slate-50 text-slate-700 hover:bg-slate-100 hover:text-slate-900 border border-slate-200 active:scale-[0.99] transition-all duration-200 flex items-center justify-between font-sans group cursor-pointer"
          >
            <span className="w-6 h-6 rounded-lg bg-slate-200/50 flex items-center justify-center text-xs text-slate-600">→</span>
            <span className="font-bold">Français</span>
            <span className="text-xs opacity-70 font-mono">FR</span>
          </button>
        </div>

        {/* Footer info */}
        <div className="mt-8 flex items-center gap-2 text-xs text-slate-400 font-sans">
          <Heart className="w-3.5 h-3.5 text-[#B87333] fill-[#B87333]" />
          <span>الدفع عند الاستلام متوفر في 69 ولاية</span>
        </div>
      </motion.div>
    </div>
  );
}
