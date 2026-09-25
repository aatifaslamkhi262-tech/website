'use client';

import React from 'react';
import Link from 'next/link';
import { Gamepad2, Store, Phone, Mail, MapPin, ShieldCheck, Truck, Clock } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-slate-900 text-slate-300 border-t border-slate-800 text-xs">
      {/* Top Value Props Bar */}
      <div className="border-b border-slate-800 bg-slate-950/60 py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
            
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center shrink-0 border border-emerald-500/20">
                <Store className="w-5 h-5" />
              </div>
              <div>
                <div className="font-bold text-white text-sm">Genuine Stock</div>
                <div className="text-slate-400">100% Guaranteed Products</div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center shrink-0 border border-emerald-500/20">
                <Truck className="w-5 h-5" />
              </div>
              <div>
                <div className="font-bold text-white text-sm">Nationwide Dispatch</div>
                <div className="text-slate-400">Safe delivery Rs 350 across Pakistan</div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center shrink-0 border border-emerald-500/20">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <div className="font-bold text-white text-sm">Grade Verified</div>
                <div className="text-slate-400">New, Pre-Owned & Refurbished</div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center shrink-0 border border-emerald-500/20">
                <Clock className="w-5 h-5" />
              </div>
              <div>
                <div className="font-bold text-white text-sm">Serial Tracking</div>
                <div className="text-slate-400">Recorded for warranty safety</div>
              </div>
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

            <div className="flex items-center gap-2 pt-2 text-slate-400 font-medium">
              <MapPin className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>Main Branch: F-7 Markaz / Commercial Hub, Islamabad, Pakistan</span>
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
            <h3 className="font-bold text-white text-sm tracking-wider uppercase">Support & Orders</h3>
            <div className="space-y-2 text-slate-400 font-medium">
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-emerald-400" />
                <span className="text-white font-mono font-bold">0300-1234567</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-emerald-400" />
                <span>support@pgsgameshop.pk</span>
              </div>
              <p className="text-[11px] text-slate-500 pt-2">
                Support Hours: Mon - Sat (11:00 AM - 10:00 PM PKT)
              </p>
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
