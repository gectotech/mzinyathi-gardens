'use client';

import Link from 'next/link';
import { Phone, MessageCircle, Video, MapPin, Clock, Mail, ExternalLink, ChevronRight } from 'lucide-react';

export default function ContactPage() {
  return (
    <div className="bg-white">
      {/* Hero Section with he1.jpg */}
      <section className="relative h-[50vh] md:h-[60vh] bg-cover bg-center" style={{ backgroundImage: 'url(/images/he1.jpg)' }}>
        <div className="absolute inset-0 bg-gradient-to-r from-blue-900/70 to-red-900/60" />
        <div className="relative container mx-auto px-4 h-full flex flex-col justify-center items-start text-white">
          <h1 className="text-4xl md:text-6xl font-bold mb-4">Contact Us</h1>
          <p className="text-xl md:text-2xl max-w-2xl">Get in touch with our team to find your perfect home or inquire about available stands.</p>
        </div>
      </section>

      {/* Main Contact Section - HubSpot style */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12">
            {/* Left Column - Call, Chat, Demo */}
            <div>
              <h2 className="text-3xl font-bold text-blue-600 mb-6">Connect With Our Sales Team</h2>
              <p className="text-gray-600 mb-8">
                We're here to help you find your dream stand or home. Choose how you'd like to reach us.
              </p>

              {/* Call Option */}
              <div className="bg-blue-50 rounded-2xl p-6 mb-6 border-l-4 border-red-500">
                <div className="flex items-center gap-3 mb-3">
                  <Phone className="text-red-500" size={28} />
                  <h3 className="text-xl font-bold text-blue-600">Call us directly</h3>
                </div>
                <div className="space-y-3 ml-11">
                  <div className="flex flex-wrap gap-4 items-center">
                    <span className="text-gray-800 font-mono">+263 77 620 3372</span>
                    <div className="flex gap-2">
                      <a href="tel:+263776203372" className="bg-blue-600 text-white px-3 py-1 rounded-full text-sm hover:bg-red-600 transition">Call</a>
                      <a href="https://wa.me/263776203372" target="_blank" rel="noopener noreferrer" className="bg-green-600 text-white px-3 py-1 rounded-full text-sm hover:bg-green-700 transition">WhatsApp</a>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-4 items-center">
                    <span className="text-gray-800 font-mono">+263 77 116 0529</span>
                    <div className="flex gap-2">
                      <a href="tel:+263771160529" className="bg-blue-600 text-white px-3 py-1 rounded-full text-sm hover:bg-red-600 transition">Call</a>
                      <a href="https://wa.me/263771160529" target="_blank" rel="noopener noreferrer" className="bg-green-600 text-white px-3 py-1 rounded-full text-sm hover:bg-green-700 transition">WhatsApp</a>
                    </div>
                  </div>
                </div>
              </div>

              {/* Chat / WhatsApp Option */}
              <div className="bg-blue-50 rounded-2xl p-6 mb-6 border-l-4 border-red-500">
                <div className="flex items-center gap-3 mb-3">
                  <MessageCircle className="text-red-500" size={28} />
                  <h3 className="text-xl font-bold text-blue-600">Chat with our sales team</h3>
                </div>
                <div className="ml-11">
                  <a href="https://wa.me/263776203372" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 bg-green-600 text-white px-5 py-2 rounded-full hover:bg-green-700 transition">
                    Chat on WhatsApp <ExternalLink size={16} />
                  </a>
                </div>
              </div>

              {/* Demo / Site Visit Option */}
              <div className="bg-blue-50 rounded-2xl p-6 border-l-4 border-red-500">
                <div className="flex items-center gap-3 mb-3">
                  <Video className="text-red-500" size={28} />
                  <h3 className="text-xl font-bold text-blue-600">Get a site tour</h3>
                </div>
                <div className="ml-11">
                  <p className="text-gray-600 mb-3">Schedule a physical or virtual tour of available stands and model homes.</p>
                  <Link href="/contact?demo=true" className="inline-flex items-center gap-2 bg-blue-600 text-white px-5 py-2 rounded-full hover:bg-red-600 transition">
                    Request a tour <ChevronRight size={16} />
                  </Link>
                </div>
              </div>
            </div>

            {/* Right Column - Offices and Hours */}
            <div>
              <h2 className="text-3xl font-bold text-blue-600 mb-6">Our Offices</h2>
              
              {/* Head Office */}
              <div className="bg-white rounded-2xl shadow-md p-6 mb-8 border border-blue-100">
                <h3 className="text-xl font-bold text-blue-600 mb-2">Head Office</h3>
                <div className="flex items-start gap-2 text-gray-700 mb-2">
                  <MapPin size={18} className="text-red-500 mt-0.5 flex-shrink-0" />
                  <span>125 Harold, Hope Valley Subdivision A, Kensington Township 2, Bulawayo</span>
                </div>
                <div className="flex items-start gap-2 text-gray-700 mb-3">
                  <Clock size={18} className="text-red-500 mt-0.5 flex-shrink-0" />
                  <div>
                    <p>Monday - Sunday: 08:00 AM - 17:00 PM</p>
                  </div>
                </div>
                <a 
                  href="https://www.google.com/maps/dir/?api=1&destination=125+Harold+Hope+Valley+Subdivision+A+Kensington+Township+2+Bulawayo" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-blue-600 hover:text-red-600 text-sm font-medium"
                >
                  Get directions <ExternalLink size={14} />
                </a>
              </div>

              {/* Town Office */}
              <div className="bg-white rounded-2xl shadow-md p-6 border border-blue-100">
                <h3 className="text-xl font-bold text-blue-600 mb-2">Town Office</h3>
                <div className="flex items-start gap-2 text-gray-700 mb-2">
                  <MapPin size={18} className="text-red-500 mt-0.5 flex-shrink-0" />
                  <span>Suite 755 Chrysolite House, Fife Street & 9th Avenue, Bulawayo</span>
                </div>
                <div className="flex items-start gap-2 text-gray-700 mb-3">
                  <Clock size={18} className="text-red-500 mt-0.5 flex-shrink-0" />
                  <div>
                    <p>Monday - Friday: 08:00 AM - 17:00 PM</p>
                    <p>Saturday: 08:00 AM - 14:00 PM</p>
                    <p>Sunday: Closed</p>
                  </div>
                </div>
                <a 
                  href="https://www.google.com/maps/dir/?api=1&destination=Chrysolite+House+Fife+Street+9th+Avenue+Bulawayo" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-blue-600 hover:text-red-600 text-sm font-medium"
                >
                  Get directions <ExternalLink size={14} />
                </a>
              </div>

              {/* Email Contact */}
              <div className="mt-8 p-6 bg-blue-50 rounded-2xl text-center">
                <Mail className="text-red-500 mx-auto mb-2" size={28} />
                <h3 className="text-lg font-bold text-blue-600">Email Us</h3>
                <a href="mailto:info@mzinyathigardens.co.za" className="text-blue-600 hover:text-red-600 underline">
                  info@mzinyathigardens.co.za
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Optional: Map embed or additional CTA */}
      <section className="py-12 bg-red-600 text-white text-center">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl font-bold mb-2">Ready to find your dream home?</h2>
          <p className="mb-4">Speak to our sales team today.</p>
          <Link href="/properties" className="inline-block bg-white text-red-600 px-6 py-2 rounded-full font-semibold hover:bg-gray-100 transition">
            Browse Properties
          </Link>
        </div>
      </section>
    </div>
  );
}