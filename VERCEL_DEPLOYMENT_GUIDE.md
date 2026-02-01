# 🚀 Vercel Deployment Guide - TongThin Radio

## ✅ Pre-Deployment Checklist

- [x] Build ผ่าน (`npm run build`)
- [ ] Push code ขึ้น GitHub
- [ ] สร้างบัญชี Vercel
- [ ] Import project ใน Vercel
- [ ] ตั้งค่า Environment Variables
- [ ] Deploy สำเร็จ
- [ ] ทดสอบ URL ที่ Vercel ให้มา
- [ ] เชื่อม Custom Domain
- [ ] ตั้งค่า DNS
- [ ] รอ DNS Propagate
- [ ] ทดสอบ Custom Domain
- [ ] ตรวจสอบ HTTPS

---

## 🔧 Environment Variables ที่ต้องตั้ง

ใน Vercel Dashboard → Settings → Environment Variables:

```
GEMINI_API_KEY=your_api_key_here
```

---

## 🌐 DNS Settings

### ถ้าใช้ A Record:
```
Type: A
Name: @
Value: 76.76.21.21
TTL: 3600
```

### ถ้าใช้ CNAME (www):
```
Type: CNAME
Name: www
Value: cname.vercel-dns.com
TTL: 3600
```

---

## 📝 คำสั่ง Vercel CLI

### ติดตั้ง
```bash
npm install -g vercel
```

### Login
```bash
vercel login
```

### Deploy (Development)
```bash
vercel
```

### Deploy (Production)
```bash
vercel --prod
```

### ดู Logs
```bash
vercel logs
```

### ดูรายการ Deployments
```bash
vercel ls
```

---

## 🔄 Auto-Deploy จาก GitHub

เมื่อเชื่อม GitHub แล้ว:

- ✅ **Push to `main`** → Auto-deploy to Production
- ✅ **Push to other branches** → Auto-deploy to Preview
- ✅ **Pull Request** → สร้าง Preview URL อัตโนมัติ

---

## 📊 หลัง Deploy

### 1. ตรวจสอบ Performance
```
1. ไปที่ Vercel Dashboard
2. เลือก Deployment
3. ดู "Analytics" tab
4. ตรวจสอบ:
   - Load time
   - Bandwidth usage
   - Visitor stats
```

### 2. ตรวจสอบ Lighthouse Score
```bash
# ใช้ Chrome DevTools
1. เปิด Chrome
2. F12 → Lighthouse tab
3. Generate report
4. เป้าหมาย: 90+ ทุกด้าน
```

### 3. ตรวจสอบ Mobile
```
1. ทดสอบบน iPhone/Android
2. ตรวจสอบ responsive design
3. ทดสอบ audio playback
```

---

## 🐛 Troubleshooting

### ปัญหา: Build Failed
```bash
# ตรวจสอบ local build
npm run build

# ดู error logs ใน Vercel Dashboard
```

### ปัญหา: Environment Variables ไม่ทำงาน
```
1. ตรวจสอบชื่อตัวแปรใน Vercel Dashboard
2. Redeploy โปรเจกต์
3. ตรวจสอบว่าใช้ชื่อเดียวกันใน code
```

### ปัญหา: Domain ไม่ทำงาน
```
1. ตรวจสอบ DNS settings
2. รอ DNS propagate (ใช้ https://dnschecker.org)
3. ตรวจสอบว่า SSL certificate ถูกสร้างแล้ว
```

### ปัญหา: 404 Error
```
1. ตรวจสอบ vercel.json มี rewrites
2. ตรวจสอบ outputDirectory = "dist"
3. Redeploy
```

---

## 📈 Monitoring

### Vercel Analytics (ฟรี)
```
1. ไปที่ Project Settings
2. เปิด "Analytics"
3. ดูข้อมูล:
   - Page views
   - Unique visitors
   - Top pages
   - Countries
```

### เพิ่ม Google Analytics (Optional)
```typescript
// ใน index.html
<script async src="https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXXXX"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'G-XXXXXXXXXX');
</script>
```

---

## 🔒 Security Headers

Headers ถูกตั้งค่าใน `vercel.json` แล้ว:
- ✅ X-Content-Type-Options: nosniff
- ✅ X-Frame-Options: DENY
- ✅ X-XSS-Protection: 1; mode=block

---

## 💰 Pricing (Free Plan)

### ฟรีได้:
- ✅ Unlimited deployments
- ✅ 100 GB bandwidth/เดือน
- ✅ 6,000 build minutes/เดือน
- ✅ SSL certificates
- ✅ Custom domains
- ✅ Analytics
- ✅ Preview deployments

### ถ้าเกิน:
- Bandwidth: $40/100GB
- Build minutes: $0.005/นาที

---

## 📞 Support

- **Vercel Docs:** https://vercel.com/docs
- **Vercel Discord:** https://vercel.com/discord
- **GitHub Issues:** https://github.com/vercel/vercel/issues

---

## 🎉 Success Checklist

- [ ] ✅ Deploy สำเร็จ
- [ ] ✅ Custom domain ทำงาน
- [ ] ✅ HTTPS ทำงาน
- [ ] ✅ Audio playback ทำงาน
- [ ] ✅ Mobile responsive
- [ ] ✅ Lighthouse score 90+
- [ ] ✅ Analytics ทำงาน
- [ ] ✅ Error monitoring setup

---

**🚀 พร้อม Launch แล้ว!**
