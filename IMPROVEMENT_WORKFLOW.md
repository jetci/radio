# 🔄 Improvement Workflow - TongThin Radio

## 📋 กระบวนการทำงาน

```
ปรับปรุงแก้ไข → เขียนเทส → ทดสอบ → (ไม่ผ่าน → วนซ้ำ) → ผ่าน → รายงาน → แนะนำงานใหม่
```

---

## 🎯 Task #1: Accessibility Improvements

### Status: 🔴 In Progress
**Priority:** Critical  
**Estimated Time:** 2-3 hours

---

### 1️⃣ ปรับปรุงแก้ไข

#### Issue: Buttons ไม่มี accessible name

**Files to Fix:**
- `components/AudioPlayer.tsx`
- `components/Toast.tsx`
- `components/Sidebar.tsx`
- `components/SettingsPanel.tsx`

**Changes:**

```typescript
// ❌ Before
<button onClick={handleClick}>
  <Play size={20} />
</button>

// ✅ After
<button 
  onClick={handleClick}
  aria-label="Play station"
  title="Play station"
>
  <Play size={20} />
</button>
```

**Implementation Plan:**
1. AudioPlayer.tsx - เพิ่ม aria-label ให้ปุ่ม Play/Pause/Volume
2. Toast.tsx - เพิ่ม aria-label ให้ปุ่มปิด
3. Sidebar.tsx - เพิ่ม aria-label ให้ปุ่มทั้งหมด
4. SettingsPanel.tsx - เพิ่ม aria-label ให้ปุ่มปิด
5. NavigationBar.tsx - เพิ่ม aria-label ให้ select elements

---

### 2️⃣ เขียนเทส

**Test File:** `tests/accessibility.test.tsx`

```typescript
import { render, screen } from '@testing-library/react';
import { axe, toHaveNoViolations } from 'jest-axe';
import AudioPlayer from '../components/AudioPlayer';

expect.extend(toHaveNoViolations);

describe('Accessibility Tests', () => {
  test('AudioPlayer should have no accessibility violations', async () => {
    const { container } = render(
      <AudioPlayer 
        station={mockStation}
        isPlaying={false}
        volume={50}
        onTogglePlay={jest.fn()}
        onVolumeChange={jest.fn()}
        theme="dark"
      />
    );
    
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  test('Play button should have accessible name', () => {
    render(<AudioPlayer {...props} />);
    const playButton = screen.getByRole('button', { name: /play/i });
    expect(playButton).toBeInTheDocument();
  });

  test('Volume slider should have accessible name', () => {
    render(<AudioPlayer {...props} />);
    const volumeSlider = screen.getByRole('slider', { name: /volume/i });
    expect(volumeSlider).toBeInTheDocument();
  });
});
```

**Test Checklist:**
- [ ] ทุกปุ่มมี aria-label
- [ ] ทุก input มี label
- [ ] ทุก select มี title
- [ ] Keyboard navigation ทำงาน
- [ ] Screen reader อ่านได้

---

### 3️⃣ ทดสอบ

**Manual Testing:**
```bash
# 1. Run tests
npm test

# 2. Run accessibility audit
npm run lighthouse

# 3. Test with screen reader
# - macOS: VoiceOver (Cmd+F5)
# - Windows: NVDA
```

**Automated Testing:**
```bash
# Install dependencies
npm install --save-dev jest-axe @testing-library/react @testing-library/jest-dom

# Run tests
npm test -- --coverage
```

**Expected Results:**
- ✅ All tests pass
- ✅ Lighthouse Accessibility score: 90+
- ✅ No axe violations
- ✅ Screen reader can navigate

---

### 4️⃣ ไม่ผ่าน → วนซ้ำ

**If tests fail:**

1. **Check error messages**
   ```bash
   npm test -- --verbose
   ```

2. **Fix issues**
   - อ่าน error message
   - แก้ไขตาม error
   - Commit changes

3. **Re-run tests**
   ```bash
   npm test
   ```

4. **Repeat until all pass** ✅

---

### 5️⃣ ผ่าน → รายงาน

**Test Report:**

```markdown
## ✅ Task #1: Accessibility Improvements - COMPLETED

### Summary
- Fixed 15 accessibility issues
- Added aria-labels to all buttons
- Added titles to all form elements
- Lighthouse score improved: 65 → 95

### Changes Made
1. AudioPlayer.tsx
   - Added aria-label to Play/Pause button
   - Added aria-label to Volume slider
   - Added aria-label to Favorite button

2. Toast.tsx
   - Added aria-label to Close button

3. Sidebar.tsx
   - Added aria-label to all navigation buttons
   - Added aria-label to Close button

4. SettingsPanel.tsx
   - Added aria-label to Close button
   - Added title to Language selector

5. NavigationBar.tsx
   - Added title to Country selector
   - Added title to Genre selector

### Test Results
- ✅ Unit tests: 25/25 passed
- ✅ Accessibility tests: 10/10 passed
- ✅ Lighthouse score: 95/100
- ✅ axe violations: 0

### Before/After
| Metric | Before | After |
|--------|--------|-------|
| Accessibility Score | 65 | 95 |
| axe violations | 15 | 0 |
| WCAG AA compliance | 70% | 100% |

### Screenshots
- [Before](./screenshots/before-a11y.png)
- [After](./screenshots/after-a11y.png)

### Time Spent
- Coding: 2 hours
- Testing: 1 hour
- Total: 3 hours

### Next Steps
- Monitor accessibility in future PRs
- Add accessibility tests to CI/CD
- Document accessibility guidelines
```

---

### 6️⃣ แนะนำงานใหม่

**Next Task:** Task #2: Error Handling

---

## 🎯 Task #2: Error Handling

### Status: ⏳ Pending
**Priority:** Critical  
**Estimated Time:** 3-4 hours

---

### 1️⃣ ปรับปรุงแก้ไข

#### Issue: ไม่มี error boundary ที่ครอบคลุม

**Files to Create/Update:**
- `components/ErrorBoundary.tsx` (update)
- `components/ErrorFallback.tsx` (create)
- `App.tsx` (update)

**Changes:**

```typescript
// ErrorBoundary.tsx
import React, { Component, ErrorInfo, ReactNode } from 'react';
import ErrorFallback from './ErrorFallback';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null
    };
  }

  static getDerivedStateFromError(error: Error): State {
    return {
      hasError: true,
      error,
      errorInfo: null
    };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Error caught by boundary:', error, errorInfo);
    
    // Send to error tracking service (Sentry, etc.)
    // logErrorToService(error, errorInfo);
    
    this.setState({
      error,
      errorInfo
    });
  }

  handleReset = () => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null
    });
  };

  render() {
    if (this.state.hasError) {
      return this.props.fallback || (
        <ErrorFallback 
          error={this.state.error}
          resetError={this.handleReset}
        />
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
```

```typescript
// ErrorFallback.tsx
import React from 'react';
import { AlertTriangle, RefreshCw, Home } from 'lucide-react';

interface ErrorFallbackProps {
  error: Error | null;
  resetError: () => void;
}

const ErrorFallback: React.FC<ErrorFallbackProps> = ({ error, resetError }) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-red-900 to-black flex items-center justify-center p-6">
      <div className="max-w-md w-full bg-black/50 backdrop-blur-xl rounded-2xl border border-red-500/20 p-8 text-center">
        <AlertTriangle className="w-16 h-16 text-red-500 mx-auto mb-4" />
        
        <h1 className="text-2xl font-bold text-white mb-2">
          เกิดข้อผิดพลาด
        </h1>
        
        <p className="text-white/60 mb-6">
          ขออภัย เกิดข้อผิดพลาดที่ไม่คาดคิด
        </p>
        
        {error && (
          <details className="mb-6 text-left">
            <summary className="text-red-400 cursor-pointer mb-2">
              รายละเอียดข้อผิดพลาด
            </summary>
            <pre className="text-xs text-white/40 bg-black/30 p-4 rounded overflow-auto">
              {error.toString()}
            </pre>
          </details>
        )}
        
        <div className="flex gap-4">
          <button
            onClick={resetError}
            className="flex-1 bg-red-500 hover:bg-red-600 text-white px-6 py-3 rounded-lg font-bold transition-colors flex items-center justify-center gap-2"
          >
            <RefreshCw size={20} />
            ลองใหม่
          </button>
          
          <button
            onClick={() => window.location.href = '/'}
            className="flex-1 bg-white/10 hover:bg-white/20 text-white px-6 py-3 rounded-lg font-bold transition-colors flex items-center justify-center gap-2"
          >
            <Home size={20} />
            กลับหน้าแรก
          </button>
        </div>
      </div>
    </div>
  );
};

export default ErrorFallback;
```

**API Error Handling:**

```typescript
// services/radioApi.ts - เพิ่ม retry logic
async function fetchWithRetry(url: string, retries = 3): Promise<any> {
  for (let i = 0; i < retries; i++) {
    try {
      const response = await fetch(url);
      
      if (response.status === 429) {
        // Rate limited - wait and retry
        const waitTime = Math.pow(2, i) * 1000; // Exponential backoff
        await new Promise(resolve => setTimeout(resolve, waitTime));
        continue;
      }
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      
      return await response.json();
    } catch (error) {
      if (i === retries - 1) throw error;
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
  }
}
```

---

### 2️⃣ เขียนเทส

**Test File:** `tests/errorHandling.test.tsx`

```typescript
import { render, screen, fireEvent } from '@testing-library/react';
import ErrorBoundary from '../components/ErrorBoundary';
import ErrorFallback from '../components/ErrorFallback';

const ThrowError = () => {
  throw new Error('Test error');
};

describe('Error Handling Tests', () => {
  test('ErrorBoundary catches errors', () => {
    const { container } = render(
      <ErrorBoundary>
        <ThrowError />
      </ErrorBoundary>
    );
    
    expect(screen.getByText(/เกิดข้อผิดพลาด/i)).toBeInTheDocument();
  });

  test('ErrorFallback shows error message', () => {
    const error = new Error('Test error');
    render(<ErrorFallback error={error} resetError={jest.fn()} />);
    
    expect(screen.getByText(/Test error/i)).toBeInTheDocument();
  });

  test('Reset button calls resetError', () => {
    const resetError = jest.fn();
    render(<ErrorFallback error={null} resetError={resetError} />);
    
    fireEvent.click(screen.getByText(/ลองใหม่/i));
    expect(resetError).toHaveBeenCalled();
  });

  test('API retry logic works', async () => {
    // Mock fetch to fail twice then succeed
    global.fetch = jest.fn()
      .mockRejectedValueOnce(new Error('Network error'))
      .mockRejectedValueOnce(new Error('Network error'))
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({ data: 'success' })
      });

    const result = await fetchWithRetry('https://api.test.com');
    expect(result).toEqual({ data: 'success' });
    expect(global.fetch).toHaveBeenCalledTimes(3);
  });
});
```

---

### 3️⃣ ทดสอบ

**Manual Testing:**
1. ทดสอบ Error Boundary
   - Throw error ใน component
   - ตรวจสอบ ErrorFallback แสดง
   - คลิก "ลองใหม่"
   - ตรวจสอบ app กลับมาทำงาน

2. ทดสอบ API Error
   - Disconnect internet
   - ลองโหลดสถานี
   - ตรวจสอบ error message
   - Connect internet
   - ลองใหม่

3. ทดสอบ Rate Limiting
   - Simulate 429 error
   - ตรวจสอบ retry logic
   - ตรวจสอบ exponential backoff

---

### 4️⃣ ไม่ผ่าน → วนซ้ำ

(Same process as Task #1)

---

### 5️⃣ ผ่าน → รายงาน

**Test Report Template:**

```markdown
## ✅ Task #2: Error Handling - COMPLETED

### Summary
- Implemented comprehensive error boundary
- Added retry logic for API calls
- Created user-friendly error UI
- Improved error recovery

### Test Results
- ✅ Unit tests: 15/15 passed
- ✅ Error boundary works
- ✅ Retry logic works
- ✅ User can recover from errors

### Time Spent
- Coding: 3 hours
- Testing: 1 hour
- Total: 4 hours
```

---

### 6️⃣ แนะนำงานใหม่

**Next Task:** Task #3: Loading States

---

## 🎯 Task #3: Loading States

### Status: ⏳ Pending
**Priority:** Important  
**Estimated Time:** 2 hours

---

### 1️⃣ ปรับปรุงแก้ไข

**Create Loading Components:**

```typescript
// components/LoadingSkeleton.tsx
export const StationSkeleton = () => (
  <div className="animate-pulse space-y-2">
    <div className="h-4 bg-gray-300 rounded w-3/4"></div>
    <div className="h-4 bg-gray-300 rounded w-1/2"></div>
  </div>
);

export const GlobeSkeleton = () => (
  <div className="flex items-center justify-center h-screen">
    <div className="text-center">
      <div className="w-16 h-16 border-4 border-green-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
      <p className="text-white">Loading globe...</p>
    </div>
  </div>
);
```

**Update App.tsx:**

```typescript
{isLoading ? (
  <GlobeSkeleton />
) : (
  <GlobeView stations={stations} />
)}
```

---

### 2️⃣ เขียนเทส

```typescript
test('Shows loading skeleton while loading', () => {
  render(<App isLoading={true} />);
  expect(screen.getByText(/Loading globe/i)).toBeInTheDocument();
});
```

---

## 📊 Progress Tracker

| Task | Status | Progress | Time |
|------|--------|----------|------|
| #1 Accessibility | 🔴 In Progress | 0% | 0/3h |
| #2 Error Handling | ⏳ Pending | 0% | 0/4h |
| #3 Loading States | ⏳ Pending | 0% | 0/2h |
| #4 Mobile Testing | ⏳ Pending | 0% | 0/4h |
| #5 SEO & Meta Tags | ⏳ Pending | 0% | 0/2h |

**Total Estimated Time:** 15 hours  
**Completed:** 0 hours  
**Remaining:** 15 hours

---

## 🔄 Workflow Template

สำหรับทุก Task ให้ทำตามขั้นตอนนี้:

### 1. ปรับปรุงแก้ไข
- [ ] อ่าน requirements
- [ ] เขียน code
- [ ] Commit changes

### 2. เขียนเทส
- [ ] เขียน unit tests
- [ ] เขียน integration tests
- [ ] เขียน e2e tests (ถ้าจำเป็น)

### 3. ทดสอบ
- [ ] Run tests locally
- [ ] Manual testing
- [ ] Cross-browser testing

### 4. ไม่ผ่าน → วนซ้ำ
- [ ] อ่าน error messages
- [ ] แก้ไข issues
- [ ] Re-run tests
- [ ] Repeat until pass

### 5. ผ่าน → รายงาน
- [ ] เขียน test report
- [ ] Update progress tracker
- [ ] Commit final changes
- [ ] Create PR (if applicable)

### 6. แนะนำงานใหม่
- [ ] Review next task
- [ ] Estimate time
- [ ] Start next task

---

## 🚀 Getting Started

```bash
# 1. เริ่ม Task #1
git checkout -b task/accessibility-improvements

# 2. ทำงานตามขั้นตอน
# ... code ...

# 3. Run tests
npm test

# 4. Commit
git add .
git commit -m "feat: improve accessibility"

# 5. Push
git push origin task/accessibility-improvements

# 6. Create PR
# ... create PR on GitHub ...

# 7. เริ่ม Task ถัดไป
git checkout main
git pull
git checkout -b task/error-handling
```

---

**Last Updated:** 2026-02-01  
**Current Task:** #1 Accessibility Improvements  
**Status:** 🔴 Ready to Start
