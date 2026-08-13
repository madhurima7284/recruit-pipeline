import React, { useState } from 'react';
import { Users, Search, ChevronRight, Upload, FileText } from 'lucide-react';

export const CandidatesPage = ({
  candidates = [],
  jobs = [],
  onSelectCandidate,
  onNavigateToUpload
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [jobFilter, setJobFilter] = useState('ALL');

  const filteredCandidates = candidates.filter(cand => {
    const matchesSearch =
      cand.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      cand.currentTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
      cand.skills?.some(s => s.toLowerCase().includes(searchTerm.toLowerCase()));

    const latestApp = cand.applications?.[0];
    const matchesStatus =
      statusFilter === 'ALL' ||
      (latestApp && latestApp.status === statusFilter);

    const matchesJob =
      jobFilter === 'ALL' ||
      (latestApp && latestApp.jobId === jobFilter);

    return matchesSearch && matchesStatus && matchesJob;
  });

  return (
    <div className="space-y-6 text-[#1A1A1A]">
      {/* Header & Filter Controls */}
      <div className="bg-white p-5 rounded-md border border-[#E7E5DF] space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h2 className="font-serif font-bold text-lg text-[#1A1A1A]">Candidate Directory</h2>
            <p className="text-xs text-[#6B6B63] mt-0.5">
              Filter candidates, review extracted technical skills, and inspect match scores.
            </p>
          </div>

          <button
            onClick={onNavigateToUpload}
            className="px-3.5 py-1.5 text-xs font-medium bg-[#3A4032] hover:bg-[#2D3227] text-white rounded transition flex items-center gap-1.5"
          >
            <Upload className="w-3.5 h-3.5" />
            <span>Import Resume</span>
          </button>
        </div>

        {/* Search & Filter Bar */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="relative flex-1 min-w-[200px]">
            <Search className="w-3.5 h-3.5 text-[#6B6B63] absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Search by candidate name, title, or skill..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="w-full bg-[#FAF9F6] border border-[#E7E5DF] rounded pl-8 pr-3 py-1.5 text-xs text-[#1A1A1A] focus:outline-none focus:border-[#3A4032]"
            />
          </div>

          {/* Job Requisition Filter */}
          <select
            value={jobFilter}
            onChange={e => setJobFilter(e.target.value)}
            className="bg-[#FAF9F6] border border-[#E7E5DF] text-xs text-[#1A1A1A] rounded px-3 py-1.5 focus:outline-none focus:border-[#3A4032]"
          >
            <option value="ALL">All Jobs</option>
            {jobs.map(job => (
              <option key={job.id} value={job.id}>
                {job.title}
              </option>
            ))}
          </select>

          {/* Pipeline Status Filter */}
          <select
            value={statusFilter}
            onChange={e => setStatusFilter(e.target.value)}
            className="bg-[#FAF9F6] border border-[#E7E5DF] text-xs text-[#1A1A1A] rounded px-3 py-1.5 focus:outline-none focus:border-[#3A4032]"
          >
            <option value="ALL">All Statuses</option>
            <option value="NEW">New / Unscreened</option>
            <option value="SHORTLIST">Shortlisted</option>
            <option value="REVIEW">Under Review</option>
            <option value="INTERVIEW">Interview Scheduled</option>
            <option value="REJECT">Rejected</option>
          </select>
        </div>
      </div>

      {/* Candidates Table */}
      <div className="bg-white border border-[#E7E5DF] rounded-md overflow-hidden">
        {candidates.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-[#1A1A1A]">
              <thead>
                <tr className="bg-[#FAF9F6] border-b border-[#E7E5DF] text-[#6B6B63] font-medium text-[11px]">
                  <th className="py-2.5 px-4 font-normal">Candidate</th>
                  <th className="py-2.5 px-4 font-normal">Current Title & Exp</th>
                  <th className="py-2.5 px-4 font-normal text-right">Match Score</th>
                  <th className="py-2.5 px-4 font-normal">Key Skills</th>
                  <th className="py-2.5 px-4 font-normal">Status</th>
                  <th className="py-2.5 px-4 font-normal text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E7E5DF]">
                {filteredCandidates.length > 0 ? (
                  filteredCandidates.map(cand => {
                    const latestApp = cand.applications?.[0];
                    const result = latestApp?.screeningResult;
                    const score = result?.overallScore;

                    return (
                      <tr
                        key={cand.id}
                        onClick={() => onSelectCandidate(cand.id)}
                        className="hover:bg-[#FAF9F6] cursor-pointer transition"
                      >
                        <td className="py-3 px-4 font-medium text-[#1A1A1A]">
                          <div className="font-semibold text-xs">{cand.name}</div>
                          <div className="text-[10px] text-[#6B6B63]">{cand.email} • {cand.location}</div>
                        </td>

                        <td className="py-3 px-4 text-[#6B6B63]">
                          <div className="text-xs text-[#1A1A1A]">{cand.currentTitle}</div>
                          <div className="text-[10px] text-[#6B6B63] font-mono">{cand.totalExperienceYears} yrs experience</div>
                        </td>

                        <td className="py-3 px-4 text-right font-mono font-bold text-sm text-[#1A1A1A]">
                          {score !== undefined ? `${score}%` : '—'}
                        </td>

                        <td className="py-3 px-4">
                          <div className="flex flex-wrap gap-1 max-w-xs">
                            {cand.skills?.slice(0, 4).map((sk, idx) => (
                              <span
                                key={idx}
                                className="px-1.5 py-0.5 text-[10px] bg-[#FAF9F6] text-[#1A1A1A] rounded border border-[#E7E5DF]"
                              >
                                {sk}
                              </span>
                            ))}
                          </div>
                        </td>

                        <td className="py-3 px-4">
                          <span
                            className={`inline-block px-2 py-0.5 text-[10px] font-medium rounded border ${
                              latestApp?.status === 'SHORTLIST'
                                ? 'bg-[#F3F2EE] text-[#3A4032] border-[#D0CDBF]'
                                : latestApp?.status === 'INTERVIEW'
                                ? 'bg-[#EBF2EE] text-[#2D5A38] border-[#C3D9CA]'
                                : latestApp?.status === 'REJECT'
                                ? 'bg-[#FDF2F2] text-[#8C2A2A] border-[#F2D0D0]'
                                : 'bg-[#FAF9F6] text-[#6B6B63] border-[#E7E5DF]'
                            }`}
                          >
                            {latestApp?.status || 'NEW'}
                          </span>
                        </td>

                        <td className="py-3 px-4 text-right">
                          <button
                            onClick={e => {
                              e.stopPropagation();
                              onSelectCandidate(cand.id);
                            }}
                            className="px-2.5 py-1 text-[11px] font-medium bg-[#FAF9F6] hover:bg-[#EFECE6] text-[#1A1A1A] border border-[#E7E5DF] rounded transition inline-flex items-center gap-1"
                          >
                            View Profile <ChevronRight className="w-3 h-3 text-[#6B6B63]" />
                          </button>
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan={6} className="py-8 text-center text-[#6B6B63] italic">
                      No candidates match the selected search or filter criteria.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="py-12 text-center space-y-2 bg-[#FAF9F6] p-6">
            <FileText className="w-8 h-8 text-[#6B6B63] mx-auto" />
            <h3 className="font-serif font-bold text-[#1A1A1A] text-sm">No Candidates Found</h3>
            <p className="text-xs text-[#6B6B63] max-w-sm mx-auto">
              Import candidate PDF/DOCX resumes to populate the recruitment directory.
            </p>
            <button
              onClick={onNavigateToUpload}
              className="mt-2 px-3.5 py-1.5 text-xs font-medium bg-[#3A4032] hover:bg-[#2D3227] text-white rounded transition"
            >
              Import Resumes
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

