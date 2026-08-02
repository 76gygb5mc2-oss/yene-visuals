'use client';

import { useEffect, useRef } from 'react';
import {
  motion,
  useMotionValue,
  useTransform,
  useAnimation,
} from 'framer-motion';
import { ChevronDown } from 'lucide-react';
import ParticleField from './ParticleField';

export default function Hero() {
  const containerRef = useRef<HTMLDivElement>(null);
  const controls = useAnimation();

  // Mouse parallax
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const bgX = useTransform(mouseX, [-0.5, 0.5], [-20, 20]);
  const bgY = useTransform(mouseY, [-0.5, 0.5], [-20, 20]);

  const floatX = useTransform(mouseX, [-0.5, 0.5], [15, -15]);
  const floatY = useTransform(mouseY, [-0.5, 0.5], [15, -15]);

  useEffect(() => {
    controls.start('visible');

    const handleMouseMove = (e: MouseEvent) => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;
      mouseX.set(x);
      mouseY.set(y);
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [controls, mouseX, mouseY]);

  const containerVariants = {
    hidden: {},
    visible: {
      transition: { staggerChildren: 0.15, delayChildren: 0.3 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] as const },
    },
  };

  return (
    <section
      ref={containerRef}
      className="relative min-h-screen flex items-center justify-center overflow-hidden"
    >
      {/* ===== Background Layer — blurred photo ===== */}
      <motion.div
        className="absolute inset-0 scale-125"
        style={{ x: bgX, y: bgY }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/hero-bg.jpg"
          alt=""
          className="absolute inset-0 w-full h-full object-cover blur-sm"
          style={{ filter: 'blur(4px) brightness(0.6) saturate(1.2)' }}
        />
      </motion.div>

      {/* Dark overlay for readability */}
      <div className="absolute inset-0 bg-black/40" />

      {/* Bokeh particle effect */}
      <ParticleField />

      {/* Gradient overlay — cinematic vignette */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/20 to-black/70" />
      <div className="absolute inset-0 bg-gradient-to-r from-black/30 via-transparent to-black/30" />

      {/* Warm accent glows */}
      <div className="absolute top-1/4 right-1/4 w-[600px] h-[600px] rounded-full bg-[#c8956c]/10 blur-[120px]" />
      <div className="absolute bottom-1/4 left-1/3 w-[400px] h-[400px] rounded-full bg-[#d4a574]/10 blur-[100px]" />

      {/* Decorative floating elements */}
      <motion.div
        className="absolute top-[15%] left-[10%] w-24 h-24 rounded-full border border-white/10"
        style={{ x: floatX, y: floatY }}
        animate={{
          y: [0, -15, 0],
          rotate: [0, 5, 0],
        }}
        transition={{
          duration: 6,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      />
      <motion.div
        className="absolute bottom-[20%] right-[15%] w-16 h-16 rounded-full border border-white/10 backdrop-blur-sm"
        style={{ x: floatX, y: floatY }}
        animate={{
          y: [0, 12, 0],
          rotate: [0, -8, 0],
        }}
        transition={{
          duration: 7,
          repeat: Infinity,
          ease: 'easeInOut',
          delay: 1,
        }}
      />
      <motion.div
        className="absolute top-[40%] right-[8%] w-2 h-2 rounded-full bg-white/30"
        style={{ x: floatX, y: floatY }}
        animate={{
          scale: [1, 1.5, 1],
          opacity: [0.3, 0.7, 0.3],
        }}
        transition={{
          duration: 4,
          repeat: Infinity,
          ease: 'easeInOut',
          delay: 0.5,
        }}
      />
      <motion.div
        className="absolute top-[60%] left-[20%] w-1.5 h-1.5 rounded-full bg-[#d4a574]/40"
        animate={{
          scale: [1, 2, 1],
          opacity: [0.4, 0.8, 0.4],
        }}
        transition={{
          duration: 5,
          repeat: Infinity,
          ease: 'easeInOut',
          delay: 2,
        }}
      />

      {/* Content */}
      <motion.div
        className="relative z-10 text-center px-6 max-w-5xl mx-auto"
        variants={containerVariants}
        initial="hidden"
        animate={controls}
      >
        {/* Logo */}
        <motion.div variants={itemVariants} className="mb-10">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/logo-white.svg"
            alt="Yene Visuals"
            className="h-14 md:h-20 lg:h-24 w-auto mx-auto"
          />
        </motion.div>

        {/* Tagline */}
        <motion.h1
          variants={itemVariants}
          className="text-2xl md:text-3xl lg:text-4xl font-light text-white/90 leading-relaxed tracking-wide mb-4"
        >
          Photography That Tells Your Story
        </motion.h1>

        {/* Subheadline */}
        <motion.p
          variants={itemVariants}
          className="text-base md:text-lg text-white/50 font-light max-w-2xl mx-auto mb-12 leading-relaxed"
        >
          Professional photography across the United States.
        </motion.p>

        {/* CTA Buttons */}
        <motion.div
          variants={itemVariants}
          className="flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          <a
            href="#portfolio"
            className="group relative inline-flex items-center justify-center px-8 py-3.5 text-sm font-medium text-white rounded-full border border-white/30 backdrop-blur-md bg-white/5 transition-all duration-300 hover:bg-white/15 hover:border-white/50 hover:scale-105 active:scale-95 min-w-[180px]"
          >
            <span className="relative z-10">View Portfolio</span>
          </a>
          <a
            href="#booking"
            className="group relative inline-flex items-center justify-center px-8 py-3.5 text-sm font-medium text-[#1D1D1F] rounded-full bg-white transition-all duration-300 hover:bg-white/90 hover:scale-105 hover:shadow-lg hover:shadow-white/20 active:scale-95 min-w-[180px]"
          >
            <span className="relative z-10">Book a Session</span>
          </a>
        </motion.div>
      </motion.div>

      {/* Scroll indicator */}
      <motion.div
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5, duration: 0.8 }}
      >
        <span className="text-white/40 text-xs tracking-[0.2em] uppercase">
          Scroll
        </span>
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        >
          <ChevronDown className="w-5 h-5 text-white/40" />
        </motion.div>
      </motion.div>
    </section>
  );
}
