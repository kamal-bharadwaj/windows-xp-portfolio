# Windows XP Portfolio — Kamal Kumar

A fully interactive **Windows XP-themed** developer portfolio built with **Next.js**, **Firebase**, and pure **CSS Modules**.

## 🖥️ Features
- 🟦 **Boot Screen** → XP logo animation
- 🔐 **Login Screen** → Firebase Email/Password + Google Auth + Guest mode
- 🖥️ **Desktop** → Draggable windows, taskbar, start menu, system tray clock
- 📁 **My Projects** → Windows Explorer-style folder view
- 👤 **About Me** → Bio, awards, skill progress bars
- 💻 **My Computer** → Tabbed view: Skills, Education, Experience
- 📬 **Contact Me** → Form that saves to Firestore
- 🔍 **Search Companion** → XP dog companion + portfolio-wide search
- 🛡️ **Admin Panel** → View contact messages (admin email only)

## 🚀 Getting Started

### 1. Install dependencies
```bash
npm install
```

### 2. Set up Firebase
1. Go to [Firebase Console](https://console.firebase.google.com)
2. Create a project
3. Enable **Authentication** → Email/Password + Google
4. Create **Firestore Database** (test mode)
5. Go to Project Settings → Your Apps → Add Web App → Copy config

### 3. Configure environment
```bash
cp .env.example .env.local
# Edit .env.local with your Firebase values
```

### 4. Run locally
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000)

## 🌍 Deploy to Vercel

```bash
npm install -g vercel
vercel
```

In Vercel dashboard, add your `.env.local` variables as Environment Variables.

## 📁 Project Structure
```
src/
├── app/
│   ├── layout.js          # Root layout with metadata
│   ├── page.js            # Entry point
│   └── globals.css        # Global XP styles
├── components/
│   ├── XPDesktop.jsx      # Main orchestrator
│   ├── BootScreen.jsx     # XP boot animation
│   ├── LoginScreen.jsx    # Firebase login
│   ├── Taskbar.jsx        # Bottom taskbar + clock
│   ├── StartMenu.jsx      # Start menu popup
│   ├── DesktopIcons.jsx   # Desktop icon grid
│   ├── WindowManager.jsx  # Window renderer
│   ├── XPWindow.jsx       # Draggable window chrome
│   ├── XPToast.jsx        # Toast notifications
│   └── windows/
│       ├── AboutWindow.jsx
│       ├── ProjectsWindow.jsx
│       ├── SkillsWindow.jsx
│       ├── ContactWindow.jsx
│       ├── SearchWindow.jsx
│       └── AdminWindow.jsx
└── lib/
    ├── firebase.js         # Firebase client SDK
    ├── firebaseConfig.js   # Config (uses env vars)
    └── portfolioData.js    # All resume content
```

## 🛡️ Firestore Security Rules (recommended)
```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /contacts/{doc} {
      allow create: if true;  // Anyone can submit contact form
      allow read: if request.auth != null && 
                     request.auth.token.email == 'kamal.bharadwj@gmail.com';
    }
  }
}
```

## 👤 Admin Access
Log in with `kamal.bharadwj@gmail.com` to access the Admin Panel and view contact messages.
