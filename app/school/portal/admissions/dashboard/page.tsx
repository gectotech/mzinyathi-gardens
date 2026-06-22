'use client';

import { useEffect, useState } from 'react';
import { CheckCircle, Clock, CreditCard, Mail, FileText, AlertCircle } from 'lucide-react';

export default function AdmissionsDashboard() {
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const stored = localStorage.getItem('portalUser');
    if (stored) setUser(JSON.parse(stored));
  }, []);

  const stats = [
    { label: 'Application Status', value: 'Under Review', icon: Clock,      color: '#f5a623', bg: '#fff8ee' },
    { label: 'Documents Submitted', value: '4 / 6',       icon: FileText,   color: '#0b2d6b', bg: '#eef2fb' },
    { label: 'Payments Made',       value: 'ZWL 0',       icon: CreditCard, color: '#2ecc71', bg: '#eefbf3' },
    { label: 'Messages',            value: '1 Unread',    icon: Mail,        color: '#c5252b', bg: '#fdeef0' },
  ];

  const timeline = [
    { label: 'Application Received', done: true,  date: 'Jun 2 2025' },
    { label: 'Documents Verified',   done: true,  date: 'Jun 5 2025' },
    { label: 'Assessment Review',    done: false, date: 'Pending' },
    { label: 'Final Decision',       done: false, date: 'TBD' },
    { label: 'Enrolment',            done: false, date: 'Jan 2027' },
  ];

  return (
    <div>
      <div className="welcome">
        <h1>Welcome back, {user?.firstname} 👋</h1>
        <p>Here's an overview of your admissions application to MGPS.</p>
      </div>

      <div className="stats-grid">
        {stats.map(s => (
          <div key={s.label} className="stat-card" style={{ '--accent': s.color, '--bg': s.bg } as any}>
            <div className="stat-icon"><s.icon size={20} /></div>
            <div className="stat-body">
              <p className="stat-value">{s.value}</p>
              <p className="stat-label">{s.label}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="two-col">
        <div className="card">
          <h2 className="card-title">Application Timeline</h2>
          <div className="timeline">
            {timeline.map((t, i) => (
              <div key={i} className="t-row">
                <div className={`t-dot ${t.done ? 'done' : ''}`}>
                  {t.done ? <CheckCircle size={16} /> : <AlertCircle size={16} />}
                </div>
                <div className="t-info">
                  <p className="t-label">{t.label}</p>
                  <p className="t-date">{t.date}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="card">
          <h2 className="card-title">Important Notices</h2>
          <div className="notice-list">
            <div className="notice info">
              <AlertCircle size={15} />
              <p>Please upload your birth certificate to complete your application.</p>
            </div>
            <div className="notice warn">
              <Clock size={15} />
              <p>Admissions decisions for 2027 intake will be communicated from Term 2, 2026.</p>
            </div>
            <div className="notice success">
              <CheckCircle size={15} />
              <p>Your application form was successfully received.</p>
            </div>
          </div>

          <div className="info-box">
            <p className="ib-title">2027 Opening</p>
            <p className="ib-sub">MGPS is preparing for its grand opening in January 2027. Early applicants receive priority consideration.</p>
          </div>
        </div>
      </div>

      <style jsx>{`
        .welcome{margin-bottom:24px}
        .welcome h1{font-size:1.3rem;font-weight:700;color:#0b2d6b;margin-bottom:4px}
        .welcome p{color:#64748b;font-size:.88rem}
        .stats-grid{display:grid;grid-template-columns:repeat(4,1fr);gap:16px;margin-bottom:24px}
        .stat-card{background:var(--bg);border-radius:12px;padding:18px;display:flex;align-items:center;gap:14px;border:1px solid rgba(0,0,0,.06)}
        .stat-icon{width:44px;height:44px;border-radius:10px;background:var(--accent);display:flex;align-items:center;justify-content:center;color:white;flex-shrink:0}
        .stat-value{font-size:1.1rem;font-weight:700;color:#0b2d6b}
        .stat-label{font-size:.72rem;color:#64748b;margin-top:2px}
        .two-col{display:grid;grid-template-columns:1fr 1fr;gap:20px}
        .card{background:white;border-radius:14px;padding:22px;border:1px solid #e8ecf4}
        .card-title{font-size:.9rem;font-weight:700;color:#0b2d6b;margin-bottom:18px}
        .timeline{display:flex;flex-direction:column}
        .t-row{display:flex;align-items:flex-start;gap:12px;position:relative;padding-bottom:18px}
        .t-row:last-child{padding-bottom:0}
        .t-row:not(:last-child)::before{content:'';position:absolute;left:11px;top:24px;bottom:0;width:2px;background:#e8ecf4}
        .t-dot{width:24px;height:24px;border-radius:50%;border:2px solid #e8ecf4;background:white;display:flex;align-items:center;justify-content:center;color:#94a3b8;flex-shrink:0}
        .t-dot.done{border-color:#2ecc71;color:#2ecc71;background:#eefbf3}
        .t-label{font-size:.82rem;font-weight:600;color:#0b2d6b}
        .t-date{font-size:.72rem;color:#94a3b8;margin-top:2px}
        .notice-list{display:flex;flex-direction:column;gap:10px;margin-bottom:20px}
        .notice{display:flex;align-items:flex-start;gap:8px;padding:10px 12px;border-radius:8px;font-size:.78rem;line-height:1.5}
        .notice.info{background:#eef2fb;color:#0b2d6b}
        .notice.warn{background:#fff8ee;color:#92610a}
        .notice.success{background:#eefbf3;color:#1a6b3a}
        .info-box{background:linear-gradient(135deg,#0b2d6b,#1a4a9f);border-radius:10px;padding:16px;color:white}
        .ib-title{font-size:.85rem;font-weight:700;margin-bottom:4px}
        .ib-sub{font-size:.75rem;opacity:.8;line-height:1.5}
        @media(max-width:768px){.stats-grid{grid-template-columns:1fr 1fr}.two-col{grid-template-columns:1fr}}
        @media(max-width:480px){.stats-grid{grid-template-columns:1fr}}
      `}</style>
    </div>
  );
}