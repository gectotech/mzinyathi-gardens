'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { Phone, Mail, MapPin, Clock, Send, MessageCircle, ExternalLink, CheckCircle2 } from 'lucide-react';
import PageCmsContent from '@/components/PageCmsContent';
import toast from 'react-hot-toast';

// Three images for rotating hero background – change every 2 seconds
const backgroundImages = [
  '/hero1.jpg',
  '/he10.jpg',
  '/hero12.jpg',
];

export default function ContactPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-white" />}>
      <ContactPageContent />
    </Suspense>
  );
}

function ContactPageContent() {
  const searchParams = useSearchParams();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: '',
    propertyInterest: '',
  });
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    const property = searchParams.get('property');
    if (property) {
      setFormData((prev) => ({
        ...prev,
        propertyInterest: property,
        message: prev.message || `I'm interested in ${property}. `,
      }));
    }
  }, [searchParams]);

  // Rotate background every 2 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % backgroundImages.length);
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setSubmitted(false);
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name.trim(),
          email: formData.email.trim(),
          phone: formData.phone.trim(),
          message: formData.message.trim(),
          ...(formData.propertyInterest ? { propertyInterest: formData.propertyInterest.trim() } : {}),
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to send');
      setSubmitted(true);
      toast.success('Message sent! Our team will respond soon.');
      setFormData({ name: '', email: '', phone: '', message: '', propertyInterest: '' });
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Failed to send message. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const getDirections = (address: string) => {
    const encoded = encodeURIComponent(address);
    return `https://www.google.com/maps/dir/?api=1&destination=${encoded}`;
  };

  const whatsappLink = (phone: string) => {
    const cleaned = phone.replace(/\s/g, '').replace('+', '');
    return `https://wa.me/${cleaned}`;
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section with rotating background (3 images, 2s interval) */}
      <div className="relative h-[400px] md:h-[500px] overflow-hidden">
        {backgroundImages.map((img, idx) => (
          <div
            key={idx}
            className="absolute inset-0 bg-cover bg-center transition-opacity duration-1000"
            style={{
              backgroundImage: `url(${img})`,
              opacity: idx === currentIndex ? 1 : 0,
            }}
          />
        ))}
        {/* Dark overlay for text readability */}
        <div className="absolute inset-0 bg-blue-900/60" />
        <div className="relative container mx-auto px-4 h-full flex flex-col justify-center items-center text-center text-white z-10">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Contact Us</h1>
          <p className="text-lg md:text-xl max-w-2xl">
            Get in touch with Mzinyathi Gardens – your dream home awaits.
          </p>
        </div>
      </div>

      {/* Rest of the contact page – unchanged */}
      <div className="container mx-auto px-4 py-16 md:py-24">
        <div className="grid md:grid-cols-2 gap-12">
          {/* LEFT COLUMN – Contact Information */}
          <div className="space-y-8">
            <div>
              <h2 className="text-2xl md:text-3xl font-bold text-blue-800 mb-4">Get in Touch</h2>
              <p className="text-gray-600">
                We're here to answer your questions about properties, partnerships, or anything else.
              </p>
            </div>

            {/* Phone Numbers */}
            <div className="space-y-4">
              <h3 className="text-xl font-semibold text-blue-800 flex items-center gap-2">
                <Phone size={20} /> Phone & WhatsApp
              </h3>
              <div className="pl-6 border-l-4 border-red-600">
                <p className="font-medium text-gray-800">South Africa</p>
                <div className="flex flex-wrap gap-3 mt-1">
                  <a href="tel:+27760828987" className="text-gray-600 hover:text-blue-800 flex items-center gap-1">
                    <Phone size={14} /> +27 76 082 8987
                  </a>
                  <a
                    href={whatsappLink('27760828987')}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-green-600 hover:text-green-800 flex items-center gap-1"
                  >
                    <MessageCircle size={14} /> WhatsApp
                  </a>
                </div>
              </div>
              <div className="pl-6 border-l-4 border-red-600">
                <p className="font-medium text-gray-800">Zimbabwe</p>
                <div className="space-y-2 mt-1">
                  <div className="flex flex-wrap gap-3">
                    <a href="tel:+263776203372" className="text-gray-600 hover:text-blue-800 flex items-center gap-1">
                      <Phone size={14} /> +263 77 620 3372
                    </a>
                    <a
                      href={whatsappLink('263776203372')}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-green-600 hover:text-green-800 flex items-center gap-1"
                    >
                      <MessageCircle size={14} /> WhatsApp
                    </a>
                  </div>
                  <div className="flex flex-wrap gap-3">
                    <a href="tel:+263771160529" className="text-gray-600 hover:text-blue-800 flex items-center gap-1">
                      <Phone size={14} /> +263 77 116 0529
                    </a>
                    <a
                      href={whatsappLink('263771160529')}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-green-600 hover:text-green-800 flex items-center gap-1"
                    >
                      <MessageCircle size={14} /> WhatsApp
                    </a>
                  </div>
                </div>
              </div>
            </div>

            {/* Email */}
            <div>
              <h3 className="text-xl font-semibold text-blue-800 flex items-center gap-2 mb-2">
                <Mail size={20} /> Email
              </h3>
              <a href="mailto:info@mzinyathigardens.co.zw" className="text-gray-600 hover:text-blue-800">
                info@mzinyathigardens.co.zw
              </a>
            </div>

            {/* Offices */}
            <div className="space-y-6">
              <h3 className="text-xl font-semibold text-blue-800 flex items-center gap-2">
                <MapPin size={20} /> Our Offices
              </h3>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="font-bold text-blue-800">Head Office</p>
                <p className="text-gray-600 text-sm mt-1">
                  125 Harold Road, Hope Valley Subdivision A, Kensington Township 2, Bulawayo
                </p>
                <div className="flex items-center gap-2 text-sm text-gray-500 mt-2">
                  <Clock size={14} /> Monday – Sunday : 08:00 – 17:00
                </div>
                <a
                  href={getDirections("125 Harold Road, Hope Valley Subdivision A, Kensington Township 2, Bulawayo")}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-red-600 text-sm mt-2 hover:underline"
                >
                  Get directions <ExternalLink size={14} />
                </a>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="font-bold text-blue-800">Town Office</p>
                <p className="text-gray-600 text-sm mt-1">
                  Suite 755 Chrysolite House, Fife Street & 9th Avenue, Bulawayo
                </p>
                <div className="flex items-center gap-2 text-sm text-gray-500 mt-2">
                  <Clock size={14} /> Mon-Fri: 08:00-17:00, Sat: 08:00-14:00, Sun: closed
                </div>
                <a
                  href={getDirections("Suite 755 Chrysolite House, Fife Street & 9th Avenue, Bulawayo")}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-red-600 text-sm mt-2 hover:underline"
                >
                  Get directions <ExternalLink size={14} />
                </a>
              </div>
            </div>

            {/* Social Links */}
            <div>
              <h3 className="text-xl font-semibold text-blue-800 mb-3">Follow Us</h3>
              <div className="flex gap-4">
                <a
                  href="https://www.facebook.com/mzinyathigardens"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-600 hover:text-blue-800 transition flex items-center gap-1"
                >
                  <span className="text-xl">📘</span> Facebook
                </a>
                <a
                  href="https://www.instagram.com/mzinyathigardens_official"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-600 hover:text-blue-800 transition flex items-center gap-1"
                >
                  <span className="text-xl">📷</span> Instagram
                </a>
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN – Contact Form */}
          <div className="bg-gray-50 p-6 md:p-8 rounded-lg shadow-md">
            <h2 className="text-2xl font-bold text-blue-800 mb-6">Send us a Message</h2>

            {submitted && (
              <div className="mb-5 flex items-start gap-3 rounded-lg bg-green-50 border border-green-200 p-4 text-green-800">
                <CheckCircle2 size={20} className="shrink-0 mt-0.5" />
                <div className="text-sm">
                  <p className="font-semibold">Message received!</p>
                  <p className="mt-1 text-green-700">Your enquiry was sent to our admin team. We will get back to you soon.</p>
                </div>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              {formData.propertyInterest && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Property Interest</label>
                  <input
                    type="text"
                    readOnly
                    className="w-full border border-blue-200 bg-blue-50 rounded-md px-4 py-2 text-blue-900"
                    value={formData.propertyInterest}
                  />
                </div>
              )}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Full Name *</label>
                <input
                  type="text"
                  required
                  className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email Address *</label>
                <input
                  type="email"
                  required
                  className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number *</label>
                <input
                  type="tel"
                  required
                  className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Message *</label>
                <textarea
                  rows={5}
                  required
                  className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                />
              </div>
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-red-600 text-white py-3 rounded-md hover:bg-red-700 transition disabled:opacity-50 flex items-center justify-center gap-2"
              >
                <Send size={18} /> {loading ? 'Sending...' : 'Send Message'}
              </button>
            </form>
          </div>
        </div>
      </div>
      <PageCmsContent slug="contact" />
    </div>
  );
}