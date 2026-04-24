"use client";

import { motion } from "framer-motion";
import {
  Users,
  MessageSquare,
  ArrowUpRight,
  ShoppingBag,
  ChevronRight,
  ShieldCheck,
  Clapperboard
} from "lucide-react";
import Link from "next/link";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import FullScreenLoader from "@/components/ui/FullScreenLoader";

const quickActions = [
  { name: "Input Data Baru", href: "/admin/kurban", icon: ArrowUpRight, desc: "Tambah shohibul kurban baru" },
  { name: "Hasil Rapat", href: "/admin/rapat", icon: MessageSquare, desc: "Lihat koordinasi mingguan" },
  { name: "Susunan Panitia", href: "/admin/panitia", icon: Users, desc: "Cek daftar divisi panitia" },
  { name: "Galeri Momen", href: "/admin/galeri", icon: Clapperboard, desc: "Kelola foto dan video" },
];

export default function AdminDashboard() {
  const kurbanData = useQuery(api.shohibulKurban.getAll);
  const rapatData = useQuery(api.rapat.getAll);
  const pengurusData = useQuery(api.panitia.getPengurusHarian);
  const divisiData = useQuery(api.panitia.getDivisiPanitia);

  // Kalkulasi Stats
  const rawKurbanCount = kurbanData?.length ?? 0;
  const countSapi = kurbanData?.filter(k => k.jenis.includes("Sapi")).length ?? 0;
  const countKambing = kurbanData?.filter(k => k.jenis === "Kambing").length ?? 0;

  const countPengurus = pengurusData?.length ?? 0;
  const countAnggotaDivisi = divisiData?.reduce((acc, div) => acc + 1 + div.anggota.length, 0) ?? 0; // 1 for koordinator
  const totalPanitia = countPengurus + countAnggotaDivisi;

  const stats = [
    { label: "Total Shohibul Qurban", value: kurbanData === undefined ? "-" : rawKurbanCount.toString(), trend: "Orang", icon: Users, color: "text-indigo-600", bg: "bg-indigo-50" },
    { label: "Total Sapi (Kelompok & Mandiri)", value: kurbanData === undefined ? "-" : countSapi.toString(), trend: "Sapi", icon: ShieldCheck, color: "text-emerald-600", bg: "bg-emerald-50" },
    { label: "Total Kambing", value: kurbanData === undefined ? "-" : countKambing.toString(), trend: "Ekor", icon: ShoppingBag, color: "text-amber-600", bg: "bg-amber-50" },
    { label: "Total Panitia", value: (pengurusData === undefined || divisiData === undefined) ? "-" : totalPanitia.toString(), trend: "Aktif", icon: Users, color: "text-rose-600", bg: "bg-rose-50" },
  ];

  // Latest Update Rapat
  const latestRapat = rapatData && rapatData.length > 0 ? rapatData[rapatData.length - 1] : null;

  const isLoading = kurbanData === undefined || rapatData === undefined || pengurusData === undefined || divisiData === undefined;

  return (
    <>
      <FullScreenLoader isLoading={isLoading} text="Memuat Dashboard..." />
      <div className={`space-y-6 md:space-y-8 pb-20 transition-opacity duration-500 ${isLoading ? "opacity-0" : "opacity-100"}`}>

        {/* DYNAMIC HERO HEADER */}
        <div className="relative p-6 md:p-12 bg-slate-950 rounded-b-[1.5rem] md:rounded-b-[2.5rem] overflow-hidden shadow-2xl">
          {/* Decorative elements for depth */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-600/20 blur-[100px] -mr-20 -mt-20 rounded-full" />
          <div className="absolute bottom-0 left-0 w-40 h-40 bg-emerald-500/10 blur-[80px] -ml-10 -mb-10 rounded-full" />

          <div className="relative z-10 flex flex-col gap-6 md:gap-8">
            <div className="space-y-3">
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-indigo-500/10 rounded-full border border-indigo-500/20">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                <span className="text-[10px] font-bold text-indigo-300 uppercase tracking-[0.2em]">Panitia Idul Adha</span>
              </div>
              <h2 className="text-3xl md:text-5xl font-black tracking-tight text-white leading-[1.1]">
                Dashboard <span className="text-indigo-400">Utama</span>
              </h2>
              <p className="text-slate-400 text-xs md:text-sm font-medium pr-10">
                Ringkasan performa data shohibul qurban, koordinasi panitia, dan hasil putusan rapat terbaru.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-6 pt-6 border-t border-white/5">
              <div className="flex flex-col">
                <span className="text-[9px] font-bold text-slate-500 uppercase tracking-widest leading-none mb-1">Panitia</span>
                <p className="text-sm font-bold text-slate-300">Idul Adha 1447 H</p>
              </div>
              <div className="w-px h-6 bg-white/10 hidden md:block" />
              <div className="flex flex-col">
                <span className="text-[9px] font-bold text-slate-500 uppercase tracking-widest leading-none mb-1">Lembaga</span>
                <p className="text-sm font-bold text-slate-300">Musala Al Ukhuwah</p>
              </div>
            </div>
          </div>
        </div>

        {/* STATS GRID - SINGLE COLUMN FOR MAXIMUM COMPACTNESS */}
        <div className="grid grid-cols-1 gap-3">
          {stats.map((stat, i) => {
            const Icon = stat.icon;
            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.05 }}
                className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-4"
              >
                <div className={`${stat.bg} ${stat.color} w-10 h-10 rounded-xl flex items-center justify-center shrink-0`}>
                  <Icon className="w-5 h-5" />
                </div>
                <div className="flex-1">
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-none mb-1">
                    {stat.label}
                  </p>
                  <div className="flex items-baseline gap-2">
                    <span className="text-xl font-bold text-slate-900 leading-none">{stat.value}</span>
                    <span className="text-[9px] font-bold text-slate-400 uppercase">
                      {stat.trend}
                    </span>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-200" />
              </motion.div>
            );
          })}
        </div>

        <div className="grid grid-cols-1 gap-6">
          {/* QUICK ACTIONS HUB */}
          <div className="space-y-4">
            <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest px-1">Akses Fitur Cepat</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {quickActions.map((action, i) => (
                <Link key={i} href={action.href}>
                  <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm hover:border-indigo-300 hover:shadow-md transition-all group cursor-pointer flex items-center justify-between md:flex-col md:items-start md:gap-4">
                    <div className="flex items-center gap-4 md:flex-col md:items-start md:gap-4">
                      <div className="w-10 h-10 rounded-xl bg-slate-50 text-slate-400 group-hover:bg-indigo-600 group-hover:text-white flex items-center justify-center transition-all">
                        <action.icon className="w-5 h-5" />
                      </div>
                      <div>
                        <h4 className="text-sm font-bold text-slate-900 leading-none mb-1">{action.name}</h4>
                        <p className="text-[10px] text-slate-400 font-medium">{action.desc}</p>
                      </div>
                    </div>
                    <ChevronRight className="md:hidden w-4 h-4 text-slate-300 group-hover:text-indigo-600" />
                  </div>
                </Link>
              ))}
            </div>
          </div>

          {/* LATEST UPDATE CARD */}
          <div className="bg-indigo-950 p-6 rounded-3xl text-white shadow-xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/20 blur-[60px] rounded-full -mr-10 -mt-10" />
            <div className="relative z-10 space-y-4">
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <MessageSquare className="w-4 h-4 text-amber-400" />
                  <span className="text-[10px] font-bold uppercase tracking-widest text-indigo-300">Update Rapat Terkini</span>
                </div>
                {latestRapat && (
                  <span className="text-[10px] font-bold uppercase tracking-wide text-indigo-300/80">{latestRapat.date}</span>
                )}
              </div>

              <div className="space-y-1">
                {rapatData === undefined ? (
                  <p className="text-sm font-bold text-white/50 leading-relaxed animate-pulse">
                    Memuat data sinkronisasi...
                  </p>
                ) : latestRapat ? (
                  <>
                    <p className="text-sm font-bold text-white leading-relaxed">
                      "{latestRapat.title}"
                    </p>
                    <p className="text-xs font-medium text-white/80 leading-relaxed italic line-clamp-2">
                      {latestRapat.fullDesc || (latestRapat.points.length > 0 ? latestRapat.points[0] : "Tidak ada catatan detail.")}
                    </p>
                  </>
                ) : (
                  <p className="text-sm font-bold text-white/70 leading-relaxed">
                    Belum ada notulensi rapat terbaru bulan ini.
                  </p>
                )}
              </div>

              <Link href="/admin/rapat" className="inline-flex items-center gap-2 text-[10px] font-bold uppercase text-indigo-400 hover:text-white transition-colors mt-2">
                Lihat Semua Keputusan <ArrowUpRight className="w-3 h-3" />
              </Link>
            </div>
          </div>
        </div>

      </div>
    </>
  );
}
