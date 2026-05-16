'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react';
import { properties } from '@/lib/mockData';
import PropertyCard from '@/components/ui/PropertyCard';

// Hero carousel images – your existing phase_icon images
const heroImages = [
  '/images/phase_icon1.jpg',
  '/images/phase_icon2.jpg',
  '/images/phase_icon3.jpg',
  '/images/phase_icon4.jpg',
  '/images/phase_icon5.jpg',
  '/images/phase_icon6.jpg',
];

export default function Home() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const featuredProperties = properties.filter(p => p.featured);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % heroImages.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const goToPrevious = () => {
    setCurrentIndex((prev) => (prev - 1 + heroImages.length) % heroImages.length);
  };

  const goToNext = () => {
    setCurrentIndex((prev) => (prev + 1) % heroImages.length);
  };

  return (
    <>
      {/* HERO CAROUSEL – same as before, using regular img tags */}
      <div className="relative h-[90vh] w-full overflow-hidden bg-gray-900">
        {heroImages.map((img, idx) => (
          <div
            key={idx}
            className={`absolute inset-0 transition-opacity duration-1000 ${
              idx === currentIndex ? 'opacity-100 z-10' : 'opacity-0 z-0'
            }`}
          >
            <img
              src={img}
              alt={`Mzinyathi Gardens ${idx + 1}`}
              className="w-full h-full object-cover"
              onError={(e) => console.error(`Failed: ${img}`)}
              onLoad={() => console.log(`✅ Loaded: ${img}`)}
            />
          </div>
        ))}
        <div className="absolute inset-0 bg-black/50 z-20" />
        <div className="relative z-30 container mx-auto px-4 h-full flex flex-col justify-center items-center text-center text-white">
          <h1 className="text-4xl md:text-6xl font-bold mb-4">Mzinyathi Gardens</h1>
          <p className="text-xl md:text-2xl italic mb-6">
            "The Cradle of Ubuntu Lokubambana -- SIYAKWAMUKELA EKHAYA"
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <Link href="/properties" className="bg-primary px-6 py-3 rounded-md hover:bg-opacity-90 transition inline-flex items-center gap-2">
              Explore Properties <ArrowRight size={18} />
            </Link>
            <Link href="/contact" className="bg-white text-dark px-6 py-3 rounded-md hover:bg-gray-100 transition">
              Contact Us
            </Link>
          </div>
        </div>
        <button onClick={goToPrevious} className="absolute left-4 top-1/2 -translate-y-1/2 z-40 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full transition">
          <ChevronLeft size={28} />
        </button>
        <button onClick={goToNext} className="absolute right-4 top-1/2 -translate-y-1/2 z-40 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full transition">
          <ChevronRight size={28} />
        </button>
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-40 flex gap-2">
          {heroImages.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentIndex(idx)}
              className={`w-2.5 h-2.5 rounded-full transition-all ${
                idx === currentIndex ? 'bg-white w-5' : 'bg-white/50'
              }`}
            />
          ))}
        </div>
      </div>

      {/* SERVICES SECTION – USING YOUR ACTUAL FILENAMES */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Our Premium Services</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
            {/* Armed Security */}
            <div className="bg-white p-6 rounded-lg shadow-md text-center">
              <div className="w-20 h-20 mx-auto mb-4">
                <img
                  src="/images/armed_security.jpg"
                  alt="Armed Security"
                  className="w-full h-full object-contain"
                  onError={(e) => (e.currentTarget.src = '/images/feel-safe.jpg')}
                />
              </div>
              <h3 className="text-xl font-semibold mb-2">Armed Security</h3>
              <p className="text-gray-600 text-sm">24/7 professional security</p>
            </div>

            {/* Solar Street Lighting */}
            <div className="bg-white p-6 rounded-lg shadow-md text-center">
              <div className="w-20 h-20 mx-auto mb-4">
                <img
                  src="/images/infra_solar.jpg"
                  alt="Solar Street Lighting"
                  className="w-full h-full object-contain"
                  onError={(e) => (e.currentTarget.src = '/images/infra_streetlight.jpg')}
                />
              </div>
              <h3 className="text-xl font-semibold mb-2">Solar Street Lighting</h3>
              <p className="text-gray-600 text-sm">Eco-friendly lighting</p>
            </div>

            {/* Community Boreholes */}
            <div className="bg-white p-6 rounded-lg shadow-md text-center">
              <div className="w-20 h-20 mx-auto mb-4">
                <img
                  src="/images/infra_borehole.jpg"
                  alt="Community Boreholes"
                  className="w-full h-full object-contain"
                />
              </div>
              <h3 className="text-xl font-semibold mb-2">Community Boreholes</h3>
              <p className="text-gray-600 text-sm">Reliable water supply</p>
            </div>

            {/* Tarred Roads */}
            <div className="bg-white p-6 rounded-lg shadow-md text-center">
              <div className="w-20 h-20 mx-auto mb-4">
                <img
                  src="/images/infra_roads.jpg"
                  alt="Tarred Roads"
                  className="w-full h-full object-contain"
                />
              </div>
              <h3 className="text-xl font-semibold mb-2">Tarred Roads</h3>
              <p className="text-gray-600 text-sm">Quality road construction</p>
            </div>

            {/* Recreational Parks */}
            <div className="bg-white p-6 rounded-lg shadow-md text-center">
              <div className="w-20 h-20 mx-auto mb-4">
                <img
                  src="/images/infra_park.jpg"
                  alt="Recreational Parks"
                  className="w-full h-full object-contain"
                />
              </div>
              <h3 className="text-xl font-semibold mb-2">Recreational Parks</h3>
              <p className="text-gray-600 text-sm">Leisure & wellness</p>
            </div>
          </div>
        </div>
      </section>

      {/* FEATURED PROPERTIES – unchanged */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Featured Properties</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredProperties.map((property) => (
              <PropertyCard key={property.id} property={property} />
            ))}
          </div>
          <div className="text-center mt-10">
            <Link href="/properties" className="btn-primary inline-flex items-center gap-2">
              View All Properties <ArrowRight size={18} />
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}