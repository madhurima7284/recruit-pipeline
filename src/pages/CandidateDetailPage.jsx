import React, { useState, useEffect } from 'react';
import { ScoreBreakdown } from '../components/ScoreBreakdown';
import { LangGraphVisualizer } from '../components/LangGraphVisualizer';
import { EmailPreviewModal } from '../components/EmailPreviewModal';
import { api } from '../services/api';
import {
  ArrowLeft,
  FileText,
  CheckCircle2,
  AlertTriangle,
  Send,
  Calendar,
  Plus,
  Clock,
  User,
  Video
} from 'lucide-react';

export const CandidateDetailPage = ({ candidateId, onBack }) => {
  const [candidate, setCandidate] = useState(null);
  const [application, setApplication] = useState(null);
  const [agentRuns, setAgentRuns] = useState([]);
  const [interviews, setInterviews] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [noteInput, setNoteInput] = useState('');
  const [selectedEmail, setSelectedEmail] = useState(null);
  const [isRescreening, setIsRescreening] = useState(false);

  // Interview Form State
  const [showScheduleForm, setShowScheduleForm] = useState(false);
  const [interviewDate, setInterviewDate] = useState('2026-08-18');
  const [interviewTime, setInterviewTime] = useState('14:00');
  const [interviewer, setInterviewer] = useState('Alex Rivera (Engineering Manager)');
  const [interviewFormat, setInterviewFormat] = useState('Video - Google Meet');
  const [interviewNotes, setInterviewNotes] = useState('Technical deep dive on system architecture and past project experience.');

  useEffect(() => {
    loadData();
  }, [candidateId]);

  const loadData = async () => {
    setIsLoading(true);
    try {
      const candData = await api.getCandidate(candidateId);
      setCandidate(candData);
      if (candData.applications && candData.applications.length > 0) {
        setApplication(candData.applications[0]);
      }

      const runs = await api.getAgentRuns();
      setAgentRuns(runs.filter(r => r.candidateId === candidateId));

      const allInterviews = await api.getInterviews();
      setInterviews(allInterviews.filter(i => i.candidateId === candidateId));
    } catch (err) {
      console.error('Failed to load candidate details:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleStatusUpdate = async (newStatus) => {
    if (!application) return;
    try {
      const updated = await api.updateApplicationStatus(application.id, newStatus, `Manual status change to ${newStatus}`);
      setApplication(updated);
    } catch (err) {
      console.error('Failed to update status:', err);
    }
  };

  const handleAddNote = async (e) => {
    e.preventDefault();
    if (!noteInput.trim() || !application) return;
    try {
      const updated = await api.updateApplicationStatus(application.id, application.status, noteInput);
      setApplication(updated);
      setNoteInput('');
    } catch (err) {
      console.error('Failed to add note:', err);
    }
  };

  const handleRunAgentScreening = async () => {
    if (!candidate || !application) return;
    setIsRescreening(true);
    try {
      const res = await api.runScreening(candidate.id, application.jobId);
      setApplication(prev => prev ? { ...prev, screeningResult: res.screeningResult, status: res.screeningResult.decision } : null);
      setAgentRuns(prev => [res.agentRun, ...prev]);
    } catch (err) {
      console.error('Failed to re-run agent:', err);
    } finally {
      setIsRescreening(false);
    }
  };

  const handleScheduleInterview = async (e) => {
    e.preventDefault();
    if (!candidate || !application) return;
    try {
      const newInterview = await api.createInterview({
        candidateId: candidate.id,
        jobId: application.jobId,
        applicationId: application.id,
        date: interviewDate,
        time: interviewTime,
        interviewer,
        format: interviewFormat,
        notes: interviewNotes
      });
      setInterviews(prev => [newInterview, ...prev]);
      setShowScheduleForm(false);
      // Automatically transition application stage to INTERVIEW
      await handleStatusUpdate('INTERVIEW');
    } catch (err) {
      console.error('Failed to schedule interview:', err);
    }
  };

  if (isLoading || !candidate) {
    return <div className="p-12 text-center text-[#6B6B63] font-mono text-xs">Loading Candidate Profile...</div>;
  }

  const screening = application?.screeningResult;
  const latestAgentRun = agentRuns[0];

  return (
    <div className="space-y-6 text-[#1A1A1A]">
      {/* Top Navigation */}
      <div className="flex items-center justify-between">
        <button
          onClick={onBack}
          className="px-3 py-1.5 text-xs font-medium bg-white hover:bg-[#FAF9F6] text-[#1A1A1A] border border-[#E7E5DF] rounded transition flex items-center gap-1.5"
        >
          <ArrowLeft className="w-3.5 h-3.5 text-[#6B6B63]" />
          <span>Back to Candidate Directory</span>
        </button>

        <div className="flex items-center gap-2">
          <button
            onClick={handleRunAgentScreening}
            disabled={isRescreening}
            className="px-3.5 py-1.5 text-xs font-medium bg-[#3A4032] hover:bg-[#2D3227] disabled:opacity-50 text-white rounded transition flex items-center gap-1.5"
          >
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>{isRescreening ? 'Evaluating...' : 'Re-evaluate Profile'}</span>
          </button>
        </div>
      </div>

      {/* Candidate Profile Summary Header */}
      <div className="bg-white border border-[#E7E5DF] rounded-md p-5 space-y-4">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-3">
              <h2 className="font-serif font-bold text-xl text-[#1A1A1A]">{candidate.name}</h2>
              <span
                className={`px-2 py-0.5 text-xs font-medium rounded border ${
                  application?.status === 'SHORTLIST'
                    ? 'bg-[#F3F2EE] text-[#3A4032] border-[#D0CDBF]'
                    : application?.status === 'INTERVIEW'
                    ? 'bg-[#EBF2EE] text-[#2D5A38] border-[#C3D9CA]'
                    : application?.status === 'REJECT'
                    ? 'bg-[#FDF2F2] text-[#8C2A2A] border-[#F2D0D0]'
                    : 'bg-[#FAF9F6] text-[#6B6B63] border-[#E7E5DF]'
                }`}
              >
                {application?.status || 'NEW'}
              </span>
            </div>
            <p className="text-xs font-medium text-[#3A4032]">
              {candidate.currentTitle} • {candidate.location}
            </p>
            <p className="text-xs text-[#6B6B63] font-mono">
              {candidate.email} • {candidate.phone} • {candidate.totalExperienceYears} Years Total Experience
            </p>
          </div>

          <div className="flex flex-col items-end gap-2">
            <div className="bg-[#FAF9F6] px-4 py-2 rounded border border-[#E7E5DF] text-center font-mono">
              <span className="text-[10px] text-[#6B6B63] block uppercase font-medium">Match Rating</span>
              <span className="text-xl font-bold text-[#1A1A1A]">{screening?.overallScore !== undefined ? `${screening.overallScore}%` : '—'}</span>
            </div>
            {candidate.resumeFileName && (
              <span className="text-[10px] text-[#6B6B63] flex items-center gap-1 font-mono">
                <FileText className="w-3 h-3 text-[#6B6B63]" /> {candidate.resumeFileName}
              </span>
            )}
          </div>
        </div>

        {/* Candidate Summary */}
        <div className="bg-[#FAF9F6] p-4 rounded border border-[#E7E5DF] text-xs text-[#1A1A1A] leading-relaxed">
          <span className="text-[10px] uppercase font-bold text-[#6B6B63] block mb-1">Professional Summary</span>
          {candidate.summary}
        </div>
      </div>

      {/* Match Score & Subscore Breakdown */}
      {screening && (
        <ScoreBreakdown
          overallScore={screening.overallScore}
          subScores={screening.subScores}
          matchedSkills={screening.matchedSkills}
          missingSkills={screening.missingSkills}
          preferredSkillsMatched={screening.preferredSkillsMatched}
        />
      )}

      {/* Match Reasoning & Qualitative Evaluation */}
      {screening && (
        <div className="bg-white border border-[#E7E5DF] rounded-md p-5 text-[#1A1A1A] space-y-4">
          <div className="border-b border-[#E7E5DF] pb-3">
            <h3 className="font-serif font-bold text-sm text-[#1A1A1A]">Qualifications & Match Narrative</h3>
          </div>

          <div className="bg-[#FAF9F6] p-4 rounded border border-[#E7E5DF] space-y-1.5 text-xs">
            <span className="text-[10px] font-bold text-[#6B6B63] uppercase">Evaluation Notes:</span>
            <p className="text-[#1A1A1A] leading-relaxed italic">"{screening.llmExplanation}"</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
            {/* Strengths */}
            <div className="bg-[#FAF9F6] p-4 rounded border border-[#E7E5DF] space-y-2">
              <span className="font-semibold text-[#2D5A38] flex items-center gap-1.5 text-xs">
                <CheckCircle2 className="w-3.5 h-3.5" /> Key Strengths ({screening.strengths?.length || 0})
              </span>
              <ul className="space-y-1 text-[#6B6B63] list-disc list-inside text-[11px]">
                {screening.strengths?.map((s, idx) => (
                  <li key={idx}>{s}</li>
                ))}
              </ul>
            </div>

            {/* Weaknesses / Gaps */}
            <div className="bg-[#FAF9F6] p-4 rounded border border-[#E7E5DF] space-y-2">
              <span className="font-semibold text-[#8C6B2A] flex items-center gap-1.5 text-xs">
                <AlertTriangle className="w-3.5 h-3.5" /> Skill Gaps ({screening.weaknesses?.length || 0})
              </span>
              <ul className="space-y-1 text-[#6B6B63] list-disc list-inside text-[11px]">
                {screening.weaknesses?.map((w, idx) => (
                  <li key={idx}>{w}</li>
                ))}
              </ul>
            </div>

            {/* Potential Concerns */}
            <div className="bg-[#FAF9F6] p-4 rounded border border-[#E7E5DF] space-y-2">
              <span className="font-semibold text-[#8C2A2A] flex items-center gap-1.5 text-xs">
                <AlertTriangle className="w-3.5 h-3.5" /> Flags & Risk Factors ({screening.potentialConcerns?.length || 0})
              </span>
              <ul className="space-y-1 text-[#6B6B63] list-disc list-inside text-[11px]">
                {screening.potentialConcerns?.map((c, idx) => (
                  <li key={idx}>{c}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* Scheduled Interviews Section */}
      <div className="bg-white border border-[#E7E5DF] rounded-md p-5 space-y-4">
        <div className="flex items-center justify-between border-b border-[#E7E5DF] pb-3">
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-[#3A4032]" />
            <h3 className="font-serif font-bold text-sm text-[#1A1A1A]">Interviews</h3>
          </div>
          <button
            onClick={() => setShowScheduleForm(!showScheduleForm)}
            className="px-3 py-1 text-xs font-medium bg-[#FAF9F6] hover:bg-[#EFECE6] text-[#1A1A1A] border border-[#E7E5DF] rounded transition flex items-center gap-1"
          >
            <Plus className="w-3.5 h-3.5 text-[#6B6B63]" />
            <span>Schedule Interview</span>
          </button>
        </div>

        {/* Schedule Interview Form Modal / Inline Box */}
        {showScheduleForm && (
          <form onSubmit={handleScheduleInterview} className="bg-[#FAF9F6] border border-[#E7E5DF] p-4 rounded space-y-3 text-xs">
            <h4 className="font-semibold text-xs text-[#1A1A1A]">Schedule New Interview Session</h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="text-[#1A1A1A] font-medium">Date</label>
                <input
                  type="date"
                  required
                  value={interviewDate}
                  onChange={e => setInterviewDate(e.target.value)}
                  className="w-full bg-white border border-[#E7E5DF] rounded p-1.5 text-[#1A1A1A] focus:outline-none focus:border-[#3A4032]"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[#1A1A1A] font-medium">Time</label>
                <input
                  type="time"
                  required
                  value={interviewTime}
                  onChange={e => setInterviewTime(e.target.value)}
                  className="w-full bg-white border border-[#E7E5DF] rounded p-1.5 text-[#1A1A1A] focus:outline-none focus:border-[#3A4032]"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="text-[#1A1A1A] font-medium">Interviewer</label>
                <input
                  type="text"
                  required
                  value={interviewer}
                  onChange={e => setInterviewer(e.target.value)}
                  placeholder="Interviewer Name and Title"
                  className="w-full bg-white border border-[#E7E5DF] rounded p-1.5 text-[#1A1A1A] focus:outline-none focus:border-[#3A4032]"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[#1A1A1A] font-medium">Format</label>
                <input
                  type="text"
                  value={interviewFormat}
                  onChange={e => setInterviewFormat(e.target.value)}
                  placeholder="e.g. Video - Google Meet"
                  className="w-full bg-white border border-[#E7E5DF] rounded p-1.5 text-[#1A1A1A] focus:outline-none focus:border-[#3A4032]"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-[#1A1A1A] font-medium">Interview Notes / Instructions</label>
              <textarea
                rows={2}
                value={interviewNotes}
                onChange={e => setInterviewNotes(e.target.value)}
                className="w-full bg-white border border-[#E7E5DF] rounded p-1.5 text-[#1A1A1A] focus:outline-none focus:border-[#3A4032]"
              />
            </div>

            <div className="flex justify-end gap-2 pt-1">
              <button
                type="button"
                onClick={() => setShowScheduleForm(false)}
                className="px-3 py-1 text-xs font-medium bg-white text-[#1A1A1A] border border-[#E7E5DF] rounded"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-3.5 py-1 text-xs font-medium bg-[#3A4032] text-white rounded hover:bg-[#2D3227]"
              >
                Confirm Interview
              </button>
            </div>
          </form>
        )}

        {/* Existing Scheduled Interviews */}
        {interviews.length > 0 ? (
          <div className="space-y-2">
            {interviews.map(inv => (
              <div key={inv.id} className="bg-[#FAF9F6] border border-[#E7E5DF] p-3.5 rounded flex items-center justify-between text-xs">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-serif font-bold text-[#1A1A1A]">{inv.date} at {inv.time}</span>
                    <span className="px-2 py-0.5 text-[10px] font-mono bg-white text-[#3A4032] border border-[#E7E5DF] rounded">
                      {inv.status || 'SCHEDULED'}
                    </span>
                  </div>
                  <div className="text-[#6B6B63] flex flex-wrap gap-3 font-mono text-[11px]">
                    <span className="flex items-center gap-1"><User className="w-3 h-3" /> {inv.interviewer}</span>
                    <span className="flex items-center gap-1"><Video className="w-3 h-3" /> {inv.format}</span>
                  </div>
                  {inv.notes && <p className="text-[11px] text-[#6B6B63] italic pt-0.5">{inv.notes}</p>}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-6 text-xs text-[#6B6B63] italic bg-[#FAF9F6] rounded border border-[#E7E5DF]">
            No interviews scheduled yet for this candidate.
          </div>
        )}
      </div>

      {/* LangGraph Trace */}
      {latestAgentRun && (
        <LangGraphVisualizer
          logs={latestAgentRun.logs}
          status={latestAgentRun.status}
          candidateName={candidate.name}
          decision={latestAgentRun.decision}
        />
      )}

      {/* Recruiter Decisions & Notes Section */}
      <div className="bg-white border border-[#E7E5DF] rounded-md p-5 text-[#1A1A1A] space-y-4">
        <h3 className="font-serif font-bold text-sm text-[#1A1A1A] border-b border-[#E7E5DF] pb-3">Recruiter Decisions & Notes</h3>

        <div className="flex flex-wrap items-center gap-2.5">
          <span className="text-xs text-[#6B6B63]">Pipeline Stage:</span>
          <button
            onClick={() => handleStatusUpdate('SHORTLIST')}
            className={`px-3 py-1 text-xs font-medium rounded border transition ${
              application?.status === 'SHORTLIST'
                ? 'bg-[#3A4032] text-white border-[#3A4032]'
                : 'bg-[#FAF9F6] text-[#1A1A1A] border-[#E7E5DF] hover:bg-[#EFECE6]'
            }`}
          >
            SHORTLIST
          </button>
          <button
            onClick={() => handleStatusUpdate('INTERVIEW')}
            className={`px-3 py-1 text-xs font-medium rounded border transition ${
              application?.status === 'INTERVIEW'
                ? 'bg-[#3A4032] text-white border-[#3A4032]'
                : 'bg-[#FAF9F6] text-[#1A1A1A] border-[#E7E5DF] hover:bg-[#EFECE6]'
            }`}
          >
            INTERVIEW
          </button>
          <button
            onClick={() => handleStatusUpdate('REVIEW')}
            className={`px-3 py-1 text-xs font-medium rounded border transition ${
              application?.status === 'REVIEW'
                ? 'bg-[#3A4032] text-white border-[#3A4032]'
                : 'bg-[#FAF9F6] text-[#1A1A1A] border-[#E7E5DF] hover:bg-[#EFECE6]'
            }`}
          >
            REVIEW
          </button>
          <button
            onClick={() => handleStatusUpdate('REJECT')}
            className={`px-3 py-1 text-xs font-medium rounded border transition ${
              application?.status === 'REJECT'
                ? 'bg-[#8C2A2A] text-white border-[#8C2A2A]'
                : 'bg-[#FAF9F6] text-[#1A1A1A] border-[#E7E5DF] hover:bg-[#EFECE6]'
            }`}
          >
            REJECT
          </button>
        </div>

        {/* Add Note Form */}
        <form onSubmit={handleAddNote} className="space-y-2 pt-2">
          <div className="flex gap-2">
            <input
              type="text"
              value={noteInput}
              onChange={e => setNoteInput(e.target.value)}
              placeholder="Add recruiter interview note or evaluation remark..."
              className="flex-1 bg-[#FAF9F6] border border-[#E7E5DF] rounded p-2 text-xs text-[#1A1A1A] focus:outline-none focus:border-[#3A4032]"
            />
            <button
              type="submit"
              className="px-3.5 py-2 text-xs font-medium bg-[#3A4032] hover:bg-[#2D3227] text-white rounded transition flex items-center gap-1.5"
            >
              <Send className="w-3.5 h-3.5" /> Save Note
            </button>
          </div>

          {application?.notes && application.notes.length > 0 && (
            <div className="space-y-1 pt-2">
              <span className="text-[10px] text-[#6B6B63] font-semibold uppercase">Recruiter Notes History:</span>
              <div className="bg-[#FAF9F6] p-3 rounded border border-[#E7E5DF] space-y-1 text-xs text-[#1A1A1A] font-mono">
                {application.notes.map((note, i) => (
                  <div key={i}>{note}</div>
                ))}
              </div>
            </div>
          )}
        </form>
      </div>

      {/* Raw Parsed Resume Section */}
      <div className="bg-white border border-[#E7E5DF] rounded-md p-5 text-[#1A1A1A] space-y-3">
        <h3 className="font-serif font-bold text-sm text-[#1A1A1A] border-b border-[#E7E5DF] pb-2">Extracted Resume Text</h3>
        <pre className="bg-[#FAF9F6] p-4 rounded border border-[#E7E5DF] text-xs font-mono text-[#6B6B63] whitespace-pre-wrap max-h-60 overflow-y-auto leading-relaxed">
          {candidate.rawResumeText}
        </pre>
      </div>

      <EmailPreviewModal email={selectedEmail} onClose={() => setSelectedEmail(null)} />
    </div>
  );
};

