'use client';

import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Menu, X } from 'lucide-react';

const navLinks = [
  { href: '/', label: 'Home' },
  { href: '/properties', label: 'Properties' },
  { href: '/projects', label: 'Projects' },
  { href: '/services', label: 'Services' },
  { href: '/faq', label: 'FAQ' },
  { href: '/school', label: 'School' },
  { href: '/about', label: 'About' },
  { href: '/careers', label: 'Careers' },
  { href: '/contact', label: 'Contact' },
];

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  const closeMenu = () => setIsOpen(false);
  const isActive = (href: string) =>
    href === '/' ? pathname === '/' : pathname.startsWith(href);

  return (
    <header
      className={`sticky top-0 z-50 bg-white border-b transition-shadow duration-300 ${
        scrolled
          ? 'border-gray-200/80 shadow-[0_4px_24px_-4px_rgba(15,23,42,0.08)]'
          : 'border-gray-100 shadow-none'
      }`}
    >
      <div
        className="h-[3px] w-full bg-gradient-to-r from-[#4169E1] via-[#6366f1] to-[#DD3210]"
        aria-hidden
      />

      <nav className="bg-white">
        <div className="page-container">
          <div className="flex justify-between items-center h-16 sm:h-20 min-w-0 overflow-hidden">
            <Link
              href="/"
              className="brand-logo flex h-10 sm:h-12 md:h-14 w-[130px] sm:w-[170px] md:w-[200px] shrink-0 items-center overflow-hidden rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#4169E1]/40 focus-visible:ring-offset-2"
            >
              <Image
                src="/images/whlogo.png"
                alt="Mzinyathi Gardens logo"
                width={200}
                height={56}
                className="h-full w-full object-contain object-left"
                priority
                unoptimized
              />
            </Link>

            <div className="hidden lg:flex items-center gap-0.5 shrink-0">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`interactive-link relative px-3.5 py-2.5 text-[13px] font-medium tracking-wide rounded-lg transition-colors duration-200 min-h-[44px] inline-flex items-center ${
                    isActive(link.href)
                      ? 'text-[#DD3210]'
                      : 'text-slate-600 hover:text-[#4169E1] hover:bg-slate-50'
                  }`}
                >
                  {link.label}
                  {isActive(link.href) && (
                    <span className="absolute bottom-1.5 left-3.5 right-3.5 h-0.5 rounded-full bg-[#DD3210]" />
                  )}
                </Link>
              ))}
              <Link
                href="/contact"
                className="interactive-btn ml-3 inline-flex items-center justify-center px-5 py-2.5 min-h-[44px] text-[13px] font-semibold tracking-wide text-white bg-[#DD3210] hover:bg-[#c42b0e] rounded-lg shadow-sm pulse-attention"
              >
                Enquire Now
              </Link>
            </div>

            <button
              type="button"
              onClick={() => setIsOpen(!isOpen)}
              className="lg:hidden touch-target inline-flex items-center justify-center rounded-lg text-slate-700 hover:bg-slate-100 transition-colors"
              aria-label={isOpen ? 'Close menu' : 'Open menu'}
              aria-expanded={isOpen}
            >
              {isOpen ? <X size={22} strokeWidth={2} /> : <Menu size={22} strokeWidth={2} />}
            </button>
          </div>

          <div
            className={`lg:hidden mobile-nav-panel bg-white ${isOpen ? 'is-open pb-5' : ''}`}
          >
            <div className="pt-3 pb-1 border-t border-gray-100">
              <div className="grid gap-1">
                {navLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={closeMenu}
                    className={`flex items-center min-h-[44px] px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                      isActive(link.href)
                        ? 'text-[#DD3210] bg-red-50/80'
                        : 'text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    {link.label}
                  </Link>
                ))}
              </div>
              <Link
                href="/contact"
                onClick={closeMenu}
                className="interactive-btn mt-3 flex items-center justify-center w-full min-h-[44px] py-3 text-sm font-semibold text-white bg-[#DD3210] hover:bg-[#c42b0e] rounded-lg shadow-sm transition-colors"
              >
                Enquire Now
              </Link>
            </div>
          </div>
        </div>
      </nav>
    </header>
  );
}
