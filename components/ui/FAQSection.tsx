// components/ui/FAQSection.tsx
'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ChevronDown, ChevronUp, HelpCircle } from 'lucide-react';

const faqData = [
  {
    id: 1,
    question: 'What sizes of stands are available?',
    answer: 'Stand sizes range from 600 to 1000 square meters, depending on the phase and location within the estate.'
  },
  {
    id: 2,
    question: 'What are the house prices?',
    answer: 'Our house prices are: 3-bedroom houses from $45,000, 4-bedroom houses from $55,000, and 5-bedroom/Double Story houses from $75,000.'
  },
  {
    id: 3,
    question: 'What security features are available?',
    answer: 'We provide 24/7 armed security, CCTV surveillance, access control systems, perimeter lighting, and regular patrols throughout the estate.'
  },
  {
    id: 4,
    question: 'How do I purchase a stand or house?',
    answer: 'Contact our sales team via phone, WhatsApp, or email. They will guide you through the available options and the purchasing process.'
  },
  {
    id: 5,
    question: 'Can I get a tour of the estate?',
    answer: 'Yes, we offer both physical and virtual tours. Contact our sales team to schedule a tour at your convenience.'
  },
  {
    id: 6,
    question: 'What payment methods are accepted?',
    answer: 'We accept bank transfers, and other payment methods. Contact our sales team for detailed payment options.'
  }
];

export default function FAQSection() {
  const [openQuestions, setOpenQuestions] = useState<number[]>([]);

  const toggleQuestion = (questionId: number) => {
    setOpenQuestions(prev =>
      prev.includes(questionId)
        ? prev.filter(id => id !== questionId)
        : [...prev, questionId]
    );
  };

  return (
    <section className="py-12 md:py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-8 md:mb-12">
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-blue-600 mb-3">
            Frequently Asked Questions
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto text-sm md:text-base">
            Find answers to common questions about Mzinyathi Gardens
          </p>
        </div>
        <div className="max-w-3xl mx-auto">
          {faqData.map((item) => (
            <div
              key={item.id}
              className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-100 mb-4 hover:shadow-lg transition"
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
        <div className="text-center mt-8">
          <Link
            href="/faq"
            className="inline-block bg-blue-600 text-white px-6 py-2 rounded-full font-semibold hover:bg-red-600 transition"
          >
            View All FAQs
          </Link>
        </div>
      </div>
    </section>
  );
}