"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, CheckCircle2, MessageCircle, Heart, Users, MapPin } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { cn } from "@/lib/utils";

export default function HomePage() {
  const [textIndex, setTextIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setTextIndex((prev) => (prev + 1) % 2);
    }, 3000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="relative isolate space-y-20 md:space-y-32 py-10 md:py-16 pb-32 overflow-hidden">
      {/* Background Ornaments */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full -z-10 opacity-30 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-indigo-100 blur-[120px] rounded-full animate-blob" />
        <div className="absolute bottom-[20%] right-[-10%] w-[40%] h-[40%] bg-amber-50 blur-[100px] rounded-full animate-blob animation-delay-2000" />
      </div>

      {/* HERO SECTION */}
      <section className="relative text-center space-y-8 md:space-y-12 max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{
            opacity: [0.8, 1, 0.8],
            scale: [1, 1.02, 1]
          }}
          transition={{
            opacity: { repeat: Infinity, duration: 4, ease: "easeInOut" },
            scale: { repeat: Infinity, duration: 4, ease: "easeInOut" }
          }}
          className="inline-flex items-center gap-3 bg-white/80 backdrop-blur-md text-amber-900 border border-amber-200/50 px-6 py-2.5 rounded-full text-[10px] md:text-xs font-bold uppercase tracking-[0.2em] shadow-xl shadow-amber-200/20"
        >
          <span className="flex h-2 w-2 relative">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-500"></span>
          </span>
          PENDAFTARAN DIBUKA
          <span>🐐</span>
        </motion.div>

        <div className="space-y-4 md:space-y-6">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-3xl sm:text-6xl md:text-[92px] font-black text-slate-900 tracking-tight leading-[1.1] md:leading-[0.9] flex flex-col items-center"
          >
            <span className="opacity-90">Ibadah Kurban,</span>
            <div className="relative w-full flex justify-center items-center mt-6 mb-10 md:mt-8 md:mb-14">
              {/* GHOST TEXT FOR LAYOUT STABILITY (HIDDEN) */}
              <div className="invisible pointer-events-none select-none px-4 text-center flex flex-col items-center">
                <span className="text-lg md:text-3xl font-medium text-slate-400 mb-2">Bersama</span>
                <span className="text-3xl md:text-7xl font-black italic border-transparent">Musala Al Ukhuwah</span>
              </div>

              {/* ACTUAL ANIMATED TEXT */}
              <AnimatePresence mode="wait">
                <motion.span
                  key={textIndex}
                  initial={{ y: 20, opacity: 0, filter: "blur(8px)" }}
                  animate={{ y: 0, opacity: 1, filter: "blur(0px)" }}
                  exit={{ y: -20, opacity: 0, filter: "blur(8px)" }}
                  transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                  className="text-center px-4 absolute inset-0 flex flex-col items-center justify-center w-full"
                >
                  {textIndex === 0 ? (
                    <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-indigo-400">
                      Jadi Lebih Mudah.
                    </span>
                  ) : (
                    <span className="flex flex-col items-center">
                      <span className="text-lg md:text-3xl font-medium text-slate-500 mb-1 md:mb-2 lowercase tracking-widest">Bersama</span>
                      <span className="text-3xl md:text-7xl font-black text-indigo-600 italic px-2">
                        Musala Al Ukhuwah
                      </span>
                    </span>
                  )}
                </motion.span>
              </AnimatePresence>
            </div>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="text-base md:text-xl text-slate-500 max-w-2xl mx-auto font-medium leading-relaxed pt-4"
          >
            Menyempurnakan niat suci Anda melalui tata kelola kurban yang
            <span className="text-slate-900 font-bold"> amanah, transparan,</span> dan sesuai syariat.
          </motion.p>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-5 pt-8"
        >
          <Link href="/kurban" className="group w-full sm:w-auto px-5 py-5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-[2rem] font-bold text-lg flex items-center justify-center gap-3 transition-all shadow-2xl shadow-indigo-600/30 hover:-translate-y-1">
            <Heart className="w-5 h-5 fill-white group-hover:scale-110 transition-transform" /> Pilih Jenis Kurban
          </Link>
          <Link href="https://wa.me/6282132440054" target="_blank" className="w-full sm:w-auto px-5 py-5 bg-white border-2 border-slate-100 hover:border-indigo-600 hover:text-indigo-700 text-slate-600 rounded-[2rem] font-bold text-lg flex items-center justify-center gap-3 transition-all shadow-xl shadow-slate-200/20 hover:-translate-y-1">
            <MessageCircle className="w-5 h-5" /> Tanya Panitia
          </Link>
        </motion.div>
      </section>

      {/* THREE CATEGORIES PREVIEW */}
      <section className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6 relative z-10">
        {[
          {
            title: "Sapi Kelompok",
            tag: "Sistem Patungan",
            color: "indigo",
            icon: "👥",
            price: "Rp 3.250.000 / orang",
            desc: "7 orang per kelompok sapi."
          },
          {
            title: "Sapi Mandiri",
            tag: "Personal / Keluarga",
            color: "amber",
            icon: "🐂",
            price: "Hubungi Panitia",
            desc: "Satu ekor sapi utuh."
          },
          {
            title: "Kambing",
            tag: "Hemat & Mudah",
            color: "emerald",
            icon: "🐐",
            price: "Hubungi Panitia",
            desc: "Pilihan fleksibel & praktis."
          }
        ].map((item, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 + i * 0.1 }}
            className="group relative bg-white border border-slate-100 p-5 md:p-7 rounded-[2rem] shadow-sm hover:shadow-2xl transition-all cursor-default overflow-hidden"
          >
            <div className={cn(
              "absolute top-0 right-0 w-24 h-24 -mr-6 -mt-6 opacity-[0.03] transition-transform group-hover:scale-150 rotate-12",
              item.color === 'indigo' ? 'text-indigo-600' :
                item.color === 'amber' ? 'text-amber-600' :
                  'text-emerald-600'
            )}>
              <Heart className="w-full h-full fill-current" />
            </div>

            <div className="flex flex-col items-center text-center relative z-10">
              <div className={cn(
                "w-16 h-16 rounded-2xl flex items-center justify-center text-2xl mb-5 shadow-sm border transition-all group-hover:rotate-6 group-hover:scale-110",
                item.color === 'indigo' ? 'bg-indigo-50 border-indigo-100 shadow-indigo-100/30' :
                  item.color === 'amber' ? 'bg-amber-50 border-amber-100 shadow-amber-100/30' :
                    'bg-emerald-50 border-emerald-100 shadow-emerald-100/30'
              )}>
                {item.icon}
              </div>
              <p className="text-[9px] font-bold uppercase tracking-[0.2em] text-slate-400 mb-1.5">{item.tag}</p>
              <h3 className="text-xl md:text-2xl font-bold text-slate-900 mb-1">{item.title}</h3>
              <p className="text-slate-500 text-xs md:text-sm mb-6 leading-relaxed px-4">{item.desc}</p>
              <div className={cn(
                "px-6 py-2.5 rounded-xl font-bold text-xs md:text-sm shadow-xl transition-all active:scale-95",
                item.color === 'indigo' ? 'bg-indigo-600 text-white shadow-indigo-200' :
                  item.color === 'amber' ? 'bg-amber-500 text-white shadow-amber-200' :
                    'bg-emerald-600 text-white shadow-emerald-200'
              )}>
                {item.price}
              </div>
            </div>
          </motion.div>
        ))}
      </section>

      {/* HOW TO REGISTER - DUAL PATH */}
      <section className="bg-white border-y border-slate-100 py-20">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16 space-y-4">
            <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 tracking-tight">Langkah Mudah Pendaftaran</h2>
            <p className="text-slate-500 font-medium max-w-xl mx-auto">Pahami alur berbeda untuk setiap jenis kurban agar proses Anda lancar.</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
            {/* PATH KELOMPOK */}
            <div className="relative p-6 md:p-8 rounded-[3rem] bg-indigo-50/50 border-2 border-indigo-100">
              <div className="absolute top-0 right-0 p-6 opacity-10">
                <Users className="w-16 h-16 text-indigo-600" />
              </div>
              <h4 className="inline-flex px-4 py-1 rounded-full bg-indigo-600 text-white text-[10px] font-bold uppercase tracking-widest mb-6 shadow-md shadow-indigo-200">
                Sapi Kelompok
              </h4>
              <div className="space-y-8">
                {[
                  { t: "Pilih Slot", d: "Masuk ke halaman Info Kurban dan pilih kelompok yang masih kosong." },
                  { t: "Transfer Dana", d: "Selesaikan pembayaran ke Rek. BCA Bendahara (Drs. Heru Bawono)." },
                  { t: "Konfirmasi WA", d: "Kirim bukti transfer ke WhatsApp Panitia agar nama terbit di website." }
                ].map((s, i) => (
                  <div key={i} className="flex gap-4">
                    <div className="w-8 h-8 rounded-full bg-indigo-600 text-white flex items-center justify-center font-bold text-sm shrink-0 shadow-sm">{i + 1}</div>
                    <div>
                      <p className="font-bold text-slate-900 text-lg leading-none mb-2">{s.t}</p>
                      <p className="text-slate-500 font-medium text-sm leading-relaxed">{s.d}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* PATH MANDIRI / KAMBING */}
            <div className="relative p-6 md:p-8 rounded-[3rem] bg-amber-50/50 border-2 border-amber-100">
              <div className="absolute top-0 right-0 p-6 opacity-10">
                <ArrowRight className="w-16 h-16 text-amber-600" />
              </div>
              <h4 className="inline-flex px-4 py-1 rounded-full bg-amber-600 text-white text-[10px] font-bold uppercase tracking-widest mb-6 shadow-md shadow-amber-200">
                Sapi Mandiri & Kambing
              </h4>
              <div className="space-y-8">
                {[
                  { t: "Pilih Kurban Terbaik", d: "Eksplorasi dan dapatkan calon hewan kurban terbaik pilihan Anda. Bisa juga menghubungi penyedia hewan kurban yang kami cantumkan di halaman Info Kurban." },
                  { t: "Daftar ke Panitia", d: "Hubungi panitia untuk registrasi nama Anda dan pilihan jenis kurban. Panitia akan memasukkan data Anda ke dalam daftar resmi shohibul kurban di Musala Al Ukhuwah." },
                  { t: "Kirim ke Lokasi", d: "Serahkan hewan di lokasi saat mendekati hari H. Panitia akan memproses dan melakukan verifikasi ulang data shohibul kurban." }
                ].map((s, i) => (
                  <div key={i} className="flex gap-4">
                    <div className="w-8 h-8 rounded-full bg-amber-600 text-white flex items-center justify-center font-bold text-sm shrink-0 shadow-sm">{i + 1}</div>
                    <div>
                      <p className="font-bold text-slate-900 text-lg leading-none mb-2">{s.t}</p>
                      <p className="text-slate-500 font-medium text-sm leading-relaxed">{s.d}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="mt-16 text-center">
            <Link href="/kurban" className="inline-flex items-center gap-4 px-6 py-5 bg-slate-900 text-white font-bold rounded-2xl hover:bg-black transition-all shadow-xl">
              Mulai Kurban Sekarang <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* MOSQUE INFO */}
      <section className="max-w-4xl mx-auto text-center space-y-6">
        <div className="w-16 h-16 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center mx-auto shadow-sm">
          <MapPin className="w-8 h-8" />
        </div>
        <h2 className="text-2xl font-bold text-slate-900">Lokasi Pelaksanaan</h2>
        <p className="text-slate-500 font-medium">Lapangan Belakang Musala Al Ukhuwah, Perumahan Gunung Batu Permai, Jember. <br className="hidden md:block" /> Terbuka bagi jamaah dan warga sekitar yang ingin berpartisipasi.</p>
      </section>
    </div>
  );
}

