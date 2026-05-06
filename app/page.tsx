// app/page.tsx
import Link from 'next/link';
import { ArrowRight, Shield, Sun, Droplets, Road, TreePine } from 'lucide-react';
import { properties } from '@/lib/mockData';
import PropertyCard from '@/components/ui/PropertyCard';

export default function HomePage() {
  const featuredProperties = properties.filter(p => p.featured);

  return (
    <>
      {/* Hero Section */}
      <section
        className="relative h-[90vh] bg-cover bg-center"
        style={{ backgroundImage: 'url(https://images.unsplash.com/photo-1560518883-ce09059eeffa?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80)' }}
      >
        <div className="absolute inset-0 bg-black/50" />
        <div className="relative container mx-auto px-4 h-full flex flex-col justify-center items-center text-center text-white">
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
      </section>

      {/* Features */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Our Premium Services</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
            {[
              { icon: Shield, title: 'Armed Security', desc: '24/7 professional security' },
              { icon: Sun, title: 'Solar Street Lighting', desc: 'Eco-friendly lighting' },
              { icon: Droplets, title: 'Community Boreholes', desc: 'Reliable water supply' },
              { icon: Road, title: 'Tarred Roads', desc: 'Quality road construction' },
              { icon: TreePine, title: 'Recreational Parks', desc: 'Leisure & wellness' },
            ].map((feat, idx) => (
              <div key={idx} className="bg-white p-6 rounded-lg shadow-md text-center">
                <feat.icon className="w-12 h-12 text-primary mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-2">{feat.title}</h3>
                <p className="text-gray-600 text-sm">{feat.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Properties */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Featured Properties</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredProperties.map((property) => (
              <PropertyCard key={property.id} property={property} />
            ))}
          </div>
          <div className="text-center mt-10">
            <Link href="/properties" className="bg-primary text-white px-6 py-3 rounded-md hover:bg-opacity-90 transition inline-flex items-center gap-2">
              View All Properties <ArrowRight size={18} />
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}