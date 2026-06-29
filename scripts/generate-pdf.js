const PDFDocument = require('pdfkit');
const fs = require('fs');
const path = require('path');

// Colors matching Windows XP Blue Luna theme and high-quality styling
const COLOR_PRIMARY = '#0d59f2'; // XP Classic Blue
const COLOR_SECONDARY = '#3ca4ff'; // XP Light Blue
const COLOR_DARK_TEXT = '#222222';
const COLOR_LIGHT_TEXT = '#555555';
const COLOR_BACKGROUND_CODE = '#f5f7fa';
const COLOR_BORDER_CODE = '#d0d7de';
const COLOR_ALERT_BG = '#f0f4fc';
const COLOR_ALERT_BORDER = '#0d59f2';

const OUTPUT_PATH = path.join(__dirname, '..', 'windows-xp-portfolio-implementation-guide.pdf');

console.log('Starting PDF generation...');

const doc = new PDFDocument({
  size: 'LETTER',
  margins: { top: 60, bottom: 60, left: 50, right: 50 },
  bufferPages: true
});

const stream = fs.createWriteStream(OUTPUT_PATH);
doc.pipe(stream);

// --- Custom Helpers for PDF Formatting ---

function addTitle(text) {
  doc.font('Helvetica-Bold')
     .fontSize(28)
     .fillColor(COLOR_PRIMARY)
     .text(text, { align: 'center' });
}

function addSubtitle(text) {
  doc.font('Helvetica-Oblique')
     .fontSize(14)
     .fillColor(COLOR_DARK_TEXT)
     .text(text, { align: 'center' });
  doc.moveDown(1.5);
}

function addHeading1(text) {
  // Ensure heading is on a page with some content
  if (doc.y > 600) {
    doc.addPage();
  } else {
    doc.moveDown(1.5);
  }
  doc.font('Helvetica-Bold')
     .fontSize(18)
     .fillColor(COLOR_PRIMARY)
     .text(text);
  
  // Underline bar
  const currentY = doc.y;
  doc.save()
     .strokeColor(COLOR_SECONDARY)
     .lineWidth(1.5)
     .moveTo(doc.x, currentY + 3)
     .lineTo(doc.x + 512, currentY + 3)
     .stroke()
     .restore();
  doc.moveDown(1);
}

function addHeading2(text) {
  if (doc.y > 650) {
    doc.addPage();
  } else {
    doc.moveDown(1);
  }
  doc.font('Helvetica-Bold')
     .fontSize(12)
     .fillColor(COLOR_DARK_TEXT)
     .text(text);
  doc.moveDown(0.5);
}

function addParagraph(text) {
  doc.font('Helvetica')
     .fontSize(10)
     .fillColor(COLOR_DARK_TEXT)
     .text(text, { align: 'justify', lineGap: 3 });
  doc.moveDown(0.8);
}

function addBullet(text) {
  doc.font('Helvetica')
     .fontSize(10)
     .fillColor(COLOR_DARK_TEXT)
     .text(`•  ${text}`, { indent: 15, lineGap: 3 });
  doc.moveDown(0.4);
}

function addCode(code) {
  // Measure text height in Courier 8.5
  doc.font('Courier').fontSize(8.5);
  const textHeight = doc.heightOfString(code, { width: 490, lineGap: 2 });
  
  // Check if box fits on current page
  if (doc.y + textHeight + 15 > 732) { // 792 - 60 margin
    doc.addPage();
  }
  
  const startX = doc.x;
  const startY = doc.y;
  const padding = 8;
  
  // Background Box
  doc.save()
     .rect(startX, startY, 512, textHeight + padding * 2)
     .fillColor(COLOR_BACKGROUND_CODE)
     .strokeColor(COLOR_BORDER_CODE)
     .lineWidth(0.5)
     .fillAndStroke()
     .restore();
  
  // Code Text
  doc.font('Courier')
     .fontSize(8.5)
     .fillColor('#1a1a1a')
     .text(code, startX + padding, startY + padding, { width: 496, lineGap: 2 });
  
  doc.x = startX;
  doc.y = startY + textHeight + padding * 2 + 10;
}

function addAlert(text) {
  doc.font('Helvetica-Oblique').fontSize(9.5);
  const textHeight = doc.heightOfString(text, { width: 480, lineGap: 2 });
  
  if (doc.y + textHeight + 15 > 732) {
    doc.addPage();
  }
  
  const startX = doc.x;
  const startY = doc.y;
  const padding = 8;
  
  // Background Box
  doc.save()
     .rect(startX, startY, 512, textHeight + padding * 2)
     .fillColor(COLOR_ALERT_BG)
     .restore();
     
  // Left Accent Border
  doc.save()
     .moveTo(startX, startY)
     .lineTo(startX, startY + textHeight + padding * 2)
     .strokeColor(COLOR_ALERT_BORDER)
     .lineWidth(3)
     .stroke()
     .restore();
  
  // Alert Text
  doc.font('Helvetica-Oblique')
     .fontSize(9.5)
     .fillColor(COLOR_PRIMARY)
     .text(text, startX + padding + 4, startY + padding, { width: 488, lineGap: 2 });
  
  doc.x = startX;
  doc.y = startY + textHeight + padding * 2 + 10;
}

// ==========================================
// --- COVER PAGE ---
// ==========================================

doc.moveDown(4);

// Drawn background accents for cover
doc.save()
   .rect(0, 0, 612, 15)
   .fillColor(COLOR_PRIMARY)
   .restore();

doc.save()
   .rect(0, 777, 612, 15)
   .fillColor(COLOR_PRIMARY)
   .restore();

// Brand Window Mockup
doc.save()
   .rect(150, 100, 312, 120)
   .fillColor(COLOR_PRIMARY)
   .restore();
   
doc.save()
   .rect(150, 130, 312, 90)
   .fillColor('#ffffff')
   .strokeColor(COLOR_PRIMARY)
   .lineWidth(2)
   .fillAndStroke()
   .restore();

doc.font('Helvetica-Bold').fontSize(16).fillColor('#ffffff').text('Microsoft Windows XP', 170, 110);
doc.font('Helvetica-Oblique').fontSize(12).fillColor(COLOR_PRIMARY).text('Developer Portfolio Edition', 170, 150);
doc.font('Helvetica').fontSize(10).fillColor('#666666').text('Welcome to your implementation guide.', 170, 180);

doc.y = 280;
addTitle('WINDOWS XP PORTFOLIO');
addSubtitle('Step-by-Step Technical Implementation Guide');

doc.font('Helvetica')
   .fontSize(11)
   .fillColor(COLOR_DARK_TEXT)
   .text('A comprehensive manual to building a fully interactive, retro-themed developer portfolio replicating the classic Windows XP Luna desktop interface. Crafted with Next.js, Firebase Auth & Firestore, and GSAP animations.', { align: 'center', lineGap: 3 });

doc.moveDown(4);

doc.font('Helvetica-Bold')
   .fontSize(10)
   .fillColor(COLOR_LIGHT_TEXT)
   .text('AUTHOR: Kamal Kumar', { align: 'center' });
doc.text('VERSION: 1.0.0', { align: 'center' });
doc.text(`DATE: ${new Date().toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })}`, { align: 'center' });

doc.addPage();

// ==========================================
// --- CHAPTER 1: ARCHITECTURE ---
// ==========================================

addHeading1('Chapter 1: Project Architecture & Lifecycle');

addParagraph('The Windows XP Portfolio is structured as a client-side state machine packaged in a modern Next.js single-page application. Replicating a desktop GUI inside a web browser requires high control over DOM rendering, absolute positioning coordinates, stacking layers (Z-indices), and animation execution. The application operates under a three-phase state lifecycle:');

addHeading2('1. The Lifecycle States');
addBullet('Boot Phase: Displays the retro Windows XP splash logo and tagline, simulating an authentic system booting process. An animated loading progress bar moves iteratively using CSS keyframe animations. The boot screen can be skipped by clicking anywhere on the viewport.');
addBullet('Login Phase: Mimics the classic blue Windows XP account selection layout. Users are presented with accounts (such as an Administrator account and options to log in via credentials or OAuth Google authentication). Guest access is supported, enabling immediate read-only access.');
addBullet('Desktop Phase: The main dashboard shell. Once loaded, the browser renders the classic Bliss wallpaper, draggable/resizable windows, floating desktop shortcuts, a fully functional taskbar with system tray/clock, and a dual-column Start Menu.');

addHeading2('2. Component Stacking Hierarchy');
addParagraph('To coordinate components and state transitions, the layout depends on a centralized orchestrator component (XPDesktop.jsx). Below is the core architectural topology:');

addCode(`src/
├── app/
│   ├── layout.js          # Root layout, Google fonts (Arimo, Material Icons)
│   ├── page.js            # Entry page importing XPDesktop dynamically (no SSR)
│   └── globals.css        # Luna Theme global styling variables & overrides
├── components/
│   ├── XPDesktop.jsx      # Root state, Window registry, theme toggles, orchestrator
│   ├── BootScreen.jsx     # HTML layout & CSS keyframe animation for the boot bar
│   ├── LoginScreen.jsx    # Authentication interface (Firebase, Google, Guest)
│   ├── Taskbar.jsx        # Bottom bar, window tabs, clock state, cursors
│   ├── StartMenu.jsx      # Double-column explorer pop-up
│   ├── WindowManager.jsx  # Registry map rendering active windows
│   └── XPWindow.jsx       # Custom chrome container (draggable title bar, resize grip)
└── lib/
    ├── firebase.js        # Auth and Firestore read/write integrations
    ├── portfolioData.js   # Predefined developer projects, skills, education
    └── PortfolioContext.jsx # React context sync for Firestore data edits`);

doc.addPage();

// ==========================================
// --- CHAPTER 2: SETUP ---
// ==========================================

addHeading1('Chapter 2: Project Setup & Dependency Configuration');

addParagraph('Next.js is configured using React 19 and the App Router. Since desktop elements (specifically window positioning and mouse events) are exclusively client-side browser APIs, components must execute dynamically and disable Server-Side Rendering (SSR). This prevents window/document-undefined compilation errors.');

addHeading2('1. Initializing the Project');
addParagraph('Initialize a standard Next.js directory and clean up default pages:');
addCode(`npx create-next-app@latest windows-xp-portfolio \\
  --js \\
  --eslint \\
  --no-src-dir \\
  --app \\
  --no-tailwind \\
  --import-alias "@/*"`);

addHeading2('2. Dynamic Imports Without SSR');
addParagraph('In src/app/page.js, we import the core application dynamically. This forces Next.js to package the desktop features as client-only bundles, letting React bootstrap the page directly on the browser:');

addCode(`'use client';
import dynamic from 'next/dynamic';

const XPDesktop = dynamic(() => import('@/components/XPDesktop'), {
  ssr: false,
  loading: () => (
    <div style={{ background: '#000', width: '100vw', height: '100vh', 
                  display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ color: '#fff', fontFamily: 'Tahoma, sans-serif', fontSize: 13 }}>
        Loading Windows XP Portfolio...
      </div>
    </div>
  ),
});

export default function Home() {
  return <XPDesktop />;
}`);

addHeading2('3. Standard Dependencies');
addParagraph('Install libraries required for authentication, database management, and animation:');
addCode(`npm install firebase gsap`);
addBullet('firebase: Used for authentication (Email, Google Auth) and storing portfolio data plus guest messages in Cloud Firestore.');
addBullet('gsap: GreenSock Animation Platform. Utilized for natural springy window entrance effects (back.out) and taskbar minimization transitions.');

doc.addPage();

// ==========================================
// --- CHAPTER 3: LUNA CSS DESIGN SYSTEM ---
// ==========================================

addHeading1('Chapter 3: Designing the Luna CSS System');

addParagraph('The Luna design system replicates the blue theme of Windows XP. It uses specific color codes, gradients, and borders. Instead of heavy CSS libraries, vanilla CSS Modules are employed to keep components modular and styling clean.');

addHeading2('1. Global Color Variables & System Border Reliefs');
addParagraph('Define variables in src/app/globals.css to keep style tokens consistent across components. Win32 styling relies heavily on 3D relief box shadows to emulate button bevels:');

addCode(`:root {
  /* Classic XP Colors */
  --xp-blue-dark: #0058ee;
  --xp-blue-light: #3ca4ff;
  --xp-blue-titlebar: linear-gradient(90deg, #0d59f2 0%, #3ca4ff 100%);
  --xp-start-orange: linear-gradient(180deg, #388e3c 0%, #4caf50 100%);
  --xp-taskbar-bg: linear-gradient(180deg, #245dd7 0%, #0d3eb3 100%);
  --xp-background-desktop: #0058ee;
  
  /* Fonts */
  --xp-font-tahoma: "Tahoma", "Segoe UI", system-ui, sans-serif;
  
  /* 3D Border Effects */
  --xp-border-outset: 1.5px 1.5px 0px #ffffff inset, -1.5px -1.5px 0px #868a8e inset;
  --xp-border-inset: -1.5px -1.5px 0px #ffffff inset, 1.5px 1.5px 0px #868a8e inset;
  --xp-border-window: 3px solid #0058ee;
}`);

addHeading2('2. Recreating the Classic Win32 Scrollbars');
addParagraph('Use standard CSS selectors to force scrollbars to render with retro XP gray colors and arrows:');

addCode(`.xp-scroll::-webkit-scrollbar {
  width: 16px;
  height: 16px;
  background: #f1f0ec;
}
.xp-scroll::-webkit-scrollbar-thumb {
  background: #d4d0c8;
  border: 2px solid #f1f0ec;
  box-shadow: var(--xp-border-outset);
}
.xp-scroll::-webkit-scrollbar-button {
  display: block;
  background: #d4d0c8;
  border: 1px solid #808080;
  box-shadow: var(--xp-border-outset);
}`);

addAlert('Design Tip: The XP look depends on avoiding smooth modern rounded borders on window components. Ensure borders are strictly square (radius 0px) and buttons use the dual relief (highlight top-left, shadow bottom-right) to trigger spatial depth perception.');

doc.addPage();

// ==========================================
// --- CHAPTER 4: BOOT AND LOGIN SCREEN ---
// ==========================================

addHeading1('Chapter 4: The Boot and Login State Screens');

addParagraph('The application initializes in the boot phase. Once complete, it fades into the account login screen.');

addHeading2('1. Boot Screen Marching Bar (BootScreen.jsx)');
addParagraph('The loading bar features three small blue gradient blocks moving inside a border wrapper. We implement this using a standard CSS translation keyframe loop:');

addCode(`/* CSS Animation for Marching Bar */
.progressWrap {
  width: 160px;
  height: 14px;
  border: 2px solid #5a5a5a;
  background: #000;
  position: relative;
  overflow: hidden;
}
.barGroup {
  display: flex;
  gap: 2px;
  position: absolute;
  width: 36px;
  animation: xp-march 1.8s linear infinite;
}
.segment {
  width: 8px;
  height: 100%;
  background: linear-gradient(180deg, #0d59f2 0%, #3ca4ff 50%, #0d59f2 100%);
}
@keyframes xp-march {
  0% { transform: translateX(-40px); }
  100% { transform: translateX(160px); }
}`);

addHeading2('2. Firebase Authentication UI (LoginScreen.jsx)');
addParagraph('The login interface offers three methods: admin password validation, Google OAuth, and Guest mode. Clicking guest mode signs out any existing auth and moves to the desktop. This setup is managed inside the login component:');

addCode(`const handleEmailLogin = async () => {
  if (!password) { setError('Enter password'); return; }
  setLoading(true);
  try {
    // Admin log in is synchronized with Firebase Auth
    await loginWithEmail('kamal.bharadwj@gmail.com', password);
    showToast('Welcome back, Kamal!', 'success');
    handleFinish();
  } catch (err) {
    setError('Incorrect password. Try again.');
  } finally { setLoading(false); }
};

const handleGuestLogin = () => {
  showToast('Browsing as Guest', 'info');
  handleFinish(); // Triggers GSAP exit scale animation
};`);

doc.addPage();

// ==========================================
// --- CHAPTER 5: THE DESKTOP SHELL ---
// ==========================================

addHeading1('Chapter 5: The Desktop & Navigation Shell');

addParagraph('The desktop provides the wrapper for dragging, icons, and menus. It coordinates state for active applications, z-indexes, and mouse position trackers.');

addHeading2('1. Centralized Window Registry (XPDesktop.jsx)');
addParagraph('Windows are defined in a registry map. It holds window details, default dimensions, icons, and initial layouts:');

addCode(`const WINDOWS = {
  about:    { title: 'About Me — Portfolio.exe',         icon: '/icons/xp_about.svg',       defaultW: 680, defaultH: 500 },
  projects: { title: 'My Projects',                      icon: '/icons/xp_projects.svg',    defaultW: 780, defaultH: 520 },
  skills:   { title: 'My Computer — Skills & Resume',    icon: '/icons/xp_mycomputer.svg',  defaultW: 740, defaultH: 560 },
  contact:  { title: 'Contact Me',                       icon: '/icons/xp_contact.svg',     defaultW: 560, defaultH: 480 },
  search:   { title: 'Search Companion',                 icon: '/icons/xp_search.svg',      defaultW: 380, defaultH: 480 },
  admin:    { title: 'Portfolio Admin Panel',             icon: '/icons/xp_admin.svg',       defaultW: 850, defaultH: 600 },
};`);

addHeading2('2. Taskbar & clock (Taskbar.jsx)');
addParagraph('The taskbar displays active applications. A \`setInterval\` timer updates the clock format in the bottom right corner:');

addCode(`const [time, setTime] = useState('');
useEffect(() => {
  const updateClock = () => {
    const d = new Date();
    let hrs = d.getHours();
    const mins = d.getMinutes().toString().padStart(2, '0');
    const ampm = hrs >= 12 ? 'PM' : 'AM';
    hrs = hrs % 12 || 12;
    setTime(\`\${hrs}:\${mins} \${ampm}\`);
  };
  updateClock();
  const timer = setInterval(updateClock, 60000);
  return () => clearInterval(timer);
}, []);`);

addHeading2('3. Double-Column Start Menu (StartMenu.jsx)');
addParagraph('The Start Menu divides items into two lists: application short-cuts on the left, and system configurations and logout toggles on the right, decorated with the administrator\'s user avatar.');

addAlert('Interaction Detail: In the Start Menu, clicking "All Programs" displays an expandable sub-menu list. Clicking "Log Off" clears the active user session in Firebase and triggers a state fade back to the Login Screen.');

doc.addPage();

// ==========================================
// --- CHAPTER 6: WINDOWING SYSTEM ---
// ==========================================

addHeading1('Chapter 6: Dynamic Windowing & Draggability');

addParagraph('The core of the desktop experience is the window wrapper (XPWindow.jsx). It must handle resizing, double-click actions, and dragging constraints to prevent elements from going off-screen.');

addHeading2('1. Draggability Calculation');
addParagraph('We implement dragging inside the title bar using mouse event listeners. We keep the top bar of the window within the visible screen area to prevent it from getting stuck:');

addCode(`const handleMouseDown = (e) => {
  if (maximized || isMobile) return;
  dragging.current = true;
  offset.current = { x: e.clientX - x, y: e.clientY - y };
  onFocus();
  e.preventDefault();
};

useEffect(() => {
  const onMouseMove = (e) => {
    if (dragging.current && !isMobile) {
      const TASKBAR_H = 30;
      // Clamping coordinates to browser viewport boundaries
      const nx = Math.max(0, Math.min(e.clientX - offset.current.x, window.innerWidth - w));
      const ny = Math.max(0, Math.min(e.clientY - offset.current.y, 
                                      window.innerHeight - TASKBAR_H - 30));
      onMove(nx, ny);
    }
  };
  const onUp = () => { dragging.current = false; };
  window.addEventListener('mousemove', onMouseMove);
  window.addEventListener('mouseup', onUp);
  return () => {
    window.removeEventListener('mousemove', onMouseMove);
    window.removeEventListener('mouseup', onUp);
  };
}, [x, y, w, h]);`);

addHeading2('2. GSAP Animations for Minimize & Maximize');
addParagraph('GSAP powers fluid scaling animations when minimizing windows to the taskbar:');

addCode(`useEffect(() => {
  if (minimized) {
    gsap.to(windowRef.current, {
      scale: 0.1,
      opacity: 0,
      y: window.innerHeight - y - 100,
      x: (window.innerWidth / 2) - x - 150,
      duration: 0.25,
      ease: 'power2.in',
      onComplete: () => setLocalActive(false)
    });
  } else {
    setLocalActive(true);
    // ... restore scale to 1 using back.out ease
  }
}, [minimized]);`);

doc.addPage();

// ==========================================
// --- CHAPTER 7: CONTENT WINDOWS ---
// ==========================================

addHeading1('Chapter 7: Application Content Windows');

addParagraph('Each window renders a specific component. These sub-components read from centralized data stores and handle database reads/writes.');

addHeading2('1. Projects Folder Layout (ProjectsWindow.jsx)');
addParagraph('The projects window mimics the classic Windows Explorer folder view. It uses a grid to display projects as system folders or text documents. Clicking a folder opens its details in a modal:');

addCode(`export default function ProjectsWindow() {
  return (
    <div className={styles.explorer}>
      <div className={styles.sidebar}>
        <div className={styles.sysTasks}>Folder Tasks</div>
        <div className={styles.details}>Details Pane</div>
      </div>
      <div className={styles.grid}>
        {projects.map((p) => (
          <div key={p.id} className={styles.folderIcon} onDoubleClick={() => openProject(p)}>
            <img src="/icons/xp_folder.svg" alt="" />
            <span>{p.title}</span>
          </div>
        ))}
      </div>
    </div>
  );
}`);

addHeading2('2. Contact Submission (ContactWindow.jsx)');
addParagraph('The contact form saves name, email, and message inputs to the Firestore database. Submitting triggers an XP dialog box popup:');

addCode(`const handleSubmit = async (e) => {
  e.preventDefault();
  try {
    await submitContactMessage({ name, email, message });
    showToast('Message sent! I will respond soon.', 'success');
    setName(''); setEmail(''); setMessage('');
  } catch (err) {
    showToast('Error saving message. Please check internet connection.', 'error');
  }
};`);

addHeading2('3. Rover Search Dog Integration (SearchWindow.jsx)');
addParagraph('The search window features an animated search companion dog (Rover) on the left side of the window, and a search input text box on the right. Typing a query performs a full-text search across all portfolio data (Projects, Skills, Bio) and lists matching results dynamically.');

doc.addPage();

// ==========================================
// --- CHAPTER 8: FIREBASE RULES ---
// ==========================================

addHeading1('Chapter 8: Firebase Rules & Security Setup');

addParagraph('The application uses Firebase Authentication to manage administrative write actions and Firestore Security Rules to protect user submissions.');

addHeading2('1. Firestore Collections Structure');
addBullet('portfolio: Holds a single document "data" with keys: bio, projects, education, experience, and skills. Read permissions are public; writes are restricted.');
addBullet('contacts: Holds individual contact submissions with keys: name, email, message, and timestamp. Create permissions are public; read/delete permissions are restricted to the administrator.');

addHeading2('2. Firestore Security Rules');
addParagraph('Define rules to restrict access. Apply these in the Firebase Console:');

addCode(`rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Portfolio Data: Public reads, Admin-only writes
    match /portfolio/{doc} {
      allow read: if true;
      allow write: if request.auth != null && 
                      request.auth.token.email == 'kamal.bharadwj@gmail.com';
    }
    // Contacts: Anyone can submit, Admin-only reads/deletes
    match /contacts/{doc} {
      allow create: if true;
      allow read, delete: if request.auth != null && 
                             request.auth.token.email == 'kamal.bharadwj@gmail.com';
    }
  }
}`);

addHeading2('3. Deployment Setup');
addParagraph('Build the project for production and deploy hosting config using firebase-tools CLI:');
addCode(`# 1. Build Next.js project
npm run build

# 2. Deploy static out directory to Firebase Hosting
npx firebase deploy`);

addParagraph('For Vercel deployment, link the project repository directly on the Vercel dashboard and add the \`.env.local\` Firebase keys as environment variables under Project Settings.');

// ==========================================
// --- FINAL PASS: FOOTERS AND HEADERS ---
// ==========================================

const range = doc.bufferedPageRange();
for (let i = range.start + 1; i < range.start + range.count; i++) {
  doc.switchToPage(i);
  
  // Header
  doc.save()
     .font('Helvetica')
     .fontSize(8)
     .fillColor('#777777')
     .text('Windows XP Portfolio — Step-by-Step Implementation Guide', 50, 30)
     .strokeColor('#cccccc')
     .lineWidth(0.5)
     .moveTo(50, 42)
     .lineTo(562, 42)
     .stroke()
     .restore();
     
  // Footer
  doc.save()
     .font('Helvetica')
     .fontSize(8)
     .fillColor('#777777')
     .text(`Page ${i + 1} of ${range.count}`, 50, 750, { align: 'right', width: 512 })
     .text('Created by Kamal Kumar', 50, 750, { align: 'left' })
     .restore();
}

// Complete the write stream
doc.end();

stream.on('finish', () => {
  console.log('PDF successfully generated at:', OUTPUT_PATH);
});
