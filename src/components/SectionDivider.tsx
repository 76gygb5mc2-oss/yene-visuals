'use client';

import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';

export default function SectionDivider() {
  const ref = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  });

  // Parallax: the wave shifts vertically as the user scrolls
  const waveY = useTransform(scrollYProgress, [0, 1], [40, -40]);
  // Subtle horizontal drift for the lens flare
  const flareX = useTransform(scrollYProgress, [0, 1], ['-10%', '10%']);
  const flareOpacity = useTransform(scrollYProgress, [0, 0.3, 0.7, 1], [0, 0.6, 0.6, 0]);
  // Scale effect on the glow orb
  const orbScale = useTransform(scrollYProgress, [0, 0.5, 1], [0.8, 1.2, 0.9]);

  return (
    <div
      ref={ref}
      className="relative overflow-hidden"
      style={{
        height: '180px',
        background: 'linear-gradient(to bottom, #0a0a0a 0%, #1a1a1a 30%, #F5F5F7 100%)',
      }}
      aria-hidden="true"
    >
      {/* Curved wave SVG with parallax */}
      <motion.div
        className="absolute inset-x-0 bottom-0 w-full"
        style={{ y: waveY, willChange: 'transform' }}
      >
        <svg
          viewBox="0 0 1440 180"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-auto block"
          preserveAspectRatio="none"
        >
          {/* Deep shadow wave */}
          <path
            d="M0 180V100C120 120 240 60 480 80C720 100 960 40 1200 60C1320 70 1380 90 1440 100V180H0Z"
            fill="#F5F5F7"
            fillOpacity="0.3"
          />
          {/* Mid wave */}
          <path
            d="M0 180V120C180 90 360 140 600 110C840 80 1080 130 1260 100C1360 88 1420 105 1440 120V180H0Z"
            fill="#F5F5F7"
            fillOpacity="0.6"
          />
          {/* Foreground wave - solid */}
          <path
            d="M0 180V140C160 125 320 155 560 135C800 115 1040 150 1280 130C1380 122 1420 138 1440 145V180H0Z"
            fill="#F5F5F7"
          />
        </svg>
      </motion.div>

      {/* Lens flare / glow orb */}
      <motion.div
        className="absolute top-1/2 left-1/2 -translate-y-1/2 pointer-events-none"
        style={{
          x: flareX,
          opacity: flareOpacity,
          scale: orbScale,
          willChange: 'transform, opacity',
        }}
      >
        <div
          className="rounded-full"
          style={{
            width: '300px',
            height: '300px',
            background:
              'radial-gradient(circle, rgba(212,175,55,0.15) 0%, rgba(212,175,55,0.05) 40%, transparent 70%)',
            filter: 'blur(40px)',
          }}
        />
      </motion.div>

      {/* Secondary flare accent */}
      <motion.div
        className="absolute top-1/3 right-1/4 pointer-events-none"
        style={{
          opacity: flareOpacity,
          scale: orbScale,
          willChange: 'transform, opacity',
        }}
      >
        <div
          className="rounded-full"
          style={{
            width: '120px',
            height: '120px',
            background:
              'radial-gradient(circle, rgba(255,255,255,0.08) 0%, transparent 70%)',
            filter: 'blur(20px)',
          }}
        />
      </motion.div>

      {/* Floating micro particles */}
      {[...Array(6)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full pointer-events-none"
          style={{
            width: `${3 + i * 2}px`,
            height: `${3 + i * 2}px`,
            left: `${15 + i * 14}%`,
            top: `${20 + (i % 3) * 25}%`,
            background: `rgba(255,255,255,${0.05 + i * 0.02})`,
            y: useTransform(scrollYProgress, [0, 1], [10 * (i % 2 === 0 ? 1 : -1), -10 * (i % 2 === 0 ? 1 : -1)]),
            willChange: 'transform',
          }}
        />
      ))}
    </div>
  );
}
