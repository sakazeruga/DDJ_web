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
    <header className="sticky top-0 z-40 bg-slate-950/80 backdrop-blur-md border-b border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between">
        {/* Brand Logo */}
        <div 
          onClick={() => setCurrentTab('explore')}
          className="flex items-center gap-3 cursor-pointer group"
        >
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-purple-600 via-pink-500 to-cyan-400 p-[2px] shadow-lg shadow-purple-500/20 group-hover:shadow-purple-500/40 transition-all">
            <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-cyan-400 animate-pulse" />
            </div>
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-extrabold text-xl tracking-wider bg-gradient-to-r from-white via-cyan-200 to-purple-400 bg-clip-text text-transparent" style={{ fontFamily: 'Orbitron, sans-serif' }}>
                DEEP DIVE
              </span>
              <span className="text-xs px-1.5 py-0.5 rounded bg-purple-500/20 text-purple-300 font-semibold border border-purple-500/30">
                JAPAN
              </span>
            </div>
            <p className="text-[10px] text-slate-400 tracking-tight font-medium">
              {lang === 'ja' ? 'オタク特化型ツアー体験' : 'Otaku Tourism Redefined'}
            </p>
          </div>
        </div>

        {/* Navigation Tabs */}
        <nav className="hidden md:flex items-center gap-1 bg-slate-900/60 p-1.5 rounded-full border border-slate-800">
          <button
            onClick={() => setCurrentTab('explore')}
            className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all ${
              currentTab === 'explore'
                ? 'bg-purple-600 text-white shadow-md shadow-purple-600/30'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            <Compass className="w-4 h-4" />
            {t.nav.explore}
          </button>

          <button
            onClick={() => setCurrentTab('requests')}
            className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all ${
              currentTab === 'requests'
                ? 'bg-purple-600 text-white shadow-md shadow-purple-600/30'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            <MessageSquare className="w-4 h-4" />
            {t.nav.requests}
          </button>

          <button
            onClick={() => setCurrentTab('mypage')}
            className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all ${
              currentTab === 'mypage'
                ? 'bg-purple-600 text-white shadow-md shadow-purple-600/30'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
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
            className="relative p-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 hover:text-pink-400 transition-colors"
            title={t.nav.favorites}
          >
            <Bookmark className="w-4 h-4" />
            {favoritesCount > 0 && (
              <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-pink-500 text-white text-[11px] font-bold flex items-center justify-center shadow-lg shadow-pink-500/50">
                {favoritesCount}
              </span>
            )}
          </button>

          {/* Language Switcher */}
          <button
            onClick={() => setLang(lang === 'ja' ? 'en' : 'ja')}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-xs font-semibold text-slate-300 hover:text-cyan-400 transition-colors"
          >
            <Globe className="w-3.5 h-3.5 text-cyan-400" />
            <span>{lang === 'ja' ? 'EN' : 'JP'}</span>
          </button>

          {/* Host a Tour CTA Button */}
          <button
            onClick={openCreateModal}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-purple-600 via-pink-600 to-rose-600 hover:from-purple-500 hover:to-pink-500 text-white text-xs sm:text-sm font-bold shadow-lg shadow-purple-600/25 hover:shadow-purple-600/40 transition-all cursor-pointer active:scale-95"
          >
            <PlusCircle className="w-4 h-4" />
            <span className="hidden sm:inline">{t.nav.hostTour}</span>
            <span className="sm:hidden">{lang === 'ja' ? '投稿' : 'Post'}</span>
          </button>
        </div>
      </div>

      {/* Mobile Sub Navigation */}
      <div className="flex md:hidden border-t border-slate-900 bg-slate-950 px-4 py-2 justify-around">
        <button
          onClick={() => setCurrentTab('explore')}
          className={`flex items-center gap-1.5 text-xs py-1.5 px-3 rounded-lg font-medium ${
            currentTab === 'explore' ? 'text-cyan-400 bg-slate-900' : 'text-slate-400'
          }`}
        >
          <Compass className="w-3.5 h-3.5" />
          {t.nav.explore}
        </button>
        <button
          onClick={() => setCurrentTab('requests')}
          className={`flex items-center gap-1.5 text-xs py-1.5 px-3 rounded-lg font-medium ${
            currentTab === 'requests' ? 'text-cyan-400 bg-slate-900' : 'text-slate-400'
          }`}
        >
          <MessageSquare className="w-3.5 h-3.5" />
          {t.nav.requests}
        </button>
        <button
          onClick={() => setCurrentTab('mypage')}
          className={`flex items-center gap-1.5 text-xs py-1.5 px-3 rounded-lg font-medium ${
            currentTab === 'mypage' ? 'text-cyan-400 bg-slate-900' : 'text-slate-400'
          }`}
        >
          {t.nav.myPage}
        </button>
      </div>
    </header>
  );
};
