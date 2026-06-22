'use client';

import { useEffect, useState } from 'react';
import { CheckCircle, Clock, XCircle, Send, MessageSquare, Briefcase, AlertCircle, CalendarCheck } from 'lucide-react';

type Message = {
  id: number;
  from: 'school' | 'applicant';
  text: string;
  time: string;
};

export default function JobRecruitment() {
  const [user, setUser]   = useState<any>(null);
  const [reply, setReply] = useState('');
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      from: 'school',
      text: 'Dear applicant, thank you for your interest in joining the MGPS team. We have received your application and are currently reviewing all submissions. Shortlisted candidates will be invited for an interview. We will be in touch with further details.',
      time: 'Jun 9 2025, 10:30',
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

  const steps = [
    { key: 'submitted',  label: 'Application Submitted',   desc: 'Your application was received by HR.',             done: true,  active: false },
    { key: 'docs',       label: 'Documents Reviewed',      desc: 'Your CV and certificates have been reviewed.',    done: true,  active: false },
    { key: 'shortlist',  label: 'Shortlisting',            desc: 'HR is shortlisting candidates for interviews.',   done: false, active: true  },
    { key: 'interview',  label: 'Interview',               desc: 'Shortlisted applicants will be contacted here.',  done: false, active: false },
    { key: 'outcome',    label: 'Offer / Outcome',         desc: 'Final hiring decision will be shared via portal.',done: false, active: false },
  ];

  const openVacancies = [
    { title: 'Grade 3 Class Teacher',   type: 'Full-Time', dept: 'Primary Teaching',    status: 'Applied' },
    { title: 'ECD Practitioner',        type: 'Full-Time', dept: 'Early Childhood Dev', status: 'Open'    },
    { title: 'School Administrator',    type: 'Full-Time', dept: 'Administration',       status: 'Open'    },
  ];

  return (
    <div>
      <div className="page-header">
        <div>
          <h1>Job Recruitment</h1>
          <p>Track your application status and communicate with the MGPS HR team.</p>
        </div>
        <div className="status-badge pending">
          <Clock size={14} /> Under Review
        </div>
      </div>

      <div className="three-col">
        {/* Progress */}
        <div>
          <div className="card mb">
            <h2 className="card-title"><Briefcase size={16} /> Application Progress</h2>
            <div className="steps">
              {steps.map((s, i) => (
                <div key={s.key} className={`step ${s.done ? 'done' : s.active ? 'active' : ''}`}>
                  <div className="step-icon">
                    {s.done ? <CheckCircle size={18} /> : s.active ? <Clock size={18} /> : <AlertCircle size={18} />}
                  </div>
                  <div className="step-body">
                    <p className="step-label">{s.label}</p>
                    <p className="step-desc">{s.desc}</p>
                  </div>
                  {i < steps.length - 1 && <div className="step-line" />}
                </div>
              ))}
            </div>
          </div>

          <div className="card vacancies-card">
            <h2 className="card-title"><CalendarCheck size={16} /> Vacancies</h2>
            {openVacancies.map(v => (
              <div key={v.title} className="vac-row">
                <div>
                  <p className="vac-title">{v.title}</p>
                  <p className="vac-meta">{v.dept} · {v.type}</p>
                </div>
                <span className={`vac-badge ${v.status === 'Applied' ? 'applied' : 'open'}`}>
                  {v.status}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Messaging */}
        <div className="card chat-card">
          <h2 className="card-title"><MessageSquare size={16} /> Messages from HR Office</h2>
          <div className="chat-body">
            {messages.map(m => (
              <div key={m.id} className={`bubble-wrap ${m.from === 'applicant' ? 'right' : 'left'}`}>
                <div className={`bubble ${m.from}`}>
                  <p className="bubble-text">{m.text}</p>
                  <p className="bubble-time">{m.time}</p>
                </div>
                {m.from === 'school' && <span className="from-label">MGPS HR Office</span>}
                {m.from === 'applicant' && <span className="from-label right-label">You</span>}
              </div>
            ))}
          </div>
          <div className="chat-input">
            <textarea
              value={reply}
              onChange={e => setReply(e.target.value)}
              placeholder="Reply to the HR office…"
              rows={3}
              onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend(); } }}
            />
            <button className="send-btn" onClick={handleSend} disabled={!reply.trim()}>
              <Send size={15} /> Send
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
        .three-col{display:grid;grid-template-columns:1fr 1.2fr;gap:20px;align-items:start}
        .card{background:white;border-radius:14px;padding:22px;border:1px solid #e8ecf4}
        .mb{margin-bottom:16px}
        .card-title{font-size:.9rem;font-weight:700;color:#0b2d6b;margin-bottom:18px;display:flex;align-items:center;gap:7px}
        .steps{display:flex;flex-direction:column}
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
        .vacancies-card{}
        .vac-row{display:flex;align-items:center;justify-content:space-between;padding:10px 0;border-bottom:1px solid #f1f5f9}
        .vac-row:last-child{border-bottom:none}
        .vac-title{font-size:.8rem;font-weight:700;color:#0b2d6b;margin-bottom:2px}
        .vac-meta{font-size:.7rem;color:#64748b}
        .vac-badge{font-size:.68rem;font-weight:700;padding:3px 10px;border-radius:12px;white-space:nowrap}
        .vac-badge.applied{background:#eef2fb;color:#0b2d6b}
        .vac-badge.open{background:#eefbf3;color:#1a6b3a}
        .chat-card{display:flex;flex-direction:column;height:560px}
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
        @media(max-width:900px){.three-col{grid-template-columns:1fr}.chat-card{height:420px}}
      `}</style>
    </div>
  );
}