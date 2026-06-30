// app/properties/page.tsx
'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Search, ArrowRight, Shield, Sun, Droplets, Road, TreePine, Construction, Home } from 'lucide-react';
import { allPhases, phasesData } from '../../lib/housesData';
import PageCmsContent from '@/components/PageCmsContent';
import SectionHero from '@/components/layout/SectionHero';
import PageContainer from '@/components/layout/PageContainer';
import AnimatedCard from '@/components/motion/AnimatedCard';
import { StaggerGrid, StaggerItem } from '@/components/motion/RevealOnScroll';

// Hero images for carousel
const heroImages = [
  '/images/hero1.jpg',
  '/images/hero2.jpg',
  '/images/hero3.jpg',
  '/images/hero4.jpg',
];

// Featured phases for the popular section (Phase I, VII, XI)
const popularPhases = ['phase_i', 'phase_vii', 'phase_xi'];

export default function PropertiesPage() {
  const [searchQuery, setSearchQuery] = useState('');

  const getPopularPhases = () => {
    return popularPhases
      .map(id => phasesData[id])
      .filter(phase => phase);
  };

  // Filter phases based on search only
  const filteredPhases = allPhases.filter(phase => {
    const matchesSearch = phase.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSearch;
  });

  // Get house count for a phase
  const getHouseCount = (phaseId: string) => {
    const phase = phasesData[phaseId];
    return phase?.houses?.length || 0;
  };

  const popularPhasesList = getPopularPhases();

  return (
    <div className="bg-white min-h-screen overflow-x-hidden">
      <SectionHero images={heroImages} altPrefix="Properties">
        <div className="text-center text-white max-w-4xl mx-auto px-2">
          <h1 className="text-display font-bold mb-4 break-words">
            Modern Houses - Mzinyathi Gardens - Esigodlweni samatebele
          </h1>
          <p className="text-heading-lg font-semibold text-yellow-300 mb-4">
            The Matebele Legacy
          </p>
          <p className="text-body-lg max-w-2xl mx-auto">
            Discover secure, modern living in our gated community. Stands available across 12
            unique phases.
          </p>
        </div>
      </SectionHero>

      {/* Search Bar */}
      <div className="page-container -mt-6 sm:-mt-8 relative z-30 pb-2">
        <div className="bg-white rounded-2xl shadow-xl p-1 max-w-2xl mx-auto w-full">
          <div className="flex items-center bg-white rounded-xl px-3 sm:px-4 py-1 border border-gray-200 focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-200 transition-all min-h-[44px]">
            <Search size={20} className="text-blue-500 mr-2 shrink-0" />
            <input
              type="search"
              placeholder="Search by phase name..."
              className="flex-1 min-w-0 px-2 py-2.5 outline-none bg-transparent text-gray-700 placeholder-gray-400 text-base"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              aria-label="Search properties by phase name"
            />
          </div>
        </div>
      </div>

      {/* Popular Properties Section */}
      {popularPhasesList.length > 0 && searchQuery === '' && (
        <section className="py-12 md:py-16">
          <div className="container mx-auto px-4">
            <div className="text-center mb-8 md:mb-12">
              <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-blue-600 mb-3">
                Popular Properties
              </h2>
              <p className="text-gray-600 max-w-2xl mx-auto text-sm md:text-base">
                Our most sought-after phases – each offering a unique living experience
              </p>
            </div>
            <StaggerGrid className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
              {popularPhasesList.map((phase) => (
                <StaggerItem key={phase.id}>
                <AnimatedCard className="bg-white rounded-2xl shadow-lg overflow-hidden border-t-4 border-red-500 h-full">
                  <div className="relative overflow-hidden h-48 sm:h-56 md:h-64">
                    <img
                      src={phase.image}
                      alt={phase.name}
                      className="card-image w-full h-full object-cover"
                    />
                    {phase.status === 'under_construction' && (
                      <div className="absolute top-4 right-4 bg-orange-500 text-white px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1">
                        <Construction size={12} /> Coming Soon
                      </div>
                    )}
                    {phase.status === 'active' && (
                      <div className="absolute top-4 right-4 bg-green-500 text-white px-3 py-1 rounded-full text-xs font-semibold">
                        {getHouseCount(phase.id)} Houses Available
                      </div>
                    )}
                  </div>
                  <div className="p-5">
                    <h3 className="text-xl md:text-2xl font-bold text-blue-600 mb-2 line-clamp-2">
                      {phase.name}
                    </h3>
                    <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                      {phase.description}
                    </p>
                    
                    {/* Phase features preview */}
                    <div className="flex flex-wrap gap-2 mb-4">
                      <Shield size={14} className="text-green-500" />
                      <Sun size={14} className="text-yellow-500" />
                      <Droplets size={14} className="text-blue-500" />
                      <Road size={14} className="text-gray-500" />
                      <TreePine size={14} className="text-green-600" />
                    </div>

                    <Link
                      href={`/properties/phase/${phase.id}`}
                      className="block w-full bg-blue-600 text-white text-center py-2.5 rounded-full text-sm md:text-base font-semibold hover:bg-red-600 transition duration-300"
                    >
                      {phase.status === 'active' ? 'View Houses in this Phase' : 'Register Interest'}
                    </Link>
                  </div>
                </AnimatedCard>
                </StaggerItem>
              ))}
            </StaggerGrid>
          </div>
        </section>
      )}

      {/* All Phases Grid Section */}
      <section className="py-12 md:py-16 bg-blue-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-8 md:mb-12">
            <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-blue-600 mb-3">
              All Phases (I – XII)
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto text-sm md:text-base">
              Choose your perfect location. Each phase offers unique advantages and features
            </p>
          </div>
          
          {filteredPhases.length === 0 ? (
            <div className="text-center py-12">
              <div className="bg-white rounded-2xl p-8 max-w-md mx-auto">
                <Search size={48} className="mx-auto text-gray-400 mb-4" />
                <p className="text-gray-500 text-lg">No phases found matching "{searchQuery}"</p>
                <button
                  onClick={() => setSearchQuery('')}
                  className="mt-4 text-blue-600 hover:text-red-600 font-semibold"
                >
                  Clear Search
                </button>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 md:gap-5">
              {filteredPhases.map((phase) => {
                const phaseData = phasesData[phase.id];
                const houseCount = phaseData?.houses?.length || 0;
                const isActive = phase.status === 'active';
                
                return (
                  <Link
                    key={phase.id}
                    href={`/properties/phase/${phase.id}`}
                    className="group block"
                  >
                    <div className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                      <div className="relative overflow-hidden h-32 sm:h-36 md:h-40">
                        <img
                          src={phase.image}
                          alt={phase.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                        />
                        {!isActive && (
                          <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                            <span className="bg-orange-500 text-white text-xs px-2 py-1 rounded-full flex items-center gap-1">
                              <Construction size={10} /> Coming Soon
                            </span>
                          </div>
                        )}
                        {isActive && houseCount > 0 && (
                          <div className="absolute top-2 right-2 bg-green-500 text-white text-xs px-2 py-1 rounded-full">
                            {houseCount} house{houseCount !== 1 ? 's' : ''}
                          </div>
                        )}
                      </div>
                      <div className="p-3 text-center">
                        <p className="font-bold text-blue-600 text-xs sm:text-sm line-clamp-2">
                          {phase.name}
                        </p>
                        {isActive && houseCount > 0 && (
                          <p className="text-green-600 text-xs mt-1">
                            {houseCount} house{houseCount !== 1 ? 's' : ''} available
                          </p>
                        )}
                        {!isActive && (
                          <p className="text-orange-500 text-xs mt-1 flex items-center justify-center gap-1">
                            <Construction size={10} /> Under Construction
                          </p>
                        )}
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          )}
        </div>
      </section>

      {/* Features Section */}
      <section className="py-12 md:py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-8 md:mb-12">
            <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-blue-600 mb-3">
              Why Choose Mzinyathi Gardens?
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto text-sm md:text-base">
              Every phase comes with these world-class amenities
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-blue-50 p-6 rounded-2xl text-center hover:shadow-lg transition">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Shield className="text-red-500" size={32} />
              </div>
              <h3 className="text-xl font-bold text-blue-600 mb-2">24/7 Armed Security</h3>
              <p className="text-gray-600 text-sm">Professional security with CCTV surveillance and access control</p>
            </div>
            <div className="bg-blue-50 p-6 rounded-2xl text-center hover:shadow-lg transition">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Sun className="text-red-500" size={32} />
              </div>
              <h3 className="text-xl font-bold text-blue-600 mb-2">Solar Solutions</h3>
              <p className="text-gray-600 text-sm">Pre-installed solar geysers and solar street lighting</p>
            </div>
            <div className="bg-blue-50 p-6 rounded-2xl text-center hover:shadow-lg transition">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Droplets className="text-red-500" size={32} />
              </div>
              <h3 className="text-xl font-bold text-blue-600 mb-2">Community Boreholes</h3>
              <p className="text-gray-600 text-sm">Reliable water supply with backup storage</p>
            </div>
            <div className="bg-blue-50 p-6 rounded-2xl text-center hover:shadow-lg transition">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Road className="text-red-500" size={32} />
              </div>
              <h3 className="text-xl font-bold text-blue-600 mb-2">Quality Infrastructure</h3>
              <p className="text-gray-600 text-sm">Tarred roads, recreational parks, and modern amenities</p>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-12 md:py-16 bg-red-600 text-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            <div>
              <div className="text-3xl md:text-4xl font-bold mb-1">12</div>
              <div className="text-sm opacity-90">Phases</div>
            </div>
            <div>
              <div className="text-3xl md:text-4xl font-bold mb-1">24/7</div>
              <div className="text-sm opacity-90">Security</div>
            </div>
            <div>
              <div className="text-3xl md:text-4xl font-bold mb-1">100%</div>
              <div className="text-sm opacity-90">Borehole Water</div>
            </div>
            <div>
              <div className="text-3xl md:text-4xl font-bold mb-1">500+</div>
              <div className="text-sm opacity-90">Happy Families</div>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-12 md:py-20 bg-white text-center">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-blue-600 mb-4">
            Ready to Build Your Dream Home?
          </h2>
          <p className="text-gray-600 text-base md:text-lg mb-6 max-w-2xl mx-auto">
            Contact our sales team to schedule a site tour or inquire about available stands
          </p>
          <Link
            href="/contact"
            className="inline-block bg-red-600 text-white px-8 py-3 rounded-full font-semibold hover:bg-red-700 transition shadow-lg"
          >
            Contact Sales Team
          </Link>
        </div>
      </section>

      <PageCmsContent slug="properties" />
    </div>
  );
}