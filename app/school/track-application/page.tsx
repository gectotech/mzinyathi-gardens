"use client";

import { useState } from "react";
import { Search, ArrowLeft, CheckCircle, AlertCircle } from "lucide-react";
import Link from "next/link";

export default function TrackApplicationPage() {
  const [trackForm, setTrackForm] = useState({ mgNumber: "", nationalId: "" });
  const [trackLoading, setTrackLoading] = useState(false);
  const [trackError, setTrackError] = useState("");
  const [applicationStatus, setApplicationStatus] = useState<any>(null);

  const handleTrackSubmit = () => {
    if (!trackForm.mgNumber || !trackForm.nationalId) {
      setTrackError("Please fill in all fields.");
      return;
    }

    // Validate National ID format: xx-xxxxxxxT-xx
    const nationalIdPattern = /^\d{2}-\d{7}[A-Za-z]\d{2}$/;
    if (!nationalIdPattern.test(trackForm.nationalId)) {
      setTrackError("Invalid National ID format. Example: 09-2199172G08");
      return;
    }

    // Determine application type based on number prefix
    const isCareer = trackForm.mgNumber.toUpperCase().startsWith("CAREER-");
    const isAdmission = trackForm.mgNumber.toUpperCase().startsWith("MGP-");

    if (!isCareer && !isAdmission) {
      setTrackError("Invalid application number. Must start with MGP- (admissions) or CAREER- (careers).");
      return;
    }

    setTrackLoading(true);
    setTrackError("");

    // Simulate API call to check application status
    setTimeout(() => {
      // For demo purposes, return a mock status based on application type
      const mockStatus = {
        found: true,
        applicationType: isCareer ? "Career Application" : "Admissions Application",
        status: "Under Review",
        studentName: isCareer ? "John Doe" : "Jane Smith",
        gradeApplied: isCareer ? "Teaching Position" : "Grade 1",
        applicationDate: "2025-06-15",
        lastUpdate: "2025-06-17",
        steps: isCareer ? [
          { step: "Application Submitted", status: "completed", date: "2025-06-15" },
          { step: "Documents Verified", status: "completed", date: "2025-06-16" },
          { step: "Under HR Review", status: "in_progress", date: "2025-06-17" },
          { step: "Interview Scheduled", status: "pending", date: null },
          { step: "Decision Made", status: "pending", date: null },
        ] : [
          { step: "Application Submitted", status: "completed", date: "2025-06-15" },
          { step: "Documents Verified", status: "completed", date: "2025-06-16" },
          { step: "Under Committee Review", status: "in_progress", date: "2025-06-17" },
          { step: "Decision Made", status: "pending", date: null },
          { step: "Enrolment", status: "pending", date: null },
        ],
      };

      setApplicationStatus(mockStatus);
      setTrackLoading(false);
    }, 1500);
  };

  const resetTrackForm = () => {
    setTrackForm({ mgNumber: "", nationalId: "" });
    setTrackError("");
    setApplicationStatus(null);
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-green-950 via-black to-green-900 text-white">
      <div className="container mx-auto px-6 py-20 flex items-center justify-center min-h-screen">

        <div className="w-full max-w-2xl">

          {/* Header */}
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

          {/* Card */}
          <div className="bg-white rounded-2xl p-8 shadow-2xl">

            {!applicationStatus ? (
              <>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">MG Application Number *</label>
                    <input
                      name="mgNumber"
                      value={trackForm.mgNumber}
                      onChange={e => setTrackForm(f => ({ ...f, mgNumber: e.target.value }))}
                      placeholder="e.g., MGP-123456"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-50 text-gray-800 focus:outline-none focus:border-blue-600 focus:bg-white transition"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">National ID *</label>
                    <input
                      name="nationalId"
                      value={trackForm.nationalId}
                      onChange={e => setTrackForm(f => ({ ...f, nationalId: e.target.value }))}
                      placeholder="09-2199172G08"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-50 text-gray-800 focus:outline-none focus:border-blue-600 focus:bg-white transition"
                    />
                    <p className="text-xs text-gray-500 mt-2">
                      Example: 09-2199172G08
                    </p>
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
              </>
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
                    {applicationStatus.applicationType}
                  </h4>
                  <h4 className="text-lg font-bold text-blue-900 mb-3">
                    Application Status: {applicationStatus.status}
                  </h4>
                  <div className="grid grid-cols-2 gap-4 text-sm text-gray-700">
                    <div><strong>Name:</strong> {applicationStatus.studentName}</div>
                    <div><strong>{applicationStatus.applicationType === "Career Application" ? "Position" : "Grade"}:</strong> {applicationStatus.gradeApplied}</div>
                    <div><strong>Applied:</strong> {applicationStatus.applicationDate}</div>
                    <div><strong>Last Update:</strong> {applicationStatus.lastUpdate}</div>
                  </div>
                </div>

                <h5 className="text-base font-bold text-blue-900 mb-4">
                  Application Progress
                </h5>
                <div className="flex flex-col gap-0">
                  {applicationStatus.steps.map((step: any, index: number) => (
                    <div key={index} className="flex items-start gap-4 pb-5 relative">
                      {index < applicationStatus.steps.length - 1 && (
                        <div className="absolute left-5 top-10 bottom-0 w-0.5 bg-gray-200" />
                      )}
                      <div className={`w-10 h-10 rounded-full border-2 flex items-center justify-center flex-shrink-0 relative z-10 ${
                        step.status === "completed"
                          ? "border-green-500 bg-green-50 text-green-600"
                          : step.status === "in_progress"
                          ? "border-yellow-500 bg-yellow-50 text-yellow-600"
                          : "border-gray-300 bg-white text-gray-400"
                      }`}>
                        {step.status === "completed" && <CheckCircle size={16} />}
                        {step.status === "in_progress" && <span className="text-lg">⏳</span>}
                        {step.status === "pending" && <AlertCircle size={16} />}
                      </div>
                      <div>
                        <p className="text-sm font-bold text-blue-900 mb-1">
                          {step.step}
                        </p>
                        <p className="text-xs text-gray-600">
                          {step.date || "Pending"}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
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
