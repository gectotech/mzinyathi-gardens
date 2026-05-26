'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Users,
  Home,
  Building2,
  Shield,
  Heart,
  Leaf,
  Scale,
  Target,
  Eye,
  ArrowRight,
  Sparkles,
} from 'lucide-react';
import PageHtmlBlock from '@/components/PageHtmlBlock';

const heroImages = [
  '/images/hero1.jpg',
  '/images/hero4.jpg',
  '/images/hero2.jpg',
];

const stats = [
  { icon: Users, value: '2000+', label: 'Happy Customers' },
  { icon: Home, value: '500+', label: 'Properties Sold' },
  { icon: Building2, value: '50+', label: 'Projects Completed' },
];

const missionPoints = [
  'Community engagement',
  'Environmental responsibility',
  'Affordable, high-quality living',
];

const coreValues = [
  { title: 'Integrity & Transparency', icon: Scale },
  { title: 'Community & Ubuntu', icon: Heart },
  { title: 'Sustainability', icon: Leaf },
  { title: 'Accountability', icon: Shield },
  { title: 'Long-term Value Creation', icon: Target },
];

export default function AboutPage() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  useEffect(() => {
    if (!isAutoPlaying) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % heroImages.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [isAutoPlaying]);

  const goToSlide = (index: number) => {
    setCurrentIndex(index);
    setIsAutoPlaying(false);
    setTimeout(() => setIsAutoPlaying(true), 10000);
  };

  return (
    <main className="bg-white">
      {/* Hero */}
      <section className="relative h-[55vh] min-h-[420px] max-h-[560px] overflow-hidden">
        {heroImages.map((img, idx) => (
          <div
            key={idx}
            className={`absolute inset-0 transition-opacity duration-1000 ${
              idx === currentIndex ? 'opacity-100' : 'opacity-0'
            }`}
          >
            <div className="absolute inset-0 bg-gradient-to-br from-[#0f172a]/75 via-[#4169E1]/40 to-[#DD3210]/30 z-10" />
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={img} alt="" className="w-full h-full object-cover" />
          </div>
        ))}

        <div className="relative z-20 container mx-auto px-4 sm:px-6 h-full flex flex-col justify-center items-center text-center text-white">
          <span className="inline-flex items-center gap-2 text-xs sm:text-sm font-medium uppercase tracking-[0.2em] text-white/80 mb-4">
            <Sparkles size={14} className="text-[#DD3210]" />
            About Mzinyathi Gardens
          </span>
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold max-w-4xl leading-tight">
            The Cradle of{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-white to-blue-200">
              Ubuntu Lokubambana
            </span>
          </h1>
          <p className="mt-4 text-base sm:text-lg text-white/85 max-w-2xl">
            Secure, sustainable gated community living rooted in Matebele heritage — SIYAKWAMUKELA EKHAYA.
          </p>
        </div>

        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2 z-20">
          {heroImages.map((_, idx) => (
            <button
              key={idx}
              onClick={() => goToSlide(idx)}
              aria-label={`Go to slide ${idx + 1}`}
              className={`h-2 rounded-full transition-all duration-300 ${
                idx === currentIndex ? 'w-8 bg-[#DD3210]' : 'w-2 bg-white/60 hover:bg-white/90'
              }`}
            />
          ))}
        </div>
      </section>

      {/* Who We Are */}
      <section className="relative py-20 md:py-24 bg-[#4169E1] overflow-hidden">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_top_right,_white_0%,_transparent_50%)]" />
        <div className="container mx-auto px-4 sm:px-6 relative">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            <div>
              <p className="text-blue-100 text-sm font-semibold uppercase tracking-wider mb-3">
                Who We Are
              </p>
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                The real estate company you can trust to keep it real.
              </h2>
              <p className="text-blue-50/90 text-lg leading-relaxed mb-6">
                Mzinyathi Gardens is a modern gated community designed for secure, comfortable, and
                stylish living. Combining privacy, convenience, and a serene environment, it offers
                residents a safe haven with quality infrastructure and a vibrant sense of community.
              </p>

              <div className="grid grid-cols-3 gap-3 sm:gap-4">
                {stats.map(({ icon: Icon, value, label }) => (
                  <div
                    key={label}
                    className="bg-white rounded-xl p-3 sm:p-4 text-center shadow-lg hover:-translate-y-1 transition-transform duration-300"
                  >
                    <Icon className="w-6 h-6 sm:w-7 sm:h-7 text-[#4169E1] mx-auto mb-2" />
                    <div className="text-xl sm:text-2xl font-bold text-[#4169E1]">{value}</div>
                    <div className="text-[10px] sm:text-xs text-gray-600 leading-tight mt-1">{label}</div>
                  </div>
                ))}
              </div>
            </div>

            <div className="relative">
              <div className="absolute -inset-3 bg-white/20 rounded-2xl blur-sm" />
              <div className="relative rounded-2xl overflow-hidden shadow-2xl ring-2 ring-white/30">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/images/hero1.jpg"
                  alt="Mzinyathi Gardens community"
                  className="w-full aspect-[4/3] object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Where Comfort Meets Security */}
      <section className="py-20 md:py-24 bg-gray-50">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            <div className="order-2 lg:order-1 relative">
              <div className="absolute -left-3 top-6 bottom-6 w-1 bg-[#DD3210] rounded-full hidden lg:block" />
              <div className="rounded-2xl overflow-hidden shadow-xl ring-1 ring-gray-200">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/images/hero4.jpg"
                  alt="Secure modern living at Mzinyathi Gardens"
                  className="w-full aspect-[4/3] object-cover hover:scale-[1.02] transition-transform duration-700"
                />
              </div>
            </div>

            <div className="order-1 lg:order-2">
              <p className="text-[#4169E1] text-sm font-semibold uppercase tracking-wider mb-3">
                Our Promise
              </p>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-5">
                Where Comfort Meets Security
              </h2>
              <p className="text-gray-600 text-lg leading-relaxed mb-4">
                A thoughtfully planned community built for modern lifestyles and lasting value.
                Mzinyathi Gardens offers a perfect balance between modern living and natural
                tranquility.
              </p>
              <p className="text-gray-600 leading-relaxed mb-8">
                Every detail — from road networks to residential layouts — is designed to enhance
                comfort, accessibility, and long-term value. Residents enjoy seamless living, open
                spaces, and a true sense of peace and order.
              </p>
              <Link
                href="/services"
                className="inline-flex items-center gap-2 text-[#4169E1] font-semibold hover:text-[#DD3210] transition-colors group"
              >
                Explore our services
                <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Our Commitment */}
      <section className="py-20 md:py-24 bg-[#4169E1] relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('/images/hero2.jpg')] bg-cover bg-center opacity-10" />
        <div className="container mx-auto px-4 sm:px-6 relative text-center">
          <p className="text-blue-100 text-sm font-semibold uppercase tracking-wider mb-3">
            Our Commitment
          </p>
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-3">
            Because a home can change everything
          </h2>
          <div className="inline-flex items-center justify-center mt-6 mb-5">
            <span className="bg-[#DD3210] text-white px-8 py-3 rounded-full text-lg sm:text-xl font-semibold shadow-lg shadow-red-900/30">
              Live the life you deserve
            </span>
          </div>
          <p className="text-blue-50/90 text-lg max-w-xl mx-auto mb-8">
            A secure and modern environment designed for better everyday living.
          </p>
          <Link
            href="/contact"
            className="inline-flex items-center gap-2 bg-white text-[#4169E1] px-6 py-3 rounded-lg font-semibold hover:bg-blue-50 transition-colors shadow-md"
          >
            Get in Touch
            <ArrowRight size={18} />
          </Link>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="py-20 md:py-24 bg-white">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="text-center mb-12">
            <p className="text-[#4169E1] text-sm font-semibold uppercase tracking-wider mb-2">
              Purpose & Direction
            </p>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900">Mission & Vision</h2>
          </div>

          <div className="grid md:grid-cols-2 gap-6 lg:gap-8 max-w-5xl mx-auto">
            <div className="bg-gradient-to-br from-[#4169E1] to-[#3457c6] rounded-2xl p-8 text-white shadow-xl hover:shadow-2xl transition-shadow">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-white/15 mb-5">
                <Target size={24} />
              </div>
              <h3 className="text-2xl font-bold mb-4">Our Mission</h3>
              <p className="text-blue-50/90 mb-6 leading-relaxed">
                To create a sustainable, innovative, and inclusive housing development that
                prioritizes:
              </p>
              <ul className="space-y-3">
                {missionPoints.map((point) => (
                  <li key={point} className="flex items-center gap-3">
                    <span className="w-2 h-2 rounded-full bg-[#DD3210] shrink-0" />
                    <span className="text-blue-50">{point}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-gradient-to-br from-[#0f172a] to-[#1e293b] rounded-2xl p-8 text-white shadow-xl hover:shadow-2xl transition-shadow flex flex-col justify-center text-center">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-white/10 mx-auto mb-5">
                <Eye size={24} />
              </div>
              <h3 className="text-2xl font-bold mb-4">Our Vision</h3>
              <blockquote className="text-xl sm:text-2xl font-medium italic text-blue-100 leading-relaxed">
                &ldquo;Empowering Communities,
                <br />
                One Home at a Time.&rdquo;
              </blockquote>
            </div>
          </div>
        </div>
      </section>

      {/* Core Values */}
      <section className="py-20 md:py-24 bg-gray-50">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="text-center mb-12">
            <p className="text-[#4169E1] text-sm font-semibold uppercase tracking-wider mb-2">
              What We Stand For
            </p>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900">Core Values</h2>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-5 max-w-5xl mx-auto">
            {coreValues.map(({ title, icon: Icon }) => (
              <div
                key={title}
                className="group bg-white border border-gray-100 rounded-xl p-5 shadow-sm hover:shadow-md hover:border-[#4169E1]/20 hover:-translate-y-0.5 transition-all duration-300"
              >
                <div className="flex items-start gap-4">
                  <div className="shrink-0 w-10 h-10 rounded-lg bg-[#4169E1]/10 flex items-center justify-center group-hover:bg-[#4169E1] transition-colors">
                    <Icon
                      size={20}
                      className="text-[#4169E1] group-hover:text-white transition-colors"
                    />
                  </div>
                  <span className="font-semibold text-gray-800 pt-2">{title}</span>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-14 text-center">
            <Link
              href="/properties"
              className="inline-flex items-center gap-2 bg-[#DD3210] hover:bg-[#c42b0e] text-white px-8 py-3.5 rounded-lg font-semibold transition-colors shadow-md"
            >
              Explore Our Properties
              <ArrowRight size={18} />
            </Link>
          </div>
        </div>
      </section>

      <PageHtmlBlock slug="about" />
    </main>
  );
}
