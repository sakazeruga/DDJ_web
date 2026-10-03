import React, { useState } from 'react';
import { 
  X, 
  Plus, 
  Trash2, 
  Sparkles, 
  Flame,
  Headphones
} from 'lucide-react';
import confetti from 'canvas-confetti';
import type { Tour, TourCategory, Language, ItineraryItem } from '../types';
import { translations } from '../i18n/translations';

interface CreateTourModalProps {
  isOpen: boolean;
  onClose: () => void;
  lang: Language;
  onTourCreated: (newTour: Tour) => void;
}

export const CreateTourModal: React.FC<CreateTourModalProps> = ({
  isOpen,
  onClose,
  lang,
  onTourCreated,
}) => {
  if (!isOpen) return null;
  const t = translations[lang];

  // Form states
  const [title, setTitle] = useState('');
  const [catchphrase, setCatchphrase] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState<TourCategory>('history-castle');
  const [area, setArea] = useState('');
  const [otakuLevel, setOtakuLevel] = useState<1 | 2 | 3 | 4 | 5>(3);
  const [durationHours, setDurationHours] = useState<number>(3.5);
  const [price, setPrice] = useState<number>(6500);
  const [maxParticipants, setMaxParticipants] = useState<number>(6);
  const [languagesInput, setLanguagesInput] = useState<string>('日本語, English');
  const [imageUrl, setImageUrl] = useState<string>(
    'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&w=1200&q=80'
  );
  const [recommendedPrep, setRecommendedPrep] = useState('');
  const [mustBringInput, setMustBringInput] = useState('歩きやすい靴, カメラ');
  const [meetingPoint, setMeetingPoint] = useState('');
  const [guideName, setGuideName] = useState('ガイド');
  const [guideBio, setGuideBio] = useState('この歴史と街並みが大好きで10年通っています！');
  const [guideYears, setGuideYears] = useState<number>(10);

  // Online Talk Session configuration states
  const [enableTalkSession, setEnableTalkSession] = useState(true);
  const [talkPrice30m, setTalkPrice30m] = useState(3000);
  const [talkPrice60m, setTalkPrice60m] = useState(5500);
  const [talkTopicsInput, setTalkTopicsInput] = useState('事前作戦会議・ルート相談, マニアック機材・書籍相談, 自由オタクトーク');

  // Dynamic itinerary stops
  const [itinerary, setItinerary] = useState<ItineraryItem[]>([
    {
      time: '10:00',
      spotTitle: '集合場所にて合流＆ブリーフィング',
      spotTitleEn: 'Meeting & Briefing',
      description: '当日のルート説明と参加者の興味のあるポイントをヒアリング。',
      descriptionEn: 'Orientation and tailored route overview.',
      isDeepSpot: false,
    },
    {
      time: '11:00',
      spotTitle: '第1の歴史スポット・現地遺構探訪',
      spotTitleEn: 'First Historical Spot Deep Exploration',
      description: '一般の観光客が気づかない遺構やアングルの徹底解説。',
      descriptionEn: 'Deep architectural and historical lore.',
      isDeepSpot: true,
    },
  ]);

  const addItineraryStop = () => {
    setItinerary([
      ...itinerary,
      {
        time: '13:00',
        spotTitle: '',
        spotTitleEn: '',
        description: '',
        descriptionEn: '',
        isDeepSpot: false,
      },
    ]);
  };

  const removeItineraryStop = (index: number) => {
    if (itinerary.length <= 1) return;
    setItinerary(itinerary.filter((_, i) => i !== index));
  };

  const updateItineraryStop = (index: number, field: keyof ItineraryItem, value: any) => {
    const updated = [...itinerary];
    updated[index] = { ...updated[index], [field]: value };
    setItinerary(updated);
  };

  const presetImages = [
    { label: '城郭・歴史', url: 'https://images.unsplash.com/photo-1528164344705-475426879c0d?auto=format&fit=crop&w=1200&q=80' },
    { label: '京都・寺社', url: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&w=1200&q=80' },
    { label: '鉄道・自然', url: 'https://images.unsplash.com/photo-1503899036084-c55cdd92da26?auto=format&fit=crop&w=1200&q=80' },
    { label: '古書・喫茶', url: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&w=1200&q=80' },
    { label: 'アニメ聖地', url: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=1200&q=80' },
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!title || !catchphrase || !description || !area || !meetingPoint) {
      alert(lang === 'ja' ? '必須項目を入力してください' : 'Please fill in required fields');
      return;
    }

    const newTour: Tour = {
      id: `tour-custom-${Date.now()}`,
      title,
      titleEn: title,
      catchphrase,
      catchphraseEn: catchphrase,
      description,
      descriptionEn: description,
      category,
      area,
      areaEn: area,
      otakuLevel,
      durationHours: Number(durationHours),
      price: Number(price),
      maxParticipants: Number(maxParticipants),
      languages: languagesInput.split(',').map((s) => s.trim()).filter(Boolean),
      imageUrl,
      gallery: [imageUrl],
      guide: {
        id: `guide-${Date.now()}`,
        name: guideName,
        nameEn: guideName,
        avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=300&q=80',
        role: 'カルチャーツアーガイド',
        roleEn: 'Cultural Tour Specialist',
        bio: guideBio,
        bioEn: guideBio,
        rating: 5.0,
        reviewsCount: 1,
        otakuYears: Number(guideYears),
        specialties: [category, area],
      },
      itinerary,
      included: ['専門ガイド料', '特製探訪マップ'],
      includedEn: ['Specialist Guide Fee', 'Custom Route Map'],
      mustBring: mustBringInput.split(',').map((s) => s.trim()).filter(Boolean),
      mustBringEn: mustBringInput.split(',').map((s) => s.trim()).filter(Boolean),
      recommendedPreparation: recommendedPrep || 'テーマへの知的好奇心',
      recommendedPreparationEn: recommendedPrep || 'Curiosity for culture and history',
      meetingPoint,
      meetingPointEn: meetingPoint,
      tags: [area, '新作ツアー'],
      featured: false,
      rating: 5.0,
      reviewsCount: 0,
      createdAt: new Date().toISOString().split('T')[0],
      talkSessionConfig: enableTalkSession ? {
        enabled: true,
        price30m: Number(talkPrice30m),
        price60m: Number(talkPrice60m),
        topics: talkTopicsInput.split(',').map((s) => s.trim()).filter(Boolean),
        availableSlots: ['平日夜 20:00〜20:30', '休日午後 14:00〜14:30', '休日夜 21:00〜21:30'],
      } : undefined,
    };

    onTourCreated(newTour);

    confetti({
      particleCount: 100,
      spread: 90,
      origin: { y: 0.5 },
      colors: ['#2563eb', '#f43f5e', '#eab308'],
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-slate-900/60 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-4xl bg-white border border-slate-200 rounded-3xl shadow-2xl overflow-hidden my-auto max-h-[92vh] flex flex-col">
        {/* Header */}
        <div className="sticky top-0 z-20 bg-white/95 backdrop-blur-md px-6 py-4 border-b border-slate-200 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-blue-600" />
            <div>
              <h2 className="text-base sm:text-lg font-bold text-slate-900 leading-tight">
                {t.createModal.title}
              </h2>
              <p className="text-xs text-slate-500">{t.createModal.subtitle}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-slate-50 hover:bg-slate-100 text-slate-500 hover:text-slate-800 border border-slate-200 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Form Body */}
        <form onSubmit={handleSubmit} className="overflow-y-auto p-4 sm:p-6 md:p-8 space-y-6 bg-slate-50">
          {/* Section 1: Basic Info */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-4">
            <h3 className="text-sm font-bold text-blue-700 uppercase tracking-wider flex items-center gap-1.5">
              <span>01.</span> {t.createModal.step1}
            </h3>

            {/* Title */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                {t.createModal.tourTitle} <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                placeholder={t.createModal.tourTitlePlaceholder}
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-xs sm:text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-500 focus:bg-white"
              />
            </div>

            {/* Catchphrase */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                {t.createModal.catchphrase} <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                placeholder={t.createModal.catchphrasePlaceholder}
                value={catchphrase}
                onChange={(e) => setCatchphrase(e.target.value)}
                required
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-xs sm:text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-500 focus:bg-white"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Category */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  {t.createModal.category}
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value as TourCategory)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-xs text-slate-900 focus:outline-none focus:border-blue-500 focus:bg-white"
                >
                  <option value="history-castle">{t.categories['history-castle']}</option>
                  <option value="railway-train">{t.categories['railway-train']}</option>
                  <option value="anime-pilgrimage">{t.categories['anime-pilgrimage']}</option>
                  <option value="retro-showa">{t.categories['retro-showa']}</option>
                  <option value="folklore-yokai">{t.categories['folklore-yokai']}</option>
                  <option value="oshikatsu-subculture">{t.categories['oshikatsu-subculture']}</option>
                  <option value="custom">{t.categories.custom}</option>
                </select>
              </div>

              {/* Area */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  {t.createModal.area} <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  placeholder={t.createModal.areaPlaceholder}
                  value={area}
                  onChange={(e) => setArea(e.target.value)}
                  required
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-500 focus:bg-white"
                />
              </div>
            </div>

            {/* Depth Level Slider */}
            <div>
              <div className="flex justify-between items-center mb-1">
                <label className="text-xs font-bold text-slate-700 flex items-center gap-1">
                  <Flame className="w-3.5 h-3.5 text-rose-500" />
                  <span>{t.createModal.otakuLevel}</span>
                </label>
                <span className="text-xs font-bold text-blue-700">
                  Lv.{otakuLevel} {otakuLevel === 5 ? '（極限の沼・専門家）' : otakuLevel === 1 ? '（入門・初心者歓迎）' : ''}
                </span>
              </div>
              <input
                type="range"
                min="1"
                max="5"
                step="1"
                value={otakuLevel}
                onChange={(e) => setOtakuLevel(Number(e.target.value) as any)}
                className="w-full accent-blue-600 cursor-pointer"
              />
            </div>

            {/* Numbers: Price, Duration, Max Guests */}
            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  {t.createModal.price}
                </label>
                <input
                  type="number"
                  value={price}
                  onChange={(e) => setPrice(Number(e.target.value))}
                  step="500"
                  min="0"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  {t.createModal.duration}
                </label>
                <input
                  type="number"
                  value={durationHours}
                  onChange={(e) => setDurationHours(Number(e.target.value))}
                  step="0.5"
                  min="1"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  {t.createModal.maxGuests}
                </label>
                <input
                  type="number"
                  value={maxParticipants}
                  onChange={(e) => setMaxParticipants(Number(e.target.value))}
                  min="1"
                  max="20"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900"
                />
              </div>
            </div>

            {/* Languages Input */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                対応言語（カンマ区切り）
              </label>
              <input
                type="text"
                value={languagesInput}
                onChange={(e) => setLanguagesInput(e.target.value)}
                placeholder="例: 日本語, English"
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 placeholder-slate-400"
              />
            </div>

            {/* Image Selection */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                {t.createModal.imageUrl}
              </label>
              <input
                type="text"
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 mb-2"
              />
              <div className="flex flex-wrap gap-2 text-[11px] text-slate-500">
                <span>プリセット画像:</span>
                {presetImages.map((p, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setImageUrl(p.url)}
                    className="px-2.5 py-0.5 rounded-md bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200 cursor-pointer"
                  >
                    {p.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Description */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                {t.createModal.description} <span className="text-rose-500">*</span>
              </label>
              <textarea
                rows={3}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
                placeholder="このテーマの魅力、なぜあなたが案内できるのかを情熱を込めて語ってください！"
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs sm:text-sm text-slate-900 placeholder-slate-400"
              />
            </div>
          </div>

          {/* Section 2: Itinerary Timeline */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-indigo-700 uppercase tracking-wider flex items-center gap-1.5">
                <span>02.</span> {t.createModal.step2}
              </h3>
              <button
                type="button"
                onClick={addItineraryStop}
                className="flex items-center gap-1 text-xs font-bold text-blue-700 hover:text-blue-800 px-3 py-1.5 rounded-lg bg-blue-50 border border-blue-200 cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>{t.createModal.addSpot}</span>
              </button>
            </div>

            <div className="space-y-3">
              {itinerary.map((stop, index) => (
                <div key={index} className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-2">
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2 flex-1">
                      <input
                        type="text"
                        placeholder="時間 (例: 10:30)"
                        value={stop.time}
                        onChange={(e) => updateItineraryStop(index, 'time', e.target.value)}
                        className="w-24 bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs text-slate-900"
                      />
                      <input
                        type="text"
                        placeholder="スポット名"
                        value={stop.spotTitle}
                        onChange={(e) => {
                          updateItineraryStop(index, 'spotTitle', e.target.value);
                          updateItineraryStop(index, 'spotTitleEn', e.target.value);
                        }}
                        required
                        className="flex-1 bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs text-slate-900"
                      />
                    </div>

                    <div className="flex items-center gap-2">
                      <label className="flex items-center gap-1 text-[11px] text-rose-600 font-bold cursor-pointer">
                        <input
                          type="checkbox"
                          checked={stop.isDeepSpot}
                          onChange={(e) => updateItineraryStop(index, 'isDeepSpot', e.target.checked)}
                          className="accent-rose-600"
                        />
                        <span>見どころ</span>
                      </label>
                      {itinerary.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeItineraryStop(index)}
                          className="p-1.5 text-slate-400 hover:text-rose-600 cursor-pointer"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </div>

                  <textarea
                    rows={2}
                    placeholder="見どころやガイド解説、撮影アングルなど"
                    value={stop.description}
                    onChange={(e) => {
                      updateItineraryStop(index, 'description', e.target.value);
                      updateItineraryStop(index, 'descriptionEn', e.target.value);
                    }}
                    className="w-full bg-white border border-slate-200 rounded-lg p-2 text-xs text-slate-900 placeholder-slate-400"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Section 3: Prep & Guide */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-4">
            <h3 className="text-sm font-bold text-emerald-700 uppercase tracking-wider flex items-center gap-1.5">
              <span>03.</span> {t.createModal.step3}
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  {t.createModal.meetingPoint} <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  placeholder={t.createModal.meetingPointPlaceholder}
                  value={meetingPoint}
                  onChange={(e) => setMeetingPoint(e.target.value)}
                  required
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 placeholder-slate-400"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  {t.createModal.prepAnime}
                </label>
                <input
                  type="text"
                  placeholder="例: 戦国武将の合戦図や関連作品"
                  value={recommendedPrep}
                  onChange={(e) => setRecommendedPrep(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 placeholder-slate-400"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                {t.createModal.mustBringItems}
              </label>
              <input
                type="text"
                value={mustBringInput}
                onChange={(e) => setMustBringInput(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 placeholder-slate-400"
              />
            </div>

            {/* Guide Info */}
            <div className="pt-3 border-t border-slate-100 grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">ガイド名</label>
                <input
                  type="text"
                  value={guideName}
                  onChange={(e) => setGuideName(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">愛好歴（年）</label>
                <input
                  type="number"
                  value={guideYears}
                  onChange={(e) => setGuideYears(Number(e.target.value))}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">自己PR</label>
                <input
                  type="text"
                  value={guideBio}
                  onChange={(e) => setGuideBio(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900"
                />
              </div>
            </div>

            {/* Online Talk Session Offering Setup */}
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-4 rounded-2xl border border-blue-200 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-xl bg-blue-600 text-white flex items-center justify-center">
                    <Headphones className="w-4 h-4 text-yellow-300" />
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900 text-xs sm:text-sm flex items-center gap-1.5">
                      <span>1on1 オンライン会話セッションも同時開設</span>
                      <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-blue-600 text-white font-normal">おすすめ</span>
                    </h4>
                    <p className="text-[11px] text-slate-500">遠方・海外のファンと自宅からZoom/Google Meetで直接語り合えます</p>
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={enableTalkSession}
                  onChange={(e) => setEnableTalkSession(e.target.checked)}
                  className="w-5 h-5 text-blue-600 rounded cursor-pointer"
                />
              </div>

              {enableTalkSession && (
                <div className="space-y-2 pt-2 border-t border-blue-100 text-xs">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block font-bold text-slate-700 mb-1">30分セッション料金 (円)</label>
                      <input
                        type="number"
                        value={talkPrice30m}
                        onChange={(e) => setTalkPrice30m(Number(e.target.value))}
                        className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-slate-900"
                      />
                    </div>
                    <div>
                      <label className="block font-bold text-slate-700 mb-1">60分セッション料金 (円)</label>
                      <input
                        type="number"
                        value={talkPrice60m}
                        onChange={(e) => setTalkPrice60m(Number(e.target.value))}
                        className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-slate-900"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">トークテーマ（カンマ区切り）</label>
                    <input
                      type="text"
                      value={talkTopicsInput}
                      onChange={(e) => setTalkTopicsInput(e.target.value)}
                      placeholder="例: 事前作戦会議, 機材相談, 自由オタクトーク"
                      className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-slate-900 placeholder-slate-400"
                    />
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Submit CTA */}
          <div className="pt-2">
            <button
              type="submit"
              className="w-full py-4 rounded-2xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-base shadow-lg shadow-blue-500/20 transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-95"
            >
              <Sparkles className="w-5 h-5 text-yellow-300" />
              <span>{t.createModal.submit}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
