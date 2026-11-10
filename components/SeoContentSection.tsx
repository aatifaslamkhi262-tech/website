'use client';

import React, { useState } from 'react';
import { ShieldCheck, Truck, HelpCircle, CheckCircle2, ChevronDown, ChevronUp } from 'lucide-react';

export function SeoContentSection() {
  const [isMobileExpanded, setIsMobileExpanded] = useState(false);

  return (
    <section className="bg-white rounded-2xl sm:rounded-3xl p-4 sm:p-10 border border-slate-200/80 shadow-2xs space-y-4 sm:space-y-8 my-6 sm:my-8 text-slate-800">
      {/* Main SEO Header (Always Visible) */}
      <div className="space-y-2 sm:space-y-3">
        <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 sm:px-3 sm:py-1 rounded-full bg-blue-50 text-[#0070D1] text-[10px] sm:text-xs font-bold uppercase tracking-wider">
          <ShieldCheck className="w-3.5 h-3.5 sm:w-4 sm:h-4" /> Gaming Authority &amp; Store Guide
        </div>
        <h2 className="text-lg sm:text-3xl font-extrabold text-slate-900 tracking-tight leading-snug">
          PlayStation 5 (PS5) Price in Pakistan &amp; Online Gaming Store
        </h2>
        <p
          className={`text-slate-600 text-xs sm:text-base leading-relaxed max-w-4xl ${
            !isMobileExpanded ? 'line-clamp-3 sm:line-clamp-none' : ''
          }`}
        >
          Welcome to <strong>PGS Game Shop</strong>, your premier destination to buy original gaming consoles, accessories, and video game discs in Pakistan. Whether you are looking for the latest <strong>Sony PlayStation 5 (PS5) Slim Disc Edition</strong>, the sleek <strong>PS5 Slim Digital Edition</strong>, or the high-performance <strong>PS5 Pro</strong>, PGS Game Shop offers competitive pricing, genuine factory seals, serial-tracked warranty, and express nationwide dispatch.
        </p>
      </div>

      {/* Collapsible Wrapper on Mobile (100% present in DOM for Google SEO, always visible on Desktop) */}
      <div
        className={`${
          isMobileExpanded ? 'block' : 'hidden sm:block'
        } space-y-6 sm:space-y-8 pt-2 sm:pt-0`}
      >
        {/* 3 Value Grid Columns */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5 sm:gap-5">
          <div className="p-4 sm:p-5 rounded-2xl bg-slate-50 border border-slate-100 space-y-1.5 sm:space-y-2">
            <div className="flex items-center gap-2 text-slate-900 font-bold text-sm sm:text-base">
              <CheckCircle2 className="w-4 h-4 sm:w-5 sm:h-5 text-emerald-600 shrink-0" />
              100% Genuine Consoles
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              Every PS5 console sold at PGS Game Shop is imported in genuine packaging with authentic accessories (DualSense wireless controller, HDMI 2.1 cable, power cord).
            </p>
          </div>

          <div className="p-4 sm:p-5 rounded-2xl bg-slate-50 border border-slate-100 space-y-1.5 sm:space-y-2">
            <div className="flex items-center gap-2 text-slate-900 font-bold text-sm sm:text-base">
              <ShieldCheck className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600 shrink-0" />
              Warranty &amp; Testing Safety
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              All brand-new and pre-owned consoles and game discs undergo rigorous hardware diagnostics. Enjoy official checking warranty on all retail purchases.
            </p>
          </div>

          <div className="p-4 sm:p-5 rounded-2xl bg-slate-50 border border-slate-100 space-y-1.5 sm:space-y-2">
            <div className="flex items-center gap-2 text-slate-900 font-bold text-sm sm:text-base">
              <Truck className="w-4 h-4 sm:w-5 sm:h-5 text-indigo-600 shrink-0" />
              Insured Nationwide Delivery
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              Fast dispatch from our physical store in Karachi to Lahore, Islamabad, Rawalpindi, Faisalabad, Peshawar, and across all cities in Pakistan with secure courier packaging.
            </p>
          </div>
        </div>

        {/* PS5 Price Overview & Models in Pakistan */}
        <div className="space-y-3 sm:space-y-4 pt-2 border-t border-slate-100">
          <h3 className="text-base sm:text-xl font-bold text-slate-900">
            Sony PS5 Editions Available in Pakistan
          </h3>
          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
            The PlayStation 5 is available in two main variants in the Pakistani market:
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 text-xs sm:text-sm">
            <div className="border border-slate-200 p-3.5 sm:p-4 rounded-xl space-y-1 bg-white">
              <span className="font-bold text-slate-900 block">PS5 Slim Disc Edition</span>
              <p className="text-slate-600">
                Features an integrated Ultra HD Blu-ray disc drive and 1TB SSD storage. Ideal for gamers who collect physical game discs, trade games, or watch 4K Blu-ray movies.
              </p>
            </div>
            <div className="border border-slate-200 p-3.5 sm:p-4 rounded-xl space-y-1 bg-white">
              <span className="font-bold text-slate-900 block">PS5 Slim Digital Edition</span>
              <p className="text-slate-600">
                An all-digital edition with 1TB SSD storage. Plays digital games downloaded directly from the PlayStation Store. (Optional detachable disc drive can be added later).
              </p>
            </div>
          </div>
        </div>

        {/* Frequently Asked Questions (FAQ) Section for Google Search Snippets */}
        <div className="space-y-3 sm:space-y-4 pt-2 border-t border-slate-100">
          <div className="flex items-center gap-2 text-slate-900 font-bold text-base sm:text-lg">
            <HelpCircle className="w-4 h-4 sm:w-5 sm:h-5 text-[#0070D1]" /> Frequently Asked Questions (FAQ)
          </div>

          <div className="space-y-2.5 sm:space-y-3">
            <details className="group border border-slate-200 rounded-xl p-3.5 sm:p-4 [&_summary::-webkit-details-marker]:hidden bg-slate-50/50 hover:bg-slate-50 transition-colors">
              <summary className="flex cursor-pointer items-center justify-between text-slate-900 font-semibold text-xs sm:text-sm">
                <span>What is the current PS5 price in Pakistan?</span>
                <span className="w-7 h-7 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 group-open:bg-blue-50 group-open:text-[#0070D1] transition-colors shrink-0 ml-3">
                  <ChevronDown className="w-4 h-4 transition-transform duration-200 group-open:rotate-180" />
                </span>
              </summary>
              <p className="mt-2.5 sm:mt-3 text-xs sm:text-sm text-slate-600 leading-relaxed">
                PlayStation 5 prices in Pakistan fluctuate with currency exchange rates and import duties. Typically, the PS5 Slim Digital Edition ranges around Rs. 220,000 - 245,000, while the PS5 Slim Disc Edition ranges between Rs. 238,000 - 260,000. Check our live product listings above for daily updated prices.
              </p>
            </details>

            <details className="group border border-slate-200 rounded-xl p-3.5 sm:p-4 [&_summary::-webkit-details-marker]:hidden bg-slate-50/50 hover:bg-slate-50 transition-colors">
              <summary className="flex cursor-pointer items-center justify-between text-slate-900 font-semibold text-xs sm:text-sm">
                <span>Where is PGS Game Shop physically located?</span>
                <span className="w-7 h-7 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 group-open:bg-blue-50 group-open:text-[#0070D1] transition-colors shrink-0 ml-3">
                  <ChevronDown className="w-4 h-4 transition-transform duration-200 group-open:rotate-180" />
                </span>
              </summary>
              <p className="mt-2.5 sm:mt-3 text-xs sm:text-sm text-slate-600 leading-relaxed">
                Our walk-in retail store is located at Shop No. G19, Grace Shopping Mall, Opposite Bhayani Heights, Near Maskan Chowrangi, Gulshan-e-Iqbal, Karachi. Customers in Karachi are welcome to visit our shop to inspect consoles and games in person.
              </p>
            </details>

            <details className="group border border-slate-200 rounded-xl p-3.5 sm:p-4 [&_summary::-webkit-details-marker]:hidden bg-slate-50/50 hover:bg-slate-50 transition-colors">
              <summary className="flex cursor-pointer items-center justify-between text-slate-900 font-semibold text-xs sm:text-sm">
                <span>Do you sell used or pre-owned PS5 games?</span>
                <span className="w-7 h-7 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 group-open:bg-blue-50 group-open:text-[#0070D1] transition-colors shrink-0 ml-3">
                  <ChevronDown className="w-4 h-4 transition-transform duration-200 group-open:rotate-180" />
                </span>
              </summary>
              <p className="mt-2.5 sm:mt-3 text-xs sm:text-sm text-slate-600 leading-relaxed">
                Yes, we have an extensive collection of tested, 100% scratch-free pre-owned PS4 and PS5 game discs with original cases, as well as brand-new factory-sealed titles at budget-friendly prices.
              </p>
            </details>
          </div>
        </div>
      </div>

      {/* Mobile-Only Toggle Button */}
      <div className="sm:hidden pt-1 border-t border-slate-100 flex justify-center">
        <button
          type="button"
          onClick={() => setIsMobileExpanded(prev => !prev)}
          className="inline-flex items-center gap-1.5 text-xs font-bold text-[#0070D1] bg-blue-50/80 hover:bg-blue-100 px-4 py-2 rounded-xl transition-colors cursor-pointer"
        >
          <span>{isMobileExpanded ? 'Show Less' : 'Read Buying Guide & FAQs'}</span>
          {isMobileExpanded ? (
            <ChevronUp className="w-3.5 h-3.5" />
          ) : (
            <ChevronDown className="w-3.5 h-3.5" />
          )}
        </button>
      </div>
    </section>
  );
}
