"use client";

import { useState } from "react";
import { ArrowLeft, Briefcase, Upload, CheckCircle, AlertCircle } from "lucide-react";
import Link from "next/link";

type Step = "personal" | "education" | "experience" | "documents" | "questions" | "review";

export default function CareersPage() {
  const [currentStep, setCurrentStep] = useState<Step>("personal");
  const [submitted, setSubmitted] = useState(false);
  const [applicationId, setApplicationId] = useState("");

  const [formData, setFormData] = useState({
    // Personal Information
    fullName: "",
    nationalId: "",
    dateOfBirth: "",
    gender: "",
    phoneNumber: "",
    email: "",
    physicalAddress: "",
    city: "",
    // Education Information
    highestQualification: "",
    school: "",
    fieldOfStudy: "",
    yearCompleted: "",
    // Work Experience
    previousEmployer: "",
    positionHeld: "",
    yearsOfExperience: "",
    skills: "",
    // Additional Questions
    availableImmediately: "",
    haveReferences: "",
    whyHireYou: "",
  });

  const [uploadedFiles, setUploadedFiles] = useState({
    cv: null as File | null,
    nationalIdCopy: null as File | null,
    certificates: null as File | null,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>, field: "cv" | "nationalIdCopy" | "certificates") => {
    if (e.target.files && e.target.files[0]) {
      setUploadedFiles({ ...uploadedFiles, [field]: e.target.files[0] });
    }
  };

  const handleNext = () => {
    const steps: Step[] = ["personal", "education", "experience", "documents", "questions", "review"];
    const currentIndex = steps.indexOf(currentStep);
    if (currentIndex < steps.length - 1) {
      setCurrentStep(steps[currentIndex + 1]);
    }
  };

  const handleBack = () => {
    const steps: Step[] = ["personal", "education", "experience", "documents", "questions", "review"];
    const currentIndex = steps.indexOf(currentStep);
    if (currentIndex > 0) {
      setCurrentStep(steps[currentIndex - 1]);
    }
  };

  const handleSaveDraft = () => {
    localStorage.setItem("careersDraft", JSON.stringify({ formData, uploadedFiles }));
    alert("Draft saved successfully!");
  };

  const handleSubmit = () => {
    // Validate required fields
    const requiredFields = {
      fullName: formData.fullName,
      nationalId: formData.nationalId,
      dateOfBirth: formData.dateOfBirth,
      gender: formData.gender,
      phoneNumber: formData.phoneNumber,
      physicalAddress: formData.physicalAddress,
      city: formData.city,
      highestQualification: formData.highestQualification,
      school: formData.school,
      fieldOfStudy: formData.fieldOfStudy,
      yearCompleted: formData.yearCompleted,
      previousEmployer: formData.previousEmployer,
      positionHeld: formData.positionHeld,
      yearsOfExperience: formData.yearsOfExperience,
      skills: formData.skills,
      availableImmediately: formData.availableImmediately,
      haveReferences: formData.haveReferences,
      whyHireYou: formData.whyHireYou,
    };

    const emptyFields = Object.entries(requiredFields)
      .filter(([key, value]) => !value || (typeof value === 'string' && value.trim() === ""))
      .map(([key]) => key);

    if (emptyFields.length > 0) {
      alert(`Please complete all required fields before submitting.\n\nMissing fields:\n${emptyFields.join(", ")}`);
      return;
    }

    // Validate file uploads
    if (!uploadedFiles.cv || !uploadedFiles.nationalIdCopy || !uploadedFiles.certificates) {
      alert("Please upload all required documents (CV/Resume, National ID Copy, and Certificates).");
      return;
    }

    const appId = "CAREER-" + Math.floor(100000 + Math.random() * 900000);
    setApplicationId(appId);
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <main className="min-h-screen bg-gradient-to-br from-green-950 via-black to-green-900 text-white">
        <div className="container mx-auto px-6 py-20 flex items-center justify-center min-h-screen">
          <div className="w-full max-w-2xl text-center">
            <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-green-500/20 border border-green-400/30 mb-8">
              <CheckCircle size={48} className="text-green-400" />
            </div>
            <h1 className="text-4xl font-bold mb-4">Application Submitted!</h1>
            <p className="text-xl text-gray-300 mb-6">Your career application has been received successfully.</p>
            <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-8 mb-8">
              <p className="text-lg mb-2">Application Number:</p>
              <p className="text-3xl font-bold text-yellow-400 mb-4">{applicationId}</p>
              <p className="text-sm text-gray-400">Please save this number for tracking your application status.</p>
            </div>
            <Link href="/school/pathway" className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-green-500 text-white font-semibold hover:bg-green-400 transition-colors">
              <ArrowLeft size={18} /> Back to Portal
            </Link>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-green-950 via-black to-green-900 text-white">
      <div className="container mx-auto px-6 py-20">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="mb-10">
            <Link href="/school/pathway" className="inline-flex items-center gap-2 text-green-200 hover:text-white mb-6 transition">
              <ArrowLeft size={16} /> Back to Portal
            </Link>
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-green-500/20 border border-green-400/30 mb-6">
              <Briefcase className="w-10 h-10 text-green-400" />
            </div>
            <h1 className="text-4xl font-bold mb-3">Careers Application</h1>
            <p className="text-gray-300">Join our team at Mzinyathi Gardens Preparatory School</p>
          </div>

          {/* Progress Steps */}
          <div className="mb-10">
            <div className="flex items-center justify-between mb-4">
              {["Personal", "Education", "Experience", "Documents", "Questions", "Review"].map((step, index) => (
                <div key={index} className="flex items-center">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold ${
                    ["personal", "education", "experience", "documents", "questions", "review"][index] === currentStep
                      ? "bg-green-500 text-white"
                      : ["personal", "education", "experience", "documents", "questions"].indexOf(currentStep) > index
                      ? "bg-green-500/30 text-green-400"
                      : "bg-white/10 text-gray-500"
                  }`}>
                    {["personal", "education", "experience", "documents", "questions"].indexOf(currentStep) > index ? (
                      <CheckCircle size={16} />
                    ) : (
                      index + 1
                    )}
                  </div>
                  {index < 5 && <div className="w-16 h-0.5 bg-white/20 mx-2" />}
                </div>
              ))}
            </div>
            <div className="flex justify-between text-xs text-gray-400 px-1">
              {["Personal", "Education", "Experience", "Documents", "Questions", "Review"].map((step) => (
                <span key={step}>{step}</span>
              ))}
            </div>
          </div>

          {/* Form Card */}
          <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-8 shadow-2xl">
            {/* Step A: Personal Information */}
            {currentStep === "personal" && (
              <div>
                <h2 className="text-2xl font-bold mb-6">A. Personal Information</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="md:col-span-2">
                    <label className="block text-sm font-bold text-gray-300 mb-2">Full Name *</label>
                    <input
                      name="fullName"
                      value={formData.fullName}
                      onChange={handleChange}
                      placeholder="Enter your full name"
                      className="w-full px-4 py-3 border border-white/30 rounded-lg bg-white/10 text-white focus:outline-none focus:border-green-400 focus:bg-white/20 transition"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-300 mb-2">National ID Number *</label>
                    <input
                      name="nationalId"
                      value={formData.nationalId}
                      onChange={handleChange}
                      placeholder="e.g., 09-2199172G08"
                      className="w-full px-4 py-3 border border-white/30 rounded-lg bg-white/10 text-white focus:outline-none focus:border-green-400 focus:bg-white/20 transition"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-300 mb-2">Date of Birth *</label>
                    <input
                      name="dateOfBirth"
                      type="date"
                      value={formData.dateOfBirth}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-white/30 rounded-lg bg-white/10 text-white focus:outline-none focus:border-green-400 focus:bg-white/20 transition"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-300 mb-2">Gender *</label>
                    <select
                      name="gender"
                      value={formData.gender}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-white/30 rounded-lg bg-white/10 text-white focus:outline-none focus:border-green-400 focus:bg-white/20 transition"
                    >
                      <option value="">Select gender</option>
                      <option value="male">Male</option>
                      <option value="female">Female</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-300 mb-2">Phone Number *</label>
                    <input
                      name="phoneNumber"
                      value={formData.phoneNumber}
                      onChange={handleChange}
                      placeholder="e.g., +263 77 123 4567"
                      className="w-full px-4 py-3 border border-white/30 rounded-lg bg-white/10 text-white focus:outline-none focus:border-green-400 focus:bg-white/20 transition"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-bold text-gray-300 mb-2">Email Address (Optional)</label>
                    <input
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="your@email.com"
                      className="w-full px-4 py-3 border border-white/30 rounded-lg bg-white/10 text-white focus:outline-none focus:border-green-400 focus:bg-white/20 transition"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-bold text-gray-300 mb-2">Physical Address *</label>
                    <input
                      name="physicalAddress"
                      value={formData.physicalAddress}
                      onChange={handleChange}
                      placeholder="Street address"
                      className="w-full px-4 py-3 border border-white/30 rounded-lg bg-white/10 text-white focus:outline-none focus:border-green-400 focus:bg-white/20 transition"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-300 mb-2">City *</label>
                    <input
                      name="city"
                      value={formData.city}
                      onChange={handleChange}
                      placeholder="City"
                      className="w-full px-4 py-3 border border-white/30 rounded-lg bg-white/10 text-white focus:outline-none focus:border-green-400 focus:bg-white/20 transition"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Step B: Education Information */}
            {currentStep === "education" && (
              <div>
                <h2 className="text-2xl font-bold mb-6">B. Education Information</h2>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-bold text-gray-300 mb-2">Highest Qualification *</label>
                    <input
                      name="highestQualification"
                      value={formData.highestQualification}
                      onChange={handleChange}
                      placeholder="e.g., Bachelor's Degree, Diploma, Certificate"
                      className="w-full px-4 py-3 border border-white/30 rounded-lg bg-white/10 text-white focus:outline-none focus:border-green-400 focus:bg-white/20 transition"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-300 mb-2">School / College / University *</label>
                    <input
                      name="school"
                      value={formData.school}
                      onChange={handleChange}
                      placeholder="Name of institution"
                      className="w-full px-4 py-3 border border-white/30 rounded-lg bg-white/10 text-white focus:outline-none focus:border-green-400 focus:bg-white/20 transition"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-300 mb-2">Field of Study *</label>
                    <input
                      name="fieldOfStudy"
                      value={formData.fieldOfStudy}
                      onChange={handleChange}
                      placeholder="e.g., Education, Business, Science"
                      className="w-full px-4 py-3 border border-white/30 rounded-lg bg-white/10 text-white focus:outline-none focus:border-green-400 focus:bg-white/20 transition"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-300 mb-2">Year Completed *</label>
                    <input
                      name="yearCompleted"
                      type="number"
                      value={formData.yearCompleted}
                      onChange={handleChange}
                      placeholder="e.g., 2023"
                      className="w-full px-4 py-3 border border-white/30 rounded-lg bg-white/10 text-white focus:outline-none focus:border-green-400 focus:bg-white/20 transition"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Step C: Work Experience */}
            {currentStep === "experience" && (
              <div>
                <h2 className="text-2xl font-bold mb-6">C. Work Experience</h2>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-bold text-gray-300 mb-2">Previous Employer *</label>
                    <input
                      name="previousEmployer"
                      value={formData.previousEmployer}
                      onChange={handleChange}
                      placeholder="Company or organization name"
                      className="w-full px-4 py-3 border border-white/30 rounded-lg bg-white/10 text-white focus:outline-none focus:border-green-400 focus:bg-white/20 transition"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-300 mb-2">Position Held *</label>
                    <input
                      name="positionHeld"
                      value={formData.positionHeld}
                      onChange={handleChange}
                      placeholder="Job title"
                      className="w-full px-4 py-3 border border-white/30 rounded-lg bg-white/10 text-white focus:outline-none focus:border-green-400 focus:bg-white/20 transition"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-300 mb-2">Years of Experience *</label>
                    <input
                      name="yearsOfExperience"
                      type="number"
                      value={formData.yearsOfExperience}
                      onChange={handleChange}
                      placeholder="Number of years"
                      className="w-full px-4 py-3 border border-white/30 rounded-lg bg-white/10 text-white focus:outline-none focus:border-green-400 focus:bg-white/20 transition"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-300 mb-2">Skills *</label>
                    <textarea
                      name="skills"
                      value={formData.skills}
                      onChange={handleChange}
                      placeholder="List your relevant skills (comma separated)"
                      rows={4}
                      className="w-full px-4 py-3 border border-white/30 rounded-lg bg-white/10 text-white focus:outline-none focus:border-green-400 focus:bg-white/20 transition resize-none"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Step D: Upload Documents */}
            {currentStep === "documents" && (
              <div>
                <h2 className="text-2xl font-bold mb-6">D. Upload Documents</h2>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-bold text-gray-300 mb-2">CV / Resume *</label>
                    <div className="relative">
                      <input
                        type="file"
                        accept=".pdf,.doc,.docx"
                        onChange={(e) => handleFileUpload(e, "cv")}
                        className="w-full px-4 py-3 border border-white/30 rounded-lg bg-white/10 text-white focus:outline-none focus:border-green-400 focus:bg-white/20 transition file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-green-500/20 file:text-green-400 hover:file:bg-green-500/30"
                      />
                      {uploadedFiles.cv && (
                        <div className="mt-2 flex items-center gap-2 text-sm text-green-400">
                          <CheckCircle size={14} /> {uploadedFiles.cv.name}
                        </div>
                      )}
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-300 mb-2">National ID Copy *</label>
                    <div className="relative">
                      <input
                        type="file"
                        accept=".pdf,.jpg,.jpeg,.png"
                        onChange={(e) => handleFileUpload(e, "nationalIdCopy")}
                        className="w-full px-4 py-3 border border-white/30 rounded-lg bg-white/10 text-white focus:outline-none focus:border-green-400 focus:bg-white/20 transition file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-green-500/20 file:text-green-400 hover:file:bg-green-500/30"
                      />
                      {uploadedFiles.nationalIdCopy && (
                        <div className="mt-2 flex items-center gap-2 text-sm text-green-400">
                          <CheckCircle size={14} /> {uploadedFiles.nationalIdCopy.name}
                        </div>
                      )}
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-300 mb-2">Certificates Upload *</label>
                    <div className="relative">
                      <input
                        type="file"
                        accept=".pdf,.jpg,.jpeg,.png"
                        onChange={(e) => handleFileUpload(e, "certificates")}
                        className="w-full px-4 py-3 border border-white/30 rounded-lg bg-white/10 text-white focus:outline-none focus:border-green-400 focus:bg-white/20 transition file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-green-500/20 file:text-green-400 hover:file:bg-green-500/30"
                      />
                      {uploadedFiles.certificates && (
                        <div className="mt-2 flex items-center gap-2 text-sm text-green-400">
                          <CheckCircle size={14} /> {uploadedFiles.certificates.name}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Step E: Additional Questions */}
            {currentStep === "questions" && (
              <div>
                <h2 className="text-2xl font-bold mb-6">E. Additional Questions</h2>
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-bold text-gray-300 mb-3">Are you available immediately? *</label>
                    <div className="flex gap-4">
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="radio"
                          name="availableImmediately"
                          value="yes"
                          checked={formData.availableImmediately === "yes"}
                          onChange={handleChange}
                          className="w-4 h-4 accent-green-500"
                        />
                        <span>Yes</span>
                      </label>
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="radio"
                          name="availableImmediately"
                          value="no"
                          checked={formData.availableImmediately === "no"}
                          onChange={handleChange}
                          className="w-4 h-4 accent-green-500"
                        />
                        <span>No</span>
                      </label>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-300 mb-3">Do you have references? *</label>
                    <div className="flex gap-4">
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="radio"
                          name="haveReferences"
                          value="yes"
                          checked={formData.haveReferences === "yes"}
                          onChange={handleChange}
                          className="w-4 h-4 accent-green-500"
                        />
                        <span>Yes</span>
                      </label>
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="radio"
                          name="haveReferences"
                          value="no"
                          checked={formData.haveReferences === "no"}
                          onChange={handleChange}
                          className="w-4 h-4 accent-green-500"
                        />
                        <span>No</span>
                      </label>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-300 mb-2">Why should we hire you? *</label>
                    <textarea
                      name="whyHireYou"
                      value={formData.whyHireYou}
                      onChange={handleChange}
                      placeholder="Tell us why you would be a great addition to our team"
                      rows={5}
                      className="w-full px-4 py-3 border border-white/30 rounded-lg bg-white/10 text-white focus:outline-none focus:border-green-400 focus:bg-white/20 transition resize-none"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Step F: Review */}
            {currentStep === "review" && (
              <div>
                <h2 className="text-2xl font-bold mb-6">F. Review & Submit</h2>
                <div className="space-y-6">
                  <div className="bg-white/5 rounded-xl p-6">
                    <h3 className="text-lg font-bold text-green-400 mb-4">Personal Information</h3>
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <span className="text-gray-400">Full Name:</span>
                      <span>{formData.fullName}</span>
                      <span className="text-gray-400">National ID:</span>
                      <span>{formData.nationalId}</span>
                      <span className="text-gray-400">Date of Birth:</span>
                      <span>{formData.dateOfBirth}</span>
                      <span className="text-gray-400">Gender:</span>
                      <span>{formData.gender}</span>
                      <span className="text-gray-400">Phone:</span>
                      <span>{formData.phoneNumber}</span>
                      <span className="text-gray-400">Email:</span>
                      <span>{formData.email || "Not provided"}</span>
                      <span className="text-gray-400">Address:</span>
                      <span>{formData.physicalAddress}</span>
                      <span className="text-gray-400">City:</span>
                      <span>{formData.city}</span>
                    </div>
                  </div>

                  <div className="bg-white/5 rounded-xl p-6">
                    <h3 className="text-lg font-bold text-green-400 mb-4">Education Information</h3>
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <span className="text-gray-400">Qualification:</span>
                      <span>{formData.highestQualification}</span>
                      <span className="text-gray-400">School:</span>
                      <span>{formData.school}</span>
                      <span className="text-gray-400">Field of Study:</span>
                      <span>{formData.fieldOfStudy}</span>
                      <span className="text-gray-400">Year Completed:</span>
                      <span>{formData.yearCompleted}</span>
                    </div>
                  </div>

                  <div className="bg-white/5 rounded-xl p-6">
                    <h3 className="text-lg font-bold text-green-400 mb-4">Work Experience</h3>
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <span className="text-gray-400">Previous Employer:</span>
                      <span>{formData.previousEmployer}</span>
                      <span className="text-gray-400">Position Held:</span>
                      <span>{formData.positionHeld}</span>
                      <span className="text-gray-400">Years of Experience:</span>
                      <span>{formData.yearsOfExperience}</span>
                      <span className="text-gray-400">Skills:</span>
                      <span className="col-span-2">{formData.skills}</span>
                    </div>
                  </div>

                  <div className="bg-white/5 rounded-xl p-6">
                    <h3 className="text-lg font-bold text-green-400 mb-4">Uploaded Documents</h3>
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center gap-2">
                        <CheckCircle size={14} className="text-green-400" />
                        <span>CV/Resume: {uploadedFiles.cv?.name || "Not uploaded"}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <CheckCircle size={14} className="text-green-400" />
                        <span>National ID: {uploadedFiles.nationalIdCopy?.name || "Not uploaded"}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <CheckCircle size={14} className="text-green-400" />
                        <span>Certificates: {uploadedFiles.certificates?.name || "Not uploaded"}</span>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white/5 rounded-xl p-6">
                    <h3 className="text-lg font-bold text-green-400 mb-4">Additional Questions</h3>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-400">Available immediately:</span>
                        <span>{formData.availableImmediately}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Have references:</span>
                        <span>{formData.haveReferences}</span>
                      </div>
                      <div>
                        <span className="text-gray-400">Why should we hire you:</span>
                        <p className="mt-1">{formData.whyHireYou}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Navigation Buttons */}
            <div className="flex justify-between mt-8 pt-6 border-t border-white/20">
              {currentStep !== "personal" && (
                <button
                  onClick={handleBack}
                  className="px-6 py-3 rounded-xl border border-white/30 text-white font-semibold hover:bg-white/10 transition flex items-center gap-2"
                >
                  <ArrowLeft size={18} /> Back
                </button>
              )}
              <div className="flex gap-4 ml-auto">
                {currentStep !== "review" && (
                  <button
                    onClick={handleSaveDraft}
                    className="px-6 py-3 rounded-xl border border-white/30 text-white font-semibold hover:bg-white/10 transition"
                  >
                    Save Draft
                  </button>
                )}
                {currentStep === "review" ? (
                  <button
                    onClick={handleSubmit}
                    className="px-6 py-3 rounded-xl bg-gradient-to-r from-green-500 to-green-600 text-white font-bold hover:from-green-400 hover:to-green-500 transition"
                  >
                    Submit Application
                  </button>
                ) : (
                  <button
                    onClick={handleNext}
                    className="px-6 py-3 rounded-xl bg-gradient-to-r from-green-500 to-green-600 text-white font-bold hover:from-green-400 hover:to-green-500 transition"
                  >
                    Next
                  </button>
                )}
              </div>
            </div>
          </div>

          <p className="text-center text-green-200/50 text-sm mt-8">
            MGPS · Mzinyathi Gardens Preparatory School · Zimbabwe
          </p>
        </div>
      </div>
    </main>
  );
}
