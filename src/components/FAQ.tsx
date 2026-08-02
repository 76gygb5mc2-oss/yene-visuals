'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown } from 'lucide-react';

const faqs = [
  {
    question: 'How do I book a session with Yene Visuals?',
    answer:
      'Booking is easy! Simply use our online booking form above, or contact us directly via phone or Instagram. We\'ll discuss your vision, preferred date, and location to create the perfect session for you.',
  },
  {
    question: 'What areas do you serve?',
    answer:
      'We serve clients anywhere in the United States. Whether you\'re in a major city or a hidden gem location, we\'re ready to travel and capture your moments wherever you are.',
  },
  {
    question: 'How long does it take to receive my photos?',
    answer:
      'Turnaround time is typically 2-3 weeks for portrait and couple sessions, and 4-6 weeks for weddings and large events. We take the time to carefully edit each image to ensure the highest quality.',
  },
  {
    question: 'What should I wear to my photo session?',
    answer:
      'We recommend wearing outfits that make you feel confident and comfortable. Solid colors and classic styles photograph beautifully. We\'ll send you a detailed style guide after booking to help you prepare.',
  },
  {
    question: 'Do you offer prints and albums?',
    answer:
      'Yes! We offer premium prints, canvas wraps, and beautifully crafted albums. All products are sourced from top-quality professional labs to ensure your memories last a lifetime.',
  },
  {
    question: 'What is your cancellation policy?',
    answer:
      'We understand plans can change. Sessions can be rescheduled up to 48 hours before your appointment at no additional cost. Cancellations within 48 hours may be subject to a rebooking fee.',
  },
  {
    question: 'How many photos will I receive?',
    answer:
      'The number of final images depends on the session type. Portrait sessions typically deliver 30-50 edited images, while weddings can include 400-800+ images. Every image is professionally edited.',
  },
  {
    question: 'Do you offer videography services?',
    answer:
      'Currently, we specialize in photography to ensure the highest quality in every frame. However, we work with talented videographer partners and can recommend them for your event.',
  },
];

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <section id="faq" className="py-24 md:py-32 relative">
      <div className="max-w-3xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <p className="text-sm font-medium tracking-widest uppercase text-[#6E6E73] mb-4">
            FAQ
          </p>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-[#1D1D1F] tracking-tight">
            Frequently Asked Questions
          </h2>
        </motion.div>

        <div className="space-y-3">
          {faqs.map((faq, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{ duration: 0.5, delay: index * 0.05 }}
            >
              <div className="bg-white/60 backdrop-blur-lg rounded-2xl border border-white/40 shadow-sm overflow-hidden">
                <button
                  onClick={() => setOpenIndex(openIndex === index ? null : index)}
                  className="w-full flex items-center justify-between p-6 text-left hover:bg-white/40 transition-colors"
                  aria-expanded={openIndex === index}
                >
                  <span className="font-semibold text-[#1D1D1F] pr-4 text-lg">
                    {faq.question}
                  </span>
                  <motion.span
                    animate={{ rotate: openIndex === index ? 180 : 0 }}
                    transition={{ duration: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }}
                    className="flex-shrink-0"
                  >
                    <ChevronDown className="w-5 h-5 text-[#6E6E73]" />
                  </motion.span>
                </button>

                <AnimatePresence initial={false}>
                  {openIndex === index && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{
                        height: { duration: 0.3, ease: [0.25, 0.46, 0.45, 0.94] },
                        opacity: { duration: 0.2 },
                      }}
                    >
                      <div className="px-6 pb-6 text-[#6E6E73] leading-relaxed">
                        {faq.answer}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
