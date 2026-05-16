'use client';
import { useState, useEffect } from 'react';
import { Shield, Sun, Droplets, Road, TreePine, Wifi, Home, Activity } from 'lucide-react';

// Array of your images from public/images/ folder
const backgroundImages = [
  '/images/Phase_icon1.jpg',
  '/images/Phase_icon2.jpg',
  '/images/Phase_icon3.jpg',
  '/images/Phase_icon4.jpg',
  '/images/Phase_icon5.jpg',
  '/images/Phase_icon6.jpg',
  '/images/Phase_icon7.jpg',
];

function BackgroundCarousel() {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % backgroundImages.length);
    }, 5000); // Change image every 5 seconds
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="absolute inset-0 w-full h-full overflow-hidden">
      {backgroundImages.map((img, idx) => (
        <div
          key={idx}
          className={`absolute inset-0 transition-opacity duration-1000 bg-cover bg-center ${
            idx === currentIndex ? 'opacity-100' : 'opacity-0'
          }`}
          style={{ backgroundImage: `url(${img})` }}
        />
      ))}
    </div>
  );
}

export default function ServicesPage() {
  const services = [
    { icon: Shield, title: 'Armed Security', desc: '24/7 professional armed response and surveillance systems ensuring complete safety.', color: 'bg-blue-100' },
    { icon: Sun, title: 'Solar Street Lighting', desc: 'Eco-friendly solar-powered street lights illuminating all roads and pathways.', color: 'bg-yellow-100' },
    { icon: Droplets, title: 'Community Boreholes', desc: 'Reliable water supply through multiple boreholes with backup storage systems.', color: 'bg-cyan-100' },
    { icon: Road, title: 'Tarred Roads', desc: 'Well-maintained tarred roads with proper drainage and signage throughout the estate.', color: 'bg-gray-100' },
    { icon: TreePine, title: 'Recreational Parks', desc: 'Beautifully landscaped parks, walking trails, and children play areas.', color: 'bg-green-100' },
    { icon: Wifi, title: 'High-Speed Internet', desc: 'Fiber-ready infrastructure for seamless connectivity.', color: 'bg-purple-100' },
    { icon: Activity, title: 'Fitness Center', desc: 'Modern gym facilities and sports courts for active lifestyles.', color: 'bg-red-100' },
    { icon: Home, title: 'Property Management', desc: 'Professional management services for homeowners and investors.', color: 'bg-indigo-100' },
  ];

  return (
    <div>
      {/* Hero Section with Rotating Background */}
      <div className="relative h-[60vh] flex items-center justify-center overflow-hidden">
        <BackgroundCarousel />
        <div className="absolute inset-0 bg-black/60" />
        <div className="relative z-10 text-center text-white px-4">
          <h1 className="text-4xl md:text-6xl font-bold mb-4">Our Services</h1>
          <p className="text-xl max-w-2xl mx-auto">
            Mzinyathi Gardens offers integrated real estate and infrastructure services designed for modern, sustainable living.
          </p>
        </div>
      </div>

      {/* Services Cards Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {services.map((service, idx) => (
              <div key={idx} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition">
                <div className={`${service.color} p-6 flex justify-center`}>
                  <service.icon className="w-16 h-16 text-primary" />
                </div>
                <div className="p-5">
                  <h3 className="text-xl font-bold mb-2">{service.title}</h3>
                  <p className="text-gray-600">{service.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}