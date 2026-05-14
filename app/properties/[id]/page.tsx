// app/properties/[id]/page.tsx
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { Bed, Ruler, Home, ArrowLeft, Phone, Mail, MapPin, CheckCircle, Calendar, Shield, Sun, Droplets, Wifi } from 'lucide-react';

// Define types
interface House {
  id: string;
  title: string;
  description: string;
  fullDescription: string;
  image: string;
  images: string[];
  beds: number;
  baths: number;
  size: number;
  phase: string;
  phaseId: string;
  price?: string;
  features: string[];
  completionDate?: string;
}

// Mock house data - in production, this would come from a database
const housesData: Record<string, House> = {
  'phase-i-house-1': {
    id: 'phase-i-house-1',
    title: 'Traditional Ndebele Home 1',
    description: 'Beautiful 3-bedroom traditional design with modern finishes',
    fullDescription: 'This stunning home blends traditional Ndebele architecture with modern amenities. Featuring vibrant geometric patterns, a spacious open-plan living area, and a beautiful garden. The home is designed to celebrate cultural heritage while providing contemporary comfort.',
    image: '/images/phase_icon1.jpg',
    images: ['/images/phase_icon1.jpg', '/images/phase1.jpg', '/images/phase_icon1.jpg'],
    beds: 3,
    baths: 2,
    size: 160,
    phase: 'Phase I: KwaNdebele',
    phaseId: 'phase-i',
    features: ['Traditional Ndebele patterns', 'Open plan living', 'Modern kitchen', 'Garden area', 'Parking for 2 cars', 'Pre-paid electricity meter'],
    completionDate: '2025-06-30',
  },
  'phase-i-house-2': {
    id: 'phase-i-house-2',
    title: 'Traditional Ndebele Home 2',
    description: 'Spacious 4-bedroom family home with entertainment area',
    fullDescription: 'A perfect family home that combines traditional aesthetics with functional design. Includes a large entertainment patio, modern finishes, and beautiful landscaping.',
    image: '/images/phase_icon1.jpg',
    images: ['/images/phase_icon1.jpg', '/images/phase1.jpg'],
    beds: 4,
    baths: 3,
    size: 200,
    phase: 'Phase I: KwaNdebele',
    phaseId: 'phase-i',
    features: ['Entertainment patio', 'Built-in braai', 'Walk-in closets', 'Solar geyser', 'Garden irrigation'],
    completionDate: '2025-08-15',
  },
  'phase-vii-house-1': {
    id: 'phase-vii-house-1',
    title: 'Vineyard Estate Home 1',
    description: 'Elegant 4-bedroom home with vineyard views',
    fullDescription: 'Experience wine country living in this elegant home overlooking the estate vineyards. Features a wine cellar, terrace with panoramic views, and premium finishes throughout.',
    image: '/images/phase_icon7.jpg',
    images: ['/images/phase_icon7.jpg', '/images/phase2.jpg'],
    beds: 4,
    baths: 3,
    size: 220,
    phase: 'Phase VII: Umqombothi',
    phaseId: 'phase-vii',
    features: ['Private wine cellar', 'Terrace with views', 'Premium finishes', 'Fireplace', 'Double garage', 'Staff quarters'],
    completionDate: '2025-09-30',
  },
  'phase-xi-house-1': {
    id: 'phase-xi-house-1',
    title: 'Signature Luxury Home 1',
    description: '5-bedroom masterpiece with premium finishes',
    fullDescription: 'The pinnacle of luxury living. This signature home features high-end finishes, spacious rooms, and exclusive access to private amenities within Phase XI.',
    image: '/images/phase_icon11.jpg',
    images: ['/images/phase_icon11.jpg', '/images/phase3.jpg'],
    beds: 5,
    baths: 5,
    size: 320,
    phase: 'Phase XI: Mzinyathi Bosch',
    phaseId: 'phase-xi',
    features: ['Private pool', 'Home theater', 'Gym room', 'Smart home system', 'Triple garage', 'Private garden', 'Concierge service'],
    completionDate: '2025-12-31',
  },
};

// Generate static params for build time
export async function generateStaticParams() {
  return Object.keys(housesData).map(id => ({ id }));
}

// FIXED: params is a Promise, must await it (Next.js 15+)
export default async function PropertyDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const house = housesData[id];
  
  if (!house) {
    notFound();
  }

  return (
    <div className="bg-white min-h-screen">
      {/* Hero Section */}
      <div className="relative h-[50vh] md:h-[60vh] w-full">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-900/70 to-red-900/60 z-10" />
        <img 
          src={house.image} 
          alt={house.title} 
          className="w-full h-full object-cover"
        />
        <div className="relative z-20 container mx-auto px-4 h-full flex flex-col justify-center text-white">
          <Link 
            href={`/properties/phase/${house.phaseId}`}
            className="inline-flex items-center gap-1 text-white/80 hover:text-white mb-4 w-fit"
          >
            <ArrowLeft size={16} /> Back to {house.phase}
          </Link>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-3">{house.title}</h1>
          <p className="text-base sm:text-lg max-w-2xl">{house.description}</p>
        </div>
      </div>

      {/* Property Details */}
      <section className="py-12 md:py-16">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Left Column - Main Content */}
            <div className="lg:col-span-2">
              {/* Main Image Gallery - Simplified */}
              <div className="mb-8">
                <img 
                  src={house.images[0]} 
                  alt={house.title}
                  className="w-full rounded-2xl shadow-lg"
                />
              </div>

              {/* Description */}
              <div className="mb-8">
                <h2 className="text-2xl font-bold text-blue-600 mb-4">Property Description</h2>
                <p className="text-gray-700 leading-relaxed">{house.fullDescription}</p>
              </div>

              {/* Key Features */}
              <div className="mb-8">
                <h2 className="text-2xl font-bold text-blue-600 mb-4">Key Features</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {house.features.map((feature, idx) => (
                    <div key={idx} className="flex items-center gap-2">
                      <CheckCircle className="text-red-500 shrink-0" size={18} />
                      <span className="text-gray-700">{feature}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Community Amenities */}
              <div>
                <h2 className="text-2xl font-bold text-blue-600 mb-4">Community Amenities</h2>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                  <div className="flex items-center gap-2"><Shield className="text-red-500" size={18} /><span className="text-sm">24/7 Security</span></div>
                  <div className="flex items-center gap-2"><Sun className="text-red-500" size={18} /><span className="text-sm">Solar Lighting</span></div>
                  <div className="flex items-center gap-2"><Droplets className="text-red-500" size={18} /><span className="text-sm">Borehole Water</span></div>
                  <div className="flex items-center gap-2"><Wifi className="text-red-500" size={18} /><span className="text-sm">Fiber Ready</span></div>
                  <div className="flex items-center gap-2"><MapPin className="text-red-500" size={18} /><span className="text-sm">Tarred Roads</span></div>
                  <div className="flex items-center gap-2"><Calendar className="text-red-500" size={18} /><span className="text-sm">Parks & Trails</span></div>
                </div>
              </div>
            </div>

            {/* Right Column - Sidebar */}
            <div className="lg:col-span-1">
              {/* Property Specs Card */}
              <div className="bg-blue-50 rounded-2xl p-6 mb-6 sticky top-24">
                <h3 className="text-xl font-bold text-blue-600 mb-4">Property Specifications</h3>
                <div className="space-y-3 mb-6">
                  <div className="flex justify-between items-center pb-2 border-b border-blue-100">
                    <span className="text-gray-600">Bedrooms</span>
                    <span className="font-semibold text-gray-800">{house.beds}</span>
                  </div>
                  <div className="flex justify-between items-center pb-2 border-b border-blue-100">
                    <span className="text-gray-600">Bathrooms</span>
                    <span className="font-semibold text-gray-800">{house.baths}</span>
                  </div>
                  <div className="flex justify-between items-center pb-2 border-b border-blue-100">
                    <span className="text-gray-600">Size</span>
                    <span className="font-semibold text-gray-800">{house.size} m²</span>
                  </div>
                  <div className="flex justify-between items-center pb-2 border-b border-blue-100">
                    <span className="text-gray-600">Phase</span>
                    <span className="font-semibold text-gray-800">{house.phase}</span>
                  </div>
                  {house.completionDate && (
                    <div className="flex justify-between items-center pb-2 border-b border-blue-100">
                      <span className="text-gray-600">Est. Completion</span>
                      <span className="font-semibold text-gray-800">{new Date(house.completionDate).toLocaleDateString()}</span>
                    </div>
                  )}
                </div>

                {/* Contact Buttons */}
                <div className="space-y-3">
                  <Link 
                    href={`/contact?property=${encodeURIComponent(house.title)}`}
                    className="block w-full bg-blue-600 text-white text-center py-3 rounded-full font-semibold hover:bg-red-600 transition"
                  >
                    Inquire Now
                  </Link>
                  <a 
                    href="https://wa.me/263776203372?text=I'm%20interested%20in%20${encodeURIComponent(house.title)}"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block w-full bg-green-600 text-white text-center py-3 rounded-full font-semibold hover:bg-green-700 transition"
                  >
                    WhatsApp Us
                  </a>
                  <a 
                    href="tel:+263776203372"
                    className="block w-full border-2 border-blue-600 text-blue-600 text-center py-3 rounded-full font-semibold hover:bg-blue-600 hover:text-white transition"
                  >
                    Call Us
                  </a>
                </div>
              </div>

              {/* Return to Phase Link */}
              <Link 
                href={`/properties/phase/${house.phaseId}`}
                className="inline-flex items-center gap-1 text-blue-600 hover:text-red-600 transition"
              >
                <ArrowLeft size={14} /> View all houses in {house.phase}
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-12 md:py-16 bg-red-600 text-white text-center">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl md:text-3xl font-bold mb-4">Interested in This Property?</h2>
          <p className="text-base md:text-lg mb-6 max-w-2xl mx-auto">
            Contact our sales team today to schedule a viewing or get more information.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link 
              href={`/contact?property=${encodeURIComponent(house.title)}`}
              className="bg-white text-red-600 px-6 py-2 rounded-full font-semibold hover:bg-gray-100 transition"
            >
              Request More Info
            </Link>
            <Link 
              href="/properties"
              className="border-2 border-white px-6 py-2 rounded-full font-semibold hover:bg-white hover:text-red-600 transition"
            >
              Browse More Properties
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}