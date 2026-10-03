import React, { useState } from 'react';
import { 
  Calendar, 
  Users, 
  Heart, 
  CheckCircle2, 
  Trash2, 
  Sparkles, 
  Bookmark,
  Headphones,
  Video,
  Clock
} from 'lucide-react';
import type { Booking, TalkSessionBooking, Tour, Language, Currency } from '../types';
import { translations } from '../i18n/translations';
import { formatPrice } from '../utils/currency';
import { TourCard } from './TourCard';

interface MyPageViewProps {
  lang: Language;
  currency?: Currency;
  bookings: Booking[];
  onCancelBooking: (bookingId: string) => void;
  talkBookings?: TalkSessionBooking[];
  onCancelTalkBooking?: (talkId: string) => void;
  favorites: string[];
  allTours: Tour[];
  onSelectTour: (tour: Tour) => void;
  onToggleFavorite: (tourId: string, e: React.MouseEvent) => void;
  myHostedTours: Tour[];
  onDeleteHostedTour: (tourId: string) => void;
}

export const MyPageView: React.FC<MyPageViewProps> = ({
  lang,
  currency = 'JPY',
  bookings,
  onCancelBooking,
  talkBookings = [],
  onCancelTalkBooking,
  favorites,
  allTours,
  onSelectTour,
  onToggleFavorite,
  myHostedTours,
  onDeleteHostedTour,
}) => {
  const t = translations[lang];
  const [activeTab, setActiveTab] = useState<'bookings' | 'talks' | 'favorites' | 'hosted'>('bookings');

  // Favorite tours list
  const favoriteTours = allTours.filter((tour) => favorites.includes(tour.id));

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
      {/* Title */}
      <div className="mb-8">
        <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight mb-2">
          {t.myPage.title}
        </h2>
        <p className="text-slate-600 text-xs sm:text-sm">
          {lang === 'ja' ? '予約したツアーやお気に入り、自分で企画したツアーを管理できます。' : 'Manage your upcoming bookings, bookmarks, and hosted tours.'}
        </p>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-4 mb-8 overflow-x-auto">
        <button
          onClick={() => setActiveTab('bookings')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
            activeTab === 'bookings'
              ? 'bg-blue-600 text-white shadow-sm'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          <Calendar className="w-4 h-4" />
          <span>{t.myPage.bookingsTab}</span>
          <span className="ml-1 text-xs px-2 py-0.5 rounded-full bg-white/20 text-white">
            {bookings.length}
          </span>
        </button>

        <button
          onClick={() => setActiveTab('talks')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
            activeTab === 'talks'
              ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-sm'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          <Headphones className="w-4 h-4 text-yellow-300" />
          <span>会話セッション</span>
          <span className="ml-1 text-xs px-2 py-0.5 rounded-full bg-white/20 text-white">
            {talkBookings.length}
          </span>
        </button>

        <button
          onClick={() => setActiveTab('favorites')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
            activeTab === 'favorites'
              ? 'bg-rose-500 text-white shadow-sm'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          <Bookmark className="w-4 h-4" />
          <span>{t.myPage.favoritesTab}</span>
          <span className="ml-1 text-xs px-2 py-0.5 rounded-full bg-white/20 text-white">
            {favoriteTours.length}
          </span>
        </button>

        <button
          onClick={() => setActiveTab('hosted')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
            activeTab === 'hosted'
              ? 'bg-indigo-600 text-white shadow-sm'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          <Sparkles className="w-4 h-4" />
          <span>{t.myPage.hostedTab}</span>
          <span className="ml-1 text-xs px-2 py-0.5 rounded-full bg-white/20 text-white">
            {myHostedTours.length}
          </span>
        </button>
      </div>

      {/* Tab 1: Bookings Content */}
      {activeTab === 'bookings' && (
        <div>
          {bookings.length === 0 ? (
            <div className="text-center py-16 bg-white rounded-3xl border border-slate-200">
              <Calendar className="w-12 h-12 text-slate-300 mx-auto mb-3" />
              <p className="text-slate-500 text-sm">{t.myPage.noBookings}</p>
            </div>
          ) : (
            <div className="space-y-4">
              {bookings.map((booking) => (
                <div
                  key={booking.id}
                  className="bg-white rounded-2xl border border-slate-200 p-5 flex flex-col md:flex-row items-start md:items-center justify-between gap-5 shadow-xs"
                >
                  <div className="flex items-center gap-4">
                    <img
                      src={booking.tourImage}
                      alt={booking.tourTitle}
                      className="w-20 h-20 rounded-xl object-cover border border-slate-200"
                    />
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200">
                          <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                          <span>{t.myPage.statusConfirmed}</span>
                        </span>
                        <span className="text-xs text-slate-400 font-mono">ID: {booking.id.slice(-6)}</span>
                      </div>
                      <h4 className="font-bold text-slate-900 text-base">{booking.tourTitle}</h4>
                      <div className="flex flex-wrap items-center gap-3 text-xs text-slate-600 mt-1.5">
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3.5 h-3.5 text-blue-600" />
                          参加日: <b className="text-slate-900">{booking.date}</b>
                        </span>
                        <span className="flex items-center gap-1">
                          <Users className="w-3.5 h-3.5 text-indigo-600" />
                          参加人数: <b className="text-slate-900">{booking.participantsCount}名</b>
                        </span>
                        <span className="text-blue-600 font-bold">
                          {formatPrice(booking.totalPrice, currency)}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 self-end md:self-center">
                    <button
                      onClick={() => onCancelBooking(booking.id)}
                      className="text-xs text-rose-600 hover:text-rose-800 hover:underline px-3 py-2 cursor-pointer font-medium"
                    >
                      {t.myPage.cancelBooking}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Tab: Online Talk Sessions Content */}
      {activeTab === 'talks' && (
        <div>
          {talkBookings.length === 0 ? (
            <div className="text-center py-16 bg-white rounded-3xl border border-slate-200">
              <Headphones className="w-12 h-12 text-slate-300 mx-auto mb-3" />
              <p className="text-slate-500 text-sm">予約済みのオンライン会話セッションはありません。</p>
              <p className="text-xs text-slate-400 mt-1">気になるツアーの詳細画面から、ガイドとの1on1セッションを予約してみましょう！</p>
            </div>
          ) : (
            <div className="space-y-4">
              {talkBookings.map((talk) => (
                <div
                  key={talk.id}
                  className="bg-white rounded-2xl border border-slate-200 p-5 flex flex-col md:flex-row items-start md:items-center justify-between gap-5 shadow-xs hover:border-blue-300 transition-all"
                >
                  <div className="flex items-center gap-4">
                    <img
                      src={talk.guideAvatar}
                      alt={talk.guideName}
                      className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl object-cover border border-slate-200 flex-shrink-0"
                    />
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-xs">
                          <Video className="w-3 h-3 text-yellow-300" />
                          <span>1on1会話セッション ({talk.durationMinutes}分)</span>
                        </span>
                        <span className="text-xs text-slate-400 font-mono">ID: {talk.id.slice(-6)}</span>
                      </div>
                      <h4 className="font-bold text-slate-900 text-base">{talk.tourTitle}</h4>
                      <div className="text-xs text-blue-700 font-bold flex items-center gap-1">
                        <span>ガイド: {talk.guideName}</span>
                        <span className="text-slate-300">|</span>
                        <span className="text-slate-600 font-normal">テーマ: {talk.topic}</span>
                      </div>
                      <div className="flex flex-wrap items-center gap-3 text-xs text-slate-600 pt-0.5">
                        <span className="flex items-center gap-1 font-mono font-bold text-slate-900">
                          <Clock className="w-3.5 h-3.5 text-blue-600" />
                          {talk.timeSlot}
                        </span>
                        <span className="text-slate-300">|</span>
                        <span className="text-blue-600 font-black">
                          {formatPrice(talk.totalPrice, currency)}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row md:flex-col items-stretch md:items-end justify-between w-full md:w-auto gap-2.5 pt-3 md:pt-0 border-t md:border-t-0 border-slate-100">
                    <a
                      href={talk.meetUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold text-xs shadow-sm flex items-center justify-center gap-1.5 transition-all text-center"
                    >
                      <Video className="w-3.5 h-3.5" />
                      <span>Google Meetで参加 ➔</span>
                    </a>

                    <div className="flex items-center justify-end gap-2">
                      <button
                        type="button"
                        onClick={() => {
                          navigator.clipboard.writeText(talk.meetUrl);
                          alert('Google Meet接続URLをコピーしました！');
                        }}
                        className="text-xs text-slate-500 hover:text-slate-800 px-2 py-1 rounded hover:bg-slate-100 font-medium cursor-pointer"
                      >
                        URLコピー
                      </button>

                      {onCancelTalkBooking && (
                        <button
                          type="button"
                          onClick={() => onCancelTalkBooking(talk.id)}
                          className="text-xs text-rose-500 hover:text-rose-700 px-2 py-1 rounded hover:bg-rose-50 font-bold cursor-pointer transition-colors"
                        >
                          キャンセル
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Tab 2: Favorites Content */}
      {activeTab === 'favorites' && (
        <div>
          {favoriteTours.length === 0 ? (
            <div className="text-center py-16 bg-white rounded-3xl border border-slate-200">
              <Heart className="w-12 h-12 text-slate-300 mx-auto mb-3" />
              <p className="text-slate-500 text-sm">{t.myPage.noFavorites}</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {favoriteTours.map((tour) => (
                <TourCard
                  key={tour.id}
                  tour={tour}
                  lang={lang}
                  currency={currency}
                  onSelect={onSelectTour}
                  isFavorite={true}
                  onToggleFavorite={onToggleFavorite}
                />
              ))}
            </div>
          )}
        </div>
      )}

      {/* Tab 3: Hosted Tours Content */}
      {activeTab === 'hosted' && (
        <div>
          {myHostedTours.length === 0 ? (
            <div className="text-center py-16 bg-white rounded-3xl border border-slate-200">
              <Sparkles className="w-12 h-12 text-slate-300 mx-auto mb-3" />
              <p className="text-slate-500 text-sm">{t.myPage.noHosted}</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {myHostedTours.map((tour) => (
                <div key={tour.id} className="relative group">
                  <TourCard
                    tour={tour}
                    lang={lang}
                    onSelect={onSelectTour}
                    isFavorite={favorites.includes(tour.id)}
                    onToggleFavorite={onToggleFavorite}
                  />
                  <button
                    onClick={() => onDeleteHostedTour(tour.id)}
                    className="absolute top-3 left-3 z-10 p-2 rounded-xl bg-rose-50 hover:bg-rose-100 border border-rose-300 text-rose-600 transition-colors cursor-pointer shadow-sm"
                    title="ツアーを削除"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
