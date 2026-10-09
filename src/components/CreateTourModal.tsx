import React, { useState, useRef, useEffect } from 'react';
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
  FileCheck,
  Edit3,
  GraduationCap
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
  initialTour?: Tour | null;
  onTourUpdated?: (updatedTour: Tour) => void;
  customThemes?: CustomTheme[];
  onAddCustomTheme?: (newTheme: CustomTheme) => void;
}

export const CreateTourModal: React.FC<CreateTourModalProps> = ({
  isOpen,
  onClose,
  lang,
  onTourCreated,
  initialTour = null,
  onTourUpdated,
  customThemes = [],
  onAddCustomTheme,
}) => {
  if (!isOpen) return null;
  const t = translations[lang];
  const isEditMode = Boolean(initialTour);

  // Form states
  const [title, setTitle] = useState('');
  const [catchphrase, setCatchphrase] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState<TourCategory>('anime-pilgrimage');
  const [area, setArea] = useState('');
  const [otakuLevel, setOtakuLevel] = useState<1 | 2 | 3 | 4 | 5>(3);
  const [durationHours, setDurationHours] = useState<number | ''>(3.5);
  const [price, setPrice] = useState<number | ''>(6500);
  const [maxParticipants, setMaxParticipants] = useState<number | ''>(6);
  const [languagesInput, setLanguagesInput] = useState<string>('日本語, English');
  const [imageUrl, setImageUrl] = useState<string>(
    'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=1200&q=80'
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
  const [mustBringInput, setMustBringInput] = useState('歩きやすい靴, カメラ・スマホ, 推しグッズやメモ帳');
  const [meetingPoint, setMeetingPoint] = useState('');
  const [guideName, setGuideName] = useState('ガイド');
  const [guideBio, setGuideBio] = useState('この作品・カルチャーと街並みが大好きで10年通い詰めています！知られざるディープな熱量をお届けします。');
  const [guideYears, setGuideYears] = useState<number | ''>(10);

  // Online Talk Session configuration states
  const [enableTalkSession, setEnableTalkSession] = useState(true);
  const [talkPrice30m, setTalkPrice30m] = useState<number | ''>(3000);
  const [talkPrice60m, setTalkPrice60m] = useState<number | ''>(5500);
  const [talkTopicsInput, setTalkTopicsInput] = useState('事前作戦会議・ルート相談, マニアック機材・書籍相談, 自由オタクトーク');

  // Globis & MBA Fieldwork Project state
  const [isGlobisProject, setIsGlobisProject] = useState(Boolean(initialTour?.isGlobisProject));
  const [globisBatch, setGlobisBatch] = useState(initialTour?.globisDetails?.batchOrAffiliation || 'グロービス東京校 2024期');
  const [globisTheme, setGlobisTheme] = useState(initialTour?.globisDetails?.businessTheme || '地方創生・事業承継ビジネスモデル探訪');
  const [globisNetworking, setGlobisNetworking] = useState(initialTour?.globisDetails?.networkingSession ?? true);

  // One-click Globis & MBA Fieldwork Template Applicator
  const applyGlobisTemplate = () => {
    setCategory('business-fieldwork');
    setIsGlobisProject(true);
    setTitle('【Globis生企画・地方創生】老舗暖簾の事業承継と新旧ビジネスモデル現地比較フィールドワーク');
    setCatchphrase('グロービス生×地域起業家が案内！創業100年企業と新規事業ブルワリーから学ぶ実践スタディ');
    setDescription('グロービス経営大学院（MBA）生が企画した実践型フィールドワークツアー！地域の伝統産業における事業承継のリアルと、空き家再生マイクロビジネスの収支構造を現地視察。現場オーナーとの直接対話、財務・サプライチェーンの工夫を検証し、ツアー最後にはネットワーキング＆事業構想ラップアップを行います。');
    setArea('神奈川・小田原 / または希望の地域');
    setOtakuLevel(3);
    setDurationHours(4.5);
    setPrice(8500);
    setMaxParticipants(8);
    setMeetingPoint('現地主要駅 改札前');
    setMustBringInput('名刺, メモ帳・筆記用具, 歩きやすい靴, 旺盛な知的好奇心');
    setRecommendedPrep('訪問地域の産業動向・地方創生ビジョンに軽く目を通しておくとより深い議論ができます！');
    if (guideName === 'ガイド' || !guideName) {
      setGuideName('グロービスMBA生有志');
    }
    setGuideBio('グロービス経営大学院にて事業構想・地方創生を研究。「教科書的なMBA理論を、リアルな現場の泥臭い事業と結びつける」をモットーにフィールドワークを主宰。');
    setGuideYears(5);
    setImageUrl('https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&w=1200&q=80');
    setItinerary([
      {
        id: 'itinerary-globis-1',
        time: '13:00',
        spotTitle: '現地集合＆本日のフィールドワーク着眼点ブリーフィング',
        spotTitleEn: 'Meet & Case Study Briefing',
        description: '地域の歴史的産業構造と本日の検証課題（事業承継・参入障壁・エコシステム）を概観。',
        descriptionEn: 'Introduction to local industry history and setting key business inquiry questions.',
      },
      {
        id: 'itinerary-globis-2',
        time: '13:45',
        spotTitle: '創業100年の老舗企業視察＆後継者オーナーとの直接対話',
        spotTitleEn: 'Historic Business Visit & Successor Interview',
        description: '伝統製法の維持と若者向け新ブランド立ち上げの葛藤、サプライチェーンの工夫をヒアリング。',
        descriptionEn: 'Interview with the successor on balancing artisanal heritage with modern retail pivoting.',
        isDeepSpot: true,
      },
      {
        id: 'itinerary-globis-3',
        time: '15:15',
        spotTitle: '古民家リノベーション新規事業拠点・地域エコシステム見学',
        spotTitleEn: 'Heritage Space Revitalization & Venture Visit',
        description: '空き家再生の初期投資回収モデルと、地元産原料調達エコシステムの現場を分析。',
        descriptionEn: 'Analysis of capital expenditure payback model and local raw ingredient procurement.',
        isDeepSpot: true,
      },
      {
        id: 'itinerary-globis-4',
        time: '16:45',
        spotTitle: 'カフェまたはブルワリーでのネットワーキング＆事業構想ラップアップ',
        spotTitleEn: 'Networking & Business Model Wrap-up',
        description: '参加者全員で本日の学びを共有し、各自の事業や専門領域への応用ディスカッション。',
        descriptionEn: 'Intimate reflection session with drinks. Discuss takeaways for each participant\'s venture.',
      },
    ]);
    confetti({
      particleCount: 90,
      spread: 70,
      origin: { y: 0.5 },
      colors: ['#4f46e5', '#3b82f6', '#10b981'],
    });
  };

  // Dynamic placeholder examples tailored to the selected theme
  const categoryHints: Record<string, {
    title: string;
    catchphrase: string;
    area: string;
    prep: string;
    spot: string;
    meeting: string;
  }> = {
    'business-fieldwork': {
      title: '例: 【地方創生フィールドワーク】小田原かまぼこ通りの事業承継とクラフトビール探訪',
      catchphrase: '例: MBA生と歩く！老舗の暖簾再生と新規事業のビジネスモデル現地検証。',
      area: '例: 神奈川・小田原 / 東京・秋葉原 / 埼玉・川越 / 長野・小布施',
      prep: '例: 訪問地域の産業動向や観光白書に軽く目を通しておく',
      spot: 'スポット名（例: 創業160年のかまぼこ老舗 / 箱根口古民家ブルワリー）',
      meeting: '例: 小田原駅 東口改札前',
    },
    'anime-pilgrimage': {
      title: '例: 【聖地巡礼】『ぼっち・ざ・ろっく！』下北沢の舞台と音楽カルチャー巡り',
      catchphrase: '例: 作中完全一致の画角撮影と、モデルとなったライブハウス街を巡る熱狂の半日。',
      area: '例: 東京・下北沢 / 岐阜・飛騨高山 / 埼玉・秩父',
      prep: '例: アニメ第1期、または原作コミック1〜2巻の履修',
      spot: 'スポット名（例: 下北沢SHELTER前 / 本多劇場横路地 / 作中モデル喫茶）',
      meeting: '例: 下北沢駅 中央口改札前',
    },
    'retro-showa': {
      title: '例: 【昭和ノスタルジー】神保町・路地裏の老舗純喫茶と絶版古書ディグり散歩',
      catchphrase: '例: ネルドリップ珈琲の香りと、昭和の面影が色濃く残る看板建築を巡る。',
      area: '例: 東京・神保町 / 東京・谷中・根津 / 大阪・中崎町',
      prep: '例: 昭和カルチャーへの興味、読みたい本や雑誌のジャンル',
      spot: 'スポット名（例: 神保町さぼうる / すずらん通り古書店街 / 看板建築の路地）',
      meeting: '例: 神保町駅 A7出口前',
    },
    'oshikatsu-subculture': {
      title: '例: 【秋葉原深層】知る人ぞ知るディープな中古レア品フロア巡り＆推し活映えツアー',
      catchphrase: '例: 一般観光では絶対に見つけられない雑居ビルの名店と専用フォトブースへ。',
      area: '例: 東京・秋葉原 / 東京・中野ブロードウェイ / 大阪・日本橋',
      prep: '例: あなたの「推し」の名前・推しカラー',
      spot: 'スポット名（例: ラジオ会館裏ディープフロア / 推し色カスタムカフェ）',
      meeting: '例: JR秋葉原駅 電気街口改札前',
    },
    'folklore-yokai': {
      title: '例: 【怪異と伝承】一条戻橋から清明神社へ〜日常の裏に潜む異界の境界歩き〜',
      catchphrase: '例: 古文書に刻まれた結界と、妖怪伝説の痕跡を夕暮れ時に辿る。',
      area: '例: 京都・洛北 / 岩手・遠野 / 鳥取・境港',
      prep: '例: 日本の妖怪・民俗伝承への知的好奇心',
      spot: 'スポット名（例: 一条戻橋の欄干 / 晴明神社・桔梗庵 / 境界の道祖神）',
      meeting: '例: 烏丸今出川駅 2番出口前',
    },
    'music-sound': {
      title: '例: 【音風景サンプリング】鎌倉の潮騒・竹林の風音・水琴窟フィールドレコーディング',
      catchphrase: '例: バイノーラルマイクで集音する、日本の美しい環境音と即興セッション。',
      area: '例: 神奈川・鎌倉・逗子 / 京都・嵯峨野',
      prep: '例: お気に入りのイヤホンまたはヘッドホン',
      spot: 'スポット名（例: 逗子海岸の波打ち際 / 竹林の小径 / 水琴窟のある日本庭園）',
      meeting: '例: 鎌倉駅 東口改札前',
    },
    'railway-train': {
      title: '例: 【江ノ電極限探訪】民家軒先スレスレ走行と海辺の単線すれ違い鑑賞',
      catchphrase: '例: ダイヤグラムの秘密と、知られざる引退車両の面影を巡る鉄道旅。',
      area: '例: 神奈川・江ノ島・鎌倉 / 静岡・大井川',
      prep: '例: カメラ、1日乗車券の準備',
      spot: 'スポット名（例: 腰越〜江ノ島間 路面併用区間 / 鎌倉高校前駅）',
      meeting: '例: 藤沢駅 江ノ電改札口前',
    },
    'history-castle': {
      title: '例: 【城郭構造オタクと行く】石垣の刻印と横矢掛かりを読み解く小田原城探訪',
      catchphrase: '例: 観光客が見落とす土塁・空堀・武者返しを軍事視点で完全解説。',
      area: '例: 神奈川・小田原 / 京都・壬生・祇園 / 岐阜・関ヶ原',
      prep: '例: 戦国武将または幕末の歴史への興味',
      spot: 'スポット名（例: 小田原城 天守裏石垣 / 八幡山古郭 / 本丸土塁）',
      meeting: '例: 小田原駅 東口城址公園側',
    },
  };

  const activeHint = categoryHints[category] || categoryHints['anime-pilgrimage'];

  // Dynamic itinerary stops with unique stable IDs
  interface EditableItineraryItem extends ItineraryItem {
    id: string;
  }

  const [itinerary, setItinerary] = useState<EditableItineraryItem[]>([
    {
      id: 'step-init-1',
      time: '10:00',
      spotTitle: '集合場所にて合流＆本日の探訪ブリーフィング',
      spotTitleEn: 'Meeting & Tour Briefing',
      description: '当日のルート説明と参加者の興味のあるポイントをヒアリング。',
      descriptionEn: 'Orientation and tailored route overview.',
      isDeepSpot: false,
    },
    {
      id: 'step-init-2',
      time: '11:15',
      spotTitle: 'メイン聖地・ディープ名所探訪',
      spotTitleEn: 'Main Highlight & Culture Spot Exploration',
      description: '一般の観光客が素通りしてしまう作中アングルや、街のディープなカルチャーの核心を案内。',
      descriptionEn: 'Deep insider lore and specialized perspectives that general tourists easily miss.',
      isDeepSpot: true,
    },
    {
      id: 'step-init-3',
      time: '12:30',
      spotTitle: '老舗純喫茶・ローカル名店で休憩＆オタクトーク',
      spotTitleEn: 'Local Rest, Retro Cafe & Cultural Chat',
      description: '地元の人しか知らない名物や軽食を楽しみながら、作品やカルチャーへの愛を熱く語り合う。',
      descriptionEn: 'Authentic local treats and passionate cultural talks.',
      isDeepSpot: false,
    },
    {
      id: 'step-init-4',
      time: '14:00',
      spotTitle: 'クライマックス聖地・ハイライトスポット＆現地解散',
      spotTitleEn: 'Climax Landmark & Farewell',
      description: '旅の総括と、次回の聖地巡礼・探訪に役立つマニアックなおすすめ情報交換。',
      descriptionEn: 'Summary and curated tips for future explorations.',
      isDeepSpot: true,
    },
  ]);

  // Load existing tour data when opening in edit mode
  useEffect(() => {
    if (initialTour) {
      setTitle(initialTour.title || '');
      setCatchphrase(initialTour.catchphrase || '');
      setDescription(initialTour.description || '');
      setCategory(initialTour.category || 'anime-pilgrimage');
      setArea(initialTour.area || '');
      setOtakuLevel(initialTour.otakuLevel || 3);
      setDurationHours(initialTour.durationHours ?? 3.5);
      setPrice(initialTour.price ?? 6500);
      setMaxParticipants(initialTour.maxParticipants ?? 6);
      setLanguagesInput(initialTour.languages ? initialTour.languages.join(', ') : '日本語, English');
      setImageUrl(initialTour.imageUrl || '');
      setRecommendedPrep(initialTour.recommendedPreparation || '');
      setMustBringInput(initialTour.mustBring ? initialTour.mustBring.join(', ') : '歩きやすい靴, カメラ');
      setMeetingPoint(initialTour.meetingPoint || '');
      setGuideName(initialTour.guide?.name || 'ガイド');
      setGuideBio(initialTour.guide?.bio || '');
      setGuideYears(initialTour.guide?.otakuYears ?? 5);
      if (initialTour.talkSessionConfig) {
        setEnableTalkSession(Boolean(initialTour.talkSessionConfig.enabled));
        setTalkPrice30m(initialTour.talkSessionConfig.price30m ?? 3000);
        setTalkPrice60m(initialTour.talkSessionConfig.price60m ?? 5500);
        setTalkTopicsInput(initialTour.talkSessionConfig.topics ? initialTour.talkSessionConfig.topics.join(', ') : '');
      }
      if (initialTour.itinerary && initialTour.itinerary.length > 0) {
        setItinerary(
          initialTour.itinerary.map((item, idx) => ({
            ...item,
            id: `step-edit-${idx}-${Date.now()}`,
          }))
        );
      }
    }
  }, [initialTour, isOpen]);

  const addItineraryStop = () => {
    const nextHour = 10 + itinerary.length;
    const timeStr = `${nextHour.toString().padStart(2, '0')}:00`;
    setItinerary((prev) => [
      ...prev,
      {
        id: `step-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
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
    setItinerary((prev) => prev.filter((_, i) => i !== index));
  };

  const clearItinerary = () => {
    setItinerary([]);
  };

  const moveItineraryStop = (index: number, direction: 'up' | 'down') => {
    setItinerary((prev) => {
      if (direction === 'up' && index === 0) return prev;
      if (direction === 'down' && index === prev.length - 1) return prev;
      const targetIndex = direction === 'up' ? index - 1 : index + 1;
      const updated = [...prev];
      const temp = updated[index];
      updated[index] = updated[targetIndex];
      updated[targetIndex] = temp;
      return updated;
    });
  };

  const duplicateItineraryStop = (index: number) => {
    setItinerary((prev) => {
      const target = prev[index];
      if (!target) return prev;
      const updated = [...prev];
      updated.splice(index + 1, 0, {
        ...target,
        id: `step-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
        spotTitle: target.spotTitle ? `${target.spotTitle} (続き)` : '',
        spotTitleEn: target.spotTitleEn ? `${target.spotTitleEn} (cont.)` : '',
      });
      return updated;
    });
  };

  // Atomic, rock-solid functional updater that never loses values during input
  const updateItineraryStop = (index: number, fields: Partial<ItineraryItem>) => {
    setItinerary((prev) => {
      const updated = [...prev];
      if (updated[index]) {
        updated[index] = { ...updated[index], ...fields };
      }
      return updated;
    });
  };

  // Extract key topic/work title from user's tour title
  const extractKeyTopic = (rawTitle: string, defaultTopic: string = '作品・テーマ'): string => {
    if (!rawTitle) return defaultTopic;
    const bracketMatch = rawTitle.match(/[『「【](.+?)[』」】]/);
    if (bracketMatch && bracketMatch[1]) {
      return bracketMatch[1].trim();
    }
    const parts = rawTitle.split(/[・/:\s|｜―〜-]/).map((s) => s.trim()).filter(Boolean);
    if (parts.length > 0 && parts[0].length >= 2) {
      return parts[0];
    }
    return rawTitle.slice(0, 15);
  };

  // AI-generated itinerary tailored to current theme/title
  const generateItineraryWithAI = () => {
    const context = `${title} ${description} ${category} ${area}`.toLowerCase();
    const keyTopic = extractKeyTopic(title, area || '探訪テーマ');
    const targetArea = area || '現地';

    const wrapWithIds = (rawItems: Array<Omit<EditableItineraryItem, 'id'>>): EditableItineraryItem[] => {
      const now = Date.now();
      return rawItems.map((item, idx) => ({
        ...item,
        id: `step-ai-${now}-${idx}-${Math.random().toString(36).substring(2, 6)}`,
      }));
    };

    // 1. アニメ・漫画・聖地巡礼
    if (
      category === 'anime-pilgrimage' ||
      context.includes('アニメ') ||
      context.includes('聖地') ||
      context.includes('漫画') ||
      context.includes('作中') ||
      context.includes('巡礼') ||
      context.includes('コミケ') ||
      context.includes('コスプレ')
    ) {
      setItinerary(wrapWithIds([
        {
          time: '10:00',
          spotTitle: `${targetArea}集合＆聖地巡礼マップ・カット対照シート配布`,
          spotTitleEn: 'Meeting & Pilgrimage Scene Comparison Sheet Briefing',
          description: `『${keyTopic}』の作中登場シーンと現地の画角・レンズ焦点距離の一致ポイントを事前レクチャー。マナーを守った聖地探訪の心得を共有。`,
          descriptionEn: 'Scene comparison sheet handout and angle briefing for respectful pilgrimage photography.',
          isDeepSpot: false,
        },
        {
          time: '11:15',
          spotTitle: `『${keyTopic}』キービジュアル＆OP登場カット完全再現スポット`,
          spotTitleEn: 'Key Visual & OP Cut Exact Frame Reproduction Spot',
          description: 'ファンの間でも特定難易度が高いとされる画角から、作中の光の差し込みや背景ビル・坂道のパースを完全一致で撮影検証。',
          descriptionEn: 'Mastering the exact camera height and sunlight angle from the iconic opening scene.',
          isDeepSpot: true,
        },
        {
          time: '13:00',
          spotTitle: '作中モデル喫茶・聖地巡礼ノート記帳＆限定コラボ再現ランチ',
          spotTitleEn: 'Model Cafe Rest, Fan Pilgrimage Notebook & Themed Lunch',
          description: '主人公たちが立ち寄ったとされる老舗喫茶にて同じメニューを注文。歴代ファンが紡いできた巡礼ノートに今日の思い出を記帳。',
          descriptionEn: 'Sampling the exact menu item featured in the series and leaving a heartfelt entry in the guest notebook.',
          isDeepSpot: false,
        },
        {
          time: '14:45',
          spotTitle: '物語クライマックスの舞台・黄昏時の名シーン鑑賞＆現地解散',
          spotTitleEn: 'Climax Narrative Backdrop at Golden Hour & Farewell',
          description: '作中のエモーショナルな名セリフが生まれた夕景のスポットで締めくくり。参加者同士で胸熱な考察を語り合って解散。',
          descriptionEn: 'Standing at the pivotal climax location under the evening glow, sharing passionate story theories.',
          isDeepSpot: true,
        },
      ]));
    }
    // 2. 昭和レトロ・古書店・純喫茶
    else if (
      category === 'retro-showa' ||
      context.includes('昭和') ||
      context.includes('レトロ') ||
      context.includes('純喫茶') ||
      context.includes('古書') ||
      context.includes('古本') ||
      context.includes('名曲喫茶') ||
      context.includes('レコード')
    ) {
      setItinerary(wrapWithIds([
        {
          time: '09:45',
          spotTitle: `${targetArea}駅集合・昭和看板建築＆街並み変遷ガイダンス`,
          spotTitleEn: 'Meeting & Showa Signboard Architecture Orientation',
          description: `銅板葺きの看板建築やモルタル装飾など、昭和の職人が遺した意匠の見どころを古地図と照らし合わせて解説。`,
          descriptionEn: 'Comparing pre-war architectural ornaments and copper sign facades with historic map sheets.',
          isDeepSpot: false,
        },
        {
          time: '10:30',
          spotTitle: '創業半世紀の老舗純喫茶モーニング（銅製マグと厚切りトースト）',
          spotTitleEn: 'Historic Pure Cafe Morning (Copper Mug Coffee & Thick Toast)',
          description: 'ネルドリップの芳醇な珈琲と名物メニューを味わいながら、マスターから街の変遷と当時の文化人の逸話を聞く。',
          descriptionEn: 'Velvety flannel-drip coffee served in ice-cold hammered copper mugs alongside nostalgic local lore.',
          isDeepSpot: true,
        },
        {
          time: '12:30',
          spotTitle: '路地裏古書店街・絶版サブカル本＆稀覯本ディグりツアー',
          spotTitleEn: 'Alleyway Antiquarian Bookshops & Rare Subculture Digging',
          description: '普通は通り過ぎてしまう極小古書店の奥棚から、昭和カルチャー誌や初版本・豆本を発掘する極意を案内。',
          descriptionEn: 'Unearthing out-of-print subculture magazines and vintage first editions in hidden bookstore stacks.',
          isDeepSpot: true,
        },
        {
          time: '15:00',
          spotTitle: '名曲喫茶の巨大蓄音機・真空管アンプ鑑賞＆戦利品読書会',
          spotTitleEn: 'Meikyoku Audio Lounge, Vacuum Tube Warmth & Reading Wrap-up',
          description: '重厚な木製スピーカーから流れるクラシックやジャズの生音に身を委ね、今日購入した本を開いて語り合う至福の時間。',
          descriptionEn: 'Immersing in vintage vacuum tube acoustics while leafing through today\'s curated vintage discoveries.',
          isDeepSpot: false,
        },
      ]));
    }
    // 3. 推し活・アイドル・サブカル
    else if (
      category === 'oshikatsu-subculture' ||
      context.includes('推し') ||
      context.includes('アイドル') ||
      context.includes('サブカル') ||
      context.includes('オタク') ||
      context.includes('アキバ') ||
      context.includes('中野') ||
      context.includes('アクスタ') ||
      context.includes('同人')
    ) {
      setItinerary(wrapWithIds([
        {
          time: '11:00',
          spotTitle: `${targetArea}集合＆本日のオタ活・遠征マップ作戦会議`,
          spotTitleEn: 'Meeting & Subculture Hunt Strategy Briefing',
          description: `『${keyTopic}』の限定グッズ在庫状況や掘り出し物ビルの回る順序をガイドが綿密にプランニング。`,
          descriptionEn: 'Optimizing today\'s shop crawl route for rare items, capsule toys, and limited edition drops.',
          isDeepSpot: false,
        },
        {
          time: '12:00',
          spotTitle: '一見さんお断り級の雑居ビル・超ディープな中古レア品フロア巡り',
          spotTitleEn: 'Hidden Multi-tenant Building & Hard-to-Find Collectibles Den',
          description: 'ネットではプレミア価格がついた絶版グッズや生写真、同人誌が眠る穴場ショップをガイド同伴で潜入探索。',
          descriptionEn: 'Navigating maze-like back alleys to unearth rare figurines, vintage idol goods, and collector gems.',
          isDeepSpot: true,
        },
        {
          time: '14:00',
          spotTitle: '推し色カスタムカフェ＆アクスタ・ぬい専用撮影ブース体験',
          spotTitleEn: 'Oshi-Color Custom Drink & Acrylic Stand Photo Shootout',
          description: '推しのイメージカラーに合わせた特製ドリンクを片手に、ミニチュア背景が充実した専用ブースで記念撮影。',
          descriptionEn: 'Coordinating photo ops for acrylic stands and plushies with vibrant color-matched beverages.',
          isDeepSpot: false,
        },
        {
          time: '16:00',
          spotTitle: 'オタク専用コミュニティラウンジにて戦利品開封の儀＆布教解散',
          spotTitleEn: 'Loot Unboxing Ceremony, Passionate Presentation & Farewell',
          description: '今日手に入れた推しグッズを並べて熱く語り合い、互いの「推し愛」を称え合う最高潮のエンディング。',
          descriptionEn: 'Sharing today\'s prize haul with fellow superfans, exchanging deep trivia and mutual love.',
          isDeepSpot: true,
        },
      ]));
    }
    // 4. 妖怪・怪談・民俗伝承
    else if (
      category === 'folklore-yokai' ||
      context.includes('妖怪') ||
      context.includes('怪談') ||
      context.includes('民俗') ||
      context.includes('神話') ||
      context.includes('伝承') ||
      context.includes('奇祭') ||
      context.includes('もののけ') ||
      context.includes('結界') ||
      context.includes('異界')
    ) {
      setItinerary(wrapWithIds([
        {
          time: '13:30',
          spotTitle: `${targetArea}集合・結界の境界と異界伝承オリエンテーション`,
          spotTitleEn: 'Meeting & Folklore Boundary Legends Orientation',
          description: `この土地に伝わる古文書や怪異譚を広げ、日常と異界の境界線がどこに引かれていたのかを紐解く。`,
          descriptionEn: 'Unraveling boundary stones, taboo zones, and centuries-old local spirit lore.',
          isDeepSpot: false,
        },
        {
          time: '14:30',
          spotTitle: '妖怪のモデルとなった禁足地・古い祠と名もなき石碑群の探索',
          spotTitleEn: 'Forbidden Grove, Mysterious Yokai Shrine & Unmarked Stelae',
          description: '現代の地図からは消えた旧街道の分かれ道に残る道祖神や、かつて畏れられた祠の碑文をガイドが解読。',
          descriptionEn: 'Deciphering ancient stone carvings dedicated to pacifying capricious regional spirits.',
          isDeepSpot: true,
        },
        {
          time: '16:15',
          spotTitle: '語り部の茶屋にて郷土菓子と怪奇民話の生語り鑑賞',
          spotTitleEn: 'Storyteller Teahouse: Traditional Confection & Spoken Folk Tales',
          description: '素朴な地元のお茶と菓子を味わいながら、土地の長老や語り部が口伝で残してきた生々しい伝承に聞き入る。',
          descriptionEn: 'Intimate storytelling session by an elder, narrating spine-chilling oral history over green tea.',
          isDeepSpot: false,
        },
        {
          time: '17:45',
          spotTitle: '黄昏の逢魔が時・百鬼夜行の通り道フィールドワーク＆解散',
          spotTitleEn: 'Twilight Witching Hour Field Walk & Boundary Farewell',
          description: '昼と夜が入れ替わる最も神秘的な時刻に、伝承の舞台となった坂道や辻に立ち、歴史の影を体感して解散。',
          descriptionEn: 'Experiencing the eerie beauty of the fading daylight along historic spiritual crossroads.',
          isDeepSpot: true,
        },
      ]));
    }
    // 5. 音楽・音風景・MOTTAINAI SOUND
    else if (
      category === 'music-sound' ||
      context.includes('音') ||
      context.includes('音楽') ||
      context.includes('sound') ||
      context.includes('バイノーラル')
    ) {
      setItinerary(wrapWithIds([
        {
          time: '10:00',
          spotTitle: `${targetArea}集合＆ハイレゾレコーダー操作・バイノーラル集音レクチャー`,
          spotTitleEn: 'Meeting & Audio Equipment Briefing',
          description: 'バイノーラルマイクと高性能ポータブルレコーダーのセッティングと、微細な環境音を捉える耳のチューニングを解説。',
          descriptionEn: 'Setting up high-res mics and binaural listening gear.',
          isDeepSpot: false,
        },
        {
          time: '11:00',
          spotTitle: `${targetArea}の風音・水音・足音のフィールドレコーディング`,
          spotTitleEn: 'Field Recording: Wind, Water & Ambient Soundscapes',
          description: '風に擦れる木々の葉音、石畳の反響音、水滴の残響など、普段聞き逃している繊細な音のテクスチャをサンプリング。',
          descriptionEn: 'Sampling delicate natural textures and historic reverberations.',
          isDeepSpot: true,
        },
        {
          time: '13:00',
          spotTitle: '水琴窟または暗渠の反響音が響く隠れスポット探訪',
          spotTitleEn: 'Hidden Underground Echo Chamber & Suikinkutsu Water Bells',
          description: '地中深くから反響する天然の水滴音や、街の下を流れる水路の共鳴を静寂の中でじっくり採集。',
          descriptionEn: 'Capturing subterranean water chimes and whispering acoustic enclosures.',
          isDeepSpot: true,
        },
        {
          time: '15:30',
          spotTitle: 'リスニングルームにて採集音源とアコースティック即興セッション＆解散',
          spotTitleEn: 'Studio Listening & Acoustic Jam Session',
          description: '今日録音したばかりの環境音にガイドが旋律を重ね、参加者全員でひとつの音響作品として完成させて音源データを共有。',
          descriptionEn: 'Synthesizing captured sounds with live acoustic music and exporting master audio tracks.',
          isDeepSpot: true,
        },
      ]));
    }
    // 6. 鉄道・秘境駅・レトロ車両
    else if (
      category === 'railway-train' ||
      context.includes('鉄道') ||
      context.includes('江ノ電') ||
      context.includes('駅') ||
      context.includes('電車') ||
      context.includes('廃線')
    ) {
      setItinerary(wrapWithIds([
        {
          time: '09:45',
          spotTitle: `${targetArea}駅集合＆1日乗車券・ダイヤグラム時刻表読み解きレクチャー`,
          spotTitleEn: 'Meeting & Single-Track Railway Schedule Briefing',
          description: '単線運転の交換ダイヤの仕組みと、おすすめの撮影・鑑賞ポイントを線路平面図で徹底確認。',
          descriptionEn: 'Single-track railway schedule briefing, passing loop logistics, and line safety etiquette.',
          isDeepSpot: false,
        },
        {
          time: '10:30',
          spotTitle: '民家の軒先スレスレを通過する迫力の併用軌道・路面区間探訪',
          spotTitleEn: 'Narrow Street Promenade & Street Running Tramway',
          description: '家屋の庇と車体が数センチの至近距離をすり抜ける名物区間を、安全なベストポジションで体感。',
          descriptionEn: 'Thrilling residential tramway skimming between traditional shop eaves.',
          isDeepSpot: true,
        },
        {
          time: '12:30',
          spotTitle: '海・山を臨む単線駅・スプリングポイント転換音とすれ違い退避の鑑賞',
          spotTitleEn: 'Scenic Passing Station & Switch Track Mechanism Observation',
          description: 'スプリングポイントの転換金属音や通票閉塞機の面影など、鉄道ファン垂涎の機構を解説。',
          descriptionEn: 'Watching train crossing operations, point blade clicks, and scenic coastline curves.',
          isDeepSpot: true,
        },
        {
          time: '15:00',
          spotTitle: '旧型レトロ車両の保存展示・引退車両の木造内装鑑賞＆解散',
          spotTitleEn: 'Vintage Rolling Stock Heritage Spot & Farewell',
          description: '木造ニス塗り床や丸型白熱灯を間近で観察し、鉄道談義で締めくくり。',
          descriptionEn: 'Admiring classic wooden interiors and distinctive vintage control consoles.',
          isDeepSpot: false,
        },
      ]));
    }
    // 7. 廃墟・近代化産業遺産
    else if (
      context.includes('廃墟') ||
      context.includes('産業') ||
      context.includes('遺産') ||
      context.includes('鉱山') ||
      context.includes('炭鉱') ||
      context.includes('軍艦島')
    ) {
      setItinerary(wrapWithIds([
        {
          time: '09:30',
          spotTitle: `${targetArea}集合＆近代化遺産ヘルメット・ライト点検`,
          spotTitleEn: 'Gathering & Industrial Heritage Safety Gear Check',
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
          spotTitle: '旧トロッコ軌道跡と封鎖された坑口モニュメント',
          spotTitleEn: 'Abandoned Narrow Gauge Tracks & Sealed Mine Shaft',
          description: '木々の間に残る錆びたレールと、地下深くに続いていた坑口の遺構を間近で見学。',
          descriptionEn: 'Rusting narrow-gauge tracks winding through serene woods.',
          isDeepSpot: true,
        },
        {
          time: '15:00',
          spotTitle: '遺構を一望する高台展望地にて振り返り＆解散',
          spotTitleEn: 'Panoramic Viewpoint & Debriefing',
          description: '産業遺構写真のベストアングルを振り返り、現存する当時の青写真を見ながら語り合って解散。',
          descriptionEn: 'Reviewing architectural photography and historic blueprints.',
          isDeepSpot: false,
        },
      ]));
    }
    // 8. 銭湯・サウナ・温泉
    else if (
      context.includes('銭湯') ||
      context.includes('サウナ') ||
      context.includes('温泉') ||
      context.includes('風呂')
    ) {
      setItinerary(wrapWithIds([
        {
          time: '13:00',
          spotTitle: `${targetArea}集合＆宮造り銭湯の破風屋根・煙突鑑賞ブリーフィング`,
          spotTitleEn: 'Meeting & Temple-style Bathhouse Architecture Walk',
          description: '破風造りの堂々たる屋根や煙突の高さ、番台の配置の変遷を建築的視点から解説。',
          descriptionEn: 'Exploring historical Miyazukuri wooden architecture and towering brick chimneys.',
          isDeepSpot: false,
        },
        {
          time: '14:00',
          spotTitle: 'ペンキ絵師の富士山壁画鑑賞＆薪沸かしの湯に浸かる極上入浴',
          spotTitleEn: 'Mt. Fuji Oil Mural Viewing & Mineral-Rich Bathing',
          description: '名工ペンキ絵師の筆遣いを愛でながら、熱湯とバイブラ湯、地下水かけ流しの水風呂を堪能。',
          descriptionEn: 'Classic Mt. Fuji oil painting appreciation and mineral-rich soaking.',
          isDeepSpot: true,
        },
        {
          time: '16:00',
          spotTitle: '湯守（店主）の釜場潜入見学＆薪割り・湯沸かし秘話トーク',
          spotTitleEn: 'Behind-the-Scenes Boiler Room Tour & Firewood Lore',
          description: '普段は絶対に入れない銭湯の心臓部・釜場へ。薪で湯を沸かす湯守のこだわりを直接聞く。',
          descriptionEn: 'Exclusive access to the backroom firewood boiler and master stoker talks.',
          isDeepSpot: true,
        },
        {
          time: '17:30',
          spotTitle: '湯上がり路地裏純喫茶にて瓶入りコーヒー牛乳片手に反省会＆解散',
          spotTitleEn: 'Post-Bath Retro Cafe & Coffee Milk',
          description: 'ととのった身体に染み渡る冷たい瓶入りコーヒー牛乳と昭和グルメを堪能して解散。',
          descriptionEn: 'Classic glass-bottle coffee milk in a nostalgic Showa cafe alley.',
          isDeepSpot: false,
        },
      ]));
    }
    // 9. 伝統工芸・職人の技
    else if (
      context.includes('工芸') ||
      context.includes('職人') ||
      context.includes('手仕事') ||
      context.includes('組紐') ||
      context.includes('陶芸') ||
      context.includes('刀剣') ||
      context.includes('和紙')
    ) {
      setItinerary(wrapWithIds([
        {
          time: '10:00',
          spotTitle: `${targetArea}職人町集合＆道具と素材の美学ミニレクチャー`,
          spotTitleEn: 'Meeting & Traditional Craft Tools & Material Aesthetics',
          description: `何世代にもわたって受け継がれてきた道具の形と、選び抜かれた自然素材の特性をじっくり解説。`,
          descriptionEn: 'Examining century-old hand tools, raw natural pigments, and artisanal materials.',
          isDeepSpot: false,
        },
        {
          time: '11:00',
          spotTitle: '創業100年を超える名人工房潜入・手仕事の微細な所作見学',
          spotTitleEn: 'Behind-the-Scenes Master Artisan Workshop Visit',
          description: '機械では絶対に真似できないミリ単位の指先の感覚と、息をのむような美しい手仕事の現場を間近で見学。',
          descriptionEn: 'Witnessing high-precision handcrafting techniques honed over decades of quiet devotion.',
          isDeepSpot: true,
        },
        {
          time: '13:30',
          spotTitle: '職人直伝の技法体験ワークショップ＆作品づくり',
          spotTitleEn: 'Hands-on Craft Workshop with Master Guild Guidance',
          description: '実際に素材に触れ、職人の手ほどきを受けながら自分だけの特製作品を手仕事で仕上げる。',
          descriptionEn: 'Crafting a bespoke keepsake under the patient mentorship of master artisans.',
          isDeepSpot: true,
        },
        {
          time: '15:30',
          spotTitle: '完成作品のお披露目・職人との茶話会＆解散',
          spotTitleEn: 'Craft Unveiling, Tea Gathering with the Master & Farewell',
          description: '仕上がった作品を眺めながら、職人が語るモノづくりへの情熱と未来への伝承について語り合って解散。',
          descriptionEn: 'Reflecting on traditional aesthetics over local green tea with the craftsperson.',
          isDeepSpot: false,
        },
      ]));
    }
    // 10. 歴史・城郭・古戦場
    else if (
      category === 'history-castle' ||
      context.includes('城') ||
      context.includes('武将') ||
      context.includes('合戦') ||
      context.includes('新選組') ||
      context.includes('幕末') ||
      context.includes('侍')
    ) {
      setItinerary(wrapWithIds([
        {
          time: '10:00',
          spotTitle: `${targetArea}集合・古絵図＆縄張り図読み解きオリエンテーション`,
          spotTitleEn: 'Meeting & Feudal Map Blueprint Orientation',
          description: `江戸時代の古絵図や城郭縄張り図を広げ、当時の地形の高低差や防衛ラインの構造を軍事視点で予習。`,
          descriptionEn: 'Comparing modern city topography with historic feudal defense blueprints.',
          isDeepSpot: false,
        },
        {
          time: '11:15',
          spotTitle: '一般観光客が素通りする武者返し石垣の刻印＆折邪（折れ）の構造鑑賞',
          spotTitleEn: 'Overlooked Stone Wall Masonry Glyphs & Defensive Crenels',
          description: '築城大名の刻印が刻まれた巨石や、敵兵の侵入を阻む死角設計（横矢掛かり）を現場で徹底検証。',
          descriptionEn: 'Deciphering quarry stonemason insignias and tactical flanking angles.',
          isDeepSpot: true,
        },
        {
          time: '13:00',
          spotTitle: '歴史の舞台となった老舗宿場町茶屋で兵糧風名物ランチ休憩',
          spotTitleEn: 'Historic Post Town Teahouse & Samurai Rations Lunch',
          description: '街道沿いに残る老舗茶屋で、かつての武士や旅人が愛した伝統食を味わいながら歴史談義。',
          descriptionEn: 'Sampling traditional traveler fare inside a preserved Edo-period merchant structure.',
          isDeepSpot: false,
        },
        {
          time: '14:45',
          spotTitle: '激動の決戦地・武将の最後の陣跡にて激闘の情景を追体験＆解散',
          spotTitleEn: 'Pivotal Battlefield Ground & Historic Climax Farewell',
          description: '歴史の歯車が大きく動いた決戦の地で、両軍の布陣と勝敗の分岐点を臨場感たっぷりに語り合って解散。',
          descriptionEn: 'Standing on the decisive battlefield heights, recounting heroic tactics and turning points.',
          isDeepSpot: true,
        },
      ]));
    }
    // 11. その他・特注・多目的カルチャー（タイトルのキーワードをフル活用）
    else {
      setItinerary(wrapWithIds([
        {
          time: '10:00',
          spotTitle: `${targetArea}集合・『${keyTopic}』深掘り探訪オリエンテーション`,
          spotTitleEn: `Meeting & ${keyTopic} Deep-Dive Tour Orientation`,
          description: `『${keyTopic}』の魅力を120%楽しむための鑑賞ポイントと、本日の特別ルート概要をガイドが解説。`,
          descriptionEn: `Orientation and curated insider perspectives on ${keyTopic}.`,
          isDeepSpot: false,
        },
        {
          time: '11:15',
          spotTitle: `『${keyTopic}』の核心に迫るディープスポット（知られざる舞台）`,
          spotTitleEn: `Core Insider Highlight of ${keyTopic}`,
          description: '一般的な観光ガイドブックには載っていない、熱狂的なファンだけが知る特別な見どころや撮影アングルへ。',
          descriptionEn: 'Unpublished lore, specialized views, and rare photo angles away from tourist crowds.',
          isDeepSpot: true,
        },
        {
          time: '13:00',
          spotTitle: `${targetArea}の風情が息づく名店・ローカルカルチャー休憩`,
          spotTitleEn: 'Authentic Local Cultural Snack & Discussion',
          description: '長年この街に愛される名店で、土地に根付いた文化や食を味わいながらガイドへの質問＆歓談タイム。',
          descriptionEn: 'Local snack time and open Q&A with the specialist guide.',
          isDeepSpot: false,
        },
        {
          time: '14:45',
          spotTitle: `『${keyTopic}』を愛する仲間とのクライマックス探訪＆現地解散`,
          spotTitleEn: `Final Landmark Climax & Enthusiast Debriefing`,
          description: 'もっとも感情が揺さぶられるハイライトスポットで締めくくり、おすすめ関連情報や書籍を紹介して解散。',
          descriptionEn: 'Final highlight, closing discussions, and curated cultural recommendations.',
          isDeepSpot: true,
        },
      ]));
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
      url: 'https://images.unsplash.com/photo-1590559899731-a382839e5549?auto=format&fit=crop&w=1200&q=80',
      thumb: 'https://images.unsplash.com/photo-1590559899731-a382839e5549?auto=format&fit=crop&w=200&q=80',
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

    const tourPayload: Tour = {
      id: initialTour ? initialTour.id : `tour-custom-${Date.now()}`,
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
      durationHours: Number(durationHours) || 3.5,
      price: Number(price) || 6500,
      maxParticipants: Number(maxParticipants) || 6,
      languages: languagesInput.split(',').map((s) => s.trim()).filter(Boolean),
      imageUrl,
      gallery: [imageUrl],
      guide: {
        id: initialTour?.guide?.id || `guide-${Date.now()}`,
        name: guideName,
        nameEn: guideName,
        avatar: initialTour?.guide?.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=300&q=80',
        role: initialTour?.guide?.role || 'カルチャーツアーガイド',
        roleEn: initialTour?.guide?.roleEn || 'Cultural Tour Specialist',
        bio: guideBio,
        bioEn: guideBio,
        rating: initialTour?.guide?.rating || 5.0,
        reviewsCount: initialTour?.guide?.reviewsCount || 1,
        otakuYears: Number(guideYears) || 5,
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
      featured: initialTour?.featured || false,
      rating: initialTour?.rating || 5.0,
      reviewsCount: initialTour?.reviewsCount || 0,
      createdAt: initialTour?.createdAt || new Date().toISOString().split('T')[0],
      isGlobisProject,
      globisDetails: isGlobisProject ? {
        batchOrAffiliation: globisBatch,
        businessTheme: globisTheme,
        networkingSession: globisNetworking,
      } : undefined,
      talkSessionConfig: enableTalkSession ? {
        enabled: true,
        price30m: Number(talkPrice30m) || 3000,
        price60m: Number(talkPrice60m) || 5500,
        topics: talkTopicsInput.split(',').map((s) => s.trim()).filter(Boolean),
        availableSlots: ['平日夜 20:00〜20:30', '休日午後 14:00〜14:30', '休日夜 21:00〜21:30'],
      } : undefined,
    };

    if (initialTour && onTourUpdated) {
      onTourUpdated(tourPayload);
    } else {
      onTourCreated(tourPayload);
    }

    confetti({
      particleCount: 100,
      spread: 90,
      origin: { y: 0.5 },
      colors: ['#2563eb', '#f43f5e', '#eab308'],
    });

    onClose();
  };

  return (
    <div 
      onClick={onClose}
      className="fixed inset-0 z-50 flex flex-col justify-end sm:justify-center items-center bg-slate-950/75 backdrop-blur-sm p-0 sm:p-4 overflow-y-auto cursor-pointer"
      aria-modal="true"
      role="dialog"
    >
      {/* Mobile Top Dismiss Touch Zone */}
      <div 
        onClick={onClose}
        className="w-full flex items-center justify-center py-2.5 sm:hidden cursor-pointer"
        title="タップして閉じる"
      >
        <div className="w-12 h-1.5 rounded-full bg-white/40 shadow-xs" />
      </div>

      <div 
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-4xl bg-white border-t sm:border border-slate-200 rounded-t-3xl sm:rounded-3xl shadow-2xl overflow-hidden max-h-[92vh] sm:max-h-[90vh] flex flex-col cursor-default"
      >
        {/* Header */}
        <div className="sticky top-0 z-20 bg-white/95 backdrop-blur-md px-4 sm:px-6 py-3.5 sm:py-4 border-b border-slate-200 flex items-center justify-between">
          <div className="flex items-center gap-2">
            {isEditMode ? <Edit3 className="w-5 h-5 text-indigo-600" /> : <Sparkles className="w-5 h-5 text-blue-600" />}
            <div>
              <h2 className="text-base sm:text-lg font-bold text-slate-900 leading-tight">
                {isEditMode ? (lang === 'ja' ? 'ツアー内容を編集する' : 'Edit Tour Details') : t.createModal.title}
              </h2>
              <p className="text-xs text-slate-500">
                {isEditMode ? (lang === 'ja' ? 'タイトル、日程、工程、料金をいつでも更新できます。' : 'Update route, pricing, and itinerary anytime.') : t.createModal.subtitle}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2.5 rounded-xl bg-slate-50 hover:bg-slate-100 text-slate-500 hover:text-slate-800 border border-slate-200 cursor-pointer min-h-[44px] min-w-[44px] flex items-center justify-center"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Form Body */}
        <form onSubmit={handleSubmit} className="overflow-y-auto p-4 sm:p-6 md:p-8 space-y-6 bg-slate-50">
          {/* Quick Globis & MBA Template Banner */}
          <div className="bg-gradient-to-r from-indigo-900 via-indigo-800 to-blue-900 text-white p-4 rounded-2xl shadow-md flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center flex-shrink-0 backdrop-blur-sm border border-white/20">
                <GraduationCap className="w-5 h-5 text-indigo-300" />
              </div>
              <div>
                <h4 className="text-xs sm:text-sm font-black flex items-center gap-1.5">
                  <span>🎓 Globis生・MBA実践者向けツアー作成</span>
                  <span className="text-[10px] bg-amber-400 text-slate-950 px-1.5 py-0.2 rounded font-bold">推奨</span>
                </h4>
                <p className="text-[11px] text-slate-300">
                  地方創生、事業承継、社会科見学、まちづくりのフィールドワーク構成を1タップで自動入力！
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={applyGlobisTemplate}
              className="min-h-[40px] px-3.5 py-2 rounded-xl bg-white hover:bg-slate-100 text-indigo-950 font-black text-xs shadow-sm transition-all cursor-pointer active:scale-95 whitespace-nowrap flex items-center justify-center gap-1.5 self-start sm:self-auto"
            >
              <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
              <span>MBA探訪テンプレートを適用</span>
            </button>
          </div>

          {/* Section 1: Basic Info */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-blue-700 uppercase tracking-wider flex items-center gap-1.5">
                <span>01.</span> {t.createModal.step1}
              </h3>

              <div className="flex items-center gap-2">
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
            </div>

            {/* Title */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                {t.createModal.tourTitle} <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                placeholder={activeHint.title}
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
                placeholder={activeHint.catchphrase}
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
                  <option value="anime-pilgrimage">⛩️ アニメ・漫画・聖地巡礼</option>
                  <option value="business-fieldwork">🎓 ビジネス×偏愛（Globis/MBA・社会科見学）</option>
                  <option value="retro-showa">☕ 昭和レトロ・古書店・純喫茶</option>
                  <option value="oshikatsu-subculture">💖 推し活・アイドル・サブカル</option>
                  <option value="music-sound">🎵 音楽・音風景・MOTTAINAI SOUND</option>
                  <option value="railway-train">🚃 鉄道・秘境駅・レトロ車両</option>
                  <option value="folklore-yokai">👻 妖怪・神話・民俗伝承</option>
                  <option value="history-castle">🏯 歴史・城郭・新選組</option>
                  
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
                  placeholder={activeHint.area}
                  value={area}
                  onChange={(e) => setArea(e.target.value)}
                  required
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-500 focus:bg-white"
                />
              </div>

              {/* Globis / MBA Project Settings Box */}
              <div className="sm:col-span-2 p-3.5 rounded-2xl bg-indigo-50/70 border border-indigo-200/80 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <GraduationCap className="w-4 h-4 text-indigo-700" />
                    <span className="text-xs font-bold text-indigo-950">
                      🎓 Globis生・MBA生企画ツアーとして公開する
                    </span>
                  </div>
                  <input
                    type="checkbox"
                    checked={isGlobisProject}
                    onChange={(e) => setIsGlobisProject(e.target.checked)}
                    className="w-4 h-4 rounded text-indigo-600 focus:ring-indigo-500 cursor-pointer"
                  />
                </div>

                {isGlobisProject && (
                  <div className="pt-2 border-t border-indigo-200/60 grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs animate-in fade-in duration-200">
                    <div>
                      <label className="block font-bold text-indigo-900 mb-1">
                        所属・期生（例: 東京校 2024期、アルムナイなど）
                      </label>
                      <input
                        type="text"
                        value={globisBatch}
                        onChange={(e) => setGlobisBatch(e.target.value)}
                        placeholder="例: グロービス東京校 2024期"
                        className="w-full bg-white border border-indigo-200 rounded-xl px-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-indigo-500"
                      />
                    </div>
                    <div>
                      <label className="block font-bold text-indigo-900 mb-1">
                        ビジネス着眼点・研究テーマ
                      </label>
                      <input
                        type="text"
                        value={globisTheme}
                        onChange={(e) => setGlobisTheme(e.target.value)}
                        placeholder="例: 地方創生 × 事業承継ビジネスモデル探訪"
                        className="w-full bg-white border border-indigo-200 rounded-xl px-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-indigo-500"
                      />
                    </div>
                    <div className="sm:col-span-2 flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={globisNetworking}
                        onChange={(e) => setGlobisNetworking(e.target.checked)}
                        className="w-3.5 h-3.5 rounded text-indigo-600 cursor-pointer"
                        id="check-networking"
                      />
                      <label htmlFor="check-networking" className="text-[11px] text-indigo-950 font-medium cursor-pointer">
                        ツアー終盤に懇親・ディスカッションセッション（学友・参加者ネットワーキング）を含む
                      </label>
                    </div>
                  </div>
                )}
              </div>

              {/* Live Category Example Hint Badge */}
              <div className="sm:col-span-2 flex items-center gap-2 px-3 py-2 rounded-xl bg-blue-50/70 border border-blue-200 text-blue-900 text-xs shadow-2xs">
                <Sparkles className="w-3.5 h-3.5 text-blue-600 flex-shrink-0" />
                <span className="font-bold flex-shrink-0">選択中テーマの入力例:</span>
                <span className="truncate text-slate-700 font-medium">{activeHint.title}</span>
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
                  step="1"
                  min="0"
                  placeholder="6500"
                  onFocus={(e) => e.target.select()}
                  onChange={(e) => {
                    const val = e.target.value;
                    setPrice(val === '' ? '' : Number(val));
                  }}
                  onBlur={() => {
                    if (price === '' || Number(price) < 0) setPrice(6500);
                  }}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-blue-500 focus:bg-white"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  {t.createModal.duration}
                </label>
                <input
                  type="number"
                  value={durationHours}
                  step="any"
                  min="0.5"
                  placeholder="3.5"
                  onFocus={(e) => e.target.select()}
                  onChange={(e) => {
                    const val = e.target.value;
                    setDurationHours(val === '' ? '' : Number(val));
                  }}
                  onBlur={() => {
                    if (durationHours === '' || Number(durationHours) <= 0) setDurationHours(3.5);
                  }}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-blue-500 focus:bg-white"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  {t.createModal.maxGuests}
                </label>
                <input
                  type="number"
                  value={maxParticipants}
                  step="1"
                  min="1"
                  max="50"
                  placeholder="6"
                  onFocus={(e) => e.target.select()}
                  onChange={(e) => {
                    const val = e.target.value;
                    setMaxParticipants(val === '' ? '' : Number(val));
                  }}
                  onBlur={() => {
                    if (maxParticipants === '' || Number(maxParticipants) < 1) setMaxParticipants(6);
                  }}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-blue-500 focus:bg-white"
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
                  <div key={stop.id} className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-2.5 hover:border-slate-300 transition-colors shadow-xs">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <div className="flex items-center gap-2 flex-1">
                        <span className="w-6 h-6 rounded-full bg-indigo-600 text-white text-xs font-black flex items-center justify-center flex-shrink-0 shadow-xs">
                          {index + 1}
                        </span>
                        <input
                          type="text"
                          placeholder="時間 (10:30)"
                          value={stop.time}
                          onChange={(e) => updateItineraryStop(index, { time: e.target.value })}
                          className="w-24 bg-white border border-slate-200 rounded-xl px-2.5 py-1.5 text-xs text-slate-900 font-bold focus:outline-none focus:border-blue-500 shadow-2xs"
                        />
                        <input
                          type="text"
                          placeholder={activeHint.spot}
                          value={stop.spotTitle}
                          onChange={(e) =>
                            updateItineraryStop(index, {
                              spotTitle: e.target.value,
                              spotTitleEn: e.target.value,
                            })
                          }
                          required
                          className="flex-1 bg-white border border-slate-200 rounded-xl px-3 py-1.5 text-xs text-slate-900 font-bold focus:outline-none focus:border-blue-500 placeholder-slate-400 shadow-2xs"
                        />
                      </div>

                      {/* Controls: Up, Down, Duplicate, DeepSpot toggle, Delete */}
                      <div className="flex items-center gap-1 self-end sm:self-auto">
                        <label className="flex items-center gap-1 text-[11px] text-rose-600 font-bold mr-2 cursor-pointer bg-white px-2.5 py-1 rounded-lg border border-slate-200 shadow-2xs hover:bg-rose-50/50 transition-colors">
                          <input
                            type="checkbox"
                            checked={stop.isDeepSpot}
                            onChange={(e) => updateItineraryStop(index, { isDeepSpot: e.target.checked })}
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
                      onChange={(e) =>
                        updateItineraryStop(index, {
                          description: e.target.value,
                          descriptionEn: e.target.value,
                        })
                      }
                      className="w-full bg-white border border-slate-200 rounded-xl p-2.5 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-500 shadow-2xs"
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
                  placeholder={activeHint.meeting}
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
                  placeholder={activeHint.prep}
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
                  step="1"
                  min="0"
                  placeholder="10"
                  onFocus={(e) => e.target.select()}
                  onChange={(e) => {
                    const val = e.target.value;
                    setGuideYears(val === '' ? '' : Number(val));
                  }}
                  onBlur={() => {
                    if (guideYears === '' || Number(guideYears) < 0) setGuideYears(10);
                  }}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-blue-500 focus:bg-white"
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
                        step="1"
                        min="0"
                        placeholder="3000"
                        onFocus={(e) => e.target.select()}
                        onChange={(e) => {
                          const val = e.target.value;
                          setTalkPrice30m(val === '' ? '' : Number(val));
                        }}
                        onBlur={() => {
                          if (talkPrice30m === '' || Number(talkPrice30m) < 0) setTalkPrice30m(3000);
                        }}
                        className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-slate-900 focus:outline-none focus:border-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block font-bold text-slate-700 mb-1">60分セッション料金 (円)</label>
                      <input
                        type="number"
                        value={talkPrice60m}
                        step="1"
                        min="0"
                        placeholder="5500"
                        onFocus={(e) => e.target.select()}
                        onChange={(e) => {
                          const val = e.target.value;
                          setTalkPrice60m(val === '' ? '' : Number(val));
                        }}
                        onBlur={() => {
                          if (talkPrice60m === '' || Number(talkPrice60m) < 0) setTalkPrice60m(5500);
                        }}
                        className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-slate-900 focus:outline-none focus:border-blue-500"
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
              className="w-full py-4 rounded-2xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-base shadow-lg shadow-blue-500/20 transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-95 min-h-[52px]"
            >
              {isEditMode ? <Edit3 className="w-5 h-5 text-yellow-300" /> : <Sparkles className="w-5 h-5 text-yellow-300" />}
              <span>{isEditMode ? (lang === 'ja' ? '変更を保存する' : 'Save Changes') : t.createModal.submit}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
