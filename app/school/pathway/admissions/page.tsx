'use client';

import { useEffect, useState } from 'react';
import { CheckCircle, Clock, XCircle, Send, MessageSquare, AlertCircle } from 'lucide-react';

type Message = {
  id: number;
  from: 'school' | 'applicant';
  text: string;
  time: string;
};

export default function AdmissionsStatus() {
  const [user, setUser]     = useState<any>(null);
  const [reply, setReply]   = useState('');
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      from: 'school',
      text: 'Dear applicant, thank you for submitting your application to MGPS. We have received all your documents and your application is currently under review by our admissions committee. We will be in touch with a decision before the end of Term 2, 2026.',
      time: 'Jun 10 2025, 09:14',
    },
  ]);

  useEffect(() => {
    const stored = localStorage.getItem('portalUser');
    if (stored) setUser(JSON.parse(stored));
  }, []);

  const handleSend = () => {
    if (!reply.trim()) return;
    const now = new Date();
    const timeStr = now.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }) +
      ', ' + now.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' });
    setMessages(m => [...m, { id: Date.now(), from: 'applicant', text: reply.trim(), time: timeStr }]);
    setReply('');
  };

  const statusSteps = [
    { key: 'received',  label: 'Application Received',  desc: 'Your application has been received.',              done: true,  active: false },
    { key: 'docs',      label: 'Documents Verified',     desc: 'Your submitted documents have been verified.',    done: true,  active: false },
    { key: 'review',    label: 'Under Committee Review', desc: 'Admissions committee is evaluating your file.',   done: false, active: true  },
    { key: 'decision',  label: 'Decision Made',          desc: 'A formal decision will be communicated here.',   done: false, active: false },
    { key: 'enrolment', label: 'Enrolment',              desc: 'Accepted students will begin enrolment steps.',  done: false, active: false },
  ];

  return (
    <div>
      <div className="page-header">
        <div>
          <h1>Admissions Status</h1>
          <p>Track your application progress and communicate directly with the admissions office.</p>
        </div>
        <div className="status-badge pending">
          <Clock size={14} /> Under Review
        </div>
      </div>

      <div className="two-col">
        {/* Left: progress */}
        <div>
          <div className="card mb">
            <h2 className="card-title">Application Progress</h2>
            <div className="steps">
              {statusSteps.map((s, i) => (
                <div key={s.key} className={`step ${s.done ? 'done' : s.active ? 'active' : ''}`}>
                  <div className="step-icon">
                    {s.done ? <CheckCircle size={18} /> : s.active ? <Clock size={18} /> : <AlertCircle size={18} />}
                  </div>
                  <div className="step-body">
                    <p className="step-label">{s.label}</p>
                    <p className="step-desc">{s.desc}</p>
                  </div>
                  {i < statusSteps.length - 1 && <div className="step-line" />}
                </div>
              ))}
            </div>
          </div>

          <div className="card info-card">
            <AlertCircle size={18} style={{ color: '#f5a623', flexShrink: 0 }} />
            <div>
              <p className="info-title">What happens next?</p>
              <p className="info-text">The admissions committee reviews all applications received for the 2027 intake. Decisions are communicated via this portal from Term 2, 2026. Ensure your documents are complete to avoid delays.</p>
            </div>
          </div>
        </div>

        {/* Right: messaging */}
        <div className="card chat-card">
          <h2 className="card-title"><MessageSquare size={16} /> Messages from Admissions Office</h2>
          <div className="chat-body">
            {messages.map(m => (
              <div key={m.id} className={`bubble-wrap ${m.from === 'applicant' ? 'right' : 'left'}`}>
                <div className={`bubble ${m.from}`}>
                  <p className="bubble-text">{m.text}</p>
                  <p className="bubble-time">{m.time}</p>
                </div>
                {m.from === 'school' && <span className="from-label">MGPS Admissions</span>}
                {m.from === 'applicant' && <span className="from-label right-label">You</span>}
              </div>
            ))}
          </div>
          <div className="chat-input">
            <textarea
              value={reply}
              onChange={e => setReply(e.target.value)}
              placeholder="Type your reply to the admissions office…"
              rows={3}
              onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend(); } }}
            />
            <button className="send-btn" onClick={handleSend} disabled={!reply.trim()}>
              <Send size={16} /> Send
            </button>
          </div>
        </div>
      </div>

      <style jsx>{`
        .page-header{display:flex;align-items:flex-start;justify-content:space-between;margin-bottom:24px;gap:16px;flex-wrap:wrap}
        .page-header h1{font-size:1.3rem;font-weight:700;color:#0b2d6b;margin-bottom:4px}
        .page-header p{color:#64748b;font-size:.88rem}
        .status-badge{display:flex;align-items:center;gap:6px;padding:8px 16px;border-radius:20px;font-size:.8rem;font-weight:700;white-space:nowrap}
        .status-badge.pending{background:#fff8ee;color:#92610a;border:1px solid #f5a62340}
        .status-badge.accepted{background:#eefbf3;color:#1a6b3a;border:1px solid #2ecc7140}
        .status-badge.rejected{background:#fdeef0;color:#c5252b;border:1px solid #c5252b40}
        .two-col{display:grid;grid-template-columns:1fr 1fr;gap:20px;align-items:start}
        .card{background:white;border-radius:14px;padding:22px;border:1px solid #e8ecf4}
        .mb{margin-bottom:16px}
        .card-title{font-size:.9rem;font-weight:700;color:#0b2d6b;margin-bottom:18px;display:flex;align-items:center;gap:7px}
        .steps{display:flex;flex-direction:column;gap:0}
        .step{display:flex;align-items:flex-start;gap:12px;position:relative;padding-bottom:20px}
        .step:last-child{padding-bottom:0}
        .step-line{position:absolute;left:15px;top:32px;bottom:0;width:2px;background:#e8ecf4}
        .step.done .step-line{background:#2ecc71}
        .step-icon{width:32px;height:32px;border-radius:50%;border:2px solid #e8ecf4;background:white;display:flex;align-items:center;justify-content:center;color:#94a3b8;flex-shrink:0;position:relative;z-index:1}
        .step.done .step-icon{border-color:#2ecc71;color:#2ecc71;background:#eefbf3}
        .step.active .step-icon{border-color:#f5a623;color:#f5a623;background:#fff8ee}
        .step-label{font-size:.82rem;font-weight:700;color:#0b2d6b;margin-bottom:2px}
        .step.active .step-label{color:#92610a}
        .step-desc{font-size:.73rem;color:#64748b;line-height:1.4}
        .info-card{display:flex;align-items:flex-start;gap:12px;background:#fff8ee;border-color:#f5a62330}
        .info-title{font-size:.82rem;font-weight:700;color:#92610a;margin-bottom:4px}
        .info-text{font-size:.75rem;color:#92610a;line-height:1.6}
        .chat-card{display:flex;flex-direction:column;height:520px}
        .chat-body{flex:1;overflow-y:auto;display:flex;flex-direction:column;gap:14px;padding-bottom:12px;scrollbar-width:thin}
        .bubble-wrap{display:flex;flex-direction:column;gap:3px}
        .bubble-wrap.right{align-items:flex-end}
        .bubble{max-width:88%;padding:11px 14px;border-radius:12px;word-break:break-word}
        .bubble.school{background:#eef2fb;border-bottom-left-radius:3px}
        .bubble.applicant{background:#0b2d6b;border-bottom-right-radius:3px}
        .bubble-text{font-size:.8rem;line-height:1.6;color:#0f172a}
        .bubble.applicant .bubble-text{color:white}
        .bubble-time{font-size:.65rem;color:#94a3b8;margin-top:4px}
        .bubble.applicant .bubble-time{color:rgba(255,255,255,.55)}
        .from-label{font-size:.68rem;color:#94a3b8;font-weight:600}
        .right-label{text-align:right}
        .chat-input{border-top:1px solid #e8ecf4;padding-top:14px;display:flex;flex-direction:column;gap:8px}
        textarea{width:100%;padding:10px 12px;border:1.5px solid #e2e8f0;border-radius:8px;font-size:.8rem;color:#0f172a;background:#f8fafc;outline:none;resize:none;font-family:inherit;transition:border-color .2s}
        textarea:focus{border-color:#0b2d6b;background:white}
        .send-btn{align-self:flex-end;display:flex;align-items:center;gap:7px;padding:9px 20px;background:#0b2d6b;color:white;border:none;border-radius:8px;font-size:.8rem;font-weight:700;cursor:pointer;transition:opacity .2s}
        .send-btn:hover:not(:disabled){opacity:.85}
        .send-btn:disabled{opacity:.4;cursor:not-allowed}
        @media(max-width:900px){.two-col{grid-template-columns:1fr}.chat-card{height:420px}}
      `}</style>
    </div>
  );
}