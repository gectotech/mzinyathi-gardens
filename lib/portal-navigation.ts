import type { LucideIcon } from 'lucide-react';
import {
  LayoutDashboard,
  User,
  Award,
  Calendar,
  ClipboardList,
  Wallet,
  MessageSquare,
  BookOpen,
  Users,
  CheckSquare,
  GraduationCap,
  FileText,
  Baby,
  Bell,
} from 'lucide-react';
import type { PortalRole } from './portal-auth';

export type PortalNavItem = {
  id: string;
  label: string;
  href: string;
  icon: LucideIcon;
  badge?: string;
};

const studentNav: PortalNavItem[] = [
  { id: 'dashboard', label: 'Dashboard', href: '/school/portal/student/dashboard', icon: LayoutDashboard },
  { id: 'profile', label: 'My Profile', href: '/school/portal/student/profile', icon: User },
  { id: 'results', label: 'Results & Reports', href: '/school/portal/student/results', icon: Award },
  { id: 'timetable', label: 'Exam Timetable', href: '/school/portal/student/timetable', icon: Calendar },
  { id: 'assignments', label: 'Assignments', href: '/school/portal/student/assignments', icon: ClipboardList },
  { id: 'fees', label: 'Fees & Payments', href: '/school/portal/student/fees', icon: Wallet },
  { id: 'messages', label: 'Messages', href: '/school/portal/student/messages', icon: MessageSquare },
];

const teacherNav: PortalNavItem[] = [
  { id: 'dashboard', label: 'Dashboard', href: '/school/portal/teacher/dashboard', icon: LayoutDashboard },
  { id: 'classes', label: 'My Classes', href: '/school/portal/teacher/classes', icon: BookOpen },
  { id: 'attendance', label: 'Attendance', href: '/school/portal/teacher/attendance', icon: CheckSquare },
  { id: 'grades', label: 'Grade Book', href: '/school/portal/teacher/grades', icon: GraduationCap },
  { id: 'timetable', label: 'Timetable', href: '/school/portal/teacher/timetable', icon: Calendar },
  { id: 'messages', label: 'Parent Messages', href: '/school/portal/teacher/messages', icon: MessageSquare },
  { id: 'resources', label: 'Resources', href: '/school/portal/teacher/resources', icon: FileText },
  { id: 'profile', label: 'My Profile', href: '/school/portal/teacher/profile', icon: User },
];

const parentNav: PortalNavItem[] = [
  { id: 'dashboard', label: 'Dashboard', href: '/school/portal/parent/dashboard', icon: LayoutDashboard },
  { id: 'children', label: 'My Children', href: '/school/portal/parent/children', icon: Baby },
  { id: 'applications', label: 'Applications', href: '/school/portal/parent/applications', icon: FileText },
  { id: 'fees', label: 'Fees & Payments', href: '/school/portal/parent/fees', icon: Wallet },
  { id: 'messages', label: 'Messages', href: '/school/portal/parent/messages', icon: MessageSquare },
  { id: 'calendar', label: 'School Calendar', href: '/school/portal/parent/calendar', icon: Calendar },
  { id: 'notices', label: 'Notices', href: '/school/portal/parent/notices', icon: Bell },
  { id: 'profile', label: 'My Profile', href: '/school/portal/parent/profile', icon: User },
];

export function navForRole(role: PortalRole): PortalNavItem[] {
  if (role === 'teacher') return teacherNav;
  if (role === 'parent') return parentNav;
  return studentNav;
}

export function portalBasePath(role: PortalRole) {
  return `/school/portal/${role}`;
}
