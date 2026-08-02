'use client';

import { useRef, useEffect, useState } from 'react';
import { motion, useInView } from 'framer-motion';

const milestones = [
  { year: '2016', description: 'Picked up the first camera and fell in love with storytelling through light.' },
  { year: '2018', description: 'Launched Yene Visuals and booked the first 50 portrait sessions.' },
  { year: '2021', description: 'Expanded into weddings & events, serving clients across 15+ states.' },
  { year: '2024', description: 'Reached 500+ sessions and built a nationally recognized brand.' },
];

const stats = [
  { value: 500, suffix: '+', label: 'Sessions Completed' },
  { value: 350, suffix: '+', label: 'Happy Clients' },
  { value: 25, suffix: '+', label: 'States Served' },
  { value: 8, suffix: '+', label: 'Years of Experience' },
];

function AnimatedCounter({ target, suffix }: { target: number; suffix: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-50px' });
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!isInView) return;
    let start = 0;
    const duration = 2000;
    const increment = target / (duration / 16);
    const timer = setInterval(() => {
      start += increment;
      if (start >= target) {
        setCount(target);
        clearInterval(timer);
      } else {
        setCount(Math.floor(start));
      }
    }, 16);
    return () => clearInterval(timer);
  }, [isInView, target]);

  return (
    <span ref={ref} className="text-4xl md:text-5xl font-bold text-[#1D1D1F]">
      {count}
      {suffix}
    </span>
  );
}

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.15, duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] as const },
  }),
};

export default function About() {
  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: '-100px' });

  return (
    <section
      id="about"
      ref={sectionRef}
      className="relative py-24 md:py-32 px-6 md:px-12 lg:px-24 bg-white overflow-hidden"
    >
      <div className="mx-auto max-w-6xl">
        {/* Top row: Portrait + Bio */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center mb-24">
          {/* Portrait Placeholder */}
          <motion.div
            variants={fadeUp}
            initial="hidden"
            animate={isInView ? 'visible' : 'hidden'}
            custom={0}
            className="flex justify-center"
          >
            <div className="relative w-72 h-96 md:w-80 md:h-[28rem] rounded-3xl overflow-hidden shadow-2xl">
              <div className="absolute inset-0 bg-gradient-to-br from-[#A78BFA] via-[#818CF8] to-[#6366F1] opacity-80" />
              <div className="absolute inset-0 flex items-center justify-center">
                <svg
                  className="w-24 h-24 text-white/40"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={1}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.5 20.25a8.25 8.25 0 0116.5 0"
                  />
                </svg>
              </div>
            </div>
          </motion.div>

          {/* Bio */}
          <div className="space-y-6">
            <motion.h2
              variants={fadeUp}
              initial="hidden"
              animate={isInView ? 'visible' : 'hidden'}
              custom={1}
              className="text-4xl md:text-5xl font-bold tracking-tight text-[#1D1D1F]"
            >
              About Yene Visuals
            </motion.h2>
            <motion.p
              variants={fadeUp}
              initial="hidden"
              animate={isInView ? 'visible' : 'hidden'}
              custom={2}
              className="text-lg leading-relaxed text-[#6E6E73]"
            >
              Yene Visuals was born from a deep passion for capturing the
              authentic beauty of every moment. With an eye for natural light and
              genuine emotion, we craft images that feel as alive as the stories
              behind them. From intimate portraits to grand celebrations, every
              session is a collaboration — designed to reflect who you truly are.
            </motion.p>
            <motion.p
              variants={fadeUp}
              initial="hidden"
              animate={isInView ? 'visible' : 'hidden'}
              custom={3}
              className="text-lg leading-relaxed text-[#6E6E73]"
            >
              Based in the heart of the U.S. and available nationwide, we believe
              photography is more than pictures — it&apos;s a legacy you pass down
              for generations.
            </motion.p>
          </div>
        </div>

        {/* Timeline */}
        <motion.div
          variants={fadeUp}
          initial="hidden"
          animate={isInView ? 'visible' : 'hidden'}
          custom={4}
          className="mb-24"
        >
          <h3 className="text-2xl font-semibold text-[#1D1D1F] mb-12 text-center">
            Our Journey
          </h3>
          <div className="relative">
            {/* Vertical line */}
            <div className="absolute left-4 md:left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-[#A78BFA] to-[#6366F1] md:-translate-x-px" />

            <div className="space-y-12">
              {milestones.map((m, i) => (
                <motion.div
                  key={m.year}
                  variants={fadeUp}
                  initial="hidden"
                  animate={isInView ? 'visible' : 'hidden'}
                  custom={5 + i}
                  className={`relative flex items-start gap-6 md:gap-0 ${
                    i % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'
                  }`}
                >
                  {/* Dot */}
                  <div className="absolute left-4 md:left-1/2 w-3 h-3 rounded-full bg-[#6366F1] -translate-x-1.5 mt-1.5 ring-4 ring-white z-10" />

                  {/* Content */}
                  <div className={`ml-12 md:ml-0 md:w-1/2 ${i % 2 === 0 ? 'md:pr-12 md:text-right' : 'md:pl-12 md:text-left'}`}>
                    <span className="text-sm font-semibold text-[#6366F1] tracking-wide uppercase">
                      {m.year}
                    </span>
                    <p className="mt-1 text-[#6E6E73] leading-relaxed">
                      {m.description}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {stats.map((stat, i) => (
            <motion.div
              key={stat.label}
              variants={fadeUp}
              initial="hidden"
              animate={isInView ? 'visible' : 'hidden'}
              custom={9 + i}
              className="relative rounded-3xl bg-white/60 backdrop-blur-lg border border-white/40 shadow-lg p-8 text-center"
              style={{
                background:
                  'linear-gradient(135deg, rgba(255,255,255,0.7) 0%, rgba(255,255,255,0.3) 100%)',
                boxShadow: '0 8px 32px rgba(0,0,0,0.08)',
              }}
            >
              <AnimatedCounter target={stat.value} suffix={stat.suffix} />
              <p className="mt-2 text-sm font-medium text-[#6E6E73]">
                {stat.label}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
