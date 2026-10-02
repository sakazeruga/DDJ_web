import React from 'react';
import { SlidersHorizontal, RotateCcw } from 'lucide-react';
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

  return (
    <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs mb-6 flex flex-col md:flex-row items-center justify-between gap-4">
      <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
        <div className="flex items-center gap-1.5 text-xs font-bold text-slate-700">
          <SlidersHorizontal className="w-3.5 h-3.5 text-blue-600" />
          <span>{lang === 'ja' ? '絞り込み' : 'Filters'}:</span>
        </div>

        {/* Area Select */}
        <select
          value={selectedArea}
          onChange={(e) => setSelectedArea(e.target.value)}
          className="bg-slate-50 border border-slate-200 text-slate-800 text-xs font-medium rounded-xl px-3 py-2 focus:outline-none focus:border-blue-500 focus:bg-white cursor-pointer"
        >
          <option value="all">{lang === 'ja' ? 'すべてのエリア' : 'All Areas'}</option>
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
          className="bg-slate-50 border border-slate-200 text-slate-800 text-xs font-medium rounded-xl px-3 py-2 focus:outline-none focus:border-blue-500 focus:bg-white cursor-pointer"
        >
          <option value="all">{t.filter.allLevels}</option>
          <option value="1">{t.filter.level1}</option>
          <option value="2">{t.filter.level2}</option>
          <option value="3">{t.filter.level3}</option>
          <option value="4">{t.filter.level4}</option>
          <option value="5">{t.filter.level5}</option>
        </select>

        {/* Sort Select */}
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value as any)}
          className="bg-slate-50 border border-slate-200 text-slate-800 text-xs font-medium rounded-xl px-3 py-2 focus:outline-none focus:border-blue-500 focus:bg-white cursor-pointer"
        >
          <option value="popular">{t.filter.sortPopular}</option>
          <option value="otaku-level">{t.filter.sortOtakuLevel}</option>
          <option value="newest">{t.filter.sortNewest}</option>
          <option value="price-asc">{t.filter.sortPriceAsc}</option>
          <option value="price-desc">{t.filter.sortPriceDesc}</option>
        </select>

        {/* Reset button */}
        {(selectedArea !== 'all' || selectedLevel !== 'all' || sortBy !== 'popular') && (
          <button
            onClick={onReset}
            className="flex items-center gap-1 text-xs font-bold text-slate-500 hover:text-rose-600 transition-colors px-2 py-1.5 cursor-pointer"
          >
            <RotateCcw className="w-3 h-3" />
            <span>{t.filter.reset}</span>
          </button>
        )}
      </div>

      {/* Results Count */}
      <div className="text-xs text-slate-500 font-medium self-end md:self-center">
        <span className="text-blue-700 font-black text-sm mr-1">{totalCount}</span>
        <span>{t.filter.foundCount}</span>
      </div>
    </div>
  );
};
