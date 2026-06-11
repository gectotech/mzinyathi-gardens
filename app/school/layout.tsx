import SchoolNavbar from "../../components/school/SchoolNavbar";
import SchoolFooter from "../../components/school/SchoolFooter";

export default function SchoolLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <SchoolNavbar />
      {children}
      <SchoolFooter />
    </>
  );
}