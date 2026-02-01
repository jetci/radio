# 📊 Analytics Setup Guide - TongThin Radio

## 🆓 วิธีที่ 1: Vercel Analytics (แนะนำ - ฟรี)

### ขั้นตอนการเปิดใช้งาน:

#### 1. ไปที่ Vercel Dashboard
```
https://vercel.com/jetci/radio
```

#### 2. เปิด Analytics
```
1. คลิกที่โปรเจกต์ "radio"
2. ไปที่แท็บ "Analytics"
3. คลิก "Enable Analytics"
4. เสร็จ! ไม่ต้องแก้ code
```

#### 3. ดูข้อมูล
```
ใน Analytics Dashboard จะเห็น:
✅ Page Views (จำนวนครั้งที่เข้าชม)
✅ Unique Visitors (ผู้เข้าชมไม่ซ้ำ)
✅ Top Pages (หน้าที่ได้รับความนิยม)
✅ Countries (ประเทศที่เข้าชม)
✅ Devices (Desktop/Mobile)
✅ Browsers (Chrome, Safari, etc.)
```

### ข้อจำกัด (Free Plan):
```
- ข้อมูล 30 วันย้อนหลัง
- Real-time data
- เพียงพอสำหรับ personal projects
```

---

## 🆓 วิธีที่ 2: Google Analytics (ฟรี - ครบฟีเจอร์)

### ✅ ข้อดี:
- **ฟรี** ไม่จำกัด
- ฟีเจอร์เยอะมาก
- Real-time tracking
- Custom events
- Conversion tracking

### ขั้นตอนการติดตั้ง:

#### 1. สร้าง Google Analytics Account
```
1. ไปที่ https://analytics.google.com
2. คลิก "Start measuring"
3. สร้าง Account และ Property
4. เลือก "Web"
5. ใส่ URL: https://radio.vercel.app
6. ได้ Measurement ID: G-XXXXXXXXXX
```

#### 2. เพิ่ม Code ในโปรเจกต์

**ไฟล์: `index.html`**

เพิ่มใน `<head>`:

```html
<!-- Google Analytics -->
<script async src="https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXXXX"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'G-XXXXXXXXXX');
</script>
```

#### 3. Push Code ขึ้น GitHub
```bash
git add index.html
git commit -m "Add Google Analytics"
git push
```

#### 4. Vercel จะ Auto-Deploy
```
รอ 1-2 นาที → เสร็จ!
```

#### 5. ดูข้อมูล
```
ไปที่ https://analytics.google.com
→ เลือก Property "TongThin Radio"
→ ดู Real-time reports
```

### ข้อมูลที่ได้:
```
✅ Real-time users (ผู้ใช้งานตอนนี้)
✅ Page views (จำนวนครั้งที่เข้าชม)
✅ Sessions (จำนวน sessions)
✅ Bounce rate (อัตราตีกลับ)
✅ Average session duration (เวลาเฉลี่ยที่อยู่)
✅ User demographics (อายุ, เพศ, สถานที่)
✅ Traffic sources (มาจากไหน)
✅ Device breakdown (Desktop/Mobile/Tablet)
✅ Browser & OS
✅ Custom events (เช่น เล่นเพลง, เพิ่ม Favorite)
```

---

## 🆓 วิธีที่ 3: Plausible Analytics (Privacy-focused)

### ✅ ข้อดี:
- Privacy-friendly (ไม่ใช้ cookies)
- GDPR compliant
- Simple & lightweight
- Beautiful dashboard

### ❌ ข้อเสีย:
- **เสียเงิน** $9/เดือน (10k pageviews)
- มี Free trial 30 วัน

### ขั้นตอน:
```
1. ไปที่ https://plausible.io
2. Sign up (Free trial 30 วัน)
3. Add website
4. ได้ script tag
5. เพิ่มใน index.html
6. Deploy
```

---

## 🆓 วิธีที่ 4: Umami (Self-hosted - ฟรี)

### ✅ ข้อดี:
- **ฟรี** 100%
- Open-source
- Privacy-friendly
- Self-hosted

### ❌ ข้อเสีย:
- ต้อง host เอง (Vercel, Railway, Heroku)
- ต้องตั้งค่าเอง

### ขั้นตอน:
```
1. Deploy Umami บน Vercel (ฟรี)
2. ได้ tracking script
3. เพิ่มใน index.html
4. Deploy
```

---

## 📊 เปรียบเทียบ

| Feature | Vercel Analytics | Google Analytics | Plausible | Umami |
|---------|------------------|------------------|-----------|-------|
| **ราคา** | ฟรี | ฟรี | $9/เดือน | ฟรี |
| **ติดตั้ง** | 1 คลิก | เพิ่ม code | เพิ่ม code | Self-host |
| **Privacy** | ⭐⭐⭐⭐⭐ | ⭐⭐ | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ |
| **ฟีเจอร์** | ⭐⭐⭐ | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐ |
| **Real-time** | ✅ | ✅ | ✅ | ✅ |
| **Custom Events** | ❌ | ✅ | ✅ | ✅ |
| **ข้อมูลย้อนหลัง** | 30 วัน | ไม่จำกัด | ไม่จำกัด | ไม่จำกัด |

---

## 🎯 คำแนะนำ

### สำหรับโปรเจกต์นี้:

#### 1. **เริ่มต้น: Vercel Analytics** (ฟรี)
```
✅ ติดตั้งง่ายที่สุด (1 คลิก)
✅ ไม่ต้องแก้ code
✅ Privacy-friendly
✅ เพียงพอสำหรับเริ่มต้น
```

#### 2. **ถ้าต้องการข้อมูลเยอะ: Google Analytics** (ฟรี)
```
✅ ฟีเจอร์ครบที่สุด
✅ Custom events
✅ Conversion tracking
✅ Real-time users
```

#### 3. **ถ้าต้องการทั้ง 2: ใช้ทั้งคู่!**
```
✅ Vercel Analytics (overview)
✅ Google Analytics (detailed)
```

---

## 🔥 Custom Events (สำหรับ Google Analytics)

### ติดตามการใช้งานแอป:

```typescript
// ใน App.tsx หรือ components

// Track เมื่อเล่นเพลง
const handlePlay = (station: Station) => {
  // Google Analytics
  if (window.gtag) {
    window.gtag('event', 'play_station', {
      station_name: station.name,
      country: station.country,
    });
  }
  
  // เล่นเพลง...
};

// Track เมื่อเพิ่ม Favorite
const handleAddFavorite = (station: Station) => {
  // Google Analytics
  if (window.gtag) {
    window.gtag('event', 'add_favorite', {
      station_name: station.name,
    });
  }
  
  // เพิ่ม favorite...
};

// Track เมื่อค้นหา
const handleSearch = (query: string) => {
  // Google Analytics
  if (window.gtag) {
    window.gtag('event', 'search', {
      search_term: query,
    });
  }
  
  // ค้นหา...
};
```

---

## 📱 Real-time Users (ผู้ใช้งานตอนนี้)

### Google Analytics:
```
1. ไปที่ https://analytics.google.com
2. เลือก "Realtime" → "Overview"
3. เห็นจำนวนผู้ใช้งานตอนนี้
4. เห็นหน้าที่กำลังดู
5. เห็นประเทศที่เข้ามา
```

### Vercel Analytics:
```
1. ไปที่ Vercel Dashboard
2. เลือกโปรเจกต์ "radio"
3. แท็บ "Analytics"
4. เห็น Real-time data
```

---

## 🎯 สรุป

### แนะนำสำหรับคุณ:

#### ขั้นตอนที่ 1: เปิด Vercel Analytics (ฟรี - 1 คลิก)
```
1. ไปที่ https://vercel.com/jetci/radio
2. แท็บ "Analytics"
3. คลิก "Enable Analytics"
4. เสร็จ!
```

#### ขั้นตอนที่ 2: เพิ่ม Google Analytics (ฟรี - ครบฟีเจอร์)
```
1. สร้าง GA account
2. ได้ Measurement ID
3. เพิ่มใน index.html
4. Push code
5. เสร็จ!
```

---

**ต้องการให้ช่วยติดตั้ง Google Analytics ไหม? ฉันสามารถแก้ไข `index.html` ให้ได้เลย! 🚀**
