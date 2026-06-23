'use client';

import { useState } from 'react';
import Link from 'next/link';
import { GraduationCap, Search } from 'lucide-react';
import ApplicationProgressTracker, { type ProgressStep } from '@/components/ui/ApplicationProgressTracker';

const TRACKING_STORAGE_KEY = 'mgps_last_tracking';

type TrackResult = {
  applicantName: string;
  grade: string;
  status: string;
  type: 'school' | 'career';
  steps: ProgressStep[];
  interviewScheduledAt?: string | null;
};

export default function AdmissionsLandingHub() {
  const [trackingId, setTrackingId] = useState('');
  const [nationalId, setNationalId] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [result, setResult] = useState<TrackResult | null>(null);

  const track = async () => {
    if (!trackingId.trim() || !nationalId.trim()) {
      setError('Enter your application number and national ID.');
      return;
    }
    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/applications/track', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ trackingId: trackingId.trim(), nationalId: nationalId.trim() }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Application not found');
      setResult(data);
      localStorage.setItem(
        TRACKING_STORAGE_KEY,
        JSON.stringify({ trackingId: trackingId.trim(), nationalId: nationalId.trim() })
      );
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Lookup failed');
      setResult(null);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="max-w-6xl mx-auto mb-16">
      <div className="grid lg:grid-cols-2 gap-6 rounded-2xl overflow-hidden border border-white/20 shadow-2xl">
        {/* Apply */}
        <div className="bg-white p-8 text-[var(--color-text-primary)]">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 rounded-xl bg-[var(--color-nav-primary-muted)] flex items-center justify-center">
              <GraduationCap className="text-[var(--color-nav-primary)]" size={24} />
            </div>
            <div>
              <h2 className="text-xl font-bold">Apply for 2027 Intake</h2>
              <p className="text-sm text-[var(--color-text-secondary)]">Multi-step wizard · mobile optimised</p>
            </div>
          </div>
          <p className="text-sm text-[var(--color-text-secondary)] mb-6 leading-relaxed">
            Complete the admission form, upload documents, and receive your tracking number instantly on submission.
          </p>
          <Link href="/school/admissions" className="sms-btn-primary inline-flex items-center gap-2">
            <GraduationCap size={18} /> Start Application
          </Link>
        </div>

        {/* Inline tracker */}
        <div className="bg-[var(--color-bg-secondary)] p-8 border-l border-[var(--color-border-default)]">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 rounded-xl bg-blue-100 flex items-center justify-center">
              <Search className="text-[var(--color-nav-primary)]" size={24} />
            </div>
            <div>
              <h2 className="text-xl font-bold text-[var(--color-text-primary)]">Track Application</h2>
              <p className="text-sm text-[var(--color-text-secondary)]">No separate portal page required</p>
            </div>
          </div>

          {!result ? (
            <div className="space-y-3">
              <input
                value={trackingId}
                onChange={(e) => setTrackingId(e.target.value)}
                placeholder="MGP-123456 or CAREER-123456"
                className="sms-input w-full"
              />
              <input
                value={nationalId}
                onChange={(e) => setNationalId(e.target.value)}
                placeholder="Parent / applicant national ID"
                className="sms-input w-full"
              />
              {error && <p className="text-sm text-[var(--color-accent-action)]">{error}</p>}
              <button type="button" onClick={track} disabled={loading} className="sms-btn-secondary w-full">
                {loading ? 'Searching…' : 'Check Status'}
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="rounded-lg bg-white p-4 border border-[var(--color-border-default)]">
                <p className="font-semibold text-[var(--color-text-primary)]">{result.applicantName}</p>
                <p className="text-sm text-[var(--color-text-secondary)] capitalize">
                  {result.type === 'career' ? 'Career' : 'Admissions'} · {result.status.replace(/_/g, ' ')}
                </p>
                {result.interviewScheduledAt && (
                  <p className="text-xs text-[var(--color-nav-primary)] mt-1">
                    Interview: {new Date(result.interviewScheduledAt).toLocaleString()}
                  </p>
                )}
              </div>
              <ApplicationProgressTracker steps={result.steps} compact />
              <button
                type="button"
                className="text-sm text-[var(--color-nav-primary)] font-medium"
                onClick={() => setResult(null)}
              >
                Search another application
              </button>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
