import React from 'react';
import { Target, Users, Globe2, Sparkles, HeartHandshake } from 'lucide-react';
import type { Language } from '../types';
import { translations } from '../i18n/translations';

interface FeaturesSectionProps {
  lang: Language;
  openCreateModal: () => void;
}

export const FeaturesSection: React.FC<FeaturesSectionProps> = ({
  lang,
  openCreateModal,
}) => {
  const t = translations[lang];

  return (
    <section className="py-16 md:py-24 border-t border-slate-800/80 bg-slate-950">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-950/60 border border-cyan-500/40 text-cyan-300 text-xs font-semibold mb-3">
            <Sparkles className="w-3.5 h-3.5" />
            <span>DEEP PHILOSOPHY</span>
          </div>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-white tracking-tight">
            {t.features.title}
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Feature 1 */}
          <div className="bg-slate-900/60 p-6 sm:p-8 rounded-3xl border border-slate-800 hover:border-purple-500/40 transition-colors">
            <div className="w-12 h-12 rounded-2xl bg-purple-900/40 border border-purple-500/50 flex items-center justify-center text-purple-400 mb-6">
              <Target className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-white mb-2">{t.features.f1Title}</h3>
            <p className="text-sm text-slate-300 leading-relaxed">{t.features.f1Desc}</p>
          </div>

          {/* Feature 2 */}
          <div className="bg-slate-900/60 p-6 sm:p-8 rounded-3xl border border-slate-800 hover:border-pink-500/40 transition-colors">
            <div className="w-12 h-12 rounded-2xl bg-pink-900/40 border border-pink-500/50 flex items-center justify-center text-pink-400 mb-6">
              <Users className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-white mb-2">{t.features.f2Title}</h3>
            <p className="text-sm text-slate-300 leading-relaxed">{t.features.f2Desc}</p>
          </div>

          {/* Feature 3 */}
          <div className="bg-slate-900/60 p-6 sm:p-8 rounded-3xl border border-slate-800 hover:border-cyan-500/40 transition-colors">
            <div className="w-12 h-12 rounded-2xl bg-cyan-900/40 border border-cyan-500/50 flex items-center justify-center text-cyan-400 mb-6">
              <Globe2 className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-white mb-2">{t.features.f3Title}</h3>
            <p className="text-sm text-slate-300 leading-relaxed">{t.features.f3Desc}</p>
          </div>
        </div>

        {/* Host Call to Action Card */}
        <div className="mt-16 bg-gradient-to-r from-purple-900/40 via-pink-900/30 to-slate-900 p-8 sm:p-12 rounded-3xl border border-purple-500/40 relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="max-w-xl text-center md:text-left">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-950/80 border border-purple-500/40 text-purple-300 text-xs font-semibold mb-3">
              <HeartHandshake className="w-3.5 h-3.5" />
              <span>{lang === 'ja' ? 'ガイド大募集中' : 'BECOME AN OTAKU GUIDE'}</span>
            </div>
            <h3 className="text-2xl sm:text-3xl font-black text-white mb-3">
              {lang === 'ja' ? 'あなたの「推し」と「知識」で、世界中のオタクをもてなそう。' : 'Turn your hyperfixations and sacred lore into an unforgettable tour.'}
            </h3>
            <p className="text-sm text-slate-300 leading-relaxed">
              {lang === 'ja'
                ? '特別な資格は不要です。必要なのは「この作品を誰よりも愛している」という熱量だけ。あなたの街の聖地や行きつけの店を世界に発信しましょう。'
                : 'No formal certification needed. All you need is burning passion for your favorite series or underground hobby.'}
            </p>
          </div>

          <button
            onClick={openCreateModal}
            className="px-8 py-4 rounded-2xl bg-gradient-to-r from-pink-500 to-rose-600 hover:from-pink-400 hover:to-rose-500 text-white font-black text-sm sm:text-base shadow-xl shadow-pink-500/30 transition-all flex items-center gap-2 cursor-pointer active:scale-95 whitespace-nowrap"
          >
            <Sparkles className="w-5 h-5" />
            <span>{lang === 'ja' ? 'オタクツアーを企画・投稿する' : 'Host a Deep Tour Now'}</span>
          </button>
        </div>
      </div>
    </section>
  );
};
