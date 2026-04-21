"use client";

import { useState } from "react";
import { useAuth } from "@/lib/auth-context";
import { motion, AnimatePresence } from "framer-motion";
import { ShieldCheck, Lock, ArrowRight, UserCircle, ShieldAlert } from "lucide-react";

export default function AdminGuard({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, login, isLoading } = useAuth();
  const [password, setPassword] = useState("");
  const [error, setError] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(false);

    // Artificial delay for premium feel
    setTimeout(() => {
      const success = login(password);
      if (!success) {
        setError(true);
        setIsSubmitting(false);
        // Reset error after 2 seconds
        setTimeout(() => setError(false), 2000);
      }
    }, 600000 / 1000); // 600ms
  };

  if (isLoading) {
    return (
      <div className="fixed inset-0 bg-slate-50 flex items-center justify-center">
        <motion.div
          animate={{ scale: [1, 1.1, 1] }}
          transition={{ repeat: Infinity, duration: 1 }}
          className="w-12 h-12 bg-indigo-600 rounded-full"
        />
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="fixed inset-0 z-[500] bg-slate-50 flex items-center justify-center p-4">
        {/* Background Decor */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-500/10 blur-[120px] -mr-48 -mt-48 rounded-full" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-emerald-500/10 blur-[120px] -ml-48 -mb-48 rounded-full" />

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-md bg-white rounded-3xl md:rounded-[2.5rem] p-6 md:p-8 shadow-2xl relative overflow-hidden border border-slate-100"
        >
          <div className="absolute top-0 left-0 right-0 h-1.5 bg-indigo-600" />
          
          <div className="flex flex-col items-center gap-5 md:gap-6">
            <div className="w-12 h-12 md:w-16 md:h-16 bg-indigo-50 rounded-2xl flex items-center justify-center group">
              <ShieldCheck className="w-6 h-6 md:w-8 md:h-8 text-indigo-600 transition-transform group-hover:scale-110" />
            </div>

            <div className="text-center space-y-1.5 md:space-y-2">
              <h2 className="text-xl md:text-2xl font-black text-slate-900 tracking-tight">Akses Terbatas</h2>
              <p className="text-slate-500 text-[13px] md:text-sm font-medium">Silakan masukkan PIN otorisasi untuk masuk ke halaman panitia.</p>
            </div>

            <form onSubmit={handleSubmit} className="w-full space-y-5 mt-2">
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-indigo-600 transition-colors">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Masukkan password..."
                  required
                  className={`w-full pl-10 pr-4 py-4 bg-slate-50 border-2 rounded-2xl focus:outline-none transition-all text-center tracking-[0.5em] text-lg font-black text-slate-900 placeholder:tracking-normal placeholder:font-medium placeholder:text-sm ${
                    error 
                    ? "border-red-500 bg-red-50 ring-4 ring-red-500/10" 
                    : "border-slate-100 focus:border-indigo-600 focus:ring-4 focus:ring-indigo-600/10"
                  }`}
                />
              </div>

              <AnimatePresence>
                {error && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    className="flex items-center justify-center gap-2 text-red-600 font-bold text-xs"
                  >
                    <ShieldAlert className="w-3.5 h-3.5" />
                    <span>Password salah, silakan coba lagi</span>
                  </motion.div>
                )}
              </AnimatePresence>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-slate-900 text-white py-4 rounded-2xl font-black text-sm uppercase tracking-widest hover:bg-slate-800 active:scale-95 transition-all flex items-center justify-center gap-2 shadow-xl shadow-slate-900/20 disabled:opacity-70"
              >
                {isSubmitting ? (
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <>
                    Masuk Panel <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>

            <div className="pt-4 flex flex-col items-center gap-3">
              <div className="flex items-center gap-4 text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em]">
                <div className="flex items-center gap-1.5 px-2 py-0.5 bg-slate-50 rounded border border-slate-100">
                  <UserCircle className="w-3 h-3" /> ADMIN
                </div>
                <div className="flex items-center gap-1.5 px-2 py-0.5 bg-slate-50 rounded border border-slate-100">
                  <ShieldCheck className="w-3 h-3" /> PANITIA
                </div>
              </div>
              <p className="text-[10px] text-slate-400 font-medium">Bukan panitia? <a href="/" className="text-indigo-600 font-bold hover:underline">Kembali ke Beranda</a></p>
            </div>
          </div>
        </motion.div>
      </div>
    );
  }

  return <>{children}</>;
}
