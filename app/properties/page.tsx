import Image from 'next/image';

const properties = [
  { id: 1, name: 'Sunset Stand', size: '500m²', price: 'ZAR 150,000', image: '/images/property1.jpg', location: 'Phase 1' },
  { id: 2, name: 'Green Valley Stand', size: '600m²', price: 'ZAR 180,000', image: '/images/property2.jpg', location: 'Phase 1' },
  { id: 3, name: 'Hilltop Stand', size: '750m²', price: 'ZAR 220,000', image: '/images/property3.jpg', location: 'Phase 2' },
  { id: 4, name: 'Riverside Stand', size: '400m²', price: 'ZAR 130,000', image: '/images/property1.jpg', location: 'Phase 2' },
];

export default function PropertiesPage() {
  return (
    <main className="container mx-auto px-4 py-12">
      <h1 className="text-4xl font-bold text-primary mb-8 text-center">Available Residential Stands</h1>
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
        {properties.map((prop) => (
          <div key={prop.id} className="bg-white rounded-xl shadow-md overflow-hidden">
            <div className="relative h-56">
              <Image
                src={prop.image}
                alt={prop.name}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 33vw"
              />
            </div>
            <div className="p-4">
              <h2 className="text-xl font-bold">{prop.name}</h2>
              <p className="text-gray-600">Size: {prop.size}</p>
              <p className="text-gray-600">Location: {prop.location}</p>
              <p className="text-primary font-bold text-lg mt-2">{prop.price}</p>
              <button className="mt-3 bg-accent text-white px-4 py-2 rounded-lg hover:bg-accent-dark transition">
                Inquire Now
              </button>
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}