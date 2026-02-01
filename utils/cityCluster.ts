import { Station } from '../types';

export interface CityCluster {
  id: string;
  name: string;
  country: string;
  countryCode: string;
  lat: number;
  lng: number;
  stations: Station[];
  stationCount: number;
  topStation: Station;
}

/**
 * Group stations by city/location (Radio Garden style)
 * Instead of showing 50k individual dots, we show city clusters
 * This dramatically improves performance and visual clarity
 */
export function clusterStationsByCity(stations: Station[]): CityCluster[] {
  console.log(`🏙️ Starting city clustering for ${stations.length} stations...`);
  
  // Group stations by approximate location (2 decimal places = ~1.1km radius)
  // This creates more precise clusters and reduces overlapping
  // Result: more clusters but better geographic accuracy
  const cityMap = new Map<string, Station[]>();

  try {
    stations.forEach(station => {
      if (!station.geo_lat || !station.geo_long) return;

      // Round to 2 decimal places to group stations in the same neighborhood
      // This prevents stations that are 5-10km apart from being merged
      const lat = Number(station.geo_lat).toFixed(2);
      const lng = Number(station.geo_long).toFixed(2);
      const key = `${lat},${lng}`;

      if (!cityMap.has(key)) {
        cityMap.set(key, []);
      }
      cityMap.get(key)!.push(station);
    });
  } catch (error) {
    console.error('❌ Error during station grouping:', error);
    throw error;
  }

  // Convert to city clusters
  const clusters: CityCluster[] = [];

  try {
    cityMap.forEach((stationGroup, coordKey) => {
      const [latStr, lngStr] = coordKey.split(',');
      const lat = parseFloat(latStr);
      const lng = parseFloat(lngStr);

      if (isNaN(lat) || isNaN(lng)) {
        console.warn(`⚠️ Invalid coordinates: ${coordKey}`);
        return;
      }

      // Sort by votes to find the most popular station
      stationGroup.sort((a, b) => (b.votes || 0) - (a.votes || 0));
      const topStation = stationGroup[0];

      // Use the most common city name or the top station's name
      const cityName = getMostCommonValue(stationGroup.map(s => s.state || s.name.split(' ')[0]));
      const country = topStation.country || 'Unknown';
      const countryCode = topStation.countrycode || '';

      clusters.push({
        id: `${countryCode}-${lat}-${lng}`,
        name: cityName || 'Unknown City',
        country,
        countryCode,
        lat,
        lng,
        stations: stationGroup,
        stationCount: stationGroup.length,
        topStation
      });
    });

    console.log(`✅ Created ${clusters.length} city clusters from ${cityMap.size} unique locations`);
  } catch (error) {
    console.error('❌ Error during cluster conversion:', error);
    throw error;
  }

  return clusters;
}

/**
 * Get the most common value from an array
 */
function getMostCommonValue(arr: string[]): string {
  if (arr.length === 0) return '';
  
  const counts = new Map<string, number>();
  arr.forEach(val => {
    if (val) counts.set(val, (counts.get(val) || 0) + 1);
  });

  let maxCount = 0;
  let mostCommon = '';
  counts.forEach((count, val) => {
    if (count > maxCount) {
      maxCount = count;
      mostCommon = val;
    }
  });

  return mostCommon;
}

/**
 * Filter clusters based on zoom level (Progressive disclosure)
 * DISABLED: Show all clusters at all zoom levels for better UX
 * Users should see all available stations immediately without needing to zoom
 */
export function filterClustersByZoom(
  clusters: CityCluster[],
  zoomLevel: number
): CityCluster[] {
  // Always return all clusters regardless of zoom level
  // This ensures users can see all available stations from the start
  return clusters;
  
  // Original progressive disclosure logic (disabled):
  // if (zoomLevel >= 3.0) return clusters.filter(c => c.stationCount >= 5);
  // else if (zoomLevel >= 2.0) return clusters.filter(c => c.stationCount >= 3);
  // else if (zoomLevel >= 1.5) return clusters.filter(c => c.stationCount >= 2);
  // else return clusters;
}

/**
 * Get cluster size for visualization
 * Larger clusters = more stations
 */
export function getClusterSize(cluster: CityCluster): number {
  // Logarithmic scale for better visual distribution
  // Increased base and max sizes for better visibility
  const baseSize = 0.12; // degrees (~13km) - larger minimum size
  const maxSize = 0.35; // degrees (~38km) - larger maximum size
  const logCount = Math.log(cluster.stationCount + 1);
  const maxLog = Math.log(200); // Assume max 200 stations per metro area
  
  return baseSize + (logCount / maxLog) * (maxSize - baseSize);
}

/**
 * Spread stations within a cluster to prevent overlap
 * Uses micro-spreading for stations in the same cluster
 */
export interface SpreadStation extends Station {
  displayLat: number;
  displayLng: number;
  isSpread: boolean;
}

export function spreadClusterStations(cluster: CityCluster): SpreadStation[] {
  const stations = cluster.stations;
  const centerLat = cluster.lat;
  const centerLng = cluster.lng;
  
  // Validate center coordinates
  if (isNaN(centerLat) || isNaN(centerLng)) {
    console.warn('Invalid cluster coordinates:', cluster);
    return [];
  }
  
  // ใช้พิกัดจริงของแต่ละสถานี - ไม่ใช้ jitter
  // สถานีจะแสดงที่ตำแหน่งจริงตามที่ Radio Browser API ให้มา
  const result: SpreadStation[] = stations.map(station => {
    const lat = Number(station.geo_lat);
    const lng = Number(station.geo_long);
    
    // ตรวจสอบว่าพิกัดถูกต้อง
    const isValid = !isNaN(lat) && !isNaN(lng) && 
                    lat >= -90 && lat <= 90 && 
                    lng >= -180 && lng <= 180;
    
    return {
      ...station,
      displayLat: isValid ? lat : centerLat,
      displayLng: isValid ? lng : centerLng,
      isSpread: false // ไม่มีการกระจาย ใช้พิกัดจริง
    };
  });

  return result;
}
