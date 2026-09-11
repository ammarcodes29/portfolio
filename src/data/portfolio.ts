/**
 * Single source of truth for portfolio content.
 * Everything the OS shows about Ammar lives here.
 */

export const PROFILE = {
  name: 'Ammar Suleyman',
  handle: 'ammarcodes29',
  title: 'Software Engineer · CS @ San José State',
  tagline: 'I build full-stack products, agentic AI systems, and the occasional retro operating system.',
  location: 'San José, CA',
  email: 'ammarsuleyman11@gmail.com',
  phone: '408-854-0022',
  github: 'https://github.com/ammarcodes29',
  linkedin: 'https://linkedin.com/in/ammar-suleyman',
  resumeUrl: 'AmmarSuleyman-Resume.pdf',
  avatar: 'https://avatars.githubusercontent.com/u/177102239?v=4',
  bio: [
    'Hi, I\'m Ammar. I\'m a Computer Science student at San José State University (B.S., May 2027) and most recently a Software Engineering Intern at Axon in Seattle, where I owned end-to-end delivery of a network segmentation feature across six services and four languages.',
    'Before that I spent two and a half years at Apple as a Product Specialist, translating technical depth into plain language for 150+ business and education customers. That habit of explaining systems clearly is something I bring to every codebase I touch.',
    'Outside of work I founded elafate.com, an agentic AI job-search platform, and I like building things that are a little bit fun: hand-gesture-controlled space shooters, ASL tutors that talk back, and this operating system you are looking at right now.',
  ],
};

export interface Project {
  slug: string;
  name: string;
  file: string;          // how it shows up in the file explorer
  year: string;
  blurb: string;
  details: string[];
  stack: string[];
  repo?: string;
  live?: string;
  featured?: boolean;
}

export const PROJECTS: Project[] = [
  {
    slug: 'elafate',
    name: 'elafate.com',
    file: 'elafate.exe',
    year: '2026',
    blurb: 'Agentic AI job-search platform that turns a candidate profile into a ranked application pipeline.',
    details: [
      'Founded and built the platform end to end: ATS-scored resumes, ranked applications, and a weekly execution roadmap generated through LLM tool orchestration.',
      'Designed a NestJS agent harness exposing 45 typed tools across resumes, applications, and planning, with risk-tiered approval gates, prompt-injection guards, and resumable SSE streaming.',
      'Shipped React 19 dashboards, WorkOS auth, scheduled job ingestion from Greenhouse/Lever/Ashby, and a Chrome extension that autofills applications on five ATS boards.',
    ],
    stack: ['TypeScript', 'NestJS', 'React 19', 'PostgreSQL', 'Prisma', 'OpenRouter', 'Docker'],
    live: 'https://elafate.com',
    featured: true,
  },
  {
    slug: 'signconnect',
    name: 'SignConnect',
    file: 'SignConnect.app',
    year: '2025',
    blurb: 'Real-time ASL tutor that watches your hands, talks back, and captions everything.',
    details: [
      'Combines MediaPipe hand tracking (21 landmarks per hand, client-side) with a custom sign-recognition model at 94% accuracy.',
      'Conversational voice loop: Deepgram speech recognition in, Gemini coaching, ElevenLabs streaming speech out, with natural interruption handling.',
      'Teaching and quiz modes with mastery tracking, live captions for accessibility, and a dark/light theme.',
    ],
    stack: ['TypeScript', 'Python', 'OpenCV', 'MediaPipe', 'Gemini', 'ElevenLabs', 'Deepgram'],
    repo: 'https://github.com/ammarcodes29/SignConnect',
    live: 'https://sign-connect-iota.vercel.app/',
    featured: true,
  },
  {
    slug: 'voidrunner',
    name: 'VoidRunner',
    file: 'VoidRunner.exe',
    year: '2025',
    blurb: '2D space survival shooter you can play with hand gestures.',
    details: [
      'Arcade shooter built with Pygame: wave system, frame-independent movement, sprite-group collision detection, and a state-machine game loop.',
      'OpenCV + MediaPipe integration lets you steer the ship with your hand in front of the webcam.',
      'A playable homage ships inside this OS. Double-click VoidRunner.exe on the desktop.',
    ],
    stack: ['Python', 'Pygame', 'OpenCV', 'MediaPipe'],
    repo: 'https://github.com/ammarcodes29/VoidRunner',
    featured: true,
  },
  {
    slug: 'syllabus-agent',
    name: 'Syllabus Agent',
    file: 'syllabus_agent.cf',
    year: '2025',
    blurb: 'Cloudflare-native AI agent that turns any syllabus PDF into a personalized study plan.',
    details: [
      'Runs entirely on Cloudflare: Workers AI (Llama 3.3 70B) for inference, Workflows for orchestration, Durable Objects for per-user memory.',
      'WebSocket chat UI in vanilla JavaScript, no frontend framework.',
    ],
    stack: ['TypeScript', 'Cloudflare Workers', 'Workers AI', 'Durable Objects'],
    repo: 'https://github.com/ammarcodes29/cf_ai_syllabus_agent',
  },
  {
    slug: 'gpu-triage',
    name: 'GPU Triage Copilot',
    file: 'gpu_triage.log',
    year: '2025',
    blurb: 'AI assistant that automates debugging and log analysis for GPU issues.',
    details: [
      'Streamlines log triage for hardware engineers with an LLM copilot powered by NVIDIA Nemotron.',
    ],
    stack: ['TypeScript', 'NVIDIA Nemotron', 'Next.js'],
    repo: 'https://github.com/ammarcodes29/GPU_Triage_Copilot',
    live: 'https://v0-gpu-log-analyzer.vercel.app/',
  },
  {
    slug: 'salesvision',
    name: 'SalesVision AI',
    file: 'salesvision.ipynb',
    year: '2025',
    blurb: 'Sales forecasting with gradient boosting and external feature enrichment.',
    details: [
      'Gradient boosting model enriched with external features via Upgini to forecast three-month sales trends.',
    ],
    stack: ['Python', 'pandas', 'NumPy', 'Upgini', 'Jupyter'],
    repo: 'https://github.com/ammarcodes29/SalesVision-AI',
  },
  {
    slug: 'mindsync',
    name: 'MindSync',
    file: 'MindSync.app',
    year: '2025',
    blurb: 'AI-powered study planner with an assistant that learns how you study.',
    details: [
      'Course management, assignment tracking, session scheduling, and analytics dashboards.',
      'React + TypeScript frontend with shadcn/ui, Express backend, PostgreSQL via Drizzle ORM, Passport sessions.',
    ],
    stack: ['React', 'TypeScript', 'Express', 'PostgreSQL', 'Drizzle'],
    repo: 'https://github.com/ammarcodes29/MindSync',
  },
  {
    slug: 'cryptoapi',
    name: 'CryptoAPI',
    file: 'cryptoapi.py',
    year: '2025',
    blurb: 'Production-ready FastAPI service for real-time cryptocurrency data.',
    details: [
      'Async endpoints with httpx, Pydantic v2 validation, TTL caching, rate limiting, health checks, and Docker support.',
    ],
    stack: ['Python', 'FastAPI', 'Pydantic', 'Docker'],
    repo: 'https://github.com/ammarcodes29/cryptoAPI',
  },
  {
    slug: 'ai-chatbot',
    name: 'AI Chatbot',
    file: 'chatbot.py',
    year: '2025',
    blurb: 'Conversational chatbot with memory, built with LangChain and Streamlit.',
    details: ['Remembers previous turns in the conversation. Deployed on Streamlit Cloud.'],
    stack: ['Python', 'LangChain', 'Streamlit', 'OpenAI'],
    repo: 'https://github.com/ammarcodes29/AI-Chatbot',
    live: 'https://ammarschatbot.streamlit.app/',
  },
];

export interface Experience {
  company: string;
  role: string;
  location: string;
  period: string;
  bullets: string[];
  stack?: string[];
}

export const EXPERIENCE: Experience[] = [
  {
    company: 'Axon Enterprise',
    role: 'Software Engineering Intern',
    location: 'Seattle, WA',
    period: 'May 2026 – Aug 2026',
    bullets: [
      'Owned end-to-end delivery of a network segmentation feature for an enterprise healthcare customer, spanning 6 services and 4 languages (Scala, TypeScript/React, Thrift, SQL) with a feature-flagged production rollout.',
      'Built the Scala backend: database schema, transactional persistence layer, and a backward-compatible Thrift API enabling devices to be assigned network settings by group.',
      'Fixed a caching bug leaking network settings between devices by restructuring the encrypted cache, deployed with zero downtime.',
      'Traced intermittent production failures to a stale pod the load balancer kept routing to after deploys, then partnered with the platform team to correct the Kubernetes and ArgoCD configuration.',
      'Instrumented production monitoring with logging, metrics, and dashboards in Splunk, OpenTelemetry, and Grafana.',
    ],
    stack: ['Scala', 'TypeScript', 'React', 'Thrift', 'SQL', 'Kubernetes', 'ArgoCD', 'Splunk', 'OpenTelemetry', 'Grafana'],
  },
  {
    company: 'Apple',
    role: 'Product Specialist',
    location: 'San José, CA',
    period: 'Oct 2023 – May 2026',
    bullets: [
      'Drove $1M+ in sales by combining technical product knowledge, customer discovery, and solution-based recommendations across Apple hardware, software, and services.',
      'Delivered tailored technology solutions for 150+ business and education customers, supporting Apple\'s Business Team through device recommendations, workflow guidance, and customer success.',
      'Reduced issue resolution time by 20% by streamlining troubleshooting workflows for software setup, device configuration, account issues, and product adoption.',
    ],
  },
  {
    company: 'Headstarter AI',
    role: 'Software Engineer Fellow',
    location: 'Remote, US',
    period: 'Jul 2024 – Sep 2024',
    bullets: [
      'Developed AI-powered full-stack applications with Next.js, OpenAI APIs, and backend services, shipping MVPs from product requirements through deployment in weekly engineering sprints.',
      'Worked in a 3-person engineering team to design APIs, debug production issues, and improve reliability using Git, Agile workflows, CI/CD, and code review.',
    ],
    stack: ['Next.js', 'OpenAI API', 'CI/CD'],
  },
];

export const EDUCATION = {
  school: 'San José State University',
  degree: 'B.S. Computer Science',
  period: 'Expected May 2027',
  location: 'San José, CA',
  coursework: [
    'Data Structures & Algorithms', 'Operating Systems', 'Computer Architecture',
    'Artificial Intelligence', 'Information Security', 'Databases',
    'Web Programming', 'Machine Learning', 'Advanced Python Programming',
  ],
};

export const SKILLS: Record<string, string[]> = {
  Languages: ['Python', 'Java', 'Scala', 'TypeScript', 'JavaScript', 'Swift', 'C/C++', 'SQL'],
  'Frameworks & Libraries': ['React', 'Node.js', 'Express', 'NestJS', 'FastAPI', 'SwiftUI', 'Apache Thrift', 'OpenCV', 'MediaPipe'],
  'Infrastructure & Observability': ['PostgreSQL', 'Docker', 'Kubernetes', 'AWS EC2', 'ArgoCD', 'Splunk', 'OpenTelemetry', 'Grafana', 'Statsig', 'Prisma'],
  'AI / ML': ['OpenRouter', 'Agentic AI workflows', 'LangChain / LangGraph', 'TensorFlow', 'PyTorch', 'pandas', 'NumPy'],
};

export const LINKS = [
  { label: 'GitHub', url: PROFILE.github, note: 'ammarcodes29 · 12 public repos' },
  { label: 'LinkedIn', url: PROFILE.linkedin, note: 'ammar-suleyman' },
  { label: 'elafate.com', url: 'https://elafate.com', note: 'Agentic job-search platform I founded' },
  { label: 'SignConnect', url: 'https://sign-connect-iota.vercel.app/', note: 'Live demo · ASL tutor' },
  { label: 'AI Chatbot', url: 'https://ammarschatbot.streamlit.app/', note: 'Live demo · Streamlit' },
  { label: 'GPU Triage Copilot', url: 'https://v0-gpu-log-analyzer.vercel.app/', note: 'Live demo' },
];

export const OS = {
  name: 'SpartanOS',
  version: '1.0',
  vendor: 'Analog Echo Systems',
  model: 'AE-98 Personal Workstation',
  year: 2026,
};
