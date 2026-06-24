export type PortalRole = 'student' | 'teacher' | 'parent';

export type PortalUser = {
  id: string;
  role: PortalRole;
  firstName: string;
  lastName: string;
  email: string;
  /** Student number (students) or staff ID (teachers) */
  identifier: string;
  grade?: string;
  department?: string;
  avatarInitials?: string;
  children?: { name: string; grade: string; studentNumber: string }[];
};

const STORAGE_KEY = 'mgps_portal_user';

export const DEMO_ACCOUNTS: Record<
  PortalRole,
  { identifier: string; password: string; user: PortalUser }
> = {
  student: {
    identifier: 'MGP260001A',
    password: 'student123',
    user: {
      id: 'stu-1',
      role: 'student',
      firstName: 'Tariro',
      lastName: 'Moyo',
      email: 'tariro.moyo@student.mzinyathi.local',
      identifier: 'MGP260001A',
      grade: 'Grade 4',
    },
  },
  teacher: {
    identifier: 'teacher@mzinyathigardens.co.zw',
    password: 'teacher123',
    user: {
      id: 'tch-1',
      role: 'teacher',
      firstName: 'Sarah',
      lastName: 'Ndlovu',
      email: 'teacher@mzinyathigardens.co.zw',
      identifier: 'STF-2026-014',
      department: 'Primary · Mathematics',
    },
  },
  parent: {
    identifier: 'parent@mzinyathigardens.co.zw',
    password: 'parent123',
    user: {
      id: 'par-1',
      role: 'parent',
      firstName: 'John',
      lastName: 'Moyo',
      email: 'parent@mzinyathigardens.co.zw',
      identifier: 'PAR-2026-008',
      children: [
        { name: 'Tariro Moyo', grade: 'Grade 4', studentNumber: 'MGP260001A' },
        { name: 'Kudzai Moyo', grade: 'ECD B', studentNumber: 'MGP260002K' },
      ],
    },
  },
};

export function getPortalUser(): PortalUser | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as PortalUser;
  } catch {
    return null;
  }
}

export function setPortalUser(user: PortalUser) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
}

export function clearPortalUser() {
  localStorage.removeItem(STORAGE_KEY);
  // Legacy key cleanup
  localStorage.removeItem('portalUser');
}

export function loginPortal(
  role: PortalRole,
  identifier: string,
  password: string
): { ok: true; user: PortalUser } | { ok: false; error: string } {
  const demo = DEMO_ACCOUNTS[role];
  const idNorm = identifier.trim().toLowerCase();
  const demoId = demo.identifier.toLowerCase();

  if (idNorm === demoId && password === demo.password) {
    setPortalUser(demo.user);
    return { ok: true, user: demo.user };
  }

  // Legacy portalUser migration
  try {
    const legacy = localStorage.getItem('portalUser');
    if (legacy) {
      const old = JSON.parse(legacy);
      if (
        role === 'student' &&
        old.studentNumber?.toUpperCase() === identifier.trim().toUpperCase() &&
        old.password === password
      ) {
        const user: PortalUser = {
          id: old.appId || 'legacy-stu',
          role: 'student',
          firstName: old.firstname || 'Student',
          lastName: old.lastname || '',
          email: old.email || '',
          identifier: old.studentNumber || identifier,
          grade: 'Grade 4',
        };
        setPortalUser(user);
        return { ok: true, user };
      }
    }
  } catch {
    /* ignore */
  }

  return { ok: false, error: 'Invalid credentials. Use the demo details shown below.' };
}

export function userInitials(user: PortalUser) {
  return `${user.firstName[0] || ''}${user.lastName[0] || ''}`.toUpperCase();
}

export function roleLabel(role: PortalRole) {
  return { student: 'Student', teacher: 'Teacher', parent: 'Parent / Guardian' }[role];
}
