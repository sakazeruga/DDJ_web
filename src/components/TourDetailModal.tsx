import React, { useState } from 'react';
import { 
  X, 
  Clock, 
  MapPin, 
  Star, 
  Heart, 
  Flame, 
  Calendar, 
  Users, 
  Tv, 
  Backpack, 
  Navigation, 
  Send, 
  Languages, 
  Compass, 
  ExternalLink, 
  Eye, 
  Hotel, 
  UtensilsCrossed, 
  Gift, 
  Camera, 
  Layers,
  Share,
  MessageSquare,
  Footprints,
  Headphones,
  Video
} from 'lucide-react';
import confetti from 'canvas-confetti';
import type { Tour, TourReview, Booking, TalkSessionBooking, Language, NearbySpotCategory, Currency, ItineraryItem } from '../types';
import { translations } from '../i18n/translations';
import { formatPrice } from '../utils/currency';
import { ShioriShareModal } from './ShioriShareModal';
import { GuideChatModal } from './GuideChatModal';

interface TourDetailModalProps {
  tour: Tour | null;
  onClose: () => void;
  lang: Language;
  currency?: Currency;
  isFavorite: boolean;
  onToggleFavorite: (tourId: string, e: React.MouseEvent) => void;
  reviews: TourReview[];
  onAddReview: (review: Omit<TourReview, 'id' | 'date'>) => void;
  onAddBooking: (booking: Omit<Booking, 'id' | 'createdAt'>) => void;
  onAddTalkBooking?: (booking: Omit<TalkSessionBooking, 'id' | 'createdAt'>) => void;
}

export const TourDetailModal: React.FC<TourDetailModalProps> = ({
  tour,
  onClose,
  lang,
  currency = 'JPY',
  isFavorite,
  onToggleFavorite,
  reviews,
  onAddReview,
  onAddBooking,
  onAddTalkBooking,
}) => {
  if (!tour) return null;
  const t = translations[lang];

  // Modals for Share & Guide Inquiry
  const [isShareModalOpen, setIsShareModalOpen] = useState<boolean>(false);
  const [isGuideChatOpen, setIsGuideChatOpen] = useState<boolean>(false);

  // Tab state
  const [activeTab, setActiveTab] = useState<'itinerary' | 'map' | 'guide' | 'reviews'>('itinerary');

  // Map & Nearby spot states & focused route step
  const [nearbyCategory, setNearbyCategory] = useState<NearbySpotCategory | 'all'>('all');
  const [selectedSpotId, setSelectedSpotId] = useState<string | null>(null);
  const [focusedItinerary, setFocusedItinerary] = useState<ItineraryItem | null>(null);

  // Booking mode (Real Tour vs Online Talk Session)
  const [bookingMode, setBookingMode] = useState<'tour' | 'talk'>('tour');

  // Booking states (Real Tour)
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

  // Talk Session states
  const [talkDuration, setTalkDuration] = useState<30 | 60>(30);
  const [talkTopic, setTalkTopic] = useState<string>(() => tour.talkSessionConfig?.topics[0] || '自由相談・オタクトーク');
  const [talkSlot, setTalkSlot] = useState<string>(() => tour.talkSessionConfig?.availableSlots?.[0] || '本日 20:00〜20:30');
  const [talkUserName, setTalkUserName] = useState<string>('');
  const [talkUserEmail, setTalkUserEmail] = useState<string>('');
  const [talkUserNotes, setTalkUserNotes] = useState<string>('');
  const [isTalkBooked, setIsTalkBooked] = useState<boolean>(false);
  const [generatedMeetUrl, setGeneratedMeetUrl] = useState<string>('');

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

  // Selected spot or default tour coordinates
  const currentSpot = tour.nearbySpots?.find((s) => s.id === selectedSpotId);
  const mapCoords = currentSpot?.lat && currentSpot?.lng 
    ? { lat: currentSpot.lat, lng: currentSpot.lng } 
    : tour.coordinates || { lat: 35.6762, lng: 139.6503 };

  const mapQueryParam = focusedItinerary
    ? `${encodeURIComponent(focusedItinerary.spotTitle + ' ' + tour.area)}`
    : currentSpot
    ? `${encodeURIComponent(currentSpot.googleMapsQuery || currentSpot.name)}`
    : `${mapCoords.lat},${mapCoords.lng}`;

  const origin = encodeURIComponent(tour.meetingPoint + ' ' + tour.area);
  const destination = encodeURIComponent(
    tour.itinerary[tour.itinerary.length - 1]?.spotTitle + ' ' + tour.area
  );
  const waypoints = tour.itinerary
    .slice(1, -1)
    .map((item) => encodeURIComponent(item.spotTitle))
    .join('|');
  const googleMapsDirectionsUrl = `https://www.google.com/maps/dir/?api=1&origin=${origin}&destination=${destination}${waypoints ? `&waypoints=${waypoints}` : ''}&travelmode=walking`;

  const filteredNearbySpots = (tour.nearbySpots || []).filter((spot) => {
    if (nearbyCategory === 'all') return true;
    return spot.category === nearbyCategory;
  });

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

    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#2563eb', '#f43f5e', '#eab308'],
    });

    setIsBooked(true);
  };

  // Handle Talk Session submission (1on1 Online Talk)
  const handleTalkBookingSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!talkUserName || !talkUserEmail) {
      alert(lang === 'ja' ? 'お名前とメールアドレスを入力してください' : 'Please provide your name and email');
      return;
    }

    const price = talkDuration === 30
      ? (tour.talkSessionConfig?.price30m || 3000)
      : (tour.talkSessionConfig?.price60m || 5500);

    const meetCode = `ddj-${Math.random().toString(36).substring(2, 6)}-${Math.random().toString(36).substring(2, 6)}`;
    const meetUrl = `https://meet.google.com/${meetCode}`;
    setGeneratedMeetUrl(meetUrl);

    if (onAddTalkBooking) {
      onAddTalkBooking({
        tourId: tour.id,
        tourTitle: lang === 'ja' ? tour.title : tour.titleEn,
        guideName: tour.guide.name,
        guideAvatar: tour.guide.avatar,
        date: new Date().toISOString().split('T')[0],
        timeSlot: talkSlot || '本日 20:00〜20:30',
        durationMinutes: talkDuration,
        totalPrice: price,
        topic: talkTopic || (tour.talkSessionConfig?.topics[0] || '自由オタクトーク・相談'),
        userName: talkUserName,
        userEmail: talkUserEmail,
        userNotes: talkUserNotes,
        meetUrl,
        status: 'confirmed',
      });
    }

    confetti({
      particleCount: 90,
      spread: 75,
      origin: { y: 0.6 },
      colors: ['#3b82f6', '#8b5cf6', '#ec4899', '#f59e0b'],
    });

    setIsTalkBooked(true);
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

  // Category Icon Helper
  const getCategoryIcon = (cat: NearbySpotCategory) => {
    switch (cat) {
      case 'hotel':
        return <Hotel className="w-4 h-4 text-indigo-600" />;
      case 'dining':
        return <UtensilsCrossed className="w-4 h-4 text-amber-600" />;
      case 'souvenir':
        return <Gift className="w-4 h-4 text-emerald-600" />;
      case 'scenery':
        return <Camera className="w-4 h-4 text-sky-600" />;
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-start sm:items-center justify-center pt-8 sm:pt-4 pb-4 px-2 sm:p-4 md:p-6 bg-slate-900/60 backdrop-blur-sm overflow-y-auto">
      {/* Modal Container */}
      <div className="relative w-full max-w-5xl bg-white border border-slate-200 rounded-3xl shadow-2xl overflow-hidden my-2 sm:my-auto max-h-[90vh] sm:max-h-[92vh] flex flex-col">
        {/* Sticky Header Bar */}
        <div className="sticky top-0 z-20 bg-white/95 backdrop-blur-md px-3 sm:px-6 py-2.5 sm:py-3.5 border-b border-slate-200 flex items-center justify-between gap-1.5 sm:gap-3">
          <div className="flex items-center gap-2 min-w-0">
            <span className="text-[11px] sm:text-xs font-bold px-2 sm:px-3 py-0.5 sm:py-1 rounded-full bg-blue-50 text-blue-700 border border-blue-200 whitespace-nowrap flex-shrink-0">
              Lv.{tour.otakuLevel} {lang === 'ja' ? '熱量' : 'Depth'}
            </span>
            <div className="text-xs text-slate-500 font-medium hidden sm:flex items-center gap-1 truncate">
              <MapPin className="w-3.5 h-3.5 text-rose-500 flex-shrink-0" />
              <span className="truncate">{lang === 'ja' ? tour.area : tour.areaEn}</span>
            </div>
          </div>

          <div className="flex items-center gap-1.5 sm:gap-2 flex-shrink-0">
            {/* Guide Consultation CTA */}
            <button
              onClick={() => setIsGuideChatOpen(true)}
              className="flex items-center gap-1 px-2.5 sm:px-3 py-1.5 sm:py-2 rounded-xl bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-200 text-xs font-bold transition-colors cursor-pointer"
              title="ガイドに事前質問・相談"
            >
              <MessageSquare className="w-3.5 h-3.5 text-blue-600 flex-shrink-0" />
              <span className="hidden sm:inline">{lang === 'ja' ? 'ガイドに質問' : 'Ask Guide'}</span>
              <span className="sm:hidden text-[11px]">{lang === 'ja' ? '質問' : 'Ask'}</span>
            </button>

            {/* Share CTA */}
            <button
              onClick={() => setIsShareModalOpen(true)}
              className="flex items-center gap-1 px-2.5 sm:px-3 py-1.5 sm:py-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white text-xs font-bold transition-all shadow-xs cursor-pointer"
              title="ツアーをシェア"
            >
              <Share className="w-3.5 h-3.5 flex-shrink-0" />
              <span>シェア</span>
            </button>

            {/* Favorite CTA */}
            <button
              onClick={(e) => onToggleFavorite(tour.id, e)}
              className={`w-8 h-8 sm:w-9 sm:h-9 flex items-center justify-center p-0 rounded-xl border transition-all cursor-pointer flex-shrink-0 ${
                isFavorite
                  ? 'bg-rose-500 text-white border-rose-500 shadow-sm'
                  : 'bg-slate-50 text-slate-700 border-slate-200 hover:text-rose-600'
              }`}
              title="お気に入り"
            >
              <Heart className={`w-3.5 h-3.5 sm:w-4 sm:h-4 ${isFavorite ? 'fill-current' : ''}`} />
            </button>

            {/* Compact Close Button */}
            <button
              onClick={onClose}
              className="w-8 h-8 sm:w-9 sm:h-9 flex items-center justify-center p-0 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 hover:text-slate-900 border border-slate-200 transition-colors cursor-pointer flex-shrink-0"
              title="閉じる"
              aria-label="Close modal"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Scrollable Content Body */}
        <div className="overflow-y-auto p-3 sm:p-6 md:p-8 space-y-4 sm:space-y-6 bg-slate-50">
          {/* Hero Photo Card (Clean visual showcase) */}
          <div className="relative rounded-2xl sm:rounded-3xl overflow-hidden border border-slate-200 shadow-sm bg-slate-100 aspect-[16/10] sm:h-72 md:h-80">
            <img
              src={tour.imageUrl}
              alt={lang === 'ja' ? tour.title : tour.titleEn}
              className="w-full h-full object-cover"
            />
            {/* Top Badges */}
            <div className="absolute top-3 left-3 flex flex-wrap items-center gap-1.5">
              <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-slate-900/80 text-white backdrop-blur-md border border-white/20">
                {translations[lang].categories[tour.category] || (lang === 'ja' ? '文化ツアー' : 'Cultural Tour')}
              </span>
              <div className="flex items-center gap-1 text-[11px] text-white bg-slate-900/80 px-2.5 py-0.5 rounded-full backdrop-blur-md border border-white/20">
                <Languages className="w-3 h-3 text-blue-300" />
                <span>{tour.languages.join(' / ')}</span>
              </div>
            </div>
          </div>

          {/* Clean Title & Catchphrase Card (100% visible, never buried) */}
          <div className="bg-white p-4 sm:p-6 rounded-2xl sm:rounded-3xl border border-slate-200 shadow-xs space-y-2">
            <div className="flex items-center gap-2 text-xs font-bold text-blue-700">
              <span className="px-2 py-0.5 rounded-md bg-blue-50 border border-blue-200 font-mono text-[11px]">
                DDJ-TOUR #{tour.id.replace('tour-', '').toUpperCase()}
              </span>
              <span className="text-slate-300">|</span>
              <span className="text-slate-600 flex items-center gap-1 text-xs">
                <MapPin className="w-3.5 h-3.5 text-rose-500" />
                {lang === 'ja' ? tour.area : tour.areaEn}
              </span>
            </div>

            <h2 className="text-base sm:text-2xl md:text-3xl font-black text-slate-900 leading-snug">
              {lang === 'ja' ? tour.title : tour.titleEn}
            </h2>

            <p className="text-xs sm:text-sm text-slate-600 font-medium leading-relaxed">
              {lang === 'ja' ? tour.catchphrase : tour.catchphraseEn}
            </p>

            <div className="flex flex-wrap gap-1.5 pt-1.5 border-t border-slate-100">
              {tour.tags.map((tag) => (
                <span
                  key={tag}
                  className="text-[11px] px-2 py-0.5 rounded-md bg-slate-100 text-slate-600 font-medium"
                >
                  #{tag}
                </span>
              ))}
            </div>
          </div>

          {/* Quick Specs Strip */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="bg-white p-3 rounded-xl border border-slate-200 text-center shadow-xs">
              <Clock className="w-4 h-4 text-blue-600 mx-auto mb-1" />
              <div className="text-[10px] text-slate-400 font-medium">{t.filter.duration}</div>
              <div className="text-sm font-bold text-slate-900">{tour.durationHours} 時間</div>
            </div>
            <div className="bg-white p-3 rounded-xl border border-slate-200 text-center shadow-xs">
              <Users className="w-4 h-4 text-emerald-600 mx-auto mb-1" />
              <div className="text-[10px] text-slate-400 font-medium">定員</div>
              <div className="text-sm font-bold text-slate-900">最大 {tour.maxParticipants}名</div>
            </div>
            <div className="bg-white p-3 rounded-xl border border-slate-200 text-center shadow-xs">
              <Flame className="w-4 h-4 text-rose-600 mx-auto mb-1" />
              <div className="text-[10px] text-slate-400 font-medium">マニア熱量</div>
              <div className="text-sm font-bold text-slate-900">Lv.{tour.otakuLevel} / 5</div>
            </div>
            <div className="bg-white p-3 rounded-xl border border-slate-200 text-center shadow-xs">
              <Star className="w-4 h-4 text-amber-500 mx-auto mb-1 fill-amber-500" />
              <div className="text-[10px] text-slate-400 font-medium">参加者評価</div>
              <div className="text-sm font-bold text-slate-900">{tour.rating} ({tour.reviewsCount})</div>
            </div>
          </div>

          {/* Main Grid: Left Details & Right Booking Form */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left 2 Columns: Tabs & Content */}
            <div className="lg:col-span-2 space-y-6">
              {/* Navigation Tabs (Text-reduction & Visual organization) */}
              <div className="flex items-center gap-1.5 p-1.5 bg-white rounded-2xl border border-slate-200 shadow-xs overflow-x-auto">
                <button
                  onClick={() => setActiveTab('itinerary')}
                  className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                    activeTab === 'itinerary'
                      ? 'bg-blue-600 text-white shadow-sm'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                  }`}
                >
                  <Navigation className="w-4 h-4" />
                  <span>{t.tourDetail.tabItinerary}</span>
                </button>

                <button
                  onClick={() => setActiveTab('map')}
                  className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap relative ${
                    activeTab === 'map'
                      ? 'bg-blue-600 text-white shadow-sm'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                  }`}
                >
                  <MapPin className="w-4 h-4 text-rose-400" />
                  <span>{t.tourDetail.tabMapAndNearby}</span>
                  <span className="w-2 h-2 rounded-full bg-rose-500"></span>
                </button>

                <button
                  onClick={() => setActiveTab('guide')}
                  className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                    activeTab === 'guide'
                      ? 'bg-blue-600 text-white shadow-sm'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                  }`}
                >
                  <Users className="w-4 h-4" />
                  <span>{t.tourDetail.tabGuide}</span>
                </button>

                <button
                  onClick={() => setActiveTab('reviews')}
                  className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                    activeTab === 'reviews'
                      ? 'bg-blue-600 text-white shadow-sm'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                  }`}
                >
                  <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
                  <span>{t.tourDetail.tabReviews} ({tourReviews.length})</span>
                </button>
              </div>

              {/* TAB 1: ITINERARY & SUMMARY */}
              {activeTab === 'itinerary' && (
                <div className="space-y-6">
                  {/* Brief Overview */}
                  <section className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
                    <p className="text-slate-700 text-sm leading-relaxed">
                      {lang === 'ja' ? tour.description : tour.descriptionEn}
                    </p>
                  </section>

                  {/* Visual Timeline */}
                  <section className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs">
                    <h3 className="text-base font-bold text-slate-900 mb-5 flex items-center gap-2">
                      <Clock className="w-4 h-4 text-blue-600" />
                      <span>{t.tourDetail.itinerary}</span>
                    </h3>

                    <div className="relative pl-6 space-y-5 before:absolute before:left-2 before:top-2 before:bottom-2 before:w-0.5 before:bg-blue-200">
                      {tour.itinerary.map((item, idx) => (
                        <div key={idx} className="relative">
                          <div className="absolute -left-[27px] top-1.5 w-4 h-4 rounded-full bg-white border-2 border-blue-600 flex items-center justify-center">
                            <div className="w-1.5 h-1.5 rounded-full bg-blue-600" />
                          </div>

                          <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 hover:border-blue-300 transition-colors">
                            <div className="flex items-center justify-between gap-2 mb-1">
                              <span className="text-xs font-bold text-blue-700 px-2 py-0.5 rounded bg-blue-100 border border-blue-200">
                                {item.time}
                              </span>
                              {item.isDeepSpot && (
                                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-rose-100 text-rose-800 border border-rose-200 flex items-center gap-1">
                                  <Flame className="w-3 h-3 text-rose-600" />
                                  {lang === 'ja' ? '注目ポイント' : 'Key Spot'}
                                </span>
                              )}
                            </div>

                            <h4 className="font-bold text-slate-900 text-sm mt-1">
                              {lang === 'ja' ? item.spotTitle : item.spotTitleEn}
                            </h4>

                            <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                              {lang === 'ja' ? item.description : item.descriptionEn}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </section>

                  {/* Compact Checklist: Meeting & What to Bring */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Meeting Point */}
                    <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs space-y-2">
                      <div className="flex items-center gap-2 text-xs font-bold text-rose-600">
                        <MapPin className="w-4 h-4 text-rose-500" />
                        <span>{t.tourDetail.meetingPlace}</span>
                      </div>
                      <p className="text-xs font-medium text-slate-800">
                        {lang === 'ja' ? tour.meetingPoint : tour.meetingPointEn}
                      </p>
                      <button
                        onClick={() => setActiveTab('map')}
                        className="text-[11px] text-blue-600 hover:underline font-bold flex items-center gap-1 cursor-pointer pt-1"
                      >
                        <Compass className="w-3.5 h-3.5" />
                        <span>Googleマップで確認する →</span>
                      </button>
                    </div>

                    {/* What to Bring & Prep */}
                    <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs space-y-2">
                      <div className="flex items-center gap-2 text-xs font-bold text-emerald-700">
                        <Backpack className="w-4 h-4 text-emerald-600" />
                        <span>{t.tourDetail.mustBring}</span>
                      </div>
                      <div className="flex flex-wrap gap-1.5">
                        {(lang === 'ja' ? tour.mustBring : tour.mustBringEn).map((item, idx) => (
                          <span key={idx} className="text-[11px] px-2 py-0.5 rounded bg-emerald-50 text-emerald-800 border border-emerald-200 font-medium">
                            ✓ {item}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Inclusions */}
                  <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex flex-wrap items-center gap-2 text-xs">
                    <span className="font-bold text-slate-700">{t.tourDetail.included}:</span>
                    {(lang === 'ja' ? tour.included : tour.includedEn).map((inc, i) => (
                      <span key={i} className="px-2 py-0.5 rounded bg-slate-100 border border-slate-200 text-slate-700 font-medium text-[11px]">
                        ✓ {inc}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* TAB 2: MAP, SCENERY & NEARBY EXPLORATION */}
              {activeTab === 'map' && (
                <div className="space-y-6">
                  {/* Google Maps Interactive Card */}
                  <section className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
                      <div>
                        <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                          <MapPin className="w-5 h-5 text-rose-500" />
                          <span>{t.tourDetail.mapSectionTitle}</span>
                        </h3>
                        <p className="text-xs text-slate-500 mt-0.5">
                          {focusedItinerary
                            ? `🚶 順路スポット: ${focusedItinerary.spotTitle}`
                            : currentSpot 
                            ? `📍 周辺スポット: ${lang === 'ja' ? currentSpot.name : currentSpot.nameEn}` 
                            : lang === 'ja' ? tour.meetingPoint : tour.meetingPointEn}
                        </p>
                      </div>

                      {/* External Map Action Buttons */}
                      <div className="flex items-center gap-2 flex-wrap">
                        <a
                          href={googleMapsDirectionsUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="px-3 py-1.5 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 text-xs font-bold flex items-center gap-1.5 transition-colors"
                          title="Googleマップでモデルコース全ルート案内"
                        >
                          <Navigation className="w-3.5 h-3.5 text-emerald-600" />
                          <span>徒歩ナビ開始</span>
                          <ExternalLink className="w-3 h-3" />
                        </a>

                        <a
                          href={currentSpot 
                            ? `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(currentSpot.googleMapsQuery)}` 
                            : tour.googleMapsUrl || `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(tour.meetingPoint + ' ' + tour.area)}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="px-3 py-1.5 rounded-xl bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-200 text-xs font-bold flex items-center gap-1.5 transition-colors"
                        >
                          <ExternalLink className="w-3.5 h-3.5" />
                          <span>{t.tourDetail.openGoogleMaps}</span>
                        </a>

                        <a
                          href={`https://www.google.com/maps/@?api=1&map_action=pano&viewpoint=${mapCoords.lat},${mapCoords.lng}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="px-3 py-1.5 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-200 text-xs font-bold flex items-center gap-1.5 transition-colors"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          <span>{t.tourDetail.streetViewHint}</span>
                        </a>
                      </div>
                    </div>

                    {/* Google Maps Iframe Embed */}
                    <div className="relative rounded-2xl overflow-hidden border border-slate-200 bg-slate-100 aspect-video sm:h-80 w-full shadow-inner">
                      <iframe
                        title="Google Maps"
                        src={`https://maps.google.com/maps?q=${mapQueryParam}&z=15&output=embed`}
                        className="w-full h-full border-0"
                        loading="lazy"
                        allowFullScreen
                      />
                    </div>

                    <div className="flex items-center justify-between text-[11px] text-slate-400 mt-2.5 px-1">
                      <span>📍 座標: {mapCoords.lat.toFixed(4)}, {mapCoords.lng.toFixed(4)}</span>
                      <span>※地図内のドラッグ・拡大縮小・航空写真表示が可能です</span>
                    </div>

                    {/* Model Course Route Stepper */}
                    <div className="mt-5 pt-4 border-t border-slate-100">
                      <div className="flex items-center justify-between mb-3">
                        <h4 className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                          <Footprints className="w-4 h-4 text-blue-600" />
                          <span>モデルコース順路案内（クリックで地図が移動します）</span>
                        </h4>
                        <span className="text-[11px] text-slate-400">全{tour.itinerary.length}拠点</span>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5">
                        {tour.itinerary.map((item, idx) => {
                          const isFocused = focusedItinerary?.spotTitle === item.spotTitle;
                          return (
                            <button
                              key={idx}
                              type="button"
                              onClick={() => {
                                setFocusedItinerary(item);
                                setSelectedSpotId(null);
                              }}
                              className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer ${
                                isFocused
                                  ? 'bg-blue-50 border-blue-500 shadow-xs ring-1 ring-blue-400'
                                  : 'bg-slate-50 border-slate-200 hover:border-blue-300 hover:bg-white'
                              }`}
                            >
                              <div className="flex items-center justify-between mb-1">
                                <span className={`text-[10px] font-bold px-1.5 py-0.2 rounded ${
                                  isFocused ? 'bg-blue-600 text-white' : 'bg-slate-200 text-slate-700'
                                }`}>
                                  順路 {idx + 1}
                                </span>
                                <span className="text-[10px] text-blue-600 font-mono font-bold">
                                  {item.time}
                                </span>
                              </div>
                              <div className="text-xs font-bold text-slate-900 truncate">
                                {lang === 'ja' ? item.spotTitle : item.spotTitleEn}
                              </div>
                              <div className="text-[10px] text-slate-400 mt-0.5">
                                {idx < tour.itinerary.length - 1 ? '🚶 徒歩 約5〜10分' : '🏁 終了・解散'}
                              </div>
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  </section>

                  {/* Nearby Spots Recommendations */}
                  <section className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
                      <div>
                        <h4 className="text-base font-bold text-slate-900 flex items-center gap-2">
                          <Layers className="w-4 h-4 text-blue-600" />
                          <span>{t.tourDetail.nearbySectionTitle}</span>
                        </h4>
                        <p className="text-xs text-slate-500 mt-0.5">
                          {t.tourDetail.nearbySectionDesc}
                        </p>
                      </div>

                      {/* Category Filter Pills */}
                      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
                        <button
                          onClick={() => setNearbyCategory('all')}
                          className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                            nearbyCategory === 'all'
                              ? 'bg-slate-900 text-white shadow-xs'
                              : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                          }`}
                        >
                          {t.tourDetail.nearbyAll} ({(tour.nearbySpots || []).length})
                        </button>
                        <button
                          onClick={() => setNearbyCategory('hotel')}
                          className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                            nearbyCategory === 'hotel'
                              ? 'bg-indigo-600 text-white shadow-xs'
                              : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                          }`}
                        >
                          {t.tourDetail.nearbyHotels}
                        </button>
                        <button
                          onClick={() => setNearbyCategory('dining')}
                          className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                            nearbyCategory === 'dining'
                              ? 'bg-amber-600 text-white shadow-xs'
                              : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                          }`}
                        >
                          {t.tourDetail.nearbyDining}
                        </button>
                        <button
                          onClick={() => setNearbyCategory('souvenir')}
                          className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                            nearbyCategory === 'souvenir'
                              ? 'bg-emerald-600 text-white shadow-xs'
                              : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                          }`}
                        >
                          {t.tourDetail.nearbySouvenir}
                        </button>
                        <button
                          onClick={() => setNearbyCategory('scenery')}
                          className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                            nearbyCategory === 'scenery'
                              ? 'bg-sky-600 text-white shadow-xs'
                              : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                          }`}
                        >
                          {t.tourDetail.nearbyScenery}
                        </button>
                      </div>
                    </div>

                    {/* Nearby Cards Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {filteredNearbySpots.map((spot) => {
                        const isSelected = selectedSpotId === spot.id;
                        return (
                          <div
                            key={spot.id}
                            onClick={() => setSelectedSpotId(spot.id)}
                            className={`p-3.5 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between ${
                              isSelected
                                ? 'bg-blue-50/60 border-blue-500 shadow-md ring-2 ring-blue-400/30'
                                : 'bg-slate-50 border-slate-200 hover:border-blue-300 hover:bg-white shadow-xs'
                            }`}
                          >
                            <div>
                              {/* Spot Image */}
                              <div className="relative rounded-xl overflow-hidden aspect-video mb-3 border border-slate-200">
                                <img
                                  src={spot.imageUrl}
                                  alt={lang === 'ja' ? spot.name : spot.nameEn}
                                  className="w-full h-full object-cover"
                                />
                                <div className="absolute top-2 left-2 flex items-center gap-1 px-2 py-0.5 rounded-full bg-white/90 backdrop-blur-xs text-[10px] font-bold shadow-xs">
                                  {getCategoryIcon(spot.category)}
                                  <span>{lang === 'ja' ? spot.categoryLabel : spot.categoryLabelEn}</span>
                                </div>
                                <div className="absolute bottom-2 right-2 px-2 py-0.5 rounded-full bg-black/70 backdrop-blur-xs text-white text-[10px] font-bold">
                                  ★ {spot.rating}
                                </div>
                              </div>

                              {/* Spot Info */}
                              <div className="flex items-start justify-between gap-1 mb-1">
                                <h5 className="font-bold text-slate-900 text-sm leading-snug">
                                  {lang === 'ja' ? spot.name : spot.nameEn}
                                </h5>
                              </div>

                              {/* Highlight Tag & Distance */}
                              <div className="flex flex-wrap items-center gap-1.5 mb-2">
                                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-100 text-blue-800 border border-blue-200">
                                  ✦ {spot.highlightTag}
                                </span>
                                <span className="text-[10px] text-slate-500 font-medium">
                                  📍 {spot.distance}
                                </span>
                                {spot.priceRange && (
                                  <span className="text-[10px] text-emerald-700 font-bold ml-auto">
                                    {spot.priceRange}
                                  </span>
                                )}
                              </div>

                              <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed mb-3">
                                {lang === 'ja' ? spot.description : spot.descriptionEn}
                              </p>
                            </div>

                            {/* Card Footer Actions */}
                            <div className="flex items-center justify-between pt-2 border-t border-slate-200/70 text-xs">
                              <span className="text-[11px] font-bold text-blue-600">
                                {isSelected ? '● 地図表示中' : 'クリックで地図表示'}
                              </span>
                              <a
                                href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(spot.googleMapsQuery)}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                onClick={(e) => e.stopPropagation()}
                                className="text-[11px] font-bold text-slate-600 hover:text-blue-600 flex items-center gap-1 hover:underline"
                              >
                                <span>Googleマップ</span>
                                <ExternalLink className="w-3 h-3" />
                              </a>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </section>
                </div>
              )}

              {/* TAB 3: GUIDE PROFILE */}
              {activeTab === 'guide' && (
                <section className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-5">
                  <div className="flex flex-col sm:flex-row items-start gap-4">
                    <img
                      src={tour.guide.avatar}
                      alt={tour.guide.name}
                      className="w-20 h-20 rounded-2xl object-cover border border-slate-200 shadow-sm"
                    />
                    <div className="flex-1">
                      <div className="flex items-center justify-between flex-wrap gap-2">
                        <div>
                          <h4 className="text-lg font-black text-slate-900">
                            {lang === 'ja' ? tour.guide.name : tour.guide.nameEn}
                          </h4>
                          <div className="text-xs text-blue-600 font-bold">
                            {lang === 'ja' ? tour.guide.role : tour.guide.roleEn}
                          </div>
                        </div>
                        <div className="flex items-center gap-2 text-xs bg-blue-50 text-blue-800 px-3 py-1.5 rounded-full border border-blue-200 font-bold">
                          <span>{t.tourDetail.otakuHistory}:</span>
                          <span>{tour.guide.otakuYears}年</span>
                        </div>
                      </div>

                      <p className="text-xs sm:text-sm text-slate-600 mt-3 leading-relaxed">
                        {lang === 'ja' ? tour.guide.bio : tour.guide.bioEn}
                      </p>

                      <div className="flex flex-wrap gap-1.5 mt-4">
                        {tour.guide.specialties.map((spec) => (
                          <span
                            key={spec}
                            className="text-[11px] px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700 border border-slate-200 font-medium"
                          >
                            ✦ {spec}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Direct Inquiry CTA button */}
                  <div className="pt-2 flex justify-end">
                    <button
                      type="button"
                      onClick={() => setIsGuideChatOpen(true)}
                      className="px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow-md shadow-blue-500/20 transition-all flex items-center gap-2 cursor-pointer"
                    >
                      <MessageSquare className="w-4 h-4" />
                      <span>{lang === 'ja' ? `${tour.guide.name}さんに事前質問・相談する` : `Chat with ${tour.guide.nameEn}`}</span>
                    </button>
                  </div>

                  {/* Recommendation / Prep */}
                  <div className="p-4 rounded-xl bg-amber-50/80 border border-amber-200">
                    <div className="flex items-center gap-2 text-xs font-bold text-amber-900 mb-1">
                      <Tv className="w-4 h-4 text-amber-600" />
                      <span>{t.tourDetail.prepRecommendation}</span>
                    </div>
                    <p className="text-xs text-amber-800 leading-relaxed">
                      {lang === 'ja' ? tour.recommendedPreparation : tour.recommendedPreparationEn}
                    </p>
                  </div>
                </section>
              )}

              {/* TAB 4: REVIEWS */}
              {activeTab === 'reviews' && (
                <section className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-6">
                  <div className="flex items-center justify-between">
                    <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                      <Star className="w-5 h-5 text-amber-500 fill-amber-500" />
                      <span>{t.tourDetail.reviews} ({tourReviews.length})</span>
                    </h3>
                    <span className="text-sm font-black text-amber-600">★ {tour.rating}</span>
                  </div>

                  {/* Reviews List */}
                  <div className="space-y-3">
                    {tourReviews.length === 0 ? (
                      <p className="text-xs text-slate-500 italic py-4">
                        {lang === 'ja' ? 'まだレビューはありません。最初の参加者になりましょう！' : 'No reviews yet. Be the first to join!'}
                      </p>
                    ) : (
                      tourReviews.map((rev) => (
                        <div key={rev.id} className="bg-slate-50 p-4 rounded-xl border border-slate-200">
                          <div className="flex items-center justify-between mb-1.5">
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

                  {/* Post Review Form */}
                  <form onSubmit={handleReviewSubmit} className="bg-slate-50 p-4 rounded-xl border border-slate-200">
                    <h4 className="text-xs font-bold text-slate-900 mb-1">{t.tourDetail.writeReview}</h4>
                    <p className="text-[11px] text-slate-500 mb-3">{t.tourDetail.writeReviewDesc}</p>

                    {reviewSubmitted && (
                      <div className="mb-3 p-2 bg-emerald-50 border border-emerald-200 rounded-lg text-emerald-800 text-xs font-medium">
                        {lang === 'ja' ? 'レビューを投稿しました！ありがとうございます。' : 'Review submitted! Thank you!'}
                      </div>
                    )}

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-2">
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

                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-xs text-slate-500">評価:</span>
                      <div className="flex items-center gap-1">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <button
                            type="button"
                            key={star}
                            onClick={() => setReviewRating(star)}
                            className={`p-0.5 cursor-pointer ${reviewRating >= star ? 'text-amber-500' : 'text-slate-300'}`}
                          >
                            <Star className={`w-4 h-4 ${reviewRating >= star ? 'fill-current' : ''}`} />
                          </button>
                        ))}
                      </div>
                    </div>

                    <textarea
                      rows={2}
                      placeholder={lang === 'ja' ? 'ツアーの感想やガイドへの応援メッセージ...' : 'Write your review...'}
                      value={reviewComment}
                      onChange={(e) => setReviewComment(e.target.value)}
                      required
                      className="w-full bg-white border border-slate-200 text-xs rounded-lg p-2.5 text-slate-900 placeholder-slate-400 mb-2 focus:outline-none focus:border-blue-500"
                    />

                    <button
                      type="submit"
                      className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold transition-colors cursor-pointer"
                    >
                      {lang === 'ja' ? 'レビューを送信' : 'Post Review'}
                    </button>
                  </form>
                </section>
              )}
            </div>

            {/* Right Column: Sticky Booking Card */}
            <div className="lg:col-span-1">
              <div className="sticky top-20 bg-white p-5 sm:p-6 rounded-2xl border border-slate-200 shadow-xl">
                {/* Mode Switch Tabs: Real Tour vs Online Talk Session */}
                <div className="grid grid-cols-2 gap-1.5 p-1 bg-slate-100 rounded-xl mb-4 border border-slate-200">
                  <button
                    type="button"
                    onClick={() => setBookingMode('tour')}
                    className={`py-2 px-2 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                      bookingMode === 'tour'
                        ? 'bg-white text-blue-700 shadow-xs'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    <Footprints className="w-3.5 h-3.5 text-blue-600" />
                    <span>現地ツアー</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setBookingMode('talk')}
                    className={`py-2 px-2 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer relative ${
                      bookingMode === 'talk'
                        ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-xs'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    <Headphones className="w-3.5 h-3.5 text-yellow-300" />
                    <span>会話セッション</span>
                    <span className="absolute -top-1.5 -right-1 px-1.5 py-0.2 rounded-full bg-rose-500 text-[9px] font-black text-white shadow-xs">
                      1on1
                    </span>
                  </button>
                </div>

                {/* 1. Real Tour Booking Flow */}
                {bookingMode === 'tour' && (
                  isBooked ? (
                    <div className="text-center py-4 space-y-4 relative overflow-hidden">
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
                      <h4 className="text-lg font-black text-slate-900">{t.bookingModal.successTitle}</h4>
                      <p className="text-xs text-slate-600 leading-relaxed">
                        {t.bookingModal.successDesc}
                      </p>
                      <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 text-left space-y-1 text-xs font-mono">
                        <div className="text-blue-700 font-bold border-b border-slate-200 pb-1 mb-2">
                          PASS #DDJ-{tour.id.toUpperCase()}-VERIFIED
                        </div>
                        <div className="text-slate-500">参加日: <span className="text-slate-900 font-bold">{bookingDate}</span></div>
                        <div className="text-slate-500">人数: <span className="text-slate-900 font-bold">{guestsCount}名</span></div>
                        <div className="text-slate-500">合計: <span className="text-blue-600 font-black text-sm">{formatPrice(totalPrice, currency)}</span></div>
                        <div className="text-slate-500">ガイド: <span className="text-slate-900 font-bold">{tour.guide.name}</span></div>
                      </div>

                      <div className="pt-2 flex flex-col gap-2">
                        <button
                          type="button"
                          onClick={() => setIsShareModalOpen(true)}
                          className="w-full py-2.5 px-3 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold text-xs shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
                        >
                          <Share className="w-4 h-4" />
                          <span>ツアーをシェアする（URL・カード画像）</span>
                        </button>

                        <button
                          onClick={() => setIsBooked(false)}
                          className="text-xs text-slate-500 hover:text-blue-600 hover:underline pt-1 inline-block cursor-pointer font-bold"
                        >
                          {lang === 'ja' ? '← 別の日程でリクエストする' : '← Book another date'}
                        </button>
                      </div>
                    </div>
                  ) : (
                    <form onSubmit={handleBookingSubmit} className="space-y-4">
                      <div className="flex items-baseline justify-between border-b border-slate-100 pb-3">
                        <div>
                          <span className="text-2xl font-black text-slate-900">{formatPrice(tour.price, currency)}</span>
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
                          className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-blue-500 focus:bg-white"
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
                          <span>{formatPrice(tour.price, currency)} × {guestsCount}名</span>
                          <span>{formatPrice(totalPrice, currency)}</span>
                        </div>
                        <div className="flex justify-between font-bold text-slate-900 pt-2 border-t border-slate-200 text-sm">
                          <span>{t.bookingModal.totalPrice}</span>
                          <span className="text-blue-600 font-black">{formatPrice(totalPrice, currency)}</span>
                        </div>
                      </div>

                      {/* Pre-Booking Guide Consultation Button */}
                      <button
                        type="button"
                        onClick={() => setIsGuideChatOpen(true)}
                        className="w-full py-2.5 px-3 rounded-xl bg-blue-50 hover:bg-blue-100 text-blue-700 font-bold text-xs border border-blue-200 transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                      >
                        <MessageSquare className="w-4 h-4 text-blue-600" />
                        <span>{lang === 'ja' ? '💬 不安な点をガイドに事前相談する' : '💬 Ask Guide Before Booking'}</span>
                      </button>

                      {/* Submit Button */}
                      <button
                        type="submit"
                        className="w-full py-3.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-sm shadow-md shadow-blue-500/20 transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-95"
                      >
                        <Send className="w-4 h-4" />
                        <span>{t.bookingModal.submit}</span>
                      </button>
                    </form>
                  )
                )}

                {/* 2. Online Talk Session Booking Flow */}
                {bookingMode === 'talk' && (
                  isTalkBooked ? (
                    <div className="text-center py-4 space-y-4 relative overflow-hidden">
                      <div className="w-16 h-16 mx-auto rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white shadow-lg">
                        <Video className="w-8 h-8 text-yellow-300" />
                      </div>
                      <div className="inline-block px-3 py-1 rounded-full bg-indigo-50 text-indigo-700 text-xs font-bold border border-indigo-200">
                        ★ 1on1会話セッション予約完了 ★
                      </div>
                      <h4 className="text-lg font-black text-slate-900">オンライン会話セッションが確定しました！</h4>
                      <p className="text-xs text-slate-600 leading-relaxed">
                        ガイド <b>{tour.guide.name}</b> との個別セッションです。開始時間になりましたら以下のGoogle Meetリンクからご参加ください。
                      </p>

                      {/* Google Meet Connection Box */}
                      <div className="bg-slate-900 text-white p-4 rounded-2xl text-left space-y-2 text-xs">
                        <div className="flex items-center justify-between text-[11px] text-slate-400">
                          <span className="flex items-center gap-1">
                            <Video className="w-3.5 h-3.5 text-emerald-400" />
                            Google Meet 専用接続リンク
                          </span>
                          <span className="text-emerald-400 font-bold">発行済</span>
                        </div>
                        <div className="font-mono text-xs bg-slate-800 p-2 rounded-lg text-blue-300 break-all select-all border border-slate-700">
                          {generatedMeetUrl}
                        </div>
                        <div className="pt-1 flex gap-2">
                          <a
                            href={generatedMeetUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex-1 py-2 px-3 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-center font-bold text-xs flex items-center justify-center gap-1 transition-colors"
                          >
                            <Video className="w-3.5 h-3.5" />
                            <span>Meetを開く</span>
                          </a>
                          <button
                            type="button"
                            onClick={() => {
                              navigator.clipboard.writeText(generatedMeetUrl);
                              alert('Google Meetのリンクをコピーしました！');
                            }}
                            className="px-3 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold border border-slate-700 transition-colors cursor-pointer"
                          >
                            コピー
                          </button>
                        </div>
                      </div>

                      <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 text-left space-y-1.5 text-xs font-mono">
                        <div className="text-slate-500">日時枠: <span className="text-slate-900 font-bold">{talkSlot}</span></div>
                        <div className="text-slate-500">所要時間: <span className="text-slate-900 font-bold">{talkDuration}分 (1on1)</span></div>
                        <div className="text-slate-500">テーマ: <span className="text-blue-700 font-bold">{talkTopic}</span></div>
                        <div className="text-slate-500">料金: <span className="text-blue-600 font-black">{formatPrice(talkDuration === 30 ? (tour.talkSessionConfig?.price30m || 3000) : (tour.talkSessionConfig?.price60m || 5500), currency)}</span></div>
                      </div>

                      <div className="pt-2">
                        <button
                          onClick={() => setIsTalkBooked(false)}
                          className="text-xs text-slate-500 hover:text-blue-600 hover:underline cursor-pointer font-bold"
                        >
                          ← 別の時間スロットを予約する
                        </button>
                      </div>
                    </div>
                  ) : (
                    <form onSubmit={handleTalkBookingSubmit} className="space-y-4">
                      {/* Guide intro banner */}
                      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-3 rounded-xl border border-blue-100 flex items-center gap-3">
                        <img
                          src={tour.guide.avatar}
                          alt={tour.guide.name}
                          className="w-10 h-10 rounded-full object-cover border border-blue-200 flex-shrink-0"
                        />
                        <div className="text-xs">
                          <div className="font-bold text-slate-900 flex items-center gap-1">
                            <span>{tour.guide.name}</span>
                            <span className="text-[10px] px-1.5 py-0.2 rounded bg-blue-600 text-white font-normal">オンライン</span>
                          </div>
                          <div className="text-[11px] text-slate-500 line-clamp-1">
                            愛好歴{tour.guide.otakuYears}年。自宅からZoom/Meetで直結！
                          </div>
                        </div>
                      </div>

                      {/* Duration selector: 30m vs 60m */}
                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1 flex items-center justify-between">
                          <span className="flex items-center gap-1">
                            <Clock className="w-3.5 h-3.5 text-blue-600" />
                            <span>セッション時間</span>
                          </span>
                        </label>
                        <div className="grid grid-cols-2 gap-2">
                          <button
                            type="button"
                            onClick={() => setTalkDuration(30)}
                            className={`p-2.5 rounded-xl border text-left cursor-pointer transition-all ${
                              talkDuration === 30
                                ? 'border-blue-600 bg-blue-50/60 ring-2 ring-blue-600/20'
                                : 'border-slate-200 hover:border-slate-300 bg-slate-50'
                            }`}
                          >
                            <div className="font-bold text-xs text-slate-900">30分 トーク</div>
                            <div className="text-blue-600 font-black text-sm mt-0.5">
                              {formatPrice(tour.talkSessionConfig?.price30m || 3000, currency)}
                            </div>
                            <div className="text-[10px] text-slate-400">気軽な相談・機材質問</div>
                          </button>

                          <button
                            type="button"
                            onClick={() => setTalkDuration(60)}
                            className={`p-2.5 rounded-xl border text-left cursor-pointer transition-all ${
                              talkDuration === 60
                                ? 'border-blue-600 bg-blue-50/60 ring-2 ring-blue-600/20'
                                : 'border-slate-200 hover:border-slate-300 bg-slate-50'
                            }`}
                          >
                            <div className="font-bold text-xs text-slate-900 flex items-center justify-between">
                              <span>60分 ディープ</span>
                              <span className="text-[9px] px-1 rounded bg-amber-100 text-amber-800 font-bold">お得</span>
                            </div>
                            <div className="text-blue-600 font-black text-sm mt-0.5">
                              {formatPrice(tour.talkSessionConfig?.price60m || 5500, currency)}
                            </div>
                            <div className="text-[10px] text-slate-400">作戦会議・マニアック談義</div>
                          </button>
                        </div>
                      </div>

                      {/* Topic Selection */}
                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1 flex items-center gap-1">
                          <Headphones className="w-3.5 h-3.5 text-indigo-600" />
                          <span>トークテーマを選択</span>
                        </label>
                        <select
                          value={talkTopic}
                          onChange={(e) => setTalkTopic(e.target.value)}
                          className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-blue-500 focus:bg-white"
                        >
                          {(tour.talkSessionConfig?.topics || [
                            'マニアックな質問・機材やおすすめスポット相談',
                            '自分専用のオリジナル巡礼ルート作成＆作戦会議',
                            '未公開エピソード・自由オタクトーク'
                          ]).map((t, idx) => (
                            <option key={idx} value={t}>{t}</option>
                          ))}
                        </select>
                      </div>

                      {/* Available Slots */}
                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1 flex items-center gap-1">
                          <Calendar className="w-3.5 h-3.5 text-blue-600" />
                          <span>空きスロットから選択</span>
                        </label>
                        <div className="grid grid-cols-2 gap-1.5">
                          {(tour.talkSessionConfig?.availableSlots || [
                            '本日 20:00〜20:30',
                            '明日 19:30〜20:00',
                            '今週金曜 21:00〜21:30',
                            '今週末 15:00〜15:30'
                          ]).map((slot, idx) => (
                            <button
                              type="button"
                              key={idx}
                              onClick={() => setTalkSlot(slot)}
                              className={`py-2 px-2 rounded-lg text-[11px] font-bold border transition-all cursor-pointer text-center ${
                                talkSlot === slot
                                  ? 'bg-blue-600 text-white border-blue-600 shadow-xs'
                                  : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                              }`}
                            >
                              {slot}
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Participant Contact */}
                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">
                          お名前
                        </label>
                        <input
                          type="text"
                          placeholder="例: 佐藤 健 / Ken"
                          value={talkUserName}
                          onChange={(e) => setTalkUserName(e.target.value)}
                          required
                          className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-500 focus:bg-white"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">
                          メールアドレス（Google Meet招待リンク送信用）
                        </label>
                        <input
                          type="email"
                          placeholder="example@deepdivejapan.com"
                          value={talkUserEmail}
                          onChange={(e) => setTalkUserEmail(e.target.value)}
                          required
                          className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-500 focus:bg-white"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">
                          事前に聞いておきたいこと・相談メモ（任意）
                        </label>
                        <textarea
                          rows={2}
                          placeholder="例: 録音マイクの選び方について聞きたいです。初心者ですがよろしくお願いします！"
                          value={talkUserNotes}
                          onChange={(e) => setTalkUserNotes(e.target.value)}
                          className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-500 focus:bg-white"
                        />
                      </div>

                      {/* Price Summary */}
                      <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 space-y-1.5 text-xs">
                        <div className="flex justify-between items-center text-slate-600">
                          <span>1on1 オンライン会話セッション ({talkDuration}分)</span>
                          <span className="text-blue-600 font-black text-sm">
                            {formatPrice(talkDuration === 30 ? (tour.talkSessionConfig?.price30m || 3000) : (tour.talkSessionConfig?.price60m || 5500), currency)}
                          </span>
                        </div>
                        <div className="text-[10px] text-slate-400">
                          ※Google Meet URLが即時発行され、マイページにも保存されます。
                        </div>
                      </div>

                      {/* Submit Talk Session Button */}
                      <button
                        type="submit"
                        className="w-full py-3.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold text-sm shadow-md shadow-blue-500/25 transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-95"
                      >
                        <Video className="w-4 h-4" />
                        <span>会話セッションを予約する（Meet発行）</span>
                      </button>
                    </form>
                  )
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Shiori Ticket Share Modal */}
      <ShioriShareModal
        tour={tour}
        isOpen={isShareModalOpen}
        onClose={() => setIsShareModalOpen(false)}
        lang={lang}
      />

      {/* Guide Inquiry Chat Modal */}
      <GuideChatModal
        guide={tour.guide}
        tourTitle={lang === 'ja' ? tour.title : tour.titleEn}
        isOpen={isGuideChatOpen}
        onClose={() => setIsGuideChatOpen(false)}
        lang={lang}
      />
    </div>
  );
};
