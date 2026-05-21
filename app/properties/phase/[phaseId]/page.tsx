// app/properties/phase/[phaseId]/page.tsx
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { Bed, Ruler, Home, ArrowLeft, CheckCircle, MapPin, Shield, Sun, Droplets, Road, TreePine, Construction, DollarSign } from 'lucide-react';
import { phasesData } from '../../../../lib/housesData';
import type { House, Phase } from '../../../../lib/housesData';

// Generate static params for build time
export async function generateStaticParams() {
  return Object.keys(phasesData).map(phaseId => ({ phaseId }));
}

export default async function PhasePage({ params }: { params: Promise<{ phaseId: string }> }) {
  const { phaseId } = await params;
  const phase = phasesData[phaseId];
  
  if (!phase) {
    notFound();
  }

  // If phase is under construction
  if (phase.status === 'under_construction') {
    return (
      <div className="bg-white min-h-screen">
        <div className="relative h-[50vh] md:h-[60vh] w-full">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-900/80 to-red-900/70 z-10" />
          <img src={phase.image} alt={phase.name} className="w-full h-full object-cover" />
          <div className="relative z-20 container mx-auto px-4 h-full flex flex-col justify-center text-white">
            <Link href="/properties" className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-md hover:bg-white/30 transition-all duration-300 px-5 py-2.5 rounded-full w-fit mb-6 border border-white/40 font-semibold text-white hover:scale-105">
              <ArrowLeft size={18} /> Back to All Properties
            </Link>
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-4">{phase.name}</h1>
            <p className="text-base sm:text-lg md:text-xl max-w-2xl text-white/90">{phase.description}</p>
          </div>
        </div>
        <section className="py-16 md:py-24">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto text-center">
              <div className="bg-blue-50 rounded-3xl p-8 md:p-12 shadow-xl">
                <div className="w-24 h-24 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Construction size={48} className="text-orange-500" />
                </div>
                <h2 className="text-3xl md:text-4xl font-bold text-blue-600 mb-4">Phase Under Construction</h2>
                <p className="text-gray-600 text-lg mb-6">{phase.name} is currently under development. We're creating something special for you!</p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Link href="/contact" className="bg-blue-600 text-white px-8 py-3 rounded-full font-semibold hover:bg-red-600 transition text-center">Register Interest</Link>
                  <Link href="/properties" className="border-2 border-blue-600 text-blue-600 px-8 py-3 rounded-full font-semibold hover:bg-blue-600 hover:text-white transition text-center">Browse Other Phases</Link>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    );
  }

  // Active phase with houses
  return (
    <div className="bg-white min-h-screen">
      {/* Hero Section */}
      <div className="relative min-h-[40vh] md:min-h-[50vh] lg:min-h-[60vh] w-full">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-900/80 to-red-900/70 z-10" />
        <img src={phase.image} alt={phase.name} className="w-full h-full object-cover" />
        <div className="relative z-20 container mx-auto px-4 h-full flex flex-col justify-center text-white">
          <Link href="/properties" className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-md hover:bg-white/30 transition-all duration-300 px-5 py-2.5 rounded-full w-fit mb-6 border border-white/40 font-semibold text-white hover:scale-105">
            <ArrowLeft size={18} /> Back to All Properties
          </Link>
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-4">{phase.name}</h1>
          <p className="text-base sm:text-lg md:text-xl max-w-2xl text-white/90">{phase.description}</p>
        </div>
      </div>

      {/* Phase Description Card */}
      <section className="py-8 md:py-12">
        <div className="container mx-auto px-4">
          <div className="bg-blue-50 rounded-2xl p-6 md:p-8 max-w-4xl mx-auto">
            <h2 className="text-xl md:text-2xl font-bold text-blue-600 mb-3 flex items-center gap-2">
              <MapPin size={24} className="text-red-500" />
              About {phase.name}
            </h2>
            <p className="text-gray-700 text-base md:text-lg leading-relaxed">{phase.description}</p>
          </div>
        </div>
      </section>

      {/* Phase Features Section */}
      <section className="py-8 md:py-12 bg-blue-50">
        <div className="container mx-auto px-4">
          <h2 className="text-xl md:text-2xl font-bold text-center text-blue-600 mb-6">Phase Amenities</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
            {phase.features.map((feature: string, idx: number) => (
              <div key={idx} className="flex items-center gap-2 bg-white p-3 rounded-lg shadow">
                <CheckCircle className="text-red-500 shrink-0" size={16} />
                <span className="text-gray-700 text-xs md:text-sm">{feature}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Houses Grid Section */}
      <section className="py-12 md:py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-8 md:mb-12">
            <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-blue-600 mb-3">
              Available Houses in {phase.name}
            </h2>
            <p className="text-gray-600 text-sm md:text-base">
              Choose your dream home from our selection of beautifully designed houses
            </p>
          </div>

          {phase.houses.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500 text-lg">No houses available yet in this phase.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
              {phase.houses.map((house: House, idx: number) => (
                <div 
                  key={idx} 
                  className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 border-t-4 border-red-500 group"
                >
                  <div className="relative overflow-hidden h-56">
                    <img
                      src={house.image}
                      alt={house.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition duration-500"
                    />
                    <div className="absolute top-4 right-4 bg-red-600 text-white px-3 py-1 rounded-full text-sm font-semibold flex items-center gap-1">
                      <DollarSign size={14} /> {house.price}
                    </div>
                  </div>
                  <div className="p-5">
                    <h3 className="text-xl md:text-2xl font-bold text-blue-600 mb-2">{house.title}</h3>
                    <p className="text-gray-600 text-sm mb-3 line-clamp-2">{house.description}</p>
                    
                    <div className="flex gap-4 text-gray-600 text-sm mb-4 pb-3 border-b border-gray-100">
                      <span className="flex items-center gap-1"><Bed size={16} className="text-red-500" /> {house.beds} beds</span>
                      <span className="flex items-center gap-1"><Ruler size={16} className="text-red-500" /> {house.baths} baths</span>
                      <span className="flex items-center gap-1"><Home size={16} className="text-red-500" /> {house.size} m²</span>
                    </div>

                    <div className="space-y-2 mb-4">
                      <div className="flex items-center gap-2 text-gray-500 text-xs">
                        <Shield size={12} className="text-green-500" />
                        <span>24/7 Security Estate</span>
                      </div>
                      <div className="flex items-center gap-2 text-gray-500 text-xs">
                        <Droplets size={12} className="text-blue-500" />
                        <span>Borehole Water Supply</span>
                      </div>
                      <div className="flex items-center gap-2 text-gray-500 text-xs">
                        <Sun size={12} className="text-yellow-500" />
                        <span>Solar System Installed</span>
                      </div>
                    </div>
                    
                    {/* Updated: Link to Projects page with house details */}
                    <Link 
                      href={`/projects?house=${encodeURIComponent(house.title)}&beds=${house.beds}&baths=${house.baths}&size=${house.size}&price=${encodeURIComponent(house.price)}&id=${house.id}`}
                      className="block w-full bg-blue-600 text-white text-center py-2.5 rounded-full text-sm md:text-base font-semibold hover:bg-red-600 transition duration-300"
                    >
                      View Details & Inquire
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Why Choose This Phase Section */}
      <section className="py-12 md:py-16 bg-blue-50">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl md:text-3xl font-bold text-center text-blue-600 mb-8">Why Choose {phase.name}?</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white p-5 rounded-xl text-center shadow-md hover:shadow-lg transition">
              <div className="w-14 h-14 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3"><Shield className="text-red-500" size={28} /></div>
              <h3 className="font-bold text-blue-600 mb-2">Top Security</h3>
              <p className="text-gray-600 text-sm">24/7 armed response, CCTV, and access control</p>
            </div>
            <div className="bg-white p-5 rounded-xl text-center shadow-md hover:shadow-lg transition">
              <div className="w-14 h-14 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3"><Sun className="text-red-500" size={28} /></div>
              <h3 className="font-bold text-blue-600 mb-2">Solar Ready</h3>
              <p className="text-gray-600 text-sm">Pre-installed solar geysers and street lighting</p>
            </div>
            <div className="bg-white p-5 rounded-xl text-center shadow-md hover:shadow-lg transition">
              <div className="w-14 h-14 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3"><Droplets className="text-red-500" size={28} /></div>
              <h3 className="font-bold text-blue-600 mb-2">Water Security</h3>
              <p className="text-gray-600 text-sm">Community boreholes with backup storage</p>
            </div>
            <div className="bg-white p-5 rounded-xl text-center shadow-md hover:shadow-lg transition">
              <div className="w-14 h-14 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3"><Road className="text-red-500" size={28} /></div>
              <h3 className="font-bold text-blue-600 mb-2">Quality Roads</h3>
              <p className="text-gray-600 text-sm">Tarred roads with proper drainage</p>
            </div>
          </div>
        </div>
      </section>

      {/* Contact CTA */}
      <section className="py-12 md:py-16 bg-red-600 text-white text-center">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl md:text-3xl font-bold mb-4">Ready to Build Your Dream Home?</h2>
          <p className="text-base md:text-lg mb-6 max-w-2xl mx-auto">Contact our sales team to schedule a site tour or inquire about available houses in {phase.name}.</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/contact" className="bg-white text-red-600 px-8 py-3 rounded-full font-semibold hover:bg-gray-100 transition">Contact Sales Team</Link>
            <Link href="/properties" className="border-2 border-white px-8 py-3 rounded-full font-semibold hover:bg-white hover:text-red-600 transition">Browse Other Phases</Link>
          </div>
        </div>
      </section>
    </div>
  );
}