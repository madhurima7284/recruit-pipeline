import React from 'react';
import { CheckCircle2, AlertTriangle, Cpu, GraduationCap, Clock, Award } from 'lucide-react';

export const ScoreBreakdown = ({
  overallScore,
  subScores,
  matchedSkills = [],
  missingSkills = [],
  preferredSkillsMatched = []
}) => {
  const getScoreColor = (score) => {
    if (score >= 75) return 'text-[#2D5A38] bg-[#2D5A38]';
    if (score >= 50) return 'text-[#8C6B2A] bg-[#8C6B2A]';
    return 'text-[#8C2A2A] bg-[#8C2A2A]';
  };

  const getScoreBadge = (score) => {
    if (score >= 75) return { label: 'Strong Match', bg: 'bg-[#EBF2EE] text-[#2D5A38] border-[#C3D9CA]' };
    if (score >= 50) return { label: 'Moderate Match', bg: 'bg-[#FAF6EB] text-[#8C6B2A] border-[#E8DFC2]' };
    return { label: 'Low Match', bg: 'bg-[#FDF2F2] text-[#8C2A2A] border-[#F2D0D0]' };
  };

  const badgeInfo = getScoreBadge(overallScore);

  const subscoreItems = [
    {
      title: 'Required Skills Match',
      weight: '30%',
      score: subScores?.requiredSkillsMatch || 0,
      icon: Cpu,
      description: 'Percentage of required core skills satisfied'
    },
    {
      title: 'Semantic Similarity',
      weight: '25%',
      score: subScores?.semanticSimilarity || 0,
      icon: Award,
      description: 'Resume content alignment with job description'
    },
    {
      title: 'Preferred Skills Match',
      weight: '15%',
      score: subScores?.preferredSkillsMatch || 0,
      icon: CheckCircle2,
      description: 'Nice-to-have technical qualifications'
    },
    {
      title: 'Relevant Experience',
      weight: '15%',
      score: subScores?.experienceMatch || 0,
      icon: Clock,
      description: 'Candidate years of experience vs required'
    },
    {
      title: 'Education Fit',
      weight: '15%',
      score: subScores?.educationMatch || 0,
      icon: GraduationCap,
      description: 'Degree level and specialization match'
    }
  ];

  return (
    <div className="bg-white border border-[#E7E5DF] rounded-md p-5 space-y-5 text-[#1A1A1A]">
      {/* Overall Score Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 bg-[#FAF9F6] p-4 rounded border border-[#E7E5DF]">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded bg-white border border-[#E7E5DF] flex flex-col items-center justify-center">
            <span className={`text-xl font-bold font-mono ${getScoreColor(overallScore).split(' ')[0]}`}>
              {overallScore}%
            </span>
            <span className="text-[9px] uppercase tracking-wider font-semibold text-[#6B6B63]">Match</span>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-serif font-bold text-sm text-[#1A1A1A]">Overall Qualification Score</h3>
              <span className={`px-2 py-0.5 text-[11px] font-medium border rounded ${badgeInfo.bg}`}>
                {badgeInfo.label}
              </span>
            </div>
            <p className="text-xs text-[#6B6B63] mt-0.5 font-mono">
              Formula: Required Skills (30%), Semantic Fit (25%), Preferred Skills (15%), Experience (15%), Education (15%).
            </p>
          </div>
        </div>
      </div>

      {/* Subscore Meter Bars */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {subscoreItems.map((item, idx) => {
          const Icon = item.icon;
          return (
            <div key={idx} className="bg-[#FAF9F6] p-3 rounded border border-[#E7E5DF] space-y-1.5">
              <div className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2 font-medium text-[#1A1A1A]">
                  <Icon className="w-3.5 h-3.5 text-[#6B6B63]" />
                  <span>{item.title}</span>
                  <span className="text-[10px] text-[#6B6B63] font-mono">({item.weight})</span>
                </div>
                <span className={`font-bold font-mono ${getScoreColor(item.score).split(' ')[0]}`}>
                  {item.score}%
                </span>
              </div>

              {/* Progress bar */}
              <div className="w-full h-1.5 bg-[#E7E5DF] rounded-full overflow-hidden">
                <div
                  className={`h-full transition-all duration-300 ${getScoreColor(item.score).split(' ')[1]}`}
                  style={{ width: `${item.score}%` }}
                ></div>
              </div>
              <p className="text-[10px] text-[#6B6B63]">{item.description}</p>
            </div>
          );
        })}
      </div>

      {/* Skills Comparison Tags */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-1">
        {/* Matched Skills */}
        <div className="bg-[#EBF2EE] p-3.5 rounded border border-[#C3D9CA] space-y-2">
          <div className="flex items-center gap-1.5 text-xs font-semibold text-[#2D5A38]">
            <CheckCircle2 className="w-4 h-4" />
            <span>Matched Required Skills ({matchedSkills.length})</span>
          </div>
          <div className="flex flex-wrap gap-1.5 pt-0.5">
            {matchedSkills.length > 0 ? (
              matchedSkills.map((skill, i) => (
                <span
                  key={i}
                  className="px-2 py-0.5 text-xs font-mono bg-white text-[#2D5A38] border border-[#C3D9CA] rounded"
                >
                  {skill}
                </span>
              ))
            ) : (
              <span className="text-xs text-[#6B6B63] italic">No required skills matched.</span>
            )}
          </div>
        </div>

        {/* Missing Skills */}
        <div className="bg-[#FDF2F2] p-3.5 rounded border border-[#F2D0D0] space-y-2">
          <div className="flex items-center gap-1.5 text-xs font-semibold text-[#8C2A2A]">
            <AlertTriangle className="w-4 h-4" />
            <span>Missing Required Skills ({missingSkills.length})</span>
          </div>
          <div className="flex flex-wrap gap-1.5 pt-0.5">
            {missingSkills.length > 0 ? (
              missingSkills.map((skill, i) => (
                <span
                  key={i}
                  className="px-2 py-0.5 text-xs font-mono bg-white text-[#8C2A2A] border border-[#F2D0D0] rounded"
                >
                  {skill}
                </span>
              ))
            ) : (
              <span className="text-xs text-[#2D5A38] font-medium">All required skills satisfied</span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

