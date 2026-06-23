"use client";

import { useState } from "react";
import { Search, ArrowLeft } from "lucide-react";
import Link from "next/link";
import ApplicationProgressTracker from "@/components/ui/ApplicationProgressTracker";

type TrackStep = {
  step: string;
  status: string;
};

type TrackResult = {
  found: boolean;
  type: "school" | "career";
  trackingId: string;
  status: string;
  applicantName: string;
  grade: string;
  submittedAt: string;
  updatedAt: string;
  interviewScheduledAt: string | null;
  steps: TrackStep[];
};

export default function TrackApplicationPage() {
  const [trackForm, setTrackForm] = useState({ mgNumber: "", nationalId: "" });
  const [trackLoading, setTrackLoading] = useState(false);
  const [trackError, setTrackError] = useState("");
  const [applicationStatus, setApplicationStatus] = useState<TrackResult | null>(null);

  const handleTrackSubmit = async () => {
    if (!trackForm.mgNumber || !trackForm.nationalId) {
      setTrackError("Please fill in all fields.");
      return;
    }

    const nationalIdPattern = /^\d{2}-\d{7}[A-Za-z]\d{2}$/;
    if (!nationalIdPattern.test(trackForm.nationalId)) {
      setTrackError("Invalid National ID format. Example: 09-2199172G08");
      return;
    }

    const trackingId = trackForm.mgNumber.trim().toUpperCase();
    const isCareer = trackingId.startsWith("CAREER-");
    const isAdmission = trackingId.startsWith("MGP-") || trackingId.startsWith("MG-");

    if (!isCareer && !isAdmission) {
      setTrackError("Invalid application number. Must start with MGP- (admissions) or CAREER- (careers).");
      return;
    }

    setTrackLoading(true);
    setTrackError("");

    try {
      const res = await fetch("/api/applications/track", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          trackingId,
          nationalId: trackForm.nationalId,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Application not found");
      }
      setApplicationStatus(data);
    } catch (err) {
      setTrackError(err instanceof Error ? err.message : "Failed to track application");
      setApplicationStatus(null);
    } finally {
      setTrackLoading(false);
    }
  };

  const resetTrackForm = () => {
    setTrackForm({ mgNumber: "", nationalId: "" });
    setTrackError("");
    setApplicationStatus(null);
  };

  const formatStatus = (status: string) => status.replace(/_/g, " ");

  return (
    <main className="min-h-screen bg-gradient-to-br from-green-950 via-black to-green-900 text-white">
      <div className="container mx-auto px-6 py-20 flex items-center justify-center min-h-screen">
        <div className="w-full max-w-2xl">
          <div className="text-center mb-10">
            <Link href="/school/pathway" className="inline-flex items-center gap-2 text-green-200 hover:text-white mb-6 transition">
              <ArrowLeft size={16} /> Back to Portal
            </Link>
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-blue-500/20 border border-blue-400/30 mb-6">
              <Search className="w-10 h-10 text-blue-400" />
            </div>
            <h1 className="text-4xl font-bold mb-3">Track Application</h1>
            <p className="text-gray-300">Enter your application details to check your status</p>
          </div>

          <div className="bg-white rounded-2xl p-8 shadow-2xl">
            {!applicationStatus ? (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">MG Application Number *</label>
                  <input
                    name="mgNumber"
                    value={trackForm.mgNumber}
                    onChange={(e) => setTrackForm((f) => ({ ...f, mgNumber: e.target.value }))}
                    placeholder="e.g., MGP-123456 or CAREER-123456"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-50 text-gray-800 focus:outline-none focus:border-blue-600 focus:bg-white transition"
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Parent / Applicant National ID *</label>
                  <input
                    name="nationalId"
                    value={trackForm.nationalId}
                    onChange={(e) => setTrackForm((f) => ({ ...f, nationalId: e.target.value }))}
                    placeholder="09-2199172G08"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-50 text-gray-800 focus:outline-none focus:border-blue-600 focus:bg-white transition"
                  />
                  <p className="text-xs text-gray-500 mt-2">Use the parent&apos;s ID for school admissions, or your own ID for career applications.</p>
                </div>

                {trackError && (
                  <p className="text-red-600 bg-red-50 border border-red-200 rounded-lg px-4 py-3 text-sm font-semibold">
                    {trackError}
                  </p>
                )}

                <button
                  className="w-full py-3 bg-blue-900 text-white font-bold rounded-lg hover:bg-blue-800 transition flex items-center justify-center gap-2"
                  onClick={handleTrackSubmit}
                  disabled={trackLoading}
                >
                  {trackLoading ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Searching…
                    </>
                  ) : (
                    "Track Application"
                  )}
                </button>
              </div>
            ) : (
              <div>
                <button
                  className="flex items-center gap-2 text-gray-600 text-sm font-semibold mb-4 hover:text-gray-800"
                  onClick={resetTrackForm}
                >
                  <ArrowLeft size={14} /> Search Another Application
                </button>

                <div className="bg-blue-50 p-6 rounded-xl mb-6 border border-blue-200">
                  <h4 className="text-lg font-bold text-blue-900 mb-3">
                    {applicationStatus.type === "career" ? "Career Application" : "Admissions Application"}
                  </h4>
                  <h4 className="text-lg font-bold text-blue-900 mb-3 capitalize">
                    Application Status: {formatStatus(applicationStatus.status)}
                  </h4>
                  <div className="grid grid-cols-2 gap-4 text-sm text-gray-700">
                    <div><strong>Name:</strong> {applicationStatus.applicantName}</div>
                    <div>
                      <strong>{applicationStatus.type === "career" ? "Position" : "Grade"}:</strong>{" "}
                      {applicationStatus.grade}
                    </div>
                    <div><strong>Applied:</strong> {new Date(applicationStatus.submittedAt).toLocaleDateString()}</div>
                    <div><strong>Last Update:</strong> {new Date(applicationStatus.updatedAt).toLocaleDateString()}</div>
                    {applicationStatus.interviewScheduledAt && (
                      <div className="col-span-2">
                        <strong>Interview:</strong>{" "}
                        {new Date(applicationStatus.interviewScheduledAt).toLocaleString()}
                      </div>
                    )}
                  </div>
                </div>

                <ApplicationProgressTracker
                  steps={applicationStatus.steps.map((s) => ({
                    step: s.step,
                    status: s.status as 'completed' | 'in_progress' | 'pending',
                  }))}
                />
              </div>
            )}
          </div>

          <p className="text-center text-green-200/50 text-sm mt-8">
            MGPS · Mzinyathi Gardens Primary School · Zimbabwe
          </p>
        </div>
      </div>
    </main>
  );
}
