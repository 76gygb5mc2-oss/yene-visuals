'use client';

import { useRef, useState } from 'react';
import { motion, useInView, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';

// ── Placeholder Data ──────────────────────────────────────────────────────────
interface FeaturedItem {
  id: number;
  title: string;
  subtitle: string;
  gradient: string;
  accentColor: string;
}

const featuredItems: FeaturedItem[] = [
  {
    id: 1,
    title: 'The Abebe Wedding',
    subtitle: 'An intimate celebration in the Napa Valley vineyards',
    gradient: 'from-rose-300 via-pink-400 to-rose-600',
    accentColor: 'text-rose-200',
  },
  {
    id: 2,
    title: 'Urban Portraits',
    subtitle: 'Street-style editorial shoot in downtown Los Angeles',
    gradient: 'from-zinc-700 via-zinc-800 to-zinc-950',
    accentColor: 'text-zinc-400',
  },
  {
    id: 3,
    title: 'Class of 2024',
    subtitle: 'Graduation portraits at Howard University',
    gradient: 'from-blue-700 via-indigo-600 to-purple-700',
    accentColor: 'text-blue-200',
  },
  {
    id: 4,
    title: 'Golden Hour Couples',
    subtitle: 'Romantic session along the Pacific Coast Highway',
    gradient: 'from-amber-400 via-orange-500 to-rose-500',
    accentColor: 'text-amber-100',
  },
  {
    id: 5,
    title: 'Brand Lookbook',
    subtitle: 'Commercial campaign for emerging fashion label',
    gradient: 'from-emerald-500 via-teal-600 to-cyan-700',
    accentColor: 'text-emerald-200',
  },
  {
    id: 6,
    title: 'The Johnson Gala',
    subtitle: 'An evening of elegance and celebration',
    gradient: 'from-violet-600 via-purple-700 to-indigo-900',
    accentColor: 'text-violet-200',
  },
];

// ── Component ─────────────────────────────────────────────────────────────────
export default function FeaturedWork() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: '-100px' });
  const [expandedId, setExpandedId] = useState<number | null>(null);

  const expandedItem = featuredItems.find((i) => i.id === expandedId) ?? null;

  return (
    <section
      ref={sectionRef}
      className="relative py-24 md:py-32 bg-white overflow-hidden"
    >
      {/* Section Header */}
      <motion.div
        className="max-w-7xl mx-auto px-6 mb-12"
        initial={{ opacity: 0, y: 30 }}
        animate={isInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.7, ease: [0.25, 0.46, 0.45, 0.94] }}
      >
        <h2 className="text-4xl md:text-5xl lg:text-6xl font-semibold text-[#1D1D1F] tracking-tight mb-4">
          Featured Work
        </h2>
        <p className="text-lg md:text-xl text-[#6E6E73] max-w-2xl leading-relaxed">
          Highlighted projects and sessions that showcase our creative vision.
        </p>
      </motion.div>

      {/* Horizontal Scrolling Gallery */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={isInView ? { opacity: 1 } : {}}
        transition={{ duration: 0.7, delay: 0.3 }}
      >
        <motion.div
          ref={scrollRef}
          className="flex gap-6 px-6 md:px-12 pb-4 overflow-x-auto snap-x snap-mandatory scrollbar-hide cursor-grab active:cursor-grabbing"
          drag="x"
          dragConstraints={scrollRef}
          dragElastic={0.1}
          style={{
            scrollbarWidth: 'none',
            msOverflowStyle: 'none',
          }}
        >
          {featuredItems.map((item, index) => (
            <motion.div
              key={item.id}
              className="flex-shrink-0 snap-center"
              initial={{ opacity: 0, x: 60 }}
              animate={isInView ? { opacity: 1, x: 0 } : {}}
              transition={{
                duration: 0.6,
                delay: 0.15 * index,
                ease: [0.25, 0.46, 0.45, 0.94],
              }}
            >
              <div
                onClick={() => setExpandedId(item.id)}
                className={`
                  relative w-[320px] md:w-[400px] h-[480px] md:h-[560px] rounded-3xl overflow-hidden
                  cursor-pointer group transition-all duration-500
                  hover:shadow-2xl hover:shadow-black/20 hover:-translate-y-2
                `}
              >
                {/* Gradient placeholder — replace with <Image> */}
                <div
                  className={`absolute inset-0 bg-gradient-to-br ${item.gradient} transition-transform duration-700 ease-out group-hover:scale-105`}
                />

                {/* Subtle noise texture overlay */}
                <div className="absolute inset-0 bg-black/5" />

                {/* Content */}
                <div className="absolute inset-0 flex flex-col justify-end p-8">
                  <div className="transform transition-transform duration-500 group-hover:translate-y-0 translate-y-2">
                    <p
                      className={`text-xs font-medium tracking-[0.25em] uppercase ${item.accentColor} mb-2`}
                    >
                      Featured
                    </p>
                    <h3 className="text-2xl md:text-3xl font-semibold text-white leading-tight mb-2">
                      {item.title}
                    </h3>
                    <p className="text-white/60 text-sm leading-relaxed opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      {item.subtitle}
                    </p>
                  </div>
                </div>

                {/* Glass border */}
                <div className="absolute inset-0 rounded-3xl ring-1 ring-inset ring-white/10" />
              </div>
            </motion.div>
          ))}

          {/* End spacer for scroll */}
          <div className="flex-shrink-0 w-6 md:w-12" />
        </motion.div>
      </motion.div>

      {/* Scroll hint */}
      <motion.div
        className="flex items-center justify-center mt-8 gap-2 text-[#6E6E73]"
        initial={{ opacity: 0 }}
        animate={isInView ? { opacity: 1 } : {}}
        transition={{ duration: 0.7, delay: 0.8 }}
      >
        <div className="w-8 h-0.5 bg-[#6E6E73]/30 rounded-full" />
        <span className="text-xs tracking-[0.15em] uppercase">
          Drag or scroll to explore
        </span>
        <div className="w-8 h-0.5 bg-[#6E6E73]/30 rounded-full" />
      </motion.div>

      {/* ── Expanded Card Modal ── */}
      <AnimatePresence>
        {expandedId !== null && expandedItem && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center p-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            {/* Backdrop */}
            <motion.div
              className="absolute inset-0 bg-black/80 backdrop-blur-xl"
              onClick={() => setExpandedId(null)}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            />

            {/* Close button */}
            <button
              onClick={() => setExpandedId(null)}
              className="absolute top-6 right-6 z-10 w-10 h-10 rounded-full bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center text-white hover:bg-white/20 transition-colors"
              aria-label="Close"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Expanded Card */}
            <motion.div
              className="relative z-10 w-full max-w-3xl"
              initial={{ scale: 0.85, opacity: 0, y: 40 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.85, opacity: 0, y: 40 }}
              transition={{
                duration: 0.4,
                ease: [0.25, 0.46, 0.45, 0.94],
              }}
            >
              <div
                className={`relative w-full h-[70vh] rounded-3xl overflow-hidden bg-gradient-to-br ${expandedItem.gradient}`}
              >
                {/* Content */}
                <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-12">
                  <motion.p
                    className={`text-xs font-medium tracking-[0.25em] uppercase ${expandedItem.accentColor} mb-4`}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                  >
                    Featured Project
                  </motion.p>
                  <motion.h3
                    className="text-4xl md:text-5xl font-semibold text-white mb-4"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                  >
                    {expandedItem.title}
                  </motion.h3>
                  <motion.p
                    className="text-white/60 text-lg max-w-md"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                  >
                    {expandedItem.subtitle}
                  </motion.p>
                  <motion.button
                    className="mt-8 px-8 py-3 rounded-full bg-white/15 backdrop-blur-md border border-white/25 text-white text-sm font-medium hover:bg-white/25 transition-colors"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                  >
                    View Full Project
                  </motion.button>
                </div>

                {/* Glass ring */}
                <div className="absolute inset-0 rounded-3xl ring-1 ring-inset ring-white/10" />
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
