"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, Heart, Calendar, Home, Phone, ChevronRight, ShieldCheck } from "lucide-react";
import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";

const links = [
  { name: "Beranda", href: "/", icon: Home },
  { name: "Info Kurban", href: "/kurban", icon: Heart },
  { name: "Jadwal Acara", href: "/jadwal", icon: Calendar },
];

export default function PublicNavbar() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
  }, [isOpen]);

  return (
    <>
      <header className="sticky top-0 z-40 w-full bg-white/90 border-b border-indigo-900/10 backdrop-blur-md">
        <div className="max-w-4xl mx-auto px-4 h-16 sm:h-20 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3 relative z-[60]">
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-indigo-50 border border-indigo-100 flex items-center justify-center shadow-sm">
              <span className="text-xl sm:text-2xl">🐐</span>
            </div>
            <div className="flex flex-col">
              <span className="font-bold text-lg sm:text-xl text-indigo-950 leading-tight">Kuurban</span>
              <span className="text-[10px] sm:text-[11px] text-slate-500 font-medium leading-none -mt-0.5">
                by <span className="text-indigo-600 font-bold">Al Ukhuwah</span>
              </span>
            </div>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-8">
            {links.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.name}
                  href={link.href}
                  className={cn(
                    "text-sm font-semibold transition-all hover:text-indigo-600 relative py-2",
                    isActive ? "text-indigo-700" : "text-slate-600"
                  )}
                >
                  {link.name}
                  {isActive && (
                    <motion.div 
                      layoutId="navbar-indicator"
                      className="absolute bottom-0 left-0 right-0 h-0.5 bg-indigo-600 rounded-full"
                    />
                  )}
                </Link>
              );
            })}
            <div className="w-px h-6 bg-slate-200" />
            <Link
              href="/admin"
              className="text-slate-400 hover:text-indigo-600 transition-colors p-2"
              title="Panel Panitia"
            >
              <ShieldCheck className="w-5 h-5" />
            </Link>
            <Link
              href="https://wa.me/6282132440054" target="_blank"
              className="flex items-center gap-2 bg-indigo-950 hover:bg-indigo-900 text-amber-400 px-5 py-2.5 rounded-full text-sm font-bold transition-all shadow-md shadow-indigo-900/20"
            >
              <Phone className="w-4 h-4" /> Hubungi Panitia
            </Link>
          </nav>

          {/* Mobile Toggle */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden p-2 text-indigo-950 relative z-[110] -mr-2 bg-indigo-50 hover:bg-indigo-100 rounded-xl transition-colors"
          >
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </header>

      {/* Fullscreen Mobile Nav Overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }}
            transition={{ duration: 0.2, ease: "easeInOut" }}
            className="fixed inset-0 z-[100] bg-white flex flex-col px-6 pb-10 overflow-y-auto h-[100dvh]"
          >
            {/* Background decorative element */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-50 rounded-full blur-3xl opacity-50 pointer-events-none translate-x-1/4 -translate-y-1/4" />

            {/* Close Button + Logo Row */}
            <div className="flex items-center justify-between pt-5 pb-8 relative z-10">
              <Link href="/" onClick={() => setIsOpen(false)} className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-indigo-50 border border-indigo-100 flex items-center justify-center shadow-sm">
                  <span className="text-xl">🐐</span>
                </div>
                <div className="flex flex-col">
                  <span className="font-bold text-lg text-indigo-950 leading-tight">Kuurban</span>
                  <span className="text-[10px] text-slate-500 font-medium leading-none -mt-0.5">
                    by <span className="text-indigo-600 font-bold">Al Ukhuwah</span>
                  </span>
                </div>
              </Link>
              <button
                onClick={() => setIsOpen(false)}
                className="w-10 h-10 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center transition-colors"
              >
                <X className="w-5 h-5 text-slate-600" />
              </button>
            </div>
            
            <div className="flex-1 flex flex-col gap-3 relative z-10 w-full max-w-sm mx-auto">
              {links.map((link, i) => {
                const isActive = pathname === link.href;
                const Icon = link.icon;
                return (
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.05 + 0.1 }}
                    key={link.name}
                  >
                    <Link
                      href={link.href}
                      onClick={() => setIsOpen(false)}
                      className={cn(
                        "flex items-center justify-between p-4 rounded-2xl font-bold transition-all text-lg border",
                        isActive 
                          ? "bg-indigo-50 border-indigo-100 text-indigo-700 shadow-sm" 
                          : "bg-white border-slate-100 text-slate-700 hover:bg-slate-50"
                      )}
                    >
                      <div className="flex items-center gap-4">
                        <div className={cn("p-2.5 rounded-xl", isActive ? "bg-white text-indigo-600 shadow-sm" : "bg-slate-50 text-slate-400")}>
                          <Icon className="w-6 h-6" />
                        </div>
                        {link.name}
                      </div>
                      <ChevronRight className={cn("w-5 h-5", isActive ? "text-indigo-600" : "text-slate-300")} />
                    </Link>
                  </motion.div>
                );
              })}
            </div>

            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="mt-6 pt-6 border-t border-slate-100 relative z-10 w-full max-w-sm mx-auto"
            >
              <Link
                href="https://wa.me/6282132440054" target="_blank"
                onClick={() => setIsOpen(false)}
                className="w-full flex items-center justify-center gap-3 bg-indigo-950 text-amber-400 p-4 rounded-2xl font-bold text-lg shadow-xl shadow-indigo-900/20 active:scale-[0.98] transition-transform"
              >
                <Phone className="w-5 h-5" /> Chat WA Panitia
              </Link>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.4 }}
              className="mt-4 flex justify-center relative z-10"
            >
              <Link
                href="/admin"
                onClick={() => setIsOpen(false)}
                className="flex items-center gap-2 text-xs font-bold text-slate-400 hover:text-indigo-600 transition-colors"
                title="Panel Panitia"
              >
                <ShieldCheck className="w-3.5 h-3.5" /> Staff Only: Panel Panitia
              </Link>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
