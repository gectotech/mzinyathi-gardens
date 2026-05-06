// app/properties/phase/[phaseId]/page.tsx
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { phasesData } from '@/lib/housesData';
import { Bed, Ruler, Home, ArrowLeft, CheckCircle } from 'lucide-react';

export async function generateStaticParams() {
  return Object.keys(phasesData).map(phaseId => ({ phaseId }));
}

export default function PhasePage({ params }: { params: { phaseId: string } }) {
  const phase = phasesData[params.phaseId];
  if (!phase) return notFound();

  return (
    <div className="bg-white min-h-screen">
      {/* Hero */}
      <div className="relative h-[40vh] md:h-[50vh] w-full">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-900/70 to-red-900/60 z-10" />
        <img src={phase.image} alt={phase.name} className="w-full h-full object-cover" />
        <div className="relative z-20 container mx-auto px-4 h-full flex flex-col justify-center text-white">
          <Link href="/properties" className="flex items-center gap-1 text-white/80 hover:text-white mb-4 w-fit">
            <ArrowLeft size={16} /> Back to Properties
          </Link>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-2">{phase.name}</h1>
          <p className="text-base sm:text-lg max-w-2xl">{phase.description}</p>
        </div>
      </div>

      {/* Houses Grid */}
      <section className="py-12 md:py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl md:text-3xl font-bold text-blue-600 text-center mb-8">Available Houses in This Phase</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {phase.houses.map((house) => (
              <div key={house.id} className="bg-white rounded-2xl shadow-md overflow-hidden hover:shadow-xl transition border-t-4 border-red-500">
                <img src={house.image} alt={house.title} className="w-full h-56 object-cover" />
                <div className="p-5">
                  <h3 className="text-xl font-bold text-blue-600 mb-2">{house.title}</h3>
                  <p className="text-gray-600 text-sm mb-3">{house.description}</p>
                  <div className="flex gap-4 text-gray-600 text-sm mb-4">
                    <span className="flex items-center gap-1"><Bed size={14} /> {house.beds} beds</span>
                    <span className="flex items-center gap-1"><Ruler size={14} /> {house.baths} baths</span>
                    <span className="flex items-center gap-1"><Home size={14} /> {house.size} m²</span>
                  </div>
                  <Link href={`/contact?property=${encodeURIComponent(house.title)}`} className="block w-full bg-blue-600 text-white text-center py-2 rounded-full hover:bg-red-600 transition">
                    Inquire About This House
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-12 md:py-16 bg-blue-50">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl md:text-3xl font-bold text-center text-blue-600 mb-8">Features of {phase.name}</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 max-w-3xl mx-auto">
            {phase.features.map((feature, idx) => (
              <div key={idx} className="flex items-center gap-2 bg-white p-3 rounded-lg shadow">
                <CheckCircle className="text-red-500 shrink-0" size={20} />
                <span className="text-gray-700 text-sm">{feature}</span>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}