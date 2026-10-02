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
  Sparkles, 
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
      colors: ['#a855f7', '#ec4899', '#06b6d4'],
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 md:p-6 bg-slate-950/80 backdrop-blur-md overflow-y-auto">
      {/* Modal Container */}
      <div className="relative w-full max-w-5xl bg-slate-900 border border-slate-700/80 rounded-3xl shadow-2xl overflow-hidden my-auto max-h-[92vh] flex flex-col">
        {/* Sticky Header Bar */}
        <div className="sticky top-0 z-20 bg-slate-950/90 backdrop-blur-md px-6 py-4 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-xs font-bold px-3 py-1 rounded-full bg-purple-900/60 text-purple-300 border border-purple-500/40">
              Lv.{tour.otakuLevel} {lang === 'ja' ? 'オタク度' : 'Otaku Depth'}
            </span>
            <div className="text-xs text-slate-400 font-medium hidden sm:flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5 text-cyan-400" />
              <span>{lang === 'ja' ? tour.area : tour.areaEn}</span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={(e) => onToggleFavorite(tour.id, e)}
              className={`p-2.5 rounded-xl border transition-all ${
                isFavorite
                  ? 'bg-pink-600 text-white border-pink-500 shadow-md shadow-pink-600/30'
                  : 'bg-slate-900 text-slate-300 border-slate-800 hover:text-white'
              }`}
            >
              <Heart className={`w-4 h-4 ${isFavorite ? 'fill-current' : ''}`} />
            </button>
            <button
              onClick={onClose}
              className="p-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-white border border-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Scrollable Content Body */}
        <div className="overflow-y-auto p-4 sm:p-6 md:p-8 space-y-8">
          {/* Hero Banner & Gallery */}
          <div className="relative rounded-2xl overflow-hidden border border-slate-800">
            <img
              src={tour.imageUrl}
              alt={lang === 'ja' ? tour.title : tour.titleEn}
              className="w-full h-64 sm:h-80 md:h-96 object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />

            <div className="absolute bottom-6 left-6 right-6">
              <div className="flex flex-wrap items-center gap-2 mb-2">
                <span className="text-xs font-bold px-2.5 py-0.5 rounded bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                  {lang === 'ja' ? tour.category : tour.category}
                </span>
                <div className="flex items-center gap-1 text-xs text-slate-300 bg-slate-950/80 px-2.5 py-0.5 rounded border border-slate-800">
                  <Languages className="w-3.5 h-3.5 text-cyan-400" />
                  <span>{tour.languages.join(' / ')}</span>
                </div>
              </div>

              <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-white leading-tight mb-2">
                {lang === 'ja' ? tour.title : tour.titleEn}
              </h2>
              <p className="text-sm sm:text-base text-cyan-200 font-medium">
                {lang === 'ja' ? tour.catchphrase : tour.catchphraseEn}
              </p>
            </div>
          </div>

          {/* Main Grid: Left Details & Right Booking Form */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left 2 Columns: Tour Information */}
            <div className="lg:col-span-2 space-y-8">
              {/* Overview */}
              <section className="bg-slate-950/60 p-6 rounded-2xl border border-slate-800/80">
                <h3 className="text-lg font-bold text-white mb-3 flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-purple-400" />
                  <span>{t.tourDetail.overview}</span>
                </h3>
                <p className="text-slate-300 text-sm sm:text-base leading-relaxed whitespace-pre-line">
                  {lang === 'ja' ? tour.description : tour.descriptionEn}
                </p>

                {/* Quick Spec Pills */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6 pt-6 border-t border-slate-800">
                  <div className="bg-slate-900 p-3 rounded-xl border border-slate-800 text-center">
                    <Clock className="w-4 h-4 text-purple-400 mx-auto mb-1" />
                    <div className="text-[10px] text-slate-400">{t.filter.duration}</div>
                    <div className="text-sm font-bold text-white">{tour.durationHours} 時間</div>
                  </div>
                  <div className="bg-slate-900 p-3 rounded-xl border border-slate-800 text-center">
                    <Users className="w-4 h-4 text-cyan-400 mx-auto mb-1" />
                    <div className="text-[10px] text-slate-400">定員</div>
                    <div className="text-sm font-bold text-white">最大 {tour.maxParticipants}名</div>
                  </div>
                  <div className="bg-slate-900 p-3 rounded-xl border border-slate-800 text-center">
                    <Flame className="w-4 h-4 text-pink-400 mx-auto mb-1" />
                    <div className="text-[10px] text-slate-400">オタク度</div>
                    <div className="text-sm font-bold text-white">Lv.{tour.otakuLevel} / 5</div>
                  </div>
                  <div className="bg-slate-900 p-3 rounded-xl border border-slate-800 text-center">
                    <Star className="w-4 h-4 text-amber-400 mx-auto mb-1 fill-amber-400" />
                    <div className="text-[10px] text-slate-400">評価</div>
                    <div className="text-sm font-bold text-white">{tour.rating} ({tour.reviewsCount})</div>
                  </div>
                </div>
              </section>

              {/* Guide Profile */}
              <section className="bg-gradient-to-r from-purple-950/40 via-slate-900 to-slate-950 p-6 rounded-2xl border border-purple-500/30">
                <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                  <Users className="w-5 h-5 text-purple-400" />
                  <span>{t.tourDetail.guideInfo}</span>
                </h3>
                <div className="flex flex-col sm:flex-row items-start gap-4">
                  <img
                    src={tour.guide.avatar}
                    alt={tour.guide.name}
                    className="w-16 h-16 rounded-2xl object-cover border-2 border-purple-500/60 shadow-lg"
                  />
                  <div className="flex-1">
                    <div className="flex items-center justify-between flex-wrap gap-2">
                      <div>
                        <h4 className="text-base font-bold text-white">
                          {lang === 'ja' ? tour.guide.name : tour.guide.nameEn}
                        </h4>
                        <div className="text-xs text-purple-300 font-medium">
                          {lang === 'ja' ? tour.guide.role : tour.guide.roleEn}
                        </div>
                      </div>
                      <div className="flex items-center gap-2 text-xs bg-slate-950 px-3 py-1.5 rounded-full border border-slate-800">
                        <span className="text-slate-400">{t.tourDetail.otakuHistory}:</span>
                        <span className="text-pink-400 font-bold">{tour.guide.otakuYears}年</span>
                      </div>
                    </div>

                    <p className="text-xs sm:text-sm text-slate-300 mt-2.5 leading-relaxed">
                      {lang === 'ja' ? tour.guide.bio : tour.guide.bioEn}
                    </p>

                    {/* Specialties */}
                    <div className="flex flex-wrap gap-1.5 mt-3">
                      {tour.guide.specialties.map((spec) => (
                        <span
                          key={spec}
                          className="text-[11px] px-2 py-0.5 rounded-md bg-purple-900/40 text-purple-200 border border-purple-500/30 font-medium"
                        >
                          ✦ {spec}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </section>

              {/* Itinerary Timeline */}
              <section className="bg-slate-950/60 p-6 rounded-2xl border border-slate-800/80">
                <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
                  <Navigation className="w-5 h-5 text-cyan-400" />
                  <span>{t.tourDetail.itinerary}</span>
                </h3>

                <div className="relative pl-6 space-y-8 before:absolute before:left-2 before:top-2 before:bottom-2 before:w-0.5 before:bg-gradient-to-b before:from-cyan-500 before:via-purple-500 before:to-pink-500">
                  {tour.itinerary.map((item, idx) => (
                    <div key={idx} className="relative">
                      {/* Timeline dot */}
                      <div className="absolute -left-[27px] top-1 w-4 h-4 rounded-full bg-slate-900 border-2 border-cyan-400 flex items-center justify-center">
                        <div className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
                      </div>

                      <div className="bg-slate-900/90 p-4 rounded-xl border border-slate-800 hover:border-slate-700 transition-colors">
                        <div className="flex items-center justify-between flex-wrap gap-2 mb-1">
                          <span className="text-xs font-bold text-cyan-400 px-2 py-0.5 rounded bg-cyan-950/60 border border-cyan-500/40">
                            {item.time}
                          </span>
                          {item.isDeepSpot && (
                            <span className="text-[11px] font-bold px-2 py-0.5 rounded bg-pink-900/60 text-pink-300 border border-pink-500/40 flex items-center gap-1">
                              <Flame className="w-3 h-3" />
                              {lang === 'ja' ? '超ディープスポット' : 'Deep Lore Spot'}
                            </span>
                          )}
                        </div>

                        <h4 className="font-bold text-white text-sm sm:text-base mt-1">
                          {lang === 'ja' ? item.spotTitle : item.spotTitleEn}
                        </h4>

                        <p className="text-xs sm:text-sm text-slate-300 mt-1 leading-relaxed">
                          {lang === 'ja' ? item.description : item.descriptionEn}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </section>

              {/* Prep & Items */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Anime Prep */}
                <div className="bg-slate-950/60 p-5 rounded-2xl border border-slate-800">
                  <div className="flex items-center gap-2 text-sm font-bold text-purple-300 mb-2">
                    <Tv className="w-4 h-4 text-purple-400" />
                    <span>{t.tourDetail.prepRecommendation}</span>
                  </div>
                  <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                    {lang === 'ja' ? tour.recommendedPreparation : tour.recommendedPreparationEn}
                  </p>
                </div>

                {/* What to Bring */}
                <div className="bg-slate-950/60 p-5 rounded-2xl border border-slate-800">
                  <div className="flex items-center gap-2 text-sm font-bold text-cyan-300 mb-2">
                    <Backpack className="w-4 h-4 text-cyan-400" />
                    <span>{t.tourDetail.mustBring}</span>
                  </div>
                  <ul className="space-y-1 text-xs sm:text-sm text-slate-300">
                    {(lang === 'ja' ? tour.mustBring : tour.mustBringEn).map((item, idx) => (
                      <li key={idx} className="flex items-center gap-1.5">
                        <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400 flex-shrink-0" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Meeting Point & Inclusions */}
              <div className="bg-slate-950/60 p-5 rounded-2xl border border-slate-800 space-y-3">
                <div className="flex items-center gap-2 text-sm font-bold text-white">
                  <MapPin className="w-4 h-4 text-pink-400" />
                  <span>{t.tourDetail.meetingPlace}:</span>
                  <span className="text-slate-300 font-normal">
                    {lang === 'ja' ? tour.meetingPoint : tour.meetingPointEn}
                  </span>
                </div>

                <div className="pt-2 border-t border-slate-850 flex flex-wrap gap-2 text-xs text-slate-400">
                  <span className="font-semibold text-slate-300">{t.tourDetail.included}:</span>
                  {(lang === 'ja' ? tour.included : tour.includedEn).map((inc, i) => (
                    <span key={i} className="px-2 py-0.5 rounded bg-slate-900 border border-slate-800 text-slate-300">
                      ✓ {inc}
                    </span>
                  ))}
                </div>
              </div>

              {/* Reviews Section */}
              <section className="bg-slate-950/60 p-6 rounded-2xl border border-slate-800/80">
                <h3 className="text-lg font-bold text-white mb-4 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Star className="w-5 h-5 text-amber-400 fill-amber-400" />
                    <span>{t.tourDetail.reviews} ({tourReviews.length})</span>
                  </div>
                  <span className="text-sm font-bold text-amber-400">★ {tour.rating}</span>
                </h3>

                {/* Existing Reviews List */}
                <div className="space-y-3 mb-6">
                  {tourReviews.length === 0 ? (
                    <p className="text-xs text-slate-400 italic">
                      {lang === 'ja' ? 'まだレビューはありません。最初の参加者になりましょう！' : 'No reviews yet. Be the first to join!'}
                    </p>
                  ) : (
                    tourReviews.map((rev) => (
                      <div key={rev.id} className="bg-slate-900 p-4 rounded-xl border border-slate-800">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-bold text-white">{rev.userName}</span>
                            <span className="text-[11px] text-slate-400">{rev.userCountry}</span>
                          </div>
                          <div className="flex items-center gap-0.5 text-amber-400 text-xs">
                            {Array.from({ length: rev.rating }).map((_, i) => (
                              <Star key={i} className="w-3 h-3 fill-current" />
                            ))}
                          </div>
                        </div>
                        <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">{rev.comment}</p>
                        <div className="text-[10px] text-slate-400 mt-2">{rev.date}</div>
                      </div>
                    ))
                  )}
                </div>

                {/* Write Review Form */}
                <form onSubmit={handleReviewSubmit} className="bg-slate-900/80 p-4 rounded-xl border border-slate-800">
                  <h4 className="text-sm font-bold text-white mb-1">{t.tourDetail.writeReview}</h4>
                  <p className="text-xs text-slate-400 mb-3">{t.tourDetail.writeReviewDesc}</p>

                  {reviewSubmitted && (
                    <div className="mb-3 p-2 bg-emerald-950/80 border border-emerald-500/40 rounded-lg text-emerald-300 text-xs font-medium">
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
                      className="bg-slate-950 border border-slate-800 text-xs rounded-lg px-3 py-2 text-white placeholder-slate-400"
                    />
                    <select
                      value={reviewerCountry}
                      onChange={(e) => setReviewerCountry(e.target.value)}
                      className="bg-slate-950 border border-slate-800 text-xs rounded-lg px-3 py-2 text-white"
                    >
                      <option value="Japan 🇯🇵">Japan 🇯🇵</option>
                      <option value="USA 🇺🇸">USA 🇺🇸</option>
                      <option value="Taiwan 🇹🇼">Taiwan 🇹🇼</option>
                      <option value="France 🇫🇷">France 🇫🇷</option>
                      <option value="UK 🇬🇧">UK 🇬🇧</option>
                      <option value="Germany 🇩🇪">Germany 🇩🇪</option>
                    </select>
                  </div>

                  <div className="flex items-center gap-2 mb-3">
                    <span className="text-xs text-slate-400">評価:</span>
                    <div className="flex items-center gap-1">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          type="button"
                          key={star}
                          onClick={() => setReviewRating(star)}
                          className={`p-1 ${reviewRating >= star ? 'text-amber-400' : 'text-slate-600'}`}
                        >
                          <Star className={`w-4 h-4 ${reviewRating >= star ? 'fill-current' : ''}`} />
                        </button>
                      ))}
                    </div>
                  </div>

                  <textarea
                    rows={2}
                    placeholder={lang === 'ja' ? 'ツアーの感想やガイドのディープ知識への感動をどうぞ...' : 'Write your review...'}
                    value={reviewComment}
                    onChange={(e) => setReviewComment(e.target.value)}
                    required
                    className="w-full bg-slate-950 border border-slate-800 text-xs rounded-lg p-2.5 text-white placeholder-slate-400 mb-3"
                  />

                  <button
                    type="submit"
                    className="px-4 py-2 rounded-lg bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold transition-colors cursor-pointer"
                  >
                    {lang === 'ja' ? 'レビューを送信' : 'Post Review'}
                  </button>
                </form>
              </section>
            </div>

            {/* Right Column: Booking Widget Card */}
            <div className="lg:col-span-1">
              <div className="sticky top-20 bg-slate-950 p-6 rounded-2xl border-2 border-purple-500/40 shadow-2xl shadow-purple-950/40">
                {isBooked ? (
                  <div className="text-center py-6 space-y-4 relative overflow-hidden">
                    {/* Stamp overlay */}
                    <div className="w-20 h-20 mx-auto stamp-seal">
                      <img
                        src="/assets/seichi_stamp.jpg"
                        alt="聖地巡礼 済"
                        className="w-full h-full object-contain rounded-full shadow-lg"
                      />
                    </div>
                    <div className="otaku-badge-yellow inline-block px-3 py-1 rounded-full text-xs font-black">
                      ★ 聖地巡礼パス発券完了 ★
                    </div>
                    <h4 className="text-xl font-black text-white">{t.bookingModal.successTitle}</h4>
                    <p className="text-xs text-slate-300 leading-relaxed">
                      {t.bookingModal.successDesc}
                    </p>
                    <div className="bg-slate-900 p-4 rounded-2xl border-2 border-slate-700 text-left space-y-1.5 text-xs font-mono">
                      <div className="text-yellow-400 font-bold border-b border-slate-800 pb-1 mb-2">
                        PASS #DDJ-{tour.id.toUpperCase()}-VERIFIED
                      </div>
                      <div className="text-slate-400">参加日: <span className="text-white font-bold">{bookingDate}</span></div>
                      <div className="text-slate-400">人数: <span className="text-white font-bold">{guestsCount}名</span></div>
                      <div className="text-slate-400">合計: <span className="text-yellow-400 font-black text-sm">¥{totalPrice.toLocaleString()}</span></div>
                      <div className="text-slate-400">ガイド: <span className="text-purple-300 font-bold">{tour.guide.name}</span></div>
                    </div>
                    <button
                      onClick={() => setIsBooked(false)}
                      className="text-xs text-yellow-400 hover:underline pt-2 inline-block cursor-pointer font-bold"
                    >
                      {lang === 'ja' ? '← 別の日程でリクエストする' : '← Book another date'}
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleBookingSubmit} className="space-y-4">
                    <div className="flex items-baseline justify-between border-b border-slate-800 pb-4">
                      <div>
                        <span className="text-2xl font-black text-cyan-400">¥{tour.price.toLocaleString()}</span>
                        <span className="text-xs text-slate-400 ml-1">{t.tourCard.perPerson}</span>
                      </div>
                      <div className="text-xs text-emerald-400 font-medium">即時リクエスト受付中</div>
                    </div>

                    {/* Date Picker */}
                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1 flex items-center gap-1.5">
                        <Calendar className="w-3.5 h-3.5 text-cyan-400" />
                        <span>{t.bookingModal.date}</span>
                      </label>
                      <input
                        type="date"
                        value={bookingDate}
                        onChange={(e) => setBookingDate(e.target.value)}
                        required
                        className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none focus:border-cyan-400"
                      />
                    </div>

                    {/* Guests count */}
                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1 flex items-center gap-1.5">
                        <Users className="w-3.5 h-3.5 text-purple-400" />
                        <span>{t.bookingModal.participants} (最大 {tour.maxParticipants}名)</span>
                      </label>
                      <div className="flex items-center gap-3 bg-slate-900 border border-slate-800 rounded-xl p-1.5">
                        <button
                          type="button"
                          onClick={() => setGuestsCount(Math.max(1, guestsCount - 1))}
                          className="w-8 h-8 rounded-lg bg-slate-800 text-white font-bold hover:bg-slate-700 flex items-center justify-center cursor-pointer"
                        >
                          -
                        </button>
                        <span className="flex-1 text-center font-bold text-white text-sm">
                          {guestsCount} 名
                        </span>
                        <button
                          type="button"
                          onClick={() => setGuestsCount(Math.min(tour.maxParticipants, guestsCount + 1))}
                          className="w-8 h-8 rounded-lg bg-slate-800 text-white font-bold hover:bg-slate-700 flex items-center justify-center cursor-pointer"
                        >
                          +
                        </button>
                      </div>
                    </div>

                    {/* Guest Information */}
                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1">
                        {t.bookingModal.name}
                      </label>
                      <input
                        type="text"
                        placeholder="例: 山田 太郎 / Kenji"
                        value={userName}
                        onChange={(e) => setUserName(e.target.value)}
                        required
                        className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-400 focus:outline-none focus:border-cyan-400"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1">
                        {t.bookingModal.email}
                      </label>
                      <input
                        type="email"
                        placeholder="example@deepdivejapan.com"
                        value={userEmail}
                        onChange={(e) => setUserEmail(e.target.value)}
                        required
                        className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-400 focus:outline-none focus:border-cyan-400"
                      />
                    </div>

                    {/* Custom Request */}
                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1">
                        {t.bookingModal.customMessage}
                      </label>
                      <textarea
                        rows={2}
                        placeholder={t.bookingModal.customMessagePlaceholder}
                        value={customRequest}
                        onChange={(e) => setCustomRequest(e.target.value)}
                        className="w-full bg-slate-900 border border-slate-800 rounded-xl p-2.5 text-xs text-white placeholder-slate-400 focus:outline-none focus:border-cyan-400"
                      />
                    </div>

                    {/* Price Calculation Box */}
                    <div className="bg-slate-900/80 p-3 rounded-xl border border-slate-800 space-y-1.5 text-xs">
                      <div className="flex justify-between text-slate-400">
                        <span>¥{tour.price.toLocaleString()} × {guestsCount}名</span>
                        <span>¥{totalPrice.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between font-bold text-white pt-2 border-t border-slate-800 text-sm">
                        <span>{t.bookingModal.totalPrice}</span>
                        <span className="text-cyan-400">¥{totalPrice.toLocaleString()}</span>
                      </div>
                    </div>

                    {/* Submit Button */}
                    <button
                      type="submit"
                      className="w-full py-3.5 rounded-xl bg-gradient-to-r from-purple-600 via-pink-600 to-rose-600 hover:from-purple-500 hover:to-pink-500 text-white font-bold text-sm shadow-lg shadow-purple-600/30 hover:shadow-purple-600/50 transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-95"
                    >
                      <Send className="w-4 h-4" />
                      <span>{t.bookingModal.submit}</span>
                    </button>

                    <p className="text-[11px] text-slate-400 text-center leading-tight">
                      {lang === 'ja' 
                        ? '※送信後、ガイドとのチャットが開始され、集合場所等の詳細を詰めることができます。' 
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
