"use client";

/**
 * Contact Scene
 *
 * Enhanced contact form with react-hook-form, Zod validation,
 * real-time field validation, character count, honeypot bot detection,
 * and sessionStorage persistence.
 */

import { useRef, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { contactData } from "@/content/contact";
import { contactFormSchema, type ContactFormData } from "@/lib/validation/contact.schema";
import { InteractiveButton } from "../ui/InteractiveButton";
import { useUIStore } from "@/store/ui.store";

const SESSION_STORAGE_KEY = "contact-form-draft";
const MESSAGE_MAX_LENGTH = 1000;

export function ContactScene() {
  const containerRef = useRef<HTMLElement>(null);
  const addToast = useUIStore((s) => s.addToast);

  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors, isSubmitting, isValid, dirtyFields },
    setValue,
  } = useForm<ContactFormData>({
    resolver: zodResolver(contactFormSchema),
    mode: "onChange",
    defaultValues: {
      name: "",
      email: "",
      subject: "",
      message: "",
      honeypot: "",
    },
  });

  // Watch message for character count
  const messageValue = watch("message");

  // Restore form from sessionStorage on mount
  useEffect(() => {
    try {
      const saved = sessionStorage.getItem(SESSION_STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.name) setValue("name", parsed.name, { shouldValidate: true });
        if (parsed.email) setValue("email", parsed.email, { shouldValidate: true });
        if (parsed.subject) setValue("subject", parsed.subject, { shouldValidate: true });
        if (parsed.message) setValue("message", parsed.message, { shouldValidate: true });
      }
    } catch {
      // Ignore parse errors
    }
  }, [setValue]);

  // Save form to sessionStorage on change (debounced via watch)
  const allFields = watch();
  useEffect(() => {
    const timeout = setTimeout(() => {
      try {
        const { honeypot, ...saveable } = allFields;
        void honeypot;
        sessionStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(saveable));
      } catch {
        // Ignore storage errors
      }
    }, 500);

    return () => clearTimeout(timeout);
  }, [allFields]);

  // GSAP scroll animation
  useGSAP(
    () => {
      gsap.fromTo(
        ".contact-reveal",
        { y: 50, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.8,
          stagger: 0.15,
          ease: "power3.out",
          scrollTrigger: {
            trigger: containerRef.current,
            start: "top 80%",
          },
        }
      );
    },
    { scope: containerRef }
  );

  const onSubmit = async (data: ContactFormData) => {
    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const result: { success: boolean; error?: { message: string } } = await response.json();

      if (result.success) {
        addToast({
          type: "success",
          message: "Message sent successfully! I'll get back to you soon.",
        });
        reset();
        sessionStorage.removeItem(SESSION_STORAGE_KEY);
      } else if (response.status === 429) {
        addToast({
          type: "error",
          message: "Too many requests. Please try again later.",
        });
      } else {
        addToast({
          type: "error",
          message: result.error?.message || "Failed to send message. Please try again.",
        });
      }
    } catch {
      addToast({
        type: "error",
        message: "Network error. Please check your connection.",
      });
    }
  };

  return (
    <section
      id="contact"
      ref={containerRef}
      className="w-full pt-24 pb-12 px-4 md:px-8 bg-[var(--color-bg-secondary)] relative overflow-hidden"
    >
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 mb-20">
          {/* Left Col: Info */}
          <div className="flex flex-col">
            <h2 className="contact-reveal text-4xl md:text-6xl font-serif font-normal text-[var(--color-text-primary)] mb-6">
              Let&apos;s Build Something
            </h2>
            <p className="contact-reveal text-xl text-[var(--color-text-secondary)] mb-12 max-w-lg leading-relaxed">
              {contactData.callToAction}
            </p>

            <div className="contact-reveal flex flex-col gap-6 mb-12">
              <a
                href={`mailto:${contactData.email}`}
                className="text-2xl md:text-3xl font-bold text-[var(--color-accent-blue)] hover:text-[var(--color-accent-violet)] transition-colors self-start"
                aria-label={`Send email to ${contactData.email}`}
              >
                {contactData.email}
              </a>
            </div>

            <div className="contact-reveal flex gap-6 mt-auto">
              {contactData.socials.map((social) => (
                <a
                  key={social.platform}
                  href={social.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-6 py-3 bg-[var(--color-bg-primary)] border border-[var(--color-border)] rounded-lg text-[var(--color-text-primary)] font-medium hover:border-[var(--color-accent-blue)]/50 hover:text-[var(--color-accent-blue)] transition-all hover:-translate-y-1"
                  aria-label={`Visit ${social.platform} profile`}
                >
                  {social.platform}
                </a>
              ))}
            </div>
          </div>

          {/* Right Col: Form */}
          <div className="contact-reveal bg-[var(--color-bg-primary)] p-8 md:p-10 rounded-2xl border border-[var(--color-border)] shadow-2xl relative">
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-[var(--color-accent-blue)] to-transparent opacity-10 rounded-tr-2xl" />

            <form
              className="flex flex-col gap-6 relative z-10"
              onSubmit={handleSubmit(onSubmit)}
              autoComplete="on"
              noValidate
            >
              {/* Name Field */}
              <div className="flex flex-col gap-2">
                <label
                  htmlFor="contact-name"
                  className="text-sm font-medium text-[var(--color-text-secondary)]"
                >
                  Name
                </label>
                <input
                  type="text"
                  id="contact-name"
                  autoComplete="name"
                  placeholder="John Doe"
                  aria-invalid={!!errors.name}
                  aria-describedby={errors.name ? "name-error" : undefined}
                  className={`w-full bg-[var(--color-bg-secondary)] border rounded-lg px-4 py-3 text-[var(--color-text-primary)] placeholder:text-[var(--color-text-tertiary)] focus:outline-none focus:ring-1 transition-all ${
                    errors.name
                      ? "border-[var(--color-accent-red)] focus:border-[var(--color-accent-red)] focus:ring-[var(--color-accent-red)]"
                      : dirtyFields.name
                        ? "border-[var(--color-accent-green)] focus:border-[var(--color-accent-green)] focus:ring-[var(--color-accent-green)]"
                        : "border-[var(--color-border)] focus:border-[var(--color-accent-blue)] focus:ring-[var(--color-accent-blue)]"
                  }`}
                  {...register("name")}
                />
                {errors.name && (
                  <p
                    id="name-error"
                    className="text-xs text-[var(--color-accent-red)] flex items-center gap-1"
                    role="alert"
                  >
                    <span>⚠</span> {errors.name.message}
                  </p>
                )}
              </div>

              {/* Email Field */}
              <div className="flex flex-col gap-2">
                <label
                  htmlFor="contact-email"
                  className="text-sm font-medium text-[var(--color-text-secondary)]"
                >
                  Email
                </label>
                <input
                  type="email"
                  id="contact-email"
                  autoComplete="email"
                  placeholder="john@example.com"
                  aria-invalid={!!errors.email}
                  aria-describedby={errors.email ? "email-error" : undefined}
                  className={`w-full bg-[var(--color-bg-secondary)] border rounded-lg px-4 py-3 text-[var(--color-text-primary)] placeholder:text-[var(--color-text-tertiary)] focus:outline-none focus:ring-1 transition-all ${
                    errors.email
                      ? "border-[var(--color-accent-red)] focus:border-[var(--color-accent-red)] focus:ring-[var(--color-accent-red)]"
                      : dirtyFields.email
                        ? "border-[var(--color-accent-green)] focus:border-[var(--color-accent-green)] focus:ring-[var(--color-accent-green)]"
                        : "border-[var(--color-border)] focus:border-[var(--color-accent-blue)] focus:ring-[var(--color-accent-blue)]"
                  }`}
                  {...register("email")}
                />
                {errors.email && (
                  <p
                    id="email-error"
                    className="text-xs text-[var(--color-accent-red)] flex items-center gap-1"
                    role="alert"
                  >
                    <span>⚠</span> {errors.email.message}
                  </p>
                )}
              </div>

              {/* Subject Field (Optional) */}
              <div className="flex flex-col gap-2">
                <label
                  htmlFor="contact-subject"
                  className="text-sm font-medium text-[var(--color-text-secondary)]"
                >
                  Subject <span className="text-[var(--color-text-tertiary)]">(optional)</span>
                </label>
                <input
                  type="text"
                  id="contact-subject"
                  autoComplete="off"
                  placeholder="What's this about?"
                  aria-invalid={!!errors.subject}
                  aria-describedby={errors.subject ? "subject-error" : undefined}
                  className={`w-full bg-[var(--color-bg-secondary)] border rounded-lg px-4 py-3 text-[var(--color-text-primary)] placeholder:text-[var(--color-text-tertiary)] focus:outline-none focus:ring-1 transition-all ${
                    errors.subject
                      ? "border-[var(--color-accent-red)] focus:border-[var(--color-accent-red)] focus:ring-[var(--color-accent-red)]"
                      : "border-[var(--color-border)] focus:border-[var(--color-accent-blue)] focus:ring-[var(--color-accent-blue)]"
                  }`}
                  {...register("subject")}
                />
                {errors.subject && (
                  <p
                    id="subject-error"
                    className="text-xs text-[var(--color-accent-red)] flex items-center gap-1"
                    role="alert"
                  >
                    <span>⚠</span> {errors.subject.message}
                  </p>
                )}
              </div>

              {/* Message Field */}
              <div className="flex flex-col gap-2">
                <div className="flex justify-between items-center">
                  <label
                    htmlFor="contact-message"
                    className="text-sm font-medium text-[var(--color-text-secondary)]"
                  >
                    Message
                  </label>
                  <span
                    className={`text-xs ${
                      (messageValue?.length || 0) > MESSAGE_MAX_LENGTH
                        ? "text-[var(--color-accent-red)]"
                        : "text-[var(--color-text-tertiary)]"
                    }`}
                  >
                    {messageValue?.length || 0} / {MESSAGE_MAX_LENGTH}
                  </span>
                </div>
                <textarea
                  id="contact-message"
                  rows={4}
                  autoComplete="off"
                  placeholder="Tell me about your project..."
                  aria-invalid={!!errors.message}
                  aria-describedby={errors.message ? "message-error" : undefined}
                  className={`w-full bg-[var(--color-bg-secondary)] border rounded-lg px-4 py-3 text-[var(--color-text-primary)] placeholder:text-[var(--color-text-tertiary)] focus:outline-none focus:ring-1 transition-all resize-none ${
                    errors.message
                      ? "border-[var(--color-accent-red)] focus:border-[var(--color-accent-red)] focus:ring-[var(--color-accent-red)]"
                      : dirtyFields.message
                        ? "border-[var(--color-accent-green)] focus:border-[var(--color-accent-green)] focus:ring-[var(--color-accent-green)]"
                        : "border-[var(--color-border)] focus:border-[var(--color-accent-blue)] focus:ring-[var(--color-accent-blue)]"
                  }`}
                  {...register("message")}
                />
                {errors.message && (
                  <p
                    id="message-error"
                    className="text-xs text-[var(--color-accent-red)] flex items-center gap-1"
                    role="alert"
                  >
                    <span>⚠</span> {errors.message.message}
                  </p>
                )}
              </div>

              {/* Honeypot Field — hidden from users, traps bots */}
              <div aria-hidden="true" className="absolute -left-[9999px] -top-[9999px]">
                <input type="text" tabIndex={-1} autoComplete="off" {...register("honeypot")} />
              </div>

              {/* Submit Button */}
              <InteractiveButton
                type="submit"
                disabled={isSubmitting || !isValid}
                className="mt-4 w-full bg-[var(--color-accent-blue)] text-[var(--color-bg-primary)] font-bold text-lg py-4 rounded-lg hover:bg-[var(--color-accent-violet)] focus:outline-none focus:ring-2 focus:ring-[var(--color-accent-violet)] focus:ring-offset-2 focus:ring-offset-[var(--color-bg-primary)] disabled:opacity-50 disabled:cursor-not-allowed transition-all"
              >
                {isSubmitting ? "Sending..." : "Send Message"}
              </InteractiveButton>
            </form>
          </div>
        </div>

        {/* Footer */}
        <div className="contact-reveal pt-8 border-t border-[var(--color-border)] flex flex-col md:flex-row justify-between items-center gap-4 text-[var(--color-text-tertiary)] text-sm">
          <p>© {new Date().getFullYear()} Rohan. All rights reserved.</p>
          <p className="text-[var(--color-border)]">Crafted with precision &amp; passion.</p>
        </div>
      </div>
    </section>
  );
}
