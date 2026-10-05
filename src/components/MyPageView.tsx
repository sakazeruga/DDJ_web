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
  Clock,
  Edit3,
  Eye,
  Copy
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
  onEditHostedTour?: (tour: Tour) => void;
  onOpenCreateTour?: () => void;
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
  onEditHostedTour,
  onOpenCreateTour,
}) => {
  const t = translations[lang];
  const [activeTab, setActiveTab] = useState<'bookings' | 'talks' | 'favorites' | 'hosted'>('bookings');

  // Favorite tours list
  const favoriteTours = allTours.filter((tour) => favorites.includes(tour.id));

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10">
      {/* Title Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6 sm:mb-8">
        <div>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight mb-1.5">
            {t.myPage.title}
          </h2>
          <p className="text-slate-600 text-xs sm:text-sm">
            {lang === 'ja' 
              ? '予約したツアーやお気に入り、自分で企画したツアーの編集・管理ができます。' 
              : 'Manage bookings, 1on1 sessions, bookmarks, and edit your hosted tours.'}
          </p>
        </div>

        {/* Quick Tour Creation Button */}
        {onOpenCreateTour && (
          <button
            onClick={onOpenCreateTour}
            className="w-full sm:w-auto min-h-[44px] px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs sm:text-sm shadow-sm flex items-center justify-center gap-2 transition-all cursor-pointer active:scale-95"
          >
            <Sparkles className="w-4 h-4 text-yellow-300" />
            <span>{lang === 'ja' ? '新しいツアーを企画する' : 'Host New Tour'}</span>
          </button>
        )}
      </div>

      {/* Touch-Friendly Responsive Tabs */}
      <div className="border-b border-slate-200 pb-3 mb-6 sm:mb-8 overflow-x-auto -mx-4 px-4 sm:mx-0 sm:px-0">
        <div className="flex items-center gap-2 min-w-max">
          <button
            onClick={() => setActiveTab('bookings')}
            className={`min-h-[44px] flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
              activeTab === 'bookings'
                ? 'bg-blue-600 text-white shadow-sm ring-2 ring-blue-500/20'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100 bg-white border border-slate-200 sm:border-transparent'
            }`}
          >
            <Calendar className="w-4 h-4 shrink-0" />
            <span>{t.myPage.bookingsTab}</span>
            <span className={`text-[11px] px-2 py-0.5 rounded-full font-bold ${
              activeTab === 'bookings' ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-600'
            }`}>
              {bookings.length}
            </span>
          </button>

          <button
            onClick={() => setActiveTab('talks')}
            className={`min-h-[44px] flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
              activeTab === 'talks'
                ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-sm ring-2 ring-indigo-500/20'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100 bg-white border border-slate-200 sm:border-transparent'
            }`}
          >
            <Headphones className="w-4 h-4 text-yellow-300 shrink-0" />
            <span>会話セッション</span>
            <span className={`text-[11px] px-2 py-0.5 rounded-full font-bold ${
              activeTab === 'talks' ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-600'
            }`}>
              {talkBookings.length}
            </span>
          </button>

          <button
            onClick={() => setActiveTab('favorites')}
            className={`min-h-[44px] flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
              activeTab === 'favorites'
                ? 'bg-rose-500 text-white shadow-sm ring-2 ring-rose-500/20'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100 bg-white border border-slate-200 sm:border-transparent'
            }`}
          >
            <Bookmark className="w-4 h-4 shrink-0" />
            <span>{t.myPage.favoritesTab}</span>
            <span className={`text-[11px] px-2 py-0.5 rounded-full font-bold ${
              activeTab === 'favorites' ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-600'
            }`}>
              {favoriteTours.length}
            </span>
          </button>

          <button
            onClick={() => setActiveTab('hosted')}
            className={`min-h-[44px] flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
              activeTab === 'hosted'
                ? 'bg-indigo-600 text-white shadow-sm ring-2 ring-indigo-500/20'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100 bg-white border border-slate-200 sm:border-transparent'
            }`}
          >
            <Sparkles className="w-4 h-4 shrink-0" />
            <span>{t.myPage.hostedTab}</span>
            <span className={`text-[11px] px-2 py-0.5 rounded-full font-bold ${
              activeTab === 'hosted' ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-600'
            }`}>
              {myHostedTours.length}
            </span>
          </button>
        </div>
      </div>

      {/* Tab 1: Bookings Content */}
      {activeTab === 'bookings' && (
        <div>
          {bookings.length === 0 ? (
            <div className="text-center py-16 bg-white rounded-3xl border border-slate-200 p-6">
              <Calendar className="w-12 h-12 text-slate-300 mx-auto mb-3" />
              <p className="text-slate-600 font-bold text-sm sm:text-base">{t.myPage.noBookings}</p>
              <p className="text-xs text-slate-400 mt-1">
                {lang === 'ja' ? '気になるディープなカルチャーツアーを探して予約してみましょう！' : 'Browse passion tours and book your next cultural journey!'}
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {bookings.map((booking) => (
                <div
                  key={booking.id}
                  className="bg-white rounded-2xl border border-slate-200 p-4 sm:p-5 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 shadow-xs hover:border-slate-300 transition-colors"
                >
                  <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 w-full md:w-auto min-w-0 flex-1">
                    <img
                      src={booking.tourImage}
                      alt={booking.tourTitle}
                      className="w-full sm:w-24 h-36 sm:h-24 rounded-xl object-cover border border-slate-200 shrink-0"
                    />
                    <div className="min-w-0 flex-1 space-y-1 w-full">
                      <div className="flex flex-wrap items-center gap-2 mb-1">
                        <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200">
                          <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                          <span>{t.myPage.statusConfirmed}</span>
                        </span>
                        <span className="text-[11px] text-slate-400 font-mono">ID: {booking.id.slice(-6)}</span>
                      </div>
                      <h4 className="font-bold text-slate-900 text-sm sm:text-base leading-snug break-words">
                        {booking.tourTitle}
                      </h4>
                      <div className="flex flex-wrap items-center gap-3 text-xs text-slate-600 pt-1">
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                          <span>参加日: <b className="text-slate-900 font-medium">{booking.date}</b></span>
                        </span>
                        <span className="flex items-center gap-1">
                          <Users className="w-3.5 h-3.5 text-indigo-600 shrink-0" />
                          <span>人数: <b className="text-slate-900 font-medium">{booking.participantsCount}名</b></span>
                        </span>
                        <span className="text-blue-700 font-black">
                          {formatPrice(booking.totalPrice, currency)}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-end w-full md:w-auto pt-2 sm:pt-0 border-t md:border-t-0 border-slate-100">
                    <button
                      onClick={() => onCancelBooking(booking.id)}
                      className="min-h-[44px] px-4 py-2 rounded-xl text-xs font-bold text-rose-600 hover:text-rose-700 bg-rose-50 hover:bg-rose-100 border border-rose-200 transition-colors cursor-pointer w-full sm:w-auto text-center flex items-center justify-center gap-1"
                    >
                      <Trash2 className="w-3.5 h-3.5 shrink-0" />
                      <span>{t.myPage.cancelBooking}</span>
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
            <div className="text-center py-16 bg-white rounded-3xl border border-slate-200 p-6">
              <Headphones className="w-12 h-12 text-slate-300 mx-auto mb-3" />
              <p className="text-slate-600 font-bold text-sm sm:text-base">予約済みのオンライン会話セッションはありません。</p>
              <p className="text-xs text-slate-400 mt-1">気になるツアーの詳細画面から、ガイドとの1on1セッションを予約してみましょう！</p>
            </div>
          ) : (
            <div className="space-y-4">
              {talkBookings.map((talk) => (
                <div
                  key={talk.id}
                  className="bg-white rounded-2xl border border-slate-200 p-4 sm:p-5 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 shadow-xs hover:border-blue-300 transition-all"
                >
                  <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 w-full md:w-auto min-w-0 flex-1">
                    <img
                      src={talk.guideAvatar}
                      alt={talk.guideName}
                      className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl object-cover border border-slate-200 shrink-0"
                    />
                    <div className="min-w-0 flex-1 space-y-1 w-full">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-xs">
                          <Video className="w-3 h-3 text-yellow-300" />
                          <span>1on1会話セッション ({talk.durationMinutes}分)</span>
                        </span>
                        <span className="text-[11px] text-slate-400 font-mono">ID: {talk.id.slice(-6)}</span>
                      </div>
                      <h4 className="font-bold text-slate-900 text-sm sm:text-base leading-snug break-words">
                        {talk.tourTitle}
                      </h4>
                      <div className="text-xs text-blue-700 font-bold flex flex-wrap items-center gap-1.5 pt-0.5">
                        <span>ガイド: {talk.guideName}</span>
                        <span className="text-slate-300">|</span>
                        <span className="text-slate-600 font-normal truncate">テーマ: {talk.topic}</span>
                      </div>
                      <div className="flex flex-wrap items-center gap-3 text-xs text-slate-600 pt-0.5">
                        <span className="flex items-center gap-1 font-mono font-bold text-slate-900">
                          <Clock className="w-3.5 h-3.5 text-blue-600" />
                          {talk.timeSlot}
                        </span>
                        <span className="text-slate-300">|</span>
                        <span className="text-blue-700 font-black">
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
                      className="min-h-[44px] px-4 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold text-xs sm:text-sm shadow-sm flex items-center justify-center gap-1.5 transition-all text-center"
                    >
                      <Video className="w-4 h-4 shrink-0" />
                      <span>Google Meetで参加 ➔</span>
                    </a>

                    <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
                      <button
                        type="button"
                        onClick={() => {
                          navigator.clipboard.writeText(talk.meetUrl);
                          alert('Google Meet接続URLをコピーしました！');
                        }}
                        className="min-h-[40px] flex-1 sm:flex-none text-xs text-slate-600 hover:text-slate-900 px-3 py-2 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200 font-bold cursor-pointer flex items-center justify-center gap-1"
                      >
                        <Copy className="w-3.5 h-3.5" />
                        <span>URLコピー</span>
                      </button>

                      {onCancelTalkBooking && (
                        <button
                          type="button"
                          onClick={() => onCancelTalkBooking(talk.id)}
                          className="min-h-[40px] flex-1 sm:flex-none text-xs text-rose-600 hover:text-rose-700 px-3 py-2 rounded-xl bg-rose-50 hover:bg-rose-100 border border-rose-200 font-bold cursor-pointer transition-colors flex items-center justify-center gap-1"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                          <span>キャンセル</span>
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
            <div className="text-center py-16 bg-white rounded-3xl border border-slate-200 p-6">
              <Heart className="w-12 h-12 text-slate-300 mx-auto mb-3" />
              <p className="text-slate-600 font-bold text-sm sm:text-base">{t.myPage.noFavorites}</p>
              <p className="text-xs text-slate-400 mt-1">
                {lang === 'ja' ? 'ツアーカードのハートマークを押してお気に入りに保存しましょう。' : 'Tap the heart button on tour cards to save your favorites.'}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
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

      {/* Tab 3: Hosted Tours Content (With Edit & Management Bar) */}
      {activeTab === 'hosted' && (
        <div>
          {myHostedTours.length === 0 ? (
            <div className="text-center py-16 bg-white rounded-3xl border border-slate-200 p-6">
              <Sparkles className="w-12 h-12 text-slate-300 mx-auto mb-3" />
              <p className="text-slate-600 font-bold text-sm sm:text-base">{t.myPage.noHosted}</p>
              <p className="text-xs text-slate-400 mt-1 mb-5">
                {lang === 'ja' ? 'あなたの偏愛知識をツアーにして世界中のファンを案内しましょう！' : 'Turn your specialized passions into a walking tour.'}
              </p>
              {onOpenCreateTour && (
                <button
                  onClick={onOpenCreateTour}
                  className="min-h-[44px] px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs sm:text-sm shadow-md transition-all cursor-pointer inline-flex items-center gap-2"
                >
                  <Sparkles className="w-4 h-4 text-yellow-300" />
                  <span>{lang === 'ja' ? 'ツアーを企画・投稿する' : 'Host a Tour Now'}</span>
                </button>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
              {myHostedTours.map((tour) => (
                <div key={tour.id} className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs hover:shadow-md transition-shadow flex flex-col">
                  {/* Tour Card Component Preview */}
                  <div className="flex-1">
                    <TourCard
                      tour={tour}
                      lang={lang}
                      currency={currency}
                      onSelect={onSelectTour}
                      isFavorite={favorites.includes(tour.id)}
                      onToggleFavorite={onToggleFavorite}
                    />
                  </div>

                  {/* Clean Dedicated Host Management Action Bar */}
                  <div className="bg-slate-50 border-t border-slate-200 p-3 sm:p-3.5 flex items-center justify-between gap-2">
                    <button
                      type="button"
                      onClick={() => onEditHostedTour && onEditHostedTour(tour)}
                      className="flex-1 min-h-[44px] px-3.5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-xs transition-colors cursor-pointer active:scale-95"
                    >
                      <Edit3 className="w-4 h-4 shrink-0" />
                      <span>{lang === 'ja' ? 'ツアーを編集' : 'Edit Tour'}</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => onSelectTour(tour)}
                      className="min-h-[44px] px-3.5 py-2 rounded-xl bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 font-bold text-xs flex items-center justify-center gap-1 shadow-2xs transition-colors cursor-pointer"
                      title={lang === 'ja' ? '詳細プレビュー' : 'View Details'}
                    >
                      <Eye className="w-4 h-4 shrink-0" />
                      <span className="hidden sm:inline">{lang === 'ja' ? '確認' : 'View'}</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => onDeleteHostedTour(tour.id)}
                      className="min-h-[44px] px-3.5 py-2 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-600 border border-rose-200 font-bold text-xs flex items-center justify-center gap-1 transition-colors cursor-pointer"
                      title={lang === 'ja' ? 'ツアーを削除' : 'Delete Tour'}
                    >
                      <Trash2 className="w-4 h-4 shrink-0" />
                      <span className="hidden sm:inline">{lang === 'ja' ? '削除' : 'Delete'}</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
