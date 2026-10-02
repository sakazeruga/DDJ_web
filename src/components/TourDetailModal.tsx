import React, { useState } from 'react';
import { 
  X, 
  Clock, 
  MapPin, 
  Star, 
  Heart, 
  Flame, 
  CheckCircle2, 
  Calendar, 
  Users, 
  Tv, 
  Backpack, 
  Navigation,
  Send,
  Languages
} from 'lucide-react';
import confetti from 'canvas-confetti';
import type { Tour, TourReview, Booking, Language } from '../types';
import { translations } from '../i18n/translations';

interface TourDetailModalProps {
  tour: Tour | null;
  onClose: () => void;
  lang: Language;
  isFavorite: boolean;
  onToggleFavorite: (tourId: string, e: React.MouseEvent) => void;
  reviews: TourReview[];
  onAddReview: (review: Omit<TourReview, 'id' | 'date'>) => void;
  onAddBooking: (booking: Omit<Booking, 'id' | 'createdAt'>) => void;
}

export const TourDetailModal: React.FC<TourDetailModalProps> = ({
  tour,
  onClose,
  lang,
  isFavorite,
  onToggleFavorite,
  reviews,
  onAddReview,
  onAddBooking,
}) => {
  if (!tour) return null;
  const t = translations[lang];

  // Booking states
  const [bookingDate, setBookingDate] = useState<string>(() => {
    const d = new Date();
    d.setDate(d.getDate() + 7);
    return d.toISOString().split('T')[0];
  });
  const [guestsCount, setGuestsCount] = useState<number>(1);
  const [userName, setUserName] = useState<string>('');
  const [userEmail, setUserEmail] = useState<string>('');
  const [customRequest, setCustomRequest] = useState<string>('');
  const [isBooked, setIsBooked] = useState<boolean>(false);

  // Review states
  const [reviewRating, setReviewRating] = useState<number>(5);
  const [reviewerName, setReviewerName] = useState<string>('');
  const [reviewerCountry, setReviewerCountry] = useState<string>('Japan 🇯🇵');
  const [reviewComment, setReviewComment] = useState<string>('');
  const [reviewSubmitted, setReviewSubmitted] = useState<boolean>(false);

  // Filter reviews for this tour
  const tourReviews = reviews.filter((r) => r.tourId === tour.id);

  // Calculate total price
  const totalPrice = tour.price * guestsCount;

  // Handle booking submission
  const handleBookingSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!userName || !userEmail) {
      alert(lang === 'ja' ? 'お名前とメールアドレスを入力してください' : 'Please provide your name and email');
      return;
    }

    onAddBooking({
      tourId: tour.id,
      tourTitle: lang === 'ja' ? tour.title : tour.titleEn,
      tourImage: tour.imageUrl,
      date: bookingDate,
      participantsCount: guestsCount,
      totalPrice: totalPrice,
      userName: userName,
      userEmail: userEmail,
      customRequest: customRequest,
      status: 'confirmed',
    });

    // Launch celebratory confetti
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#2563eb', '#f43f5e', '#eab308'],
    });

    setIsBooked(true);
  };

  // Handle review submission
  const handleReviewSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reviewerName || !reviewComment) return;

    onAddReview({
      tourId: tour.id,
      userName: reviewerName,
      userCountry: reviewerCountry,
      rating: reviewRating,
      comment: reviewComment,
    });

    setReviewComment('');
    setReviewSubmitted(true);
    setTimeout(() => setReviewSubmitted(false), 4000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 md:p-6 bg-slate-900/60 backdrop-blur-sm overflow-y-auto">
      {/* Modal Container */}
      <div className="relative w-full max-w-5xl bg-white border border-slate-200 rounded-3xl shadow-2xl overflow-hidden my-auto max-h-[92vh] flex flex-col">
        {/* Sticky Header Bar */}
        <div className="sticky top-0 z-20 bg-white/95 backdrop-blur-md px-6 py-4 border-b border-slate-200 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-xs font-bold px-3 py-1 rounded-full bg-blue-50 text-blue-700 border border-blue-200">
              Lv.{tour.otakuLevel} {lang === 'ja' ? '熱量・マニア度' : 'Depth Level'}
            </span>
            <div className="text-xs text-slate-500 font-medium hidden sm:flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5 text-rose-500" />
              <span>{lang === 'ja' ? tour.area : tour.areaEn}</span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={(e) => onToggleFavorite(tour.id, e)}
              className={`p-2.5 rounded-xl border transition-all cursor-pointer ${
                isFavorite
                  ? 'bg-rose-500 text-white border-rose-500 shadow-sm'
                  : 'bg-slate-50 text-slate-700 border-slate-200 hover:text-rose-600'
              }`}
            >
              <Heart className={`w-4 h-4 ${isFavorite ? 'fill-current' : ''}`} />
            </button>
            <button
              onClick={onClose}
              className="p-2.5 rounded-xl bg-slate-50 hover:bg-slate-100 text-slate-500 hover:text-slate-800 border border-slate-200 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Scrollable Content Body */}
        <div className="overflow-y-auto p-4 sm:p-6 md:p-8 space-y-8 bg-slate-50">
          {/* Hero Banner & Gallery */}
          <div className="relative rounded-2xl overflow-hidden border border-slate-200 shadow-sm">
            <img
              src={tour.imageUrl}
              alt={lang === 'ja' ? tour.title : tour.titleEn}
              className="w-full h-64 sm:h-80 md:h-96 object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/20 to-transparent" />

            <div className="absolute bottom-6 left-6 right-6">
              <div className="flex flex-wrap items-center gap-2 mb-2">
                <span className="text-xs font-bold px-2.5 py-0.5 rounded bg-blue-600 text-white">
                  {lang === 'ja' ? tour.category : tour.category}
                </span>
                <div className="flex items-center gap-1 text-xs text-white bg-black/60 px-2.5 py-0.5 rounded backdrop-blur-sm">
                  <Languages className="w-3.5 h-3.5 text-blue-300" />
                  <span>{tour.languages.join(' / ')}</span>
                </div>
              </div>

              <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-white leading-tight mb-2">
                {lang === 'ja' ? tour.title : tour.titleEn}
              </h2>
              <p className="text-sm sm:text-base text-yellow-300 font-medium">
                {lang === 'ja' ? tour.catchphrase : tour.catchphraseEn}
              </p>
            </div>
          </div>

          {/* Main Grid: Left Details & Right Booking Form */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left 2 Columns: Tour Information */}
            <div className="lg:col-span-2 space-y-8">
              {/* Overview */}
              <section className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                <h3 className="text-lg font-bold text-slate-900 mb-3 flex items-center gap-2">
                  <Navigation className="w-5 h-5 text-blue-600" />
                  <span>{t.tourDetail.overview}</span>
                </h3>
                <p className="text-slate-700 text-sm sm:text-base leading-relaxed whitespace-pre-line font-normal">
                  {lang === 'ja' ? tour.description : tour.descriptionEn}
                </p>

                {/* Quick Spec Pills */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6 pt-6 border-t border-slate-100">
                  <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 text-center">
                    <Clock className="w-4 h-4 text-blue-600 mx-auto mb-1" />
                    <div className="text-[10px] text-slate-500 font-medium">{t.filter.duration}</div>
                    <div className="text-sm font-bold text-slate-900">{tour.durationHours} 時間</div>
                  </div>
                  <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 text-center">
                    <Users className="w-4 h-4 text-emerald-600 mx-auto mb-1" />
                    <div className="text-[10px] text-slate-500 font-medium">定員</div>
                    <div className="text-sm font-bold text-slate-900">最大 {tour.maxParticipants}名</div>
                  </div>
                  <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 text-center">
                    <Flame className="w-4 h-4 text-rose-600 mx-auto mb-1" />
                    <div className="text-[10px] text-slate-500 font-medium">マニア度</div>
                    <div className="text-sm font-bold text-slate-900">Lv.{tour.otakuLevel} / 5</div>
                  </div>
                  <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 text-center">
                    <Star className="w-4 h-4 text-amber-500 mx-auto mb-1 fill-amber-500" />
                    <div className="text-[10px] text-slate-500 font-medium">評価</div>
                    <div className="text-sm font-bold text-slate-900">{tour.rating} ({tour.reviewsCount})</div>
                  </div>
                </div>
              </section>

              {/* Guide Profile */}
              <section className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
                  <Users className="w-5 h-5 text-blue-600" />
                  <span>{t.tourDetail.guideInfo}</span>
                </h3>
                <div className="flex flex-col sm:flex-row items-start gap-4">
                  <img
                    src={tour.guide.avatar}
                    alt={tour.guide.name}
                    className="w-16 h-16 rounded-2xl object-cover border border-slate-200 shadow-sm"
                  />
                  <div className="flex-1">
                    <div className="flex items-center justify-between flex-wrap gap-2">
                      <div>
                        <h4 className="text-base font-bold text-slate-900">
                          {lang === 'ja' ? tour.guide.name : tour.guide.nameEn}
                        </h4>
                        <div className="text-xs text-blue-600 font-bold">
                          {lang === 'ja' ? tour.guide.role : tour.guide.roleEn}
                        </div>
                      </div>
                      <div className="flex items-center gap-2 text-xs bg-slate-50 px-3 py-1.5 rounded-full border border-slate-200">
                        <span className="text-slate-500">{t.tourDetail.otakuHistory}:</span>
                        <span className="text-blue-700 font-bold">{tour.guide.otakuYears}年</span>
                      </div>
                    </div>

                    <p className="text-xs sm:text-sm text-slate-600 mt-2.5 leading-relaxed">
                      {lang === 'ja' ? tour.guide.bio : tour.guide.bioEn}
                    </p>

                    {/* Specialties */}
                    <div className="flex flex-wrap gap-1.5 mt-3">
                      {tour.guide.specialties.map((spec) => (
                        <span
                          key={spec}
                          className="text-[11px] px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200 font-medium"
                        >
                          ✦ {spec}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </section>

              {/* Itinerary Timeline */}
              <section className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                <h3 className="text-lg font-bold text-slate-900 mb-6 flex items-center gap-2">
                  <Clock className="w-5 h-5 text-blue-600" />
                  <span>{t.tourDetail.itinerary}</span>
                </h3>

                <div className="relative pl-6 space-y-6 before:absolute before:left-2 before:top-2 before:bottom-2 before:w-0.5 before:bg-blue-200">
                  {tour.itinerary.map((item, idx) => (
                    <div key={idx} className="relative">
                      {/* Timeline dot */}
                      <div className="absolute -left-[27px] top-1.5 w-4 h-4 rounded-full bg-white border-2 border-blue-600 flex items-center justify-center">
                        <div className="w-1.5 h-1.5 rounded-full bg-blue-600" />
                      </div>

                      <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 hover:border-blue-300 transition-colors">
                        <div className="flex items-center justify-between flex-wrap gap-2 mb-1">
                          <span className="text-xs font-bold text-blue-700 px-2.5 py-0.5 rounded bg-blue-100 border border-blue-200">
                            {item.time}
                          </span>
                          {item.isDeepSpot && (
                            <span className="text-[11px] font-bold px-2 py-0.5 rounded bg-rose-100 text-rose-800 border border-rose-200 flex items-center gap-1">
                              <Flame className="w-3 h-3 text-rose-600" />
                              {lang === 'ja' ? '注目ポイント' : 'Highlight Spot'}
                            </span>
                          )}
                        </div>

                        <h4 className="font-bold text-slate-900 text-sm sm:text-base mt-1">
                          {lang === 'ja' ? item.spotTitle : item.spotTitleEn}
                        </h4>

                        <p className="text-xs sm:text-sm text-slate-600 mt-1 leading-relaxed">
                          {lang === 'ja' ? item.description : item.descriptionEn}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </section>

              {/* Prep & Items */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Background Context */}
                <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
                  <div className="flex items-center gap-2 text-sm font-bold text-indigo-700 mb-2">
                    <Tv className="w-4 h-4 text-indigo-600" />
                    <span>{t.tourDetail.prepRecommendation}</span>
                  </div>
                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                    {lang === 'ja' ? tour.recommendedPreparation : tour.recommendedPreparationEn}
                  </p>
                </div>

                {/* What to Bring */}
                <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
                  <div className="flex items-center gap-2 text-sm font-bold text-emerald-700 mb-2">
                    <Backpack className="w-4 h-4 text-emerald-600" />
                    <span>{t.tourDetail.mustBring}</span>
                  </div>
                  <ul className="space-y-1.5 text-xs sm:text-sm text-slate-600">
                    {(lang === 'ja' ? tour.mustBring : tour.mustBringEn).map((item, idx) => (
                      <li key={idx} className="flex items-center gap-1.5">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Meeting Point & Inclusions */}
              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-3">
                <div className="flex items-center gap-2 text-sm font-bold text-slate-900">
                  <MapPin className="w-4 h-4 text-rose-500" />
                  <span>{t.tourDetail.meetingPlace}:</span>
                  <span className="text-slate-700 font-normal">
                    {lang === 'ja' ? tour.meetingPoint : tour.meetingPointEn}
                  </span>
                </div>

                <div className="pt-2 border-t border-slate-100 flex flex-wrap gap-2 text-xs text-slate-500">
                  <span className="font-bold text-slate-700">{t.tourDetail.included}:</span>
                  {(lang === 'ja' ? tour.included : tour.includedEn).map((inc, i) => (
                    <span key={i} className="px-2.5 py-0.5 rounded bg-slate-100 border border-slate-200 text-slate-700 font-medium">
                      ✓ {inc}
                    </span>
                  ))}
                </div>
              </div>

              {/* Reviews Section */}
              <section className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Star className="w-5 h-5 text-amber-500 fill-amber-500" />
                    <span>{t.tourDetail.reviews} ({tourReviews.length})</span>
                  </div>
                  <span className="text-sm font-bold text-amber-600">★ {tour.rating}</span>
                </h3>

                {/* Existing Reviews List */}
                <div className="space-y-3 mb-6">
                  {tourReviews.length === 0 ? (
                    <p className="text-xs text-slate-500 italic">
                      {lang === 'ja' ? 'まだレビューはありません。最初の参加者になりましょう！' : 'No reviews yet. Be the first to join!'}
                    </p>
                  ) : (
                    tourReviews.map((rev) => (
                      <div key={rev.id} className="bg-slate-50 p-4 rounded-xl border border-slate-200">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-bold text-slate-900">{rev.userName}</span>
                            <span className="text-[11px] text-slate-500">{rev.userCountry}</span>
                          </div>
                          <div className="flex items-center gap-0.5 text-amber-500 text-xs">
                            {Array.from({ length: rev.rating }).map((_, i) => (
                              <Star key={i} className="w-3 h-3 fill-current" />
                            ))}
                          </div>
                        </div>
                        <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">{rev.comment}</p>
                        <div className="text-[10px] text-slate-400 mt-2">{rev.date}</div>
                      </div>
                    ))
                  )}
                </div>

                {/* Write Review Form */}
                <form onSubmit={handleReviewSubmit} className="bg-slate-50 p-4 rounded-xl border border-slate-200">
                  <h4 className="text-sm font-bold text-slate-900 mb-1">{t.tourDetail.writeReview}</h4>
                  <p className="text-xs text-slate-500 mb-3">{t.tourDetail.writeReviewDesc}</p>

                  {reviewSubmitted && (
                    <div className="mb-3 p-2 bg-emerald-50 border border-emerald-200 rounded-lg text-emerald-800 text-xs font-medium">
                      {lang === 'ja' ? 'レビューを投稿しました！ありがとうございます。' : 'Review submitted! Thank you!'}
                    </div>
                  )}

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-3">
                    <input
                      type="text"
                      placeholder={lang === 'ja' ? 'お名前' : 'Your Name'}
                      value={reviewerName}
                      onChange={(e) => setReviewerName(e.target.value)}
                      required
                      className="bg-white border border-slate-200 text-xs rounded-lg px-3 py-2 text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-500"
                    />
                    <select
                      value={reviewerCountry}
                      onChange={(e) => setReviewerCountry(e.target.value)}
                      className="bg-white border border-slate-200 text-xs rounded-lg px-3 py-2 text-slate-900"
                    >
                      <option value="Japan 🇯🇵">Japan 🇯🇵</option>
                      <option value="USA 🇺🇸">USA 🇺🇸</option>
                      <option value="Australia 🇦🇺">Australia 🇦🇺</option>
                      <option value="UK 🇬🇧">UK 🇬🇧</option>
                      <option value="Taiwan 🇹🇼">Taiwan 🇹🇼</option>
                      <option value="Germany 🇩🇪">Germany 🇩🇪</option>
                    </select>
                  </div>

                  <div className="flex items-center gap-2 mb-3">
                    <span className="text-xs text-slate-500">評価:</span>
                    <div className="flex items-center gap-1">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          type="button"
                          key={star}
                          onClick={() => setReviewRating(star)}
                          className={`p-1 cursor-pointer ${reviewRating >= star ? 'text-amber-500' : 'text-slate-300'}`}
                        >
                          <Star className={`w-4 h-4 ${reviewRating >= star ? 'fill-current' : ''}`} />
                        </button>
                      ))}
                    </div>
                  </div>

                  <textarea
                    rows={2}
                    placeholder={lang === 'ja' ? 'ツアーの感想やガイドへの応援メッセージをどうぞ...' : 'Write your review...'}
                    value={reviewComment}
                    onChange={(e) => setReviewComment(e.target.value)}
                    required
                    className="w-full bg-white border border-slate-200 text-xs rounded-lg p-2.5 text-slate-900 placeholder-slate-400 mb-3 focus:outline-none focus:border-blue-500"
                  />

                  <button
                    type="submit"
                    className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold transition-colors cursor-pointer"
                  >
                    {lang === 'ja' ? 'レビューを送信' : 'Post Review'}
                  </button>
                </form>
              </section>
            </div>

            {/* Right Column: Booking Widget Card */}
            <div className="lg:col-span-1">
              <div className="sticky top-20 bg-white p-6 rounded-2xl border border-slate-200 shadow-xl">
                {isBooked ? (
                  <div className="text-center py-6 space-y-4 relative overflow-hidden">
                    {/* Stamp overlay */}
                    <div className="w-20 h-20 mx-auto stamp-seal">
                      <img
                        src="/assets/seichi_stamp.jpg"
                        alt="巡礼済スタンプ"
                        className="w-full h-full object-contain rounded-full shadow-md"
                      />
                    </div>
                    <div className="inline-block px-3 py-1 rounded-full bg-blue-100 text-blue-800 text-xs font-bold border border-blue-200">
                      ★ 予約リクエスト受付完了 ★
                    </div>
                    <h4 className="text-xl font-black text-slate-900">{t.bookingModal.successTitle}</h4>
                    <p className="text-xs text-slate-600 leading-relaxed">
                      {t.bookingModal.successDesc}
                    </p>
                    <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 text-left space-y-1.5 text-xs font-mono">
                      <div className="text-blue-700 font-bold border-b border-slate-200 pb-1 mb-2">
                        PASS #DDJ-{tour.id.toUpperCase()}-VERIFIED
                      </div>
                      <div className="text-slate-500">参加日: <span className="text-slate-900 font-bold">{bookingDate}</span></div>
                      <div className="text-slate-500">人数: <span className="text-slate-900 font-bold">{guestsCount}名</span></div>
                      <div className="text-slate-500">合計: <span className="text-blue-600 font-black text-sm">¥{totalPrice.toLocaleString()}</span></div>
                      <div className="text-slate-500">ガイド: <span className="text-slate-900 font-bold">{tour.guide.name}</span></div>
                    </div>
                    <button
                      onClick={() => setIsBooked(false)}
                      className="text-xs text-blue-600 hover:underline pt-2 inline-block cursor-pointer font-bold"
                    >
                      {lang === 'ja' ? '← 別の日程でリクエストする' : '← Book another date'}
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleBookingSubmit} className="space-y-4">
                    <div className="flex items-baseline justify-between border-b border-slate-100 pb-4">
                      <div>
                        <span className="text-2xl font-black text-slate-900">¥{tour.price.toLocaleString()}</span>
                        <span className="text-xs text-slate-500 ml-1">{t.tourCard.perPerson}</span>
                      </div>
                      <div className="text-xs text-emerald-600 font-bold bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                        リクエスト受付中
                      </div>
                    </div>

                    {/* Date Picker */}
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1 flex items-center gap-1.5">
                        <Calendar className="w-3.5 h-3.5 text-blue-600" />
                        <span>{t.bookingModal.date}</span>
                      </label>
                      <input
                        type="date"
                        value={bookingDate}
                        onChange={(e) => setBookingDate(e.target.value)}
                        required
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-xs text-slate-900 focus:outline-none focus:border-blue-500 focus:bg-white"
                      />
                    </div>

                    {/* Guests count */}
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1 flex items-center gap-1.5">
                        <Users className="w-3.5 h-3.5 text-indigo-600" />
                        <span>{t.bookingModal.participants} (最大 {tour.maxParticipants}名)</span>
                      </label>
                      <div className="flex items-center gap-3 bg-slate-50 border border-slate-200 rounded-xl p-1.5">
                        <button
                          type="button"
                          onClick={() => setGuestsCount(Math.max(1, guestsCount - 1))}
                          className="w-8 h-8 rounded-lg bg-white border border-slate-200 text-slate-700 font-bold hover:bg-slate-100 flex items-center justify-center cursor-pointer shadow-xs"
                        >
                          -
                        </button>
                        <span className="flex-1 text-center font-bold text-slate-900 text-sm">
                          {guestsCount} 名
                        </span>
                        <button
                          type="button"
                          onClick={() => setGuestsCount(Math.min(tour.maxParticipants, guestsCount + 1))}
                          className="w-8 h-8 rounded-lg bg-white border border-slate-200 text-slate-700 font-bold hover:bg-slate-100 flex items-center justify-center cursor-pointer shadow-xs"
                        >
                          +
                        </button>
                      </div>
                    </div>

                    {/* Guest Information */}
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        {t.bookingModal.name}
                      </label>
                      <input
                        type="text"
                        placeholder="例: 山田 太郎 / Ken"
                        value={userName}
                        onChange={(e) => setUserName(e.target.value)}
                        required
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-500 focus:bg-white"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        {t.bookingModal.email}
                      </label>
                      <input
                        type="email"
                        placeholder="example@deepdivejapan.com"
                        value={userEmail}
                        onChange={(e) => setUserEmail(e.target.value)}
                        required
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-500 focus:bg-white"
                      />
                    </div>

                    {/* Custom Request */}
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        {t.bookingModal.customMessage}
                      </label>
                      <textarea
                        rows={2}
                        placeholder={t.bookingModal.customMessagePlaceholder}
                        value={customRequest}
                        onChange={(e) => setCustomRequest(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-500 focus:bg-white"
                      />
                    </div>

                    {/* Price Calculation Box */}
                    <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 space-y-1.5 text-xs">
                      <div className="flex justify-between text-slate-500">
                        <span>¥{tour.price.toLocaleString()} × {guestsCount}名</span>
                        <span>¥{totalPrice.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between font-bold text-slate-900 pt-2 border-t border-slate-200 text-sm">
                        <span>{t.bookingModal.totalPrice}</span>
                        <span className="text-blue-600 font-black">¥{totalPrice.toLocaleString()}</span>
                      </div>
                    </div>

                    {/* Submit Button */}
                    <button
                      type="submit"
                      className="w-full py-3.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-sm shadow-md shadow-blue-500/20 transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-95"
                    >
                      <Send className="w-4 h-4" />
                      <span>{t.bookingModal.submit}</span>
                    </button>

                    <p className="text-[11px] text-slate-400 text-center leading-tight">
                      {lang === 'ja' 
                        ? '※送信後、ガイドとのチャットが開始され、集合場所等の詳細を直接相談できます。' 
                        : '※Direct chat opens upon booking to coordinate final itinerary details.'}
                    </p>
                  </form>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
