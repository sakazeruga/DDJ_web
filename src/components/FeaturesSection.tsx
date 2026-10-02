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
    <section className="py-16 md:py-24 border-t border-slate-200 bg-slate-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-100 text-blue-800 border border-blue-200 text-xs font-bold mb-3">
            <Sparkles className="w-3.5 h-3.5 text-blue-600" />
            <span>DEEP DIVE PHILOSOPHY</span>
          </div>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-slate-900 tracking-tight">
            {t.features.title}
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Feature 1 */}
          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
            <div className="w-12 h-12 rounded-2xl bg-blue-50 border border-blue-200 flex items-center justify-center text-blue-600 mb-6">
              <Target className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 mb-2">{t.features.f1Title}</h3>
            <p className="text-sm text-slate-600 leading-relaxed">{t.features.f1Desc}</p>
          </div>

          {/* Feature 2 */}
          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
            <div className="w-12 h-12 rounded-2xl bg-rose-50 border border-rose-200 flex items-center justify-center text-rose-600 mb-6">
              <Users className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 mb-2">{t.features.f2Title}</h3>
            <p className="text-sm text-slate-600 leading-relaxed">{t.features.f2Desc}</p>
          </div>

          {/* Feature 3 */}
          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
            <div className="w-12 h-12 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-600 mb-6">
              <Globe2 className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 mb-2">{t.features.f3Title}</h3>
            <p className="text-sm text-slate-600 leading-relaxed">{t.features.f3Desc}</p>
          </div>
        </div>

        {/* Host Call to Action Banner */}
        <div className="mt-16 bg-gradient-to-r from-blue-700 via-indigo-700 to-rose-600 p-8 sm:p-12 rounded-3xl text-white shadow-xl relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="max-w-xl text-center md:text-left">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 text-white text-xs font-bold mb-3">
              <HeartHandshake className="w-3.5 h-3.5 text-yellow-300" />
              <span>{lang === 'ja' ? '偏愛ガイド大募集中' : 'BECOME A SPECIALIST GUIDE'}</span>
            </div>
            <h3 className="text-2xl sm:text-3xl font-black mb-3">
              {lang === 'ja' ? 'あなたの「好き」と「知識」で、世界中の旅人をもてなそう。' : 'Turn your passion into an unforgettable walking tour.'}
            </h3>
            <p className="text-sm text-blue-100 leading-relaxed">
              {lang === 'ja'
                ? '歴史、鉄道、アニメ聖地、古書、妖怪、純喫茶。特別な資格は不要です。必要なのは「このテーマを誰よりも愛している」という熱量だけ。'
                : 'History, railways, anime pilgrimages, or vintage cafes. No formal license needed. All you need is genuine love for your subject.'}
            </p>
          </div>

          <button
            onClick={openCreateModal}
            className="px-8 py-4 rounded-2xl bg-white hover:bg-slate-100 text-blue-900 font-black text-sm sm:text-base shadow-lg transition-all flex items-center gap-2 cursor-pointer active:scale-95 whitespace-nowrap"
          >
            <Sparkles className="w-5 h-5 text-amber-500" />
            <span>{lang === 'ja' ? 'ガイドとしてツアーを企画・投稿' : 'Host a Tour Now'}</span>
          </button>
        </div>
      </div>
    </section>
  );
};
