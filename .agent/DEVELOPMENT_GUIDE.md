# J Radio - คู่มือการพัฒนา (Development Guide)

> **Interactive 3D Globe Radio Application**  
> แอปพลิเคชันเว็บสำหรับค้นหาและฟังสถานีวิทยุสดจากทั่วโลกผ่าน 3D Globe พร้อม AI Recommendations

---

## 🚨 กฎการสื่อสารและการรายงาน (Communication Rules)

เพื่อความสะดวกในการทำงานร่วมกัน ผู้ช่วย AI **ต้องปฏิบัติตามกฎต่อไปนี้อย่างเคร่งครัด**:

1.  **ภาษาในการสื่อสาร**: ต้องใช้ **ภาษาไทย** ในการโต้ตอบ สนทนา และรายงานความคืบหน้าทั้งหมด (ยกเว้นคำศัพท์ทางเทคนิคทับศัพท์ภาษาอังกฤษได้)
2.  **รายงานสรุป**: เมื่อทำงานเสร็จสิ้นในแต่ละขั้นตอน ต้องสรุปผลการทำงาน สิ่งที่แก้ไข และสิ่งที่ต้องทำต่อ เป็นภาษาไทย

---

## 📚 สารบัญ

1. [ภาพรวมโปรเจกต์](#ภาพรวมโปรเจกต์)
2. [แหล่งข้อมูลสำคัญ](#แหล่งข้อมูลสำคัญ)
3. [โครงสร้างโปรเจกต์](#โครงสร้างโปรเจกต์)
4. [Tech Stack](#tech-stack)
5. [การติดตั้งและรันโปรเจกต์](#การติดตั้งและรันโปรเจกต์)
6. [Radio Browser API](#radio-browser-api)
7. [Gemini AI Integration](#gemini-ai-integration)
8. [Component Architecture](#component-architecture)
9. [State Management](#state-management)
10. [Styling Guidelines](#styling-guidelines)
11. [Error Handling](#error-handling)
12. [Performance Optimization](#performance-optimization)
13. [Testing Guidelines](#testing-guidelines)
14. [Deployment](#deployment)
15. [Troubleshooting](#troubleshooting)

---

## 🎯 ภาพรวมโปรเจกต์

**J Radio** เป็นแอปพลิเคชันเว็บที่ให้ผู้ใช้สำรวจและฟังสถานีวิทยุจากทั่วโลกผ่านการแสดงผล 3D Globe แบบ Interactive

### ✨ Features หลัก

- 🌍 **3D Globe Visualization** - แสดงตำแหน่งสถานีวิทยุบนโลก 3 มิติ
- 📻 **Live Radio Streaming** - เล่นสถานีวิทยุสดจาก 30,000+ สถานีทั่วโลก
- 🤖 **AI-Powered Recommendations** - ใช้ Gemini AI แนะนำสถานีตาม mood
- 🔍 **Advanced Search** - ค้นหาตามชื่อ, ประเทศ, ประเภท, และตำแหน่ง
- ⭐ **Favorites System** - บันทึกสถานีโปรดในเครื่อง
- 🎨 **Modern UI/UX** - Glassmorphism, Neon Accents, Responsive Design
- 🌐 **Geolocation Support** - แนะนำสถานีใกล้เคียงตามตำแหน่งผู้ใช้

---

## 🔗 แหล่งข้อมูลสำคัญ

### Radio Browser API

#### 📖 Official Resources

| Resource | URL | Description |
|----------|-----|-------------|
| **Official Website** | https://www.radio-browser.info/ | หน้าหลักของ Radio Browser |
| **User Documentation** | https://www.radio-browser.info/users | คู่มือการใช้งานสำหรับผู้ใช้ |
| **Interactive Map** | https://www.radio-browser.info/map | แผนที่แสดงสถานีวิทยุทั่วโลก |
| **GitLab Repository** | https://gitlab.com/radiobrowser/radio-database | Source code และ documentation |
| **API Documentation** | https://api.radio-browser.info/ | API Endpoints และ Examples |

#### 🔑 Key Information

- **Database**: Open-source community radio station database
- **Total Stations**: 30,000+ สถานีวิทยุทั่วโลก
- **Update Frequency**: Real-time updates from community
- **API Access**: Free, no authentication required
- **Rate Limits**: None (but please be respectful)
- **Data Format**: JSON
- **CORS**: Enabled for browser access

#### 🌐 API Mirrors

```javascript
const MIRRORS = [
  'https://de1.api.radio-browser.info/json',  // Germany
  'https://at1.api.radio-browser.info/json',  // Austria
  'https://nl1.api.radio-browser.info/json'   // Netherlands
];
```

**Note**: ใช้ mirror fallback เพื่อความเสถียร (implemented in `radioApi.ts`)

---

## 📁 โครงสร้างโปรเจกต์

```
d:\j-radio/
├── 📄 Configuration Files
│   ├── package.json              # Dependencies และ Scripts
│   ├── tsconfig.json             # TypeScript Configuration
│   ├── vite.config.ts            # Vite Build Configuration
│   ├── .env.local                # Environment Variables (GEMINI_API_KEY)
│   ├── metadata.json             # App Metadata (AI Studio)
│   └── .gitignore                # Git Ignore Rules
│
├── 📄 Entry Points
│   ├── index.html                # HTML Entry Point
│   ├── index.tsx                 # React Entry Point
│   └── index.css                 # Global Styles
│
├── 📄 Core Application
│   ├── App.tsx                   # Main Application Component
│   ├── types.ts                  # TypeScript Type Definitions
│   └── contexts/                 # Global State (Language, Theme)
│
├── 📁 components/                # React Components
│   ├── GlobeView.tsx             # 3D Globe Visualization
│   ├── Sidebar.tsx               # Search & Filter Panel
│   └── AudioPlayer.tsx           # Audio Playback Controls
│
├── 📁 hooks/                     # Custom React Hooks
│   ├── useListeningHistory.ts    # History Management
│   └── useToast.ts               # Notification System
│
├── 📁 services/ & api/           # External Services
│   ├── services/radioApi.ts      # Radio Browser API Client
│   ├── services/geminiService.ts # Gemini AI Service
│   └── api/gemini.ts             # Gemini API Handlers
│
├── 📁 utils/                     # Utility Functions
│   ├── cityCluster.ts            # Logic จัดการกลุ่มเมือง
│   ├── spreadPoints.ts           # Logic กระจายจุดบนโลก
│   └── countryCoordinates.ts     # พิกัดประเทศ
│
└── 📁 .agent/                    # Development Documentation
    └── DEVELOPMENT_GUIDE.md      # This file
```

---

## 🛠️ Tech Stack

### Frontend Framework
- **React** `19.2.3` - UI Library
- **TypeScript** `5.8.2` - Type Safety
- **Vite** `6.2.0` - Build Tool & Dev Server

### 3D Visualization
- **react-globe.gl** `2.37.0` - 3D Globe Component
- **Three.js** `0.170.0` - WebGL 3D Library

### Styling
- **Tailwind CSS** (via CDN) - Utility-first CSS
- **Google Fonts (Inter)** - Typography

### APIs & Services
- **Radio Browser API** - Radio Station Database
- **Google Gemini AI** `@google/genai 1.38.0` - AI Recommendations

### UI Components
- **lucide-react** `0.563.0` - Icon Library

### Development Tools
- **@vitejs/plugin-react** `5.0.0` - React Fast Refresh
- **@types/node** `22.14.0` - Node.js Type Definitions

---

## 🚀 การติดตั้งและรันโปรเจกต์

### Prerequisites

- **Node.js** >= 18.0.0
- **npm** >= 9.0.0
- **Gemini API Key** (Get from [Google AI Studio](https://ai.google.dev/))

### Installation Steps

```bash
# 1. Clone repository (if applicable)
git clone <repository-url>
cd j-radio

# 2. Install dependencies
npm install

# 3. Set up environment variables
# Create .env.local file
echo "GEMINI_API_KEY=your_api_key_here" > .env.local

# 4. Start development server
npm run dev
```

### Available Scripts

```bash
npm run dev      # Start development server (http://localhost:5173)
npm run build    # Build for production
npm run preview  # Preview production build
```

### Environment Variables

Create `.env.local` file in root directory:

```env
# Required
GEMINI_API_KEY=your_gemini_api_key_here

# Optional (for future features)
# RADIO_BROWSER_USER_AGENT=YourAppName/1.0
```

---

## 📡 Radio Browser API

### API Base URLs

```typescript
const API_MIRRORS = [
  'https://de1.api.radio-browser.info/json',
  'https://at1.api.radio-browser.info/json',
  'https://nl1.api.radio-browser.info/json'
];
```

### Main Endpoints Used

#### 1. Get Top Voted Stations

```typescript
GET /stations/search?order=votes&reverse=true&limit=2500&has_geo=true&hidebroken=true
```

**Parameters:**
- `order=votes` - เรียงตามคะแนนโหวต
- `reverse=true` - มากไปน้อย
- `limit=2500` - จำนวนสถานีสูงสุด
- `has_geo=true` - มีพิกัดภูมิศาสตร์เท่านั้น
- `hidebroken=true` - ซ่อนสถานีที่ใช้งานไม่ได้

#### 2. Search by Country

```typescript
GET /stations/search?countrycode={CODE}&order=votes&reverse=true&limit=100&hidebroken=true
```

**Example:**
```typescript
radioApi.getStationsByCountry('TH', 100); // Thailand stations
```

#### 3. Advanced Search

```typescript
GET /stations/search?{params}
```

**Supported Parameters:**
- `name` - ชื่อสถานี
- `country` - ชื่อประเทศ
- `countrycode` - รหัสประเทศ (ISO 3166-1)
- `tag` - ประเภท/แท็ก (jazz, rock, news, etc.)
- `limit` - จำนวนผลลัพธ์
- `has_geo` - กรองเฉพาะที่มีพิกัด
- `hidebroken` - ซ่อนสถานีเสีย

### Response Format

```typescript
interface Station {
  changeuuid: string;
  stationuuid: string;
  name: string;
  url: string;
  url_resolved: string;
  homepage: string;
  favicon: string;
  tags: string;
  country: string;
  countrycode: string;
  state: string;
  language: string;
  votes: number;
  clickcount: number;
  codec: string;
  bitrate: number;
  geo_lat: number | null;
  geo_long: number | null;
  is_approximate?: boolean;
}
```

### Error Handling

```typescript
async function fetchWithFallback(path: string) {
  let lastError;
  for (let i = 0; i < MIRRORS.length; i++) {
    try {
      const response = await fetch(`${mirror}${path}`, {
        headers: { 
          'Accept': 'application/json',
          'User-Agent': 'J-Radio/1.0'
        }
      });
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      return await response.json();
    } catch (error) {
      lastError = error;
      // Try next mirror
    }
  }
  throw lastError;
}
```

### Best Practices

1. **Use Mirror Fallback** - เพื่อความเสถียร
2. **Set User-Agent** - ระบุชื่อแอปของคุณ
3. **Cache Results** - ลด API calls
4. **Filter by has_geo** - สำหรับการแสดงบน Globe
5. **Handle Broken Streams** - ใช้ `hidebroken=true`

---

## 🤖 Gemini AI Integration

### Setup

```typescript
import { GoogleGenAI, Type } from "@google/genai";

const ai = new GoogleGenAI({ 
  apiKey: process.env.API_KEY 
});
```

### AI Recommendation Flow

```typescript
async function getAiRecommendations(userInput: string) {
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: `The user is looking for radio stations. 
               Input: "${userInput}". 
               Analyze the mood or intent and provide exactly 3 
               specific radio tags or genres that would best match.`,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.ARRAY,
        items: { type: Type.STRING }
      }
    }
  });

  return JSON.parse(response.text || '[]');
}
```

### Example Usage

**Input:**
```typescript
getAiRecommendations("I want to relax after work")
```

**Output:**
```json
["lofi", "jazz", "ambient"]
```

### Use Cases

1. **Mood-based Search** - "I'm feeling energetic"
2. **Activity-based** - "Music for studying"
3. **Time-based** - "Morning coffee music"
4. **Genre Discovery** - "Something like jazz but modern"

---

## 🧩 Component Architecture

### 1. App.tsx (Main Controller)

**Responsibilities:**
- Global state management
- API orchestration
- Component coordination
- Audio playback control

**Key State:**

```typescript
const [stations, setStations] = useState<Station[]>([]);
const [activeStation, setActiveStation] = useState<Station | null>(null);
const [isPlaying, setIsPlaying] = useState(false);
const [favorites, setFavorites] = useState<Station[]>([]);
const [volume, setVolume] = useState(0.7);
const [filters, setFilters] = useState<SearchParams>({});
```

**Key Functions:**

```typescript
handleStart() // Initialize app
toggleFavorite(station) // Manage favorites
handleFilterChange(params) // Update search filters
handleStationSelect(station) // Select and play station
```

---

### 2. GlobeView.tsx (3D Visualization)

**Props:**
```typescript
interface GlobeViewProps {
  stations: Station[];
  onSelectStation: (station: Station) => void;
  activeStation: Station | null;
}
```

**Features:**
- Interactive 3D Earth
- Station markers with geo-coordinates
- Hover tooltips
- Click to select
- Auto-focus on active station
- Ring animation for playing station

**Key Implementation:**

```typescript
// Point Data Mapping
const pointData = stations.map(s => ({
  ...s,
  lat: s.geo_lat!,
  lng: s.geo_long!,
  size: isSelected ? 0.6 : 0.18,
  color: isSelected ? '#ffffff' : '#00ff41'
}));

// Ring Animation for Active Station
const ringData = activeStation ? [{
  lat: activeStation.geo_lat,
  lng: activeStation.geo_long,
  maxR: 5,
  propagationSpeed: 1.5,
  repeatPeriod: 800
}] : [];
```

---

### 3. Sidebar.tsx (Search & Filter)

**Props:**
```typescript
interface SidebarProps {
  onSelectStation: (station: Station) => void;
  favorites: Station[];
  onToggleFavorite: (station: Station) => void;
  stations: Station[];
  onFilterChange: (params: SearchParams) => void;
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  onAutoTune?: () => void;
}
```

**Features:**
- Text search
- AI-powered search
- Quick tag filters
- Favorites list
- Country filter
- Responsive drawer

**Search Implementation:**

```typescript
// Text Search
const handleSearch = (e: React.FormEvent) => {
  e.preventDefault();
  onFilterChange({ name: searchQuery });
};

// AI Search
const handleAiSearch = async () => {
  const tags = await geminiService.getAiRecommendations(aiQuery);
  if (tags.length > 0) {
    onFilterChange({ tag: tags[0] });
  }
};
```

---

### 4. AudioPlayer.tsx (Playback Control)

**Props:**
```typescript
interface AudioPlayerProps {
  station: Station | null;
  isPlaying: boolean;
  volume: number;
  onTogglePlay: () => void;
  onVolumeChange: (val: number) => void;
  onExploreClick: () => void;
  isFavorite: boolean;
  onToggleFavorite: () => void;
}
```

**Features:**
- Play/Pause control
- Volume control
- Waveform visualizer
- Error handling (CORS, 404, Network)
- Loading states
- Station info display

**Audio Management:**

```typescript
useEffect(() => {
  if (station && audioRef.current) {
    let streamUrl = station.url_resolved || station.url;
    
    // HTTPS upgrade for security
    if (window.location.protocol === 'https:' && 
        streamUrl.startsWith('http:')) {
      streamUrl = streamUrl.replace('http:', 'https:');
    }
    
    audioRef.current.src = streamUrl;
    audioRef.current.load();
    
    if (isPlaying) {
      audioRef.current.play().catch(handleError);
    }
  }
}, [station?.stationuuid]);
```

---

## 🔄 State Management

### Local Storage

**Favorites Persistence:**

```typescript
// Save favorites
useEffect(() => {
  localStorage.setItem('j-radio-favorites', 
    JSON.stringify(favorites)
  );
}, [favorites]);

// Load favorites
useEffect(() => {
  const saved = localStorage.getItem('j-radio-favorites');
  if (saved) {
    setFavorites(JSON.parse(saved));
  }
}, []);
```

### State Flow

```
User Action
    ↓
Component Event Handler
    ↓
App.tsx State Update
    ↓
Props to Child Components
    ↓
UI Re-render
```

---

## 🎨 Styling Guidelines

### Color Palette

```css
/* Primary Colors */
--bg-primary: #020617;      /* Dark Blue */
--bg-secondary: #030712;    /* Darker Blue */

/* Accent Colors */
--accent-neon: #00ff41;     /* Neon Green */
--accent-live: #ef4444;     /* Red (Live) */
--accent-error: #ff5722;    /* Orange (Error) */

/* Text Colors */
--text-primary: #ffffff;
--text-secondary: rgba(255, 255, 255, 0.7);
--text-muted: rgba(255, 255, 255, 0.4);
```

### Typography

```css
font-family: 'Inter', sans-serif;

/* Font Weights */
--font-light: 300;
--font-regular: 400;
--font-medium: 500;
--font-semibold: 600;
--font-bold: 700;
```

### Design Patterns

1. **Glassmorphism**
```css
background: rgba(0, 0, 0, 0.8);
backdrop-filter: blur(20px);
border: 1px solid rgba(255, 255, 255, 0.1);
```

2. **Pill Shapes**
```css
border-radius: 9999px; /* Full rounded */
```

3. **Neon Accents**
```css
color: #00ff41;
text-shadow: 0 0 10px rgba(0, 255, 65, 0.5);
```

4. **Smooth Transitions**
```css
transition: all 0.3s ease;
```

---

## ⚠️ Error Handling

### Audio Stream Errors

```typescript
const handleAudioError = (e: any) => {
  const code = e.target.error?.code;
  
  switch(code) {
    case 4: // MEDIA_ERR_SRC_NOT_SUPPORTED
      setErrorType('cors');
      break;
    case 2: // MEDIA_ERR_NETWORK
      setErrorType('network');
      break;
    default:
      setErrorType('unknown');
  }
};
```

### API Error Handling

```typescript
try {
  const stations = await radioApi.searchStations(params);
  setStations(stations);
} catch (error) {
  console.error('Failed to fetch stations:', error);
  // Fallback to cached data or show error message
}
```

### Common Issues

1. **CORS Errors** - Some stations don't support CORS
2. **404 Errors** - Stream URL no longer valid
3. **Network Errors** - Connection issues
4. **Missing Geo Data** - Filter with `has_geo=true`

---

## ⚡ Performance Optimization

### 1. Memoization

```typescript
const validStations = useMemo(() => 
  stations.filter(s => s.geo_lat && s.geo_long),
  [stations]
);

const pointData = useMemo(() => 
  validStations.map(s => ({ ...s, lat: s.geo_lat })),
  [validStations, activeStation]
);
```

### 2. Lazy Loading

```typescript
// Load stations on demand
const loadMoreStations = async () => {
  const newStations = await radioApi.getTopVoted(limit);
  setStations(prev => [...prev, ...newStations]);
};
```

### 3. Debouncing Search

```typescript
const debouncedSearch = useMemo(
  () => debounce((query: string) => {
    onFilterChange({ name: query });
  }, 500),
  []
);
```

### 4. Image Optimization

```typescript
// Use favicon with fallback
<img 
  src={station.favicon} 
  onError={(e) => e.target.src = '/default-icon.png'}
  loading="lazy"
/>
```

---

## 🧪 Testing Guidelines

### Unit Testing (Future)

```typescript
// Example test structure
describe('radioApi', () => {
  it('should fetch top voted stations', async () => {
    const stations = await radioApi.getTopVoted(10);
    expect(stations).toHaveLength(10);
    expect(stations[0]).toHaveProperty('stationuuid');
  });
});
```

### Manual Testing Checklist

- [ ] Globe renders correctly
- [ ] Stations appear on globe
- [ ] Click station to play
- [ ] Audio plays without errors
- [ ] Search functionality works
- [ ] AI recommendations work
- [ ] Favorites save to localStorage
- [ ] Responsive on mobile
- [ ] Error states display properly

---

## 🚢 Deployment

### Build for Production

```bash
npm run build
```

Output: `dist/` folder

### Deployment Platforms

1. **Vercel** (Recommended)
```bash
npm install -g vercel
vercel
```

2. **Netlify**
```bash
npm install -g netlify-cli
netlify deploy --prod
```

3. **GitHub Pages**
```bash
npm run build
# Deploy dist/ folder
```

### Environment Variables

Set in deployment platform:
```
GEMINI_API_KEY=your_production_key
```

---

## 🔧 Troubleshooting

### Issue: Audio not playing

**Possible Causes:**
1. CORS issues with stream URL
2. HTTPS/HTTP mixed content
3. Stream URL broken

**Solutions:**
```typescript
// Try HTTPS upgrade
streamUrl = streamUrl.replace('http:', 'https:');

// Add error handling
audio.onerror = () => {
  console.error('Stream failed, trying next station');
};
```

### Issue: Globe not rendering

**Check:**
1. Three.js loaded correctly
2. WebGL support in browser
3. Console for errors

### Issue: API requests failing

**Check:**
1. Network connectivity
2. API mirror status
3. CORS headers

---

## 📝 Development Best Practices

### 1. Code Organization
- Keep components small and focused
- Use TypeScript for type safety
- Follow React hooks best practices

### 2. Performance
- Use `useMemo` for expensive calculations
- Implement virtual scrolling for large lists
- Optimize re-renders with `React.memo`

### 3. Accessibility
- Add ARIA labels
- Keyboard navigation support
- Screen reader friendly

### 4. Security
- Validate API responses
- Sanitize user inputs
- Use HTTPS for production

---

## 🔮 Future Enhancements

### Planned Features
- [ ] User accounts and cloud sync
- [ ] Playlist creation
- [ ] Social sharing
- [ ] Recording functionality
- [ ] Sleep timer
- [ ] Equalizer
- [ ] Offline mode
- [ ] PWA support

### API Improvements
- [ ] Implement caching layer
- [ ] Add retry logic
- [ ] Rate limiting
- [ ] Analytics tracking

---

## 📞 Support & Resources

### Documentation
- [React Docs](https://react.dev/)
- [Vite Docs](https://vitejs.dev/)
- [Three.js Docs](https://threejs.org/docs/)
- [Tailwind CSS](https://tailwindcss.com/)

### Community
- Radio Browser GitLab: https://gitlab.com/radiobrowser/radio-database
- Radio Browser Users: https://www.radio-browser.info/users

---

## 📄 License

This project uses:
- Radio Browser API (Community Database)
- Google Gemini AI (Requires API Key)
- Open Source Libraries (See package.json)

---

**Last Updated:** 2026-01-26  
**Version:** 1.0.0  
**Maintainer:** J Radio Development Team
