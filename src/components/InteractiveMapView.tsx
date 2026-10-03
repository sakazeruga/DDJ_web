import React, { useState } from 'react';
import { 
  MapPin, 
  ExternalLink, 
  Eye, 
  Hotel, 
  UtensilsCrossed, 
  Gift, 
  Camera, 
  Compass, 
  Flame, 
  ArrowRight,
  Clock,
  Navigation,
  Footprints
} from 'lucide-react';
import type { Tour, Language, NearbySpotCategory, NearbySpot, Currency, ItineraryItem } from '../types';
import { formatPrice } from '../utils/currency';
import { getGoogleMapsWalkingDirectionsUrl, getCleanEmbedQuery } from '../utils/mapRoute';
import { translations } from '../i18n/translations';

interface InteractiveMapViewProps {
  tours: Tour[];
  lang: Language;
  currency?: Currency;
  onSelectTour: (tour: Tour) => void;
}

export const InteractiveMapView: React.FC<InteractiveMapViewProps> = ({
  tours,
  lang,
  currency = 'JPY',
  onSelectTour,
}) => {
  // Currently active tour
  const [activeTourId, setActiveTourId] = useState<string>(() => tours[0]?.id || '');
  // Sub tab on the right: 'route' (モデルコース順路案内) or 'nearby' (周辺スポット探索)
  const [rightTab, setRightTab] = useState<'route' | 'nearby'>('route');
  // Filter for nearby spots
  const [spotCategory, setSpotCategory] = useState<NearbySpotCategory | 'all'>('all');
  // Focused spot or itinerary item
  const [focusedSpot, setFocusedSpot] = useState<NearbySpot | null>(null);
  const [focusedItinerary, setFocusedItinerary] = useState<ItineraryItem | null>(null);

  const activeTour = tours.find((t) => t.id === activeTourId) || tours[0];

  if (!activeTour) return null;

  // Active query or coordinates for the map
  const activeCoords = focusedSpot?.lat && focusedSpot?.lng
    ? { lat: focusedSpot.lat, lng: focusedSpot.lng, zoom: 16 }
    : activeTour.coordinates || { lat: 35.6762, lng: 139.6503, zoom: 14 };

  const mapQueryParam = getCleanEmbedQuery(
    focusedItinerary,
    activeTour,
    focusedSpot?.googleMapsQuery || focusedSpot?.name
  );

  const mapEmbedUrl = `https://maps.google.com/maps?q=${mapQueryParam}&z=${activeCoords.zoom || 15}&output=embed`;

  const filteredSpots = (activeTour.nearbySpots || []).filter((s) => {
    if (spotCategory === 'all') return true;
    return s.category === spotCategory;
  });

  const getCategoryIcon = (cat: NearbySpotCategory) => {
    switch (cat) {
      case 'hotel':
        return <Hotel className="w-3.5 h-3.5 text-indigo-600" />;
      case 'dining':
        return <UtensilsCrossed className="w-3.5 h-3.5 text-amber-600" />;
      case 'souvenir':
        return <Gift className="w-3.5 h-3.5 text-emerald-600" />;
      case 'scenery':
        return <Camera className="w-3.5 h-3.5 text-sky-600" />;
    }
  };

  // Google Maps Full Route Navigation URL (rock-solid, 100% verified route)
  const googleMapsDirectionsUrl = getGoogleMapsWalkingDirectionsUrl(activeTour);

  return (
    <div className="bg-white rounded-3xl border border-slate-200 shadow-xl overflow-hidden">
      {/* Top Controls: Tour Select Carousel */}
      <div className="bg-slate-50 p-4 border-b border-slate-200">
        <div className="flex items-center justify-between gap-3 mb-3">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-rose-500 animate-pulse" />
            <h3 className="text-sm font-black text-slate-900 flex items-center gap-1.5">
              <Compass className="w-4 h-4 text-blue-600" />
              <span>{lang === 'ja' ? '全国のツアー拠点・モデルコースを地図探索' : 'Interactive Destination & Route Map'}</span>
            </h3>
          </div>
          <span className="text-xs text-slate-500 font-medium hidden sm:inline">
            {lang === 'ja' ? '※ツアーを選択すると現地のモデルコース巡回線と周辺情報が連動します' : 'Select a tour to explore live route & nearby spots'}
          </span>
        </div>

        {/* Tour Selection Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
          {tours.map((t) => {
            const isSelected = t.id === activeTour.id;
            return (
              <button
                key={t.id}
                onClick={() => {
                  setActiveTourId(t.id);
                  setFocusedSpot(null);
                  setFocusedItinerary(null);
                }}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap flex items-center gap-2 border ${
                  isSelected
                    ? 'bg-blue-600 text-white border-blue-600 shadow-sm scale-102'
                    : 'bg-white text-slate-700 border-slate-200 hover:border-blue-300 hover:bg-slate-100'
                }`}
              >
                <MapPin className={`w-3.5 h-3.5 ${isSelected ? 'text-white' : 'text-rose-500'}`} />
                <span>{lang === 'ja' ? t.area.split(' ')[0] : t.areaEn}</span>
                <span className={`text-[10px] px-1.5 py-0.2 rounded font-mono ${isSelected ? 'bg-blue-700 text-blue-100' : 'bg-slate-100 text-slate-500'}`}>
                  Lv.{t.otakuLevel}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Main 2-Column Split: Left Map, Right Tour & Navigation Tabs */}
      <div className="grid grid-cols-1 lg:grid-cols-12 min-h-[580px]">
        {/* Left (7 cols): Google Maps Embed & Controls */}
        <div className="lg:col-span-7 flex flex-col bg-slate-100 border-b lg:border-b-0 lg:border-r border-slate-200 relative">
          {/* Map Top Bar */}
          <div className="bg-white/95 backdrop-blur-md px-4 py-2.5 border-b border-slate-200 flex items-center justify-between text-xs gap-2">
            <div className="flex items-center gap-2 truncate">
              <span className="font-bold text-slate-900 truncate">
                {focusedItinerary
                  ? `🚶 順路: ${focusedItinerary.spotTitle}`
                  : focusedSpot 
                  ? `📍 ${lang === 'ja' ? focusedSpot.name : focusedSpot.nameEn}` 
                  : `📍 ${lang === 'ja' ? activeTour.meetingPoint : activeTour.meetingPointEn}`}
              </span>
            </div>

            <div className="flex items-center gap-2 flex-shrink-0">
              <a
                href={googleMapsDirectionsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-800 hover:bg-emerald-100 border border-emerald-200 font-bold flex items-center gap-1 text-[11px]"
                title="Googleマップアプリで徒歩ルート案内を開始"
              >
                <Navigation className="w-3 h-3 text-emerald-600" />
                <span>徒歩ナビ開始</span>
                <ExternalLink className="w-3 h-3" />
              </a>

              <a
                href={`https://www.google.com/maps/@?api=1&map_action=pano&viewpoint=${activeCoords.lat},${activeCoords.lng}`}
                target="_blank"
                rel="noopener noreferrer"
                className="px-2.5 py-1 rounded-lg bg-amber-50 text-amber-800 hover:bg-amber-100 border border-amber-200 font-bold flex items-center gap-1 text-[11px]"
              >
                <Eye className="w-3 h-3" />
                <span className="hidden sm:inline">風景ビュー</span>
              </a>
            </div>
          </div>

          {/* Interactive Google Map Iframe */}
          <div className="flex-1 min-h-[380px] lg:min-h-[480px] w-full relative">
            <iframe
              title={`Map of ${activeTour.title}`}
              src={mapEmbedUrl}
              className="w-full h-full border-0 absolute inset-0"
              loading="lazy"
              allowFullScreen
            />
          </div>

          {/* Map Footer Note */}
          <div className="bg-white/95 px-4 py-2 border-t border-slate-200 flex items-center justify-between text-[11px] text-slate-500">
            <span>座標: {activeCoords.lat.toFixed(4)}, {activeCoords.lng.toFixed(4)}</span>
            <span>※Googleマップ上で直接ドラッグ・ズーム可能です</span>
          </div>
        </div>

        {/* Right (5 cols): Selected Tour Summary + Navigation Tabs */}
        <div className="lg:col-span-5 p-4 sm:p-5 flex flex-col justify-between space-y-4 bg-white overflow-y-auto max-h-[640px]">
          {/* Active Tour Highlight Card */}
          <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-2.5">
            <div className="flex items-center justify-between gap-2">
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-100 text-blue-800 border border-blue-200">
                {(translations[lang].categories as Record<string, string>)[activeTour.category] || (lang === 'ja' ? '偏愛ツアー' : 'Niche Tour')}
              </span>
              <div className="flex items-center gap-2 text-xs font-medium">
                <span className="font-black text-blue-600 text-sm">
                  {formatPrice(activeTour.price, currency)}
                </span>
                <span className="text-slate-300">|</span>
                <span className="flex items-center gap-1 text-slate-600">
                  <Clock className="w-3 h-3 text-blue-600" />
                  {activeTour.durationHours}h
                </span>
              </div>
            </div>

            <h4 className="font-bold text-slate-900 text-sm sm:text-base leading-snug">
              {lang === 'ja' ? activeTour.title : activeTour.titleEn}
            </h4>

            <div className="pt-2 border-t border-slate-200 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <img
                  src={activeTour.guide.avatar}
                  alt={activeTour.guide.name}
                  className="w-7 h-7 rounded-full object-cover border border-slate-200"
                />
                <span className="text-xs font-bold text-slate-800">
                  {lang === 'ja' ? activeTour.guide.name : activeTour.guide.nameEn}
                </span>
              </div>

              <button
                onClick={() => onSelectTour(activeTour)}
                className="px-3 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold transition-colors flex items-center gap-1 cursor-pointer"
              >
                <span>旅のしおりを見る</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Right Sub-Navigation Toggle: Route vs Nearby */}
          <div className="flex items-center bg-slate-100 p-1 rounded-xl border border-slate-200 text-xs font-bold">
            <button
              onClick={() => {
                setRightTab('route');
                setFocusedSpot(null);
              }}
              className={`flex-1 py-1.5 rounded-lg transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                rightTab === 'route' ? 'bg-white text-blue-600 shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Footprints className="w-3.5 h-3.5" />
              <span>モデルコース順路案内 ({activeTour.itinerary.length}箇所)</span>
            </button>
            <button
              onClick={() => {
                setRightTab('nearby');
                setFocusedItinerary(null);
              }}
              className={`flex-1 py-1.5 rounded-lg transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                rightTab === 'nearby' ? 'bg-white text-blue-600 shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Compass className="w-3.5 h-3.5" />
              <span>周辺スポット ({filteredSpots.length}件)</span>
            </button>
          </div>

          {/* TAB CONTENT 1: MODEL COURSE ROUTE NAVIGATION */}
          {rightTab === 'route' && (
            <div className="space-y-3">
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-500 font-medium">
                  {lang === 'ja' ? '※順路をクリックすると地図がその場所に移動します' : 'Click a waypoint to view on map'}
                </span>
                <a
                  href={googleMapsDirectionsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-emerald-700 hover:underline font-bold flex items-center gap-1 text-[11px]"
                >
                  <Navigation className="w-3 h-3" />
                  <span>Googleマップ全案内 →</span>
                </a>
              </div>

              {/* Sequential Route Stepper */}
              <div className="relative pl-6 space-y-3 before:absolute before:left-3 before:top-3 before:bottom-3 before:w-0.5 before:bg-blue-200">
                {activeTour.itinerary.map((item, idx) => {
                  const isFocused = focusedItinerary?.spotTitle === item.spotTitle;
                  const stepNumber = idx + 1;
                  return (
                    <div key={idx} className="relative">
                      {/* Step Number Badge Node */}
                      <div className={`absolute -left-[25px] top-2 w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-black border transition-colors ${
                        isFocused
                          ? 'bg-blue-600 text-white border-blue-600 shadow-xs ring-2 ring-blue-300'
                          : 'bg-white text-blue-700 border-blue-400'
                      }`}>
                        {stepNumber}
                      </div>

                      {/* Card */}
                      <div
                        onClick={() => {
                          setFocusedItinerary(item);
                          setFocusedSpot(null);
                        }}
                        className={`p-3 rounded-xl border transition-all cursor-pointer ${
                          isFocused
                            ? 'bg-blue-50/90 border-blue-500 shadow-sm ring-1 ring-blue-400'
                            : 'bg-slate-50 border-slate-200 hover:border-blue-300 hover:bg-white'
                        }`}
                      >
                        <div className="flex items-center justify-between gap-2 mb-1">
                          <span className="text-[11px] font-bold text-blue-700 bg-blue-100 px-2 py-0.2 rounded border border-blue-200">
                            {item.time}
                          </span>
                          {item.isDeepSpot ? (
                            <span className="text-[10px] font-bold text-rose-700 bg-rose-100 px-1.5 py-0.2 rounded flex items-center gap-0.5">
                              <Flame className="w-3 h-3" />
                              注目聖地
                            </span>
                          ) : idx < activeTour.itinerary.length - 1 ? (
                            <span className="text-[10px] text-slate-400 font-medium">
                              🚶 次へ徒歩 約{idx === 0 ? '5' : idx === 1 ? '10' : '8'}分
                            </span>
                          ) : null}
                        </div>

                        <h5 className="font-bold text-slate-900 text-xs sm:text-sm">
                          {lang === 'ja' ? item.spotTitle : item.spotTitleEn}
                        </h5>

                        <p className="text-[11px] text-slate-600 line-clamp-1 mt-0.5">
                          {lang === 'ja' ? item.description : item.descriptionEn}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* TAB CONTENT 2: NEARBY SPOTS */}
          {rightTab === 'nearby' && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-900">カテゴリ別:</span>
                {/* Category Pills */}
                <div className="flex items-center gap-1 overflow-x-auto text-[11px] no-scrollbar">
                  <button
                    onClick={() => setSpotCategory('all')}
                    className={`px-2 py-0.5 rounded-full font-bold cursor-pointer ${
                      spotCategory === 'all' ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    すべて
                  </button>
                  <button
                    onClick={() => setSpotCategory('hotel')}
                    className={`px-2 py-0.5 rounded-full font-bold cursor-pointer ${
                      spotCategory === 'hotel' ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    🏨 宿
                  </button>
                  <button
                    onClick={() => setSpotCategory('dining')}
                    className={`px-2 py-0.5 rounded-full font-bold cursor-pointer ${
                      spotCategory === 'dining' ? 'bg-amber-600 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    🍜 グルメ
                  </button>
                  <button
                    onClick={() => setSpotCategory('souvenir')}
                    className={`px-2 py-0.5 rounded-full font-bold cursor-pointer ${
                      spotCategory === 'souvenir' ? 'bg-emerald-600 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    🎁 お土産
                  </button>
                </div>
              </div>

              {/* Nearby Spot Cards */}
              <div className="space-y-2.5">
                {filteredSpots.map((spot) => {
                  const isFocused = focusedSpot?.id === spot.id;
                  return (
                    <div
                      key={spot.id}
                      onClick={() => {
                        setFocusedSpot(spot);
                        setFocusedItinerary(null);
                      }}
                      className={`p-2.5 rounded-xl border transition-all cursor-pointer flex items-center gap-3 ${
                        isFocused
                          ? 'bg-blue-50/80 border-blue-500 shadow-sm ring-1 ring-blue-400'
                          : 'bg-slate-50 border-slate-200 hover:border-blue-300 hover:bg-white'
                      }`}
                    >
                      <img
                        src={spot.imageUrl}
                        alt={spot.name}
                        className="w-14 h-14 rounded-lg object-cover flex-shrink-0 border border-slate-200"
                      />

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-1.5 mb-0.5">
                          <span className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-white text-slate-700 border border-slate-200 flex items-center gap-0.5">
                            {getCategoryIcon(spot.category)}
                            <span>{lang === 'ja' ? spot.categoryLabel : spot.categoryLabelEn}</span>
                          </span>
                          <span className="text-[10px] text-slate-400 font-medium">📍 {spot.distance}</span>
                          {spot.priceRange && (
                            <span className="text-[10px] text-emerald-700 font-bold ml-auto">{spot.priceRange}</span>
                          )}
                        </div>

                        <h6 className="font-bold text-slate-900 text-xs truncate">
                          {lang === 'ja' ? spot.name : spot.nameEn}
                        </h6>

                        <p className="text-[11px] text-slate-500 line-clamp-1 mt-0.5">
                          ✦ {spot.highlightTag}
                        </p>
                      </div>

                      <div className="text-right flex-shrink-0">
                        <span className={`text-[10px] font-bold px-2 py-1 rounded-md block ${
                          isFocused ? 'bg-blue-600 text-white' : 'bg-white text-blue-600 border border-slate-200'
                        }`}>
                          {isFocused ? '表示中' : '地図で見る'}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
