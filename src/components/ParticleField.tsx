'use client';

import { useState, useEffect } from 'react';

interface Particle {
  id: number;
  x: number;
  y: number;
  size: number;
  opacity: number;
  duration: number;
  delay: number;
  color: string;
  driftX: number;
  driftY: number;
}

const COLORS = [
  'rgba(255,255,255,0.08)',
  'rgba(255,255,255,0.05)',
  'rgba(255,255,255,0.03)',
  'rgba(212,175,55,0.06)',
  'rgba(212,175,55,0.04)',
  'rgba(245,230,180,0.05)',
];

export default function ParticleField({ count = 18 }: { count?: number }) {
  const [particles, setParticles] = useState<Particle[]>([]);

  useEffect(() => {
    // Generate particles client-side only to avoid hydration mismatch
    const generated: Particle[] = Array.from({ length: count }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: 4 + Math.random() * 36,
      opacity: 0.3 + Math.random() * 0.7,
      duration: 12 + Math.random() * 20,
      delay: Math.random() * -20,
      color: COLORS[Math.floor(Math.random() * COLORS.length)],
      driftX: -30 + Math.random() * 60,
      driftY: -40 + Math.random() * 80,
    }));
    setParticles(generated);
  }, [count]);

  if (particles.length === 0) return null;

  return (
    <>
      <style jsx>{`
        @keyframes bokeh-float {
          0%,
          100% {
            transform: translate(0, 0) scale(1);
            opacity: var(--p-opacity);
          }
          25% {
            transform: translate(calc(var(--drift-x) * 0.5), calc(var(--drift-y) * -0.3)) scale(1.1);
            opacity: calc(var(--p-opacity) * 0.7);
          }
          50% {
            transform: translate(var(--drift-x), var(--drift-y)) scale(0.9);
            opacity: var(--p-opacity);
          }
          75% {
            transform: translate(calc(var(--drift-x) * 0.3), calc(var(--drift-y) * 0.6)) scale(1.05);
            opacity: calc(var(--p-opacity) * 0.8);
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .bokeh-particle {
            animation: none !important;
          }
        }
      `}</style>

      <div
        className="absolute inset-0 overflow-hidden pointer-events-none"
        style={{ zIndex: 1 }}
        aria-hidden="true"
      >
        {particles.map((p) => (
          <div
            key={p.id}
            className="bokeh-particle absolute rounded-full"
            style={{
              left: `${p.x}%`,
              top: `${p.y}%`,
              width: `${p.size}px`,
              height: `${p.size}px`,
              background: `radial-gradient(circle at 30% 30%, ${p.color}, transparent 70%)`,
              boxShadow: p.size > 20 ? `0 0 ${p.size * 0.6}px ${p.color}` : 'none',
              ['--p-opacity' as string]: p.opacity,
              ['--drift-x' as string]: `${p.driftX}px`,
              ['--drift-y' as string]: `${p.driftY}px`,
              animation: `bokeh-float ${p.duration}s ease-in-out ${p.delay}s infinite`,
              willChange: 'transform, opacity',
            }}
          />
        ))}
      </div>
    </>
  );
}
