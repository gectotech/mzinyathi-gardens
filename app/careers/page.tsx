'use client';

import { useState } from 'react';

const jobs = [
  { id: 1, title: 'Security Officer', department: 'Security', location: 'Mzinyathi', type: 'Full-time', requirements: 'PSIRA registered, grade 10', responsibilities: 'Patrol, access control' },
  { id: 2, title: 'Construction Worker', department: 'Construction', location: 'Mzinyathi', type: 'Contract', requirements: 'Experience in building', responsibilities: 'Assist with site work' },
  { id: 3, title: 'Administrative Assistant', department: 'Administration', location: 'Mzinyathi', type: 'Full-time', requirements: 'Computer literacy', responsibilities: 'Office support' },
  { id: 4, title: 'Teacher (Primary)', department: 'Teaching', location: 'Mzinyathi', type: 'Part-time', requirements: 'Teaching qualification', responsibilities: 'Educate children' },
];

type ApplicationData = {
  fullName: string;
  nationalId: string;
  dob: string;
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

export default function CareersPage() {
  const [selectedJob, setSelectedJob] = useState<typeof jobs[0] | null>(null);
  const [showAppPrompt, setShowAppPrompt] = useState(false);
  const [appDownloaded, setAppDownloaded] = useState(false);
  const [formData, setFormData] = useState<ApplicationData>({
    fullName: '', nationalId: '', dob: '', phone: '', email: '', address: '',
    education: '', institution: '', fieldOfStudy: '', previousEmployer: '', skills: '', experience: '',
    jobId: 0,
  });
  const [applicationSubmitted, setApplicationSubmitted] = useState(false);
  const [trackingId, setTrackingId] = useState('');

  const handleApply = (job: typeof jobs[0]) => {
    setSelectedJob(job);
    setShowAppPrompt(true);
  };

  const handleConfirmDownload = () => {
    setAppDownloaded(true);
    setShowAppPrompt(false);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedJob) return;
    const newTrackingId = `MG-${Date.now()}`;
    const application = { ...formData, jobId: selectedJob.id, trackingId: newTrackingId, status: 'Submitted', timestamp: new Date().toISOString() };
    const existing = JSON.parse(localStorage.getItem('applications') || '[]');
    localStorage.setItem('applications', JSON.stringify([...existing, application]));
    setTrackingId(newTrackingId);
    setApplicationSubmitted(true);
    setSelectedJob(null);
    setAppDownloaded(false);
  };

  return (
    <main className="container mx-auto px-4 py-12">
      <h1 className="text-4xl font-bold text-primary mb-8 text-center">Careers at Mzinyathi Gardens</h1>

      <div className="grid md:grid-cols-2 gap-6 max-w-5xl mx-auto">
        {jobs.map((job) => (
          <div key={job.id} className="bg-white rounded-lg shadow-md p-6 border-l-4 border-primary">
            <h2 className="text-2xl font-bold">{job.title}</h2>
            <p className="text-gray-600"><strong>Department:</strong> {job.department}</p>
            <p className="text-gray-600"><strong>Location:</strong> {job.location}</p>
            <p className="text-gray-600"><strong>Type:</strong> {job.type}</p>
            <p className="mt-2"><strong>Requirements:</strong> {job.requirements}</p>
            <p><strong>Responsibilities:</strong> {job.responsibilities}</p>
            <button
              onClick={() => handleApply(job)}
              className="mt-4 bg-accent text-white px-4 py-2 rounded-lg hover:bg-accent-dark transition"
            >
              Apply Now
            </button>
          </div>
        ))}
      </div>

      {/* App Download Modal */}
      {showAppPrompt && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-md w-full p-6 text-center">
            <h2 className="text-2xl font-bold text-primary mb-4">Mobile App Required</h2>
            <p className="text-gray-700 mb-4">
              To continue your application, please download the Mzinyathi Gardens App for a faster and more secure application process.
            </p>
            <p className="text-sm text-gray-500 mb-4">
              Final submission and application tracking are available exclusively on the app.
            </p>
            <div className="flex flex-col gap-3">
              <button className="bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary-dark transition">
                Download from Google Play
              </button>
              <button className="bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary-dark transition">
                Download from App Store
              </button>
              <button
                onClick={handleConfirmDownload}
                className="text-accent hover:underline mt-2"
              >
                I have downloaded the app, continue to form
              </button>
              <button
                onClick={() => setShowAppPrompt(false)}
                className="text-gray-500 hover:underline mt-2"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Application Form */}
      {appDownloaded && !applicationSubmitted && selectedJob && (
        <div className="mt-12 max-w-3xl mx-auto bg-white p-6 rounded-lg shadow-lg">
          <h2 className="text-2xl font-bold mb-4">Apply for: {selectedJob.title}</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <input name="fullName" placeholder="Full Name" onChange={handleInputChange} required className="border p-2 rounded" />
              <input name="nationalId" placeholder="National ID" onChange={handleInputChange} required className="border p-2 rounded" />
              <input name="dob" type="date" placeholder="Date of Birth" onChange={handleInputChange} required className="border p-2 rounded" />
              <input name="phone" placeholder="Phone Number" onChange={handleInputChange} required className="border p-2 rounded" />
              <input name="email" type="email" placeholder="Email" onChange={handleInputChange} required className="border p-2 rounded" />
              <input name="address" placeholder="Address" onChange={handleInputChange} required className="border p-2 rounded" />
            </div>
            <h3 className="font-semibold text-lg mt-4">Education</h3>
            <div className="grid md:grid-cols-2 gap-4">
              <input name="education" placeholder="Qualification" onChange={handleInputChange} required className="border p-2 rounded" />
              <input name="institution" placeholder="Institution" onChange={handleInputChange} required className="border p-2 rounded" />
              <input name="fieldOfStudy" placeholder="Field of Study" onChange={handleInputChange} required className="border p-2 rounded" />
            </div>
            <h3 className="font-semibold text-lg mt-4">Work Experience</h3>
            <input name="previousEmployer" placeholder="Previous Employer" onChange={handleInputChange} className="border p-2 rounded w-full" />
            <input name="skills" placeholder="Skills" onChange={handleInputChange} required className="border p-2 rounded w-full" />
            <textarea name="experience" placeholder="Describe your experience" onChange={handleInputChange} required className="border p-2 rounded w-full" rows={3}></textarea>
            <p className="text-sm text-gray-500">* Uploads (CV, Certificates, ID) would be handled via file input – for demo, you can simulate.</p>
            <button type="submit" className="bg-primary text-white px-6 py-2 rounded-lg hover:bg-primary-dark transition">Submit Application</button>
          </form>
        </div>
      )}

      {/* Tracking Status */}
      {applicationSubmitted && (
        <div className="mt-12 max-w-2xl mx-auto bg-green-50 p-6 rounded-lg text-center">
          <h2 className="text-2xl font-bold text-green-700">Application Submitted</h2>
          <p className="mt-2">Your tracking ID: <strong>{trackingId}</strong></p>
          <p className="mt-1">Status: <span className="font-semibold">Submitted</span></p>
          <p className="mt-4 text-gray-600">You can check your status later using this ID.</p>
          <button onClick={() => window.location.reload()} className="mt-4 bg-primary text-white px-4 py-2 rounded-lg">Apply for another job</button>
        </div>
      )}
    </main>
  );
}