// app/faq/page.tsx
'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ChevronDown, ChevronUp, HelpCircle, Phone, Mail, MessageCircle } from 'lucide-react';

// FAQ data
const faqCategories = [
  {
    id: 'general',
    name: 'General Questions',
    icon: HelpCircle,
    questions: [
      {
        id: 1,
        question: 'What is Mzinyathi Gardens?',
        answer: 'Mzinyathi Gardens is a gated community real estate development in Zimbabwe, offering secure, modern living with world-class amenities including 24/7 security, solar street lighting, community boreholes, tarred roads, and recreational parks.'
      },
      {
        id: 2,
        question: 'Where is Mzinyathi Gardens located?',
        answer: 'Our head office is located at 125 Harold, Hope Valley Subdivision A, Kensington Township 2, Bulawayo. We also have a town office at Suite 755 Chrysolite House, Fife Street & 9th Avenue, Bulawayo.'
      },
      {
        id: 3,
        question: 'What phases are currently available?',
        answer: 'We have phases I to XII available. Phases I, II, III, IV, V, VI, VII, VIII, and X are currently active with houses available. Phases IX, XI, XII, and 2 Acre plots are coming soon.'
      },
      {
        id: 4,
        question: 'What is the Matebele Legacy?',
        answer: 'The Matebele Legacy represents our commitment to honoring Ndebele heritage and culture while providing modern, sustainable living solutions for the community.'
      }
    ]
  },
  {
    id: 'properties',
    name: 'Properties & Stands',
    icon: HelpCircle,
    questions: [
      {
        id: 5,
        question: 'What sizes of stands are available?',
        answer: 'Stand sizes range from 600 to 1000 square meters, depending on the phase and location within the estate.'
      },
      {
        id: 6,
        question: 'How do I get pricing information?',
        answer: 'Please contact our sales team for current availability and pricing. We will provide a tailored quote based on your preferred property and payment plan.'
      },
      {
        id: 7,
        question: 'Do you offer house plans?',
        answer: 'Yes, we have multiple house plans available including 3-bedroom, 4-bedroom, 5-bedroom, and double-story designs. You can view all plans on our Projects page.'
      },
      {
        id: 8,
        question: 'Can I customize my house?',
        answer: 'Yes, we offer customization options for our house plans. Contact our sales team to discuss your specific requirements.'
      }
    ]
  },
  {
    id: 'amenities',
    name: 'Amenities & Services',
    icon: HelpCircle,
    questions: [
      {
        id: 9,
        question: 'What security features are available?',
        answer: 'We provide 24/7 armed security, CCTV surveillance, access control systems, perimeter lighting, and regular patrols throughout the estate.'
      },
      {
        id: 10,
        question: 'Is there reliable water supply?',
        answer: 'Yes, we have community boreholes with backup storage tanks ensuring uninterrupted water supply to all phases.'
      },
      {
        id: 11,
        question: 'Are there solar solutions?',
        answer: 'Yes, we have solar street lighting throughout the estate and pre-installed solar geysers for each home.'
      },
      {
        id: 12,
        question: 'What recreational facilities are available?',
        answer: 'We have beautifully landscaped parks, children\'s playgrounds, walking trails, picnic areas, and outdoor exercise stations.'
      }
    ]
  },
  {
    id: 'purchase',
    name: 'Purchasing Process',
    icon: HelpCircle,
    questions: [
      {
        id: 13,
        question: 'How do I purchase a stand or house?',
        answer: 'Contact our sales team via phone, WhatsApp, or email. They will guide you through the available options and the purchasing process.'
      },
      {
        id: 14,
        question: 'What payment methods are accepted?',
        answer: 'We accept bank transfers, and other payment methods. Contact our sales team for detailed payment options.'
      },
      {
        id: 15,
        question: 'Can I get a tour of the estate?',
        answer: 'Yes, we offer both physical and virtual tours. Contact our sales team to schedule a tour at your convenience.'
      },
      {
        id: 16,
        question: 'Is financing available?',
        answer: 'We can connect you with our partner financial institutions. Contact our sales team for more information on financing options.'
      }
    ]
  },
  {
    id: 'construction',
    name: 'Construction & Development',
    icon: HelpCircle,
    questions: [
      {
        id: 17,
        question: 'How long does construction take?',
        answer: 'Construction timelines vary depending on the house size and design. Typically, a standard home takes 6-12 months to complete.'
      },
      {
        id: 18,
        question: 'What is the quality of construction?',
        answer: 'We use premium materials and professional contractors to ensure high-quality construction that meets all safety standards.'
      },
      {
        id: 19,
        question: 'Are there building guidelines?',
        answer: 'Yes, we have architectural guidelines to maintain the aesthetic quality of the estate. Our team will provide you with the guidelines when you purchase.'
      },
      {
        id: 20,
        question: 'Can I choose my own contractor?',
        answer: 'Yes, you can choose your own contractor, provided they meet our quality standards and guidelines.'
      }
    ]
  }
];

export default function FAQPage() {
  const [openQuestions, setOpenQuestions] = useState<number[]>([]);
  const [activeCategory, setActiveCategory] = useState('general');
  const [searchQuery, setSearchQuery] = useState('');

  const toggleQuestion = (questionId: number) => {
    setOpenQuestions(prev =>
      prev.includes(questionId)
        ? prev.filter(id => id !== questionId)
        : [...prev, questionId]
    );
  };

  // Filter questions based on search
  const allQuestions = faqCategories.flatMap(cat => cat.questions);
  const filteredQuestions = searchQuery
    ? allQuestions.filter(q => 
        q.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
        q.answer.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : [];

  const activeCategoryData = faqCategories.find(c => c.id === activeCategory);
  const questionsToShow = searchQuery ? filteredQuestions : (activeCategoryData?.questions || []);

  return (
    <div className="bg-white min-h-screen">
      {/* Hero Section */}
      <div className="relative h-[40vh] md:h-[50vh] w-full bg-gradient-to-r from-blue-800 to-red-800">
        <div className="absolute inset-0 bg-black/40" />
        <div className="relative z-20 container mx-auto px-4 h-full flex flex-col justify-center text-center text-white">
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-4">
            Frequently Asked Questions
          </h1>
          <p className="text-base sm:text-lg md:text-xl max-w-2xl mx-auto">
            Find answers to common questions about Mzinyathi Gardens
          </p>
        </div>
      </div>

      {/* Search Bar */}
      <div className="container mx-auto px-4 -mt-6 relative z-30">
        <div className="bg-white rounded-2xl shadow-xl p-1 max-w-2xl mx-auto">
          <div className="flex items-center bg-white rounded-xl px-4 py-2 border border-gray-200 focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-200 transition-all">
            <svg className="w-5 h-5 text-blue-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              type="text"
              placeholder="Search your question..."
              className="flex-1 px-2 py-2 outline-none bg-transparent text-gray-700 placeholder-gray-400 text-base"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* Category Navigation */}
      {!searchQuery && (
        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-wrap justify-center gap-3">
            {faqCategories.map((category) => (
              <button
                key={category.id}
                onClick={() => setActiveCategory(category.id)}
                className={`px-5 py-2 rounded-full font-semibold transition-all ${
                  activeCategory === category.id
                    ? 'bg-blue-600 text-white shadow-md'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {category.name}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* FAQ Questions */}
      <section className="py-8 md:py-12">
        <div className="container mx-auto px-4 max-w-3xl">
          {searchQuery && (
            <div className="mb-6">
              <p className="text-gray-600">
                Found {filteredQuestions.length} result{filteredQuestions.length !== 1 ? 's' : ''} for "{searchQuery}"
              </p>
            </div>
          )}

          {questionsToShow.length === 0 ? (
            <div className="text-center py-12">
              <HelpCircle className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-600 mb-2">No questions found</h3>
              <p className="text-gray-500">Try a different search term or contact our support team.</p>
              <Link href="/contact" className="inline-block mt-4 bg-blue-600 text-white px-6 py-2 rounded-full hover:bg-red-600 transition">
                Contact Us
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {questionsToShow.map((item) => (
                <div
                  key={item.id}
                  className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-100 hover:shadow-lg transition"
                >
                  <button
                    onClick={() => toggleQuestion(item.id)}
                    className="w-full px-6 py-4 text-left flex justify-between items-center hover:bg-blue-50 transition"
                  >
                    <span className="font-semibold text-gray-800 pr-4">{item.question}</span>
                    {openQuestions.includes(item.id) ? (
                      <ChevronUp className="text-blue-500 flex-shrink-0" size={20} />
                    ) : (
                      <ChevronDown className="text-blue-500 flex-shrink-0" size={20} />
                    )}
                  </button>
                  {openQuestions.includes(item.id) && (
                    <div className="px-6 pb-4 pt-2 border-t border-gray-100">
                      <p className="text-gray-600 leading-relaxed">{item.answer}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Still Have Questions? */}
      <section className="py-12 md:py-16 bg-blue-50">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-2xl mx-auto">
            <h2 className="text-2xl md:text-3xl font-bold text-blue-600 mb-4">Still Have Questions?</h2>
            <p className="text-gray-600 mb-8">
              Can't find what you're looking for? Our team is here to help.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/contact"
                className="inline-flex items-center justify-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-full font-semibold hover:bg-red-600 transition"
              >
                <Mail size={18} /> Contact Us
              </Link>
              <a
                href="https://wa.me/263776203372"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 bg-green-600 text-white px-6 py-3 rounded-full font-semibold hover:bg-green-700 transition"
              >
                <MessageCircle size={18} /> WhatsApp Us
              </a>
              <a
                href="tel:+263776203372"
                className="inline-flex items-center justify-center gap-2 border-2 border-blue-600 text-blue-600 px-6 py-3 rounded-full font-semibold hover:bg-blue-600 hover:text-white transition"
              >
                <Phone size={18} /> Call Us
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Quick Links */}
      <section className="py-12 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-blue-600 mb-2">Quick Links</h2>
            <p className="text-gray-600">Explore more about Mzinyathi Gardens</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 max-w-3xl mx-auto">
            <Link href="/properties" className="text-center p-3 bg-blue-50 rounded-xl hover:bg-blue-100 transition">
              <span className="text-blue-600 font-medium">Properties</span>
            </Link>
            <Link href="/projects" className="text-center p-3 bg-blue-50 rounded-xl hover:bg-blue-100 transition">
              <span className="text-blue-600 font-medium">House Plans</span>
            </Link>
            <Link href="/services" className="text-center p-3 bg-blue-50 rounded-xl hover:bg-blue-100 transition">
              <span className="text-blue-600 font-medium">Amenities</span>
            </Link>
            <Link href="/contact" className="text-center p-3 bg-blue-50 rounded-xl hover:bg-blue-100 transition">
              <span className="text-blue-600 font-medium">Contact Sales</span>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}