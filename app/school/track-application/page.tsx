"use client";

import { useState, useEffect } from "react";
import { Search, ArrowLeft, CheckCircle2, Clock, XCircle, Download, FileText, User } from "lucide-react";
import Link from "next/link";
import ApplicationProgressTracker from "@/components/ui/ApplicationProgressTracker";

// ─── Try to read a logged-in user name from common auth sources ───────────────
function useLoggedInName(): string | null {
  const [name, setName] = useState<string | null>(null);
  useEffect(() => {
    fetch("/api/auth/session", { credentials: "include" })
      .then((r) => (r.ok ? r.json() : null))
      .then((data) => {
        if (data?.user?.name) setName(data.user.name);
        else if (data?.user?.email) setName(data.user.email.split("@")[0]);
      })
      .catch(() => {
        try {
          const stored =
            localStorage.getItem("user_name") ||
            localStorage.getItem("userName") ||
            localStorage.getItem("displayName");
          if (stored) setName(stored);
        } catch { /* ignore */ }
      });
  }, []);
  return name;
}

// ─── Types ────────────────────────────────────────────────────────────────────
type TrackStep = {
  step: string;
  status: "completed" | "in_progress" | "pending";
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
  studentNumber?: string | null;
  tempPassword?: string | null;
};

// ─── Acceptance Letter Generator ──────────────────────────────────────────────
// Uses school colors: Red #c1242b, Blue #2654a7, White
// Logo: /school/slo.png  (served from Next.js public folder)
function generateAcceptanceLetter(result: TrackResult): string {
  const today = new Date().toLocaleDateString("en-ZW", {
    day: "numeric", month: "long", year: "numeric",
  });
  const academicYear = new Date().getFullYear() + 1;
  const firstName = result.applicantName.split(" ")[0];

  // We embed the logo as an absolute URL so it resolves correctly when
  // the letter is opened from a downloaded file or a print window.
  const logoUrl =
    typeof window !== "undefined"
      ? `${window.location.origin}/school/slo.png`
      : "/school/slo.png";

  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8"/>
<title>Acceptance Letter – ${result.applicantName}</title>
<style>
  *{margin:0;padding:0;box-sizing:border-box;}
  body{font-family:Georgia,'Times New Roman',serif;background:#fff;color:#1a1a1a;}
  .page{width:210mm;min-height:297mm;margin:0 auto;padding:18mm 18mm 16mm 18mm;position:relative;background:#fff;}

  /* ── Header bar ── */
  .header{display:flex;align-items:center;gap:16px;padding-bottom:14px;
          border-bottom:4px solid #c1242b;margin-bottom:6px;}
  .logo-wrap{width:76px;height:76px;background:#fff;border-radius:50%;
             border:2px solid #e0e0e0;display:flex;align-items:center;
             justify-content:center;overflow:hidden;flex-shrink:0;}
  .logo-wrap img{width:72px;height:72px;object-fit:contain;}
  .school-info h1{font-size:17px;color:#2654a7;font-weight:900;
                  letter-spacing:.5px;text-transform:uppercase;line-height:1.2;}
  .school-info p{font-size:10.5px;color:#555;margin-top:3px;line-height:1.5;}

  /* ── Blue sub-bar ── */
  .sub-bar{background:#2654a7;color:#fff;font-size:10px;
           letter-spacing:1px;text-transform:uppercase;text-align:center;
           padding:4px 0;margin-bottom:18px;}

  /* ── Ref strip ── */
  .ref-strip{display:flex;justify-content:space-between;
             font-size:10.5px;color:#555;margin-bottom:22px;}

  /* ── Body ── */
  .body{font-size:12.5px;line-height:1.85;}

  /* ── Title banner ── */
  .title-banner{background:#2654a7;color:#fff;text-align:center;
                padding:10px 0;border-radius:4px;margin:14px 0 18px;
                font-size:15px;font-weight:900;letter-spacing:2px;
                text-transform:uppercase;}

  /* ── Info box ── */
  .info-box{border:2px solid #2654a7;border-radius:6px;overflow:hidden;margin:18px 0;}
  .info-box-head{background:#2654a7;color:#fff;font-size:11px;font-weight:700;
                 letter-spacing:1px;text-transform:uppercase;padding:6px 14px;}
  .info-box table{width:100%;border-collapse:collapse;}
  .info-box td{padding:6px 14px;font-size:12px;border-bottom:1px solid #e8eef6;}
  .info-box tr:last-child td{border-bottom:none;}
  .info-box td:first-child{font-weight:700;color:#2654a7;width:44%;
                            background:#f4f7fc;}

  /* ── Credentials box ── */
  .creds-box{background:#fff8e1;border:2px solid #c1242b;border-radius:6px;
             overflow:hidden;margin:16px 0;}
  .creds-box-head{background:#c1242b;color:#fff;font-size:11px;font-weight:700;
                  letter-spacing:1px;text-transform:uppercase;padding:6px 14px;}
  .creds-box table{width:100%;border-collapse:collapse;}
  .creds-box td{padding:8px 14px;font-size:12.5px;border-bottom:1px solid #fde8e8;}
  .creds-box tr:last-child td{border-bottom:none;}
  .creds-box td:first-child{font-weight:700;color:#c1242b;width:44%;background:#fff5f5;}
  .creds-val{font-size:15px;font-weight:900;letter-spacing:2px;color:#1a1a1a;}
  .creds-note{font-size:10.5px;color:#7a0000;padding:8px 14px;
              background:#fff5f5;border-top:1px dashed #c1242b;font-style:italic;}

  ol{margin:8px 0 12px 20px;font-size:12.5px;line-height:2.1;}

  /* ── Signature block ── */
  .sign-block{margin-top:30px;display:flex;gap:48px;}
  .sign-col{flex:1;}
  .sign-line{border-bottom:1px solid #666;margin:38px 0 4px;}
  .sign-label{font-size:11.5px;font-weight:700;}
  .sign-sub{font-size:10.5px;color:#555;}

  /* ── Footer ── */
  .footer{position:absolute;bottom:12mm;left:18mm;right:18mm;
          border-top:3px solid #c1242b;padding-top:6px;
          display:flex;justify-content:space-between;font-size:9.5px;color:#555;}
  .footer span:nth-child(2){color:#2654a7;font-weight:700;}

  @media print{
    body{print-color-adjust:exact;-webkit-print-color-adjust:exact;}
    .page{margin:0;padding:14mm;}
  }
</style>
</head>
<body>
<div class="page">

  <!-- School header -->
  <div class="header">
    <div class="logo-wrap">
      <img src="${logoUrl}" alt="MGPS Logo" />
    </div>
    <div class="school-info">
      <h1>Mzinyathi Gardens Primary School</h1>
      <p>Kensington Township 2, Bulawayo, Zimbabwe</p>
      <p>Tel: +263 77 1160529 &nbsp;|&nbsp; admissions@mzinyathigardens.co.zw</p>
      <p>https://www.mzinyathigardens.co.zw/school</p>
    </div>
  </div>
  <div class="sub-bar">Excellence &nbsp;·&nbsp; Integrity &nbsp;·&nbsp; Community</div>

  <!-- Reference -->
  <div class="ref-strip">
    <span><strong>Ref:</strong> ${result.trackingId}</span>
    <span><strong>Date:</strong> ${today}</span>
  </div>

  <!-- Body -->
  <div class="body">
    <p>Dear Parent / Guardian of <strong>${result.applicantName}</strong>,</p>

    <div class="title-banner">Letter of Acceptance</div>

    <p>
      On behalf of the Principal, staff, and the entire Mzinyathi Gardens Primary School community,
      we are delighted to inform you that <strong>${result.applicantName}</strong> has been
      <strong>officially accepted</strong> into our school for the
      <strong>${academicYear} Academic Year</strong>.
    </p>
    <p style="margin-top:10px;">
      After careful review of the application we are confident that ${firstName} will thrive
      in our nurturing and academically stimulating environment.
    </p>

    <!-- Enrolment details -->
    <div class="info-box">
      <div class="info-box-head">Enrolment Details</div>
      <table>
        <tr><td>Student Name</td><td>${result.applicantName}</td></tr>
        <tr><td>Grade Enrolled</td><td>${result.grade}</td></tr>
        <tr><td>Application Ref</td><td>${result.trackingId}</td></tr>
        <tr><td>Student Number</td>
            <td><strong style="font-size:14px;color:#2654a7;">${result.studentNumber ?? "—"}</strong></td></tr>
        <tr><td>Academic Year</td><td>${academicYear}</td></tr>
      </table>
    </div>

    <!-- Portal credentials -->
    <div class="creds-box">
      <div class="creds-box-head">🔐 &nbsp;Student Portal Login Credentials</div>
      <table>
        <tr>
          <td>Student Number (Login)</td>
          <td><span class="creds-val">${result.studentNumber ?? "—"}</span></td>
        </tr>
        <tr>
          <td>Temporary Password</td>
          <td><span class="creds-val">${result.tempPassword ?? "—"}</span></td>
        </tr>
      </table>
      <p class="creds-note">
        ⚠ &nbsp;This is a <strong>temporary password</strong>. ${firstName} must log in to the
        student portal at <strong>https://www.mzinyathigardens.co.zw/school</strong> and change
        it immediately upon first login for security purposes.
      </p>
    </div>

    <p><strong>Important next steps:</strong></p>
    <ol>
      <li>Report to the school administration office with this letter and all original documents.</li>
      <li>Complete payment of registration and tuition fees at the school bursar.</li>
      <li>Log in to the student portal using the credentials above and change your password.</li>
    </ol>

    <p style="margin-top:10px;">
      Should you have any questions please contact our admissions office at
      <strong>admissions@mzinyathigardens.co.zw</strong> or call <strong>+263 77 1160529</strong>.
      Office hours are Monday to Friday, 07:30 – 16:00.
    </p>
    <p style="margin-top:10px;">
      We look forward to welcoming <strong>${firstName}</strong> to the MGPS family.
      Together, we will nurture the leaders of tomorrow.
    </p>

    <!-- Signatures -->
    <div class="sign-block">
      <div class="sign-col">
        <div class="sign-line"></div>
        <p class="sign-label">Principal</p>
        <p class="sign-sub">Mzinyathi Gardens Primary School</p>
      </div>
      <div class="sign-col">
        <div class="sign-line"></div>
        <p class="sign-label">Admissions Officer</p>
        <p class="sign-sub">Mzinyathi Gardens Primary School</p>
      </div>
    </div>
  </div>

  <!-- Page footer -->
  <div class="footer">
    <span>Mzinyathi Gardens Primary School · Bulawayo, Zimbabwe</span>
    <span>Student No: ${result.studentNumber ?? "—"}</span>
    <span>Confidential – Addressee Only</span>
  </div>

</div>
</body>
</html>`;
}

// ─── Status helpers ───────────────────────────────────────────────────────────
type StatusMeta = {
  label: string;
  icon: React.ReactNode;
  bg: string;
  border: string;
  text: string;
  badge: string;
  description: string;
};

function getStatusMeta(status: string, type: "school" | "career"): StatusMeta {
  const s = status.toLowerCase();
  if (s === "accepted" || s === "hired") {
    return {
      label: s === "hired" ? "Hired 🎉" : "Accepted 🎉",
      icon: <CheckCircle2 className="w-7 h-7 text-emerald-500" />,
      bg: "bg-emerald-50", border: "border-emerald-300",
      text: "text-emerald-800", badge: "bg-emerald-100 text-emerald-800 border-emerald-300",
      description: s === "hired"
        ? "Congratulations! Your application was successful. The school will be in touch shortly."
        : "Congratulations! Your child has been accepted. Download your acceptance letter below.",
    };
  }
  if (s === "interview") {
    return {
      label: "Interview Scheduled",
      icon: <Clock className="w-7 h-7 text-blue-500" />,
      bg: "bg-blue-50", border: "border-blue-300",
      text: "text-blue-800", badge: "bg-blue-100 text-blue-800 border-blue-300",
      description: type === "career"
        ? "You have been shortlisted for an interview. Please check the date below and prepare accordingly."
        : "Your child has been called for an interview. Please check the scheduled date below.",
    };
  }
  if (s === "shortlisted") {
    return {
      label: "Shortlisted",
      icon: <Clock className="w-7 h-7 text-blue-400" />,
      bg: "bg-blue-50", border: "border-blue-200",
      text: "text-blue-700", badge: "bg-blue-100 text-blue-700 border-blue-200",
      description: "Great news — you have been shortlisted! We will contact you with further details soon.",
    };
  }
  if (s === "waitlisted") {
    return {
      label: "Waitlisted",
      icon: <Clock className="w-7 h-7 text-yellow-500" />,
      bg: "bg-yellow-50", border: "border-yellow-300",
      text: "text-yellow-800", badge: "bg-yellow-100 text-yellow-800 border-yellow-300",
      description: "Your application is on the waiting list. A place may become available — we will contact you if one opens up.",
    };
  }
  if (s === "rejected") {
    return {
      label: "Unsuccessful",
      icon: <XCircle className="w-7 h-7 text-red-400" />,
      bg: "bg-red-50", border: "border-red-200",
      text: "text-red-700", badge: "bg-red-100 text-red-700 border-red-200",
      description: "Unfortunately your application was not successful at this time. Thank you for applying to MGPS.",
    };
  }
  if (s === "under_review") {
    return {
      label: "Under Review",
      icon: <Clock className="w-7 h-7 text-indigo-400" />,
      bg: "bg-indigo-50", border: "border-indigo-200",
      text: "text-indigo-700", badge: "bg-indigo-100 text-indigo-700 border-indigo-200",
      description: "Your application is currently being reviewed by our admissions team.",
    };
  }
  return {
    label: "Submitted",
    icon: <Clock className="w-7 h-7 text-gray-400" />,
    bg: "bg-gray-50", border: "border-gray-200",
    text: "text-gray-600", badge: "bg-gray-100 text-gray-600 border-gray-200",
    description: "Your application has been received. We will update you as it progresses.",
  };
}

// ─── Main Page ────────────────────────────────────────────────────────────────
export default function TrackApplicationPage() {
  const loggedInName = useLoggedInName();
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
        body: JSON.stringify({ trackingId, nationalId: trackForm.nationalId }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Application not found");
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

  const handleDownloadLetter = () => {
    if (!applicationStatus) return;
    const html = generateAcceptanceLetter(applicationStatus);
    const blob = new Blob([html], { type: "text/html;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `Acceptance_Letter_${applicationStatus.applicantName.replace(/\s+/g, "_")}_${applicationStatus.studentNumber ?? "MGPS"}.html`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handlePrintLetter = () => {
    if (!applicationStatus) return;
    const html = generateAcceptanceLetter(applicationStatus);
    const win = window.open("", "_blank");
    if (!win) return;
    win.document.write(html);
    win.document.close();
    win.onload = () => { win.focus(); win.print(); };
  };

  const meta = applicationStatus
    ? getStatusMeta(applicationStatus.status, applicationStatus.type)
    : null;

  const isAccepted =
    applicationStatus?.status?.toLowerCase() === "accepted" ||
    applicationStatus?.status?.toLowerCase() === "hired";

  const hasAcceptanceLetter =
    isAccepted &&
    applicationStatus?.type === "school" &&
    (applicationStatus?.studentNumber || applicationStatus?.tempPassword);

  return (
    <main className="min-h-screen bg-gradient-to-br from-green-950 via-black to-green-900 text-white overflow-x-hidden">
      <div className="page-container py-10 sm:py-16 lg:py-20 flex items-center justify-center min-h-[calc(100svh-4rem)]">
        <div className="w-full max-w-2xl min-w-0">

          {/* Page header */}
          <div className="text-center mb-10">
            <Link
              href="/school/portal"
              className="inline-flex items-center gap-2 text-green-200 hover:text-white mb-6 transition"
            >
              <ArrowLeft size={16} /> Back to Portal
            </Link>

            {loggedInName && (
              <div className="inline-flex items-center gap-2 bg-white/10 border border-white/20 rounded-full px-4 py-1.5 text-sm text-green-100 mb-5">
                <User size={14} className="text-green-300" />
                Welcome back,{" "}
                <span className="font-semibold text-white">{loggedInName}</span>
              </div>
            )}

            <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-blue-500/20 border border-blue-400/30 mb-6">
              <Search className="w-10 h-10 text-blue-400" />
            </div>
            <h1 className="text-heading-xl font-bold mb-3 break-words">Track Application</h1>
            <p className="text-gray-300">Enter your application details to check your status</p>
          </div>

          {/* Card */}
          <div className="bg-white rounded-2xl p-5 sm:p-8 shadow-2xl text-gray-900 overflow-hidden">

            {/* ── SEARCH FORM ── */}
            {!applicationStatus ? (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">
                    MG Application Number *
                  </label>
                  <input
                    value={trackForm.mgNumber}
                    onChange={(e) => setTrackForm((f) => ({ ...f, mgNumber: e.target.value }))}
                    placeholder="e.g., MGP-123456 or CAREER-123456"
                    className="w-full min-h-[44px] px-4 py-3 border border-gray-300 rounded-lg bg-gray-50 text-gray-800 focus:outline-none focus:border-blue-600 focus:bg-white transition text-base"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">
                    Parent / Applicant National ID *
                  </label>
                  <input
                    value={trackForm.nationalId}
                    onChange={(e) => setTrackForm((f) => ({ ...f, nationalId: e.target.value }))}
                    placeholder="09-2199172G08"
                    className="w-full min-h-[44px] px-4 py-3 border border-gray-300 rounded-lg bg-gray-50 text-gray-800 focus:outline-none focus:border-blue-600 focus:bg-white transition text-base"
                  />
                  <p className="text-xs text-gray-500 mt-2">
                    Use the parent&apos;s ID for school admissions, or your own ID for career applications.
                  </p>
                </div>

                {trackError && (
                  <p className="text-red-600 bg-red-50 border border-red-200 rounded-lg px-4 py-3 text-sm font-semibold">
                    {trackError}
                  </p>
                )}

                <button
                  className="interactive-btn w-full min-h-[44px] py-3 bg-blue-900 text-white font-bold rounded-lg hover:bg-blue-800 transition flex items-center justify-center gap-2 disabled:opacity-60"
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
              /* ── RESULTS ── */
              <div>
                <button
                  className="flex items-center gap-2 text-gray-500 text-sm font-semibold mb-5 hover:text-gray-800 transition"
                  onClick={resetTrackForm}
                >
                  <ArrowLeft size={14} /> Search another application
                </button>

                {/* Applicant name */}
                <div className="flex items-center gap-3 mb-5">
                  <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center shrink-0">
                    <User size={20} className="text-blue-600" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 font-semibold uppercase tracking-wide mb-0.5">
                      Application for
                    </p>
                    <p className="text-lg font-bold text-gray-900">
                      {applicationStatus.applicantName}
                    </p>
                  </div>
                </div>

                {/* Status banner */}
                {meta && (
                  <div className={`rounded-xl border p-5 mb-5 ${meta.bg} ${meta.border}`}>
                    <div className="flex items-start gap-4">
                      <div className="shrink-0 mt-0.5">{meta.icon}</div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap mb-1">
                          <span className={`text-lg font-bold ${meta.text}`}>{meta.label}</span>
                          <span className={`text-xs font-semibold border rounded-full px-2.5 py-0.5 ${meta.badge}`}>
                            {applicationStatus.type === "career" ? "Career" : "Admissions"}
                          </span>
                        </div>
                        <p className={`text-sm ${meta.text} opacity-80`}>{meta.description}</p>

                        {/* Interview date */}
                        {applicationStatus.interviewScheduledAt && (
                          <div className="mt-3 inline-flex items-center gap-2 bg-white/70 border border-blue-200 rounded-lg px-3 py-2 text-sm text-blue-800 font-semibold">
                            📅 Interview:{" "}
                            {new Date(applicationStatus.interviewScheduledAt).toLocaleString("en-ZW", {
                              weekday: "long", year: "numeric",
                              month: "long", day: "numeric",
                              hour: "2-digit", minute: "2-digit",
                            })}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                )}

                {/* Summary grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm mb-5">
                  <div className="bg-gray-50 rounded-lg px-4 py-3">
                    <p className="text-xs text-gray-400 font-semibold uppercase tracking-wide mb-1">
                      {applicationStatus.type === "career" ? "Position" : "Grade"}
                    </p>
                    <p className="font-semibold text-gray-800">{applicationStatus.grade}</p>
                  </div>
                  <div className="bg-gray-50 rounded-lg px-4 py-3">
                    <p className="text-xs text-gray-400 font-semibold uppercase tracking-wide mb-1">Tracking ID</p>
                    <p className="font-mono font-semibold text-gray-800 text-xs">{applicationStatus.trackingId}</p>
                  </div>
                  <div className="bg-gray-50 rounded-lg px-4 py-3">
                    <p className="text-xs text-gray-400 font-semibold uppercase tracking-wide mb-1">Date Applied</p>
                    <p className="font-semibold text-gray-800">
                      {new Date(applicationStatus.submittedAt).toLocaleDateString("en-ZW")}
                    </p>
                  </div>
                  <div className="bg-gray-50 rounded-lg px-4 py-3">
                    <p className="text-xs text-gray-400 font-semibold uppercase tracking-wide mb-1">Last Updated</p>
                    <p className="font-semibold text-gray-800">
                      {new Date(applicationStatus.updatedAt).toLocaleDateString("en-ZW")}
                    </p>
                  </div>
                </div>

                {/* ── ACCEPTANCE LETTER BLOCK ── */}
                {hasAcceptanceLetter && (
                  <div className="rounded-xl border-2 border-[#2654a7] overflow-hidden mb-5">
                    {/* Header bar */}
                    <div className="bg-[#2654a7] px-5 py-3 flex items-center gap-2">
                      <FileText size={18} className="text-white shrink-0" />
                      <span className="font-bold text-white text-sm tracking-wide">
                        Acceptance Letter &amp; Portal Credentials
                      </span>
                    </div>

                    {/* Credentials on page */}
                    <div className="bg-white divide-y divide-gray-100">
                      <div className="flex items-center justify-between px-5 py-3.5">
                        <span className="text-sm font-semibold text-gray-600">Student Number</span>
                        <span className="font-mono font-bold text-[#2654a7] text-lg tracking-widest">
                          {applicationStatus.studentNumber}
                        </span>
                      </div>
                      <div className="flex items-center justify-between px-5 py-3.5">
                        <span className="text-sm font-semibold text-gray-600">Temporary Password</span>
                        <span className="font-mono font-bold text-[#c1242b] text-lg tracking-widest">
                          {applicationStatus.tempPassword}
                        </span>
                      </div>
                    </div>

                    {/* Warning note */}
                    <div className="bg-amber-50 border-t border-amber-200 px-5 py-3 text-xs text-amber-800">
                      ⚠ &nbsp;This password is <strong>temporary</strong>. Log in to the student portal and
                      change it immediately on first sign-in.
                    </div>

                    {/* Download / print buttons */}
                    <div className="bg-gray-50 border-t border-gray-200 px-5 py-3 flex flex-wrap gap-2">
                      <button
                        onClick={handleDownloadLetter}
                        className="inline-flex items-center gap-2 bg-[#c1242b] hover:bg-[#a01f24] text-white text-sm font-bold px-4 py-2.5 rounded-lg transition"
                      >
                        <Download size={15} /> Download Acceptance Letter
                      </button>
                      <button
                        onClick={handlePrintLetter}
                        className="inline-flex items-center gap-2 bg-white border border-[#2654a7] text-[#2654a7] hover:bg-blue-50 text-sm font-bold px-4 py-2.5 rounded-lg transition"
                      >
                        🖨 Print Letter
                      </button>
                    </div>
                  </div>
                )}

                {/* Progress tracker */}
                <ApplicationProgressTracker
                  steps={applicationStatus.steps.map((s) => ({
                    step: s.step,
                    status: s.status as "completed" | "in_progress" | "pending",
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