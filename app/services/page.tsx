// app/services/page.tsx
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  Shield, Sun, Droplets, Road, TreePine, Zap, 
  CheckCircle, ArrowRight
} from 'lucide-react';
import PageCmsContent from '@/components/PageCmsContent';

// Hero images for carousel - hero1 to hero4
const heroImages = [
  '/images/hero1.jpg',
  '/images/hero2.jpg',
  '/images/hero3.jpg',
  '/images/hero4.jpg',
];

// Main services data
const mainServices = [
  {
    id: 'security',
    icon: Shield,
    title: 'Armed Security',
    description: '24/7 professional armed response with CCTV surveillance and access control throughout the estate.',
    features: ['24/7 Armed Response', 'CCTV Surveillance', 'Access Control', 'Perimeter Lighting', 'Regular Patrols'],
    image: '/images/security.jpg',
  },
  {
    id: 'solar',
    icon: Sun,
    title: 'Solar Street Lighting',
    description: 'Energy-efficient LED street lighting powered by solar panels, illuminating all pathways for 24/7 security and visibility.',
    features: ['Solar Powered', 'Motion Sensors', 'Energy Efficient', '24/7 Illumination', 'Low Maintenance'],
    image: '/images/infra_streetlight.jpg',
  },
  {
    id: 'boreholes',
    icon: Droplets,
    title: 'Community Boreholes',
    description: 'Multiple boreholes providing reliable water supply to all phases with backup storage tanks for uninterrupted service.',
    features: ['Backup Storage', 'Water Treatment', 'High Capacity Pumps', 'Emergency Supply', 'Regular Testing'],
    image: '/images/infra_borehole.jpg',
  },
  {
    id: 'roads',
    icon: Road,
    title: 'Tarred Roads',
    description: 'High-quality asphalt roads with proper drainage and street signage throughout the estate for smooth accessibility.',
    features: ['Quality Asphalt', 'Proper Drainage', 'Street Signage', 'Speed Bumps', 'Pedestrian Walkways'],
    image: '/images/infra_roads.jpg',
  },
  {
    id: 'parks',
    icon: TreePine,
    title: 'Recreational Parks',
    description: 'Beautifully landscaped parks with playgrounds, walking trails, and picnic areas for families and residents.',
    features: ['Children\'s Playground', 'Walking Trails', 'Picnic Areas', 'Exercise Stations', 'Green Spaces'],
    image: '/images/infra_park.jpg',
  },
  {
    id: 'solar-system',
    icon: Zap,
    title: 'Solar Systems',
    description: 'Pre-installed solar geysers and optional rooftop PV systems for energy independence and cost savings.',
    features: ['Solar Geysers', 'PV Ready', 'Energy Efficient', 'Cost Saving', 'Grid-Tied Option'],
    image: '/images/infra_solar.jpg',
  },
];

export default function ServicesPage() {
  const [currentHero, setCurrentHero] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const [selectedService, setSelectedService] = useState<string | null>(null);

  // Auto-rotate hero background
  useEffect(() => {
    if (!isAutoPlaying) return;
    const interval = setInterval(() => {
      setCurrentHero((prev) => (prev + 1) % heroImages.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [isAutoPlaying]);

  const selectedServiceData = mainServices.find(s => s.id === selectedService);

  return (
    <div className="bg-white min-h-screen">
      {/* Hero Carousel with Gradient Overlay - FULL SCREEN CENTERED TEXT */}
      <div className="relative h-screen w-full">
        {heroImages.map((img, idx) => (
          <div
            key={idx}
            className={`absolute inset-0 transition-opacity duration-1000 ${
              idx === currentHero ? 'opacity-100' : 'opacity-0'
            }`}
          >
            {/* Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-r from-blue-900/70 to-red-900/60 z-10" />
            <img
              src={img}
              alt={`Hero ${idx + 1}`}
              className="w-full h-full object-cover"
            />
          </div>
        ))}
        {/* Centered Content - exactly in the middle of the screen */}
        <div className="relative z-20 container mx-auto px-4 h-full flex items-center justify-center">
          <div className="text-center text-white max-w-3xl">
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold mb-4">
              Our Services
            </h1>
            <p className="text-base sm:text-lg md:text-xl lg:text-2xl">
              World-class amenities and infrastructure designed for modern, secure, and sustainable living
            </p>
          </div>
        </div>
        {/* Hero indicators */}
        <div className="absolute bottom-8 left-0 right-0 flex justify-center gap-2 z-20">
          {heroImages.map((_, idx) => (
            <button
              key={idx}
              onClick={() => {
                setCurrentHero(idx);
                setIsAutoPlaying(false);
                setTimeout(() => setIsAutoPlaying(true), 10000);
              }}
              className={`w-2 h-2 md:w-3 md:h-3 rounded-full transition-all ${
                idx === currentHero ? 'bg-red-500 w-6 md:w-8' : 'bg-white/70'
              }`}
            />
          ))}
        </div>
      </div>

      {/* Services Grid Section */}
      <section className="py-12 md:py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-8 md:mb-12">
            <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-blue-600 mb-3">
              Premium Amenities
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto text-sm md:text-base">
              Every home in Mzinyathi Gardens comes with these world-class features
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {mainServices.map((service) => (
              <div
                key={service.id}
                className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 group cursor-pointer"
                onClick={() => setSelectedService(service.id)}
              >
                <div className="h-56 overflow-hidden">
                  <img
                    src={service.image}
                    alt={service.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition duration-500"
                  />
                </div>
                <div className="p-5">
                  <div className="flex items-center gap-2 mb-2">
                    <service.icon className="text-red-500" size={24} />
                    <h3 className="text-xl font-bold text-blue-600">{service.title}</h3>
                  </div>
                  <p className="text-gray-600 text-sm mb-4 line-clamp-2">{service.description}</p>
                  <div className="flex flex-wrap gap-2 mb-4">
                    {service.features.slice(0, 3).map((feature, idx) => (
                      <span key={idx} className="text-xs bg-blue-50 text-blue-600 px-2 py-1 rounded-full">
                        {feature}
                      </span>
                    ))}
                  </div>
                  <button className="text-blue-600 font-semibold text-sm hover:text-red-600 transition flex items-center gap-1">
                    Learn More <ArrowRight size={14} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Service Detail Modal */}
      {selectedService && selectedServiceData && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-gray-100 p-4 flex justify-between items-center">
              <div className="flex items-center gap-3">
                <selectedServiceData.icon className="text-red-500" size={28} />
                <h2 className="text-xl font-bold text-blue-600">{selectedServiceData.title}</h2>
              </div>
              <button
                onClick={() => setSelectedService(null)}
                className="text-gray-400 hover:text-gray-600 text-2xl"
              >
                ✕
              </button>
            </div>
            <div className="p-6">
              <img
                src={selectedServiceData.image}
                alt={selectedServiceData.title}
                className="w-full h-64 object-cover rounded-xl mb-6"
              />
              <p className="text-gray-700 text-lg mb-6">{selectedServiceData.description}</p>
              <h3 className="text-lg font-bold text-blue-600 mb-3">Key Features</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
                {selectedServiceData.features.map((feature, idx) => (
                  <div key={idx} className="flex items-center gap-2">
                    <CheckCircle className="text-green-500" size={18} />
                    <span className="text-gray-700">{feature}</span>
                  </div>
                ))}
              </div>
              <div className="bg-blue-50 rounded-xl p-4 mt-4">
                <h3 className="font-bold text-blue-600 mb-2">Why This Matters</h3>
                <p className="text-gray-600 text-sm">
                  {selectedServiceData.title} is an essential part of our commitment to providing 
                  a secure, sustainable, and comfortable living environment for all residents at 
                  Mzinyathi Gardens.
                </p>
              </div>
              <div className="mt-6 flex justify-end">
                <Link
                  href="/contact"
                  className="bg-blue-600 text-white px-6 py-2 rounded-full font-semibold hover:bg-red-600 transition"
                >
                  Inquire About This Service
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Why Choose Us Section */}
      <section className="py-12 md:py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-8 md:mb-12">
            <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-blue-600 mb-3">
              Why Choose Mzinyathi Gardens?
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto text-sm md:text-base">
              We deliver excellence in every aspect of community living
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="text-center p-6 bg-blue-50 rounded-xl">
              <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-4 shadow-md">
                <Shield className="text-red-500" size={32} />
              </div>
              <h3 className="font-bold text-blue-600 mb-2">Top Security</h3>
              <p className="text-gray-600 text-sm">24/7 armed response and surveillance</p>
            </div>
            <div className="text-center p-6 bg-blue-50 rounded-xl">
              <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-4 shadow-md">
                <Sun className="text-red-500" size={32} />
              </div>
              <h3 className="font-bold text-blue-600 mb-2">Solar Ready</h3>
              <p className="text-gray-600 text-sm">Energy-efficient and sustainable</p>
            </div>
            <div className="text-center p-6 bg-blue-50 rounded-xl">
              <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-4 shadow-md">
                <Droplets className="text-red-500" size={32} />
              </div>
              <h3 className="font-bold text-blue-600 mb-2">Water Security</h3>
              <p className="text-gray-600 text-sm">Reliable borehole water supply</p>
            </div>
            <div className="text-center p-6 bg-blue-50 rounded-xl">
              <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-4 shadow-md">
                <Road className="text-red-500" size={32} />
              </div>
              <h3 className="font-bold text-blue-600 mb-2">Quality Roads</h3>
              <p className="text-gray-600 text-sm">Tarred roads with proper drainage</p>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-12 md:py-16 bg-red-600 text-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            <div>
              <div className="text-3xl md:text-4xl font-bold mb-1">24/7</div>
              <div className="text-sm opacity-90">Security Coverage</div>
            </div>
            <div>
              <div className="text-3xl md:text-4xl font-bold mb-1">100%</div>
              <div className="text-sm opacity-90">Solar Lighting</div>
            </div>
            <div>
              <div className="text-3xl md:text-4xl font-bold mb-1">6+</div>
              <div className="text-sm opacity-90">Boreholes</div>
            </div>
            <div>
              <div className="text-3xl md:text-4xl font-bold mb-1">12</div>
              <div className="text-sm opacity-90">Phases</div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-12 md:py-20 bg-white text-center">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-blue-600 mb-4">
            Ready to Experience Premium Living?
          </h2>
          <p className="text-gray-600 text-base md:text-lg mb-6 max-w-2xl mx-auto">
            Contact our team to learn more about our services and schedule a site tour.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/contact"
              className="inline-block bg-red-600 text-white px-8 py-3 rounded-full font-semibold hover:bg-red-700 transition shadow-lg"
            >
              Contact Sales Team
            </Link>
            <Link
              href="/properties"
              className="inline-block border-2 border-blue-600 text-blue-600 px-8 py-3 rounded-full font-semibold hover:bg-blue-600 hover:text-white transition"
            >
              Browse Properties
            </Link>
          </div>
        </div>
      </section>

      <PageCmsContent slug="services" />
    </div>
  );
}