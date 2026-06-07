# 🖥️ Windows XP Portfolio — Kamal Kumar

<div align="center">

![Windows XP Portfolio](https://img.shields.io/badge/Windows%20XP-Portfolio-0058ee?style=for-the-badge&logo=windows-xp&logoColor=white)
![Next.js](https://img.shields.io/badge/Next.js-16-black?style=for-the-badge&logo=next.js)
![Firebase](https://img.shields.io/badge/Firebase-Auth%20%2B%20Firestore-FF6F00?style=for-the-badge&logo=firebase)

**A fully interactive Windows XP-themed developer portfolio**

[🌐 Live Demo](https://kamal-bharadwaj.web.app) • [📬 Contact Me](mailto:kamal.bharadwj@gmail.com)

</div>

---

## ✨ Features

| Feature | Description |
|---|---|
| 🟦 **Boot Screen** | Authentic XP logo animation with progress bar |
| 🔐 **Login Screen** | Firebase Email/Password + Google Auth + Guest mode |
| 🖥️ **Desktop** | Draggable, resizable windows with GSAP animations |
| 📁 **My Projects** | Windows Explorer-style folder view |
| 👤 **About Me** | Bio, awards, animated skill progress bars |
| 💻 **My Computer** | Tabbed view: Skills, Education, Experience |
| 📬 **Contact Me** | Form that saves messages to Firestore |
| 🔍 **Search** | XP dog companion + portfolio-wide full-text search |
| 🛡️ **Admin Panel** | View contact messages (admin-only) |
| 🎨 **Cursor Trails** | Toggleable sparkle cursor trail effect |

---

## 🚀 Getting Started

### 1. Clone & Install

```bash
git clone https://github.com/kamal-bharadwaj/windows-xp-portfolio.git
cd windows-xp-portfolio
npm install
```

### 2. Set Up Firebase

1. Go to [Firebase Console](https://console.firebase.google.com)
2. Create a new project (or use an existing one)
3. Enable **Authentication** → Sign-in method → **Email/Password** + **Google**
4. Create **Firestore Database** → Start in test mode
5. Go to **Project Settings → Your Apps → Add Web App** → Copy config

### 3. Configure Environment Variables

```bash
cp .env.example .env.local
```

Open `.env.local` and fill in your Firebase values:

```env
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
```

> ⚠️ **Never commit `.env.local`** — it's already in `.gitignore`

### 4. Run Locally

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

---

## 🌍 Deployment

### Firebase Hosting

```bash
npm run build
npx firebase deploy
```

### Vercel

```bash
npx vercel
```

Add your `.env.local` variables in the Vercel dashboard under **Project → Settings → Environment Variables**.

---

## 📁 Project Structure

```
├── public/
│   ├── bliss.jpg              # XP wallpaper
│   ├── xp_logo.svg            # Start button logo
│   ├── icons/                 # Custom XP-style SVG icons
│   └── resume/resume.pdf      # Your resume (not tracked)
│
└── src/
    ├── app/
    │   ├── layout.js          # Root layout + metadata
    │   ├── page.js            # Entry point
    │   └── globals.css        # Global XP Luna design system
    ├── components/
    │   ├── XPDesktop.jsx      # Main orchestrator + window registry
    │   ├── BootScreen.jsx     # XP boot animation
    │   ├── LoginScreen.jsx    # Firebase auth UI
    │   ├── Taskbar.jsx        # Bottom taskbar + system tray
    │   ├── StartMenu.jsx      # Start menu popup
    │   ├── DesktopIcons.jsx   # Desktop icon grid
    │   ├── WindowManager.jsx  # Window renderer
    │   ├── XPWindow.jsx       # Draggable window chrome
    │   ├── XPToast.jsx        # Toast notifications
    │   ├── CursorTrail.jsx    # Sparkle cursor effect
    │   └── windows/
    │       ├── AboutWindow.jsx
    │       ├── ProjectsWindow.jsx
    │       ├── SkillsWindow.jsx
    │       ├── ContactWindow.jsx
    │       ├── SearchWindow.jsx
    │       └── AdminWindow.jsx
    └── lib/
        ├── firebase.js         # Firebase SDK functions
        ├── firebaseConfig.js   # Config (reads from env vars)
        ├── portfolioData.js    # All portfolio content
        └── PortfolioContext.jsx # React context + Firestore sync
```

---

## 🛡️ Firestore Security Rules

Apply these in **Firebase Console → Firestore → Rules**:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Portfolio data: anyone can read, only admin can write
    match /portfolio/{doc} {
      allow read: if true;
      allow write: if request.auth != null &&
                      request.auth.token.email == 'YOUR_ADMIN_EMAIL';
    }
    // Contact messages: anyone can create, only admin can read
    match /contacts/{doc} {
      allow create: if true;
      allow read: if request.auth != null &&
                     request.auth.token.email == 'YOUR_ADMIN_EMAIL';
    }
  }
}
```

---

## 🔑 Environment Variables Reference

| Variable | Description |
|---|---|
| `NEXT_PUBLIC_FIREBASE_API_KEY` | Firebase Web API Key |
| `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN` | Firebase Auth domain |
| `NEXT_PUBLIC_FIREBASE_PROJECT_ID` | Firebase project ID |
| `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET` | Firebase storage bucket |
| `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID` | Firebase messaging sender |
| `NEXT_PUBLIC_FIREBASE_APP_ID` | Firebase app ID |

---

## 👤 Customizing for Yourself

Edit [`src/lib/portfolioData.js`](src/lib/portfolioData.js) to update all your personal info, skills, projects, education, and experience — everything renders from this single file.

---

## 📄 License

MIT © [Kamal Kumar](https://github.com/kamal-bharadwaj)
