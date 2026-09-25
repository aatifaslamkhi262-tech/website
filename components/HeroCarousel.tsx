'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { ChevronLeft, ChevronRight, Sparkles, ArrowRight } from 'lucide-react';

interface Slide {
  id: number;
  image: string;
  badge: string;
  title: string;
  subtitle: string;
  ctaText: string;
  link: string;
}

const SLIDES: Slide[] = [
  {
    id: 1,
    image: '/images/hero1.jpg',
    badge: 'Official Gaming Store',
    title: 'PlayStation 5 & Xbox Series X Consoles',
    subtitle: 'Next-Gen 4K gaming consoles with official warranty, verified serial numbers, and 24-hour nationwide delivery.',
    ctaText: 'Explore Consoles',
    link: '/products?category=6a8ad5a068ae35d1a79d1a83',
  },
  {
    id: 2,
    image: '/images/hero2.jpg',
    badge: 'Pre-Owned & Sealed Game CDs',
    title: 'PS5 & PS4 Game Disc Collection',
    subtitle: 'Tested, sanitized, and guaranteed authentic gaming CDs. Trade-in options and instant delivery across Pakistan.',
    ctaText: 'Browse Game CDs',
    link: '/products?category=6a8aea066dd73e298cdb36da',
  },
  {
    id: 3,
    image: '/images/hero3.jpg',
    badge: 'Official Sony & Gaming Gear',
    title: 'DualSense Controllers & Accessories',
    subtitle: 'Elevate your gaming with original wireless controllers, PULSE 3D headsets, faceplates, and digital cards.',
    ctaText: 'Shop Accessories',
    link: '/products?category=6a8af3ad75f0085178374d75',
  },
];

interface HeroCarouselProps {
  onCategorySelect?: (categoryId: string) => void;
}

export const HeroCarousel: React.FC<HeroCarouselProps> = () => {
  const [currentSlide, setCurrentSlide] = useState(0);

  // Auto-play carousel every 5 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide(prev => (prev + 1) % SLIDES.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const nextSlide = () => setCurrentSlide((currentSlide + 1) % SLIDES.length);
  const prevSlide = () => setCurrentSlide((currentSlide - 1 + SLIDES.length) % SLIDES.length);

  return (
    <div className="relative w-full rounded-3xl overflow-hidden shadow-lg border border-slate-200/80 mb-6 bg-slate-900 group">
      
      {/* Aspect Ratio Container */}
      <div className="relative aspect-[16/9] sm:aspect-[24/9] md:aspect-[28/9] min-h-[190px] sm:min-h-[280px]">
        {SLIDES.map((slide, idx) => (
          <div
            key={slide.id}
            className={`absolute inset-0 transition-opacity duration-700 ease-in-out ${
              idx === currentSlide ? 'opacity-100 z-10' : 'opacity-0 z-0 pointer-events-none'
            }`}
          >
            {/* Background Image */}
            <img
              src={slide.image}
              alt={slide.title}
              className="w-full h-full object-cover object-center"
            />

            {/* Gradient Overlay for Crisp Text Contrast */}
            <div className="absolute inset-0 bg-gradient-to-r from-slate-950/90 via-slate-950/75 to-transparent p-4 sm:p-8 md:p-10 flex flex-col justify-center max-w-2xl">
              
              {/* Badge */}
              <div className="inline-flex items-center gap-1.5 bg-emerald-500/20 text-emerald-300 text-[9px] sm:text-xs font-bold px-2.5 py-0.5 rounded-full border border-emerald-500/30 mb-1 sm:mb-2 w-fit backdrop-blur-xs">
                <Sparkles className="w-3 h-3 sm:w-3.5 sm:h-3.5" /> {slide.badge}
              </div>

              {/* Title */}
              <h2 className="text-base sm:text-2xl md:text-3xl font-extrabold text-white tracking-tight leading-snug sm:leading-tight mb-1 sm:mb-2 drop-shadow-sm line-clamp-2">
                {slide.title}
              </h2>

              {/* Subtitle */}
              <p className="text-[11px] sm:text-sm text-slate-300 font-normal line-clamp-1 sm:line-clamp-2 mb-2 sm:mb-4 max-w-xl">
                {slide.subtitle}
              </p>

              {/* CTA Button */}
              <Link
                href={slide.link}
                onClick={(e) => {
                  const filterSection = document.getElementById('category-filter-section');
                  if (filterSection) {
                    filterSection.scrollIntoView({ behavior: 'smooth' });
                  }
                }}
                className="inline-flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-700 active:scale-98 text-white font-bold text-[11px] sm:text-sm px-3.5 py-1.5 sm:px-5 sm:py-2.5 rounded-lg sm:rounded-xl shadow-md w-fit transition-all cursor-pointer z-20"
              >
                <span>{slide.ctaText}</span>
                <ArrowRight className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              </Link>

            </div>
          </div>
        ))}
      </div>

      {/* Navigation Arrows */}
      <button
        onClick={prevSlide}
        type="button"
        className="absolute left-2 sm:left-3 top-1/2 -translate-y-1/2 z-20 bg-slate-900/60 hover:bg-slate-900 text-white p-1.5 sm:p-2 rounded-full backdrop-blur-xs border border-white/10 opacity-70 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity cursor-pointer"
        title="Previous Slide"
      >
        <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5" />
      </button>

      <button
        onClick={nextSlide}
        type="button"
        className="absolute right-2 sm:right-3 top-1/2 -translate-y-1/2 z-20 bg-slate-900/60 hover:bg-slate-900 text-white p-1.5 sm:p-2 rounded-full backdrop-blur-xs border border-white/10 opacity-70 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity cursor-pointer"
        title="Next Slide"
      >
        <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5" />
      </button>

      {/* Carousel Dot Indicators */}
      <div className="absolute bottom-3 left-1/2 -translate-x-1/2 z-20 flex items-center gap-2">
        {SLIDES.map((_, idx) => (
          <button
            key={idx}
            type="button"
            onClick={() => setCurrentSlide(idx)}
            className={`h-2 rounded-full transition-all cursor-pointer ${
              idx === currentSlide ? 'w-6 bg-emerald-500' : 'w-2 bg-white/50 hover:bg-white'
            }`}
          />
        ))}
      </div>

    </div>
  );
};
