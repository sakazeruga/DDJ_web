import React, { useState, useMemo } from 'react';
import { 
  Radio, 
  ExternalLink, 
  Sparkles, 
  CheckCircle2, 
  GraduationCap, 
  Send, 
  Search, 
  PlusCircle, 
  X,
  MapPin,
  Calendar
} from 'lucide-react';
import confetti from 'canvas-confetti';
import type { CuratedAntennaTour, Language } from '../types';

interface TourAntennaSectionProps {
  lang: Language;
  antennaTours: CuratedAntennaTour[];
  onSuggestTour?: (suggestion: { title: string; url: string; reason: string; email?: string }) => void;
}

export const TourAntennaSection: React.FC<TourAntennaSectionProps> = ({
  lang,
  antennaTours,
  onSuggestTour,
}) => {
  const [filterSource, setFilterSource] = useState<string>('all');
  const [onlyGlobis, setOnlyGlobis] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Suggest Tour Modal state
  const [isSuggestModalOpen, setIsSuggestModalOpen] = useState(false);
  const [suggestTitle, setSuggestTitle] = useState('');
  const [suggestUrl, setSuggestUrl] = useState('');
  const [suggestReason, setSuggestReason] = useState('');
  const [suggestEmail, setSuggestEmail] = useState('');
  const [suggestSubmitted, setSuggestSubmitted] = useState(false);

  // Filtered antenna tours
  const filteredTours = useMemo(() => {
    return antennaTours.filter((tour) => {
      if (filterSource !== 'all' && tour.sourcePlatform !== filterSource) return false;
      if (onlyGlobis && !tour.isGlobisRecommended) return false;
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchTitle = tour.title.toLowerCase().includes(q) || tour.titleEn.toLowerCase().includes(q);
        const matchArea = tour.area.toLowerCase().includes(q);
        const matchReason = tour.screeningReason.toLowerCase().includes(q);
        const matchTag = tour.tags.some((t) => t.toLowerCase().includes(q));
        if (!matchTitle && !matchArea && !matchReason && !matchTag) return false;
      }
      return true;
    });
  }, [antennaTours, filterSource, onlyGlobis, searchQuery]);

  const handleSuggestSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!suggestTitle.trim() || !suggestUrl.trim()) return;

    if (onSuggestTour) {
      onSuggestTour({
        title: suggestTitle,
        url: suggestUrl,
        reason: suggestReason,
        email: suggestEmail,
      });
    }

    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.5 },
      colors: ['#2563eb', '#10b981', '#f59e0b'],
    });

    setSuggestSubmitted(true);
    setTimeout(() => {
      setSuggestSubmitted(false);
      setIsSuggestModalOpen(false);
      setSuggestTitle('');
      setSuggestUrl('');
      setSuggestReason('');
      setSuggestEmail('');
    }, 2500);
  };

  return (
    <div id="antenna-section" className="scroll-mt-20 py-10 sm:py-14 border-t border-slate-200 bg-gradient-to-b from-slate-100/70 via-slate-50 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-100 text-indigo-900 border border-indigo-200 text-xs font-bold mb-2">
              <Radio className="w-3.5 h-3.5 text-indigo-600 animate-pulse" />
              <span>{lang === 'ja' ? '全国のディープツアー自動スクリーニング' : 'External Curated Tour Radar'}</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              {lang === 'ja' ? '📡 偏愛ツアー情報アンテナ' : '📡 Cult Tour Antenna & Radar'}
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 mt-1 max-w-2xl leading-relaxed">
              {lang === 'ja'
                ? 'Peatix、note、有志団体、学会等の膨大なイベントから、DDJの「マニア熱量・知的好奇心・独自性」基準でスクリーニングした外部オタクツアーを収集・紹介。Globis生のフィールドワークや企画ヒントにも活用できます。'
                : 'Curated external niche tours from Peatix, note, and research societies, screened by DDJ for authenticity and intellectual depth.'}
            </p>
          </div>

          {/* Suggest Tour CTA */}
          <button
            onClick={() => setIsSuggestModalOpen(true)}
            className="self-start md:self-auto min-h-[44px] flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white hover:bg-slate-50 border border-slate-300 text-slate-800 text-xs sm:text-sm font-bold shadow-xs hover:border-blue-500 transition-all cursor-pointer active:scale-95"
          >
            <PlusCircle className="w-4 h-4 text-indigo-600" />
            <span>{lang === 'ja' ? '面白いツアーをタレコミ・推薦する' : 'Suggest an Event'}</span>
          </button>
        </div>

        {/* Filter & Search Bar */}
        <div className="bg-white p-3.5 sm:p-4 rounded-2xl border border-slate-200 shadow-xs flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
          {/* Search Box */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={lang === 'ja' ? '土木遺産、水運、秋葉原、廃線、事業承継...' : 'Search civil heritage, railways, business cases...'}
              className="w-full pl-9 pr-3 py-2 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-blue-500 focus:bg-white font-medium"
            />
          </div>

          {/* Source Tabs & Globis Filter */}
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs font-bold text-slate-500 mr-1 hidden sm:inline">ソース:</span>
            {['all', 'Peatix', 'note', '有志団体', '地域公式'].map((src) => (
              <button
                key={src}
                onClick={() => setFilterSource(src)}
                className={`min-h-[36px] px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  filterSource === src
                    ? 'bg-slate-900 text-white shadow-xs'
                    : 'bg-slate-100 hover:bg-slate-200 text-slate-600'
                }`}
              >
                {src === 'all' ? (lang === 'ja' ? 'すべて' : 'All') : src}
              </button>
            ))}

            {/* Globis Filter Toggle */}
            <button
              onClick={() => setOnlyGlobis((prev) => !prev)}
              className={`min-h-[36px] flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer border ${
                onlyGlobis
                  ? 'bg-indigo-600 text-white border-indigo-600 shadow-xs'
                  : 'bg-indigo-50/70 hover:bg-indigo-100 text-indigo-900 border-indigo-200'
              }`}
            >
              <GraduationCap className="w-3.5 h-3.5" />
              <span>{lang === 'ja' ? '🎓 Globis生おすすめのみ' : 'MBA Recommended'}</span>
            </button>
          </div>
        </div>

        {/* Antenna Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTours.map((item) => (
            <div
              key={item.id}
              className="bg-white rounded-3xl border border-slate-200 shadow-xs hover:shadow-xl transition-all duration-300 flex flex-col overflow-hidden group"
            >
              {/* Photo & Source Header */}
              <div className="relative aspect-[16/9] bg-slate-100 overflow-hidden">
                <img
                  src={item.imageUrl}
                  alt={item.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-transparent" />

                {/* Source Badge */}
                <div className="absolute top-3 left-3 flex items-center gap-1.5">
                  <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-white/95 text-slate-900 shadow-sm border border-slate-200 backdrop-blur-md flex items-center gap-1">
                    <Radio className="w-3 h-3 text-indigo-600" />
                    <span>{item.sourcePlatform}</span>
                  </span>
                  {item.isGlobisRecommended && (
                    <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-indigo-600 text-white shadow-sm flex items-center gap-1">
                      <GraduationCap className="w-3 h-3" />
                      <span>Globis推奨</span>
                    </span>
                  )}
                </div>

                {/* Screening Score Pill */}
                <div className="absolute top-3 right-3 bg-amber-400 text-slate-950 font-black text-xs px-2.5 py-1 rounded-full shadow-md flex items-center gap-1">
                  <Sparkles className="w-3 h-3" />
                  <span>DDJ熱量 {item.screeningScore}点</span>
                </div>

                {/* Area & Date */}
                <div className="absolute bottom-2.5 left-3 right-3 flex items-center justify-between text-xs text-white font-medium">
                  <div className="flex items-center gap-1 bg-slate-900/80 backdrop-blur-md px-2 py-0.5 rounded-lg text-[11px]">
                    <MapPin className="w-3 h-3 text-rose-400" />
                    <span className="truncate max-w-[140px]">{item.area}</span>
                  </div>
                  <div className="flex items-center gap-1 bg-slate-900/80 backdrop-blur-md px-2 py-0.5 rounded-lg text-[11px]">
                    <Calendar className="w-3 h-3 text-sky-400" />
                    <span className="truncate">{item.date.split(' ')[0]}</span>
                  </div>
                </div>
              </div>

              {/* Body */}
              <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between space-y-3.5">
                <div className="space-y-2">
                  <div className="text-[11px] text-slate-500 font-bold truncate">
                    主催・企画: {item.organizer}
                  </div>

                  <h3 className="font-bold text-base text-slate-900 group-hover:text-indigo-600 transition-colors line-clamp-2 leading-snug">
                    {lang === 'ja' ? item.title : item.titleEn}
                  </h3>

                  {/* DDJ Screening Reason (The Key Differentiator!) */}
                  <div className="p-3 rounded-2xl bg-indigo-50/60 border border-indigo-100 text-xs text-indigo-950 space-y-1">
                    <div className="flex items-center gap-1 font-bold text-[11px] text-indigo-700">
                      <CheckCircle2 className="w-3.5 h-3.5 text-indigo-600" />
                      <span>DDJ偏愛スクリーニング厳選理由:</span>
                    </div>
                    <p className="text-[11px] leading-relaxed text-slate-700 line-clamp-3">
                      {item.screeningReason}
                    </p>
                  </div>

                  {/* Tags */}
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {item.tags.map((tag) => (
                      <span
                        key={tag}
                        className="text-[10px] font-medium px-2 py-0.5 rounded-md bg-slate-100 text-slate-600"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Footer Actions */}
                <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                  <div className="text-left">
                    <div className="text-[10px] text-slate-400 font-medium">参加費目安</div>
                    <div className="text-sm font-black text-slate-900">{item.priceText}</div>
                  </div>

                  {/* Jump External Link Button */}
                  <a
                    href={item.sourceUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="min-h-[44px] px-4 py-2 rounded-xl bg-slate-900 hover:bg-indigo-600 text-white font-bold text-xs shadow-xs transition-all flex items-center gap-1.5 cursor-pointer active:scale-95"
                  >
                    <span>{item.sourcePlatform}で詳細</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Suggest Modal */}
        {isSuggestModalOpen && (
          <div
            onClick={() => setIsSuggestModalOpen(false)}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-md cursor-pointer"
          >
            <div
              onClick={(e) => e.stopPropagation()}
              className="relative w-full max-w-lg bg-white rounded-3xl border border-slate-200 shadow-2xl overflow-hidden p-6 text-slate-900 space-y-4 cursor-default animate-in fade-in zoom-in-95 duration-200"
            >
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div className="flex items-center gap-2">
                  <div className="w-9 h-9 rounded-xl bg-indigo-600 text-white flex items-center justify-center shadow-md shadow-indigo-500/20">
                    <Radio className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-base font-black text-slate-900 leading-tight">
                      📡 オタクツアー・探訪イベントを推薦
                    </h3>
                    <p className="text-[11px] text-slate-500">
                      見つけた面白い街歩き・フィールドワーク情報を教えてください！
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setIsSuggestModalOpen(false)}
                  className="w-9 h-9 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {suggestSubmitted ? (
                <div className="text-center py-8 space-y-3">
                  <div className="w-14 h-14 mx-auto rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center">
                    <CheckCircle2 className="w-7 h-7" />
                  </div>
                  <h4 className="text-base font-black text-slate-900">推薦ありがとうございます！</h4>
                  <p className="text-xs text-slate-600 leading-relaxed max-w-xs mx-auto">
                    運営で偏愛スクリーニングを行い、基準を満たしたツアーはアンテナ欄へ掲載いたします。
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSuggestSubmit} className="space-y-3.5">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      ツアー・イベントのタイトル *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="例: 旧東海道の消えた宿場町と近代土木遺産ウォーク"
                      value={suggestTitle}
                      onChange={(e) => setSuggestTitle(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs sm:text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-indigo-500 focus:bg-white"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      掲載ページURL（Peatix、note、公式HPなど） *
                    </label>
                    <input
                      type="url"
                      required
                      placeholder="https://peatix.com/..."
                      value={suggestUrl}
                      onChange={(e) => setSuggestUrl(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs sm:text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-indigo-500 focus:bg-white"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      推薦理由・マニアック熱量ポイント
                    </label>
                    <textarea
                      rows={2}
                      placeholder="例: 一般の観光では入れない旧地下トンネルを元技師の解説で歩ける点が最高です"
                      value={suggestReason}
                      onChange={(e) => setSuggestReason(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-indigo-500 focus:bg-white"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      あなたのメールアドレス（任意・掲載時連絡用）
                    </label>
                    <input
                      type="email"
                      placeholder="you@example.com"
                      value={suggestEmail}
                      onChange={(e) => setSuggestEmail(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-indigo-500 focus:bg-white"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full min-h-[46px] rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs sm:text-sm shadow-md shadow-indigo-600/30 transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-95"
                  >
                    <Send className="w-4 h-4" />
                    <span>アンテナ掲載を推薦する</span>
                  </button>
                </form>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
