import React from 'react';
import { MapPin, Camera, Utensils, Compass, Coffee, CheckCircle2, Bookmark } from 'lucide-react';
import type { Language } from '../types';

interface TourShioriSectionProps {
  lang: Language;
}

export const TourShioriSection: React.FC<TourShioriSectionProps> = ({ lang }) => {
  const steps = [
    {
      time: '10:00 AM',
      title: lang === 'ja' ? '集合＆旅のオリエンテーション' : 'Meeting & Personal Orientation',
      desc: lang === 'ja' ? '駅改札前で専属ガイドと合流！参加者の興味（歴史の好きな時代、撮りたい鉄道アングル、好きな作品など）をヒアリングしてルートを調整。' : 'Meet your specialist guide at the station. Tailor the itinerary to your specific era, train model, or anime interests.',
      icon: <MapPin className="w-5 h-5 text-blue-600" />,
      tag: '集合＆ヒアリング',
      tagColor: 'bg-blue-100 text-blue-800 border-blue-200',
    },
    {
      time: '11:30 AM',
      title: lang === 'ja' ? '教科書にない現地遺構・聖地アングル探訪' : 'Hidden Historic Relics & Frame Verification',
      desc: lang === 'ja' ? '城郭の巨大土塁の断面、刀傷が残る柱、アニメと同じ画角の鳥居など、一般のツアーでは通り過ぎてしまうディープな現場を徹底解説。' : 'Analyze defensive trenches, authentic samurai katana slashes, or exact anime camera frames standard bus tours miss.',
      icon: <Camera className="w-5 h-5 text-rose-600" />,
      tag: 'ディープ探訪',
      tagColor: 'bg-rose-100 text-rose-800 border-rose-200',
    },
    {
      time: '01:00 PM',
      title: lang === 'ja' ? '名物ローカルメシ＆純喫茶ランチ' : 'Local Food Heritage & Kissaten Lunch',
      desc: lang === 'ja' ? '文豪が愛した老舗喫茶のネルドリップ珈琲や、作中モデルのカレー、宿場町の名物そばを食べながら、ガイドと熱い文化トーク。' : 'Taste historic coffee frequented by famous novelists, holy curry, or local soba while discussing Japanese culture.',
      icon: <Utensils className="w-5 h-5 text-amber-600" />,
      tag: 'ローカル昼食',
      tagColor: 'bg-amber-100 text-amber-800 border-amber-200',
    },
    {
      time: '02:30 PM',
      title: lang === 'ja' ? '専門古書店・名車乗車・伝統工房体験' : 'Rare Bookshops, Scenic Rides & Artisan Workshops',
      desc: lang === 'ja' ? '神保町で専門書を発掘したり、江ノ電の絶景カーブを撮影したり、伝統工芸の組紐を織ったり。能動的に楽しむ濃密な時間。' : 'Browse rare antiquarian books, ride scenic coastal rail curves, or weave traditional braided silk with local masters.',
      icon: <Compass className="w-5 h-5 text-emerald-600" />,
      tag: '体験＆発見',
      tagColor: 'bg-emerald-100 text-emerald-800 border-emerald-200',
    },
    {
      time: '04:30 PM',
      title: lang === 'ja' ? '戦利品のお披露目＆「旅のしおり」記念スタンプ' : 'Recap, Showcase & Tour Stamp Seal',
      desc: lang === 'ja' ? 'カフェで今日撮った写真や買ったお宝を並べて振り返り。DDJオリジナルの巡礼記念スタンプを押印して解散！' : 'Showcase your photos and treasures at a cozy cafe, receive your official verification stamp, and wrap up!',
      icon: <Coffee className="w-5 h-5 text-purple-600" />,
      tag: '完走＆記念スタンプ',
      tagColor: 'bg-purple-100 text-purple-800 border-purple-200',
    },
  ];

  return (
    <section className="py-16 md:py-24 border-t border-slate-200 bg-white relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-blue-100 text-blue-800 border border-blue-200 text-xs font-bold mb-3">
            <Bookmark className="w-3.5 h-3.5 text-blue-600" />
            <span>{lang === 'ja' ? '📖 ツアーのしおり' : '📖 Tour Itinerary Guide'}</span>
          </div>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-slate-900 tracking-tight">
            {lang === 'ja' ? '偏愛ツアーってどんな感じ？1日の流れ' : 'What is a Cultural Passion Tour? A Typical Day'}
          </h2>
          <p className="mt-3 text-slate-600 text-sm sm:text-base">
            {lang === 'ja'
              ? '「大手旅行会社のツアーとは何が違う？」その道を究めたローカルガイドがエスコートする濃密な体験をご紹介。'
              : 'Discover how dedicated local experts turn a normal day into an unforgettable cultural deep-dive.'}
          </p>
        </div>

        {/* 2-Column: Left Visual Shiori flatlay, Right Timeline */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          {/* Left Visual: Shiori Desk Flatlay */}
          <div className="lg:col-span-5 space-y-4">
            <div className="bg-slate-50 p-4 rounded-3xl border border-slate-200 shadow-lg relative">
              <div className="rounded-2xl overflow-hidden aspect-[4/3] bg-slate-100 border border-slate-200">
                <img
                  src="/assets/otaku_shiori_desk.jpg"
                  alt="聖地巡礼 旅のしおり"
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                />
              </div>

              <div className="mt-4 p-3 bg-white rounded-xl border border-slate-200 text-xs">
                <div className="flex items-center justify-between text-slate-900 font-bold mb-2">
                  <span>🎒 ツアー参加時の基本装備＆ヒント</span>
                  <span className="text-blue-600 font-bold text-[10px]">GUIDE TIPS</span>
                </div>
                <div className="grid grid-cols-2 gap-2 text-[11px] text-slate-700">
                  <div className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-blue-600 flex-shrink-0" />
                    <span>歩きやすいスニーカー</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0" />
                    <span>カメラまたはスマホ</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-amber-600 flex-shrink-0" />
                    <span>本やグッズ用エコバッグ</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-rose-600 flex-shrink-0" />
                    <span>尽きない好奇心！</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Timeline Steps */}
          <div className="lg:col-span-7 space-y-3.5">
            {steps.map((step, idx) => (
              <div
                key={idx}
                className="bg-slate-50 hover:bg-blue-50/40 p-4 sm:p-5 rounded-2xl border border-slate-200 hover:border-blue-300 transition-all flex items-start gap-4 shadow-xs"
              >
                {/* Icon box */}
                <div className="w-11 h-11 rounded-xl bg-white border border-slate-200 flex items-center justify-center flex-shrink-0 shadow-xs">
                  {step.icon}
                </div>

                {/* Content */}
                <div className="flex-1">
                  <div className="flex flex-wrap items-center justify-between gap-2 mb-1">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs font-bold text-slate-500 bg-white px-2 py-0.5 rounded border border-slate-200">
                        {step.time}
                      </span>
                      <h3 className="font-bold text-slate-900 text-sm sm:text-base">
                        {step.title}
                      </h3>
                    </div>
                    <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full border ${step.tagColor}`}>
                      {step.tag}
                    </span>
                  </div>
                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                    {step.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
