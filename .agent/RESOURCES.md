# J Radio - Resources & Links

> รวมแหล่งข้อมูลสำคัญทั้งหมดสำหรับการพัฒนา J Radio

---

## 🌐 Radio Browser API

### Official Resources

| Resource | URL | Description |
|----------|-----|-------------|
| **Official Website** | https://www.radio-browser.info/ | หน้าหลักของ Radio Browser - ข้อมูลโปรเจกต์และสถิติ |
| **User Documentation** | https://www.radio-browser.info/users | คู่มือการใช้งานสำหรับผู้ใช้ทั่วไป |
| **Interactive Map** | https://www.radio-browser.info/map | แผนที่แสดงสถานีวิทยุทั่วโลกแบบ Interactive |
| **GitLab Repository** | https://gitlab.com/radiobrowser/radio-database | Source code, Issues, และ Documentation |
| **API Documentation** | https://api.radio-browser.info/ | API Endpoints และ Technical Documentation |

### API Endpoints

```
Primary Mirror (Germany):
https://de1.api.radio-browser.info/json

Backup Mirrors:
https://at1.api.radio-browser.info/json  (Austria)
https://nl1.api.radio-browser.info/json  (Netherlands)
```

### Key Features

- ✅ **30,000+ Radio Stations** worldwide
- ✅ **Free API** - No authentication required
- ✅ **Community-driven** - Open source database
- ✅ **Real-time Updates** - Community contributions
- ✅ **Geo-location Data** - Latitude/Longitude for mapping
- ✅ **Rich Metadata** - Tags, genres, bitrate, codec
- ✅ **CORS Enabled** - Direct browser access

---

## 🤖 Google Gemini AI

### Official Resources

| Resource | URL | Description |
|----------|-----|-------------|
| **AI Studio** | https://ai.google.dev/ | Get API keys and test models |
| **Documentation** | https://ai.google.dev/docs | Official documentation |
| **API Reference** | https://ai.google.dev/api | API reference and examples |
| **Pricing** | https://ai.google.dev/pricing | Free tier and pricing info |

### API Usage in J Radio

**Model:** `gemini-3-flash-preview`

**Purpose:** 
- Mood-based station recommendations
- Natural language search
- Genre/tag suggestions

**Example:**
```typescript
Input: "I want to relax"
Output: ["lofi", "jazz", "ambient"]
```

---

## 📚 Technical Documentation

### React & TypeScript

| Resource | URL | Description |
|----------|-----|-------------|
| **React Docs** | https://react.dev/ | Official React documentation |
| **React Hooks** | https://react.dev/reference/react | Hooks API reference |
| **TypeScript** | https://www.typescriptlang.org/ | TypeScript documentation |
| **TS Handbook** | https://www.typescriptlang.org/docs/handbook/ | Complete TypeScript guide |

### Build Tools

| Resource | URL | Description |
|----------|-----|-------------|
| **Vite** | https://vitejs.dev/ | Vite build tool documentation |
| **Vite Config** | https://vitejs.dev/config/ | Configuration reference |
| **Vite Plugins** | https://vitejs.dev/plugins/ | Plugin ecosystem |

### 3D Visualization

| Resource | URL | Description |
|----------|-----|-------------|
| **Three.js** | https://threejs.org/ | Three.js 3D library |
| **Three.js Docs** | https://threejs.org/docs/ | API documentation |
| **react-globe.gl** | https://github.com/vasturiano/react-globe.gl | React Globe component |
| **Globe Examples** | https://vasturiano.github.io/react-globe.gl/example/ | Live examples |

### Styling

| Resource | URL | Description |
|----------|-----|-------------|
| **Tailwind CSS** | https://tailwindcss.com/ | Utility-first CSS framework |
| **Tailwind Docs** | https://tailwindcss.com/docs | Complete documentation |
| **Google Fonts** | https://fonts.google.com/ | Web fonts library |
| **Lucide Icons** | https://lucide.dev/ | Icon library |

---

## 🎓 Learning Resources

### Radio Broadcasting

| Resource | URL | Description |
|----------|-----|-------------|
| **Radio Browser Blog** | https://www.radio-browser.info/blog | Updates and announcements |
| **Internet Radio Guide** | https://en.wikipedia.org/wiki/Internet_radio | Wikipedia overview |
| **Streaming Protocols** | https://en.wikipedia.org/wiki/Streaming_media | Technical background |

### Web Audio API

| Resource | URL | Description |
|----------|-----|-------------|
| **MDN Web Audio** | https://developer.mozilla.org/en-US/docs/Web/API/Web_Audio_API | Complete guide |
| **Audio Element** | https://developer.mozilla.org/en-US/docs/Web/HTML/Element/audio | HTML5 Audio reference |
| **Media Errors** | https://developer.mozilla.org/en-US/docs/Web/API/MediaError | Error handling |

### WebGL & 3D

| Resource | URL | Description |
|----------|-----|-------------|
| **WebGL Fundamentals** | https://webglfundamentals.org/ | Learn WebGL basics |
| **Three.js Journey** | https://threejs-journey.com/ | Comprehensive Three.js course |
| **WebGL Test** | https://get.webgl.org/ | Test browser WebGL support |

---

## 🛠️ Development Tools

### Package Managers

| Tool | URL | Description |
|------|-----|-------------|
| **npm** | https://www.npmjs.com/ | Node package manager |
| **Node.js** | https://nodejs.org/ | JavaScript runtime |

### Code Editors

| Tool | URL | Description |
|------|-----|-------------|
| **VS Code** | https://code.visualstudio.com/ | Recommended editor |
| **VS Code Extensions** | https://marketplace.visualstudio.com/ | Extension marketplace |

### Browser DevTools

| Browser | DevTools | Description |
|---------|----------|-------------|
| **Chrome** | F12 | Chrome DevTools |
| **Firefox** | F12 | Firefox Developer Tools |
| **Safari** | Cmd+Opt+I | Safari Web Inspector |

---

## 🌍 Geographic Data

### Country Codes

| Resource | URL | Description |
|----------|-----|-------------|
| **ISO 3166-1** | https://en.wikipedia.org/wiki/ISO_3166-1_alpha-2 | Country code list |
| **Country Flags** | https://flagpedia.net/ | Flag images and data |

### Geolocation

| Resource | URL | Description |
|----------|-----|-------------|
| **Geolocation API** | https://developer.mozilla.org/en-US/docs/Web/API/Geolocation_API | Browser geolocation |
| **Haversine Formula** | https://en.wikipedia.org/wiki/Haversine_formula | Distance calculation |

---

## 📦 NPM Packages Used

### Core Dependencies

```json
{
  "react": "^19.2.3",
  "react-dom": "^19.2.3",
  "three": "0.170.0",
  "react-globe.gl": "^2.37.0",
  "@google/genai": "^1.38.0",
  "lucide-react": "^0.563.0"
}
```

### Dev Dependencies

```json
{
  "typescript": "~5.8.2",
  "vite": "^6.2.0",
  "@vitejs/plugin-react": "^5.0.0",
  "@types/node": "^22.14.0"
}
```

### Package Links

| Package | NPM | GitHub |
|---------|-----|--------|
| **react** | [npm](https://www.npmjs.com/package/react) | [GitHub](https://github.com/facebook/react) |
| **three** | [npm](https://www.npmjs.com/package/three) | [GitHub](https://github.com/mrdoob/three.js) |
| **react-globe.gl** | [npm](https://www.npmjs.com/package/react-globe.gl) | [GitHub](https://github.com/vasturiano/react-globe.gl) |
| **@google/genai** | [npm](https://www.npmjs.com/package/@google/genai) | [GitHub](https://github.com/google/generative-ai-js) |
| **lucide-react** | [npm](https://www.npmjs.com/package/lucide-react) | [GitHub](https://github.com/lucide-icons/lucide) |
| **vite** | [npm](https://www.npmjs.com/package/vite) | [GitHub](https://github.com/vitejs/vite) |

---

## 🎨 Design Resources

### Color Palettes

| Resource | URL | Description |
|----------|-----|-------------|
| **Coolors** | https://coolors.co/ | Color palette generator |
| **Adobe Color** | https://color.adobe.com/ | Color wheel and schemes |

### UI/UX Inspiration

| Resource | URL | Description |
|----------|-----|-------------|
| **Dribbble** | https://dribbble.com/ | Design inspiration |
| **Awwwards** | https://www.awwwards.com/ | Web design awards |
| **CodePen** | https://codepen.io/ | Code examples |

### Glassmorphism

| Resource | URL | Description |
|----------|-----|-------------|
| **Glassmorphism Generator** | https://hype4.academy/tools/glassmorphism-generator | CSS generator |
| **UI Glass** | https://ui.glass/generator/ | Another generator |

---

## 🚀 Deployment Platforms

### Hosting Services

| Platform | URL | Free Tier | Description |
|----------|-----|-----------|-------------|
| **Vercel** | https://vercel.com/ | ✅ Yes | Recommended for Vite apps |
| **Netlify** | https://www.netlify.com/ | ✅ Yes | Easy deployment |
| **GitHub Pages** | https://pages.github.com/ | ✅ Yes | Free static hosting |
| **Cloudflare Pages** | https://pages.cloudflare.com/ | ✅ Yes | Fast global CDN |
| **Railway** | https://railway.app/ | ✅ Limited | Full-stack hosting |

---

## 📊 Analytics & Monitoring

### Tools

| Tool | URL | Description |
|------|-----|-------------|
| **Google Analytics** | https://analytics.google.com/ | Web analytics |
| **Plausible** | https://plausible.io/ | Privacy-friendly analytics |
| **Sentry** | https://sentry.io/ | Error tracking |

---

## 🔧 Testing Tools

### Testing Frameworks

| Tool | URL | Description |
|------|-----|-------------|
| **Vitest** | https://vitest.dev/ | Vite-native testing |
| **React Testing Library** | https://testing-library.com/react | React component testing |
| **Playwright** | https://playwright.dev/ | E2E testing |

---

## 📱 Progressive Web App (PWA)

### Resources

| Resource | URL | Description |
|----------|-----|-------------|
| **PWA Guide** | https://web.dev/progressive-web-apps/ | Complete PWA guide |
| **Vite PWA Plugin** | https://vite-pwa-org.netlify.app/ | PWA plugin for Vite |
| **Workbox** | https://developers.google.com/web/tools/workbox | Service worker library |

---

## 🌐 Community & Support

### Forums & Communities

| Platform | URL | Description |
|----------|-----|-------------|
| **Radio Browser GitLab** | https://gitlab.com/radiobrowser/radio-database/issues | Report issues |
| **Stack Overflow** | https://stackoverflow.com/ | Q&A for developers |
| **Reddit r/webdev** | https://www.reddit.com/r/webdev/ | Web development community |
| **Dev.to** | https://dev.to/ | Developer community |

---

## 📖 Project Documentation

### Internal Docs

| Document | Location | Description |
|----------|----------|-------------|
| **Development Guide** | `.agent/DEVELOPMENT_GUIDE.md` | Complete development documentation |
| **API Reference** | `.agent/API_REFERENCE.md` | Radio Browser API reference |
| **Quick Start** | `.agent/QUICK_START.md` | Getting started guide |
| **Resources** | `.agent/RESOURCES.md` | This file |

---

## 🔗 Quick Links Summary

### Essential Links

```
Radio Browser:
├── Website: https://www.radio-browser.info/
├── API: https://api.radio-browser.info/
├── Map: https://www.radio-browser.info/map
├── Users: https://www.radio-browser.info/users
└── GitLab: https://gitlab.com/radiobrowser/radio-database

Google Gemini:
├── AI Studio: https://ai.google.dev/
└── Docs: https://ai.google.dev/docs

Development:
├── React: https://react.dev/
├── Vite: https://vitejs.dev/
├── Three.js: https://threejs.org/
└── Tailwind: https://tailwindcss.com/
```

---

## 📞 Contact & Support

### Radio Browser

- **GitLab Issues**: https://gitlab.com/radiobrowser/radio-database/issues
- **Email**: Contact via GitLab

### Google Gemini

- **Support**: https://ai.google.dev/support
- **Community**: https://developers.google.com/community

---

## 📝 Notes

### Important Reminders

1. **API Keys**: Never commit `.env.local` to version control
2. **Rate Limits**: Be respectful with API calls
3. **User-Agent**: Always set descriptive User-Agent header
4. **Caching**: Implement caching to reduce API calls
5. **Error Handling**: Always handle API and stream errors
6. **CORS**: Some radio streams don't support CORS
7. **HTTPS**: Prefer HTTPS streams when available

### Best Practices

1. Use mirror fallback for Radio Browser API
2. Cache station data locally
3. Implement error boundaries in React
4. Test on multiple browsers
5. Optimize for mobile devices
6. Monitor performance
7. Keep dependencies updated

---

## 🔄 Updates

### How to Stay Updated

**Radio Browser:**
- Watch GitLab repository
- Check blog for announcements
- Monitor API version changes

**Dependencies:**
```bash
npm outdated          # Check for updates
npm update            # Update packages
npm audit             # Security check
```

**Gemini AI:**
- Subscribe to Google AI newsletter
- Check API changelog
- Monitor rate limits and pricing

---

## 📚 Additional Reading

### Recommended Articles

- [Building 3D Web Applications](https://threejs.org/manual/)
- [React Performance Optimization](https://react.dev/learn/render-and-commit)
- [Web Audio Best Practices](https://developer.mozilla.org/en-US/docs/Web/API/Web_Audio_API/Best_practices)
- [Progressive Web Apps](https://web.dev/progressive-web-apps/)

### Video Tutorials

- [Three.js Crash Course](https://www.youtube.com/results?search_query=threejs+tutorial)
- [React Globe.gl Examples](https://www.youtube.com/results?search_query=react+globe+gl)
- [Vite Tutorial](https://www.youtube.com/results?search_query=vite+tutorial)

---

**Last Updated:** 2026-01-26  
**Maintained by:** J Radio Development Team  
**Version:** 1.0.0

---

## ✅ Checklist for Developers

Use this checklist when starting development:

- [ ] Bookmarked all essential links
- [ ] Got Gemini API key
- [ ] Tested Radio Browser API
- [ ] Read development guide
- [ ] Reviewed API reference
- [ ] Completed quick start
- [ ] Set up development environment
- [ ] Joined relevant communities
- [ ] Configured error tracking
- [ ] Set up version control

---

**Happy Coding! 🚀📻🌍**
