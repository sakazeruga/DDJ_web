export type TourCategory = 
  | 'pilgrimage'       // 聖地巡礼
  | 'akiba-deep'        // 秋葉原ディープ
  | 'nakano-vintage'    // 中野ブロードウェイ・レトロTOY
  | 'retro-games'       // レトロゲーム・アーケード
  | 'otome-road'        // 池袋・乙女ロード
  | 'maid-subculture'   // コンカフェ・メイドカルチャー
  | 'comiket-doujin'    // 同人誌・即売会攻略
  | 'custom';           // その他・カスタム

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
  otakuYears: number;
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
  otakuLevel: 1 | 2 | 3 | 4 | 5; // 1: 初心者歓迎, 3: 中級, 5: 超限界オタク
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
  recommendedPreparation: string; // 履修推奨アニメや作品
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
