import { useState, useEffect, FormEvent } from 'react';
import { WILAYAS } from '../data/wilayas';
import { TRANSLATIONS } from '../translations';
import { Order, Wilaya } from '../types';
import { ShoppingBag, Truck, User, Phone, MapPin, Building, ChevronDown, CheckCircle2, Package2 } from 'lucide-react';

// 1. قاعدة بيانات البلديات (مثال لولايتي سطيف والجزائر العاصمة)
const COMMUNES_BY_WILAYA: { [key: number]: { id: number; nameAr: string; nameFr: string }[] } = {
  19: [ // ولاية سطيف
    { id: 1, nameAr: "سطيف", nameFr: "Sétif" },
    { id: 2, nameAr: "العلمة", nameFr: "El Eulma" },
    { id: 3, nameAr: "عين أرنات", nameFr: "Ain Arnat" },
    { id: 4, nameAr: "عين ولمان", nameFr: "Ain Oulmene" },
    { id: 5, nameAr: "عين التبينت", nameFr: "Ain Tebinet" },
    { id: 6, nameAr: "بوقاعة", nameFr: "Bougaa" }
  ],
  16: [ // ولاية الجزائر
    { id: 10, nameAr: "الجزائر الوسطى", nameFr: "Alger Centre" },
    { id: 11, nameAr: "باب الزوار", nameFr: "Bab Ezzouar" },
    { id: 12, nameAr: "الحراش", nameFr: "El Harrach" },
    { id: 13, nameAr: "الشراقة", nameFr: "Cheraga" },
    { id: 14, nameAr: "بئر مراد رايس", nameFr: "Bir Mourad Rais" }
  ]
};

interface CheckoutFormProps {
  lang: 'ar' | 'fr';
  onOrderSuccess: (order: Order) => void;
}

export default function CheckoutForm({ lang, onOrderSuccess }: CheckoutFormProps) {
  const t = TRANSLATIONS[lang];

  // Form Fields
  const [customerName, setCustomerName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [selectedWilayaCode, setSelectedWilayaCode] = useState<number>(16); // Default: Alger
  const [selectedCommune, setSelectedCommune] = useState<string>(''); // 2. متغير البلدية المختارة
  const [shippingCompany, setShippingCompany] = useState<'Yalidine Express' | 'ZR Express'>('Yalidine Express');
  const [shippingType, setShippingType] = useState<'Home' | 'Office'>('Home');
  const [address, setAddress] = useState('');
  const [buyMoreThanOne, setBuyMoreThanOne] = useState(false);
  const [quantity, setQuantity] = useState(1);

  // Calculations & UI States
  const [selectedWilaya, setSelectedWilaya] = useState<Wilaya>(WILAYAS.find(w => w.code === 16)!);
  const [shippingFee, setShippingFee] = useState<number>(400);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [validationErrors, setValidationErrors] = useState<{ [key: string]: string }>({});

  const unitPrice = 1990; // Stated 1990 DA discount price
  const subtotal = unitPrice * quantity;

  // الحصول على البلديات الخاصة بالولاية المختارة حالياً
  const currentCommunes = COMMUNES_BY_WILAYA[selectedWilayaCode] || [];

  // Update shipping fee when wilaya, shipping company, or shipping type changes
  useEffect(() => {
    const wil = WILAYAS.find(w => w.code === Number(selectedWilayaCode));
    if (wil) {
      setSelectedWilaya(wil);
      
      // 3. تعيين البلدية الأولى تلقائياً كبلدية افتراضية عند تغيير الولاية
      const communes = COMMUNES_BY_WILAYA[Number(selectedWilayaCode)] || [];
      if (communes.length > 0) {
        setSelectedCommune(lang === 'ar' ? communes[0].nameAr : communes[0].nameFr);
      } else {
        setSelectedCommune('');
      }

      let fee = 400;
      if (shippingCompany === 'Yalidine Express') {
        fee = shippingType === 'Home' ? wil.yalidineHomeFee : wil.yalidineOfficeFee;
      } else {
        fee = shippingType === 'Home' ? wil.zrHomeFee : wil.zrOfficeFee;
      }
      setShippingFee(fee);
    }
  }, [selectedWilayaCode, shippingCompany, shippingType, lang]);

  const validateForm = () => {
    const errors: { [key: string]: string } = {};
    const cleanPhone = phoneNumber.replace(/\s/g, '');
    const dzPhoneRegex = /^(05|06|07)[0-9]{8}$/;

    if (!customerName.trim()) {
      errors.name = t.errorName;
    }

    if (!cleanPhone) {
      errors.phone = t.errorPhone;
    } else if (!dzPhoneRegex.test(cleanPhone)) {
      errors.phone = t.errorPhone;
    }

    if (currentCommunes.length > 0 && !selectedCommune) {
      errors.commune = lang === 'ar' ? 'يرجى اختيار البلدية' : 'Please select commune';
    }

    if (!address.trim()) {
      errors.address = t.errorAddress;
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    // 4. إرسال حقل البلدية "commune" إلى السكريبت ليدخل في الشيت وتليجرام
    const orderPayload = {
      name: customerName.trim(),
      phone: phoneNumber.trim().replace(/\s/g, ''),
      wilaya: `${selectedWilaya.code} - ${lang === 'ar' ? selectedWilaya.nameAr : selectedWilaya.nameFr}`,
      commune: selectedCommune, // إرسال البلدية
      shippingCompany: shippingCompany,
      deliveryType: shippingType === 'Home' ? (lang === 'ar' ? 'للمنزل' : 'Home') : (lang === 'ar' ? 'المكتب' : 'Office'),
      address: address.trim(),
      quantity,
      totalPrice: `${subtotal + shippingFee} ${t.currency}`
    };

    try {
      const response = await fetch('https://script.google.com/macros/s/AKfycbxHJg9tOCaqqdy3-3bC1IGVpfwlefMQgUFEMmmQFPx3h3H-8aVJhRhLFm5hBRAsc6o/exec', {
        method: 'POST',
        mode: 'no-cors', 
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(orderPayload)
      });

      const localOrder: Order = {
        id: Math.random().toString(36).substr(2, 9),
        customerName: orderPayload.name,
        phoneNumber: orderPayload.phone,
        wilayaCode: selectedWilaya.code,
        wilayaNameAr: selectedWilaya.nameAr,
        wilayaNameFr: selectedWilaya.nameFr,
        address: selectedCommune ? `${selectedCommune} - ${orderPayload.address}` : orderPayload.address,
        shippingCompany: shippingCompany,
        shippingType: shippingType,
        shippingFee: shippingFee,
        productPrice: subtotal,
        totalPrice: subtotal + shippingFee,
        quantity,
        status: 'Pending',
        timestamp: new Date().toISOString()
      };

      onOrderSuccess(localOrder);

    } catch (err) {
      console.error('Error placing order:', err);
      setErrorMsg(t.errorSubmit);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div 
      className="bg-white rounded-2xl border border-slate-200 p-6 md:p-8 shadow-sm relative overflow-hidden my-12"
      id="checkout-form-container"
    >
      {/* Subtle styling overlays */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-[#B87333] opacity-[0.02] blur-2xl rounded-full" />
      <div className="absolute bottom-0 left-0 w-32 h-32 bg-slate-100 opacity-[0.1] blur-2xl rounded-full" />

      <div className="text-center mb-8 relative z-10 font-sans">
        <h2 className="text-xl md:text-2xl font-serif font-bold text-[#1a1a1a] flex items-center justify-center gap-2">
          <ShoppingBag className="w-6 h-6 text-[#B87333]" />
          {t.checkoutTitle}
        </h2>
        <p className="text-xs text-slate-500 font-sans mt-2 max-w-lg mx-auto leading-relaxed">
          {t.checkoutSubtitle}
        </p>
      </div>

      {errorMsg && (
        <div className="mb-6 p-4 bg-red-50 border border-red-100 rounded-xl text-red-700 text-sm font-sans flex items-center gap-2 animate-pulse">
          <span className="w-2 h-2 rounded-full bg-red-600 animate-ping" />
          <span>{errorMsg}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6 relative z-10" style={{ direction: lang === 'ar' ? 'rtl' : 'ltr' }}>
        {/* Name input */}
        <div className="space-y-1.5">
          <label className="text-xs font-bold text-slate-500 flex items-center gap-1.5">
            <User className="w-3.5 h-3.5 text-[#B87333]" />
            {t.fullNameLabel} <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            required
            value={customerName}
            onChange={(e) => {
              setCustomerName(e.target.value);
              if (validationErrors.name) {
                setValidationErrors(prev => ({ ...prev, name: '' }));
              }
            }}
            placeholder={t.fullNamePlaceholder}
            className={`w-full bg-white border ${
              validationErrors.name ? 'border-red-400 focus:ring-red-100' : 'border-slate-200 focus:ring-[#B87333]/15'
            } text-slate-800 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:border-[#B87333] outline-none transition-all`}
          />
          {validationErrors.name && (
            <p className="text-xs text-red-500 mt-1">{validationErrors.name}</p>
          )}
        </div>

        {/* Phone input */}
        <div className="space-y-1.5">
          <label className="text-xs font-bold text-slate-500 flex items-center gap-1.5">
            <Phone className="w-3.5 h-3.5 text-[#B87333]" />
            {t.phoneLabel} <span className="text-red-500">*</span>
          </label>
          <input
            type="tel"
            required
            value={phoneNumber}
            onChange={(e) => {
              setPhoneNumber(e.target.value);
              if (validationErrors.phone) {
                setValidationErrors(prev => ({ ...prev, phone: '' }));
              }
            }}
            placeholder={t.phonePlaceholder}
            className={`w-full bg-white border ${
              validationErrors.phone ? 'border-red-400 focus:ring-red-100' : 'border-slate-200 focus:ring-[#B87333]/15'
            } text-slate-800 font-mono rounded-xl px-4 py-3 text-sm focus:ring-2 focus:border-[#B87333] outline-none transition-all text-left rtl:text-right`}
          />
          <p className="text-[10px] text-slate-400 font-sans">
            {t.phoneHint}
          </p>
          {validationErrors.phone && (
            <p className="text-xs text-red-500 mt-1">{validationErrors.phone}</p>
          )}
        </div>

        {/* Wilaya selection dropdown */}
        <div className="space-y-1.5">
          <label className="text-xs font-bold text-slate-500 flex items-center gap-1.5">
            <MapPin className="w-3.5 h-3.5 text-[#B87333]" />
            {t.wilayaLabel} <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <select
              value={selectedWilayaCode}
              onChange={(e) => setSelectedWilayaCode(Number(e.target.value))}
              className="w-full bg-white border border-slate-200 text-slate-800 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-[#B87333]/15 focus:border-[#B87333] outline-none appearance-none cursor-pointer pr-10 pl-10"
            >
              {WILAYAS.map((w) => (
                <option key={w.code} value={w.code}>
                  {w.code} - {lang === 'ar' ? w.nameAr : w.nameFr}
                </option>
              ))}
            </select>
            <div className="absolute inset-y-0 right-3 flex items-center pointer-events-none text-[#B87333] pr-1.5">
              <ChevronDown className="w-4 h-4" />
            </div>
          </div>
        </div>

        {/* 5. حقل اختيار البلدية الجديد (يظهر فقط عند اختيار ولاية تحتوي على بلديات مسجلة) */}
        {currentCommunes.length > 0 && (
          <div className="space-y-1.5 animate-fadeIn">
            <label className="text-xs font-bold text-slate-500 flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-[#B87333]" />
              {lang === 'ar' ? 'البلدية / الدائرة' : 'Commune'} <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <select
                value={selectedCommune}
                onChange={(e) => setSelectedCommune(e.target.value)}
                className="w-full bg-white border border-slate-200 text-slate-800 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-[#B87333]/15 focus:border-[#B87333] outline-none appearance-none cursor-pointer pr-10 pl-10"
              >
                {currentCommunes.map((c) => (
                  <option key={c.id} value={lang === 'ar' ? c.nameAr : c.nameFr}>
                    {lang === 'ar' ? c.nameAr : c.nameFr}
                  </option>
                ))}
              </select>
              <div className="absolute inset-y-0 right-3 flex items-center pointer-events-none text-[#B87333] pr-1.5">
                <ChevronDown className="w-4 h-4" />
              </div>
            </div>
            {validationErrors.commune && (
              <p className="text-xs text-red-500 mt-1">{validationErrors.commune}</p>
            )}
          </div>
        )}

        {/* Quantity selection */}
        <div className="space-y-2">
          <label className="text-xs font-bold text-slate-500 flex items-center gap-1.5">
            <Package2 className="w-3.5 h-3.5 text-[#B87333]" />
            {t.quantityLabel}
          </label>
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => {
                setBuyMoreThanOne(false);
                setQuantity(1);
              }}
              className={`py-2.5 px-4 rounded-xl text-xs font-bold transition-all border cursor-pointer ${
                !buyMoreThanOne
                  ? 'bg-[#B87333]/5 border-2 border-[#B87333] text-slate-900 shadow-xs'
                  : 'bg-white border-slate-200 text-slate-600 hover:border-slate-300'
              }`}
            >
              {t.quantitySingle}
            </button>
            <button
              type="button"
              onClick={() => {
                setBuyMoreThanOne(true);
                setQuantity(2);
              }}
              className={`py-2.5 px-4 rounded-xl text-xs font-bold transition-all border cursor-pointer ${
                buyMoreThanOne
                  ? 'bg-[#B87333]/5 border-2 border-[#B87333] text-slate-900 shadow-xs'
                  : 'bg-white border-slate-200 text-slate-600 hover:border-slate-300'
              }`}
            >
              {t.quantityMultiple}
            </button>
          </div>
          {buyMoreThanOne && (
            <div className="flex items-center gap-2">
              <label className="text-[11px] text-slate-500">{t.quantitySelect}</label>
              <select
                value={quantity}
                onChange={(e) => setQuantity(Number(e.target.value))}
                className="bg-white border border-slate-200 text-slate-800 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-[#B87333]/15 focus:border-[#B87333] outline-none"
              >
                {[2, 3, 4, 5, 6].map((q) => (
                  <option key={q} value={q}>
                    {q}
                  </option>
                ))}
              </select>
            </div>
          )}
          <p className="text-[10px] text-slate-400 font-sans">{t.quantityHint}</p>
        </div>

        {/* Shipping Company & Type Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Shipping Company */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-500 flex items-center gap-1.5">
              <Truck className="w-3.5 h-3.5 text-[#B87333]" />
              {t.shippingCompanyLabel}
            </label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setShippingCompany('Yalidine Express')}
                className={`py-3 px-4 rounded-xl text-xs font-bold transition-all border cursor-pointer ${
                  shippingCompany === 'Yalidine Express'
                    ? 'bg-[#B87333]/5 border-2 border-[#B87333] text-slate-900 shadow-xs'
                    : 'bg-white border-slate-200 text-slate-600 hover:border-slate-300'
                }`}
              >
                Yalidine Express
              </button>
              <button
                type="button"
                onClick={() => setShippingCompany('ZR Express')}
                className={`py-3 px-4 rounded-xl text-xs font-bold transition-all border cursor-pointer ${
                  shippingCompany === 'ZR Express'
                    ? 'bg-[#B87333]/5 border-2 border-[#B87333] text-slate-900 shadow-xs'
                    : 'bg-white border-slate-200 text-slate-600 hover:border-slate-300'
                }`}
              >
                ZR Express
              </button>
            </div>
          </div>

          {/* Shipping Type */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-500 flex items-center gap-1.5">
              <Building className="w-3.5 h-3.5 text-[#B87333]" />
              {t.shippingTypeLabel}
            </label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setShippingType('Home')}
                className={`py-3 px-4 rounded-xl text-xs font-bold transition-all border cursor-pointer ${
                  shippingType === 'Home'
                    ? 'bg-[#B87333]/5 border-2 border-[#B87333] text-slate-900 shadow-xs'
                    : 'bg-white border-slate-200 text-slate-600 hover:border-slate-300'
                }`}
              >
                {t.shippingHome}
              </button>
              <button
                type="button"
                onClick={() => setShippingType('Office')}
                className={`py-3 px-4 rounded-xl text-xs font-bold transition-all border cursor-pointer ${
                  shippingType === 'Office'
                    ? 'bg-[#B87333]/5 border-2 border-[#B87333] text-slate-900 shadow-xs'
                    : 'bg-white border-slate-200 text-slate-600 hover:border-slate-300'
                }`}
              >
                {t.shippingOffice}
              </button>
            </div>
          </div>
        </div>

        {/* Address textarea */}
        <div className="space-y-1.5">
          <label className="text-xs font-bold text-slate-500 flex items-center gap-1.5">
            <Building className="w-3.5 h-3.5 text-[#B87333]" />
            {t.addressLabel} <span className="text-red-500">*</span>
          </label>
          <textarea
            required
            rows={3}
            value={address}
            onChange={(e) => {
              setAddress(e.target.value);
              if (validationErrors.address) {
                setValidationErrors(prev => ({ ...prev, address: '' }));
              }
            }}
            placeholder={t.addressPlaceholder}
            className={`w-full bg-white border ${
              validationErrors.address ? 'border-red-400 focus:ring-red-100' : 'border-slate-200 focus:ring-[#B87333]/15'
            } text-slate-800 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:border-[#B87333] outline-none transition-all resize-none`}
          />
          {validationErrors.address && (
            <p className="text-xs text-red-500 mt-1">{validationErrors.address}</p>
          )}
        </div>

        {/* Pricing Summary Widget */}
        <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 md:p-6 space-y-3 font-sans">
          <div className="flex justify-between items-center text-sm text-slate-500">
            <span>{t.subtotal}</span>
            <span className="font-bold text-slate-800 font-mono">{subtotal} {t.currency}</span>
          </div>

          <div className="flex justify-between items-center text-sm text-slate-500">
            <span>{t.quantity}</span>
            <span className="font-bold text-slate-800 font-mono">{quantity}</span>
          </div>

          <div className="flex justify-between items-center text-sm text-slate-500">
            <span>{t.shippingFee} ({shippingCompany === 'Yalidine Express' ? 'Yalidine' : 'ZR'})</span>
            <span className="font-bold text-slate-800 font-mono">+{shippingFee} {t.currency}</span>
          </div>

          <div className="h-px bg-slate-200 my-2" />

          <div className="flex justify-between items-center text-base font-bold text-slate-800">
            <span>{t.total}</span>
            <span className="text-xl text-[#B87333] font-mono bg-[#B87333]/10 px-3 py-1 rounded-lg border border-[#B87333]/20">
              {subtotal + shippingFee} {t.currency}
            </span>
          </div>
        </div>

        {/* Submit button */}
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full py-4.5 px-6 rounded-xl font-black text-xl text-white bg-green-600 hover:bg-green-700 shadow-md shadow-green-100 hover:shadow-lg transition-all cursor-pointer flex items-center justify-center gap-2 disabled:opacity-50"
        >
          <CheckCircle2 className="w-6 h-6 text-white animate-bounce" />
          <span>{isSubmitting ? t.submitting : t.submitOrder}</span>
        </button>
      </form>
    </div>
  );
}