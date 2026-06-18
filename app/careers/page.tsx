'use client';

import { useState, useEffect } from 'react';
import { Mail, User, MessageSquare, Briefcase, MapPin, Download, Smartphone, ChevronDown } from 'lucide-react';

// ----- Job listings (display only, no buttons) -----
const jobs = [
  {
    id: 1,
    title: 'Security Officer',
    department: 'Security',
    location: 'Mzinyathi Gardens',
    tagline: 'Protect our community with integrity and vigilance.',
  },
  {
    id: 2,
    title: 'Construction Worker',
    department: 'Construction',
    location: 'Mzinyathi Gardens',
    tagline: 'Build the future – one brick at a time.',
  },
  {
    id: 3,
    title: 'Administrative Assistant',
    department: 'Administration',
    location: 'Mzinyathi Gardens',
    tagline: 'Keep our operations smooth and efficient.',
  },
  {
    id: 4,
    title: 'Teacher (Primary)',
    department: 'Teaching',
    location: 'Mzinyathi Gardens',
    tagline: 'Shape young minds and inspire lifelong learning.',
  },
];

// ----- Hero images (placed in public/images/) -----
const heroImages = ['/images/hero1.jpg', '/images/hero2.jpg', '/images/hero3.jpg'];

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
  const [currentHeroIndex, setCurrentHeroIndex] = useState(0);
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentHeroIndex((prev) => (prev + 1) % heroImages.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const [selectedJob, setSelectedJob] = useState<typeof jobs[0] | null>(null);
  const [showAppPrompt, setShowAppPrompt] = useState(false);
  const [appDownloaded, setAppDownloaded] = useState(false);
  const [applicationSubmitted, setApplicationSubmitted] = useState(false);
  const [trackingId, setTrackingId] = useState('');
  
  const [interestForm, setInterestForm] = useState({
    name: '',
    email: '',
    position: '',
    message: ''
  });

  const [formData, setFormData] = useState<ApplicationData>({
    fullName: '', nationalId: '', dob: '', phone: '', email: '', address: '',
    education: '', institution: '', fieldOfStudy: '', previousEmployer: '', skills: '', experience: '',
    jobId: 0,
  });

  const handleInterestSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!interestForm.position) {
      alert('Please select a position from the dropdown.');
      return;
    }
    const matchedJob = jobs.find(job => job.title === interestForm.position);
    if (matchedJob) {
      setSelectedJob(matchedJob);
      localStorage.setItem('interestInfo', JSON.stringify(interestForm));
      // Redirect to school careers portal
      window.location.href = '/school/careers';
    } else {
      alert('Please select a valid position.');
    }
  };

  const handleConfirmDownload = () => {
    setAppDownloaded(true);
    setShowAppPrompt(false);
    if (interestForm.email) {
      setFormData(prev => ({ ...prev, email: interestForm.email, fullName: interestForm.name }));
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmitApplication = (e: React.FormEvent) => {
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
    setInterestForm({ name: '', email: '', position: '', message: '' });
  };

  const resetAndApplyAgain = () => {
    setApplicationSubmitted(false);
    setTrackingId('');
    setFormData({
      fullName: '', nationalId: '', dob: '', phone: '', email: '', address: '',
      education: '', institution: '', fieldOfStudy: '', previousEmployer: '', skills: '', experience: '',
      jobId: 0,
    });
  };

  const googlePlayUrl = 'https://play.google.com/store/apps/details?id=com.mzinyathi.mzinyathigardens';
  const appStoreUrl = 'https://apps.apple.com/app/id123456789';
  const appImage = '/images/Mzinyathi App.png';

  const royalBlue = '#4169E1';
  const accentRed = '#DD3210';

  return (
    <main className="bg-white text-dark">
      {/* Hero Section - only VACANCY / CAREER in white */}
      <div
        className="relative h-[60vh] bg-cover bg-center transition-all duration-1000"
        style={{ backgroundImage: `url(${heroImages[currentHeroIndex]})` }}
      >
        <div className="absolute inset-0 bg-black/50" />
        <div className="relative container mx-auto px-4 h-full flex flex-col justify-center items-center text-center">
          <p className="text-4xl md:text-6xl font-bold text-white tracking-wide">VACANCY / CAREER</p>
        </div>
      </div>

      {/* Heading and description below hero */}
      <div className="container mx-auto px-4 pt-16 pb-8 text-center">
        <h1 className="text-4xl md:text-5xl font-bold mb-4" style={{ color: royalBlue }}>Join Our Team!</h1>
        <p className="text-gray-700 text-lg max-w-3xl mx-auto">
          At Mzinyathi Gardens, we don’t just build homes — we build careers. 
          Join a community-driven real estate leader where your growth is our mission.
        </p>
      </div>

      {/* Two‑column layout */}
      <div className="container mx-auto px-4 py-8 pb-16">
        <div className="grid lg:grid-cols-2 gap-12">
          {/* LEFT COLUMN: Job cards (no buttons, dark text) */}
          <div>
            <div className="space-y-6">
              {jobs.map((job) => (
                <div key={job.id} className="bg-gray-50 rounded-lg p-6 shadow-sm border-l-4 hover:shadow-md transition" style={{ borderLeftColor: royalBlue }}>
                  <h3 className="text-2xl font-bold text-gray-900">{job.title}</h3>
                  <p className="mt-2 text-gray-700 italic">“{job.tagline}”</p>
                </div>
              ))}
            </div>
          </div>

          {/* RIGHT COLUMN: Application form */}
          <div>
            <div className="bg-gray-50 rounded-lg p-8 shadow-md border border-gray-200">
              <h2 className="text-3xl font-bold mb-6" style={{ color: royalBlue }}>Join Our Team</h2>
              <form onSubmit={handleInterestSubmit} className="space-y-5">
                <div>
                  <label className="block text-sm font-medium text-gray-800 mb-1">Your Name *</label>
                  <div className="relative">
                    <User className="absolute left-3 top-3 text-gray-500" size={18} />
                    <input
                      type="text"
                      required
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
                      type="email"
                      required
                      className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#4169E1] text-gray-900 bg-white"
                      value={interestForm.email}
                      onChange={(e) => setInterestForm({ ...interestForm, email: e.target.value })}
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-800 mb-1">Your Position *</label>
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
                  <label className="block text-sm font-medium text-gray-800 mb-1">Enter your message *</label>
                  <div className="relative">
                    <MessageSquare className="absolute left-3 top-3 text-gray-500" size={18} />
                    <textarea
                      required
                      rows={4}
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
                  Apply here
                </button>
              </form>
              <p className="text-xs text-gray-600 mt-4 text-center">
                By applying, you agree to our privacy policy. You will be redirected to our school careers portal to complete your application.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* App Download Section */}
      <div className="bg-gray-100 py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto text-center">
            <Smartphone className="w-16 h-16 mx-auto mb-4" style={{ color: royalBlue }} />
            <h2 className="text-3xl md:text-4xl font-bold mb-3" style={{ color: royalBlue }}>Download Our Free Mobile Apps Today</h2>
            <p className="text-gray-800 max-w-2xl mx-auto mb-8 font-medium">
              Track your application status, manage your property payments, and stay connected with Mzinyathi Gardens – all from our mobile app.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4 mb-12">
              <a href={googlePlayUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 text-white px-6 py-3 rounded-lg hover:bg-opacity-90 transition" style={{ backgroundColor: royalBlue }}>
                <Download size={20} /> Get it on Google Play
              </a>
              <a href={appStoreUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 text-white px-6 py-3 rounded-lg hover:bg-opacity-90 transition" style={{ backgroundColor: royalBlue }}>
                <Download size={20} /> Download on the App Store
              </a>
            </div>
            <div className="flex flex-col md:flex-row items-center justify-center gap-8 border-t border-gray-300 pt-10">
              <div className="text-center">
                <a href={googlePlayUrl} target="_blank" rel="noopener noreferrer" className="block cursor-pointer">
                  <div className="bg-white p-3 rounded-xl shadow-md inline-block hover:shadow-lg transition">
                    <img src={appImage} alt="Mzinyathi Gardens App" className="w-48 h-auto object-contain rounded-lg" onError={(e) => { e.currentTarget.src = 'https://placehold.co/200x400?text=App+Preview'; }} />
                  </div>
                </a>
                <p className="mt-2 text-sm font-semibold" style={{ color: royalBlue }}>Tap image to download</p>
              </div>
              <div className="text-left max-w-sm">
                <p className="text-gray-800 font-medium">
                  Click the image or use the buttons above to download the Mzinyathi Gardens App. Complete your application, track status, and manage your account on the go.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile App Required Modal */}
      {showAppPrompt && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-md w-full p-6 text-center">
            <h2 className="text-2xl font-bold mb-4" style={{ color: royalBlue }}>Mobile App Required</h2>
            <p className="text-gray-700 mb-4">
              To continue your application for <strong>{selectedJob?.title}</strong>, please download the Mzinyathi Gardens App.
            </p>
            <p className="text-sm text-gray-600 mb-4">
              Final submission and application tracking are available exclusively on the app.
            </p>
            <div className="flex flex-col gap-3">
              <a href={googlePlayUrl} target="_blank" rel="noopener noreferrer" className="text-white px-4 py-2 rounded-lg" style={{ backgroundColor: royalBlue }}>Download from Google Play</a>
              <a href={appStoreUrl} target="_blank" rel="noopener noreferrer" className="text-white px-4 py-2 rounded-lg" style={{ backgroundColor: royalBlue }}>Download from App Store</a>
              <button onClick={handleConfirmDownload} className="hover:underline mt-2" style={{ color: accentRed }}>
                I have downloaded the app, continue to application form
              </button>
              <button onClick={() => setShowAppPrompt(false)} className="text-gray-500 hover:underline mt-2">Cancel</button>
            </div>
          </div>
        </div>
      )}

      {/* Full Application Form */}
      {appDownloaded && !applicationSubmitted && selectedJob && (
        <div className="fixed inset-0 bg-black/50 overflow-y-auto z-50 p-4">
          <div className="bg-white rounded-lg max-w-3xl mx-auto my-8 p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold" style={{ color: royalBlue }}>Apply for: {selectedJob.title}</h2>
              <button onClick={() => { setAppDownloaded(false); setSelectedJob(null); }} className="text-gray-500 text-2xl">×</button>
            </div>
            <form onSubmit={handleSubmitApplication} className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <input name="fullName" placeholder="Full Name *" onChange={handleInputChange} required className="border p-2 rounded text-gray-900" />
                <input name="nationalId" placeholder="National ID *" onChange={handleInputChange} required className="border p-2 rounded" />
                <input name="dob" type="date" onChange={handleInputChange} required className="border p-2 rounded" />
                <input name="phone" placeholder="Phone *" onChange={handleInputChange} required className="border p-2 rounded" />
                <input name="email" type="email" placeholder="Email *" onChange={handleInputChange} required className="border p-2 rounded" value={formData.email} />
                <input name="address" placeholder="Address *" onChange={handleInputChange} required className="border p-2 rounded" />
              </div>
              <h3 className="font-semibold text-lg" style={{ color: royalBlue }}>Education</h3>
              <div className="grid md:grid-cols-2 gap-4">
                <input name="education" placeholder="Qualification *" onChange={handleInputChange} required className="border p-2 rounded" />
                <input name="institution" placeholder="Institution *" onChange={handleInputChange} required className="border p-2 rounded" />
                <input name="fieldOfStudy" placeholder="Field of Study *" onChange={handleInputChange} required className="border p-2 rounded" />
              </div>
              <h3 className="font-semibold text-lg" style={{ color: royalBlue }}>Work Experience</h3>
              <input name="previousEmployer" placeholder="Previous Employer" onChange={handleInputChange} className="border p-2 rounded w-full" />
              <input name="skills" placeholder="Skills *" onChange={handleInputChange} required className="border p-2 rounded w-full" />
              <textarea name="experience" placeholder="Describe your experience *" onChange={handleInputChange} required className="border p-2 rounded w-full" rows={3} />
              <button type="submit" className="text-white px-6 py-2 rounded-lg w-full" style={{ backgroundColor: royalBlue }}>Submit Application</button>
            </form>
          </div>
        </div>
      )}

      {/* Success Modal */}
      {applicationSubmitted && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-md w-full p-6 text-center">
            <h2 className="text-2xl font-bold text-green-600">Application Submitted!</h2>
            <p className="text-gray-700 mt-2">Your tracking ID:</p>
            <p className="text-xl font-mono font-bold my-2" style={{ color: royalBlue }}>{trackingId}</p>
            <p className="text-sm text-gray-600">Status: <span className="font-semibold">Submitted</span></p>
            <button onClick={() => { setApplicationSubmitted(false); resetAndApplyAgain(); }} className="text-white px-6 py-2 rounded-lg mt-6" style={{ backgroundColor: royalBlue }}>Apply for another position</button>
          </div>
        </div>
      )}
    </main>
  );
}