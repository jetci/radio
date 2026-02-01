import { Station } from '../types';

/**
 * Calculate distance between two points on Earth using Haversine formula
 * Returns distance in kilometers
 */
function calculateDistance(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const R = 6371; // Earth's radius in km
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * Math.PI / 180) *
    Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLon / 2) *
    Math.sin(dLon / 2);
  
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = R * c;
  
  return distance;
}

/**
 * Find the nearest station to a given coordinate (center of globe view)
 * @param stations - Array of stations
 * @param centerLat - Latitude of center point
 * @param centerLng - Longitude of center point
 * @param maxDistance - Maximum distance in km to consider (default: 500km)
 * @returns The nearest station or null if none found within maxDistance
 */
export function findNearestStation(
  stations: Station[],
  centerLat: number,
  centerLng: number,
  maxDistance: number = 500
): Station | null {
  if (!stations || stations.length === 0) return null;

  let nearestStation: Station | null = null;
  let minDistance = Infinity;

  for (const station of stations) {
    // Skip stations without coordinates
    if (
      station.geo_lat === null ||
      station.geo_lat === undefined ||
      station.geo_long === null ||
      station.geo_long === undefined
    ) {
      continue;
    }

    const distance = calculateDistance(
      centerLat,
      centerLng,
      station.geo_lat,
      station.geo_long
    );

    if (distance < minDistance && distance <= maxDistance) {
      minDistance = distance;
      nearestStation = station;
    }
  }

  return nearestStation;
}

/**
 * Convert screen coordinates to lat/lng based on globe rotation
 * This is a simplified version - in reality, you'd get this from the globe component
 */
export function screenToLatLng(
  screenX: number,
  screenY: number,
  globeRotation: { lat: number; lng: number }
): { lat: number; lng: number } {
  // This is a placeholder - actual implementation would depend on globe library
  return {
    lat: globeRotation.lat,
    lng: globeRotation.lng
  };
}
