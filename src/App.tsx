import React, { useState, useEffect, useMemo } from 'react';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { CategoryFilter } from './components/CategoryFilter';
import { FilterBar } from './components/FilterBar';
import { TourCard } from './components/TourCard';
import { TourDetailModal } from './components/TourDetailModal';
import { CreateTourModal } from './components/CreateTourModal';
import { RequestBoardView } from './components/RequestBoardView';
import { MyPageView } from './components/MyPageView';
import { FeaturesSection } from './components/FeaturesSection';
import { TourShioriSection } from './components/TourShioriSection';
import { Footer } from './components/Footer';
import { InteractiveMapView } from './components/InteractiveMapView';
import { Flame, LayoutGrid, List, MapPin } from 'lucide-react';

import type { 
  Tour, 
  TourRequest, 
  TourReview, 
  Booking, 
  TalkSessionBooking,
  Language, 
  Currency,
  TourCategory,
  CustomTheme
} from './types';
import { INITIAL_TOURS, INITIAL_REQUESTS, INITIAL_REVIEWS } from './data/mockTours';
import { translations } from './i18n/translations';
import { formatPrice } from './utils/currency';

// Initial preloaded niche custom themes for instant rich discovery
const INITIAL_CUSTOM_THEMES: CustomTheme[] = [
  {
    id: 'theme-industrial-ruins-default',
    name: '近代化遺産・産業廃墟探訪',
    nameEn: 'Industrial Heritage & Ruins',
    categoryKey: 'industrial-ruins',
    description: '炭鉱跡、旧発電所、赤煉瓦遺構など日本の近代化遺産と廃墟美を巡る。',
    icon: 'Warehouse',
    imageUrl: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=600&q=80',
    sampleTags: ['近代化遺産', '産業遺構', '廃墟美'],
    createdAt: '2026-10-01',
    isAiGenerated: true,
    matchReason: '既存7カテゴリーに非該当な新ジャンル',
  },
  {
    id: 'theme-sento-sauna-default',
    name: '銭湯・サウナ・温浴文化',
    nameEn: 'Sento & Sauna Culture',
    categoryKey: 'sento-sauna',
    description: '宮造り銭湯の富士山ペンキ絵や下町サウナ、釜場の湯守文化を味わう。',
    icon: 'Flame',
    imageUrl: 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=600&q=80',
    sampleTags: ['銭湯', 'ペンキ絵', 'サウナ巡り'],
    createdAt: '2026-10-01',
    isAiGenerated: true,
    matchReason: '下町温浴・銭湯建築文化に特化した新ジャンル',
  },
];

export function App() {
  // Language state
  const [lang, setLang] = useState<Language>(() => {
    return (localStorage.getItem('ddj_lang') as Language) || 'ja';
  });

  useEffect(() => {
    localStorage.setItem('ddj_lang', lang);
  }, [lang]);

  // Currency state
  const [currency, setCurrency] = useState<Currency>(() => {
    return (localStorage.getItem('ddj_currency') as Currency) || 'JPY';
  });

  useEffect(() => {
    localStorage.setItem('ddj_currency', currency);
  }, [currency]);

  // Tab navigation
  const [currentTab, setCurrentTab] = useState<'explore' | 'requests' | 'mypage'>('explore');

  // Tours state (synced with LocalStorage and auto-merged with fresh INITIAL_TOURS)
  const [tours, setTours] = useState<Tour[]>(() => {
    const saved = localStorage.getItem('ddj_cultural_tours_v2');
    if (saved) {
      try {
        const parsed: Tour[] = JSON.parse(saved);
        const existingIds = new Set(parsed.map((t) => t.id));
        const missing = INITIAL_TOURS.filter((t) => !existingIds.has(t.id));
        if (missing.length > 0) {
          return [...missing, ...parsed];
        }
        return parsed;
      } catch (e) {
        console.error(e);
      }
    }
    return INITIAL_TOURS;
  });

  useEffect(() => {
    localStorage.setItem('ddj_cultural_tours_v2', JSON.stringify(tours));
  }, [tours]);

  // Requests state (synced with LocalStorage and auto-merged with fresh INITIAL_REQUESTS)
  const [requests, setRequests] = useState<TourRequest[]>(() => {
    const saved = localStorage.getItem('ddj_cultural_requests_v2');
    if (saved) {
      try {
        const parsed: TourRequest[] = JSON.parse(saved);
        const existingIds = new Set(parsed.map((r) => r.id));
        const missing = INITIAL_REQUESTS.filter((r) => !existingIds.has(r.id));
        if (missing.length > 0) {
          return [...missing, ...parsed];
        }
        return parsed;
      } catch (e) {
        console.error(e);
      }
    }
    return INITIAL_REQUESTS;
  });

  useEffect(() => {
    localStorage.setItem('ddj_cultural_requests_v2', JSON.stringify(requests));
  }, [requests]);

  // Reviews state (synced with LocalStorage and auto-merged with fresh INITIAL_REVIEWS)
  const [reviews, setReviews] = useState<TourReview[]>(() => {
    const saved = localStorage.getItem('ddj_cultural_reviews_v2');
    if (saved) {
      try {
        const parsed: TourReview[] = JSON.parse(saved);
        const existingIds = new Set(parsed.map((r) => r.id));
        const missing = INITIAL_REVIEWS.filter((r) => !existingIds.has(r.id));
        if (missing.length > 0) {
          return [...missing, ...parsed];
        }
        return parsed;
      } catch (e) {
        console.error(e);
      }
    }
    return INITIAL_REVIEWS;
  });

  useEffect(() => {
    localStorage.setItem('ddj_cultural_reviews_v2', JSON.stringify(reviews));
  }, [reviews]);

  // Bookings state
  const [bookings, setBookings] = useState<Booking[]>(() => {
    const saved = localStorage.getItem('ddj_cultural_bookings_v1');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error(e);
      }
    }
    return [
      {
        id: 'booking-init-1',
        tourId: 'tour-1',
        tourTitle: '【歴史オタクと行く】京都・幕末新選組の足跡〜壬生寺・八木邸から油小路の変まで完全踏破〜',
        tourImage: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&w=1200&q=80',
        date: '2026-10-18',
        participantsCount: 2,
        totalPrice: 13600,
        userName: '歴史トラベラー',
        userEmail: 'traveler@example.com',
        status: 'confirmed',
        createdAt: '2026-10-01',
      },
    ];
  });

  useEffect(() => {
    localStorage.setItem('ddj_cultural_bookings_v1', JSON.stringify(bookings));
  }, [bookings]);

  // Talk Session Bookings state
  const [talkBookings, setTalkBookings] = useState<TalkSessionBooking[]>(() => {
    const saved = localStorage.getItem('ddj_talk_session_bookings_v1');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error(e);
      }
    }
    return [
      {
        id: 'talk-init-1',
        tourId: 'tour-mottainai-sound',
        tourTitle: '守時タツミと行く『MOTTAINAI SOUND』原風景フィールドレコーディングツアー',
        guideName: '守時 タツミ',
        guideAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=400&q=80',
        date: '2026-10-10',
        timeSlot: '本日 20:00〜20:30',
        durationMinutes: 30,
        totalPrice: 3500,
        topic: '自然音・フィールドレコーディング機材＆マイクセッティング相談',
        userName: '音響ファン',
        userEmail: 'soundfan@example.com',
        userNotes: 'バイノーラルマイクの選び方を教えてほしいです！',
        meetUrl: 'https://meet.google.com/ddj-mott-ainai',
        status: 'confirmed',
        createdAt: '2026-10-02',
      },
    ];
  });

  useEffect(() => {
    localStorage.setItem('ddj_talk_session_bookings_v1', JSON.stringify(talkBookings));
  }, [talkBookings]);

  // Favorites state
  const [favorites, setFavorites] = useState<string[]>(() => {
    const saved = localStorage.getItem('ddj_favorites');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error(e);
      }
    }
    return ['tour-2'];
  });

  useEffect(() => {
    localStorage.setItem('ddj_favorites', JSON.stringify(favorites));
  }, [favorites]);

  // Dynamic Custom Theme Tags (AI detected & User created, synced with LocalStorage)
  const [customThemes, setCustomThemes] = useState<CustomTheme[]>(() => {
    const saved = localStorage.getItem('ddj_custom_themes_v2');
    if (saved) {
      try {
        const parsed: CustomTheme[] = JSON.parse(saved);
        const existingKeys = new Set(parsed.map((c) => c.categoryKey));
        const missing = INITIAL_CUSTOM_THEMES.filter((c) => !existingKeys.has(c.categoryKey));
        return [...missing, ...parsed];
      } catch (e) {
        console.error(e);
      }
    }
    return INITIAL_CUSTOM_THEMES;
  });

  useEffect(() => {
    localStorage.setItem('ddj_custom_themes_v2', JSON.stringify(customThemes));
  }, [customThemes]);

  const handleAddCustomTheme = (newTheme: CustomTheme) => {
    setCustomThemes((prev) => {
      if (prev.some((t) => t.categoryKey === newTheme.categoryKey)) return prev;
      return [newTheme, ...prev];
    });
  };

  // Modal states & URL deep-linking (?tour={tourId})
  const [selectedTour, setSelectedTour] = useState<Tour | null>(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [editingTour, setEditingTour] = useState<Tour | null>(null);

  // Sync selectedTour with URL query parameter ?tour={tourId}
  const handleSelectTour = (tour: Tour | null) => {
    setSelectedTour(tour);
    try {
      const url = new URL(window.location.href);
      if (tour) {
        url.searchParams.set('tour', tour.id);
      } else {
        url.searchParams.delete('tour');
      }
      window.history.replaceState(null, '', url.toString());
    } catch (e) {
      console.error(e);
    }
  };

  // Helper: Find tour by ID or alias safely
  const findTourByIdOrAlias = (param: string) => {
    const p = param.trim().toLowerCase();
    return tours.find((t) => {
      const id = t.id.toLowerCase();
      return (
        id === p ||
        id === `tour-${p}` ||
        (p === 'tour-7' && id === 'tour-mottainai-sound') ||
        (p === '7' && id === 'tour-mottainai-sound') ||
        (p === 'mottainai' && id.includes('mottainai')) ||
        (p === 'shinsengumi' && id === 'tour-1')
      );
    });
  };

  // Deep-link check on initial mount or when tours are loaded
  useEffect(() => {
    try {
      const params = new URLSearchParams(window.location.search);
      const tourParam = params.get('tour') || params.get('id');
      if (tourParam) {
        const found = findTourByIdOrAlias(tourParam);
        if (found) {
          setSelectedTour(found);
        }
      }
    } catch (e) {
      console.error(e);
    }
  }, [tours]);

  // Handle browser back/forward buttons
  useEffect(() => {
    const handlePopState = () => {
      try {
        const params = new URLSearchParams(window.location.search);
        const tourParam = params.get('tour') || params.get('id');
        if (tourParam) {
          const found = findTourByIdOrAlias(tourParam);
          setSelectedTour(found || null);
        } else {
          setSelectedTour(null);
        }
      } catch (e) {
        console.error(e);
      }
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, [tours]);

  // Filter & Search states
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<TourCategory | 'all'>('all');
  const [selectedArea, setSelectedArea] = useState<string>('all');
  const [selectedLevel, setSelectedLevel] = useState<number | 'all'>('all');
  const [sortBy, setSortBy] = useState<'popular' | 'newest' | 'price-asc' | 'price-desc' | 'otaku-level'>('popular');

  // Toggle favorite
  const handleToggleFavorite = (tourId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setFavorites((prev) =>
      prev.includes(tourId) ? prev.filter((id) => id !== tourId) : [...prev, tourId]
    );
  };

  // Add booking
  const handleAddBooking = (newBookingData: Omit<Booking, 'id' | 'createdAt'>) => {
    const newBooking: Booking = {
      ...newBookingData,
      id: `booking-${Date.now()}`,
      createdAt: new Date().toISOString().split('T')[0],
    };
    setBookings((prev) => [newBooking, ...prev]);
  };

  // Cancel booking
  const handleCancelBooking = (bookingId: string) => {
    if (confirm(lang === 'ja' ? '予約をキャンセルしますか？' : 'Cancel this booking?')) {
      setBookings((prev) => prev.filter((b) => b.id !== bookingId));
    }
  };

  // Add talk session booking
  const handleAddTalkBooking = (newTalkData: Omit<TalkSessionBooking, 'id' | 'createdAt'>) => {
    const newTalk: TalkSessionBooking = {
      ...newTalkData,
      id: `talk-${Date.now()}`,
      createdAt: new Date().toISOString().split('T')[0],
    };
    setTalkBookings((prev) => [newTalk, ...prev]);
  };

  // Cancel talk session booking
  const handleCancelTalkBooking = (talkId: string) => {
    if (confirm(lang === 'ja' ? '会話セッションをキャンセルしますか？' : 'Cancel this talk session?')) {
      setTalkBookings((prev) => prev.filter((t) => t.id !== talkId));
    }
  };

  // Add review
  const handleAddReview = (newRev: Omit<TourReview, 'id' | 'date'>) => {
    const review: TourReview = {
      ...newRev,
      id: `rev-${Date.now()}`,
      date: new Date().toISOString().split('T')[0],
    };
    setReviews((prev) => [review, ...prev]);

    // Update tour review stats
    setTours((prev) =>
      prev.map((tour) => {
        if (tour.id === review.tourId) {
          const newCount = tour.reviewsCount + 1;
          const newRating = Number(
            ((tour.rating * tour.reviewsCount + review.rating) / newCount).toFixed(2)
          );
          return { ...tour, reviewsCount: newCount, rating: newRating };
        }
        return tour;
      })
    );
  };

  // Add tour
  const handleTourCreated = (newTour: Tour) => {
    setTours((prev) => [newTour, ...prev]);
    setCurrentTab('explore');
  };

  // Edit hosted tour
  const handleEditHostedTour = (tour: Tour) => {
    setEditingTour(tour);
    setIsCreateModalOpen(true);
  };

  // Update tour
  const handleTourUpdated = (updatedTour: Tour) => {
    setTours((prev) => prev.map((t) => (t.id === updatedTour.id ? updatedTour : t)));
    setEditingTour(null);
    setIsCreateModalOpen(false);
    if (selectedTour && selectedTour.id === updatedTour.id) {
      setSelectedTour(updatedTour);
    }
  };

  // Delete hosted tour
  const handleDeleteHostedTour = (tourId: string) => {
    if (confirm(lang === 'ja' ? 'このツアーを削除しますか？' : 'Delete this tour?')) {
      setTours((prev) => prev.filter((t) => t.id !== tourId));
    }
  };

  // Add custom request
  const handleAddRequest = (reqData: Omit<TourRequest, 'id' | 'upvotes' | 'offersCount' | 'status' | 'createdAt'>) => {
    const newReq: TourRequest = {
      ...reqData,
      id: `req-${Date.now()}`,
      upvotes: 1,
      offersCount: 0,
      status: 'recruiting',
      createdAt: new Date().toISOString().split('T')[0],
    };
    setRequests((prev) => [newReq, ...prev]);
  };

  // Upvote request
  const handleUpvoteRequest = (id: string) => {
    setRequests((prev) =>
      prev.map((r) => (r.id === id ? { ...r, upvotes: r.upvotes + 1 } : r))
    );
  };

  // Available unique areas
  const availableAreas = useMemo(() => {
    const areas = new Set<string>();
    tours.forEach((t) => {
      areas.add(t.area);
    });
    return Array.from(areas);
  }, [tours]);

  // Filtered & Sorted tours
  const filteredTours = useMemo(() => {
    return tours
      .filter((tour) => {
        // Search query
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase();
          const matchTitle = tour.title.toLowerCase().includes(q) || tour.titleEn.toLowerCase().includes(q);
          const matchDesc = tour.description.toLowerCase().includes(q) || tour.descriptionEn.toLowerCase().includes(q);
          const matchArea = tour.area.toLowerCase().includes(q);
          const matchTags = tour.tags.some((tag) => tag.toLowerCase().includes(q));
          if (!matchTitle && !matchDesc && !matchArea && !matchTags) return false;
        }

        // Category / Custom Theme Filter
        if (selectedCategory !== 'all') {
          const customTheme = customThemes.find((c) => c.categoryKey === selectedCategory);
          const isDirectCategoryMatch = tour.category === selectedCategory;
          const isCustomThemeMatch = customTheme
            ? tour.tags.some(
                (t) =>
                  t.toLowerCase().includes(customTheme.name.toLowerCase()) ||
                  customTheme.sampleTags.some((st) => t.toLowerCase().includes(st.toLowerCase()))
              ) ||
              tour.title.toLowerCase().includes(customTheme.name.split('・')[0].toLowerCase())
            : false;

          if (!isDirectCategoryMatch && !isCustomThemeMatch) {
            return false;
          }
        }

        // Area
        if (selectedArea !== 'all' && tour.area !== selectedArea) {
          return false;
        }

        // Otaku Level
        if (selectedLevel !== 'all' && tour.otakuLevel !== selectedLevel) {
          return false;
        }

        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'popular') return b.rating * b.reviewsCount - a.rating * a.reviewsCount;
        if (sortBy === 'otaku-level') return b.otakuLevel - a.otakuLevel;
        if (sortBy === 'newest') return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        if (sortBy === 'price-asc') return a.price - b.price;
        if (sortBy === 'price-desc') return b.price - a.price;
        return 0;
      });
  }, [tours, searchQuery, selectedCategory, selectedArea, selectedLevel, sortBy, customThemes]);

  // Reset filters
  const handleResetFilters = () => {
    setSearchQuery('');
    setSelectedCategory('all');
    setSelectedArea('all');
    setSelectedLevel('all');
    setSortBy('popular');
  };

  // Hosted tours (e.g., custom created tours)
  const myHostedTours = tours.filter((t) => t.id.startsWith('tour-custom-'));

  // Smooth scroll helper to tours section
  const scrollToExplore = () => {
    const el = document.getElementById('explore-section');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const t = translations[lang];

  // View Mode: 'grid' | 'catalog' | 'map'
  const [viewMode, setViewMode] = useState<'grid' | 'catalog' | 'map'>('grid');

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans selection:bg-blue-600 selection:text-white max-w-full overflow-x-clip">
      {/* Navbar */}
      <Navbar
        currentTab={currentTab}
        setCurrentTab={(tab) => {
          setCurrentTab(tab);
          if (tab === 'explore') {
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }
        }}
        openCreateModal={() => {
          setEditingTour(null);
          setIsCreateModalOpen(true);
        }}
        lang={lang}
        setLang={setLang}
        currency={currency}
        setCurrency={setCurrency}
        favoritesCount={favorites.length}
        openFavorites={() => {
          setCurrentTab('mypage');
        }}
      />

      {/* Main Content Area */}
      <main className="flex-1">
        {currentTab === 'explore' && (
          <>
            {/* Hero Section */}
            <Hero
              lang={lang}
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
              selectedCategory={selectedCategory}
              setSelectedCategory={(cat) => {
                setSelectedCategory(cat);
                scrollToExplore();
              }}
              onSearch={scrollToExplore}
              openCreateModal={() => {
                setEditingTour(null);
                setIsCreateModalOpen(true);
              }}
              customThemes={customThemes}
              onAddCustomTheme={handleAddCustomTheme}
            />

            {/* Tours Exploration Area */}
            <div id="explore-section" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 scroll-mt-20">
              {/* Category Filter Pills */}
              <CategoryFilter
                selectedCategory={selectedCategory}
                setSelectedCategory={setSelectedCategory}
                lang={lang}
                customThemes={customThemes}
              />

              {/* Multi-Filter Bar */}
              <FilterBar
                lang={lang}
                selectedArea={selectedArea}
                setSelectedArea={setSelectedArea}
                selectedLevel={selectedLevel}
                setSelectedLevel={setSelectedLevel}
                sortBy={sortBy}
                setSortBy={setSortBy}
                onReset={handleResetFilters}
                totalCount={filteredTours.length}
                availableAreas={availableAreas}
              />

              {/* Section Title & View Mode Toggle */}
              <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4 mb-6 pb-4 border-b border-slate-200">
                <div>
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-100 text-blue-800 border border-blue-200 text-xs font-bold mb-2">
                    <Flame className="w-3.5 h-3.5 text-blue-600 fill-blue-600" />
                    <span>{lang === 'ja' ? '厳選ディープツアー一覧' : 'Curated Passion Tours'}</span>
                  </div>
                  <h2 className="text-2xl sm:text-3xl font-black text-slate-900">
                    {lang === 'ja' ? '今すぐ参加できる日本の偏愛ツアー' : 'Available Cultural Walking Tours'}
                  </h2>
                  <p className="text-xs sm:text-sm text-slate-500 mt-1">
                    {lang === 'ja' ? '＼ 歴史・鉄道・アニメ聖地・古書・城郭。全コース旅のしおり付き ／' : 'Samurai history, railways, anime holy grounds & vintage books'}
                  </p>
                </div>

                {/* View Mode Toggle */}
                <div className="flex items-center gap-1 bg-white p-1 rounded-xl border border-slate-200 shadow-xs self-end sm:self-auto text-xs font-bold">
                  <button
                    onClick={() => setViewMode('grid')}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                      viewMode === 'grid'
                        ? 'bg-blue-600 text-white shadow-xs'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    <LayoutGrid className="w-3.5 h-3.5" />
                    <span>{lang === 'ja' ? 'カード' : 'Grid'}</span>
                  </button>
                  <button
                    onClick={() => setViewMode('catalog')}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                      viewMode === 'catalog'
                        ? 'bg-blue-600 text-white shadow-xs'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    <List className="w-3.5 h-3.5" />
                    <span>{lang === 'ja' ? 'リスト' : 'List'}</span>
                  </button>
                  <button
                    onClick={() => setViewMode('map')}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                      viewMode === 'map'
                        ? 'bg-blue-600 text-white shadow-xs'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    <MapPin className="w-3.5 h-3.5 text-rose-500" />
                    <span>{lang === 'ja' ? '🗺️ マップ' : 'Map'}</span>
                  </button>
                </div>
              </div>

              {/* Tours Grid, Catalog, or Interactive Map */}
              {filteredTours.length === 0 ? (
                <div className="text-center py-20 bg-white rounded-3xl border border-slate-200 shadow-xs">
                  <p className="text-base text-slate-800 font-bold mb-2">
                    {lang === 'ja' ? '条件に一致するツアーが見つかりませんでした。' : 'No tours match your current filters.'}
                  </p>
                  <p className="text-xs text-slate-500 mb-6">
                    {lang === 'ja' ? '検索キーワードを変更するか、フィルターをリセットしてください。' : 'Try broadening your search or resetting filters.'}
                  </p>
                  <button
                    onClick={handleResetFilters}
                    className="px-5 py-2.5 rounded-xl bg-blue-600 text-white font-bold text-xs hover:bg-blue-500 transition-colors shadow-xs cursor-pointer"
                  >
                    {t.filter.reset}
                  </button>
                </div>
              ) : viewMode === 'map' ? (
                <InteractiveMapView
                  tours={filteredTours}
                  lang={lang}
                  currency={currency}
                  onSelectTour={(t) => handleSelectTour(t)}
                />
              ) : viewMode === 'grid' ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
                  {filteredTours.map((tour) => (
                    <TourCard
                      key={tour.id}
                      tour={tour}
                      lang={lang}
                      currency={currency}
                      onSelect={(t) => handleSelectTour(t)}
                      isFavorite={favorites.includes(tour.id)}
                      onToggleFavorite={handleToggleFavorite}
                    />
                  ))}
                </div>
              ) : (
                /* Catalog / リスト表示 */
                <div className="space-y-4">
                  {filteredTours.map((tour) => (
                    <div
                      key={tour.id}
                      onClick={() => handleSelectTour(tour)}
                      className="bg-white hover:bg-blue-50/20 rounded-2xl border border-slate-200 hover:border-blue-400 p-4 sm:p-5 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 cursor-pointer shadow-xs hover:shadow-md transition-all"
                    >
                      <div className="flex items-start sm:items-center gap-4 flex-1">
                        <img
                          src={tour.imageUrl}
                          alt={tour.title}
                          className="w-20 h-20 sm:w-24 sm:h-24 rounded-xl object-cover border border-slate-200 flex-shrink-0"
                        />
                        <div className="space-y-1">
                          <div className="flex flex-wrap items-center gap-2">
                            <span className="text-[10px] px-2.5 py-0.5 rounded-full bg-blue-100 text-blue-800 font-bold border border-blue-200">
                              Lv.{tour.otakuLevel} 熱量
                            </span>
                            <span className="text-xs text-slate-700 font-bold bg-slate-100 px-2.5 py-0.5 rounded border border-slate-200">
                              {tour.area}
                            </span>
                            <span className="text-xs text-slate-500 font-medium">
                              所要: {tour.durationHours}時間 / 定員 {tour.maxParticipants}名
                            </span>
                          </div>
                          <h3 className="font-bold text-slate-900 text-base hover:text-blue-600 transition-colors">
                            {lang === 'ja' ? tour.title : tour.titleEn}
                          </h3>
                          <p className="text-xs text-slate-600 line-clamp-1">
                            {tour.catchphrase}
                          </p>
                          <div className="text-[11px] text-slate-500">
                            ガイド: <b className="text-slate-800">{tour.guide.name}</b> (愛好歴{tour.guide.otakuYears}年)
                          </div>
                        </div>
                      </div>

                      <div className="flex md:flex-col items-center md:items-end justify-between w-full md:w-auto gap-3 pt-3 md:pt-0 border-t md:border-t-0 border-slate-100">
                        <div className="text-right">
                          <div className="text-[10px] text-slate-400 font-medium">1名あたり</div>
                          <div className="text-xl font-black text-slate-900">
                            <span className="text-blue-600">{formatPrice(tour.price, currency)}</span>
                          </div>
                        </div>
                        <button
                          type="button"
                          className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow-xs transition-all whitespace-nowrap cursor-pointer"
                        >
                          旅程・予約へ →
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Tour Itinerary Shiori Section */}
            <TourShioriSection lang={lang} />

            {/* Features & Why Us */}
            <FeaturesSection
              lang={lang}
              openCreateModal={() => {
                setEditingTour(null);
                setIsCreateModalOpen(true);
              }}
            />
          </>
        )}

        {currentTab === 'requests' && (
          <RequestBoardView
            lang={lang}
            requests={requests}
            onAddRequest={handleAddRequest}
            onUpvoteRequest={handleUpvoteRequest}
          />
        )}

        {currentTab === 'mypage' && (
          <MyPageView
            lang={lang}
            currency={currency}
            bookings={bookings}
            onCancelBooking={handleCancelBooking}
            talkBookings={talkBookings}
            onCancelTalkBooking={handleCancelTalkBooking}
            favorites={favorites}
            allTours={tours}
            onSelectTour={(t) => handleSelectTour(t)}
            onToggleFavorite={handleToggleFavorite}
            myHostedTours={myHostedTours}
            onDeleteHostedTour={handleDeleteHostedTour}
            onEditHostedTour={handleEditHostedTour}
            onOpenCreateTour={() => {
              setEditingTour(null);
              setIsCreateModalOpen(true);
            }}
          />
        )}
      </main>

      {/* Tour Detail Modal */}
      {selectedTour && (
        <TourDetailModal
          tour={selectedTour}
          onClose={() => handleSelectTour(null)}
          lang={lang}
          currency={currency}
          isFavorite={favorites.includes(selectedTour.id)}
          onToggleFavorite={handleToggleFavorite}
          reviews={reviews}
          onAddReview={handleAddReview}
          onAddBooking={handleAddBooking}
          onAddTalkBooking={handleAddTalkBooking}
        />
      )}

      {/* Create Tour Modal */}
      <CreateTourModal
        isOpen={isCreateModalOpen}
        onClose={() => {
          setIsCreateModalOpen(false);
          setEditingTour(null);
        }}
        lang={lang}
        onTourCreated={handleTourCreated}
        initialTour={editingTour}
        onTourUpdated={handleTourUpdated}
        customThemes={customThemes}
        onAddCustomTheme={handleAddCustomTheme}
      />

      {/* Footer */}
      <Footer lang={lang} />
    </div>
  );
}

export default App;
