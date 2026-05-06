'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Search, MapPin, ArrowRight, Bed, Ruler } from 'lucide-react';
import { phasesData, allPhases } from '@/lib/housesData';

const heroImages = ['/images/hero1.jpg', '/images/hero2.jpg', '/images/hero3.jpg'];

// Popular properties from our data (phases I, VII, XI)
const popularProperties = [
  { id: 'phase-i', name: 'Phase I: KwaNdebele - Emzini wamaTebele', size: '600 - 1000 sqm', location: 'Mzinyathi Gardens', image: '/images/phase1.jpg', beds: 3, baths: 2, description: 'Cultural heritage meets modern living.' },
  { id: 'phase-vii', name: 'Phase VII: Umqombothi - Wine Estate', size: '600 - 1000 sqm', location: 'Mzinyathi Gardens', image: '/images/phase2.jpg', beds: 4, baths: 3, description: 'Wine estate inspired living.' },
  { id: 'phase-xi', name: 'Phase XI: Mzinyathi Bosch - Matebele Finest', size: '600 - 1000 sqm', location: 'Mzinyathi Gardens', image: '/images/phase3.jpg', beds: 4, baths: 3, description: 'Signature homes with premium finishes.' },
];

export default function PropertiesPage() {
  const [currentHero, setCurrentHero] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  useEffect(() => {
    if (!isAutoPlaying) return;
    const interval = setInterval(() => setCurrentHero(prev => (prev + 1) % heroImages.length), 5000);
    return () => clearInterval(interval);
  }, [isAutoPlaying]);

  return (
    <div className="bg-white">
      {/* Hero Carousel */}
      <div className="relative min-h-[50vh] md:min-h-[60vh] w-full">
        {heroImages.map((img, idx) => (
          <div key={idx} className={`absolute inset-0 transition-opacity duration-1000 ${idx === currentHero ? 'opacity-100' : 'opacity-0'}`}>
            <div className="absolute inset-0 bg-gradient-to-r from-blue-900/70 to-red-900/60" />
            <img src={img} className="w-full h-full object-cover" alt="hero" />
          </div>
        ))}
        <div className="relative z-20 container mx-auto px-4 h-full flex flex-col justify-center text-white">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-2">Available Properties</h1>
          <p className="text-base sm:text-lg max-w-xl">Discover secure, modern stands in a gated community.</p>
        </div>
        <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-2 z-20">
          {heroImages.map((_, idx) => (
            <button key={idx} onClick={() => { setCurrentHero(idx); setIsAutoPlaying(false); setTimeout(() => setIsAutoPlaying(true), 10000); }} className={`w-2 h-2 rounded-full transition-all ${idx === currentHero ? 'bg-red-500 w-4' : 'bg-white/70'}`} />
          ))}
        </div>
      </div>

      {/* Search bar */}
      <div className="container mx-auto px-4 -mt-8 relative z-30">
        <div className="bg-white rounded-full shadow-lg flex items-center p-1 max-w-md mx-auto">
          <input type="text" placeholder="Search by phase or location" className="flex-1 px-4 py-2 rounded-full outline-none text-sm" />
          <button className="bg-red-600 text-white p-2 rounded-full"><Search size={18} /></button>
        </div>
      </div>

      {/* Popular Properties (with link to phase page) */}
      <section className="py-12 md:py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl md:text-3xl font-bold text-center text-blue-600 mb-8">Popular Properties</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {popularProperties.map((prop) => (
              <div key={prop.id} className="bg-white rounded-2xl shadow-md overflow-hidden hover:shadow-xl transition border-t-4 border-red-500">
                <img src={prop.image} alt={prop.name} className="w-full h-48 sm:h-56 object-cover" />
                <div className="p-4 md:p-5">
                  <h3 className="text-base sm:text-lg md:text-xl font-bold text-blue-600 mb-1">{prop.name}</h3>
                  <p className="flex items-center text-gray-500 text-xs sm:text-sm mb-2"><MapPin size={12} className="mr-1" /> {prop.location}</p>
                  <p className="text-gray-700 text-sm mb-2">Stand Size: {prop.size}</p>
                  <div className="flex gap-3 text-gray-500 text-xs sm:text-sm mb-3">
                    <span><Bed size={12} className="inline mr-1" /> {prop.beds} beds</span>
                    <span><Ruler size={12} className="inline mr-1" /> {prop.baths} baths</span>
                  </div>
                  <p className="text-gray-600 text-xs sm:text-sm mb-4">{prop.description}</p>
                  <Link href={`/properties/${prop.id}`} className="block w-full bg-blue-600 text-white text-center py-2 rounded-full text-sm sm:text-base hover:bg-red-600 transition">
                    View Houses in this Phase
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* All Phases Grid (I to XI) – each links to phase page if available, else contact */}
      <section className="py-12 md:py-16 bg-blue-50">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl md:text-3xl font-bold text-center text-blue-600 mb-8">All Phases (I – XI)</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 md:gap-6">
            {allPhases.map((phase) => {
              const hasHouses = !!phasesData[phase.id];
              return (
                <Link key={phase.id} href={hasHouses ? `/properties/${phase.id}` : '/contact'} className="block group">
                  <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition">
                    <img src={phase.image} alt={phase.name} className="w-full aspect-square object-cover group-hover:scale-105 transition duration-300" />
                    <div className="p-2 text-center">
                      <p className="font-semibold text-blue-600 text-sm md:text-base">{phase.name}</p>
                      {!hasHouses && <p className="text-xs text-gray-400">Coming Soon</p>}
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>
    </div>
  );
}