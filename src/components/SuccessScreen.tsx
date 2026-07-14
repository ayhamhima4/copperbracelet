import { Order } from '../types';
import { TRANSLATIONS } from '../translations';
import { CheckCircle2, ShoppingBag, PhoneCall, Calendar, MapPin, Truck, Award } from 'lucide-react';
import { motion } from 'motion/react';

interface SuccessScreenProps {
  lang: 'ar' | 'fr';
  order: Order;
  onBackToStore: () => void;
}

export default function SuccessScreen({ lang, order, onBackToStore }: SuccessScreenProps) {
  const t = TRANSLATIONS[lang];

  return (
    <div className="min-h-screen bg-[#0d0907] text-[#fff2eb] py-12 px-4 md:px-8 flex items-center justify-center relative overflow-hidden">
      {/* Decorative Warm Ambient Glows */}
      <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full bg-[#bf7e5a] opacity-[0.05] blur-[120px]" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full bg-[#824b2b] opacity-[0.05] blur-[120px]" />

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="max-w-xl w-full bg-[#17120e] rounded-3xl border border-[#302017] p-6 md:p-8 shadow-2xl relative z-10 text-center"
      >
        {/* Animated Checkmark Icon */}
        <div className="w-20 h-20 rounded-full bg-emerald-950/40 border border-emerald-500/30 flex items-center justify-center text-emerald-400 mx-auto mb-6">
          <CheckCircle2 className="w-12 h-12 text-emerald-400 animate-pulse" />
        </div>

        {/* Header Text */}
        <h1 className="text-2xl font-bold font-sans text-emerald-400 mb-3" style={{ direction: lang === 'ar' ? 'rtl' : 'ltr' }}>
          {t.successTitle}
        </h1>
        <p className="text-[#bf9e8a] text-sm font-sans mb-6 leading-relaxed" style={{ direction: lang === 'ar' ? 'rtl' : 'ltr' }}>
          {t.successMsg1}
        </p>

        {/* Call Reminder Reassurance Card */}
        <div className="bg-[#211914] border border-[#3e271a] rounded-2xl p-4 mb-8 flex items-start gap-3.5 text-right rtl:text-right ltr:text-left">
          <div className="w-10 h-10 rounded-xl bg-[#bf7e5a]/10 flex items-center justify-center text-[#bf7e5a] shrink-0">
            <PhoneCall className="w-5 h-5 animate-bounce" />
          </div>
          <div>
            <h4 className="text-xs font-bold text-[#fff2eb] font-sans mb-1">
              {lang === 'ar' ? 'مكالمة هاتفية قريباً' : 'Appel de confirmation imminent'}
            </h4>
            <p className="text-[11px] text-[#bf9e8a] font-sans leading-relaxed">
              {t.successMsg2}
            </p>
          </div>
        </div>

        {/* Order Details Invoice card */}
        <div className="bg-[#0d0907] border border-[#251912] rounded-2xl p-5 mb-8 text-sm space-y-4 font-sans text-right rtl:text-right ltr:text-left" style={{ direction: lang === 'ar' ? 'rtl' : 'ltr' }}>
          {/* Order ID */}
          <div className="flex justify-between items-center pb-3 border-b border-[#211914]">
            <span className="text-[#bf9e8a] flex items-center gap-1.5">
              <Award className="w-4 h-4 text-[#bf7e5a]" />
              {t.orderIdText}
            </span>
            <span className="font-mono font-bold text-[#ff8e4d] bg-[#bf7e5a]/10 px-2.5 py-1 rounded-lg border border-[#bf7e5a]/20">
              {order.id}
            </span>
          </div>

          {/* Date */}
          <div className="flex justify-between items-center text-[#bf9e8a]">
            <span className="flex items-center gap-1.5">
              <Calendar className="w-4 h-4 text-[#bf7e5a]" />
              {lang === 'ar' ? 'تاريخ الطلب:' : 'Date de commande :'}
            </span>
            <span className="text-xs text-[#fff2eb] font-mono">
              {new Date(order.timestamp).toLocaleString(lang === 'ar' ? 'ar-DZ' : 'fr-FR')}
            </span>
          </div>

          {/* Customer Name */}
          <div className="flex justify-between items-center text-[#bf9e8a]">
            <span>{t.nameText}</span>
            <span className="text-xs text-[#fff2eb] font-bold">{order.customerName}</span>
          </div>

          {/* Customer Phone */}
          <div className="flex justify-between items-center text-[#bf9e8a]">
            <span>{t.phoneText}</span>
            <span className="text-xs text-[#fff2eb] font-mono">{order.phoneNumber}</span>
          </div>

          {/* Customer Wilaya */}
          <div className="flex justify-between items-center text-[#bf9e8a]">
            <span>{t.wilayaText}</span>
            <span className="text-xs text-[#fff2eb] font-bold">
              {order.wilayaCode} - {lang === 'ar' ? order.wilayaNameAr : order.wilayaNameFr}
            </span>
          </div>

          {/* Quantity */}
          <div className="flex justify-between items-center text-[#bf9e8a]">
            <span>{t.quantity}</span>
            <span className="text-xs text-[#fff2eb] font-bold">{order.quantity}</span>
          </div>

          {/* Shipping Carrier */}
          <div className="flex justify-between items-center text-[#bf9e8a]">
            <span className="flex items-center gap-1.5">
              <Truck className="w-4 h-4 text-[#bf7e5a]" />
              {t.shippingText}
            </span>
            <span className="text-xs text-[#fff2eb]">{order.shippingCompany}</span>
          </div>

          {/* Delivery Type */}
          <div className="flex justify-between items-center text-[#bf9e8a]">
            <span>{t.deliveryTypeText}</span>
            <span className="text-xs text-[#fff2eb]">
              {order.shippingType === 'Home' ? t.shippingHome : t.shippingOffice}
            </span>
          </div>

          {/* Exact Address */}
          <div className="flex justify-between items-start gap-4 pt-2 text-[#bf9e8a]">
            <span className="shrink-0 flex items-center gap-1.5">
              <MapPin className="w-4 h-4 text-[#bf7e5a]" />
              {lang === 'ar' ? 'عنوان التسليم:' : 'Adresse de livraison :'}
            </span>
            <span className="text-xs text-[#fff2eb] text-left rtl:text-right">{order.address}</span>
          </div>

          <div className="h-px bg-[#211914] my-2" />

          {/* Total Amount Due */}
          <div className="flex justify-between items-center pt-2">
            <span className="font-bold text-[#fff2eb]">{t.totalDueText}</span>
            <span className="text-lg font-bold text-[#ff8e4d] font-mono">
              {order.totalPrice} {t.currency}
            </span>
          </div>
        </div>

        {/* Back Button */}
        <button
          onClick={onBackToStore}
          className="w-full py-3.5 bg-gradient-to-l from-[#824b2b] to-[#bf7e5a] text-[#fff2eb] font-bold rounded-2xl hover:shadow-xl hover:shadow-[#824b2b]/15 active:scale-[0.98] transition-all cursor-pointer flex items-center justify-center gap-2 font-sans"
        >
          <ShoppingBag className="w-5 h-5" />
          <span>{t.backToStore}</span>
        </button>
      </motion.div>
    </div>
  );
}
