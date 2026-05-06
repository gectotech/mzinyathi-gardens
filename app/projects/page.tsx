'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  Home, Droplets, Zap, Sun, TreePine, Road, 
  Construction, CheckCircle, ArrowRight, 
  Ruler, Bed, Building, MapPin, Users, Shield
} from 'lucide-react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination, Navigation } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';

// Hero images
const heroImages = [
  '/images/he1.jpg',
  '/images/he2.jpg',
  '/images/he3.jpg',
];

// House plans
const housePlans = [
  { id: 1, title: '3 Bedroom', beds: 3, baths: 2, size: '120m²', image: '/images/plan_3bed.jpg', features: ['Open plan living', 'Modern kitchen', 'Garden area'] },
  { id: 2, title: '4 Bedroom', beds: 4, baths: 3, size: '160m²', image: '/images/plan_4bed.jpg', features: ['Master ensuite', 'Scullery', 'Covered patio'] },
  { id: 3, title: '5 Bedroom', beds: 5, baths: 4, size: '200m²', image: '/images/plan_5bed.jpg', features: ['Double garage', 'Study nook', 'Entertainment area'] },
  { id: 4, title: 'Double Story', beds: 5, baths: 4, size: '250m²', image: '/images/plan_double.jpg', features: ['Balcony views', 'Guest suite', 'Rooftop terrace'] },
];

// Completed houses
const completedHouses = [
  { id: 1, title: 'Modern Family Home', image: '/images/house_complete1.jpg', location: 'Phase III' },
  { id: 2, title: 'Eco-friendly Residence', image: '/images/house_complete2.jpg', location: 'Phase V' },
];

// Houses under construction
const underConstructionHouses = [
  { id: 3, title: 'Luxury Villa', image: '/images/house_construction1.jpg', location: 'Phase VII', progress: '60%' },
  { id: 4, title: 'Affordable Stand Build', image: '/images/house_construction2.jpg', location: 'Phase IX', progress: '30%' },
];

// Infrastructure items with descriptions
const infrastructure = [
  { icon: Road, title: 'Tarred Roads', desc: 'High-quality asphalt roads with proper drainage and signage throughout the estate.', image: '/images/infra_roads.jpg' },
  { icon: Droplets, title: 'Community Boreholes', desc: 'Reliable water supply through multiple boreholes with backup storage for uninterrupted service.', image: '/images/infra_borehole.jpg' },
  { icon: Zap, title: 'Solar Street Lights', desc: 'Energy-efficient LED street lighting powered by solar panels, illuminating all pathways.', image: '/images/infra_streetlight.jpg' },
  { icon: Sun, title: 'Solar Systems', desc: 'Pre-installed solar geysers and optional rooftop PV systems for every home.', image: '/images/infra_solar.jpg' },
  { icon: TreePine, title: 'Recreational Parks', desc: 'Beautifully landscaped parks, children’s playgrounds, and walking trails.', image: '/images/infra_park.jpg' },
];

// Phases I to XI with descriptions
const phases = Array.from({ length: 11 }, (_, i) => ({
  id: i + 1,
  name: `Phase ${toRoman(i + 1)}`,
  image: `/images/phase_icon${i + 1}.jpg`,
  description: getPhaseDescription(i + 1),
  status: 'Under Construction',
}));

function toRoman(num: number): string {
  const roman = ['I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX', 'X', 'XI'];
  return roman[num - 1];
}

function getPhaseDescription(phaseNum: number): string {
  const descriptions: Record<number, string> = {
    1: 'KwaNdebele - Emzini wamaTebele. Cultural heritage meets modern living.',
    2: 'Premium stands with panoramic views of the surrounding hills.',
    3: 'Family-focused zone with parks and easy access to schools.',
    4: 'Eco-friendly design with water-wise landscaping.',
    5: 'Close to the main clubhouse and recreational facilities.',
    6: 'Secure enclave with enhanced perimeter walls.',
    7: 'Umqombothi - Wine Estate. Vineyard-inspired living.',
    8: 'Business and commercial node within the estate.',
    9: 'Luxury stands with extra-large plot sizes.',
    10: 'Hilltop views and exclusive privacy.',
    11: 'Mzinyathi Bosch - Matebele Finest. Signature homes.',
  };
  return descriptions[phaseNum] || 'Coming soon. Reserve your stand today.';
}

export default function ProjectsPage() {
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
      <div className="relative h-screen md:h-[90vh] w-full">
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
          <div className="bg-white/20 backdrop-blur-sm rounded-full px-6 py-2 mb-4 border border-white/30">
            <p className="uppercase tracking-wider text-sm md:text-base font-semibold">The Modern Lifestyle | Gated Community</p>
          </div>
          <h1 className="text-5xl md:text-7xl font-bold mb-4 drop-shadow-lg">Building The Matebele Legacy</h1>
          <p className="text-xl md:text-2xl max-w-3xl mx-auto">Creating a sustainable, secure, and culturally rich community for generations to come.</p>
          <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex gap-2">
            {heroImages.map((_, idx) => (
              <button
                key={idx}
                onClick={() => { setCurrentHero(idx); setIsAutoPlaying(false); setTimeout(() => setIsAutoPlaying(true), 10000); }}
                className={`w-3 h-3 rounded-full transition-all ${idx === currentHero ? 'bg-red-500 w-6' : 'bg-white/70'}`}
              />
            ))}
          </div>
        </div>
      </div>

      {/* House Plans Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-blue-600 inline-block border-b-4 border-red-600 pb-2">House Plans</h2>
            <p className="text-gray-600 mt-4 max-w-2xl mx-auto">Choose from our thoughtfully designed layouts to suit your family's needs.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {housePlans.map((plan) => (
              <div key={plan.id} className="bg-blue-50 rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition">
                <img src={plan.image} alt={plan.title} className="w-full h-48 object-cover" />
                <div className="p-5">
                  <div className="flex justify-between items-center mb-2">
                    <h3 className="text-xl font-bold text-blue-600">{plan.title}</h3>
                    <span className="text-sm bg-red-100 text-red-600 px-2 py-1 rounded-full">{plan.size}</span>
                  </div>
                  <div className="flex gap-3 text-gray-600 text-sm mb-3">
                    <span className="flex items-center"><Bed size={14} className="mr-1 text-red-500" /> {plan.beds} beds</span>
                    <span className="flex items-center"><Ruler size={14} className="mr-1 text-red-500" /> {plan.baths} baths</span>
                  </div>
                  <ul className="text-gray-600 text-sm space-y-1 mb-4">
                    {plan.features.map((feat, i) => <li key={i} className="flex items-center"><CheckCircle size={12} className="mr-2 text-blue-500" /> {feat}</li>)}
                  </ul>
                  <button className="w-full bg-blue-600 text-white py-2 rounded-full hover:bg-red-600 transition">Request Plan</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Completed Houses */}
      <section className="py-20 bg-blue-50">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold text-center text-blue-600 mb-4">Completed Homes</h2>
          <p className="text-center text-gray-600 mb-12">Inspiring examples of what you can build in Mzinyathi Gardens.</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {completedHouses.map((house) => (
              <div key={house.id} className="relative group overflow-hidden rounded-2xl shadow-xl">
                <img src={house.image} alt={house.title} className="w-full h-80 object-cover transition duration-500 group-hover:scale-110" />
                <div className="absolute inset-0 bg-gradient-to-t from-blue-900/80 to-transparent flex flex-col justify-end p-6">
                  <h3 className="text-2xl font-bold text-white">{house.title}</h3>
                  <p className="text-white/80 flex items-center"><MapPin size={14} className="mr-1" /> {house.location}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Houses Under Construction */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold text-center text-blue-600 mb-4">Homes Under Construction</h2>
          <p className="text-center text-gray-600 mb-12">Watch your dream home take shape. Many more underway.</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {underConstructionHouses.map((house) => (
              <div key={house.id} className="relative group overflow-hidden rounded-2xl shadow-xl">
                <img src={house.image} alt={house.title} className="w-full h-80 object-cover transition duration-500 group-hover:scale-110" />
                <div className="absolute inset-0 bg-gradient-to-t from-red-900/80 to-transparent flex flex-col justify-end p-6">
                  <div className="flex justify-between items-center">
                    <h3 className="text-2xl font-bold text-white">{house.title}</h3>
                    <span className="bg-white text-red-600 px-3 py-1 rounded-full text-sm font-bold">{house.progress}</span>
                  </div>
                  <p className="text-white/80 flex items-center"><MapPin size={14} className="mr-1" /> {house.location}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Infrastructure & Amenities */}
      <section className="py-20 bg-blue-50">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold text-center text-blue-600 mb-4">World-Class Infrastructure</h2>
          <p className="text-center text-gray-600 mb-12">Every detail designed for comfort, safety, and sustainability.</p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {infrastructure.map((item, idx) => (
              <div key={idx} className="bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition">
                <img src={item.image} alt={item.title} className="w-full h-48 object-cover" />
                <div className="p-5">
                  <div className="flex items-center gap-2 mb-2">
                    <item.icon className="text-red-500" size={24} />
                    <h3 className="text-xl font-bold text-blue-600">{item.title}</h3>
                  </div>
                  <p className="text-gray-600">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Phases with Descriptions */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold text-center text-blue-600 mb-4">Our Phases I – XI</h2>
          <p className="text-center text-gray-600 mb-12">Each phase has its own unique character and advantages.</p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {phases.map((phase) => (
              <div key={phase.id} className="bg-white rounded-2xl shadow-md overflow-hidden hover:shadow-lg transition border-l-4 border-red-500">
                <img src={phase.image} alt={phase.name} className="w-full h-40 object-cover" onError={(e) => (e.currentTarget.src = '/images/placeholder.jpg')} />
                <div className="p-5">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="text-xl font-bold text-blue-600">{phase.name}</h3>
                    <span className="text-xs bg-red-100 text-red-600 px-2 py-1 rounded-full flex items-center gap-1"><Construction size={10} /> {phase.status}</span>
                  </div>
                  <p className="text-gray-600 text-sm mb-3">{phase.description}</p>
                  <Link href="/contact" className="text-blue-600 hover:text-red-600 text-sm font-semibold flex items-center gap-1">Inquire <ArrowRight size={14} /></Link>
                </div>
              </div>
            ))}
          </div>
          <div className="text-center mt-8">
            <p className="text-gray-500 italic">All phases are currently under construction – secure your stand now for best selection.</p>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-20 bg-red-600 text-white text-center">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">Join the Matebele Legacy</h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">Be part of a community built on pride, security, and modern living.</p>
          <Link href="/contact" className="inline-block bg-white text-red-600 px-10 py-4 rounded-full font-bold text-lg hover:bg-gray-100 transition shadow-xl">Contact Sales Team</Link>
        </div>
      </section>
    </div>
  );
}