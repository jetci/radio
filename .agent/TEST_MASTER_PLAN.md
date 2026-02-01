# 🛡️ J Radio - Master Test Automation Plan

## 1. 🎯 Objective
เพื่อยืนยันว่าแอปพลิเคชัน **J Radio** สามารถใช้งานได้จริงในระดับ Production โดยครอบคลุมทั้ง Functional, Integration และ Error Handling scenarios ผ่านการทดสอบแบบ Automated End-to-End (E2E)

---

## 2. 🛠️ Tech Stack & Tools
*   **Test Framework:** Playwright (รองรับ Modern Web Features, WebGL interaction ได้ดีกว่า)
*   **Language:** TypeScript
*   **Environment:** Local Dev URL (`http://localhost:5173`) & Production Mock

---

## 3. 🧪 Test Scope & Scenarios

### 🟢 Phase 1: Smoke & Critical Path (ความสำคัญสูงสุด)
เป้าหมาย: ตรวจสอบฟังก์ชันพื้นฐานห้ามพัง
1.  **App Bootstrap:**
    *   Verify `WelcomeOverlay` appears on first load.
    *   Verify `LoadingSkeleton` shows/hides correctly.
    *   Verify Main Components mount (`GlobeView`, `Sidebar`, `AudioPlayer`).
2.  **Basic Interaction:**
    *   Click "Get Started" -> Overlay closes.
    *   Station List loads in Sidebar.
    *   Play button toggles state.

### 🟡 Phase 2: Feature-Level E2E
เป้าหมาย: ตรวจสอบฟีเจอร์หลักทำงานถูกต้อง
1.  **Sidebar & Search:**
    *   Search "Thai" -> Result filtered correctly.
    *   Tab switching (Browse -> Stations -> Favorites).
    *   AI Search Mock -> Verify loader and tag filtering.
2.  **Audio Player logic:**
    *   Select Station -> Player bar appears -> Audio source updates.
    *   Volume control affects audio element.
    *   Favorite toggle updates localStorage.
3.  **Globe Visualization:**
    *   Verify WebGL Context exists (Smoke check only).
    *   Clicking sidebar item triggers camera movement (Monitor props change).

### 🟠 Phase 3: State & Context Integration
เป้าหมาย: ตรวจสอบความสัมพันธ์ระหว่าง Component
1.  **Sync Check:** เปลี่ยนภาษา (LanguageContext) -> UI Update.
2.  **Theme Check:** Toggle Dark/Light mode -> CSS classes update.
3.  **Persistency:** Reload page -> Check if Favorites/Settings persist (localStorage).

### 🔴 Phase 4: Error Handling & Resilience
เป้าหมาย: ตรวจสอบความทนทานของแอป
1.  **Network Falure:** Mock `radioApi` return 500/Timeout -> Show Toast/Error UI.
2.  **Empty Data:** Mock empty station list -> Show "No stations found".
3.  **Audio Error:** Mock audio load failure -> Show/Handle error state in player.

---

## 4. 📂 Folder Structure Plan (tests/)
```
tests/
├── e2e/
│   ├── 01-smoke.spec.ts       # Critical Path
│   ├── 02-sidebar.spec.ts     # Search & Filter
│   ├── 03-player.spec.ts      # Audio Logic
│   └── 04-settings.spec.ts    # Theme & Config
├── fixtures/                  # Mock Data
│   ├── stations-mock.json
│   └── ai-response-mock.json
└── utils/                     # Test Helpers
    └── local-storage-helper.ts
```

---

## 5. 📝 Implementation Status

| ID | Test Scenario | Status | Priority |
|----|---------------|--------|----------|
| 01 | App Mount & Overlay | 🔴 Pending | High |
| 02 | Station Search | 🔴 Pending | High |
| 03 | Audio Playback | 🔴 Pending | Critical |
| 04 | AI Search Mock | 🔴 Pending | Medium |
| 05 | Theme Toggle | 🔴 Pending | Low |
| 06 | Network Error | 🔴 Pending | Medium |

---

## 6. 🚀 Next Action
1.  ติดตั้ง/Config Playwright (ถ้ายังไม่มี)
2.  สร้างไฟล์ Test ตาม Structure
3.  รัน Test และรายงานผล
