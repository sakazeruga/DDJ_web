import React from 'react';
import { 
  Sparkles, 
  MapPin, 
  Cpu, 
  Gamepad2, 
  HeartHandshake, 
  Coffee, 
  BookOpen, 
  Box
} from 'lucide-react';
import type { Language, TourCategory } from '../types';
import { translations } from '../i18n/translations';

interface CategoryFilterProps {
  selectedCategory: TourCategory | 'all';
  setSelectedCategory: (cat: TourCategory | 'all') => void;
  lang: Language;
}

export const CategoryFilter: React.FC<CategoryFilterProps> = ({
  selectedCategory,
  setSelectedCategory,
  lang,
}) => {
  const t = translations[lang];

  const categories: Array<{ id: TourCategory | 'all'; label: string; icon: React.ReactNode }> = [
    { id: 'all', label: t.categories.all, icon: <Sparkles className="w-4 h-4" /> },
    { id: 'pilgrimage', label: t.categories.pilgrimage, icon: <MapPin className="w-4 h-4" /> },
    { id: 'akiba-deep', label: t.categories['akiba-deep'], icon: <Cpu className="w-4 h-4" /> },
    { id: 'nakano-vintage', label: t.categories['nakano-vintage'], icon: <Box className="w-4 h-4" /> },
    { id: 'retro-games', label: t.categories['retro-games'], icon: <Gamepad2 className="w-4 h-4" /> },
    { id: 'otome-road', label: t.categories['otome-road'], icon: <HeartHandshake className="w-4 h-4" /> },
    { id: 'maid-subculture', label: t.categories['maid-subculture'], icon: <Coffee className="w-4 h-4" /> },
    { id: 'comiket-doujin', label: t.categories['comiket-doujin'], icon: <BookOpen className="w-4 h-4" /> },
  ];

  return (
    <div className="w-full overflow-x-auto py-4 scrollbar-none">
      <div className="flex items-center gap-2 min-w-max pb-1">
        {categories.map((cat) => {
          const isSelected = selectedCategory === cat.id;
          return (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
                isSelected
                  ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg shadow-purple-600/30 scale-105 border border-purple-400/40'
                  : 'bg-slate-900/90 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-800'
              }`}
            >
              <span className={isSelected ? 'text-white' : 'text-slate-400'}>
                {cat.icon}
              </span>
              <span>{cat.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
