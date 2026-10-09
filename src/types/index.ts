export type BuiltinTourCategory = 
  | 'anime-pilgrimage'     // アニメ・漫画・聖地巡礼
  | 'history-castle'        // 歴史・城郭・新選組・刀剣
  | 'railway-train'         // 鉄道・秘境駅・レトロ車両
  | 'retro-showa'           // 昭和レトロ・古書店・純喫茶
  | 'folklore-yokai'        // 妖怪・神話・民俗伝承
  | 'oshikatsu-subculture'  // 推し活・アイドル・サブカル
  | 'music-sound'           // 音楽・音風景・フィールドレコーディング（MOTTAINAI SOUND）
  | 'business-fieldwork'    // 🎓 ビジネス×偏愛・フィールドワーク（Globis/MBA・社会科見学・地方創生）
  | 'custom';               // 特注・カスタム

export type TourCategory = BuiltinTourCategory | (string & {});

export interface CustomTheme {
  id: string;               // e.g. 'custom-industrial-ruins'
  name: string;             // e.g. '近代化遺産・産業廃墟'
  nameEn: string;           // e.g. 'Industrial Heritage & Ruins'
  description: string;      // 説明・ジャンルの特徴
  categoryKey: string;      // フィルターやツアー紐付け用キー
  icon: string;             // Lucide icon name or emoji
  imageUrl?: string;        // Heroチップ用サムネイル
  sampleTags: string[];     // サンプルタグ
  createdAt: string;
  isAiGenerated: boolean;
  matchReason?: string;     // AIが非該当と判断した理由
}

export interface TourGuide {
  id: string;
  name: string;
  nameEn: string;
  avatar: string;
  role: string;
  roleEn: string;
  bio: string;
  bioEn: string;
  rating: number;
  reviewsCount: number;
  otakuYears: number; // 愛好歴
  specialties: string[];
}

export interface ItineraryItem {
  time: string;
  spotTitle: string;
  spotTitleEn: string;
  description: string;
  descriptionEn: string;
  isDeepSpot?: boolean;
  mapQuery?: string;
}

export type NearbySpotCategory = 'hotel' | 'dining' | 'souvenir' | 'scenery';

export interface NearbySpot {
  id: string;
  name: string;
  nameEn: string;
  category: NearbySpotCategory;
  categoryLabel: string;
  categoryLabelEn: string;
  description: string;
  descriptionEn: string;
  imageUrl: string;
  distance: string; // e.g. "徒歩3分", "駅直結"
  priceRange?: string; // e.g. "¥8,000〜/泊", "¥1,000〜¥2,000"
  rating: number;
  highlightTag: string; // e.g. "オタク歓迎", "聖地コラボメニュー", "老舗銘菓"
  googleMapsQuery: string; // Google Maps検索・リンク用
  lat?: number;
  lng?: number;
}

export interface Tour {
  id: string;
  title: string;
  titleEn: string;
  catchphrase: string;
  catchphraseEn: string;
  description: string;
  descriptionEn: string;
  category: TourCategory;
  area: string;
  areaEn: string;
  otakuLevel: 1 | 2 | 3 | 4 | 5; // 1: 初心者歓迎, 3: 中級, 5: 極限の沼
  durationHours: number;
  price: number; // JPY
  maxParticipants: number;
  languages: string[];
  imageUrl: string;
  gallery: string[];
  guide: TourGuide;
  itinerary: ItineraryItem[];
  included: string[];
  includedEn: string[];
  mustBring: string[];
  mustBringEn: string[];
  recommendedPreparation: string; // 予習推奨（歴史知識、アニメなど）
  recommendedPreparationEn: string;
  meetingPoint: string;
  meetingPointEn: string;
  coordinates?: {
    lat: number;
    lng: number;
    zoom?: number;
  };
  googleMapsUrl?: string;
  nearbySpots?: NearbySpot[];
  tags: string[];
  featured?: boolean;
  rating: number;
  reviewsCount: number;
  createdAt: string;
  talkSessionConfig?: TalkSessionConfig;
  routeWaypoints?: string[];
  isGlobisProject?: boolean; // Globis生・MBA実践者企画
  globisDetails?: {
    batchOrAffiliation?: string; // e.g. "東京校 2024期" or "卒業生アルムナイ"
    businessTheme?: string;      // e.g. "地方創生・事業承継ビジネスモデル探訪"
    networkingSession?: boolean; // 懇親・ディスカッション枠付き
  };
}

export interface CuratedAntennaTour {
  id: string;
  title: string;
  titleEn: string;
  organizer: string;
  sourcePlatform: 'Peatix' | 'note' | '有志団体' | '地域公式' | '大学・学会' | 'その他';
  sourceUrl: string;
  date: string;
  area: string;
  category: TourCategory;
  otakuLevel: 1 | 2 | 3 | 4 | 5;
  priceText: string; // e.g. "¥3,500" or "無料" or "実費のみ"
  imageUrl: string;
  screeningReason: string; // DDJ偏愛スクリーニング厳選理由
  screeningScore: number;  // 90〜99点
  tags: string[];
  isGlobisRecommended?: boolean; // Globis生・社会人探訪おすすめ
  createdAt: string;
}

export interface NewsletterSubscriber {
  email: string;
  subscribedAt: string;
  categoriesOfInterest?: string[];
  isGlobisMember?: boolean;
}

export interface TalkSessionConfig {
  enabled: boolean;
  price30m: number;
  price60m: number;
  topics: string[];
  availableSlots?: string[];
}

export interface TalkSessionBooking {
  id: string;
  tourId: string;
  tourTitle: string;
  guideName: string;
  guideAvatar: string;
  date: string;
  timeSlot: string;
  durationMinutes: 30 | 60;
  totalPrice: number;
  topic: string;
  userName: string;
  userEmail: string;
  userNotes?: string;
  meetUrl: string;
  status: 'confirmed' | 'completed' | 'cancelled';
  createdAt: string;
}

export interface Booking {
  id: string;
  tourId: string;
  tourTitle: string;
  tourImage: string;
  date: string;
  participantsCount: number;
  totalPrice: number;
  userName: string;
  userEmail: string;
  customRequest?: string;
  status: 'confirmed' | 'pending' | 'completed';
  createdAt: string;
}

export interface TourRequest {
  id: string;
  title: string;
  userName: string;
  targetAnimeOrTheme: string;
  area: string;
  budget: number;
  details: string;
  desiredDate: string;
  upvotes: number;
  offersCount: number;
  status: 'recruiting' | 'matched';
  createdAt: string;
}

export interface TourReview {
  id: string;
  tourId: string;
  userName: string;
  userCountry: string;
  userAvatar?: string;
  rating: number;
  comment: string;
  date: string;
}

export type Language = 'ja' | 'en';
export type Currency = 'JPY' | 'USD' | 'EUR' | 'TWD';

export interface GuideChatMessage {
  id: string;
  sender: 'user' | 'guide';
  text: string;
  timestamp: string;
}
