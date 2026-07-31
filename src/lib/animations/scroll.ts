import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export const scrollPresets = {
  fadeUp: (element: Element | string, options = {}) => {
    return gsap.fromTo(
      element,
      { y: 50, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        duration: 0.8,
        ease: "power3.out",
        scrollTrigger: {
          trigger: element,
          start: "top 80%",
          ...options,
        },
      }
    );
  },

  fadeRight: (element: Element | string, options = {}) => {
    return gsap.fromTo(
      element,
      { x: -50, opacity: 0 },
      {
        x: 0,
        opacity: 1,
        duration: 0.8,
        ease: "power3.out",
        scrollTrigger: {
          trigger: element,
          start: "top 80%",
          ...options,
        },
      }
    );
  },

  staggerReveal: (elements: Element[] | string | NodeList, options = {}) => {
    return gsap.fromTo(
      elements,
      { y: 30, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        duration: 0.6,
        stagger: 0.15,
        ease: "power2.out",
        scrollTrigger: {
          trigger:
            elements instanceof NodeList || Array.isArray(elements)
              ? (elements[0] as Element)
              : elements,
          start: "top 85%",
          ...options,
        },
      }
    );
  },

  scaleUp: (element: Element | string, options = {}) => {
    return gsap.fromTo(
      element,
      { scale: 0.9, opacity: 0 },
      {
        scale: 1,
        opacity: 1,
        duration: 0.7,
        ease: "back.out(1.5)",
        scrollTrigger: {
          trigger: element,
          start: "top 80%",
          ...options,
        },
      }
    );
  },
};
