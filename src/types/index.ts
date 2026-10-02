export type TourCategory = 
  | 'anime-pilgrimage'     // アニメ・漫画・聖地巡礼
  | 'history-castle'        // 歴史・城郭・新選組・刀剣
  | 'railway-train'         // 鉄道・秘境駅・レトロ車両
  | 'retro-showa'           // 昭和レトロ・古書店・純喫茶
  | 'folklore-yokai'        // 妖怪・神話・民俗伝承
  | 'oshikatsu-subculture'  // 推し活・アイドル・サブカル
  | 'custom';               // 特注・カスタム

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
  tags: string[];
  featured?: boolean;
  rating: number;
  reviewsCount: number;
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
