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

  // Helper for depth level colors and label
  const getLevelBadge = (level: number) => {
    switch (level) {
      case 5:
        return {
          bg: 'bg-rose-100 text-rose-800 border-rose-200',
          label: lang === 'ja' ? 'Lv.5 専門家・極限の沼' : 'Lv.5 Connoisseur',
          meter: 'w-full bg-rose-500',
        };
      case 4:
        return {
          bg: 'bg-purple-100 text-purple-800 border-purple-200',
          label: lang === 'ja' ? 'Lv.4 ディープ愛好家' : 'Lv.4 Deep Specialist',
          meter: 'w-4/5 bg-purple-500',
        };
      case 3:
        return {
          bg: 'bg-amber-100 text-amber-800 border-amber-200',
          label: lang === 'ja' ? 'Lv.3 中堅・ファン' : 'Lv.3 Enthusiast',
          meter: 'w-3/5 bg-amber-500',
        };
      case 2:
        return {
          bg: 'bg-blue-100 text-blue-800 border-blue-200',
          label: lang === 'ja' ? 'Lv.2 知的好奇心' : 'Lv.2 Curious Fan',
          meter: 'w-2/5 bg-blue-500',
        };
      default:
        return {
          bg: 'bg-emerald-100 text-emerald-800 border-emerald-200',
          label: lang === 'ja' ? 'Lv.1 初心者歓迎・入門' : 'Lv.1 Beginner Friendly',
          meter: 'w-1/5 bg-emerald-500',
        };
    }
  };

  const levelBadge = getLevelBadge(tour.otakuLevel);

  return (
    <div 
      onClick={() => onSelect(tour)}
      className="group relative bg-white rounded-3xl overflow-hidden border border-slate-200 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col cursor-pointer"
    >
      {/* Top Pass Header */}
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

      {/* Image Container */}
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

        {/* Favorite Heart Button */}
        <button
          onClick={(e) => onToggleFavorite(tour.id, e)}
          className={`absolute top-3 right-3 p-2 rounded-full backdrop-blur-md transition-all ${
            isFavorite 
              ? 'bg-rose-500 text-white shadow-md scale-110' 
              : 'bg-white/80 text-slate-700 hover:text-rose-500 hover:bg-white'
          }`}
          aria-label="Save to favorites"
        >
          <Heart className={`w-4 h-4 ${isFavorite ? 'fill-current' : ''}`} />
        </button>

        {/* Area & Duration pill */}
        <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-xs text-white font-medium">
          <div className="flex items-center gap-1 bg-slate-950/80 backdrop-blur-md px-2.5 py-1 rounded-lg">
            <MapPin className="w-3.5 h-3.5 text-yellow-400" />
            <span className="truncate max-w-[140px] font-bold">{lang === 'ja' ? tour.area : tour.areaEn}</span>
          </div>
          <div className="flex items-center gap-1 bg-slate-950/80 backdrop-blur-md px-2.5 py-1 rounded-lg">
            <Clock className="w-3.5 h-3.5 text-blue-300" />
            <span className="font-bold">{tour.durationHours} {t.tourCard.hours}</span>
          </div>
        </div>
      </div>

      {/* Body Content */}
      <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between space-y-4">
        <div>
          {/* Depth Gauge Bar */}
          <div className="mb-2.5">
            <div className="flex justify-between text-[10px] font-bold text-slate-500 mb-1">
              <span>熱量・マニア度</span>
              <span className="text-blue-700 font-mono">LEVEL {tour.otakuLevel} / 5</span>
            </div>
            <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
              <div className={`h-full rounded-full ${levelBadge.meter}`} />
            </div>
          </div>

          {/* Rating */}
          <div className="flex items-center gap-1 text-xs mb-2 font-bold text-amber-500">
            <Star className="w-3.5 h-3.5 fill-current" />
            <span className="text-slate-800">{tour.rating.toFixed(2)}</span>
            <span className="text-slate-400 font-normal">({tour.reviewsCount}件のレビュー)</span>
          </div>

          {/* Tour Title */}
          <h3 className="font-bold text-base sm:text-lg text-slate-900 group-hover:text-blue-600 transition-colors line-clamp-2 leading-snug mb-1.5">
            {lang === 'ja' ? tour.title : tour.titleEn}
          </h3>

          {/* Catchphrase */}
          <p className="text-xs sm:text-sm text-slate-600 line-clamp-2 mb-3 leading-relaxed">
            {lang === 'ja' ? tour.catchphrase : tour.catchphraseEn}
          </p>

          {/* Guide's One Line Note */}
          <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200 mb-3 text-[11px] text-slate-700 flex items-start gap-2">
            <MessageCircle className="w-3.5 h-3.5 text-blue-600 flex-shrink-0 mt-0.5" />
            <span className="line-clamp-1">
              <b>{tour.guide.name}:</b> 「{tour.recommendedPreparation || '熱い想いをお伝えします！'}」
            </span>
          </div>

          {/* Tags */}
          <div className="flex flex-wrap gap-1.5">
            {tour.tags.slice(0, 3).map((tag) => (
              <span
                key={tag}
                className="text-[11px] font-medium px-2 py-0.5 rounded-md bg-slate-100 text-slate-600 border border-slate-200"
              >
                #{tag}
              </span>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div>
          <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
            {/* Guide preview */}
            <div className="flex items-center gap-2">
              <img
                src={tour.guide.avatar}
                alt={tour.guide.name}
                className="w-8 h-8 rounded-full object-cover border border-slate-200 shadow-xs"
              />
              <div className="text-left">
                <div className="text-xs font-bold text-slate-800 line-clamp-1">
                  {lang === 'ja' ? tour.guide.name : tour.guide.nameEn}
                </div>
                <div className="text-[10px] text-blue-600 font-bold">
                  {lang === 'ja' ? `愛好歴${tour.guide.otakuYears}年` : `${tour.guide.otakuYears}y Expertise`}
                </div>
              </div>
            </div>

            {/* Price */}
            <div className="text-right">
              <div className="text-[10px] text-slate-400 font-medium">
                {lang === 'ja' ? '1名あたり' : 'per guest'}
              </div>
              <div className="text-lg font-black text-slate-900">
                <span className="text-blue-600">¥{tour.price.toLocaleString()}</span>
              </div>
            </div>
          </div>

          {/* Action Button CTA */}
          <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-slate-700 group-hover:text-blue-600 transition-colors">
            <span>{t.tourCard.viewDetails}</span>
            <div className="px-2.5 py-1 rounded-lg bg-slate-100 group-hover:bg-blue-600 group-hover:text-white flex items-center gap-1 transition-all font-bold">
              <span>詳細・日程へ</span>
              <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
