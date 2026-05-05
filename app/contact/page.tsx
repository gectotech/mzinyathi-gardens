'use client';

import { Phone, Mail, MapPin } from 'lucide-react';

export default function ContactPage() {
  return (
    <main className="container mx-auto px-4 py-12">
      <h1 className="text-4xl font-bold text-primary mb-8 text-center">Contact Us</h1>
      <div className="grid md:grid-cols-2 gap-12 max-w-5xl mx-auto">
        <div>
          <h2 className="text-2xl font-semibold mb-4">Get in Touch</h2>
          <ul className="space-y-4">
            <li className="flex items-center gap-3"><Phone className="text-primary" /> +27 123 456 789</li>
            <li className="flex items-center gap-3"><Mail className="text-primary" /> info@mzinyathigardens.co.za</li>
            <li className="flex items-center gap-3"><MapPin className="text-primary" /> Mzinyathi, South Africa</li>
          </ul>
          <form className="mt-8 space-y-4">
            <input type="text" placeholder="Your Name" className="w-full border p-2 rounded" />
            <input type="email" placeholder="Your Email" className="w-full border p-2 rounded" />
            <textarea placeholder="Message" rows={5} className="w-full border p-2 rounded"></textarea>
            <button className="bg-primary text-white px-6 py-2 rounded-lg hover:bg-primary-dark transition">Send Message</button>
          </form>
        </div>
        <div>
          <h2 className="text-2xl font-semibold mb-4">Our Location</h2>
          <div className="bg-gray-200 h-64 rounded-lg flex items-center justify-center text-gray-500">
            [Google Maps Integration]
          </div>
        </div>
      </div>
    </main>
  );
}