'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';

// If you have images, put them in /public/images/hero1.jpg, hero2.jpg, hero3.jpg, hero4.jpg
// If you don't have them yet, the fallback gradient will show.
const heroImages = [
  '/images/hero1.jpg',
  '/images/hero2.jpg',
  '/images/hero3.jpg',
  '/images/hero4.jpg',
];

export default function HomePage() {
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroImages.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <main>
      <section className="relative h-screen flex items-center justify-center text-white overflow-hidden">
        {/* Fallback background (visible when images are missing or loading) */}
        <div className="absolute inset-0 bg-gradient-to-r from-blue-900 to-primary -z-10" />

        {/* Background images - only show if image exists, but Next.js will handle 404 gracefully */}
        {heroImages.map((img, idx) => (
          <div
            key={idx}
            className={`absolute inset-0 transition-opacity duration-1000 ${
              idx === currentSlide ? 'opacity-100' : 'opacity-0'
            }`}
          >
            <div className="relative w-full h-full">
              <Image
                src={img}
                alt={`Hero ${idx + 1}`}
                fill
                className="object-cover"
                priority={idx === 0}
                sizes="100vw"
                onError={(e) => {
                  // If image fails to load, hide it (fallback to gradient)
                  e.currentTarget.style.display = 'none';
                }}
              />
              <div className="absolute inset-0 bg-black/40" />
            </div>
          </div>
        ))}

        <div className="relative z-10 text-center max-w-4xl mx-auto px-4">
          <h1 className="text-4xl md:text-6xl font-bold mb-4">Mzinyathi Gardens</h1>
          <p className="text-2xl md:text-3xl mb-6 italic">
            “The Cradle of Ubuntu Lokubambana — SIYAKWAMUKELA EKHAYA”
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/properties"
              className="bg-primary hover:bg-primary-dark text-white px-6 py-3 rounded-lg transition"
            >
              Explore Properties
            </Link>
            <Link
              href="/contact"
              className="bg-accent hover:bg-accent-dark text-white px-6 py-3 rounded-lg transition"
            >
              Contact Us
            </Link>
          </div>
        </div>

        <div className="absolute bottom-6 left-0 right-0 flex justify-center gap-2 z-10">
          {heroImages.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentSlide(idx)}
              className={`w-3 h-3 rounded-full transition-all ${
                idx === currentSlide ? 'bg-white w-6' : 'bg-white/50'
              }`}
            />
          ))}
        </div>
      </section>

      {/* Featured Properties (unchanged) */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Featured Properties</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-white rounded-xl shadow-md overflow-hidden">
                <div className="relative h-56">
                  <Image
                    src={`/images/property${i}.jpg`}
                    alt={`Property ${i}`}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, 33vw"
                    onError={(e) => {
                      // Fallback for missing property images
                      (e.target as HTMLImageElement).src = 'https://placehold.co/600x400?text=No+Image';
                    }}
                  />
                </div>
                <div className="p-4">
                  <h3 className="text-xl font-bold">Stand {i}</h3>
                  <p className="text-gray-600">Size: 500m²</p>
                  <p className="text-primary font-bold mt-2">ZAR {i * 150000}</p>
                  <Link href="/properties" className="text-accent hover:underline mt-2 inline-block">
                    View Details →
                  </Link>
                </div>
              </div>
            ))}
          </div>
          <div className="text-center mt-8">
            <Link
              href="/properties"
              className="bg-primary text-white px-6 py-2 rounded-lg hover:bg-primary-dark transition"
            >
              View All Properties
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}