'use client';

import React from 'react';
import Link from 'next/link';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { MobileBottomNav } from '@/components/MobileBottomNav';
import { Store, ShieldCheck, Truck, Clock, Phone, MapPin, Award, ArrowRight } from 'lucide-react';

const InstagramIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" width="14" height="14" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
  </svg>
);

const YoutubeIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" width="14" height="14" fill="currentColor" {...props}>
    <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
  </svg>
);

export default function AboutPage() {
  return (
    <div className="min-h-screen flex flex-col bg-[#F8FAFC] text-slate-900 pb-20 md:pb-0">
      
      {/* Clean Header */}
      <Header />

      {/* Main Content */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-16 space-y-12">
        
        {/* Page Hero Banner */}
        <div className="bg-white rounded-3xl p-8 sm:p-12 border border-slate-200/80 shadow-xs space-y-4">
          <div className="inline-flex items-center gap-1.5 bg-emerald-50 text-emerald-800 text-xs font-semibold px-3 py-1 rounded-full border border-emerald-200/60">
            <Store className="w-3.5 h-3.5 text-emerald-600" /> PGS Game Shop • Premier Gaming Hub
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900 leading-tight max-w-3xl">
            Pakistan's Premier Gaming Retailer & Direct Distribution
          </h1>
          <p className="text-sm sm:text-base text-slate-600 font-normal leading-relaxed max-w-2xl">
            Connecting retail customers and gaming enthusiasts across Pakistan directly to our central inventory with live stock verification.
          </p>
        </div>

        {/* 3 Value Columns */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-2xs space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center border border-emerald-200/60">
              <Store className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-slate-900 text-lg">100% Genuine Guarantee</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Every item listed on our store is authentic and quality-tested. No fake listings, no outdated stock statuses.
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-2xs space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-700 flex items-center justify-center border border-amber-200/60">
              <Award className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-slate-900 text-lg">Strict Grade Testing</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Our pre-owned games and refurbished consoles undergo 15-point diagnostic testing by certified PGS technicians before cataloging.
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-2xs space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-700 flex items-center justify-center border border-indigo-200/60">
              <Truck className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-slate-900 text-lg">Fast Nationwide Dispatch</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Standard flat Rs 350 delivery across Islamabad, Rawalpindi, Lahore, Karachi, Peshawar, and all major cities in Pakistan with insured packing.
            </p>
          </div>
        </div>

        {/* Store Branches Section */}
        <div className="bg-white rounded-3xl p-8 border border-slate-200/80 shadow-2xs space-y-6">
          <div className="max-w-2xl space-y-2">
            <h2 className="text-2xl font-bold text-slate-900 tracking-tight">
              Retail Stores & Store Info
            </h2>
            <p className="text-xs sm:text-sm text-slate-500">
              Visit our store location or contact our customer support team for direct product inquiries.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-slate-100 text-xs">
            <div className="space-y-3 bg-slate-50 p-5 rounded-2xl border border-slate-200/60">
              <div className="font-bold text-slate-900 text-sm flex items-center gap-2">
                <MapPin className="w-4 h-4 text-emerald-600" /> Karachi Flagship Store Location
              </div>
              <div className="text-slate-600 leading-relaxed space-y-1">
                <p className="font-bold text-slate-900">Shop No. G-14, Grace Shopping Mall</p>
                <p>Main Maskan Chowrangi, Gulshan-e-Iqbal Block 4, Karachi</p>
                <p className="text-[11px] text-slate-500">Opposite Bhayani Heights, Near Maskan Apartments</p>
                <p className="pt-1 text-emerald-700 font-semibold flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5" /> Timings: 2:30 PM – 11:30 PM
                </p>
              </div>
            </div>

            <div className="space-y-3 bg-slate-50 p-5 rounded-2xl border border-slate-200/60">
              <div className="font-bold text-slate-900 text-sm flex items-center gap-2">
                <Phone className="w-4 h-4 text-emerald-600" /> Direct WhatsApp & Support
              </div>
              <div className="text-slate-600 leading-relaxed space-y-1.5">
                <p>Contact our customer team directly for orders, pricing, and game trade-in inquiries.</p>
                <div className="font-mono font-bold text-slate-900 space-y-0.5">
                  <p>Primary: +92 312 2319157</p>
                  <p>Landline/Alt: +92 332 0329000</p>
                </div>
                <div className="pt-2 flex items-center gap-2 flex-wrap">
                  <a
                    href="https://wa.me/message/GI7WD5IE3FXDE1"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 bg-[#25D366] hover:bg-[#20ba59] text-white text-xs font-bold px-3 py-1.5 rounded-xl shadow-xs transition-all"
                  >
                    WhatsApp
                  </a>
                  <a
                    href="https://www.instagram.com/pgs_gameshop/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 bg-gradient-to-r from-purple-600 via-pink-600 to-amber-500 hover:opacity-90 text-white text-xs font-bold px-3 py-1.5 rounded-xl shadow-xs transition-all"
                  >
                    <InstagramIcon /> Instagram
                  </a>
                  <a
                    href="https://www.youtube.com/@PGSGameShopVlog"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 bg-[#FF0000] hover:bg-[#cc0000] text-white text-xs font-bold px-3 py-1.5 rounded-xl shadow-xs transition-all"
                  >
                    <YoutubeIcon /> YouTube
                  </a>
                </div>
              </div>
            </div>
          </div>

          <div className="pt-2">
            <Link
              href="/products"
              className="inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs px-6 py-3 rounded-xl shadow-md shadow-emerald-600/20 transition-all"
            >
              <span>Explore Products Catalog</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>

      </main>

      {/* Mobile Bottom Nav */}
      <MobileBottomNav activeTab="home" onTabSelect={() => {}} />

      {/* Footer */}
      <Footer />

    </div>
  );
}
