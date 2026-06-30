'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ChevronDown, ChevronUp } from 'lucide-react';
import PageContainer from '@/components/layout/PageContainer';
import RevealOnScroll from '@/components/motion/RevealOnScroll';

const faqData = [
  {
    id: 1,
    question: 'What sizes of stands are available?',
    answer:
      'Stand sizes range from 600 to 1000 square meters, depending on the phase and location within the estate.',
  },
  {
    id: 2,
    question: 'How do I get pricing information?',
    answer:
      'Please contact our sales team for current availability and pricing. We will provide a tailored quote based on your preferred property and payment plan.',
  },
  {
    id: 3,
    question: 'What security features are available?',
    answer:
      'We provide 24/7 armed security, CCTV surveillance, access control systems, perimeter lighting, and regular patrols throughout the estate.',
  },
  {
    id: 4,
    question: 'How do I purchase a stand or house?',
    answer:
      'Contact our sales team via phone, WhatsApp, or email. They will guide you through the available options and the purchasing process.',
  },
  {
    id: 5,
    question: 'Can I get a tour of the estate?',
    answer:
      'Yes, we offer both physical and virtual tours. Contact our sales team to schedule a tour at your convenience.',
  },
  {
    id: 6,
    question: 'What payment methods are accepted?',
    answer:
      'We accept bank transfers, and other payment methods. Contact our sales team for detailed payment options.',
  },
];

export default function FAQSection() {
  const [openQuestions, setOpenQuestions] = useState<number[]>([]);

  const toggleQuestion = (questionId: number) => {
    setOpenQuestions((prev) =>
      prev.includes(questionId) ? prev.filter((id) => id !== questionId) : [...prev, questionId]
    );
  };

  return (
    <section className="py-12 md:py-16 bg-white" data-no-reveal>
      <PageContainer>
        <RevealOnScroll className="text-center mb-8 md:mb-12">
          <h2 className="text-heading-xl font-bold text-blue-600 mb-3">
            Frequently Asked Questions
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto text-sm md:text-base">
            Find answers to common questions about Mzinyathi Gardens
          </p>
        </RevealOnScroll>
        <div className="max-w-3xl mx-auto">
          {faqData.map((item, index) => (
            <RevealOnScroll key={item.id} delay={index * 0.08} className="mb-4">
              <div className="interactive-card bg-white rounded-xl shadow-md overflow-hidden border border-gray-100">
                <button
                  type="button"
                  onClick={() => toggleQuestion(item.id)}
                  className="w-full min-h-[44px] px-4 sm:px-6 py-4 text-left flex justify-between items-center gap-3 hover:bg-blue-50 transition"
                  aria-expanded={openQuestions.includes(item.id)}
                >
                  <span className="font-semibold text-gray-800 break-words">{item.question}</span>
                  {openQuestions.includes(item.id) ? (
                    <ChevronUp className="text-blue-500 shrink-0 interactive-icon" size={20} />
                  ) : (
                    <ChevronDown className="text-blue-500 shrink-0 interactive-icon" size={20} />
                  )}
                </button>
                {openQuestions.includes(item.id) && (
                  <div className="px-4 sm:px-6 pb-4 pt-2 border-t border-gray-100">
                    <p className="text-gray-600 leading-relaxed text-sm sm:text-base">{item.answer}</p>
                  </div>
                )}
              </div>
            </RevealOnScroll>
          ))}
        </div>
        <RevealOnScroll className="text-center mt-8">
          <Link
            href="/faq"
            className="interactive-btn inline-flex items-center justify-center min-h-[44px] bg-blue-600 text-white px-6 py-2.5 rounded-full font-semibold hover:bg-red-600 transition"
          >
            View All FAQs
          </Link>
        </RevealOnScroll>
      </PageContainer>
    </section>
  );
}
