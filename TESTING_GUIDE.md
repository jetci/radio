# 🧪 Testing Guide - J-Radio Application

## 📋 Overview

คู่มือนี้อธิบายวิธีการทดสอบแอปพลิเคชัน J-Radio ทั้งแบบ Manual และ Automated Testing

---

## 🚀 Quick Start

### ติดตั้ง Dependencies

```bash
# Install testing libraries
npm install --save-dev \
  jest \
  @testing-library/react \
  @testing-library/jest-dom \
  @testing-library/user-event \
  @types/jest \
  ts-jest \
  identity-obj-proxy

# Install additional tools
npm install --save-dev \
  @playwright/test \
  eslint-plugin-testing-library \
  eslint-plugin-jest-dom
```

### รัน Tests

```bash
# รัน unit tests ทั้งหมด
npm test

# รัน tests แบบ watch mode
npm run test:watch

# รัน tests พร้อม coverage report
npm run test:coverage

# รัน specific test file
npm test AudioPlayer.test.tsx

# รัน E2E tests (Playwright)
npm run test:e2e
```

---

## 🧪 Unit Testing

### โครงสร้าง Test Files

```
j-radio/
├── __tests__/
│   ├── components/
│   │   ├── AudioPlayer.test.tsx
│   │   ├── Sidebar.test.tsx
│   │   ├── GlobeView.test.tsx
│   │   └── CityInfoPanel.test.tsx
│   ├── hooks/
│   │   ├── useToast.test.ts
│   │   └── useListeningHistory.test.ts
│   ├── services/
│   │   ├── radioApi.test.ts
│   │   └── geminiService.test.ts
│   └── utils/
│       ├── shareStation.test.ts
│       └── cityCluster.test.ts
├── jest.config.js
└── jest.setup.js
```

### ตัวอย่าง Test Case

```typescript
// __tests__/components/AudioPlayer.test.tsx
import { render, screen, fireEvent } from '@testing-library/react';
import AudioPlayer from '../components/AudioPlayer';

describe('AudioPlayer', () => {
  test('renders station name', () => {
    const mockStation = {
      name: 'Test Station',
      // ... other props
    };
    
    render(<AudioPlayer station={mockStation} {...otherProps} />);
    expect(screen.getByText('Test Station')).toBeInTheDocument();
  });

  test('calls onTogglePlay when clicked', () => {
    const mockTogglePlay = jest.fn();
    render(<AudioPlayer onTogglePlay={mockTogglePlay} {...otherProps} />);
    
    const playButton = screen.getByRole('button');
    fireEvent.click(playButton);
    
    expect(mockTogglePlay).toHaveBeenCalledTimes(1);
  });
});
```

### Coverage Goals

| Category | Target | Current |
|----------|--------|---------|
| Statements | 80% | 30% |
| Branches | 75% | 25% |
| Functions | 80% | 30% |
| Lines | 80% | 30% |

---

## 🎭 E2E Testing (Playwright)

### Setup

```bash
# Install Playwright
npm install --save-dev @playwright/test

# Install browsers
npx playwright install
```

### ตัวอย่าง E2E Test

```typescript
// e2e/radio-player.spec.ts
import { test, expect } from '@playwright/test';

test('user can play a radio station', async ({ page }) => {
  await page.goto('http://localhost:3000');
  
  // Wait for loading to complete
  await page.waitForSelector('[data-testid="start-button"]');
  await page.click('[data-testid="start-button"]');
  
  // Click on a station
  await page.click('[data-testid="station-marker"]');
  
  // Verify audio player appears
  await expect(page.locator('[data-testid="audio-player"]')).toBeVisible();
  
  // Click play button
  await page.click('[data-testid="play-button"]');
  
  // Verify playing state
  await expect(page.locator('[data-testid="pause-button"]')).toBeVisible();
});
```

---

## 📱 Manual Testing Checklist

### 1. Core Functionality

#### Audio Playback
- [ ] สามารถเล่นสถานีวิทยุได้
- [ ] สามารถหยุดเล่นได้
- [ ] สามารถเปลี่ยนสถานีได้
- [ ] Volume control ทำงานถูกต้อง
- [ ] แสดง loading state เมื่อกำลังโหลด
- [ ] แสดง error message เมื่อเล่นไม่ได้

#### Globe Interaction
- [ ] สามารถ zoom in/out ได้
- [ ] สามารถหมุน globe ได้
- [ ] สามารถคลิกเลือกสถานีบน globe ได้
- [ ] แสดง hover effect เมื่อเอา mouse ไปวาง
- [ ] Progressive disclosure ทำงานถูกต้อง (แสดงสถานีมากขึ้นเมื่อ zoom in)

#### Search & Filter
- [ ] สามารถค้นหาสถานีได้
- [ ] Filter by genre ทำงานถูกต้อง
- [ ] Filter by country ทำงานถูกต้อง
- [ ] Filter by language ทำงานถูกต้อง
- [ ] Filter by bitrate ทำงานถูกต้อง
- [ ] สามารถ clear filters ได้

#### Favorites & History
- [ ] สามารถเพิ่มสถานีโปรดได้
- [ ] สามารถลบสถานีโปรดได้
- [ ] แสดงประวัติการฟังถูกต้อง
- [ ] สามารถ clear history ได้
- [ ] ข้อมูลถูกบันทึกใน localStorage

#### AI Features
- [ ] AI recommendations ทำงานถูกต้อง
- [ ] AI Journey แนะนำสถานีได้
- [ ] City facts แสดงผลถูกต้อง

### 2. UI/UX

#### Theme
- [ ] สามารถสลับ Dark/Light theme ได้
- [ ] Theme ถูกบันทึกและโหลดกลับมาได้
- [ ] สีและ contrast เหมาะสม

#### Responsive Design
- [ ] แสดงผลถูกต้องบน Desktop (1920x1080)
- [ ] แสดงผลถูกต้องบน Laptop (1366x768)
- [ ] แสดงผลถูกต้องบน Tablet (768x1024)
- [ ] แสดงผลถูกต้องบน Mobile (375x667)
- [ ] Touch gestures ทำงานบน mobile

#### Accessibility
- [ ] สามารถใช้ keyboard navigation ได้
- [ ] Screen reader อ่านข้อความได้
- [ ] Focus indicators ชัดเจน
- [ ] Color contrast เพียงพอ

### 3. Performance

- [ ] Page load time < 3 วินาที
- [ ] Time to Interactive < 5 วินาที
- [ ] Smooth animations (60 FPS)
- [ ] ไม่มี memory leak
- [ ] ไม่มี console errors

### 4. Error Handling

- [ ] แสดง error message เมื่อ API ล้มเหลว
- [ ] แสดง error message เมื่อ network ขาด
- [ ] Error Boundary จับ errors ได้
- [ ] สามารถ recover จาก errors ได้

### 5. Browser Compatibility

- [ ] Chrome (latest)
- [ ] Firefox (latest)
- [ ] Safari (latest)
- [ ] Edge (latest)
- [ ] Mobile Safari (iOS)
- [ ] Mobile Chrome (Android)

---

## 🔍 Testing Best Practices

### 1. Test Naming Convention

```typescript
// ❌ Bad
test('test1', () => {});

// ✅ Good
test('renders station name when station prop is provided', () => {});
test('calls onTogglePlay when play button is clicked', () => {});
test('shows error message when API fails', () => {});
```

### 2. Arrange-Act-Assert Pattern

```typescript
test('adds station to favorites', () => {
  // Arrange
  const mockStation = createMockStation();
  const mockOnToggleFavorite = jest.fn();
  
  // Act
  render(<AudioPlayer station={mockStation} onToggleFavorite={mockOnToggleFavorite} />);
  fireEvent.click(screen.getByTestId('favorite-button'));
  
  // Assert
  expect(mockOnToggleFavorite).toHaveBeenCalledWith(mockStation);
});
```

### 3. Test Data Factories

```typescript
// utils/testHelpers.ts
export const createMockStation = (overrides = {}): Station => ({
  stationuuid: 'test-uuid',
  name: 'Test Station',
  country: 'Test Country',
  bitrate: 128,
  // ... default values
  ...overrides
});

// Usage
const station = createMockStation({ name: 'Custom Name' });
```

### 4. Mock External Dependencies

```typescript
// Mock API calls
jest.mock('../services/radioApi', () => ({
  radioApi: {
    getAllStations: jest.fn().mockResolvedValue([mockStation1, mockStation2]),
    searchStations: jest.fn().mockResolvedValue([])
  }
}));

// Mock localStorage
const localStorageMock = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  clear: jest.fn()
};
global.localStorage = localStorageMock as any;
```

---

## 📊 Coverage Reports

### Generate Coverage Report

```bash
npm run test:coverage
```

### View Coverage Report

```bash
# Open in browser
open coverage/lcov-report/index.html
```

### Coverage Thresholds

```javascript
// jest.config.js
coverageThreshold: {
  global: {
    branches: 75,
    functions: 80,
    lines: 80,
    statements: 80
  }
}
```

---

## 🐛 Debugging Tests

### Debug in VS Code

```json
// .vscode/launch.json
{
  "type": "node",
  "request": "launch",
  "name": "Jest Debug",
  "program": "${workspaceFolder}/node_modules/.bin/jest",
  "args": ["--runInBand", "--no-cache"],
  "console": "integratedTerminal",
  "internalConsoleOptions": "neverOpen"
}
```

### Debug Specific Test

```bash
# Run with --verbose
npm test -- --verbose AudioPlayer.test.tsx

# Run with debugger
node --inspect-brk node_modules/.bin/jest --runInBand
```

---

## 🚀 CI/CD Integration

### GitHub Actions

```yaml
# .github/workflows/test.yml
name: Tests
on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - uses: actions/setup-node@v2
        with:
          node-version: '18'
      - run: npm ci
      - run: npm test -- --coverage
      - uses: codecov/codecov-action@v2
```

---

## 📝 Test Documentation

### Document Complex Tests

```typescript
/**
 * Tests the audio playback flow:
 * 1. User clicks play button
 * 2. Audio element starts loading
 * 3. Loading state is shown
 * 4. Audio starts playing
 * 5. Playing state is shown
 */
test('complete audio playback flow', async () => {
  // Test implementation
});
```

---

## 🎯 Testing Priorities

### High Priority (Must Test)
1. Audio playback functionality
2. Station selection
3. API error handling
4. Data persistence (favorites, history)

### Medium Priority (Should Test)
1. Search and filtering
2. Theme switching
3. Responsive design
4. AI features

### Low Priority (Nice to Test)
1. Animations
2. Edge cases
3. Performance optimizations

---

## 📞 Support

หากมีปัญหาเกี่ยวกับการทดสอบ:

1. ตรวจสอบ [Jest Documentation](https://jestjs.io/)
2. ตรวจสอบ [Testing Library Docs](https://testing-library.com/)
3. ดู [Playwright Documentation](https://playwright.dev/)
4. สร้าง issue บน GitHub

---

**Last Updated**: January 31, 2026  
**Version**: 1.0.0
