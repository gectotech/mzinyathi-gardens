import Link from 'next/link';
import { Mail, Phone, MapPin } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white py-12 mt-auto">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-xl font-bold mb-4">Mzinyathi Gardens</h3>
            <p className="text-gray-400">
              The Cradle of Ubuntu Lokubambana – SIYAKWAMUKELA EKHAYA
            </p>
          </div>
          <div>
            <h4 className="font-semibold mb-4">Contact</h4>
            <ul className="space-y-2 text-gray-400">
              <li className="flex items-center gap-2"><Phone size={18}/> +27 123 456 789</li>
              <li className="flex items-center gap-2"><Mail size={18}/> info@mzinyathigardens.co.za</li>
              <li className="flex items-center gap-2"><MapPin size={18}/> Mzinyathi, South Africa</li>
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
              <a href="#" className="hover:text-primary transition">Facebook</a>
              <a href="#" className="hover:text-primary transition">Twitter</a>
              <a href="#" className="hover:text-primary transition">LinkedIn</a>
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