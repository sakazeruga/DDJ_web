import React from 'react';
import { Search, Flame, MapPin, Users, Star, PlusCircle } from 'lucide-react';
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
  onTagClick: (tag: string) => void;
}

export const Hero: React.FC<HeroProps> = ({
  lang,
  searchQuery,
  setSearchQuery,
  selectedCategory,
  setSelectedCategory,
  onSearch,
  openCreateModal,
  onTagClick,
}) => {
  const t = translations[lang];

  const popularTags = [
    '#秋葉原裏ルート',
    '#ぼっち・ざ・ろっく！',
    '#中野ブロードウェイ',
    '#レトロアーケード',
    '#沼津聖地巡礼',
    '#池袋乙女ロード',
  ];

  return (
    <div className="relative overflow-hidden pt-8 pb-16 md:pt-16 md:pb-24 border-b border-slate-800/60 bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950">
      {/* Background Cyberpunk Glows */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[700px] h-[350px] bg-purple-600/15 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute top-10 left-10 w-80 h-80 bg-cyan-500/10 blur-[100px] rounded-full pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-80 h-80 bg-pink-500/10 blur-[100px] rounded-full pointer-events-none" />

      {/* Grid Pattern Overlay */}
      <div 
        className="absolute inset-0 opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage: `linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)`,
          backgroundSize: '40px 40px'
        }}
      />

      <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-purple-950/60 border border-purple-500/30 text-purple-300 text-xs font-semibold mb-6 shadow-sm">
          <Flame className="w-3.5 h-3.5 text-pink-400 animate-bounce" />
          <span>{t.hero.badge}</span>
        </div>

        {/* Headings */}
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-black tracking-tight text-white mb-4 leading-tight">
          <span className="block text-slate-100">{t.hero.title1}</span>
          <span className="bg-gradient-to-r from-cyan-400 via-pink-400 to-purple-400 bg-clip-text text-transparent">
            {t.hero.title2}
          </span>
        </h1>

        <p className="max-w-2xl mx-auto text-slate-300 text-sm sm:text-base md:text-lg mb-6 leading-relaxed font-normal">
          {t.hero.desc}
        </p>

        {/* Hero Quick Action Buttons */}
        <div className="flex flex-wrap items-center justify-center gap-3 mb-10">
          <button
            onClick={() => {
              const element = document.getElementById('explore-anchor');
              element?.scrollIntoView({ behavior: 'smooth' });
            }}
            className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white font-bold text-xs sm:text-sm shadow-lg shadow-purple-600/30 transition-all cursor-pointer"
          >
            {t.hero.exploreBtn}
          </button>
          <button
            onClick={openCreateModal}
            className="px-5 py-2.5 rounded-xl bg-slate-900/90 hover:bg-slate-800 text-slate-200 hover:text-white border border-slate-700/80 font-bold text-xs sm:text-sm transition-all flex items-center gap-2 cursor-pointer"
          >
            <PlusCircle className="w-4 h-4 text-cyan-400" />
            <span>{t.hero.hostBtn}</span>
          </button>
        </div>

        {/* Dynamic Search Box */}
        <div className="max-w-3xl mx-auto bg-slate-900/90 p-2 sm:p-3 rounded-2xl border border-slate-700/80 shadow-2xl backdrop-blur-xl">
          <form 
            onSubmit={(e) => {
              e.preventDefault();
              onSearch();
            }}
            className="flex flex-col sm:flex-row items-center gap-2"
          >
            {/* Input */}
            <div className="relative flex-1 w-full">
              <Search className="w-5 h-5 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={t.searchPlaceholder}
                className="w-full bg-slate-950/80 border border-slate-800 rounded-xl pl-11 pr-4 py-3 text-sm text-white placeholder-slate-400 focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 transition-all"
              />
            </div>

            {/* Category Quick Select */}
            <div className="w-full sm:w-48">
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value as TourCategory | 'all')}
                className="w-full bg-slate-950/80 border border-slate-800 rounded-xl px-3 py-3 text-sm text-slate-200 focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 cursor-pointer"
              >
                <option value="all">{t.categories.all}</option>
                <option value="pilgrimage">{t.categories.pilgrimage}</option>
                <option value="akiba-deep">{t.categories['akiba-deep']}</option>
                <option value="nakano-vintage">{t.categories['nakano-vintage']}</option>
                <option value="retro-games">{t.categories['retro-games']}</option>
                <option value="otome-road">{t.categories['otome-road']}</option>
                <option value="maid-subculture">{t.categories['maid-subculture']}</option>
                <option value="comiket-doujin">{t.categories['comiket-doujin']}</option>
              </select>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full sm:w-auto px-6 py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-bold text-sm shadow-lg shadow-cyan-500/25 transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-95"
            >
              <Search className="w-4 h-4" />
              <span>{t.searchButton}</span>
            </button>
          </form>

          {/* Popular Tag Pills */}
          <div className="mt-3 pt-3 border-t border-slate-800 flex flex-wrap items-center justify-center sm:justify-start gap-1.5 text-xs">
            <span className="text-slate-400 flex items-center gap-1 font-medium mr-1">
              <Flame className="w-3.5 h-3.5 text-pink-400" />
              {lang === 'ja' ? '人気急上昇:' : 'Trending:'}
            </span>
            {popularTags.map((tag) => (
              <button
                key={tag}
                type="button"
                onClick={() => onTagClick(tag)}
                className="px-2.5 py-1 rounded-lg bg-slate-800/80 hover:bg-purple-900/40 text-slate-300 hover:text-cyan-300 border border-slate-700/60 transition-colors"
              >
                {tag}
              </button>
            ))}
          </div>
        </div>

        {/* Stats Row */}
        <div className="mt-12 grid grid-cols-3 max-w-2xl mx-auto gap-4 pt-6 border-t border-slate-800/60">
          <div className="text-center">
            <div className="text-xl sm:text-2xl font-black text-white flex items-center justify-center gap-1">
              <MapPin className="w-4 h-4 text-cyan-400" />
              <span>120+</span>
            </div>
            <div className="text-xs text-slate-400 font-medium mt-0.5">{t.hero.statsTours}</div>
          </div>
          <div className="text-center">
            <div className="text-xl sm:text-2xl font-black text-white flex items-center justify-center gap-1">
              <Users className="w-4 h-4 text-purple-400" />
              <span>45</span>
            </div>
            <div className="text-xs text-slate-400 font-medium mt-0.5">{t.hero.statsGuides}</div>
          </div>
          <div className="text-center">
            <div className="text-xl sm:text-2xl font-black text-white flex items-center justify-center gap-1">
              <Star className="w-4 h-4 text-pink-400 fill-pink-400" />
              <span>99.6%</span>
            </div>
            <div className="text-xs text-slate-400 font-medium mt-0.5">{t.hero.statsSatisfaction}</div>
          </div>
        </div>
      </div>
    </div>
  );
};
