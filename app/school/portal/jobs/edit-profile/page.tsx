'use client';

import { useEffect, useState } from 'react';
import { Save, User, Phone, Mail, MapPin, Briefcase, GraduationCap, Upload, CheckCircle } from 'lucide-react';

export default function JobsEditProfile() {
  const [user, setUser] = useState<any>(null);
  const [saved, setSaved] = useState(false);
  const [form, setForm] = useState({
    firstname: '', lastname: '', email: '', phone: '',
    address: '', position: '', qualification: '', experience: '', bio: '',
  });

  useEffect(() => {
    const stored = localStorage.getItem('portalUser');
    if (stored) {
      const parsed = JSON.parse(stored);
      setUser(parsed);
      setForm(f => ({
        ...f,
        firstname:     parsed.firstname     || '',
        lastname:      parsed.lastname      || '',
        email:         parsed.email         || '',
        phone:         parsed.phone         || '',
        address:       parsed.address       || '',
        position:      parsed.position      || '',
        qualification: parsed.qualification || '',
        experience:    parsed.experience    || '',
        bio:           parsed.bio           || '',
      }));
    }
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setForm(f => ({ ...f, [e.target.name]: e.target.value }));
  };

  const handleSave = () => {
    const stored = localStorage.getItem('portalUser');
    if (stored) {
      const parsed = JSON.parse(stored);
      const updated = { ...parsed, ...form };
      localStorage.setItem('portalUser', JSON.stringify(updated));
      setUser(updated);
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    }
  };

  const positions = [
    'ECD Practitioner', 'Grade 1 Teacher', 'Grade 2 Teacher', 'Grade 3 Teacher',
    'Grade 4 Teacher', 'Grade 5 Teacher', 'Grade 6 Teacher', 'Grade 7 Teacher',
    'Sports & PE Teacher', 'Music Teacher', 'School Administrator',
    'Bursar / Finance Officer', 'School Nurse', 'Librarian', 'IT Technician', 'Other',
  ];

  const qualifications = [
    'Certificate in Education', 'Diploma in Education', 'B.Ed (Primary)',
    'PGDE', 'B.Ed (Early Childhood)', 'Masters in Education', 'Other',
  ];

  const missingDocs = ['Professional References', 'Police Clearance'];

  return (
    <div>
      <div className="page-header">
        <div>
          <h1>Edit Profile</h1>
          <p>Keep your professional details current for the best chance of being shortlisted.</p>
        </div>
        {saved && (
          <div className="saved-toast">
            <CheckCircle size={15} /> Profile saved successfully
          </div>
        )}
      </div>

      <div className="form-grid">
        <div>
          <div className="card mb">
            <h2 className="card-title"><User size={16} /> Personal Details</h2>
            <div className="field-row">
              <div className="field-group">
                <label>First Name</label>
                <input name="firstname" value={form.firstname} onChange={handleChange} placeholder="First name" />
              </div>
              <div className="field-group">
                <label>Last Name</label>
                <input name="lastname" value={form.lastname} onChange={handleChange} placeholder="Last name" />
              </div>
            </div>
            <div className="field-group">
              <label><Mail size={13} /> Email Address</label>
              <input name="email" type="email" value={form.email} onChange={handleChange} placeholder="your@email.com" />
            </div>
            <div className="field-row">
              <div className="field-group">
                <label><Phone size={13} /> Phone Number</label>
                <input name="phone" value={form.phone} onChange={handleChange} placeholder="+263 7XX XXX XXX" />
              </div>
              <div className="field-group">
                <label><MapPin size={13} /> Home Address</label>
                <input name="address" value={form.address} onChange={handleChange} placeholder="City, Province" />
              </div>
            </div>
          </div>

          <div className="card">
            <h2 className="card-title"><Briefcase size={16} /> Professional Details</h2>
            <div className="field-group">
              <label>Position Applied For</label>
              <select name="position" value={form.position} onChange={handleChange}>
                <option value="">Select position</option>
                {positions.map(p => <option key={p} value={p}>{p}</option>)}
              </select>
            </div>
            <div className="field-group">
              <label><GraduationCap size={13} /> Highest Qualification</label>
              <select name="qualification" value={form.qualification} onChange={handleChange}>
                <option value="">Select qualification</option>
                {qualifications.map(q => <option key={q} value={q}>{q}</option>)}
              </select>
            </div>
            <div className="field-group">
              <label>Years of Experience</label>
              <input name="experience" value={form.experience} onChange={handleChange} placeholder="e.g. 5 years in primary education" />
            </div>
            <div className="field-group">
              <label>Professional Summary</label>
              <textarea name="bio" value={form.bio} onChange={handleChange} rows={4}
                placeholder="Brief summary of your teaching philosophy, experience, and what you bring to MGPS…" />
            </div>
          </div>
        </div>

        <div className="side-col">
          <div className="card mb">
            <h2 className="card-title"><Upload size={16} /> Upload Documents</h2>
            <p className="upload-hint">The following documents are still outstanding on your application.</p>
            {missingDocs.map(doc => (
              <div key={doc} className="upload-row">
                <div className="upload-info">
                  <p className="upload-name">{doc}</p>
                  <p className="upload-status missing">Missing</p>
                </div>
                <label className="upload-btn">
                  <Upload size={13} /> Upload
                  <input type="file" hidden accept=".pdf,.jpg,.jpeg,.png,.doc,.docx" />
                </label>
              </div>
            ))}
            <p className="upload-note">Accepted formats: PDF, JPG, PNG, DOC. Max 5MB per file.</p>
          </div>

          <div className="card mb">
            <h2 className="card-title">Application Tips</h2>
            <div className="tip-list">
              <div className="tip"><span className="tip-dot" />Complete all fields to improve shortlisting chances.</div>
              <div className="tip"><span className="tip-dot" />Upload police clearance — it is required before any interview.</div>
              <div className="tip"><span className="tip-dot" />Provide at least two professional references.</div>
              <div className="tip"><span className="tip-dot" />Keep your contact details current — we reach you directly.</div>
            </div>
          </div>

          <button className="save-btn" onClick={handleSave}>
            <Save size={16} /> Save Changes
          </button>
        </div>
      </div>

      <style jsx>{`
        .page-header{display:flex;align-items:flex-start;justify-content:space-between;margin-bottom:24px;gap:16px;flex-wrap:wrap}
        .page-header h1{font-size:1.3rem;font-weight:700;color:#0b2d6b;margin-bottom:4px}
        .page-header p{color:#64748b;font-size:.88rem}
        .saved-toast{display:flex;align-items:center;gap:7px;padding:8px 16px;background:#eefbf3;color:#1a6b3a;border-radius:8px;font-size:.8rem;font-weight:600;border:1px solid #2ecc7140;animation:fadein .3s ease}
        @keyframes fadein{from{opacity:0;transform:translateY(-4px)}to{opacity:1;transform:translateY(0)}}
        .form-grid{display:grid;grid-template-columns:1fr 340px;gap:20px;align-items:start}
        .card{background:white;border-radius:14px;padding:22px;border:1px solid #e8ecf4}
        .mb{margin-bottom:16px}
        .card-title{font-size:.9rem;font-weight:700;color:#0b2d6b;margin-bottom:18px;display:flex;align-items:center;gap:7px}
        .field-row{display:grid;grid-template-columns:1fr 1fr;gap:14px}
        .field-group{display:flex;flex-direction:column;gap:6px;margin-bottom:14px}
        .field-group:last-child{margin-bottom:0}
        label{font-size:.75rem;font-weight:600;color:#475569;display:flex;align-items:center;gap:5px}
        input,select,textarea{width:100%;padding:9px 12px;border:1.5px solid #e2e8f0;border-radius:8px;font-size:.82rem;color:#0f172a;background:#f8fafc;outline:none;transition:border-color .2s;font-family:inherit;resize:vertical}
        input:focus,select:focus,textarea:focus{border-color:#0b2d6b;background:white}
        .side-col{display:flex;flex-direction:column}
        .upload-hint{font-size:.75rem;color:#64748b;margin-bottom:14px;line-height:1.5}
        .upload-row{display:flex;align-items:center;justify-content:space-between;padding:10px 12px;background:#f8fafc;border-radius:8px;border:1px solid #e8ecf4;margin-bottom:8px}
        .upload-name{font-size:.78rem;font-weight:600;color:#0f172a}
        .upload-status{font-size:.68rem;font-weight:600;margin-top:2px}
        .upload-status.missing{color:#c5252b}
        .upload-btn{display:flex;align-items:center;gap:6px;padding:6px 14px;background:#0b2d6b;color:white;border-radius:6px;font-size:.75rem;font-weight:600;cursor:pointer;transition:opacity .2s}
        .upload-btn:hover{opacity:.85}
        .upload-note{font-size:.68rem;color:#94a3b8;margin-top:6px}
        .tip-list{display:flex;flex-direction:column;gap:10px}
        .tip{display:flex;align-items:flex-start;gap:8px;font-size:.76rem;color:#475569;line-height:1.5}
        .tip-dot{width:6px;height:6px;border-radius:50%;background:#0b2d6b;flex-shrink:0;margin-top:5px}
        .save-btn{width:100%;padding:12px;background:linear-gradient(135deg,#0b2d6b,#1a4a9f);color:white;border:none;border-radius:10px;font-size:.88rem;font-weight:700;cursor:pointer;display:flex;align-items:center;justify-content:center;gap:8px;transition:opacity .2s}
        .save-btn:hover{opacity:.9}
        @media(max-width:900px){.form-grid{grid-template-columns:1fr}}
        @media(max-width:480px){.field-row{grid-template-columns:1fr}}
      `}</style>
    </div>
  );
}