'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, Flame } from 'lucide-react';

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

export const GtaLaunchBar: React.FC = () => {
  const [timeLeft, setTimeLeft] = useState<TimeLeft>({
    days: '8',
    hours: '3',
    minutes: '32',
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

  const pad2 = (val: string) => val.padStart(2, '0');

  return (
    <Link
      href="/category/consoles"
      aria-label="GTA VI Launch Sale — Shop PS5 Consoles & Gear"
      className="group relative block w-full rounded-2xl sm:rounded-3xl overflow-hidden bg-slate-950 border border-slate-800/80 shadow-md hover:shadow-xl transition-all duration-300"
    >
      {/* Background GTA VI Vice City Key Art */}
      <div className="relative min-h-[175px] sm:min-h-[190px] lg:min-h-[210px] w-full flex items-center">
        <Image
          src="/images/gta6_banner.jpg"
          alt="GTA VI Vice City Launch Sale"
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 95vw, 1280px"
          quality={85}
          className="object-cover object-[78%_center] sm:object-[70%_center] group-hover:scale-105 transition-transform duration-700 ease-out"
        />

        {/* Subtle Left-to-Right Fade so Right Artwork Stays Clear & Vibrant */}
        <div className="absolute inset-0 bg-gradient-to-r from-slate-950/95 via-slate-950/75 to-transparent sm:via-slate-950/50" />

        {/* Content Overlay */}
        <div className="relative z-10 w-full px-4 py-4 sm:px-8 sm:py-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2.5 sm:gap-6">
          {/* Left: Minimal, Crisp Typography */}
          <div className="space-y-1.5 sm:space-y-1.5 max-w-[270px] xs:max-w-xs sm:max-w-md">
            {/* Compact Top Pill */}
            <div className="inline-flex items-center gap-1.5 bg-rose-500/20 text-rose-200 border border-rose-400/30 text-[10px] sm:text-xs font-bold px-2.5 py-0.5 rounded-full w-fit">
              <Flame className="w-3 h-3 text-rose-400 fill-rose-400 shrink-0" />
              <span>GTA VI • 19 NOV</span>
            </div>

            {/* Short Punchy Heading in Plus Jakarta Sans */}
            <h2 className="text-lg sm:text-2xl md:text-3xl font-extrabold text-white tracking-tight leading-tight drop-shadow-sm">
              Get Ready for Vice City
            </h2>

            {/* Single-line Clean Subtitle */}
            <p className="text-[11px] sm:text-sm text-slate-200 font-medium line-clamp-1 sm:line-clamp-2">
              Special launch markdowns live on PS5 Slim, PS5 Pro &amp; DualSense gear.
            </p>

            {/* MOBILE ONLY: 3 Calendar Boxes (DAY | HOUR | MIN) + Rolling Seconds (Bottom-to-Top) */}
            <div className="pt-1.5 sm:hidden flex flex-col gap-2">
              <div className="flex items-center gap-1.5">
                {[
                  { val: mounted ? timeLeft.days : '8', label: 'DAY' },
                  { val: mounted ? timeLeft.hours : '3', label: 'HOUR' },
                  { val: mounted ? timeLeft.minutes : '32', label: 'MIN' },
                ].map((box) => (
                  <div
                    key={box.label}
                    className="w-[42px] rounded-lg bg-slate-900/95 border border-white/15 shadow-md overflow-hidden flex flex-col items-center"
                  >
                    {/* Calendar Top Binding Strip */}
                    <div className="w-full h-1 bg-rose-500/80" />
                    {/* Rolling Number Container (Bottom to Top) */}
                    <div className="h-5 flex items-center justify-center overflow-hidden pt-0.5">
                      <span
                        key={box.val}
                        className="animate-slide-up-tick text-xs font-extrabold text-white tabular-nums leading-none block"
                      >
                        {box.val}
                      </span>
                    </div>
                    {/* Calendar Unit Label */}
                    <span className="text-[8px] font-bold text-slate-400 uppercase tracking-wider pb-1 leading-none">
                      {box.label}
                    </span>
                  </div>
                ))}

                {/* Live Rolling Seconds Pill (Bottom-to-Top) */}
                <div className="h-[36px] px-2 rounded-lg bg-slate-900/80 border border-white/10 flex items-center justify-center overflow-hidden">
                  <span
                    key={mounted ? timeLeft.seconds : '0'}
                    className="animate-slide-up-tick text-[11px] font-extrabold text-rose-400 tabular-nums leading-none block"
                  >
                    {mounted ? `${timeLeft.seconds}s` : '0s'}
                  </span>
                </div>
              </div>

              {/* Mobile CTA Button */}
              <div>
                <span className="inline-flex items-center gap-1 bg-[#0070D1] text-white font-bold text-[11px] px-3 py-1.5 rounded-lg shadow-sm">
                  <span>Shop Launch Deals</span>
                  <ArrowRight className="w-3 h-3" />
                </span>
              </div>
            </div>
          </div>

          {/* Right (Tablet & Desktop): Clean Timer + Single CTA Button */}
          <div className="hidden sm:flex items-center gap-3 md:gap-4 shrink-0">
            {/* Compact Sans-Serif Countdown */}
            <div className="flex items-center gap-1.5 bg-slate-950/85 border border-white/15 px-3.5 py-2 rounded-2xl shadow-lg">
              {[
                { val: mounted ? pad2(timeLeft.days) : '08', unit: 'D' },
                { val: mounted ? pad2(timeLeft.hours) : '03', unit: 'H' },
                { val: mounted ? pad2(timeLeft.minutes) : '32', unit: 'M' },
                { val: mounted ? pad2(timeLeft.seconds) : '00', unit: 'S' },
              ].map((item, i) => (
                <React.Fragment key={item.unit}>
                  <div className="flex items-baseline gap-0.5">
                    <span className="text-base md:text-lg font-extrabold text-white tabular-nums tracking-tight">
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

            {/* Primary CTA */}
            <span className="inline-flex items-center gap-1.5 bg-[#0070D1] group-hover:bg-blue-600 text-white font-bold text-xs md:text-sm px-4 py-2.5 md:px-5 md:py-3 rounded-xl shadow-md transition-all whitespace-nowrap">
              <span>Shop Launch Deals</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
};
