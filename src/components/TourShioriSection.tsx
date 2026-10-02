import React from 'react';
import { MapPin, Camera, Utensils, ShoppingBag, Coffee, CheckCircle2, Bookmark } from 'lucide-react';
import type { Language } from '../types';

interface TourShioriSectionProps {
  lang: Language;
}

export const TourShioriSection: React.FC<TourShioriSectionProps> = ({ lang }) => {
  const steps = [
    {
      time: '10:00 AM',
      title: lang === 'ja' ? 'JR秋葉原駅 電気街口 集合' : 'JR Akihabara Station Meeting',
      desc: lang === 'ja' ? '改札前で専属ガイドと合流！お互いの「最推し作品」や今回の旅で絶対買いたいグッズをヒアリング。' : 'Meet your guide at Electric Town Exit. Brief chat about your favorite anime & loot wishlist.',
      icon: <MapPin className="w-5 h-5 text-yellow-400" />,
      tag: '集合＆自己紹介',
      tagColor: 'bg-yellow-400 text-black',
    },
    {
      time: '11:30 AM',
      title: lang === 'ja' ? '一般人が気づかない裏路地・聖地アングル検証' : 'Secret Alleys & Scene Frame Matching',
      desc: lang === 'ja' ? 'アニメ作中で電柱や自販機が描かれた寸分違わぬロケーションで、ガイドが画角を完全サポート撮影！' : 'Stand in the exact spot of iconic anime frames. Your guide helps you frame the perfect shot.',
      icon: <Camera className="w-5 h-5 text-pink-400" />,
      tag: '聖地シンクロ撮影',
      tagColor: 'bg-pink-500 text-white',
    },
    {
      time: '01:00 PM',
      title: lang === 'ja' ? '聖地コラボメシ＆老舗B級オタクランチ' : 'Holy Anime Curry & Collab Food',
      desc: lang === 'ja' ? '作中に登場する名物カレーや老舗おでん缶を食べながら、ガイドと熱狂的なオタクトークで盛り上がる。' : 'Taste legendary anime curry or historic canned oden while geeking out with your guide.',
      icon: <Utensils className="w-5 h-5 text-cyan-400" />,
      tag: '腹ごしらえ',
      tagColor: 'bg-cyan-500 text-black',
    },
    {
      time: '02:30 PM',
      title: lang === 'ja' ? '雑居ビル・地下魔境でお宝ディグ（発掘）' : 'Underground Treasure Digging',
      desc: lang === 'ja' ? '観光客ゼロの老舗同人フロアやレトロゲーム基板店へ。探している激レアグッズをガイドが店主と捜索！' : 'Bypass mainstream shops. Dig through vintage cels, retro game carts, and rare doujinshi.',
      icon: <ShoppingBag className="w-5 h-5 text-purple-400" />,
      tag: '散財＆発掘💸',
      tagColor: 'bg-purple-600 text-white',
    },
    {
      time: '04:30 PM',
      title: lang === 'ja' ? '純喫茶で戦利品自慢＆巡礼手帳スタンプ' : 'Loot Showcase & Pilgrimage Stamp',
      desc: lang === 'ja' ? 'レトロ喫茶で今日ゲットした戦利品を並べて撮影会！DDJ特製の「聖地巡礼 済」印を記念スタンプ。' : 'Review your anime loot at a retro cafe, snap photos, and get your Official Pilgrimage Stamp!',
      icon: <Coffee className="w-5 h-5 text-emerald-400" />,
      tag: '完走＆記念スタンプ',
      tagColor: 'bg-emerald-500 text-white',
    },
  ];

  return (
    <section className="py-16 md:py-24 border-t border-slate-800 bg-slate-950/80 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full otaku-badge-pink text-xs font-black mb-3">
            <Bookmark className="w-3.5 h-3.5" />
            <span>{lang === 'ja' ? '📖 ツアーのしおり' : '📖 Tour Itinerary Guide'}</span>
          </div>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-white tracking-tight">
            {lang === 'ja' ? 'オタクツアーって何するの？1日の流れ' : 'What is an Otaku Tour? A Typical Day'}
          </h2>
          <p className="mt-3 text-slate-300 text-sm sm:text-base">
            {lang === 'ja'
              ? '「免税店で終わる一般ツアーとは何が違う？」ローカルオタクが徹底エスコートする濃密な体験をご紹介。'
              : 'Discover how local otaku guides transform a regular city walk into an unforgettable anime pilgrimage.'}
          </p>
        </div>

        {/* 2-Column: Left Visual Shiori flatlay, Right Timeline */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          {/* Left Visual: Shiori Desk Flatlay */}
          <div className="lg:col-span-5 space-y-4">
            <div className="bg-slate-900 p-4 rounded-3xl border-2 border-slate-700 shadow-2xl relative otaku-sticker">
              {/* Masking tape on top */}
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-28 h-6 bg-yellow-400/80 transform -rotate-1 rounded-sm shadow-md border-x-2 border-dashed border-white/40 text-[10px] font-black text-slate-900 flex items-center justify-center">
                ★ 旅のしおり原本 ★
              </div>

              <div className="rounded-2xl overflow-hidden aspect-[4/3] bg-slate-950">
                <img
                  src="/assets/otaku_shiori_desk.jpg"
                  alt="聖地巡礼 旅のしおり"
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                />
              </div>

              <div className="mt-4 p-3 bg-slate-950 rounded-xl border border-slate-800 text-xs">
                <div className="flex items-center justify-between text-yellow-400 font-bold mb-1">
                  <span>🎒 ツアー参加時の基本装備</span>
                  <span className="text-slate-400 text-[10px]">GUIDE RECOMMENDATION</span>
                </div>
                <div className="grid grid-cols-2 gap-2 text-[11px] text-slate-300">
                  <div className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-3 h-3 text-cyan-400 flex-shrink-0" />
                    <span>歩きやすいスニーカー</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-3 h-3 text-pink-400 flex-shrink-0" />
                    <span>小銭（100円玉×20枚）</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-3 h-3 text-yellow-400 flex-shrink-0" />
                    <span>戦利品用エコバッグ</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-3 h-3 text-purple-400 flex-shrink-0" />
                    <span>推しへの燃えるパッション</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Timeline Steps */}
          <div className="lg:col-span-7 space-y-4">
            {steps.map((step, idx) => (
              <div
                key={idx}
                className="bg-slate-900/90 hover:bg-slate-850 p-4 sm:p-5 rounded-2xl border border-slate-800 hover:border-purple-500/50 transition-all flex items-start gap-4"
              >
                {/* Icon box */}
                <div className="w-11 h-11 rounded-xl bg-slate-950 border border-slate-700 flex items-center justify-center flex-shrink-0 shadow-inner">
                  {step.icon}
                </div>

                {/* Content */}
                <div className="flex-1">
                  <div className="flex flex-wrap items-center justify-between gap-2 mb-1">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs font-bold text-slate-400 bg-slate-950 px-2 py-0.5 rounded border border-slate-800">
                        {step.time}
                      </span>
                      <h3 className="font-bold text-white text-sm sm:text-base">
                        {step.title}
                      </h3>
                    </div>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${step.tagColor}`}>
                      {step.tag}
                    </span>
                  </div>
                  <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
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
