'use client';

import { useRef, type ElementType } from 'react';
import { motion, useInView } from 'framer-motion';

interface TextRevealProps {
  text: string;
  className?: string;
  as?: ElementType;
  delay?: number;
}

export default function TextReveal({
  text,
  className = '',
  as: Tag = 'span',
  delay = 0,
}: TextRevealProps) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-10% 0px' });

  // Split into words first, then characters within words, preserving spaces
  const words = text.split(' ');

  let charIndex = 0;

  return (
    <Tag ref={ref} className={`${className}`} style={{ display: 'inline-block' }}>
      {words.map((word, wordIdx) => (
        <span
          key={wordIdx}
          style={{ display: 'inline-block', whiteSpace: 'nowrap' }}
        >
          {word.split('').map((char) => {
            const currentIndex = charIndex++;
            return (
              <motion.span
                key={`${wordIdx}-${currentIndex}`}
                style={{
                  display: 'inline-block',
                  willChange: 'transform, opacity',
                }}
                initial={{ opacity: 0, y: 20, rotateX: 40 }}
                animate={
                  isInView
                    ? { opacity: 1, y: 0, rotateX: 0 }
                    : { opacity: 0, y: 20, rotateX: 40 }
                }
                transition={{
                  duration: 0.4,
                  ease: [0.25, 0.46, 0.45, 0.94],
                  delay: delay + currentIndex * 0.025,
                }}
              >
                {char}
              </motion.span>
            );
          })}
          {/* Add space between words (except after last word) */}
          {wordIdx < words.length - 1 && (
            <span style={{ display: 'inline-block', width: '0.3em' }}>
              &nbsp;
            </span>
          )}
        </span>
      ))}
    </Tag>
  );
}
