import Link from 'next/link';
import { MapPin, Ruler } from 'lucide-react';
import { Property } from '@/types';

export default function PropertyCard({ property }: { property: Property }) {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition">
      <img src={property.image} alt={property.title} className="w-full h-56 object-cover" />
      <div className="p-5">
        <h3 className="text-xl font-bold mb-2">{property.title}</h3>
        <div className="space-y-2 mb-4">
          <div className="flex items-center text-gray-600 text-sm">
            <MapPin size={16} className="mr-2 text-primary" />
            {property.location}
          </div>
          <div className="flex items-center text-gray-600">
            <Ruler size={16} className="mr-2 text-primary" />
            {property.size} m²
          </div>
        </div>
        <p className="text-gray-600 text-sm mb-4 line-clamp-2">{property.description}</p>
        <Link href={`/properties/${property.id}`} className="btn-primary block text-center py-2">
          Inquire Now
        </Link>
      </div>
    </div>
  );
}