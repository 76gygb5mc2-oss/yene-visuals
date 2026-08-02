'use client';

import { useRef, useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Star, ChevronLeft, ChevronRight, Quote } from 'lucide-react';

const testimonials = [
  {
    name: 'Sarah Mitchell',
    role: 'Wedding Client',
    text: 'Yene Visuals captured our wedding day perfectly. Every photo tells a story, and the attention to detail was beyond anything we expected. Truly a gifted photographer.',
    rating: 5,
    initials: 'SM',
    color: 'from-rose-400 to-pink-500',
  },
  {
    name: 'David Chen',
    role: 'Corporate Client',
    text: 'The brand photography session exceeded all expectations. Our company\'s visual identity has been transformed. Professional, creative, and incredibly easy to work with.',
    rating: 5,
    initials: 'DC',
    color: 'from-blue-400 to-indigo-500',
  },
  {
    name: 'Amara Johnson',
    role: 'Graduation Session',
    text: 'My graduation photos are absolutely stunning! Yene has an incredible eye for finding the perfect angles and lighting. I couldn\'t be happier with the results.',
    rating: 5,
    initials: 'AJ',
    color: 'from-amber-400 to-orange-500',
  },
  {
    name: 'Marcus Williams',
    role: 'Portrait Session',
    text: 'Working with Yene was an amazing experience. The portraits are so natural and beautiful. Everyone who sees them asks who took them. Highly recommend!',
    rating: 5,
    initials: 'MW',
    color: 'from-emerald-400 to-teal-500',
  },
  {
    name: 'Elena Rodriguez',
    role: 'Couple Session',
    text: 'Our couple photos are breathtaking. Yene made us feel so comfortable during the shoot, and the results speak for themselves. We\'ll treasure these forever.',
    rating: 5,
    initials: 'ER',
    color: 'from-violet-400 to-purple-500',
  },
];

export default function Testimonials() {
  const [current, setCurrent] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (!isAutoPlaying) return;
    timerRef.current = setInterval(() => {
      setCurrent((prev) => (prev + 1) % testimonials.length);
    }, 5000);
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isAutoPlaying]);

  const goTo = (index: number) => {
    setCurrent(index);
    setIsAutoPlaying(false);
    setTimeout(() => setIsAutoPlaying(true), 10000);
  };

  const prev = () => goTo((current - 1 + testimonials.length) % testimonials.length);
  const next = () => goTo((current + 1) % testimonials.length);

  return (
    <section id="reviews" className="py-24 md:py-32 bg-[#F5F5F7] relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-purple-200/30 to-pink-200/30 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-br from-blue-200/30 to-indigo-200/30 rounded-full blur-3xl" />
      </div>

      <div className="max-w-6xl mx-auto px-6 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <p className="text-sm font-medium tracking-widest uppercase text-[#6E6E73] mb-4">
            Testimonials
          </p>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-[#1D1D1F] tracking-tight">
            What Our Clients Say
          </h2>
        </motion.div>

        <div className="relative">
          {/* Main testimonial card */}
          <div className="relative min-h-[320px] flex items-center justify-center">
            <AnimatePresence mode="wait">
              <motion.div
                key={current}
                initial={{ opacity: 0, y: 20, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -20, scale: 0.95 }}
                transition={{ duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
                className="w-full max-w-3xl mx-auto"
              >
                <div className="bg-white/70 backdrop-blur-xl rounded-3xl p-8 md:p-12 shadow-lg border border-white/40 relative">
                  {/* Quote icon */}
                  <Quote className="absolute top-6 right-8 w-12 h-12 text-[#1D1D1F]/5" />

                  {/* Stars */}
                  <div className="flex gap-1 mb-6">
                    {Array.from({ length: testimonials[current].rating }).map((_, i) => (
                      <Star key={i} className="w-5 h-5 fill-amber-400 text-amber-400" />
                    ))}
                  </div>

                  {/* Text */}
                  <p className="text-lg md:text-xl text-[#1D1D1F] leading-relaxed mb-8 font-light">
                    &ldquo;{testimonials[current].text}&rdquo;
                  </p>

                  {/* Client info */}
                  <div className="flex items-center gap-4">
                    <div
                      className={`w-12 h-12 rounded-full bg-gradient-to-br ${testimonials[current].color} flex items-center justify-center text-white font-semibold text-sm`}
                    >
                      {testimonials[current].initials}
                    </div>
                    <div>
                      <p className="font-semibold text-[#1D1D1F]">{testimonials[current].name}</p>
                      <p className="text-sm text-[#6E6E73]">{testimonials[current].role}</p>
                    </div>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Navigation */}
          <div className="flex items-center justify-center gap-6 mt-8">
            <button
              onClick={prev}
              className="w-12 h-12 rounded-full bg-white/70 backdrop-blur-lg border border-white/40 flex items-center justify-center text-[#1D1D1F] hover:bg-white/90 transition-all shadow-sm"
              aria-label="Previous testimonial"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>

            <div className="flex gap-2">
              {testimonials.map((_, i) => (
                <button
                  key={i}
                  onClick={() => goTo(i)}
                  className={`transition-all duration-300 rounded-full ${
                    i === current
                      ? 'w-8 h-2 bg-[#1D1D1F]'
                      : 'w-2 h-2 bg-[#1D1D1F]/20 hover:bg-[#1D1D1F]/40'
                  }`}
                  aria-label={`Go to testimonial ${i + 1}`}
                />
              ))}
            </div>

            <button
              onClick={next}
              className="w-12 h-12 rounded-full bg-white/70 backdrop-blur-lg border border-white/40 flex items-center justify-center text-[#1D1D1F] hover:bg-white/90 transition-all shadow-sm"
              aria-label="Next testimonial"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
