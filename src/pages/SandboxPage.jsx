import React, { useState } from 'react';
import { EmailPreviewModal } from '../components/EmailPreviewModal';
import { Terminal, Play, Code } from 'lucide-react';
import { api } from '../services/api';

export const SandboxPage = ({ jobs = [], candidates = [] }) => {
  const [selectedTool, setSelectedTool] = useState('calculate_match');
  const [selectedCandidateId, setSelectedCandidateId] = useState(candidates[0]?.id || '');
  const [selectedJobId, setSelectedJobId] = useState(jobs[0]?.id || '');
  const [rawResumeInput, setRawResumeInput] = useState('John Doe\nSoftware Engineer with 5 years experience in Python and React.');
  const [emailSubject, setEmailSubject] = useState('Interview Invitation for Senior AI Engineer');
  const [emailBody, setEmailBody] = useState('Dear Candidate,\n\nWe would like to invite you for an interview...');

  const [isRunning, setIsRunning] = useState(false);
  const [toolOutput, setToolOutput] = useState(null);
  const [selectedEmail, setSelectedEmail] = useState(null);

  const toolsList = [
    { id: 'calculate_match', name: 'calculate_match()', desc: 'Computes transparent subscore matrix and cosine similarity' },
    { id: 'parse_resume', name: 'parse_resume()', desc: 'Parses raw resume string or document buffer into structured candidate entity' },
    { id: 'analyze_candidate', name: 'analyze_candidate()', desc: 'Generates Gemini AI qualitative strengths, weaknesses, and recruiter narrative' },
    { id: 'shortlist_candidate', name: 'shortlist_candidate()', desc: 'Updates candidate application status to SHORTLIST and triggers invite tool' },
    { id: 'reject_candidate', name: 'reject_candidate()', desc: 'Updates candidate application status to REJECT and triggers regret notice tool' },
    { id: 'send_email', name: 'send_email()', desc: 'Dispatches safe email tool action (EMAIL_MODE=mock)' }
  ];

  const handleRunTool = async () => {
    setIsRunning(true);
    setToolOutput(null);

    try {
      if (selectedTool === 'calculate_match' || selectedTool === 'analyze_candidate') {
        const res = await api.runScreening(selectedCandidateId, selectedJobId);
        setToolOutput(res.screeningResult);
      } else if (selectedTool === 'parse_resume') {
        const formData = new FormData();
        formData.append('rawText', rawResumeInput);
        const res = await api.uploadCandidate(formData);
        setToolOutput(res.candidate);
      } else if (selectedTool === 'shortlist_candidate') {
        const cand = candidates.find(c => c.id === selectedCandidateId);
        const job = jobs.find(j => j.id === selectedJobId);
        const email = await api.sendEmail({
          candidateId: selectedCandidateId,
          jobId: selectedJobId,
          recipient: cand?.email || 'candidate@example.com',
          recipientName: cand?.name || 'Candidate',
          subject: `Interview Invitation: ${job?.title || 'Position'}`,
          body: `Dear ${cand?.name},\n\nYou have been Shortlisted for the ${job?.title} position.\n\nBest regards,\nRecruiting Agent`,
          type: 'SHORTLIST_INVITE'
        });
        setToolOutput({ status: 'SHORTLISTED', emailTriggered: email });
        setSelectedEmail(email);
      } else if (selectedTool === 'reject_candidate') {
        const cand = candidates.find(c => c.id === selectedCandidateId);
        const job = jobs.find(j => j.id === selectedJobId);
        const email = await api.sendEmail({
          candidateId: selectedCandidateId,
          jobId: selectedJobId,
          recipient: cand?.email || 'candidate@example.com',
          recipientName: cand?.name || 'Candidate',
          subject: `Application update regarding ${job?.title || 'Position'}`,
          body: `Dear ${cand?.name},\n\nThank you for applying for ${job?.title}. Unfortunately, we selected other candidates at this time.\n\nBest regards,\nRecruiting Agent`,
          type: 'REJECT_NOTICE'
        });
        setToolOutput({ status: 'REJECTED', emailTriggered: email });
        setSelectedEmail(email);
      } else if (selectedTool === 'send_email') {
        const cand = candidates.find(c => c.id === selectedCandidateId);
        const email = await api.sendEmail({
          candidateId: selectedCandidateId,
          jobId: selectedJobId,
          recipient: cand?.email || 'candidate@example.com',
          recipientName: cand?.name || 'Candidate',
          subject: emailSubject,
          body: emailBody,
          type: 'MANUAL'
        });
        setToolOutput(email);
        setSelectedEmail(email);
      }
    } catch (err) {
      setToolOutput({ error: err.message });
    } finally {
      setIsRunning(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-slate-900 p-5 rounded-xl border border-slate-800 text-white shadow-lg space-y-1">
        <div className="flex items-center gap-2">
          <Terminal className="w-5 h-5 text-indigo-400" />
          <h2 className="text-lg font-bold text-slate-100">Recruiting Agent Tool Calling Sandbox</h2>
        </div>
        <p className="text-xs text-slate-400">
          Directly execute agent tools in isolation and inspect live JSON outputs, parameters, and mock email payloads.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Tool Selector & Config Form */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-4 text-white shadow-xl">
          <h3 className="font-bold text-xs uppercase tracking-wider text-slate-400 border-b border-slate-800 pb-2">
            Select Agent Tool
          </h3>

          <div className="space-y-2">
            {toolsList.map(t => (
              <button
                key={t.id}
                onClick={() => setSelectedTool(t.id)}
                className={`w-full text-left p-3 rounded-xl border text-xs transition ${
                  selectedTool === t.id
                    ? 'border-indigo-500 bg-indigo-950/80 font-bold text-white'
                    : 'border-slate-800 bg-slate-950/60 text-slate-300 hover:border-slate-700'
                }`}
              >
                <div className="font-mono text-indigo-300">{t.name}</div>
                <div className="text-[10px] text-slate-400 font-sans mt-0.5">{t.desc}</div>
              </button>
            ))}
          </div>

          <div className="border-t border-slate-800 pt-4 space-y-3 text-xs">
            {selectedTool !== 'parse_resume' && (
              <>
                <div className="space-y-1">
                  <label className="text-slate-300 font-semibold">Select Target Candidate</label>
                  <select
                    value={selectedCandidateId}
                    onChange={e => setSelectedCandidateId(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-slate-100 focus:outline-none"
                  >
                    {candidates.map(c => (
                      <option key={c.id} value={c.id}>{c.name} ({c.currentTitle})</option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-slate-300 font-semibold">Select Target Job Position</label>
                  <select
                    value={selectedJobId}
                    onChange={e => setSelectedJobId(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-slate-100 focus:outline-none"
                  >
                    {jobs.map(j => (
                      <option key={j.id} value={j.id}>{j.title}</option>
                    ))}
                  </select>
                </div>
              </>
            )}

            {selectedTool === 'parse_resume' && (
              <div className="space-y-1">
                <label className="text-slate-300 font-semibold">Raw Resume Input String</label>
                <textarea
                  rows={4}
                  value={rawResumeInput}
                  onChange={e => setRawResumeInput(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-slate-100 font-mono"
                />
              </div>
            )}

            {selectedTool === 'send_email' && (
              <div className="space-y-2">
                <div className="space-y-1">
                  <label className="text-slate-300 font-semibold">Email Subject</label>
                  <input
                    type="text"
                    value={emailSubject}
                    onChange={e => setEmailSubject(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-slate-100"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-slate-300 font-semibold">Email Body</label>
                  <textarea
                    rows={3}
                    value={emailBody}
                    onChange={e => setEmailBody(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-slate-100"
                  />
                </div>
              </div>
            )}

            <button
              onClick={handleRunTool}
              disabled={isRunning}
              className="w-full py-2.5 text-xs font-semibold bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white rounded-xl transition flex items-center justify-center gap-2 shadow-lg shadow-indigo-600/20"
            >
              <Play className="w-3.5 h-3.5 fill-current" />
              {isRunning ? 'Executing Tool...' : `Execute ${selectedTool}()`}
            </button>
          </div>
        </div>

        {/* Live JSON Tool Output Viewer */}
        <div className="lg:col-span-2 bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-4 text-white shadow-xl">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div className="flex items-center gap-2 font-mono text-xs">
              <Code className="w-4 h-4 text-cyan-400" />
              <span className="font-bold text-slate-200">Tool Output Window</span>
            </div>
            {isRunning && <span className="text-xs text-amber-400 animate-pulse font-mono">Running...</span>}
          </div>

          <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 font-mono text-xs text-cyan-300 min-h-[350px] overflow-x-auto">
            {toolOutput ? (
              <pre>{JSON.stringify(toolOutput, null, 2)}</pre>
            ) : (
              <div className="text-slate-600 italic py-20 text-center">
                Click "Execute Tool" on the left panel to run the tool and view structured output.
              </div>
            )}
          </div>
        </div>
      </div>

      <EmailPreviewModal email={selectedEmail} onClose={() => setSelectedEmail(null)} />
    </div>
  );
};
