import React, { useState, useRef } from 'react';
import { X, Share2, Download, Copy, Check, Sparkles, MapPin, Clock, Flame, Ticket } from 'lucide-react';
import type { Tour, Language } from '../types';

interface ShioriShareModalProps {
  tour: Tour;
  isOpen: boolean;
  onClose: () => void;
  lang: Language;
}

export const ShioriShareModal: React.FC<ShioriShareModalProps> = ({
  tour,
  isOpen,
  onClose,
  lang,
}) => {
  const [copied, setCopied] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  if (!isOpen) return null;

  const currentUrl = typeof window !== 'undefined' ? window.location.href : 'https://ddj-web.vercel.app';
  const shareText = lang === 'ja'
    ? `【DEEP DIVE JAPAN 旅のしおり】\n「${tour.title}」\n愛好歴${tour.guide.otakuYears}年のガイドと巡る日本の偏愛カルチャーツアー！\n熱量Lv.${tour.otakuLevel} 🔥\n\n#DeepDiveJapan #偏愛カルチャーツアー #聖地巡礼 #日本探訪`
    : `【DEEP DIVE JAPAN Travel Pass】\n"${tour.titleEn}"\nExplore Japan's deep subcultures with local connoisseur guides! Passion Lv.${tour.otakuLevel} 🔥\n\n#DeepDiveJapan #JapanTravel #Subculture`;

  // Handle Twitter / X Share
  const handleShareX = () => {
    const url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(currentUrl)}`;
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  // Handle Copy Link
  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(`${shareText}\n${currentUrl}`);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      alert(lang === 'ja' ? 'URLをコピーしました' : 'Link copied');
    }
  };

  // Generate and Download Canvas Image
  const handleDownloadTicketImage = () => {
    setIsGenerating(true);
    const canvas = document.createElement('canvas');
    canvas.width = 1200;
    canvas.height = 630;
    const ctx = canvas.getContext('2d');
    if (!ctx) {
      setIsGenerating(false);
      return;
    }

    // 1. Modern Deep Slate Background
    const bgGrad = ctx.createLinearGradient(0, 0, 1200, 630);
    bgGrad.addColorStop(0, '#090d16');
    bgGrad.addColorStop(0.5, '#0f172a');
    bgGrad.addColorStop(1, '#1e1b4b');
    ctx.fillStyle = bgGrad;
    ctx.fillRect(0, 0, 1200, 630);

    // Subtle Grid pattern
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.04)';
    ctx.lineWidth = 1;
    for (let x = 0; x < 1200; x += 40) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, 630);
      ctx.stroke();
    }
    for (let y = 0; y < 630; y += 40) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(1200, y);
      ctx.stroke();
    }

    // 2. Ticket Outer Box
    const ticketX = 70;
    const ticketY = 50;
    const ticketW = 1060;
    const ticketH = 530;
    const radius = 24;

    ctx.save();
    ctx.shadowColor = 'rgba(0, 0, 0, 0.5)';
    ctx.shadowBlur = 40;
    ctx.shadowOffsetY = 20;

    // Draw ticket base
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.roundRect(ticketX, ticketY, ticketW, ticketH, radius);
    ctx.fill();
    ctx.restore();

    // 3. Ticket Header Strip
    const headerH = 70;
    const headerGrad = ctx.createLinearGradient(ticketX, ticketY, ticketX + ticketW, ticketY);
    headerGrad.addColorStop(0, '#2563eb');
    headerGrad.addColorStop(1, '#4f46e5');
    ctx.fillStyle = headerGrad;
    ctx.beginPath();
    ctx.roundRect(ticketX, ticketY, ticketW, headerH, [radius, radius, 0, 0]);
    ctx.fill();

    // Brand on Header
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 20px -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif';
    ctx.fillText('DEEP DIVE JAPAN ｜ OFFICIAL TRAVEL PASS', ticketX + 32, ticketY + 42);

    ctx.font = 'bold 15px -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif';
    ctx.fillStyle = '#cbd5e1';
    ctx.fillText(`PASS #${tour.id.toUpperCase()}-VERIFIED`, ticketX + ticketW - 250, ticketY + 42);

    // 4. Ticket Perforation Notch (Ticket Cutter Notch)
    const notchX = ticketX + 740;
    // Top notch
    ctx.fillStyle = '#0f172a';
    ctx.beginPath();
    ctx.arc(notchX, ticketY, 18, 0, Math.PI);
    ctx.fill();
    // Bottom notch
    ctx.beginPath();
    ctx.arc(notchX, ticketY + ticketH, 18, Math.PI, 0);
    ctx.fill();

    // Perforation line
    ctx.strokeStyle = '#cbd5e1';
    ctx.lineWidth = 3;
    ctx.setLineDash([8, 8]);
    ctx.beginPath();
    ctx.moveTo(notchX, ticketY + 20);
    ctx.lineTo(notchX, ticketY + ticketH - 20);
    ctx.stroke();
    ctx.setLineDash([]); // Reset line dash

    // 5. Left Side Content (Main Ticket)
    // Area & Level Badges
    ctx.fillStyle = '#eff6ff';
    ctx.beginPath();
    ctx.roundRect(ticketX + 32, ticketY + 100, 130, 32, 8);
    ctx.fill();
    ctx.fillStyle = '#1d4ed8';
    ctx.font = 'bold 14px -apple-system, BlinkMacSystemFont, sans-serif';
    ctx.fillText(`📍 ${tour.area.split(' ')[0]}`, ticketX + 44, ticketY + 122);

    ctx.fillStyle = '#fef2f2';
    ctx.beginPath();
    ctx.roundRect(ticketX + 175, ticketY + 100, 130, 32, 8);
    ctx.fill();
    ctx.fillStyle = '#b91c1c';
    ctx.fillText(`🔥 Lv.${tour.otakuLevel} 熱量`, ticketX + 187, ticketY + 122);

    ctx.fillStyle = '#f8fafc';
    ctx.beginPath();
    ctx.roundRect(ticketX + 318, ticketY + 100, 110, 32, 8);
    ctx.fill();
    ctx.fillStyle = '#475569';
    ctx.fillText(`⏱️ ${tour.durationHours}時間`, ticketX + 330, ticketY + 122);

    // Tour Title (Wrap into 2 lines if needed)
    ctx.fillStyle = '#0f172a';
    ctx.font = 'bold 26px -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif';
    const titleText = tour.title;
    if (titleText.length > 25) {
      ctx.fillText(titleText.slice(0, 25), ticketX + 32, ticketY + 175);
      ctx.fillText(titleText.slice(25, 50) + (titleText.length > 50 ? '...' : ''), ticketX + 32, ticketY + 212);
    } else {
      ctx.fillText(titleText, ticketX + 32, ticketY + 185);
    }

    // Catchphrase
    ctx.fillStyle = '#64748b';
    ctx.font = '16px -apple-system, BlinkMacSystemFont, sans-serif';
    ctx.fillText(tour.catchphrase.slice(0, 42) + '...', ticketX + 32, ticketY + 260);

    // Guide Information
    ctx.fillStyle = '#f8fafc';
    ctx.beginPath();
    ctx.roundRect(ticketX + 32, ticketY + 295, 660, 90, 16);
    ctx.fill();
    ctx.strokeStyle = '#e2e8f0';
    ctx.lineWidth = 1;
    ctx.stroke();

    ctx.fillStyle = '#1e293b';
    ctx.font = 'bold 17px -apple-system, BlinkMacSystemFont, sans-serif';
    ctx.fillText(`同行ガイド: ${tour.guide.name}`, ticketX + 52, ticketY + 335);

    ctx.fillStyle = '#2563eb';
    ctx.font = 'bold 14px -apple-system, BlinkMacSystemFont, sans-serif';
    ctx.fillText(`愛好歴 ${tour.guide.otakuYears}年 ｜ ${tour.guide.specialties.slice(0, 2).join('・')}`, ticketX + 52, ticketY + 363);

    // Itinerary preview tags
    ctx.fillStyle = '#475569';
    ctx.font = '13px -apple-system, BlinkMacSystemFont, sans-serif';
    const spotsText = '巡回ルート: ' + tour.itinerary.map((i) => i.spotTitle.split('・')[0]).slice(0, 3).join(' ➔ ') + ' ...';
    ctx.fillText(spotsText.slice(0, 50), ticketX + 32, ticketY + 430);

    // Hashtags
    ctx.fillStyle = '#94a3b8';
    ctx.font = 'bold 13px -apple-system, BlinkMacSystemFont, sans-serif';
    ctx.fillText('#DeepDiveJapan #偏愛カルチャーツアー #公式パス', ticketX + 32, ticketY + 485);

    // 6. Right Side Content (Stub / Stamp & Barcode)
    const stubX = notchX + 30;

    // Official Stamp (Red Round Stamp)
    ctx.save();
    ctx.translate(stubX + 115, ticketY + 180);
    ctx.rotate(-0.15); // Slight tilt for authentic stamp effect
    ctx.strokeStyle = '#dc2626';
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.arc(0, 0, 70, 0, Math.PI * 2);
    ctx.stroke();

    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.arc(0, 0, 62, 0, Math.PI * 2);
    ctx.stroke();

    ctx.fillStyle = '#dc2626';
    ctx.font = 'bold 15px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('偏愛探訪公認', 0, -25);
    ctx.font = 'bold 18px sans-serif';
    ctx.fillText('DEEP DIVE', 0, 5);
    ctx.font = 'bold 13px sans-serif';
    ctx.fillText('JAPAN AUTH', 0, 30);
    ctx.restore();

    // Stub Details
    ctx.textAlign = 'center';
    ctx.fillStyle = '#0f172a';
    ctx.font = 'bold 22px -apple-system, BlinkMacSystemFont, sans-serif';
    ctx.fillText(`¥${tour.price.toLocaleString()}`, stubX + 115, ticketY + 330);
    ctx.fillStyle = '#64748b';
    ctx.font = '12px sans-serif';
    ctx.fillText('/ 1名参加費', stubX + 115, ticketY + 350);

    // Fake Barcode lines
    const barcodeY = ticketY + 390;
    const barcodeW = 200;
    const barcodeStartX = stubX + 15;
    ctx.fillStyle = '#0f172a';
    const barWidths = [3, 1, 4, 2, 1, 3, 2, 4, 1, 2, 4, 1, 3, 2, 1, 4, 2, 3, 1, 2, 3, 1, 4];
    let curX = barcodeStartX;
    for (const bw of barWidths) {
      ctx.fillRect(curX, barcodeY, bw, 50);
      curX += bw + 3;
      if (curX > barcodeStartX + barcodeW) break;
    }

    ctx.font = '10px monospace';
    ctx.fillStyle = '#94a3b8';
    ctx.fillText(`DDJ-${tour.id.toUpperCase()}-2026`, stubX + 115, ticketY + 465);

    // Convert canvas to download link
    const dataUrl = canvas.toDataURL('image/png');
    const link = document.createElement('a');
    link.download = `DDJ-TravelPass-${tour.id}.png`;
    link.href = dataUrl;
    link.click();
    setIsGenerating(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-md overflow-y-auto">
      <div 
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-2xl bg-white rounded-3xl border border-slate-200 shadow-2xl overflow-hidden my-8 animate-in fade-in zoom-in-95 duration-200"
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 bg-slate-50">
          <div className="flex items-center gap-2">
            <Ticket className="w-5 h-5 text-blue-600" />
            <h3 className="font-black text-slate-900 text-base sm:text-lg">
              {lang === 'ja' ? '🎫 旅のしおり（SNSシェアカード）' : '🎫 Travel Pass Share Card'}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-slate-200 text-slate-500 hover:text-slate-900 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body: Ticket Preview */}
        <div className="p-6 space-y-6">
          <p className="text-xs sm:text-sm text-slate-600">
            {lang === 'ja'
              ? 'ツアーの参加記念や同行者の募集に！特製チケット風のカード画像を高画質PNGで保存したり、X（旧Twitter）へワンタップでシェアできます。'
              : 'Share this tour pass on social media or download a high-res travel pass card!'}
          </p>

          {/* Ticket Card Preview (DOM styled like a real vintage travel pass) */}
          <div className="relative bg-gradient-to-r from-blue-700 via-indigo-700 to-blue-900 p-1 rounded-3xl shadow-xl overflow-hidden">
            <div className="bg-white rounded-[22px] overflow-hidden flex flex-col md:flex-row border border-slate-100">
              {/* Left Main Stub */}
              <div className="flex-1 p-5 sm:p-6 space-y-3">
                <div className="flex items-center justify-between text-[11px] font-mono border-b border-slate-100 pb-2">
                  <span className="text-blue-600 font-bold flex items-center gap-1">
                    <Sparkles className="w-3.5 h-3.5" />
                    DEEP DIVE JAPAN OFFICIAL PASS
                  </span>
                  <span className="text-slate-400">#{tour.id.toUpperCase()}</span>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  <span className="px-2 py-0.5 rounded-md bg-blue-100 text-blue-800 font-bold text-xs flex items-center gap-1">
                    <MapPin className="w-3 h-3" />
                    {tour.area}
                  </span>
                  <span className="px-2 py-0.5 rounded-md bg-rose-100 text-rose-800 font-bold text-xs flex items-center gap-1">
                    <Flame className="w-3 h-3 text-rose-600" />
                    Lv.{tour.otakuLevel} 熱量
                  </span>
                  <span className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 font-medium text-xs flex items-center gap-1">
                    <Clock className="w-3 h-3 text-slate-500" />
                    {tour.durationHours}時間
                  </span>
                </div>

                <h4 className="font-black text-slate-900 text-base sm:text-lg leading-snug">
                  {lang === 'ja' ? tour.title : tour.titleEn}
                </h4>

                <p className="text-xs text-slate-500 line-clamp-2">
                  {lang === 'ja' ? tour.catchphrase : tour.catchphraseEn}
                </p>

                {/* Guide banner */}
                <div className="flex items-center gap-3 bg-slate-50 p-2.5 rounded-xl border border-slate-100 text-xs">
                  <img
                    src={tour.guide.avatar}
                    alt={tour.guide.name}
                    className="w-9 h-9 rounded-full object-cover border border-slate-200"
                  />
                  <div>
                    <div className="font-bold text-slate-800">{tour.guide.name}</div>
                    <div className="text-[11px] text-blue-600">愛好歴 {tour.guide.otakuYears}年 / 専門ガイド</div>
                  </div>
                </div>
              </div>

              {/* Perforation Separator */}
              <div className="hidden md:flex flex-col items-center justify-between py-2 relative w-px bg-slate-200">
                <div className="w-4 h-4 rounded-full bg-slate-900 -mt-4" />
                <div className="h-full border-r-2 border-dashed border-slate-300 w-0" />
                <div className="w-4 h-4 rounded-full bg-slate-900 -mb-4" />
              </div>

              {/* Right Stub (Stamp & Price) */}
              <div className="w-full md:w-44 bg-slate-50 p-5 flex flex-col items-center justify-center text-center border-t md:border-t-0 md:border-l border-slate-200">
                {/* Official Stamp graphic */}
                <div className="w-20 h-20 rounded-full border-2 border-rose-600 border-dashed flex flex-col items-center justify-center text-rose-600 -rotate-12 select-none shadow-xs mb-3 bg-rose-50/50">
                  <span className="text-[9px] font-bold">偏愛探訪公認</span>
                  <span className="text-xs font-black">DEEP DIVE</span>
                  <span className="text-[8px] font-mono tracking-tighter">OFFICIAL</span>
                </div>

                <div className="text-lg font-black text-slate-900">
                  ¥{tour.price.toLocaleString()}
                </div>
                <div className="text-[10px] text-slate-400">1名参加費（税込）</div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
            {/* Share to X */}
            <button
              onClick={handleShareX}
              className="flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-black hover:bg-slate-800 text-white font-bold text-xs sm:text-sm shadow-md transition-all cursor-pointer active:scale-95"
            >
              <Share2 className="w-4 h-4" />
              <span>{lang === 'ja' ? '𝕏 でシェア' : 'Share on 𝕏'}</span>
            </button>

            {/* Download Ticket Image */}
            <button
              onClick={handleDownloadTicketImage}
              disabled={isGenerating}
              className="flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs sm:text-sm shadow-md shadow-blue-500/20 transition-all cursor-pointer active:scale-95 disabled:opacity-50"
            >
              <Download className="w-4 h-4" />
              <span>{isGenerating ? (lang === 'ja' ? '生成中...' : 'Generating...') : (lang === 'ja' ? '画像を保存 (PNG)' : 'Save Pass Image')}</span>
            </button>

            {/* Copy Link */}
            <button
              onClick={handleCopy}
              className="flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs sm:text-sm border border-slate-200 transition-all cursor-pointer active:scale-95"
            >
              {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
              <span>{copied ? (lang === 'ja' ? 'コピー完了！' : 'Copied!') : (lang === 'ja' ? 'リンクをコピー' : 'Copy Link')}</span>
            </button>
          </div>
        </div>

        {/* Hidden Canvas used for generating the image */}
        <canvas ref={canvasRef} className="hidden" />
      </div>
    </div>
  );
};
