import React from 'react';
import { SlidersHorizontal, RotateCcw, ArrowUpDown, Check } from 'lucide-react';
import type { Language } from '../types';
import { translations } from '../i18n/translations';

interface FilterBarProps {
  lang: Language;
  selectedArea: string;
  setSelectedArea: (area: string) => void;
  selectedLevel: number | 'all';
  setSelectedLevel: (level: number | 'all') => void;
  sortBy: 'popular' | 'newest' | 'price-asc' | 'price-desc' | 'otaku-level';
  setSortBy: (sort: 'popular' | 'newest' | 'price-asc' | 'price-desc' | 'otaku-level') => void;
  onReset: () => void;
  totalCount: number;
  availableAreas: string[];
}

export const FilterBar: React.FC<FilterBarProps> = ({
  lang,
  selectedArea,
  setSelectedArea,
  selectedLevel,
  setSelectedLevel,
  sortBy,
  setSortBy,
  onReset,
  totalCount,
  availableAreas,
}) => {
  const t = translations[lang];

  const sortOptions: Array<{
    key: 'popular' | 'newest' | 'otaku-level' | 'price-asc' | 'price-desc';
    label: string;
    icon?: React.ReactNode;
  }> = [
    { key: 'popular', label: lang === 'ja' ? 'おすすめ順' : 'Recommended' },
    { key: 'newest', label: lang === 'ja' ? '✨ 新着順' : '✨ Newest' },
    { key: 'otaku-level', label: lang === 'ja' ? '🔥 熱量順' : '🔥 Depth Lv' },
    { key: 'price-asc', label: lang === 'ja' ? '¥ 料金が安い順' : '¥ Price: Low' },
    { key: 'price-desc', label: lang === 'ja' ? '¥ 料金が高い順' : '¥ Price: High' },
  ];

  const hasActiveFilters = selectedArea !== 'all' || selectedLevel !== 'all' || sortBy !== 'popular';

  return (
    <div className="bg-white p-3.5 sm:p-5 rounded-2xl border border-slate-200 shadow-xs mb-6 sm:mb-8 space-y-3.5">
      {/* Top Row: Quick Sort Chips (Airbnb / Klook Style) */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 pb-3 border-b border-slate-100">
        <div className="flex items-center gap-2">
          <ArrowUpDown className="w-4 h-4 text-blue-600 shrink-0" />
          <span className="text-xs font-bold text-slate-800">
            {lang === 'ja' ? '並び替え:' : 'Sort By:'}
          </span>
        </div>

        {/* Horizontal Scrollable Quick Sort Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 -mx-3.5 px-3.5 sm:mx-0 sm:px-0 scrollbar-none">
          {sortOptions.map((opt) => {
            const isSelected = sortBy === opt.key;
            return (
              <button
                key={opt.key}
                type="button"
                onClick={() => setSortBy(opt.key)}
                className={`min-h-[40px] px-3.5 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer flex items-center gap-1.5 active:scale-95 shrink-0 ${
                  isSelected
                    ? 'bg-blue-600 text-white shadow-xs ring-2 ring-blue-500/20'
                    : 'bg-slate-50 hover:bg-slate-100 text-slate-600 hover:text-slate-900 border border-slate-200'
                }`}
              >
                {isSelected && <Check className="w-3.5 h-3.5 text-white shrink-0" />}
                <span>{opt.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Bottom Row: Area & Depth Filters + Counter */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-0.5">
        <div className="flex flex-wrap items-center gap-2.5 w-full sm:w-auto">
          <div className="flex items-center gap-1.5 text-xs font-bold text-slate-700">
            <SlidersHorizontal className="w-3.5 h-3.5 text-indigo-600 shrink-0" />
            <span>{lang === 'ja' ? '詳細絞り込み' : 'Filters'}:</span>
          </div>

          {/* Area Select */}
          <select
            value={selectedArea}
            onChange={(e) => setSelectedArea(e.target.value)}
            className="min-h-[44px] bg-slate-50 border border-slate-200 text-slate-800 text-xs font-bold rounded-xl px-3.5 py-2.5 focus:outline-none focus:border-blue-500 focus:bg-white cursor-pointer"
          >
            <option value="all">{lang === 'ja' ? '📍 すべてのエリア' : '📍 All Areas'}</option>
            {availableAreas.map((area) => (
              <option key={area} value={area}>
                {area}
              </option>
            ))}
          </select>

          {/* Level Select */}
          <select
            value={selectedLevel}
            onChange={(e) => setSelectedLevel(e.target.value === 'all' ? 'all' : Number(e.target.value))}
            className="min-h-[44px] bg-slate-50 border border-slate-200 text-slate-800 text-xs font-bold rounded-xl px-3.5 py-2.5 focus:outline-none focus:border-blue-500 focus:bg-white cursor-pointer"
          >
            <option value="all">{t.filter.allLevels}</option>
            <option value="1">🔥 Lv.1 初心者歓迎</option>
            <option value="2">🔥 Lv.2 入門・体験</option>
            <option value="3">🔥 Lv.3 中級・探訪</option>
            <option value="4">🔥 Lv.4 上級・深掘り</option>
            <option value="5">🔥 Lv.5 極限の沼・専門家</option>
          </select>

          {/* Reset button */}
          {hasActiveFilters && (
            <button
              onClick={onReset}
              className="min-h-[44px] flex items-center gap-1.5 text-xs font-bold text-rose-600 hover:text-rose-700 bg-rose-50 hover:bg-rose-100 border border-rose-200 rounded-xl px-3 py-2 transition-colors cursor-pointer"
              title="フィルターをリセット"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>{t.filter.reset}</span>
            </button>
          )}
        </div>

        {/* Results Count */}
        <div className="text-xs text-slate-500 font-medium self-end sm:self-center flex items-center gap-1.5 bg-slate-50 px-3 py-1.5 rounded-xl border border-slate-200/80">
          <span className="text-slate-400">表示中:</span>
          <span className="text-blue-700 font-black text-sm">{totalCount}</span>
          <span className="font-bold">{t.filter.foundCount}</span>
        </div>
      </div>
    </div>
  );
};
