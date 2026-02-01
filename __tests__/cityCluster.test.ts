import { clusterStationsByCity, spreadClusterStations, getClusterSize, CityCluster } from '../utils/cityCluster';
import { Station } from '../types';

// Mock station factory
const createMockStation = (overrides: Partial<Station> = {}): Station => ({
  changeuuid: 'test-change',
  stationuuid: `test-${Math.random()}`,
  name: 'Test Station',
  url: 'https://example.com/stream',
  url_resolved: 'https://example.com/stream',
  homepage: 'https://example.com',
  favicon: 'https://example.com/favicon.ico',
  tags: 'test',
  country: 'Test Country',
  countrycode: 'TC',
  state: 'Test State',
  language: 'English',
  votes: 100,
  clickcount: 1000,
  codec: 'MP3',
  bitrate: 128,
  geo_lat: 13.75,
  geo_long: 100.50,
  ...overrides
});

describe('cityCluster utilities', () => {
  describe('clusterStationsByCity', () => {
    test('groups stations by 2 decimal precision', () => {
      const stations = [
        createMockStation({ geo_lat: 13.751, geo_long: 100.501 }),
        createMockStation({ geo_lat: 13.752, geo_long: 100.502 }),
        createMockStation({ geo_lat: 13.759, geo_long: 100.509 }),
      ];

      const clusters = clusterStationsByCity(stations);
      
      // All should be in same cluster (rounded to 13.75, 100.50)
      expect(clusters.length).toBe(1);
      expect(clusters[0].stationCount).toBe(3);
    });

    test('separates stations that are far apart', () => {
      const stations = [
        createMockStation({ geo_lat: 13.75, geo_long: 100.50 }), // Bangkok
        createMockStation({ geo_lat: 18.80, geo_long: 98.98 }),  // Chiang Mai
      ];

      const clusters = clusterStationsByCity(stations);
      
      expect(clusters.length).toBe(2);
      expect(clusters[0].stationCount).toBe(1);
      expect(clusters[1].stationCount).toBe(1);
    });

    test('handles stations without coordinates', () => {
      const stations = [
        createMockStation({ geo_lat: 13.75, geo_long: 100.50 }),
        createMockStation({ geo_lat: null, geo_long: null }),
        createMockStation({ geo_lat: undefined, geo_long: undefined }),
      ];

      const clusters = clusterStationsByCity(stations);
      
      // Only 1 valid station
      expect(clusters.length).toBe(1);
      expect(clusters[0].stationCount).toBe(1);
    });

    test('sorts stations by votes within cluster', () => {
      const stations = [
        createMockStation({ geo_lat: 13.75, geo_long: 100.50, votes: 50, name: 'Low' }),
        createMockStation({ geo_lat: 13.75, geo_long: 100.50, votes: 200, name: 'High' }),
        createMockStation({ geo_lat: 13.75, geo_long: 100.50, votes: 100, name: 'Mid' }),
      ];

      const clusters = clusterStationsByCity(stations);
      
      expect(clusters[0].topStation.name).toBe('High');
      expect(clusters[0].stations[0].votes).toBe(200);
    });
  });

  describe('spreadClusterStations', () => {
    test('does not spread single station', () => {
      const cluster: CityCluster = {
        id: 'test-1',
        name: 'Test City',
        country: 'Test',
        countryCode: 'TC',
        lat: 13.75,
        lng: 100.50,
        stations: [createMockStation()],
        stationCount: 1,
        topStation: createMockStation()
      };

      const spread = spreadClusterStations(cluster);
      
      expect(spread.length).toBe(1);
      expect(spread[0].displayLat).toBe(13.75);
      expect(spread[0].displayLng).toBe(100.50);
      expect(spread[0].isSpread).toBe(false);
    });

    test('spreads multiple stations in circular pattern', () => {
      const stations = Array(5).fill(null).map(() => createMockStation());
      const cluster: CityCluster = {
        id: 'test-2',
        name: 'Test City',
        country: 'Test',
        countryCode: 'TC',
        lat: 13.75,
        lng: 100.50,
        stations,
        stationCount: 5,
        topStation: stations[0]
      };

      const spread = spreadClusterStations(cluster);
      
      expect(spread.length).toBe(5);
      
      // First station stays at center
      expect(spread[0].displayLat).toBe(13.75);
      expect(spread[0].displayLng).toBe(100.50);
      expect(spread[0].isSpread).toBe(false);
      
      // Others are spread
      spread.slice(1).forEach(station => {
        expect(station.displayLat).not.toBe(13.75);
        expect(station.displayLng).not.toBe(100.50);
        expect(station.isSpread).toBe(true);
      });
    });

    test('spreads large clusters in spiral pattern', () => {
      const stations = Array(20).fill(null).map(() => createMockStation());
      const cluster: CityCluster = {
        id: 'test-3',
        name: 'Test City',
        country: 'Test',
        countryCode: 'TC',
        lat: 13.75,
        lng: 100.50,
        stations,
        stationCount: 20,
        topStation: stations[0]
      };

      const spread = spreadClusterStations(cluster);
      
      expect(spread.length).toBe(20);
      
      // Check that stations are spread with increasing distance
      const distances = spread.slice(1).map(station => {
        const latDiff = station.displayLat - 13.75;
        const lngDiff = station.displayLng - 100.50;
        return Math.sqrt(latDiff * latDiff + lngDiff * lngDiff);
      });
      
      // Distances should generally increase (spiral pattern)
      expect(distances[distances.length - 1]).toBeGreaterThan(distances[0]);
    });

    test('all spread stations have unique positions', () => {
      const stations = Array(10).fill(null).map(() => createMockStation());
      const cluster: CityCluster = {
        id: 'test-4',
        name: 'Test City',
        country: 'Test',
        countryCode: 'TC',
        lat: 13.75,
        lng: 100.50,
        stations,
        stationCount: 10,
        topStation: stations[0]
      };

      const spread = spreadClusterStations(cluster);
      
      // Create set of position strings
      const positions = new Set(
        spread.map(s => `${s.displayLat.toFixed(6)},${s.displayLng.toFixed(6)}`)
      );
      
      // All positions should be unique
      expect(positions.size).toBe(10);
    });
  });

  describe('getClusterSize', () => {
    test('returns larger size for more stations', () => {
      const smallCluster: CityCluster = {
        id: 'small',
        name: 'Small',
        country: 'Test',
        countryCode: 'TC',
        lat: 0,
        lng: 0,
        stations: [],
        stationCount: 5,
        topStation: createMockStation()
      };

      const largeCluster: CityCluster = {
        ...smallCluster,
        id: 'large',
        stationCount: 100
      };

      const smallSize = getClusterSize(smallCluster);
      const largeSize = getClusterSize(largeCluster);
      
      expect(largeSize).toBeGreaterThan(smallSize);
    });

    test('size is within expected range', () => {
      const cluster: CityCluster = {
        id: 'test',
        name: 'Test',
        country: 'Test',
        countryCode: 'TC',
        lat: 0,
        lng: 0,
        stations: [],
        stationCount: 50,
        topStation: createMockStation()
      };

      const size = getClusterSize(cluster);
      
      // Should be between baseSize (0.12) and maxSize (0.35)
      expect(size).toBeGreaterThanOrEqual(0.12);
      expect(size).toBeLessThanOrEqual(0.35);
    });
  });
});
