"use client";

import { ReactNode, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Users, ShieldCheck, LogOut, Menu, X, MessageSquare, User, Image as ImageIcon } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import AdminGuard from "@/components/AdminGuard";
import { useAuth } from "@/lib/auth-context";

export default function AdminLayout({ children }: { children: ReactNode }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const pathname = usePathname();
  const { logout, role } = useAuth();

  const navLinks = [
    { name: "Dashboard", href: "/admin", icon: LayoutDashboard },
    { name: "Data Kurban", href: "/admin/kurban", icon: Users },
    { name: "Susunan Panitia", href: "/admin/panitia", icon: ShieldCheck },
    { name: "Galeri Dokumentasi", href: "/admin/galeri", icon: ImageIcon },
    { name: "Hasil Rapat", href: "/admin/rapat", icon: MessageSquare },
  ];

  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      <div className="p-6 border-b border-indigo-900 mb-4 flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-white tracking-tight">Admin Kurban</h2>
          <p className="text-indigo-400 text-[10px] font-bold uppercase tracking-widest mt-1">Dashboard {role}</p>
        </div>
        <button onClick={() => setIsSidebarOpen(false)} className="md:hidden p-2 text-indigo-400">
          <X className="w-6 h-6" />
        </button>
      </div>

      <nav className="flex-1 px-4 space-y-1">
        {navLinks.map((link) => {
          const Icon = link.icon;
          const isActive = pathname === link.href;
          return (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setIsSidebarOpen(false)}
              className={cn(
                "flex items-center gap-3 px-4 py-3 rounded-xl transition-all text-sm font-semibold",
                isActive
                  ? "bg-white/10 text-white shadow-sm ring-1 ring-white/20"
                  : "text-indigo-200 hover:bg-white/5 hover:text-white"
              )}
            >
              <Icon className={cn("w-4 h-4", isActive ? "text-amber-400" : "text-indigo-400")} />
              {link.name}
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-indigo-900 mt-auto space-y-1">
        <button 
          onClick={logout}
          className="w-full flex items-center gap-2 text-sm text-red-400 hover:text-red-300 transition-colors p-3 font-bold rounded-xl hover:bg-red-500/10"
        >
          <LogOut className="w-4 h-4" /> Keluar Panel
        </button>
        <Link href="/" className="flex items-center gap-2 text-sm text-indigo-400 hover:text-white transition-colors p-3 font-bold">
          Kembali ke Beranda
        </Link>
      </div>
    </div>
  );

  return (
    <AdminGuard>
      <div className="flex min-h-screen bg-zinc-50 overflow-hidden font-sans">

        {/* DESKTOP SIDEBAR */}
        <aside className="w-64 bg-indigo-950 text-indigo-50 flex flex-col hidden md:flex shrink-0">
          <SidebarContent />
        </aside>

        {/* MOBILE SIDEBAR OVERLAY */}
        <AnimatePresence>
          {isSidebarOpen && (
            <>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setIsSidebarOpen(false)}
                className="fixed inset-0 bg-indigo-950/60 backdrop-blur-sm z-[100] md:hidden"
              />
              <motion.aside
                initial={{ x: "-100%" }}
                animate={{ x: 0 }}
                exit={{ x: "-100%" }}
                transition={{ type: "spring", damping: 25, stiffness: 200 }}
                className="fixed inset-y-0 left-0 w-72 bg-indigo-950 text-indigo-50 z-[101] md:hidden shadow-2xl"
              >
                <SidebarContent />
              </motion.aside>
            </>
          )}
        </AnimatePresence>

        {/* MAIN CONTENT AREA */}
        <main className="flex-1 flex flex-col min-h-screen relative">
          {/* FIXED HEADER */}
          <header className="fixed top-0 right-0 left-0 md:left-64 z-40 h-14 md:h-16 bg-white/95 backdrop-blur-md border-b border-zinc-200 flex items-center justify-between px-4 md:px-8 shadow-sm">
            <div className="flex items-center gap-3 md:gap-4">
              <button
                onClick={() => setIsSidebarOpen(true)}
                className="p-2 -ml-2 text-slate-600 hover:bg-slate-50 rounded-lg md:hidden transition-colors"
              >
                <Menu className="w-5 h-5" />
              </button>
              <div className="flex items-center gap-2">
                <span className="font-medium text-slate-500 text-[11px] md:text-sm">Halo,</span>
                <div className={cn(
                  "px-2.5 py-1 rounded-lg text-[10px] md:text-[11px] font-black uppercase tracking-wider shadow-sm border",
                  role === 'admin' 
                    ? "bg-amber-50 text-amber-700 border-amber-200" 
                    : "bg-indigo-50 text-indigo-700 border-indigo-200"
                )}>
                  {role}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <span className="text-[9px] font-bold text-slate-300 uppercase tracking-[0.2em] hidden sm:block">Panel Otomatisasi</span>
              <div className="w-px h-4 bg-slate-100 hidden sm:block" />
            </div>
          </header>

          {/* CONTENT AREA */}
          <div className="flex-1 pt-16 md:pt-20 px-2 sm:px-4 py-4 md:p-8 overflow-y-auto w-full">
            {children}
          </div>
        </main>
      </div>
    </AdminGuard>
  );
}
