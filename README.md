# 🛡️ MaskGuard — Frontend

React.js frontend for the AI-Based Smart Mask Verification and Entry Control System.

**Backend:** https://mask-backend-1-urrn.onrender.com  
**Deploy Target:** Vercel

---

## 📁 Project Structure

```
src/
├── context/
│   └── AuthContext.js      ← JWT auth state (login/register/logout)
├── pages/
│   ├── Landing.js          ← Hero landing page with particle animation
│   ├── Login.js            ← Sign in page
│   ├── Register.js         ← Sign up page with password strength
│   ├── Dashboard.js        ← Stats, charts, recent logs
│   ├── Detect.js           ← Live webcam mask detection
│   └── History.js          ← Full paginated detection history
├── utils/
│   └── api.js              ← Axios instance with JWT interceptor
├── App.js                  ← Routing (public/private routes)
└── index.css               ← Global design system (glassmorphism)
```

---

## 🚀 Deploy to Vercel (3 steps)

### Option A — GitHub Import (recommended)
1. Push this folder to a new GitHub repo
2. Go to [vercel.com](https://vercel.com) → **New Project** → import your repo
3. Add environment variable:
   - `REACT_APP_API_URL` = `https://mask-backend-1-urrn.onrender.com`
4. Click **Deploy** — done!

### Option B — Vercel CLI
```bash
npm install -g vercel
cd maskguard-frontend
vercel
# Follow prompts, set REACT_APP_API_URL when asked
```

---

## 🔧 Local Development

```bash
# Install dependencies
npm install

# Start dev server
npm start
# Opens http://localhost:3000
```

---

## 🌍 Environment Variables

| Variable | Value |
|---|---|
| `REACT_APP_API_URL` | `https://mask-backend-1-urrn.onrender.com` |

In Vercel dashboard: **Settings → Environment Variables → Add**

---

## 🎨 Design System

| Token | Value |
|---|---|
| Primary font | Syne (display) |
| Body font | DM Sans |
| Theme | Dark glassmorphism |
| Accent | Cyan `#00c8ff` |
| Success | Green `#00ff88` |
| Danger | Red `#ff3d6b` |
| Background | Deep navy `#020408` |

---

## 📱 Pages

| Route | Access | Description |
|---|---|---|
| `/` | Public | Animated landing page |
| `/login` | Public | Sign in |
| `/register` | Public | Sign up |
| `/dashboard` | Auth | Stats + charts + recent logs |
| `/detect` | Auth | Live webcam detection |
| `/history` | Auth | Full detection history + export |

---

## ⚙️ Vercel Settings

**Framework Preset:** Create React App  
**Build Command:** `npm run build`  
**Output Directory:** `build`  
**Install Command:** `npm install`

The `vercel.json` handles SPA client-side routing automatically.
"# mask-frontend" 
