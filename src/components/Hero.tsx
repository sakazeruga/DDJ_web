import React from 'react';
import { Search, MapPin, Star, PlusCircle, Compass, Sparkles, ChevronRight } from 'lucide-react';
import type { Language, TourCategory } from '../types';
import { translations } from '../i18n/translations';

interface HeroProps {
  lang: Language;
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  selectedCategory: TourCategory | 'all';
  setSelectedCategory: (cat: TourCategory | 'all') => void;
  onSearch: () => void;
  openCreateModal: () => void;
  onTagClick?: (tag: string) => void;
  onSelectTourById?: (tourId: string) => void;
}

export const Hero: React.FC<HeroProps> = ({
  lang,
  searchQuery,
  setSearchQuery,
  selectedCategory: _selectedCategory,
  setSelectedCategory,
  onSearch,
  openCreateModal,
  onTagClick: _onTagClick,
  onSelectTourById,
}) => {
  const t = translations[lang];

  // Visual Category Quick Chips with Photos (ID-based, safe and direct)
  const visualChips = [
    {
      category: 'music-sound' as TourCategory,
      tourId: 'tour-mottainai-sound',
      label: lang === 'ja' ? '音楽・音風景' : 'Music & Sound',
      img: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=200&q=80',
    },
    {
      category: 'history-castle' as TourCategory,
      tourId: 'tour-1',
      label: lang === 'ja' ? '歴史・幕末' : 'History & Samurai',
      img: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&w=200&q=80',
    },
    {
      category: 'railway-train' as TourCategory,
      tourId: 'tour-2',
      label: lang === 'ja' ? '鉄道・江ノ電' : 'Railways & Trams',
      img: 'https://images.unsplash.com/photo-1503899036084-c55cdd92da26?auto=format&fit=crop&w=200&q=80',
    },
    {
      category: 'anime-pilgrimage' as TourCategory,
      tourId: 'tour-6',
      label: lang === 'ja' ? 'アニメ聖地' : 'Anime Pilgrimage',
      img: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=200&q=80',
    },
    {
      category: 'retro-showa' as TourCategory,
      tourId: 'tour-3',
      label: lang === 'ja' ? '昭和レトロ・古書' : 'Retro & Bookshops',
      img: 'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?auto=format&fit=crop&w=200&q=80',
    },
    {
      category: 'history-castle' as TourCategory,
      tourId: 'tour-4',
      label: lang === 'ja' ? '城郭・要塞' : 'Castle Fortresses',
      img: 'https://images.unsplash.com/photo-1528164344705-475426879c0d?auto=format&fit=crop&w=200&q=80',
    },
  ];

  return (
    <div className="relative overflow-hidden bg-slate-950 text-white">
      {/* Full-bleed Cinematic Hero Background */}
      <div className="absolute inset-0">
        <img
          src="/assets/japan_culture_tours_hero.jpg"
          alt="Deep Dive Japan Hero"
          className="w-full h-full object-cover object-center scale-102 filter brightness-85"
        />
        {/* Multi-layered luxury gradients for perfect text readability and depth */}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/60 to-slate-950/40" />
        <div className="absolute inset-0 bg-gradient-to-r from-slate-950/80 via-slate-950/40 to-transparent" />
      </div>

      {/* Floating Official Stamp Badge (top-right) */}
      <div className="absolute top-4 right-4 sm:top-8 sm:right-8 z-10 w-20 h-20 sm:w-28 sm:h-28 stamp-seal pointer-events-none opacity-90 drop-shadow-2xl">
        <img
          src="/assets/seichi_stamp.jpg"
          alt="公式巡礼印"
          className="w-full h-full object-contain rounded-full border-2 border-white/20 shadow-2xl"
        />
      </div>

      {/* Hero Content Container */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 pb-12 sm:pt-16 sm:pb-20">
        <div className="max-w-3xl space-y-5 text-left">
          {/* Subtle Accent Pill */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white/15 backdrop-blur-md border border-white/25 text-xs font-bold text-white shadow-lg">
            <Sparkles className="w-3.5 h-3.5 text-yellow-300 animate-pulse" />
            <span>{lang === 'ja' ? '日本の文化・聖地・偏愛ツアープラットフォーム' : 'Authentic Cultural & Pilgrimage Tours in Japan'}</span>
          </div>

          {/* Clean, Powerful Heading (No broken text) */}
          <div className="space-y-2">
            <h1 className="text-3xl sm:text-5xl md:text-6xl font-black tracking-tight leading-[1.15] drop-shadow-md text-white">
              {lang === 'ja' ? (
                <>
                  <span className="block text-slate-100">好きを極める、</span>
                  <span className="bg-gradient-to-r from-blue-400 via-sky-300 to-amber-300 bg-clip-text text-transparent">
                    日本の旅へ。
                  </span>
                </>
              ) : (
                <>
                  <span className="block text-slate-100">Beyond the Guidebooks:</span>
                  <span className="bg-gradient-to-r from-blue-400 via-sky-300 to-amber-300 bg-clip-text text-transparent">
                    Deep Passion Tours.
                  </span>
                </>
              )}
            </h1>

            {/* Lean 1-line subcopy */}
            <p className="text-sm sm:text-base text-slate-200 font-medium leading-relaxed max-w-2xl drop-shadow-sm">
              {lang === 'ja'
                ? 'アニメ聖地・歴史・鉄道・昭和レトロ。現地を知り尽くした偏愛ガイドと歩く、濃密な体験。'
                : 'Anime holy spots, samurai history, scenic railways & retro kissaten with verified local connoisseurs.'}
            </p>
          </div>

          {/* Airbnb-style Sleek Glass Search Bar (Single compact line, zero clutter) */}
          <div className="pt-2">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                onSearch();
              }}
              className="bg-white/95 backdrop-blur-md p-2 rounded-2xl sm:rounded-full border border-white/40 shadow-2xl flex flex-col sm:flex-row items-center gap-2 max-w-2xl"
            >
              <div className="relative flex-1 w-full flex items-center pl-3.5 pr-2 py-1.5 sm:py-0">
                <Search className="w-4 h-4 text-slate-400 flex-shrink-0" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder={lang === 'ja' ? '聖地、新選組、江ノ電、神保町、小田原...' : 'Search anime, samurai, trains, kissaten...'}
                  className="w-full bg-transparent px-3 py-1.5 text-sm text-slate-900 placeholder-slate-400 focus:outline-none font-medium"
                />
                {searchQuery && (
                  <button
                    type="button"
                    onClick={() => setSearchQuery('')}
                    className="text-slate-400 hover:text-slate-600 text-xs bg-slate-100 rounded-full w-5 h-5 flex items-center justify-center cursor-pointer mr-1"
                  >
                    ✕
                  </button>
                )}
              </div>

              <button
                type="submit"
                className="w-full sm:w-auto px-6 py-3 rounded-xl sm:rounded-full bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs sm:text-sm shadow-lg shadow-blue-600/30 transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-95 flex-shrink-0"
              >
                <span>{t.searchButton}</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </form>
          </div>

          {/* Visual Category Photo Chips (Instant eye-candy right on landing!) */}
          <div className="pt-3 space-y-2">
            <div className="flex items-center justify-between text-xs text-slate-300 font-bold px-0.5">
              <span className="flex items-center gap-1.5">
                <Compass className="w-3.5 h-3.5 text-blue-400" />
                <span>{lang === 'ja' ? '人気のテーマから探す' : 'Popular Themes'}</span>
              </span>
              <button
                type="button"
                onClick={openCreateModal}
                className="text-[11px] text-yellow-300 hover:text-white flex items-center gap-1 font-bold cursor-pointer transition-colors"
              >
                <PlusCircle className="w-3 h-3" />
                <span>{lang === 'ja' ? 'ツアーを企画する →' : 'Host a Tour →'}</span>
              </button>
            </div>

            {/* Horizontal Scrollable Photo Chips */}
            <div className="flex items-center gap-2.5 overflow-x-auto pb-1 no-scrollbar">
              {visualChips.map((chip, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => {
                    setSelectedCategory(chip.category);
                    setSearchQuery('');
                    if (onSelectTourById) {
                      onSelectTourById(chip.tourId);
                    } else {
                      onSearch();
                    }
                  }}
                  className="group flex items-center gap-2.5 pl-1.5 pr-3.5 py-1.5 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/20 transition-all cursor-pointer flex-shrink-0 active:scale-95 shadow-sm"
                >
                  <img
                    src={chip.img}
                    alt={chip.label}
                    className="w-7 h-7 rounded-full object-cover border border-white/40 group-hover:scale-105 transition-transform"
                  />
                  <span className="text-xs font-bold text-white whitespace-nowrap">
                    {chip.label}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Compact Trust Stats Row */}
          <div className="pt-2 flex flex-wrap items-center gap-4 sm:gap-6 text-xs text-slate-300 font-medium">
            <div className="flex items-center gap-1">
              <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
              <span className="text-white font-black">99.6%</span>
              <span className="text-slate-400 text-[11px]">参加者満足度</span>
            </div>
            <div className="flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5 text-rose-400" />
              <span className="text-white font-black">120+</span>
              <span className="text-slate-400 text-[11px]">全国のコース</span>
            </div>
            <div className="flex items-center gap-1">
              <span className="text-emerald-400 font-bold">✓</span>
              <span className="text-slate-200 text-[11px]">全コース旅のしおり＆マップ付き</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
