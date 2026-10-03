import React, { useState, useRef } from 'react';
import { 
  X, 
  Plus, 
  Trash2, 
  Sparkles, 
  Flame,
  Headphones,
  Upload,
  Check,
  Image as ImageIcon,
  Wand2,
  Tag,
  FileCheck
} from 'lucide-react';
import confetti from 'canvas-confetti';
import type { Tour, TourCategory, Language, ItineraryItem, CustomTheme } from '../types';
import { translations } from '../i18n/translations';
import { classifyTourThemeWithAI, type AIThemeAnalysisResult } from '../utils/aiThemeClassifier';

interface CreateTourModalProps {
  isOpen: boolean;
  onClose: () => void;
  lang: Language;
  onTourCreated: (newTour: Tour) => void;
  customThemes?: CustomTheme[];
  onAddCustomTheme?: (newTheme: CustomTheme) => void;
}

export const CreateTourModal: React.FC<CreateTourModalProps> = ({
  isOpen,
  onClose,
  lang,
  onTourCreated,
  customThemes = [],
  onAddCustomTheme,
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
  const [imageTab, setImageTab] = useState<'preset' | 'upload' | 'url'>('preset');
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // AI Theme Classifier state
  const [isAnalyzingAi, setIsAnalyzingAi] = useState(false);
  const [aiResult, setAiResult] = useState<AIThemeAnalysisResult | null>(null);
  const [addedNewTheme, setAddedNewTheme] = useState<CustomTheme | null>(null);
  const [customTags, setCustomTags] = useState<string[]>([]);

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
      time: '11:15',
      spotTitle: 'メイン遺構・名所探訪',
      spotTitleEn: 'Main Spot Exploration',
      description: '一般の観光客が素通りしてしまうディープな背景や遺構を解説。',
      descriptionEn: 'Deep lore and hidden architectural details.',
      isDeepSpot: true,
    },
    {
      time: '12:30',
      spotTitle: '老舗名店・ローカルスポットで休憩',
      spotTitleEn: 'Local Rest & Refreshments',
      description: '地元の人しか知らない名物や軽食を楽しみながらカルチャートーク。',
      descriptionEn: 'Authentic local treats and passionate cultural talks.',
      isDeepSpot: false,
    },
    {
      time: '14:00',
      spotTitle: 'クライマックス深掘りスポット＆現地解散',
      spotTitleEn: 'Climax Spot & Farewell',
      description: '旅の総括と、次回の聖地巡礼に役立つマニアックなおすすめ情報交換。',
      descriptionEn: 'Summary and curated tips for future explorations.',
      isDeepSpot: true,
    },
  ]);

  const addItineraryStop = () => {
    const nextHour = 10 + itinerary.length;
    const timeStr = `${nextHour.toString().padStart(2, '0')}:00`;
    setItinerary([
      ...itinerary,
      {
        time: timeStr,
        spotTitle: '',
        spotTitleEn: '',
        description: '',
        descriptionEn: '',
        isDeepSpot: false,
      },
    ]);
  };

  const removeItineraryStop = (index: number) => {
    setItinerary(itinerary.filter((_, i) => i !== index));
  };

  const clearItinerary = () => {
    setItinerary([]);
  };

  const moveItineraryStop = (index: number, direction: 'up' | 'down') => {
    if (direction === 'up' && index === 0) return;
    if (direction === 'down' && index === itinerary.length - 1) return;
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    const updated = [...itinerary];
    const temp = updated[index];
    updated[index] = updated[targetIndex];
    updated[targetIndex] = temp;
    setItinerary(updated);
  };

  const duplicateItineraryStop = (index: number) => {
    const target = itinerary[index];
    const updated = [...itinerary];
    updated.splice(index + 1, 0, { ...target, spotTitle: `${target.spotTitle} (続き)` });
    setItinerary(updated);
  };

  const updateItineraryStop = (index: number, field: keyof ItineraryItem, value: any) => {
    const updated = [...itinerary];
    updated[index] = { ...updated[index], [field]: value };
    setItinerary(updated);
  };

  // AI-generated itinerary tailored to current theme/title
  const generateItineraryWithAI = () => {
    const context = `${title} ${description} ${category} ${area}`.toLowerCase();

    if (context.includes('音') || context.includes('音楽') || context.includes('sound') || category === 'music-sound') {
      setItinerary([
        {
          time: '10:00',
          spotTitle: '集合場所にて合流＆ハイレゾレコーダー操作レクチャー',
          spotTitleEn: 'Meeting & Audio Equipment Briefing',
          description: 'バイノーラルマイクと高性能ポータブルレコーダーのセッティングと集音のコツを解説。',
          descriptionEn: 'Setting up high-res mics and binaural listening gear.',
          isDeepSpot: false,
        },
        {
          time: '11:00',
          spotTitle: '渚の潮騒と小石の擦れる音のフィールドレコーディング',
          spotTitleEn: 'Coastal Wave & Pebble Sound Field Recording',
          description: '波が引く瞬間の小石が奏でる繊細なハーモニーを静寂の中で耳を澄ましてサンプリング。',
          descriptionEn: 'Sampling delicate wave textures and sea breezes.',
          isDeepSpot: true,
        },
        {
          time: '13:00',
          spotTitle: '竹林の風音と日本庭園の水琴窟探訪',
          spotTitleEn: 'Bamboo Forest Wind & Suikinkutsu Water Bells',
          description: '風に擦れる竹の葉音と、地中深くから反響する天然の水滴音をじっくり採集。',
          descriptionEn: 'Capturing subterranean water chimes and whispering bamboo groves.',
          isDeepSpot: true,
        },
        {
          time: '15:30',
          spotTitle: '海辺のスタジオにて採集音源とピアノのコラボ即興セッション＆解散',
          spotTitleEn: 'Studio Listening & Piano Jam Session',
          description: '今日録音したばかりの波音や自然音にガイドがピアノの旋律を重ね、オリジナル音源を共有。',
          descriptionEn: 'Synthesizing captured sounds with live acoustic piano music.',
          isDeepSpot: true,
        },
      ]);
    } else if (context.includes('廃墟') || context.includes('産業') || context.includes('遺産') || context.includes('鉱山')) {
      setItinerary([
        {
          time: '09:30',
          spotTitle: '駅集合＆近代化遺産ヘルメット・ライト点検',
          spotTitleEn: 'Gathering & Safety Gear Check',
          description: '安全装備の確認と、この土地がかつて日本の近代産業をどう牽引したかの歴史レクチャー。',
          descriptionEn: 'Safety inspection and industrial heritage orientation.',
          isDeepSpot: false,
        },
        {
          time: '10:45',
          spotTitle: '赤煉瓦造り旧発電所遺構と苔むしたコンクリート巨大基礎',
          spotTitleEn: 'Red Brick Power Plant & Mossy Concrete Foundations',
          description: '蔦に覆われた巨大アーチ窓と、当時の職人が積んだイギリス積みの美しい煉瓦壁を鑑賞。',
          descriptionEn: 'Observing English-bond brick masonry and overgrown ruins.',
          isDeepSpot: true,
        },
        {
          time: '13:00',
          spotTitle: '旧炭鉱トロッコ軌道跡と封鎖された坑口モニュメント',
          spotTitleEn: 'Abandoned Mine Trolley Tracks & Sealed Shaft',
          description: '木々の間に残る錆びたレールと、地下深くに続いていた坑口の遺構を間近で見学。',
          descriptionEn: 'Rusting narrow-gauge tracks winding through serene woods.',
          isDeepSpot: true,
        },
        {
          time: '15:00',
          spotTitle: '遺構を一望する高台展望地にて振り返り＆解散',
          spotTitleEn: 'Panoramic Viewpoint & Debriefing',
          description: '廃墟写真のベストアングルを振り返り、現存する資料集を見ながら熱く語り合って解散。',
          descriptionEn: 'Reviewing architectural photography and historic blueprints.',
          isDeepSpot: false,
        },
      ]);
    } else if (context.includes('銭湯') || context.includes('サウナ') || context.includes('温泉')) {
      setItinerary([
        {
          time: '13:00',
          spotTitle: '下町駅集合＆宮造り銭湯の建築鑑賞ブリーフィング',
          spotTitleEn: 'Meeting & Temple-style Bathhouse Architecture Walk',
          description: '破風造りの堂々たる屋根や煙突の高さ、番台の配置の歴史的変遷を解説。',
          descriptionEn: 'Exploring historical Miyazukuri wooden architecture and towering brick chimneys.',
          isDeepSpot: false,
        },
        {
          time: '14:00',
          spotTitle: '富士山ペンキ絵・丸山絵師の壁画鑑賞＆入浴',
          spotTitleEn: 'Mt. Fuji Mural Viewing & Onsen Bath',
          description: 'ペンキ絵師の筆遣いを愛でながら、熱湯とバイブラ湯、井戸水かけ流しの水風呂を堪能。',
          descriptionEn: 'Classic Mt. Fuji oil painting appreciation and mineral-rich soaking.',
          isDeepSpot: true,
        },
        {
          time: '16:00',
          spotTitle: '湯守（店主）の釜場見学＆薪割り・湯沸かし秘話トーク',
          spotTitleEn: 'Behind-the-Scenes Boiler Room Tour & Firewood Lore',
          description: '普段は絶対に入れない銭湯の裏側へ。薪で湯を沸かす湯守のこだわりを直接聞く。',
          descriptionEn: 'Exclusive access to the backroom firewood boiler and master stoker talks.',
          isDeepSpot: true,
        },
        {
          time: '17:30',
          spotTitle: '湯上がり路地裏純喫茶にてコーヒー牛乳片手に反省会',
          spotTitleEn: 'Post-Bath Retro Cafe & Coffee Milk',
          description: 'ととのった身体に染み渡る冷たい瓶入りコーヒー牛乳と昭和グルメを堪能。',
          descriptionEn: 'Classic glass-bottle coffee milk in a nostalgic Showa cafe alley.',
          isDeepSpot: false,
        },
      ]);
    } else if (context.includes('鉄道') || context.includes('江ノ電') || category === 'railway-train') {
      setItinerary([
        {
          time: '09:45',
          spotTitle: '駅集合＆1日乗車券購入・撮影マナーレクチャー',
          spotTitleEn: 'Meeting & 1-Day Pass Preparation',
          description: '単線運転のダイヤグラムの仕組みと、おすすめの撮影ポイントを地図で確認。',
          descriptionEn: 'Single-track railway schedule briefing and etiquette.',
          isDeepSpot: false,
        },
        {
          time: '10:30',
          spotTitle: '民家の軒先スレスレを走る有名区間・路面併用軌道探訪',
          spotTitleEn: 'Narrow Street Promenade & Street Running Tram Section',
          description: '家屋と電車の隙間がわずか数十センチの迫力ある区間を安全なベストポジションで体感。',
          descriptionEn: 'Thrilling residential tramway skimming between traditional shop eaves.',
          isDeepSpot: true,
        },
        {
          time: '12:30',
          spotTitle: '海を臨む単線駅・すれ違い退避の鑑賞',
          spotTitleEn: 'Oceanview Station Passing Loop Observation',
          description: 'タブレット交換やスプリングポイントの転換音など、鉄道ファン垂涎の機構を解説。',
          descriptionEn: 'Watching train crossing operations by the shimmering Pacific coast.',
          isDeepSpot: true,
        },
        {
          time: '15:00',
          spotTitle: '旧型レトロ車両の保存展示・引退車両の面影を巡る',
          spotTitleEn: 'Vintage Rolling Stock Heritage Spot & Farewell',
          description: '木造床や丸型ヘッドライトを間近で観察し、鉄道談義で締めくくり。',
          descriptionEn: 'Admiring classic wooden interiors and distinctive round headlights.',
          isDeepSpot: false,
        },
      ]);
    } else {
      // General Culture / History / Custom
      setItinerary([
        {
          time: '10:00',
          spotTitle: `${area || '現地'}集合・本日の探訪テーマオリエンテーション`,
          spotTitleEn: 'Meeting & Tour Theme Orientation',
          description: `${title || 'ツアー'}の歴史的・文化的背景と、一般には知られていないツウな鑑賞ポイントを伝授。`,
          descriptionEn: 'Background lore and key architectural highlights.',
          isDeepSpot: false,
        },
        {
          time: '11:15',
          spotTitle: '第1のディープ探訪スポット（隠された遺構・舞台）',
          spotTitleEn: 'Hidden Spot & Historical Lore Exploration',
          description: '観光ガイドブックには載っていない現地ならでのエピソードや撮影アングルを徹底解説。',
          descriptionEn: 'Unpublished lore and rare photo angles away from tourist crowds.',
          isDeepSpot: true,
        },
        {
          time: '13:00',
          spotTitle: '地元民御用達のカルチャー休憩スポット',
          spotTitleEn: 'Authentic Local Cultural Break',
          description: '長年この街に愛される名店で、土地に根付いた文化や食を味わいながら質問タイム。',
          descriptionEn: 'Local snack time and open Q&A with the specialist guide.',
          isDeepSpot: false,
        },
        {
          time: '14:45',
          spotTitle: '旅のクライマックススポット・現地解散',
          spotTitleEn: 'Climax Landmark & Farewell',
          description: 'もっとも感情が揺さぶられるハイライトスポットで締めくくり、おすすめ関連書籍を紹介。',
          descriptionEn: 'Final highlight, closing discussions, and curated book recommendations.',
          isDeepSpot: true,
        },
      ]);
    }

    confetti({
      particleCount: 50,
      spread: 60,
      origin: { y: 0.6 },
    });
  };

  // Preset images with full metadata and diverse genres
  const presetImages = [
    { 
      label: '音楽・音風景', 
      cat: 'music-sound', 
      url: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80',
      thumb: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=200&q=80',
    },
    { 
      label: '城郭・歴史', 
      cat: 'history-castle', 
      url: 'https://images.unsplash.com/photo-1528164344705-475426879c0d?auto=format&fit=crop&w=1200&q=80',
      thumb: 'https://images.unsplash.com/photo-1528164344705-475426879c0d?auto=format&fit=crop&w=200&q=80',
    },
    { 
      label: '京都・寺社', 
      cat: 'history-castle', 
      url: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&w=1200&q=80',
      thumb: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&w=200&q=80',
    },
    { 
      label: '鉄道・江ノ電', 
      cat: 'railway-train', 
      url: 'https://images.unsplash.com/photo-1503899036084-c55cdd92da26?auto=format&fit=crop&w=1200&q=80',
      thumb: 'https://images.unsplash.com/photo-1503899036084-c55cdd92da26?auto=format&fit=crop&w=200&q=80',
    },
    { 
      label: '古書・喫茶', 
      cat: 'retro-showa', 
      url: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&w=1200&q=80',
      thumb: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&w=200&q=80',
    },
    { 
      label: 'アニメ聖地・街並み', 
      cat: 'anime-pilgrimage', 
      url: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=1200&q=80',
      thumb: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=200&q=80',
    },
    { 
      label: '産業遺産・廃墟', 
      cat: 'industrial-ruins', 
      url: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=1200&q=80',
      thumb: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=200&q=80',
    },
    { 
      label: '温浴・銭湯', 
      cat: 'sento-sauna', 
      url: 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=1200&q=80',
      thumb: 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=200&q=80',
    },
  ];

  // Image Upload File Handler
  const handleImageFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      alert('画像ファイル (JPEG, PNG, WebPなど) を選択してください。');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const dataUrl = event.target?.result as string;
      if (dataUrl) {
        setImageUrl(dataUrl);
        setUploadSuccess(true);
        setTimeout(() => setUploadSuccess(false), 4000);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleFileDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const file = e.dataTransfer.files?.[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      alert('画像ファイルを選択してください。');
      return;
    }
    const reader = new FileReader();
    reader.onload = (event) => {
      const dataUrl = event.target?.result as string;
      if (dataUrl) {
        setImageUrl(dataUrl);
        setUploadSuccess(true);
        setTimeout(() => setUploadSuccess(false), 4000);
      }
    };
    reader.readAsDataURL(file);
  };

  // AI Theme Classifier execution
  const handleRunAIClassifier = async () => {
    if (!title && !description && !catchphrase) {
      alert('タイトルまたは説明文を先に入力してください。AIが内容を分析します。');
      return;
    }

    setIsAnalyzingAi(true);
    setAiResult(null);

    try {
      const result = await classifyTourThemeWithAI({
        title,
        catchphrase,
        description,
        tags: customTags,
      });

      setAiResult(result);

      if (result.isMatch && result.matchedCategory) {
        setCategory(result.matchedCategory);
        if (result.suggestedTags && result.suggestedTags.length > 0) {
          const merged = Array.from(new Set([...customTags, ...result.suggestedTags]));
          setCustomTags(merged);
        }
      }
    } finally {
      setIsAnalyzingAi(false);
    }
  };

  // Handler for adding non-matching AI suggested theme to the whole platform
  const handleApplyNewCustomTheme = () => {
    if (!aiResult?.suggestedNewTheme) return;

    const newTheme = aiResult.suggestedNewTheme;
    if (onAddCustomTheme) {
      onAddCustomTheme(newTheme);
    }

    setCategory(newTheme.categoryKey as TourCategory);
    setAddedNewTheme(newTheme);
    const merged = Array.from(new Set([...customTags, ...newTheme.sampleTags]));
    setCustomTags(merged);

    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.4 },
      colors: ['#3b82f6', '#10b981', '#f59e0b', '#ec4899'],
    });
  };

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
      tags: Array.from(new Set([
        area,
        '新作ツアー',
        ...(addedNewTheme ? [addedNewTheme.name] : []),
        ...customTags,
      ])).filter(Boolean),
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
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-blue-700 uppercase tracking-wider flex items-center gap-1.5">
                <span>01.</span> {t.createModal.step1}
              </h3>

              {/* AI Theme Auto-Classifier Trigger Button */}
              <button
                type="button"
                onClick={handleRunAIClassifier}
                disabled={isAnalyzingAi}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white text-xs font-bold shadow-sm shadow-blue-500/20 transition-all cursor-pointer disabled:opacity-50 active:scale-95"
              >
                <Wand2 className={`w-3.5 h-3.5 ${isAnalyzingAi ? 'animate-spin' : ''}`} />
                <span>{isAnalyzingAi ? 'AI判定中...' : '✨ AIテーマタグ判定'}</span>
              </button>
            </div>

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

            {/* AI Theme Classifier Result Box */}
            {aiResult && (
              <div className={`p-4 rounded-2xl border transition-all ${
                aiResult.isMatch 
                  ? 'bg-blue-50/70 border-blue-200 text-blue-900' 
                  : 'bg-gradient-to-br from-amber-50 to-orange-50/80 border-amber-300 text-amber-950 shadow-sm'
              }`}>
                {aiResult.isMatch ? (
                  <div className="flex items-start gap-2.5">
                    <Check className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                    <div className="flex-1 space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-black bg-blue-600 text-white px-2 py-0.5 rounded-full">
                          AI判定：既存テーマ合致（{aiResult.confidence}%）
                        </span>
                        <span className="text-xs font-bold text-blue-800">
                          {aiResult.matchedCategoryName}
                        </span>
                      </div>
                      <p className="text-xs text-blue-700">{aiResult.explanation}</p>
                      {aiResult.suggestedTags.length > 0 && (
                        <div className="flex flex-wrap items-center gap-1.5 pt-1">
                          <span className="text-[11px] text-blue-600 font-bold">推奨タグ:</span>
                          {aiResult.suggestedTags.map((tag, idx) => (
                            <span key={idx} className="text-[10px] bg-white border border-blue-200 text-blue-700 px-2 py-0.5 rounded-md font-medium">
                              #{tag}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                ) : (
                  <div className="space-y-3">
                    <div className="flex items-start gap-2.5">
                      <Sparkles className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5 animate-pulse" />
                      <div className="flex-1">
                        <div className="flex flex-wrap items-center gap-2 mb-1">
                          <span className="text-xs font-black bg-gradient-to-r from-amber-600 to-orange-600 text-white px-2.5 py-0.5 rounded-full shadow-xs">
                            ⚡ AI判定：既存テーマに非該当（新ジャンル発見！）
                          </span>
                          {addedNewTheme ? (
                            <span className="text-xs font-bold text-emerald-700 flex items-center gap-1">
                              <Check className="w-3.5 h-3.5" /> DDJに追加完了
                            </span>
                          ) : (
                            <span className="text-xs text-amber-700 font-medium">
                              既存の7テーマにはないユニークな切り口です
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-slate-700 leading-relaxed mb-2">
                          {aiResult.explanation}
                        </p>

                        {aiResult.suggestedNewTheme && (
                          <div className="bg-white/90 backdrop-blur-xs p-3 rounded-xl border border-amber-200 space-y-2">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-2">
                                <Tag className="w-4 h-4 text-amber-600" />
                                <span className="text-xs font-black text-slate-900">
                                  新設テーマタグ提案：
                                </span>
                                <span className="text-xs font-black text-blue-700 bg-blue-50 px-2 py-0.5 rounded-md border border-blue-200">
                                  🏷️ {aiResult.suggestedNewTheme.name}
                                </span>
                              </div>

                              {!addedNewTheme ? (
                                <button
                                  type="button"
                                  onClick={handleApplyNewCustomTheme}
                                  className="px-3 py-1.5 rounded-xl bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 text-white text-xs font-bold shadow-md shadow-orange-500/20 transition-all cursor-pointer active:scale-95 flex items-center gap-1.5"
                                >
                                  <Plus className="w-3.5 h-3.5" />
                                  <span>このテーマタグをDDJに追加して適用</span>
                                </button>
                              ) : (
                                <span className="px-2.5 py-1 rounded-lg bg-emerald-100 text-emerald-800 text-xs font-bold flex items-center gap-1">
                                  <FileCheck className="w-3.5 h-3.5" />
                                  追加・選択中
                                </span>
                              )}
                            </div>
                            <p className="text-[11px] text-slate-500">
                              {aiResult.suggestedNewTheme.description}
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Category */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  {t.createModal.category}
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value as TourCategory)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-xs text-slate-900 focus:outline-none focus:border-blue-500 focus:bg-white font-medium"
                >
                  <option value="music-sound">🎵 音楽・音風景・MOTTAINAI SOUND</option>
                  <option value="history-castle">🏯 歴史・城郭・新選組</option>
                  <option value="railway-train">🚃 鉄道・秘境駅・レトロ車両</option>
                  <option value="anime-pilgrimage">⛩️ アニメ・漫画・聖地巡礼</option>
                  <option value="retro-showa">☕ 昭和レトロ・古書店・純喫茶</option>
                  <option value="folklore-yokai">👻 妖怪・神話・民俗伝承</option>
                  <option value="oshikatsu-subculture">💖 推し活・アイドル・サブカル</option>
                  
                  {/* Dynamic Custom / AI Added Themes */}
                  {customThemes.length > 0 && (
                    <optgroup label="✨ 追加された新テーマタグ">
                      {customThemes.map((ct) => (
                        <option key={ct.id} value={ct.categoryKey}>
                          🏷️ {ct.name}
                        </option>
                      ))}
                    </optgroup>
                  )}

                  {addedNewTheme && !customThemes.some((ct) => ct.categoryKey === addedNewTheme.categoryKey) && (
                    <option value={addedNewTheme.categoryKey}>
                      🏷️ {addedNewTheme.name} (今追加したテーマ)
                    </option>
                  )}

                  <option value="custom">✨ 特注・カスタムテーマ</option>
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

            {/* Enhanced Image Selection & Upload Area */}
            <div className="space-y-3 pt-1">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                  <ImageIcon className="w-4 h-4 text-blue-600" />
                  <span>ツアーカバー画像</span>
                </label>

                {/* Tab Switcher */}
                <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl text-[11px] font-bold">
                  <button
                    type="button"
                    onClick={() => setImageTab('preset')}
                    className={`px-2.5 py-1 rounded-lg transition-all cursor-pointer ${
                      imageTab === 'preset' ? 'bg-white text-blue-600 shadow-xs' : 'text-slate-500 hover:text-slate-800'
                    }`}
                  >
                    🖼️ プリセット
                  </button>
                  <button
                    type="button"
                    onClick={() => setImageTab('upload')}
                    className={`px-2.5 py-1 rounded-lg transition-all cursor-pointer ${
                      imageTab === 'upload' ? 'bg-white text-blue-600 shadow-xs' : 'text-slate-500 hover:text-slate-800'
                    }`}
                  >
                    📁 アップロード
                  </button>
                  <button
                    type="button"
                    onClick={() => setImageTab('url')}
                    className={`px-2.5 py-1 rounded-lg transition-all cursor-pointer ${
                      imageTab === 'url' ? 'bg-white text-blue-600 shadow-xs' : 'text-slate-500 hover:text-slate-800'
                    }`}
                  >
                    🔗 URL指定
                  </button>
                </div>
              </div>

              {/* Large Real-time Image Preview */}
              <div className="relative w-full h-44 sm:h-52 rounded-2xl overflow-hidden border-2 border-slate-200 shadow-inner group bg-slate-900">
                <img
                  src={imageUrl}
                  alt="Tour Cover Preview"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  onError={(e) => {
                    // Fallback
                    (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&w=1200&q=80';
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent pointer-events-none" />
                <div className="absolute top-3 left-3 bg-black/60 backdrop-blur-md text-white text-[11px] font-bold px-2.5 py-1 rounded-full border border-white/20 flex items-center gap-1.5">
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                  <span>現在設定中のカバー画像</span>
                </div>
                {uploadSuccess && (
                  <div className="absolute top-3 right-3 bg-emerald-600 text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg flex items-center gap-1.5 animate-bounce">
                    <Check className="w-3.5 h-3.5" />
                    <span>アップロード成功！</span>
                  </div>
                )}
                <div className="absolute bottom-3 left-3 right-3 text-white text-xs font-bold truncate drop-shadow-md">
                  {title || 'ツアータイトル未設定'}
                </div>
              </div>

              {/* Tab 1: Visual Preset Chips with Thumbnails */}
              {imageTab === 'preset' && (
                <div className="space-y-2">
                  <div className="text-[11px] font-bold text-slate-500">
                    ワンクリックで高品質なカバー写真を設定できます（選択すると上にプレビュー反映）：
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    {presetImages.map((p, idx) => {
                      const isSelected = imageUrl === p.url;
                      return (
                        <button
                          key={idx}
                          type="button"
                          onClick={() => setImageUrl(p.url)}
                          className={`flex items-center gap-2 p-1.5 rounded-xl border text-left transition-all cursor-pointer ${
                            isSelected
                              ? 'bg-blue-50 border-blue-600 shadow-sm ring-2 ring-blue-500/30'
                              : 'bg-white border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                          }`}
                        >
                          <img
                            src={p.thumb}
                            alt={p.label}
                            className="w-10 h-10 rounded-lg object-cover flex-shrink-0"
                          />
                          <div className="min-w-0 flex-1">
                            <p className="text-xs font-bold text-slate-800 truncate">
                              {p.label}
                            </p>
                            {isSelected && (
                              <span className="text-[10px] text-blue-600 font-bold flex items-center gap-0.5">
                                <Check className="w-3 h-3" /> 選択中
                              </span>
                            )}
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Tab 2: File Upload (Drag & Drop + File Selector) */}
              {imageTab === 'upload' && (
                <div
                  onDragOver={(e) => { e.preventDefault(); e.stopPropagation(); }}
                  onDrop={handleFileDrop}
                  className="border-2 border-dashed border-blue-300 hover:border-blue-500 rounded-2xl p-6 text-center bg-blue-50/40 hover:bg-blue-50/80 transition-all cursor-pointer"
                  onClick={() => fileInputRef.current?.click()}
                >
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleImageFileUpload}
                    className="hidden"
                  />
                  <div className="flex flex-col items-center justify-center gap-2">
                    <div className="w-12 h-12 rounded-2xl bg-blue-600 text-white flex items-center justify-center shadow-lg shadow-blue-500/30">
                      <Upload className="w-6 h-6" />
                    </div>
                    <div>
                      <p className="text-xs sm:text-sm font-bold text-slate-800">
                        クリックして写真を選択 または ここにドラッグ＆ドロップ
                      </p>
                      <p className="text-[11px] text-slate-500 mt-0.5">
                        JPEG, PNG, WebP対応（PCやスマートフォンの撮影写真を直接使えます）
                      </p>
                    </div>
                    <button
                      type="button"
                      className="mt-1 px-4 py-1.5 rounded-xl bg-white border border-slate-200 text-xs font-bold text-slate-700 hover:bg-slate-50 shadow-xs pointer-events-none"
                    >
                      ファイルを選択
                    </button>
                  </div>
                </div>
              )}

              {/* Tab 3: URL Direct Input */}
              {imageTab === 'url' && (
                <div>
                  <input
                    type="text"
                    value={imageUrl}
                    onChange={(e) => setImageUrl(e.target.value)}
                    placeholder="https://images.unsplash.com/..."
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-blue-500 focus:bg-white"
                  />
                  <p className="text-[10px] text-slate-400 mt-1">
                    Web上の画像URLを貼り付けるとリアルタイムでプレビューに反映されます。
                  </p>
                </div>
              )}
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
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs sm:text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-500 focus:bg-white"
              />
            </div>
          </div>

          {/* Section 2: Itinerary Timeline */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-4">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-slate-100 pb-3">
              <div>
                <h3 className="text-sm font-bold text-indigo-700 uppercase tracking-wider flex items-center gap-1.5">
                  <span>02.</span> {t.createModal.step2}
                </h3>
                <p className="text-[11px] text-slate-500">
                  全工程を自由に追加・削除・並べ替え・書き換えできます。
                </p>
              </div>

              {/* Itinerary Quick Action Toolbar */}
              <div className="flex flex-wrap items-center gap-1.5">
                <button
                  type="button"
                  onClick={generateItineraryWithAI}
                  className="flex items-center gap-1 text-xs font-bold text-indigo-700 hover:text-indigo-800 px-3 py-1.5 rounded-xl bg-indigo-50 hover:bg-indigo-100 border border-indigo-200 transition-all cursor-pointer active:scale-95 shadow-xs"
                >
                  <Wand2 className="w-3.5 h-3.5 text-indigo-600" />
                  <span>✨ AI工程自動生成</span>
                </button>

                <button
                  type="button"
                  onClick={addItineraryStop}
                  className="flex items-center gap-1 text-xs font-bold text-blue-700 hover:text-blue-800 px-3 py-1.5 rounded-xl bg-blue-50 hover:bg-blue-100 border border-blue-200 transition-all cursor-pointer active:scale-95"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>{t.createModal.addSpot}</span>
                </button>

                {itinerary.length > 0 && (
                  <button
                    type="button"
                    onClick={clearItinerary}
                    className="flex items-center gap-1 text-xs font-bold text-slate-500 hover:text-rose-600 px-2.5 py-1.5 rounded-xl hover:bg-rose-50 border border-slate-200 hover:border-rose-200 transition-all cursor-pointer"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>クリア</span>
                  </button>
                )}
              </div>
            </div>

            {/* Itinerary Items List */}
            {itinerary.length === 0 ? (
              <div className="text-center py-10 bg-slate-50 rounded-2xl border-2 border-dashed border-slate-200 space-y-3">
                <p className="text-xs text-slate-500">工程が空です。「AI工程自動生成」または「工程を追加」してください。</p>
                <div className="flex items-center justify-center gap-2">
                  <button
                    type="button"
                    onClick={generateItineraryWithAI}
                    className="px-4 py-2 rounded-xl bg-indigo-600 text-white text-xs font-bold hover:bg-indigo-700 transition-colors shadow-sm cursor-pointer flex items-center gap-1.5"
                  >
                    <Wand2 className="w-3.5 h-3.5" />
                    <span>✨ テーマからAI自動生成</span>
                  </button>
                  <button
                    type="button"
                    onClick={addItineraryStop}
                    className="px-4 py-2 rounded-xl bg-white border border-slate-200 text-slate-700 text-xs font-bold hover:bg-slate-50 transition-colors cursor-pointer flex items-center gap-1.5"
                  >
                    <Plus className="w-3.5 h-3.5 text-blue-600" />
                    <span>空の工程を追加</span>
                  </button>
                </div>
              </div>
            ) : (
              <div className="space-y-3">
                {itinerary.map((stop, index) => (
                  <div key={index} className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-2.5 hover:border-slate-300 transition-colors">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <div className="flex items-center gap-2 flex-1">
                        <span className="w-6 h-6 rounded-full bg-indigo-600 text-white text-xs font-black flex items-center justify-center flex-shrink-0">
                          {index + 1}
                        </span>
                        <input
                          type="text"
                          placeholder="時間 (例: 10:30)"
                          value={stop.time}
                          onChange={(e) => updateItineraryStop(index, 'time', e.target.value)}
                          className="w-24 bg-white border border-slate-200 rounded-xl px-2.5 py-1.5 text-xs text-slate-900 font-bold focus:outline-none focus:border-blue-500"
                        />
                        <input
                          type="text"
                          placeholder="スポット名（例: 逗子・葉山駅 / 八木邸）"
                          value={stop.spotTitle}
                          onChange={(e) => {
                            updateItineraryStop(index, 'spotTitle', e.target.value);
                            updateItineraryStop(index, 'spotTitleEn', e.target.value);
                          }}
                          required
                          className="flex-1 bg-white border border-slate-200 rounded-xl px-3 py-1.5 text-xs text-slate-900 font-bold focus:outline-none focus:border-blue-500 placeholder-slate-400"
                        />
                      </div>

                      {/* Controls: Up, Down, Duplicate, DeepSpot toggle, Delete */}
                      <div className="flex items-center gap-1 self-end sm:self-auto">
                        <label className="flex items-center gap-1 text-[11px] text-rose-600 font-bold mr-2 cursor-pointer bg-white px-2 py-1 rounded-lg border border-slate-200">
                          <input
                            type="checkbox"
                            checked={stop.isDeepSpot}
                            onChange={(e) => updateItineraryStop(index, 'isDeepSpot', e.target.checked)}
                            className="accent-rose-600 cursor-pointer"
                          />
                          <span>★ 見どころ</span>
                        </label>

                        {/* Move Up */}
                        <button
                          type="button"
                          onClick={() => moveItineraryStop(index, 'up')}
                          disabled={index === 0}
                          className="p-1.5 rounded-lg text-slate-500 hover:text-slate-800 hover:bg-white disabled:opacity-30 cursor-pointer"
                          title="上へ移動"
                        >
                          ↑
                        </button>
                        {/* Move Down */}
                        <button
                          type="button"
                          onClick={() => moveItineraryStop(index, 'down')}
                          disabled={index === itinerary.length - 1}
                          className="p-1.5 rounded-lg text-slate-500 hover:text-slate-800 hover:bg-white disabled:opacity-30 cursor-pointer"
                          title="下へ移動"
                        >
                          ↓
                        </button>

                        {/* Duplicate */}
                        <button
                          type="button"
                          onClick={() => duplicateItineraryStop(index)}
                          className="p-1.5 rounded-lg text-slate-500 hover:text-blue-600 hover:bg-white cursor-pointer"
                          title="複製"
                        >
                          <Plus className="w-3.5 h-3.5" />
                        </button>

                        {/* Delete */}
                        <button
                          type="button"
                          onClick={() => removeItineraryStop(index)}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-white cursor-pointer"
                          title="削除"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    <textarea
                      rows={2}
                      placeholder="このスポットでの見どころ、オタク解説、聴きどころ、撮影アングルなど自由に書き換えてください"
                      value={stop.description}
                      onChange={(e) => {
                        updateItineraryStop(index, 'description', e.target.value);
                        updateItineraryStop(index, 'descriptionEn', e.target.value);
                      }}
                      className="w-full bg-white border border-slate-200 rounded-xl p-2.5 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-500"
                    />
                  </div>
                ))}
              </div>
            )}
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
