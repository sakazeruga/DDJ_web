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
  Clock
} from 'lucide-react';
import type { Tour, Language, NearbySpotCategory, NearbySpot } from '../types';

interface InteractiveMapViewProps {
  tours: Tour[];
  lang: Language;
  onSelectTour: (tour: Tour) => void;
}

export const InteractiveMapView: React.FC<InteractiveMapViewProps> = ({
  tours,
  lang,
  onSelectTour,
}) => {
  // Currently active tour
  const [activeTourId, setActiveTourId] = useState<string>(() => tours[0]?.id || '');
  // Filter for nearby spots
  const [spotCategory, setSpotCategory] = useState<NearbySpotCategory | 'all'>('all');
  // Focused spot
  const [focusedSpot, setFocusedSpot] = useState<NearbySpot | null>(null);

  const activeTour = tours.find((t) => t.id === activeTourId) || tours[0];

  if (!activeTour) return null;

  // Active coordinates for the map
  const activeCoords = focusedSpot?.lat && focusedSpot?.lng
    ? { lat: focusedSpot.lat, lng: focusedSpot.lng, zoom: 16 }
    : activeTour.coordinates || { lat: 35.6762, lng: 139.6503, zoom: 14 };

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

  return (
    <div className="bg-white rounded-3xl border border-slate-200 shadow-xl overflow-hidden">
      {/* Top Controls: Tour Select Carousel */}
      <div className="bg-slate-50 p-4 border-b border-slate-200">
        <div className="flex items-center justify-between gap-3 mb-3">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-rose-500 animate-pulse" />
            <h3 className="text-sm font-black text-slate-900 flex items-center gap-1.5">
              <Compass className="w-4 h-4 text-blue-600" />
              <span>{lang === 'ja' ? '全国のツアー拠点・スポットを地図探索' : 'Interactive Destination & Nearby Map'}</span>
            </h3>
          </div>
          <span className="text-xs text-slate-500 font-medium hidden sm:inline">
            {lang === 'ja' ? '※ツアーを選択すると現地のGoogleマップと周辺情報が連動します' : 'Select a tour to explore live maps & nearby spots'}
          </span>
        </div>

        {/* Tour Selection Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1">
          {tours.map((t) => {
            const isSelected = t.id === activeTour.id;
            return (
              <button
                key={t.id}
                onClick={() => {
                  setActiveTourId(t.id);
                  setFocusedSpot(null);
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

      {/* Main 2-Column Split: Left Map, Right Tour & Nearby List */}
      <div className="grid grid-cols-1 lg:grid-cols-12 min-h-[560px]">
        {/* Left (7 cols): Google Maps Embed & Controls */}
        <div className="lg:col-span-7 flex flex-col bg-slate-100 border-b lg:border-b-0 lg:border-r border-slate-200 relative">
          {/* Map Top Bar */}
          <div className="bg-white/95 backdrop-blur-md px-4 py-2.5 border-b border-slate-200 flex items-center justify-between text-xs gap-2">
            <div className="flex items-center gap-2 truncate">
              <span className="font-bold text-slate-900 truncate">
                {focusedSpot 
                  ? `📍 ${lang === 'ja' ? focusedSpot.name : focusedSpot.nameEn}` 
                  : `📍 ${lang === 'ja' ? activeTour.meetingPoint : activeTour.meetingPointEn}`}
              </span>
            </div>

            <div className="flex items-center gap-2 flex-shrink-0">
              <a
                href={focusedSpot 
                  ? `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(focusedSpot.googleMapsQuery)}` 
                  : activeTour.googleMapsUrl || `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(activeTour.meetingPoint + ' ' + activeTour.area)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="px-2.5 py-1 rounded-lg bg-blue-50 text-blue-700 hover:bg-blue-100 border border-blue-200 font-bold flex items-center gap-1 text-[11px]"
              >
                <span>Googleマップ</span>
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
              src={`https://maps.google.com/maps?q=${activeCoords.lat},${activeCoords.lng}&z=${activeCoords.zoom || 15}&output=embed`}
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

        {/* Right (5 cols): Selected Tour Summary + Nearby Explorer */}
        <div className="lg:col-span-5 p-4 sm:p-5 flex flex-col justify-between space-y-4 bg-white overflow-y-auto max-h-[640px]">
          {/* Active Tour Highlight Card */}
          <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-2.5">
            <div className="flex items-center justify-between gap-2">
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-100 text-blue-800 border border-blue-200">
                {lang === 'ja' ? activeTour.tags[0] || '文化ツアー' : activeTour.category}
              </span>
              <div className="flex items-center gap-1 text-xs text-slate-500 font-medium">
                <Clock className="w-3.5 h-3.5 text-blue-600" />
                <span>{activeTour.durationHours}時間</span>
                <span className="text-slate-300">|</span>
                <Flame className="w-3.5 h-3.5 text-rose-500" />
                <span className="font-bold text-slate-700">Lv.{activeTour.otakuLevel}</span>
              </div>
            </div>

            <h4 className="font-bold text-slate-900 text-sm sm:text-base leading-snug">
              {lang === 'ja' ? activeTour.title : activeTour.titleEn}
            </h4>

            <p className="text-xs text-slate-600 line-clamp-2">
              {lang === 'ja' ? activeTour.catchphrase : activeTour.catchphraseEn}
            </p>

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

          {/* Nearby Spot Filter Strip */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h5 className="text-xs font-bold text-slate-900 flex items-center gap-1">
                <span>📍 周辺スポット探索</span>
                <span className="text-slate-400 font-normal">({filteredSpots.length}件)</span>
              </h5>

              {/* Category Pills */}
              <div className="flex items-center gap-1 overflow-x-auto text-[11px]">
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
                    onClick={() => setFocusedSpot(spot)}
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
        </div>
      </div>
    </div>
  );
};
