import React, { useState } from 'react';
import { LangGraphVisualizer } from '../components/LangGraphVisualizer';
import { EmailPreviewModal } from '../components/EmailPreviewModal';
import { History, Mail, ChevronRight, FileText } from 'lucide-react';

export const AgentHistoryPage = ({ agentRuns = [], emails = [] }) => {
  const [selectedRun, setSelectedRun] = useState(agentRuns[0] || null);
  const [selectedEmail, setSelectedEmail] = useState(null);
  const [activeTab, setActiveTab] = useState('runs');

  return (
    <div className="space-y-6 text-[#1A1A1A]">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 bg-white p-5 rounded-md border border-[#E7E5DF]">
        <div>
          <h2 className="font-serif font-bold text-lg text-[#1A1A1A]">Audit Logs & Outbox</h2>
          <p className="text-xs text-[#6B6B63] mt-0.5">
            Activity history for evaluation pipeline executions and outbound notifications.
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="flex items-center gap-1 bg-[#FAF9F6] p-1 rounded border border-[#E7E5DF] text-xs">
          <button
            onClick={() => setActiveTab('runs')}
            className={`px-3 py-1.5 rounded transition flex items-center gap-1.5 font-medium ${
              activeTab === 'runs'
                ? 'bg-white text-[#1A1A1A] border border-[#E7E5DF]'
                : 'text-[#6B6B63] hover:text-[#1A1A1A]'
            }`}
          >
            <FileText className="w-3.5 h-3.5 text-[#6B6B63]" /> Evaluation Traces ({agentRuns.length})
          </button>
          <button
            onClick={() => setActiveTab('emails')}
            className={`px-3 py-1.5 rounded transition flex items-center gap-1.5 font-medium ${
              activeTab === 'emails'
                ? 'bg-white text-[#1A1A1A] border border-[#E7E5DF]'
                : 'text-[#6B6B63] hover:text-[#1A1A1A]'
            }`}
          >
            <Mail className="w-3.5 h-3.5 text-[#6B6B63]" /> Outbox ({emails.length})
          </button>
        </div>
      </div>

      {activeTab === 'runs' ? (
        <div className="space-y-6">
          {/* Visual Execution Diagram for Selected Run */}
          {selectedRun && (
            <LangGraphVisualizer
              logs={selectedRun.logs}
              status={selectedRun.status}
              candidateName={selectedRun.candidateName}
              jobTitle={selectedRun.jobTitle}
              decision={selectedRun.decision}
            />
          )}

          {/* Runs Table */}
          <div className="bg-white border border-[#E7E5DF] rounded-md overflow-hidden text-[#1A1A1A]">
            <div className="p-4 border-b border-[#E7E5DF] font-serif font-bold text-xs text-[#1A1A1A]">
              Evaluation Runs
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-[#FAF9F6] border-b border-[#E7E5DF] text-[#6B6B63] font-mono text-[11px] uppercase tracking-wider">
                    <th className="py-3 px-4 font-medium">Candidate & Job</th>
                    <th className="py-3 px-4 font-medium">Recommendation</th>
                    <th className="py-3 px-4 font-medium">Steps Executed</th>
                    <th className="py-3 px-4 font-medium">Timestamp</th>
                    <th className="py-3 px-4 font-medium text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#E7E5DF] font-mono">
                  {agentRuns.map(run => (
                    <tr
                      key={run.id}
                      onClick={() => setSelectedRun(run)}
                      className={`hover:bg-[#FAF9F6] cursor-pointer transition ${
                        selectedRun?.id === run.id ? 'bg-[#F3F2EE]' : ''
                      }`}
                    >
                      <td className="py-3 px-4">
                        <div className="font-bold text-[#1A1A1A] font-serif">{run.candidateName}</div>
                        <div className="text-[11px] text-[#6B6B63] font-sans">{run.jobTitle}</div>
                      </td>

                      <td className="py-3 px-4">
                        <span
                          className={`px-2 py-0.5 text-[10px] font-semibold rounded border ${
                            run.decision === 'SHORTLIST'
                              ? 'bg-[#EBF2EE] text-[#2D5A38] border-[#C3D9CA]'
                              : run.decision === 'REJECT'
                              ? 'bg-[#FDF2F2] text-[#8C2A2A] border-[#F2D0D0]'
                              : 'bg-[#FAF6EB] text-[#8C6B2A] border-[#E8DFC2]'
                          }`}
                        >
                          {run.decision}
                        </span>
                      </td>

                      <td className="py-3 px-4 text-[#3A4032]">
                        {run.logs?.length || 0} Steps
                      </td>

                      <td className="py-3 px-4 text-[#6B6B63] text-[11px]">
                        {new Date(run.startedAt).toLocaleString()}
                      </td>

                      <td className="py-3 px-4 text-right font-sans">
                        <button
                          onClick={() => setSelectedRun(run)}
                          className="px-2.5 py-1 text-[11px] font-medium bg-white hover:bg-[#FAF9F6] text-[#1A1A1A] rounded border border-[#E7E5DF] transition inline-flex items-center gap-1"
                        >
                          <span>Inspect Trace</span>
                          <ChevronRight className="w-3 h-3 text-[#6B6B63]" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      ) : (
        /* Outbox Email Log View */
        <div className="bg-white border border-[#E7E5DF] rounded-md overflow-hidden text-[#1A1A1A]">
          <div className="p-4 border-b border-[#E7E5DF] font-serif font-bold text-xs flex items-center gap-2 text-[#1A1A1A]">
            <Mail className="w-4 h-4 text-[#6B6B63]" />
            <span>Outbox Log</span>
          </div>

          <div className="divide-y divide-[#E7E5DF] text-xs">
            {emails.map(email => (
              <div
                key={email.id}
                onClick={() => setSelectedEmail(email)}
                className="p-4 hover:bg-[#FAF9F6] cursor-pointer transition flex items-center justify-between gap-4"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-serif font-bold text-[#1A1A1A]">{email.recipientName}</span>
                    <span className="text-[#6B6B63] font-mono">&lt;{email.recipient}&gt;</span>
                  </div>
                  <p className="font-medium text-[#1A1A1A] text-xs">{email.subject}</p>
                  <p className="text-[11px] text-[#6B6B63] line-clamp-1">{email.body}</p>
                </div>

                <div className="text-right space-y-1 font-mono shrink-0">
                  <span className="px-2 py-0.5 text-[10px] font-semibold rounded bg-[#FAF6EB] text-[#8C6B2A] border border-[#E8DFC2]">
                    {email.status}
                  </span>
                  <div className="text-[10px] text-[#6B6B63]">
                    {new Date(email.sentAt).toLocaleTimeString()}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <EmailPreviewModal email={selectedEmail} onClose={() => setSelectedEmail(null)} />
    </div>
  );
};

