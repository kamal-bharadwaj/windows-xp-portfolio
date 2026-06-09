-- ================================================================
-- Windows XP Portfolio – Supabase Schema
-- Run this entire script in:
--   Supabase Dashboard → SQL Editor → New Query → Run
-- ================================================================


-- ──────────────────────────────────────────────
-- 1. PORTFOLIO TABLE
--    Stores the entire portfolio JSON in one row
--    (id = 'main', data = JSONB blob)
-- ──────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS public.portfolio (
  id          TEXT         PRIMARY KEY,          -- always 'main'
  data        JSONB        NOT NULL DEFAULT '{}',
  updated_at  TIMESTAMPTZ  NOT NULL DEFAULT NOW()
);

-- Automatically refresh updated_at on every update
CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS portfolio_updated_at ON public.portfolio;
CREATE TRIGGER portfolio_updated_at
  BEFORE UPDATE ON public.portfolio
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- ──────────────────────────────────────────────
-- 2. CONTACTS TABLE
--    Stores visitor contact form submissions
-- ──────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS public.contacts (
  id          UUID         PRIMARY KEY DEFAULT gen_random_uuid(),
  name        TEXT         NOT NULL CHECK (char_length(name) BETWEEN 1 AND 100),
  email       TEXT         NOT NULL CHECK (email ~* '^[^@\s]+@[^@\s]+\.[^@\s]+$'),
  message     TEXT         NOT NULL CHECK (char_length(message) BETWEEN 1 AND 5000),
  created_at  TIMESTAMPTZ  NOT NULL DEFAULT NOW()
);

-- Index for fast ordering by newest first
CREATE INDEX IF NOT EXISTS contacts_created_at_idx
  ON public.contacts (created_at DESC);


-- ──────────────────────────────────────────────
-- 3. ROW LEVEL SECURITY (RLS)
-- ──────────────────────────────────────────────

-- Enable RLS on both tables
ALTER TABLE public.portfolio ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.contacts  ENABLE ROW LEVEL SECURITY;

-- ── Portfolio policies ─────────────────────────
-- Anyone (including anonymous users) can READ portfolio data
DROP POLICY IF EXISTS "portfolio_public_read" ON public.portfolio;
CREATE POLICY "portfolio_public_read"
  ON public.portfolio FOR SELECT
  USING (true);

-- Only authenticated admin can INSERT / UPDATE / DELETE
DROP POLICY IF EXISTS "portfolio_admin_write" ON public.portfolio;
CREATE POLICY "portfolio_admin_write"
  ON public.portfolio FOR ALL
  USING (
    auth.role() = 'authenticated'
    AND auth.jwt() ->> 'email' = 'kamal.bharadwj@gmail.com'
  )
  WITH CHECK (
    auth.role() = 'authenticated'
    AND auth.jwt() ->> 'email' = 'kamal.bharadwj@gmail.com'
  );

-- ── Contacts policies ─────────────────────────
-- Anyone can INSERT a new contact message (the contact form)
DROP POLICY IF EXISTS "contacts_public_insert" ON public.contacts;
CREATE POLICY "contacts_public_insert"
  ON public.contacts FOR INSERT
  WITH CHECK (true);

-- Only authenticated admin can READ or DELETE contact messages
DROP POLICY IF EXISTS "contacts_admin_read" ON public.contacts;
CREATE POLICY "contacts_admin_read"
  ON public.contacts FOR SELECT
  USING (
    auth.role() = 'authenticated'
    AND auth.jwt() ->> 'email' = 'kamal.bharadwj@gmail.com'
  );

DROP POLICY IF EXISTS "contacts_admin_delete" ON public.contacts;
CREATE POLICY "contacts_admin_delete"
  ON public.contacts FOR DELETE
  USING (
    auth.role() = 'authenticated'
    AND auth.jwt() ->> 'email' = 'kamal.bharadwj@gmail.com'
  );


-- ──────────────────────────────────────────────
-- 4. SEED DEFAULT PORTFOLIO DATA
--    Inserts the 'main' row if it doesn't exist.
--    Safe to run multiple times (ON CONFLICT DO NOTHING).
-- ──────────────────────────────────────────────

INSERT INTO public.portfolio (id, data)
VALUES (
  'main',
  '{
    "personal": {
      "name": "Kamal Kumar",
      "title": "Software Developer & AI Researcher",
      "location": "Agra, Uttar Pradesh, India",
      "phone": "+91 9457302712",
      "email": "kamal.bharadwj@gmail.com",
      "linkedin": "www.linkedin.com/in/kamal-bharadwj",
      "github": "github.com/kamal-bharadwaj",
      "bio": "B.Tech CSE student with a Minor in Robotics, passionate about building AI-powered systems, interactive frontends, and full-stack applications. Research intern at DRDO DIBER, awarded Appreciation Certificate by presiding Scientist. Winner of \"Student of the Batch\" at Arcane Programming Infotech. Currently exploring LLMs, machine learning vision, and modern web technologies.",
      "sgpa": "8.89",
      "adminEmail": "kamal.bharadwj@gmail.com"
    },
    "education": [
      {
        "degree": "B.Tech in Computer Science & Engineering",
        "minor": "Minor in Robotics",
        "institution": "Raja Balwant Singh Engineering Technical Campus, Agra",
        "period": "2023 – 2026",
        "score": "Latest SGPA (Sem 7): 8.89",
        "icon": "school"
      },
      {
        "degree": "Diploma in Computer Science & Engineering",
        "minor": "",
        "institution": "Raja Balwant Singh Polytechnic, Agra",
        "period": "2020 – 2023",
        "score": "First Division (76.5%)",
        "icon": "menu_book"
      },
      {
        "degree": "10th Grade",
        "minor": "",
        "institution": "Nemi Chand Educational Academy",
        "period": "2019 – 2020",
        "score": "76%",
        "icon": "grade"
      }
    ],
    "skills": {
      "Programming Languages": ["Python", "JavaScript (ES6+)", "TypeScript", "Java", "C"],
      "Web Technologies": ["HTML5", "CSS3", "React.js", "Next.js", "Node.js", "Express.js", "Bootstrap", "Tailwind", "GSAP.js", "Spline.js"],
      "Databases & Cloud": ["SQL", "PostgreSQL", "MySQL", "MongoDB", "Oracle Cloud (OCI)"],
      "AI & Emerging Tech": ["Prompt Engineering", "LLMs", "NLP", "Machine Learning (Vision)", "AI-Assisted Dev"],
      "Developer Tools": ["Git", "GitHub", "Docker", "Linux", "REST APIs"]
    },
    "experience": [
      {
        "role": "Research Intern",
        "org": "Defence Institute of Bio Energy Research (DRDO DIBER)",
        "location": "Haldwani, Uttarakhand",
        "period": "June 2025 – August 2025",
        "highlights": [
          "Engineered custom multi-utility calculators grounded in real physics and statistical data to support Grade E Scientists.",
          "Awarded an Appreciation of Work Certificate by the presiding Scientist."
        ],
        "icon": "science"
      },
      {
        "role": "Software Intern",
        "org": "Arcane Programming Infotech",
        "location": "Lucknow, Uttar Pradesh",
        "period": "June 2022 – August 2022",
        "highlights": [
          "Completed comprehensive technical training.",
          "Earned the \"Student of the Batch\" certification."
        ],
        "icon": "code"
      }
    ],
    "projects": [
      {
        "title": "Real-Time Sign Language Recognition System",
        "tags": ["Python", "MobileNetV2", "LSTM", "AI/ML"],
        "icon": "sign_language",
        "color": "#266c2d",
        "description": "Engineered a real-time assistive agent utilizing a MobileNetV2 feature extractor and Bidirectional LSTM classifier for ASL alphabet recognition.",
        "highlights": [
          "98.2% accuracy on 26-class ASL dataset",
          "Real-time inference at 35 FPS",
          "Published research at 5th Intl Conference on Modern Mathematical Methods",
          "Submitted to IMPACT2026",
          "Presented at G.L. Bajaj Group of Institutions (Jan 2026)"
        ]
      },
      {
        "title": "Custom AI Chatbot & Image Generator",
        "tags": ["Node.js", "Gemini AI", "DALL-E-2", "REST API"],
        "icon": "smart_toy",
        "color": "#0046b8",
        "description": "Programmed a web API chatbot integrating Gemini AI capabilities to automate task and job assignments. Developed an API-driven image generator using ChatGPT DALL-E-2.",
        "highlights": [
          "Gemini AI integration for intelligent task automation",
          "DALL-E-2 image generation from text prompts",
          "REST API architecture",
          "Responsive web interface"
        ]
      },
      {
        "title": "Interactive Animated Frontend (Jungle Safari)",
        "tags": ["HTML", "CSS", "JavaScript", "GSAP.js"],
        "icon": "animation",
        "color": "#8e2f00",
        "description": "Designed a highly responsive web interface utilizing HTML, CSS, JavaScript, and GSAP.js for complex UI animations.",
        "highlights": [
          "Complex GSAP.js animation sequences",
          "Fully responsive design",
          "High-performance rendering",
          "Interactive user experience"
        ]
      }
    ],
    "awards": [
      { "text": "Gold Badge in Python on HackerRank", "icon": "military_tech" },
      { "text": "100+ Python algorithmic challenges solved on LeetCode", "icon": "code" },
      { "text": "Microsoft & LinkedIn \"Career Essential in Generative AI\" certification", "icon": "workspace_premium" },
      { "text": "OCI Foundation Associate certification (Oracle Cloud)", "icon": "cloud" },
      { "text": "Bharat Shiksha Expo Hackathon participant (Nov 2024)", "icon": "emoji_events" },
      { "text": "DRDO DIBER Appreciation of Work Certificate", "icon": "verified" },
      { "text": "\"Student of the Batch\" – Arcane Programming Infotech", "icon": "star" }
    ]
  }'::jsonb
)
ON CONFLICT (id) DO NOTHING;

-- ──────────────────────────────────────────────
-- 5. VERIFY
-- ──────────────────────────────────────────────
SELECT 'portfolio' AS "table", count(*) AS rows FROM public.portfolio
UNION ALL
SELECT 'contacts',             count(*)          FROM public.contacts;
