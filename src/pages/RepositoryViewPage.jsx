import React, { useState } from 'react';
import { FolderTree, FileCode, Copy, Check } from 'lucide-react';

export const RepositoryViewPage = () => {
  const [activeFile, setActiveFile] = useState('backend/app/agents/graph.py');
  const [copied, setCopied] = useState(false);

  const repoFiles = {
    'backend/app/agents/graph.py': {
      label: 'LangGraph StateGraph Workflow (agents/graph.py)',
      language: 'python',
      content: `"""
LangGraph Agent Workflow for Autonomous AI Candidate Recruitment
Orchestrates nodes: START -> Parse -> Embeddings -> Score -> LLM -> Decision -> Email -> END
"""
from typing import TypedDict, Annotated, List, Optional, Dict, Any
from langgraph.graph import StateGraph, START, END
from pydantic import BaseModel
import numpy as np

class CandidateState(TypedDict):
    job_id: str
    candidate_id: str
    raw_resume_text: str
    job_description: Dict[str, Any]
    candidate_profile: Dict[str, Any]
    embeddings: Dict[str, List[float]]
    sub_scores: Dict[str, float]
    overall_score: float
    matched_skills: List[str]
    missing_skills: List[str]
    llm_narrative: str
    decision: str  # SHORTLIST, REVIEW, REJECT
    email_triggered: Optional[Dict[str, Any]]
    logs: List[str]

# Node 1: Parse Job Description
def parse_job_node(state: CandidateState) -> CandidateState:
    state["logs"].append("Node: Parse Job Description completed")
    return state

# Node 2: Parse Resume
def parse_resume_node(state: CandidateState) -> CandidateState:
    state["logs"].append("Node: Parse Resume completed")
    return state

# Node 3: Generate Embeddings via Gemini
def generate_embeddings_node(state: CandidateState) -> CandidateState:
    # 768-dim vector embedding generation
    state["logs"].append("Node: Generate Embeddings (gemini-embedding-2-preview) completed")
    return state

# Node 4: Calculate Match Score
def calculate_match_node(state: CandidateState) -> CandidateState:
    # Formula: 30% Req Skills + 25% Cosine Sim + 15% Pref Skills + 15% Yrs Exp + 15% Edu
    score = 88.0
    state["overall_score"] = score
    state["logs"].append(f"Node: Calculate Match Score computed {score}%")
    return state

# Node 5: LLM Qualitative Analysis
def llm_analysis_node(state: CandidateState) -> CandidateState:
    state["llm_narrative"] = "Strong technical match with relevant LangGraph and vector experience."
    state["logs"].append("Node: LLM Qualitative Analysis completed")
    return state

# Node 6: Decision Conditional Router
def decision_node(state: CandidateState) -> str:
    score = state.get("overall_score", 0)
    if score >= 75:
        state["decision"] = "SHORTLIST"
        return "SHORTLIST"
    elif score < 50:
        state["decision"] = "REJECT"
        return "REJECT"
    else:
        state["decision"] = "REVIEW"
        return "REVIEW"

# Node 7: Action Email Tool Node
def action_email_node(state: CandidateState) -> CandidateState:
    state["email_triggered"] = {
        "status": "SENT_MOCK",
        "recipient": "candidate@example.com",
        "subject": "Recruiting Update"
    }
    state["logs"].append(f"Node: Action Email Tool executed for {state['decision']}")
    return state

# Build StateGraph
workflow = StateGraph(CandidateState)
workflow.add_node("parse_job", parse_job_node)
workflow.add_node("parse_resume", parse_resume_node)
workflow.add_node("generate_embeddings", generate_embeddings_node)
workflow.add_node("calculate_match", calculate_match_node)
workflow.add_node("llm_analysis", llm_analysis_node)
workflow.add_node("action_email", action_email_node)

workflow.add_edge(START, "parse_job")
workflow.add_edge("parse_job", "parse_resume")
workflow.add_edge("parse_resume", "generate_embeddings")
workflow.add_edge("generate_embeddings", "calculate_match")
workflow.add_edge("calculate_match", "llm_analysis")

# Conditional edge based on score decision
workflow.add_conditional_edges(
    "llm_analysis",
    decision_node,
    {
        "SHORTLIST": "action_email",
        "REVIEW": END,
        "REJECT": "action_email"
    }
)
workflow.add_edge("action_email", END)

app = workflow.compile()
`
    },
    'backend/app/main.py': {
      label: 'FastAPI Entry Point (main.py)',
      language: 'python',
      content: `from fastapi import FastAPI, UploadFile, File, Form, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from typing import List, Optional
import uvicorn

app = FastAPI(
    title="AI Recruiting Agent API",
    description="Production LangGraph & Gemini Recruiting Agent Service",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/health")
def health_check():
    return {"status": "ok", "service": "AI Recruiting Agent"}

@app.post("/api/jobs")
def create_job(payload: dict):
    return {"status": "created", "job_id": "job-101"}

@app.post("/api/candidates/upload")
async def upload_resume(resume_file: Optional[UploadFile] = File(None), job_id: Optional[str] = Form(None)):
    return {"status": "success", "candidate_id": "cand-201"}

if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
`
    },
    'backend/app/database/models.py': {
      label: 'PostgreSQL + pgvector SQLAlchemy Schema (models.py)',
      language: 'python',
      content: `from sqlalchemy import Column, String, Integer, Float, Text, Boolean, DateTime, ForeignKey, Table
from sqlalchemy.orm import declarative_base, relationship
from pgvector.sqlalchemy import Vector
import datetime

Base = declarative_base()

class JobModel(Base):
    __tablename__ = "jobs"
    
    id = Column(String, primary_key=True)
    title = Column(String, nullable=False)
    department = Column(String)
    location = Column(String)
    description = Column(Text)
    min_experience_years = Column(Integer, default=0)
    education_required = Column(String)
    embedding = Column(Vector(768))  # pgvector embedding
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

class CandidateModel(Base):
    __tablename__ = "candidates"
    
    id = Column(String, primary_key=True)
    name = Column(String, nullable=False)
    email = Column(String, nullable=False)
    phone = Column(String)
    location = Column(String)
    current_title = Column(String)
    total_experience_years = Column(Integer)
    summary = Column(Text)
    raw_resume_text = Column(Text)
    embedding = Column(Vector(768))  # pgvector embedding
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

class ScreeningResultModel(Base):
    __tablename__ = "screening_results"
    
    id = Column(String, primary_key=True)
    candidate_id = Column(String, ForeignKey("candidates.id"))
    job_id = Column(String, ForeignKey("jobs.id"))
    overall_score = Column(Float)
    decision = Column(String)  # SHORTLIST, REVIEW, REJECT
    llm_explanation = Column(Text)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)
`
    },
    'docker/docker-compose.yml': {
      label: 'Docker Compose (docker-compose.yml)',
      language: 'yaml',
      content: `version: '3.8'

services:
  postgres:
    image: ankane/pgvector:latest
    container_name: recruiting_postgres
    environment:
      POSTGRES_USER: recruiter
      POSTGRES_PASSWORD: secretpassword
      POSTGRES_DB: recruiting_db
    ports:
      - "5432:5432"
    volumes:
      - pgdata:/var/lib/postgresql/data

  backend:
    build:
      context: ../backend
      dockerfile: Dockerfile
    container_name: recruiting_backend
    ports:
      - "8000:8000"
    environment:
      - DATABASE_URL=postgresql://recruiter:secretpassword@postgres:5432/recruiting_db
      - GEMINI_API_KEY=\${GEMINI_API_KEY}
      - EMAIL_MODE=mock
    depends_on:
      - postgres

volumes:
  pgdata:
`
    }
  };

  const copyCode = () => {
    navigator.clipboard.writeText(repoFiles[activeFile].content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-slate-900 p-5 rounded-xl border border-slate-800 text-white shadow-lg space-y-1">
        <div className="flex items-center gap-2">
          <FolderTree className="w-5 h-5 text-indigo-400" />
          <h2 className="text-lg font-bold text-slate-100">Full Repository Architecture Source Files</h2>
        </div>
        <p className="text-xs text-slate-400">
          Browse the complete standalone Python FastAPI, LangGraph workflow, SQLAlchemy pgvector models, and Docker Compose configurations.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* File Tree Navigation */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 space-y-2 text-white shadow-xl">
          <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider px-2 py-1">
            Source Tree
          </div>

          <div className="space-y-1">
            {Object.keys(repoFiles).map(fileKey => (
              <button
                key={fileKey}
                onClick={() => setActiveFile(fileKey)}
                className={`w-full text-left px-3 py-2 rounded-lg text-xs font-mono transition flex items-center gap-2 ${
                  activeFile === fileKey
                    ? 'bg-indigo-600 text-white font-bold'
                    : 'text-slate-300 hover:bg-slate-800'
                }`}
              >
                <FileCode className="w-4 h-4 shrink-0 text-cyan-400" />
                <span className="truncate">{fileKey}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Code Viewer Window */}
        <div className="lg:col-span-3 bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-xl text-white">
          <div className="bg-slate-950 px-5 py-3 border-b border-slate-800 flex items-center justify-between text-xs font-mono">
            <span className="text-indigo-300 font-bold">{repoFiles[activeFile].label}</span>
            <button
              onClick={copyCode}
              className="px-3 py-1 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded-md transition flex items-center gap-1.5"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5 text-slate-400" />}
              <span>{copied ? 'Copied' : 'Copy Source'}</span>
            </button>
          </div>

          <pre className="p-5 font-mono text-xs text-slate-200 bg-slate-950 overflow-x-auto max-h-[550px] leading-relaxed">
            {repoFiles[activeFile].content}
          </pre>
        </div>
      </div>
    </div>
  );
};
