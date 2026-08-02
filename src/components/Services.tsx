'use client';

import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import {
  Camera,
  Heart,
  GraduationCap,
  PartyPopper,
  Building2,
  Palette,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

interface Service {
  icon: LucideIcon;
  title: string;
  description: string;
  price: string;
}

const services: Service[] = [
  {
    icon: Camera,
    title: 'Portrait Photography',
    description:
      'Timeless portraits that capture your personality and essence. Studio or natural-light sessions tailored to your vision.',
    price: 'Starting at $250',
  },
  {
    icon: Heart,
    title: 'Wedding Photography',
    description:
      'Full-day coverage of your love story — from getting ready to the last dance. Every candid tear and joyful laugh preserved.',
    price: 'Starting at $2,500',
  },
  {
    icon: GraduationCap,
    title: 'Graduation Sessions',
    description:
      'Celebrate your milestone with stunning cap-and-gown portraits. On-campus, urban, or scenic backdrops available.',
    price: 'Starting at $200',
  },
  {
    icon: PartyPopper,
    title: 'Events',
    description:
      'Corporate gatherings, birthday celebrations, and community events captured with a photojournalistic eye.',
    price: 'Starting at $400',
  },
  {
    icon: Building2,
    title: 'Commercial Photography',
    description:
      'Product shots, real-estate visuals, and editorial content that elevate your brand and drive engagement.',
    price: 'Starting at $500',
  },
  {
    icon: Palette,
    title: 'Brand Photography',
    description:
      'Curated imagery for entrepreneurs and creatives. Build a cohesive visual identity across every platform.',
    price: 'Starting at $350',
  },
];

const containerVariants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.12 },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 40 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] as const },
  },
};

export default function Services() {
  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: '-80px' });

  return (
    <section
      id="services"
      ref={sectionRef}
      className="relative py-24 md:py-32 px-6 md:px-12 lg:px-24 bg-[#F5F5F7]"
    >
      <div className="mx-auto max-w-6xl">
        {/* Heading */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold tracking-tight text-[#1D1D1F]">
            Our Services
          </h2>
          <p className="mt-4 text-lg text-[#6E6E73] max-w-2xl mx-auto">
            From intimate portraits to full-scale productions — every session is
            crafted with intention, precision, and heart.
          </p>
        </motion.div>

        {/* Cards Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? 'visible' : 'hidden'}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {services.map((service) => {
            const Icon = service.icon;
            return (
              <motion.div
                key={service.title}
                variants={cardVariants}
                whileHover={{
                  y: -8,
                  boxShadow: '0 20px 60px rgba(0,0,0,0.12)',
                  transition: { duration: 0.3, ease: 'easeOut' },
                }}
                className="group relative rounded-3xl p-8 cursor-pointer transition-colors"
                style={{
                  background:
                    'linear-gradient(135deg, rgba(255,255,255,0.6) 0%, rgba(255,255,255,0.35) 100%)',
                  backdropFilter: 'blur(24px)',
                  WebkitBackdropFilter: 'blur(24px)',
                  border: '1px solid rgba(255,255,255,0.5)',
                  boxShadow: '0 8px 32px rgba(0,0,0,0.06)',
                }}
              >
                {/* Icon */}
                <div className="mb-5 inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-gradient-to-br from-[#A78BFA] to-[#6366F1] text-white shadow-md">
                  <Icon className="w-6 h-6" strokeWidth={1.75} />
                </div>

                {/* Title */}
                <h3 className="text-xl font-semibold text-[#1D1D1F] mb-2">
                  {service.title}
                </h3>

                {/* Description */}
                <p className="text-[#6E6E73] leading-relaxed text-sm mb-6">
                  {service.description}
                </p>

                {/* Price */}
                <span className="inline-block text-sm font-medium text-[#6366F1]">
                  {service.price}
                </span>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}
