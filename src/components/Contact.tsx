'use client';

import { motion } from 'framer-motion';
import { Phone, MapPin, ArrowRight } from 'lucide-react';

const InstagramIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect width="20" height="20" x="2" y="2" rx="5" ry="5"/>
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
    <line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/>
  </svg>
);

export default function Contact() {
  return (
    <section id="contact" className="py-24 md:py-32 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 -right-20 w-96 h-96 bg-gradient-to-br from-violet-200/20 to-purple-200/20 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 -left-20 w-96 h-96 bg-gradient-to-br from-blue-200/20 to-cyan-200/20 rounded-full blur-3xl" />
      </div>

      <div className="max-w-5xl mx-auto px-6 relative z-10">
        {/* Big CTA */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.8 }}
          className="text-center mb-20"
        >
          <h2 className="text-4xl md:text-6xl lg:text-7xl font-bold text-[#1D1D1F] tracking-tight mb-6 leading-tight">
            Let&apos;s Create Something
            <br />
            <span className="bg-gradient-to-r from-violet-600 to-indigo-600 bg-clip-text text-transparent">
              Beautiful Together
            </span>
          </h2>
          <p className="text-lg md:text-xl text-[#6E6E73] max-w-2xl mx-auto mb-10">
            Ready to capture your most important moments? Let&apos;s talk about how we can create
            timeless visuals for you.
          </p>
          <motion.a
            href="#booking"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.98 }}
            className="inline-flex items-center gap-3 px-10 py-5 rounded-full bg-[#1D1D1F] text-white font-semibold text-lg hover:bg-black transition-colors shadow-xl shadow-black/20"
          >
            Book Your Session
            <ArrowRight className="w-5 h-5" />
          </motion.a>
        </motion.div>

        {/* Contact info cards */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6"
        >
          {/* Phone */}
          <a
            href="tel:+15073818618"
            className="group bg-white/60 backdrop-blur-lg rounded-3xl p-8 border border-white/40 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-300 text-center"
          >
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-green-400 to-emerald-500 flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
              <Phone className="w-6 h-6 text-white" />
            </div>
            <p className="text-sm text-[#6E6E73] mb-1">Phone</p>
            <p className="font-semibold text-[#1D1D1F] text-lg">+1 (507) 381-8618</p>
          </a>

          {/* Instagram */}
          <a
            href="https://www.instagram.com/yene.visuals"
            target="_blank"
            rel="noopener noreferrer"
            className="group bg-white/60 backdrop-blur-lg rounded-3xl p-8 border border-white/40 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-300 text-center"
          >
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-purple-500 via-pink-500 to-orange-500 flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
              <InstagramIcon className="w-6 h-6 text-white" />
            </div>
            <p className="text-sm text-[#6E6E73] mb-1">Instagram</p>
            <p className="font-semibold text-[#1D1D1F] text-lg">@yene.visuals</p>
          </a>

          {/* Location */}
          <div className="bg-white/60 backdrop-blur-lg rounded-3xl p-8 border border-white/40 shadow-sm text-center">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-400 to-indigo-500 flex items-center justify-center mx-auto mb-4">
              <MapPin className="w-6 h-6 text-white" />
            </div>
            <p className="text-sm text-[#6E6E73] mb-1">Service Area</p>
            <p className="font-semibold text-[#1D1D1F] text-lg">Anywhere in the USA</p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
