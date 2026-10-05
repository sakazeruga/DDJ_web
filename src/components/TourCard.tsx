import React from 'react';
import { 
  Clock, 
  MapPin, 
  Star, 
  Heart, 
  Flame, 
  Languages,
  ChevronRight,
  Ticket,
  Compass
} from 'lucide-react';
import type { Tour, Language, Currency } from '../types';
import { translations } from '../i18n/translations';
import { formatPrice } from '../utils/currency';

interface TourCardProps {
  tour: Tour;
  lang: Language;
  currency?: Currency;
  onSelect: (tour: Tour) => void;
  isFavorite: boolean;
  onToggleFavorite: (tourId: string, e: React.MouseEvent) => void;
}

export const TourCard: React.FC<TourCardProps> = ({
  tour,
  lang,
  currency = 'JPY',
  onSelect,
  isFavorite,
  onToggleFavorite,
}) => {
  const t = translations[lang];

  // Helper for depth level colors and label
  const getLevelBadge = (level: number) => {
    switch (level) {
      case 5:
        return {
          bg: 'bg-rose-100 text-rose-800 border-rose-200',
          label: lang === 'ja' ? 'Lv.5 極限の沼' : 'Lv.5 Connoisseur',
          meter: 'w-full bg-rose-500',
        };
      case 4:
        return {
          bg: 'bg-purple-100 text-purple-800 border-purple-200',
          label: lang === 'ja' ? 'Lv.4 ディープ' : 'Lv.4 Deep',
          meter: 'w-4/5 bg-purple-500',
        };
      case 3:
        return {
          bg: 'bg-amber-100 text-amber-800 border-amber-200',
          label: lang === 'ja' ? 'Lv.3 愛好家' : 'Lv.3 Enthusiast',
          meter: 'w-3/5 bg-amber-500',
        };
      case 2:
        return {
          bg: 'bg-blue-100 text-blue-800 border-blue-200',
          label: lang === 'ja' ? 'Lv.2 好奇心' : 'Lv.2 Curious',
          meter: 'w-2/5 bg-blue-500',
        };
      default:
        return {
          bg: 'bg-emerald-100 text-emerald-800 border-emerald-200',
          label: lang === 'ja' ? 'Lv.1 初心者歓迎' : 'Lv.1 Beginner',
          meter: 'w-1/5 bg-emerald-500',
        };
    }
  };

  const levelBadge = getLevelBadge(tour.otakuLevel);

  return (
    <div 
      onClick={() => onSelect(tour)}
      className="group relative bg-white rounded-3xl overflow-hidden border border-slate-200 shadow-xs hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col cursor-pointer"
    >
      {/* Top Ticket Header */}
      <div className="bg-slate-50 px-4 py-2 border-b border-slate-200 flex items-center justify-between text-[11px] font-mono">
        <div className="flex items-center gap-1.5 text-blue-700 font-bold">
          <Ticket className="w-3.5 h-3.5" />
          <span>DDJ-TOUR #{tour.id.replace('tour-', '').toUpperCase()}</span>
        </div>
        <div className="flex items-center gap-1 text-slate-500 font-medium">
          <Languages className="w-3.5 h-3.5 text-blue-500" />
          <span>{tour.languages.join(' / ')}</span>
        </div>
      </div>

      {/* Image Container with Badges */}
      <div className="relative aspect-[16/10] overflow-hidden bg-slate-100">
        <img
          src={tour.imageUrl}
          alt={lang === 'ja' ? tour.title : tour.titleEn}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 via-transparent to-transparent" />

        {/* Level Badge */}
        <div className="absolute top-3 left-3 flex items-center gap-1.5">
          <span className={`px-2.5 py-1 rounded-full text-[11px] font-bold border shadow-xs flex items-center gap-1 ${levelBadge.bg}`}>
            <Flame className="w-3 h-3 fill-current" />
            <span>{levelBadge.label}</span>
          </span>
        </div>

        {/* Favorite Button (44px touch target) */}
        <button
          onClick={(e) => onToggleFavorite(tour.id, e)}
          className={`absolute top-2.5 right-2.5 w-11 h-11 rounded-full backdrop-blur-md transition-all flex items-center justify-center cursor-pointer z-10 ${
            isFavorite 
              ? 'bg-rose-500 text-white shadow-md scale-105' 
              : 'bg-white/90 text-slate-700 hover:text-rose-500 hover:bg-white shadow-sm active:scale-95'
          }`}
          aria-label="Save to favorites"
        >
          <Heart className={`w-5 h-5 ${isFavorite ? 'fill-current' : ''}`} />
        </button>

        {/* Area & Duration Pill */}
        <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-xs text-white font-medium">
          <div className="flex items-center gap-1 bg-slate-950/80 backdrop-blur-md px-2.5 py-1 rounded-lg">
            <MapPin className="w-3.5 h-3.5 text-yellow-400" />
            <span className="truncate max-w-[130px] font-bold">{lang === 'ja' ? tour.area : tour.areaEn}</span>
          </div>
          <div className="flex items-center gap-1 bg-slate-950/80 backdrop-blur-md px-2.5 py-1 rounded-lg">
            <Clock className="w-3.5 h-3.5 text-blue-300" />
            <span className="font-bold">{tour.durationHours} {t.tourCard.hours}</span>
          </div>
        </div>
      </div>

      {/* Body Content - Lean & Visual */}
      <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between space-y-3">
        <div>
          {/* Rating & Nearby Spots Pill */}
          <div className="flex items-center justify-between gap-2 mb-2 text-xs">
            <div className="flex items-center gap-1 font-bold text-amber-500">
              <Star className="w-3.5 h-3.5 fill-current" />
              <span className="text-slate-800">{tour.rating.toFixed(2)}</span>
              <span className="text-slate-400 font-normal text-[11px]">({tour.reviewsCount})</span>
            </div>

            {tour.nearbySpots && tour.nearbySpots.length > 0 && (
              <span className="text-[10px] font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded-full border border-blue-200 flex items-center gap-1">
                <Compass className="w-3 h-3 text-blue-600" />
                <span>マップ・周辺{tour.nearbySpots.length}件</span>
              </span>
            )}
          </div>

          {/* Tour Title */}
          <h3 className="font-bold text-base text-slate-900 group-hover:text-blue-600 transition-colors line-clamp-2 leading-snug mb-1">
            {lang === 'ja' ? tour.title : tour.titleEn}
          </h3>

          {/* Catchphrase (Compact 1 line) */}
          <p className="text-xs text-slate-500 line-clamp-1 mb-2.5">
            {lang === 'ja' ? tour.catchphrase : tour.catchphraseEn}
          </p>

          {/* Tags */}
          <div className="flex flex-wrap gap-1.5">
            {tour.tags.slice(0, 3).map((tag) => (
              <span
                key={tag}
                className="text-[10px] font-medium px-2 py-0.5 rounded-md bg-slate-100 text-slate-600"
              >
                #{tag}
              </span>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="pt-3 border-t border-slate-100 space-y-2.5">
          <div className="flex items-center justify-between">
            {/* Guide Preview */}
            <div className="flex items-center gap-2">
              <img
                src={tour.guide.avatar}
                alt={tour.guide.name}
                className="w-7 h-7 rounded-full object-cover border border-slate-200 shadow-xs"
              />
              <div className="text-left">
                <div className="text-xs font-bold text-slate-800 line-clamp-1">
                  {lang === 'ja' ? tour.guide.name : tour.guide.nameEn}
                </div>
                <div className="text-[10px] text-blue-600 font-medium">
                  {lang === 'ja' ? `愛好歴${tour.guide.otakuYears}年` : `${tour.guide.otakuYears}y Exp`}
                </div>
              </div>
            </div>

            {/* Price */}
            <div className="text-right">
              <span className="text-lg font-black text-blue-600">
                {formatPrice(tour.price, currency)}
              </span>
              <span className="text-[10px] text-slate-400 ml-1">/人</span>
            </div>
          </div>

          {/* Action Button CTA (min 44px touch target) */}
          <div className="w-full min-h-[44px] px-3.5 rounded-xl bg-slate-50 group-hover:bg-blue-600 text-slate-700 group-hover:text-white flex items-center justify-between transition-all text-xs font-bold shadow-2xs">
            <span>{t.tourCard.viewDetails}</span>
            <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </div>
        </div>
      </div>
    </div>
  );
};
