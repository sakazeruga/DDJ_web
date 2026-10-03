import React, { useState } from 'react';
import { Search, MapPin, Star, PlusCircle, Plus, Compass, Sparkles, ChevronRight, Wand2, X, Tag, Check } from 'lucide-react';
import confetti from 'canvas-confetti';
import type { Language, TourCategory, CustomTheme } from '../types';
import { translations } from '../i18n/translations';
import { classifyTourThemeWithAI, type AIThemeAnalysisResult } from '../utils/aiThemeClassifier';

interface HeroProps {
  lang: Language;
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  selectedCategory: TourCategory | 'all';
  setSelectedCategory: (cat: TourCategory | 'all') => void;
  onSearch: () => void;
  openCreateModal: () => void;
  customThemes?: CustomTheme[];
  onAddCustomTheme?: (newTheme: CustomTheme) => void;
}

export const Hero: React.FC<HeroProps> = ({
  lang,
  searchQuery,
  setSearchQuery,
  selectedCategory: _selectedCategory,
  setSelectedCategory,
  onSearch,
  openCreateModal,
  customThemes = [],
  onAddCustomTheme,
}) => {
  const t = translations[lang];

  // Quick AI Theme Discovery Modal state
  const [isAiModalOpen, setIsAiModalOpen] = useState(false);
  const [aiThemeInput, setAiThemeInput] = useState('');
  const [isAiThinking, setIsAiThinking] = useState(false);
  const [aiResult, setAiResult] = useState<AIThemeAnalysisResult | null>(null);

  // Handle Quick AI Theme Analysis from Hero
  const handleQuickAnalyze = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!aiThemeInput.trim()) return;

    setIsAiThinking(true);
    setAiResult(null);

    try {
      const result = await classifyTourThemeWithAI({
        title: aiThemeInput,
        description: aiThemeInput,
      });
      setAiResult(result);

      if (result.isMatch && result.matchedCategory) {
        setSelectedCategory(result.matchedCategory);
        setSearchQuery('');
        setIsAiModalOpen(false);
        onSearch();
      }
    } finally {
      setIsAiThinking(false);
    }
  };

  const handleApplyHeroNewTheme = (newTheme: CustomTheme) => {
    if (onAddCustomTheme) {
      onAddCustomTheme(newTheme);
    }
    setSelectedCategory(newTheme.categoryKey as TourCategory);
    setSearchQuery('');
    setIsAiModalOpen(false);
    setAiThemeInput('');
    setAiResult(null);
    confetti({
      particleCount: 90,
      spread: 70,
      origin: { y: 0.5 },
    });
    onSearch();
  };

  // Visual Category Quick Chips with Photos (ID-based, safe and direct)
  const builtinChips = [
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

  // Combine builtin and custom themes for Hero visual chips
  const allChips = [
    ...builtinChips,
    ...customThemes.map((ct) => ({
      category: ct.categoryKey as TourCategory,
      tourId: ct.id,
      label: ct.name,
      img: ct.imageUrl || 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=200&q=80',
      isCustom: true,
    })),
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
              {allChips.map((chip, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => {
                    setSelectedCategory(chip.category);
                    setSearchQuery('');
                    onSearch();
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
                  {'isCustom' in chip && (
                    <span className="text-[10px] bg-amber-400 text-slate-950 font-black px-1.5 py-0.2 rounded-full">
                      新タグ
                    </span>
                  )}
                </button>
              ))}

              {/* Quick AI Theme Discovery Button */}
              <button
                type="button"
                onClick={() => setIsAiModalOpen(true)}
                className="group flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-gradient-to-r from-blue-600/80 to-indigo-600/80 hover:from-blue-600 hover:to-indigo-600 backdrop-blur-md border border-blue-400/40 text-white text-xs font-bold transition-all cursor-pointer flex-shrink-0 active:scale-95 shadow-sm"
              >
                <Wand2 className="w-3.5 h-3.5 text-yellow-300 group-hover:rotate-12 transition-transform" />
                <span>＋ AIテーマ判定・新タグ追加</span>
              </button>
            </div>
          </div>

          {/* Quick AI Theme Discovery Modal */}
          {isAiModalOpen && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-in fade-in duration-200">
              <div className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl p-6 text-slate-900 border border-slate-200 space-y-4">
                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-xl bg-blue-600 text-white flex items-center justify-center shadow-md shadow-blue-500/30">
                      <Wand2 className="w-4 h-4" />
                    </div>
                    <div>
                      <h3 className="text-base font-black text-slate-900 leading-tight">
                        ✨ AIテーマタグ判定・新タグ新設
                      </h3>
                      <p className="text-xs text-slate-500">
                        探したい切り口を入力するとAIが既存テーマと照合。非該当なら新テーマタグを追加できます！
                      </p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => { setIsAiModalOpen(false); setAiResult(null); }}
                    className="p-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-800 cursor-pointer"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                <form onSubmit={handleQuickAnalyze} className="space-y-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      どんなテーマ・切り口のツアーを探したいですか？
                    </label>
                    <div className="flex items-center gap-2">
                      <input
                        type="text"
                        value={aiThemeInput}
                        onChange={(e) => setAiThemeInput(e.target.value)}
                        placeholder="例: 近代化遺産・廃墟 / 銭湯サウナ / 地質断層 / 伝統酒蔵 / 昭和歌謡..."
                        className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-500 focus:bg-white"
                        autoFocus
                      />
                      <button
                        type="submit"
                        disabled={isAiThinking || !aiThemeInput.trim()}
                        className="px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-md shadow-blue-600/30 transition-all cursor-pointer disabled:opacity-50 active:scale-95 flex items-center gap-1.5 flex-shrink-0"
                      >
                        <Wand2 className={`w-3.5 h-3.5 ${isAiThinking ? 'animate-spin' : ''}`} />
                        <span>{isAiThinking ? '判定中...' : 'AI判定'}</span>
                      </button>
                    </div>
                  </div>
                </form>

                {/* AI Result Card */}
                {aiResult && (
                  <div className={`p-4 rounded-2xl border text-xs ${
                    aiResult.isMatch 
                      ? 'bg-blue-50 border-blue-200 text-blue-900' 
                      : 'bg-gradient-to-br from-amber-50 to-orange-50 border-amber-300 text-amber-950'
                  }`}>
                    {aiResult.isMatch ? (
                      <div className="space-y-2">
                        <div className="flex items-center gap-2 font-black text-blue-800">
                          <Check className="w-4 h-4 text-blue-600" />
                          <span>既存テーマ「{aiResult.matchedCategoryName}」に合致しました！</span>
                        </div>
                        <p className="text-slate-600">{aiResult.explanation}</p>
                      </div>
                    ) : (
                      <div className="space-y-3">
                        <div className="flex items-center gap-2 font-black text-amber-900">
                          <Sparkles className="w-4 h-4 text-amber-600 animate-pulse" />
                          <span>⚡ 既存テーマに非該当（新ジャンル発見！）</span>
                        </div>
                        <p className="text-slate-700 leading-relaxed">{aiResult.explanation}</p>
                        
                        {aiResult.suggestedNewTheme && (
                          <div className="bg-white p-3 rounded-xl border border-amber-200 flex items-center justify-between gap-3">
                            <div className="flex items-center gap-2">
                              <Tag className="w-4 h-4 text-amber-600" />
                              <span className="font-bold text-slate-900">新テーマタグ:</span>
                              <span className="font-black text-blue-700 bg-blue-50 px-2 py-0.5 rounded-md border border-blue-200">
                                🏷️ {aiResult.suggestedNewTheme.name}
                              </span>
                            </div>
                            <button
                              type="button"
                              onClick={() => handleApplyHeroNewTheme(aiResult.suggestedNewTheme!)}
                              className="px-3 py-1.5 rounded-xl bg-gradient-to-r from-amber-600 to-orange-600 text-white font-bold text-xs hover:from-amber-700 hover:to-orange-700 shadow-sm transition-all cursor-pointer active:scale-95 flex items-center gap-1"
                            >
                              <Plus className="w-3.5 h-3.5" />
                              <span>DDJに追加して探す</span>
                            </button>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          )}

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
