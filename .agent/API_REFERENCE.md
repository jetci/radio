# Radio Browser API Reference

> Complete API documentation for Radio Browser integration in J Radio

---

## 📡 Base URLs

### Official API Mirrors

```javascript
const API_MIRRORS = [
  'https://de1.api.radio-browser.info/json',  // Germany (Primary)
  'https://at1.api.radio-browser.info/json',  // Austria (Backup)
  'https://nl1.api.radio-browser.info/json'   // Netherlands (Backup)
];
```

### API Documentation
- **Main Site**: https://www.radio-browser.info/
- **API Docs**: https://api.radio-browser.info/
- **GitLab**: https://gitlab.com/radiobrowser/radio-database

---

## 🔍 Search Endpoints

### 1. Search Stations

**Endpoint:**
```
GET /stations/search
```

**Query Parameters:**

| Parameter | Type | Description | Example |
|-----------|------|-------------|---------|
| `name` | string | Station name (partial match) | `name=BBC` |
| `country` | string | Country name | `country=Thailand` |
| `countrycode` | string | ISO 3166-1 country code | `countrycode=TH` |
| `state` | string | State/province name | `state=Bangkok` |
| `language` | string | Language code | `language=thai` |
| `tag` | string | Genre/tag | `tag=jazz` |
| `tagList` | string | Multiple tags (comma-separated) | `tagList=jazz,blues` |
| `codec` | string | Audio codec | `codec=MP3` |
| `bitrate` | number | Minimum bitrate (kbps) | `bitrate=128` |
| `bitrateMin` | number | Minimum bitrate | `bitrateMin=64` |
| `bitrateMax` | number | Maximum bitrate | `bitrateMax=320` |
| `has_geo_info` | boolean | Has geo coordinates | `has_geo_info=true` |
| `has_extended_info` | boolean | Has extended metadata | `has_extended_info=true` |
| `is_https` | boolean | HTTPS stream only | `is_https=true` |
| `order` | string | Sort field | `order=votes` |
| `reverse` | boolean | Reverse sort order | `reverse=true` |
| `offset` | number | Pagination offset | `offset=0` |
| `limit` | number | Results limit (max 100000) | `limit=100` |
| `hidebroken` | boolean | Hide broken stations | `hidebroken=true` |

**Order Options:**
- `name` - Station name
- `url` - Stream URL
- `homepage` - Homepage URL
- `favicon` - Favicon URL
- `tags` - Tags
- `country` - Country
- `state` - State
- `language` - Language
- `votes` - Vote count (recommended)
- `codec` - Codec
- `bitrate` - Bitrate
- `clickcount` - Click count
- `clicktrend` - Click trend
- `changetimestamp` - Last change time
- `random` - Random order

**Example Request:**
```javascript
const response = await fetch(
  'https://de1.api.radio-browser.info/json/stations/search?' +
  'countrycode=TH&order=votes&reverse=true&limit=50&hidebroken=true'
);
const stations = await response.json();
```

**Example Response:**
```json
[
  {
    "changeuuid": "9608b51d-0601-11e8-ae97-52543be04c81",
    "stationuuid": "9608b51e-0601-11e8-ae97-52543be04c81",
    "name": "Thai PBS Radio",
    "url": "http://prdonline.prd.go.th:8200/;",
    "url_resolved": "http://prdonline.prd.go.th:8200/;",
    "homepage": "http://www.thaipbs.or.th/",
    "favicon": "http://www.thaipbs.or.th/favicon.ico",
    "tags": "news,talk",
    "country": "Thailand",
    "countrycode": "TH",
    "state": "Bangkok",
    "language": "thai",
    "languagecodes": "th",
    "votes": 245,
    "lastchangetime": "2023-05-15 10:30:00",
    "lastchangetime_iso8601": "2023-05-15T10:30:00Z",
    "codec": "MP3",
    "bitrate": 128,
    "hls": 0,
    "lastcheckok": 1,
    "lastchecktime": "2023-05-20 08:15:00",
    "lastchecktime_iso8601": "2023-05-20T08:15:00Z",
    "lastcheckoktime": "2023-05-20 08:15:00",
    "lastcheckoktime_iso8601": "2023-05-20T08:15:00Z",
    "lastlocalchecktime": "2023-05-20 08:15:00",
    "lastlocalchecktime_iso8601": "2023-05-20T08:15:00Z",
    "clicktimestamp": "2023-05-20 12:00:00",
    "clicktimestamp_iso8601": "2023-05-20T12:00:00Z",
    "clickcount": 1523,
    "clicktrend": 5,
    "ssl_error": 0,
    "geo_lat": 13.7563,
    "geo_long": 100.5018,
    "has_extended_info": true
  }
]
```

---

### 2. Get Top Voted Stations

**Usage in J Radio:**
```javascript
async getTopVoted(limit: number = 2500): Promise<Station[]> {
  return fetchWithFallback(
    `/stations/search?order=votes&reverse=true&limit=${limit}&has_geo=true&hidebroken=true`
  );
}
```

**Best Practices:**
- Use `has_geo=true` for globe visualization
- Use `hidebroken=true` to filter working stations
- Limit to 2500 for initial load
- Sort by `votes` for quality stations

---

### 3. Get Stations by Country

**Usage in J Radio:**
```javascript
async getStationsByCountry(countryCode: string, limit: number = 100): Promise<Station[]> {
  return fetchWithFallback(
    `/stations/search?countrycode=${countryCode.toUpperCase()}&order=votes&reverse=true&limit=${limit}&hidebroken=true`
  );
}
```

**Country Codes (ISO 3166-1):**
- `TH` - Thailand
- `US` - United States
- `GB` - United Kingdom
- `JP` - Japan
- `DE` - Germany
- `FR` - France
- [Full list](https://en.wikipedia.org/wiki/ISO_3166-1_alpha-2)

---

### 4. Advanced Search

**Usage in J Radio:**
```javascript
async searchStations(params: SearchParams): Promise<Station[]> {
  const query = new URLSearchParams();
  if (params.name) query.append('name', params.name);
  if (params.country) query.append('country', params.country);
  if (params.countrycode) query.append('countrycode', params.countrycode);
  if (params.tag) query.append('tag', params.tag);
  
  query.append('has_geo', 'true');
  query.append('limit', '1000');
  query.append('hidebroken', 'true');
  query.append('order', 'clickcount');
  query.append('reverse', 'true');
  
  return fetchWithFallback(`/stations/search?${query.toString()}`);
}
```

---

## 📊 List Endpoints

### Get Countries

**Endpoint:**
```
GET /countries
GET /countries/{code}
```

**Example:**
```javascript
const countries = await fetch(
  'https://de1.api.radio-browser.info/json/countries'
).then(r => r.json());
```

**Response:**
```json
[
  {
    "name": "Thailand",
    "iso_3166_1": "TH",
    "stationcount": 245
  }
]
```

---

### Get Tags/Genres

**Endpoint:**
```
GET /tags
GET /tags/{name}
```

**Example:**
```javascript
const tags = await fetch(
  'https://de1.api.radio-browser.info/json/tags?limit=100&order=stationcount&reverse=true'
).then(r => r.json());
```

**Popular Tags:**
- `pop`, `rock`, `jazz`, `classical`, `electronic`
- `news`, `talk`, `sports`
- `80s`, `90s`, `oldies`
- `lofi`, `chillout`, `ambient`

---

### Get Languages

**Endpoint:**
```
GET /languages
GET /languages/{code}
```

**Example:**
```javascript
const languages = await fetch(
  'https://de1.api.radio-browser.info/json/languages'
).then(r => r.json());
```

---

## 🎯 Station Interaction

### Click Counter

**Endpoint:**
```
GET /url/{stationuuid}
```

**Purpose:** 
- Increment click counter
- Get resolved stream URL
- Track station popularity

**Example:**
```javascript
const clickResponse = await fetch(
  `https://de1.api.radio-browser.info/json/url/${stationuuid}`
).then(r => r.json());

// Use clickResponse.url to play stream
audio.src = clickResponse.url;
```

---

### Vote for Station

**Endpoint:**
```
GET /vote/{stationuuid}
```

**Example:**
```javascript
const voteResponse = await fetch(
  `https://de1.api.radio-browser.info/json/vote/${stationuuid}`
).then(r => r.json());

console.log(voteResponse.ok); // true if successful
```

---

## 🔧 Advanced Features

### Server Stats

**Endpoint:**
```
GET /stats
```

**Response:**
```json
{
  "supported_version": 1,
  "software_version": "0.8.0",
  "status": "OK",
  "stations": 30245,
  "stations_broken": 1523,
  "tags": 8234,
  "clicks_last_hour": 15234,
  "clicks_last_day": 352341,
  "languages": 234,
  "countries": 245
}
```

---

### Server List

**Endpoint:**
```
GET /servers
```

**Purpose:** Get all available API servers dynamically

---

## 🛡️ Best Practices

### 1. Error Handling

```javascript
async function fetchWithFallback(path: string): Promise<any> {
  let lastError;
  
  for (let i = 0; i < MIRRORS.length; i++) {
    const mirror = MIRRORS[currentMirrorIndex];
    
    try {
      const response = await fetch(`${mirror}${path}`, {
        method: 'GET',
        headers: { 
          'Accept': 'application/json',
          'User-Agent': 'J-Radio/1.0'
        }
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      return await response.json();
      
    } catch (error) {
      console.warn(`Mirror ${mirror} failed:`, error);
      lastError = error;
      currentMirrorIndex = (currentMirrorIndex + 1) % MIRRORS.length;
    }
  }
  
  throw lastError || new Error("All mirrors failed");
}
```

### 2. Rate Limiting

**Recommendations:**
- No official rate limits
- Be respectful: don't spam requests
- Cache results when possible
- Use pagination for large datasets

### 3. Caching Strategy

```javascript
const cache = new Map();
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

async function getCachedStations(key: string, fetcher: () => Promise<Station[]>) {
  const cached = cache.get(key);
  
  if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
    return cached.data;
  }
  
  const data = await fetcher();
  cache.set(key, { data, timestamp: Date.now() });
  
  return data;
}
```

### 4. User-Agent Header

**Always set a descriptive User-Agent:**
```javascript
headers: {
  'User-Agent': 'YourAppName/Version (contact@example.com)'
}
```

---

## 🌍 Geolocation Features

### Filter by Coordinates

**Example: Find stations near Bangkok**
```javascript
const nearbyStations = await fetch(
  'https://de1.api.radio-browser.info/json/stations/search?' +
  'has_geo_info=true&' +
  'order=clickcount&' +
  'reverse=true&' +
  'limit=50'
).then(r => r.json());

// Client-side distance calculation
const bangkok = { lat: 13.7563, lng: 100.5018 };

const sorted = nearbyStations
  .map(s => ({
    ...s,
    distance: calculateDistance(bangkok, { lat: s.geo_lat, lng: s.geo_long })
  }))
  .sort((a, b) => a.distance - b.distance);
```

### Distance Calculation (Haversine)

```javascript
function calculateDistance(point1, point2) {
  const R = 6371; // Earth radius in km
  const dLat = toRad(point2.lat - point1.lat);
  const dLon = toRad(point2.lng - point1.lng);
  
  const a = 
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(point1.lat)) * Math.cos(toRad(point2.lat)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

function toRad(degrees) {
  return degrees * (Math.PI / 180);
}
```

---

## 🔍 Search Examples

### Example 1: Jazz Stations in USA

```javascript
const jazzStations = await fetch(
  'https://de1.api.radio-browser.info/json/stations/search?' +
  'countrycode=US&tag=jazz&order=votes&reverse=true&limit=20&hidebroken=true'
).then(r => r.json());
```

### Example 2: High Bitrate Classical Music

```javascript
const classicalHQ = await fetch(
  'https://de1.api.radio-browser.info/json/stations/search?' +
  'tag=classical&bitrateMin=192&order=bitrate&reverse=true&limit=20&hidebroken=true'
).then(r => r.json());
```

### Example 3: News Stations with Geo Info

```javascript
const newsStations = await fetch(
  'https://de1.api.radio-browser.info/json/stations/search?' +
  'tag=news&has_geo_info=true&order=clickcount&reverse=true&limit=100&hidebroken=true'
).then(r => r.json());
```

### Example 4: Random Discovery

```javascript
const randomStations = await fetch(
  'https://de1.api.radio-browser.info/json/stations/search?' +
  'order=random&limit=50&hidebroken=true&has_geo_info=true'
).then(r => r.json());
```

---

## 📝 TypeScript Interfaces

### Station Interface (Complete)

```typescript
interface Station {
  // Identifiers
  changeuuid: string;
  stationuuid: string;
  serveruuid: string | null;
  
  // Basic Info
  name: string;
  url: string;
  url_resolved: string;
  homepage: string;
  favicon: string;
  
  // Metadata
  tags: string;
  country: string;
  countrycode: string;
  iso_3166_2: string | null;
  state: string;
  language: string;
  languagecodes: string;
  
  // Popularity
  votes: number;
  clickcount: number;
  clicktrend: number;
  
  // Technical
  codec: string;
  bitrate: number;
  hls: number;
  lastcheckok: number;
  lastchecktime: string;
  lastchecktime_iso8601: string;
  lastcheckoktime: string;
  lastcheckoktime_iso8601: string;
  lastlocalchecktime: string;
  lastlocalchecktime_iso8601: string;
  clicktimestamp: string;
  clicktimestamp_iso8601: string;
  ssl_error: number;
  
  // Geolocation
  geo_lat: number | null;
  geo_long: number | null;
  
  // Extended Info
  has_extended_info: boolean;
  
  // Custom (J Radio)
  is_approximate?: boolean;
}
```

### Search Parameters

```typescript
interface SearchParams {
  name?: string;
  country?: string;
  countrycode?: string;
  state?: string;
  language?: string;
  tag?: string;
  tagList?: string;
  codec?: string;
  bitrate?: number;
  bitrateMin?: number;
  bitrateMax?: number;
  has_geo_info?: boolean;
  has_extended_info?: boolean;
  is_https?: boolean;
  order?: string;
  reverse?: boolean;
  offset?: number;
  limit?: number;
  hidebroken?: boolean;
}
```

---

## 🔗 External Resources

- **Official Site**: https://www.radio-browser.info/
- **API Documentation**: https://api.radio-browser.info/
- **GitLab Repository**: https://gitlab.com/radiobrowser/radio-database
- **Interactive Map**: https://www.radio-browser.info/map
- **User Guide**: https://www.radio-browser.info/users

---

**Last Updated:** 2026-01-26  
**API Version:** 0.8.0  
**J Radio Version:** 1.0.0
