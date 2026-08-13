import React, { useState } from 'react';
import { CheckCircle2, Clock, ArrowRight, FileText, Cpu, Mail, ShieldAlert } from 'lucide-react';

export const LangGraphVisualizer = ({
  logs = [],
  status = 'COMPLETED',
  candidateName = 'Alexandra Vance',
  jobTitle = 'Senior AI / ML Engineer',
  decision = 'SHORTLIST'
}) => {
  const [selectedNode, setSelectedNode] = useState(logs[0] || null);

  const graphNodes = [
    { name: 'START', label: 'Start', icon: FileText, color: 'bg-[#3A4032]' },
    { name: 'Parse Job Description', label: 'Parse Job', icon: Cpu, color: 'bg-[#3A4032]' },
    { name: 'Parse Resume', label: 'Parse Resume', icon: Cpu, color: 'bg-[#3A4032]' },
    { name: 'Generate Embeddings', label: 'Extract Features', icon: Cpu, color: 'bg-[#3A4032]' },
    { name: 'Calculate Match Score', label: 'Calculate Score', icon: Cpu, color: 'bg-[#3A4032]' },
    { name: 'LLM Analysis', label: 'Qualitative Fit', icon: FileText, color: 'bg-[#3A4032]' },
    { name: 'Decision Node', label: 'Recommendation', icon: ShieldAlert, color: 'bg-[#8C6B2A]' },
    { name: 'Action Node (Mock Email)', label: 'Notification', icon: Mail, color: 'bg-[#2D5A38]' },
    { name: 'END', label: 'End', icon: CheckCircle2, color: 'bg-[#6B6B63]' }
  ];

  return (
    <div className="bg-white border border-[#E7E5DF] rounded-md p-5 space-y-4 text-[#1A1A1A]">
      {/* Header Info */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[#E7E5DF] pb-3">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="font-serif font-bold text-sm text-[#1A1A1A]">Evaluation Pipeline Trace</h3>
            <span className="px-2 py-0.5 text-[10px] font-mono bg-[#FAF9F6] text-[#6B6B63] border border-[#E7E5DF] rounded">
              Audit Log
            </span>
          </div>
          <p className="text-xs text-[#6B6B63] mt-0.5">
            Step execution trace for <span className="text-[#1A1A1A] font-medium">{candidateName}</span> vs{' '}
            <span className="text-[#1A1A1A] font-medium">{jobTitle}</span>
          </p>
        </div>

        <div className="flex items-center gap-3 text-xs">
          <div className="flex items-center gap-1.5 text-[#6B6B63]">
            <Clock className="w-3.5 h-3.5 text-[#6B6B63]" />
            <span>Status: </span>
            <span className="font-medium text-[#2D5A38]">{status}</span>
          </div>
          <div className="flex items-center gap-1.5 px-2.5 py-1 bg-[#FAF9F6] rounded border border-[#E7E5DF]">
            <span className="text-[#6B6B63]">Recommendation:</span>
            <span
              className={`font-semibold ${
                decision === 'SHORTLIST'
                  ? 'text-[#2D5A38]'
                  : decision === 'REJECT'
                  ? 'text-[#8C2A2A]'
                  : 'text-[#8C6B2A]'
              }`}
            >
              {decision}
            </span>
          </div>
        </div>
      </div>

      {/* Interactive Visual Graph Nodes */}
      <div className="overflow-x-auto py-1">
        <div className="flex items-center gap-2 min-w-[850px] justify-between">
          {graphNodes.map((node, index) => {
            const Icon = node.icon;
            const logMatch = logs.find(l => l.nodeName === node.name);
            const isCompleted = !!logMatch;
            const isSelected = selectedNode?.nodeName === node.name;

            return (
              <React.Fragment key={node.name}>
                <button
                  onClick={() => logMatch && setSelectedNode(logMatch)}
                  className={`flex flex-col items-center gap-1.5 p-2 rounded border text-center transition min-w-[90px] ${
                    isSelected
                      ? 'border-[#3A4032] bg-[#F3F2EE]'
                      : isCompleted
                      ? 'border-[#E7E5DF] bg-[#FAF9F6] hover:bg-[#EFECE6]'
                      : 'border-[#E7E5DF] bg-white opacity-40 cursor-not-allowed'
                  }`}
                >
                  <div
                    className={`w-6 h-6 rounded ${node.color} flex items-center justify-center text-white`}
                  >
                    <Icon className="w-3 h-3" />
                  </div>
                  <span className="text-[10px] font-medium text-[#1A1A1A] leading-tight">{node.label}</span>
                  {isCompleted ? (
                    <span className="text-[9px] font-medium text-[#2D5A38] flex items-center gap-0.5">
                      <CheckCircle2 className="w-2.5 h-2.5" /> Complete
                    </span>
                  ) : (
                    <span className="text-[9px] text-[#6B6B63]">Pending</span>
                  )}
                </button>

                {index < graphNodes.length - 1 && (
                  <ArrowRight className="w-3.5 h-3.5 text-[#E7E5DF] shrink-0" />
                )}
              </React.Fragment>
            );
          })}
        </div>
      </div>

      {/* Selected Node Details Box */}
      {selectedNode ? (
        <div className="bg-[#FAF9F6] border border-[#E7E5DF] rounded p-4 space-y-2.5 text-xs">
          <div className="flex items-center justify-between border-b border-[#E7E5DF] pb-2">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#3A4032]"></span>
              <h4 className="font-semibold text-[#1A1A1A]">Step Execution: {selectedNode.nodeName}</h4>
            </div>
            <span className="text-[10px] text-[#6B6B63] font-mono">
              {new Date(selectedNode.timestamp).toLocaleTimeString()}
            </span>
          </div>

          <p className="text-[#1A1A1A] leading-relaxed font-mono bg-white p-2.5 rounded border border-[#E7E5DF]">
            {selectedNode.outputSummary}
          </p>

          {selectedNode.details && (
            <div className="space-y-1">
              <span className="text-[10px] uppercase font-semibold text-[#6B6B63]">Output State:</span>
              <pre className="text-[10px] font-mono text-[#1A1A1A] bg-white p-2.5 rounded border border-[#E7E5DF] overflow-x-auto max-h-36">
                {JSON.stringify(selectedNode.details, null, 2)}
              </pre>
            </div>
          )}
        </div>
      ) : (
        <div className="text-center py-3 text-xs text-[#6B6B63] italic">Select a step above to inspect output state and execution logs.</div>
      )}
    </div>
  );
};

