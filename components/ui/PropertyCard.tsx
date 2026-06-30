import Link from 'next/link';
import { MapPin, Ruler } from 'lucide-react';
import { Property } from '@/types';
import AnimatedCard from '@/components/motion/AnimatedCard';

export default function PropertyCard({ property }: { property: Property }) {
  return (
    <AnimatedCard className="bg-white rounded-lg shadow-md overflow-hidden h-full flex flex-col">
      <div className="overflow-hidden shrink-0">
        <img
          src={property.image}
          alt={property.title}
          className="card-image w-full h-48 sm:h-56 object-cover"
        />
      </div>
      <div className="p-4 sm:p-5 flex flex-col flex-1 min-w-0">
        <h3 className="text-lg sm:text-xl font-bold mb-2 break-words">{property.title}</h3>
        <div className="space-y-2 mb-4">
          <div className="flex items-start text-gray-600 text-sm min-w-0">
            <MapPin size={16} className="mr-2 text-primary shrink-0 mt-0.5" />
            <span className="break-words">{property.location}</span>
          </div>
          <div className="flex items-center text-gray-600 text-sm">
            <Ruler size={16} className="mr-2 text-primary shrink-0" />
            {property.size} m²
          </div>
        </div>
        <p className="text-gray-600 text-sm mb-4 line-clamp-2 flex-1">{property.description}</p>
        <Link
          href={`/properties/${property.id}`}
          className="interactive-btn btn-primary block text-center min-h-[44px] py-2.5 flex items-center justify-center"
        >
          Inquire Now
        </Link>
      </div>
    </AnimatedCard>
  );
}
