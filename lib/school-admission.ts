export type SchoolAdmissionDocuments = {
  studentPhoto?: string;
  birthCertificate?: string;
  previousReport?: string;
  passportPhoto?: string;
  parentId?: string;
  proofOfResidence?: string;
  transferLetter?: string;
  recentResults?: string;
};

export type SchoolAdmissionFormState = {
  firstName: string;
  surname: string;
  dateOfBirth: string;
  gender: string;
  nationality: string;
  birthCertNumber: string;
  gradeApplying: string;
  learnerPreviousSchool: string;
  parentName: string;
  parentRelationship: string;
  parentNationalId: string;
  parentPhone: string;
  parentAltPhone: string;
  parentEmail: string;
  parentOccupation: string;
  homeAddress: string;
  city: string;
  province: string;
  suburb: string;
  postalAddress: string;
  emergencyName: string;
  emergencyRelationship: string;
  emergencyPhone: string;
  emergencyAltPhone: string;
  medicalConditions: string;
  allergies: string;
  disabilities: string;
  medications: string;
  doctorInfo: string;
  currentSchool: string;
  lastGradeCompleted: string;
  languagesSpoken: string;
  talentsInterests: string;
  requiresTransport: string;
  pickupArea: string;
  informationConfirmed: boolean;
  parentSignature: string;
};

export const initialSchoolAdmissionForm: SchoolAdmissionFormState = {
  firstName: '',
  surname: '',
  dateOfBirth: '',
  gender: '',
  nationality: '',
  birthCertNumber: '',
  gradeApplying: '',
  learnerPreviousSchool: '',
  parentName: '',
  parentRelationship: '',
  parentNationalId: '',
  parentPhone: '',
  parentAltPhone: '',
  parentEmail: '',
  parentOccupation: '',
  homeAddress: '',
  city: '',
  province: '',
  suburb: '',
  postalAddress: '',
  emergencyName: '',
  emergencyRelationship: '',
  emergencyPhone: '',
  emergencyAltPhone: '',
  medicalConditions: '',
  allergies: '',
  disabilities: '',
  medications: '',
  doctorInfo: '',
  currentSchool: '',
  lastGradeCompleted: '',
  languagesSpoken: '',
  talentsInterests: '',
  requiresTransport: '',
  pickupArea: '',
  informationConfirmed: false,
  parentSignature: '',
};

export function generateSchoolTrackingId() {
  return `MGP-${Math.floor(100000 + Math.random() * 900000)}`;
}

const MAX_UPLOAD_BYTES = 10 * 1024 * 1024;
const ALLOWED_UPLOAD_TYPES = new Set([
  'application/pdf',
  'image/jpeg',
  'image/jpg',
  'image/png',
]);

export async function uploadSchoolDocument(file: File): Promise<string> {
  if (file.size > MAX_UPLOAD_BYTES) {
    throw new Error(`File "${file.name}" exceeds the 10MB limit`);
  }

  const type = file.type || 'application/octet-stream';
  const isPdf = type === 'application/pdf' || file.name.toLowerCase().endsWith('.pdf');
  const isImage = type.startsWith('image/');

  if (!isPdf && !isImage && !ALLOWED_UPLOAD_TYPES.has(type)) {
    throw new Error(`File type not allowed: ${file.name}`);
  }

  const formData = new FormData();
  formData.append('file', file);

  const res = await fetch('/api/school/upload', {
    method: 'POST',
    body: formData,
  });

  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.error || 'Failed to upload document');
  }

  return data.url as string;
}
