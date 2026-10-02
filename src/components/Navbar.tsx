import React from 'react';
import { Compass, MessageSquare, PlusCircle, Bookmark, Globe, Sparkles } from 'lucide-react';
import type { Language } from '../types';
import { translations } from '../i18n/translations';

interface NavbarProps {
  currentTab: 'explore' | 'requests' | 'mypage';
  setCurrentTab: (tab: 'explore' | 'requests' | 'mypage') => void;
  openCreateModal: () => void;
  lang: Language;
  setLang: (lang: Language) => void;
  favoritesCount: number;
  openFavorites: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentTab,
  setCurrentTab,
  openCreateModal,
  lang,
  setLang,
  favoritesCount,
  openFavorites,
}) => {
  const t = translations[lang];

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between">
        {/* Brand Logo */}
        <div 
          onClick={() => setCurrentTab('explore')}
          className="flex items-center gap-3 cursor-pointer group"
        >
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 to-rose-500 p-[2px] shadow-sm group-hover:scale-105 transition-transform">
            <div className="w-full h-full bg-white rounded-[10px] flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-blue-600" />
            </div>
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-extrabold text-xl tracking-wider text-slate-900" style={{ fontFamily: 'Orbitron, sans-serif' }}>
                DEEP DIVE
              </span>
              <span className="text-xs px-1.5 py-0.5 rounded bg-blue-100 text-blue-700 font-bold border border-blue-200">
                JAPAN
              </span>
            </div>
            <p className="text-[10px] text-slate-500 tracking-tight font-medium">
              {lang === 'ja' ? '日本の偏愛カルチャーツアー' : 'Cultural Passion Tours in Japan'}
            </p>
          </div>
        </div>

        {/* Navigation Tabs */}
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
            {t.nav.myPage}
          </button>
        </nav>

        {/* Right Actions */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Favorites Button */}
          <button
            onClick={openFavorites}
            className="relative p-2.5 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-600 hover:text-rose-500 transition-colors cursor-pointer"
            title={t.nav.favorites}
          >
            <Bookmark className="w-4 h-4" />
            {favoritesCount > 0 && (
              <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-rose-500 text-white text-[11px] font-bold flex items-center justify-center shadow-sm">
                {favoritesCount}
              </span>
            )}
          </button>

          {/* Language Switcher */}
          <button
            onClick={() => setLang(lang === 'ja' ? 'en' : 'ja')}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200 text-xs font-bold text-slate-700 hover:text-blue-600 transition-colors cursor-pointer"
          >
            <Globe className="w-3.5 h-3.5 text-blue-600" />
            <span>{lang === 'ja' ? 'EN' : 'JP'}</span>
          </button>

          {/* Host a Tour CTA Button */}
          <button
            onClick={openCreateModal}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white text-xs sm:text-sm font-bold shadow-md shadow-blue-500/20 transition-all cursor-pointer active:scale-95"
          >
            <PlusCircle className="w-4 h-4" />
            <span className="hidden sm:inline">{t.nav.hostTour}</span>
            <span className="sm:hidden">{lang === 'ja' ? '投稿' : 'Post'}</span>
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
          {t.nav.myPage}
        </button>
      </div>
    </header>
  );
};
