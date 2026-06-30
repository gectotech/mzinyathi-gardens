"use client";

import Link from "next/link";
import SectionHero from "@/components/layout/SectionHero";

const slides = ["/images/school1.jpg", "/images/school2.jpg", "/images/school3.jpg"];

export default function HeroSection() {
  return (
    <SectionHero
      images={slides}
      altPrefix="School"
      minHeight="default"
      overlayClassName="bg-gradient-to-r from-[#001b5e]/90 via-[#001b5e]/60 to-transparent"
    >
      <div className="max-w-2xl text-white">
        <h1 className="text-display font-bold leading-tight">
          Mzinyathi Gardens
          <br />
          Primary School
        </h1>

        <h2 className="text-yellow-400 text-heading-xl font-bold mt-4 sm:mt-6">
          Kusinwa Kudedelwana
        </h2>

        <p className="text-body-lg mt-4 sm:mt-6 text-gray-100">
          Nurturing Excellence, Character and Lifelong Learning.
        </p>

        <p className="mt-4 sm:mt-6 text-sm sm:text-lg text-gray-200 max-w-xl">
          Welcome to Mzinyathi Gardens Primary School where every child is inspired, valued and
          empowered to reach their full potential.
        </p>

        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 mt-8 sm:mt-10">
          <Link
            href="/school/admissions"
            className="interactive-btn pulse-attention inline-flex items-center justify-center min-h-[44px] bg-yellow-500 hover:bg-yellow-600 text-black font-semibold px-6 sm:px-8 py-3 rounded text-center"
          >
            Admissions Open →
          </Link>
          <Link
            href="/school/about"
            className="interactive-btn inline-flex items-center justify-center min-h-[44px] border border-white hover:bg-white hover:text-black px-6 sm:px-8 py-3 rounded transition text-center"
          >
            Learn More →
          </Link>
        </div>
      </div>
    </SectionHero>
  );
}
