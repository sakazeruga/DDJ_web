import React from 'react';
import { Search, MapPin, Star, PlusCircle, Compass, Ticket, CheckCircle2 } from 'lucide-react';
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
    { tag: '#新選組・京都幕末', color: 'bg-amber-100 text-amber-900 border-amber-300' },
    { tag: '#江ノ電・絶景鉄道', color: 'bg-emerald-100 text-emerald-900 border-emerald-300' },
    { tag: '#君の名は・飛騨高山', color: 'bg-blue-100 text-blue-900 border-blue-300' },
    { tag: '#神保町・古書店＆喫茶', color: 'bg-orange-100 text-orange-900 border-orange-300' },
    { tag: '#小田原城・総構え', color: 'bg-stone-200 text-stone-900 border-stone-300' },
    { tag: '#ぼっち・ざ・ろっく！', color: 'bg-pink-100 text-pink-900 border-pink-300' },
  ];

  return (
    <div className="relative overflow-hidden pt-8 pb-14 md:pt-12 md:pb-20 bg-gradient-to-b from-blue-50/70 via-white to-slate-50 border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Top Badge */}
        <div className="flex flex-wrap items-center gap-2 mb-4">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-100 text-blue-800 border border-blue-200 text-xs font-bold">
            <span>🗾 日本の文化・聖地・偏愛ツアープラットフォーム</span>
          </span>
          <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-rose-50 text-rose-700 border border-rose-200 text-xs font-bold">
            <span>歴史 • 鉄道 • アニメ聖地 • 昭和レトロ</span>
          </span>
        </div>

        {/* 2-Column Hero */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          {/* Left Column (7 cols): Copy & Search */}
          <div className="lg:col-span-7 space-y-6 text-left">
            <div>
              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black tracking-tight text-slate-900 leading-[1.18]">
                <span className="block text-slate-800">
                  {lang === 'ja' ? '教科書の先にある、' : 'Beyond the Guidebooks.'}
                </span>
                <span className="inline-block bg-gradient-to-r from-blue-600 via-indigo-600 to-rose-600 bg-clip-text text-transparent marker-highlight">
                  {lang === 'ja' ? '本物の「深さ」へ仲間と歩く。' : 'Walk the Real Depths with Locals.'}
                </span>
              </h1>
              <p className="mt-4 text-slate-600 text-sm sm:text-base md:text-lg leading-relaxed font-normal">
                {lang === 'ja'
                  ? 'アニメの舞台となった情景、武将たちが激突した古戦場、海沿いを走るレトロ鉄道、時が止まった純喫茶。その道を愛してやまない偏愛ガイドが、あなたの旅を特別な物語に変えます。'
                  : 'Iconic anime film settings, samurai battlefields, scenic heritage railway lines, and Showa book districts. Dedicated local specialists guide your journey into true Japanese culture.'}
              </p>
            </div>

            {/* Cultural Tour Key Highlights */}
            <div className="flex flex-wrap gap-2 text-xs">
              <span className="flex items-center gap-1 bg-white border border-slate-200 text-slate-800 px-3 py-1.5 rounded-lg font-bold shadow-xs">
                <CheckCircle2 className="w-3.5 h-3.5 text-blue-600" />
                {lang === 'ja' ? '旅のしおり＆特製マップ付き' : 'Custom Itinerary Shiori Included'}
              </span>
              <span className="flex items-center gap-1 bg-white border border-slate-200 text-slate-800 px-3 py-1.5 rounded-lg font-bold shadow-xs">
                <CheckCircle2 className="w-3.5 h-3.5 text-amber-600" />
                {lang === 'ja' ? '専門知識を持つ偏愛ガイド専属' : 'Passionate Local Specialists'}
              </span>
              <span className="flex items-center gap-1 bg-white border border-slate-200 text-slate-800 px-3 py-1.5 rounded-lg font-bold shadow-xs">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                {lang === 'ja' ? '少人数（最大4〜6名）で濃密' : 'Small-Group (Max 4-6)'}
              </span>
            </div>

            {/* Clean White Search Box */}
            <div className="bg-white p-3 sm:p-4 rounded-2xl border border-slate-200 shadow-lg relative">
              <div className="text-xs font-bold text-slate-700 mb-2 flex items-center justify-between">
                <span className="flex items-center gap-1.5 text-blue-700">
                  <Compass className="w-4 h-4 text-blue-600" />
                  {lang === 'ja' ? 'テーマ・エリアからツアーを探す' : 'Search Tours by Theme or Destination'}
                </span>
                <span className="text-slate-400 font-normal text-[11px]">
                  {lang === 'ja' ? '即時リクエスト受付中' : 'Instant booking request'}
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
                  <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder={t.searchPlaceholder}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-10 py-3 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-500 focus:bg-white transition-all font-medium"
                  />
                  {searchQuery && (
                    <button
                      type="button"
                      onClick={() => setSearchQuery('')}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 text-xs bg-slate-200 rounded-full w-5 h-5 flex items-center justify-center cursor-pointer"
                    >
                      ✕
                    </button>
                  )}
                </div>

                {/* Category Quick Select */}
                <div className="w-full sm:w-48">
                  <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value as TourCategory | 'all')}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-3 text-sm text-slate-800 focus:outline-none focus:border-blue-500 focus:bg-white cursor-pointer font-medium"
                  >
                    <option value="all">{t.categories.all}</option>
                    <option value="history-castle">{t.categories['history-castle']}</option>
                    <option value="railway-train">{t.categories['railway-train']}</option>
                    <option value="anime-pilgrimage">{t.categories['anime-pilgrimage']}</option>
                    <option value="retro-showa">{t.categories['retro-showa']}</option>
                    <option value="folklore-yokai">{t.categories['folklore-yokai']}</option>
                    <option value="oshikatsu-subculture">{t.categories['oshikatsu-subculture']}</option>
                  </select>
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  className="w-full sm:w-auto px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-sm shadow-md shadow-blue-500/20 transition-all flex items-center justify-center gap-1.5 cursor-pointer active:scale-95"
                >
                  <Search className="w-4 h-4 text-white" />
                  <span>{t.searchButton}</span>
                </button>
              </form>

              {/* Popular Tag Pills */}
              <div className="mt-3 pt-3 border-t border-slate-100 flex flex-wrap items-center gap-1.5 text-xs">
                <span className="text-slate-500 font-bold mr-1">
                  {lang === 'ja' ? '人気のテーマ:' : 'Popular:'}
                </span>
                {popularTags.map((item) => (
                  <button
                    key={item.tag}
                    type="button"
                    onClick={() => onTagClick(item.tag)}
                    className={`px-2.5 py-1 rounded-full border text-xs font-bold transition-all cursor-pointer hover:scale-105 ${item.color}`}
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
                className="px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs sm:text-sm shadow-md transition-all cursor-pointer flex items-center gap-1.5"
              >
                <Compass className="w-4 h-4 text-blue-400" />
                <span>{t.hero.exploreBtn}</span>
              </button>
              <button
                onClick={openCreateModal}
                className="px-5 py-2.5 rounded-xl bg-white hover:bg-slate-50 text-slate-800 border border-slate-300 font-bold text-xs sm:text-sm transition-all flex items-center gap-2 cursor-pointer shadow-xs"
              >
                <PlusCircle className="w-4 h-4 text-blue-600" />
                <span>{t.hero.hostBtn}</span>
              </button>
            </div>
          </div>

          {/* Right Column (5 cols): Bright Cultural Tours Illustration Card */}
          <div className="lg:col-span-5 relative mt-6 lg:mt-0">
            {/* Stamp Floating */}
            <div className="absolute -top-5 -right-3 z-20 w-24 h-24 sm:w-26 sm:h-26 stamp-seal pointer-events-none">
              <img
                src="/assets/seichi_stamp.jpg"
                alt="公式巡礼印"
                className="w-full h-full object-contain rounded-full shadow-lg"
              />
            </div>

            {/* Main Visual Card */}
            <div className="bg-white rounded-3xl border border-slate-200 shadow-xl overflow-hidden travel-card relative">
              <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-rose-500 px-4 py-2.5 flex items-center justify-between text-xs font-bold text-white">
                <div className="flex items-center gap-1.5 font-mono">
                  <Ticket className="w-4 h-4 text-yellow-300" />
                  <span>DDJ JAPAN CULTURAL TOUR PASS</span>
                </div>
                <span className="text-[10px] px-2 py-0.5 rounded bg-white text-blue-700 font-black">
                  VERIFIED
                </span>
              </div>

              {/* Illustration Image */}
              <div className="relative aspect-[16/10] overflow-hidden bg-slate-100">
                <img
                  src="/assets/japan_culture_tours_hero.jpg"
                  alt="日本の文化・城・鉄道・聖地巡礼ツアー"
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-750"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 via-transparent to-transparent" />

                <div className="absolute bottom-3 left-3 right-3 bg-white/95 backdrop-blur-md p-3 rounded-xl border border-slate-200 shadow-sm">
                  <div className="flex items-center justify-between text-xs mb-0.5">
                    <span className="font-bold text-slate-900 flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-rose-500" />
                      京都 • 鎌倉 • 飛騨 • 小田原 • 神保町
                    </span>
                    <span className="text-blue-600 font-bold text-[11px]">全国催行中 ✨</span>
                  </div>
                  <p className="text-[11px] text-slate-600 line-clamp-1">
                    「城郭研究家、鉄道写真家、アニメファンが案内する至高の街歩き」
                  </p>
                </div>
              </div>

              {/* Stats Footer */}
              <div className="p-4 bg-slate-50 border-t border-slate-200 grid grid-cols-3 gap-2 text-center text-xs">
                <div className="bg-white p-2 rounded-xl border border-slate-200 shadow-xs">
                  <div className="text-[10px] text-slate-500 font-medium">参加者満足度</div>
                  <div className="font-black text-slate-900 flex items-center justify-center gap-0.5 text-sm mt-0.5">
                    <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                    <span>99.6%</span>
                  </div>
                </div>
                <div className="bg-white p-2 rounded-xl border border-slate-200 shadow-xs">
                  <div className="text-[10px] text-slate-500 font-medium">公認偏愛ガイド</div>
                  <div className="font-black text-blue-700 text-sm mt-0.5">
                    45名 在籍
                  </div>
                </div>
                <div className="bg-white p-2 rounded-xl border border-slate-200 shadow-xs">
                  <div className="text-[10px] text-slate-500 font-medium">厳選コース数</div>
                  <div className="font-black text-indigo-700 text-sm mt-0.5">
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
