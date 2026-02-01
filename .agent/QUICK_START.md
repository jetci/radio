# J Radio - Quick Start Guide

> Get up and running with J Radio in 5 minutes! 🚀

---

## 📋 Prerequisites

Before you begin, make sure you have:

- ✅ **Node.js** (version 18 or higher)
- ✅ **npm** (version 9 or higher)
- ✅ **Gemini API Key** ([Get one here](https://ai.google.dev/))
- ✅ **Modern Browser** (Chrome, Firefox, Safari, Edge)
- ✅ **Internet Connection** (for Radio Browser API)

---

## 🚀 Installation (3 Steps)

### Step 1: Install Dependencies

```bash
cd d:\j-radio
npm install
```

**Expected Output:**
```
added 245 packages in 15s
```

---

### Step 2: Configure Environment

Create `.env.local` file in the root directory:

```bash
# Windows PowerShell
echo "GEMINI_API_KEY=your_api_key_here" > .env.local

# Or manually create the file
```

**File Content:**
```env
GEMINI_API_KEY=AIzaSyXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
```

> 🔑 **Get your API Key**: Visit https://ai.google.dev/ and create a free API key

---

### Step 3: Start Development Server

```bash
npm run dev
```

**Expected Output:**
```
  VITE v6.2.0  ready in 523 ms

  ➜  Local:   http://localhost:5173/
  ➜  Network: use --host to expose
  ➜  press h + enter to show help
```

---

## 🌐 Open in Browser

Navigate to: **http://localhost:5173/**

You should see:
- 🌍 A beautiful 3D Earth globe
- 📻 Radio stations as glowing points
- 🎵 Audio player at the bottom
- 🔍 Search sidebar (click to open)

---

## 🎮 First Steps

### 1. Explore the Globe

- **Rotate**: Click and drag on the globe
- **Zoom**: Scroll wheel or pinch
- **Select Station**: Click on any green point

### 2. Play a Radio Station

1. Click on any station marker (green dot)
2. The globe will focus on that location
3. Audio player appears at the bottom
4. Click the **Play** button ▶️

### 3. Search for Stations

1. Click the **Search** icon (top-left)
2. Type a station name or country
3. Press Enter or click Search
4. Results appear on the globe

### 4. Use AI Recommendations

1. Open the sidebar
2. Find the **AI Search** section
3. Type something like:
   - "I want to relax"
   - "Energetic workout music"
   - "Jazz for studying"
4. Click **Get AI Recommendations**
5. AI will suggest matching stations

### 5. Save Favorites

1. Play any station
2. Click the **Heart** icon ❤️
3. Access favorites from the sidebar

---

## 🎯 Common Use Cases

### Find Stations in Your Country

**Example: Thailand**
```
1. Open sidebar
2. Type "Thailand" in search
3. Press Enter
4. See all Thai stations on globe
```

### Discover Jazz Music

**Example: Jazz Stations**
```
1. Open sidebar
2. Click "Jazz" quick tag
3. Or use AI: "Smooth jazz for evening"
```

### Find Local Stations

**Example: Geolocation**
```
1. Allow browser location access
2. Click "Auto Tune" (if available)
3. See nearby stations highlighted
```

---

## 🔧 Troubleshooting

### Issue: "Cannot find module" error

**Solution:**
```bash
rm -rf node_modules package-lock.json
npm install
```

---

### Issue: Audio not playing

**Possible Causes:**
1. ❌ Stream URL broken
2. ❌ CORS issues
3. ❌ Browser autoplay policy

**Solutions:**
1. Try another station
2. Check browser console for errors
3. Click play button manually (browsers block autoplay)

---

### Issue: Globe not rendering

**Check:**
1. Browser supports WebGL
2. No console errors
3. Try different browser

**Test WebGL:**
Visit: https://get.webgl.org/

---

### Issue: API Key not working

**Check:**
1. ✅ `.env.local` file exists in root
2. ✅ File name is exactly `.env.local`
3. ✅ Format: `GEMINI_API_KEY=your_key`
4. ✅ No quotes around the key
5. ✅ Restart dev server after adding key

---

### Issue: No stations appearing

**Check:**
1. Internet connection
2. Radio Browser API status
3. Browser console for errors

**Test API:**
```bash
curl https://de1.api.radio-browser.info/json/stations/search?limit=1
```

---

## 📱 Browser Compatibility

| Browser | Version | Status |
|---------|---------|--------|
| Chrome | 90+ | ✅ Fully Supported |
| Firefox | 88+ | ✅ Fully Supported |
| Safari | 14+ | ✅ Fully Supported |
| Edge | 90+ | ✅ Fully Supported |
| Opera | 76+ | ✅ Fully Supported |

**Requirements:**
- WebGL support
- ES6+ JavaScript
- Audio API support

---

## 🎨 Keyboard Shortcuts

| Key | Action |
|-----|--------|
| `Space` | Play/Pause |
| `Esc` | Close sidebar |
| `F` | Toggle favorites |
| `S` | Focus search |
| `?` | Show help |

*(Some shortcuts may not be implemented yet)*

---

## 📊 Performance Tips

### For Smooth Experience:

1. **Close Unused Tabs** - Free up memory
2. **Use Hardware Acceleration** - Enable in browser settings
3. **Limit Station Count** - Adjust in `App.tsx`
4. **Clear Cache** - If experiencing issues

### Optimize Settings:

```typescript
// In App.tsx
const INITIAL_STATION_LIMIT = 1000; // Reduce if slow
const ENABLE_ANIMATIONS = true;     // Disable if laggy
```

---

## 🔍 Explore Features

### Search Filters

**By Country:**
```
Thailand, USA, Japan, Germany, France
```

**By Genre/Tag:**
```
jazz, rock, pop, classical, electronic
news, talk, sports
lofi, chillout, ambient
```

**By Name:**
```
BBC, NPR, Thai PBS, NHK
```

---

### AI Search Examples

Try these prompts:

```
"I want to relax after work"
→ Suggests: lofi, ambient, chillout

"Energetic morning music"
→ Suggests: pop, dance, electronic

"Focus music for studying"
→ Suggests: classical, instrumental, lofi

"News and current events"
→ Suggests: news, talk, current affairs
```

---

## 📚 Next Steps

### Learn More:

1. 📖 Read [DEVELOPMENT_GUIDE.md](.agent/DEVELOPMENT_GUIDE.md)
2. 🔧 Check [API_REFERENCE.md](.agent/API_REFERENCE.md)
3. 🌐 Visit [Radio Browser](https://www.radio-browser.info/)

### Customize:

1. **Change Colors** - Edit `index.html` styles
2. **Add Features** - Modify components
3. **Improve UI** - Update Tailwind classes

### Contribute:

1. Report bugs
2. Suggest features
3. Submit pull requests

---

## 🆘 Getting Help

### Resources:

- **Radio Browser Docs**: https://www.radio-browser.info/users
- **Radio Browser GitLab**: https://gitlab.com/radiobrowser/radio-database
- **Gemini AI Docs**: https://ai.google.dev/docs
- **React Docs**: https://react.dev/
- **Vite Docs**: https://vitejs.dev/

### Common Questions:

**Q: Is this free to use?**
A: Yes! Radio Browser API is free. Gemini AI has free tier.

**Q: Can I use this offline?**
A: No, requires internet for API and streaming.

**Q: Can I add my own station?**
A: Yes! Visit https://www.radio-browser.info/ to submit.

**Q: How many stations are available?**
A: 30,000+ stations worldwide!

**Q: Can I record streams?**
A: Not currently implemented. Future feature.

---

## ✅ Checklist

Before you start developing:

- [ ] Node.js installed
- [ ] Dependencies installed (`npm install`)
- [ ] `.env.local` created with API key
- [ ] Dev server running (`npm run dev`)
- [ ] Browser opened to http://localhost:5173
- [ ] Globe rendering correctly
- [ ] Audio playing successfully
- [ ] Search working
- [ ] AI recommendations working

---

## 🎉 You're Ready!

Congratulations! You now have J Radio running locally.

**Enjoy exploring 30,000+ radio stations from around the world! 🌍📻**

---

**Need Help?** Check the [DEVELOPMENT_GUIDE.md](.agent/DEVELOPMENT_GUIDE.md) for detailed documentation.

**Last Updated:** 2026-01-26  
**Version:** 1.0.0
