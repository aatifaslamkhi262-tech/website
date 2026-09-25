'use client';

import React from 'react';
import Link from 'next/link';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { MobileBottomNav } from '@/components/MobileBottomNav';
import { Store, ShieldCheck, Truck, Clock, Phone, MapPin, Award, ArrowRight } from 'lucide-react';

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
                <MapPin className="w-4 h-4 text-emerald-600" /> Islamabad / Rawalpindi Main Hub
              </div>
              <p className="text-slate-600 leading-relaxed">
                F-7 Markaz Commercial Area / Blue Area Gaming Complex, Islamabad.<br />
                Phone: <span className="font-mono font-bold text-slate-900">0300-1234567</span>
              </p>
            </div>

            <div className="space-y-3 bg-slate-50 p-5 rounded-2xl border border-slate-200/60">
              <div className="font-bold text-slate-900 text-sm flex items-center gap-2">
                <Phone className="w-4 h-4 text-emerald-600" /> Customer Support
              </div>
              <p className="text-slate-600 leading-relaxed">
                Contact our customer team directly on WhatsApp for orders and inquiries.<br />
                WhatsApp: <span className="font-mono font-bold text-slate-900">0300-1234567</span>
              </p>
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
