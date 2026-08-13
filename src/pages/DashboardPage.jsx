import React from 'react';
import {
  Users,
  Briefcase,
  CheckCircle2,
  Calendar,
  ArrowRight,
  Upload,
  Plus,
  FileText
} from 'lucide-react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from 'recharts';

export const DashboardPage = ({
  jobs = [],
  applications = [],
  interviews = [],
  onSelectCandidate,
  onNavigate,
  onSeedData
}) => {
  const activeJobsCount = jobs.filter(j => j.status === 'ACTIVE').length;
  const totalCandidatesCount = applications.length;
  const candidatesScreenedCount = applications.filter(a => a.screeningResult).length;
  const interviewsScheduledCount = interviews.length;

  // Chart activity sample data or derived from applications
  const activityData = [
    { date: 'Aug 5', screened: 2, shortlisted: 1 },
    { date: 'Aug 6', screened: 5, shortlisted: 3 },
    { date: 'Aug 7', screened: 4, shortlisted: 2 },
    { date: 'Aug 8', screened: 7, shortlisted: 4 },
    { date: 'Aug 9', screened: 6, shortlisted: 3 },
    { date: 'Aug 10', screened: 9, shortlisted: 5 },
    { date: 'Aug 11', screened: 8, shortlisted: 6 },
    { date: 'Aug 12', screened: 12, shortlisted: 8 }
  ];

  return (
    <div className="space-y-6 text-[#1A1A1A]">
      {/* Header Banner */}
      <div className="bg-white border border-[#E7E5DF] rounded-md p-5 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="font-serif font-bold text-lg text-[#1A1A1A]">Recruiter Overview</h2>
          <p className="text-xs text-[#6B6B63] mt-0.5">
            Monitor open requisitions, candidate evaluation scores, and pipeline progression.
          </p>
        </div>
        <div className="flex items-center gap-2.5">
          <button
            onClick={() => onNavigate('upload')}
            className="px-3.5 py-1.5 text-xs font-medium bg-[#3A4032] hover:bg-[#2D3227] text-white rounded transition flex items-center gap-1.5"
          >
            <Upload className="w-3.5 h-3.5" />
            <span>Import Resumes</span>
          </button>
          <button
            onClick={() => onNavigate('pipeline')}
            className="px-3.5 py-1.5 text-xs font-medium bg-[#FAF9F6] hover:bg-[#EFECE6] text-[#1A1A1A] border border-[#E7E5DF] rounded transition"
          >
            View Pipeline
          </button>
        </div>
      </div>

      {/* Metric Cards Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white border border-[#E7E5DF] p-4 rounded-md space-y-1">
          <div className="flex items-center justify-between text-[#6B6B63]">
            <span className="text-xs font-medium">Active Jobs</span>
            <Briefcase className="w-4 h-4 text-[#6B6B63]" />
          </div>
          <div className="text-2xl font-bold font-serif text-[#1A1A1A]">{activeJobsCount}</div>
          <p className="text-[10px] text-[#6B6B63]">Open requisitions</p>
        </div>

        <div className="bg-white border border-[#E7E5DF] p-4 rounded-md space-y-1">
          <div className="flex items-center justify-between text-[#6B6B63]">
            <span className="text-xs font-medium">Total Candidates</span>
            <Users className="w-4 h-4 text-[#6B6B63]" />
          </div>
          <div className="text-2xl font-bold font-serif text-[#1A1A1A]">{totalCandidatesCount}</div>
          <p className="text-[10px] text-[#6B6B63]">In database</p>
        </div>

        <div className="bg-white border border-[#E7E5DF] p-4 rounded-md space-y-1">
          <div className="flex items-center justify-between text-[#6B6B63]">
            <span className="text-xs font-medium">Candidates Screened</span>
            <CheckCircle2 className="w-4 h-4 text-[#3A4032]" />
          </div>
          <div className="text-2xl font-bold font-serif text-[#3A4032]">{candidatesScreenedCount}</div>
          <p className="text-[10px] text-[#6B6B63]">AI evaluated</p>
        </div>

        <div className="bg-white border border-[#E7E5DF] p-4 rounded-md space-y-1">
          <div className="flex items-center justify-between text-[#6B6B63]">
            <span className="text-xs font-medium">Interviews Scheduled</span>
            <Calendar className="w-4 h-4 text-[#6B6B63]" />
          </div>
          <div className="text-2xl font-bold font-serif text-[#1A1A1A]">{interviewsScheduledCount}</div>
          <p className="text-[10px] text-[#6B6B63]">Upcoming rounds</p>
        </div>
      </div>

      {/* Main Split: Recent Candidates & Recruitment Activity Chart */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Candidates Table */}
        <div className="lg:col-span-2 bg-white border border-[#E7E5DF] rounded-md p-5 space-y-4">
          <div className="flex items-center justify-between border-b border-[#E7E5DF] pb-3">
            <div>
              <h3 className="font-serif font-bold text-sm text-[#1A1A1A]">Recent Candidates</h3>
              <p className="text-xs text-[#6B6B63]">Candidate evaluation results and pipeline decisions</p>
            </div>
            <button
              onClick={() => onNavigate('candidates')}
              className="text-xs font-medium text-[#3A4032] hover:underline flex items-center gap-1"
            >
              View Directory <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {applications.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-[#1A1A1A]">
                <thead>
                  <tr className="border-b border-[#E7E5DF] text-[#6B6B63] font-medium text-[11px]">
                    <th className="pb-2 font-normal">Candidate</th>
                    <th className="pb-2 font-normal">Applied Role</th>
                    <th className="pb-2 font-normal text-right">AI Score</th>
                    <th className="pb-2 font-normal">Status</th>
                    <th className="pb-2 font-normal">Applied Date</th>
                    <th className="pb-2 font-normal text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#E7E5DF]">
                  {applications.slice(0, 6).map(app => {
                    const cand = app.candidate;
                    const job = app.job || jobs.find(j => j.id === app.jobId);
                    const score = app.screeningResult?.overallScore;
                    if (!cand) return null;

                    return (
                      <tr key={app.id} className="hover:bg-[#FAF9F6] transition">
                        <td className="py-2.5 font-medium text-[#1A1A1A]">
                          <div>{cand.name}</div>
                          <div className="text-[10px] text-[#6B6B63]">{cand.currentTitle}</div>
                        </td>
                        <td className="py-2.5 text-[#6B6B63]">
                          {job?.title || 'General Applicant'}
                        </td>
                        <td className="py-2.5 text-right font-mono font-bold text-[#1A1A1A]">
                          {score !== undefined ? `${score}%` : 'N/A'}
                        </td>
                        <td className="py-2.5">
                          <span className={`inline-block px-1.5 py-0.5 text-[10px] font-medium rounded border ${
                            app.status === 'SHORTLIST'
                              ? 'bg-[#F3F2EE] text-[#3A4032] border-[#D0CDBF]'
                              : app.status === 'INTERVIEW'
                              ? 'bg-[#EBF2EE] text-[#2D5A38] border-[#C3D9CA]'
                              : app.status === 'REJECT'
                              ? 'bg-[#FDF2F2] text-[#8C2A2A] border-[#F2D0D0]'
                              : 'bg-[#FAF9F6] text-[#6B6B63] border-[#E7E5DF]'
                          }`}>
                            {app.status}
                          </span>
                        </td>
                        <td className="py-2.5 text-[#6B6B63] text-[11px]">
                          {new Date(app.appliedAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                        </td>
                        <td className="py-2.5 text-right">
                          <button
                            onClick={() => onSelectCandidate(cand.id)}
                            className="px-2.5 py-1 text-[11px] font-medium bg-[#FAF9F6] hover:bg-[#EFECE6] border border-[#E7E5DF] text-[#1A1A1A] rounded transition"
                          >
                            Review
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="py-10 text-center space-y-2 bg-[#FAF9F6] border border-dashed border-[#E7E5DF] rounded p-6">
              <FileText className="w-7 h-7 text-[#6B6B63] mx-auto" />
              <p className="text-xs font-medium text-[#1A1A1A]">No candidate records available</p>
              <p className="text-[11px] text-[#6B6B63]">Upload a resume or seed sample candidates to inspect evaluation scores.</p>
              {onSeedData && (
                <button
                  onClick={onSeedData}
                  className="mt-2 px-3 py-1.5 text-xs bg-white hover:bg-[#EFECE6] border border-[#E7E5DF] rounded font-medium"
                >
                  Load Sample Data
                </button>
              )}
            </div>
          )}
        </div>

        {/* Recruitment Activity Chart & Jobs Panel */}
        <div className="space-y-6">
          {/* Recruitment Activity Chart */}
          <div className="bg-white border border-[#E7E5DF] rounded-md p-5 space-y-3">
            <div>
              <h3 className="font-serif font-bold text-sm text-[#1A1A1A]">Recruitment Activity</h3>
              <p className="text-xs text-[#6B6B63]">Candidates screened over time</p>
            </div>

            <div className="h-44 w-full pt-2">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={activityData} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#E7E5DF" />
                  <XAxis dataKey="date" tick={{ fontSize: 10, fill: '#6B6B63' }} axisLine={{ stroke: '#E7E5DF' }} />
                  <YAxis tick={{ fontSize: 10, fill: '#6B6B63' }} axisLine={{ stroke: '#E7E5DF' }} />
                  <Tooltip
                    contentStyle={{ backgroundColor: '#FFFFFF', borderColor: '#E7E5DF', fontSize: '11px', borderRadius: '4px' }}
                  />
                  <Area type="monotone" dataKey="screened" stroke="#3A4032" fill="#EFECE6" strokeWidth={2} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Quick Active Jobs Panel */}
          <div className="bg-white border border-[#E7E5DF] rounded-md p-5 space-y-3">
            <div className="flex items-center justify-between border-b border-[#E7E5DF] pb-2">
              <h3 className="font-serif font-bold text-sm text-[#1A1A1A]">Open Positions</h3>
              <button
                onClick={() => onNavigate('jobs')}
                className="text-xs text-[#3A4032] hover:underline font-medium"
              >
                Manage
              </button>
            </div>

            <div className="space-y-2 text-xs">
              {jobs.map(job => (
                <div key={job.id} className="p-2.5 bg-[#FAF9F6] border border-[#E7E5DF] rounded space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="font-medium text-[#1A1A1A]">{job.title}</span>
                    <span className="text-[10px] text-[#6B6B63] font-mono">{job.department}</span>
                  </div>
                  <div className="flex items-center justify-between text-[10px] text-[#6B6B63] pt-0.5">
                    <span>{job.location}</span>
                    <span className="font-semibold text-[#1A1A1A]">{job.candidateCount || 0} applicants</span>
                  </div>
                </div>
              ))}
              {jobs.length === 0 && (
                <div className="text-xs text-[#6B6B63] text-center py-3">No active jobs found.</div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

