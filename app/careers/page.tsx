'use client';

import { useState, useEffect, useRef, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import {
  Mail, User, MessageSquare, Briefcase, MapPin,
  Download, Smartphone, ChevronDown, Upload, X, FileText, CheckCircle, Loader2,
} from 'lucide-react';
import PageCmsContent from '@/components/PageCmsContent';

type JobListing = {
  id: string;
  title: string;
  department: string;
  location: string;
  tagline: string;
};

type UploadedFile = {
  label: string;
  url: string;
  name: string;
};

const heroImages = ['/images/hero1.jpg', '/images/hero2.jpg', '/images/hero3.jpg'];

type ApplicationData = {
  fullName: string;
  nationalId: string;
  dob: string;
  gender: string;
  phone: string;
  email: string;
  address: string;
  education: string;
  institution: string;
  fieldOfStudy: string;
  previousEmployer: string;
  skills: string;
  experience: string;
  jobId: number;
};

// ─── File Upload Field ────────────────────────────────────────────────────────

function FileUploadField({
  label,
  required,
  accept,
  uploaded,
  uploading,
  onUpload,
  onRemove,
}: {
  label: string;
  required?: boolean;
  accept?: string;
  uploaded: UploadedFile | null;
  uploading: boolean;
  onUpload: (file: File, label: string) => void;
  onRemove: () => void;
}) {
  const inputRef = useRef<HTMLInputElement>(null);

  return (
    <div className="space-y-1">
      <label className="block text-sm font-medium text-gray-800">
        {label} {required && <span className="text-red-500">*</span>}
      </label>

      {uploaded ? (
        <div className="flex items-center gap-2 bg-green-50 border border-green-200 rounded-lg px-3 py-2">
          <CheckCircle size={16} className="text-green-600 shrink-0" />
          <span className="text-sm text-green-800 truncate flex-1">{uploaded.name}</span>
          <button
            type="button"
            onClick={onRemove}
            className="text-gray-400 hover:text-red-500 transition shrink-0"
          >
            <X size={15} />
          </button>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          disabled={uploading}
          className="w-full flex items-center gap-2 border-2 border-dashed border-gray-300 rounded-lg px-4 py-3 text-sm text-gray-500 hover:border-[#4169E1] hover:text-[#4169E1] transition disabled:opacity-60"
        >
          {uploading ? (
            <Loader2 size={16} className="animate-spin" />
          ) : (
            <Upload size={16} />
          )}
          {uploading ? 'Uploading…' : `Click to upload ${label}`}
        </button>
      )}

      <input
        ref={inputRef}
        type="file"
        accept={accept || '.pdf,.doc,.docx,.jpg,.jpeg,.png'}
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) onUpload(file, label);
          e.target.value = '';
        }}
      />
    </div>
  );
}

export default function CareersPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-white" />}>
      <CareersPageContent />
    </Suspense>
  );
}

function CareersPageContent() {
  const searchParams = useSearchParams();
  const [jobs, setJobs] = useState<JobListing[]>([]);
  const [currentHeroIndex, setCurrentHeroIndex] = useState(0);

  useEffect(() => {
    fetch('/api/careers')
      .then((r) => r.json())
      .then((d) => {
        if (d.jobs?.length) {
          setJobs(d.jobs.map((j: JobListing & { id: string }) => ({ ...j, id: j.id })));
        } else {
          setJobs([
            { id: '1', title: 'Security Officer', department: 'Security', location: 'Mzinyathi Gardens', tagline: 'Protect our community with integrity and vigilance.' },
            { id: '2', title: 'Construction Worker', department: 'Construction', location: 'Mzinyathi Gardens', tagline: 'Build the future – one brick at a time.' },
            { id: '3', title: 'Administrative Assistant', department: 'Administration', location: 'Mzinyathi Gardens', tagline: 'Keep our operations smooth and efficient.' },
            { id: '4', title: 'Teacher (Primary)', department: 'Teaching', location: 'Mzinyathi Gardens', tagline: 'Shape young minds and inspire lifelong learning.' },
          ]);
        }
      })
      .catch(() => {});
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentHeroIndex((prev) => (prev + 1) % heroImages.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const [selectedJob, setSelectedJob] = useState<JobListing | null>(null);
  const [showAppPrompt, setShowAppPrompt] = useState(false);
  const [appDownloaded, setAppDownloaded] = useState(false);
  const [applicationSubmitted, setApplicationSubmitted] = useState(false);
  const [trackingId, setTrackingId] = useState('');
  const [submitting, setSubmitting] = useState(false);

  // ── Upload state ──
  // uploadingKey tracks which field is currently uploading
  const [uploadingKey, setUploadingKey] = useState<string | null>(null);
  const [uploads, setUploads] = useState<Record<string, UploadedFile>>({});
  // uploads keys: 'resume' | 'nationalId' | 'certificate1' | 'certificate2'

  const [interestForm, setInterestForm] = useState({
    name: '', email: '', position: '', message: '',
  });

  const [formData, setFormData] = useState<ApplicationData>({
    fullName: '', nationalId: '', dob: '', gender: '', phone: '', email: '',
    address: '', education: '', institution: '', fieldOfStudy: '',
    previousEmployer: '', skills: '', experience: '', jobId: 0,
  });

  // ── Upload a file to Cloudinary via existing /api/media endpoint ──
  const uploadFile = async (file: File, fieldKey: string, label: string) => {
    setUploadingKey(fieldKey);
    try {
      const fd = new FormData();
      fd.append('file', file);
      fd.append('folder', 'job-applications');

      const res = await fetch('/api/media', { method: 'POST', body: fd });
      if (!res.ok) throw new Error('Upload failed');
      const data = await res.json();
      const url: string = data.media?.secureUrl || data.media?.url;
      if (!url) throw new Error('No URL returned');

      setUploads((prev) => ({
        ...prev,
        [fieldKey]: { label, url, name: file.name },
      }));
    } catch {
      alert(`Failed to upload ${label}. Please try again.`);
    } finally {
      setUploadingKey(null);
    }
  };

  const removeUpload = (key: string) => {
    setUploads((prev) => {
      const next = { ...prev };
      delete next[key];
      return next;
    });
  };

  const handleInterestSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!interestForm.position) {
      alert('Please select a position from the dropdown.');
      return;
    }
    const matchedJob = jobs.find((job) => job.title === interestForm.position);
    if (matchedJob) {
      setSelectedJob(matchedJob);
      setAppDownloaded(true); // go straight to form, skip app prompt
    } else {
      alert('Please select a valid position.');
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmitApplication = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedJob) return;

    // Require CV
    if (!uploads.resume) {
      alert('Please upload your CV / Resume before submitting.');
      return;
    }

    setSubmitting(true);
    try {
      // Build documents array from all uploads
      const documents = Object.values(uploads).map((u) => ({
        label: u.label,
        url: u.url,
      }));

      const res = await fetch('/api/careers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          jobTitle: selectedJob.title,
          interestMessage: interestForm.message,
          ...formData,
          resumeUrl: uploads.resume?.url || null,   // keep legacy field populated
          documents,                                  // new structured array
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Submission failed');

      setTrackingId(data.trackingId);
      setApplicationSubmitted(true);
      setSelectedJob(null);
      setAppDownloaded(false);
      setUploads({});
      setInterestForm({ name: '', email: '', position: '', message: '' });
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Failed to submit application');
    } finally {
      setSubmitting(false);
    }
  };

  const resetAndApplyAgain = () => {
    setApplicationSubmitted(false);
    setTrackingId('');
    setUploads({});
    setFormData({
      fullName: '', nationalId: '', dob: '', gender: '', phone: '', email: '',
      address: '', education: '', institution: '', fieldOfStudy: '',
      previousEmployer: '', skills: '', experience: '', jobId: 0,
    });
  };

  const googlePlayUrl = 'https://play.google.com/store/apps/details?id=com.mzinyathi.mzinyathigardens';
  const appStoreUrl   = 'https://apps.apple.com/app/id123456789';
  const appImage      = '/images/Mzinyathi App.png';
  const royalBlue     = '#4169E1';
  const accentRed     = '#DD3210';

  return (
    <main className="bg-white text-dark">
      {/* Hero */}
      <div
        className="relative h-[60vh] bg-cover bg-center transition-all duration-1000"
        style={{ backgroundImage: `url(${heroImages[currentHeroIndex]})` }}
      >
        <div className="absolute inset-0 bg-black/50" />
        <div className="relative container mx-auto px-4 h-full flex flex-col justify-center items-center text-center">
          <p className="text-4xl md:text-6xl font-bold text-white tracking-wide">VACANCY / CAREER</p>
        </div>
      </div>

      {/* Intro */}
      <div className="container mx-auto px-4 pt-16 pb-8 text-center">
        <h1 className="text-4xl md:text-5xl font-bold mb-4" style={{ color: royalBlue }}>Join Our Team!</h1>
        <p className="text-gray-700 text-lg max-w-3xl mx-auto">
          At Mzinyathi Gardens, we don't just build homes — we build careers.
          Join a community-driven real estate leader where your growth is our mission.
        </p>
      </div>

      {/* Two‑column */}
      <div className="container mx-auto px-4 py-8 pb-16">
        <div className="grid lg:grid-cols-2 gap-12">
          {/* Job cards */}
          <div className="space-y-6">
            {jobs.map((job) => (
              <div
                key={job.id}
                className="bg-gray-50 rounded-lg p-6 shadow-sm border-l-4 hover:shadow-md transition"
                style={{ borderLeftColor: royalBlue }}
              >
                <h3 className="text-2xl font-bold text-gray-900">{job.title}</h3>
                <p className="mt-2 text-gray-700 italic">"{job.tagline}"</p>
              </div>
            ))}
          </div>

          {/* Interest form */}
          <div>
            <div className="bg-gray-50 rounded-lg p-8 shadow-md border border-gray-200">
              <h2 className="text-3xl font-bold mb-6" style={{ color: royalBlue }}>Apply Here</h2>
              <form onSubmit={handleInterestSubmit} className="space-y-5">
                <div>
                  <label className="block text-sm font-medium text-gray-800 mb-1">Your Name *</label>
                  <div className="relative">
                    <User className="absolute left-3 top-3 text-gray-500" size={18} />
                    <input
                      type="text" required
                      className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#4169E1] text-gray-900 bg-white"
                      value={interestForm.name}
                      onChange={(e) => setInterestForm({ ...interestForm, name: e.target.value })}
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-800 mb-1">Your Email *</label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-3 text-gray-500" size={18} />
                    <input
                      type="email" required
                      className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#4169E1] text-gray-900 bg-white"
                      value={interestForm.email}
                      onChange={(e) => setInterestForm({ ...interestForm, email: e.target.value })}
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-800 mb-1">Position *</label>
                  <div className="relative">
                    <Briefcase className="absolute left-3 top-3 text-gray-500" size={18} />
                    <select
                      required
                      className="w-full pl-10 pr-8 py-2 border border-gray-300 rounded-md appearance-none focus:outline-none focus:ring-2 focus:ring-[#4169E1] bg-white"
                      style={{ color: interestForm.position ? '#000000' : '#9CA3AF' }}
                      value={interestForm.position}
                      onChange={(e) => setInterestForm({ ...interestForm, position: e.target.value })}
                    >
                      <option value="">Select a position</option>
                      {jobs.map((job) => (
                        <option key={job.id} value={job.title} className="text-gray-900">{job.title}</option>
                      ))}
                    </select>
                    <ChevronDown className="absolute right-3 top-3 text-gray-500 pointer-events-none" size={18} />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-800 mb-1">Why do you want to join us? *</label>
                  <div className="relative">
                    <MessageSquare className="absolute left-3 top-3 text-gray-500" size={18} />
                    <textarea
                      required rows={4}
                      className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#4169E1] text-gray-900 bg-white"
                      placeholder="Why would you like to join us?"
                      value={interestForm.message}
                      onChange={(e) => setInterestForm({ ...interestForm, message: e.target.value })}
                    />
                  </div>
                </div>
                <button
                  type="submit"
                  className="w-full text-white py-3 rounded-md hover:bg-opacity-90 transition font-semibold text-lg"
                  style={{ backgroundColor: royalBlue }}
                >
                  Continue to Application
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>

      {/* App Download Section */}
      <div className="bg-gray-100 py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto text-center">
            <Smartphone className="w-16 h-16 mx-auto mb-4" style={{ color: royalBlue }} />
            <h2 className="text-3xl md:text-4xl font-bold mb-3" style={{ color: royalBlue }}>Download Our Free Mobile App</h2>
            <p className="text-gray-800 max-w-2xl mx-auto mb-8 font-medium">
              Track your application status, manage your property payments, and stay connected with Mzinyathi Gardens.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4 mb-12">
              <a href={googlePlayUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 text-white px-6 py-3 rounded-lg hover:bg-opacity-90 transition" style={{ backgroundColor: royalBlue }}>
                <Download size={20} /> Get it on Google Play
              </a>
              <a href={appStoreUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 text-white px-6 py-3 rounded-lg hover:bg-opacity-90 transition" style={{ backgroundColor: royalBlue }}>
                <Download size={20} /> Download on App Store
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* ── Full Application Form Modal ── */}
      {appDownloaded && !applicationSubmitted && selectedJob && (
        <div className="fixed inset-0 bg-black/60 overflow-y-auto z-50 p-4">
          <div className="bg-white rounded-xl max-w-3xl mx-auto my-8 shadow-2xl">
            {/* Modal header */}
            <div className="flex justify-between items-center px-6 py-4 border-b sticky top-0 bg-white rounded-t-xl z-10">
              <div>
                <h2 className="text-xl font-bold" style={{ color: royalBlue }}>
                  Apply for: {selectedJob.title}
                </h2>
                <p className="text-xs text-gray-500 mt-0.5">All fields marked * are required</p>
              </div>
              <button
                onClick={() => { setAppDownloaded(false); setSelectedJob(null); setUploads({}); }}
                className="text-gray-400 hover:text-gray-700 transition p-1"
              >
                <X size={22} />
              </button>
            </div>

            <form onSubmit={handleSubmitApplication} className="p-6 space-y-6">

              {/* Personal details */}
              <section>
                <h3 className="font-semibold text-base mb-3" style={{ color: royalBlue }}>Personal Details</h3>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">Full Name *</label>
                    <input name="fullName" required onChange={handleInputChange}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#4169E1]" />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">National ID *</label>
                    <input name="nationalId" required onChange={handleInputChange}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#4169E1]" />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">Date of Birth *</label>
                    <input name="dob" type="date" required onChange={handleInputChange}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#4169E1]" />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">Gender *</label>
                    <select name="gender" required onChange={handleInputChange}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#4169E1] bg-white">
                      <option value="">Select gender</option>
                      <option value="male">Male</option>
                      <option value="female">Female</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">Phone *</label>
                    <input name="phone" required onChange={handleInputChange}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#4169E1]" />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">Email *</label>
                    <input name="email" type="email" required onChange={handleInputChange} value={formData.email}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#4169E1]" />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-xs font-medium text-gray-700 mb-1">Address *</label>
                    <input name="address" required onChange={handleInputChange}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#4169E1]" />
                  </div>
                </div>
              </section>

              {/* Education */}
              <section>
                <h3 className="font-semibold text-base mb-3" style={{ color: royalBlue }}>Education</h3>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">Highest Qualification *</label>
                    <input name="education" required onChange={handleInputChange}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#4169E1]" />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">Institution *</label>
                    <input name="institution" required onChange={handleInputChange}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#4169E1]" />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">Field of Study *</label>
                    <input name="fieldOfStudy" required onChange={handleInputChange}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#4169E1]" />
                  </div>
                </div>
              </section>

              {/* Experience */}
              <section>
                <h3 className="font-semibold text-base mb-3" style={{ color: royalBlue }}>Work Experience</h3>
                <div className="space-y-3">
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">Previous Employer</label>
                    <input name="previousEmployer" onChange={handleInputChange}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#4169E1]" />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">Skills *</label>
                    <input name="skills" required onChange={handleInputChange} placeholder="e.g. Communication, MS Office, Teamwork"
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#4169E1]" />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">Describe your experience *</label>
                    <textarea name="experience" required rows={3} onChange={handleInputChange}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#4169E1]" />
                  </div>
                </div>
              </section>

              {/* Document Uploads */}
              <section>
                <h3 className="font-semibold text-base mb-1" style={{ color: royalBlue }}>Documents & Uploads</h3>
                <p className="text-xs text-gray-500 mb-3">Accepted formats: PDF, DOC, DOCX, JPG, PNG. Max 10MB each.</p>
                <div className="space-y-3">
                  <FileUploadField
                    label="CV / Resume"
                    required
                    uploaded={uploads.resume ?? null}
                    uploading={uploadingKey === 'resume'}
                    onUpload={(file, label) => uploadFile(file, 'resume', label)}
                    onRemove={() => removeUpload('resume')}
                  />
                  <FileUploadField
                    label="National ID Document"
                    uploaded={uploads.nationalId ?? null}
                    uploading={uploadingKey === 'nationalId'}
                    onUpload={(file, label) => uploadFile(file, 'nationalId', label)}
                    onRemove={() => removeUpload('nationalId')}
                  />
                  <FileUploadField
                    label="Academic Certificate / Degree"
                    uploaded={uploads.certificate1 ?? null}
                    uploading={uploadingKey === 'certificate1'}
                    onUpload={(file, label) => uploadFile(file, 'certificate1', label)}
                    onRemove={() => removeUpload('certificate1')}
                  />
                  <FileUploadField
                    label="Additional Certificate (optional)"
                    uploaded={uploads.certificate2 ?? null}
                    uploading={uploadingKey === 'certificate2'}
                    onUpload={(file, label) => uploadFile(file, 'certificate2', label)}
                    onRemove={() => removeUpload('certificate2')}
                  />
                </div>
              </section>

              <button
                type="submit"
                disabled={submitting || !!uploadingKey}
                className="w-full text-white py-3 rounded-lg font-semibold text-base hover:opacity-90 transition disabled:opacity-60 flex items-center justify-center gap-2"
                style={{ backgroundColor: royalBlue }}
              >
                {submitting ? <><Loader2 size={18} className="animate-spin" /> Submitting…</> : 'Submit Application'}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Success Modal */}
      {applicationSubmitted && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-md w-full p-8 text-center shadow-2xl">
            <CheckCircle size={48} className="text-green-500 mx-auto mb-3" />
            <h2 className="text-2xl font-bold text-green-600">Application Submitted!</h2>
            <p className="text-gray-600 mt-2 text-sm">Save your tracking ID to check your application status.</p>
            <p className="text-xl font-mono font-bold my-3" style={{ color: royalBlue }}>{trackingId}</p>
            <p className="text-sm text-gray-500">Status: <span className="font-semibold text-gray-700">Submitted</span></p>
            <button
              onClick={resetAndApplyAgain}
              className="text-white px-6 py-2 rounded-lg mt-6 font-medium"
              style={{ backgroundColor: royalBlue }}
            >
              Apply for another position
            </button>
          </div>
        </div>
      )}

      <PageCmsContent slug="careers" />
    </main>
  );
}