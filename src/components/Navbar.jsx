import React from 'react';
import { UserCheck, FileCode, Upload, RefreshCw, Sparkles } from 'lucide-react';

export const Navbar = ({ onQuickUploadClick, onViewCodeClick, onResetData }) => {
  return (
    <header className="sticky top-0 z-30 bg-white border-b border-[#E7E5DF] text-[#1A1A1A] px-6 py-2.5 flex items-center justify-between">
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 rounded bg-[#3A4032] flex items-center justify-center text-white font-serif font-bold text-sm">
          A
        </div>
        <div>
          <div className="flex items-center gap-2">
            <h1 className="font-serif font-bold text-sm tracking-tight text-[#1A1A1A]">Acme Talent OS</h1>
            <span className="px-1.5 py-0.5 text-[10px] font-mono text-[#6B6B63] bg-[#FAF9F6] border border-[#E7E5DF] rounded">
              v2.4
            </span>
          </div>
          <p className="text-[11px] text-[#6B6B63]">AI Screening & Recruitment Pipeline</p>
        </div>
      </div>

      <div className="flex items-center gap-2.5">
        {onResetData && (
          <button
            onClick={onResetData}
            className="px-2.5 py-1.5 text-xs font-medium bg-[#FAF9F6] hover:bg-[#EFECE6] text-[#1A1A1A] border border-[#E7E5DF] rounded transition flex items-center gap-1.5"
            title="Reset / Seed sample candidate database"
          >
            <RefreshCw className="w-3.5 h-3.5 text-[#6B6B63]" />
            <span className="hidden sm:inline">Reset Sample Data</span>
          </button>
        )}

        <button
          onClick={onViewCodeClick}
          className="px-3 py-1.5 text-xs font-medium bg-[#FAF9F6] hover:bg-[#EFECE6] text-[#1A1A1A] border border-[#E7E5DF] rounded transition flex items-center gap-1.5"
          title="View Python, FastAPI, & System Architecture"
        >
          <FileCode className="w-3.5 h-3.5 text-[#6B6B63]" />
          <span className="hidden sm:inline">System Architecture</span>
        </button>

        <button
          onClick={onQuickUploadClick}
          className="px-3.5 py-1.5 text-xs font-medium bg-[#3A4032] hover:bg-[#2D3227] text-white rounded transition flex items-center gap-1.5 shadow-xs"
        >
          <Upload className="w-3.5 h-3.5" />
          <span>Upload Resume</span>
        </button>
      </div>
    </header>
  );
};

