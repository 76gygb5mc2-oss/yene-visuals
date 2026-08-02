'use client';

import { useState, useRef } from 'react';
import { motion, AnimatePresence, useInView } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { CheckCircle, ChevronLeft, ChevronRight, Send } from 'lucide-react';

/* ------------------------------------------------------------------ */
/*  Schema                                                             */
/* ------------------------------------------------------------------ */
const bookingSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email'),
  phone: z
    .string()
    .min(7, 'Please enter a valid phone number')
    .regex(/^[\d\s\-+()]+$/, 'Phone can only contain digits, spaces, and dashes'),
  sessionType: z.string().min(1, 'Please select a session type'),
  preferredDate: z.string().min(1, 'Please choose a preferred date'),
  location: z.string().min(2, 'Location must be at least 2 characters'),
  budget: z.string().min(1, 'Please select a budget range'),
  notes: z.string().optional(),
});

type BookingFormData = z.infer<typeof bookingSchema>;

/* ------------------------------------------------------------------ */
/*  Step field mapping for partial validation                          */
/* ------------------------------------------------------------------ */
const stepFields: (keyof BookingFormData)[][] = [
  ['name', 'email', 'phone'],
  ['sessionType', 'preferredDate', 'location'],
  ['budget', 'notes'],
];

const sessionTypes = [
  'Portrait Photography',
  'Wedding Photography',
  'Graduation Sessions',
  'Events',
  'Commercial Photography',
  'Brand Photography',
];

const budgetRanges = [
  'Under $300',
  '$300 – $600',
  '$600 – $1,500',
  '$1,500 – $3,000',
  '$3,000+',
];

/* ------------------------------------------------------------------ */
/*  Shared Styles                                                      */
/* ------------------------------------------------------------------ */
const inputBase =
  'w-full rounded-xl border border-gray-200 bg-white/70 backdrop-blur-md px-4 py-3 text-[#1D1D1F] placeholder:text-[#6E6E73]/50 outline-none transition-all duration-300 focus:border-[#6366F1] focus:ring-2 focus:ring-[#6366F1]/20 text-base';

const labelBase = 'block text-sm font-medium text-[#1D1D1F] mb-1.5';
const errorBase = 'mt-1 text-xs text-red-500';

/* ------------------------------------------------------------------ */
/*  Motion variants                                                    */
/* ------------------------------------------------------------------ */
const slideVariants = {
  enter: (direction: number) => ({
    x: direction > 0 ? 80 : -80,
    opacity: 0,
  }),
  center: { x: 0, opacity: 1 },
  exit: (direction: number) => ({
    x: direction > 0 ? -80 : 80,
    opacity: 0,
  }),
};

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */
export default function Booking() {
  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: '-80px' });

  const [step, setStep] = useState(0);
  const [direction, setDirection] = useState(1);
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const {
    register,
    trigger,
    handleSubmit,
    formState: { errors },
  } = useForm<BookingFormData>({
    resolver: zodResolver(bookingSchema),
    mode: 'onTouched',
  });

  const totalSteps = 3;

  async function goNext() {
    const valid = await trigger(stepFields[step]);
    if (valid) {
      setDirection(1);
      setStep((s) => Math.min(s + 1, totalSteps - 1));
    }
  }

  function goBack() {
    setDirection(-1);
    setStep((s) => Math.max(s - 1, 0));
  }

  async function onSubmit(data: BookingFormData) {
    setSubmitting(true);
    setSubmitError(null);
    try {
      const res = await fetch('/api/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: data.name,
          email: data.email,
          phone: data.phone,
          sessionType: data.sessionType,
          date: data.preferredDate,
          location: data.location,
          budget: data.budget,
          notes: data.notes || '',
        }),
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || 'Failed to submit booking');
      }
      setSubmitted(true);
    } catch (err) {
      setSubmitError(err instanceof Error ? err.message : 'Something went wrong. Please try again.');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <section
      id="booking"
      ref={sectionRef}
      className="relative py-24 md:py-32 px-6 md:px-12 lg:px-24 bg-white overflow-hidden"
    >
      <div className="mx-auto max-w-2xl">
        {/* Heading */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl md:text-5xl font-bold tracking-tight text-[#1D1D1F]">
            Book a Session
          </h2>
          <p className="mt-4 text-lg text-[#6E6E73] max-w-xl mx-auto">
            Ready to create something beautiful? Fill out the form below and
            we&apos;ll get back to you within 24 hours.
          </p>
        </motion.div>

        {/* Glass Card */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, delay: 0.15, ease: [0.25, 0.46, 0.45, 0.94] }}
          className="rounded-3xl p-8 md:p-10"
          style={{
            background:
              'linear-gradient(135deg, rgba(255,255,255,0.65) 0%, rgba(255,255,255,0.35) 100%)',
            backdropFilter: 'blur(24px)',
            WebkitBackdropFilter: 'blur(24px)',
            border: '1px solid rgba(255,255,255,0.5)',
            boxShadow: '0 8px 40px rgba(0,0,0,0.08)',
          }}
        >
          <AnimatePresence mode="wait">
            {submitted ? (
              /* ---- Success State ---- */
              <motion.div
                key="success"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, ease: 'easeOut' }}
                className="flex flex-col items-center justify-center py-12 text-center"
              >
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{
                    type: 'spring',
                    stiffness: 200,
                    damping: 12,
                    delay: 0.2,
                  }}
                >
                  <CheckCircle className="w-20 h-20 text-green-500 mb-6" strokeWidth={1.5} />
                </motion.div>
                <h3 className="text-2xl font-semibold text-[#1D1D1F] mb-2">
                  You&apos;re All Set!
                </h3>
                <p className="text-[#6E6E73] max-w-sm">
                  Thank you for booking with Yene Visuals. We&apos;ll review your
                  details and reach out shortly.
                </p>
              </motion.div>
            ) : (
              /* ---- Form ---- */
              <motion.div key="form" initial={{ opacity: 1 }} exit={{ opacity: 0 }}>
                {/* Progress Bar */}
                <div className="mb-8">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-sm font-medium text-[#6E6E73]">
                      Step {step + 1} of {totalSteps}
                    </span>
                    <span className="text-sm text-[#6E6E73]">
                      {step === 0
                        ? 'Your Info'
                        : step === 1
                        ? 'Session Details'
                        : 'Final Details'}
                    </span>
                  </div>

                  {/* Bar */}
                  <div className="h-1.5 w-full rounded-full bg-gray-200 overflow-hidden">
                    <motion.div
                      className="h-full rounded-full bg-gradient-to-r from-[#A78BFA] to-[#6366F1]"
                      initial={false}
                      animate={{ width: `${((step + 1) / totalSteps) * 100}%` }}
                      transition={{ duration: 0.4, ease: 'easeInOut' }}
                    />
                  </div>

                  {/* Dots */}
                  <div className="flex justify-center gap-3 mt-4">
                    {Array.from({ length: totalSteps }).map((_, i) => (
                      <div
                        key={i}
                        className={`w-2.5 h-2.5 rounded-full transition-colors duration-300 ${
                          i <= step ? 'bg-[#6366F1]' : 'bg-gray-300'
                        }`}
                      />
                    ))}
                  </div>
                </div>

                {/* Steps */}
                <form onSubmit={handleSubmit(onSubmit)}>
                  <AnimatePresence mode="wait" custom={direction}>
                    {/* Step 1 */}
                    {step === 0 && (
                      <motion.div
                        key="step-0"
                        custom={direction}
                        variants={slideVariants}
                        initial="enter"
                        animate="center"
                        exit="exit"
                        transition={{ duration: 0.35, ease: 'easeInOut' }}
                        className="space-y-5"
                      >
                        <div>
                          <label htmlFor="name" className={labelBase}>
                            Full Name
                          </label>
                          <input
                            id="name"
                            type="text"
                            placeholder="Jane Doe"
                            className={inputBase}
                            {...register('name')}
                          />
                          {errors.name && (
                            <p className={errorBase}>{errors.name.message}</p>
                          )}
                        </div>

                        <div>
                          <label htmlFor="email" className={labelBase}>
                            Email Address
                          </label>
                          <input
                            id="email"
                            type="email"
                            placeholder="jane@example.com"
                            className={inputBase}
                            {...register('email')}
                          />
                          {errors.email && (
                            <p className={errorBase}>{errors.email.message}</p>
                          )}
                        </div>

                        <div>
                          <label htmlFor="phone" className={labelBase}>
                            Phone Number
                          </label>
                          <input
                            id="phone"
                            type="tel"
                            placeholder="(555) 123-4567"
                            className={inputBase}
                            {...register('phone')}
                          />
                          {errors.phone && (
                            <p className={errorBase}>{errors.phone.message}</p>
                          )}
                        </div>
                      </motion.div>
                    )}

                    {/* Step 2 */}
                    {step === 1 && (
                      <motion.div
                        key="step-1"
                        custom={direction}
                        variants={slideVariants}
                        initial="enter"
                        animate="center"
                        exit="exit"
                        transition={{ duration: 0.35, ease: 'easeInOut' }}
                        className="space-y-5"
                      >
                        <div>
                          <label htmlFor="sessionType" className={labelBase}>
                            Session Type
                          </label>
                          <select
                            id="sessionType"
                            className={inputBase}
                            {...register('sessionType')}
                          >
                            <option value="">Select a service</option>
                            {sessionTypes.map((t) => (
                              <option key={t} value={t}>
                                {t}
                              </option>
                            ))}
                          </select>
                          {errors.sessionType && (
                            <p className={errorBase}>{errors.sessionType.message}</p>
                          )}
                        </div>

                        <div>
                          <label htmlFor="preferredDate" className={labelBase}>
                            Preferred Date
                          </label>
                          <input
                            id="preferredDate"
                            type="date"
                            className={inputBase}
                            {...register('preferredDate')}
                          />
                          {errors.preferredDate && (
                            <p className={errorBase}>
                              {errors.preferredDate.message}
                            </p>
                          )}
                        </div>

                        <div>
                          <label htmlFor="location" className={labelBase}>
                            Location
                          </label>
                          <input
                            id="location"
                            type="text"
                            placeholder="City, State or Venue"
                            className={inputBase}
                            {...register('location')}
                          />
                          {errors.location && (
                            <p className={errorBase}>{errors.location.message}</p>
                          )}
                        </div>
                      </motion.div>
                    )}

                    {/* Step 3 */}
                    {step === 2 && (
                      <motion.div
                        key="step-2"
                        custom={direction}
                        variants={slideVariants}
                        initial="enter"
                        animate="center"
                        exit="exit"
                        transition={{ duration: 0.35, ease: 'easeInOut' }}
                        className="space-y-5"
                      >
                        <div>
                          <label htmlFor="budget" className={labelBase}>
                            Budget Range
                          </label>
                          <select
                            id="budget"
                            className={inputBase}
                            {...register('budget')}
                          >
                            <option value="">Select a range</option>
                            {budgetRanges.map((b) => (
                              <option key={b} value={b}>
                                {b}
                              </option>
                            ))}
                          </select>
                          {errors.budget && (
                            <p className={errorBase}>{errors.budget.message}</p>
                          )}
                        </div>

                        <div>
                          <label htmlFor="notes" className={labelBase}>
                            Additional Notes
                          </label>
                          <textarea
                            id="notes"
                            rows={4}
                            placeholder="Tell us about your vision, preferred style, or any special requests…"
                            className={`${inputBase} resize-none`}
                            {...register('notes')}
                          />
                          {errors.notes && (
                            <p className={errorBase}>{errors.notes.message}</p>
                          )}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* Navigation Buttons */}
                  <div className="flex items-center justify-between mt-8">
                    {step > 0 ? (
                      <button
                        type="button"
                        onClick={goBack}
                        className="inline-flex items-center gap-1 text-sm font-medium text-[#6E6E73] hover:text-[#1D1D1F] transition-colors"
                      >
                        <ChevronLeft className="w-4 h-4" />
                        Back
                      </button>
                    ) : (
                      <span />
                    )}

                    {step < totalSteps - 1 ? (
                      <button
                        type="button"
                        onClick={goNext}
                        className="inline-flex items-center gap-1 rounded-full bg-gradient-to-r from-[#A78BFA] to-[#6366F1] px-6 py-2.5 text-sm font-semibold text-white shadow-md hover:shadow-lg transition-shadow"
                      >
                        Next
                        <ChevronRight className="w-4 h-4" />
                      </button>
                    ) : (
                      <button
                        type="submit"
                        disabled={submitting}
                        className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-[#A78BFA] to-[#6366F1] px-6 py-2.5 text-sm font-semibold text-white shadow-md hover:shadow-lg transition-shadow disabled:opacity-60 disabled:cursor-not-allowed"
                      >
                        <Send className="w-4 h-4" />
                        {submitting ? 'Submitting…' : 'Submit Booking'}
                      </button>
                    )}
                  </div>

                  {/* Error Message */}
                  {submitError && (
                    <motion.p
                      initial={{ opacity: 0, y: -5 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="mt-4 text-center text-sm text-red-500"
                    >
                      {submitError}
                    </motion.p>
                  )}
                </form>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </section>
  );
}
