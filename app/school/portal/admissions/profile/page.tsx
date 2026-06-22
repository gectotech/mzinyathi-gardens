'use client';

import { useEffect, useState } from 'react';
import { User, Phone, Mail, MapPin, Calendar, BookOpen, FileText, Edit } from 'lucide-react';
import Link from 'next/link';

export default function StudentProfile() {
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const stored = localStorage.getItem('portalUser');
    if (stored) setUser(JSON.parse(stored));
  }, []);

  const initials = `${user?.firstname?.[0] ?? ''}${user?.lastname?.[0] ?? ''}`.toUpperCase();

  const profileFields = [
    { label: 'First Name',        value: user?.firstname,             icon: User },
    { label: 'Last Name',         value: user?.lastname,              icon: User },
    { label: 'Email Address',     value: user?.email,                 icon: Mail },
    { label: 'Phone Number',      value: user?.phone || 'Not set',    icon: Phone },
    { label: 'Date of Birth',     value: user?.dob || 'Not set',      icon: Calendar },
    { label: 'Home Address',      value: user?.address || 'Not set',  icon: MapPin },
    { label: 'Grade Applying For',value: user?.grade || 'Not set',    icon: BookOpen },
    { label: 'Application ID',    value: user?.appId || 'MGPS-2025-001', icon: FileText },
  ];

  const documents = [
    { name: 'Birth Certificate',       status: 'missing',   label: 'Missing' },
    { name: 'Passport Photo',          status: 'submitted', label: 'Submitted' },
    { name: 'Previous School Reports', status: 'submitted', label: 'Submitted' },
    { name: 'Parent/Guardian ID',      status: 'submitted', label: 'Submitted' },
    { name: 'Medical Certificate',     status: 'submitted', label: 'Submitted' },
    { name: 'Proof of Residence',      status: 'pending',   label: 'Under Review' },
  ];

  return (
    <div>
      <div className="page-header">
        <div>
          <h1>Student Profile</h1>
          <p>Your personal information and application details.</p>
        </div>
        <Link href="/school/portal/admissions/edit-profile" className="edit-btn">
          <Edit size={15} /> Edit Profile
        </Link>
      </div>

      <div className="profile-top">
        <div className="avatar-wrap">
          <div className="avatar">{initials}</div>
          <div className="avatar-info">
            <p className="av-name">{user?.firstname} {user?.lastname}</p>
            <p className="av-role">Admissions Applicant · 2027 Intake</p>
            <span className="badge">Under Review</span>
          </div>
        </div>
      </div>

      <div className="two-col">
        <div className="card">
          <h2 className="card-title">Personal Information</h2>
          <div className="field-grid">
            {profileFields.map(f => (
              <div key={f.label} className="field">
                <div className="field-icon"><f.icon size={15} /></div>
                <div className="field-body">
                  <p className="field-label">{f.label}</p>
                  <p className="field-value">{f.value || '—'}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="card">
          <h2 className="card-title">Document Checklist</h2>
          <p className="doc-sub">4 of 6 documents received</p>
          <div className="progress-bar"><div className="progress-fill" style={{ width: '66%' }} /></div>
          <div className="doc-list">
            {documents.map(d => (
              <div key={d.name} className="doc-row">
                <span className="doc-name">{d.name}</span>
                <span className={`doc-badge ${d.status}`}>{d.label}</span>
              </div>
            ))}
          </div>
          <div className="doc-note">
            <FileText size={14} />
            <p>Missing documents may delay your application. Please upload them as soon as possible.</p>
          </div>
        </div>
      </div>

      <style jsx>{`
        .page-header{display:flex;align-items:flex-start;justify-content:space-between;margin-bottom:24px;gap:16px}
        .page-header h1{font-size:1.3rem;font-weight:700;color:#0b2d6b;margin-bottom:4px}
        .page-header p{color:#64748b;font-size:.88rem}
        .edit-btn{display:flex;align-items:center;gap:7px;padding:9px 18px;background:#0b2d6b;color:white;border-radius:8px;text-decoration:none;font-size:.8rem;font-weight:600;white-space:nowrap;transition:opacity .2s}
        .edit-btn:hover{opacity:.85}
        .profile-top{background:white;border-radius:14px;padding:24px;border:1px solid #e8ecf4;margin-bottom:20px}
        .avatar-wrap{display:flex;align-items:center;gap:20px}
        .avatar{width:64px;height:64px;border-radius:50%;background:linear-gradient(135deg,#f5a623,#c5252b);color:white;font-size:1.4rem;font-weight:700;display:flex;align-items:center;justify-content:center;flex-shrink:0}
        .av-name{font-size:1.1rem;font-weight:700;color:#0b2d6b;margin-bottom:2px}
        .av-role{font-size:.8rem;color:#64748b;margin-bottom:8px}
        .badge{display:inline-block;padding:3px 10px;background:#fff8ee;color:#92610a;border-radius:20px;font-size:.72rem;font-weight:600;border:1px solid #f5a62340}
        .two-col{display:grid;grid-template-columns:1fr 1fr;gap:20px}
        .card{background:white;border-radius:14px;padding:22px;border:1px solid #e8ecf4}
        .card-title{font-size:.9rem;font-weight:700;color:#0b2d6b;margin-bottom:18px}
        .field-grid{display:flex;flex-direction:column;gap:14px}
        .field{display:flex;align-items:flex-start;gap:12px}
        .field-icon{width:32px;height:32px;border-radius:8px;background:#eef2fb;display:flex;align-items:center;justify-content:center;color:#0b2d6b;flex-shrink:0}
        .field-label{font-size:.7rem;color:#94a3b8;margin-bottom:2px}
        .field-value{font-size:.83rem;font-weight:600;color:#0f172a}
        .doc-sub{font-size:.78rem;color:#64748b;margin-bottom:8px}
        .progress-bar{height:6px;background:#e8ecf4;border-radius:3px;margin-bottom:18px;overflow:hidden}
        .progress-fill{height:100%;background:linear-gradient(90deg,#0b2d6b,#2ecc71);border-radius:3px;transition:width .6s ease}
        .doc-list{display:flex;flex-direction:column;gap:8px;margin-bottom:16px}
        .doc-row{display:flex;align-items:center;justify-content:space-between;padding:9px 12px;background:#f8fafc;border-radius:8px;border:1px solid #e8ecf4}
        .doc-name{font-size:.78rem;font-weight:500;color:#0f172a}
        .doc-badge{font-size:.68rem;font-weight:600;padding:2px 8px;border-radius:12px}
        .doc-badge.submitted{background:#eefbf3;color:#1a6b3a}
        .doc-badge.missing{background:#fdeef0;color:#c5252b}
        .doc-badge.pending{background:#fff8ee;color:#92610a}
        .doc-note{display:flex;align-items:flex-start;gap:8px;padding:10px 12px;background:#fff8ee;border-radius:8px;font-size:.75rem;color:#92610a;line-height:1.5}
        @media(max-width:768px){.two-col{grid-template-columns:1fr}.page-header{flex-direction:column}}
      `}</style>
    </div>
  );
}