import React, { useState } from 'react';
import { Upload, FileText, CheckCircle2, AlertCircle, ArrowRight } from 'lucide-react';
import { api } from '../services/api';

export const CandidateUploadPage = ({ jobs = [], onUploadSuccess }) => {
  const [selectedJobId, setSelectedJobId] = useState(jobs[0]?.id || '');
  const [file, setFile] = useState(null);
  const [pastedText, setPastedText] = useState('');
  const [uploadMode, setUploadMode] = useState('file');
  const [isProcessing, setIsProcessing] = useState(false);
  const [processResult, setProcessResult] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);

  const handleFileDrop = (e) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileSelect = (e) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (uploadMode === 'file' && !file) {
      setErrorMsg('Please select a PDF or DOCX resume file.');
      return;
    }
    if (uploadMode === 'text' && !pastedText.trim()) {
      setErrorMsg('Please paste resume text.');
      return;
    }

    setIsProcessing(true);
    setErrorMsg(null);
    setProcessResult(null);

    try {
      const formData = new FormData();
      if (uploadMode === 'file' && file) {
        formData.append('resumeFile', file);
      } else {
        formData.append('rawText', pastedText);
      }
      if (selectedJobId) {
        formData.append('jobId', selectedJobId);
      }

      const res = await api.uploadCandidate(formData);
      setProcessResult(res);
    } catch (err) {
      setErrorMsg(err.message || 'Failed to process resume.');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 text-[#1A1A1A]">
      {/* Header */}
      <div className="bg-white p-5 rounded-md border border-[#E7E5DF] space-y-1">
        <h2 className="font-serif font-bold text-lg text-[#1A1A1A]">Import Candidate Resumes</h2>
        <p className="text-xs text-[#6B6B63]">
          Upload PDF/DOCX resumes or paste text to parse technical qualifications and evaluate against job requirements.
        </p>
      </div>

      {!processResult ? (
        <form onSubmit={handleSubmit} className="bg-white p-5 rounded-md border border-[#E7E5DF] space-y-5">
          {/* Target Job Selector */}
          <div className="space-y-1">
            <label className="text-xs font-medium text-[#1A1A1A]">Target Job Position *</label>
            <select
              value={selectedJobId}
              onChange={e => setSelectedJobId(e.target.value)}
              className="w-full bg-[#FAF9F6] border border-[#E7E5DF] rounded p-2 text-xs text-[#1A1A1A] focus:outline-none focus:border-[#3A4032]"
            >
              {jobs.map(job => (
                <option key={job.id} value={job.id}>
                  {job.title} — {job.department} ({job.location})
                </option>
              ))}
            </select>
          </div>

          {/* Mode Switcher */}
          <div className="flex items-center gap-2 border-b border-[#E7E5DF] pb-3 text-xs">
            <button
              type="button"
              onClick={() => setUploadMode('file')}
              className={`px-3 py-1.5 rounded text-xs font-medium transition ${
                uploadMode === 'file'
                  ? 'bg-[#3A4032] text-white'
                  : 'bg-[#FAF9F6] text-[#6B6B63] hover:text-[#1A1A1A] border border-[#E7E5DF]'
              }`}
            >
              Resume File (PDF / DOCX)
            </button>
            <button
              type="button"
              onClick={() => setUploadMode('text')}
              className={`px-3 py-1.5 rounded text-xs font-medium transition ${
                uploadMode === 'text'
                  ? 'bg-[#3A4032] text-white'
                  : 'bg-[#FAF9F6] text-[#6B6B63] hover:text-[#1A1A1A] border border-[#E7E5DF]'
              }`}
            >
              Paste Resume Text
            </button>
          </div>

          {/* File Upload Dropzone */}
          {uploadMode === 'file' ? (
            <div
              onDragOver={e => e.preventDefault()}
              onDrop={handleFileDrop}
              className="border border-dashed border-[#E7E5DF] hover:border-[#3A4032] rounded-md p-8 text-center bg-[#FAF9F6] transition space-y-3"
            >
              <div className="w-10 h-10 rounded bg-white border border-[#E7E5DF] text-[#6B6B63] mx-auto flex items-center justify-center">
                <FileText className="w-5 h-5" />
              </div>
              <div className="space-y-1">
                <h4 className="font-serif font-bold text-xs text-[#1A1A1A]">
                  {file ? file.name : 'Drag & Drop candidate resume file here'}
                </h4>
                <p className="text-[11px] text-[#6B6B63]">Supports PDF, DOCX, or TXT formats</p>
              </div>

              <label className="inline-block px-3.5 py-1.5 text-xs font-medium bg-white hover:bg-[#EFECE6] text-[#1A1A1A] border border-[#E7E5DF] rounded cursor-pointer transition">
                Browse File
                <input
                  type="file"
                  accept=".pdf,.docx,.txt"
                  onChange={handleFileSelect}
                  className="hidden"
                />
              </label>
            </div>
          ) : (
            <div className="space-y-1">
              <label className="text-xs font-medium text-[#1A1A1A]">Paste Resume Text</label>
              <textarea
                rows={8}
                value={pastedText}
                onChange={e => setPastedText(e.target.value)}
                placeholder="Paste candidate resume overview, experience timeline, and technical skills..."
                className="w-full bg-[#FAF9F6] border border-[#E7E5DF] rounded p-2.5 text-xs text-[#1A1A1A] focus:outline-none focus:border-[#3A4032] font-mono"
              />
            </div>
          )}

          {errorMsg && (
            <div className="p-3 bg-[#FDF2F2] border border-[#F2D0D0] rounded text-xs text-[#8C2A2A] flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-[#8C2A2A] shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          <div className="pt-2 flex items-center justify-end">
            <button
              type="submit"
              disabled={isProcessing}
              className="px-4 py-2 text-xs font-medium bg-[#3A4032] hover:bg-[#2D3227] disabled:opacity-50 text-white rounded transition flex items-center gap-1.5"
            >
              <Upload className="w-3.5 h-3.5" />
              <span>{isProcessing ? 'Parsing & Evaluating...' : 'Parse & Screen Candidate'}</span>
            </button>
          </div>
        </form>
      ) : (
        /* Process Result Showcase */
        <div className="bg-white border border-[#E7E5DF] rounded-md p-5 text-[#1A1A1A] space-y-5">
          <div className="flex items-center justify-between border-b border-[#E7E5DF] pb-4">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded bg-[#EBF2EE] text-[#2D5A38] border border-[#C3D9CA] flex items-center justify-center">
                <CheckCircle2 className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-serif font-bold text-base text-[#1A1A1A]">Candidate Evaluated</h3>
                <p className="text-xs text-[#6B6B63]">Extracted qualifications saved to candidate record</p>
              </div>
            </div>

            <button
              onClick={() => onUploadSuccess(processResult.candidate.id)}
              className="px-3.5 py-1.5 text-xs font-medium bg-[#3A4032] hover:bg-[#2D3227] text-white rounded transition flex items-center gap-1.5"
            >
              <span>View Profile</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Quick Extracted Summary */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-mono">
            <div className="bg-[#FAF9F6] p-4 rounded border border-[#E7E5DF] space-y-2">
              <span className="text-[10px] text-[#6B6B63] uppercase tracking-wider font-semibold">Parsed Profile</span>
              <div className="text-sm font-bold text-[#1A1A1A] font-serif">{processResult.candidate.name}</div>
              <div className="text-[#6B6B63]">{processResult.candidate.email} • {processResult.candidate.phone}</div>
              <div className="text-[#1A1A1A]">{processResult.candidate.currentTitle} ({processResult.candidate.totalExperienceYears} yrs exp)</div>
              <div className="flex flex-wrap gap-1 pt-2">
                {processResult.candidate.skills?.map((s, idx) => (
                  <span key={idx} className="px-1.5 py-0.5 text-[10px] bg-white text-[#1A1A1A] rounded border border-[#E7E5DF]">
                    {s}
                  </span>
                ))}
              </div>
            </div>

            <div className="bg-[#FAF9F6] p-4 rounded border border-[#E7E5DF] space-y-2">
              <span className="text-[10px] text-[#6B6B63] uppercase tracking-wider font-semibold">Screening Outcome</span>
              <div className="flex items-center justify-between">
                <span className="text-[#6B6B63]">Match Score:</span>
                <span className="text-lg font-bold text-[#1A1A1A] font-mono">
                  {processResult.screeningResult?.overallScore || 0}%
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[#6B6B63]">Recommendation:</span>
                <span className="px-2 py-0.5 font-semibold rounded bg-[#F3F2EE] text-[#3A4032] border border-[#D0CDBF]">
                  {processResult.screeningResult?.decision || 'SHORTLIST'}
                </span>
              </div>
              <p className="text-[11px] text-[#6B6B63] font-sans pt-1 italic line-clamp-3">
                "{processResult.screeningResult?.llmExplanation}"
              </p>
            </div>
          </div>

          <div className="pt-2 flex justify-end">
            <button
              onClick={() => {
                setProcessResult(null);
                setFile(null);
                setPastedText('');
              }}
              className="px-3.5 py-1.5 text-xs font-medium bg-[#FAF9F6] hover:bg-[#EFECE6] text-[#1A1A1A] border border-[#E7E5DF] rounded transition"
            >
              Upload Another Resume
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

