import React, { useState } from 'react';
import { Mail, CheckCircle2, GraduationCap, ArrowRight, BellRing, BookOpen, ShieldCheck } from 'lucide-react';
import confetti from 'canvas-confetti';
import type { Language, Tour } from '../types';

interface NewsletterSectionProps {
  lang: Language;
  latestTours: Tour[];
  onSubscribe?: (email: string, isGlobis: boolean) => void;
}

export const NewsletterSection: React.FC<NewsletterSectionProps> = ({
  lang,
  latestTours,
  onSubscribe,
}) => {
  const [email, setEmail] = useState('');
  const [isGlobisMember, setIsGlobisMember] = useState(false);
  const [isSubscribed, setIsSubscribed] = useState(() => {
    return Boolean(localStorage.getItem('ddj_newsletter_subscribed'));
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes('@')) {
      alert(lang === 'ja' ? '有効なメールアドレスを入力してください' : 'Please provide a valid email');
      return;
    }

    if (onSubscribe) {
      onSubscribe(email, isGlobisMember);
    }

    localStorage.setItem('ddj_newsletter_subscribed', email);
    localStorage.setItem('ddj_newsletter_is_globis', String(isGlobisMember));
    setIsSubscribed(true);

    confetti({
      particleCount: 100,
      spread: 80,
      origin: { y: 0.6 },
      colors: ['#2563eb', '#6366f1', '#10b981', '#f59e0b'],
    });
  };

  return (
    <section className="py-12 sm:py-16 bg-gradient-to-br from-slate-900 via-indigo-950 to-blue-950 text-white relative overflow-hidden">
      {/* Decorative background glows */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-6 sm:p-10 md:p-12 shadow-2xl">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
            {/* Left Column: Value Proposition & Subscription Form */}
            <div className="lg:col-span-7 space-y-6">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/20 text-blue-300 border border-blue-400/30 text-xs font-bold">
                <Mail className="w-3.5 h-3.5 text-blue-400" />
                <span>{lang === 'ja' ? '毎週金曜配信・無料メールマガジン' : 'Weekly Friday Newsletter'}</span>
              </div>

              <div className="space-y-2">
                <h2 className="text-2xl sm:text-3xl md:text-4xl font-black tracking-tight leading-tight">
                  {lang === 'ja' ? (
                    <>
                      教科書にない日本の深層へ。
                      <span className="block bg-gradient-to-r from-blue-300 via-sky-200 to-amber-300 bg-clip-text text-transparent">
                        『週刊DDJ偏愛アンテナ通信』
                      </span>
                    </>
                  ) : (
                    'Weekly Deep Dive Japan Gazette'
                  )}
                </h2>
                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed max-w-xl">
                  {lang === 'ja'
                    ? '新着ツアーの最速追加通知、Globis生やMBA実践者による社会科見学・事業探訪フィールドワーク、全国のディープな街歩きスクリーニング情報を毎週お届け。知的好奇心のアンテナとして活用いただけます。'
                    : 'Get weekly drops of newly published niche walking tours, MBA-led business fieldworks, and AI-screened cult events across Japan.'}
                </p>
              </div>

              {isSubscribed ? (
                <div className="p-4 rounded-2xl bg-emerald-500/20 border border-emerald-400/40 text-emerald-200 flex items-center gap-3">
                  <CheckCircle2 className="w-6 h-6 text-emerald-400 flex-shrink-0" />
                  <div className="text-xs sm:text-sm">
                    <span className="font-bold">メルマガ登録完了！</span> 次号の配信（毎週金曜）をお楽しみに。新着ツアーやGlobis企画の先行案内をお送りします。
                  </div>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-3">
                  <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 max-w-lg">
                    <div className="relative flex-1">
                      <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                      <input
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="your.email@example.com"
                        className="w-full pl-10 pr-3.5 py-3 text-xs sm:text-sm bg-white/10 hover:bg-white/15 focus:bg-white/20 border border-white/25 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:border-blue-400 backdrop-blur-md font-medium"
                      />
                    </div>
                    <button
                      type="submit"
                      className="min-h-[46px] px-6 py-3 rounded-xl bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-400 hover:to-indigo-500 text-white font-bold text-xs sm:text-sm shadow-lg shadow-blue-500/30 transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-95 whitespace-nowrap"
                    >
                      <span>{lang === 'ja' ? '無料で購読する' : 'Subscribe Free'}</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Globis Member Checkbox */}
                  <label className="flex items-center gap-2 text-xs text-slate-300 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={isGlobisMember}
                      onChange={(e) => setIsGlobisMember(e.target.checked)}
                      className="rounded border-slate-600 text-indigo-600 focus:ring-indigo-500 w-4 h-4 bg-white/10 cursor-pointer"
                    />
                    <span className="flex items-center gap-1 font-medium">
                      <GraduationCap className="w-3.5 h-3.5 text-indigo-300" />
                      <span>{lang === 'ja' ? 'Globis生・MBA生 / 社会人実践者枠（フィールドワーク・ネットワーキング情報も受信）' : 'Globis / MBA Member (Receive business fieldwork notices)'}</span>
                    </span>
                  </label>
                </form>
              )}

              {/* Trust Badges */}
              <div className="flex flex-wrap items-center gap-4 text-[11px] text-slate-400 pt-1">
                <span className="flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-blue-400" />
                  <span>スパムなし・いつでもワンクリック解除可能</span>
                </span>
                <span className="flex items-center gap-1">
                  <BellRing className="w-3.5 h-3.5 text-amber-400" />
                  <span>新着ツアー即時ダイジェスト付き</span>
                </span>
              </div>
            </div>

            {/* Right Column: Mini Gazette Preview (What subscribers get) */}
            <div className="lg:col-span-5 bg-slate-950/70 border border-white/15 rounded-2xl p-5 space-y-3.5 shadow-inner">
              <div className="flex items-center justify-between border-b border-white/15 pb-2.5 text-xs font-mono text-slate-400">
                <span className="font-bold text-white flex items-center gap-1.5">
                  <BookOpen className="w-3.5 h-3.5 text-blue-400" />
                  <span>最新号ダイジェストプレビュー</span>
                </span>
                <span className="text-[10px] bg-blue-500/20 text-blue-300 px-2 py-0.5 rounded">Vol.42 今週号</span>
              </div>

              {/* Sample Issue Items */}
              <div className="space-y-3 text-xs">
                <div className="p-2.5 rounded-xl bg-white/5 border border-white/10 space-y-1">
                  <div className="text-[10px] text-blue-300 font-bold uppercase tracking-wider">
                    ★ 今週の新着ディープツアー
                  </div>
                  <div className="font-bold text-white line-clamp-1">
                    {latestTours[0]?.title || '守時タツミと行く『MOTTAINAI SOUND』原風景フィールドレコーディング'}
                  </div>
                  <p className="text-[11px] text-slate-400 line-clamp-2">
                    {latestTours[0]?.catchphrase || '日本の失われゆく原風景の音をハイレゾマイクで採集する特別体験。'}
                  </p>
                </div>

                <div className="p-2.5 rounded-xl bg-indigo-500/10 border border-indigo-400/20 space-y-1">
                  <div className="text-[10px] text-indigo-300 font-bold uppercase tracking-wider flex items-center gap-1">
                    <GraduationCap className="w-3 h-3" />
                    <span>Globis生企画ピックアップ</span>
                  </div>
                  <div className="font-bold text-white line-clamp-1">
                    【小田原・地方創生】老舗かまぼこ暖簾の事業承継とクラフトビール比較探訪
                  </div>
                  <p className="text-[11px] text-slate-400 line-clamp-2">
                    MBA生×地域起業家がナビゲート。現場経営者との直接対話＆クラフトビール付き。
                  </p>
                </div>

                <div className="p-2.5 rounded-xl bg-white/5 border border-white/10 space-y-1">
                  <div className="text-[10px] text-amber-300 font-bold uppercase tracking-wider">
                    📡 アンテナ厳選スクリーニング
                  </div>
                  <div className="font-bold text-white line-clamp-1">
                    【Peatix・土木遺産】神田川・日本橋川の暗渠と江戸初期石垣クルーズ
                  </div>
                  <p className="text-[11px] text-slate-400 line-clamp-2">
                    商業観光では見られない地下河川と石垣刻印を土木史研究者と解剖。
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
