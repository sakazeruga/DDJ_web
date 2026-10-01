import { 
  Clock, 
  MapPin, 
  Star, 
  Heart, 
  Flame, 
  Languages,
  ChevronRight
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
          bg: 'bg-gradient-to-r from-pink-600 to-rose-600 text-white border-pink-400',
          label: lang === 'ja' ? 'Lv.5 超限界オタク' : 'Lv.5 Hardcore Abyss',
        };
      case 4:
        return {
          bg: 'bg-purple-900/90 text-purple-200 border-purple-500/60',
          label: lang === 'ja' ? 'Lv.4 ヘビーオタク' : 'Lv.4 Heavy Otaku',
        };
      case 3:
        return {
          bg: 'bg-indigo-900/90 text-indigo-200 border-indigo-500/60',
          label: lang === 'ja' ? 'Lv.3 中堅オタク' : 'Lv.3 Intermediate',
        };
      case 2:
        return {
          bg: 'bg-cyan-900/90 text-cyan-200 border-cyan-500/60',
          label: lang === 'ja' ? 'Lv.2 ファン歓迎' : 'Lv.2 Casual Fan',
        };
      default:
        return {
          bg: 'bg-emerald-900/90 text-emerald-200 border-emerald-500/60',
          label: lang === 'ja' ? 'Lv.1 ビギナー歓迎' : 'Lv.1 Beginner Friendly',
        };
    }
  };

  const levelBadge = getLevelBadge(tour.otakuLevel);

  return (
    <div 
      onClick={() => onSelect(tour)}
      className="group relative bg-slate-900/90 rounded-2xl overflow-hidden border border-slate-800 hover:border-purple-500/60 transition-all duration-300 hover:shadow-xl hover:shadow-purple-600/10 flex flex-col cursor-pointer"
    >
      {/* Top Image Container */}
      <div className="relative aspect-[16/10] overflow-hidden bg-slate-950">
        <img
          src={tour.imageUrl}
          alt={lang === 'ja' ? tour.title : tour.titleEn}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/20 to-transparent" />

        {/* Otaku Level Badge */}
        <div className="absolute top-3 left-3 flex items-center gap-1.5">
          <span className={`px-2.5 py-1 rounded-full text-xs font-bold border shadow-md flex items-center gap-1 ${levelBadge.bg}`}>
            <Flame className="w-3.5 h-3.5 fill-current" />
            <span>{levelBadge.label}</span>
          </span>
        </div>

        {/* Favorite Button */}
        <button
          onClick={(e) => onToggleFavorite(tour.id, e)}
          className={`absolute top-3 right-3 p-2 rounded-full backdrop-blur-md transition-all ${
            isFavorite 
              ? 'bg-pink-600 text-white shadow-lg shadow-pink-600/40 scale-110' 
              : 'bg-slate-900/70 text-slate-300 hover:text-white hover:bg-slate-900'
          }`}
          aria-label="Save to favorites"
        >
          <Heart className={`w-4 h-4 ${isFavorite ? 'fill-current' : ''}`} />
        </button>

        {/* Area & Duration pill */}
        <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-xs text-slate-300 font-medium">
          <div className="flex items-center gap-1 bg-slate-950/80 backdrop-blur-md px-2.5 py-1 rounded-md border border-slate-800">
            <MapPin className="w-3.5 h-3.5 text-cyan-400" />
            <span className="truncate max-w-[140px]">{lang === 'ja' ? tour.area : tour.areaEn}</span>
          </div>
          <div className="flex items-center gap-1 bg-slate-950/80 backdrop-blur-md px-2.5 py-1 rounded-md border border-slate-800">
            <Clock className="w-3.5 h-3.5 text-purple-400" />
            <span>{tour.durationHours} {t.tourCard.hours}</span>
          </div>
        </div>
      </div>

      {/* Body Content */}
      <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between">
        <div>
          {/* Rating & Languages */}
          <div className="flex items-center justify-between text-xs mb-2">
            <div className="flex items-center gap-1 font-bold text-amber-400">
              <Star className="w-3.5 h-3.5 fill-current" />
              <span>{tour.rating.toFixed(2)}</span>
              <span className="text-slate-400 font-normal">({tour.reviewsCount})</span>
            </div>
            <div className="flex items-center gap-1 text-slate-400 font-medium">
              <Languages className="w-3.5 h-3.5 text-cyan-400" />
              <span>{tour.languages.join(' / ')}</span>
            </div>
          </div>

          {/* Tour Title */}
          <h3 className="font-bold text-base sm:text-lg text-white group-hover:text-cyan-300 transition-colors line-clamp-2 mb-1.5 leading-snug">
            {lang === 'ja' ? tour.title : tour.titleEn}
          </h3>

          {/* Catchphrase */}
          <p className="text-xs sm:text-sm text-slate-300 line-clamp-2 mb-3 leading-relaxed">
            {lang === 'ja' ? tour.catchphrase : tour.catchphraseEn}
          </p>

          {/* Tags */}
          <div className="flex flex-wrap gap-1.5 mb-4">
            {tour.tags.slice(0, 3).map((tag) => (
              <span
                key={tag}
                className="text-[11px] px-2 py-0.5 rounded bg-slate-800/80 text-slate-300 border border-slate-700/50"
              >
                #{tag}
              </span>
            ))}
          </div>
        </div>

        {/* Footer: Guide Info & Price */}
        <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between">
          {/* Guide preview */}
          <div className="flex items-center gap-2">
            <img
              src={tour.guide.avatar}
              alt={tour.guide.name}
              className="w-7 h-7 rounded-full object-cover border border-purple-500/50"
            />
            <div className="text-left">
              <div className="text-xs font-semibold text-slate-200 line-clamp-1">
                {lang === 'ja' ? tour.guide.name : tour.guide.nameEn}
              </div>
              <div className="text-[10px] text-purple-400 font-medium">
                {lang === 'ja' ? `オタク歴${tour.guide.otakuYears}年` : `${tour.guide.otakuYears}y Otaku`}
              </div>
            </div>
          </div>

          {/* Price */}
          <div className="text-right">
            <div className="text-xs text-slate-400 font-medium">
              {lang === 'ja' ? '1名あたり' : 'from'}
            </div>
            <div className="text-base sm:text-lg font-black text-white">
              <span className="text-cyan-400">¥{tour.price.toLocaleString()}</span>
            </div>
          </div>
        </div>

        {/* Action Button CTA */}
        <div className="mt-3 pt-2.5 border-t border-slate-800/60 flex items-center justify-between text-xs font-bold text-slate-300 group-hover:text-cyan-400 transition-colors">
          <span>{t.tourCard.viewDetails}</span>
          <div className="w-6 h-6 rounded-full bg-slate-800 group-hover:bg-cyan-500/20 group-hover:text-cyan-300 flex items-center justify-center transition-colors">
            <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
          </div>
        </div>
      </div>
    </div>
  );
};
