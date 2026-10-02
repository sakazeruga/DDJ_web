import React from 'react';
import { Compass, MessageSquare, PlusCircle, Bookmark, Globe, Sparkles } from 'lucide-react';
import type { Language, Currency } from '../types';
import { translations } from '../i18n/translations';

interface NavbarProps {
  currentTab: 'explore' | 'requests' | 'mypage';
  setCurrentTab: (tab: 'explore' | 'requests' | 'mypage') => void;
  openCreateModal: () => void;
  lang: Language;
  setLang: (lang: Language) => void;
  currency: Currency;
  setCurrency: (currency: Currency) => void;
  favoritesCount: number;
  openFavorites: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentTab,
  setCurrentTab,
  openCreateModal,
  lang,
  setLang,
  currency,
  setCurrency,
  favoritesCount,
  openFavorites,
}) => {
  const t = translations[lang];

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between">
        {/* Brand Logo - Stylish 3-Tier Stack */}
        <div 
          onClick={() => setCurrentTab('explore')}
          className="flex items-center gap-2.5 cursor-pointer group"
        >
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-rose-500 p-[2px] shadow-sm group-hover:scale-105 transition-transform flex-shrink-0">
            <div className="w-full h-full bg-white rounded-[10px] flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-blue-600" />
            </div>
          </div>
          <div className="flex flex-col justify-center leading-[0.92] tracking-widest font-black select-none" style={{ fontFamily: 'Orbitron, sans-serif' }}>
            <span className="text-[11px] sm:text-xs text-slate-900 group-hover:text-blue-600 transition-colors">DEEP</span>
            <span className="text-[11px] sm:text-xs text-blue-600">DIVE</span>
            <span className="text-[11px] sm:text-xs text-rose-500">JAPAN</span>
          </div>
        </div>

        {/* Navigation Tabs (Desktop) */}
        <nav className="hidden md:flex items-center gap-1 bg-slate-100 p-1 rounded-full border border-slate-200">
          <button
            onClick={() => setCurrentTab('explore')}
            className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs sm:text-sm font-bold transition-all cursor-pointer ${
              currentTab === 'explore'
                ? 'bg-white text-blue-600 shadow-sm'
                : 'text-slate-600 hover:text-slate-900 hover:bg-white/60'
            }`}
          >
            <Compass className="w-4 h-4" />
            {t.nav.explore}
          </button>

          <button
            onClick={() => setCurrentTab('requests')}
            className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs sm:text-sm font-bold transition-all cursor-pointer ${
              currentTab === 'requests'
                ? 'bg-white text-blue-600 shadow-sm'
                : 'text-slate-600 hover:text-slate-900 hover:bg-white/60'
            }`}
          >
            <MessageSquare className="w-4 h-4" />
            {t.nav.requests}
          </button>

          <button
            onClick={() => setCurrentTab('mypage')}
            className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs sm:text-sm font-bold transition-all cursor-pointer ${
              currentTab === 'mypage'
                ? 'bg-white text-blue-600 shadow-sm'
                : 'text-slate-600 hover:text-slate-900 hover:bg-white/60'
            }`}
          >
            <Bookmark className="w-4 h-4" />
            {t.nav.myPage}
          </button>
        </nav>

        {/* Right Actions: Currency, Language, Favorites, Host */}
        <div className="flex items-center gap-1.5 sm:gap-2.5">
          {/* Currency Switcher */}
          <select
            value={currency}
            onChange={(e) => setCurrency(e.target.value as Currency)}
            className="bg-slate-50 hover:bg-slate-100 border border-slate-200 text-xs font-bold text-slate-700 rounded-xl px-2 py-2 cursor-pointer focus:outline-none transition-colors"
            aria-label="Currency"
          >
            <option value="JPY">¥ JPY</option>
            <option value="USD">$ USD</option>
            <option value="EUR">€ EUR</option>
            <option value="TWD">NT$ TWD</option>
          </select>

          {/* Language Switcher */}
          <button
            onClick={() => setLang(lang === 'ja' ? 'en' : 'ja')}
            className="flex items-center gap-1 px-2.5 py-2 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200 text-xs font-bold text-slate-700 hover:text-blue-600 transition-colors cursor-pointer"
            title="Switch Language"
          >
            <Globe className="w-3.5 h-3.5 text-blue-600" />
            <span>{lang === 'ja' ? 'EN' : 'JP'}</span>
          </button>

          {/* Favorites Button */}
          <button
            onClick={openFavorites}
            className="relative p-2 sm:p-2.5 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-600 hover:text-rose-500 transition-colors cursor-pointer"
            title={t.nav.favorites}
          >
            <Bookmark className="w-4 h-4" />
            {favoritesCount > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 sm:w-5 sm:h-5 rounded-full bg-rose-500 text-white text-[10px] sm:text-[11px] font-bold flex items-center justify-center shadow-sm">
                {favoritesCount}
              </span>
            )}
          </button>

          {/* Host a Tour CTA Button */}
          <button
            onClick={openCreateModal}
            className="flex items-center gap-1.5 px-3 sm:px-4 py-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white text-xs sm:text-sm font-bold shadow-md shadow-blue-500/20 transition-all cursor-pointer active:scale-95 whitespace-nowrap"
          >
            <PlusCircle className="w-4 h-4" />
            <span className="hidden sm:inline">{t.nav.hostTour}</span>
            <span className="sm:hidden">{lang === 'ja' ? '投稿' : 'Host'}</span>
          </button>
        </div>
      </div>

      {/* Mobile Sub Navigation */}
      <div className="flex md:hidden border-t border-slate-200 bg-white px-4 py-2 justify-around">
        <button
          onClick={() => setCurrentTab('explore')}
          className={`flex items-center gap-1.5 text-xs py-1.5 px-3 rounded-lg font-bold ${
            currentTab === 'explore' ? 'text-blue-600 bg-blue-50' : 'text-slate-600'
          }`}
        >
          <Compass className="w-3.5 h-3.5" />
          {t.nav.explore}
        </button>
        <button
          onClick={() => setCurrentTab('requests')}
          className={`flex items-center gap-1.5 text-xs py-1.5 px-3 rounded-lg font-bold ${
            currentTab === 'requests' ? 'text-blue-600 bg-blue-50' : 'text-slate-600'
          }`}
        >
          <MessageSquare className="w-3.5 h-3.5" />
          {t.nav.requests}
        </button>
        <button
          onClick={() => setCurrentTab('mypage')}
          className={`flex items-center gap-1.5 text-xs py-1.5 px-3 rounded-lg font-bold ${
            currentTab === 'mypage' ? 'text-blue-600 bg-blue-50' : 'text-slate-600'
          }`}
        >
          <Bookmark className="w-3.5 h-3.5" />
          {t.nav.myPage}
        </button>
      </div>
    </header>
  );
};
