'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Shield, Sun, Droplets, ArrowRight, Home, Building2, Users, TreePine } from 'lucide-react';
import FAQSection from '@/components/ui/FAQSection';
import PageCmsContent from '@/components/PageCmsContent';

// Hero images for carousel
const heroImages = [
  '/images/hero1.jpg',
  '/images/hero2.jpg',
  '/images/hero3.jpg',
  '/images/hero4.jpg',
];

export default function HomePage() {
  const [currentHero, setCurrentHero] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  useEffect(() => {
    if (!isAutoPlaying) return;
    const interval = setInterval(() => {
      setCurrentHero((prev) => (prev + 1) % heroImages.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [isAutoPlaying]);

  return (
    <div className="bg-white">
      {/* Hero Carousel */}
      <div className="relative h-[90vh] w-full">
        {heroImages.map((img, idx) => (
          <div
            key={idx}
            className={`absolute inset-0 transition-opacity duration-1000 ${
              idx === currentHero ? 'opacity-100' : 'opacity-0'
            }`}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-blue-900/70 to-red-900/60 z-10" />
            <img src={img} alt={`Hero ${idx + 1}`} className="w-full h-full object-cover" />
          </div>
        ))}
        <div className="relative z-20 container mx-auto px-4 h-full flex flex-col justify-center items-center text-center text-white">
          <h1 className="text-5xl md:text-7xl font-bold mb-4">Design Your Dream Living Space</h1>
          <p className="text-xl md:text-2xl max-w-2xl mb-8">Stylish homes and secure stands in a gated community – elevate your lifestyle with Mzinyathi Gardens.</p>
          <Link href="/properties" className="bg-red-600 text-white px-8 py-3 rounded-full font-semibold hover:bg-red-700 transition inline-flex items-center gap-2">
            Explore Properties <ArrowRight size={18} />
          </Link>
        </div>
        {/* Hero indicators */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex gap-2 z-20">
          {heroImages.map((_, idx) => (
            <button
              key={idx}
              onClick={() => { setCurrentHero(idx); setIsAutoPlaying(false); setTimeout(() => setIsAutoPlaying(true), 10000); }}
              className={`w-3 h-3 rounded-full transition-all ${idx === currentHero ? 'bg-red-500 w-6' : 'bg-white/70'}`}
            />
          ))}
        </div>
      </div>

      {/* Three Feature Cards with Images */}
      <section className="py-20 bg-blue-50">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Security */}
            <div className="bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition">
              <img src="/images/security.jpg" alt="Security" className="w-full h-48 object-cover" />
              <div className="p-6 text-center">
                <h3 className="text-2xl font-bold text-blue-600 mb-2">Armed Security</h3>
                <p className="text-gray-600 mb-4">24/7 professional security with CCTV and access control.</p>
                <Link href="/services" className="text-blue-600 font-semibold hover:text-red-600 inline-flex items-center gap-1">Learn More <ArrowRight size={14} /></Link>
              </div>
            </div>
            {/* Solar */}
            <div className="bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition">
              <img src="/images/infra_solar.jpg" alt="Solar Systems" className="w-full h-48 object-cover" />
              <div className="p-6 text-center">
                <h3 className="text-2xl font-bold text-blue-600 mb-2">Solar Solutions</h3>
                <p className="text-gray-600 mb-4">Pre-installed solar geysers and street lighting across all phases.</p>
                <Link href="/services" className="text-blue-600 font-semibold hover:text-red-600 inline-flex items-center gap-1">Learn More <ArrowRight size={14} /></Link>
              </div>
            </div>
            {/* Borehole */}
            <div className="bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition">
              <img src="/images/infra_borehole.jpg" alt="Borehole" className="w-full h-48 object-cover" />
              <div className="p-6 text-center">
                <h3 className="text-2xl font-bold text-blue-600 mb-2">Community Boreholes</h3>
                <p className="text-gray-600 mb-4">Reliable water supply from multiple boreholes.</p>
                <Link href="/services" className="text-blue-600 font-semibold hover:text-red-600 inline-flex items-center gap-1">Learn More <ArrowRight size={14} /></Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Collections (4 cards with images) */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold text-center text-blue-600 mb-4">Featured Collections</h2>
          <p className="text-center text-gray-600 max-w-2xl mx-auto mb-12">Explore what makes Mzinyathi Gardens the perfect place to call home.</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Available Stands */}
            <div className="bg-blue-50 rounded-2xl overflow-hidden shadow-md hover:shadow-lg transition">
              <img src="/images/phase_icon1.jpg" alt="View All Phases" className="w-full h-40 object-cover" />
              <div className="p-5 text-center">
                <h3 className="text-xl font-bold text-blue-600">View All Phases</h3>
                <p className="text-gray-600 text-sm mb-3">Phase I to XI – secure your piece of land today.</p>
                <Link href="/properties" className="text-blue-600 text-sm font-semibold hover:text-red-600">View Properties →</Link>
              </div>
            </div>
            {/* House Plans */}
            <div className="bg-blue-50 rounded-2xl overflow-hidden shadow-md hover:shadow-lg transition">
              <img src="/images/house_complete1.jpg" alt="House Plans" className="w-full h-40 object-cover" />
              <div className="p-5 text-center">
                <h3 className="text-xl font-bold text-blue-600">House Plans</h3>
                <p className="text-gray-600 text-sm mb-3">3-5 bedroom and double story designs available.</p>
                <Link href="/projects#plans" className="text-blue-600 text-sm font-semibold hover:text-red-600">Explore Plans →</Link>
              </div>
            </div>
            {/* Recreational Parks */}
            <div className="bg-blue-50 rounded-2xl overflow-hidden shadow-md hover:shadow-lg transition">
              <img src="/images/infra_park.jpg" alt="Parks" className="w-full h-40 object-cover" />
              <div className="p-5 text-center">
                <h3 className="text-xl font-bold text-blue-600">Recreational Parks</h3>
                <p className="text-gray-600 text-sm mb-3">Parks, walking trails, and playgrounds for families.</p>
                <Link href="/services" className="text-blue-600 text-sm font-semibold hover:text-red-600">Learn More →</Link>
              </div>
            </div>
            {/* Community Events */}
            <div className="bg-blue-50 rounded-2xl overflow-hidden shadow-md hover:shadow-lg transition">
              <img src="/images/phase_icon7.jpg" alt="Community events at Mzinyathi Gardens" className="w-full h-40 object-cover" />
              <div className="p-5 text-center">
                <h3 className="text-xl font-bold text-blue-600">Community Events</h3>
                <p className="text-gray-600 text-sm mb-3">Join the Matebele legacy – Ubuntu spirit.</p>
                <Link href="/contact" className="text-blue-600 text-sm font-semibold hover:text-red-600">Get Involved →</Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Latest Arrivals (3 property cards as before) */}
      <section className="py-20 bg-blue-50">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold text-center text-blue-600 mb-2">Latest Phases Released</h2>
          <p className="text-center text-gray-600 max-w-2xl mx-auto mb-12">New phases now available for pre-sale. Secure your stand today.</p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition">
              <img src="/images/phase1.jpg" alt="Phase I" className="w-full h-56 object-cover" />
              <div className="p-5">
                <h3 className="text-xl font-bold text-blue-600">Phase I: KwaNdebele</h3>
                <p className="text-gray-600 text-sm mb-2">Stand size: 600 - 1000 sqm</p>
                <p className="text-gray-500 text-sm mb-4">Cultural heritage meets modern living.</p>
                <Link href="/properties" className="inline-block bg-red-600 text-white px-4 py-2 rounded-full text-sm hover:bg-red-700 transition">View Phase</Link>
              </div>
            </div>
            <div className="bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition">
              <img src="/images/phase2.jpg" alt="Phase VII" className="w-full h-56 object-cover" />
              <div className="p-5">
                <h3 className="text-xl font-bold text-blue-600">Phase VII: Umqombothi</h3>
                <p className="text-gray-600 text-sm mb-2">Stand size: 600 - 1000 sqm</p>
                <p className="text-gray-500 text-sm mb-4">Wine estate inspired living.</p>
                <Link href="/properties" className="inline-block bg-red-600 text-white px-4 py-2 rounded-full text-sm hover:bg-red-700 transition">View Phase</Link>
              </div>
            </div>
            <div className="bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition">
              <img src="/images/phase3.jpg" alt="Phase XI" className="w-full h-56 object-cover" />
              <div className="p-5">
                <h3 className="text-xl font-bold text-blue-600">Phase XI: Mzinyathi Bosch</h3>
                <p className="text-gray-600 text-sm mb-2">Stand size: 600 - 1000 sqm</p>
                <p className="text-gray-500 text-sm mb-4">Matebele Finest – signature homes.</p>
                <Link href="/properties" className="inline-block bg-red-600 text-white px-4 py-2 rounded-full text-sm hover:bg-red-700 transition">View Phase</Link>
              </div>
            </div>
          </div>
          <div className="text-center mt-10">
            <Link href="/properties" className="inline-flex items-center gap-2 text-blue-600 font-semibold hover:text-red-600">View All Properties <ArrowRight size={16} /></Link>
          </div>
        </div>
      </section>

      <FAQSection />

      {/* CTA */}
      <section className="py-20 bg-red-600 text-white text-center">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Ready to Build Your Dream Home?</h2>
          <p className="text-lg mb-8 max-w-2xl mx-auto">Contact our sales team to schedule a site tour or inquire about available stands.</p>
          <Link href="/contact" className="inline-block bg-white text-red-600 px-8 py-3 rounded-full font-semibold hover:bg-gray-100 transition">Get In Touch</Link>
        </div>
      </section>

      <PageCmsContent slug="home" />
    </div>
  );
}