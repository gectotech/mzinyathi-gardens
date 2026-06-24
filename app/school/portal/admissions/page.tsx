import LegacyPortalRedirect from '@/components/school/LegacyPortalRedirect';

export default function LegacyPortalAdmissionsPage() {
  return <LegacyPortalRedirect href="/school/portal/login?role=student" label="Redirecting to student portal login…" />;
}
