'use client';

import { motion } from 'framer-motion';
const InstagramIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect width="20" height="20" x="2" y="2" rx="5" ry="5"/>
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
    <line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/>
  </svg>
);

const instagramPosts = [
  { id: 1, color: 'from-rose-300 to-pink-400', label: 'Portrait Session' },
  { id: 2, color: 'from-amber-300 to-orange-400', label: 'Golden Hour' },
  { id: 3, color: 'from-emerald-300 to-teal-400', label: 'Wedding Day' },
  { id: 4, color: 'from-blue-300 to-indigo-400', label: 'Couple Shoot' },
  { id: 5, color: 'from-violet-300 to-purple-400', label: 'Graduation' },
  { id: 6, color: 'from-cyan-300 to-blue-400', label: 'Brand Photos' },
  { id: 7, color: 'from-pink-300 to-rose-400', label: 'Fashion' },
  { id: 8, color: 'from-yellow-300 to-amber-400', label: 'Lifestyle' },
];

export default function InstagramFeed() {
  return (
    <section className="py-24 md:py-32 bg-[#F5F5F7] relative overflow-hidden">
      <div className="max-w-6xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <p className="text-sm font-medium tracking-widest uppercase text-[#6E6E73] mb-4">
            Instagram
          </p>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-[#1D1D1F] tracking-tight mb-4">
            Follow Along
          </h2>
          <p className="text-[#6E6E73] text-lg max-w-xl mx-auto">
            See our latest work and behind-the-scenes moments
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4"
        >
          {instagramPosts.map((post, index) => (
            <motion.a
              key={post.id}
              href="https://www.instagram.com/yene.visuals"
              target="_blank"
              rel="noopener noreferrer"
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.05 }}
              whileHover={{ scale: 1.03 }}
              className="group relative aspect-square rounded-2xl overflow-hidden cursor-pointer"
            >
              {/* Placeholder gradient */}
              <div
                className={`absolute inset-0 bg-gradient-to-br ${post.color}`}
              />

              {/* Hover overlay */}
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-all duration-300 flex items-center justify-center">
                <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 text-center">
                  <InstagramIcon className="w-8 h-8 text-white mx-auto mb-2" />
                  <p className="text-white text-sm font-medium">{post.label}</p>
                </div>
              </div>
            </motion.a>
          ))}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="text-center mt-12"
        >
          <a
            href="https://www.instagram.com/yene.visuals"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-3 px-8 py-4 rounded-full bg-gradient-to-r from-purple-500 via-pink-500 to-orange-500 text-white font-semibold hover:shadow-lg hover:shadow-pink-500/25 transition-all duration-300 hover:-translate-y-0.5"
          >
            <InstagramIcon className="w-5 h-5" />
            Follow @yene.visuals
          </a>
        </motion.div>
      </div>
    </section>
  );
}
