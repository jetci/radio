# 📱 Mobile Testing Guide - TongThin Radio

## 🧪 การทดสอบ Mobile

### 1️⃣ ทดสอบใน Chrome DevTools

**ขั้นตอน:**
```bash
# 1. เปิด Chrome DevTools
F12 หรือ Ctrl+Shift+I

# 2. Toggle Device Toolbar
Ctrl+Shift+M

# 3. ทดสอบหลายขนาดหน้าจอ
- iPhone SE (375x667)
- iPhone 12/13 (390x844)
- iPhone 14 Pro Max (430x932)
- Samsung Galaxy S20 (360x800)
- iPad (768x1024)
- iPad Pro (1024x1366)
```

---

## ✅ Checklist การทดสอบ

### Layout & UI
- [ ] Navigation Bar แสดงถูกต้อง
- [ ] AudioPlayer ไม่ทับกับ elements อื่น
- [ ] Settings Panel เปิด/ปิดได้
- [ ] Globe แสดงเต็มหน้าจอ
- [ ] ข้อความอ่านได้ชัดเจน (ไม่เล็กเกินไป)
- [ ] ปุ่มกดได้ง่าย (ขนาดอย่างน้อย 44x44px)

### Touch Gestures
- [ ] Tap - เลือกสถานี
- [ ] Swipe - ปัดเปลี่ยนหน้า (ถ้ามี)
- [ ] Pinch - Zoom in/out (ถ้ามี)
- [ ] Long press - แสดง context menu (ถ้ามี)

### Performance
- [ ] โหลดเร็ว (< 3 วินาที)
- [ ] Scroll ลื่นไหล
- [ ] Animation ไม่กระตุก
- [ ] ไม่มี lag เมื่อเล่นเพลง

### Orientation
- [ ] Portrait mode ทำงานถูกต้อง
- [ ] Landscape mode ทำงานถูกต้อง
- [ ] หมุนหน้าจอไม่มีปัญหา

---

## 🐛 ปัญหาที่พบบ่อย

### 1. Navigation Bar ทับกับ AudioPlayer

**ปัญหา:**
```
AudioPlayer อยู่ที่ bottom-[100px]
NavigationBar อยู่ที่ bottom-6
→ อาจทับกันบน mobile
```

**วิธีแก้:**
```tsx
// NavigationBar.tsx
// เพิ่ม responsive spacing
className="fixed bottom-6 md:bottom-6 left-6"
```

### 2. Text เล็กเกินไป

**ปัญหา:**
```
Font size 10px-12px อ่านยากบน mobile
```

**วิธีแก้:**
```tsx
// ใช้ responsive font sizes
className="text-xs md:text-sm"
className="text-sm md:text-base"
```

### 3. ปุ่มเล็กเกินไป

**ปัญหา:**
```
ปุ่มขนาด < 44x44px กดยากบน mobile
```

**วิธีแก้:**
```tsx
// เพิ่มขนาด touch target
className="p-3 md:p-2" // มากกว่าบน mobile
```

### 4. Globe ไม่แสดงเต็มหน้าจอ

**ปัญหา:**
```
Globe มี fixed width/height
```

**วิธีแก้:**
```tsx
// ใช้ viewport units
width: 100vw
height: 100vh
```

### 5. Sidebar กว้างเกินไป

**ปัญหา:**
```
Sidebar width: 400px
→ กว้างเกินบน mobile (375px)
```

**วิธีแก้:**
```tsx
// ใช้ responsive width
className="w-full md:max-w-md"
```

---

## 🔧 การแก้ไข Mobile Issues

### แก้ไข NavigationBar

```tsx
// components/NavigationBar.tsx

// Before
<div className="fixed bottom-6 left-6 w-[280px]">

// After
<div className="fixed bottom-20 sm:bottom-6 left-4 sm:left-6 w-[90%] sm:w-[280px] max-w-[280px]">
```

### แก้ไข AudioPlayer

```tsx
// components/AudioPlayer.tsx

// Before
<div className="fixed bottom-[100px] left-6 w-[280px]">

// After
<div className="fixed bottom-24 sm:bottom-[100px] left-4 sm:left-6 w-[90%] sm:w-[280px] max-w-[280px]">
```

### แก้ไข SettingsPanel

```tsx
// components/SettingsPanel.tsx

// Before
<div className="w-full max-w-2xl">

// After
<div className="w-full max-w-2xl mx-4 sm:mx-auto">
```

### แก้ไข Sidebar

```tsx
// components/Sidebar.tsx

// Before
<div className="w-full max-w-md">

// After
<div className="w-full sm:max-w-md">
```

---

## 📱 Responsive Breakpoints

```css
/* Tailwind Breakpoints */
sm: 640px   /* Small tablets */
md: 768px   /* Tablets */
lg: 1024px  /* Laptops */
xl: 1280px  /* Desktops */
2xl: 1536px /* Large desktops */
```

**การใช้งาน:**
```tsx
// Mobile first approach
<div className="text-sm md:text-base lg:text-lg">
  // text-sm: mobile
  // text-base: tablet+
  // text-lg: laptop+
</div>
```

---

## 🎯 Touch Gestures

### เพิ่ม Touch Support

```tsx
// components/GlobeView.tsx

const handleTouchStart = (e: TouchEvent) => {
  // Handle touch start
};

const handleTouchMove = (e: TouchEvent) => {
  // Handle touch move
};

const handleTouchEnd = (e: TouchEvent) => {
  // Handle touch end
};

useEffect(() => {
  const element = globeRef.current;
  if (!element) return;

  element.addEventListener('touchstart', handleTouchStart);
  element.addEventListener('touchmove', handleTouchMove);
  element.addEventListener('touchend', handleTouchEnd);

  return () => {
    element.removeEventListener('touchstart', handleTouchStart);
    element.removeEventListener('touchmove', handleTouchMove);
    element.removeEventListener('touchend', handleTouchEnd);
  };
}, []);
```

---

## 🧪 Testing Checklist

### iPhone SE (375x667) - Smallest
- [ ] ทุก element แสดงครบ
- [ ] ไม่มี horizontal scroll
- [ ] ปุ่มกดได้ทั้งหมด
- [ ] Text อ่านได้

### iPhone 12/13 (390x844) - Standard
- [ ] Layout สมดุล
- [ ] Spacing เหมาะสม
- [ ] Navigation ใช้งานง่าย

### iPhone 14 Pro Max (430x932) - Large
- [ ] ไม่มี empty space มากเกินไป
- [ ] Element ไม่กระจายเกินไป

### iPad (768x1024) - Tablet
- [ ] ใช้ประโยชน์จากพื้นที่ได้ดี
- [ ] ไม่ดูว่างเปล่า
- [ ] Touch target เหมาะสม

---

## 📊 Performance Testing

### Lighthouse Mobile Score

**Target:**
- Performance: 90+
- Accessibility: 90+
- Best Practices: 90+
- SEO: 90+

**วิธีทดสอบ:**
```bash
# 1. เปิด Chrome DevTools
F12

# 2. ไปที่ Lighthouse tab
# 3. เลือก "Mobile"
# 4. คลิก "Generate report"
```

---

## 🔍 Common Issues & Solutions

### Issue 1: Viewport Not Set
```html
<!-- index.html -->
<meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
```

### Issue 2: Text Too Small
```tsx
// ใช้ minimum 14px สำหรับ body text
className="text-sm" // 14px
```

### Issue 3: Tap Targets Too Small
```tsx
// ขนาดขั้นต่ำ 44x44px
className="min-w-[44px] min-h-[44px]"
```

### Issue 4: Horizontal Scroll
```tsx
// ใช้ overflow-x-hidden
className="overflow-x-hidden"
```

### Issue 5: Fixed Elements Overlap
```tsx
// ใช้ z-index และ spacing ที่เหมาะสม
className="z-10 bottom-20 sm:bottom-6"
```

---

## 📝 Testing Report Template

```markdown
## Mobile Testing Report

### Device Tested
- iPhone SE (375x667)
- iPhone 12 (390x844)
- iPad (768x1024)

### Issues Found
1. Navigation Bar ทับ AudioPlayer
   - Severity: High
   - Status: Fixed
   - Solution: เพิ่ม responsive spacing

2. Text เล็กเกินไป
   - Severity: Medium
   - Status: Fixed
   - Solution: เพิ่ม responsive font sizes

### Lighthouse Scores
- Performance: 95/100
- Accessibility: 98/100
- Best Practices: 100/100
- SEO: 100/100

### Recommendations
- เพิ่ม PWA support
- เพิ่ม offline mode
- ปรับปรุง touch gestures
```

---

## 🚀 Quick Fixes

### 1. เพิ่ม Viewport Meta Tag

```html
<!-- index.html -->
<meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
```

### 2. เพิ่ม Touch Action

```css
/* ป้องกัน default touch behaviors */
* {
  touch-action: manipulation;
}
```

### 3. เพิ่ม Safe Area Insets

```css
/* รองรับ iPhone notch */
.bottom-nav {
  padding-bottom: env(safe-area-inset-bottom);
}
```

---

## ✅ Final Checklist

### Before Launch
- [ ] ทดสอบบน iPhone
- [ ] ทดสอบบน Android
- [ ] ทดสอบบน iPad
- [ ] ทดสอบ Portrait & Landscape
- [ ] ทดสอบ Touch gestures
- [ ] ทดสอบ Performance
- [ ] ทดสอบ Offline mode
- [ ] ทดสอบ Audio playback

### Performance
- [ ] Lighthouse score > 90
- [ ] Load time < 3s
- [ ] No layout shifts
- [ ] Smooth animations

### Accessibility
- [ ] Touch targets ≥ 44x44px
- [ ] Text readable (≥ 14px)
- [ ] Contrast ratio ≥ 4.5:1
- [ ] Keyboard accessible

---

**Last Updated:** 2026-02-01  
**Status:** Ready for Testing
