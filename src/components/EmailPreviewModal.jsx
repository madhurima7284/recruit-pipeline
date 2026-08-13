import React from 'react';
import { X, Mail, ShieldCheck, Copy, Check } from 'lucide-react';

export const EmailPreviewModal = ({ email, onClose }) => {
  const [copied, setCopied] = React.useState(false);

  if (!email) return null;

  const copyToClipboard = () => {
    navigator.clipboard.writeText(
      `To: ${email.recipient}\nSubject: ${email.subject}\n\n${email.body}`
    );
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 bg-[#1A1A1A]/40 flex items-center justify-center p-4">
      <div className="bg-white border border-[#E7E5DF] rounded-md max-w-2xl w-full text-[#1A1A1A] shadow-lg overflow-hidden">
        {/* Modal Header */}
        <div className="bg-[#FAF9F6] px-5 py-3.5 border-b border-[#E7E5DF] flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded bg-[#F3F2EE] text-[#3A4032] border border-[#D0CDBF] flex items-center justify-center">
              <Mail className="w-3.5 h-3.5" />
            </div>
            <div>
              <h3 className="font-serif font-bold text-sm text-[#1A1A1A]">Email Notification Preview</h3>
              <p className="text-[11px] text-[#6B6B63]">Outbox dispatch log</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1 rounded text-[#6B6B63] hover:text-[#1A1A1A] hover:bg-[#EFECE6] transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Email Metadata */}
        <div className="p-5 space-y-4 text-xs">
          <div className="bg-[#FAF9F6] p-3.5 rounded border border-[#E7E5DF] space-y-2 font-mono">
            <div className="flex items-center justify-between">
              <span className="text-[#6B6B63]">Recipient:</span>
              <span className="text-[#1A1A1A] font-semibold">{email.recipientName} &lt;{email.recipient}&gt;</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-[#6B6B63]">Subject:</span>
              <span className="text-[#1A1A1A] font-medium">{email.subject}</span>
            </div>
            <div className="flex items-center justify-between text-[11px]">
              <span className="text-[#6B6B63]">Sent At:</span>
              <span className="text-[#6B6B63]">{new Date(email.sentAt).toLocaleString()}</span>
            </div>
            <div className="flex items-center justify-between text-[11px]">
              <span className="text-[#6B6B63]">Dispatch Status:</span>
              <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-[#F3F2EE] text-[#3A4032] border border-[#D0CDBF]">
                {email.status}
              </span>
            </div>
          </div>

          {/* Email Body */}
          <div className="bg-[#FAF9F6] p-4 rounded border border-[#E7E5DF] font-sans text-xs text-[#1A1A1A] leading-relaxed whitespace-pre-wrap max-h-72 overflow-y-auto">
            {email.body}
          </div>
        </div>

        {/* Modal Footer */}
        <div className="bg-[#FAF9F6] px-5 py-3 border-t border-[#E7E5DF] flex items-center justify-between text-xs">
          <div className="flex items-center gap-1.5 text-[#2D5A38] font-medium">
            <ShieldCheck className="w-4 h-4 text-[#2D5A38]" />
            <span>Simulated Outbox Dispatch</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={copyToClipboard}
              className="px-3 py-1.5 rounded bg-white hover:bg-[#EFECE6] text-[#1A1A1A] border border-[#E7E5DF] transition flex items-center gap-1.5"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-[#2D5A38]" /> : <Copy className="w-3.5 h-3.5 text-[#6B6B63]" />}
              <span>{copied ? 'Copied!' : 'Copy Body'}</span>
            </button>
            <button
              onClick={onClose}
              className="px-3.5 py-1.5 rounded bg-[#3A4032] hover:bg-[#2D3227] text-white font-medium transition"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

