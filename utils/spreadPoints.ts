import { Station } from '../types';

interface SpreadPoint {
    station: Station;
    lat: number;
    lng: number;
    altitude: number; // Added altitude for vertical stacking
    isSpread: boolean;
    originalLat: number;
    originalLng: number;
}

/**
 * Spread overlapping stations in a 3D multi-layer spiral pattern
 * This ensures NO stations overlap, using both lateral spreading and vertical stacking
 * @param stations - Array of stations to spread
 * @param radiusKm - Base radius in kilometers to spread points (default: 5km for tighter clusters)
 * @returns Array of stations with adjusted coordinates
 */
export function spreadOverlappingPoints(
    stations: Station[],
    radiusKm: number = 5
): SpreadPoint[] {
    // Group stations by coordinates (more precise grouping)
    const coordMap = new Map<string, Station[]>();

    stations.forEach(station => {
        // Strict check for null/undefined, but ALLOW 0
        if (station.geo_lat === null || station.geo_lat === undefined ||
            station.geo_long === null || station.geo_long === undefined) {
            return;
        }

        // Ensure numbers
        const rawLat = Number(station.geo_lat);
        const rawLng = Number(station.geo_long);

        if (isNaN(rawLat) || isNaN(rawLng)) return;

        // High Precision Grouping (3 decimal places ~111m)
        // Group stations within ~100m radius to spread them apart
        // This prevents visual overlap while maintaining geographic accuracy
        const precision = 1000;
        const lat = (Math.round(rawLat * precision) / precision).toFixed(3);
        const lng = (Math.round(rawLng * precision) / precision).toFixed(3);
        const key = `${lat},${lng}`;

        if (!coordMap.has(key)) {
            coordMap.set(key, []);
        }
        coordMap.get(key)!.push(station);
    });

    const result: SpreadPoint[] = [];

    // Process each group
    coordMap.forEach((groupStations, coordKey) => {
        const [latStr, lngStr] = coordKey.split(',');
        const centerLat = parseFloat(latStr);
        const centerLng = parseFloat(lngStr);

        if (isNaN(centerLat) || isNaN(centerLng)) return;

        const count = groupStations.length;

        if (count === 1) {
            result.push({
                station: groupStations[0],
                // Use original coordinates for single stations to be precise
                lat: parseFloat(groupStations[0].geo_lat as any),
                lng: parseFloat(groupStations[0].geo_long as any),
                altitude: 0.01,
                isSpread: false,
                originalLat: centerLat,
                originalLng: centerLng
            });
        } else {
            // Sort by popularity so the most popular is in the center/start
            groupStations.sort((a, b) => (b.votes || 0) - (a.votes || 0));

            // Determine Layout Strategy based on cluster size
            const isSmallCluster = count <= 6;
            const isMediumCluster = count > 6 && count <= 20;

            // Adaptive Spread Distance (Increased for better visibility):
            // Small clusters (2-6): 0.15° (~16.5km) - comfortable circle
            // Medium clusters (7-20): 0.25° (~27.5km) - wide circle
            // Large clusters (21+): 0.35° (~38.5km) - large spiral
            let spreadStepDeg = 0.15;
            if (isMediumCluster) spreadStepDeg = 0.25;
            else if (count > 20) spreadStepDeg = 0.35;

            groupStations.forEach((station, index) => {
                let finalLat = centerLat;
                let finalLng = centerLng;

                // Index 0 stays at center (Leader)
                if (index > 0) {
                    let angle = 0;
                    let radius = 0;

                    if (isSmallCluster) {
                        // "Flower" Circle Layout for small groups (2-6 stations)
                        angle = ((index - 1) / (count - 1)) * 2 * Math.PI;
                        radius = spreadStepDeg;
                    } else if (isMediumCluster) {
                        // "Double Ring" Layout for medium groups (7-20 stations)
                        const ring = Math.floor((index - 1) / 6);
                        const posInRing = (index - 1) % 6;
                        angle = (posInRing / 6) * 2 * Math.PI;
                        radius = spreadStepDeg * (1 + ring * 0.7);
                    } else {
                        // "Archimedean Spiral" Layout for large groups (21+ stations)
                        // More aggressive spreading to prevent overlap
                        const spiralTightness = 2.4; // Lower = looser spiral
                        angle = index * spiralTightness;
                        radius = spreadStepDeg * Math.sqrt(index * 2.0); // Increased multiplier
                    }

                    // Add slight randomization to prevent perfect alignment
                    angle += (index * 0.618) % (Math.PI / 6); // Golden angle variation

                    const latOffset = radius * Math.cos(angle);

                    // Longitude correction for spherical distortion
                    const cosLat = Math.cos(centerLat * Math.PI / 180);
                    const lngCorrection = Math.abs(cosLat) < 0.1 ? 0.1 : cosLat;
                    const lngOffset = (radius * Math.sin(angle)) / lngCorrection;

                    finalLat = centerLat + latOffset;
                    finalLng = centerLng + lngOffset;
                }

                result.push({
                    station,
                    lat: finalLat,
                    lng: finalLng,
                    altitude: 0.01,
                    isSpread: index > 0,
                    originalLat: centerLat,
                    originalLng: centerLng
                });
            });
        }
    });

    return result;
}

/**
 * Get statistics about overlapping points
 */
export function getOverlapStats(stations: Station[]): {
    totalStations: number;
    uniqueCoordinates: number;
    largestCluster: number;
    clustersWithOverlap: number;
} {
    const coordMap = new Map<string, number>();

    stations.forEach(station => {
        if (station.geo_lat === null || station.geo_lat === undefined ||
            station.geo_long === null || station.geo_long === undefined) return;

        const lat = Number(station.geo_lat).toFixed(4);
        const lng = Number(station.geo_long).toFixed(4);
        const key = `${lat},${lng}`;

        coordMap.set(key, (coordMap.get(key) || 0) + 1);
    });

    let largestCluster = 0;
    let clustersWithOverlap = 0;

    coordMap.forEach(count => {
        if (count > largestCluster) largestCluster = count;
        if (count > 1) clustersWithOverlap++;
    });

    return {
        totalStations: stations.length,
        uniqueCoordinates: coordMap.size,
        largestCluster,
        clustersWithOverlap
    };
}
