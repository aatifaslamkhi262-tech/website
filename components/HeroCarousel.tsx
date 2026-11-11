'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ChevronLeft, ChevronRight, Sparkles, ArrowRight, Flame } from 'lucide-react';

// Target: November 19, 2026 at 00:00:00 PKT (+05:00)
const TARGET_RELEASE_DATE = new Date('2026-11-19T00:00:00+05:00').getTime();

interface TimeLeft {
  days: string;
  hours: string;
  minutes: string;
  seconds: string;
}

function calculateTimeLeft(): TimeLeft {
  const diff = Math.max(0, TARGET_RELEASE_DATE - Date.now());

  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
  const minutes = Math.floor((diff / 1000 / 60) % 60);
  const seconds = Math.floor((diff / 1000) % 60);

  return {
    days: String(days),
    hours: String(hours),
    minutes: String(minutes),
    seconds: String(seconds),
  };
}

function useGtaCountdown() {
  const [timeLeft, setTimeLeft] = useState<TimeLeft>({
    days: '7',
    hours: '4',
    minutes: '50',
    seconds: '0',
  });
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    setTimeLeft(calculateTimeLeft());

    const interval = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  return { timeLeft, mounted };
}

// Isolated Mobile Countdown Sub-Component (prevents parent HeroCarousel & Image re-renders every second)
const MobileCountdownBoxes: React.FC = () => {
  const { timeLeft, mounted } = useGtaCountdown();

  return (
    <div className="sm:hidden flex items-center gap-1.5 mb-2.5 z-20">
      {[
        { val: mounted ? timeLeft.days : '7', label: 'DAY' },
        { val: mounted ? timeLeft.hours : '4', label: 'HOUR' },
        { val: mounted ? timeLeft.minutes : '50', label: 'MIN' },
      ].map((box) => (
        <div
          key={box.label}
          className="w-[40px] rounded-lg bg-slate-900/95 border border-white/15 shadow-md overflow-hidden flex flex-col items-center"
        >
          <div className="w-full h-1 bg-rose-500/80" />
          <div className="h-4.5 flex items-center justify-center overflow-hidden pt-0.5">
            <span
              key={box.val}
              className="animate-slide-up-tick text-[11px] font-extrabold text-white tabular-nums leading-none block"
            >
              {box.val}
            </span>
          </div>
          <span className="text-[7px] font-bold text-slate-400 uppercase tracking-wider pb-0.5 leading-none">
            {box.label}
          </span>
        </div>
      ))}

      <div className="h-[34px] px-2 rounded-lg bg-slate-900/80 border border-white/10 flex items-center justify-center overflow-hidden">
        <span
          key={mounted ? timeLeft.seconds : '0'}
          className="animate-slide-up-tick text-[11px] font-extrabold text-rose-400 tabular-nums leading-none block"
        >
          {mounted ? `${timeLeft.seconds}s` : '0s'}
        </span>
      </div>
    </div>
  );
};

// Isolated Desktop Countdown Sub-Component (prevents parent HeroCarousel & Image re-renders every second)
const DesktopCountdownPill: React.FC = () => {
  const { timeLeft, mounted } = useGtaCountdown();
  const pad2 = (val: string) => val.padStart(2, '0');

  return (
    <div className="hidden sm:flex items-center gap-1.5 bg-slate-950/85 border border-white/15 px-3.5 py-2 rounded-xl shadow-md">
      {[
        { val: mounted ? pad2(timeLeft.days) : '07', unit: 'D' },
        { val: mounted ? pad2(timeLeft.hours) : '04', unit: 'H' },
        { val: mounted ? pad2(timeLeft.minutes) : '50', unit: 'M' },
        { val: mounted ? pad2(timeLeft.seconds) : '00', unit: 'S' },
      ].map((item, i) => (
        <React.Fragment key={item.unit}>
          <div className="flex items-baseline gap-0.5">
            <span className="text-sm md:text-base font-extrabold text-white tabular-nums tracking-tight">
              {item.val}
            </span>
            <span className="text-[10px] font-bold text-rose-400">
              {item.unit}
            </span>
          </div>
          {i < 3 && <span className="text-slate-600 font-bold text-xs mx-0.5">:</span>}
        </React.Fragment>
      ))}
    </div>
  );
};

interface Slide {
  id: number;
  image: string;
  badge: string;
  title: string;
  subtitle: string;
  ctaText: string;
  link: string;
  isCountdownSlide?: boolean;
}

const SLIDES: Slide[] = [
  {
    id: 0,
    image: '/images/gta6_banner.jpg',
    badge: 'GTA VI • 19 NOV',
    title: 'Get Ready for Vice City',
    subtitle: 'Special launch markdowns live on PS5 Slim, PS5 Pro & DualSense gear.',
    ctaText: 'Shop Launch Deals',
    link: '/category/consoles',
    isCountdownSlide: true,
  },
  {
    id: 1,
    image: '/images/hero1.jpg',
    badge: 'Official Gaming Store',
    title: 'PlayStation 5 & Xbox Series X Consoles',
    subtitle: 'Next-Gen 4K gaming consoles with official warranty, verified serial numbers, and 24-hour nationwide delivery.',
    ctaText: 'Explore Consoles',
    link: '/category/consoles',
  },
  {
    id: 2,
    image: '/images/hero2.jpg',
    badge: 'Pre-Owned & Sealed Game CDs',
    title: 'PS5 & PS4 Game Disc Collection',
    subtitle: 'Tested, sanitized, and guaranteed authentic gaming CDs. Trade-in options and instant delivery across Pakistan.',
    ctaText: 'Browse Game CDs',
    link: '/category/games',
  },
  {
    id: 3,
    image: '/images/hero3.jpg',
    badge: 'Official Sony & Gaming Gear',
    title: 'DualSense Controllers & Accessories',
    subtitle: 'Elevate your gaming with original wireless controllers, PULSE 3D headsets, faceplates, and digital cards.',
    ctaText: 'Shop Accessories',
    link: '/category/accessories',
  },
];

interface HeroCarouselProps {
  onCategorySelect?: (categoryId: string) => void;
}

export const HeroCarousel: React.FC<HeroCarouselProps> = () => {
  const [currentSlide, setCurrentSlide] = useState(0);

  // Auto-play carousel every 8 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide(prev => (prev + 1) % SLIDES.length);
    }, 8000);
    return () => clearInterval(timer);
  }, []);

  const nextSlide = () => setCurrentSlide((currentSlide + 1) % SLIDES.length);
  const prevSlide = () => setCurrentSlide((currentSlide - 1 + SLIDES.length) % SLIDES.length);

  return (
    <div className="relative w-full rounded-3xl overflow-hidden shadow-lg border border-slate-200/80 mb-6 bg-slate-900 group">
      
      {/* Aspect Ratio Container */}
      <div className="relative aspect-[16/9] sm:aspect-[20/9] lg:aspect-[22/9] min-h-[215px] sm:min-h-[340px]">
        {SLIDES.map((slide, idx) => {
          const isActive = idx === currentSlide;
          // Only render Image for slide 0 or the currently active slide so hidden slides don't compete for initial network bandwidth
          if (idx !== 0 && !isActive) return null;

          return (
            <div
              key={slide.id}
              className={`absolute inset-0 ${
                idx === 0 ? '' : 'transition-opacity duration-500 ease-in-out'
              } ${
                isActive ? 'opacity-100 z-10' : 'opacity-0 z-0 pointer-events-none'
              }`}
            >
              {/* Background Image with Priority LCP Loading on Slide 0 */}
              <Image
                src={slide.image}
                alt={slide.title}
                fill
                priority={idx === 0}
                fetchPriority={idx === 0 ? 'high' : 'auto'}
                sizes="(max-width: 640px) 94vw, (max-width: 1024px) 92vw, 1280px"
                quality={75}
                className={`w-full h-full object-cover ${
                  slide.isCountdownSlide ? 'object-[78%_center] sm:object-[70%_center]' : 'object-right sm:object-center'
                }`}
              />

              {/* Gradient Overlay for Crisp Text Contrast */}
              <div className="absolute inset-0 bg-gradient-to-r from-slate-950/90 via-slate-950/70 to-transparent p-4 sm:p-8 md:p-10 flex flex-col justify-center max-w-2xl">
                
                {/* Badge */}
                <div
                  className={`inline-flex items-center gap-1.5 ${
                    slide.isCountdownSlide
                      ? 'bg-rose-500/20 text-rose-200 border-rose-400/30'
                      : 'bg-blue-500/20 text-blue-300 border-blue-500/30'
                  } text-[9px] sm:text-xs font-bold px-2.5 py-0.5 rounded-full border mb-1 sm:mb-2 w-fit`}
                >
                  {slide.isCountdownSlide ? (
                    <Flame className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-rose-400 fill-rose-400" />
                  ) : (
                    <Sparkles className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                  )}
                  <span>{slide.badge}</span>
                </div>

                {/* Title (Instant paint without delay for fast LCP) */}
                <h2 className="text-base sm:text-2xl md:text-3xl font-extrabold text-white tracking-tight leading-snug sm:leading-tight mb-1 sm:mb-2 drop-shadow-sm line-clamp-2">
                  {slide.title}
                </h2>

                {/* Subtitle */}
                <p className="text-[11px] sm:text-sm text-slate-300 font-normal line-clamp-1 sm:line-clamp-2 mb-2 sm:mb-4 max-w-xl">
                  {slide.subtitle}
                </p>

                {/* MOBILE ONLY: 3 Calendar Boxes (DAY | HOUR | MIN) + Rolling Seconds on Slide #1 */}
                {slide.isCountdownSlide && <MobileCountdownBoxes />}

                {/* CTA Row (with Desktop Countdown on Slide #1) */}
                <div className="flex flex-wrap items-center gap-3 z-20">
                  <Link
                    href={slide.link}
                    onClick={() => {
                      const filterSection = document.getElementById('category-filter-section');
                      if (filterSection) {
                        filterSection.scrollIntoView({ behavior: 'smooth' });
                      }
                    }}
                    className="inline-flex items-center gap-1.5 bg-[#0070D1] hover:bg-blue-700 active:scale-98 text-white font-bold text-[11px] sm:text-sm px-3.5 py-1.5 sm:px-5 sm:py-2.5 rounded-lg sm:rounded-xl shadow-md w-fit cursor-pointer"
                  >
                    <span>{slide.ctaText}</span>
                    <ArrowRight className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                  </Link>

                  {/* Desktop Countdown Pill on Slide #1 */}
                  {slide.isCountdownSlide && <DesktopCountdownPill />}
                </div>

              </div>
            </div>
          );
        })}
      </div>

      {/* Navigation Arrows */}
      <button
        onClick={prevSlide}
        type="button"
        className="absolute left-2 sm:left-3 top-1/2 -translate-y-1/2 z-20 bg-slate-900/60 hover:bg-slate-900 text-white p-1.5 sm:p-2 rounded-full border border-white/10 opacity-70 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity cursor-pointer"
        title="Previous Slide"
      >
        <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5" />
      </button>

      <button
        onClick={nextSlide}
        type="button"
        className="absolute right-2 sm:right-3 top-1/2 -translate-y-1/2 z-20 bg-slate-900/60 hover:bg-slate-900 text-white p-1.5 sm:p-2 rounded-full border border-white/10 opacity-70 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity cursor-pointer"
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
            aria-label={`Go to slide ${idx + 1}`}
            onClick={() => setCurrentSlide(idx)}
            className={`h-2 rounded-full transition-all cursor-pointer ${
              idx === currentSlide ? 'w-6 bg-[#0070D1]' : 'w-2 bg-white/50 hover:bg-white'
            }`}
          />
        ))}
      </div>

    </div>
  );
};
