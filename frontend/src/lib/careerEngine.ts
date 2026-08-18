import type { ChatResponse, UserProfile, CareerRecommendation, CareerGraph } from '../types';

export const CAREER_MAP = [
  {
    name: 'Full Stack Developer',
    category: 'Software Engineering',
    aliases: ['full stack', 'fullstack', 'web developer', 'full stack dev', 'full stack developer', 'web development'],
    skills: ['HTML', 'CSS', 'JavaScript', 'TypeScript', 'React', 'Node.js', 'Python', 'SQL', 'Git', 'REST APIs', 'Docker'],
    qualifications: ['any degree', 'bsc', 'bca', 'mca', 'btech', 'be', 'diploma'],
    roadmap: [
      { phase: 'Phase 1: Modern Frontend Fundamentals', skills: ['HTML5/CSS3', 'JavaScript (ES6+)', 'Git'] },
      { phase: 'Phase 2: Frontend Frameworks & State', skills: ['React', 'TypeScript', 'TailwindCSS'] },
      { phase: 'Phase 3: Backend APIs & Databases', skills: ['Node.js / Express', 'PostgreSQL / MongoDB', 'REST APIs'] },
      { phase: 'Phase 4: Full Stack Integration & Deployment', skills: ['Authentication (JWT/OAuth)', 'Docker', 'CI/CD Deployment'] }
    ]
  },
  {
    name: 'Backend Developer',
    category: 'Software Engineering',
    aliases: ['backend', 'back end', 'backend dev', 'backend developer', 'server side', 'api developer'],
    skills: ['Python', 'Java', 'Node.js', 'SQL', 'PostgreSQL', 'Redis', 'REST APIs', 'Docker', 'Git', 'System Design'],
    qualifications: ['any degree', 'bsc', 'bca', 'mca', 'btech', 'be'],
    roadmap: [
      { phase: 'Phase 1: Deep Language Mastery & OOP', skills: ['Python / Java Advanced', 'Data Structures & Algorithms', 'Git'] },
      { phase: 'Phase 2: Database Design & Query Tuning', skills: ['PostgreSQL', 'SQL Optimization', 'Redis Caching'] },
      { phase: 'Phase 3: Scalable Web APIs & Microservices', skills: ['FastAPI / Spring Boot / Express', 'REST & gRPC', 'Docker'] },
      { phase: 'Phase 4: High-Scale System Design', skills: ['Message Queues (Kafka/RabbitMQ)', 'System Design', 'Cloud Basics'] }
    ]
  },
  {
    name: 'Frontend Developer',
    category: 'Software Engineering',
    aliases: ['frontend', 'front end', 'frontend dev', 'frontend developer', 'ui developer', 'react developer'],
    skills: ['HTML', 'CSS', 'JavaScript', 'TypeScript', 'React', 'Next.js', 'TailwindCSS', 'Git', 'REST APIs'],
    qualifications: ['any degree', 'bsc', 'bca', 'mca', 'btech', 'be'],
    roadmap: [
      { phase: 'Phase 1: Semantic HTML, Modern CSS & JS', skills: ['Semantic HTML', 'Flexbox/Grid & Responsive Design', 'JavaScript ES6+'] },
      { phase: 'Phase 2: React Ecosystem & TypeScript', skills: ['React Hooks', 'TypeScript', 'Component Architecture'] },
      { phase: 'Phase 3: State, Routing & SSR', skills: ['Next.js / Vite', 'Redux Toolkit / Zustand', 'TailwindCSS'] },
      { phase: 'Phase 4: Performance & Handoff', skills: ['Lighthouse Optimization', 'Testing (Jest/Playwright)', 'API Integration'] }
    ]
  },
  {
    name: 'QA / Automation Tester',
    category: 'Quality Assurance',
    aliases: ['qa', 'tester', 'testing', 'software tester', 'automation tester', 'quality assurance', 'software testing'],
    skills: ['Manual Testing', 'Test Cases', 'Bug Reporting', 'Selenium', 'Playwright', 'Python', 'Java', 'API Testing', 'Postman', 'SQL'],
    qualifications: ['any degree', 'bsc', 'bca', 'mca', 'btech', 'be', 'diploma'],
    roadmap: [
      { phase: 'Phase 1: Testing Fundamentals & SDLC', skills: ['Manual Testing', 'Test Case Design', 'Jira & Bug Life Cycle', 'SQL Basics'] },
      { phase: 'Phase 2: Programming for Automation', skills: ['Python / Java Fundamentals', 'OOP Concepts', 'Git'] },
      { phase: 'Phase 3: Web & API Test Automation', skills: ['Selenium WebDriver / Playwright', 'PyTest / TestNG', 'Postman API Testing'] },
      { phase: 'Phase 4: CI/CD Test Pipelines', skills: ['Jenkins / GitHub Actions', 'Page Object Model (POM)', 'Performance Testing'] }
    ]
  },
  {
    name: 'Data Analyst',
    category: 'Data & Analytics',
    aliases: ['data analyst', 'analytics', 'business data analyst', 'bi analyst', 'data analytics'],
    skills: ['Excel', 'SQL', 'Python', 'Statistics', 'Power BI', 'Tableau', 'Pandas', 'Data Cleaning'],
    qualifications: ['any degree', 'bsc', 'bca', 'mca', 'bcom', 'btech', 'mba', 'be'],
    roadmap: [
      { phase: 'Phase 1: Spreadsheets & SQL', skills: ['Advanced Excel', 'SQL Queries, Joins & Aggregations'] },
      { phase: 'Phase 2: BI Dashboards', skills: ['Power BI / Tableau', 'Data Modeling', 'Dashboard UI/UX'] },
      { phase: 'Phase 3: Python Data Analysis', skills: ['Python (Pandas, NumPy)', 'Matplotlib & Seaborn', 'Exploratory Data Analysis'] },
      { phase: 'Phase 4: Statistics & Storytelling', skills: ['Descriptive Statistics', 'A/B Testing Basics', 'Executive Reporting'] }
    ]
  },
  {
    name: 'Data Scientist',
    category: 'Data & Analytics',
    aliases: ['data scientist', 'data science', 'ds'],
    skills: ['Python', 'Statistics', 'Machine Learning', 'Data Analysis', 'Pandas', 'Scikit-Learn', 'SQL', 'Deep Learning'],
    qualifications: ['any degree', 'bsc', 'bca', 'mca', 'btech', 'be', 'msc'],
    roadmap: [
      { phase: 'Phase 1: Python Data Science & Math', skills: ['Python', 'Linear Algebra & Calculus', 'NumPy & Pandas', 'SQL'] },
      { phase: 'Phase 2: Machine Learning Algorithms', skills: ['Scikit-Learn', 'Regression, Classification & Clustering', 'Feature Engineering'] },
      { phase: 'Phase 3: Advanced ML & Model Evaluation', skills: ['XGBoost', 'Cross-Validation & Hyperparameter Tuning', 'Model Metrics'] },
      { phase: 'Phase 4: Deep Learning & Deployment', skills: ['FastAPI Model Serving', 'PyTorch / TensorFlow Basics', 'MLflow'] }
    ]
  },
  {
    name: 'AI/ML Engineer',
    category: 'AI & Machine Learning',
    aliases: ['ai engineer', 'ml engineer', 'ai/ml engineer', 'machine learning engineer', 'ai developer'],
    skills: ['Python', 'PyTorch', 'TensorFlow', 'Machine Learning', 'Deep Learning', 'Transformers', 'Vector Databases', 'LangChain', 'Docker'],
    qualifications: ['any degree', 'bsc', 'bca', 'mca', 'btech', 'be'],
    roadmap: [
      { phase: 'Phase 1: Deep Python & Math Fundamentals', skills: ['Python Async & OOP', 'Linear Algebra', 'PyTorch Tensors'] },
      { phase: 'Phase 2: Deep Learning & NLP Architectures', skills: ['CNNs & RNNs', 'Transformers & HuggingFace', 'Model Fine-tuning'] },
      { phase: 'Phase 3: LLMs, RAG & Vector Search', skills: ['RAG Architecture', 'Vector DBs (Pinecone/Chroma)', 'LangChain / LlamaIndex'] },
      { phase: 'Phase 4: MLOps & High-Scale Serving', skills: ['vLLM / TensorRT', 'Docker & Kubernetes', 'Model Monitoring & Quantization'] }
    ]
  },
  {
    name: 'Cybersecurity Analyst',
    category: 'Security',
    aliases: ['cybersecurity', 'security', 'cyber security analyst', 'ethical hacker', 'soc analyst'],
    skills: ['Networking', 'Linux', 'Cryptography', 'Security', 'Ethical Hacking', 'SIEM (Splunk)', 'Wireshark', 'Python'],
    qualifications: ['any degree', 'bsc', 'bca', 'mca', 'btech', 'be'],
    roadmap: [
      { phase: 'Phase 1: Networking & Linux Basics', skills: ['TCP/IP, DNS & OSI Model', 'Linux Command Line & Permissions', 'Wireshark'] },
      { phase: 'Phase 2: Security Principles & Threats', skills: ['Cryptography (PKI, Hashing)', 'OWASP Top 10', 'Vulnerability Assessment'] },
      { phase: 'Phase 3: SOC Operations & SIEM', skills: ['Splunk / Sentinel SIEM', 'Log Analysis & Incident Triage', 'Python Security Scripting'] },
      { phase: 'Phase 4: Applied Defense & Cert Prep', skills: ['CompTIA Security+ Topics', 'Firewall Configuration', 'Incident Forensics'] }
    ]
  },
  {
    name: 'Cloud & DevOps Engineer',
    category: 'Cloud & Infrastructure',
    aliases: ['cloud engineer', 'devops', 'devops engineer', 'cloud architect', 'sre', 'aws engineer'],
    skills: ['AWS', 'Linux', 'Docker', 'Kubernetes', 'CI/CD', 'Terraform', 'Python', 'Bash Scripting', 'Git'],
    qualifications: ['any degree', 'bsc', 'bca', 'mca', 'btech', 'be'],
    roadmap: [
      { phase: 'Phase 1: Linux, Shell & Cloud Basics', skills: ['Linux Administration', 'Bash Scripting', 'AWS Core Services (EC2, S3, IAM)'] },
      { phase: 'Phase 2: Containers & Orchestration', skills: ['Docker Containerization', 'Docker Compose', 'Kubernetes (K8s) Basics'] },
      { phase: 'Phase 3: Infrastructure as Code & CI/CD', skills: ['Terraform', 'GitHub Actions / Jenkins Pipelines', 'AWS VPC'] },
      { phase: 'Phase 4: Monitoring & Production SRE', skills: ['Prometheus & Grafana', 'CloudWatch Alerts', 'Cost Optimization'] }
    ]
  }
];

export function runClientSideCareerEngine(
  message: string,
  existingProfile: UserProfile
): ChatResponse {
  const msgLower = ' ' + message.toLowerCase() + ' ';

  const profile: UserProfile = {
    qualification: existingProfile.qualification || null,
    skills: [...(existingProfile.skills || [])],
    target_career: existingProfile.target_career || null,
    domain: existingProfile.domain || null,
    interests: [...(existingProfile.interests || [])]
  };

  // 1. Extract qualification with clean word boundaries
  const qualMatch = msgLower.match(/(^|[^a-z0-9])(mca|bca|b\.?\s*tech|bsc|msc|mba|bcom|bba|diploma)([^a-z0-9]|$)/i);
  if (qualMatch) {
    profile.qualification = qualMatch[2].toUpperCase().replace(/\./g, '').replace(/\s+/g, '');
  }

  // 2. Extract skills using boundary matching
  const skillKeywords: Record<string, string[]> = {
    'Python': ['python', 'py', 'python3'],
    'Java': ['java', 'core java'],
    'C++': ['c++', 'cpp'],
    'JavaScript': ['javascript', 'js'],
    'TypeScript': ['typescript', 'ts'],
    'React': ['react', 'reactjs'],
    'Node.js': ['node', 'nodejs'],
    'HTML': ['html', 'html5'],
    'CSS': ['css', 'css3', 'tailwind'],
    'SQL': ['sql', 'mysql', 'postgres', 'postgresql', 'database'],
    'Docker': ['docker'],
    'Git': ['git', 'github'],
    'AWS': ['aws', 'cloud'],
    'Selenium': ['selenium'],
    'Manual Testing': ['manual testing', 'test cases', 'testing']
  };

  const detectedSkills = new Set(profile.skills);
  for (const [canonical, aliases] of Object.entries(skillKeywords)) {
    for (const alias of aliases) {
      if (new RegExp('(^|[^a-z0-9])' + alias + '([^a-z0-9]|$)', 'i').test(msgLower)) {
        detectedSkills.add(canonical);
        break;
      }
    }
  }
  profile.skills = Array.from(detectedSkills);

  // 3. Extract Target Role
  for (const career of CAREER_MAP) {
    for (const alias of career.aliases) {
      if (new RegExp('(^|[^a-z0-9])' + alias + '([^a-z0-9]|$)', 'i').test(msgLower)) {
        profile.target_career = career.name;
        profile.domain = career.name;
        break;
      }
    }
  }

  // Score Careers
  const recommendations: CareerRecommendation[] = [];
  const userSkillsSet = new Set(profile.skills.map(s => s.toLowerCase()));
  const targetLower = (profile.target_career || '').toLowerCase();
  const qualLower = (profile.qualification || '').toLowerCase();

  for (const career of CAREER_MAP) {
    const matched: string[] = [];
    const missing: string[] = [];
    let score = 0;
    const why: string[] = [];

    for (const s of career.skills) {
      if (userSkillsSet.has(s.toLowerCase())) {
        matched.push(s);
      } else {
        missing.push(s);
      }
    }

    if (matched.length > 0) {
      score += Math.floor((matched.length / career.skills.length) * 50) + 15;
      why.push(`Matches your known skills: ${matched.slice(0, 3).join(', ')}`);
    }

    if (targetLower && career.aliases.some(a => targetLower.includes(a) || a.includes(targetLower))) {
      score += 35;
      why.push(`Aligns directly with your target goal: ${career.name}`);
    }

    if (qualLower && career.qualifications.some(q => q.includes(qualLower) || q === 'any degree')) {
      score += 15;
      why.push(`Matches your educational background: ${profile.qualification}`);
    }

    if (score > 0 || profile.target_career === career.name) {
      recommendations.push({
        career: career.name,
        category: career.category,
        score: Math.min(score, 98),
        matched_skills: matched,
        missing_skills: missing,
        why: why.length > 0 ? why : ['Viable pathway matching your profile'],
        learning_roadmap: career.roadmap
      });
    }
  }

  recommendations.sort((a, b) => b.score - a.score);

  const topRec = recommendations[0];
  const whatToLearn = topRec ? topRec.missing_skills.slice(0, 6) : [];

  // Build Answer Text
  let answer = '';
  if (profile.target_career && profile.skills.length > 0) {
    answer = `### 🎯 Target Career Path: ${profile.target_career}\n\n` +
      `✅ **Your Existing Strengths:** *${profile.skills.join(', ')}*\n` +
      `Having strong programming foundations in ${profile.skills.join(' & ')} gives you a huge head start for ${profile.target_career}.\n\n` +
      `### 📚 Exact Skills to Learn Next:\n` +
      whatToLearn.map(s => `- **${s}**`).join('\n') + '\n\n' +
      `### 💡 Recommended 3-Step Strategy:\n` +
      `1. **Core Frameworks**: Deep dive into modern APIs, state management & databases.\n` +
      `2. **Production Architecture**: Implement authentication, containerization with Docker, and CI/CD pipelines.\n` +
      `3. **Proof-of-Work Portfolio**: Build 2 end-to-end projects on GitHub to showcase to hiring managers.`;
  } else if (profile.qualification && !profile.target_career && profile.skills.length === 0) {
    answer = `### 🎓 Great! With a **${profile.qualification}** degree, here are your highest-growth tech paths:\n\n` +
      `1. **Full Stack / Backend Developer** (High demand)\n` +
      `2. **Data Analyst & BI Specialist**\n` +
      `3. **QA & Automation Tester**\n` +
      `4. **Cloud & DevOps Engineer**\n\n` +
      `What programming languages (Python, Java, JavaScript, C++, SQL) do you already know or enjoy?`;
  } else if (profile.target_career) {
    answer = `### 🎯 Roadmap for ${profile.target_career}\n\n` +
      `To land a high-paying role as a **${profile.target_career}**, here are the core skills to master:\n` +
      whatToLearn.map(s => `- **${s}**`).join('\n') + '\n\n' +
      `What tools or coding languages do you already have experience with?`;
  } else {
    answer = `👋 **Welcome to Shadow Career Finder!**\n\n` +
      `Tell me your current degree, the coding languages you know, or your target role (e.g. *Full Stack Developer, QA Tester, Data Scientist*) to build your custom roadmap!`;
  }

  // Build Graph
  const graph: CareerGraph = {
    nodes: [
      { id: 'user_profile', label: profile.qualification ? `🎓 ${profile.qualification} Profile` : '🚀 Career Explorer', type: 'start' }
    ],
    edges: []
  };

  if (profile.skills.length > 0) {
    graph.nodes.push({ id: 'known_skills', label: `⚡ Strengths: ${profile.skills.slice(0, 3).join(', ')}`, type: 'matched_skill' });
    graph.edges.push({ source: 'user_profile', target: 'known_skills', label: 'Has' });
  }

  const connectFrom = profile.skills.length > 0 ? 'known_skills' : 'user_profile';
  recommendations.slice(0, 3).forEach((r, idx) => {
    const id = `career_${idx + 1}`;
    graph.nodes.push({ id, label: `🎯 ${r.career} (${r.score}%)`, type: 'career' });
    graph.edges.push({ source: connectFrom, target: id, label: `${r.score}% Match` });

    if (idx === 0 && r.missing_skills.length > 0) {
      graph.nodes.push({ id: 'learn_next', label: `📚 Learn: ${r.missing_skills.slice(0, 3).join(', ')}`, type: 'missing_skill' });
      graph.edges.push({ source: id, target: 'learn_next', label: 'Next Steps' });
    }
  });

  return {
    answer,
    recommendations: recommendations.slice(0, 4),
    graph,
    user_profile: profile,
    what_to_learn_next: whatToLearn,
    source: 'client-engine'
  };
}
