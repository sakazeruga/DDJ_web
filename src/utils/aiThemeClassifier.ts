import type { BuiltinTourCategory, CustomTheme } from '../types';

export interface AIThemeAnalysisResult {
  isMatch: boolean;
  confidence: number; // 0 - 100
  matchedCategory?: BuiltinTourCategory;
  matchedCategoryName?: string;
  matchedCategoryNameEn?: string;
  suggestedTags: string[];
  suggestedNewTheme?: CustomTheme;
  explanation: string;
}

// Built-in categories and their semantic keyword profiles
const BUILTIN_THEMES: Array<{
  id: BuiltinTourCategory;
  name: string;
  nameEn: string;
  keywords: string[];
}> = [
  {
    id: 'music-sound',
    name: '音楽・音風景・MOTTAINAI SOUND',
    nameEn: 'Music & Soundscape',
    keywords: [
      '音楽', '音', '音風景', 'サウンド', 'サウンドスケープ', 'フィールドレコーディング',
      '波音', '潮騒', '水琴窟', '竹林の風', 'ハイレゾ', 'バイノーラル', 'レコーディング',
      '守時タツミ', 'mottainai', 'ピアノ', '作曲', '音フェチ', '耳を澄ます', '自然音',
      'ライブハウス', '楽器', 'レコード', '音響'
    ],
  },
  {
    id: 'history-castle',
    name: '歴史・城郭・新選組',
    nameEn: 'History & Samurai Fortresses',
    keywords: [
      '歴史', '城', '城郭', '天守閣', '堀', '石垣', '門', '武将', '合戦', '幕末',
      '新選組', '土方歳三', '近藤勇', '坂本龍馬', '侍', '寺', '神社', '古戦場', '遺構',
      '史跡', '大名', '戦国', '甲冑', '刀剣', '江戸', '京都', '小田原城'
    ],
  },
  {
    id: 'railway-train',
    name: '鉄道・秘境駅・レトロ車両',
    nameEn: 'Railways & Heritage Trains',
    keywords: [
      '鉄道', '電車', '駅', '列車', '車両', '線路', '廃線', '秘境駅', '江ノ電',
      '単線', '踏切', '鉄橋', 'トンネル', '路面電車', '撮り鉄', '乗り鉄', '時刻表',
      '切符', '発車メロディ', '気動車', '蒸気機関車', 'sl', '新幹線'
    ],
  },
  {
    id: 'anime-pilgrimage',
    name: 'アニメ・漫画・聖地巡礼',
    nameEn: 'Anime Pilgrimage & Pop Culture',
    keywords: [
      'アニメ', '漫画', 'マンガ', '聖地', '巡礼', '聖地巡礼', 'ロケ地', '舞台',
      '声優', '君の名は', 'ぼっち・ざ・ろっく', '作中', 'シーン', 'モデル地', 'アニソン',
      '飛騨古川', '下北沢', 'キービジュアル', '再現カット'
    ],
  },
  {
    id: 'retro-showa',
    name: '昭和レトロ・古書店・純喫茶',
    nameEn: 'Retro Showa, Vintage Books & Cafes',
    keywords: [
      '昭和', 'レトロ', '純喫茶', '喫茶店', '古書', '古書店', '古本', '神保町',
      'ナポリタン', 'クリームソーダ', '横丁', '看板建築', 'ヴィンテージ', 'ノスタルジー',
      '珈琲', 'サイフォン', '古地図', '文豪', '古書街', 'すずらん通り'
    ],
  },
  {
    id: 'folklore-yokai',
    name: '妖怪・神話・民俗伝承',
    nameEn: 'Folklore, Myths & Yokai',
    keywords: [
      '妖怪', '民俗', '神話', '伝承', '怪談', '鬼', '天狗', 'カッパ', '精霊',
      '奇祭', '呪術', '結界', '異界', '口伝', '水木しげる', '遠野物語', '柳田国男',
      '禁足地', 'パワースポット', '神事'
    ],
  },
  {
    id: 'oshikatsu-subculture',
    name: '推し活・アイドル・サブカル',
    nameEn: 'Oshikatsu, Idols & Subculture',
    keywords: [
      '推し活', '推し', 'アイドル', '秋葉原', 'オタク', '同人', 'コスプレ', 'グッズ',
      'コラボカフェ', '生誕祭', '痛バッグ', 'オタロード', 'コンセプトカフェ', 'アキバ'
    ],
  },
];

// Presets of highly demanded niche otaku genres that don't match standard 7 categories
interface NicheCategoryCandidate {
  triggerKeywords: string[];
  name: string;
  nameEn: string;
  categoryKey: string;
  icon: string;
  description: string;
  imageUrl: string;
  sampleTags: string[];
  reason: string;
}

const NICHE_CANDIDATES: NicheCategoryCandidate[] = [
  {
    triggerKeywords: ['廃墟', '産業遺産', '軍艦島', '炭鉱', '廃道', '遺構', '煙突', '廃村', '廃工場', 'コンクリート遺構'],
    name: '近代化遺産・産業廃墟探訪',
    nameEn: 'Industrial Heritage & Ruins',
    categoryKey: 'industrial-ruins',
    icon: 'Warehouse',
    description: '日本の近代化を支えた炭鉱・工場・廃道など、役目を終えた産業遺構と廃墟美を深く巡るテーマ。',
    imageUrl: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=600&q=80',
    sampleTags: ['近代化遺産', '産業遺構', '廃墟美', '炭鉱跡', '近代土木'],
    reason: '既存の「歴史・城郭」や「昭和レトロ」の枠に収まらない、近代土木・産業遺産・廃墟美に特化したディープな新ジャンルです。',
  },
  {
    triggerKeywords: ['銭湯', 'サウナ', '水風呂', '湯守', 'ペンキ絵', '温泉街', '外湯', '番台', 'ととのう'],
    name: '銭湯・サウナ・下町温浴文化',
    nameEn: 'Public Baths & Sauna Culture',
    categoryKey: 'sento-sauna',
    icon: 'Flame',
    description: '宮造り建築の富士山ペンキ絵銭湯から昭和レトロサウナ、下町の湯守の歴史を味わう極上テーマ。',
    imageUrl: 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=600&q=80',
    sampleTags: ['銭湯', '宮造り', 'サウナ巡り', 'ペンキ絵', '下町温浴'],
    reason: '温浴・下町銭湯文化は既存の観光・歴史カテゴリーとは異なる独自の熱狂的なコミュニティを持つ新ジャンルです。',
  },
  {
    triggerKeywords: ['日本酒', '酒蔵', '発酵', '味噌', '醤油', '麹', 'ワイナリー', '醸造', '杜氏', '酒造'],
    name: '酒蔵・発酵・伝統醸造文化',
    nameEn: 'Sake Breweries & Fermentation',
    categoryKey: 'sake-fermentation',
    icon: 'Wine',
    description: '名水を活かした全国の老舗酒蔵や醤油・味噌の発酵蔵を訪ね、職人の手仕事と発酵の神秘を紐解くツアー。',
    imageUrl: 'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?auto=format&fit=crop&w=600&q=80',
    sampleTags: ['酒蔵探訪', '日本酒', '発酵文化', '伝統醸造', '杜氏の技'],
    reason: 'グルメや観光の枠を超え、微生物・麹菌と職人のクラフトマンシップに迫る専門性の高い新ジャンルです。',
  },
  {
    triggerKeywords: ['野鳥', 'バードウォッチング', '植物', '野草', '湿原', '生物', '昆虫', '地質', '断層', '岩石', '化石'],
    name: '自然観察・野鳥・地質地形探訪',
    nameEn: 'Nature, Birding & Geological Wonders',
    categoryKey: 'nature-geology',
    icon: 'Trees',
    description: 'ブラタモリのように大地の断層や地形の成り立ちを読み解き、渡り鳥や自生植物を観察するフィールドワーク。',
    imageUrl: 'https://images.unsplash.com/photo-1448375240586-882707db888b?auto=format&fit=crop&w=600&q=80',
    sampleTags: ['地形・断層', 'ブラタモリ視点', 'バードウォッチング', '地質探訪', '生態観察'],
    reason: '純粋な観光散策ではなく、地球科学・地形読み解き・動植物の生態を観察する知的好奇心特化の新ジャンルです。',
  },
  {
    triggerKeywords: ['近代建築', '名建築', '看板建築', '洋館', '擬洋風', 'ヴォーリズ', '辰野金吾', '建築探訪', '煉瓦'],
    name: '名建築・近代洋館・看板建築探訪',
    nameEn: 'Modern Architecture & Heritage Buildings',
    categoryKey: 'modern-architecture',
    icon: 'Landmark',
    description: '明治・大正・昭和初期の擬洋風建築、赤煉瓦倉庫、銅板葺きの看板建築など、街角の名建築を鑑賞する旅。',
    imageUrl: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=600&q=80',
    sampleTags: ['看板建築', '近代洋館', 'レトロ建築', 'ヴォーリズ建築', '街角意匠'],
    reason: '神社仏閣や城郭とは異なる、明治以降の近代洋館や職人の装飾意匠に焦点を当てた建築ファンのための新ジャンルです。',
  },
  {
    triggerKeywords: ['伝統工芸', '職人', '漆器', '陶芸', '和紙', '染物', '金箔', '木工', '切子', '江戸切子'],
    name: '伝統工芸・職人の技・工房探訪',
    nameEn: 'Traditional Crafts & Artisan Studios',
    categoryKey: 'crafts-artisan',
    icon: 'Sparkles',
    description: '何百年と受け継がれる漆芸、染め物、江戸切子などの工房に足を踏み入れ、熟練職人の技と美意識に触れる。',
    imageUrl: 'https://images.unsplash.com/photo-1582738411706-bfc8e691d1c2?auto=format&fit=crop&w=600&q=80',
    sampleTags: ['伝統工芸', '職人の手仕事', '工房見学', '江戸切子', '日本美'],
    reason: '歴史観光にとどまらず、日本のものづくり・職人文化の現場に潜入するクラフトマンシップ特化の新ジャンルです。',
  },
];

/**
 * AI-powered Theme Classifier
 * Analyzes tour content, matches against existing themes,
 * or recommends a brand new theme tag if the input represents a new niche!
 */
export async function classifyTourThemeWithAI(input: {
  title: string;
  description: string;
  catchphrase?: string;
  tags?: string[];
}): Promise<AIThemeAnalysisResult> {
  // Simulate AI deep thinking time
  await new Promise((resolve) => setTimeout(resolve, 600));

  const fullText = [
    input.title || '',
    input.catchphrase || '',
    input.description || '',
    (input.tags || []).join(' '),
  ]
    .join(' ')
    .toLowerCase();

  if (!fullText.trim()) {
    return {
      isMatch: false,
      confidence: 0,
      suggestedTags: ['ディープ探訪', 'カルチャーツアー'],
      explanation: '入力情報が不足しています。タイトルや説明文を入力してください。',
    };
  }

  // 1. Calculate matching score for each built-in theme
  const scores = BUILTIN_THEMES.map((theme) => {
    let score = 0;
    let hitCount = 0;

    for (const kw of theme.keywords) {
      if (fullText.includes(kw.toLowerCase())) {
        hitCount += 1;
        // Exact match in title gives huge weight
        if ((input.title || '').toLowerCase().includes(kw.toLowerCase())) {
          score += 25;
        } else {
          score += 10;
        }
      }
    }

    // Normalize confidence score between 0 and 99
    const confidence = Math.min(Math.round((score / 50) * 100), 98);
    return { theme, confidence, hitCount };
  });

  // Sort by highest confidence
  scores.sort((a, b) => b.confidence - a.confidence);
  const bestMatch = scores[0];

  // 2. Check if text explicitly matches a known niche candidate
  for (const niche of NICHE_CANDIDATES) {
    const hits = niche.triggerKeywords.filter((kw) => fullText.includes(kw.toLowerCase()));
    if (hits.length >= 1) {
      // If built-in match is weak or the niche triggers are prominent
      if (bestMatch.confidence < 60 || hits.length >= 2) {
        return {
          isMatch: false,
          confidence: Math.max(88, bestMatch.confidence),
          suggestedTags: niche.sampleTags,
          suggestedNewTheme: {
            id: `theme-${niche.categoryKey}-${Date.now()}`,
            name: niche.name,
            nameEn: niche.nameEn,
            description: niche.description,
            categoryKey: niche.categoryKey,
            icon: niche.icon,
            imageUrl: niche.imageUrl,
            sampleTags: niche.sampleTags,
            createdAt: new Date().toISOString(),
            isAiGenerated: true,
            matchReason: niche.reason,
          },
          explanation: `【AI判定：既存テーマに非該当】${niche.reason}`,
        };
      }
    }
  }

  // 3. If highest built-in confidence is reasonably high (>= 40%), return match!
  if (bestMatch && bestMatch.confidence >= 40) {
    const relevantTags = bestMatch.theme.keywords
      .filter((kw) => fullText.includes(kw.toLowerCase()))
      .slice(0, 5);

    return {
      isMatch: true,
      confidence: bestMatch.confidence,
      matchedCategory: bestMatch.theme.id,
      matchedCategoryName: bestMatch.theme.name,
      matchedCategoryNameEn: bestMatch.theme.nameEn,
      suggestedTags: relevantTags.length > 0 ? relevantTags : [bestMatch.theme.name.split('・')[0]],
      explanation: `【AI判定：既存テーマ該当】既存カテゴリー「${bestMatch.theme.name}」の特徴に ${bestMatch.confidence}% 合致しています。`,
    };
  }

  // 4. Truly unique/unclassified theme: AI dynamically creates a custom theme tag!
  // Extract potential topic from title
  const cleanTitle = (input.title || '').replace(/[【】『』「」〜~]/g, ' ').trim();
  const titleWords = cleanTitle.split(/\s+/).filter((w) => w.length >= 2);
  const detectedThemeName = titleWords.length > 0 
    ? `${titleWords[0]}・特化カルチャー探訪` 
    : '新領域オタクカルチャー探訪';

  const dynamicCategoryKey = `custom-${Date.now().toString(36)}`;

  return {
    isMatch: false,
    confidence: bestMatch ? bestMatch.confidence : 15,
    suggestedTags: [titleWords[0] || '独自テーマ', 'ディープ探訪', '新ジャンル'],
    suggestedNewTheme: {
      id: `theme-${dynamicCategoryKey}`,
      name: detectedThemeName,
      nameEn: 'Specialized Niche Exploration',
      description: `「${cleanTitle}」に関するディープな知識や現地体験にフォーカスした、新設の特化テーマタグ。`,
      categoryKey: dynamicCategoryKey,
      icon: 'Sparkles',
      imageUrl: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&w=600&q=80',
      sampleTags: [titleWords[0] || '独自探訪', 'マニアック探訪', '現地フィールドワーク'],
      createdAt: new Date().toISOString(),
      isAiGenerated: true,
      matchReason: '既存の7つの定番カテゴリー（歴史・城郭、鉄道、アニメ聖地、昭和レトロ古書、妖怪民俗、推し活、音楽音風景）のいずれにも当てはまらない、まったく新しい切り口のオタク探訪ツアーと判定されました。',
    },
    explanation: '【AI判定：既存テーマに非該当】既存の7カテゴリーにはないユニークなテーマです。新しいテーマタグとしてDDJに登録することをおすすめします！',
  };
}
