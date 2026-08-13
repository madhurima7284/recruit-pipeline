export const INITIAL_JOBS = [
  {
    id: 'job-101',
    title: 'Senior AI / ML Engineer',
    department: 'Engineering',
    location: 'San Francisco, CA (Hybrid)',
    employmentType: 'Full-time',
    description: 'We are seeking an experienced Senior AI/ML Engineer to build next-generation agentic workflows, LLM applications, LangGraph graphs, and vector retrieval pipelines using Gemini and Python.',
    requirements: [
      '5+ years of software development experience with Python, FastAPI, and PyTorch/TensorFlow.',
      'Strong expertise in LLM fine-tuning, RAG architecture, vector search, and LangGraph orchestration.',
      'Hands-on experience with PostgreSQL, pgvector, and cloud deployments on GCP/AWS.',
      'Proven track record of deploying ML models to production with robust monitoring.'
    ],
    requiredSkills: ['Python', 'FastAPI', 'LangGraph', 'Gemini API', 'PostgreSQL', 'pgvector', 'PyTorch'],
    preferredSkills: ['Docker', 'Kubernetes', 'React', 'TypeScript', 'MLOps', 'LangChain'],
    minExperienceYears: 5,
    educationRequired: "Master's or Bachelor's in Computer Science, Data Science, or AI",
    status: 'ACTIVE',
    createdAt: '2026-08-01T10:00:00Z',
    candidateCount: 4
  },
  {
    id: 'job-102',
    title: 'Lead Full Stack React Engineer',
    department: 'Product Development',
    location: 'Remote',
    employmentType: 'Full-time',
    description: 'Join our dynamic platform team to build responsive, accessible web dashboards using React 19, TypeScript, Vite, and Tailwind CSS integrated with Node/Express backends.',
    requirements: [
      '6+ years front-end engineering with React, TypeScript, and modern state management.',
      'Proficiency with Tailwind CSS, Vite, component architecture, and performance optimization.',
      'Experience with REST APIs, GraphQL, and server-side integration.',
      'Strong understanding of UI/UX design systems and WCAG accessibility standards.'
    ],
    requiredSkills: ['React', 'TypeScript', 'Tailwind CSS', 'Vite', 'Node.js', 'REST APIs'],
    preferredSkills: ['Express', 'D3.js', 'Next.js', 'Cypress', 'Figma'],
    minExperienceYears: 6,
    educationRequired: "Bachelor's in Computer Science or equivalent practical experience",
    status: 'ACTIVE',
    createdAt: '2026-08-03T14:30:00Z',
    candidateCount: 3
  },
  {
    id: 'job-103',
    title: 'Senior DevOps & Cloud Infrastructure Lead',
    department: 'Operations',
    location: 'Austin, TX (On-site)',
    employmentType: 'Full-time',
    description: 'Looking for a DevOps lead to automate Cloud Run, Kubernetes, PostgreSQL clusters, and CI/CD automation pipelines for enterprise AI systems.',
    requirements: [
      '4+ years managing infrastructure on Google Cloud Platform or AWS.',
      'Expertise in Terraform, Docker, Docker Compose, and Kubernetes (GKE).',
      'Solid experience with CI/CD tools (GitHub Actions, GitLab CI) and monitoring (Prometheus, Grafana).'
    ],
    requiredSkills: ['Docker', 'Kubernetes', 'GCP', 'Terraform', 'CI/CD', 'PostgreSQL'],
    preferredSkills: ['Python', 'Bash', 'Helm', 'ArgoCD'],
    minExperienceYears: 4,
    educationRequired: "Bachelor's in Information Technology or Computer Engineering",
    status: 'ACTIVE',
    createdAt: '2026-08-05T09:15:00Z',
    candidateCount: 2
  }
];

export const INITIAL_CANDIDATES = [
  {
    id: 'cand-201',
    name: 'Alexandra Vance',
    email: 'alexandra.vance@example.com',
    phone: '+1 (555) 234-5678',
    location: 'San Jose, CA',
    currentTitle: 'Senior Machine Learning Specialist',
    totalExperienceYears: 6,
    summary: 'Lead AI Engineer with 6 years building production LLM agents, vector databases, and semantic search systems using Python, Gemini API, LangGraph, FastAPI, and pgvector.',
    skills: ['Python', 'FastAPI', 'LangGraph', 'Gemini API', 'PostgreSQL', 'pgvector', 'PyTorch', 'Docker', 'React', 'TypeScript'],
    experiences: [
      {
        company: 'Apex AI Technologies',
        title: 'Senior AI Engineer',
        duration: '2023 - Present (3 yrs)',
        description: 'Architected multi-agent RAG pipelines using LangGraph and Gemini API. Integrated pgvector for semantic search over 2M+ embeddings with sub-50ms latency.',
        highlights: ['Reduced candidate matching latency by 65%', 'Built FastAPI services handling 10k daily requests']
      },
      {
        company: 'DataPulse Systems',
        title: 'Machine Learning Engineer',
        duration: '2020 - 2023 (3 yrs)',
        description: 'Developed NLP feature extraction pipelines, document parsers, and custom classifier models in PyTorch.',
        highlights: ['Trained BERT models for document categorisation with 94% accuracy']
      }
    ],
    education: [
      {
        degree: "Master of Science",
        field: "Computer Science (AI Specialization)",
        institution: "Stanford University",
        year: "2020"
      }
    ],
    rawResumeText: `ALEXANDRA VANCE
San Jose, CA | alexandra.vance@example.com | +1 (555) 234-5678

SUMMARY
Senior AI Engineer with 6 years building production LLM agents, vector search systems, and semantic matching engines using Python, Gemini API, LangGraph, FastAPI, and pgvector.

EXPERIENCE
Apex AI Technologies - Senior AI Engineer (2023 - Present)
- Architected multi-agent RAG pipelines using LangGraph, Gemini API, and FastAPI.
- Integrated pgvector for high-performance vector search over 2,000,000 document embeddings.
- Reduced candidate matching latency by 65% and improved semantic precision by 28%.

DataPulse Systems - Machine Learning Engineer (2020 - 2023)
- Developed NLP classification pipelines and custom PyTorch models.
- Built automated PDF resume parsing services with structured json extraction.

SKILLS
Python, FastAPI, LangGraph, Gemini API, PostgreSQL, pgvector, PyTorch, Docker, React, TypeScript, MLOps.

EDUCATION
M.S. in Computer Science - Stanford University (2020)`,
    uploadedAt: '2026-08-06T11:00:00Z',
    resumeFileName: 'alexandra_vance_resume.pdf'
  },
  {
    id: 'cand-202',
    name: 'Marcus Chen',
    email: 'marcus.chen@example.com',
    phone: '+1 (555) 876-5432',
    location: 'Seattle, WA',
    currentTitle: 'Frontend Developer',
    totalExperienceYears: 3,
    summary: 'Frontend developer with 3 years experience building React interfaces with TypeScript, HTML/CSS, and Tailwind. Basic knowledge of Python and REST APIs.',
    skills: ['React', 'TypeScript', 'Tailwind CSS', 'Vite', 'JavaScript', 'HTML/CSS', 'Python', 'Git'],
    experiences: [
      {
        company: 'Nimbus Web Studio',
        title: 'Frontend Developer',
        duration: '2023 - Present (3 yrs)',
        description: 'Built customer dashboards and interactive UI components in React and TypeScript.',
        highlights: ['Designed responsive landing pages and component libraries']
      }
    ],
    education: [
      {
        degree: "Bachelor of Science",
        field: "Software Engineering",
        institution: "University of Washington",
        year: "2023"
      }
    ],
    rawResumeText: `MARCUS CHEN
Seattle, WA | marcus.chen@example.com

SUMMARY
Frontend Developer with 3 years experience building responsive web interfaces in React, TypeScript, and Tailwind CSS.

EXPERIENCE
Nimbus Web Studio - Frontend Developer (2023 - Present)
- Built interactive web dashboards using React 18, TypeScript, Vite, and Tailwind CSS.
- Created reusable UI component libraries and connected REST API endpoints.

SKILLS
React, TypeScript, Tailwind CSS, Vite, HTML/CSS, JavaScript, Python, REST APIs.

EDUCATION
B.S. Software Engineering - University of Washington (2023)`,
    uploadedAt: '2026-08-07T09:30:00Z',
    resumeFileName: 'marcus_chen_cv.docx'
  },
  {
    id: 'cand-203',
    name: 'David K. O\'Connor',
    email: 'david.oconnor@example.com',
    phone: '+1 (555) 432-1098',
    location: 'Chicago, IL',
    currentTitle: 'Backend Engineer',
    totalExperienceYears: 4,
    summary: 'Backend software developer specializing in Java and Flask APIs. Interested in transitioning to AI/ML engineering.',
    skills: ['Java', 'Spring Boot', 'Python', 'Flask', 'PostgreSQL', 'SQL', 'Docker', 'Git'],
    experiences: [
      {
        company: 'Midwest Financial Tech',
        title: 'Backend Software Developer',
        duration: '2022 - Present (4 yrs)',
        description: 'Maintained banking transaction microservices in Java Spring Boot and PostgreSQL.',
        highlights: ['Optimized SQL queries reducing execution time by 40%']
      }
    ],
    education: [
      {
        degree: "Bachelor of Science",
        field: "Computer Science",
        institution: "University of Illinois Chicago",
        year: "2022"
      }
    ],
    rawResumeText: `DAVID K. O'CONNOR
Chicago, IL | david.oconnor@example.com

SUMMARY
Backend Software Developer with 4 years experience in Java, Python, and SQL databases.

EXPERIENCE
Midwest Financial Tech - Backend Developer (2022 - Present)
- Developed secure transaction processing microservices in Java and Flask.
- Managed PostgreSQL database schemas and optimized complex SQL joins.

SKILLS
Java, Spring Boot, Python, Flask, PostgreSQL, SQL, Docker, Git.

EDUCATION
B.S. Computer Science - UIC (2022)`,
    uploadedAt: '2026-08-08T15:20:00Z',
    resumeFileName: 'david_oconnor_resume.pdf'
  }
];

export const INITIAL_SCREENING_RESULTS = {
  'cand-201_job-101': {
    id: 'sr-301',
    candidateId: 'cand-201',
    jobId: 'job-101',
    overallScore: 92,
    subScores: {
      semanticSimilarity: 94,
      requiredSkillsMatch: 100,
      preferredSkillsMatch: 83,
      experienceMatch: 100,
      educationMatch: 95
    },
    decision: 'SHORTLIST',
    matchedSkills: ['Python', 'FastAPI', 'LangGraph', 'Gemini API', 'PostgreSQL', 'pgvector', 'PyTorch'],
    missingSkills: [],
    preferredSkillsMatched: ['Docker', 'React', 'TypeScript', 'MLOps'],
    strengths: [
      'Direct hands-on production experience with LangGraph and Gemini API agents.',
      'Proven expertise with pgvector and high-scale vector retrieval optimization.',
      'Strong educational background with an M.S. in CS from Stanford University.',
      'Exceeds minimum experience requirement (6 years vs 5 required).'
    ],
    weaknesses: [
      'Has not explicitly mentioned Kubernetes, though Docker experience is strong.'
    ],
    potentialConcerns: [
      'High market demand candidate; may require fast interview loop.'
    ],
    llmExplanation: 'Alexandra Vance is an exceptional candidate for the Senior AI/ML Engineer position. She possesses 100% of the required technical skills including Python, FastAPI, LangGraph, Gemini API, and pgvector. Her semantic similarity vector score is 94%, reflecting deep domain alignment between her past accomplishments at Apex AI and the job requirements.',
    recommendedAction: 'Proceed directly to technical interview with lead recruiter.',
    screenedAt: '2026-08-06T11:15:00Z'
  },
  'cand-202_job-101': {
    id: 'sr-302',
    candidateId: 'cand-202',
    jobId: 'job-101',
    overallScore: 42,
    subScores: {
      semanticSimilarity: 48,
      requiredSkillsMatch: 28,
      preferredSkillsMatch: 33,
      experienceMatch: 60,
      educationMatch: 75
    },
    decision: 'REJECT',
    matchedSkills: ['Python'],
    missingSkills: ['FastAPI', 'LangGraph', 'Gemini API', 'PostgreSQL', 'pgvector', 'PyTorch'],
    preferredSkillsMatched: ['React', 'TypeScript'],
    strengths: [
      'Strong React and TypeScript front-end experience.',
      'Clear communicator with clean resume structure.'
    ],
    weaknesses: [
      'Lacks essential AI/ML, vector search, and LangGraph experience.',
      'Only 3 years total experience compared to the 5 years required.',
      'Primary background is in UI/UX development rather than backend/ML engineering.'
    ],
    potentialConcerns: [
      'Significant technical skill gap for a Senior AI role.'
    ],
    llmExplanation: 'Marcus Chen is primarily a frontend web developer. While he possesses strong React and basic Python familiarity, he lacks crucial AI/ML competencies such as LangGraph, vector search, pgvector, and PyTorch. His experience level (3 years) falls below the 5-year requirement for this senior position.',
    recommendedAction: 'Send candidate a polite rejection notice; tag candidate for future Lead Frontend positions.',
    screenedAt: '2026-08-07T09:40:00Z'
  },
  'cand-203_job-101': {
    id: 'sr-303',
    candidateId: 'cand-203',
    jobId: 'job-101',
    overallScore: 61,
    subScores: {
      semanticSimilarity: 65,
      requiredSkillsMatch: 43,
      preferredSkillsMatch: 25,
      experienceMatch: 80,
      educationMatch: 85
    },
    decision: 'REVIEW',
    matchedSkills: ['Python', 'PostgreSQL'],
    missingSkills: ['FastAPI', 'LangGraph', 'Gemini API', 'pgvector', 'PyTorch'],
    preferredSkillsMatched: ['Docker'],
    strengths: [
      'Solid backend developer with 4 years experience in Python, Flask, and SQL databases.',
      'Strong relational database query optimization skills in PostgreSQL.'
    ],
    weaknesses: [
      'No direct exposure to LLM frameworks, LangGraph, or pgvector.',
      'Slightly under the 5-year experience requirement (has 4 years).'
    ],
    potentialConcerns: [
      'Will require onboarding time to master LLM agent architecture and pgvector.'
    ],
    llmExplanation: 'David O\'Connor has strong core backend software engineering fundamentals in Python, Flask, and PostgreSQL. While he lacks specific AI/ML tooling like LangGraph and pgvector, his relational database background makes him a trainable borderline candidate worth reviewing if additional engineering depth is needed.',
    recommendedAction: 'Keep under review; schedule brief technical screening if top pool candidates decline.',
    screenedAt: '2026-08-08T15:30:00Z'
  }
};

export const INITIAL_APPLICATIONS = [
  {
    id: 'app-401',
    candidateId: 'cand-201',
    jobId: 'job-101',
    status: 'SHORTLIST',
    appliedAt: '2026-08-06T11:00:00Z',
    updatedAt: '2026-08-06T11:15:00Z',
    screeningResult: INITIAL_SCREENING_RESULTS['cand-201_job-101'],
    emailSent: true,
    notes: ['Recruiter Note: High priority candidate with Stanford degree and LangGraph experience.']
  },
  {
    id: 'app-402',
    candidateId: 'cand-202',
    jobId: 'job-101',
    status: 'REJECT',
    appliedAt: '2026-08-07T09:30:00Z',
    updatedAt: '2026-08-07T09:40:00Z',
    screeningResult: INITIAL_SCREENING_RESULTS['cand-202_job-101'],
    emailSent: true,
    notes: ['Automated decision: Skills gap in AI/ML tooling.']
  },
  {
    id: 'app-403',
    candidateId: 'cand-203',
    jobId: 'job-101',
    status: 'REVIEW',
    appliedAt: '2026-08-08T15:20:00Z',
    updatedAt: '2026-08-08T15:30:00Z',
    screeningResult: INITIAL_SCREENING_RESULTS['cand-203_job-101'],
    emailSent: false,
    notes: ['Pending recruiter manual review for backend transition potential.']
  }
];

export const INITIAL_MOCK_EMAILS = [
  {
    id: 'email-501',
    candidateId: 'cand-201',
    jobId: 'job-101',
    recipient: 'alexandra.vance@example.com',
    recipientName: 'Alexandra Vance',
    subject: 'Interview Invitation: Senior AI / ML Engineer at AI Recruiting Agent',
    body: `Dear Alexandra,

Thank you for applying for the Senior AI / ML Engineer position!

Our AI Recruiting Agent has reviewed your resume and background. We were extremely impressed with your experience architecting multi-agent RAG pipelines using LangGraph, Gemini API, and pgvector at Apex AI Technologies.

Your match score was calculated at 92%, making you a top shortlisted candidate for this role.

We would love to invite you to an initial 30-minute introductory conversation with our engineering lead. Please let us know your availability for next week.

Best regards,
Talent Acquisition Team
AI Recruiting Agent`,
    sentAt: '2026-08-06T11:16:00Z',
    type: 'SHORTLIST_INVITE',
    status: 'SENT_MOCK'
  },
  {
    id: 'email-502',
    candidateId: 'cand-202',
    jobId: 'job-101',
    recipient: 'marcus.chen@example.com',
    recipientName: 'Marcus Chen',
    subject: 'Update regarding your application for Senior AI / ML Engineer',
    body: `Dear Marcus,

Thank you for your interest in the Senior AI / ML Engineer role.

While we were impressed by your frontend development background with React and TypeScript, we are specifically seeking candidates with deeper hands-on expertise in machine learning, LangGraph, vector search, and PyTorch for this specific position.

We will keep your resume on file and reach out if a relevant Lead Frontend role opens up in the future.

We wish you the best in your job search!

Best regards,
Talent Acquisition Team`,
    sentAt: '2026-08-07T09:41:00Z',
    type: 'REJECT_NOTICE',
    status: 'SENT_MOCK'
  }
];

export const INITIAL_AGENT_RUNS = [
  {
    id: 'run-601',
    candidateId: 'cand-201',
    jobId: 'job-101',
    candidateName: 'Alexandra Vance',
    jobTitle: 'Senior AI / ML Engineer',
    status: 'COMPLETED',
    decision: 'SHORTLIST',
    startedAt: '2026-08-06T11:14:00Z',
    completedAt: '2026-08-06T11:15:30Z',
    logs: [
      { id: 'log-1', nodeName: 'START', status: 'COMPLETED', timestamp: '2026-08-06T11:14:01Z', outputSummary: 'Workflow initialized for Candidate cand-201 and Job job-101.' },
      { id: 'log-2', nodeName: 'Parse Job Description', status: 'COMPLETED', timestamp: '2026-08-06T11:14:05Z', outputSummary: 'Extracted 7 required skills, 6 preferred skills, min experience 5 yrs.' },
      { id: 'log-3', nodeName: 'Parse Resume', status: 'COMPLETED', timestamp: '2026-08-06T11:14:12Z', outputSummary: 'Parsed candidate text: M.S. CS, 6 yrs experience, 10 technical skills extracted.' },
      { id: 'log-4', nodeName: 'Generate Embeddings', status: 'COMPLETED', timestamp: '2026-08-06T11:14:18Z', outputSummary: 'Generated 768-dim embeddings for JD and Resume using Gemini text-embedding-004.' },
      { id: 'log-5', nodeName: 'Calculate Match Score', status: 'COMPLETED', timestamp: '2026-08-06T11:14:22Z', outputSummary: 'Calculated subscores: Semantic Cosine 94%, Skills 100%, Yrs Exp 100%. Overall Score: 92%.' },
      { id: 'log-6', nodeName: 'LLM Analysis', status: 'COMPLETED', timestamp: '2026-08-06T11:14:28Z', outputSummary: 'Generated qualitative strengths, missing skills, and narrative explanation.' },
      { id: 'log-7', nodeName: 'Decision Node', status: 'COMPLETED', timestamp: '2026-08-06T11:14:29Z', outputSummary: 'Score 92% >= 75% threshold -> Routing to SHORTLIST.' },
      { id: 'log-8', nodeName: 'Action Node (Mock Email)', status: 'COMPLETED', timestamp: '2026-08-06T11:14:30Z', outputSummary: 'Triggered mock email sending: Interview Invitation sent to alexandra.vance@example.com.' },
      { id: 'log-9', nodeName: 'END', status: 'COMPLETED', timestamp: '2026-08-06T11:14:31Z', outputSummary: 'LangGraph graph execution completed successfully.' }
    ],
    emailTriggered: INITIAL_MOCK_EMAILS[0]
  }
];
