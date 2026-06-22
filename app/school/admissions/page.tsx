"use client";

import { useState } from "react";
import { uploadSchoolDocument, type SchoolAdmissionDocuments } from "@/lib/school-admission";

export default function AdmissionsPage() {
  const [currentStep, setCurrentStep] = useState(1);
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [applicationId, setApplicationId] = useState("");
  const totalSteps = 9;

  const [formData, setFormData] = useState({
    // Learner Details
    firstName: "",
    surname: "",
    dateOfBirth: "",
    gender: "",
    nationality: "",
    birthCertificateNumber: "",
    gradeApplyingFor: "",
    previousSchool: "",
    // Parent/Guardian
    parentFullName: "",
    relationship: "",
    nationalId: "",
    phoneNumber: "",
    alternativePhone: "",
    email: "",
    occupation: "",
    // Residential
    homeAddress: "",
    city: "",
    province: "",
    suburb: "",
    postalAddress: "",
    // Emergency
    emergencyName: "",
    emergencyRelationship: "",
    emergencyPhone: "",
    emergencyAltPhone: "",
    // Medical
    medicalConditions: "",
    allergies: "",
    disabilities: "",
    medication: "",
    doctorInfo: "",
    // Academic
    currentSchool: "",
    lastGrade: "",
    languages: "",
    talents: "",
    // Transport
    requiresTransport: "",
    pickupArea: "",
    // Declaration
    declaration: false,
    signature: "",
    // File uploads
    studentPhoto: null as File | null,
    recentResults: null as File | null,
    birthCertificate: null as File | null,
    previousSchoolReport: null as File | null,
    passportPhoto: null as File | null,
    parentIdCopy: null as File | null,
    proofOfResidence: null as File | null,
    transferLetter: null as File | null,
  });

  const handleNext = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === "checkbox" ? (e.target as HTMLInputElement).checked : value
    }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, files } = e.target;
    if (files && files[0]) {
      setFormData(prev => ({
        ...prev,
        [name]: files[0]
      }));
    }
  };

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    // Validate all required fields across all steps
    const requiredFields = {
      // Step 1: Learner Details
      firstName: formData.firstName,
      surname: formData.surname,
      dateOfBirth: formData.dateOfBirth,
      gender: formData.gender,
      nationality: formData.nationality,
      birthCertificateNumber: formData.birthCertificateNumber,
      gradeApplyingFor: formData.gradeApplyingFor,
      // Step 2: Parent/Guardian
      parentFullName: formData.parentFullName,
      relationship: formData.relationship,
      phoneNumber: formData.phoneNumber,
      // Step 3: Residential
      homeAddress: formData.homeAddress,
      city: formData.city,
      province: formData.province,
      suburb: formData.suburb,
      // Step 4: Emergency
      emergencyName: formData.emergencyName,
      emergencyRelationship: formData.emergencyRelationship,
      emergencyPhone: formData.emergencyPhone,
      // Step 6: Academic
      lastGrade: formData.lastGrade,
      // Step 9: Declaration
      declaration: formData.declaration,
      signature: formData.signature,
    };

    const emptyFields = Object.entries(requiredFields).filter(([key, value]) => {
      if (key === "declaration") return !value;
      if (typeof value !== "string") return false;
      return !value || value.trim() === "";
    });

    if (emptyFields.length > 0) {
      alert(
        `Please complete all required fields before submitting.\n\nMissing fields:\n${emptyFields.map(([key]) => key).join(", ")}`
      );
      return;
    }

    if (!formData.birthCertificate || !formData.parentIdCopy) {
      alert("Birth certificate and parent/guardian ID copies are required.");
      return;
    }

    setSubmitting(true);

    try {
      const documents: SchoolAdmissionDocuments = {};
      const fileEntries: [keyof SchoolAdmissionDocuments, File | null][] = [
        ["studentPhoto", formData.studentPhoto],
        ["recentResults", formData.recentResults],
        ["birthCertificate", formData.birthCertificate],
        ["previousReport", formData.previousSchoolReport],
        ["passportPhoto", formData.passportPhoto],
        ["parentId", formData.parentIdCopy],
        ["proofOfResidence", formData.proofOfResidence],
        ["transferLetter", formData.transferLetter],
      ];

      for (const [key, file] of fileEntries) {
        if (file) {
          documents[key] = await uploadSchoolDocument(file);
        }
      }

      const res = await fetch("/api/school/admissions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          source: "admissions_page",
          firstName: formData.firstName,
          surname: formData.surname,
          dateOfBirth: formData.dateOfBirth,
          gender: formData.gender,
          nationality: formData.nationality,
          birthCertNumber: formData.birthCertificateNumber,
          gradeApplying: formData.gradeApplyingFor,
          learnerPreviousSchool: formData.previousSchool || undefined,
          parentName: formData.parentFullName,
          parentRelationship: formData.relationship,
          parentNationalId: formData.nationalId || undefined,
          parentPhone: formData.phoneNumber,
          parentAltPhone: formData.alternativePhone || undefined,
          parentEmail: formData.email || undefined,
          parentOccupation: formData.occupation || undefined,
          homeAddress: formData.homeAddress,
          city: formData.city,
          province: formData.province,
          suburb: formData.suburb,
          postalAddress: formData.postalAddress || undefined,
          emergencyName: formData.emergencyName,
          emergencyRelationship: formData.emergencyRelationship,
          emergencyPhone: formData.emergencyPhone,
          emergencyAltPhone: formData.emergencyAltPhone || undefined,
          medicalConditions: formData.medicalConditions || undefined,
          allergies: formData.allergies || undefined,
          disabilities: formData.disabilities || undefined,
          medications: formData.medication || undefined,
          doctorInfo: formData.doctorInfo || undefined,
          currentSchool: formData.currentSchool || undefined,
          lastGradeCompleted: formData.lastGrade,
          languagesSpoken: formData.languages || undefined,
          talentsInterests: formData.talents || undefined,
          documents,
          requiresTransport: formData.requiresTransport || undefined,
          pickupArea: formData.pickupArea || undefined,
          informationConfirmed: true,
          parentSignature: formData.signature,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to submit application");
      }

      setApplicationId(data.trackingId);
      setSubmitted(true);
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (err) {
      alert(err instanceof Error ? err.message : "Failed to submit application");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-green-950 via-black to-green-900 text-white">

      {/* HERO SECTION */}

      <section className="relative h-[50vh] flex items-center justify-center">
        <div className="absolute inset-0 bg-gradient-to-r from-green-900/70 to-black/60 z-10" />
        <img
          src="/images/sa.jpg"
          alt="School Campus"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="relative z-20 text-center px-6">
          <h1 className="text-4xl md:text-6xl font-bold mb-4">
            2027 Student Admissions
          </h1>
          <p className="text-xl text-white/90 max-w-2xl mx-auto">
            Applications are now open for ECD to Grade 7 for our inaugural 2027 intake at Mzinyathi Gardens Primary School.
          </p>
        </div>
      </section>

      {/* FORM SECTION */}

      <section className="py-20">
        <div className="max-w-4xl mx-auto px-6">
          <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-8 shadow-2xl">

            <h2 className="text-3xl font-bold mb-3">
              Student Admission Form
            </h2>

            <p className="text-gray-300 mb-6">
              Step {currentStep} of {totalSteps} - Complete all required fields marked *
            </p>

            {/* Visual Step Indicator */}
            <div className="flex flex-wrap gap-2 mb-8">
              {[
                "Learner Details",
                "Parent/Guardian",
                "Residential",
                "Emergency",
                "Medical",
                "Academic",
                "Documents",
                "Transport",
                "Declaration"
              ].map((step, index) => (
                <div
                  key={index}
                  className={`px-3 py-2 rounded-lg text-xs font-medium transition-all ${
                    currentStep === index + 1
                      ? "bg-yellow-500 text-black"
                      : currentStep > index + 1
                      ? "bg-green-500/20 text-green-400 border border-green-400/30"
                      : "bg-white/10 text-gray-400"
                  }`}
                >
                  {index + 1}. {step}
                </div>
              ))}
            </div>

            {/* Progress Bar */}
            <div className="w-full h-2 bg-white/20 rounded-full mb-8">
              <div
                className="h-full bg-gradient-to-r from-yellow-500 to-yellow-600 rounded-full transition-all duration-300"
                style={{ width: `${(currentStep / totalSteps) * 100}%` }}
              />
            </div>

            {!submitted ? (
              <form onSubmit={handleSubmit}>

                {/* STEP 1: LEARNER DETAILS */}
                {currentStep === 1 && (
                  <div className="step-content">
                    <h3 className="section-title">
                      Step 1: Learner Details
                    </h3>

                    <div className="grid">
                      <input
                        required
                        name="firstName"
                        value={formData.firstName}
                        onChange={handleChange}
                        placeholder="First Name *"
                      />

                      <input
                        required
                        name="surname"
                        value={formData.surname}
                        onChange={handleChange}
                        placeholder="Surname *"
                      />

                      <input
                        required
                        name="dateOfBirth"
                        value={formData.dateOfBirth}
                        onChange={handleChange}
                        type="date"
                      />

                      <select required name="gender" value={formData.gender} onChange={handleChange}>
                        <option value="">Gender *</option>
                        <option>Male</option>
                        <option>Female</option>
                      </select>

                      <input
                        required
                        name="nationality"
                        value={formData.nationality}
                        onChange={handleChange}
                        placeholder="Nationality *"
                      />

                      <input
                        required
                        name="birthCertificateNumber"
                        value={formData.birthCertificateNumber}
                        onChange={handleChange}
                        placeholder="Birth Certificate Number *"
                      />

                      <select required name="gradeApplyingFor" value={formData.gradeApplyingFor} onChange={handleChange}>
                        <option value="">Grade Applying For *</option>
                        <option>ECD A</option>
                        <option>ECD B</option>
                        <option>Grade 1</option>
                        <option>Grade 2</option>
                        <option>Grade 3</option>
                        <option>Grade 4</option>
                        <option>Grade 5</option>
                        <option>Grade 6</option>
                        <option>Grade 7</option>
                      </select>

                      <input
                        name="previousSchool"
                        value={formData.previousSchool}
                        onChange={handleChange}
                        placeholder="Previous School"
                      />
                    </div>

                    <label className="upload-label">
                      Student Photo
                      <input
                        type="file"
                        name="studentPhoto"
                        onChange={handleFileChange}
                      />
                      {formData.studentPhoto && (
                        <div className="mt-2 text-sm text-green-400">
                          ✓ {formData.studentPhoto.name}
                        </div>
                      )}
                    </label>

                    <div className="navigation-buttons">
                      <button
                        type="button"
                        className="nav-btn next-btn"
                        onClick={handleNext}
                      >
                        Next →
                      </button>
                    </div>
                  </div>
                )}

                {/* STEP 2: PARENT / GUARDIAN INFORMATION */}
                {currentStep === 2 && (
                  <div className="step-content">
                    <h3 className="section-title">
                      Step 2: Parent / Guardian Information
                    </h3>

                    <div className="grid">
                      <input
                        required
                        name="parentFullName"
                        value={formData.parentFullName}
                        onChange={handleChange}
                        placeholder="Full Name *"
                      />

                      <input
                        required
                        name="relationship"
                        value={formData.relationship}
                        onChange={handleChange}
                        placeholder="Relationship to Child *"
                      />

                      <input
                        name="nationalId"
                        value={formData.nationalId}
                        onChange={handleChange}
                        placeholder="National ID Number"
                      />

                      <input
                        required
                        name="phoneNumber"
                        value={formData.phoneNumber}
                        onChange={handleChange}
                        placeholder="Phone Number *"
                      />

                      <input
                        name="alternativePhone"
                        value={formData.alternativePhone}
                        onChange={handleChange}
                        placeholder="Alternative Phone Number"
                      />

                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="Email Address"
                      />

                      <input
                        name="occupation"
                        value={formData.occupation}
                        onChange={handleChange}
                        placeholder="Occupation"
                      />
                    </div>

                    <div className="navigation-buttons">
                      <button
                        type="button"
                        className="nav-btn back-btn"
                        onClick={handleBack}
                      >
                        ← Back
                      </button>
                      <button
                        type="button"
                        className="nav-btn next-btn"
                        onClick={handleNext}
                      >
                        Next →
                      </button>
                    </div>
                  </div>
                )}

                {/* STEP 3: RESIDENTIAL INFORMATION */}
                {currentStep === 3 && (
                  <div className="step-content">
                    <h3 className="section-title">
                      Step 3: Residential Information
                    </h3>

                    <div className="grid">
                      <input
                        required
                        name="homeAddress"
                        value={formData.homeAddress}
                        onChange={handleChange}
                        placeholder="Home Address *"
                      />

                      <input
                        required
                        name="city"
                        value={formData.city}
                        onChange={handleChange}
                        placeholder="City / Town *"
                      />

                      <input
                        required
                        name="province"
                        value={formData.province}
                        onChange={handleChange}
                        placeholder="Province *"
                      />

                      <input
                        required
                        name="suburb"
                        value={formData.suburb}
                        onChange={handleChange}
                        placeholder="Residential Area / Suburb *"
                      />

                      <input
                        name="postalAddress"
                        value={formData.postalAddress}
                        onChange={handleChange}
                        placeholder="Postal Address"
                      />
                    </div>

                    <div className="navigation-buttons">
                      <button
                        type="button"
                        className="nav-btn back-btn"
                        onClick={handleBack}
                      >
                        ← Back
                      </button>
                      <button
                        type="button"
                        className="nav-btn next-btn"
                        onClick={handleNext}
                      >
                        Next →
                      </button>
                    </div>
                  </div>
                )}

                {/* STEP 4: EMERGENCY CONTACT */}
                {currentStep === 4 && (
                  <div className="step-content">
                    <h3 className="section-title">
                      Step 4: Emergency Contact Information
                    </h3>

                    <div className="grid">
                      <input
                        required
                        name="emergencyName"
                        value={formData.emergencyName}
                        onChange={handleChange}
                        placeholder="Emergency Contact Name *"
                      />

                      <input
                        required
                        name="emergencyRelationship"
                        value={formData.emergencyRelationship}
                        onChange={handleChange}
                        placeholder="Relationship to Child *"
                      />

                      <input
                        required
                        name="emergencyPhone"
                        value={formData.emergencyPhone}
                        onChange={handleChange}
                        placeholder="Emergency Contact Number *"
                      />

                      <input
                        name="emergencyAltPhone"
                        value={formData.emergencyAltPhone}
                        onChange={handleChange}
                        placeholder="Alternative Emergency Number"
                      />
                    </div>

                    <div className="navigation-buttons">
                      <button
                        type="button"
                        className="nav-btn back-btn"
                        onClick={handleBack}
                      >
                        ← Back
                      </button>
                      <button
                        type="button"
                        className="nav-btn next-btn"
                        onClick={handleNext}
                      >
                        Next →
                      </button>
                    </div>
                  </div>
                )}

                {/* STEP 5: MEDICAL INFORMATION */}
                {currentStep === 5 && (
                  <div className="step-content">
                    <h3 className="section-title">
                      Step 5: Medical Information
                    </h3>

                    <textarea
                      name="medicalConditions"
                      value={formData.medicalConditions}
                      onChange={handleChange}
                      placeholder="Medical Conditions"
                    />

                    <textarea
                      name="allergies"
                      value={formData.allergies}
                      onChange={handleChange}
                      placeholder="Allergies"
                    />

                    <textarea
                      name="disabilities"
                      value={formData.disabilities}
                      onChange={handleChange}
                      placeholder="Disabilities / Special Needs"
                    />

                    <textarea
                      name="medication"
                      value={formData.medication}
                      onChange={handleChange}
                      placeholder="Current Medication"
                    />

                    <textarea
                      name="doctorInfo"
                      value={formData.doctorInfo}
                      onChange={handleChange}
                      placeholder="Doctor / Hospital Information"
                    />

                    <div className="navigation-buttons">
                      <button
                        type="button"
                        className="nav-btn back-btn"
                        onClick={handleBack}
                      >
                        ← Back
                      </button>
                      <button
                        type="button"
                        className="nav-btn next-btn"
                        onClick={handleNext}
                      >
                        Next →
                      </button>
                    </div>
                  </div>
                )}

                {/* STEP 6: ACADEMIC INFORMATION */}
                {currentStep === 6 && (
                  <div className="step-content">
                    <h3 className="section-title">
                      Step 6: Academic Information
                    </h3>

                    <div className="grid">
                      <input
                        name="currentSchool"
                        value={formData.currentSchool}
                        onChange={handleChange}
                        placeholder="Current School"
                      />

                      <input
                        required
                        name="lastGrade"
                        value={formData.lastGrade}
                        onChange={handleChange}
                        placeholder="Last Grade Completed *"
                      />

                      <input
                        name="languages"
                        value={formData.languages}
                        onChange={handleChange}
                        placeholder="Languages Spoken"
                      />

                      <input
                        name="talents"
                        value={formData.talents}
                        onChange={handleChange}
                        placeholder="Talents / Interests"
                      />
                    </div>

                    <label className="upload-label">
                      Recent Results Upload
                      <input
                        type="file"
                        name="recentResults"
                        onChange={handleFileChange}
                      />
                      {formData.recentResults && (
                        <div className="mt-2 text-sm text-green-400">
                          ✓ {formData.recentResults.name}
                        </div>
                      )}
                    </label>

                    <div className="navigation-buttons">
                      <button
                        type="button"
                        className="nav-btn back-btn"
                        onClick={handleBack}
                      >
                        ← Back
                      </button>
                      <button
                        type="button"
                        className="nav-btn next-btn"
                        onClick={handleNext}
                      >
                        Next →
                      </button>
                    </div>
                  </div>
                )}

                {/* STEP 7: DOCUMENT UPLOADS */}
                {currentStep === 7 && (
                  <div className="step-content">
                    <h3 className="section-title">
                      Step 7: Required Documents
                    </h3>

                    <div className="document-grid">
                      <div className="document-card">
                        <label>Birth Certificate Copy *</label>
                        <input
                          required
                          type="file"
                          name="birthCertificate"
                          accept=".pdf,.jpg,.jpeg,.png"
                          onChange={handleFileChange}
                        />
                        {formData.birthCertificate && (
                          <div className="mt-2 text-sm text-green-400">
                            ✓ {formData.birthCertificate.name}
                          </div>
                        )}
                      </div>

                      <div className="document-card">
                        <label>Previous School Report</label>
                        <input
                          type="file"
                          name="previousSchoolReport"
                          accept=".pdf,.jpg,.jpeg,.png"
                          onChange={handleFileChange}
                        />
                        {formData.previousSchoolReport && (
                          <div className="mt-2 text-sm text-green-400">
                            ✓ {formData.previousSchoolReport.name}
                          </div>
                        )}
                      </div>

                      <div className="document-card">
                        <label>Passport Photo</label>
                        <input
                          type="file"
                          name="passportPhoto"
                          accept=".jpg,.jpeg,.png"
                          onChange={handleFileChange}
                        />
                        {formData.passportPhoto && (
                          <div className="mt-2 text-sm text-green-400">
                            ✓ {formData.passportPhoto.name}
                          </div>
                        )}
                      </div>

                      <div className="document-card">
                        <label>Parent / Guardian ID Copy *</label>
                        <input
                          required
                          type="file"
                          name="parentIdCopy"
                          accept=".pdf,.jpg,.jpeg,.png"
                          onChange={handleFileChange}
                        />
                        {formData.parentIdCopy && (
                          <div className="mt-2 text-sm text-green-400">
                            ✓ {formData.parentIdCopy.name}
                          </div>
                        )}
                      </div>

                      <div className="document-card">
                        <label>Proof of Residence</label>
                        <input
                          type="file"
                          name="proofOfResidence"
                          accept=".pdf,.jpg,.jpeg,.png"
                          onChange={handleFileChange}
                        />
                        {formData.proofOfResidence && (
                          <div className="mt-2 text-sm text-green-400">
                            ✓ {formData.proofOfResidence.name}
                          </div>
                        )}
                      </div>

                      <div className="document-card">
                        <label>Transfer Letter</label>
                        <input
                          type="file"
                          name="transferLetter"
                          accept=".pdf,.jpg,.jpeg,.png"
                          onChange={handleFileChange}
                        />
                        {formData.transferLetter && (
                          <div className="mt-2 text-sm text-green-400">
                            ✓ {formData.transferLetter.name}
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="navigation-buttons">
                      <button
                        type="button"
                        className="nav-btn back-btn"
                        onClick={handleBack}
                      >
                        ← Back
                      </button>
                      <button
                        type="button"
                        className="nav-btn next-btn"
                        onClick={handleNext}
                      >
                        Next →
                      </button>
                    </div>
                  </div>
                )}

                {/* STEP 8: TRANSPORT */}
                {currentStep === 8 && (
                  <div className="step-content">
                    <h3 className="section-title">
                      Step 8: Transport Information
                    </h3>

                    <div className="grid">
                      <select name="requiresTransport" value={formData.requiresTransport} onChange={handleChange}>
                        <option value="">Requires School Transport?</option>
                        <option>Yes</option>
                        <option>No</option>
                      </select>

                      <input
                        name="pickupArea"
                        value={formData.pickupArea}
                        onChange={handleChange}
                        placeholder="Pickup Area"
                      />
                    </div>

                    <div className="navigation-buttons">
                      <button
                        type="button"
                        className="nav-btn back-btn"
                        onClick={handleBack}
                      >
                        ← Back
                      </button>
                      <button
                        type="button"
                        className="nav-btn next-btn"
                        onClick={handleNext}
                      >
                        Next →
                      </button>
                    </div>
                  </div>
                )}

                {/* STEP 9: DECLARATION */}
                {currentStep === 9 && (
                  <div className="step-content">
                    <h3 className="section-title">
                      Step 9: Declaration & Confirmation
                    </h3>

                    <div className="declaration-box">
                      <label className="checkbox-row">
                        <input
                          required
                          name="declaration"
                          type="checkbox"
                          checked={formData.declaration}
                          onChange={handleChange}
                        />
                        <span>
                          I certify that the information provided is true and correct.
                        </span>
                      </label>

                      <input
                        required
                        name="signature"
                        value={formData.signature}
                        onChange={handleChange}
                        placeholder="Parent / Guardian Signature *"
                      />
                    </div>

                    <div className="application-info">
                      <h4>Admission Process</h4>
                      <ol>
                        <li>Complete the application form.</li>
                        <li>Upload required documents.</li>
                        <li>Submit application.</li>
                        <li>Admissions Office reviews application.</li>
                        <li>Parent/Guardian is contacted.</li>
                        <li>Successful applicants receive an offer letter.</li>
                      </ol>
                    </div>

                    <div className="navigation-buttons">
                      <button
                        type="button"
                        className="nav-btn back-btn"
                        onClick={handleBack}
                      >
                        ← Back
                      </button>
                      <button
                        type="submit"
                        className="nav-btn submit-btn"
                        disabled={submitting}
                      >
                        {submitting ? "Submitting..." : "Submit Application"}
                      </button>
                    </div>

                    <div className="submit-section">
                      <p>Admissions for the 2027 Academic Year</p>
                      <p>All applications are reviewed by the Admissions Office.</p>
                      <strong>admissions@mzinyathigardens.co.zw</strong>
                    </div>
                  </div>
                )}

              </form>

            ) : (

              <div className="text-center py-12">
                <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-green-500/20 border border-green-400/30 mb-8">
                  <svg className="w-12 h-12 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <h2 className="text-3xl font-bold mb-4">Application Submitted Successfully</h2>
                <p className="text-gray-300 mb-6">Thank you for applying to Mzinyathi Gardens Primary School.</p>
                <div className="bg-white/10 rounded-2xl p-8 mb-8">
                  <p className="text-lg mb-2">Application Number:</p>
                  <p className="text-3xl font-bold text-yellow-400 mb-4">{applicationId}</p>
                  <p className="text-sm text-gray-400">Please save this number for tracking your application status.</p>
                </div>
                <a
                  href="/school/pathway"
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-green-500 text-white font-semibold hover:bg-green-400 transition-colors"
                >
                  Back to Portal
                </a>
              </div>

            )}

          </div>
        </div>
      </section>

      <style jsx>{`

        .step-content{
          animation:fadeIn 0.3s ease;
        }

        @keyframes fadeIn{
          from{opacity:0;transform:translateY(10px);}
          to{opacity:1;transform:translateY(0);}
        }

        .section-title{
          color:#fff;
          margin-top:20px;
          margin-bottom:20px;
          font-size:1.3rem;
          font-weight:700;
        }

        .grid{
          display:grid;
          grid-template-columns:repeat(auto-fit,minmax(250px,1fr));
          gap:15px;
          margin-bottom:20px;
        }

        input,
        select,
        textarea{
          width:100%;
          padding:14px;
          border:1px solid rgba(255,255,255,0.3);
          border-radius:8px;
          font-size:15px;
          background:rgba(255,255,255,0.1);
          color:#fff;
          outline:none;
          transition:all 0.3s;
        }

        input:focus,
        select:focus,
        textarea:focus{
          border-color:#eab308;
          background:rgba(255,255,255,0.2);
        }

        input::placeholder,
        textarea::placeholder{
          color:rgba(255,255,255,0.5);
          opacity:1;
        }

        select option{
          background:#1a1a1a;
          color:#fff;
        }

        textarea{
          min-height:100px;
          margin-bottom:15px;
        }

        .upload-label{
          display:block;
          margin-bottom:20px;
          color:rgba(255,255,255,0.8);
          font-weight:600;
        }

        .document-grid{
          display:grid;
          grid-template-columns:
          repeat(auto-fit,minmax(280px,1fr));
          gap:20px;
        }

        .document-card{
          background:rgba(255,255,255,0.05);
          padding:18px;
          border-radius:12px;
          border:1px solid rgba(255,255,255,0.1);
        }

        .document-card label{
          display:block;
          margin-bottom:10px;
          font-weight:600;
          color:rgba(255,255,255,0.8);
        }

        .declaration-box{
          background:rgba(255,255,255,0.05);
          padding:25px;
          border-radius:12px;
          margin-bottom:20px;
        }

        .declaration-box input::placeholder{
          color:rgba(255,255,255,0.5);
          opacity:1;
        }

        .checkbox-row{
          display:flex;
          gap:12px;
          margin-bottom:20px;
          align-items:flex-start;
        }

        .checkbox-row input{
          width:auto;
        }

        .application-info{
          margin-bottom:30px;
          background:rgba(255,255,255,0.05);
          border-left:5px solid #eab308;
          padding:25px;
          border-radius:10px;
        }

        .application-info h4{
          margin-bottom:15px;
          color:#eab308;
        }

        .application-info ol{
          padding-left:20px;
          line-height:1.9;
          color:rgba(255,255,255,0.8);
        }

        .navigation-buttons{
          display:flex;
          justify-content:space-between;
          gap:15px;
          margin-top:30px;
          padding-top:20px;
          border-top:1px solid rgba(255,255,255,0.2);
        }

        .nav-btn{
          padding:12px 30px;
          border-radius:8px;
          font-size:15px;
          font-weight:600;
          cursor:pointer;
          transition:all 0.3s;
        }

        .back-btn{
          background:transparent;
          border:1px solid rgba(255,255,255,0.3);
          color:#fff;
        }

        .back-btn:hover{
          background:rgba(255,255,255,0.1);
        }

        .next-btn{
          background:linear-gradient(to right,#22c55e,#16a34a);
          border:none;
          color:#fff;
        }

        .next-btn:hover{
          background:linear-gradient(to right,#4ade80,#22c55e);
        }

        .submit-btn{
          background:linear-gradient(to right,#eab308,#ca8a04);
          border:none;
          color:#000;
        }

        .submit-btn:hover{
          background:linear-gradient(to right,#facc15,#eab308);
        }

        .submit-section{
          text-align:center;
          margin-top:30px;
          padding-top:20px;
          border-top:1px solid rgba(255,255,255,0.2);
        }

        .submit-section p{
          margin-top:10px;
          color:rgba(255,255,255,0.8);
        }

        .submit-section strong{
          color:#eab308;
        }

        @media(max-width:768px){

          .navigation-buttons{
            flex-direction:column-reverse;
          }

          .nav-btn{
            width:100%;
          }

        }

      `}</style>

    </main>
  );
}