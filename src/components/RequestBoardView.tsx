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
  const [budget, setBudget] = useState<number | ''>(8000);
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
      userName: userName || '匿名旅行者',
      targetAnimeOrTheme: targetAnime,
      area: area || '全国',
      budget: Number(budget) || 8000,
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
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm mb-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-100 text-blue-800 border border-blue-200 text-xs font-bold mb-3">
            <Flame className="w-3.5 h-3.5 text-blue-600" />
            <span>{lang === 'ja' ? 'あなたの「行きたい！」をツアーに' : 'Crowdsourced Cultural Tours'}</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight mb-2">
            {t.requestBoard.title}
          </h2>
          <p className="text-slate-600 text-xs sm:text-sm max-w-xl leading-relaxed">
            {t.requestBoard.subtitle}
          </p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="px-6 py-3.5 rounded-2xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-sm shadow-md shadow-blue-500/20 flex items-center gap-2 cursor-pointer transition-all active:scale-95"
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
            className="bg-white rounded-3xl border border-slate-200 hover:border-blue-300 p-5 flex flex-col justify-between shadow-xs hover:shadow-md transition-all"
          >
            <div>
              {/* Category & Status */}
              <div className="flex items-center justify-between text-xs mb-3">
                <span className="font-bold text-blue-700 bg-blue-50 px-2.5 py-0.5 rounded-md border border-blue-100">
                  {req.area}
                </span>
                <span className="text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                  {lang === 'ja' ? '提案受付中' : 'Accepting Offers'}
                </span>
              </div>

              {/* Title */}
              <h3 className="font-bold text-slate-900 text-base mb-2 line-clamp-2 leading-snug">
                {req.title}
              </h3>

              {/* Target Topic Tag */}
              <div className="inline-block text-xs font-bold text-indigo-700 bg-indigo-50 border border-indigo-100 px-2.5 py-0.5 rounded-md mb-3">
                🎯 {req.targetAnimeOrTheme}
              </div>

              {/* Description */}
              <p className="text-xs sm:text-sm text-slate-600 line-clamp-3 mb-4 leading-relaxed">
                {req.details}
              </p>
            </div>

            {/* Request Meta Info */}
            <div className="space-y-3 pt-3 border-t border-slate-100 text-xs">
              <div className="flex items-center justify-between text-slate-500">
                <div className="flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5 text-blue-600" />
                  <span>希望日: {req.desiredDate}</span>
                </div>
                <div className="font-bold text-slate-800">
                  予算: <span className="text-blue-600 font-black">¥{req.budget.toLocaleString()}</span>
                </div>
              </div>

              <div className="flex items-center justify-between pt-1">
                <div className="text-[11px] text-slate-400">投稿者: {req.userName}</div>

                <div className="flex items-center gap-2">
                  {/* Upvote button */}
                  <button
                    onClick={() => onUpvoteRequest(req.id)}
                    className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-slate-50 hover:bg-blue-50 border border-slate-200 text-slate-700 hover:text-blue-700 transition-colors cursor-pointer text-xs font-bold"
                  >
                    <ThumbsUp className="w-3.5 h-3.5 text-blue-600" />
                    <span>+{req.upvotes}</span>
                  </button>

                  {/* Offers count */}
                  <div className="flex items-center gap-1 text-slate-600 text-xs bg-slate-50 px-2.5 py-1.5 rounded-xl border border-slate-200">
                    <MessageSquare className="w-3.5 h-3.5 text-blue-600" />
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
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="w-full max-w-lg bg-white border border-slate-200 rounded-3xl p-6 shadow-2xl relative">
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-4 right-4 p-2 rounded-xl bg-slate-50 text-slate-400 hover:text-slate-700 cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>

            <h3 className="text-lg font-bold text-slate-900 mb-1 flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-blue-600" />
              <span>{t.requestBoard.postModalTitle}</span>
            </h3>
            <p className="text-xs text-slate-500 mb-4">{t.requestBoard.subtitle}</p>

            {submittedMessage ? (
              <div className="text-center py-8 space-y-3">
                <CheckCircle2 className="w-12 h-12 text-emerald-600 mx-auto" />
                <h4 className="text-base font-bold text-slate-900">リクエストを投稿しました！</h4>
                <p className="text-xs text-slate-500">ガイドからのオリジナルツアー提案をお待ちください。</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-3.5">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    リクエスト件名 <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    placeholder="例: 【歴史】関ヶ原の合戦場を陣跡巡りしながら解説してほしい"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    required
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-blue-500 focus:bg-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    {t.requestBoard.targetAnime} <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    placeholder="例: 関ヶ原の戦い / 箱根登山鉄道 / 君の名は"
                    value={targetAnime}
                    onChange={(e) => setTargetAnime(e.target.value)}
                    required
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-blue-500 focus:bg-white"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">希望エリア</label>
                    <input
                      type="text"
                      placeholder="例: 岐阜・関ヶ原 / 神奈川・箱根"
                      value={area}
                      onChange={(e) => setArea(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-blue-500 focus:bg-white"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">希望予算（円）</label>
                    <input
                      type="number"
                      step="1"
                      min="0"
                      value={budget}
                      placeholder="8000"
                      onFocus={(e) => e.target.select()}
                      onChange={(e) => {
                        const val = e.target.value;
                        setBudget(val === '' ? '' : Number(val));
                      }}
                      onBlur={() => {
                        if (budget === '' || Number(budget) < 0) setBudget(8000);
                      }}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-blue-500 focus:bg-white"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    {t.requestBoard.details} <span className="text-rose-500">*</span>
                  </label>
                  <textarea
                    rows={3}
                    placeholder="行きたい場所や知りたいこと、どんな案内をしてほしいかを教えてください！"
                    value={details}
                    onChange={(e) => setDetails(e.target.value)}
                    required
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs text-slate-900 focus:outline-none focus:border-blue-500 focus:bg-white"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">投稿者名</label>
                    <input
                      type="text"
                      placeholder="ニックネーム"
                      value={userName}
                      onChange={(e) => setUserName(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-blue-500 focus:bg-white"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">希望日程</label>
                    <input
                      type="date"
                      value={desiredDate}
                      onChange={(e) => setDesiredDate(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-blue-500 focus:bg-white"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs sm:text-sm transition-colors cursor-pointer mt-2"
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
