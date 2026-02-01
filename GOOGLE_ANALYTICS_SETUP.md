# 📊 Google Analytics Setup Instructions

## ✅ ขั้นตอนที่ 1: สร้าง Google Analytics Account (ทำเอง)

### 1. ไปที่ Google Analytics
```
https://analytics.google.com
```

### 2. สร้าง Account
```
1. คลิก "Start measuring" หรือ "Get started"
2. Account name: TongThin Radio
3. คลิก "Next"
```

### 3. สร้าง Property
```
1. Property name: TongThin Radio
2. Reporting time zone: (GMT+07:00) Bangkok
3. Currency: Thai Baht (THB)
4. คลิก "Next"
```

### 4. Business Information
```
1. Industry: Entertainment
2. Business size: Small
3. How you plan to use Google Analytics: เลือกตามต้องการ
4. คลิก "Create"
```

### 5. เลือก Platform
```
เลือก: Web
```

### 6. Set up Data Stream
```
1. Website URL: https://radio.vercel.app (หรือ URL ที่คุณได้)
2. Stream name: TongThin Radio
3. คลิก "Create stream"
```

### 7. คัดลอก Measurement ID
```
คุณจะเห็น:
Measurement ID: G-XXXXXXXXXX

⚠️ คัดลอก ID นี้ไว้!
```

---

## ✅ ขั้นตอนที่ 2: แทนที่ Measurement ID ในโค้ด

### ไฟล์ที่ต้องแก้: `index.html`

ฉันได้เพิ่ม Google Analytics code ไว้แล้วที่บรรทัด 40-46

**คุณต้องแทนที่ `G-XXXXXXXXXX` ด้วย Measurement ID จริงของคุณ (2 ที่)**

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

**เปลี่ยนเป็น:**

```html
<!-- Google Analytics -->
<script async src="https://www.googletagmanager.com/gtag/js?id=G-ABC123DEF456"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'G-ABC123DEF456');
</script>
```

*(แทนที่ G-ABC123DEF456 ด้วย ID จริงของคุณ)*

---

## ✅ ขั้นตอนที่ 3: Push Code ขึ้น GitHub

```bash
# ใน terminal
git add index.html
git commit -m "Add Google Analytics tracking"
git push
```

---

## ✅ ขั้นตอนที่ 4: รอ Vercel Auto-Deploy

```
1. Vercel จะ detect การ push อัตโนมัติ
2. รอ 1-2 นาที
3. Deploy สำเร็จ!
```

---

## ✅ ขั้นตอนที่ 5: ทดสอบ

### 1. เปิดแอปของคุณ
```
https://radio.vercel.app
```

### 2. ดู Real-time ใน Google Analytics
```
1. ไปที่ https://analytics.google.com
2. เลือก Property "TongThin Radio"
3. คลิก "Reports" → "Realtime"
4. คุณควรเห็นตัวเอง (1 user) ในแผนที่
```

---

## 📊 ข้อมูลที่จะได้

### Real-time Reports
```
✅ ผู้ใช้งานตอนนี้ (Active users now)
✅ หน้าที่กำลังดู (Page views)
✅ ประเทศที่เข้ามา (Countries)
✅ เมือง (Cities)
✅ อุปกรณ์ (Devices)
```

### Overview Reports (24 ชั่วโมงหลัง)
```
✅ Users (ผู้ใช้งานทั้งหมด)
✅ Sessions (จำนวน sessions)
✅ Bounce rate (อัตราตีกลับ)
✅ Average engagement time (เวลาเฉลี่ยที่อยู่)
✅ Event count (จำนวน events)
```

### Acquisition Reports
```
✅ Traffic sources (มาจากไหน)
  - Direct (พิมพ์ URL เอง)
  - Organic Search (Google, Bing)
  - Social (Facebook, Twitter)
  - Referral (เว็บอื่นลิงก์มา)
```

### Engagement Reports
```
✅ Pages and screens (หน้าที่ได้รับความนิยม)
✅ Events (การกระทำของผู้ใช้)
✅ Conversions (เป้าหมายที่สำเร็จ)
```

### Demographics
```
✅ Countries (ประเทศ)
✅ Cities (เมือง)
✅ Languages (ภาษา)
```

### Tech
```
✅ Platforms (Desktop/Mobile/Tablet)
✅ Operating systems (Windows, macOS, iOS, Android)
✅ Browsers (Chrome, Safari, Firefox, Edge)
✅ Screen resolutions
```

---

## 🎯 Custom Events (ขั้นสูง - Optional)

ถ้าต้องการติดตามการใช้งานเฉพาะ เช่น:
- เล่นเพลง
- เพิ่ม Favorite
- ค้นหาสถานี

บอกฉันได้ ฉันจะเพิ่ม Custom Events ให้!

---

## 🔍 วิธีดูข้อมูล

### Real-time (ดูตอนนี้)
```
1. ไปที่ https://analytics.google.com
2. เลือก Property "TongThin Radio"
3. คลิก "Reports" → "Realtime"
4. เห็นผู้ใช้งานตอนนี้
```

### Overview (ภาพรวม)
```
1. คลิก "Reports" → "Overview"
2. เห็นข้อมูล 7 วันย้อนหลัง
3. สามารถเปลี่ยนช่วงเวลาได้
```

### Detailed Reports (รายละเอียด)
```
1. คลิก "Reports" → เลือกหัวข้อที่ต้องการ
2. Acquisition → Traffic acquisition
3. Engagement → Pages and screens
4. Demographics → User attributes
5. Tech → Tech details
```

---

## ⚠️ สิ่งที่ต้องจำ

### 1. ใช้เวลา 24-48 ชั่วโมง
```
ข้อมูลจะเริ่มแสดงใน Reports หลังจาก 24-48 ชั่วโมง
แต่ Real-time จะเห็นทันที!
```

### 2. Privacy
```
Google Analytics เก็บข้อมูล:
✅ IP address (anonymized)
✅ Browser & device info
✅ Page views
✅ User behavior

❌ ไม่เก็บข้อมูลส่วนตัว (ชื่อ, email, etc.)
```

### 3. GDPR Compliance
```
ถ้าต้องการให้ compliant กับ GDPR:
- เพิ่ม Cookie consent banner
- เพิ่ม Privacy Policy
- ให้ผู้ใช้ opt-out ได้
```

---

## 📱 Google Analytics App (Optional)

### ดูข้อมูลบนมือถือ:
```
1. Download: Google Analytics app
   - iOS: App Store
   - Android: Play Store
2. Login ด้วย Google account
3. เลือก Property "TongThin Radio"
4. ดูข้อมูล Real-time บนมือถือได้!
```

---

## 🎉 สรุป

### Checklist:
- [ ] สร้าง Google Analytics account
- [ ] ได้ Measurement ID (G-XXXXXXXXXX)
- [ ] แทนที่ ID ใน index.html (2 ที่)
- [ ] Push code ขึ้น GitHub
- [ ] รอ Vercel deploy (1-2 นาที)
- [ ] ทดสอบ Real-time
- [ ] เห็นตัวเองใน Real-time reports
- [ ] เสร็จ! 🎉

---

**ถ้าติดขัดตรงไหน บอกได้เลย! 🚀**
