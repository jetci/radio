# J Radio - Improvement Test Plan

## Priority 1: City Info Panel & AI Journey

### Test Case 1: City Info Panel Display
**Objective:** Verify that CityInfoPanel displays correctly when a station is selected

**Steps:**
1. Start the application
2. Click "Connect Audio" on the start overlay
3. Select any station from the globe
4. Verify City Info Panel appears in bottom-left corner

**Expected Results:**
- ✅ Panel shows city name and country
- ✅ Local time updates every second
- ✅ Station count is accurate
- ✅ AI-generated city fact loads (or shows loading state)
- ✅ Coordinates are displayed correctly
- ✅ Close button (X) works and hides the panel

**Test Data:**
- Test with stations from different countries
- Test with stations that have state/city information
- Test with stations that only have country information

---

### Test Case 2: Local Time Accuracy
**Objective:** Verify local time calculation is correct

**Steps:**
1. Select a station from a known timezone (e.g., Tokyo, Japan)
2. Compare displayed time with actual time in that timezone
3. Verify time updates every second

**Expected Results:**
- ✅ Time is approximately correct for the timezone
- ✅ Time format is HH:MM:SS (24-hour)
- ✅ Time updates smoothly without flickering

**Known Limitations:**
- Timezone calculation is approximate based on longitude
- May not be 100% accurate for all locations

---

### Test Case 3: AI City Fact Generation
**Objective:** Verify Gemini AI generates relevant city facts

**Steps:**
1. Select a station from a well-known city (e.g., Paris, France)
2. Wait for city fact to load
3. Verify the fact is relevant and under 100 characters

**Expected Results:**
- ✅ Loading state shows "Discovering local insights..."
- ✅ Fact is relevant to the city/country
- ✅ Fact is under 100 characters
- ✅ If API fails, fallback message is shown

**Test Cities:**
- Paris, France
- Tokyo, Japan
- New York, USA
- Bangkok, Thailand

---

### Test Case 4: AI Journey Feature
**Objective:** Verify AI Journey suggests appropriate stations

**Steps:**
1. Click "AI Journey" button at top center
2. Enter a mood/request (e.g., "I want to relax")
3. Wait for AI to process
4. Verify a station is selected and playing

**Expected Results:**
- ✅ Prompt appears asking for mood
- ✅ Button shows "Thinking..." while processing
- ✅ AI suggests appropriate country and genre
- ✅ Matching station is found and starts playing
- ✅ Alert shows AI reasoning
- ✅ If no match found, appropriate error message shown

**Test Inputs:**
- "I want to relax" → Should suggest lofi/ambient/jazz
- "I need energy" → Should suggest electronic/dance/rock
- "Morning coffee" → Should suggest jazz/classical/easy listening
- "Party time" → Should suggest dance/pop/electronic

---

### Test Case 5: Theme Compatibility
**Objective:** Verify components work in both dark and light themes

**Steps:**
1. Start in dark theme
2. Select a station and verify City Info Panel appearance
3. Click AI Journey and verify button appearance
4. Toggle to light theme
5. Verify all components update colors correctly

**Expected Results:**
- ✅ Dark theme: Black background, white text, neon accents
- ✅ Light theme: White background, dark text, blue accents
- ✅ All text is readable in both themes
- ✅ Hover effects work in both themes

---

### Test Case 6: Error Handling
**Objective:** Verify graceful error handling

**Steps:**
1. Test with no internet connection (if possible)
2. Test AI Journey with invalid/empty input
3. Test with station that has no geo coordinates

**Expected Results:**
- ✅ City fact shows fallback message if API fails
- ✅ AI Journey shows error message if fails
- ✅ Panel doesn't crash if station data is incomplete
- ✅ Loading states timeout appropriately

---

### Test Case 7: Performance
**Objective:** Verify no performance degradation

**Steps:**
1. Monitor browser console for errors
2. Check memory usage before and after selecting multiple stations
3. Verify time updates don't cause lag

**Expected Results:**
- ✅ No console errors
- ✅ No memory leaks
- ✅ Smooth animations
- ✅ Time updates don't impact performance

---

## Test Execution Checklist

- [ ] Test Case 1: City Info Panel Display
- [ ] Test Case 2: Local Time Accuracy
- [ ] Test Case 3: AI City Fact Generation
- [ ] Test Case 4: AI Journey Feature
- [ ] Test Case 5: Theme Compatibility
- [ ] Test Case 6: Error Handling
- [ ] Test Case 7: Performance

---

## Bug Report Template

**Bug ID:** [AUTO-INCREMENT]
**Severity:** [Critical/High/Medium/Low]
**Component:** [CityInfoPanel/AIJourney/Other]
**Description:** [Clear description of the bug]
**Steps to Reproduce:**
1. 
2. 
3. 

**Expected Result:** 
**Actual Result:** 
**Screenshot:** [If applicable]
**Fix Status:** [Open/In Progress/Fixed]

---

**Test Plan Version:** 1.0
**Created:** 2026-01-27
**Last Updated:** 2026-01-27
