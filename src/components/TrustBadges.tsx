import { Award, Truck, ShieldAlert } from 'lucide-react';
import { TRANSLATIONS } from '../translations';

interface TrustBadgesProps {
  lang: 'ar' | 'fr';
}

export default function TrustBadges({ lang }: TrustBadgesProps) {
  const t = TRANSLATIONS[lang];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 my-10" id="trust-badges-container">
      {/* Badge 1: 100% Authentic */}
      <div 
        id="badge-authentic"
        className="flex flex-col items-center p-6 bg-white border border-slate-200 rounded-2xl text-center group hover:border-[#B87333] hover:shadow-sm transition-all duration-300"
      >
        <div className="w-12 h-12 rounded-xl bg-[#B87333]/10 flex items-center justify-center text-[#B87333] group-hover:bg-[#B87333]/20 group-hover:scale-110 transition-all duration-300 mb-4">
          <Award className="w-6 h-6" />
        </div>
        <h3 className="text-base font-serif font-bold text-[#1a1a1a] mb-2">
          {t.badge1Title}
        </h3>
        <p className="text-slate-500 text-xs font-sans leading-relaxed">
          {t.badge1Desc}
        </p>
      </div>

      {/* Badge 2: Cash on Delivery */}
      <div 
        id="badge-cod"
        className="flex flex-col items-center p-6 bg-white border border-slate-200 rounded-2xl text-center group hover:border-[#B87333] hover:shadow-sm transition-all duration-300"
      >
        <div className="w-12 h-12 rounded-xl bg-[#B87333]/10 flex items-center justify-center text-[#B87333] group-hover:bg-[#B87333]/20 group-hover:scale-110 transition-all duration-300 mb-4">
          <Truck className="w-6 h-6" />
        </div>
        <h3 className="text-base font-serif font-bold text-[#1a1a1a] mb-2">
          {t.badge2Title}
        </h3>
        <p className="text-slate-500 text-xs font-sans leading-relaxed">
          {t.badge2Desc}
        </p>
      </div>

      {/* Badge 3: Guarantee */}
      <div 
        id="badge-guarantee"
        className="flex flex-col items-center p-6 bg-white border border-slate-200 rounded-2xl text-center group hover:border-[#B87333] hover:shadow-sm transition-all duration-300"
      >
        <div className="w-12 h-12 rounded-xl bg-[#B87333]/10 flex items-center justify-center text-[#B87333] group-hover:bg-[#B87333]/20 group-hover:scale-110 transition-all duration-300 mb-4">
          <ShieldAlert className="w-6 h-6" />
        </div>
        <h3 className="text-base font-serif font-bold text-[#1a1a1a] mb-2">
          {t.badge3Title}
        </h3>
        <p className="text-slate-500 text-xs font-sans leading-relaxed">
          {t.badge3Desc}
        </p>
      </div>
    </div>
  );
}
