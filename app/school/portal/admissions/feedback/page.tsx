'use client';

import { useState } from 'react';
import { Send, Star, CheckCircle, MessageSquare } from 'lucide-react';

export default function AdmissionsFeedback() {
  const [rating, setRating]   = useState(0);
  const [hovered, setHovered] = useState(0);
  const [category, setCategory] = useState('');
  const [message, setMessage]   = useState('');
  const [submitted, setSubmitted] = useState(false);

  const categories = [
    'Application Process',
    'Portal Usability',
    'Communication & Support',
    'Documents & Requirements',
    'Payments',
    'Other',
  ];

  const handleSubmit = () => {
    if (!rating || !category || !message.trim()) return;
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="success-wrap">
        <div className="success-card">
          <div className="success-icon"><CheckCircle size={40} /></div>
          <h2>Thank you for your feedback!</h2>
          <p>Your response has been submitted to the MGPS admissions team. We use your feedback to continually improve the admissions experience.</p>
          <button className="reset-btn" onClick={() => { setSubmitted(false); setRating(0); setCategory(''); setMessage(''); }}>
            Submit Another Response
          </button>
        </div>
        <style jsx>{`
          .success-wrap{display:flex;align-items:center;justify-content:center;min-height:60vh}
          .success-card{background:white;border-radius:16px;padding:48px 40px;border:1px solid #e8ecf4;text-align:center;max-width:440px;width:100%}
          .success-icon{width:72px;height:72px;border-radius:50%;background:#eefbf3;display:flex;align-items:center;justify-content:center;color:#2ecc71;margin:0 auto 20px}
          h2{font-size:1.2rem;font-weight:700;color:#0b2d6b;margin-bottom:10px}
          p{font-size:.83rem;color:#64748b;line-height:1.6;margin-bottom:24px}
          .reset-btn{padding:10px 24px;background:#0b2d6b;color:white;border:none;border-radius:8px;font-size:.82rem;font-weight:700;cursor:pointer}
        `}</style>
      </div>
    );
  }

  return (
    <div>
      <div className="page-header">
        <div>
          <h1>Feedback</h1>
          <p>Share your experience with the MGPS admissions process. Your input helps us improve.</p>
        </div>
      </div>

      <div className="layout">
        <div className="card main-card">
          <h2 className="card-title"><MessageSquare size={16} /> Share Your Feedback</h2>

          <div className="section">
            <p className="sec-label">How would you rate your experience so far?</p>
            <div className="stars">
              {[1, 2, 3, 4, 5].map(n => (
                <button
                  key={n}
                  className={`star ${n <= (hovered || rating) ? 'lit' : ''}`}
                  onMouseEnter={() => setHovered(n)}
                  onMouseLeave={() => setHovered(0)}
                  onClick={() => setRating(n)}
                >
                  <Star size={28} fill={n <= (hovered || rating) ? '#f5a623' : 'none'} />
                </button>
              ))}
            </div>
            {rating > 0 && (
              <p className="rating-label">
                {['', 'Poor', 'Fair', 'Good', 'Very Good', 'Excellent'][rating]} — {rating}/5
              </p>
            )}
          </div>

          <div className="section">
            <p className="sec-label">Category</p>
            <div className="cat-grid">
              {categories.map(c => (
                <button key={c} className={`cat-btn ${category === c ? 'active' : ''}`} onClick={() => setCategory(c)}>
                  {c}
                </button>
              ))}
            </div>
          </div>

          <div className="section">
            <p className="sec-label">Your Message</p>
            <textarea
              value={message}
              onChange={e => setMessage(e.target.value)}
              placeholder="Tell us about your experience — what went well, what could be improved, or any suggestions you have for the admissions team…"
              rows={6}
            />
            <p className="char-count">{message.length} / 1000</p>
          </div>

          <button
            className="submit-btn"
            onClick={handleSubmit}
            disabled={!rating || !category || !message.trim()}
          >
            <Send size={15} /> Submit Feedback
          </button>
        </div>

        <div className="side-col">
          <div className="card info-card">
            <h3>Why your feedback matters</h3>
            <p>MGPS is preparing for its 2027 grand opening and every piece of feedback helps us build a better experience for all applicants and families.</p>
            <div className="info-items">
              <div className="info-item"><span className="dot blue" />Responses are reviewed by the admissions team</div>
              <div className="info-item"><span className="dot green" />Feedback is completely confidential</div>
              <div className="info-item"><span className="dot gold" />Improvements are actioned each term</div>
            </div>
          </div>

          <div className="card contact-card">
            <h3>Need direct assistance?</h3>
            <p>For urgent queries, contact the admissions office directly.</p>
            <div className="contact-item">
              <span className="contact-label">Email</span>
              <a href="mailto:admissions@mgps.ac.zw">admissions@mgps.ac.zw</a>
            </div>
            <div className="contact-item">
              <span className="contact-label">Phone</span>
              <span>+263 77X XXX XXXX</span>
            </div>
            <div className="contact-item">
              <span className="contact-label">Hours</span>
              <span>Mon–Fri, 8am – 4pm</span>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .page-header{margin-bottom:24px}
        .page-header h1{font-size:1.3rem;font-weight:700;color:#0b2d6b;margin-bottom:4px}
        .page-header p{color:#64748b;font-size:.88rem}
        .layout{display:grid;grid-template-columns:1fr 300px;gap:20px;align-items:start}
        .card{background:white;border-radius:14px;padding:22px;border:1px solid #e8ecf4}
        .card-title{font-size:.9rem;font-weight:700;color:#0b2d6b;margin-bottom:22px;display:flex;align-items:center;gap:7px}
        .section{margin-bottom:22px}
        .sec-label{font-size:.78rem;font-weight:700;color:#475569;margin-bottom:12px}
        .stars{display:flex;gap:6px;margin-bottom:8px}
        .star{background:none;border:none;cursor:pointer;padding:0;display:flex;color:#e2e8f0;transition:color .15s,transform .15s}
        .star.lit{color:#f5a623}
        .star:hover{transform:scale(1.15)}
        .rating-label{font-size:.78rem;color:#f5a623;font-weight:700}
        .cat-grid{display:grid;grid-template-columns:1fr 1fr;gap:8px}
        .cat-btn{padding:9px 12px;border:1.5px solid #e2e8f0;border-radius:8px;background:white;font-size:.76rem;font-weight:600;color:#64748b;cursor:pointer;text-align:left;transition:all .2s}
        .cat-btn:hover{border-color:#0b2d6b;color:#0b2d6b}
        .cat-btn.active{border-color:#0b2d6b;background:#eef2fb;color:#0b2d6b}
        textarea{width:100%;padding:12px;border:1.5px solid #e2e8f0;border-radius:8px;font-size:.82rem;color:#0f172a;background:#f8fafc;outline:none;resize:vertical;font-family:inherit;transition:border-color .2s;line-height:1.6}
        textarea:focus{border-color:#0b2d6b;background:white}
        .char-count{font-size:.68rem;color:#94a3b8;margin-top:4px;text-align:right}
        .submit-btn{width:100%;padding:13px;background:linear-gradient(135deg,#0b2d6b,#1a4a9f);color:white;border:none;border-radius:10px;font-size:.88rem;font-weight:700;cursor:pointer;display:flex;align-items:center;justify-content:center;gap:8px;transition:opacity .2s}
        .submit-btn:hover:not(:disabled){opacity:.9}
        .submit-btn:disabled{opacity:.4;cursor:not-allowed}
        .side-col{display:flex;flex-direction:column;gap:16px}
        .info-card h3,.contact-card h3{font-size:.85rem;font-weight:700;color:#0b2d6b;margin-bottom:8px}
        .info-card p,.contact-card p{font-size:.76rem;color:#64748b;line-height:1.6;margin-bottom:14px}
        .info-items{display:flex;flex-direction:column;gap:8px}
        .info-item{display:flex;align-items:center;gap:8px;font-size:.75rem;color:#475569}
        .dot{width:8px;height:8px;border-radius:50%;flex-shrink:0}
        .dot.blue{background:#0b2d6b}.dot.green{background:#2ecc71}.dot.gold{background:#f5a623}
        .contact-item{display:flex;flex-direction:column;gap:2px;padding:8px 0;border-bottom:1px solid #f1f5f9}
        .contact-item:last-child{border-bottom:none}
        .contact-label{font-size:.68rem;font-weight:700;color:#94a3b8;text-transform:uppercase;letter-spacing:.04em}
        .contact-item a,.contact-item span:last-child{font-size:.78rem;color:#0b2d6b;font-weight:600;text-decoration:none}
        .contact-item a:hover{text-decoration:underline}
        @media(max-width:900px){.layout{grid-template-columns:1fr}}
        @media(max-width:480px){.cat-grid{grid-template-columns:1fr}}
      `}</style>
    </div>
  );
}