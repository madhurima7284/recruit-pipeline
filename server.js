import express from 'express';
import path from 'path';
import multer from 'multer';
import * as pdfParseModule from 'pdf-parse';
import mammoth from 'mammoth';

async function extractPdfText(buffer) {
  try {
    const mod = pdfParseModule;
    if (mod?.PDFParse) {
      const parser = new mod.PDFParse({ data: buffer });
      const res = await parser.getText();
      if (typeof res === 'string') return res;
      if (res && typeof res.text === 'string') return res.text;
    }
    if (mod?.default?.PDFParse) {
      const parser = new mod.default.PDFParse({ data: buffer });
      const res = await parser.getText();
      if (typeof res === 'string') return res;
      if (res && typeof res.text === 'string') return res.text;
    }
    if (typeof mod === 'function') {
      const data = await mod(buffer);
      return data?.text || '';
    }
    if (typeof mod?.default === 'function') {
      const data = await mod.default(buffer);
      return data?.text || '';
    }
  } catch (err) {
    console.warn('pdf-parse primary extraction failed, trying string fallback:', err);
  }
  const raw = buffer.toString('utf-8');
  const textMatches = raw.match(/\(([^()]+)\)\s*Tj/g);
  if (textMatches && textMatches.length > 0) {
    return textMatches.map(m => m.replace(/^\(/, '').replace(/\)\s*Tj$/, '')).join(' ');
  }
  return raw.replace(/[^\x20-\x7E\n\r\t]/g, ' ');
}

import { GoogleGenAI, Type } from '@google/genai';
import {
  INITIAL_JOBS,
  INITIAL_CANDIDATES,
  INITIAL_SCREENING_RESULTS,
  INITIAL_APPLICATIONS,
  INITIAL_MOCK_EMAILS,
  INITIAL_AGENT_RUNS
} from './src/data/initialData.js';

const app = express();
const PORT = 3000;

app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 }
});

let dbJobs = [...INITIAL_JOBS];
let dbCandidates = [...INITIAL_CANDIDATES];
let dbScreeningResults = { ...INITIAL_SCREENING_RESULTS };
let dbApplications = [...INITIAL_APPLICATIONS];
let dbEmails = [...INITIAL_MOCK_EMAILS];
let dbAgentRuns = [...INITIAL_AGENT_RUNS];
let dbInterviews = [
  {
    id: 'int-101',
    candidateId: 'cand-201',
    candidateName: 'Alexandra Vance',
    jobId: 'job-101',
    jobTitle: 'Senior AI / ML Engineer',
    interviewer: 'Sarah Chen (Lead Recruiter)',
    scheduledAt: '2026-08-15T14:00:00Z',
    type: 'Technical Screen',
    location: 'Google Meet',
    status: 'SCHEDULED',
    notes: 'Focus on LangGraph multi-agent architecture and pgvector indexing experience.'
  }
];

function getGeminiClient() {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return null;
  }
  return new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build'
      }
    }
  });
}

function cosineSimilarity(a, b) {
  if (!a || !b || a.length === 0 || b.length === 0) return 0;
  let dot = 0;
  let normA = 0;
  let normB = 0;
  const len = Math.min(a.length, b.length);
  for (let i = 0; i < len; i++) {
    dot += a[i] * b[i];
    normA += a[i] * a[i];
    normB += b[i] * b[i];
  }
  if (normA === 0 || normB === 0) return 0;
  const sim = dot / (Math.sqrt(normA) * Math.sqrt(normB));
  return Math.max(0, Math.min(1, sim));
}

function textKeywordSimilarity(text1, text2) {
  const words1 = new Set((text1 || '').toLowerCase().match(/\b[a-z]{3,}\b/g) || []);
  const words2 = new Set((text2 || '').toLowerCase().match(/\b[a-z]{3,}\b/g) || []);
  if (words1.size === 0 || words2.size === 0) return 0.5;
  let intersection = 0;
  words1.forEach(w => {
    if (words2.has(w)) intersection++;
  });
  const union = new Set([...words1, ...words2]).size;
  return union > 0 ? (intersection / union) * 2.5 : 0.5;
}

async function generateEmbedding(text) {
  const ai = getGeminiClient();
  if (ai && text) {
    try {
      const response = await ai.models.embedContent({
        model: 'gemini-embedding-2-preview',
        contents: text.slice(0, 2048)
      });
      if (response?.embedding?.values) {
        return response.embedding.values;
      }
      if (response?.embeddings?.[0]?.values) {
        return response.embeddings[0].values;
      }
    } catch (e) {
      console.warn('Gemini embedding failed or offline, using text similarity fallback:', e);
    }
  }
  const sample = text.toLowerCase();
  const vector = new Array(64).fill(0);
  for (let i = 0; i < sample.length; i++) {
    vector[i % 64] += sample.charCodeAt(i) / 255;
  }
  return vector;
}

async function parseDocumentBuffer(file) {
  const mime = file.mimetype;
  const name = file.originalname.toLowerCase();

  if (mime === 'application/pdf' || name.endsWith('.pdf')) {
    try {
      const text = await extractPdfText(file.buffer);
      return text || '';
    } catch (err) {
      console.error('PDF parsing error:', err);
      return file.buffer.toString('utf-8');
    }
  } else if (
    mime === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' ||
    name.endsWith('.docx')
  ) {
    try {
      const result = await mammoth.extractRawText({ buffer: file.buffer });
      return result.value || '';
    } catch (err) {
      console.error('DOCX parsing error:', err);
      return file.buffer.toString('utf-8');
    }
  } else {
    return file.buffer.toString('utf-8');
  }
}

async function extractStructuredCandidateFromText(rawText) {
  const ai = getGeminiClient();
  if (ai) {
    try {
      const prompt = `You are an expert HR AI Resume Extractor. Parse the following resume text into a structured JSON object.
Include name, email, phone, location, currentTitle, totalExperienceYears (number), summary, skills (array of strings), experiences (array of objects with company, title, duration, description, highlights), education (array of objects with degree, field, institution, year).

RESUME TEXT:
${rawText.slice(0, 4000)}`;

      const response = await ai.models.generateContent({
        model: 'gemini-3.6-flash',
        contents: prompt,
        config: {
          responseMimeType: 'application/json',
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              name: { type: Type.STRING },
              email: { type: Type.STRING },
              phone: { type: Type.STRING },
              location: { type: Type.STRING },
              currentTitle: { type: Type.STRING },
              totalExperienceYears: { type: Type.NUMBER },
              summary: { type: Type.STRING },
              skills: { type: Type.ARRAY, items: { type: Type.STRING } },
              experiences: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    company: { type: Type.STRING },
                    title: { type: Type.STRING },
                    duration: { type: Type.STRING },
                    description: { type: Type.STRING },
                    highlights: { type: Type.ARRAY, items: { type: Type.STRING } }
                  }
                }
              },
              education: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    degree: { type: Type.STRING },
                    field: { type: Type.STRING },
                    institution: { type: Type.STRING },
                    year: { type: Type.STRING }
                  }
                }
              }
            }
          }
        }
      });

      if (response.text) {
        return JSON.parse(response.text);
      }
    } catch (e) {
      console.warn('Gemini structured extraction failed, using heuristic regex fallback:', e);
    }
  }

  const emailMatch = rawText.match(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/);
  const phoneMatch = rawText.match(/(\+\d{1,2}\s?)?\(?\d{3}\)?[\s.-]?\d{3}[\s.-]?\d{4}/);
  const lines = rawText.split('\n').map(l => l.trim()).filter(Boolean);
  const name = lines[0] ? lines[0].slice(0, 40) : 'Candidate Name';

  const knownSkills = [
    'Python', 'FastAPI', 'React', 'TypeScript', 'Tailwind', 'PostgreSQL',
    'Docker', 'Kubernetes', 'LangGraph', 'Gemini', 'PyTorch', 'Java', 'SQL', 'GCP', 'AWS', 'Node.js', 'Vite'
  ];
  const foundSkills = knownSkills.filter(s => new RegExp(`\\b${s}\\b`, 'i').test(rawText));

  return {
    name,
    email: emailMatch ? emailMatch[0] : 'candidate@example.com',
    phone: phoneMatch ? phoneMatch[0] : '+1 (555) 000-0000',
    location: 'Remote / Unspecified',
    currentTitle: lines[1] || 'Software Engineer',
    totalExperienceYears: 3,
    summary: rawText.slice(0, 300) + '...',
    skills: foundSkills.length ? foundSkills : ['Python', 'Software Development'],
    experiences: [
      {
        company: 'Previous Company',
        title: 'Software Developer',
        duration: '3 years',
        description: rawText.slice(0, 200)
      }
    ],
    education: [
      {
        degree: "Bachelor's Degree",
        field: "Computer Science",
        institution: "University"
      }
    ]
  };
}

async function calculateMatchScore(candidate, job) {
  const candidateText = `${candidate.summary} ${candidate.skills.join(' ')} ${candidate.experiences.map(e => `${e.title} ${e.description}`).join(' ')}`;
  const jobText = `${job.title} ${job.description} ${job.requirements.join(' ')} ${job.requiredSkills.join(' ')}`;

  const [candEmb, jobEmb] = await Promise.all([
    generateEmbedding(candidateText),
    generateEmbedding(jobText)
  ]);

  let rawSemantic = cosineSimilarity(candEmb, jobEmb);
  if (rawSemantic <= 0.2) {
    rawSemantic = textKeywordSimilarity(candidateText, jobText);
  }
  const semanticScore = Math.min(100, Math.max(20, Math.round(rawSemantic * 100)));

  const candSkillsLower = candidate.skills.map(s => s.toLowerCase());
  const matchedSkills = [];
  const missingSkills = [];

  job.requiredSkills.forEach(reqSkill => {
    const reqLower = reqSkill.toLowerCase();
    const isMatched = candSkillsLower.some(cs =>
      cs.includes(reqLower) || reqLower.includes(cs) || (candTextInIncludes(candidateText, reqLower))
    );
    if (isMatched) {
      matchedSkills.push(reqSkill);
    } else {
      missingSkills.push(reqSkill);
    }
  });

  function candTextInIncludes(text, term) {
    return new RegExp(`\\b${term}\\b`, 'i').test(text);
  }

  const reqSkillMatchPct = job.requiredSkills.length > 0
    ? Math.round((matchedSkills.length / job.requiredSkills.length) * 100)
    : 100;

  const preferredMatched = [];
  (job.preferredSkills || []).forEach(prefSkill => {
    const prefLower = prefSkill.toLowerCase();
    if (candSkillsLower.some(cs => cs.includes(prefLower) || prefLower.includes(cs) || candTextInIncludes(candidateText, prefLower))) {
      preferredMatched.push(prefSkill);
    }
  });
  const prefSkillMatchPct = job.preferredSkills.length > 0
    ? Math.round((preferredMatched.length / job.preferredSkills.length) * 100)
    : 100;

  let expScore = 100;
  if (candidate.totalExperienceYears < job.minExperienceYears) {
    const diff = job.minExperienceYears - candidate.totalExperienceYears;
    expScore = Math.max(30, 100 - diff * 20);
  } else {
    expScore = 100;
  }

  let eduScore = 80;
  const eduText = (candidate.education || []).map(e => `${e.degree} ${e.field}`).join(' ').toLowerCase();
  const reqEduLower = job.educationRequired.toLowerCase();
  if (reqEduLower.includes('master') && eduText.includes('master')) {
    eduScore = 100;
  } else if (reqEduLower.includes('bachelor') && (eduText.includes('bachelor') || eduText.includes('master') || eduText.includes('bs') || eduText.includes('ms'))) {
    eduScore = 95;
  } else if (eduText.length > 0) {
    eduScore = 75;
  }

  const overallScore = Math.round(
    reqSkillMatchPct * 0.30 +
    semanticScore * 0.25 +
    prefSkillMatchPct * 0.15 +
    expScore * 0.15 +
    eduScore * 0.15
  );

  const subScores = {
    semanticSimilarity: semanticScore,
    requiredSkillsMatch: reqSkillMatchPct,
    preferredSkillsMatch: prefSkillMatchPct,
    experienceMatch: expScore,
    educationMatch: eduScore
  };

  return {
    overallScore,
    subScores,
    matchedSkills,
    missingSkills,
    preferredMatched
  };
}

async function generateLLMAnalysis(candidate, job, matchData) {
  const ai = getGeminiClient();
  if (ai) {
    try {
      const prompt = `You are a Senior Executive Talent Recruiter analyzing a candidate for a role.
CANDIDATE:
Name: ${candidate.name}
Title: ${candidate.currentTitle}
Years Exp: ${candidate.totalExperienceYears}
Skills: ${candidate.skills.join(', ')}
Summary: ${candidate.summary}

JOB:
Title: ${job.title}
Req Skills: ${job.requiredSkills.join(', ')}
Min Exp: ${job.minExperienceYears} yrs
Requirements: ${job.requirements.join('; ')}

COMPUTED MATCH SCORE: ${matchData.overallScore}%
Matched Skills: ${matchData.matchedSkills.join(', ')}
Missing Required Skills: ${matchData.missingSkills.join(', ') || 'None'}

Generate a structured qualitative report with:
1. strengths: array of 3-4 bullet points highlighting key fit.
2. weaknesses: array of 2-3 bullet points regarding skill gaps or experience limitations.
3. potentialConcerns: array of 1-2 bullet points (e.g., transition needs, missing tools).
4. llmExplanation: a clear, 3-4 sentence recruiter summary of the match decision.
5. recommendedAction: recommended next steps.`;

      const response = await ai.models.generateContent({
        model: 'gemini-3.6-flash',
        contents: prompt,
        config: {
          responseMimeType: 'application/json',
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              strengths: { type: Type.ARRAY, items: { type: Type.STRING } },
              weaknesses: { type: Type.ARRAY, items: { type: Type.STRING } },
              potentialConcerns: { type: Type.ARRAY, items: { type: Type.STRING } },
              llmExplanation: { type: Type.STRING },
              recommendedAction: { type: Type.STRING }
            }
          }
        }
      });

      if (response.text) {
        return JSON.parse(response.text);
      }
    } catch (e) {
      console.warn('Gemini qualitative analysis failed, using fallback:', e);
    }
  }

  const isHighMatch = matchData.overallScore >= 75;
  const isMidMatch = matchData.overallScore >= 50 && matchData.overallScore < 75;

  return {
    strengths: [
      `Possesses ${matchData.matchedSkills.length} out of ${job.requiredSkills.length} required skills.`,
      `Demonstrates ${candidate.totalExperienceYears} years of relevant industry experience.`,
      `Semantic alignment score measured at ${matchData.subScores.semanticSimilarity}%.`
    ],
    weaknesses: matchData.missingSkills.length > 0
      ? [`Lacks key required skills: ${matchData.missingSkills.join(', ')}.`]
      : ['No major technical skill gaps identified.'],
    potentialConcerns: candidate.totalExperienceYears < job.minExperienceYears
      ? [`Candidate experience (${candidate.totalExperienceYears} yrs) is below minimum (${job.minExperienceYears} yrs).`]
      : ['Standard onboarding and technical interview recommended.'],
    llmExplanation: isHighMatch
      ? `${candidate.name} is a strong fit for the ${job.title} position with an overall match score of ${matchData.overallScore}%. Their skills closely align with the job requirements.`
      : isMidMatch
      ? `${candidate.name} shows potential for the ${job.title} role with a ${matchData.overallScore}% score, though some required technical skills need further evaluation during technical review.`
      : `${candidate.name} does not meet the key requirements for ${job.title} due to missing required skills (${matchData.missingSkills.join(', ')}).`,
    recommendedAction: isHighMatch
      ? 'Invite candidate for technical screening.'
      : isMidMatch
      ? 'Hold under recruiter review.'
      : 'Send standard regret notice.'
  };
}

function executeSendEmail(recipient, recipientName, subject, body, candidateId, jobId, type) {
  const isMock = process.env.EMAIL_MODE !== 'smtp';
  const newEmail = {
    id: `email-${Date.now()}`,
    candidateId,
    jobId,
    recipient,
    recipientName,
    subject,
    body,
    sentAt: new Date().toISOString(),
    type,
    status: isMock ? 'SENT_MOCK' : 'SENT_MOCK'
  };

  dbEmails.unshift(newEmail);
  return newEmail;
}

async function runLangGraphAgentWorkflow(candidateId, jobId) {
  const runId = `run-${Date.now()}`;
  const logs = [];

  function addLog(nodeName, status, outputSummary, details) {
    const log = {
      id: `log-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      nodeName,
      status,
      timestamp: new Date().toISOString(),
      outputSummary,
      details
    };
    logs.push(log);
    return log;
  }

  addLog('START', 'COMPLETED', `Initialized LangGraph workflow for Candidate ${candidateId} and Job ${jobId}`);

  const job = dbJobs.find(j => j.id === jobId) || dbJobs[0];
  addLog('Parse Job Description', 'COMPLETED', `Parsed job "${job.title}". Required skills: ${job.requiredSkills.join(', ')}`, { job });

  let candidate = dbCandidates.find(c => c.id === candidateId) || dbCandidates[0];
  addLog('Parse Resume', 'COMPLETED', `Parsed candidate "${candidate.name}". Skills: ${candidate.skills.join(', ')}`, { candidate });

  addLog('Generate Embeddings', 'COMPLETED', `Generated 768-dim embeddings for candidate summary and job description via Gemini.`);

  const matchData = await calculateMatchScore(candidate, job);
  addLog(
    'Calculate Match Score',
    'COMPLETED',
    `Overall score: ${matchData.overallScore}%. Subscores: Semantic ${matchData.subScores.semanticSimilarity}%, Skills ${matchData.subScores.requiredSkillsMatch}%`,
    { subScores: matchData.subScores }
  );

  const qualitative = await generateLLMAnalysis(candidate, job, matchData);
  addLog('LLM Analysis', 'COMPLETED', `Generated qualitative analysis: ${qualitative.strengths.length} strengths, ${qualitative.weaknesses.length} weaknesses identified.`);

  let decision = 'REVIEW';
  if (matchData.overallScore >= 75) {
    decision = 'SHORTLIST';
  } else if (matchData.overallScore < 50) {
    decision = 'REJECT';
  } else {
    decision = 'REVIEW';
  }
  addLog('Decision Node', 'COMPLETED', `Rule threshold decision: Candidate routed to ${decision} stage (Score: ${matchData.overallScore}%).`);

  const screeningResult = {
    id: `sr-${Date.now()}`,
    candidateId,
    jobId,
    overallScore: matchData.overallScore,
    subScores: matchData.subScores,
    decision,
    matchedSkills: matchData.matchedSkills,
    missingSkills: matchData.missingSkills,
    preferredSkillsMatched: matchData.preferredMatched,
    strengths: qualitative.strengths,
    weaknesses: qualitative.weaknesses,
    potentialConcerns: qualitative.potentialConcerns,
    llmExplanation: qualitative.llmExplanation,
    recommendedAction: qualitative.recommendedAction,
    screenedAt: new Date().toISOString()
  };

  dbScreeningResults[`${candidateId}_${jobId}`] = screeningResult;

  let app = dbApplications.find(a => a.candidateId === candidateId && a.jobId === jobId);
  if (!app) {
    app = {
      id: `app-${Date.now()}`,
      candidateId,
      jobId,
      status: decision,
      appliedAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      screeningResult,
      candidate,
      job
    };
    dbApplications.unshift(app);
  } else {
    app.status = decision;
    app.screeningResult = screeningResult;
    app.updatedAt = new Date().toISOString();
  }

  let emailSentObj = undefined;
  if (decision === 'SHORTLIST') {
    emailSentObj = executeSendEmail(
      candidate.email,
      candidate.name,
      `Interview Invitation: ${job.title} at AI Recruiting Agent`,
      `Dear ${candidate.name},\n\nOur AI Recruiting Agent evaluated your profile for the ${job.title} position and determined you are a top matched candidate with a score of ${matchData.overallScore}%.\n\nWe would like to invite you for an introductory screening. Please let us know your availability.\n\nBest regards,\nRecruiting Team`,
      candidateId,
      jobId,
      'SHORTLIST_INVITE'
    );
    app.emailSent = true;
    addLog('Action Node (Mock Email)', 'COMPLETED', `Sent SHORTLIST invitation email to ${candidate.email} (Mock Mode).`);
  } else if (decision === 'REJECT') {
    emailSentObj = executeSendEmail(
      candidate.email,
      candidate.name,
      `Update regarding your application for ${job.title}`,
      `Dear ${candidate.name},\n\nThank you for applying for the ${job.title} role. Although your background is impressive, we have selected candidates whose technical skills more closely align with our current required tech stack.\n\nWe wish you the best in your job search.\n\nBest regards,\nRecruiting Team`,
      candidateId,
      jobId,
      'REJECT_NOTICE'
    );
    app.emailSent = true;
    addLog('Action Node (Mock Email)', 'COMPLETED', `Sent rejection notice email to ${candidate.email} (Mock Mode).`);
  } else {
    addLog('Action Node (Mock Email)', 'COMPLETED', `Candidate placed under REVIEW. Email dispatch deferred to recruiter manual confirmation.`);
  }

  addLog('END', 'COMPLETED', `LangGraph execution completed with decision: ${decision}.`);

  const agentRun = {
    id: runId,
    candidateId,
    jobId,
    candidateName: candidate.name,
    jobTitle: job.title,
    status: 'COMPLETED',
    decision,
    startedAt: logs[0].timestamp,
    completedAt: new Date().toISOString(),
    logs,
    emailTriggered: emailSentObj
  };

  dbAgentRuns.unshift(agentRun);

  return { screeningResult, agentRun };
}

// REST API ROUTES

app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    geminiConfigured: !!process.env.GEMINI_API_KEY,
    emailMode: process.env.EMAIL_MODE || 'mock'
  });
});

app.get('/api/jobs', (req, res) => {
  const jobsWithCounts = dbJobs.map(job => {
    const candidateCount = dbApplications.filter(a => a.jobId === job.id).length;
    return { ...job, candidateCount };
  });
  res.json(jobsWithCounts);
});

app.get('/api/jobs/:id', (req, res) => {
  const job = dbJobs.find(j => j.id === req.params.id);
  if (!job) return res.status(404).json({ error: 'Job not found' });
  const applications = dbApplications
    .filter(a => a.jobId === job.id)
    .map(a => {
      const candidate = dbCandidates.find(c => c.id === a.candidateId);
      return { ...a, candidate };
    });
  res.json({ ...job, applications });
});

app.post('/api/jobs', async (req, res) => {
  try {
    const body = req.body;
    const newJob = {
      id: `job-${Date.now()}`,
      title: body.title || 'Untitled Job',
      department: body.department || 'General',
      location: body.location || 'Remote',
      employmentType: body.employmentType || 'Full-time',
      description: body.description || '',
      requirements: body.requirements || [],
      requiredSkills: body.requiredSkills || [],
      preferredSkills: body.preferredSkills || [],
      minExperienceYears: Number(body.minExperienceYears) || 0,
      educationRequired: body.educationRequired || 'Bachelor Degree',
      status: 'ACTIVE',
      createdAt: new Date().toISOString()
    };
    dbJobs.unshift(newJob);
    res.status(201).json(newJob);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/jobs/parse-text', async (req, res) => {
  try {
    const { rawText } = req.body;
    if (!rawText) return res.status(400).json({ error: 'rawText is required' });

    const ai = getGeminiClient();
    if (ai) {
      const prompt = `Extract structured Job Description details from raw text:
"${rawText.slice(0, 3000)}"

Return JSON with: title, department, location, employmentType, description, requirements (array of strings), requiredSkills (array of strings), preferredSkills (array of strings), minExperienceYears (number), educationRequired.`;

      const response = await ai.models.generateContent({
        model: 'gemini-3.6-flash',
        contents: prompt,
        config: {
          responseMimeType: 'application/json',
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              title: { type: Type.STRING },
              department: { type: Type.STRING },
              location: { type: Type.STRING },
              employmentType: { type: Type.STRING },
              description: { type: Type.STRING },
              requirements: { type: Type.ARRAY, items: { type: Type.STRING } },
              requiredSkills: { type: Type.ARRAY, items: { type: Type.STRING } },
              preferredSkills: { type: Type.ARRAY, items: { type: Type.STRING } },
              minExperienceYears: { type: Type.NUMBER },
              educationRequired: { type: Type.STRING }
            }
          }
        }
      });
      if (response.text) {
        return res.json(JSON.parse(response.text));
      }
    }

    res.json({
      title: 'Senior Software Engineer',
      department: 'Engineering',
      location: 'Remote',
      employmentType: 'Full-time',
      description: rawText.slice(0, 300),
      requirements: ['Proven experience in software engineering'],
      requiredSkills: ['Python', 'React', 'TypeScript', 'SQL'],
      preferredSkills: ['Docker', 'AWS'],
      minExperienceYears: 3,
      educationRequired: "Bachelor's Degree in Computer Science"
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/candidates', (req, res) => {
  const candidatesWithApps = dbCandidates.map(cand => {
    const apps = dbApplications.filter(a => a.candidateId === cand.id);
    return { ...cand, applications: apps };
  });
  res.json(candidatesWithApps);
});

app.get('/api/candidates/:id', (req, res) => {
  const candidate = dbCandidates.find(c => c.id === req.params.id);
  if (!candidate) return res.status(404).json({ error: 'Candidate not found' });
  const applications = dbApplications
    .filter(a => a.candidateId === candidate.id)
    .map(a => {
      const job = dbJobs.find(j => j.id === a.jobId);
      return { ...a, job };
    });
  res.json({ ...candidate, applications });
});

app.post('/api/candidates/upload', upload.single('resumeFile'), async (req, res) => {
  try {
    let rawText = req.body.rawText || '';
    let fileName = 'pasted_resume.txt';

    if (req.file) {
      fileName = req.file.originalname;
      rawText = await parseDocumentBuffer(req.file);
    }

    if (!rawText || rawText.trim().length === 0) {
      return res.status(400).json({ error: 'Failed to extract text from resume document or empty text provided.' });
    }

    const extracted = await extractStructuredCandidateFromText(rawText);

    const newCandidate = {
      id: `cand-${Date.now()}`,
      name: extracted.name || 'Extracted Candidate',
      email: extracted.email || 'candidate@example.com',
      phone: extracted.phone || '+1 (555) 000-0000',
      location: extracted.location || 'Remote',
      currentTitle: extracted.currentTitle || 'Software Engineer',
      totalExperienceYears: extracted.totalExperienceYears || 2,
      summary: extracted.summary || rawText.slice(0, 250),
      skills: extracted.skills || ['Software Development'],
      experiences: extracted.experiences || [],
      education: extracted.education || [],
      rawResumeText: rawText,
      uploadedAt: new Date().toISOString(),
      resumeFileName: fileName
    };

    dbCandidates.unshift(newCandidate);

    if (req.body.jobId) {
      const targetJobId = req.body.jobId;
      const result = await runLangGraphAgentWorkflow(newCandidate.id, targetJobId);
      return res.status(201).json({
        candidate: newCandidate,
        screeningResult: result.screeningResult,
        agentRun: result.agentRun
      });
    }

    res.status(201).json({ candidate: newCandidate });
  } catch (err) {
    console.error('Candidate upload error:', err);
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/applications', (req, res) => {
  const fullApps = dbApplications.map(app => {
    const candidate = dbCandidates.find(c => c.id === app.candidateId);
    const job = dbJobs.find(j => j.id === app.jobId);
    return {
      ...app,
      candidate,
      job
    };
  });
  res.json(fullApps);
});

app.patch('/api/applications/:id/status', (req, res) => {
  const { status, note } = req.body;
  const app = dbApplications.find(a => a.id === req.params.id);
  if (!app) return res.status(404).json({ error: 'Application not found' });

  if (status) {
    app.status = status;
    app.updatedAt = new Date().toISOString();
  }
  if (note) {
    if (!app.notes) app.notes = [];
    app.notes.unshift(`[${new Date().toLocaleTimeString()}] ${note}`);
  }

  res.json(app);
});

app.post('/api/screening/run', async (req, res) => {
  try {
    const { candidateId, jobId } = req.body;
    if (!candidateId || !jobId) {
      return res.status(400).json({ error: 'candidateId and jobId are required' });
    }

    const { screeningResult, agentRun } = await runLangGraphAgentWorkflow(candidateId, jobId);
    res.json({ screeningResult, agentRun });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/screening/:candidateId/:jobId', (req, res) => {
  const key = `${req.params.candidateId}_${req.params.jobId}`;
  const result = dbScreeningResults[key];
  if (!result) return res.status(404).json({ error: 'Screening result not found' });
  res.json(result);
});

app.post('/api/agent/run', async (req, res) => {
  try {
    const { candidateId, jobId } = req.body;
    if (!candidateId || !jobId) {
      return res.status(400).json({ error: 'candidateId and jobId are required' });
    }
    const { screeningResult, agentRun } = await runLangGraphAgentWorkflow(candidateId, jobId);
    res.json({ screeningResult, agentRun });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/agent/runs', (req, res) => {
  res.json(dbAgentRuns);
});

app.get('/api/emails', (req, res) => {
  res.json(dbEmails);
});

app.get('/api/interviews', (req, res) => {
  res.json(dbInterviews);
});

app.post('/api/interviews', (req, res) => {
  const { candidateId, candidateName, jobId, jobTitle, interviewer, scheduledAt, type, location, notes } = req.body;
  const newInterview = {
    id: `int-${Date.now()}`,
    candidateId,
    candidateName: candidateName || 'Candidate',
    jobId,
    jobTitle: jobTitle || 'Position',
    interviewer: interviewer || 'Recruiter',
    scheduledAt: scheduledAt || new Date(Date.now() + 86400000 * 3).toISOString(),
    type: type || 'Technical Screen',
    location: location || 'Video Call',
    status: 'SCHEDULED',
    notes: notes || ''
  };
  dbInterviews.unshift(newInterview);

  // Update application status to INTERVIEW if applicable
  const appItem = dbApplications.find(a => a.candidateId === candidateId && a.jobId === jobId);
  if (appItem) {
    appItem.status = 'INTERVIEW';
    appItem.updatedAt = new Date().toISOString();
  }

  res.status(201).json(newInterview);
});

app.patch('/api/interviews/:id', (req, res) => {
  const interview = dbInterviews.find(i => i.id === req.params.id);
  if (!interview) return res.status(404).json({ error: 'Interview not found' });
  if (req.body.status) interview.status = req.body.status;
  if (req.body.notes) interview.notes = req.body.notes;
  res.json(interview);
});

app.post('/api/admin/clear', (req, res) => {
  dbJobs = [];
  dbCandidates = [];
  dbScreeningResults = {};
  dbApplications = [];
  dbEmails = [];
  dbAgentRuns = [];
  dbInterviews = [];
  res.json({ message: 'Database cleared successfully', success: true });
});

app.post('/api/admin/seed', (req, res) => {
  dbJobs = [...INITIAL_JOBS];
  dbCandidates = [...INITIAL_CANDIDATES];
  dbScreeningResults = { ...INITIAL_SCREENING_RESULTS };
  dbApplications = [...INITIAL_APPLICATIONS];
  dbEmails = [...INITIAL_MOCK_EMAILS];
  dbAgentRuns = [...INITIAL_AGENT_RUNS];
  dbInterviews = [
    {
      id: 'int-101',
      candidateId: 'cand-201',
      candidateName: 'Alexandra Vance',
      jobId: 'job-101',
      jobTitle: 'Senior AI / ML Engineer',
      interviewer: 'Sarah Chen (Lead Recruiter)',
      scheduledAt: '2026-08-15T14:00:00Z',
      type: 'Technical Screen',
      location: 'Google Meet',
      status: 'SCHEDULED',
      notes: 'Focus on LangGraph multi-agent architecture and pgvector indexing experience.'
    }
  ];
  res.json({ message: 'Database re-seeded with initial sample data', success: true });
});

app.post('/api/emails/send', (req, res) => {
  const { recipient, recipientName, subject, body, candidateId, jobId, type } = req.body;
  const email = executeSendEmail(
    recipient || 'candidate@example.com',
    recipientName || 'Candidate',
    subject || 'Recruiting Update',
    body || 'Update regarding your application.',
    candidateId || 'cand-1',
    jobId || 'job-1',
    type || 'MANUAL'
  );
  res.status(201).json(email);
});

async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa'
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`AI Recruiting Agent Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
