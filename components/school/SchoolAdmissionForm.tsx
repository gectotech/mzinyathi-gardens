'use client';

import { useState } from 'react';
import './school-admission-form.css';
import {
  initialSchoolAdmissionForm,
  uploadSchoolDocument,
  type SchoolAdmissionDocuments,
  type SchoolAdmissionFormState,
} from '@/lib/school-admission';

type SchoolAdmissionFormProps = {
  source?: 'admissions_page' | 'contact_page';
  onSuccess: (trackingId: string) => void;
  submitLabel?: string;
  className?: string;
};

type FileFields = {
  studentPhoto: File | null;
  birthCertificate: File | null;
  previousReport: File | null;
  passportPhoto: File | null;
  parentId: File | null;
  proofOfResidence: File | null;
  transferLetter: File | null;
  recentResults: File | null;
};

const emptyFiles: FileFields = {
  studentPhoto: null,
  birthCertificate: null,
  previousReport: null,
  passportPhoto: null,
  parentId: null,
  proofOfResidence: null,
  transferLetter: null,
  recentResults: null,
};

export default function SchoolAdmissionForm({
  source = 'admissions_page',
  onSuccess,
  submitLabel = 'Submit Application',
  className = '',
}: SchoolAdmissionFormProps) {
  const [form, setForm] = useState<SchoolAdmissionFormState>(initialSchoolAdmissionForm);
  const [files, setFiles] = useState<FileFields>(emptyFiles);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const update = <K extends keyof SchoolAdmissionFormState>(key: K, value: SchoolAdmissionFormState[K]) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const setFile = (key: keyof FileFields, file: File | null) => {
    setFiles((prev) => ({ ...prev, [key]: file }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);

    try {
      if (!files.birthCertificate || !files.parentId) {
        throw new Error('Birth certificate and parent/guardian ID copies are required.');
      }

      const documents: SchoolAdmissionDocuments = {};
      const uploads: [keyof FileFields, File][] = Object.entries(files).filter(
        (entry): entry is [keyof FileFields, File] => entry[1] instanceof File
      );

      for (const [key, file] of uploads) {
        documents[key] = await uploadSchoolDocument(file);
      }

      const payload = {
        ...form,
        source,
        parentEmail: form.parentEmail || undefined,
        documents,
        informationConfirmed: true as const,
      };

      const res = await fetch('/api/school/admissions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to submit application');
      }

      onSuccess(data.trackingId);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Submission failed');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className={`school-admission-form ${className}`.trim()}>
      {error && (
        <div className="mb-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      <h3 className="section-title">Learner Details</h3>
      <div className="grid">
        <input required placeholder="First Name *" value={form.firstName} onChange={(e) => update('firstName', e.target.value)} />
        <input required placeholder="Surname *" value={form.surname} onChange={(e) => update('surname', e.target.value)} />
        <input required type="date" value={form.dateOfBirth} onChange={(e) => update('dateOfBirth', e.target.value)} />
        <select required value={form.gender} onChange={(e) => update('gender', e.target.value)}>
          <option value="">Gender *</option>
          <option>Male</option>
          <option>Female</option>
        </select>
        <input required placeholder="Nationality *" value={form.nationality} onChange={(e) => update('nationality', e.target.value)} />
        <input required placeholder="Birth Certificate Number *" value={form.birthCertNumber} onChange={(e) => update('birthCertNumber', e.target.value)} />
        <select required value={form.gradeApplying} onChange={(e) => update('gradeApplying', e.target.value)}>
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
        <input placeholder="Previous School" value={form.learnerPreviousSchool} onChange={(e) => update('learnerPreviousSchool', e.target.value)} />
      </div>

      <label className="upload-label">
        Student Photo
        <input type="file" accept=".jpg,.jpeg,.png" onChange={(e) => setFile('studentPhoto', e.target.files?.[0] || null)} />
      </label>

      <h3 className="section-title">Parent / Guardian Information</h3>
      <div className="grid">
        <input required placeholder="Full Name *" value={form.parentName} onChange={(e) => update('parentName', e.target.value)} />
        <input required placeholder="Relationship to Child *" value={form.parentRelationship} onChange={(e) => update('parentRelationship', e.target.value)} />
        <input placeholder="National ID Number" value={form.parentNationalId} onChange={(e) => update('parentNationalId', e.target.value)} />
        <input required placeholder="Phone Number *" value={form.parentPhone} onChange={(e) => update('parentPhone', e.target.value)} />
        <input placeholder="Alternative Phone Number" value={form.parentAltPhone} onChange={(e) => update('parentAltPhone', e.target.value)} />
        <input type="email" placeholder="Email Address" value={form.parentEmail} onChange={(e) => update('parentEmail', e.target.value)} />
        <input placeholder="Occupation" value={form.parentOccupation} onChange={(e) => update('parentOccupation', e.target.value)} />
      </div>

      <h3 className="section-title">Residential Information</h3>
      <div className="grid">
        <input required placeholder="Home Address *" value={form.homeAddress} onChange={(e) => update('homeAddress', e.target.value)} />
        <input required placeholder="City / Town *" value={form.city} onChange={(e) => update('city', e.target.value)} />
        <input required placeholder="Province *" value={form.province} onChange={(e) => update('province', e.target.value)} />
        <input required placeholder="Residential Area / Suburb *" value={form.suburb} onChange={(e) => update('suburb', e.target.value)} />
        <input placeholder="Postal Address" value={form.postalAddress} onChange={(e) => update('postalAddress', e.target.value)} />
      </div>

      <h3 className="section-title">Emergency Contact Information</h3>
      <div className="grid">
        <input required placeholder="Emergency Contact Name *" value={form.emergencyName} onChange={(e) => update('emergencyName', e.target.value)} />
        <input required placeholder="Relationship to Child *" value={form.emergencyRelationship} onChange={(e) => update('emergencyRelationship', e.target.value)} />
        <input required placeholder="Emergency Contact Number *" value={form.emergencyPhone} onChange={(e) => update('emergencyPhone', e.target.value)} />
        <input placeholder="Alternative Emergency Number" value={form.emergencyAltPhone} onChange={(e) => update('emergencyAltPhone', e.target.value)} />
      </div>

      <h3 className="section-title">Medical Information</h3>
      <textarea placeholder="Medical Conditions" value={form.medicalConditions} onChange={(e) => update('medicalConditions', e.target.value)} />
      <textarea placeholder="Allergies" value={form.allergies} onChange={(e) => update('allergies', e.target.value)} />
      <textarea placeholder="Disabilities / Special Needs" value={form.disabilities} onChange={(e) => update('disabilities', e.target.value)} />
      <textarea placeholder="Current Medication" value={form.medications} onChange={(e) => update('medications', e.target.value)} />
      <textarea placeholder="Doctor / Hospital Information" value={form.doctorInfo} onChange={(e) => update('doctorInfo', e.target.value)} />

      <h3 className="section-title">Academic Information</h3>
      <div className="grid">
        <input placeholder="Current School" value={form.currentSchool} onChange={(e) => update('currentSchool', e.target.value)} />
        <input required placeholder="Last Grade Completed *" value={form.lastGradeCompleted} onChange={(e) => update('lastGradeCompleted', e.target.value)} />
        <input placeholder="Languages Spoken" value={form.languagesSpoken} onChange={(e) => update('languagesSpoken', e.target.value)} />
        <input placeholder="Talents / Interests" value={form.talentsInterests} onChange={(e) => update('talentsInterests', e.target.value)} />
      </div>

      <label className="upload-label">
        Recent Results Upload
        <input type="file" accept=".pdf,.jpg,.jpeg,.png" onChange={(e) => setFile('recentResults', e.target.files?.[0] || null)} />
      </label>

      <h3 className="section-title">Required Documents</h3>
      <div className="document-grid">
        <div className="document-card">
          <label>Birth Certificate Copy *</label>
          <input required type="file" accept=".pdf,.jpg,.jpeg,.png" onChange={(e) => setFile('birthCertificate', e.target.files?.[0] || null)} />
        </div>
        <div className="document-card">
          <label>Previous School Report</label>
          <input type="file" accept=".pdf,.jpg,.jpeg,.png" onChange={(e) => setFile('previousReport', e.target.files?.[0] || null)} />
        </div>
        <div className="document-card">
          <label>Passport Photo</label>
          <input type="file" accept=".jpg,.jpeg,.png" onChange={(e) => setFile('passportPhoto', e.target.files?.[0] || null)} />
        </div>
        <div className="document-card">
          <label>Parent / Guardian ID Copy *</label>
          <input required type="file" accept=".pdf,.jpg,.jpeg,.png" onChange={(e) => setFile('parentId', e.target.files?.[0] || null)} />
        </div>
        <div className="document-card">
          <label>Proof of Residence</label>
          <input type="file" accept=".pdf,.jpg,.jpeg,.png" onChange={(e) => setFile('proofOfResidence', e.target.files?.[0] || null)} />
        </div>
        <div className="document-card">
          <label>Transfer Letter</label>
          <input type="file" accept=".pdf,.jpg,.jpeg,.png" onChange={(e) => setFile('transferLetter', e.target.files?.[0] || null)} />
        </div>
      </div>

      <h3 className="section-title">Transport Information</h3>
      <div className="grid">
        <select value={form.requiresTransport} onChange={(e) => update('requiresTransport', e.target.value)}>
          <option value="">Requires School Transport?</option>
          <option>Yes</option>
          <option>No</option>
        </select>
        <input placeholder="Pickup Area" value={form.pickupArea} onChange={(e) => update('pickupArea', e.target.value)} />
      </div>

      <h3 className="section-title">Declaration & Confirmation</h3>
      <div className="declaration-box">
        <label className="checkbox-row">
          <input
            required
            type="checkbox"
            checked={form.informationConfirmed}
            onChange={(e) => update('informationConfirmed', e.target.checked)}
          />
          <span>I certify that the information provided is true and correct.</span>
        </label>
        <input
          required
          placeholder="Parent / Guardian Signature *"
          value={form.parentSignature}
          onChange={(e) => update('parentSignature', e.target.value)}
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

      <div className="submit-section">
        <button type="submit" className="submit-btn" disabled={submitting}>
          {submitting ? 'Submitting...' : submitLabel}
        </button>
        <p>Admissions for the 2027 Academic Year</p>
        <p>All applications are reviewed by the Admissions Office.</p>
        <strong>admissions@mzinyathigardens.co.zw</strong>
      </div>
    </form>
  );
}
