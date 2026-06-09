#!/usr/bin/env node
/**
 * scripts/seed-supabase.mjs
 * ─────────────────────────
 * Seeds the Supabase database with:
 *   1. The portfolio 'main' row (if it doesn't already exist)
 *   2. Verifies the contacts table is accessible
 *
 * Run with:  node scripts/seed-supabase.mjs
 *
 * Reads credentials from .env.local automatically.
 */

import { readFileSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));

// ── Load .env.local manually (no dotenv dependency needed) ──
function loadEnv() {
  try {
    const envPath = resolve(__dirname, '../.env.local');
    const lines = readFileSync(envPath, 'utf-8').split('\n');
    for (const line of lines) {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith('#')) continue;
      const idx = trimmed.indexOf('=');
      if (idx === -1) continue;
      const key = trimmed.slice(0, idx).trim();
      const val = trimmed.slice(idx + 1).trim().replace(/^["']|["']$/g, '');
      process.env[key] = val;
    }
  } catch {
    console.error('❌  Could not read .env.local — make sure it exists.');
    process.exit(1);
  }
}

loadEnv();

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
  console.error('❌  Missing NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_ANON_KEY in .env.local');
  process.exit(1);
}

const headers = {
  'Content-Type': 'application/json',
  apikey: SUPABASE_ANON_KEY,
  Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
  Prefer: 'return=representation',
};

// ── Portfolio default data (mirrors portfolioData.js) ──────────
const defaultPortfolio = {
  personal: {
    name: 'Kamal Kumar',
    title: 'Software Developer & AI Researcher',
    location: 'Agra, Uttar Pradesh, India',
    phone: '+91 9457302712',
    email: 'kamal.bharadwj@gmail.com',
    linkedin: 'www.linkedin.com/in/kamal-bharadwj',
    github: 'github.com/kamal-bharadwaj',
    bio: 'B.Tech CSE student with a Minor in Robotics, passionate about building AI-powered systems, interactive frontends, and full-stack applications. Research intern at DRDO DIBER, awarded Appreciation Certificate by presiding Scientist. Winner of "Student of the Batch" at Arcane Programming Infotech. Currently exploring LLMs, machine learning vision, and modern web technologies.',
    sgpa: '8.89',
    adminEmail: 'kamal.bharadwj@gmail.com',
  },
  education: [
    { degree: 'B.Tech in Computer Science & Engineering', minor: 'Minor in Robotics', institution: 'Raja Balwant Singh Engineering Technical Campus, Agra', period: '2023 – 2026', score: 'Latest SGPA (Sem 7): 8.89', icon: 'school' },
    { degree: 'Diploma in Computer Science & Engineering', minor: '', institution: 'Raja Balwant Singh Polytechnic, Agra', period: '2020 – 2023', score: 'First Division (76.5%)', icon: 'menu_book' },
    { degree: '10th Grade', minor: '', institution: 'Nemi Chand Educational Academy', period: '2019 – 2020', score: '76%', icon: 'grade' },
  ],
  skills: {
    'Programming Languages': ['Python', 'JavaScript (ES6+)', 'TypeScript', 'Java', 'C'],
    'Web Technologies': ['HTML5', 'CSS3', 'React.js', 'Next.js', 'Node.js', 'Express.js', 'Bootstrap', 'Tailwind', 'GSAP.js', 'Spline.js'],
    'Databases & Cloud': ['SQL', 'PostgreSQL', 'MySQL', 'MongoDB', 'Oracle Cloud (OCI)'],
    'AI & Emerging Tech': ['Prompt Engineering', 'LLMs', 'NLP', 'Machine Learning (Vision)', 'AI-Assisted Dev'],
    'Developer Tools': ['Git', 'GitHub', 'Docker', 'Linux', 'REST APIs'],
  },
  experience: [
    { role: 'Research Intern', org: 'Defence Institute of Bio Energy Research (DRDO DIBER)', location: 'Haldwani, Uttarakhand', period: 'June 2025 – August 2025', highlights: ['Engineered custom multi-utility calculators grounded in real physics and statistical data to support Grade E Scientists.', 'Awarded an Appreciation of Work Certificate by the presiding Scientist.'], icon: 'science' },
    { role: 'Software Intern', org: 'Arcane Programming Infotech', location: 'Lucknow, Uttar Pradesh', period: 'June 2022 – August 2022', highlights: ['Completed comprehensive technical training.', 'Earned the "Student of the Batch" certification.'], icon: 'code' },
  ],
  projects: [
    { title: 'Real-Time Sign Language Recognition System', tags: ['Python', 'MobileNetV2', 'LSTM', 'AI/ML'], icon: 'sign_language', color: '#266c2d', description: 'Engineered a real-time assistive agent utilizing a MobileNetV2 feature extractor and Bidirectional LSTM classifier for ASL alphabet recognition.', highlights: ['98.2% accuracy on 26-class ASL dataset', 'Real-time inference at 35 FPS', 'Published research at 5th Intl Conference on Modern Mathematical Methods', 'Submitted to IMPACT2026', 'Presented at G.L. Bajaj Group of Institutions (Jan 2026)'] },
    { title: 'Custom AI Chatbot & Image Generator', tags: ['Node.js', 'Gemini AI', 'DALL-E-2', 'REST API'], icon: 'smart_toy', color: '#0046b8', description: 'Programmed a web API chatbot integrating Gemini AI capabilities to automate task and job assignments. Developed an API-driven image generator using ChatGPT DALL-E-2.', highlights: ['Gemini AI integration for intelligent task automation', 'DALL-E-2 image generation from text prompts', 'REST API architecture', 'Responsive web interface'] },
    { title: 'Interactive Animated Frontend (Jungle Safari)', tags: ['HTML', 'CSS', 'JavaScript', 'GSAP.js'], icon: 'animation', color: '#8e2f00', description: 'Designed a highly responsive web interface utilizing HTML, CSS, JavaScript, and GSAP.js for complex UI animations.', highlights: ['Complex GSAP.js animation sequences', 'Fully responsive design', 'High-performance rendering', 'Interactive user experience'] },
  ],
  awards: [
    { text: 'Gold Badge in Python on HackerRank', icon: 'military_tech' },
    { text: '100+ Python algorithmic challenges solved on LeetCode', icon: 'code' },
    { text: 'Microsoft & LinkedIn "Career Essential in Generative AI" certification', icon: 'workspace_premium' },
    { text: 'OCI Foundation Associate certification (Oracle Cloud)', icon: 'cloud' },
    { text: 'Bharat Shiksha Expo Hackathon participant (Nov 2024)', icon: 'emoji_events' },
    { text: 'DRDO DIBER Appreciation of Work Certificate', icon: 'verified' },
    { text: '"Student of the Batch" – Arcane Programming Infotech', icon: 'star' },
  ],
};

// ── Helpers ────────────────────────────────────────────────────
async function supabaseGet(table, query = '') {
  const res = await fetch(`${SUPABASE_URL}/rest/v1/${table}${query}`, { headers });
  const body = await res.json();
  return { status: res.status, body };
}

async function supabasePost(table, payload, extraHeaders = {}) {
  const res = await fetch(`${SUPABASE_URL}/rest/v1/${table}`, {
    method: 'POST',
    headers: { ...headers, ...extraHeaders },
    body: JSON.stringify(payload),
  });
  let body;
  try { body = await res.json(); } catch { body = null; }
  return { status: res.status, body };
}

// ── Main ───────────────────────────────────────────────────────
async function main() {
  console.log('\n🔗  Connecting to Supabase:', SUPABASE_URL);
  console.log('─'.repeat(55));

  // 1. Check / seed portfolio table
  console.log('\n📦  Checking portfolio table…');
  const { status: ps, body: pb } = await supabaseGet(
    'portfolio',
    '?select=id&id=eq.main'
  );

  if (ps !== 200) {
    console.error(`  ❌  Cannot read portfolio table (HTTP ${ps}).`);
    console.error('     Run scripts/setup-supabase.sql in the Supabase SQL Editor first.');
    console.error('     Details:', JSON.stringify(pb));
    process.exit(1);
  }

  if (Array.isArray(pb) && pb.length > 0) {
    console.log('  ✅  Portfolio row already exists — skipping seed.');
  } else {
    console.log('  ⚙️   No data found. Seeding default portfolio data…');
    const { status: is, body: ib } = await supabasePost(
      'portfolio',
      { id: 'main', data: defaultPortfolio },
      { Prefer: 'resolution=ignore-duplicates,return=minimal' }
    );
    if (is === 201 || is === 200) {
      console.log('  ✅  Portfolio data seeded successfully!');
    } else {
      console.error(`  ❌  Seed failed (HTTP ${is}):`, JSON.stringify(ib));
      process.exit(1);
    }
  }

  // 2. Check contacts table
  console.log('\n📬  Checking contacts table…');
  const { status: cs, body: cb } = await supabaseGet(
    'contacts',
    '?select=id&limit=1'
  );

  if (cs !== 200) {
    console.error(`  ❌  Cannot read contacts table (HTTP ${cs}).`);
    console.error('     Run scripts/setup-supabase.sql in the Supabase SQL Editor first.');
    console.error('     Details:', JSON.stringify(cb));
    process.exit(1);
  }
  console.log(`  ✅  Contacts table OK (${Array.isArray(cb) ? cb.length : 0} message(s) currently stored).`);

  // 3. Verify portfolio data is readable
  console.log('\n🔍  Verifying portfolio data read-back…');
  const { status: vs, body: vb } = await supabaseGet(
    'portfolio',
    '?select=data&id=eq.main'
  );
  if (vs === 200 && Array.isArray(vb) && vb.length > 0) {
    const sections = Object.keys(vb[0].data || {});
    console.log('  ✅  Data readable. Sections:', sections.join(', '));
  } else {
    console.error('  ❌  Could not read back portfolio data:', JSON.stringify(vb));
    process.exit(1);
  }

  console.log('\n' + '─'.repeat(55));
  console.log('🎉  All Supabase tables are set up and seeded!');
  console.log('    Your portfolio app is ready to use.\n');
}

main().catch((err) => {
  console.error('\n❌  Unexpected error:', err.message);
  process.exit(1);
});
