import { useState, FormEvent } from 'react';
import { Star, MessageSquarePlus, CheckCircle, User } from 'lucide-react';
import { Review } from '../types';
import { TRANSLATIONS } from '../translations';

interface ReviewsProps {
  lang: 'ar' | 'fr';
}

const INITIAL_REVIEWS: Review[] = [
  {
    id: 'rev-1',
    name: 'عبد القادر بوزيد (Abdelkader)',
    wilaya: 'الشلف (Chlef)',
    rating: 5,
    text: 'السوار ذو جودة عالية جداً، ونحاس حقيقي أصيل وثقيل. كان عندي آلام مزمنة في معصمي ونقصت عليّ بزاف بعد 3 أيام من لبسه. التوصيل كان سريع جداً مع ياليدين.',
    date: 'منذ يومين',
    avatarColor: 'bg-emerald-600'
  },
  {
    id: 'rev-2',
    name: 'Kamel Merabet',
    wilaya: 'قسنطينة (Constantine)',
    rating: 5,
    text: 'Très chic et élégant, je le porte tous les jours au bureau. Les finitions en laiton et cuivre sont magnifiques. Livraison ultra rapide en 48h. Je recommande !',
    date: 'منذ 4 أيام',
    avatarColor: 'bg-indigo-600'
  },
  {
    id: 'rev-3',
    name: 'فاطمة الزهراء (Fatima)',
    wilaya: 'الجزائر العاصمة (Alger)',
    rating: 5,
    text: 'شريتو لزوج ديالي كهدية وعجبو بزاف بزاف. النحاس حقيقي ويلمع، وتفاصيله الفنية ممتازة والعلبة دياله رائعة تزيد من فخامته. الدفع عند الاستلام مريح جداً.',
    date: 'منذ أسبوع',
    avatarColor: 'bg-rose-500'
  },
  {
    id: 'rev-4',
    name: 'Ryad Belkacem',
    wilaya: 'وهران (Oran)',
    rating: 5,
    text: 'Excellent produit ! Conforme à 100% à la description et aux photos. On sent directement la pureté du cuivre et la force des aimants. Service client au top.',
    date: 'منذ 10 أيام',
    avatarColor: 'bg-amber-600'
  }
];

export default function Reviews({ lang }: ReviewsProps) {
  const t = TRANSLATIONS[lang];
  const [reviews, setReviews] = useState<Review[]>(INITIAL_REVIEWS);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newReviewName, setNewReviewName] = useState('');
  const [newReviewWilaya, setNewReviewWilaya] = useState('');
  const [newReviewRating, setNewReviewRating] = useState(5);
  const [newReviewText, setNewReviewText] = useState('');

  const handleAddReview = (e: FormEvent) => {
    e.preventDefault();
    if (!newReviewName.trim() || !newReviewText.trim()) return;

    const newReview: Review = {
      id: `rev-${Date.now()}`,
      name: newReviewName,
      wilaya: newReviewWilaya || (lang === 'ar' ? 'الجزائر' : 'Alger'),
      rating: newReviewRating,
      text: newReviewText,
      date: lang === 'ar' ? 'الآن' : 'À l\'instant',
      avatarColor: 'bg-amber-700'
    };

    setReviews([newReview, ...reviews]);
    setNewReviewName('');
    setNewReviewWilaya('');
    setNewReviewText('');
    setNewReviewRating(5);
    setShowAddForm(false);
  };

  return (
    <div className="my-16" id="customer-reviews-section">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
        <div>
          <h2 className="text-2xl font-serif font-bold text-[#1a1a1a] flex items-center gap-2">
            <Star className="w-6 h-6 text-amber-400 fill-amber-400" />
            {t.reviewsTitle}
          </h2>
          <div className="flex items-center gap-1 mt-2">
            <span className="text-amber-400 flex">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-4 h-4 fill-amber-400" />
              ))}
            </span>
            <span className="text-sm text-slate-500 ml-2 font-mono">
              4.9 / 5 (142 {lang === 'ar' ? 'تقييم' : 'avis'})
            </span>
          </div>
        </div>

        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className="px-5 py-2.5 bg-white border border-slate-200 text-slate-700 rounded-xl hover:bg-slate-50 transition-all text-sm font-semibold flex items-center justify-center gap-2 cursor-pointer self-start md:self-auto shadow-xs"
        >
          <MessageSquarePlus className="w-4 h-4 text-[#B87333]" />
          {lang === 'ar' ? 'كتابة تقييم' : 'Écrire un avis'}
        </button>
      </div>

      {/* Write review form */}
      {showAddForm && (
        <form 
          onSubmit={handleAddReview}
          className="bg-white border border-slate-200 p-6 rounded-2xl mb-8 space-y-4 shadow-sm animate-fadeIn"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-500 mb-1">
                {lang === 'ar' ? 'الاسم' : 'Nom'} *
              </label>
              <input
                type="text"
                required
                value={newReviewName}
                onChange={(e) => setNewReviewName(e.target.value)}
                placeholder={lang === 'ar' ? 'الاسم الكامل' : 'Nom complet'}
                className="w-full bg-slate-50 border border-slate-200 text-slate-800 rounded-xl px-4 py-2.5 text-sm focus:bg-white focus:ring-2 focus:ring-[#B87333] focus:border-transparent outline-none transition-all"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-500 mb-1">
                {lang === 'ar' ? 'الولاية أو المدينة' : 'Wilaya / Ville'}
              </label>
              <input
                type="text"
                value={newReviewWilaya}
                onChange={(e) => setNewReviewWilaya(e.target.value)}
                placeholder={lang === 'ar' ? 'مثال: وهران' : 'Ex: Oran'}
                className="w-full bg-slate-50 border border-slate-200 text-slate-800 rounded-xl px-4 py-2.5 text-sm focus:bg-white focus:ring-2 focus:ring-[#B87333] focus:border-transparent outline-none transition-all"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-500 mb-1">
              {lang === 'ar' ? 'التقييم' : 'Note'}
            </label>
            <div className="flex gap-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  type="button"
                  key={star}
                  onClick={() => setNewReviewRating(star)}
                  className="p-1 focus:outline-none cursor-pointer"
                >
                  <Star
                    className={`w-6 h-6 ${
                      star <= newReviewRating
                        ? 'text-amber-400 fill-amber-400'
                        : 'text-slate-200'
                    }`}
                  />
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-500 mb-1">
              {lang === 'ar' ? 'التعليق' : 'Avis'} *
            </label>
            <textarea
              required
              rows={3}
              value={newReviewText}
              onChange={(e) => setNewReviewText(e.target.value)}
              placeholder={lang === 'ar' ? 'اكتب رأيك هنا بكل صراحة...' : 'Partagez votre expérience réelle...'}
              className="w-full bg-slate-50 border border-slate-200 text-slate-800 rounded-xl p-4 text-sm focus:bg-white focus:ring-2 focus:ring-[#B87333] focus:border-transparent outline-none resize-none transition-all"
            />
          </div>

          <button
            type="submit"
            className="px-6 py-2.5 bg-[#B87333] hover:bg-[#a36329] text-white rounded-xl text-sm font-bold hover:shadow-md transition-all cursor-pointer"
          >
            {lang === 'ar' ? 'نشر التقييم' : 'Publier l\'avis'}
          </button>
        </form>
      )}

      {/* Reviews Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6" id="reviews-items-grid">
        {reviews.map((rev) => (
          <div
            key={rev.id}
            className="bg-white border border-slate-200 p-6 rounded-2xl flex flex-col justify-between shadow-xs hover:shadow-sm hover:border-[#B87333]/30 transition-all duration-300"
          >
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-xl ${rev.avatarColor} flex items-center justify-center text-white font-bold text-sm font-sans shadow-xs`}>
                    {rev.name.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-[#1a1a1a] font-sans">
                      {rev.name}
                    </h4>
                    <span className="text-xs text-slate-400 font-sans">
                      {rev.wilaya}
                    </span>
                  </div>
                </div>

                <div className="flex flex-col items-end">
                  <div className="flex text-amber-400">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-3.5 h-3.5 ${
                          i < rev.rating ? 'fill-amber-400 text-amber-400' : 'text-slate-200'
                        }`}
                      />
                    ))}
                  </div>
                  <span className="text-[10px] text-slate-400 mt-1 font-sans">
                    {rev.date}
                  </span>
                </div>
              </div>

              <p className="text-slate-600 text-sm font-sans leading-relaxed text-right md:text-left" style={{ direction: rev.text.match(/[\u0600-\u06FF]/) ? 'rtl' : 'ltr' }}>
                {rev.text}
              </p>
            </div>

            <div className="flex items-center gap-1.5 text-[11px] text-emerald-600 font-sans font-semibold mt-4 pt-4 border-t border-slate-100">
              <CheckCircle className="w-3.5 h-3.5 fill-emerald-100/50" />
              <span>{t.verifiedBuyer}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
