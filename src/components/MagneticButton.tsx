'use client';

import { useRef, type ReactNode } from 'react';
import {
  motion,
  useMotionValue,
  useSpring,
} from 'framer-motion';

interface MagneticButtonProps {
  children: ReactNode;
  className?: string;
  href?: string;
}

const SPRING_CONFIG = { damping: 20, stiffness: 300, mass: 0.5 };
const MAX_DISTANCE = 5; // max px of magnetic pull

export default function MagneticButton({
  children,
  className = '',
  href,
}: MagneticButtonProps) {
  const divRef = useRef<HTMLDivElement>(null);
  const anchorRef = useRef<HTMLAnchorElement>(null);

  const x = useMotionValue(0);
  const y = useMotionValue(0);

  // Spring for buttery smooth return
  const springX = useSpring(x, SPRING_CONFIG);
  const springY = useSpring(y, SPRING_CONFIG);

  const handleMouseMove = (e: React.MouseEvent) => {
    const el = (href ? anchorRef.current : divRef.current) as HTMLElement | null;
    if (!el) return;

    const rect = el.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    const deltaX = e.clientX - centerX;
    const deltaY = e.clientY - centerY;

    // Normalize movement to max distance
    const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
    const maxDim = Math.max(rect.width, rect.height);
    const factor = Math.min(distance / maxDim, 1);

    x.set(distance > 0 ? (deltaX / distance) * factor * MAX_DISTANCE : 0);
    y.set(distance > 0 ? (deltaY / distance) * factor * MAX_DISTANCE : 0);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  const sharedStyle = {
    x: springX,
    y: springY,
    willChange: 'transform' as const,
  };

  if (href) {
    return (
      <motion.a
        ref={anchorRef}
        href={href}
        style={sharedStyle}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        className={`inline-block ${className}`}
      >
        {children}
      </motion.a>
    );
  }

  return (
    <motion.div
      ref={divRef}
      style={sharedStyle}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className={`inline-block ${className}`}
    >
      {children}
    </motion.div>
  );
}
