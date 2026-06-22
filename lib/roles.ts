export const USER_ROLES = [
  'super_admin',
  'admin',
  'property_admin',
  'school_admin',
  'content_editor',
  'viewer',
] as const;

export type UserRole = (typeof USER_ROLES)[number];

export const ROLE_LABELS: Record<UserRole, string> = {
  super_admin: 'Super Admin',
  admin: 'Administrator',
  property_admin: 'Property Manager',
  school_admin: 'School Admin',
  content_editor: 'Content Editor',
  viewer: 'Viewer (read-only)',
};

export const ROLE_DESCRIPTIONS: Record<UserRole, string> = {
  super_admin: 'Full access: code studio, users, all content, and settings.',
  admin: 'Manage contacts, jobs, applications, properties, media, and school content.',
  property_admin: 'Manage property phases, houses, prices, and images.',
  school_admin: 'Manage school admissions, school news, and gallery media.',
  content_editor: 'Edit website pages, school content, and media library.',
  viewer: 'View dashboards and records without making changes.',
};

type Permission =
  | 'dashboard'
  | 'contacts'
  | 'job_applications'
  | 'school_applications'
  | 'school_content'
  | 'jobs'
  | 'properties'
  | 'media'
  | 'settings'
  | 'super_pages'
  | 'super_code'
  | 'super_audit'
  | 'users'
  | 'write';

export type { Permission };

const PERMISSIONS: Record<Permission, UserRole[]> = {
  dashboard: ['super_admin', 'admin', 'property_admin', 'school_admin', 'content_editor', 'viewer'],
  contacts: ['super_admin', 'admin', 'viewer'],
  job_applications: ['super_admin', 'admin', 'viewer'],
  school_applications: ['super_admin', 'admin', 'school_admin', 'viewer'],
  school_content: ['super_admin', 'admin', 'school_admin', 'content_editor'],
  jobs: ['super_admin', 'admin', 'viewer'],
  properties: ['super_admin', 'admin', 'property_admin', 'viewer'],
  media: ['super_admin', 'admin', 'property_admin', 'school_admin', 'content_editor'],
  settings: ['super_admin', 'admin'],
  super_pages: ['super_admin', 'content_editor'],
  super_code: ['super_admin'],
  super_audit: ['super_admin'],
  users: ['super_admin'],
  write: ['super_admin', 'admin', 'property_admin', 'school_admin', 'content_editor'],
};

export function hasPermission(role: string, permission: Permission): boolean {
  const allowed = PERMISSIONS[permission];
  return allowed.includes(role as UserRole);
}

export function rolesForPermission(permission: Permission): UserRole[] {
  return PERMISSIONS[permission];
}

const ROUTE_ACCESS: { prefix: string; permission: Permission }[] = [
  { prefix: '/admin/super/code', permission: 'super_code' },
  { prefix: '/admin/super/audit', permission: 'super_audit' },
  { prefix: '/admin/super/pages', permission: 'super_pages' },
  { prefix: '/admin/super/preview', permission: 'super_pages' },
  { prefix: '/admin/super', permission: 'super_pages' },
  { prefix: '/admin/users', permission: 'users' },
  { prefix: '/admin/settings', permission: 'settings' },
  { prefix: '/admin/contacts', permission: 'contacts' },
  { prefix: '/admin/applications', permission: 'job_applications' },
  { prefix: '/admin/school-applications', permission: 'school_applications' },
  { prefix: '/admin/school-content', permission: 'school_content' },
  { prefix: '/admin/jobs', permission: 'jobs' },
  { prefix: '/admin/properties', permission: 'properties' },
  { prefix: '/admin/media', permission: 'media' },
  { prefix: '/admin/dashboard', permission: 'dashboard' },
];

export function canAccessAdminRoute(role: string, pathname: string): boolean {
  if (role === 'super_admin') return true;

  for (const { prefix, permission } of ROUTE_ACCESS) {
    if (pathname === prefix || pathname.startsWith(`${prefix}/`)) {
      return hasPermission(role, permission);
    }
  }

  return pathname === '/admin' || pathname.startsWith('/admin/dashboard');
}

export function navItemsForRole(role: string) {
  const items = [
    { href: '/admin/dashboard', permission: 'dashboard' as Permission, label: 'Dashboard' },
    { href: '/admin/contacts', permission: 'contacts' as Permission, label: 'Contacts' },
    { href: '/admin/applications', permission: 'job_applications' as Permission, label: 'Job Applications' },
    { href: '/admin/school-applications', permission: 'school_applications' as Permission, label: 'School Admissions' },
    { href: '/admin/school-content', permission: 'school_content' as Permission, label: 'School Content' },
    { href: '/admin/jobs', permission: 'jobs' as Permission, label: 'Jobs' },
    { href: '/admin/properties', permission: 'properties' as Permission, label: 'Properties' },
    { href: '/admin/media', permission: 'media' as Permission, label: 'Media Library' },
    { href: '/admin/settings', permission: 'settings' as Permission, label: 'Settings' },
  ];
  return items.filter((item) => hasPermission(role, item.permission));
}

export function superNavForRole(role: string) {
  const items = [
    { href: '/admin/super', permission: 'super_pages' as Permission, label: 'Super Admin' },
    { href: '/admin/super/code', permission: 'super_code' as Permission, label: 'Code Studio' },
    { href: '/admin/super/audit', permission: 'super_audit' as Permission, label: 'Audit Log' },
    { href: '/admin/users', permission: 'users' as Permission, label: 'Users' },
  ];
  return items.filter((item) => hasPermission(role, item.permission));
}
