# 🌍 Multi-Language Implementation Guide

## ✅ สิ่งที่ทำเสร็จแล้ว

### 1. Translation Files
- ✅ `locales/th.json` - ภาษาไทย
- ✅ `locales/en.json` - ภาษาอังกฤษ

### 2. Language Context
- ✅ `contexts/LanguageContext.tsx` - Context สำหรับจัดการภาษา
- ✅ เพิ่ม `LanguageProvider` ใน `index.tsx`

---

## 📝 วิธีใช้งาน

### 1. ใน Component

```typescript
import { useLanguage } from '../contexts/LanguageContext';

const MyComponent = () => {
  const { t, language, setLanguage } = useLanguage();
  
  return (
    <div>
      <h1>{t('welcome.title')}</h1>
      <p>{t('welcome.subtitle')}</p>
      
      {/* Language Selector */}
      <select value={language} onChange={(e) => setLanguage(e.target.value as 'th' | 'en')}>
        <option value="th">ไทย</option>
        <option value="en">English</option>
      </select>
    </div>
  );
};
```

### 2. Translation Keys

```typescript
// ใช้ dot notation
t('common.loading')        // "กำลังโหลด..." (TH) | "Loading..." (EN)
t('navigation.explore')    // "สำรวจ" (TH) | "Explore" (EN)
t('player.nowPlaying')     // "กำลังเล่น" (TH) | "Now Playing" (EN)
```

---

## 🔧 Components ที่ต้องแปลง

### ✅ Priority 1 (ทำก่อน)

#### 1. WelcomeOverlay.tsx
```typescript
// Before
<h1>ยินดีต้อนรับสู่ J-Radio</h1>

// After
<h1>{t('welcome.title')}</h1>
```

#### 2. NavigationBar.tsx
```typescript
// Before
<button title="สำรวจ">...</button>

// After
<button title={t('navigation.explore')}>...</button>
```

#### 3. AudioPlayer.tsx
```typescript
// Before
<span>กำลังเล่น</span>

// After
<span>{t('player.nowPlaying')}</span>
```

#### 4. SettingsPanel.tsx
```typescript
// Before
<h2>ตั้งค่า</h2>

// After  
<h2>{t('settings.title')}</h2>

// เพิ่ม Language Selector
<div>
  <label>{t('settings.language')}</label>
  <select value={language} onChange={(e) => setLanguage(e.target.value as 'th' | 'en')}>
    <option value="th">ไทย (Thai)</option>
    <option value="en">English</option>
  </select>
</div>
```

### ⏳ Priority 2 (ทำทีหลัง)

- Sidebar.tsx
- CityInfoPanel.tsx
- ConfirmDialog.tsx
- Toast.tsx

---

## 📋 Checklist

### Phase 1: Core Components
- [ ] WelcomeOverlay - แปลข้อความต้อนรับ
- [ ] NavigationBar - แปลปุ่มเมนู
- [ ] AudioPlayer - แปลสถานะเล่น
- [ ] SettingsPanel - เพิ่ม Language Selector

### Phase 2: Secondary Components
- [ ] Sidebar - แปลเมนู
- [ ] CityInfoPanel - แปลข้อมูลเมือง
- [ ] ConfirmDialog - แปลข้อความยืนยัน
- [ ] Toast - แปลข้อความแจ้งเตือน

### Phase 3: Testing
- [ ] ทดสอบสลับภาษา TH → EN
- [ ] ทดสอบสลับภาษา EN → TH
- [ ] ทดสอบ localStorage (บันทึกภาษา)
- [ ] ทดสอบ auto-detect ภาษาจาก browser

---

## 🎨 Language Selector UI

### Option 1: Dropdown (แนะนำ)
```typescript
<select 
  value={language} 
  onChange={(e) => setLanguage(e.target.value as 'th' | 'en')}
  className="px-3 py-2 rounded-lg border"
>
  <option value="th">🇹🇭 ไทย</option>
  <option value="en">🇬🇧 English</option>
</select>
```

### Option 2: Toggle Buttons
```typescript
<div className="flex gap-2">
  <button 
    onClick={() => setLanguage('th')}
    className={language === 'th' ? 'active' : ''}
  >
    🇹🇭 ไทย
  </button>
  <button 
    onClick={() => setLanguage('en')}
    className={language === 'en' ? 'active' : ''}
  >
    🇬🇧 English
  </button>
</div>
```

### Option 3: Icon Toggle
```typescript
<button onClick={() => setLanguage(language === 'th' ? 'en' : 'th')}>
  {language === 'th' ? '🇹🇭' : '🇬🇧'}
</button>
```

---

## 🚀 Quick Start

### 1. เพิ่ม Language Selector ใน SettingsPanel

```typescript
// SettingsPanel.tsx
import { useLanguage } from '../contexts/LanguageContext';

const SettingsPanel = () => {
  const { t, language, setLanguage } = useLanguage();
  
  return (
    <div>
      <h2>{t('settings.title')}</h2>
      
      {/* Language Selector */}
      <div className="mb-4">
        <label className="block mb-2">{t('settings.language')}</label>
        <select 
          value={language} 
          onChange={(e) => setLanguage(e.target.value as 'th' | 'en')}
          className="w-full px-3 py-2 rounded-lg border"
        >
          <option value="th">🇹🇭 ไทย (Thai)</option>
          <option value="en">🇬🇧 English</option>
        </select>
      </div>
    </div>
  );
};
```

### 2. แปลง WelcomeOverlay

```typescript
// WelcomeOverlay.tsx
import { useLanguage } from '../contexts/LanguageContext';

const WelcomeOverlay = () => {
  const { t } = useLanguage();
  
  return (
    <div>
      <h1>{t('welcome.title')}</h1>
      <p>{t('welcome.subtitle')}</p>
      <button>{t('welcome.startButton')}</button>
    </div>
  );
};
```

### 3. แปลง NavigationBar

```typescript
// NavigationBar.tsx
import { useLanguage } from '../contexts/LanguageContext';

const NavigationBar = () => {
  const { t } = useLanguage();
  
  return (
    <div>
      <button title={t('navigation.explore')}>...</button>
      <button title={t('navigation.favorites')}>...</button>
      <button title={t('navigation.browse')}>...</button>
      <button title={t('navigation.search')}>...</button>
      <button title={t('navigation.settings')}>...</button>
    </div>
  );
};
```

---

## 📦 เพิ่มภาษาใหม่ (Phase 2)

### 1. สร้างไฟล์ translation
```bash
# สร้างไฟล์ใหม่
locales/ja.json  # ญี่ปุ่น
locales/zh.json  # จีน
locales/ko.json  # เกาหลี
locales/es.json  # สเปน
locales/fr.json  # ฝรั่งเศส
```

### 2. เพิ่มใน LanguageContext
```typescript
import ja from '../locales/ja.json';
import zh from '../locales/zh.json';

type Language = 'th' | 'en' | 'ja' | 'zh' | 'ko' | 'es' | 'fr';

const translations = {
  th,
  en,
  ja,
  zh,
  ko,
  es,
  fr
};
```

### 3. เพิ่มใน Language Selector
```typescript
<option value="ja">🇯🇵 日本語</option>
<option value="zh">🇨🇳 中文</option>
<option value="ko">🇰🇷 한국어</option>
<option value="es">🇪🇸 Español</option>
<option value="fr">🇫🇷 Français</option>
```

---

## 🎯 Next Steps

1. ✅ เพิ่ม Language Selector ใน SettingsPanel
2. ✅ แปลง WelcomeOverlay
3. ✅ แปลง NavigationBar
4. ✅ แปลง AudioPlayer
5. ⏳ ทดสอบการสลับภาษา
6. ⏳ แปลง components อื่นๆ

---

**Last Updated:** 2026-02-01
**Status:** Ready to implement
