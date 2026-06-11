"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

export default function SchoolNavbar() {
  const [mobileMenu, setMobileMenu] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-white shadow-md">

      {/* TOP BAR */}

      <div className="bg-[#0b2d6b] text-white text-xs">
        <div className="max-w-7xl mx-auto px-4 py-2 flex justify-between">
          <span>
            admissions@mzinyathigardens.co.zw
          </span>

          <span>
            Opening 2027 • Kensington, Bulawayo
          </span>
        </div>
      </div>

      {/* MAIN NAV */}

      <div className="max-w-7xl mx-auto px-4">

        <div className="h-20 flex items-center justify-between">

          {/* LOGO */}

          <Link
            href="/school"
            className="flex items-center gap-3"
          >
            <Image
              src="/school/slo.png"
              alt="School Logo"
              width={55}
              height={55}
              className="object-contain"
            />

            <div>
              <h2 className="font-black text-[#04194b] text-lg leading-none">
                Mzinyathi Gardens
              </h2>

              <p className="text-red-600 text-xs font-semibold">
                PRIMARY SCHOOL
              </p>
            </div>
          </Link>

          {/* DESKTOP MENU */}

          <nav className="hidden lg:flex items-center gap-7">

            <Link
              href="/school"
              className="text-gray-800 hover:text-red-600 font-medium text-sm transition"
            >
              Home
            </Link>

            <Link
              href="/school/about"
              className="text-gray-800 hover:text-red-600 font-medium text-sm transition"
            >
              About Us
            </Link>

            <Link
              href="/school/admissions"
              className="text-gray-800 hover:text-red-600 font-medium text-sm transition"
            >
              Admissions
            </Link>

            <Link
              href="/school/what-we-offer"
              className="text-gray-800 hover:text-red-600 font-medium text-sm transition"
            >
              What We Offer
            </Link>

            <Link
              href="/school/news"
              className="text-gray-800 hover:text-red-600 font-medium text-sm transition"
            >
              News & Updates
            </Link>

            <Link
            href="/school/contact"
            className="text-sm font-medium text-gray-700 hover:text-green-700 transition"
            >
             Contact Us
            </Link>

          </nav>

          {/* BACK TO MAIN WEBSITE */}

          <Link
            href="/"
            className="hidden lg:flex bg-red-600 hover:bg-red-700 text-white px-5 py-2 rounded-lg font-semibold text-sm transition"
          >
            Back To Mzinyathi
          </Link>

          {/* MOBILE */}

          <button
            onClick={() => setMobileMenu(!mobileMenu)}
            className="lg:hidden"
          >
            ☰
          </button>

        </div>

        {mobileMenu && (
          <div className="lg:hidden pb-4 flex flex-col gap-4">

            <Link href="/school">Home</Link>
            <Link href="/school/about">About Us</Link>
            <Link href="/school/admissions">Admissions</Link>
            <Link href="/school/what-we-offer">What We Offer</Link>
            <Link href="/school/news">News & Updates</Link>
            <Link href="/school/contact">Contact Us</Link>
            <Link href="/">Back To Mzinyathi</Link>

          </div>
        )}

      </div>
    </header>
  );
}