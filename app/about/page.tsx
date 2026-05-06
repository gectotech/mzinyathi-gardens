// app/about/page.tsx
'use client';
import { useState, useEffect } from 'react';
import { Users, Home, Building2 } from 'lucide-react';

const heroImages = [
  'https://images.unsplash.com/photo-1560518883-ce09059eeffa?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80',
  'https://images.unsplash.com/photo-1582407947304-fd86f028f716?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80',
  'https://images.unsplash.com/photo-1448630360428-65456885c650?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80',
];

const blue = '#009AC0';
const red = '#DD3210';

export default function AboutPage() {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % heroImages.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const goToSlide = (index: number) => setCurrentIndex(index);

  return (
    <main>
      {/* Hero Section */}
      <section style={{ position: 'relative', height: '50vh', overflow: 'hidden' }}>
        {heroImages.map((img, idx) => (
          <div
            key={idx}
            style={{
              position: 'absolute',
              inset: 0,
              transition: 'opacity 1s',
              opacity: idx === currentIndex ? 1 : 0,
              backgroundImage: `url(${img})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
            }}
          />
        ))}
        <div style={{ position: 'absolute', inset: 0, backgroundColor: blue, opacity: 0.8 }} />
        <div style={{ position: 'relative', height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', textAlign: 'center', color: 'white', zIndex: 10, padding: '0 1rem' }}>
          <h1 style={{ fontSize: 'clamp(2rem, 5vw, 3rem)', fontWeight: 'bold' }}>
            Mzinyathi Gardens – The Cradle of Ubuntu Lokubambana
          </h1>
        </div>
        <div style={{ position: 'absolute', bottom: '1rem', left: 0, right: 0, display: 'flex', justifyContent: 'center', gap: '0.5rem', zIndex: 20 }}>
          {heroImages.map((_, idx) => (
            <button
              key={idx}
              onClick={() => goToSlide(idx)}
              style={{
                width: idx === currentIndex ? '1.5rem' : '0.75rem',
                height: '0.75rem',
                borderRadius: '9999px',
                backgroundColor: idx === currentIndex ? red : 'white',
                transition: 'all 0.3s',
              }}
            />
          ))}
        </div>
      </section>

      {/* Who We Are */}
      <section style={{ padding: '4rem 0', backgroundColor: blue }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '0 1rem' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '3rem', alignItems: 'center' }}>
            <div>
              <h2 style={{ fontSize: '2rem', fontWeight: 'bold', color: 'white', marginBottom: '1rem' }}>Who We Are</h2>
              <p style={{ color: 'white', marginBottom: '1rem', fontSize: '1.1rem' }}>The real estate company you can trust to keep it real.</p>
              <p style={{ color: 'white', marginBottom: '1.5rem' }}>
                Mzinyathi Gardens is a modern gated community designed for secure, comfortable, and stylish living. 
                Combining privacy, convenience, and a serene environment, it offers residents a safe haven with 
                quality infrastructure and a vibrant sense of community.
              </p>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem', marginTop: '2rem' }}>
                <div style={{ textAlign: 'center', backgroundColor: 'white', padding: '0.75rem', borderRadius: '0.5rem' }}>
                  <Users style={{ width: '2rem', height: '2rem', color: blue, margin: '0 auto 0.5rem' }} />
                  <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: blue }}>2000+</div>
                  <div style={{ fontSize: '0.875rem', color: blue }}>Happy Customers</div>
                </div>
                <div style={{ textAlign: 'center', backgroundColor: 'white', padding: '0.75rem', borderRadius: '0.5rem' }}>
                  <Home style={{ width: '2rem', height: '2rem', color: blue, margin: '0 auto 0.5rem' }} />
                  <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: blue }}>500+</div>
                  <div style={{ fontSize: '0.875rem', color: blue }}>Properties Sold</div>
                </div>
                <div style={{ textAlign: 'center', backgroundColor: 'white', padding: '0.75rem', borderRadius: '0.5rem' }}>
                  <Building2 style={{ width: '2rem', height: '2rem', color: blue, margin: '0 auto 0.5rem' }} />
                  <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: blue }}>50+</div>
                  <div style={{ fontSize: '0.875rem', color: blue }}>Projects Completed</div>
                </div>
              </div>
            </div>
            <div style={{ borderRadius: '0.5rem', overflow: 'hidden', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)', border: `2px solid white` }}>
              <img
                src="https://images.unsplash.com/photo-1560518883-ce09059eeffa?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
                alt="Mzinyathi Gardens community"
                style={{ width: '100%', height: 'auto', objectFit: 'cover' }}
              />
            </div>
          </div>
        </div>
      </section>

      {/* Where Comfort Meets Security */}
      <section style={{ padding: '4rem 0', backgroundColor: 'white' }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '0 1rem' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '3rem', alignItems: 'center' }}>
            <div>
              <h3 style={{ fontSize: '1.8rem', fontWeight: 'bold', color: blue, marginBottom: '1rem' }}>Where Comfort Meets Security</h3>
              <p style={{ color: blue, lineHeight: '1.6' }}>
                A thoughtfully planned community built for modern lifestyles and lasting value.
                Mzinyathi Gardens is thoughtfully planned to offer a perfect balance between modern living and natural tranquility. 
                Every detail from road networks to residential layouts is designed to enhance comfort, accessibility, and long-term value for residents. 
                Designed with both functionality and aesthetics in mind, Mzinyathi Gardens provides a well‑structured environment where residents 
                can enjoy seamless living, open spaces, and a true sense of peace and order.
              </p>
            </div>
            <div style={{ borderRadius: '0.5rem', overflow: 'hidden', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)', border: `2px solid ${red}` }}>
              <img
                src="https://images.unsplash.com/photo-1582407947304-fd86f028f716?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
                alt="Secure modern living"
                style={{ width: '100%', height: 'auto', objectFit: 'cover' }}
              />
            </div>
          </div>
        </div>
      </section>

      {/* Our Commitment */}
      <section style={{ padding: '4rem 0', backgroundColor: blue, textAlign: 'center' }}>
        <div style={{ maxWidth: '768px', margin: '0 auto', padding: '0 1rem' }}>
          <h2 style={{ fontSize: '2rem', fontWeight: 'bold', color: 'white', marginBottom: '0.75rem' }}>Our Commitment</h2>
          <p style={{ fontSize: '1.25rem', color: 'white', marginBottom: '1rem' }}>Because a home can change everything</p>
          <div style={{ display: 'inline-block', backgroundColor: red, padding: '0.75rem 1.5rem', borderRadius: '9999px', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }}>
            <h3 style={{ fontSize: '1.5rem', fontWeight: '600', color: 'white', margin: 0 }}>Live the life you deserve</h3>
          </div>
          <p style={{ color: 'white', marginTop: '1rem' }}>A secure and modern environment designed for better everyday living.</p>
        </div>
      </section>

      {/* Mission & Vision */}
      <section style={{ padding: '4rem 0', backgroundColor: 'white' }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '0 1rem' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '2rem' }}>
            <div style={{ backgroundColor: blue, padding: '2rem', borderRadius: '0.5rem', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)', color: 'white' }}>
              <h2 style={{ fontSize: '1.8rem', fontWeight: 'bold', marginBottom: '1rem' }}>Our Mission</h2>
              <p style={{ marginBottom: '1rem', lineHeight: '1.6' }}>
                To create a sustainable, innovative, and inclusive housing development that prioritizes:
              </p>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                <li style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                  <span style={{ width: '0.5rem', height: '0.5rem', backgroundColor: red, borderRadius: '9999px' }}></span>
                  <span>Community engagement</span>
                </li>
                <li style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                  <span style={{ width: '0.5rem', height: '0.5rem', backgroundColor: red, borderRadius: '9999px' }}></span>
                  <span>Environmental responsibility</span>
                </li>
                <li style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <span style={{ width: '0.5rem', height: '0.5rem', backgroundColor: red, borderRadius: '9999px' }}></span>
                  <span>Affordable, high-quality living</span>
                </li>
              </ul>
            </div>
            <div style={{ backgroundColor: blue, padding: '2rem', borderRadius: '0.5rem', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)', textAlign: 'center', color: 'white' }}>
              <h2 style={{ fontSize: '1.8rem', fontWeight: 'bold', marginBottom: '1rem' }}>Our Vision</h2>
              <p style={{ fontStyle: 'italic', fontSize: '1.25rem' }}>“Empowering Communities,<br />One Home at a Time.”</p>
            </div>
          </div>
        </div>
      </section>

      {/* Core Values */}
      <section style={{ padding: '4rem 0', backgroundColor: 'white' }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '0 1rem' }}>
          <h2 style={{ fontSize: '2rem', fontWeight: 'bold', textAlign: 'center', color: blue, marginBottom: '3rem' }}>Core Values</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1.5rem' }}>
            {[
              'Integrity & Transparency',
              'Community & Ubuntu',
              'Sustainability',
              'Accountability',
              'Long-term Value Creation',
            ].map((value) => (
              <div key={value} style={{ backgroundColor: blue, color: 'white', padding: '1.25rem', borderRadius: '0.5rem', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)', transition: 'transform 0.3s', cursor: 'default' }}>
                <span style={{ fontWeight: '600', fontSize: '1.1rem' }}>{value}</span>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}