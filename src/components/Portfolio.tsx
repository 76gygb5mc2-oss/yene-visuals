'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import {
  motion,
  AnimatePresence,
  useInView,
} from 'framer-motion';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';

// ── Types ────────────────────────────────────────────────────────────────────
const categories = [
  'All',
  'Portraits',
  'Weddings',
  'Graduations',
  'Couples',
  'Events',
  'Fashion',
  'Lifestyle',
  'Commercial',
] as const;

type Category = (typeof categories)[number];

interface PortfolioItem {
  id: string;
  title: string;
  category: string;
  gradient: string;
  height: string;
  url?: string; // real uploaded image URL
}

// ── Placeholder Data (shown when no real uploads exist) ──────────────────────
const placeholderItems: PortfolioItem[] = [
  { id: 'p1', title: 'Golden Hour Portrait', category: 'Portraits', gradient: 'from-amber-800 to-orange-600', height: 'h-[360px]' },
  { id: 'p2', title: 'Wedding Ceremony', category: 'Weddings', gradient: 'from-rose-200 to-pink-400', height: 'h-[420px]' },
  { id: 'p3', title: 'Cap & Gown', category: 'Graduations', gradient: 'from-blue-900 to-indigo-600', height: 'h-[340px]' },
  { id: 'p4', title: 'Couple at Sunset', category: 'Couples', gradient: 'from-orange-400 to-rose-500', height: 'h-[280px]' },
  { id: 'p5', title: 'Corporate Gala', category: 'Events', gradient: 'from-zinc-700 to-zinc-900', height: 'h-[380px]' },
  { id: 'p6', title: 'Editorial Look', category: 'Fashion', gradient: 'from-fuchsia-600 to-purple-800', height: 'h-[440px]' },
  { id: 'p7', title: 'Morning Coffee', category: 'Lifestyle', gradient: 'from-amber-600 to-yellow-400', height: 'h-[260px]' },
  { id: 'p8', title: 'Product Showcase', category: 'Commercial', gradient: 'from-slate-300 to-slate-500', height: 'h-[320px]' },
  { id: 'p9', title: 'Natural Light Portrait', category: 'Portraits', gradient: 'from-teal-600 to-emerald-400', height: 'h-[400px]' },
  { id: 'p10', title: 'First Dance', category: 'Weddings', gradient: 'from-amber-200 to-orange-300', height: 'h-[460px]' },
  { id: 'p11', title: 'Class of 2024', category: 'Graduations', gradient: 'from-red-700 to-red-500', height: 'h-[350px]' },
  { id: 'p12', title: 'Engagement Session', category: 'Couples', gradient: 'from-pink-300 to-rose-400', height: 'h-[380px]' },
  { id: 'p13', title: 'Runway Show', category: 'Fashion', gradient: 'from-gray-900 to-gray-700', height: 'h-[420px]' },
  { id: 'p14', title: 'Birthday Celebration', category: 'Events', gradient: 'from-violet-500 to-purple-600', height: 'h-[300px]' },
  { id: 'p15', title: 'Travel Journal', category: 'Lifestyle', gradient: 'from-sky-400 to-blue-600', height: 'h-[370px]' },
  { id: 'p16', title: 'Brand Campaign', category: 'Commercial', gradient: 'from-emerald-500 to-teal-700', height: 'h-[240px]' },
  { id: 'p17', title: 'Studio Portrait', category: 'Portraits', gradient: 'from-stone-600 to-stone-800', height: 'h-[400px]' },
  { id: 'p18', title: 'Beach Wedding', category: 'Weddings', gradient: 'from-cyan-300 to-blue-400', height: 'h-[380px]' },
];

const heights = ['h-[280px]', 'h-[320px]', 'h-[360px]', 'h-[400px]', 'h-[440px]'];
const gradients = [
  'from-amber-800 to-orange-600', 'from-rose-200 to-pink-400', 'from-blue-900 to-indigo-600',
  'from-orange-400 to-rose-500', 'from-zinc-700 to-zinc-900', 'from-fuchsia-600 to-purple-800',
  'from-teal-600 to-emerald-400', 'from-sky-400 to-blue-600',
];

// ── Component ────────────────────────────────────────────────────────────────
export default function Portfolio() {
  const [activeCategory, setActiveCategory] = useState<Category>('All');
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const [items, setItems] = useState<PortfolioItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [hasUploads, setHasUploads] = useState(false);
  const sectionRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: '-100px' });

  // Load real photos from API
  useEffect(() => {
    fetch('/api/photos')
      .then((res) => res.json())
      .then((data) => {
        if (data.photos && data.photos.length > 0) {
          const realItems: PortfolioItem[] = data.photos.map(
            (p: { id: string; title: string; category: string; url: string }, i: number) => ({
              id: p.id,
              title: p.title,
              category: p.category,
              url: p.url,
              gradient: gradients[i % gradients.length],
              height: heights[i % heights.length],
            })
          );
          setItems(realItems);
          setHasUploads(true);
        } else {
          // No uploaded photos — show placeholders
          setItems(placeholderItems);
        }
      })
      .catch(() => {
        // Use placeholders on error
        setItems(placeholderItems);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  const filteredItems =
    activeCategory === 'All'
      ? items
      : items.filter((item) => item.category === activeCategory);

  const lightboxItem =
    lightboxIndex !== null ? filteredItems[lightboxIndex] : null;

  // Keyboard navigation for lightbox
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (lightboxIndex === null) return;
      if (e.key === 'Escape') setLightboxIndex(null);
      if (e.key === 'ArrowRight')
        setLightboxIndex((prev) =>
          prev !== null ? (prev + 1) % filteredItems.length : null
        );
      if (e.key === 'ArrowLeft')
        setLightboxIndex((prev) =>
          prev !== null
            ? (prev - 1 + filteredItems.length) % filteredItems.length
            : null
        );
    },
    [lightboxIndex, filteredItems.length]
  );

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  // Lock body scroll when lightbox is open
  useEffect(() => {
    if (lightboxIndex !== null) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [lightboxIndex]);

  return (
    <section
      id="portfolio"
      ref={sectionRef}
      className="relative py-24 md:py-32 bg-[#F5F5F7]"
    >
      <div className="max-w-7xl mx-auto px-6">
        {/* Section Header */}
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, ease: [0.25, 0.46, 0.45, 0.94] }}
        >
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-semibold text-[#1D1D1F] tracking-tight mb-4">
            Our Portfolio
          </h2>
          <p className="text-lg md:text-xl text-[#6E6E73] max-w-2xl mx-auto leading-relaxed">
            A curated collection of moments, emotions, and stories captured
            through our lens.
          </p>
        </motion.div>

        {/* Category Filter */}
        <motion.div
          className="flex flex-wrap justify-center gap-2 mb-12"
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, delay: 0.2 }}
        >
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => {
                setActiveCategory(category);
                setLightboxIndex(null);
              }}
              className={`
                relative px-5 py-2 text-sm font-medium rounded-full transition-all duration-300
                ${
                  activeCategory === category
                    ? 'bg-[#1D1D1F] text-white shadow-lg shadow-black/20'
                    : 'bg-white/60 text-[#6E6E73] backdrop-blur-sm border border-black/5 hover:bg-white hover:text-[#1D1D1F] hover:border-black/10'
                }
              `}
            >
              {category}
            </button>
          ))}
        </motion.div>

        {/* Masonry Grid */}
        {loading ? (
          <div className="columns-1 sm:columns-2 lg:columns-3 xl:columns-4 gap-4 space-y-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <div
                key={i}
                className={`break-inside-avoid rounded-2xl overflow-hidden bg-gradient-to-br from-gray-200 to-gray-100 animate-pulse ${
                  ['h-[280px]', 'h-[360px]', 'h-[320px]', 'h-[400px]', 'h-[340px]', 'h-[380px]', 'h-[300px]', 'h-[420px]'][i]
                }`}
              />
            ))}
          </div>
        ) : (
        <motion.div
          layout
          className="columns-1 sm:columns-2 lg:columns-3 xl:columns-4 gap-4 space-y-4"
        >
          <AnimatePresence mode="popLayout">
            {filteredItems.map((item, index) => (
              <motion.div
                key={item.id}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{
                  duration: 0.4,
                  delay: index * 0.05,
                  ease: [0.25, 0.46, 0.45, 0.94],
                }}
                className="break-inside-avoid cursor-pointer group"
                onClick={() => setLightboxIndex(index)}
              >
                <div
                  className={`
                    relative ${item.url ? 'h-[360px]' : item.height} rounded-2xl overflow-hidden
                    transition-transform duration-500 ease-out
                    group-hover:scale-[1.02]
                  `}
                >
                  {/* Real image or gradient placeholder */}
                  {item.url ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={item.url}
                      alt={item.title}
                      className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                      loading="lazy"
                    />
                  ) : (
                    <div
                      className={`absolute inset-0 bg-gradient-to-br ${item.gradient} transition-transform duration-700 ease-out group-hover:scale-105`}
                    />
                  )}

                  {/* Category label centered (only for placeholders) */}
                  {!item.url && (
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                      <span className="text-white/30 text-xs font-medium tracking-[0.2em] uppercase">
                        {item.category}
                      </span>
                    </div>
                  )}

                  {/* Hover overlay with glass effect */}
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors duration-300 flex flex-col items-center justify-end p-6">
                    <div className="translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
                      <div className="backdrop-blur-xl bg-white/15 border border-white/20 rounded-xl px-5 py-3 text-center">
                        <p className="text-white text-sm font-medium">
                          {item.title}
                        </p>
                        <p className="text-white/60 text-xs mt-0.5">
                          {item.category}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
        )}

        {/* Placeholder notice */}
        {!hasUploads && (
          <p className="text-center text-[#6E6E73]/50 text-sm mt-8">
            Showing placeholder images. Upload real photos at{' '}
            <a href="/admin" className="underline hover:text-[#1D1D1F]">
              /admin
            </a>
          </p>
        )}
      </div>

      {/* ── Lightbox Modal ── */}
      <AnimatePresence>
        {lightboxIndex !== null && lightboxItem && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            {/* Backdrop */}
            <motion.div
              className="absolute inset-0 bg-black/90 backdrop-blur-xl"
              onClick={() => setLightboxIndex(null)}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            />

            {/* Close button */}
            <button
              onClick={() => setLightboxIndex(null)}
              className="absolute top-6 right-6 z-10 w-10 h-10 rounded-full bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center text-white hover:bg-white/20 transition-colors"
              aria-label="Close lightbox"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Previous button */}
            <button
              onClick={() =>
                setLightboxIndex(
                  (lightboxIndex - 1 + filteredItems.length) %
                    filteredItems.length
                )
              }
              className="absolute left-4 md:left-8 z-10 w-12 h-12 rounded-full bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center text-white hover:bg-white/20 transition-colors"
              aria-label="Previous image"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>

            {/* Next button */}
            <button
              onClick={() =>
                setLightboxIndex(
                  (lightboxIndex + 1) % filteredItems.length
                )
              }
              className="absolute right-4 md:right-8 z-10 w-12 h-12 rounded-full bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center text-white hover:bg-white/20 transition-colors"
              aria-label="Next image"
            >
              <ChevronRight className="w-6 h-6" />
            </button>

            {/* Lightbox Content */}
            <motion.div
              key={lightboxItem.id}
              className="relative z-10 w-[90vw] max-w-4xl"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ duration: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }}
            >
              {/* Image or placeholder */}
              {lightboxItem.url ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={lightboxItem.url}
                  alt={lightboxItem.title}
                  className="w-full max-h-[75vh] object-contain rounded-2xl"
                />
              ) : (
                <div
                  className={`w-full h-[60vh] md:h-[70vh] rounded-2xl bg-gradient-to-br ${lightboxItem.gradient} flex flex-col items-center justify-center`}
                >
                  <span className="text-white/40 text-sm tracking-[0.2em] uppercase">
                    {lightboxItem.category}
                  </span>
                </div>
              )}

              {/* Caption */}
              <div className="mt-4 text-center">
                <h3 className="text-white text-xl font-medium">
                  {lightboxItem.title}
                </h3>
                <p className="text-white/50 text-sm mt-1">
                  {lightboxItem.category} •{' '}
                  {lightboxIndex + 1} of {filteredItems.length}
                </p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
