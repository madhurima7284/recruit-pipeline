import React, { useState } from 'react';
import { Briefcase, Plus, Sparkles, Clock, MapPin, X, Bot } from 'lucide-react';
import { api } from '../services/api';

export const JobsPage = ({ jobs = [], onRefreshJobs, onSelectJobForScreening }) => {
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [rawJdText, setRawJdText] = useState('');
  const [isParsing, setIsParsing] = useState(false);

  // Form State
  const [title, setTitle] = useState('');
  const [department, setDepartment] = useState('Engineering');
  const [location, setLocation] = useState('San Francisco, CA (Hybrid)');
  const [employmentType, setEmploymentType] = useState('Full-time');
  const [description, setDescription] = useState('');
  const [requirementsText, setRequirementsText] = useState('');
  const [requiredSkillsText, setRequiredSkillsText] = useState('');
  const [preferredSkillsText, setPreferredSkillsText] = useState('');
  const [minExperienceYears, setMinExperienceYears] = useState(3);
  const [educationRequired, setEducationRequired] = useState("Bachelor's Degree in Computer Science");

  const handleAutoParse = async () => {
    if (!rawJdText.trim()) return;
    setIsParsing(true);
    try {
      const parsed = await api.autoParseJobText(rawJdText);
      if (parsed.title) setTitle(parsed.title);
      if (parsed.department) setDepartment(parsed.department);
      if (parsed.location) setLocation(parsed.location);
      if (parsed.description) setDescription(parsed.description);
      if (parsed.requirements) setRequirementsText(parsed.requirements.join('\n'));
      if (parsed.requiredSkills) setRequiredSkillsText(parsed.requiredSkills.join(', '));
      if (parsed.preferredSkills) setPreferredSkillsText(parsed.preferredSkills.join(', '));
      if (parsed.minExperienceYears) setMinExperienceYears(parsed.minExperienceYears);
      if (parsed.educationRequired) setEducationRequired(parsed.educationRequired);
    } catch (err) {
      console.error('Failed to parse JD:', err);
    } finally {
      setIsParsing(false);
    }
  };

  const handleCreateJob = async (e) => {
    e.preventDefault();
    try {
      await api.createJob({
        title,
        department,
        location,
        employmentType,
        description,
        requirements: requirementsText.split('\n').filter(Boolean),
        requiredSkills: requiredSkillsText.split(',').map(s => s.trim()).filter(Boolean),
        preferredSkills: preferredSkillsText.split(',').map(s => s.trim()).filter(Boolean),
        minExperienceYears: Number(minExperienceYears),
        educationRequired
      });
      setShowCreateModal(false);
      onRefreshJobs();
    } catch (err) {
      console.error('Failed to create job:', err);
    }
  };

  return (
    <div className="space-y-6 text-[#1A1A1A]">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 bg-white p-5 rounded-md border border-[#E7E5DF]">
        <div>
          <h2 className="font-serif font-bold text-lg text-[#1A1A1A]">Job Positions</h2>
          <p className="text-xs text-[#6B6B63] mt-0.5">
            Configure required skill sets, minimum experience requirements, and candidate evaluation metrics.
          </p>
        </div>

        <button
          onClick={() => setShowCreateModal(true)}
          className="px-3.5 py-1.5 text-xs font-medium bg-[#3A4032] hover:bg-[#2D3227] text-white rounded transition flex items-center gap-1.5"
        >
          <Plus className="w-3.5 h-3.5" /> Add Job Requisition
        </button>
      </div>

      {/* Jobs Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {jobs.map(job => (
          <div
            key={job.id}
            className="bg-white border border-[#E7E5DF] rounded-md p-5 space-y-4 flex flex-col justify-between hover:border-[#3A4032] transition"
          >
            <div className="space-y-3">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <span className="px-2 py-0.5 text-[10px] font-mono font-medium bg-[#FAF9F6] text-[#6B6B63] border border-[#E7E5DF] rounded">
                    {job.department}
                  </span>
                  <h3 className="font-serif font-bold text-base text-[#1A1A1A] mt-1.5">{job.title}</h3>
                </div>
                <span className="text-[10px] font-medium px-2 py-0.5 bg-[#F3F2EE] text-[#3A4032] rounded border border-[#D0CDBF]">
                  {job.status}
                </span>
              </div>

              <div className="flex flex-wrap items-center gap-3 text-xs text-[#6B6B63] font-mono">
                <span className="flex items-center gap-1">
                  <MapPin className="w-3 h-3 text-[#6B6B63]" /> {job.location}
                </span>
                <span className="flex items-center gap-1">
                  <Clock className="w-3 h-3 text-[#6B6B63]" /> {job.employmentType}
                </span>
              </div>

              <p className="text-xs text-[#6B6B63] line-clamp-2 leading-relaxed">{job.description}</p>

              {/* Required Skills */}
              <div className="space-y-1.5 pt-1">
                <div className="text-[10px] uppercase font-semibold text-[#6B6B63]">
                  Required Skills ({job.requiredSkills?.length || 0}):
                </div>
                <div className="flex flex-wrap gap-1">
                  {job.requiredSkills?.map((sk, idx) => (
                    <span
                      key={idx}
                      className="px-2 py-0.5 text-[11px] font-medium bg-[#FAF9F6] text-[#1A1A1A] border border-[#E7E5DF] rounded"
                    >
                      {sk}
                    </span>
                  ))}
                </div>
              </div>

              {/* Min Experience & Education */}
              <div className="text-[11px] text-[#6B6B63] bg-[#FAF9F6] p-2.5 rounded border border-[#E7E5DF] space-y-1 font-mono">
                <div><span className="text-[#1A1A1A] font-medium">Experience:</span> {job.minExperienceYears}+ Years</div>
                <div><span className="text-[#1A1A1A] font-medium">Education:</span> {job.educationRequired}</div>
              </div>
            </div>

            <div className="pt-3 border-t border-[#E7E5DF] flex items-center justify-between text-xs">
              <span className="text-[#6B6B63] font-mono">{job.candidateCount || 0} Candidates</span>
              {onSelectJobForScreening && (
                <button
                  onClick={() => onSelectJobForScreening(job.id)}
                  className="text-xs font-medium text-[#3A4032] hover:underline"
                >
                  Screen Candidates &rarr;
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Modal / Form for Creating Job */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 bg-[#1A1A1A]/30 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white border border-[#E7E5DF] rounded-md max-w-2xl w-full text-[#1A1A1A] my-8 overflow-hidden shadow-lg">
            <div className="bg-[#FAF9F6] px-5 py-3 border-b border-[#E7E5DF] flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Briefcase className="w-4 h-4 text-[#3A4032]" />
                <h3 className="font-serif font-bold text-sm text-[#1A1A1A]">Create Job Position</h3>
              </div>
              <button onClick={() => setShowCreateModal(false)} className="text-[#6B6B63] hover:text-[#1A1A1A]">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-5 space-y-5 max-h-[80vh] overflow-y-auto">
              {/* Auto Parse Section */}
              <div className="bg-[#FAF9F6] border border-[#E7E5DF] p-3.5 rounded space-y-2.5">
                <div className="flex items-center gap-2 text-xs font-semibold text-[#1A1A1A]">
                  <Sparkles className="w-3.5 h-3.5 text-[#3A4032]" />
                  <span>Auto-Extract Fields From Job Description Text</span>
                </div>
                <textarea
                  rows={3}
                  value={rawJdText}
                  onChange={e => setRawJdText(e.target.value)}
                  placeholder="Paste job description text here..."
                  className="w-full bg-white border border-[#E7E5DF] rounded p-2 text-xs text-[#1A1A1A] focus:outline-none focus:border-[#3A4032]"
                />
                <button
                  type="button"
                  onClick={handleAutoParse}
                  disabled={isParsing || !rawJdText.trim()}
                  className="px-3 py-1.5 text-xs font-medium bg-[#3A4032] hover:bg-[#2D3227] disabled:opacity-50 text-white rounded transition flex items-center gap-1.5"
                >
                  <Bot className="w-3.5 h-3.5" />
                  {isParsing ? 'Parsing Fields...' : 'Parse Text'}
                </button>
              </div>

              {/* Job Form */}
              <form onSubmit={handleCreateJob} className="space-y-4 text-xs">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-[#1A1A1A] font-medium">Job Title *</label>
                    <input
                      type="text"
                      required
                      value={title}
                      onChange={e => setTitle(e.target.value)}
                      placeholder="e.g. Senior AI / ML Engineer"
                      className="w-full bg-[#FAF9F6] border border-[#E7E5DF] rounded p-2 text-[#1A1A1A] focus:outline-none focus:border-[#3A4032]"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[#1A1A1A] font-medium">Department *</label>
                    <input
                      type="text"
                      required
                      value={department}
                      onChange={e => setDepartment(e.target.value)}
                      placeholder="Engineering"
                      className="w-full bg-[#FAF9F6] border border-[#E7E5DF] rounded p-2 text-[#1A1A1A] focus:outline-none focus:border-[#3A4032]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-[#1A1A1A] font-medium">Location</label>
                    <input
                      type="text"
                      value={location}
                      onChange={e => setLocation(e.target.value)}
                      placeholder="San Francisco, CA (Hybrid)"
                      className="w-full bg-[#FAF9F6] border border-[#E7E5DF] rounded p-2 text-[#1A1A1A] focus:outline-none focus:border-[#3A4032]"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[#1A1A1A] font-medium">Employment Type</label>
                    <select
                      value={employmentType}
                      onChange={e => setEmploymentType(e.target.value)}
                      className="w-full bg-[#FAF9F6] border border-[#E7E5DF] rounded p-2 text-[#1A1A1A] focus:outline-none focus:border-[#3A4032]"
                    >
                      <option value="Full-time">Full-time</option>
                      <option value="Part-time">Part-time</option>
                      <option value="Contract">Contract</option>
                      <option value="Remote">Remote</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-[#1A1A1A] font-medium">Overview Description *</label>
                  <textarea
                    rows={2}
                    required
                    value={description}
                    onChange={e => setDescription(e.target.value)}
                    placeholder="Role responsibilities and scope..."
                    className="w-full bg-[#FAF9F6] border border-[#E7E5DF] rounded p-2 text-[#1A1A1A] focus:outline-none focus:border-[#3A4032]"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-[#1A1A1A] font-medium">Required Skills (Comma Separated) *</label>
                    <input
                      type="text"
                      required
                      value={requiredSkillsText}
                      onChange={e => setRequiredSkillsText(e.target.value)}
                      placeholder="Python, FastAPI, LangGraph, Gemini API"
                      className="w-full bg-[#FAF9F6] border border-[#E7E5DF] rounded p-2 text-[#1A1A1A] focus:outline-none focus:border-[#3A4032]"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[#1A1A1A] font-medium">Preferred Skills (Comma Separated)</label>
                    <input
                      type="text"
                      value={preferredSkillsText}
                      onChange={e => setPreferredSkillsText(e.target.value)}
                      placeholder="Docker, Kubernetes, React, MLOps"
                      className="w-full bg-[#FAF9F6] border border-[#E7E5DF] rounded p-2 text-[#1A1A1A] focus:outline-none focus:border-[#3A4032]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-[#1A1A1A] font-medium">Min Experience Years</label>
                    <input
                      type="number"
                      min={0}
                      max={20}
                      value={minExperienceYears}
                      onChange={e => setMinExperienceYears(Number(e.target.value))}
                      className="w-full bg-[#FAF9F6] border border-[#E7E5DF] rounded p-2 text-[#1A1A1A] focus:outline-none focus:border-[#3A4032]"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[#1A1A1A] font-medium">Education Requirement</label>
                    <input
                      type="text"
                      value={educationRequired}
                      onChange={e => setEducationRequired(e.target.value)}
                      placeholder="Bachelor's or Master's in CS"
                      className="w-full bg-[#FAF9F6] border border-[#E7E5DF] rounded p-2 text-[#1A1A1A] focus:outline-none focus:border-[#3A4032]"
                    />
                  </div>
                </div>

                <div className="pt-3 flex items-center justify-end gap-2.5 border-t border-[#E7E5DF]">
                  <button
                    type="button"
                    onClick={() => setShowCreateModal(false)}
                    className="px-3 py-1.5 text-xs font-medium bg-[#FAF9F6] hover:bg-[#EFECE6] text-[#1A1A1A] border border-[#E7E5DF] rounded transition"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-1.5 text-xs font-medium bg-[#3A4032] hover:bg-[#2D3227] text-white rounded transition"
                  >
                    Save Position
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

