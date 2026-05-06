"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { contactData } from "@/content/contact";

export function ContactScene() {
  const containerRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
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
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      id="contact"
      ref={containerRef}
      className="w-full pt-24 pb-12 px-4 md:px-8 bg-[#0F172A] relative overflow-hidden"
    >
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 mb-20">
          {/* Left Col: Info */}
          <div className="flex flex-col">
            <h2 className="contact-reveal text-4xl md:text-6xl font-black text-[#F8FAFC] mb-6">
              Let&apos;s Build Something
            </h2>
            <p className="contact-reveal text-xl text-[#94A3B8] mb-12 max-w-lg leading-relaxed">
              {contactData.callToAction}
            </p>

            <div className="contact-reveal flex flex-col gap-6 mb-12">
              <a
                href={`mailto:${contactData.email}`}
                className="text-2xl md:text-3xl font-bold text-[#38BDF8] hover:text-[#818CF8] transition-colors self-start"
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
                  className="px-6 py-3 bg-[#070B14] border border-[#1E293B] rounded-lg text-[#F8FAFC] font-medium hover:border-[#38BDF8]/50 hover:text-[#38BDF8] transition-all hover:-translate-y-1"
                >
                  {social.platform}
                </a>
              ))}
            </div>
          </div>

          {/* Right Col: Form */}
          <div className="contact-reveal bg-[#070B14] p-8 md:p-10 rounded-2xl border border-[#1E293B] shadow-2xl relative">
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-[#38BDF8] to-transparent opacity-10 rounded-tr-2xl" />

            <form
              className="flex flex-col gap-6 relative z-10"
              onSubmit={(e) => e.preventDefault()}
            >
              <div className="flex flex-col gap-2">
                <label htmlFor="name" className="text-sm font-medium text-[#94A3B8]">
                  Name
                </label>
                <input
                  type="text"
                  id="name"
                  placeholder="John Doe"
                  className="w-full bg-[#0F172A] border border-[#1E293B] rounded-lg px-4 py-3 text-[#F8FAFC] placeholder:text-[#475569] focus:outline-none focus:border-[#38BDF8] focus:ring-1 focus:ring-[#38BDF8] transition-all"
                />
              </div>

              <div className="flex flex-col gap-2">
                <label htmlFor="email" className="text-sm font-medium text-[#94A3B8]">
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  placeholder="john@example.com"
                  className="w-full bg-[#0F172A] border border-[#1E293B] rounded-lg px-4 py-3 text-[#F8FAFC] placeholder:text-[#475569] focus:outline-none focus:border-[#38BDF8] focus:ring-1 focus:ring-[#38BDF8] transition-all"
                />
              </div>

              <div className="flex flex-col gap-2">
                <label htmlFor="message" className="text-sm font-medium text-[#94A3B8]">
                  Message
                </label>
                <textarea
                  id="message"
                  rows={4}
                  placeholder="Tell me about your project..."
                  className="w-full bg-[#0F172A] border border-[#1E293B] rounded-lg px-4 py-3 text-[#F8FAFC] placeholder:text-[#475569] focus:outline-none focus:border-[#38BDF8] focus:ring-1 focus:ring-[#38BDF8] transition-all resize-none"
                />
              </div>

              <button
                type="submit"
                className="mt-4 w-full bg-[#38BDF8] text-[#070B14] font-bold text-lg py-4 rounded-lg hover:bg-[#818CF8] transition-colors focus:outline-none focus:ring-2 focus:ring-[#818CF8] focus:ring-offset-2 focus:ring-offset-[#070B14]"
              >
                Send Message
              </button>
            </form>
          </div>
        </div>

        {/* Footer */}
        <div className="contact-reveal pt-8 border-t border-[#1E293B] flex flex-col md:flex-row justify-between items-center gap-4 text-[#475569] text-sm">
          <p>© {new Date().getFullYear()} Rohan. All rights reserved.</p>
          <div className="flex gap-4">
            <a href="#" className="hover:text-[#94A3B8] transition-colors">
              Privacy Policy
            </a>
            <a href="#" className="hover:text-[#94A3B8] transition-colors">
              Terms of Service
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
