import { Shield, Sun, Droplets, Road, TreePine } from 'lucide-react';

const services = [
  { icon: Shield, title: 'Armed Security', desc: 'Ensuring safety within the gated community 24/7.' },
  { icon: Sun, title: 'Solar Street Lighting', desc: 'Sustainable and energy-efficient lighting solutions.' },
  { icon: Droplets, title: 'Community Boreholes', desc: 'Reliable water supply infrastructure.' },
  { icon: Road, title: 'Tarred Roads', desc: 'High-quality road construction for accessibility.' },
  { icon: TreePine, title: 'Recreational Parks', desc: 'Spaces designed for leisure, wellness, and community interaction.' },
];

export default function ServicesPage() {
  return (
    <main className="container mx-auto px-4 py-12">
      <h1 className="text-4xl font-bold text-primary mb-8 text-center">Our Services</h1>
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-5xl mx-auto">
        {services.map(({ icon: Icon, title, desc }) => (
          <div key={title} className="bg-white rounded-lg shadow-md p-6 text-center hover:shadow-lg transition">
            <Icon className="w-12 h-12 text-primary mx-auto mb-4" />
            <h2 className="text-xl font-bold mb-2">{title}</h2>
            <p className="text-gray-600">{desc}</p>
          </div>
        ))}
      </div>
    </main>
  );
}