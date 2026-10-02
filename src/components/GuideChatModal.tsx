import React, { useState, useRef, useEffect } from 'react';
import { X, Send, MessageSquare, Sparkles, CheckCircle2 } from 'lucide-react';
import type { TourGuide, Language, GuideChatMessage } from '../types';

interface GuideChatModalProps {
  guide: TourGuide;
  tourTitle: string;
  isOpen: boolean;
  onClose: () => void;
  lang: Language;
}

export const GuideChatModal: React.FC<GuideChatModalProps> = ({
  guide,
  tourTitle,
  isOpen,
  onClose,
  lang,
}) => {
  const [messages, setMessages] = useState<GuideChatMessage[]>(() => {
    return [
      {
        id: 'msg-init',
        sender: 'guide',
        text: lang === 'ja'
          ? `こんにちは！「${tourTitle}」の案内を担当する${guide.name}です（愛好歴${guide.otakuYears}年）。ツアーに関する疑問や、初心者でも大丈夫か、当日の服装・体力面など、どんな小さなことでも遠慮なくお尋ねください！`
          : `Hello! I'm ${guide.nameEn}, your guide for "${tourTitle}". Feel free to ask anything about fitness level, preparation, or tour details!`,
        timestamp: 'たった今',
      },
    ];
  });

  const [inputVal, setInputVal] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen, isTyping]);

  if (!isOpen) return null;

  // Preset quick questions for effortless inquiry
  const quickQuestions = lang === 'ja' ? [
    '初心者で前提知識が少ないのですが楽しめますか？',
    '一人での参加でも浮きませんか？',
    '雨天の場合は決行ですか？',
    '写真撮影や録音は可能ですか？',
  ] : [
    'Can beginners with little knowledge join and enjoy?',
    'Is it okay to join as a solo traveler?',
    'Will the tour run if it rains?',
    'Can I take photos during the tour?',
  ];

  // Automated intelligent guide response based on question
  const getGuideResponse = (query: string): string => {
    const q = query.toLowerCase();
    if (lang === 'ja') {
      if (q.includes('初心者') || q.includes('知識')) {
        return `大歓迎です！むしろ「詳しくないけれど面白そう」という方にこそ、この世界のディープな魅力をお伝えできるのが最高に嬉しいです。専門用語は噛み砕いて楽しく解説しますのでご安心ください！`;
      }
      if (q.includes('一人') || q.includes('ソロ') || q.includes('ひとり')) {
        return `実は参加者の約6割がお一人様です！同じテーマに興味を持つ仲間同士なので、ツアー開始10分で打ち解けて語り合える温かい雰囲気ですよ。全く心配いりません！`;
      }
      if (q.includes('雨') || q.includes('天気')) {
        return `小雨の場合はレインコートや傘で安全に催行いたします（雨ならではの情緒も最高です！）。台風等の荒天が予想される場合は前日18時までにご連絡し、全額返金または日程変更を承ります。`;
      }
      if (q.includes('写真') || q.includes('撮影')) {
        return `写真撮影は大歓迎です！SNS映えするベストアングルや、歴史ファン・聖地ファン垂涎の隠れスポットもご案内します。ただし一部の寺社仏閣や店舗内ではガイドの案内に従っていただければ幸いです。`;
      }
      return `ご質問ありがとうございます！${guide.name}です。事前のご相談をいただけてとても嬉しいです。ご希望に沿った解説や立ち寄りペースの調整も可能ですので、当日お会いできるのを心より楽しみにしております！`;
    } else {
      if (q.includes('beginner') || q.includes('knowledge')) {
        return `Beginners are warmly welcomed! In fact, we love introducing newcomers to this fascinating world. I explain everything clearly without overly complex jargon.`;
      }
      if (q.includes('solo') || q.includes('alone')) {
        return `Over 60% of our participants join solo! You'll quickly connect with other curious travelers. You will feel right at home!`;
      }
      return `Thank you for your question! I'm happy to help customize our pace and focus. Looking forward to exploring together!`;
    }
  };

  const handleSendMessage = (textToSend?: string) => {
    const text = (textToSend || inputVal).trim();
    if (!text) return;

    const userMsg: GuideChatMessage = {
      id: `msg-user-${Date.now()}`,
      sender: 'user',
      text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputVal('');
    setIsTyping(true);

    // Simulate guide typing and thoughtful response
    setTimeout(() => {
      const guideReplyText = getGuideResponse(text);
      const guideMsg: GuideChatMessage = {
        id: `msg-guide-${Date.now()}`,
        sender: 'guide',
        text: guideReplyText,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, guideMsg]);
      setIsTyping(false);
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-md">
      <div 
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-xl bg-white rounded-3xl border border-slate-200 shadow-2xl overflow-hidden flex flex-col h-[600px] max-h-[90vh] animate-in fade-in zoom-in-95 duration-200"
      >
        {/* Chat Header */}
        <div className="p-4 bg-gradient-to-r from-slate-900 to-blue-950 text-white flex items-center justify-between shadow-md">
          <div className="flex items-center gap-3">
            <div className="relative">
              <img
                src={guide.avatar}
                alt={guide.name}
                className="w-11 h-11 rounded-full object-cover border-2 border-white/80 shadow-xs"
              />
              <span className="absolute bottom-0 right-0 w-3.5 h-3.5 rounded-full bg-emerald-500 border-2 border-slate-900" />
            </div>

            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-sm sm:text-base text-white">
                  {lang === 'ja' ? guide.name : guide.nameEn}
                </h3>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-blue-500/30 text-blue-200 border border-blue-400/40">
                  愛好歴{guide.otakuYears}年
                </span>
              </div>
              <div className="flex items-center gap-1.5 text-[11px] text-emerald-400">
                <CheckCircle2 className="w-3 h-3" />
                <span>{lang === 'ja' ? 'オンライン（通常10分以内に返答）' : 'Online (Replies quickly)'}</span>
              </div>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-white/10 text-slate-300 hover:text-white transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tour context strip */}
        <div className="bg-blue-50 px-4 py-2 border-b border-blue-100 flex items-center gap-2 text-xs text-blue-900">
          <Sparkles className="w-3.5 h-3.5 text-blue-600 flex-shrink-0" />
          <span className="font-bold truncate">{tourTitle}</span>
        </div>

        {/* Message Timeline */}
        <div className="flex-1 p-4 overflow-y-auto space-y-3 bg-slate-50">
          {messages.map((msg) => {
            const isGuide = msg.sender === 'guide';
            return (
              <div
                key={msg.id}
                className={`flex gap-2.5 ${isGuide ? 'justify-start' : 'justify-end'}`}
              >
                {isGuide && (
                  <img
                    src={guide.avatar}
                    alt={guide.name}
                    className="w-7 h-7 rounded-full object-cover border border-slate-200 flex-shrink-0 mt-1"
                  />
                )}

                <div className={`max-w-[80%] space-y-1`}>
                  <div
                    className={`p-3.5 rounded-2xl text-xs sm:text-sm leading-relaxed ${
                      isGuide
                        ? 'bg-white text-slate-800 border border-slate-200 shadow-xs rounded-tl-sm'
                        : 'bg-blue-600 text-white shadow-xs rounded-tr-sm'
                    }`}
                  >
                    {msg.text}
                  </div>
                  <div className={`text-[10px] text-slate-400 px-1 ${isGuide ? 'text-left' : 'text-right'}`}>
                    {msg.timestamp}
                  </div>
                </div>
              </div>
            );
          })}

          {/* Typing indicator */}
          {isTyping && (
            <div className="flex gap-2.5 items-center">
              <img
                src={guide.avatar}
                alt={guide.name}
                className="w-7 h-7 rounded-full object-cover border border-slate-200"
              />
              <div className="bg-white px-4 py-2.5 rounded-2xl border border-slate-200 rounded-tl-sm flex items-center gap-1.5 shadow-xs">
                <span className="w-2 h-2 rounded-full bg-slate-400 animate-bounce" />
                <span className="w-2 h-2 rounded-full bg-slate-400 animate-bounce [animation-delay:0.2s]" />
                <span className="w-2 h-2 rounded-full bg-slate-400 animate-bounce [animation-delay:0.4s]" />
                <span className="text-[11px] text-slate-400 ml-1 font-medium">ガイドが入力中...</span>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Quick Suggestion Chips */}
        <div className="p-2.5 bg-white border-t border-slate-100 flex items-center gap-1.5 overflow-x-auto no-scrollbar">
          <span className="text-[11px] font-bold text-slate-400 flex-shrink-0 pl-1 flex items-center gap-1">
            <MessageSquare className="w-3 h-3" />
            定型質問:
          </span>
          {quickQuestions.map((q, idx) => (
            <button
              key={idx}
              onClick={() => handleSendMessage(q)}
              className="text-[11px] px-2.5 py-1 rounded-full bg-slate-100 hover:bg-blue-50 hover:text-blue-600 text-slate-700 whitespace-nowrap transition-colors border border-slate-200 cursor-pointer font-medium flex-shrink-0"
            >
              {q}
            </button>
          ))}
        </div>

        {/* Input Bar */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSendMessage();
          }}
          className="p-3 bg-white border-t border-slate-200 flex items-center gap-2"
        >
          <input
            type="text"
            value={inputVal}
            onChange={(e) => setInputVal(e.target.value)}
            placeholder={lang === 'ja' ? 'ガイドへ質問・相談内容を入力...' : 'Ask the guide anything...'}
            className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-500 focus:bg-white"
          />
          <button
            type="submit"
            disabled={!inputVal.trim() || isTyping}
            className="p-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold transition-colors cursor-pointer shadow-xs disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
};
