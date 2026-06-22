'use client';

import { useEffect, useState } from 'react';
import { CheckCircle, Clock, CreditCard, Mail, ClipboardList, AlertCircle } from 'lucide-react';

export default function JobsDashboard() {
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const stored = localStorage.getItem('portalUser');
    if (stored) setUser(JSON.parse(stored));
  }, []);

  const stats = [
    { label: 'Application Status', value: 'Under Review',  icon: Clock,          color: '#f5a623', bg: '#fff8ee' },
    { label: 'Positions Applied',  value: '1 Active',      icon: ClipboardList,  color: '#0b2d6b', bg: '#eef2fb' },
    { label: 'Payments Made',      value: 'USD 0',         icon: CreditCard,     color: '#2ecc71', bg: '#eefbf3' },
    { label: 'Messages',           value: '1 Unread',      icon: Mail,           color: '#c5252b', bg: '#fdeef0' },
  ];

  const timeline = [
    { label: 'Application Submitted', done: true,  date: 'Jun 3 2025' },
    { label: 'CV & Documents Reviewed', done: true, date: 'Jun 8 2025' },
    { label: 'Shortlisting',           done: false, date: 'Pending' },
    { label: 'Interview',              done: false, date: 'TBD' },
    { label: 'Offer / Outcome',        done: false, date: 'TBD' },
  ];

  const openings = [
    { title: 'Grade 3 Class Teacher',   dept: 'Primary Teaching',   deadline: 'Jul 31 2025' },
    { title: 'ECD Practitioner',        dept: 'Early Childhood Dev', deadline: 'Jul 31 2025' },
    { title: 'School Administrator',    dept: 'Administration',      deadline: 'Aug 15 2025' },
    { title: 'Sports & PE Teacher',     dept: 'Co-curricular',       deadline: 'Aug 15 2025' },
  ];

  return (
    <div>
      <div className="welcome">
        <h1>Welcome back, {user?.firstname} 👋</h1>
        <p>Here's a summary of your MGPS job application status.</p>
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
          <h2 className="card-title">Current Vacancies at MGPS</h2>
          <p className="openings-sub">MGPS is hiring for its 2027 launch. All positions are subject to confirmation.</p>
          <div className="openings-list">
            {openings.map(o => (
              <div key={o.title} className="opening-row">
                <div>
                  <p className="op-title">{o.title}</p>
                  <p className="op-dept">{o.dept}</p>
                </div>
                <div className="op-right">
                  <span className="op-deadline">Closes {o.deadline}</span>
                </div>
              </div>
            ))}
          </div>
          <div className="info-box">
            <p className="ib-title">Grand Opening: January 2027</p>
            <p className="ib-sub">MGPS will officially open its doors in 2027. Staff recruitment is underway. Shortlisted candidates will be contacted for interviews.</p>
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
        .openings-sub{font-size:.76rem;color:#64748b;margin-bottom:14px;line-height:1.5}
        .openings-list{display:flex;flex-direction:column;gap:8px;margin-bottom:18px}
        .opening-row{display:flex;align-items:center;justify-content:space-between;padding:10px 12px;background:#f8fafc;border-radius:8px;border:1px solid #e8ecf4}
        .op-title{font-size:.8rem;font-weight:700;color:#0b2d6b;margin-bottom:2px}
        .op-dept{font-size:.7rem;color:#64748b}
        .op-deadline{font-size:.68rem;font-weight:600;color:#c5252b;white-space:nowrap}
        .info-box{background:linear-gradient(135deg,#0b2d6b,#1a4a9f);border-radius:10px;padding:16px;color:white}
        .ib-title{font-size:.85rem;font-weight:700;margin-bottom:4px}
        .ib-sub{font-size:.75rem;opacity:.8;line-height:1.5}
        @media(max-width:768px){.stats-grid{grid-template-columns:1fr 1fr}.two-col{grid-template-columns:1fr}}
        @media(max-width:480px){.stats-grid{grid-template-columns:1fr}}
      `}</style>
    </div>
  );
}