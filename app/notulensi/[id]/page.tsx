"use client";

import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { useParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  CheckCircle2,
  Calendar,
  ArrowLeft,
  Clock,
  Shield,
  AlertCircle,
  FileText,
} from "lucide-react";
import Link from "next/link";
import { useAuth } from "@/lib/auth-context";

const statusConfig = {
  Final: {
    label: "Final",
    bg: "bg-emerald-100",
    text: "text-emerald-800",
    border: "border-emerald-300",
    dot: "bg-emerald-500",
    icon: Shield,
    desc: "Dokumen ini telah disahkan dan bersifat final.",
  },
  Internal: {
    label: "Internal",
    bg: "bg-amber-100",
    text: "text-amber-800",
    border: "border-amber-300",
    dot: "bg-amber-500",
    icon: Clock,
    desc: "Dokumen ini bersifat internal panitia.",
  },
  Draft: {
    label: "Draft",
    bg: "bg-stone-100",
    text: "text-stone-600",
    border: "border-stone-300",
    dot: "bg-stone-400",
    icon: AlertCircle,
    desc: "Dokumen ini masih berstatus draft.",
  },
};

export default function NotulensiDetailPage() {
  const params = useParams();
  const id = params?.id as string;
  const { role } = useAuth();
  const isAdmin = role === "admin" || role === "panitia";

  // Back href: panitia admin if logged in, else beranda
  const backHref = isAdmin ? "/admin/rapat" : "/";
  const backLabel = isAdmin ? "Kembali" : "Kembali ke Beranda";

  const rapat = useQuery(
    api.rapat.getById,
    id ? { id: id as Id<"rapat"> } : "skip"
  );

  // ── Loading ──────────────────────────────────────────────
  if (rapat === undefined) {
    return (
      <div className="min-h-screen bg-amber-50 flex items-center justify-center px-3">
        <div className="flex flex-col items-center gap-3">
          <div className="w-11 h-11 rounded-2xl bg-amber-200 flex items-center justify-center animate-pulse">
            <FileText className="w-5 h-5 text-amber-700" />
          </div>
          <p className="text-amber-700 text-xs font-bold animate-pulse tracking-widest uppercase">
            Memuat notulensi...
          </p>
        </div>
      </div>
    );
  }

  // ── Not Found ────────────────────────────────────────────
  if (rapat === null) {
    return (
      <div className="min-h-screen bg-amber-50 flex items-center justify-center px-3">
        <div className="text-center space-y-4 w-full max-w-xs">
          <div className="w-14 h-14 rounded-3xl bg-red-100 border border-red-200 flex items-center justify-center mx-auto">
            <AlertCircle className="w-7 h-7 text-red-500" />
          </div>
          <h1 className="text-xl font-black text-stone-800 leading-snug">
            Notulensi Tidak Ditemukan
          </h1>
          <p className="text-stone-500 text-xs leading-relaxed">
            Dokumen yang Anda cari tidak tersedia atau link sudah tidak valid.
          </p>
          <Link
            href={backHref}
            className="inline-flex items-center gap-2 mt-2 px-4 py-2.5 bg-amber-500 text-white text-xs font-bold rounded-xl hover:bg-amber-400 transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> {backLabel}
          </Link>
        </div>
      </div>
    );
  }

  const status = statusConfig[rapat.status as keyof typeof statusConfig] ?? statusConfig.Draft;
  const StatusIcon = status.icon;

  return (
    <div className="min-h-screen bg-amber-50 font-sans">

      {/* Subtle top bar accent */}
      <div className="h-1.5 w-full bg-gradient-to-r from-amber-400 via-yellow-300 to-amber-400" />

      <div className="w-full max-w-xl mx-auto px-3 sm:px-5 py-6 sm:py-10">

        {/* Back button */}
        <motion.div
          initial={{ opacity: 0, x: -8 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.25 }}
          className="mb-5"
        >
          <Link
            href={backHref}
            className="inline-flex items-center gap-1.5 text-amber-700 hover:text-amber-900 transition-colors text-xs font-bold group"
          >
            <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-0.5 transition-transform" />
            {backLabel}
          </Link>
        </motion.div>

        {/* ── Header — bare on background ── */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35 }}
          className="mb-5"
        >
          <div className="flex items-center gap-1.5 mb-2">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse shrink-0" />
            <span className="text-[9px] font-black text-amber-600 uppercase tracking-[0.18em]">
              Notulensi Rapat
            </span>
          </div>

          <h1 className="text-xl sm:text-2xl font-black text-stone-900 leading-snug mb-3 break-words">
            {rapat.title}
          </h1>

          <div className="flex flex-wrap items-center gap-2">
            <div className="flex items-center gap-1.5 text-stone-500 text-xs font-medium">
              <Calendar className="w-3.5 h-3.5 text-amber-500 shrink-0" />
              <span>{rapat.date}</span>
            </div>
            <div className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md border text-[10px] font-black uppercase tracking-wide ${status.bg} ${status.text} ${status.border}`}>
              <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${status.dot}`} />
              {status.label}
            </div>
          </div>
        </motion.div>

        {/* ── Description section ── */}
        {rapat.fullDesc && (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, delay: 0.1 }}
            className="mb-8"
          >
            <h2 className="text-[11px] font-black text-amber-700 uppercase tracking-[0.2em] mb-2.5 px-1 flex items-center gap-2">
              <div className="w-4 h-[2px] bg-amber-400 rounded-full" />
              Deskripsi Rapat
            </h2>
            <div className="bg-white border border-amber-200 rounded-2xl p-4 sm:p-5 shadow-sm">
              <p className="text-xs sm:text-sm text-stone-700 font-medium leading-relaxed whitespace-pre-line break-words">
                {rapat.fullDesc}
              </p>
            </div>
          </motion.div>
        )}

        {/* ── Points section ── */}
        {rapat.points.length > 0 && (
          <div className="space-y-4">
            {/* Header */}
            <div className="flex items-center justify-between mb-3 px-1">
              <h2 className="text-[11px] font-black text-amber-700 uppercase tracking-[0.2em] flex items-center gap-2">
                <div className="w-4 h-[2px] bg-amber-400 rounded-full" />
                Hasil Musyawarah
              </h2>
              <span className="text-[10px] font-bold text-amber-700 bg-amber-100 border border-amber-200 px-2.5 py-0.5 rounded-lg">
                {rapat.points.length} Poin
              </span>
            </div>

            <div className="space-y-3">
              {rapat.points.map((point, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, x: -6 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.15 + idx * 0.05 }}
                  className="relative bg-white border border-amber-200 rounded-2xl p-4 sm:p-5 shadow-sm overflow-hidden"
                >
                  {/* More visible icon in corner */}
                  <div className="absolute top-4 right-4 opacity-30">
                    <CheckCircle2 className="w-6 h-6 text-emerald-600" />
                  </div>

                  <div className="relative z-10 min-w-0">
                    <span className="block text-[8px] font-black text-amber-600 uppercase tracking-widest mb-2 opacity-80">
                      Poin {idx + 1}
                    </span>
                    <p className="text-xs sm:text-sm text-stone-800 font-bold leading-relaxed whitespace-pre-line break-words pr-6">
                      {point}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        )}

        {/* ── Footer ── */}
        <motion.footer
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.45 }}
          className="text-center mt-4 pb-8"
        >
          <p className="text-[9px] font-bold text-stone-400 uppercase tracking-widest">
            Al Ukhuwah · Idul Adha 1447 H
          </p>
        </motion.footer>

      </div>
    </div>
  );
}
