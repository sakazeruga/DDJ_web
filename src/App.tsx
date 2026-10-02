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
import { Flame, LayoutGrid, List } from 'lucide-react';

import type { 
  Tour, 
  TourRequest, 
  TourReview, 
  Booking, 
  Language, 
  TourCategory 
} from './types';
import { INITIAL_TOURS, INITIAL_REQUESTS, INITIAL_REVIEWS } from './data/mockTours';
import { translations } from './i18n/translations';

export function App() {
  // Language state
  const [lang, setLang] = useState<Language>(() => {
    return (localStorage.getItem('ddj_lang') as Language) || 'ja';
  });

  useEffect(() => {
    localStorage.setItem('ddj_lang', lang);
  }, [lang]);

  // Tab navigation
  const [currentTab, setCurrentTab] = useState<'explore' | 'requests' | 'mypage'>('explore');

  // Tours state (synced with LocalStorage)
  const [tours, setTours] = useState<Tour[]>(() => {
    const saved = localStorage.getItem('ddj_tours');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error(e);
      }
    }
    return INITIAL_TOURS;
  });

  useEffect(() => {
    localStorage.setItem('ddj_tours', JSON.stringify(tours));
  }, [tours]);

  // Requests state
  const [requests, setRequests] = useState<TourRequest[]>(() => {
    const saved = localStorage.getItem('ddj_requests');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error(e);
      }
    }
    return INITIAL_REQUESTS;
  });

  useEffect(() => {
    localStorage.setItem('ddj_requests', JSON.stringify(requests));
  }, [requests]);

  // Reviews state
  const [reviews, setReviews] = useState<TourReview[]>(() => {
    const saved = localStorage.getItem('ddj_reviews');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error(e);
      }
    }
    return INITIAL_REVIEWS;
  });

  useEffect(() => {
    localStorage.setItem('ddj_reviews', JSON.stringify(reviews));
  }, [reviews]);

  // Bookings state
  const [bookings, setBookings] = useState<Booking[]>(() => {
    const saved = localStorage.getItem('ddj_bookings');
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
        tourTitle: '【秋葉原裏ルート】電子部品ジャンク街・レトロ自販機・老舗同人ディープ探訪',
        tourImage: 'https://images.unsplash.com/photo-1578632767115-351597cf2477?auto=format&fit=crop&w=1200&q=80',
        date: '2026-10-12',
        participantsCount: 2,
        totalPrice: 15000,
        userName: 'オタク太郎',
        userEmail: 'otaku@example.com',
        status: 'confirmed',
        createdAt: '2026-10-01',
      },
    ];
  });

  useEffect(() => {
    localStorage.setItem('ddj_bookings', JSON.stringify(bookings));
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

  // View Mode: 'grid' or 'catalog' (コミケお品書き風)
  const [viewMode, setViewMode] = useState<'grid' | 'catalog'>('grid');

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-yellow-400 selection:text-black">
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
              <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4 mb-6 pb-4 border-b border-slate-800">
                <div>
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full otaku-badge-yellow text-xs font-black mb-2">
                    <Flame className="w-3.5 h-3.5 text-black fill-black" />
                    <span>{lang === 'ja' ? '厳選ディープツアー一覧' : 'Featured Deep Tours'}</span>
                  </div>
                  <h2 className="text-2xl sm:text-3xl font-black text-white">
                    {lang === 'ja' ? '今すぐ参加できる聖地・オタクツアー' : 'Available Otaku Tours & Pilgrimages'}
                  </h2>
                  <p className="text-xs sm:text-sm text-slate-400 mt-1">
                    {lang === 'ja' ? '＼ 全ツアー・旅のしおり＆巡礼マップ付き！ガイドと少人数で潜行 ／' : 'All tours include itinerary shiori & pilgrimage guide'}
                  </p>
                </div>

                {/* View Mode Toggle (Grid vs コミケお品書き) */}
                <div className="flex items-center gap-1 bg-slate-900 p-1.5 rounded-xl border border-slate-800 self-end sm:self-auto text-xs font-bold">
                  <button
                    onClick={() => setViewMode('grid')}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all ${
                      viewMode === 'grid'
                        ? 'bg-purple-600 text-white shadow'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    <LayoutGrid className="w-3.5 h-3.5" />
                    <span>{lang === 'ja' ? 'カード表示' : 'Grid'}</span>
                  </button>
                  <button
                    onClick={() => setViewMode('catalog')}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all ${
                      viewMode === 'catalog'
                        ? 'bg-yellow-400 text-black shadow font-black'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    <List className="w-3.5 h-3.5" />
                    <span>{lang === 'ja' ? 'お品書き表示' : 'Catalog'}</span>
                  </button>
                </div>
              </div>

              {/* Tours Grid or Catalog */}
              {filteredTours.length === 0 ? (
                <div className="text-center py-20 bg-slate-900/40 rounded-3xl border border-slate-800">
                  <p className="text-base text-slate-300 font-semibold mb-2">
                    {lang === 'ja' ? '条件に一致するツアーが見つかりませんでした。' : 'No tours match your current filters.'}
                  </p>
                  <p className="text-xs text-slate-400 mb-6">
                    {lang === 'ja' ? '検索キーワードを変更するか、フィルターをリセットしてください。' : 'Try broadening your search or resetting filters.'}
                  </p>
                  <button
                    onClick={handleResetFilters}
                    className="px-5 py-2.5 rounded-xl bg-purple-600 text-white font-bold text-xs hover:bg-purple-500 transition-colors"
                  >
                    {t.filter.reset}
                  </button>
                </div>
              ) : viewMode === 'grid' ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
                  {filteredTours.map((tour) => (
                    <TourCard
                      key={tour.id}
                      tour={tour}
                      lang={lang}
                      onSelect={(t) => setSelectedTour(t)}
                      isFavorite={favorites.includes(tour.id)}
                      onToggleFavorite={handleToggleFavorite}
                    />
                  ))}
                </div>
              ) : (
                /* Catalog / お品書き風リスト表示 */
                <div className="space-y-4">
                  {filteredTours.map((tour) => (
                    <div
                      key={tour.id}
                      onClick={() => setSelectedTour(tour)}
                      className="bg-slate-900 hover:bg-slate-850 rounded-2xl border-2 border-slate-700 hover:border-yellow-400 p-4 sm:p-5 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 cursor-pointer otaku-sticker transition-all"
                    >
                      <div className="flex items-start sm:items-center gap-4 flex-1">
                        <img
                          src={tour.imageUrl}
                          alt={tour.title}
                          className="w-20 h-20 sm:w-24 sm:h-24 rounded-xl object-cover border border-slate-800 flex-shrink-0"
                        />
                        <div className="space-y-1">
                          <div className="flex flex-wrap items-center gap-2">
                            <span className="otaku-badge-yellow text-[10px] px-2 py-0.5 rounded-full font-black">
                              Lv.{tour.otakuLevel} 沼度
                            </span>
                            <span className="text-xs text-cyan-400 font-bold bg-slate-950 px-2 py-0.5 rounded border border-slate-800">
                              {tour.area}
                            </span>
                            <span className="text-xs text-slate-400">
                              所要: {tour.durationHours}時間 / 定員 {tour.maxParticipants}名
                            </span>
                          </div>
                          <h3 className="font-black text-white text-base hover:text-yellow-400 transition-colors">
                            {lang === 'ja' ? tour.title : tour.titleEn}
                          </h3>
                          <p className="text-xs text-slate-300 line-clamp-1">
                            {tour.catchphrase}
                          </p>
                          <div className="text-[11px] text-purple-300">
                            ガイド: <b>{tour.guide.name}</b> (オタク歴{tour.guide.otakuYears}年)
                          </div>
                        </div>
                      </div>

                      <div className="flex md:flex-col items-center md:items-end justify-between w-full md:w-auto gap-3 pt-3 md:pt-0 border-t md:border-t-0 border-slate-800">
                        <div className="text-right">
                          <div className="text-[10px] text-slate-400">1名あたり</div>
                          <div className="text-xl font-black text-yellow-400">
                            ¥{tour.price.toLocaleString()}
                          </div>
                        </div>
                        <button
                          type="button"
                          className="px-4 py-2 rounded-xl bg-yellow-400 hover:bg-yellow-300 text-slate-950 font-black text-xs shadow transition-all whitespace-nowrap"
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
