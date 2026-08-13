# AI Recruiting Agent 🤖

A production-quality, autonomous AI Recruiting Agent and Candidate Matching Platform built with **React**, **TypeScript**, **FastAPI**, **Gemini API**, **LangGraph**, and **PostgreSQL with pgvector**.

---

## 🌟 Architecture & Core Workflow

```
Candidate Resume (PDF/DOCX)
       │
       ▼
Document Parser (pdf-parse / mammoth)
       │
       ▼
Gemini Structured Entity Extraction
       │
       ▼
Vector Embeddings (768-dim) ──► PostgreSQL + pgvector
       │
       ▼
Semantic Cosine Similarity + Transparent Subscore Matrix
       │
       ▼
LangGraph Multi-Node Orchestrator
       ├─ Node 1: START
       ├─ Node 2: Parse Job Description
       ├─ Node 3: Parse Resume
       ├─ Node 4: Generate Embeddings
       ├─ Node 5: Calculate Match Score
       ├─ Node 6: LLM Qualitative Analysis
       └─ Node 7: Decision Node
            ├── SHORTLIST  ──► Action Node (Mock Email Interview Invite)
            ├── REVIEW     ──► Candidate Pipeline Hold
            └── REJECT     ──► Action Node (Mock Email Regret Notice)
```

---

## 📊 Transparent Match Score Calculation

Unlike black-box LLM match outputs, the AI Recruiting Agent uses an **explainable, deterministic scoring formula**:

$$\text{Overall Score} = 0.30 \times \text{ReqSkills} + 0.25 \times \text{SemanticCos} + 0.15 \times \text{PrefSkills} + 0.15 \times \text{Experience} + 0.15 \times \text{Education}$$

1. **Required Skills Match (30%)**: Percentage of mandatory job skills satisfied by the candidate.
2. **Semantic Vector Similarity (25%)**: Cosine distance computed over 768-dimensional text embeddings ($ \cos(\theta) = \frac{\mathbf{A} \cdot \mathbf{B}}{\|\mathbf{A}\| \|\mathbf{B}\|} $).
3. **Preferred Skills Match (15%)**: Bonus points for nice-to-have technical qualifications.
4. **Relevant Experience Match (15%)**: Ratio of candidate total experience years vs required minimum.
5. **Education Requirement Match (15%)**: Degree alignment (Master's, Bachelor's, relevant field).

---

## 🛠️ LangGraph Workflow Nodes

1. **START**: Initializes the graph state with `candidate_id` and `job_id`.
2. **Parse Job Description**: Extracts structured required skills, preferred skills, and experience criteria.
3. **Parse Resume**: Parses PDF/DOCX or text into candidate work history and skills array.
4. **Generate Embeddings**: Computes vector representations via Gemini API (`gemini-embedding-2-preview`).
5. **Calculate Match Score**: Executes the transparent sub-score matrix.
6. **LLM Qualitative Analysis**: Generates qualitative strengths, missing skill gaps, and recruiter narrative using `gemini-3.6-flash`.
7. **Decision Node**: Conditional routing:
   - Score $\ge 75\% \implies$ `SHORTLIST`
   - $50\% \le \text{Score} < 75\% \implies$ `REVIEW`
   - Score $< 50\% \implies$ `REJECT`
8. **Action Node (Mock Email Tool)**: Triggers email tool dispatch safely under `EMAIL_MODE=mock`.

---

## 🗄️ Database Design (PostgreSQL + pgvector)

- `jobs`: Stores position title, department, requirements, required skills, and 768-dim vector embeddings.
- `candidates`: Stores parsed candidate profile, summary, experience, skills, and resume text embeddings.
- `screening_results`: Stores subscores, overall score, matched/missing skills, strengths, weaknesses, and LLM explanation.
- `applications`: Links candidate to job with stage status (`SHORTLIST`, `REVIEW`, `REJECT`).
- `agent_runs`: Audit trail of LangGraph step logs and execution times.
- `emails`: Outbox log of generated candidate emails.

---

## 🚀 Running Locally

1. **Clone the repository**:
   ```bash
   git clone https://github.com/example/ai-recruiting-agent.git
   cd ai-recruiting-agent
   ```

2. **Install Node.js dependencies**:
   ```bash
   npm install
   ```

3. **Set Environment Variables**:
   ```bash
   cp .env.example .env
   # Add your GEMINI_API_KEY in .env
   ```

4. **Start Development Server**:
   ```bash
   npm run dev
   ```
   Open `http://localhost:3000` in your browser.

---

## 🐳 Docker Deployment

```bash
docker-compose -f docker/docker-compose.yml up --build
```
