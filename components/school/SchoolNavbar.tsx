"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";

const navLinks = [
  { href: "/school", label: "Home" },
  { href: "/school/about", label: "About Us" },
  { href: "/school/what-we-offer", label: "What We Offer" },
  { href: "/school/news", label: "News & Updates" },
  { href: "/school/contact", label: "Contact Us" },
];

export default function SchoolNavbar() {
  const [mobileMenu, setMobileMenu] = useState(false);
  const pathname = usePathname();

  const isPortalPage =
    pathname?.startsWith("/school/pathway") ||
    pathname?.startsWith("/school/portal") ||
    pathname?.startsWith("/school/student-portal");

  useEffect(() => {
    setMobileMenu(false);
  }, [pathname]);

  useEffect(() => {
    document.body.style.overflow = mobileMenu ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileMenu]);

  if (isPortalPage) return null;

  const isActive = (href: string) =>
    href === "/school" ? pathname === "/school" : pathname?.startsWith(href);

  return (
    <header className="sticky top-0 z-50 bg-white shadow-md">
      <div className="bg-[var(--color-nav-primary)] text-white text-xs">
        <div className="page-container py-2 flex flex-col gap-1 sm:flex-row sm:justify-between sm:items-center">
          <a
            href="mailto:admissions@mzinyathigardens.co.zw"
            className="truncate hover:underline min-h-[44px] inline-flex items-center sm:min-h-0"
          >
            admissions@mzinyathigardens.co.zw
          </a>
          <span className="text-white/90 shrink-0">Opening 2027 · Kensington, Bulawayo</span>
        </div>
      </div>

      <div className="page-container">
        <div className="h-16 sm:h-20 flex items-center justify-between gap-3 min-w-0">
          <Link href="/school" className="flex items-center gap-2 sm:gap-3 min-w-0 shrink overflow-hidden">
            <Image
              src="/school/slo.png"
              alt="School Logo"
              width={55}
              height={55}
              className="brand-logo h-10 w-10 sm:h-12 sm:w-12 object-contain shrink-0"
            />
            <div className="min-w-0">
              <h2 className="font-black text-[#04194b] text-sm sm:text-lg leading-tight truncate">
                Mzinyathi Gardens
              </h2>
              <p className="text-red-600 text-[10px] sm:text-xs font-semibold">PRIMARY SCHOOL</p>
            </div>
          </Link>

          <nav className="hidden lg:flex items-center gap-5 xl:gap-7 shrink-0">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`interactive-link min-h-[44px] inline-flex items-center font-medium text-sm transition ${
                  isActive(link.href) ? "text-red-600" : "text-gray-800 hover:text-red-600"
                }`}
              >
                {link.label}
              </Link>
            ))}
            <Link
              href="/school/portal"
              className="interactive-btn bg-[var(--color-nav-primary)] hover:bg-[var(--color-nav-primary-hover)] text-white px-4 py-2.5 min-h-[44px] inline-flex items-center rounded-lg font-medium text-sm pulse-attention"
            >
              School Portal
            </Link>
          </nav>

          <button
            type="button"
            onClick={() => setMobileMenu(!mobileMenu)}
            className="lg:hidden touch-target inline-flex items-center justify-center rounded-lg text-gray-800 hover:bg-gray-100"
            aria-label={mobileMenu ? "Close menu" : "Open menu"}
            aria-expanded={mobileMenu}
          >
            {mobileMenu ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        <div className={`lg:hidden mobile-nav-panel ${mobileMenu ? "is-open pb-5" : ""}`}>
          <nav className="border-t border-gray-100 pt-3 flex flex-col gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileMenu(false)}
                className={`min-h-[44px] flex items-center px-3 py-2.5 rounded-lg text-sm font-medium transition ${
                  isActive(link.href)
                    ? "text-red-600 bg-red-50"
                    : "text-gray-800 hover:bg-gray-50 hover:text-red-600"
                }`}
              >
                {link.label}
              </Link>
            ))}
            <Link
              href="/school/portal"
              onClick={() => setMobileMenu(false)}
              className="interactive-btn mt-2 min-h-[44px] flex items-center justify-center bg-[var(--color-nav-primary)] text-white px-4 py-3 rounded-lg text-center font-medium text-sm"
            >
              School Portal
            </Link>
          </nav>
        </div>
      </div>
    </header>
  );
}
