import React, { useState } from 'react';
import { EmailPreviewModal } from '../components/EmailPreviewModal';
import { CheckCircle2, Clock, XCircle, Mail, ChevronRight, UserCheck, Calendar } from 'lucide-react';
import { api } from '../services/api';

export const PipelinePage = ({ applications = [], onRefreshApplications, onSelectCandidate }) => {
  const [selectedEmail, setSelectedEmail] = useState(null);

  const columns = [
    { status: 'NEW', title: 'New Applications', color: 'bg-[#FAF9F6] text-[#1A1A1A]', border: 'border-[#E7E5DF]', icon: UserCheck },
    { status: 'REVIEW', title: 'Under Review', color: 'bg-[#FAF9F6] text-[#6B6B63]', border: 'border-[#E7E5DF]', icon: Clock },
    { status: 'INTERVIEW', title: 'Interview', color: 'bg-[#EBF2EE] text-[#2D5A38]', border: 'border-[#C3D9CA]', icon: Calendar },
    { status: 'SHORTLIST', title: 'Shortlisted', color: 'bg-[#F3F2EE] text-[#3A4032]', border: 'border-[#D0CDBF]', icon: CheckCircle2 },
    { status: 'REJECT', title: 'Rejected', color: 'bg-[#FDF2F2] text-[#8C2A2A]', border: 'border-[#F2D0D0]', icon: XCircle }
  ];

  const handleStatusMove = async (appId, newStatus) => {
    try {
      await api.updateApplicationStatus(appId, newStatus, `Stage updated to ${newStatus}`);
      onRefreshApplications();
    } catch (err) {
      console.error('Failed to update stage:', err);
    }
  };

  const handleTriggerActionEmail = async (app) => {
    if (!app.candidate || !app.job) return;
    try {
      const type =
        app.status === 'SHORTLIST'
          ? 'SHORTLIST_INVITE'
          : app.status === 'REJECT'
          ? 'REJECT_NOTICE'
          : app.status === 'INTERVIEW'
          ? 'INTERVIEW_SCHEDULE'
          : 'REVIEW_FEEDBACK_REQUEST';

      const email = await api.sendEmail({
        candidateId: app.candidateId,
        jobId: app.jobId,
        recipient: app.candidate.email,
        recipientName: app.candidate.name,
        subject: `Update regarding your application for ${app.job.title}`,
        body: `Dear ${app.candidate.name},\n\nThis is an automated candidate update regarding your application for ${app.job.title}.\n\nCurrent Candidate Status: ${app.status}\nOverall Match Score: ${app.screeningResult?.overallScore || 0}%\n\nBest regards,\nRecruiting Team`,
        type
      });
      setSelectedEmail(email);
      onRefreshApplications();
    } catch (err) {
      console.error('Failed to trigger email:', err);
    }
  };

  return (
    <div className="space-y-6 text-[#1A1A1A]">
      {/* Header */}
      <div className="flex items-center justify-between bg-white p-5 rounded-md border border-[#E7E5DF]">
        <div>
          <h2 className="font-serif font-bold text-lg text-[#1A1A1A]">Recruitment Pipeline</h2>
          <p className="text-xs text-[#6B6B63] mt-0.5">
            Track and move candidates across stages from screening to interview and final decision.
          </p>
        </div>
      </div>

      {/* Kanban Board Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
        {columns.map(col => {
          const Icon = col.icon;
          const colApps = applications.filter(a => (a.status || 'NEW') === col.status);

          return (
            <div key={col.status} className="bg-white border border-[#E7E5DF] rounded-md p-3 space-y-3 flex flex-col justify-between min-h-[500px]">
              <div className="space-y-3">
                {/* Column Header */}
                <div className={`flex items-center justify-between p-2.5 rounded border ${col.color} ${col.border}`}>
                  <div className="flex items-center gap-1.5">
                    <Icon className="w-3.5 h-3.5" />
                    <span className="font-semibold text-xs">{col.title}</span>
                  </div>
                  <span className="px-1.5 py-0.2 text-[10px] font-mono font-bold bg-white rounded text-[#1A1A1A] border border-[#E7E5DF]">
                    {colApps.length}
                  </span>
                </div>

                {/* Candidate Cards List */}
                <div className="space-y-2.5">
                  {colApps.map(app => {
                    const cand = app.candidate;
                    const job = app.job;
                    const result = app.screeningResult;
                    if (!cand) return null;

                    return (
                      <div
                        key={app.id}
                        className="bg-[#FAF9F6] border border-[#E7E5DF] rounded p-3 space-y-2.5 hover:border-[#3A4032] transition text-[#1A1A1A]"
                      >
                        <div className="flex items-start justify-between gap-1">
                          <div>
                            <h4 className="font-serif font-bold text-xs text-[#1A1A1A]">{cand.name}</h4>
                            <p className="text-[10px] text-[#6B6B63]">{cand.currentTitle}</p>
                          </div>
                          <span className="font-mono font-bold text-xs text-[#1A1A1A] bg-white px-1.5 py-0.5 rounded border border-[#E7E5DF]">
                            {result?.overallScore !== undefined ? `${result.overallScore}%` : '—'}
                          </span>
                        </div>

                        {job && (
                          <div className="text-[10px] text-[#3A4032] font-mono font-medium truncate">
                            {job.title}
                          </div>
                        )}

                        <div className="flex flex-wrap gap-1">
                          {cand.skills?.slice(0, 2).map((s, idx) => (
                            <span key={idx} className="px-1 py-0.2 text-[9px] bg-white text-[#6B6B63] rounded border border-[#E7E5DF]">
                              {s}
                            </span>
                          ))}
                        </div>

                        {/* Card Footer Actions */}
                        <div className="pt-2 border-t border-[#E7E5DF] flex items-center justify-between text-[10px]">
                          <button
                            onClick={() => onSelectCandidate(cand.id)}
                            className="text-[#6B6B63] hover:text-[#1A1A1A] font-medium flex items-center gap-0.5"
                          >
                            Profile <ChevronRight className="w-3 h-3 text-[#6B6B63]" />
                          </button>

                          <div className="flex items-center gap-1">
                            <button
                              onClick={() => handleTriggerActionEmail(app)}
                              className="px-1.5 py-0.5 font-medium bg-white text-[#1A1A1A] border border-[#E7E5DF] hover:bg-[#EFECE6] rounded transition flex items-center gap-0.5"
                              title="Draft Email"
                            >
                              <Mail className="w-3 h-3 text-[#6B6B63]" />
                              Email
                            </button>

                            <select
                              value={app.status || 'NEW'}
                              onChange={e => handleStatusMove(app.id, e.target.value)}
                              className="bg-white border border-[#E7E5DF] text-[9px] text-[#1A1A1A] rounded px-1 py-0.5 focus:outline-none"
                            >
                              <option value="NEW">NEW</option>
                              <option value="REVIEW">REVIEW</option>
                              <option value="INTERVIEW">INTERVIEW</option>
                              <option value="SHORTLIST">SHORTLIST</option>
                              <option value="REJECT">REJECT</option>
                            </select>
                          </div>
                        </div>
                      </div>
                    );
                  })}

                  {colApps.length === 0 && (
                    <div className="py-8 text-center text-[11px] text-[#6B6B63] italic">No candidates</div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <EmailPreviewModal email={selectedEmail} onClose={() => setSelectedEmail(null)} />
    </div>
  );
};

