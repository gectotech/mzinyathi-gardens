// app/projects/page.tsx
'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { 
  ArrowLeft, Bed, Ruler, Home, DollarSign, Shield, Sun, Droplets, 
  Road, TreePine, FileText, CheckCircle, Zap, Construction, MapPin 
} from 'lucide-react';

// House plan mapping based on bedroom count
const getHousePlanImage = (beds: number, title: string, planId?: string): string => {
  // Check for specific plan ID first
  if (planId) {
    return `/images/${planId}.jpg`;
  }
  // Double story houses use plan_double.jpg
  if (title?.toLowerCase().includes('double-story') || title?.toLowerCase().includes('double story')) {
    return '/images/plan_double.jpg';
  }
  // Based on number of bedrooms
  switch (beds) {
    case 3:
      return '/images/plan_3bed.jpg';
    case 4:
      return '/images/plan_4bed.jpg';
    case 5:
      return '/images/plan_5bed.jpg';
    default:
      return '/images/plan_4bed.jpg';
  }
};

// Completed houses - simple naming
const completedHouses = [
  { id: 1, title: 'House 1', image: '/images/house_complete1.jpg', beds: 4, baths: 3 },
  { id: 2, title: 'House 2', image: '/images/house_complete2.jpg', beds: 3, baths: 2 },
  { id: 3, title: 'House 3', image: '/images/house_complete3.jpg', beds: 5, baths: 4 },
];

// Houses under construction - no percentages
const underConstructionHouses = [
  { id: 4, title: 'House 4', image: '/images/house_construction1.jpg' },
  { id: 5, title: 'House 5', image: '/images/house_construction2.jpg' },
  { id: 6, title: 'House 6', image: '/images/house_construction3.jpg' },
];

// Infrastructure projects
const infrastructureProjects = [
  {
    id: 'roads',
    title: 'Tarred Roads',
    description: 'High-quality asphalt roads with proper drainage and street signage throughout the estate.',
    image: '/images/infra_roads.jpg',
    icon: Road,
  },
  {
    id: 'streetlights',
    title: 'Solar Street Lighting',
    description: 'Energy-efficient LED street lighting powered by solar panels, illuminating all pathways.',
    image: '/images/infra_streetlight.jpg',
    icon: Zap,
  },
  {
    id: 'boreholes',
    title: 'Community Boreholes',
    description: 'Multiple boreholes providing reliable water supply with backup storage tanks.',
    image: '/images/infra_borehole.jpg',
    icon: Droplets,
  },
  {
    id: 'solar',
    title: 'Solar Systems',
    description: 'Pre-installed solar geysers and optional rooftop PV systems for energy independence.',
    image: '/images/infra_solar.jpg',
    icon: Sun,
  },
  {
    id: 'parks',
    title: 'Recreational Parks',
    description: 'Beautifully landscaped parks with playgrounds, walking trails, and picnic areas.',
    image: '/images/infra_park.jpg',
    icon: TreePine,
  },
  {
    id: 'security',
    title: '24/7 Security System',
    description: 'Comprehensive security with CCTV cameras, access control, and armed response.',
    image: '/images/security.jpg',
    icon: Shield,
  },
];

// House plans data with updated prices (no square meters)
const housePlans = [
  // 3 Bedroom Plans - $45,000
  { id: '3bed', name: '3 Bedroom House', beds: 3, baths: 2, price: '$45,000', image: '/images/plan_3bed.jpg' },
  { id: '3bed2', name: '3 Bedroom House - Design 2', beds: 3, baths: 2, price: '$45,000', image: '/images/plan_3bed2.jpg' },
  { id: '3bed3', name: '3 Bedroom House - Design 3', beds: 3, baths: 2, price: '$45,000', image: '/images/plan_3bed3.jpg' },
  { id: '3bed4', name: '3 Bedroom House - Design 4', beds: 3, baths: 2, price: '$45,000', image: '/images/plan_3bed4.jpg' },
  { id: '3bed5', name: '3 Bedroom House - Design 5', beds: 3, baths: 2, price: '$45,000', image: '/images/plan_3bed5.jpg' },
  
  // 4 Bedroom Plans - $55,000
  { id: '4bed', name: '4 Bedroom House', beds: 4, baths: 3, price: '$55,000', image: '/images/plan_4bed.jpg' },
  { id: '4bed2', name: '4 Bedroom House - Design 2', beds: 4, baths: 3, price: '$55,000', image: '/images/plan_4bed2.jpg' },
  { id: '4bed3', name: '4 Bedroom House - Design 3', beds: 4, baths: 3, price: '$55,000', image: '/images/plan_4bed3.jpg' },
  
  // 5 Bedroom Plans - $75,000
  { id: '5bed', name: '5 Bedroom House', beds: 5, baths: 4, price: '$75,000', image: '/images/plan_5bed.jpg' },
  
  // Double Story - $75,000
  { id: 'doublestory', name: 'Double Story House', beds: 5, baths: 4, price: '$75,000', image: '/images/plan_double.jpg' },
];

function HousePlanDetails() {
  const searchParams = useSearchParams();
  const houseTitle = searchParams.get('house');
  const bedsParam = searchParams.get('beds');
  const bathsParam = searchParams.get('baths');
  const priceParam = searchParams.get('price');
  const planIdParam = searchParams.get('planId');

  const [selectedBeds, setSelectedBeds] = useState<number>(bedsParam ? parseInt(bedsParam) : 4);
  const [selectedPlan, setSelectedPlan] = useState<string | null>(planIdParam);

  // Get selected plan data
  const selectedPlanData = selectedPlan 
    ? housePlans.find(p => p.id === selectedPlan)
    : housePlans.find(p => p.beds === selectedBeds);

  const housePlanImage = selectedPlanData 
    ? selectedPlanData.image 
    : getHousePlanImage(selectedBeds, houseTitle || '');

  return (
    <div className="bg-white min-h-screen">
      {/* Hero Section */}
      <div className="relative h-[50vh] md:h-[60vh] w-full bg-gradient-to-r from-blue-800 to-red-800">
        <div className="absolute inset-0 bg-black/40" />
        <div className="relative z-20 container mx-auto px-4 h-full flex flex-col justify-center text-white">
          <Link href="/properties" className="inline-flex items-center gap-2 text-white/80 hover:text-white mb-4 w-fit">
            <ArrowLeft size={16} /> Back to Properties
          </Link>
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-4">House Plans & Designs</h1>
          <p className="text-base sm:text-lg md:text-xl max-w-2xl">Choose from our wide range of beautifully designed house plans</p>
        </div>
      </div>

      {/* Selected House Banner */}
      {houseTitle && (
        <div className="bg-blue-50 border-b border-blue-200 py-4">
          <div className="container mx-auto px-4">
            <div className="flex items-center justify-between flex-wrap gap-4">
              <div>
                <span className="text-sm text-gray-500">Selected Property:</span>
                <h2 className="text-xl font-bold text-blue-600">{houseTitle}</h2>
                <div className="flex gap-4 mt-1 text-sm flex-wrap">
                  <span className="flex items-center gap-1"><Bed size={14} /> {bedsParam || selectedBeds} beds</span>
                  <span className="flex items-center gap-1"><Ruler size={14} /> {bathsParam || (selectedBeds === 3 ? 2 : selectedBeds === 4 ? 3 : 4)} baths</span>
                  <span className="flex items-center gap-1"><DollarSign size={14} /> {priceParam || (selectedBeds === 3 ? '$45,000' : selectedBeds === 4 ? '$55,000' : '$75,000')}</span>
                </div>
              </div>
              <Link href="/contact" className="bg-red-600 text-white px-6 py-2 rounded-full text-sm font-semibold hover:bg-red-700 transition shadow-md">
                Inquire About This Property
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* Current Plan View */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-3 gap-8 mb-12">
            <div className="lg:col-span-2">
              <div className="bg-gradient-to-r from-blue-50 to-blue-100 rounded-2xl p-6 border border-blue-200">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center">
                    <FileText className="text-white" size={24} />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-blue-600">{selectedPlanData?.name || `${selectedBeds}-Bedroom House Plan`}</h3>
                    <p className="text-gray-600 text-sm">Detailed floor plan and specifications</p>
                  </div>
                </div>
                <div className="relative rounded-xl overflow-hidden shadow-lg bg-white p-4">
                  <img
                    src={housePlanImage}
                    alt={`${selectedBeds} Bedroom House Plan`}
                    className="w-full h-auto object-contain"
                  />
                </div>
              </div>
            </div>
            <div className="lg:col-span-1">
              <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-6 sticky top-24">
                <h3 className="text-xl font-bold text-blue-600 mb-4">Plan Specifications</h3>
                <div className="space-y-3 mb-6">
                  <div className="flex justify-between items-center py-2 border-b border-gray-100">
                    <span className="text-gray-500">Plan Name</span>
                    <span className="font-semibold">{selectedPlanData?.name || `${selectedBeds}-Bedroom`}</span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b border-gray-100">
                    <span className="text-gray-500">Bedrooms</span>
                    <span className="font-semibold">{selectedPlanData?.beds || selectedBeds}</span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b border-gray-100">
                    <span className="text-gray-500">Bathrooms</span>
                    <span className="font-semibold">{selectedPlanData?.baths || (selectedBeds === 3 ? 2 : selectedBeds === 4 ? 3 : 4)}</span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b border-gray-100">
                    <span className="text-gray-500">Price</span>
                    <span className="font-semibold text-red-600">{selectedPlanData?.price || (selectedBeds === 3 ? '$45,000' : selectedBeds === 4 ? '$55,000' : '$75,000')}</span>
                  </div>
                </div>
                <Link href="/contact" className="block w-full bg-blue-600 text-white text-center py-3 rounded-xl font-semibold hover:bg-red-600 transition">
                  Request a Quote
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* All House Plans Grid */}
      <section id="plans" className="py-12 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl md:text-3xl font-bold text-center text-blue-600 mb-8">Browse All House Plans</h2>
          
          {/* 3 Bedroom Plans Section - $45,000 */}
          <div className="mb-12">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold text-blue-600 border-l-4 border-red-500 pl-3">3 Bedroom House Plans</h3>
              <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm font-semibold">From $45,000</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
              {housePlans.filter(p => p.beds === 3).map((plan) => (
                <div 
                  key={plan.id} 
                  className={`bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-all cursor-pointer ${selectedPlan === plan.id ? 'ring-2 ring-red-500' : ''}`}
                  onClick={() => {
                    setSelectedPlan(plan.id);
                    setSelectedBeds(plan.beds);
                  }}
                >
                  <img src={plan.image} alt={plan.name} className="w-full h-40 object-cover" />
                  <div className="p-3">
                    <h3 className="text-sm font-bold text-blue-600 mb-1 line-clamp-2">{plan.name}</h3>
                    <div className="flex justify-between text-gray-600 text-xs mb-2">
                      <span><Bed size={12} className="inline" /> {plan.beds} beds</span>
                      <span><Ruler size={12} className="inline" /> {plan.baths} baths</span>
                    </div>
                    <p className="text-red-600 font-semibold text-sm">{plan.price}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* 4 Bedroom Plans Section - $55,000 */}
          <div className="mb-12">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold text-blue-600 border-l-4 border-red-500 pl-3">4 Bedroom House Plans</h3>
              <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm font-semibold">From $55,000</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {housePlans.filter(p => p.beds === 4).map((plan) => (
                <div 
                  key={plan.id} 
                  className={`bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-all cursor-pointer ${selectedPlan === plan.id ? 'ring-2 ring-red-500' : ''}`}
                  onClick={() => {
                    setSelectedPlan(plan.id);
                    setSelectedBeds(plan.beds);
                  }}
                >
                  <img src={plan.image} alt={plan.name} className="w-full h-40 object-cover" />
                  <div className="p-3">
                    <h3 className="text-sm font-bold text-blue-600 mb-1 line-clamp-2">{plan.name}</h3>
                    <div className="flex justify-between text-gray-600 text-xs mb-2">
                      <span><Bed size={12} className="inline" /> {plan.beds} beds</span>
                      <span><Ruler size={12} className="inline" /> {plan.baths} baths</span>
                    </div>
                    <p className="text-red-600 font-semibold text-sm">{plan.price}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* 5 Bedroom & Double Story Plans Section - $75,000 */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold text-blue-600 border-l-4 border-red-500 pl-3">5 Bedroom & Double Story Plans</h3>
              <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm font-semibold">From $75,000</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {housePlans.filter(p => p.beds === 5).map((plan) => (
                <div 
                  key={plan.id} 
                  className={`bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-all cursor-pointer ${selectedPlan === plan.id ? 'ring-2 ring-red-500' : ''}`}
                  onClick={() => {
                    setSelectedPlan(plan.id);
                    setSelectedBeds(plan.beds);
                  }}
                >
                  <img src={plan.image} alt={plan.name} className="w-full h-40 object-cover" />
                  <div className="p-3">
                    <h3 className="text-sm font-bold text-blue-600 mb-1 line-clamp-2">{plan.name}</h3>
                    <div className="flex justify-between text-gray-600 text-xs mb-2">
                      <span><Bed size={12} className="inline" /> {plan.beds} beds</span>
                      <span><Ruler size={12} className="inline" /> {plan.baths} baths</span>
                    </div>
                    <p className="text-red-600 font-semibold text-sm">{plan.price}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Complete Houses Section */}
      <section className="py-12 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-8">
            <h2 className="text-2xl md:text-3xl font-bold text-blue-600 mb-3">Complete Houses</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">Examples of completed homes in Mzinyathi Gardens</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {completedHouses.map((house) => (
              <div key={house.id} className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition group">
                <div className="relative h-64 overflow-hidden">
                  <img src={house.image} alt={house.title} className="w-full h-full object-cover group-hover:scale-110 transition duration-500" />
                  <div className="absolute top-4 right-4 bg-green-600 text-white px-3 py-1 rounded-full text-xs font-semibold">Completed</div>
                </div>
                <div className="p-5">
                  <h3 className="text-xl font-bold text-blue-600 mb-2">{house.title}</h3>
                  <div className="flex gap-3 text-gray-600 text-sm mb-4">
                    <span>{house.beds} beds</span>
                    <span>{house.baths} baths</span>
                  </div>
                  <Link href={`/contact?property=${encodeURIComponent(house.title)}`} className="block w-full bg-blue-600 text-white text-center py-2 rounded-full text-sm font-semibold hover:bg-red-600 transition">
                    Inquire About This Design
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Houses Under Construction Section */}
      <section className="py-12 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-8">
            <h2 className="text-2xl md:text-3xl font-bold text-blue-600 mb-3">Houses Under Construction</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">Currently being built - secure yours today</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {underConstructionHouses.map((house) => (
              <div key={house.id} className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition group">
                <div className="relative h-64 overflow-hidden">
                  <img src={house.image} alt={house.title} className="w-full h-full object-cover group-hover:scale-110 transition duration-500" />
                  <div className="absolute top-4 right-4 bg-orange-500 text-white px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1">
                    <Construction size={12} /> Under Construction
                  </div>
                </div>
                <div className="p-5">
                  <h3 className="text-xl font-bold text-blue-600 mb-2">{house.title}</h3>
                  <Link href={`/contact?property=${encodeURIComponent(house.title)}`} className="block w-full bg-blue-600 text-white text-center py-2 rounded-full text-sm font-semibold hover:bg-red-600 transition">
                    Register Interest
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Infrastructure Section */}
      <section className="py-12 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-8">
            <h2 className="text-2xl md:text-3xl font-bold text-blue-600 mb-3">Infrastructure Development</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">Every detail designed for comfort, safety, and sustainability</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {infrastructureProjects.map((project) => (
              <div key={project.id} className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition">
                <div className="relative h-48 overflow-hidden">
                  <img src={project.image} alt={project.title} className="w-full h-full object-cover" />
                </div>
                <div className="p-5">
                  <div className="flex items-center gap-2 mb-2">
                    <project.icon className="text-red-500" size={24} />
                    <h3 className="text-xl font-bold text-blue-600">{project.title}</h3>
                  </div>
                  <p className="text-gray-600 text-sm">{project.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-12 md:py-16 bg-red-600 text-white text-center">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl md:text-3xl font-bold mb-4">Ready to Start Building?</h2>
          <p className="text-base md:text-lg mb-6 max-w-2xl mx-auto">Contact our team to discuss your preferred house plan and get a detailed quote.</p>
          <Link href="/contact" className="inline-block bg-white text-red-600 px-8 py-3 rounded-full font-semibold hover:bg-gray-100 transition shadow-lg">
            Contact Sales Team
          </Link>
        </div>
      </section>
    </div>
  );
}

// Main component with Suspense
export default function ProjectsPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading projects...</p>
        </div>
      </div>
    }>
      <HousePlanDetails />
    </Suspense>
  );
}