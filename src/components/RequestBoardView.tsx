import React, { useState } from 'react';
import { 
  PlusCircle, 
  ThumbsUp, 
  MessageSquare, 
  Calendar, 
  Flame, 
  Sparkles, 
  X, 
  CheckCircle2 
} from 'lucide-react';
import type { TourRequest, Language } from '../types';
import { translations } from '../i18n/translations';

interface RequestBoardViewProps {
  lang: Language;
  requests: TourRequest[];
  onAddRequest: (req: Omit<TourRequest, 'id' | 'upvotes' | 'offersCount' | 'status' | 'createdAt'>) => void;
  onUpvoteRequest: (id: string) => void;
}

export const RequestBoardView: React.FC<RequestBoardViewProps> = ({
  lang,
  requests,
  onAddRequest,
  onUpvoteRequest,
}) => {
  const t = translations[lang];

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [targetAnime, setTargetAnime] = useState('');
  const [area, setArea] = useState('');
  const [budget, setBudget] = useState(7000);
  const [details, setDetails] = useState('');
  const [userName, setUserName] = useState('');
  const [desiredDate, setDesiredDate] = useState(() => {
    const d = new Date();
    d.setDate(d.getDate() + 14);
    return d.toISOString().split('T')[0];
  });
  const [submittedMessage, setSubmittedMessage] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !targetAnime || !details) return;

    onAddRequest({
      title,
      userName: userName || '匿名オタク',
      targetAnimeOrTheme: targetAnime,
      area: area || '秋葉原・都内近郊',
      budget: Number(budget),
      details,
      desiredDate,
    });

    setTitle('');
    setTargetAnime('');
    setArea('');
    setDetails('');
    setSubmittedMessage(true);
    setTimeout(() => {
      setSubmittedMessage(false);
      setIsModalOpen(false);
    }, 1500);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-purple-950/80 via-slate-900 to-slate-950 p-6 sm:p-8 rounded-3xl border border-purple-500/30 mb-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-pink-950/60 border border-pink-500/40 text-pink-300 text-xs font-semibold mb-3">
            <Flame className="w-3.5 h-3.5" />
            <span>{lang === 'ja' ? 'オタクの「行きたい」をカタチに' : 'Crowdsourced Otaku Tours'}</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight mb-2">
            {t.requestBoard.title}
          </h2>
          <p className="text-slate-300 text-xs sm:text-sm max-w-xl leading-relaxed">
            {t.requestBoard.subtitle}
          </p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="px-6 py-3.5 rounded-2xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-bold text-sm shadow-xl shadow-cyan-500/25 flex items-center gap-2 cursor-pointer transition-all active:scale-95"
        >
          <PlusCircle className="w-4 h-4" />
          <span>{t.requestBoard.postRequest}</span>
        </button>
      </div>

      {/* Requests Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {requests.map((req) => (
          <div
            key={req.id}
            className="bg-slate-900/90 rounded-2xl border border-slate-800 hover:border-slate-700 p-5 flex flex-col justify-between transition-all"
          >
            <div>
              {/* Category & Status */}
              <div className="flex items-center justify-between text-xs mb-3">
                <span className="font-semibold text-cyan-400 bg-cyan-950/80 px-2.5 py-0.5 rounded-md border border-cyan-500/30">
                  {req.area}
                </span>
                <span className="text-emerald-400 font-bold bg-emerald-950/60 px-2 py-0.5 rounded-md border border-emerald-500/30">
                  {lang === 'ja' ? 'ガイド募集中' : 'Guide Wanted'}
                </span>
              </div>

              {/* Title */}
              <h3 className="font-bold text-white text-base mb-2 line-clamp-2 leading-snug">
                {req.title}
              </h3>

              {/* Target Anime Tag */}
              <div className="inline-block text-xs font-medium text-pink-300 bg-pink-950/40 border border-pink-500/20 px-2 py-0.5 rounded-md mb-3">
                🎯 {req.targetAnimeOrTheme}
              </div>

              {/* Description */}
              <p className="text-xs sm:text-sm text-slate-300 line-clamp-3 mb-4 leading-relaxed">
                {req.details}
              </p>
            </div>

            {/* Request Meta Info */}
            <div className="space-y-3 pt-3 border-t border-slate-800 text-xs">
              <div className="flex items-center justify-between text-slate-400">
                <div className="flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5 text-purple-400" />
                  <span>希望日: {req.desiredDate}</span>
                </div>
                <div className="font-bold text-white">
                  予算: <span className="text-cyan-400">¥{req.budget.toLocaleString()}</span>
                </div>
              </div>

              <div className="flex items-center justify-between pt-1">
                <div className="text-[11px] text-slate-500">投稿者: {req.userName}</div>

                <div className="flex items-center gap-2">
                  {/* Upvote button */}
                  <button
                    onClick={() => onUpvoteRequest(req.id)}
                    className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-purple-950/80 hover:bg-purple-900 border border-purple-500/40 text-purple-300 hover:text-white transition-colors cursor-pointer text-xs font-bold"
                  >
                    <ThumbsUp className="w-3.5 h-3.5" />
                    <span>+{req.upvotes}</span>
                  </button>

                  {/* Offers count */}
                  <div className="flex items-center gap-1 text-slate-400 text-xs bg-slate-950 px-2.5 py-1.5 rounded-xl border border-slate-800">
                    <MessageSquare className="w-3.5 h-3.5 text-cyan-400" />
                    <span>{req.offersCount}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Post Request Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
          <div className="w-full max-w-lg bg-slate-900 border border-slate-700 rounded-3xl p-6 shadow-2xl relative">
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-4 right-4 p-2 rounded-xl bg-slate-950 text-slate-400 hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>

            <h3 className="text-lg font-bold text-white mb-1 flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-cyan-400" />
              <span>{t.requestBoard.postModalTitle}</span>
            </h3>
            <p className="text-xs text-slate-400 mb-4">{t.requestBoard.subtitle}</p>

            {submittedMessage ? (
              <div className="text-center py-8 space-y-3">
                <CheckCircle2 className="w-12 h-12 text-emerald-400 mx-auto" />
                <h4 className="text-base font-bold text-white">リクエストを投稿しました！</h4>
                <p className="text-xs text-slate-400">オタクガイドからの提案をお待ちください。</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-3.5">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    リクエスト件名 <span className="text-pink-400">*</span>
                  </label>
                  <input
                    type="text"
                    placeholder="例: 『ガールズ＆パンツァー』大洗町まるごと戦車道ツアー希望"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    required
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    {t.requestBoard.targetAnime} <span className="text-pink-400">*</span>
                  </label>
                  <input
                    type="text"
                    placeholder="例: ガルパン / 大洗の聖地店舗"
                    value={targetAnime}
                    onChange={(e) => setTargetAnime(e.target.value)}
                    required
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">希望エリア</label>
                    <input
                      type="text"
                      placeholder="例: 茨城・大洗 / 秋葉原"
                      value={area}
                      onChange={(e) => setArea(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">希望予算（円）</label>
                    <input
                      type="number"
                      step="500"
                      value={budget}
                      onChange={(e) => setBudget(Number(e.target.value))}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    {t.requestBoard.details} <span className="text-pink-400">*</span>
                  </label>
                  <textarea
                    rows={3}
                    placeholder="行きたいスポットや、どんな体験がしたいかを教えてください！"
                    value={details}
                    onChange={(e) => setDetails(e.target.value)}
                    required
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-xs text-white"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">投稿者名</label>
                    <input
                      type="text"
                      placeholder="ニックネーム"
                      value={userName}
                      onChange={(e) => setUserName(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">希望日程</label>
                    <input
                      type="date"
                      value={desiredDate}
                      onChange={(e) => setDesiredDate(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full py-3 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs sm:text-sm transition-colors cursor-pointer mt-2"
                >
                  {t.requestBoard.submit}
                </button>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
