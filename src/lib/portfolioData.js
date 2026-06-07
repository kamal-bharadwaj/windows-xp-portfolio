// Portfolio data for Kamal Kumar
const portfolioData = {
  personal: {
    name: 'Kamal Kumar',
    title: 'Software Developer & AI Researcher',
    location: 'Agra, Uttar Pradesh, India',
    phone: '+91 9457302712',
    email: 'kamal.bharadwj@gmail.com',
    linkedin: 'www.linkedin.com/in/kamal-bharadwj',
    github: 'github.com/kamal-bharadwaj',
    bio: `B.Tech CSE student with a Minor in Robotics, passionate about building AI-powered systems, interactive frontends, and full-stack applications. Research intern at DRDO DIBER, awarded Appreciation Certificate by presiding Scientist. Winner of "Student of the Batch" at Arcane Programming Infotech. Currently exploring LLMs, machine learning vision, and modern web technologies.`,
    sgpa: '8.89',
    adminEmail: 'kamal.bharadwj@gmail.com',
  },

  education: [
    {
      degree: 'B.Tech in Computer Science & Engineering',
      minor: 'Minor in Robotics',
      institution: 'Raja Balwant Singh Engineering Technical Campus, Agra',
      period: '2023 – 2026',
      score: 'Latest SGPA (Sem 7): 8.89',
      icon: 'school',
    },
    {
      degree: 'Diploma in Computer Science & Engineering',
      institution: 'Raja Balwant Singh Polytechnic, Agra',
      period: '2020 – 2023',
      score: 'First Division (76.5%)',
      icon: 'menu_book',
    },
    {
      degree: '10th Grade',
      institution: 'Nemi Chand Educational Academy',
      period: '2019 – 2020',
      score: '76%',
      icon: 'grade',
    },
  ],

  skills: {
    'Programming Languages': ['Python', 'JavaScript (ES6+)', 'TypeScript', 'Java', 'C'],
    'Web Technologies': ['HTML5', 'CSS3', 'React.js', 'Next.js', 'Node.js', 'Express.js', 'Bootstrap', 'Tailwind', 'GSAP.js', 'Spline.js'],
    'Databases & Cloud': ['SQL', 'PostgreSQL', 'MySQL', 'MongoDB', 'Oracle Cloud (OCI)'],
    'AI & Emerging Tech': ['Prompt Engineering', 'LLMs', 'NLP', 'Machine Learning (Vision)', 'AI-Assisted Dev'],
    'Developer Tools': ['Git', 'GitHub', 'Docker', 'Linux', 'REST APIs'],
  },

  experience: [
    {
      role: 'Research Intern',
      org: 'Defence Institute of Bio Energy Research (DRDO DIBER)',
      location: 'Haldwani, Uttarakhand',
      period: 'June 2025 – August 2025',
      highlights: [
        'Engineered custom multi-utility calculators grounded in real physics and statistical data to support Grade E Scientists.',
        'Awarded an Appreciation of Work Certificate by the presiding Scientist.',
      ],
      icon: 'science',
    },
    {
      role: 'Software Intern',
      org: 'Arcane Programming Infotech',
      location: 'Lucknow, Uttar Pradesh',
      period: 'June 2022 – August 2022',
      highlights: [
        'Completed comprehensive technical training.',
        'Earned the "Student of the Batch" certification.',
      ],
      icon: 'code',
    },
  ],

  projects: [
    {
      title: 'Real-Time Sign Language Recognition System',
      tags: ['Python', 'MobileNetV2', 'LSTM', 'AI/ML'],
      icon: 'sign_language',
      color: '#266c2d',
      description:
        'Engineered a real-time assistive agent utilizing a MobileNetV2 feature extractor and Bidirectional LSTM classifier for ASL alphabet recognition.',
      highlights: [
        '98.2% accuracy on 26-class ASL dataset',
        'Real-time inference at 35 FPS',
        'Published research at 5th Int\'l Conference on Modern Mathematical Methods',
        'Submitted to IMPACT2026',
        'Presented at G.L. Bajaj Group of Institutions (Jan 2026)',
      ],
    },
    {
      title: 'Custom AI Chatbot & Image Generator',
      tags: ['Node.js', 'Gemini AI', 'DALL-E-2', 'REST API'],
      icon: 'smart_toy',
      color: '#0046b8',
      description:
        'Programmed a web API chatbot integrating Gemini AI capabilities to automate task and job assignments. Developed an API-driven image generator using ChatGPT DALL-E-2.',
      highlights: [
        'Gemini AI integration for intelligent task automation',
        'DALL-E-2 image generation from text prompts',
        'REST API architecture',
        'Responsive web interface',
      ],
    },
    {
      title: 'Interactive Animated Frontend (Jungle Safari)',
      tags: ['HTML', 'CSS', 'JavaScript', 'GSAP.js'],
      icon: 'animation',
      color: '#8e2f00',
      description:
        'Designed a highly responsive web interface utilizing HTML, CSS, JavaScript, and GSAP.js for complex UI animations.',
      highlights: [
        'Complex GSAP.js animation sequences',
        'Fully responsive design',
        'High-performance rendering',
        'Interactive user experience',
      ],
    },
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

export default portfolioData;
