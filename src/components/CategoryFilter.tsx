import React from 'react';
import { 
  Sparkles, 
  MapPin, 
  Shield, 
  Train, 
  BookOpen, 
  Ghost, 
  HeartHandshake,
  Music,
  GraduationCap
} from 'lucide-react';
import type { Language, TourCategory, CustomTheme } from '../types';
import { translations } from '../i18n/translations';

interface CategoryFilterProps {
  selectedCategory: TourCategory | 'all';
  setSelectedCategory: (cat: TourCategory | 'all') => void;
  lang: Language;
  customThemes?: CustomTheme[];
}

export const CategoryFilter: React.FC<CategoryFilterProps> = ({
  selectedCategory,
  setSelectedCategory,
  lang,
  customThemes = [],
}) => {
  const t = translations[lang];

  const categories: Array<{ id: TourCategory | 'all'; label: string; icon: React.ReactNode; color: string; isCustom?: boolean }> = [
    { id: 'all', label: t.categories.all, icon: <Sparkles className="w-4 h-4" />, color: 'hover:border-blue-500' },
    { id: 'music-sound', label: t.categories['music-sound'], icon: <Music className="w-4 h-4" />, color: 'hover:border-indigo-500' },
    { id: 'history-castle', label: t.categories['history-castle'], icon: <Shield className="w-4 h-4" />, color: 'hover:border-amber-500' },
    { id: 'railway-train', label: t.categories['railway-train'], icon: <Train className="w-4 h-4" />, color: 'hover:border-emerald-500' },
    { id: 'anime-pilgrimage', label: t.categories['anime-pilgrimage'], icon: <MapPin className="w-4 h-4" />, color: 'hover:border-rose-500' },
    { id: 'business-fieldwork', label: t.categories['business-fieldwork'], icon: <GraduationCap className="w-4 h-4" />, color: 'hover:border-teal-500' },
    { id: 'retro-showa', label: t.categories['retro-showa'], icon: <BookOpen className="w-4 h-4" />, color: 'hover:border-orange-500' },
    { id: 'folklore-yokai', label: t.categories['folklore-yokai'], icon: <Ghost className="w-4 h-4" />, color: 'hover:border-purple-500' },
    { id: 'oshikatsu-subculture', label: t.categories['oshikatsu-subculture'], icon: <HeartHandshake className="w-4 h-4" />, color: 'hover:border-pink-500' },
    // Dynamic Custom Themes
    ...customThemes.map((ct) => ({
      id: ct.categoryKey as TourCategory,
      label: ct.name,
      icon: <Sparkles className="w-3.5 h-3.5 text-amber-500" />,
      color: 'hover:border-amber-500',
      isCustom: true,
    })),
  ];

  return (
    <div className="w-full overflow-x-auto py-3 no-scrollbar mb-4">
      <div className="flex items-center gap-2.5 min-w-max pb-1">
        {categories.map((cat) => {
          const isSelected = selectedCategory === cat.id;
          return (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-full text-xs sm:text-sm font-bold transition-all cursor-pointer shadow-sm ${
                isSelected
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20 scale-105 border border-blue-600'
                  : 'bg-white hover:bg-slate-50 text-slate-700 border border-slate-200'
              }`}
            >
              <span className={isSelected ? 'text-white' : 'text-slate-500'}>
                {cat.icon}
              </span>
              <span>{cat.label}</span>
              {cat.isCustom && (
                <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-black uppercase tracking-wider ${
                  isSelected ? 'bg-white/20 text-white' : 'bg-amber-100 text-amber-800'
                }`}>
                  新テーマ
                </span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};
