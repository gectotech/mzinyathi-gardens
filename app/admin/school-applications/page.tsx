'use client';

import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import ExportPanel from '@/components/admin/ExportPanel';
import type { SchoolAdmissionDocuments } from '@/lib/school-admission';

type SchoolApplication = {
  id: string;
  trackingId: string;
  firstName: string;
  surname: string;
  gradeApplying: string;
  parentName: string;
  parentPhone: string;
  parentEmail: string | null;
  status: string;
  source: string;
  createdAt: string;
  dateOfBirth: string;
  gender: string;
  nationality: string;
  birthCertNumber: string;
  learnerPreviousSchool: string | null;
  parentRelationship: string;
  parentNationalId: string | null;
  parentAltPhone: string | null;
  parentOccupation: string | null;
  homeAddress: string;
  city: string;
  province: string;
  suburb: string;
  postalAddress: string | null;
  emergencyName: string;
  emergencyRelationship: string;
  emergencyPhone: string;
  emergencyAltPhone: string | null;
  medicalConditions: string | null;
  allergies: string | null;
  disabilities: string | null;
  medications: string | null;
  doctorInfo: string | null;
  currentSchool: string | null;
  lastGradeCompleted: string;
  languagesSpoken: string | null;
  talentsInterests: string | null;
  documents: SchoolAdmissionDocuments | null;
  requiresTransport: string | null;
  pickupArea: string | null;
  parentSignature: string;
};

const documentLabels: Record<keyof SchoolAdmissionDocuments, string> = {
  studentPhoto: 'Student Photo',
  birthCertificate: 'Birth Certificate',
  previousReport: 'Previous School Report',
  passportPhoto: 'Passport Photo',
  parentId: 'Parent / Guardian ID',
  proofOfResidence: 'Proof of Residence',
  transferLetter: 'Transfer Letter',
  recentResults: 'Recent Results',
};

export default function AdminSchoolApplicationsPage() {
  const [applications, setApplications] = useState<SchoolApplication[]>([]);
  const [selected, setSelected] = useState<SchoolApplication | null>(null);

  const load = () => {
    fetch('/api/admin/school-applications')
      .then((r) => r.json())
      .then((d) => setApplications(d.applications || []));
  };

  useEffect(load, []);

  const updateStatus = async (id: string, status: string) => {
    const res = await fetch('/api/admin/school-applications', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, status }),
    });
    if (res.ok) {
      toast.success('Status updated');
      load();
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">School Admissions</h1>
        <p className="text-gray-600">Student applications for the 2027 intake</p>
      </div>

      <ExportPanel endpoint="/api/admin/school-applications" filename="school-applications.csv" />

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="min-w-full text-sm">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-3 text-left">Learner</th>
              <th className="px-4 py-3 text-left">Grade</th>
              <th className="px-4 py-3 text-left">Parent</th>
              <th className="px-4 py-3 text-left">Tracking ID</th>
              <th className="px-4 py-3 text-left">Status</th>
              <th className="px-4 py-3 text-left">Date</th>
              <th className="px-4 py-3 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {applications.length === 0 ? (
              <tr>
                <td colSpan={7} className="px-4 py-8 text-center text-gray-500">
                  No school applications yet
                </td>
              </tr>
            ) : (
              applications.map((app) => (
                <tr key={app.id} className="border-t">
                  <td className="px-4 py-3">
                    {app.firstName} {app.surname}
                  </td>
                  <td className="px-4 py-3">{app.gradeApplying}</td>
                  <td className="px-4 py-3">{app.parentName}</td>
                  <td className="px-4 py-3 font-mono text-xs">{app.trackingId}</td>
                  <td className="px-4 py-3">
                    <select
                      value={app.status}
                      onChange={(e) => updateStatus(app.id, e.target.value)}
                      className="border rounded p-1"
                    >
                      <option value="submitted">Submitted</option>
                      <option value="under_review">Under Review</option>
                      <option value="accepted">Accepted</option>
                      <option value="waitlisted">Waitlisted</option>
                      <option value="rejected">Rejected</option>
                    </select>
                  </td>
                  <td className="px-4 py-3">{new Date(app.createdAt).toLocaleDateString()}</td>
                  <td className="px-4 py-3">
                    <button
                      onClick={() => setSelected(app)}
                      className="text-[#4169E1] hover:underline"
                    >
                      View
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {selected && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-3xl w-full p-6 max-h-[85vh] overflow-y-auto">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h2 className="text-xl font-bold">
                  {selected.firstName} {selected.surname}
                </h2>
                <p className="text-sm text-gray-500 font-mono">{selected.trackingId}</p>
              </div>
              <button onClick={() => setSelected(null)} className="text-gray-500 text-2xl">
                ×
              </button>
            </div>

            <div className="grid sm:grid-cols-2 gap-3 text-sm">
              <p>
                <strong>Grade:</strong> {selected.gradeApplying}
              </p>
              <p>
                <strong>DOB:</strong> {selected.dateOfBirth}
              </p>
              <p>
                <strong>Gender:</strong> {selected.gender}
              </p>
              <p>
                <strong>Nationality:</strong> {selected.nationality}
              </p>
              <p>
                <strong>Birth Cert #:</strong> {selected.birthCertNumber}
              </p>
              <p>
                <strong>Source:</strong> {selected.source}
              </p>
              <p>
                <strong>Parent:</strong> {selected.parentName} ({selected.parentRelationship})
              </p>
              <p>
                <strong>Parent Phone:</strong> {selected.parentPhone}
              </p>
              <p>
                <strong>Parent Email:</strong> {selected.parentEmail || '—'}
              </p>
              <p>
                <strong>Address:</strong> {selected.homeAddress}, {selected.suburb}, {selected.city}
              </p>
              <p>
                <strong>Emergency:</strong> {selected.emergencyName} — {selected.emergencyPhone}
              </p>
              <p>
                <strong>Transport:</strong> {selected.requiresTransport || '—'}
              </p>
              <p>
                <strong>Signature:</strong> {selected.parentSignature}
              </p>
            </div>

            {(selected.medicalConditions ||
              selected.allergies ||
              selected.disabilities ||
              selected.medications) && (
              <div className="mt-4 text-sm space-y-1">
                <p className="font-semibold">Medical</p>
                {selected.medicalConditions && <p>Conditions: {selected.medicalConditions}</p>}
                {selected.allergies && <p>Allergies: {selected.allergies}</p>}
                {selected.disabilities && <p>Special needs: {selected.disabilities}</p>}
                {selected.medications && <p>Medication: {selected.medications}</p>}
              </div>
            )}

            {selected.documents && Object.keys(selected.documents).length > 0 && (
              <div className="mt-4">
                <p className="font-semibold text-sm mb-2">Documents</p>
                <ul className="text-sm space-y-1">
                  {(Object.entries(selected.documents) as [keyof SchoolAdmissionDocuments, string][])
                    .filter(([, url]) => url)
                    .map(([key, url]) => (
                      <li key={key}>
                        <a
                          href={url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-[#4169E1] hover:underline"
                        >
                          {documentLabels[key]}
                        </a>
                      </li>
                    ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
