'use client';

import React from 'react';
import Link from 'next/link';
import { Gamepad2, Disc, Headphones, Sparkles, ArrowRight } from 'lucide-react';

interface CategoryCardItem {
  id: string;
  categoryId: string;
  title: string;
  shortTitle: string;
  subtitle: string;
  badge: string;
  badgeBg: string;
  gradientBg: string;
  borderColor: string;
  imageSrc: string;
  link: string;
}

const CATEGORY_ITEMS: CategoryCardItem[] = [
  {
    id: 'consoles',
    categoryId: '6a8ad5a068ae35d1a79d1a83',
    title: 'Gaming Consoles',
    shortTitle: 'Consoles',
    subtitle: 'PS5, Xbox Series X & Switch',
    badge: 'New & Pre-Owned',
    badgeBg: 'bg-blue-500/20 text-blue-300 border-blue-400/30',
    gradientBg: 'from-slate-950 via-slate-900 to-blue-950/80',
    borderColor: 'border-blue-500/30 hover:border-blue-400/80',
    imageSrc: '/images/category_consoles.jpg',
    link: '/products?category=6a8ad5a068ae35d1a79d1a83',
  },
  {
    id: 'games',
    categoryId: '6a8aea066dd73e298cdb36da',
    title: 'PS5 & PS4 Game CDs',
    shortTitle: 'Game CDs',
    subtitle: 'Tested Discs & Trade-in',
    badge: '100% Tested',
    badgeBg: 'bg-amber-500/20 text-amber-300 border-amber-400/30',
    gradientBg: 'from-slate-950 via-slate-900 to-indigo-950/80',
    borderColor: 'border-indigo-500/30 hover:border-indigo-400/80',
    imageSrc: '/images/category_games.jpg',
    link: '/products?category=6a8aea066dd73e298cdb36da',
  },
  {
    id: 'controllers',
    categoryId: '6a8ae13c5f408109bce576a6',
    title: 'DualSense Controllers',
    shortTitle: 'Controllers',
    subtitle: 'Official Wireless Controllers',
    badge: 'Official Gear',
    badgeBg: 'bg-blue-500/20 text-blue-300 border-blue-400/30',
    gradientBg: 'from-slate-950 via-slate-900 to-blue-900/80',
    borderColor: 'border-blue-500/30 hover:border-blue-400/80',
    imageSrc: '/images/category_controllers.jpg',
    link: '/products?category=6a8ae13c5f408109bce576a6',
  },
  {
    id: 'accessories',
    categoryId: '6a8af3ad75f0085178374d75',
    title: 'Accessories & Gear',
    subtitle: 'Headsets, Docks & Covers',
    shortTitle: 'Accessories',
    badge: 'Genuine Stock',
    badgeBg: 'bg-teal-500/20 text-teal-300 border-teal-400/30',
    gradientBg: 'from-slate-950 via-slate-900 to-slate-800',
    borderColor: 'border-slate-700 hover:border-blue-400/80',
    imageSrc: '/images/category_accessories.jpg',
    link: '/products?category=6a8af3ad75f0085178374d75',
  },
];

interface VisualCategoryShowcaseProps {
  onCategoryClick?: (categoryId: string) => void;
  selectedCategory?: string;
}

export const VisualCategoryShowcase: React.FC<VisualCategoryShowcaseProps> = ({
  onCategoryClick,
  selectedCategory = 'All',
}) => {
  return (
    <section className="space-y-3">
      {/* Section Header */}
      <div className="flex items-center justify-between gap-2 px-1">
        <div className="flex items-center gap-1.5 text-xs font-extrabold text-[#0070D1] uppercase tracking-wider">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Categories</span>
        </div>

        <Link
          href="/products"
          className="inline-flex items-center gap-1 text-xs font-bold text-[#0070D1] hover:text-blue-700 transition-colors shrink-0 whitespace-nowrap"
        >
          <span>All Catalog</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>

      {/* MOBILE EXPERIENCE: Instagram / Gaming Story Row (Horizontal Swipe, minimal height) */}
      <div className="sm:hidden overflow-x-auto no-scrollbar py-1 -mx-4 px-4 flex items-center gap-3">
        {CATEGORY_ITEMS.map((item) => {
          const isSelected = selectedCategory === item.categoryId;

          return (
            <button
              key={item.id}
              type="button"
              onClick={() => {
                if (onCategoryClick) {
                  onCategoryClick(item.categoryId);
                } else {
                  window.location.href = item.link;
                }
              }}
              className="flex flex-col items-center gap-1.5 shrink-0 group focus:outline-none active:scale-95 transition-transform duration-150"
            >
              {/* Story Avatar Ring with Active Neon Pulse Glow */}
              <div
                className={`w-16 h-16 rounded-full p-[2.5px] transition-all duration-300 ${
                  isSelected
                    ? 'bg-gradient-to-tr from-[#0070D1] via-cyan-400 to-blue-600 ring-2 ring-[#0070D1] scale-105 shadow-md shadow-blue-500/30 animate-pulse'
                    : 'bg-gradient-to-tr from-slate-300 via-slate-200 to-slate-400 group-hover:from-[#0070D1] group-hover:via-cyan-400 group-hover:to-blue-600'
                }`}
              >
                <div className="w-full h-full rounded-full overflow-hidden bg-slate-900 border-2 border-white relative shadow-inner">
                  <img
                    src={item.imageSrc}
                    alt={item.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                </div>
              </div>

              {/* Story Title Label */}
              <span className={`text-[11px] font-bold tracking-tight text-center max-w-[72px] truncate transition-colors ${
                isSelected ? 'text-[#0070D1] font-extrabold' : 'text-slate-700 group-hover:text-[#0070D1]'
              }`}>
                {item.shortTitle}
              </span>
            </button>
          );
        })}
      </div>

      {/* DESKTOP EXPERIENCE: Premium 4-Card Grid Banner with Custom Generated Product Images */}
      <div className="hidden sm:grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {CATEGORY_ITEMS.map((item) => {
          const isSelected = selectedCategory === item.categoryId;

          return (
            <div
              key={item.id}
              onClick={() => {
                if (onCategoryClick) {
                  onCategoryClick(item.categoryId);
                } else {
                  window.location.href = item.link;
                }
              }}
              className={`group relative rounded-2xl overflow-hidden cursor-pointer transition-all duration-300 bg-gradient-to-br ${item.gradientBg} border ${
                isSelected
                  ? 'border-[#0070D1] ring-2 ring-[#0070D1]/50 scale-[1.02]'
                  : item.borderColor
              } shadow-md hover:shadow-xl hover:-translate-y-1 flex flex-col justify-between min-h-[170px] p-4.5`}
            >
              {/* Background Art Cutout */}
              <div className="absolute inset-0 z-0 opacity-40 group-hover:opacity-60 transition-opacity duration-300">
                <img
                  src={item.imageSrc}
                  alt={item.title}
                  className="w-full h-full object-cover object-center group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/70 to-transparent" />
              </div>

              {/* Top Badge */}
              <div className="relative z-10 flex items-start justify-between">
                <span className={`inline-flex items-center text-[10px] font-extrabold px-2.5 py-0.5 rounded-full border backdrop-blur-xs ${item.badgeBg}`}>
                  {item.badge}
                </span>
              </div>

              {/* Text Info */}
              <div className="relative z-10 space-y-1 pt-6">
                <h3 className="font-extrabold text-white text-base leading-snug group-hover:text-blue-300 transition-colors">
                  {item.title}
                </h3>
                <p className="text-xs text-slate-300 line-clamp-1 font-normal">
                  {item.subtitle}
                </p>

                <div className="pt-1.5 flex items-center gap-1 text-xs font-bold text-blue-400 group-hover:translate-x-1 transition-transform">
                  <span>Explore Catalog</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};
