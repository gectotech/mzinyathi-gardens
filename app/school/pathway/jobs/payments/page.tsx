'use client';

import { useEffect, useState } from 'react';
import { CreditCard, CheckCircle, AlertCircle, Download, Lock, Info } from 'lucide-react';

export default function JobsPayments() {
  const [user, setUser] = useState<any>(null);
  const [selected, setSelected] = useState<string | null>(null);
  const [method, setMethod] = useState<'ecocash' | 'card' | 'bank'>('ecocash');
  const [paying, setPaying] = useState(false);
  const [paid, setPaid] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem('portalUser');
    if (stored) setUser(JSON.parse(stored));
  }, []);

  const fees = [
    { id: 'app',    label: 'Application Processing Fee', amount: 'USD 10', status: 'due',     due: 'Jul 15 2025' },
    { id: 'check',  label: 'Background Check Fee',       amount: 'USD 20', status: 'pending', due: 'On Shortlisting' },
  ];

  const history: any[] = [];

  const handlePay = () => {
    if (!selected) return;
    setPaying(true);
    setTimeout(() => { setPaying(false); setPaid(true); }, 2000);
  };

  return (
    <div>
      <div className="page-header">
        <div>
          <h1>Online Payments</h1>
          <p>Pay your recruitment-related fees securely through the MGPS portal.</p>
        </div>
        <div className="secure-badge"><Lock size={13} /> Secure Payments</div>
      </div>

      {paid && (
        <div className="success-banner">
          <CheckCircle size={18} />
          <div>
            <p className="sb-title">Payment Submitted</p>
            <p className="sb-sub">Your payment is being processed and will reflect within 24 hours.</p>
          </div>
        </div>
      )}

      <div className="notice-bar">
        <Info size={15} />
        <p>The application processing fee is required for all candidates. The background check fee is only payable upon shortlisting notification.</p>
      </div>

      <div className="two-col">
        <div>
          <div className="card mb">
            <h2 className="card-title">Outstanding Fees</h2>
            <div className="fee-list">
              {fees.map(f => (
                <div
                  key={f.id}
                  className={`fee-row ${selected === f.id ? 'selected' : ''} ${f.status === 'pending' ? 'disabled' : ''}`}
                  onClick={() => f.status !== 'pending' && setSelected(f.id)}
                >
                  <div className="fee-info">
                    <p className="fee-name">{f.label}</p>
                    <p className="fee-due">Due: {f.due}</p>
                  </div>
                  <div className="fee-right">
                    <span className="fee-amount">{f.amount}</span>
                    <span className={`fee-badge ${f.status}`}>
                      {f.status === 'due' ? 'Due Now' : 'Pending Shortlisting'}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="card">
            <h2 className="card-title">Payment History</h2>
            {history.length === 0 ? (
              <div className="empty-state">
                <CreditCard size={32} />
                <p>No payments made yet</p>
                <span>Completed payments will appear here with downloadable receipts.</span>
              </div>
            ) : (
              <div className="hist-list">
                {history.map((h, i) => (
                  <div key={i} className="hist-row">
                    <CheckCircle size={16} style={{ color: '#2ecc71' }} />
                    <div className="hist-info">
                      <p className="hist-name">{h.label}</p>
                      <p className="hist-date">{h.date}</p>
                    </div>
                    <span className="hist-amount">{h.amount}</span>
                    <button className="dl-btn"><Download size={13} /></button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="card pay-card">
          <h2 className="card-title"><CreditCard size={16} /> Make a Payment</h2>

          {!selected ? (
            <div className="select-hint">
              <AlertCircle size={20} style={{ color: '#f5a623' }} />
              <p>Select a fee from the list on the left to proceed.</p>
            </div>
          ) : (
            <>
              <div className="selected-fee">
                <p className="sf-label">Paying for</p>
                <p className="sf-name">{fees.find(f => f.id === selected)?.label}</p>
                <p className="sf-amount">{fees.find(f => f.id === selected)?.amount}</p>
              </div>

              <p className="method-label">Payment Method</p>
              <div className="method-tabs">
                {(['ecocash', 'card', 'bank'] as const).map(m => (
                  <button key={m} className={`method-tab ${method === m ? 'active' : ''}`} onClick={() => setMethod(m)}>
                    {m === 'ecocash' ? 'EcoCash' : m === 'card' ? 'Card' : 'Bank Transfer'}
                  </button>
                ))}
              </div>

              {method === 'ecocash' && (
                <div className="method-form">
                  <label>EcoCash Number</label>
                  <input type="tel" placeholder="077X XXX XXX" />
                  <p className="method-note">A USSD prompt will be sent to this number to confirm.</p>
                </div>
              )}
              {method === 'card' && (
                <div className="method-form">
                  <label>Card Number</label>
                  <input type="text" placeholder="XXXX XXXX XXXX XXXX" maxLength={19} />
                  <div className="card-row">
                    <div><label>Expiry</label><input type="text" placeholder="MM/YY" /></div>
                    <div><label>CVV</label><input type="text" placeholder="XXX" maxLength={3} /></div>
                  </div>
                  <label>Cardholder Name</label>
                  <input type="text" placeholder="Name on card" />
                </div>
              )}
              {method === 'bank' && (
                <div className="method-form bank-details">
                  <p className="bd-title">Bank Transfer Details</p>
                  <div className="bd-row"><span>Bank</span><strong>CBZ Bank Zimbabwe</strong></div>
                  <div className="bd-row"><span>Account Name</span><strong>Mzinyathi Gardens Primary School</strong></div>
                  <div className="bd-row"><span>Account No.</span><strong>12345678910</strong></div>
                  <div className="bd-row"><span>Reference</span><strong>{user?.appId || 'MGPS-J-2025-001'}</strong></div>
                  <p className="bd-note">Use your Job Application ID as the payment reference. Email proof to hr@mgps.ac.zw</p>
                </div>
              )}

              {method !== 'bank' && (
                <button className="pay-btn" onClick={handlePay} disabled={paying || paid}>
                  {paying ? <><span className="spin" /> Processing…</> : paid ? <><CheckCircle size={16} /> Paid</> : <><Lock size={15} /> Pay Now</>}
                </button>
              )}
            </>
          )}

          <div className="secure-note">
            <Lock size={12} />
            <span>All transactions are encrypted. MGPS does not store card details.</span>
          </div>
        </div>
      </div>

      <style jsx>{`
        .page-header{display:flex;align-items:flex-start;justify-content:space-between;margin-bottom:20px;gap:16px;flex-wrap:wrap}
        .page-header h1{font-size:1.3rem;font-weight:700;color:#0b2d6b;margin-bottom:4px}
        .page-header p{color:#64748b;font-size:.88rem}
        .secure-badge{display:flex;align-items:center;gap:6px;padding:7px 14px;background:#eef2fb;color:#0b2d6b;border-radius:20px;font-size:.75rem;font-weight:700;border:1px solid #0b2d6b20}
        .notice-bar{display:flex;align-items:flex-start;gap:10px;padding:12px 16px;background:#eef2fb;border-radius:10px;margin-bottom:20px;font-size:.78rem;color:#0b2d6b;line-height:1.5;border:1px solid #0b2d6b15}
        .success-banner{display:flex;align-items:flex-start;gap:12px;padding:16px 20px;background:#eefbf3;border:1px solid #2ecc7140;border-radius:12px;margin-bottom:20px;color:#1a6b3a}
        .sb-title{font-size:.85rem;font-weight:700;margin-bottom:2px}
        .sb-sub{font-size:.76rem;line-height:1.5}
        .two-col{display:grid;grid-template-columns:1fr 380px;gap:20px;align-items:start}
        .card{background:white;border-radius:14px;padding:22px;border:1px solid #e8ecf4}
        .mb{margin-bottom:16px}
        .card-title{font-size:.9rem;font-weight:700;color:#0b2d6b;margin-bottom:18px;display:flex;align-items:center;gap:7px}
        .fee-list{display:flex;flex-direction:column;gap:10px}
        .fee-row{display:flex;align-items:center;justify-content:space-between;padding:14px 16px;border:1.5px solid #e8ecf4;border-radius:10px;cursor:pointer;transition:all .2s}
        .fee-row:hover:not(.disabled){border-color:#0b2d6b;background:#f8fafc}
        .fee-row.selected{border-color:#0b2d6b;background:#eef2fb}
        .fee-row.disabled{opacity:.5;cursor:not-allowed}
        .fee-name{font-size:.83rem;font-weight:700;color:#0b2d6b;margin-bottom:2px}
        .fee-due{font-size:.7rem;color:#94a3b8}
        .fee-right{display:flex;flex-direction:column;align-items:flex-end;gap:4px}
        .fee-amount{font-size:.95rem;font-weight:800;color:#0b2d6b}
        .fee-badge{font-size:.65rem;font-weight:700;padding:2px 8px;border-radius:12px}
        .fee-badge.due{background:#fdeef0;color:#c5252b}
        .fee-badge.pending{background:#fff8ee;color:#92610a}
        .empty-state{display:flex;flex-direction:column;align-items:center;justify-content:center;padding:32px;color:#94a3b8;gap:8px;text-align:center}
        .empty-state p{font-size:.85rem;font-weight:600;color:#64748b}
        .empty-state span{font-size:.75rem;line-height:1.5}
        .pay-card{display:flex;flex-direction:column;gap:0}
        .select-hint{display:flex;flex-direction:column;align-items:center;gap:10px;padding:32px 16px;text-align:center;color:#64748b;font-size:.82rem}
        .selected-fee{background:#eef2fb;border-radius:10px;padding:14px 16px;margin-bottom:18px}
        .sf-label{font-size:.68rem;color:#64748b;font-weight:600;text-transform:uppercase;letter-spacing:.04em;margin-bottom:2px}
        .sf-name{font-size:.88rem;font-weight:700;color:#0b2d6b;margin-bottom:2px}
        .sf-amount{font-size:1.3rem;font-weight:800;color:#0b2d6b}
        .method-label{font-size:.75rem;font-weight:700;color:#475569;margin-bottom:8px}
        .method-tabs{display:flex;gap:6px;margin-bottom:18px}
        .method-tab{flex:1;padding:8px 6px;border:1.5px solid #e2e8f0;border-radius:8px;background:white;font-size:.73rem;font-weight:600;color:#64748b;cursor:pointer;transition:all .2s}
        .method-tab.active{border-color:#0b2d6b;background:#eef2fb;color:#0b2d6b}
        .method-form{display:flex;flex-direction:column;gap:10px;margin-bottom:18px}
        label{font-size:.75rem;font-weight:600;color:#475569}
        input{width:100%;padding:9px 12px;border:1.5px solid #e2e8f0;border-radius:8px;font-size:.82rem;color:#0f172a;background:#f8fafc;outline:none;transition:border-color .2s;font-family:inherit}
        input:focus{border-color:#0b2d6b;background:white}
        .card-row{display:grid;grid-template-columns:1fr 1fr;gap:10px}
        .method-note{font-size:.72rem;color:#64748b;line-height:1.5}
        .bank-details{background:#f8fafc;border-radius:10px;padding:14px}
        .bd-title{font-size:.8rem;font-weight:700;color:#0b2d6b;margin-bottom:10px}
        .bd-row{display:flex;justify-content:space-between;padding:7px 0;border-bottom:1px solid #e8ecf4;font-size:.75rem;color:#64748b}
        .bd-row strong{color:#0f172a;font-size:.78rem}
        .bd-note{font-size:.72rem;color:#64748b;margin-top:10px;line-height:1.5}
        .pay-btn{width:100%;padding:13px;background:linear-gradient(135deg,#0b2d6b,#1a4a9f);color:white;border:none;border-radius:10px;font-size:.88rem;font-weight:700;cursor:pointer;display:flex;align-items:center;justify-content:center;gap:8px;transition:opacity .2s;margin-bottom:14px}
        .pay-btn:hover:not(:disabled){opacity:.9}
        .pay-btn:disabled{opacity:.6;cursor:not-allowed}
        .spin{width:16px;height:16px;border:2px solid rgba(255,255,255,.3);border-top-color:white;border-radius:50%;animation:spin .7s linear infinite}
        @keyframes spin{to{transform:rotate(360deg)}}
        .secure-note{display:flex;align-items:center;gap:7px;font-size:.68rem;color:#94a3b8;margin-top:auto;padding-top:8px}
        @media(max-width:900px){.two-col{grid-template-columns:1fr}}
      `}</style>
    </div>
  );
}