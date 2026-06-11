import SchoolNavbar from "../../components/school/SchoolNavbar";
import SchoolHero from "../../components/school/SchoolHero";
import MissionVision from "../../components/school/MissionVision";
import WhatWeOffer from "../../components/school/WhatWeOffer";
import AdmissionsSection from "../../components/school/AdmissionsSection";
import ActivitiesSection from "../../components/school/ActivitiesSection";
import NewsSection from "../../components/school/NewsSection";
import SchoolCTA from "../../components/school/SchoolCTA";
import SchoolFooter from "../../components/school/SchoolFooter";

export default function SchoolPage() {
  return (
    <main className="bg-white min-h-screen">

      <SchoolHero />

      <MissionVision />

      <WhatWeOffer />

      <AdmissionsSection />

      <ActivitiesSection />

      <NewsSection />

      <SchoolCTA />

    </main>
  );
}