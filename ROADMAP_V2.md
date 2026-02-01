# 🚀 J-Radio Version 2 - Development Roadmap

## 📋 สรุปปัญหาปัจจุบัน (Version 1)

### ข้อจำกัดของ Radio Browser API
- ไม่ครอบคลุมสถานีทั้งหมด (เช่น Eingdoi Radio ไม่มี)
- สถานีบางตัวไม่มีพิกัด GPS
- ข้อมูลไม่ครบถ้วนเท่า Radio Garden

### สิ่งที่ทำได้แล้ว (Version 1)
- ✅ แสดงสถานีบน Globe 3D
- ✅ เล่นเพลงได้
- ✅ ค้นหาและกรองสถานี
- ✅ Favorites
- ✅ Dark/Light theme
- ✅ AudioPlayer ซ่อนเมื่อเปิด Panel
- ✅ Globe หมุนเมื่อเลือกประเทศ
- ✅ แสดง 20,000 สถานี

---

## 🎯 Version 2 - ฟีเจอร์ใหม่

### 1. 🎵 เพิ่มสถานีเอง (Custom Stations)

**ปัญหาที่แก้:**
- ผู้ใช้สามารถเพิ่มสถานีที่ไม่มีใน Radio Browser API
- เช่น Eingdoi Radio, สถานีท้องถิ่น, สถานีส่วนตัว

**ฟีเจอร์:**
```typescript
interface CustomStation {
  id: string;
  name: string;
  url: string; // Stream URL
  country: string;
  countrycode: string;
  geo_lat?: number;
  geo_long?: number;
  tags?: string;
  favicon?: string;
  homepage?: string;
  isCustom: true; // Flag สำหรับสถานีที่ผู้ใช้เพิ่มเอง
}
```

**UI:**
- ปุ่ม "Add Station" ใน Settings
- Form กรอก:
  - ชื่อสถานี (required)
  - Stream URL (required)
  - ประเทศ (required)
  - พิกัด GPS (optional)
  - ประเภทเพลง (optional)
  - รูปโลโก้ (optional)

**การจัดเก็บ:**
- LocalStorage: `customStations`
- Merge กับ Radio Browser API stations
- แสดงบน Globe พร้อมกับสถานีอื่น

---

### 2. 🗺️ Multiple Data Sources

**ปัญหาที่แก้:**
- Radio Browser API ไม่ครบ
- ต้องการสถานีจากหลายแหล่ง

**แหล่งข้อมูลเพิ่มเติม:**

#### 2.1 TuneIn API (ถ้ามี API key)
```typescript
// TuneIn มีสถานีมากกว่า 100,000
// แต่ต้องสมัคร API key
```

#### 2.2 Community Radio List
```typescript
// รายการสถานีที่ผู้ใช้เพิ่มเอง
// แชร์กันได้ผ่าน GitHub Gist หรือ Firebase
```

#### 2.3 Scrape จาก Radio Garden
```typescript
// ถ้าทำได้ตามกฎหมาย
// หรือขอ API access จาก Radio Garden
```

---

### 3. 📍 Smart Geolocation

**ปัญหาที่แก้:**
- สถานีที่ไม่มีพิกัดไม่แสดงบน Globe
- การสุ่มพิกัดทำให้ดูไม่เป็นธรรมชาติ

**วิธีแก้:**

#### 3.1 City Database
```typescript
// ใช้ city database เพื่อหาพิกัดจากชื่อเมือง
// เช่น "Pathum Thani" → (14.0208, 100.5250)

import cityCoordinates from './data/cities.json';

function getCityCoordinates(cityName: string, countryCode: string) {
  return cityCoordinates[countryCode]?.[cityName];
}
```

#### 3.2 Geocoding API
```typescript
// ใช้ Nominatim (OpenStreetMap) - ฟรี
async function geocodeCity(city: string, country: string) {
  const response = await fetch(
    `https://nominatim.openstreetmap.org/search?city=${city}&country=${country}&format=json`
  );
  const data = await response.json();
  return { lat: data[0].lat, lng: data[0].lon };
}
```

#### 3.3 ให้ผู้ใช้เลือก
```typescript
// Settings: "แสดงสถานีที่ไม่มีพิกัด"
// - ไม่แสดง (default)
// - แสดงที่ศูนย์กลางประเทศ
// - แสดงที่เมืองหลวง
// - ให้ผู้ใช้กำหนดพิกัดเอง
```

---

### 4. 🎨 UI/UX Improvements

#### 4.1 Station Details Panel
```typescript
// แสดงข้อมูลสถานีเพิ่มเติม
- Now Playing (ถ้ามี metadata)
- Bitrate
- Codec
- จำนวนผู้ฟัง (ถ้ามี)
- ประวัติการเล่น
```

#### 4.2 Mini Player
```typescript
// AudioPlayer แบบย่อ
// - ติดขอบจอ
// - ลากย้ายได้
// - ขยาย/ย่อได้
```

#### 4.3 Keyboard Shortcuts
```typescript
// Space: Play/Pause
// Arrow Up/Down: Volume
// Arrow Left/Right: Previous/Next station
// F: Toggle Favorites
// S: Open Search
// Esc: Close panels
```

---

### 5. 📊 Analytics & Recommendations

#### 5.1 Listening History
```typescript
interface ListeningHistory {
  stationId: string;
  timestamp: number;
  duration: number; // seconds
}

// แสดง:
// - Recently Played
// - Most Played
// - Total Listening Time
```

#### 5.2 Recommendations
```typescript
// แนะนำสถานีตาม:
// - ประเภทเพลงที่ฟังบ่อย
// - ประเทศที่ฟังบ่อย
// - สถานีที่คล้ายกัน
```

---

### 6. 🌐 Social Features

#### 6.1 Share Station
```typescript
// แชร์สถานีผ่าน:
// - URL (มีอยู่แล้ว)
// - QR Code
// - Social Media (Facebook, Twitter, Line)
```

#### 6.2 Community Playlists
```typescript
// ผู้ใช้สร้าง playlist แชร์กันได้
// - "Best Thai Radio"
// - "Chill Vibes"
// - "News Stations"
```

---

### 7. 🔊 Audio Features

#### 7.1 Equalizer
```typescript
// ปรับเสียง:
// - Bass
// - Treble
// - Presets (Rock, Pop, Jazz, etc.)
```

#### 7.2 Sleep Timer
```typescript
// ตั้งเวลาปิดอัตโนมัติ
// - 15, 30, 60, 90, 120 minutes
```

#### 7.3 Recording
```typescript
// บันทึกเสียง (ถ้าถูกกฎหมาย)
// - Record current station
// - Save as MP3
```

---

### 8. 📱 Mobile App

#### 8.1 Progressive Web App (PWA)
```typescript
// ติดตั้งเป็น app ได้
// - Offline support
// - Push notifications
// - Background playback
```

#### 8.2 React Native
```typescript
// สร้าง mobile app จริงๆ
// - iOS
// - Android
```

---

### 9. 🔐 User Accounts (Optional)

#### 9.1 Firebase Authentication
```typescript
// Login ด้วย:
// - Google
// - Facebook
// - Email/Password
```

#### 9.2 Cloud Sync
```typescript
// Sync ข้อมูลข้าม device:
// - Favorites
// - Custom Stations
// - Settings
// - Listening History
```

---

### 10. 🎯 Performance Optimization

#### 10.1 Lazy Loading
```typescript
// โหลดสถานีแบบ pagination
// - โหลดแค่ที่แสดงบน Globe
// - โหลดเพิ่มเมื่อ zoom in
```

#### 10.2 Caching
```typescript
// Cache ข้อมูล:
// - Station list
// - Favicons
// - Country coordinates
```

#### 10.3 Web Workers
```typescript
// ประมวลผลหนักใน background:
// - Filter stations
// - Search
// - Clustering
```

---

## 🗓️ Timeline

### Phase 1 (เดือน 1-2)
- ✅ เพิ่มสถานีเอง (Custom Stations)
- ✅ Smart Geolocation (City Database)
- ✅ Station Details Panel

### Phase 2 (เดือน 3-4)
- ✅ Multiple Data Sources
- ✅ UI/UX Improvements
- ✅ Keyboard Shortcuts

### Phase 3 (เดือน 5-6)
- ✅ Analytics & Recommendations
- ✅ Social Features
- ✅ Audio Features

### Phase 4 (เดือน 7-8)
- ✅ Mobile App (PWA)
- ✅ User Accounts (Optional)
- ✅ Performance Optimization

---

## 📦 Tech Stack (Version 2)

### Frontend
- React 18
- TypeScript
- Tailwind CSS
- react-globe.gl
- Zustand (State Management)
- React Query (Data Fetching)

### Backend (Optional)
- Firebase (Authentication, Firestore, Storage)
- Cloudflare Workers (API Proxy)

### Mobile
- React Native (iOS/Android)
- Expo

### Tools
- Vite (Build Tool)
- Vitest (Testing)
- Playwright (E2E Testing)
- GitHub Actions (CI/CD)

---

## 🎯 Success Metrics

### Version 1 (Current)
- ✅ 20,000 สถานี
- ✅ 1-2 วินาที load time
- ✅ 0 crashes

### Version 2 (Target)
- 🎯 50,000+ สถานี (รวม custom)
- 🎯 <1 วินาที load time
- 🎯 90+ Performance Score
- 🎯 PWA installable
- 🎯 1000+ active users

---

## 📝 Notes

### ปัญหาที่ต้องแก้ก่อน V2
1. ✅ UI Overlap (แก้แล้ว)
2. ✅ AudioPlayer visibility (แก้แล้ว)
3. ✅ Country filter colors (แก้แล้ว)
4. ✅ Station count (แก้แล้ว)
5. ⏳ Custom Stations (V2)
6. ⏳ Smart Geolocation (V2)

### คำแนะนำ
- เริ่มจาก Custom Stations ก่อน (ง่ายที่สุด)
- ทดสอบกับผู้ใช้จริง
- รวบรวม feedback
- ปรับปรุงตาม feedback

---

## 🚀 Getting Started (V2 Development)

```bash
# 1. Create V2 branch
git checkout -b v2-development

# 2. Install new dependencies
npm install zustand react-query

# 3. Create new features
mkdir src/features/custom-stations
mkdir src/features/recommendations
mkdir src/features/analytics

# 4. Start development
npm run dev
```

---

**Last Updated:** 2026-02-01
**Version:** 2.0.0-roadmap
**Status:** Planning
