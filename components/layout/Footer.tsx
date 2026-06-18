// components/layout/Footer.tsx
import Image from 'next/image';
import Link from 'next/link';
import { Mail, Phone, MapPin } from 'lucide-react';
import { FaFacebook, FaTwitter, FaLinkedin, FaInstagram } from 'react-icons/fa';

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white py-12">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="text-center">
            <div className="mb-2 -mt-10 flex flex-col items-center gap-1">
              <Image
                src="/images/Wlogo.png"
                alt="Mzinyathi Gardens logo"
                width={192}
                height={192}
                className="rounded-full object-cover"
                style={{ width: 'auto', height: 'auto' }}
              />
              <h3 className="text-xl font-bold">Mzinyathi Gardens</h3>
            </div>
            <p className="text-gray-400 -mt-2">
              The Cradle of Ubuntu Lokubambana – SIYAKWAMUKELA EKHAYA
            </p>
          </div>
          <div>
            <h4 className="font-semibold mb-4">Contact</h4>
            <ul className="space-y-2 text-gray-400">
              <li className="flex items-center gap-2">
                <div className="w-[22px]">
                  <Phone size={18} />
                </div>
                +27 123 456 789
              </li>
              <li className="flex items-center gap-2">
                <div className="w-[22px]">
                  <Mail size={18} />
                </div>
                info@mzinyathigardens.co.za
              </li>
              <li className="flex items-start gap-2">
                <div className="w-[22px]">
                  <MapPin size={18} />
                </div>
                <div>
                  <span className="font-bold">Head Office</span>
                  <p className="text-gray-400 text-sm mt-1">
                    125 Harold Road, Hope Valley Subdivision A, Kensington Township 2, Bulawayo
                  </p>
                </div>
              </li>
              <li className="flex items-start gap-2">
                <div className="w-[22px]">
                  <MapPin size={18} />
                </div>
                <div>
                  <span className="font-bold">Town Office</span>
                  <p className="text-gray-400 text-sm mt-1">
                    Suite 755 Chrysolite House, Fife Street & 9th Avenue, Bulawayo
                  </p>
                </div>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2 text-gray-400">
              <li><Link href="/properties" className="hover:text-primary transition">Properties</Link></li>
              <li><Link href="/projects" className="hover:text-primary transition">Projects</Link></li>
              <li><Link href="/careers" className="hover:text-primary transition">Careers</Link></li>
              <li><Link href="/contact" className="hover:text-primary transition">Contact</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-4">Follow Us</h4>
            <div className="flex space-x-4">
              <a 
                href="https://facebook.com/yourpage" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="hover:text-primary transition text-2xl"
                aria-label="Facebook"
              >
                <FaFacebook />
              </a>
              <a 
                href="https://twitter.com/yourhandle" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="hover:text-primary transition text-2xl"
                aria-label="Twitter"
              >
                <FaTwitter />
              </a>
              <a 
                href="https://linkedin.com/company/yourcompany" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="hover:text-primary transition text-2xl"
                aria-label="LinkedIn"
              >
                <FaLinkedin />
              </a>
              <a 
                href="https://instagram.com/yourhandle" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="hover:text-primary transition text-2xl"
                aria-label="Instagram"
              >
                <FaInstagram />
              </a>
            </div>
          </div>
        </div>
        <div className="border-t border-gray-800 mt-8 pt-6 text-center text-sm text-gray-500">
          &copy; {new Date().getFullYear()} Mzinyathi Gardens. All rights reserved.
        </div>
      </div>
    </footer>
  );
}