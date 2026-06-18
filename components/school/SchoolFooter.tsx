"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Mail, Phone, MapPin, ArrowLeft } from "lucide-react";

export default function SchoolFooter() {
  const pathname = usePathname();
  
  // Hide footer on portal pages
  const isPortalPage = pathname?.startsWith('/school/pathway');
  
  if (isPortalPage) return null;

  return (
    <footer className="bg-[#0b2d6b] text-white pt-12 pb-6 mt-10">
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-xl font-bold mb-4">Mzinyathi Gardens</h3>
            <p className="text-sm text-gray-300">PRIMARY SCHOOL</p>
            <p className="text-sm text-gray-300 mt-2">"Kusinwa kudedelwana"</p>
          </div>
          <div>
            <h4 className="font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2 text-sm text-gray-300">
              <li><Link href="/school" className="hover:text-white transition">Home</Link></li>
              <li><Link href="/school/about" className="hover:text-white transition">About Us</Link></li>
              <li><Link href="/school/admissions" className="hover:text-white transition">Admissions</Link></li>
              <li><Link href="/school/contact" className="hover:text-white transition">Contact</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-4">Contact</h4>
            <ul className="space-y-2 text-sm text-gray-300">
              <li className="flex items-center gap-2"><Phone size={14} /> +263 29 123 4567</li>
              <li className="flex items-center gap-2"><Mail size={14} /> info@mzinyathigardens.co.zw</li>
              <li className="flex items-center gap-2"><MapPin size={14} /> Kensington, Bulawayo</li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-4">Back to Main Site</h4>
            <Link 
              href="/" 
              className="inline-flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg font-semibold text-sm transition"
            >
              <ArrowLeft size={16} /> Back to Mzinyathi Gardens
            </Link>
            <p className="text-xs text-gray-400 mt-4">Return to the main Mzinyathi Gardens website</p>
          </div>
        </div>
        <div className="border-t border-gray-700 mt-8 pt-6 text-center text-xs text-gray-400">
          <p>&copy; {new Date().getFullYear()} Mzinyathi Gardens Primary School. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}