import React from 'react';
import { Search, Flame, MapPin, Star, PlusCircle, Compass, Ticket, CheckCircle2 } from 'lucide-react';
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
    { tag: '#秋葉原裏ルート', badge: 'bg-yellow-400 text-black' },
    { tag: '#ぼっち・ざ・ろっく！', badge: 'bg-pink-500 text-white' },
    { tag: '#中野ブロードウェイ', badge: 'bg-purple-600 text-white' },
    { tag: '#レトロアーケード', badge: 'bg-cyan-400 text-black' },
    { tag: '#沼津聖地巡礼', badge: 'bg-emerald-500 text-white' },
    { tag: '#池袋乙女ロード', badge: 'bg-rose-500 text-white' },
  ];

  return (
    <div className="relative overflow-hidden pt-6 pb-14 md:pt-12 md:pb-20 border-b border-slate-800/80 bg-slate-950 manga-dots">
      {/* Background Cyberpunk & Pop Glows */}
      <div className="absolute top-1/4 left-1/3 w-[600px] h-[350px] bg-purple-600/15 blur-[140px] rounded-full pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-96 h-96 bg-pink-500/15 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute top-10 left-10 w-80 h-80 bg-cyan-500/10 blur-[100px] rounded-full pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Top Speech Bubble Tag */}
        <div className="flex flex-wrap items-center gap-2 mb-4">
          <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full otaku-badge-yellow text-xs font-black tracking-wide transform -rotate-1">
            <span>⚡ 日本初・オタク特化型ツアーマーケットプレイス</span>
          </span>
          <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-slate-900 border border-slate-700 text-pink-400 text-xs font-bold">
            <Flame className="w-3.5 h-3.5 fill-current" />
            <span>＼ 免税店スルー！本物の聖地へ直行 ／</span>
          </span>
        </div>

        {/* 2-Column Hero: Left Copy & Search, Right Visual Card */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          {/* Left Column (7 cols): Copy & Search */}
          <div className="lg:col-span-7 space-y-6 text-left">
            <div>
              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black tracking-tight text-white leading-[1.15]">
                <span className="block text-slate-100">
                  {lang === 'ja' ? '観光ガイドを捨てよ。' : 'Skip the Tourist Traps.'}
                </span>
                <span className="inline-block bg-gradient-to-r from-yellow-300 via-pink-400 to-cyan-400 bg-clip-text text-transparent marker-highlight">
                  {lang === 'ja' ? '本物の「聖地」を、仲間と歩く。' : 'Walk the Sacred Realm with Insiders.'}
                </span>
              </h1>
              <p className="mt-4 text-slate-300 text-sm sm:text-base md:text-lg leading-relaxed font-normal">
                {lang === 'ja'
                  ? '秋葉原のジャンク基板街、下北沢の結束バンド名所、中野のセル画魔境まで。一般の旅行会社では組めない超コアなオタクツアーを体験・投稿できる場所。'
                  : 'From Akihabara circuit alleys to Shimokitazawa anime livehouses and Nakano vintage cel vaults. Experience & post ultra-niche pilgrimages guided by die-hard local otaku.'}
              </p>
            </div>

            {/* Otaku Tour Key Highlights Badges */}
            <div className="flex flex-wrap gap-2 text-xs">
              <span className="flex items-center gap-1 bg-slate-900/90 border border-purple-500/50 text-purple-300 px-3 py-1.5 rounded-lg font-bold">
                <CheckCircle2 className="w-3.5 h-3.5 text-purple-400" />
                {lang === 'ja' ? '旅のしおり＆巡礼マップ付き' : 'Custom Itinerary Shiori Included'}
              </span>
              <span className="flex items-center gap-1 bg-slate-900/90 border border-pink-500/50 text-pink-300 px-3 py-1.5 rounded-lg font-bold">
                <CheckCircle2 className="w-3.5 h-3.5 text-pink-400" />
                {lang === 'ja' ? 'オタク歴10年以上の猛者ガイド' : 'Veteran Otaku Guides'}
              </span>
              <span className="flex items-center gap-1 bg-slate-900/90 border border-cyan-500/50 text-cyan-300 px-3 py-1.5 rounded-lg font-bold">
                <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400" />
                {lang === 'ja' ? '少人数（最大4〜6名）で濃密' : 'Small-Group (Max 4-6)'}
              </span>
            </div>

            {/* Dynamic Search Box with Tour Shiori / Ticket Aesthetic */}
            <div className="bg-slate-900/95 p-3 sm:p-4 rounded-2xl border-2 border-slate-700 shadow-2xl relative">
              <div className="text-[11px] font-bold text-yellow-400 mb-2 flex items-center justify-between">
                <span className="flex items-center gap-1">
                  <Compass className="w-3.5 h-3.5 text-yellow-400" />
                  {lang === 'ja' ? '🎯 ツアー・聖地クイック検索' : '🎯 Search Holy Tours & Pilgrimages'}
                </span>
                <span className="text-slate-400 font-normal">
                  {lang === 'ja' ? '即時空き状況確認OK' : 'Instant availability check'}
                </span>
              </div>

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
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-11 pr-10 py-3 text-sm text-white placeholder-slate-400 focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 transition-all font-medium"
                  />
                  {searchQuery && (
                    <button
                      type="button"
                      onClick={() => setSearchQuery('')}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white text-xs bg-slate-800 rounded-full w-5 h-5 flex items-center justify-center cursor-pointer"
                    >
                      ✕
                    </button>
                  )}
                </div>

                {/* Category Quick Select */}
                <div className="w-full sm:w-44">
                  <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value as TourCategory | 'all')}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-3 text-sm text-slate-200 focus:outline-none focus:border-cyan-400 cursor-pointer font-medium"
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
                  className="w-full sm:w-auto px-6 py-3 rounded-xl bg-gradient-to-r from-yellow-400 via-pink-500 to-purple-600 hover:opacity-95 text-slate-950 font-black text-sm shadow-lg shadow-pink-500/25 transition-all flex items-center justify-center gap-1.5 cursor-pointer active:scale-95"
                >
                  <Search className="w-4 h-4 text-slate-950" />
                  <span className="font-extrabold text-slate-950">{t.searchButton}</span>
                </button>
              </form>

              {/* Popular Tag Pills */}
              <div className="mt-3 pt-3 border-t border-slate-800/80 flex flex-wrap items-center gap-1.5 text-xs">
                <span className="text-slate-400 font-bold mr-1 flex items-center gap-1">
                  <Flame className="w-3.5 h-3.5 text-pink-400" />
                  {lang === 'ja' ? '注目の聖地:' : 'Hot Tags:'}
                </span>
                {popularTags.map((item) => (
                  <button
                    key={item.tag}
                    type="button"
                    onClick={() => onTagClick(item.tag)}
                    className="px-2.5 py-1 rounded-md bg-slate-800 hover:bg-purple-900/50 text-slate-200 hover:text-cyan-300 border border-slate-700 text-xs font-semibold transition-colors cursor-pointer"
                  >
                    {item.tag}
                  </button>
                ))}
              </div>
            </div>

            {/* Quick Action Buttons */}
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <button
                onClick={onSearch}
                className="px-5 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs sm:text-sm shadow-lg shadow-purple-600/30 transition-all cursor-pointer flex items-center gap-1.5"
              >
                <Compass className="w-4 h-4" />
                <span>{t.hero.exploreBtn}</span>
              </button>
              <button
                onClick={openCreateModal}
                className="px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-850 text-slate-200 hover:text-white border border-slate-700 font-bold text-xs sm:text-sm transition-all flex items-center gap-2 cursor-pointer"
              >
                <PlusCircle className="w-4 h-4 text-cyan-400" />
                <span>{t.hero.hostBtn}</span>
              </button>
            </div>
          </div>

          {/* Right Column (5 cols): Tour Pass / Boarding Pass Visual Card */}
          <div className="lg:col-span-5 relative mt-6 lg:mt-0">
            {/* Stamp Badge Floating */}
            <div className="absolute -top-6 -right-4 z-20 w-24 h-24 sm:w-28 sm:h-28 stamp-seal pointer-events-none">
              <img
                src="/assets/seichi_stamp.jpg"
                alt="聖地巡礼 済 スタンプ"
                className="w-full h-full object-contain rounded-full shadow-2xl"
              />
            </div>

            {/* Main Visual Boarding Pass Card */}
            <div className="bg-slate-900 rounded-3xl border-2 border-slate-700 shadow-2xl overflow-hidden otaku-sticker relative">
              {/* Top Boarding Pass Header */}
              <div className="bg-gradient-to-r from-purple-900 via-slate-900 to-pink-900 px-4 py-2.5 border-b-2 border-slate-700 flex items-center justify-between text-xs font-mono font-bold text-slate-300">
                <div className="flex items-center gap-1.5">
                  <Ticket className="w-4 h-4 text-yellow-400" />
                  <span>DDJ OTAKU TOUR PASS #2026</span>
                </div>
                <span className="text-[10px] px-2 py-0.5 rounded bg-yellow-400 text-slate-950 font-black">
                  OFFICIAL TOUR
                </span>
              </div>

              {/* Main Photo with Guide and Tourists */}
              <div className="relative aspect-[16/10] overflow-hidden bg-slate-950">
                <img
                  src="/assets/otaku_tour_hero.jpg"
                  alt="秋葉原オタクツアー風景"
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-transparent to-transparent" />

                {/* Floating caption bubble */}
                <div className="absolute bottom-3 left-3 right-3 bg-slate-950/90 backdrop-blur-md p-3 rounded-xl border border-slate-700">
                  <div className="flex items-center justify-between text-xs mb-1">
                    <span className="font-bold text-yellow-400 flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5" />
                      秋葉原 電気街口・路地裏ルート
                    </span>
                    <span className="text-pink-400 font-bold">催行中 ⚡</span>
                  </div>
                  <p className="text-[11px] text-slate-300 line-clamp-1">
                    「元自作PC店員＆同人古参ガイドと歩く、90年代サイバーパンクの残照」
                  </p>
                </div>
              </div>

              {/* Pass Ticket Details Footer */}
              <div className="p-4 bg-slate-950 border-t-2 border-slate-800 grid grid-cols-3 gap-2 text-center text-xs">
                <div className="bg-slate-900/80 p-2 rounded-xl border border-slate-800">
                  <div className="text-[10px] text-slate-400">平均ツアー満足度</div>
                  <div className="font-black text-amber-400 flex items-center justify-center gap-0.5 text-sm mt-0.5">
                    <Star className="w-3.5 h-3.5 fill-current" />
                    <span>99.6%</span>
                  </div>
                </div>
                <div className="bg-slate-900/80 p-2 rounded-xl border border-slate-800">
                  <div className="text-[10px] text-slate-400">専属オタクガイド</div>
                  <div className="font-black text-purple-300 text-sm mt-0.5">
                    45名 在籍
                  </div>
                </div>
                <div className="bg-slate-900/80 p-2 rounded-xl border border-slate-800">
                  <div className="text-[10px] text-slate-400">登録ディープツアー</div>
                  <div className="font-black text-cyan-300 text-sm mt-0.5">
                    120+ コース
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
