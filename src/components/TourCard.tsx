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
  MessageCircle
} from 'lucide-react';
import type { Tour, Language } from '../types';
import { translations } from '../i18n/translations';

interface TourCardProps {
  tour: Tour;
  lang: Language;
  onSelect: (tour: Tour) => void;
  isFavorite: boolean;
  onToggleFavorite: (tourId: string, e: React.MouseEvent) => void;
}

export const TourCard: React.FC<TourCardProps> = ({
  tour,
  lang,
  onSelect,
  isFavorite,
  onToggleFavorite,
}) => {
  const t = translations[lang];

  // Helper for otaku depth level colors and label
  const getLevelBadge = (level: number) => {
    switch (level) {
      case 5:
        return {
          bg: 'otaku-badge-pink',
          label: lang === 'ja' ? 'Lv.5 超限界オタク・沼' : 'Lv.5 Hardcore Abyss',
          meter: 'w-full bg-rose-500',
        };
      case 4:
        return {
          bg: 'bg-purple-600 text-white border-2 border-black shadow-[2px_2px_0px_#000]',
          label: lang === 'ja' ? 'Lv.4 ヘビーオタク' : 'Lv.4 Heavy Otaku',
          meter: 'w-4/5 bg-purple-500',
        };
      case 3:
        return {
          bg: 'otaku-badge-yellow',
          label: lang === 'ja' ? 'Lv.3 ガチ推し・中堅' : 'Lv.3 Core Fan',
          meter: 'w-3/5 bg-yellow-400',
        };
      case 2:
        return {
          bg: 'otaku-badge-cyan',
          label: lang === 'ja' ? 'Lv.2 一般ファン歓迎' : 'Lv.2 Casual Fan',
          meter: 'w-2/5 bg-cyan-400',
        };
      default:
        return {
          bg: 'bg-emerald-500 text-slate-950 font-bold border-2 border-black shadow-[2px_2px_0px_#000]',
          label: lang === 'ja' ? 'Lv.1 ビギナー安心' : 'Lv.1 Beginner Friendly',
          meter: 'w-1/5 bg-emerald-400',
        };
    }
  };

  const levelBadge = getLevelBadge(tour.otakuLevel);

  return (
    <div 
      onClick={() => onSelect(tour)}
      className="group relative bg-slate-900 rounded-3xl overflow-hidden border-2 border-slate-700 hover:border-yellow-400/80 transition-all duration-300 flex flex-col cursor-pointer otaku-sticker"
    >
      {/* Top Ticket Header Band */}
      <div className="bg-slate-950 px-4 py-2 border-b border-slate-800 flex items-center justify-between text-[11px] font-mono">
        <div className="flex items-center gap-1.5 text-yellow-400 font-bold">
          <Ticket className="w-3.5 h-3.5" />
          <span>DDJ-TOUR #{tour.id.replace('tour-', '').toUpperCase()}</span>
        </div>
        <div className="flex items-center gap-1 text-slate-400">
          <Languages className="w-3.5 h-3.5 text-cyan-400" />
          <span>{tour.languages.join(' / ')}</span>
        </div>
      </div>

      {/* Top Image Container (Polaroid/Snapshot look) */}
      <div className="relative aspect-[16/10] overflow-hidden bg-slate-950">
        <img
          src={tour.imageUrl}
          alt={lang === 'ja' ? tour.title : tour.titleEn}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent" />

        {/* Otaku Level Badge (Pop sticker) */}
        <div className="absolute top-3 left-3 flex items-center gap-1.5">
          <span className={`px-2.5 py-1 rounded-full text-[11px] font-black flex items-center gap-1 ${levelBadge.bg}`}>
            <Flame className="w-3 h-3 fill-current" />
            <span>{levelBadge.label}</span>
          </span>
        </div>

        {/* Favorite Heart Button */}
        <button
          onClick={(e) => onToggleFavorite(tour.id, e)}
          className={`absolute top-3 right-3 p-2 rounded-full backdrop-blur-md transition-all ${
            isFavorite 
              ? 'bg-pink-600 text-white shadow-lg shadow-pink-600/40 scale-110' 
              : 'bg-slate-900/80 text-slate-300 hover:text-white hover:bg-slate-900'
          }`}
          aria-label="Save to favorites"
        >
          <Heart className={`w-4 h-4 ${isFavorite ? 'fill-current' : ''}`} />
        </button>

        {/* Area & Duration pill */}
        <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-xs text-slate-200 font-medium">
          <div className="flex items-center gap-1 bg-slate-950/90 backdrop-blur-md px-2.5 py-1 rounded-lg border border-slate-700">
            <MapPin className="w-3.5 h-3.5 text-yellow-400" />
            <span className="truncate max-w-[140px] font-bold">{lang === 'ja' ? tour.area : tour.areaEn}</span>
          </div>
          <div className="flex items-center gap-1 bg-slate-950/90 backdrop-blur-md px-2.5 py-1 rounded-lg border border-slate-700">
            <Clock className="w-3.5 h-3.5 text-pink-400" />
            <span className="font-bold">{tour.durationHours} {t.tourCard.hours}</span>
          </div>
        </div>
      </div>

      {/* Body Content */}
      <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between space-y-4">
        <div>
          {/* Otaku Abyss Gauge Bar */}
          <div className="mb-2.5">
            <div className="flex justify-between text-[10px] font-bold text-slate-400 mb-1">
              <span>沼度（オタク深度）</span>
              <span className="text-yellow-400 font-mono">STAGE {tour.otakuLevel} / 5</span>
            </div>
            <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
              <div className={`h-full rounded-full ${levelBadge.meter}`} />
            </div>
          </div>

          {/* Rating */}
          <div className="flex items-center gap-1 text-xs mb-2 font-bold text-amber-400">
            <Star className="w-3.5 h-3.5 fill-current" />
            <span>{tour.rating.toFixed(2)}</span>
            <span className="text-slate-400 font-normal">({tour.reviewsCount}件の巡礼レビュー)</span>
          </div>

          {/* Tour Title */}
          <h3 className="font-black text-base sm:text-lg text-white group-hover:text-yellow-300 transition-colors line-clamp-2 leading-snug mb-1.5">
            {lang === 'ja' ? tour.title : tour.titleEn}
          </h3>

          {/* Catchphrase */}
          <p className="text-xs sm:text-sm text-slate-300 line-clamp-2 mb-3 leading-relaxed">
            {lang === 'ja' ? tour.catchphrase : tour.catchphraseEn}
          </p>

          {/* Guide's Otaku Pitch Speech Bubble */}
          <div className="bg-slate-950/80 p-2.5 rounded-xl border border-slate-800 mb-3 text-[11px] text-purple-200 flex items-start gap-2">
            <MessageCircle className="w-3.5 h-3.5 text-purple-400 flex-shrink-0 mt-0.5" />
            <span className="line-clamp-1 italic">
              <b>{tour.guide.name}:</b> 「{tour.recommendedPreparation || '全力でご案内します！'}」
            </span>
          </div>

          {/* Tags */}
          <div className="flex flex-wrap gap-1.5">
            {tour.tags.slice(0, 3).map((tag) => (
              <span
                key={tag}
                className="text-[11px] font-semibold px-2 py-0.5 rounded-md bg-slate-800 text-slate-300 border border-slate-700"
              >
                #{tag}
              </span>
            ))}
          </div>
        </div>

        {/* Footer: Guide Info & Price */}
        <div>
          <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between">
            {/* Guide preview */}
            <div className="flex items-center gap-2">
              <img
                src={tour.guide.avatar}
                alt={tour.guide.name}
                className="w-8 h-8 rounded-full object-cover border-2 border-yellow-400 shadow-md"
              />
              <div className="text-left">
                <div className="text-xs font-bold text-slate-200 line-clamp-1">
                  {lang === 'ja' ? tour.guide.name : tour.guide.nameEn}
                </div>
                <div className="text-[10px] text-yellow-400 font-extrabold">
                  {lang === 'ja' ? `オタク歴${tour.guide.otakuYears}年` : `${tour.guide.otakuYears}y Otaku`}
                </div>
              </div>
            </div>

            {/* Price */}
            <div className="text-right">
              <div className="text-[10px] text-slate-400 font-medium">
                {lang === 'ja' ? '1名 (マップ込)' : 'per guest'}
              </div>
              <div className="text-lg font-black text-white">
                <span className="text-yellow-400">¥{tour.price.toLocaleString()}</span>
              </div>
            </div>
          </div>

          {/* Action Button CTA (Tour Booking Ticket Look) */}
          <div className="mt-3 pt-2.5 border-t border-slate-800 flex items-center justify-between text-xs font-black text-slate-200 group-hover:text-yellow-400 transition-colors">
            <span>{t.tourCard.viewDetails}</span>
            <div className="px-2.5 py-1 rounded-lg bg-slate-800 group-hover:bg-yellow-400 group-hover:text-slate-950 flex items-center gap-1 transition-all font-bold">
              <span>旅程を見る</span>
              <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
