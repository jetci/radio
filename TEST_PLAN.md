# Test Plan - J Radio UI Enhancements

## Test Date: 2026-01-31
## Tester: AI Assistant

---

## 1. Navigation Bar Position Test

### Test Case 1.1: Nav Bar ไม่ทับ AudioPlayer
**Steps:**
1. เปิดแอป
2. ตรวจสอบตำแหน่ง Navigation Bar
3. ตรวจสอบตำแหน่ง AudioPlayer

**Expected:**
- Navigation Bar: bottom-6 (24px)
- AudioPlayer: bottom-[100px] (100px)
- ไม่ทับกัน

**Status:** ⏳ PENDING

---

## 2. Settings Panel Test

### Test Case 2.1: เปิด Settings ซ่อน AudioPlayer + Nav
**Steps:**
1. คลิกปุ่ม Settings (⚙️)
2. ตรวจสอบว่า AudioPlayer หายไป
3. ตรวจสอบว่า NavigationBar หายไป
4. ตรวจสอบว่า SettingsPanel แสดงเต็มหน้าจอ

**Expected:**
- AudioPlayer: ซ่อน
- NavigationBar: ซ่อน
- SettingsPanel: แสดงเต็มหน้าจอ (z-200)
- ไม่มีการทับซ้อน

**Status:** ⏳ PENDING

### Test Case 2.2: ปิด Settings แสดง AudioPlayer + Nav
**Steps:**
1. คลิก X ปิด Settings
2. ตรวจสอบว่า AudioPlayer กลับมา
3. ตรวจสอบว่า NavigationBar กลับมา

**Expected:**
- AudioPlayer: แสดง
- NavigationBar: แสดง
- SettingsPanel: ซ่อน

**Status:** ⏳ PENDING

---

## 3. Station Position Test

### Test Case 3.1: สถานีแสดงที่ตำแหน่งจริง
**Steps:**
1. Zoom เข้าไปที่ Bangkok
2. ตรวจสอบการกระจายของสถานี
3. ตรวจสอบว่าไม่มีจุดในทะเล

**Expected:**
- สถานีกระจายตามพิกัดจริง
- ไม่เป็นวงกลม
- ไม่มีจุดในทะเล

**Status:** ⏳ PENDING

---

## 4. Active Station Display Test

### Test Case 4.1: Active Station เด่นชัด
**Steps:**
1. เล่นสถานี BKK.FM
2. ตรวจสอบจุดบน Globe

**Expected:**
- สีแดงสด (#ff0000)
- ขนาดใหญ่ (0.25)
- มี Ring animation

**Status:** ⏳ PENDING

---

## 5. Click Station in Settings Test

### Test Case 5.1: คลิกครั้งเดียวเล่นทันที
**Steps:**
1. เปิด Settings
2. คลิกชื่อสถานีครั้งเดียว
3. ตรวจสอบว่าสถานีเล่น
4. ตรวจสอบว่า Globe หมุนไป

**Expected:**
- คลิกครั้งเดียว
- สถานีเล่นทันที
- Globe หมุนไปยังสถานี

**Status:** ⏳ PENDING

---

## 6. Preview Audio Test

### Test Case 6.1: Preview ไม่ทับ Main Audio
**Steps:**
1. เล่นสถานีหลัก
2. เปิด Settings
3. คลิก Preview สถานีอื่น
4. ตรวจสอบว่าสถานีหลักหยุด

**Expected:**
- สถานีหลักหยุด
- Preview เล่น
- ไม่มีเสียงทับกัน

**Status:** ⏳ PENDING

### Test Case 6.2: ปิด Settings เล่นสถานีหลักต่อ
**Steps:**
1. Preview สถานีอยู่
2. ปิด Settings
3. ตรวจสอบว่าสถานีหลักเล่นต่อ

**Expected:**
- Preview หยุด
- สถานีหลักเล่นต่อ

**Status:** ⏳ PENDING

---

## 7. Console Errors Test

### Test Case 7.1: ไม่มี AbortError
**Steps:**
1. เปิด Console
2. เปิด Settings
3. คลิก Preview หลายสถานีติดกัน
4. ตรวจสอบ Console

**Expected:**
- ไม่มี "AbortError"

**Status:** ⏳ PENDING

### Test Case 7.2: ไม่มี favicon 404
**Steps:**
1. เปิด Console
2. ตรวจสอบ Network tab

**Expected:**
- ไม่มี "favicon.ico 404"

**Status:** ⏳ PENDING

---

## 8. No Coordinates Badge Test

### Test Case 8.1: แสดง Badge สถานีไม่มีพิกัด
**Steps:**
1. เปิด Settings
2. แท็บ "ไม่มีพิกัด"
3. คลิกสถานีที่ไม่มีพิกัด
4. ตรวจสอบ CityInfoPanel

**Expected:**
- แสดง badge "ไม่แสดงบน Globe"
- สีส้ม

**Status:** ⏳ PENDING

---

## Summary

**Total Test Cases:** 11
**Passed:** 0
**Failed:** 0
**Pending:** 11

**Overall Status:** ⏳ NOT TESTED YET
