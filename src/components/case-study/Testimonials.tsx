/**
 * Testimonials Component
 *
 * Displays a list or grid of client testimonials.
 *
 * @module components/case-study/Testimonials
 */

import Image from "next/image";
import type { Testimonial } from "@/types";

interface TestimonialsProps {
  testimonials: Testimonial[];
}

export function Testimonials({ testimonials }: TestimonialsProps) {
  if (!testimonials || testimonials.length === 0) return null;

  return (
    <section className="my-16" aria-labelledby="testimonials-heading">
      <h2 id="testimonials-heading" className="text-2xl font-bold text-white mb-8">
        Client Feedback
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {testimonials.map((testimonial, i) => (
          <div
            key={i}
            className="rounded-2xl border border-[var(--color-accent-violet)]/30 bg-gradient-to-br from-white/5 to-[var(--color-accent-violet)]/5 p-8 relative"
          >
            {/* Quote Icon */}
            <div className="absolute top-6 right-6 text-[var(--color-accent-violet)]/20">
              <svg width="40" height="40" viewBox="0 0 24 24" fill="currentColor">
                <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
              </svg>
            </div>

            <blockquote className="relative z-10 mb-6">
              <p className="text-lg text-slate-300 italic leading-relaxed">
                &quot;{testimonial.quote}&quot;
              </p>
            </blockquote>

            <div className="flex items-center gap-4">
              {testimonial.photo ? (
                <div className="w-12 h-12 rounded-full overflow-hidden border border-white/20 relative shrink-0">
                  <Image
                    src={testimonial.photo}
                    alt={testimonial.name}
                    fill
                    className="object-cover"
                    sizes="48px"
                  />
                </div>
              ) : (
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[var(--color-accent-cyan)] to-[var(--color-accent-violet)] flex items-center justify-center text-white font-bold shrink-0">
                  {testimonial.name.charAt(0)}
                </div>
              )}
              <div>
                <cite className="not-italic font-semibold text-white block">
                  {testimonial.name}
                </cite>
                <span className="text-sm text-slate-400 block">
                  {testimonial.role} at {testimonial.company}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
