'use client';

import React from 'react';
import Link from 'next/link';
import { Gamepad2, Store, Phone, Mail, MapPin, ShieldCheck, Truck, Clock } from 'lucide-react';

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

export const Footer: React.FC = () => {
  return (
    <footer className="bg-slate-900 text-slate-300 border-t border-slate-800 text-xs">
      {/* Top Value Props Bar - Single Line & Mobile Ticker */}
      <div className="border-b border-slate-800 bg-slate-950/80 py-3.5 px-4 overflow-hidden">
        <div className="max-w-7xl mx-auto">
          {/* Desktop & Tablet: 4 Equal Columns in 1 Line */}
          <div className="hidden md:grid md:grid-cols-4 divide-x divide-slate-800 text-xs font-semibold text-slate-300">
            <div className="flex items-center justify-center gap-2.5 px-3">
              <Store className="w-4 h-4 text-emerald-400 shrink-0" />
              <div className="truncate">
                <span className="font-bold text-white">Genuine Stock</span>
                <span className="text-[11px] text-slate-400 font-normal ml-1.5">• 100% Guaranteed</span>
              </div>
            </div>

            <div className="flex items-center justify-center gap-2.5 px-3">
              <Truck className="w-4 h-4 text-emerald-400 shrink-0" />
              <div className="truncate">
                <span className="font-bold text-white">Nationwide Dispatch</span>
                <span className="text-[11px] text-slate-400 font-normal ml-1.5">• Rs 350 Delivery</span>
              </div>
            </div>

            <div className="flex items-center justify-center gap-2.5 px-3">
              <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
              <div className="truncate">
                <span className="font-bold text-white">Grade Verified</span>
                <span className="text-[11px] text-slate-400 font-normal ml-1.5">• Tested Quality</span>
              </div>
            </div>

            <div className="flex items-center justify-center gap-2.5 px-3">
              <Clock className="w-4 h-4 text-emerald-400 shrink-0" />
              <div className="truncate">
                <span className="font-bold text-white">Serial Tracking</span>
                <span className="text-[11px] text-slate-400 font-normal ml-1.5">• Warranty Safety</span>
              </div>
            </div>
          </div>

          {/* Mobile: Smooth Continuous Single-Line Moving Ticker */}
          <div className="md:hidden overflow-hidden whitespace-nowrap">
            <div className="animate-ticker flex items-center gap-5 text-xs">
              <div className="flex items-center gap-1.5 shrink-0">
                <Store className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span className="font-bold text-white">Genuine Stock</span>
                <span className="text-[11px] text-slate-400">• 100% Guaranteed Products</span>
              </div>
              <span className="text-slate-700 shrink-0 font-light">|</span>

              <div className="flex items-center gap-1.5 shrink-0">
                <Truck className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span className="font-bold text-white">Nationwide Dispatch</span>
                <span className="text-[11px] text-slate-400">• Safe Delivery Rs 350</span>
              </div>
              <span className="text-slate-700 shrink-0 font-light">|</span>

              <div className="flex items-center gap-1.5 shrink-0">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span className="font-bold text-white">Grade Verified</span>
                <span className="text-[11px] text-slate-400">• New, Pre-Owned & Refurbished</span>
              </div>
              <span className="text-slate-700 shrink-0 font-light">|</span>

              <div className="flex items-center gap-1.5 shrink-0">
                <Clock className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span className="font-bold text-white">Serial Tracking</span>
                <span className="text-[11px] text-slate-400">• Recorded for Warranty Safety</span>
              </div>
              <span className="text-slate-700 shrink-0 font-light">|</span>

              {/* Duplicated set for seamless continuous infinite loop */}
              <div className="flex items-center gap-1.5 shrink-0">
                <Store className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span className="font-bold text-white">Genuine Stock</span>
                <span className="text-[11px] text-slate-400">• 100% Guaranteed Products</span>
              </div>
              <span className="text-slate-700 shrink-0 font-light">|</span>

              <div className="flex items-center gap-1.5 shrink-0">
                <Truck className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span className="font-bold text-white">Nationwide Dispatch</span>
                <span className="text-[11px] text-slate-400">• Safe Delivery Rs 350</span>
              </div>
              <span className="text-slate-700 shrink-0 font-light">|</span>

              <div className="flex items-center gap-1.5 shrink-0">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span className="font-bold text-white">Grade Verified</span>
                <span className="text-[11px] text-slate-400">• New, Pre-Owned & Refurbished</span>
              </div>
              <span className="text-slate-700 shrink-0 font-light">|</span>

              <div className="flex items-center gap-1.5 shrink-0">
                <Clock className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span className="font-bold text-white">Serial Tracking</span>
                <span className="text-[11px] text-slate-400">• Recorded for Warranty Safety</span>
              </div>
              <span className="text-slate-700 shrink-0 font-light">|</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Links */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          
          {/* Brand Col */}
          <div className="md:col-span-2 space-y-4">
            <Link href="/" className="flex items-center gap-3">
              <div className="bg-emerald-600 text-white p-2 rounded-xl shadow-md">
                <Gamepad2 className="w-6 h-6" />
              </div>
              <span className="font-extrabold text-xl tracking-tight text-white font-sans">
                PGS <span className="text-emerald-400">GAME SHOP</span>
              </span>
            </Link>
            
            <p className="text-slate-400 leading-relaxed max-w-sm">
              Pakistan's premier gaming retailer. Supplying authentic PS5 consoles, pre-owned game CDs, Xbox Series X, DualSense controllers, and pro accessories with official warranty.
            </p>

            <div className="flex items-start gap-2 pt-2 text-slate-400 font-medium text-xs leading-relaxed">
              <MapPin className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
              <div>
                <a
                  href="https://maps.app.goo.gl/USAkWfss1fLZC3mf7"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-white hover:text-emerald-400 transition-colors font-semibold underline block"
                >
                  Shop No. G-14, Grace Shopping Mall, Main Maskan Chowrangi, Gulshan-e-Iqbal Block 4, Karachi
                </a>
                <span className="text-slate-400 text-[11px] block mt-0.5">Opposite Bhayani Heights, Near Maskan Apartments</span>
              </div>
            </div>
          </div>

          {/* Catalog Links */}
          <div className="space-y-3">
            <h3 className="font-bold text-white text-sm tracking-wider uppercase">Categories</h3>
            <ul className="space-y-2 text-slate-400 font-medium">
              <li><Link href="/products?category=6a8ad5a068ae35d1a79d1a83" className="hover:text-emerald-400 transition-colors">Gaming Consoles</Link></li>
              <li><Link href="/products?category=6a8aea066dd73e298cdb36da" className="hover:text-emerald-400 transition-colors">PS5 & PS4 Game CDs</Link></li>
              <li><Link href="/products?category=6a8ae13c5f408109bce576a6" className="hover:text-emerald-400 transition-colors">Controllers</Link></li>
              <li><Link href="/products?category=6a8af3ad75f0085178374d75" className="hover:text-emerald-400 transition-colors">Accessories & Gear</Link></li>
              <li><Link href="/products?condition=Used" className="hover:text-emerald-400 transition-colors">Pre-Owned Collection</Link></li>
            </ul>
          </div>

          {/* Contact & Support */}
          <div className="space-y-3">
            <h3 className="font-bold text-white text-sm tracking-wider uppercase">Contact & Location</h3>
            <div className="space-y-2 text-slate-400 font-medium text-xs">
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-emerald-400 shrink-0" />
                <a href="tel:+923122319157" className="text-white font-mono font-bold hover:text-emerald-400">+92 312 2319157</a>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-emerald-400 shrink-0" />
                <a href="tel:+923320329000" className="text-white font-mono font-bold hover:text-emerald-400">+92 332 0329000</a>
              </div>
              <div className="flex items-center gap-2 pt-1 text-emerald-400 font-semibold">
                <Clock className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Timings: 2:30 PM – 11:30 PM</span>
              </div>
              <div className="pt-2 flex items-center gap-2 flex-wrap">
                <a
                  href="https://wa.me/message/GI7WD5IE3FXDE1"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 bg-[#25D366] hover:bg-[#20ba59] text-white text-[11px] font-bold px-3 py-1.5 rounded-xl transition-all shadow-sm"
                >
                  WhatsApp
                </a>
                <a
                  href="https://www.instagram.com/pgs_gameshop/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 bg-gradient-to-r from-purple-600 via-pink-600 to-amber-500 hover:opacity-90 text-white text-[11px] font-bold px-3 py-1.5 rounded-xl transition-all shadow-sm"
                >
                  <InstagramIcon /> Instagram
                </a>
                <a
                  href="https://www.youtube.com/@PGSGameShopVlog"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 bg-[#FF0000] hover:bg-[#cc0000] text-white text-[11px] font-bold px-3 py-1.5 rounded-xl transition-all shadow-sm"
                >
                  <YoutubeIcon /> YouTube
                </a>
              </div>
            </div>
          </div>

        </div>

        {/* Bottom Copyright */}
        <div className="border-t border-slate-800 mt-10 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-slate-500">
          <p>© {new Date().getFullYear()} PGS Game Shop (Pvt) Ltd. All rights reserved.</p>
          <div className="flex items-center gap-4">
            <span className="hover:text-slate-400 cursor-pointer">Terms of Sale</span>
            <span>•</span>
            <span className="hover:text-slate-400 cursor-pointer">Warranty Policy</span>
            <span>•</span>
            <span className="hover:text-slate-400 cursor-pointer">Privacy Policy</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
