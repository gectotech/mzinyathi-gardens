'use client';

import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { Eye, GraduationCap, FileText, ExternalLink } from 'lucide-react';
import ExportPanel from '@/components/admin/ExportPanel';
import ViewDrawer from '@/components/admin/ViewDrawer';
import StatusBadge from '@/components/admin/StatusBadge';
import { DetailSection, DetailRow, DetailMessage } from '@/components/admin/DetailSection';
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

const isImageUrl = (url: string) => /\.(jpg|jpeg|png|gif|webp)(\?|$)/i.test(url);

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
      if (selected?.id === id) setSelected({ ...selected, status });
    }
  };

  const docs = selected?.documents
    ? (Object.entries(selected.documents) as [keyof SchoolAdmissionDocuments, string][]).filter(([, url]) => url)
    : [];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">School Admissions</h1>
        <p className="text-gray-600 text-sm">Student applications for the 2027 intake</p>
      </div>

      <ExportPanel endpoint="/api/admin/school-applications" filename="school-applications.csv" />

      <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
        <table className="min-w-full text-sm">
          <thead className="bg-slate-50 border-b">
            <tr>
              <th className="px-4 py-3 text-left font-semibold text-gray-600">Learner</th>
              <th className="px-4 py-3 text-left font-semibold text-gray-600">Grade</th>
              <th className="px-4 py-3 text-left font-semibold text-gray-600">Parent</th>
              <th className="px-4 py-3 text-left font-semibold text-gray-600">Tracking ID</th>
              <th className="px-4 py-3 text-left font-semibold text-gray-600">Status</th>
              <th className="px-4 py-3 text-left font-semibold text-gray-600">Date</th>
              <th className="px-4 py-3 text-left font-semibold text-gray-600">Actions</th>
            </tr>
          </thead>
          <tbody>
            {applications.length === 0 ? (
              <tr>
                <td colSpan={7} className="px-4 py-12 text-center text-gray-500">
                  No school applications yet
                </td>
              </tr>
            ) : (
              applications.map((app) => (
                <tr key={app.id} className="border-t hover:bg-slate-50/80 transition">
                  <td className="px-4 py-3 font-medium">
                    {app.firstName} {app.surname}
                  </td>
                  <td className="px-4 py-3">{app.gradeApplying}</td>
                  <td className="px-4 py-3 text-gray-600">{app.parentName}</td>
                  <td className="px-4 py-3 font-mono text-xs text-gray-500">{app.trackingId}</td>
                  <td className="px-4 py-3">
                    <select
                      value={app.status}
                      onChange={(e) => updateStatus(app.id, e.target.value)}
                      className="border rounded-lg px-2 py-1 text-xs bg-white"
                    >
                      <option value="submitted">Submitted</option>
                      <option value="under_review">Under Review</option>
                      <option value="accepted">Accepted</option>
                      <option value="waitlisted">Waitlisted</option>
                      <option value="rejected">Rejected</option>
                    </select>
                  </td>
                  <td className="px-4 py-3 text-gray-500">{new Date(app.createdAt).toLocaleDateString()}</td>
                  <td className="px-4 py-3">
                    <button
                      onClick={() => setSelected(app)}
                      className="inline-flex items-center gap-1.5 text-[#4169E1] hover:bg-blue-50 px-3 py-1.5 rounded-lg text-xs font-medium transition"
                    >
                      <Eye size={14} /> View
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <ViewDrawer
        open={!!selected}
        onClose={() => setSelected(null)}
        title={selected ? `${selected.firstName} ${selected.surname}` : ''}
        subtitle={selected?.trackingId}
        badge={selected ? <StatusBadge status={selected.status} /> : undefined}
        headerIcon={<GraduationCap size={22} className="text-white" />}
        width="xl"
        footer={
          selected?.parentEmail && (
            <a href={`mailto:${selected.parentEmail}`} className="bg-[#4169E1] text-white px-4 py-2 rounded-lg text-sm font-medium inline-block">
              Email parent
            </a>
          )
        }
      >
        {selected && (
          <>
            <DetailSection title="Learner">
              <DetailRow label="Grade applying" value={selected.gradeApplying} />
              <DetailRow label="Date of birth" value={selected.dateOfBirth} />
              <DetailRow label="Gender" value={selected.gender} />
              <DetailRow label="Nationality" value={selected.nationality} />
              <DetailRow label="Birth cert #" value={selected.birthCertNumber} mono />
              <DetailRow label="Current school" value={selected.currentSchool} />
              <DetailRow label="Previous school" value={selected.learnerPreviousSchool} />
              <DetailRow label="Last grade" value={selected.lastGradeCompleted} />
              <DetailRow label="Languages" value={selected.languagesSpoken} />
              <DetailRow label="Talents" value={selected.talentsInterests} />
            </DetailSection>

            <DetailSection title="Parent / guardian">
              <DetailRow label="Name" value={`${selected.parentName} (${selected.parentRelationship})`} />
              <DetailRow label="Phone" value={selected.parentPhone} />
              <DetailRow label="Alt phone" value={selected.parentAltPhone} />
              <DetailRow label="Email" value={selected.parentEmail} />
              <DetailRow label="National ID" value={selected.parentNationalId} />
              <DetailRow label="Occupation" value={selected.parentOccupation} />
              <DetailRow label="Address" value={`${selected.homeAddress}, ${selected.suburb}, ${selected.city}, ${selected.province}`} />
              <DetailRow label="Postal" value={selected.postalAddress} />
            </DetailSection>

            <DetailSection title="Emergency contact">
              <DetailRow label="Name" value={`${selected.emergencyName} (${selected.emergencyRelationship})`} />
              <DetailRow label="Phone" value={selected.emergencyPhone} />
              <DetailRow label="Alt phone" value={selected.emergencyAltPhone} />
            </DetailSection>

            {(selected.medicalConditions || selected.allergies || selected.disabilities || selected.medications) && (
              <DetailSection title="Medical">
                <DetailRow label="Conditions" value={selected.medicalConditions} />
                <DetailRow label="Allergies" value={selected.allergies} />
                <DetailRow label="Special needs" value={selected.disabilities} />
                <DetailRow label="Medication" value={selected.medications} />
                <DetailRow label="Doctor" value={selected.doctorInfo} />
              </DetailSection>
            )}

            <DetailSection title="Transport">
              <DetailRow label="Requires transport" value={selected.requiresTransport} />
              <DetailRow label="Pickup area" value={selected.pickupArea} />
            </DetailSection>

            <DetailSection title="Application">
              <DetailRow label="Source" value={selected.source} />
              <DetailRow label="Submitted" value={new Date(selected.createdAt).toLocaleString()} />
              <DetailRow label="Signature" value={selected.parentSignature} />
            </DetailSection>

            {docs.length > 0 && (
              <DetailSection title="Documents">
                <div className="grid sm:grid-cols-2 gap-3">
                  {docs.map(([key, url]) => (
                    <div key={key} className="border rounded-xl overflow-hidden bg-white">
                      {isImageUrl(url) ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={url} alt={documentLabels[key]} className="w-full h-32 object-cover" />
                      ) : (
                        <div className="h-32 bg-gray-100 flex items-center justify-center">
                          <FileText size={32} className="text-gray-400" />
                        </div>
                      )}
                      <div className="p-3 flex items-center justify-between gap-2">
                        <span className="text-xs font-medium text-gray-700">{documentLabels[key]}</span>
                        <a href={url} target="_blank" rel="noopener noreferrer" className="text-[#4169E1] text-xs flex items-center gap-1">
                          <ExternalLink size={12} /> Open
                        </a>
                      </div>
                    </div>
                  ))}
                </div>
              </DetailSection>
            )}
          </>
        )}
      </ViewDrawer>
    </div>
  );
}
