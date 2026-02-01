
import { Station, SearchParams, Country, Tag } from '../types';

// Updated mirrors - using more reliable endpoints
const MIRRORS = [
  'https://all.api.radio-browser.info/json',  // Load-balanced (most reliable)
  'https://de1.api.radio-browser.info/json',
  'https://fr1.api.radio-browser.info/json',
  'https://nl1.api.radio-browser.info/json'
];

let currentMirrorIndex = 0;

async function fetchWithFallback(path: string, retries = 3): Promise<any> {
  console.log(`🔗 Attempting to fetch: ${path}`);
  let lastError: Error | null = null;
  
  for (let attempt = 0; attempt < retries; attempt++) {
    for (let i = 0; i < MIRRORS.length; i++) {
      const mirror = MIRRORS[currentMirrorIndex];
      const fullUrl = `${mirror}${path}`;
      console.log(`  Attempt ${attempt + 1}/${retries}, Mirror ${i + 1}/${MIRRORS.length}: ${mirror}`);
      
      try {
        // Add timeout to prevent hanging
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 15000); // 15s timeout
        
        const response = await fetch(fullUrl, {
          method: 'GET',
          headers: {
            'Accept': 'application/json',
            'User-Agent': 'ProfessionalRadioGlobe/2.0'
          },
          signal: controller.signal
        });
        
        clearTimeout(timeoutId);
        console.log(`  Response status: ${response.status}`);
        
        // Handle rate limiting (429)
        if (response.status === 429) {
          const retryAfter = response.headers.get('Retry-After');
          const waitTime = retryAfter ? parseInt(retryAfter) * 1000 : Math.pow(2, attempt) * 1000;
          console.warn(`  ⏳ Rate limited. Waiting ${waitTime}ms before retry...`);
          await new Promise(resolve => setTimeout(resolve, waitTime));
          continue; // Retry same mirror
        }
        
        if (!response.ok) {
          throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }
        
        const data = await response.json();
        console.log(`  ✅ Success! Received ${Array.isArray(data) ? data.length : 'N/A'} items`);
        return data;
        
      } catch (error) {
        console.error(`  ❌ Mirror ${i + 1} failed:`, error);
        lastError = error as Error;
        currentMirrorIndex = (currentMirrorIndex + 1) % MIRRORS.length;
        
        // Wait before trying next mirror (exponential backoff)
        if (i < MIRRORS.length - 1) {
          const backoffTime = Math.min(1000 * Math.pow(2, attempt), 5000);
          await new Promise(resolve => setTimeout(resolve, backoffTime));
        }
      }
    }
    
    // Wait before next retry attempt
    if (attempt < retries - 1) {
      const retryWait = Math.min(2000 * Math.pow(2, attempt), 10000);
      console.log(`  ⏳ Waiting ${retryWait}ms before retry attempt ${attempt + 2}...`);
      await new Promise(resolve => setTimeout(resolve, retryWait));
    }
  }
  
  console.error('❌ All retries failed!', lastError);
  
  // Throw detailed error
  const errorMessage = lastError?.message || 'Unknown error';
  throw new Error(`Failed to fetch radio stations after ${retries} retries: ${errorMessage}. Please check your internet connection and try again.`);
}

export const radioApi = {
  // Get Global Stations (Radio Garden Strategy - Load popular stations first)
  async getAllStations(): Promise<Station[]> {
    // Load top 20,000 stations (sorted by votes)
    // เพิ่มจาก 10,000 เพื่อให้ครอบคลุมสถานีมากขึ้น
    // ไม่ใช้ has_geo=true เพื่อให้ได้สถานีทั้งหมด (รวมที่ไม่มีพิกัด)
    return fetchWithFallback(`/stations/search?order=votes&reverse=true&hidebroken=true&limit=20000`);
  },

  async getTopVoted(limit: number = 2500): Promise<Station[]> {
    return fetchWithFallback(`/stations/search?order=votes&reverse=true&limit=${limit}&hidebroken=true`);
  },

  async getStationsByCountry(countryCode: string, limit: number = 100): Promise<Station[]> {
    // Note: We remove has_geo=true here to ensure we find ANY local station for the initial lock-on
    return fetchWithFallback(`/stations/search?countrycode=${countryCode.toUpperCase()}&order=votes&reverse=true&limit=${limit}&hidebroken=true`);
  },

  async searchStations(params: SearchParams): Promise<Station[]> {
    const query = new URLSearchParams();
    if (params.name) query.append('name', params.name);
    if (params.country) query.append('country', params.country);
    if (params.countrycode) query.append('countrycode', params.countrycode);
    if (params.tag) query.append('tag', params.tag);

    // ไม่ใช้ has_geo=true เพื่อให้ได้สถานีทั้งหมด
    query.append('limit', '1000');
    query.append('hidebroken', 'true');
    query.append('order', 'clickcount');
    query.append('reverse', 'true');
    return fetchWithFallback(`/stations/search?${query.toString()}`);
  },

  // Recently Added Stations
  async getRecentlyAdded(limit: number = 50): Promise<Station[]> {
    return fetchWithFallback(`/stations/search?order=changetimestamp&reverse=true&limit=${limit}&hidebroken=true`);
  },

  // Most Popular (by clicks)
  async getMostPopular(limit: number = 50): Promise<Station[]> {
    return fetchWithFallback(`/stations/search?order=clickcount&reverse=true&limit=${limit}&hidebroken=true`);
  },

  // Get Countries with station count
  async getCountries(): Promise<Country[]> {
    return fetchWithFallback('/countries');
  },

  // Get Tags with station count
  async getTags(limit: number = 100): Promise<Tag[]> {
    return fetchWithFallback(`/tags?order=stationcount&reverse=true&limit=${limit}`);
  }
};
