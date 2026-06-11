import Link from 'next/link';
import Image from 'next/image';
import { Mail, Phone, MapPin, Clock, ArrowUpRight, Shield } from 'lucide-react';
import { FaFacebook, FaInstagram } from 'react-icons/fa';

const quickLinks = [
  { href: '/properties', label: 'Properties' },
  { href: '/projects', label: 'Projects' },
  { href: '/services', label: 'Services' },
  { href: '/faq', label: 'FAQ' },
  { href: '/school', label: 'School' },
  { href: '/about', label: 'About Us' },
  { href: '/careers', label: 'Careers' },
  { href: '/contact', label: 'Contact' },
];

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="mt-auto bg-[#0f172a] text-white">
      <div className="h-1 bg-gradient-to-r from-[#4169E1] via-[#6366f1] to-[#DD3210]" />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-10 lg:gap-8">
          <div className="lg:col-span-4 text-center lg:text-left">
            <div className="mb-2 -mt-10 flex flex-col items-center lg:items-start gap-1">
              <Image
                src="/images/fologo.png"
                alt="Mzinyathi Gardens logo"
                width={320}
                height={230}
                className="h-28 sm:h-32 w-auto object-contain"
              />
              <h3 className="text-xl font-bold">Mzinyathi Gardens</h3>
            </div>
            <p className="text-gray-400 -mt-2 text-sm leading-relaxed max-w-sm mx-auto lg:mx-0">
              The Cradle of Ubuntu Lokubambana – SIYAKWAMUKELA EKHAYA
            </p>
          </div>

          <div className="lg:col-span-4">
            <h4 className="text-sm font-semibold uppercase tracking-wider text-white mb-4">
              Contact Us
            </h4>
            <ul className="space-y-4 text-sm">
              <li>
                <p className="text-gray-500 text-xs uppercase tracking-wide mb-1">South Africa</p>
                <a
                  href="tel:+27760828987"
                  className="flex items-center gap-2 text-gray-300 hover:text-white transition-colors"
                >
                  <Phone size={16} className="text-[#4169E1] shrink-0" />
                  +27 76 082 8987
                </a>
              </li>
              <li>
                <p className="text-gray-500 text-xs uppercase tracking-wide mb-1">Zimbabwe</p>
                <div className="space-y-1.5">
                  <a
                    href="tel:+263776203372"
                    className="flex items-center gap-2 text-gray-300 hover:text-white transition-colors"
                  >
                    <Phone size={16} className="text-[#4169E1] shrink-0" />
                    +263 77 620 3372
                  </a>
                  <a
                    href="tel:+263771160529"
                    className="flex items-center gap-2 text-gray-300 hover:text-white transition-colors"
                  >
                    <Phone size={16} className="text-[#4169E1] shrink-0" />
                    +263 77 116 0529
                  </a>
                </div>
              </li>
              <li>
                <a
                  href="mailto:info@mzinyathigardens.co.zw"
                  className="flex items-center gap-2 text-gray-300 hover:text-white transition-colors"
                >
                  <Mail size={16} className="text-[#4169E1] shrink-0" />
                  info@mzinyathigardens.co.zw
                </a>
              </li>
              <li className="flex items-start gap-2 text-gray-400">
                <MapPin size={16} className="text-[#4169E1] shrink-0 mt-0.5" />
                <span>
                  125 Harold Road, Hope Valley, Kensington Township 2, Bulawayo
                </span>
              </li>
              <li className="flex items-center gap-2 text-gray-500 text-xs">
                <Clock size={14} className="text-[#4169E1] shrink-0" />
                Mon – Sun: 08:00 – 17:00
              </li>
            </ul>
          </div>

          <div className="lg:col-span-2">
            <h4 className="text-sm font-semibold uppercase tracking-wider text-white mb-4">
              Quick Links
            </h4>
            <ul className="space-y-2.5">
              {quickLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-gray-400 hover:text-white hover:translate-x-0.5 inline-flex items-center gap-1 transition-all duration-200"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="lg:col-span-2">
            <h4 className="text-sm font-semibold uppercase tracking-wider text-white mb-4">
              Follow Us
            </h4>
            <div className="flex flex-col gap-3">
              <a
                href="https://www.facebook.com/mzinyathigardens"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2.5 text-sm text-gray-300 hover:text-white bg-white/5 hover:bg-white/10 px-4 py-2.5 rounded-lg transition-colors border border-white/5"
              >
                <FaFacebook size={18} className="text-[#4169E1]" />
                Facebook
                <ArrowUpRight size={14} className="ml-auto opacity-50" />
              </a>
              <a
                href="https://www.instagram.com/mzinyathigardens_official"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2.5 text-sm text-gray-300 hover:text-white bg-white/5 hover:bg-white/10 px-4 py-2.5 rounded-lg transition-colors border border-white/5"
              >
                <FaInstagram size={18} className="text-[#DD3210]" />
                Instagram
                <ArrowUpRight size={14} className="ml-auto opacity-50" />
              </a>
            </div>
            <Link
              href="/properties"
              className="mt-6 inline-flex items-center justify-center w-full text-sm font-semibold bg-[#DD3210] hover:bg-[#c42b0e] text-white px-4 py-2.5 rounded-lg transition-colors"
            >
              View Properties
            </Link>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-gray-500">
          <p>&copy; {year} Mzinyathi Gardens. All rights reserved.</p>
          <div className="flex flex-wrap items-center justify-center gap-4">
            <p className="text-xs text-gray-600">
              Bulawayo, Zimbabwe · Gated community living
            </p>
            <Link
              href="/admin/login"
              className="inline-flex items-center gap-1.5 text-xs text-gray-500 hover:text-white border border-white/10 hover:border-white/25 px-3 py-1.5 rounded-md transition-colors"
            >
              <Shield size={14} />
              Staff Login
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
