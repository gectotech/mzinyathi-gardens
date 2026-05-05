import { notFound } from 'next/navigation';
import { properties } from '@/lib/mockData';
import { MapPin, DollarSign, Ruler, Phone, Mail } from 'lucide-react';
import Link from 'next/link';

export default function PropertyDetailPage({ params }: { params: { id: string } }) {
  const property = properties.find(p => p.id === params.id);
  if (!property) return notFound();

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="grid md:grid-cols-2 gap-8">
        <img src={property.image} alt={property.title} className="w-full rounded-lg shadow-md" />
        <div>
          <h1 className="text-3xl font-bold mb-4">{property.title}</h1>
          <div className="space-y-2 mb-6">
            <div className="flex items-center text-gray-600"><MapPin className="mr-2 text-primary" size={18} /> {property.location}</div>
            <div className="flex items-center text-gray-600"><DollarSign className="mr-2 text-primary" size={18} /> ${property.price.toLocaleString()}</div>
            <div className="flex items-center text-gray-600"><Ruler className="mr-2 text-primary" size={18} /> {property.size} m²</div>
          </div>
          <p className="text-gray-700 mb-6">{property.description}</p>
          <div className="bg-gray-100 p-6 rounded-lg">
            <h3 className="text-xl font-semibold mb-3">Request Information</h3>
            <p className="mb-4">Contact us for more details or to schedule a viewing.</p>
            <div className="space-y-2">
              <p className="flex items-center"><Phone size={16} className="mr-2" /> +27 12 345 6789</p>
              <p className="flex items-center"><Mail size={16} className="mr-2" /> sales@mzinyathigardens.co.za</p>
            </div>
            <Link href="/contact" className="btn-primary inline-block mt-4 w-full text-center">Send Inquiry</Link>
          </div>
        </div>
      </div>
    </div>
  );
}