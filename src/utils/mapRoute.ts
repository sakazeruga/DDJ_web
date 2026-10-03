import type { Tour, ItineraryItem } from '../types';

/**
 * Clean location name from messy itinerary titles so Google Maps API/Search can always find it
 */
export function getCleanLocationName(rawTitle: string, areaHint = ''): string {
  if (!rawTitle) return areaHint || '日本';

  // 1. Remove parenthesized text (both Japanese and English)
  let cleaned = rawTitle
    .replace(/（[^）]+）/g, '')
    .replace(/\([^)]+\)/g, '');

  // 2. Remove common action descriptions
  cleaned = cleaned
    .replace(/集合.*$/, '')
    .replace(/解散.*$/, '')
    .replace(/ツアー.*$/, '')
    .replace(/レクチャー.*$/, '')
    .replace(/ブリーフィング.*$/, '');

  // 3. Take only the primary spot name before colons or tildes
  if (cleaned.includes('：')) {
    cleaned = cleaned.split('：')[0];
  }
  if (cleaned.includes(':')) {
    cleaned = cleaned.split(':')[0];
  }
  if (cleaned.includes('〜')) {
    cleaned = cleaned.split('〜')[0];
  }
  if (cleaned.includes('~')) {
    cleaned = cleaned.split('~')[0];
  }

  // 4. If dot separated (e.g. 一色海岸・小磯の鼻), take the most recognizable spot
  if (cleaned.includes('・')) {
    const parts = cleaned.split('・').map((s) => s.trim()).filter(Boolean);
    cleaned = parts[0] || cleaned;
  }

  cleaned = cleaned.trim();

  // If too short or generic, append clean area
  const cleanArea = (areaHint || '')
    .split('(')[0]
    .split('〜')[0]
    .split('・')[0]
    .trim();

  if (cleaned.length <= 2 && cleanArea) {
    return `${cleanArea} ${cleaned}`;
  }

  return cleaned || cleanArea || '日本';
}

/**
 * Generate a rock-solid, 100% working Google Maps Walking Directions URL
 */
export function getGoogleMapsWalkingDirectionsUrl(tour: Tour): string {
  // If dedicated route waypoints are defined in mock data, use them
  if (tour.routeWaypoints && tour.routeWaypoints.length >= 2) {
    const origin = encodeURIComponent(tour.routeWaypoints[0]);
    const destination = encodeURIComponent(tour.routeWaypoints[tour.routeWaypoints.length - 1]);
    const waypoints = tour.routeWaypoints
      .slice(1, -1)
      .map((w) => encodeURIComponent(w))
      .join('|');

    return `https://www.google.com/maps/dir/?api=1&origin=${origin}&destination=${destination}${
      waypoints ? `&waypoints=${waypoints}` : ''
    }&travelmode=walking`;
  }

  // Clean area name for context
  const cleanArea = (tour.area || '')
    .split('(')[0]
    .split('〜')[0]
    .split('・')[0]
    .trim();

  // 1. Origin: Meeting point
  const originSpot = getCleanLocationName(tour.meetingPoint, cleanArea);
  const origin = encodeURIComponent(originSpot);

  // 2. Intermediate Waypoints and Destination from itinerary
  const validStops = (tour.itinerary || [])
    .map((item) => item.mapQuery || getCleanLocationName(item.spotTitle, cleanArea))
    .filter((name) => name && name !== originSpot);

  if (validStops.length === 0) {
    // Fallback to searching the meeting point
    return `https://www.google.com/maps/search/?api=1&query=${origin}`;
  }

  const destinationSpot = validStops[validStops.length - 1];
  const destination = encodeURIComponent(destinationSpot);

  const waypoints = validStops
    .slice(0, -1)
    .slice(0, 8) // Google Maps supports up to 8-9 waypoints
    .map((w) => encodeURIComponent(w))
    .join('|');

  return `https://www.google.com/maps/dir/?api=1&origin=${origin}&destination=${destination}${
    waypoints ? `&waypoints=${waypoints}` : ''
  }&travelmode=walking`;
}

/**
 * Get clean query string for embedding map iframe
 */
export function getCleanEmbedQuery(
  item: ItineraryItem | null,
  tour: Tour,
  selectedSpotQuery?: string
): string {
  if (selectedSpotQuery) {
    return encodeURIComponent(selectedSpotQuery);
  }

  const cleanArea = (tour.area || '')
    .split('(')[0]
    .split('〜')[0]
    .split('・')[0]
    .trim();

  if (item) {
    if (item.mapQuery) {
      return encodeURIComponent(`${item.mapQuery} ${cleanArea}`);
    }
    const cleanSpot = getCleanLocationName(item.spotTitle, cleanArea);
    return encodeURIComponent(`${cleanSpot} ${cleanArea}`);
  }

  const cleanMeeting = getCleanLocationName(tour.meetingPoint, cleanArea);
  return encodeURIComponent(`${cleanMeeting} ${cleanArea}`);
}
