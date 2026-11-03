import React from 'react';
import { ShieldCheck, Truck, HelpCircle, CheckCircle2 } from 'lucide-react';

export function SeoContentSection() {
  return (
    <section className="bg-white rounded-3xl p-6 sm:p-10 border border-slate-200/80 shadow-2xs space-y-8 my-8 text-slate-800">
      {/* Main SEO Header */}
      <div className="space-y-3">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 text-[#0070D1] text-xs font-bold uppercase tracking-wider">
          <ShieldCheck className="w-4 h-4" /> Gaming Authority & Store Guide
        </div>
        <h2 className="text-xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
          PlayStation 5 (PS5) Price in Pakistan & Online Gaming Store
        </h2>
        <p className="text-slate-600 text-sm sm:text-base leading-relaxed max-w-4xl">
          Welcome to <strong>PGS Game Shop</strong>, your premier destination to buy original gaming consoles, accessories, and video game discs in Pakistan. Whether you are looking for the latest <strong>Sony PlayStation 5 (PS5) Slim Disc Edition</strong>, the sleek <strong>PS5 Slim Digital Edition</strong>, or the high-performance <strong>PS5 Pro</strong>, PGS Game Shop offers competitive pricing, genuine factory seals, serial-tracked warranty, and express nationwide dispatch.
        </p>
      </div>

      {/* 3 Value Grid Columns */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <div className="p-5 rounded-2xl bg-slate-50 border border-slate-100 space-y-2">
          <div className="flex items-center gap-2 text-slate-900 font-bold text-base">
            <CheckCircle2 className="w-5 h-5 text-emerald-600" />
            100% Genuine Consoles
          </div>
          <p className="text-xs text-slate-600 leading-relaxed">
            Every PS5 console sold at PGS Game Shop is imported in genuine packaging with authentic accessories (DualSense wireless controller, HDMI 2.1 cable, power cord).
          </p>
        </div>

        <div className="p-5 rounded-2xl bg-slate-50 border border-slate-100 space-y-2">
          <div className="flex items-center gap-2 text-slate-900 font-bold text-base">
            <ShieldCheck className="w-5 h-5 text-blue-600" />
            Warranty & Testing Safety
          </div>
          <p className="text-xs text-slate-600 leading-relaxed">
            All brand-new and pre-owned consoles and game discs undergo rigorous hardware diagnostics. Enjoy official checking warranty on all retail purchases.
          </p>
        </div>

        <div className="p-5 rounded-2xl bg-slate-50 border border-slate-100 space-y-2">
          <div className="flex items-center gap-2 text-slate-900 font-bold text-base">
            <Truck className="w-5 h-5 text-indigo-600" />
            Insured Nationwide Delivery
          </div>
          <p className="text-xs text-slate-600 leading-relaxed">
            Fast dispatch from our physical store in Karachi to Lahore, Islamabad, Rawalpindi, Faisalabad, Peshawar, and across all cities in Pakistan with secure courier packaging.
          </p>
        </div>
      </div>

      {/* PS5 Price Overview & Models in Pakistan */}
      <div className="space-y-4 pt-2 border-t border-slate-100">
        <h3 className="text-lg sm:text-xl font-bold text-slate-900">
          Sony PS5 Editions Available in Pakistan
        </h3>
        <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
          The PlayStation 5 is available in two main variants in the Pakistani market:
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs sm:text-sm">
          <div className="border border-slate-200 p-4 rounded-xl space-y-1.5 bg-white">
            <span className="font-bold text-slate-900 block">PS5 Slim Disc Edition</span>
            <p className="text-slate-600">
              Features an integrated Ultra HD Blu-ray disc drive and 1TB SSD storage. Ideal for gamers who collect physical game discs, trade games, or watch 4K Blu-ray movies.
            </p>
          </div>
          <div className="border border-slate-200 p-4 rounded-xl space-y-1.5 bg-white">
            <span className="font-bold text-slate-900 block">PS5 Slim Digital Edition</span>
            <p className="text-slate-600">
              An all-digital edition with 1TB SSD storage. Plays digital games downloaded directly from the PlayStation Store. (Optional detachable disc drive can be added later).
            </p>
          </div>
        </div>
      </div>

      {/* Frequently Asked Questions (FAQ) Section for Google Search Snippets */}
      <div className="space-y-4 pt-2 border-t border-slate-100">
        <div className="flex items-center gap-2 text-slate-900 font-bold text-lg">
          <HelpCircle className="w-5 h-5 text-[#0070D1]" /> Frequently Asked Questions (FAQ)
        </div>

        <div className="space-y-3">
          <details className="group border border-slate-200 rounded-xl p-4 [&_summary::-webkit-details-marker]:hidden bg-slate-50/50">
            <summary className="flex cursor-pointer items-center justify-between text-slate-900 font-semibold text-sm">
              <span>What is the current PS5 price in Pakistan?</span>
              <span className="transition group-open:rotate-180">▼</span>
            </summary>
            <p className="mt-3 text-xs sm:text-sm text-slate-600 leading-relaxed">
              PlayStation 5 prices in Pakistan fluctuate with currency exchange rates and import duties. Typically, the PS5 Slim Digital Edition ranges around Rs. 220,000 - 245,000, while the PS5 Slim Disc Edition ranges between Rs. 238,000 - 260,000. Check our live product listings above for daily updated prices.
            </p>
          </details>

          <details className="group border border-slate-200 rounded-xl p-4 [&_summary::-webkit-details-marker]:hidden bg-slate-50/50">
            <summary className="flex cursor-pointer items-center justify-between text-slate-900 font-semibold text-sm">
              <span>Where is PGS Game Shop physically located?</span>
              <span className="transition group-open:rotate-180">▼</span>
            </summary>
            <p className="mt-3 text-xs sm:text-sm text-slate-600 leading-relaxed">
              Our walk-in retail store is located at Shop No. G19, Grace Shopping Mall, Opposite Bhayani Heights, Near Maskan Chowrangi, Gulshan-e-Iqbal, Karachi. Customers in Karachi are welcome to visit our shop to inspect consoles and games in person.
            </p>
          </details>

          <details className="group border border-slate-200 rounded-xl p-4 [&_summary::-webkit-details-marker]:hidden bg-slate-50/50">
            <summary className="flex cursor-pointer items-center justify-between text-slate-900 font-semibold text-sm">
              <span>Do you sell used or pre-owned PS5 games?</span>
              <span className="transition group-open:rotate-180">▼</span>
            </summary>
            <p className="mt-3 text-xs sm:text-sm text-slate-600 leading-relaxed">
              Yes, we have an extensive collection of tested, 100% scratch-free pre-owned PS4 and PS5 game discs with original cases, as well as brand-new factory-sealed titles at budget-friendly prices.
            </p>
          </details>
        </div>
      </div>
    </section>
  );
}

