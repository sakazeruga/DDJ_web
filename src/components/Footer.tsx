import React from 'react';
import { Sparkles, Heart } from 'lucide-react';
import type { Language } from '../types';

interface FooterProps {
  lang: Language;
}

export const Footer: React.FC<FooterProps> = ({ lang }) => {
  return (
    <footer className="bg-slate-950 border-t border-slate-900 py-12 text-slate-400 text-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-lg bg-gradient-to-tr from-purple-600 to-cyan-400 flex items-center justify-center">
            <Sparkles className="w-3.5 h-3.5 text-white" />
          </div>
          <span className="font-extrabold text-sm tracking-wider text-white" style={{ fontFamily: 'Orbitron, sans-serif' }}>
            DEEP DIVE JAPAN
          </span>
          <span className="text-[11px] text-slate-500">© 2026 Deep Dive Japan</span>
        </div>

        <div className="flex flex-wrap items-center gap-6 text-slate-400">
          <span className="hover:text-white cursor-pointer transition-colors">
            {lang === 'ja' ? '利用規約' : 'Terms of Service'}
          </span>
          <span className="hover:text-white cursor-pointer transition-colors">
            {lang === 'ja' ? 'プライバシーポリシー' : 'Privacy Policy'}
          </span>
          <span className="hover:text-white cursor-pointer transition-colors">
            {lang === 'ja' ? 'ガイド行動規範' : 'Guide Code of Conduct'}
          </span>
          <span className="hover:text-white cursor-pointer transition-colors">
            {lang === 'ja' ? 'お問い合わせ' : 'Contact Us'}
          </span>
        </div>

        <div className="flex items-center gap-1 text-[11px] text-slate-500">
          <span>Crafted with</span>
          <Heart className="w-3 h-3 text-pink-500 fill-pink-500 inline" />
          <span>for Otaku Culture Worldwide</span>
        </div>
      </div>
    </footer>
  );
};
