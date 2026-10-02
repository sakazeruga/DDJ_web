import React, { useState } from 'react';
import { 
  Calendar, 
  Users, 
  Heart, 
  CheckCircle2, 
  Trash2, 
  Sparkles, 
  Bookmark 
} from 'lucide-react';
import type { Booking, Tour, Language } from '../types';
import { translations } from '../i18n/translations';
import { TourCard } from './TourCard';

interface MyPageViewProps {
  lang: Language;
  bookings: Booking[];
  onCancelBooking: (bookingId: string) => void;
  favorites: string[];
  allTours: Tour[];
  onSelectTour: (tour: Tour) => void;
  onToggleFavorite: (tourId: string, e: React.MouseEvent) => void;
  myHostedTours: Tour[];
  onDeleteHostedTour: (tourId: string) => void;
}

export const MyPageView: React.FC<MyPageViewProps> = ({
  lang,
  bookings,
  onCancelBooking,
  favorites,
  allTours,
  onSelectTour,
  onToggleFavorite,
  myHostedTours,
  onDeleteHostedTour,
}) => {
  const t = translations[lang];
  const [activeTab, setActiveTab] = useState<'bookings' | 'favorites' | 'hosted'>('bookings');

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
                          ¥{booking.totalPrice.toLocaleString()}
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
