'use client';

import { Shield, Sun, Droplets, Road, TreePine, Wifi, Activity, Home } from 'lucide-react';

// Your brand colors
const blue = '#0055A4';
const red = '#E31C23';

const services = [
  { id: 'security', icon: Shield, title: 'Armed Security', description: '24/7 professional armed response.', hasBackground: true },
  { id: 'solar', icon: Sun, title: 'Solar Street Lighting', description: 'Eco-friendly solar-powered lights.', hasBackground: false },
  { id: 'boreholes', icon: Droplets, title: 'Community Boreholes', description: 'Reliable water supply.', hasBackground: false },
  { id: 'roads', icon: Road, title: 'Tarred Roads', description: 'Well-maintained roads.', hasBackground: false },
  { id: 'parks', icon: TreePine, title: 'Recreational Parks', description: 'Landscaped parks and trails.', hasBackground: false },
  { id: 'internet', icon: Wifi, title: 'High-Speed Internet', description: 'Fiber-ready infrastructure.', hasBackground: false },
  { id: 'fitness', icon: Activity, title: 'Fitness Center', description: 'Modern gym facilities.', hasBackground: false },
  { id: 'management', icon: Home, title: 'Property Management', description: 'Professional management services.', hasBackground: false },
];

export default function ServicesPage() {
  return (
    <div style={{ backgroundColor: 'white' }}>
      {/* Hero section with beautiful double-storey house */}
      <div
        style={{
          backgroundImage: 'url(https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?ixlib=rb-4.0.3&auto=format&fit=crop&w=2075&q=80)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          height: '50vh',
          position: 'relative',
        }}
      >
        {/* Blue overlay */}
        <div style={{ position: 'absolute', inset: 0, backgroundColor: blue, opacity: 0.7, mixBlendMode: 'multiply' }} />
        <div style={{ position: 'relative', height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', color: 'white', textAlign: 'center' }}>
          <h1 style={{ fontSize: '3rem', fontWeight: 'bold' }}>Our <span style={{ color: red }}>Services</span></h1>
          <p style={{ fontSize: '1.2rem', maxWidth: '600px' }}>Discover modern living with premium amenities.</p>
        </div>
      </div>

      {/* Services grid */}
      <div style={{ padding: '4rem 1rem', maxWidth: '1200px', margin: '0 auto' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '1.5rem' }}>
          {services.map((service) =>
            service.hasBackground ? (
              // Armed Security card with your uploaded image as background
              <div
                key={service.id}
                style={{
                  backgroundImage: "url('/images/armed-security-bg.jpg')",
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                  borderRadius: '8px',
                  boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
                  position: 'relative',
                  minHeight: '220px',
                }}
              >
                <div style={{ position: 'absolute', inset: 0, backgroundColor: 'black', opacity: 0.5, borderRadius: '8px' }} />
                <div style={{ position: 'relative', padding: '1.5rem', textAlign: 'center', color: 'white' }}>
                  <service.icon size={48} style={{ margin: '0 auto 1rem', display: 'block' }} />
                  <h3 style={{ fontSize: '1.25rem', fontWeight: 'bold', marginBottom: '0.5rem' }}>{service.title}</h3>
                  <p style={{ fontSize: '0.9rem' }}>{service.description}</p>
                </div>
              </div>
            ) : (
              // Other service cards: white background, blue top border, red hover effect
              <div
                key={service.id}
                style={{
                  backgroundColor: 'white',
                  borderRadius: '8px',
                  boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
                  borderTop: `4px solid ${blue}`,
                  transition: 'all 0.3s',
                  overflow: 'hidden',
                }}
                onMouseEnter={(e) => (e.currentTarget.style.borderTopColor = red)}
                onMouseLeave={(e) => (e.currentTarget.style.borderTopColor = blue)}
              >
                <div style={{ padding: '1.5rem', display: 'flex', justifyContent: 'center', backgroundColor: `${blue}20` }}>
                  <service.icon size={48} style={{ color: blue }} />
                </div>
                <div style={{ padding: '1.25rem' }}>
                  <h3 style={{ fontSize: '1.25rem', fontWeight: 'bold' }}>{service.title}</h3>
                  <p style={{ color: '#4b5563', fontSize: '0.9rem' }}>{service.description}</p>
                </div>
              </div>
            )
          )}
        </div>

        {/* Call to action with red button */}
        <div style={{ textAlign: 'center', marginTop: '4rem' }}>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '1rem' }}>
            Ready to experience <span style={{ color: blue }}>premium living</span>?
          </h2>
          <a
            href="/contact"
            style={{
              display: 'inline-block',
              backgroundColor: red,
              color: 'white',
              padding: '0.75rem 2rem',
              borderRadius: '0.375rem',
              textDecoration: 'none',
              fontWeight: 'bold',
              boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
            }}
          >
            Contact Us Today
          </a>
        </div>
      </div>
    </div>
  );
}