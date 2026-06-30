'use client';

import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import FAQSection from '@/components/ui/FAQSection';
import PageCmsContent from '@/components/PageCmsContent';
import SectionHero from '@/components/layout/SectionHero';
import PageContainer from '@/components/layout/PageContainer';
import AnimatedCard from '@/components/motion/AnimatedCard';
import { StaggerGrid, StaggerItem } from '@/components/motion/RevealOnScroll';

const heroImages = [
  '/images/hero1.jpg',
  '/images/hero2.jpg',
  '/images/hero3.jpg',
  '/images/hero4.jpg',
];

export default function HomePage() {
  return (
    <div className="bg-white overflow-x-hidden">
      <SectionHero images={heroImages} altPrefix="Mzinyathi Gardens">
        <div className="text-center text-white max-w-4xl mx-auto">
          <h1 className="text-display font-bold mb-4 break-words">
            Design Your Dream Living Space
          </h1>
          <p className="text-body-lg max-w-2xl mx-auto mb-8 text-white/95">
            Stylish homes and secure stands in a gated community – elevate your lifestyle with
            Mzinyathi Gardens.
          </p>
          <Link
            href="/properties"
            className="interactive-btn inline-flex items-center justify-center gap-2 min-h-[44px] bg-red-600 text-white px-6 sm:px-8 py-3 rounded-full font-semibold hover:bg-red-700 transition"
          >
            Explore Properties <ArrowRight size={18} className="interactive-icon" />
          </Link>
        </div>
      </SectionHero>

      <section className="py-12 sm:py-16 lg:py-20 bg-blue-50 gradient-shift">
        <PageContainer>
          <StaggerGrid className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            <StaggerItem>
              <AnimatedCard className="bg-white rounded-2xl overflow-hidden shadow-md h-full">
                <div className="overflow-hidden">
                  <img
                    src="/images/security.jpg"
                    alt="Security"
                    className="card-image w-full h-44 sm:h-48 object-cover"
                  />
                </div>
                <div className="p-5 sm:p-6 text-center">
                  <h3 className="text-heading-lg font-bold text-blue-600 mb-2">Armed Security</h3>
                  <p className="text-gray-600 mb-4 text-sm sm:text-base">
                    24/7 professional security with CCTV and access control.
                  </p>
                  <Link
                    href="/services"
                    className="interactive-link text-blue-600 font-semibold hover:text-red-600 inline-flex items-center gap-1 min-h-[44px]"
                  >
                    Learn More <ArrowRight size={14} />
                  </Link>
                </div>
              </AnimatedCard>
            </StaggerItem>
            <StaggerItem>
              <AnimatedCard className="bg-white rounded-2xl overflow-hidden shadow-md h-full">
                <div className="overflow-hidden">
                  <img
                    src="/images/infra_solar.jpg"
                    alt="Solar Systems"
                    className="card-image w-full h-44 sm:h-48 object-cover"
                  />
                </div>
                <div className="p-5 sm:p-6 text-center">
                  <h3 className="text-heading-lg font-bold text-blue-600 mb-2">Solar Solutions</h3>
                  <p className="text-gray-600 mb-4 text-sm sm:text-base">
                    Pre-installed solar geysers and street lighting across all phases.
                  </p>
                  <Link
                    href="/services"
                    className="interactive-link text-blue-600 font-semibold hover:text-red-600 inline-flex items-center gap-1 min-h-[44px]"
                  >
                    Learn More <ArrowRight size={14} />
                  </Link>
                </div>
              </AnimatedCard>
            </StaggerItem>
            <StaggerItem>
              <AnimatedCard className="bg-white rounded-2xl overflow-hidden shadow-md h-full md:col-span-2 lg:col-span-1">
                <div className="overflow-hidden">
                  <img
                    src="/images/infra_borehole.jpg"
                    alt="Borehole"
                    className="card-image w-full h-44 sm:h-48 object-cover"
                  />
                </div>
                <div className="p-5 sm:p-6 text-center">
                  <h3 className="text-heading-lg font-bold text-blue-600 mb-2">
                    Community Boreholes
                  </h3>
                  <p className="text-gray-600 mb-4 text-sm sm:text-base">
                    Reliable water supply from multiple boreholes.
                  </p>
                  <Link
                    href="/services"
                    className="interactive-link text-blue-600 font-semibold hover:text-red-600 inline-flex items-center gap-1 min-h-[44px]"
                  >
                    Learn More <ArrowRight size={14} />
                  </Link>
                </div>
              </AnimatedCard>
            </StaggerItem>
          </StaggerGrid>
        </PageContainer>
      </section>

      <section className="py-12 sm:py-16 lg:py-20">
        <PageContainer>
          <h2 className="text-heading-xl font-bold text-center text-blue-600 mb-4">
            Featured Collections
          </h2>
          <p className="text-center text-gray-600 max-w-2xl mx-auto mb-8 sm:mb-12 text-sm sm:text-base px-2">
            Explore what makes Mzinyathi Gardens the perfect place to call home.
          </p>
          <StaggerGrid className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {[
              {
                img: '/images/phase_icon1.jpg',
                alt: 'View All Phases',
                title: 'View All Phases',
                desc: 'Phase I to XI – secure your piece of land today.',
                href: '/properties',
                link: 'View Properties →',
              },
              {
                img: '/images/house_complete1.jpg',
                alt: 'House Plans',
                title: 'House Plans',
                desc: '3-5 bedroom and double story designs available.',
                href: '/projects#plans',
                link: 'Explore Plans →',
              },
              {
                img: '/images/infra_park.jpg',
                alt: 'Parks',
                title: 'Recreational Parks',
                desc: 'Parks, walking trails, and playgrounds for families.',
                href: '/services',
                link: 'Learn More →',
              },
              {
                img: '/images/phase_icon7.jpg',
                alt: 'Community events at Mzinyathi Gardens',
                title: 'Community Events',
                desc: 'Join the Matebele legacy – Ubuntu spirit.',
                href: '/contact',
                link: 'Get Involved →',
              },
            ].map((item) => (
              <StaggerItem key={item.title}>
                <AnimatedCard className="bg-blue-50 rounded-2xl overflow-hidden shadow-md h-full">
                  <div className="overflow-hidden">
                    <img
                      src={item.img}
                      alt={item.alt}
                      className="card-image w-full h-36 sm:h-40 object-cover"
                    />
                  </div>
                  <div className="p-4 sm:p-5 text-center">
                    <h3 className="text-lg sm:text-xl font-bold text-blue-600">{item.title}</h3>
                    <p className="text-gray-600 text-sm mb-3">{item.desc}</p>
                    <Link
                      href={item.href}
                      className="interactive-link text-blue-600 text-sm font-semibold hover:text-red-600 min-h-[44px] inline-flex items-center justify-center"
                    >
                      {item.link}
                    </Link>
                  </div>
                </AnimatedCard>
              </StaggerItem>
            ))}
          </StaggerGrid>
        </PageContainer>
      </section>

      <section className="py-12 sm:py-16 lg:py-20 bg-blue-50">
        <PageContainer>
          <h2 className="text-heading-xl font-bold text-center text-blue-600 mb-2">
            Latest Phases Released
          </h2>
          <p className="text-center text-gray-600 max-w-2xl mx-auto mb-8 sm:mb-12 text-sm sm:text-base">
            New phases now available for pre-sale. Secure your stand today.
          </p>
          <StaggerGrid className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {[
              {
                img: '/images/phase1.jpg',
                alt: 'Phase I',
                title: 'Phase I: KwaNdebele',
                desc: 'Cultural heritage meets modern living.',
              },
              {
                img: '/images/phase2.jpg',
                alt: 'Phase VII',
                title: 'Phase VII: Umqombothi',
                desc: 'Wine estate inspired living.',
              },
              {
                img: '/images/phase3.jpg',
                alt: 'Phase XI',
                title: 'Phase XI: Mzinyathi Bosch',
                desc: 'Matebele Finest – signature homes.',
              },
            ].map((phase) => (
              <StaggerItem key={phase.title}>
                <AnimatedCard className="bg-white rounded-2xl overflow-hidden shadow-md h-full">
                  <div className="overflow-hidden">
                    <img
                      src={phase.img}
                      alt={phase.alt}
                      className="card-image w-full h-48 sm:h-56 object-cover"
                    />
                  </div>
                  <div className="p-4 sm:p-5">
                    <h3 className="text-lg sm:text-xl font-bold text-blue-600">{phase.title}</h3>
                    <p className="text-gray-600 text-sm mb-2">Stand size: 600 - 1000 sqm</p>
                    <p className="text-gray-500 text-sm mb-4">{phase.desc}</p>
                    <Link
                      href="/properties"
                      className="interactive-btn inline-flex items-center justify-center min-h-[44px] bg-red-600 text-white px-4 py-2 rounded-full text-sm hover:bg-red-700 transition"
                    >
                      View Phase
                    </Link>
                  </div>
                </AnimatedCard>
              </StaggerItem>
            ))}
          </StaggerGrid>
          <div className="text-center mt-8 sm:mt-10">
            <Link
              href="/properties"
              className="interactive-link inline-flex items-center gap-2 min-h-[44px] text-blue-600 font-semibold hover:text-red-600"
            >
              View All Properties <ArrowRight size={16} />
            </Link>
          </div>
        </PageContainer>
      </section>

      <FAQSection />

      <section className="py-12 sm:py-16 lg:py-20 bg-red-600 text-white text-center">
        <PageContainer>
          <h2 className="text-heading-xl font-bold mb-4">Ready to Build Your Dream Home?</h2>
          <p className="text-body-lg mb-8 max-w-2xl mx-auto">
            Contact our sales team to schedule a site tour or inquire about available stands.
          </p>
          <Link
            href="/contact"
            className="interactive-btn inline-flex items-center justify-center min-h-[44px] bg-white text-red-600 px-6 sm:px-8 py-3 rounded-full font-semibold hover:bg-gray-100 transition"
          >
            Get In Touch
          </Link>
        </PageContainer>
      </section>

      <PageCmsContent slug="home" />
    </div>
  );
}
