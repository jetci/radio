# 🔍 Debug Checklist - สถานีไม่แสดง

## ขั้นตอนการตรวจสอบ

### 1. เปิด Browser Console
```
F12 → Console Tab
```

### 2. ตรวจสอบ Logs ตามลำดับ

#### ✅ Step 1: ตรวจสอบว่ามีสถานี
```
ดู log: "🏙️ Starting clustering for X stations..."
- ถ้า X = 0 → ปัญหาอยู่ที่การโหลดข้อมูล
- ถ้า X > 0 → ข้อมูลโหลดได้
```

#### ✅ Step 2: ตรวจสอบ Clusters
```
ดู log: "✅ Created X city clusters"
- ถ้า X = 0 → ปัญหาอยู่ที่ clustering logic
- ถ้า X > 0 → clustering ทำงาน
```

#### ✅ Step 3: ตรวจสอบ Visible Clusters
```
ดู log: "🔍 Zoom X.XX: Showing Y/Z cities"
- ถ้า Y = 0 → ปัญหาอยู่ที่ zoom filter
- ถ้า Y > 0 → มี clusters ที่จะแสดง
```

#### ✅ Step 4: ตรวจสอบ Marker Data
```
ดู log: "📊 Marker Data (Micro-Spreading): X stations from Y clusters"
- ถ้า X = 0 → ปัญหาอยู่ที่ spreading logic
- ถ้า X > 0 → markers ถูกสร้าง
```

#### ✅ Step 5: ตรวจสอบ Sample Marker
```
ดู log: "✅ Sample marker: { lat, lng, size, color }"
- ตรวจสอบว่า lat, lng เป็นตัวเลข
- ตรวจสอบว่า size > 0
- ตรวจสอบว่า color มีค่า
```

---

## 🐛 ปัญหาที่เป็นไปได้

### ปัญหา 1: ไม่มีข้อมูลสถานี
**อาการ**: `validStations.length = 0`

**สาเหตุ**:
- API ไม่ตอบกลับ
- Network error
- CORS issue

**วิธีแก้**:
```javascript
// ตรวจสอบใน App.tsx
console.log('Stations loaded:', allStations.length);
```

---

### ปัญหา 2: Clustering ล้มเหลว
**อาการ**: `clusters.length = 0` แต่ `validStations.length > 0`

**สาเหตุ**:
- geo_lat/geo_long เป็น null ทั้งหมด
- Clustering logic error

**วิธีแก้**:
```javascript
// ตรวจสอบใน cityCluster.ts
console.log('Station coords:', station.geo_lat, station.geo_long);
```

---

### ปัญหา 3: Spreading ล้มเหลว
**อาการ**: `markerData.length = 0` แต่ `visibleClusters.length > 0`

**สาเหตุ**:
- spreadClusterStations return []
- Invalid coordinates

**วิธีแก้**:
```javascript
// ตรวจสอบใน cityCluster.ts
console.log('Spread result:', spreadStations.length);
```

---

### ปัญหา 4: Globe ไม่ render markers
**อาการ**: `markerData.length > 0` แต่ไม่เห็นจุดบน globe

**สาเหตุ**:
- pointsData prop ไม่ถูกส่งไปยัง Globe
- WebGL error
- Size หรือ color ผิดพลาด

**วิธีแก้**:
```javascript
// ตรวจสอบใน GlobeView.tsx
console.log('Globe pointsData:', markerData);
```

---

## 🔧 Quick Fixes

### Fix 1: Force Reload Data
```javascript
// ใน App.tsx
useEffect(() => {
  initializeApp();
}, []);
```

### Fix 2: Disable Clustering (Fallback)
```javascript
// ใน GlobeView.tsx
const useClustering = false; // เปลี่ยนเป็น false
```

### Fix 3: Check Globe Props
```javascript
// ใน GlobeView.tsx
<Globe
  pointsData={markerData}  // ต้องมี
  pointLat="lat"           // ต้องมี
  pointLng="lng"           // ต้องมี
  pointColor="color"       // ต้องมี
  pointRadius="size"       // ต้องมี
/>
```

---

## 📝 Expected Console Output

```
🏙️ Starting clustering for 50000 stations...
✅ Created 2000 city clusters
   Sample cluster: Bangkok (50 stations)
🏙️ City Clustering Stats: {
  totalStations: 50000,
  totalCities: 2000,
  avgStationsPerCity: 25.0,
  largestCity: 200
}
🔍 Zoom 2.50: Showing 2000/2000 cities
🎯 Processing 2000 clusters for display
📍 First cluster: Bangkok Stations: 50
   First station display coords: 13.75 100.50
📊 Marker Data (Micro-Spreading): 50000 stations from 2000 clusters
✅ Sample marker: {
  lat: 13.75,
  lng: 100.50,
  size: 0.035,
  color: "#00ff41"
}
```

---

## 🚨 Error Messages

### Error 1: "Invalid cluster coordinates"
```
⚠️ Invalid cluster coordinates: { ... }
```
**แก้**: ตรวจสอบว่า cluster.lat และ cluster.lng เป็นตัวเลข

### Error 2: "No marker data generated!"
```
❌ No marker data generated!
```
**แก้**: ตรวจสอบ spreadClusterStations function

### Error 3: "Cannot read property 'lat' of undefined"
```
TypeError: Cannot read property 'lat' of undefined
```
**แก้**: ตรวจสอบว่า markerData ไม่เป็น null/undefined

---

## ✅ Success Indicators

1. ✅ Console แสดง logs ครบทุก step
2. ✅ `markerData.length > 0`
3. ✅ เห็นจุดสถานีบน globe
4. ✅ คลิกจุดได้และเลือกสถานีได้

---

**หากทำตามขั้นตอนแล้วยังไม่แก้ไข ให้ส่ง screenshot console logs มาให้ดู!**
