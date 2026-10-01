import React, { useState } from 'react';
import { 
  X, 
  Plus, 
  Trash2, 
  Sparkles, 
  Flame 
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
  const [category, setCategory] = useState<TourCategory>('pilgrimage');
  const [area, setArea] = useState('');
  const [otakuLevel, setOtakuLevel] = useState<1 | 2 | 3 | 4 | 5>(3);
  const [durationHours, setDurationHours] = useState<number>(3.0);
  const [price, setPrice] = useState<number>(6000);
  const [maxParticipants, setMaxParticipants] = useState<number>(4);
  const [languagesInput, setLanguagesInput] = useState<string>('日本語, English');
  const [imageUrl, setImageUrl] = useState<string>(
    'https://images.unsplash.com/photo-1503899036084-c55cdd92da26?auto=format&fit=crop&w=1200&q=80'
  );
  const [recommendedPrep, setRecommendedPrep] = useState('');
  const [mustBringInput, setMustBringInput] = useState('歩きやすい靴, スマホ');
  const [meetingPoint, setMeetingPoint] = useState('');
  const [guideName, setGuideName] = useState('案内人');
  const [guideBio, setGuideBio] = useState('このジャンルのオタク歴10年です！');
  const [guideYears, setGuideYears] = useState<number>(10);

  // Dynamic itinerary stops
  const [itinerary, setItinerary] = useState<ItineraryItem[]>([
    {
      time: '13:00',
      spotTitle: '集合場所にて合流＆ブリーフィング',
      spotTitleEn: 'Meeting & Briefing',
      description: '当日のルート説明と参加者の推しヒアリングを行います。',
      descriptionEn: 'Orientation and tailored route overview.',
      isDeepSpot: false,
    },
    {
      time: '14:00',
      spotTitle: '第1の聖地スポット・ディープ探訪',
      spotTitleEn: 'First Sacred Spot Deep Exploration',
      description: 'アニメのカットと同じアングルで写真撮影や作品の裏話解説。',
      descriptionEn: 'Exact frame matching and insider trivia.',
      isDeepSpot: true,
    },
  ]);

  // Handle itinerary additions
  const addItineraryStop = () => {
    setItinerary([
      ...itinerary,
      {
        time: '15:00',
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

  // Preset image helpers
  const presetImages = [
    { label: '秋葉原/サイバー', url: 'https://images.unsplash.com/photo-1578632767115-351597cf2477?auto=format&fit=crop&w=1200&q=80' },
    { label: 'ライブハウス/音楽', url: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=1200&q=80' },
    { label: 'レトロ玩具/フィギュア', url: 'https://images.unsplash.com/photo-1563245372-f21724e3856d?auto=format&fit=crop&w=1200&q=80' },
    { label: 'ゲーセン/ネオン', url: 'https://images.unsplash.com/photo-1511512578047-dfb367046420?auto=format&fit=crop&w=1200&q=80' },
    { label: '富士山/地方聖地', url: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&w=1200&q=80' },
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
        role: 'オタクツアープランナー',
        roleEn: 'Otaku Tour Planner',
        bio: guideBio,
        bioEn: guideBio,
        rating: 5.0,
        reviewsCount: 1,
        otakuYears: Number(guideYears),
        specialties: [category, area],
      },
      itinerary,
      included: ['ガイド料', '特製オリジナルマップ'],
      includedEn: ['Guide Fee', 'Custom Map'],
      mustBring: mustBringInput.split(',').map((s) => s.trim()).filter(Boolean),
      mustBringEn: mustBringInput.split(',').map((s) => s.trim()).filter(Boolean),
      recommendedPreparation: recommendedPrep || '好きなアニメへの情熱',
      recommendedPreparationEn: recommendedPrep || 'Passion for anime',
      meetingPoint,
      meetingPointEn: meetingPoint,
      tags: [area, category, '新作ツアー'],
      featured: false,
      rating: 5.0,
      reviewsCount: 0,
      createdAt: new Date().toISOString().split('T')[0],
    };

    onTourCreated(newTour);

    confetti({
      particleCount: 100,
      spread: 90,
      origin: { y: 0.5 },
      colors: ['#a855f7', '#06b6d4', '#ec4899'],
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-slate-950/80 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-4xl bg-slate-900 border border-slate-700/80 rounded-3xl shadow-2xl overflow-hidden my-auto max-h-[92vh] flex flex-col">
        {/* Sticky Header */}
        <div className="sticky top-0 z-20 bg-slate-950/90 backdrop-blur-md px-6 py-4 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-pink-400" />
            <div>
              <h2 className="text-base sm:text-lg font-bold text-white leading-tight">
                {t.createModal.title}
              </h2>
              <p className="text-xs text-slate-400">{t.createModal.subtitle}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-white border border-slate-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Form Body */}
        <form onSubmit={handleSubmit} className="overflow-y-auto p-4 sm:p-6 md:p-8 space-y-6">
          {/* Section 1: Basic Info */}
          <div className="bg-slate-950/60 p-5 rounded-2xl border border-slate-800 space-y-4">
            <h3 className="text-sm font-bold text-cyan-400 uppercase tracking-wider flex items-center gap-1.5">
              <span>01.</span> {t.createModal.step1}
            </h3>

            {/* Title */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                {t.createModal.tourTitle} <span className="text-pink-400">*</span>
              </label>
              <input
                type="text"
                placeholder={t.createModal.tourTitlePlaceholder}
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
                className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2.5 text-xs sm:text-sm text-white placeholder-slate-400 focus:outline-none focus:border-cyan-400"
              />
            </div>

            {/* Catchphrase */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                {t.createModal.catchphrase} <span className="text-pink-400">*</span>
              </label>
              <input
                type="text"
                placeholder={t.createModal.catchphrasePlaceholder}
                value={catchphrase}
                onChange={(e) => setCatchphrase(e.target.value)}
                required
                className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2.5 text-xs sm:text-sm text-white placeholder-slate-400 focus:outline-none focus:border-cyan-400"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Category */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  {t.createModal.category}
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value as TourCategory)}
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2.5 text-xs text-white"
                >
                  <option value="pilgrimage">{t.categories.pilgrimage}</option>
                  <option value="akiba-deep">{t.categories['akiba-deep']}</option>
                  <option value="nakano-vintage">{t.categories['nakano-vintage']}</option>
                  <option value="retro-games">{t.categories['retro-games']}</option>
                  <option value="otome-road">{t.categories['otome-road']}</option>
                  <option value="maid-subculture">{t.categories['maid-subculture']}</option>
                  <option value="comiket-doujin">{t.categories['comiket-doujin']}</option>
                  <option value="custom">{t.categories.custom}</option>
                </select>
              </div>

              {/* Area */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  {t.createModal.area} <span className="text-pink-400">*</span>
                </label>
                <input
                  type="text"
                  placeholder={t.createModal.areaPlaceholder}
                  value={area}
                  onChange={(e) => setArea(e.target.value)}
                  required
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2.5 text-xs text-white placeholder-slate-400"
                />
              </div>
            </div>

            {/* Otaku Level Slider */}
            <div>
              <div className="flex justify-between items-center mb-1">
                <label className="text-xs font-semibold text-slate-300 flex items-center gap-1">
                  <Flame className="w-3.5 h-3.5 text-pink-400" />
                  <span>{t.createModal.otakuLevel}</span>
                </label>
                <span className="text-xs font-bold text-pink-400">
                  Lv.{otakuLevel} {otakuLevel === 5 ? '（超限界オタク・沼）' : otakuLevel === 1 ? '（ビギナー歓迎）' : ''}
                </span>
              </div>
              <input
                type="range"
                min="1"
                max="5"
                step="1"
                value={otakuLevel}
                onChange={(e) => setOtakuLevel(Number(e.target.value) as any)}
                className="w-full accent-pink-500 cursor-pointer"
              />
            </div>

            {/* Numbers: Price, Duration, Max Guests */}
            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  {t.createModal.price}
                </label>
                <input
                  type="number"
                  value={price}
                  onChange={(e) => setPrice(Number(e.target.value))}
                  step="500"
                  min="0"
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  {t.createModal.duration}
                </label>
                <input
                  type="number"
                  value={durationHours}
                  onChange={(e) => setDurationHours(Number(e.target.value))}
                  step="0.5"
                  min="1"
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  {t.createModal.maxGuests}
                </label>
                <input
                  type="number"
                  value={maxParticipants}
                  onChange={(e) => setMaxParticipants(Number(e.target.value))}
                  min="1"
                  max="20"
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white"
                />
              </div>
            </div>

            {/* Languages Input */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                対応言語（カンマ区切り）
              </label>
              <input
                type="text"
                value={languagesInput}
                onChange={(e) => setLanguagesInput(e.target.value)}
                placeholder="例: 日本語, English, 中文"
                className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-400"
              />
            </div>

            {/* Image Selection */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                {t.createModal.imageUrl}
              </label>
              <input
                type="text"
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white mb-2"
              />
              <div className="flex flex-wrap gap-2 text-[11px] text-slate-400">
                <span>プリセット画像:</span>
                {presetImages.map((p, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setImageUrl(p.url)}
                    className="px-2 py-0.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-300"
                  >
                    {p.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Description */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                {t.createModal.description} <span className="text-pink-400">*</span>
              </label>
              <textarea
                rows={3}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
                placeholder="このツアーで巡る場所のディープな魅力、なぜあなたが案内できるのかを熱く語ってください！"
                className="w-full bg-slate-900 border border-slate-800 rounded-xl p-3 text-xs sm:text-sm text-white placeholder-slate-400"
              />
            </div>
          </div>

          {/* Section 2: Itinerary Timeline */}
          <div className="bg-slate-950/60 p-5 rounded-2xl border border-slate-800 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-purple-400 uppercase tracking-wider flex items-center gap-1.5">
                <span>02.</span> {t.createModal.step2}
              </h3>
              <button
                type="button"
                onClick={addItineraryStop}
                className="flex items-center gap-1 text-xs font-bold text-cyan-400 hover:text-cyan-300 px-3 py-1.5 rounded-lg bg-cyan-950/40 border border-cyan-500/30 cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>{t.createModal.addSpot}</span>
              </button>
            </div>

            <div className="space-y-3">
              {itinerary.map((stop, index) => (
                <div key={index} className="bg-slate-900 p-4 rounded-xl border border-slate-800 space-y-2">
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2 flex-1">
                      <input
                        type="text"
                        placeholder="時間 (例: 13:30)"
                        value={stop.time}
                        onChange={(e) => updateItineraryStop(index, 'time', e.target.value)}
                        className="w-24 bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-white"
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
                        className="flex-1 bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-white"
                      />
                    </div>

                    <div className="flex items-center gap-2">
                      <label className="flex items-center gap-1 text-[11px] text-pink-300 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={stop.isDeepSpot}
                          onChange={(e) => updateItineraryStop(index, 'isDeepSpot', e.target.checked)}
                          className="accent-pink-500"
                        />
                        <span>ディープ</span>
                      </label>
                      {itinerary.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeItineraryStop(index)}
                          className="p-1.5 text-slate-500 hover:text-rose-400 cursor-pointer"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </div>

                  <textarea
                    rows={2}
                    placeholder="見どころやオタク解説、おすすめのアングルなど"
                    value={stop.description}
                    onChange={(e) => {
                      updateItineraryStop(index, 'description', e.target.value);
                      updateItineraryStop(index, 'descriptionEn', e.target.value);
                    }}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-xs text-white placeholder-slate-500"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Section 3: Prep & Guide */}
          <div className="bg-slate-950/60 p-5 rounded-2xl border border-slate-800 space-y-4">
            <h3 className="text-sm font-bold text-pink-400 uppercase tracking-wider flex items-center gap-1.5">
              <span>03.</span> {t.createModal.step3}
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  {t.createModal.meetingPoint} <span className="text-pink-400">*</span>
                </label>
                <input
                  type="text"
                  placeholder={t.createModal.meetingPointPlaceholder}
                  value={meetingPoint}
                  onChange={(e) => setMeetingPoint(e.target.value)}
                  required
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-400"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  {t.createModal.prepAnime}
                </label>
                <input
                  type="text"
                  placeholder="例: 『ぼっち・ざ・ろっく！』1〜8話まで"
                  value={recommendedPrep}
                  onChange={(e) => setRecommendedPrep(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-400"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                {t.createModal.mustBringItems}
              </label>
              <input
                type="text"
                value={mustBringInput}
                onChange={(e) => setMustBringInput(e.target.value)}
                className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-400"
              />
            </div>

            {/* Guide Info */}
            <div className="pt-3 border-t border-slate-800 grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">ガイド名</label>
                <input
                  type="text"
                  value={guideName}
                  onChange={(e) => setGuideName(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">オタク歴（年）</label>
                <input
                  type="number"
                  value={guideYears}
                  onChange={(e) => setGuideYears(Number(e.target.value))}
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">自己PR</label>
                <input
                  type="text"
                  value={guideBio}
                  onChange={(e) => setGuideBio(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white"
                />
              </div>
            </div>
          </div>

          {/* Submit CTA */}
          <div className="pt-2">
            <button
              type="submit"
              className="w-full py-4 rounded-2xl bg-gradient-to-r from-purple-600 via-pink-600 to-rose-600 hover:from-purple-500 hover:to-pink-500 text-white font-bold text-base shadow-xl shadow-purple-600/30 hover:shadow-purple-600/50 transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-95"
            >
              <Sparkles className="w-5 h-5" />
              <span>{t.createModal.submit}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
