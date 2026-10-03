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
  Language, 
  Currency,
  TourCategory 
} from './types';
import { INITIAL_TOURS, INITIAL_REQUESTS, INITIAL_REVIEWS } from './data/mockTours';
import { translations } from './i18n/translations';
import { formatPrice } from './utils/currency';

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

  // Modal states
  const [selectedTour, setSelectedTour] = useState<Tour | null>(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

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

        // Category
        if (selectedCategory !== 'all' && tour.category !== selectedCategory) {
          return false;
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
  }, [tours, searchQuery, selectedCategory, selectedArea, selectedLevel, sortBy]);

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
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans selection:bg-blue-600 selection:text-white">
      {/* Navbar */}
      <Navbar
        currentTab={currentTab}
        setCurrentTab={(tab) => {
          setCurrentTab(tab);
          if (tab === 'explore') {
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }
        }}
        openCreateModal={() => setIsCreateModalOpen(true)}
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
              openCreateModal={() => setIsCreateModalOpen(true)}
              onTagClick={(tag) => {
                setSearchQuery(tag.replace('#', ''));
                scrollToExplore();
              }}
            />

            {/* Tours Exploration Area */}
            <div id="explore-section" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 scroll-mt-20">
              {/* Category Filter Pills */}
              <CategoryFilter
                selectedCategory={selectedCategory}
                setSelectedCategory={setSelectedCategory}
                lang={lang}
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
                  onSelectTour={(t) => setSelectedTour(t)}
                />
              ) : viewMode === 'grid' ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
                  {filteredTours.map((tour) => (
                    <TourCard
                      key={tour.id}
                      tour={tour}
                      lang={lang}
                      currency={currency}
                      onSelect={(t) => setSelectedTour(t)}
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
                      onClick={() => setSelectedTour(tour)}
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
              openCreateModal={() => setIsCreateModalOpen(true)}
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
            favorites={favorites}
            allTours={tours}
            onSelectTour={(t) => setSelectedTour(t)}
            onToggleFavorite={handleToggleFavorite}
            myHostedTours={myHostedTours}
            onDeleteHostedTour={handleDeleteHostedTour}
          />
        )}
      </main>

      {/* Tour Detail Modal */}
      {selectedTour && (
        <TourDetailModal
          tour={selectedTour}
          onClose={() => setSelectedTour(null)}
          lang={lang}
          currency={currency}
          isFavorite={favorites.includes(selectedTour.id)}
          onToggleFavorite={handleToggleFavorite}
          reviews={reviews}
          onAddReview={handleAddReview}
          onAddBooking={handleAddBooking}
        />
      )}

      {/* Create Tour Modal */}
      <CreateTourModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        lang={lang}
        onTourCreated={handleTourCreated}
      />

      {/* Footer */}
      <Footer lang={lang} />
    </div>
  );
}

export default App;
