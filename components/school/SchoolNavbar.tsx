"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { usePathname } from "next/navigation";

export default function SchoolNavbar() {
  const [mobileMenu, setMobileMenu] = useState(false);
  const pathname = usePathname();
  
  // Hide navbar on portal pages
  const isPortalPage = pathname?.startsWith('/school/portal');
  
  if (isPortalPage) return null;

  return (
    <header className="sticky top-0 z-50 bg-white shadow-md">

      {/* TOP BAR */}
      <div className="bg-[#0b2d6b] text-white text-xs">
        <div className="max-w-7xl mx-auto px-4 py-2 flex justify-between">
          <span>admissions@mzinyathigardens.co.zw</span>
          <span>Opening 2027 • Kensington, Bulawayo</span>
        </div>
      </div>

      {/* MAIN NAV */}
      <div className="max-w-7xl mx-auto px-4">
        <div className="h-20 flex items-center justify-between">

          {/* LOGO */}
          <Link href="/school" className="flex items-center gap-3">
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
            <Link href="/school" className="text-gray-800 hover:text-red-600 font-medium text-sm transition">Home</Link>
            <Link href="/school/about" className="text-gray-800 hover:text-red-600 font-medium text-sm transition">About Us</Link>
            <Link href="/school/admissions" className="text-gray-800 hover:text-red-600 font-medium text-sm transition">Admissions</Link>
            <Link href="/school/what-we-offer" className="text-gray-800 hover:text-red-600 font-medium text-sm transition">What We Offer</Link>
            <Link href="/school/news" className="text-gray-800 hover:text-red-600 font-medium text-sm transition">News & Updates</Link>
            <Link href="/school/portal" className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-medium text-sm transition">
              Student Portal
            </Link>
            <Link href="/school/contact" className="text-gray-800 hover:text-red-600 font-medium text-sm transition">Contact Us</Link>
          </nav>

          {/* MOBILE BUTTON */}
          <button onClick={() => setMobileMenu(!mobileMenu)} className="lg:hidden text-2xl">☰</button>
        </div>

        {/* MOBILE MENU */}
        {mobileMenu && (
          <div className="lg:hidden pb-4 flex flex-col gap-4">
            <Link href="/school" onClick={() => setMobileMenu(false)}>Home</Link>
            <Link href="/school/about" onClick={() => setMobileMenu(false)}>About Us</Link>
            <Link href="/school/admissions" onClick={() => setMobileMenu(false)}>Admissions</Link>
            <Link href="/school/what-we-offer" onClick={() => setMobileMenu(false)}>What We Offer</Link>
            <Link href="/school/news" onClick={() => setMobileMenu(false)}>News & Updates</Link>
            <Link href="/school/portal" onClick={() => setMobileMenu(false)} className="bg-green-600 text-white px-4 py-2 rounded-lg text-center">
              Student Portal
            </Link>
            <Link href="/school/contact" onClick={() => setMobileMenu(false)}>Contact Us</Link>
          </div>
        )}
      </div>
    </header>
  );
}