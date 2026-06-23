export function normalizeNationalId(id: string) {
  return id.replace(/[\s-]/g, '').toUpperCase();
}

export function nationalIdsMatch(a: string, b: string) {
  return normalizeNationalId(a) === normalizeNationalId(b);
}

export function normalizeTrackingId(id: string) {
  return id.trim().toUpperCase();
}

export function generateCareerTrackingId() {
  return `CAREER-${Math.floor(100000 + Math.random() * 900000)}`;
}

export function isSchoolTrackingId(id: string) {
  const n = normalizeTrackingId(id);
  return n.startsWith('MGP-') || n.startsWith('MG-');
}

export function isCareerTrackingId(id: string) {
  return normalizeTrackingId(id).startsWith('CAREER-');
}
