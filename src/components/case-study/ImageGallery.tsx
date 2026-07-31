"use client";

/**
 * Image Gallery Component
 *
 * Displays a grid of project screenshots with an interactive lightbox.
 * Includes accessibility features (focus trap, ESC to close, keyboard nav).
 *
 * @module components/case-study/ImageGallery
 */

import { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import type { CaseStudyImage } from "@/types";
import { Lightbox } from "@/components/ui/Lightbox";

interface ImageGalleryProps {
  images: CaseStudyImage[];
}

export function ImageGallery({ images }: ImageGalleryProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);

  const openLightbox = (index: number) => {
    setCurrentIndex(index);
    setIsOpen(true);
  };

  const closeLightbox = useCallback(() => setIsOpen(false), []);

  const nextImage = useCallback(() => {
    setCurrentIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  }, [images.length]);

  const prevImage = useCallback(() => {
    setCurrentIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  }, [images.length]);

  // Keyboard navigation for lightbox
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") nextImage();
      if (e.key === "ArrowLeft") prevImage();
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, nextImage, prevImage]);

  if (!images || images.length === 0) return null;

  return (
    <section className="my-16" aria-label="Project images gallery">
      <h2 className="text-2xl font-bold text-white mb-8">Gallery</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {images.map((image, index) => (
          <button
            key={image.src + index}
            onClick={() => openLightbox(index)}
            className="group relative aspect-video overflow-hidden rounded-xl bg-white/5 border border-white/10 text-left"
            aria-label={`View full image: ${image.alt}`}
          >
            <Image
              src={image.src}
              alt={image.alt}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-105"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center">
              <span className="opacity-0 group-hover:opacity-100 bg-black/50 text-white px-3 py-1.5 rounded-lg backdrop-blur-sm transition-opacity">
                View
              </span>
            </div>
          </button>
        ))}
      </div>

      <Lightbox isOpen={isOpen} onClose={closeLightbox}>
        <div className="relative w-full max-w-6xl aspect-video mx-auto flex items-center justify-center">
          <Image
            src={images[currentIndex]?.src || ""}
            alt={images[currentIndex]?.alt || ""}
            fill
            className="object-contain"
            sizes="100vw"
            priority
          />

          {images.length > 1 && (
            <>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  prevImage();
                }}
                className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 flex items-center justify-center rounded-full bg-black/50 text-white hover:bg-black/80 border border-white/10 backdrop-blur-md transition-colors"
                aria-label="Previous image"
              >
                ←
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  nextImage();
                }}
                className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 flex items-center justify-center rounded-full bg-black/50 text-white hover:bg-black/80 border border-white/10 backdrop-blur-md transition-colors"
                aria-label="Next image"
              >
                →
              </button>
            </>
          )}

          {images[currentIndex]?.caption && (
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/70 backdrop-blur-md px-4 py-2 rounded-lg border border-white/10 text-white text-sm max-w-[90%] text-center">
              {images[currentIndex].caption}
            </div>
          )}
        </div>
      </Lightbox>
    </section>
  );
}
