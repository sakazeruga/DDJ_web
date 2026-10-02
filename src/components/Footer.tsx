import React from 'react';
import { Sparkles, Heart } from 'lucide-react';
import type { Language } from '../types';

interface FooterProps {
  lang: Language;
}

export const Footer: React.FC<FooterProps> = ({ lang }) => {
  return (
    <footer className="bg-white border-t border-slate-200 py-12 text-slate-500 text-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-blue-600 via-indigo-600 to-rose-500 p-[1.5px] shadow-xs">
            <div className="w-full h-full bg-white rounded-[7px] flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-blue-600" />
            </div>
          </div>
          <div className="flex flex-col justify-center leading-[0.92] tracking-widest font-black" style={{ fontFamily: 'Orbitron, sans-serif' }}>
            <span className="text-[10px] text-slate-900">DEEP</span>
            <span className="text-[10px] text-blue-600">DIVE</span>
            <span className="text-[10px] text-rose-500">JAPAN</span>
          </div>
          <span className="text-[11px] text-slate-400 ml-2">© 2026 Deep Dive Japan</span>
        </div>

        <div className="flex flex-wrap items-center gap-6 text-slate-600 font-medium">
          <span className="hover:text-blue-600 cursor-pointer transition-colors">
            {lang === 'ja' ? '利用規約' : 'Terms of Service'}
          </span>
          <span className="hover:text-blue-600 cursor-pointer transition-colors">
            {lang === 'ja' ? 'プライバシーポリシー' : 'Privacy Policy'}
          </span>
          <span className="hover:text-blue-600 cursor-pointer transition-colors">
            {lang === 'ja' ? 'ガイド行動規範' : 'Guide Code of Conduct'}
          </span>
          <span className="hover:text-blue-600 cursor-pointer transition-colors">
            {lang === 'ja' ? 'お問い合わせ' : 'Contact Us'}
          </span>
        </div>

        <div className="flex items-center gap-1 text-[11px] text-slate-400">
          <span>Crafted with</span>
          <Heart className="w-3 h-3 text-rose-500 fill-rose-500 inline" />
          <span>for Cultural Tourism & Passion in Japan</span>
        </div>
      </div>
    </footer>
  );
};
