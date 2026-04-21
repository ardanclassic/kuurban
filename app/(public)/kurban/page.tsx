"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import CowGroupCard from "@/components/kurban/CowGroupCard";
import { Heart, Phone, CheckCircle2, Users, ExternalLink, MessageCircle, X, ChevronRight } from "lucide-react";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { cn } from "@/lib/utils";

// ============================================================
// DATA PENYEDIA KAMBING - TETAP STATIS KARENA BELUM ADA DB-NYA
// ============================================================
const penyediaKambing = [
  { nama: "Bpk. Suprayitno", wa: "0813-5712-5328", link: "6281357125328" },
  { nama: "Bpk. Evi Sofyan", wa: "0823-3188-2609", link: "6282331882609" },
  { nama: "Bpk. Adam", wa: "0853-8102-0202", link: "6285381020202" },
];

export default function KurbanPage() {
  const kurbanData = useQuery(api.shohibulKurban.getAll);
  const [activeModal, setActiveModal] = useState<"kelompok" | "mandiri" | "kambing" | null>(null);

  const openWA = (wa: string, pesan: string) => {
    window.open(`https://wa.me/${wa}?text=${encodeURIComponent(pesan)}`, "_blank");
  };

  // Generate Cow Groups (Sapi Kelompok) Dinamis (Up to 10 Groups generated safely)
  const rawKelompokData = kurbanData?.filter(k => k.jenis === "Sapi Kelompok") || [];
  const cowGroups = Array.from({ length: 10 }).map((_, i) => {
    const kelompokId = i + 1;
    const nameStr = `Kelompok ${kelompokId}`;
    const filledSlots = rawKelompokData
      .filter(k => k.kelompok?.toLowerCase() === nameStr.toLowerCase())
      .map(k => ({ name: k.nama }));

    return {
      id: kelompokId,
      name: `Sapi Kelompok ${kelompokId}`,
      pricePerPerson: 3250000,
      totalSlots: 7,
      filledSlots
    };
  });

  const sapiMandiriList = kurbanData?.filter(k => k.jenis === "Sapi Mandiri").map(k => ({ name: k.nama, keterangan: k.keterangan || "" })) || [];
  const kambingList = kurbanData?.filter(k => k.jenis === "Kambing").map(k => ({ name: k.nama, keterangan: k.keterangan || "" })) || [];

  let firstUnfilledFound = false;
  const visibleGroups = cowGroups.map((group) => {
    const isFull = group.filledSlots.length >= group.totalSlots;
    let isLocked = false;
    if (!isFull) {
      if (!firstUnfilledFound) { isLocked = false; firstUnfilledFound = true; }
      else { isLocked = true; }
    }
    return { ...group, isLocked, isFull };
  }).filter(g => !g.isLocked);

  const menuOptions = [
    {
      id: "kelompok" as const,
      title: "Sapi Kelompok",
      desc: "Nabung pahala bareng 6 orang lainnya. Kuota dibuka berurutan.",
      priceInfo: "Rp 3.250.000 / orang",
      icon: "1",
      theme: {
        primary: "text-indigo-600",
        bg: "bg-indigo-600",
        light: "bg-indigo-50",
        border: "border-indigo-100",
        accent: "text-indigo-700",
        shadow: "shadow-indigo-600/30"
      },
      stats: `${visibleGroups.length} Grup Terbuka`
    },
    {
      id: "mandiri" as const,
      title: "Sapi Mandiri",
      desc: "Khusus untuk 1 orang/keluarga. Bebas pilih ukuran sapi sesuai keinginan.",
      priceInfo: "1 Sapi Utuh",
      icon: "2",
      theme: {
        primary: "text-amber-600",
        bg: "bg-amber-600",
        light: "bg-amber-50",
        border: "border-amber-100",
        accent: "text-amber-700",
        shadow: "shadow-amber-600/30"
      },
      stats: `${sapiMandiriList.length} Pendaftar`
    },
    {
      id: "kambing" as const,
      title: "Kambing / Domba",
      desc: "Praktis & hemat. Panitia bantu sediakan hewan kurban sesuai syarat syariat.",
      priceInfo: "1 Ekor Utuh",
      icon: "3",
      theme: {
        primary: "text-emerald-600",
        bg: "bg-emerald-600",
        light: "bg-emerald-50",
        border: "border-emerald-100",
        accent: "text-emerald-700",
        shadow: "shadow-emerald-600/30"
      },
      stats: `${kambingList.length} Pendaftar`
    }
  ];

  const currentTheme = menuOptions.find(m => m.id === activeModal)?.theme;

  return (
    <div className="space-y-12 py-10 pb-32">

      {/* ── PAGE HEADER ── */}
      <div className="text-center space-y-5 max-w-2xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-amber-100 border border-amber-200 text-amber-800 text-xs font-bold uppercase tracking-widest shadow-sm">
          <span>🐐</span> Idul Kurban 1447 H
        </div>
        <h1 className="text-3xl md:text-5xl font-black text-slate-900 tracking-tight leading-tight">
          Niat Berqurban <br /> Tahun Ini?
        </h1>
        <p className="text-slate-500 font-medium text-base md:text-lg leading-relaxed">
          Pilih jenis kurban yang pas di hati. Panitia siap bantu urus dari penyediaan, penyembelihan, hingga distribusi. Praktis, amanah, dan InsyaaAllah berkah! ✨
        </p>
      </div>

      {/* ── MAIN MENU CARDS ── */}
      <div className="max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-6">
        {menuOptions.map((menu, i) => (
          <motion.button
            key={menu.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            onClick={() => setActiveModal(menu.id)}
            className="group relative bg-white border border-slate-200 rounded-[2rem] p-6 md:p-8 text-left shadow-sm hover:shadow-xl transition-all duration-300 hover:border-indigo-200 active:scale-[0.98] overflow-hidden focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
          >
            {/* Background Decor */}
            <div className={`absolute top-0 right-0 w-32 h-32 rounded-bl-[100px] bg-slate-50 border-l border-b border-slate-100 transition-all duration-500 group-hover:bg-slate-100/50 -z-0`} />

            <div className="relative z-10 flex flex-col h-full">
              <div className="flex items-start justify-between mb-8">
                <div className={`w-14 h-14 shrink-0 rounded-2xl flex items-center justify-center font-bold text-2xl shadow-lg ${menu.theme.bg} text-white ${menu.theme.shadow} transition-transform duration-300 group-hover:scale-110 group-hover:-rotate-3`}>
                   {menu.icon}
                </div>
                <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-100 text-slate-500 text-[10px] font-bold uppercase tracking-wider backdrop-blur-sm">
                   {menu.stats}
                </div>
              </div>

              <div className="mt-auto space-y-4">
                <div>
                  <h2 className={`text-2xl font-bold text-slate-900 group-hover:${menu.theme.primary} transition-colors`}>{menu.title}</h2>
                  <p className="text-[13px] text-slate-500 mt-2 font-medium leading-relaxed">{menu.desc}</p>
                </div>

                <div className="pt-6 mt-6 border-t border-slate-100 flex items-center justify-between">
                  <p className="text-sm font-bold text-slate-800">{menu.priceInfo}</p>
                  <div className={`w-10 h-10 rounded-full bg-slate-50 text-slate-400 flex items-center justify-center transition-all group-hover:${menu.theme.bg} group-hover:text-white group-hover:shadow-md`}>
                    <ChevronRight className="w-5 h-5" />
                  </div>
                </div>
              </div>
            </div>
          </motion.button>
        ))}
      </div>


      {/* ── FULLSCREEN POPUP MODALS ── */}
      <AnimatePresence>
        {activeModal && (
          <div className="fixed inset-0 z-[200] flex items-end md:items-center justify-center md:px-6 h-[100dvh] w-full">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-slate-900/60 backdrop-blur-md"
              onClick={() => setActiveModal(null)}
            />

            {/* Modal Body */}
            <motion.div
              initial={{ y: "100%", opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: "100%", opacity: 0 }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="relative z-10 w-full h-[100dvh] md:h-auto md:max-h-[85vh] md:max-w-5xl bg-slate-50 md:rounded-[2rem] shadow-2xl flex flex-col overflow-hidden"
            >
              {/* Header Sticky */}
              <div className="sticky top-0 z-20 shrink-0 border-b border-slate-200/60 bg-white/80 backdrop-blur-xl px-4 md:px-8 py-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold text-sm uppercase ${currentTheme?.bg} text-white`}>
                    {menuOptions.find(m => m.id === activeModal)?.icon}
                  </div>
                  <h3 className="font-bold text-slate-900 text-lg md:text-xl">{menuOptions.find(m => m.id === activeModal)?.title}</h3>
                </div>
                <button
                  onClick={() => setActiveModal(null)}
                  className="p-2.5 bg-slate-100 hover:bg-slate-200 text-slate-500 rounded-full transition-colors active:scale-95"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Scrollable Content Inside Modal */}
              <div className="flex-1 overflow-y-auto p-4 md:p-8">
                {/* ════ MODAL DESCRIPTION ════ */}
                <div className={cn("mb-8 p-6 border-l-4 rounded-r-3xl rounded-l-lg shadow-sm", 
                  activeModal === 'kelompok' ? 'bg-indigo-50 border-indigo-500' : 
                  activeModal === 'mandiri' ? 'bg-amber-50 border-amber-500' : 
                  'bg-emerald-50 border-emerald-500'
                )}>
                  <div className="flex items-start gap-4">
                    <div className={cn("w-1.5 h-10 rounded-full hidden md:block", 
                      activeModal === 'kelompok' ? 'bg-indigo-500/20' : 
                      activeModal === 'mandiri' ? 'bg-amber-500/20' : 
                      'bg-emerald-500/20'
                    )} />
                    <p className="text-slate-700 font-bold leading-relaxed text-sm md:text-base">
                      {activeModal === "kelompok" && "Panitia membuka pendaftaran Sapi Kelompok. 1 kelompok sapi berisikan maksimal 7 pendaftar/shohibul qurban. Silakan lihat daftar kelompok di bawah ini."}
                      {activeModal === "mandiri" && "Layanan Sapi Mandiri diperuntukkan bagi shohibul qurban yang ingin berkurban satu ekor sapi secara personal/keluarga."}
                      {activeModal === "kambing" && "Informasi pendaftaran shohibul qurban kambing/domba serta daftar penyedia hewan kurban yang direkomendasikan panitia."}
                    </p>
                  </div>
                </div>

                {/* ════ INFORMATION BOX (DYNAMIC) ════ */}
                <div className={cn("mb-10 p-6 border-2 border-dashed rounded-[2rem] relative overflow-hidden group", currentTheme?.light, currentTheme?.border)}>
                  <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                    <MessageCircle className={cn("w-20 h-20", currentTheme?.primary)} />
                  </div>
                  <div className="relative z-10 space-y-4">
                    <div className="flex items-center gap-2">
                      <div className={cn("w-2 h-2 rounded-full animate-pulse", currentTheme?.bg)} />
                      <h4 className={cn("text-xs font-bold uppercase tracking-widest", currentTheme?.primary)}>
                        {activeModal === "kelompok" ? "Informasi Pembayaran" : "Informasi Pendaftaran"}
                      </h4>
                    </div>

                    {activeModal === "kelompok" ? (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-1">
                          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tight">Transfer ke Rekening BCA</p>
                          <p className="text-xl font-bold text-slate-900 tracking-tight">0331.587.426</p>
                          <p className="text-sm font-bold text-slate-600">a/n Drs. Heru Bawono</p>
                        </div>
                        <div className="space-y-3">
                          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tight">Konfirmasi WhatsApp</p>
                          <button
                            onClick={() => openWA("6281330739337", "Assamu'alaikum Pak Heru, saya ingin konfirmasi transfer kurban Sapi Kelompok.")}
                            className={cn("flex items-center gap-4 p-4 bg-white border rounded-2xl hover:shadow-lg transition-all text-left group/btn w-full", currentTheme?.border)}
                          >
                            <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center shrink-0 transition-colors", currentTheme?.light, `group-hover/btn:${currentTheme?.bg}`)}>
                              <MessageCircle className={cn("w-5 h-5 transition-colors", currentTheme?.primary, "group-hover/btn:text-white")} />
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tight leading-none mb-1">Bendahara</p>
                              <p className="text-sm font-bold text-slate-900 truncate">Heru Bawono</p>
                              <p className={cn("text-xs font-bold", currentTheme?.primary)}>0813-3073-9337</p>
                            </div>
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        <p className="text-sm font-bold text-slate-700 leading-snug">Silakan hubungi panitia untuk pendaftaran & koordinasi:</p>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          <button
                            onClick={() => openWA("6281330739337", `Assamu'alaikum Pak Heru, saya ingin mendaftar kurban ${activeModal === 'mandiri' ? 'Sapi Mandiri' : 'Kambing'}.`)}
                            className={cn("flex items-center gap-4 p-4 bg-white border rounded-2xl hover:shadow-lg transition-all text-left group/btn", currentTheme?.border)}
                          >
                            <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center shrink-0 transition-colors", currentTheme?.light, `group-hover/btn:${currentTheme?.bg}`)}>
                              <MessageCircle className={cn("w-5 h-5 transition-colors", currentTheme?.primary, "group-hover/btn:text-white")} />
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tight leading-none mb-1">Panitia</p>
                              <p className="text-sm font-bold text-slate-900 truncate">Heru Bawono</p>
                              <p className={cn("text-xs font-bold", currentTheme?.primary)}>0813-3073-9337</p>
                            </div>
                          </button>
                          <button
                            onClick={() => openWA("6281325956533", `Assamu'alaikum Mas Aan, saya ingin mendaftar kurban ${activeModal === 'mandiri' ? 'Sapi Mandiri' : 'Kambing'}.`)}
                            className={cn("flex items-center gap-4 p-4 bg-white border rounded-2xl hover:shadow-lg transition-all text-left group/btn", currentTheme?.border)}
                          >
                            <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center shrink-0 transition-colors", currentTheme?.light, `group-hover/btn:${currentTheme?.bg}`)}>
                              <MessageCircle className={cn("w-5 h-5 transition-colors", currentTheme?.primary, "group-hover/btn:text-white")} />
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tight leading-none mb-1">Panitia</p>
                              <p className="text-sm font-bold text-slate-900 truncate">Aan Prihantoro</p>
                              <p className={cn("text-xs font-bold", currentTheme?.primary)}>0813-2595-6533</p>
                            </div>
                          </button>
                        </div>
                      </div>
                    )}

                    <p className="text-[10px] text-slate-400 font-medium italic">
                      {activeModal === "kelompok"
                        ? "*Pembayaran juga dapat dilakukan secara tunai langsung kepada bendahara Musala."
                        : "*Pendaftaran akan tercatat di sistem setelah dikonfirmasi oleh panitia."}
                    </p>
                  </div>
                </div>

                {/* ════ SECTION SAPI KELOMPOK ════ */}
                {activeModal === "kelompok" && (
                  <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {visibleGroups.map((group, idx) => (
                        <CowGroupCard key={group.id} group={group} index={idx}
                          onRegister={(name) => openWA("6282132440054", `Assalamu'alaikum Mas Andy, saya ingin mendaftar kurban Sapi Kelompok untuk ${name}. Mohon info pendaftarannya.`)}
                        />
                      ))}
                    </div>
                  </div>
                )}

                {/* ════ SECTION SAPI MANDIRI ════ */}
                {activeModal === "mandiri" && (
                  <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 max-h-full">
                    <div className="lg:col-span-5 bg-white border border-slate-100 rounded-3xl p-4 shadow-sm">
                      <div className="flex items-center gap-3 mb-6 border-b border-slate-100 pb-4">
                        <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center shrink-0", currentTheme?.light)}>
                          <Users className={cn("w-5 h-5", currentTheme?.primary)} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="text-base font-bold text-slate-800 truncate">Daftar Shohibul Qurban</h3>
                          <p className="text-xs text-slate-500 font-medium tracking-tight">Tercatat {sapiMandiriList.length} Hamba Allah</p>
                        </div>
                      </div>
                      <div className="space-y-3">
                        {sapiMandiriList.length > 0 ? sapiMandiriList.map((s, i) => (
                          <div key={i} className={cn("flex items-center gap-3 p-3.5 rounded-2xl border transition-colors", currentTheme?.light, currentTheme?.border, "hover:bg-white")}>
                            <div className={cn("w-8 h-8 rounded-xl flex items-center justify-center font-bold text-xs shrink-0", currentTheme?.bg, "text-white")}>{i + 1}</div>
                            <div className="flex-1 min-w-0">
                              <p className="font-bold text-slate-800 text-[15px] truncate">{s.name}</p>
                              {s.keterangan && <p className="text-xs text-slate-400 italic whitespace-pre-line">{s.keterangan}</p>}
                            </div>
                            <CheckCircle2 className={cn("w-4 h-4 shrink-0 ml-1", currentTheme?.primary)} />
                          </div>
                        )) : (
                          <div className="bg-slate-50 border border-dashed border-slate-200 rounded-2xl p-8 flex flex-col items-center justify-center text-center">
                            <p className="text-slate-400 font-bold text-sm">Belum ada shohibul qurban Sapi Mandiri.</p>
                            <p className="text-slate-400 text-xs mt-1">Jadilah yang pertama untuk mendaftar!</p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                )}

                {/* ════ SECTION KAMBING ════ */}
                {activeModal === "kambing" && (
                  <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 max-h-full">
                    <div className="lg:col-span-5 flex flex-col gap-6">
                      {/* Daftar Shohibul */}
                      <div className="bg-white border border-slate-100 rounded-3xl p-4 shadow-sm">
                        <div className="flex items-center gap-3 mb-6 border-b border-slate-100 pb-4">
                          <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center shrink-0", currentTheme?.light)}>
                            <Users className={cn("w-5 h-5", currentTheme?.primary)} />
                          </div>
                          <div className="flex-1 min-w-0">
                            <h3 className="text-base font-bold text-slate-800 truncate">Daftar Shohibul Qurban</h3>
                            <p className="text-xs text-slate-500 font-medium tracking-tight">Tercatat {kambingList.length} orang</p>
                          </div>
                        </div>
                        <div className="space-y-3">
                          {kambingList.length > 0 ? kambingList.map((s, i) => (
                            <div key={i} className={cn("flex items-center gap-3 p-3.5 rounded-2xl border transition-colors", currentTheme?.light, currentTheme?.border, "hover:bg-white")}>
                              <div className={cn("w-8 h-8 rounded-xl flex items-center justify-center font-bold text-xs shrink-0", currentTheme?.bg, "text-white")}>{i + 1}</div>
                              <div className="flex-1 min-w-0">
                                <p className="font-bold text-slate-800 text-[15px] truncate">{s.name}</p>
                                {s.keterangan && <p className="text-xs text-slate-400 italic whitespace-pre-line">{s.keterangan}</p>}
                              </div>
                              <CheckCircle2 className={cn("w-4 h-4 shrink-0 ml-1", currentTheme?.primary)} />
                            </div>
                          )) : (
                            <div className="bg-slate-50 border border-dashed border-slate-200 rounded-2xl p-8 flex flex-col items-center justify-center text-center">
                              <p className="text-slate-400 font-bold text-sm">Belum ada shohibul qurban Kambing.</p>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Daftar Penyedia */}
                      <div className="bg-white border border-slate-100 rounded-3xl p-4 shadow-sm">
                        <div className="flex items-center gap-3 mb-6">
                          <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center shrink-0 text-xl", currentTheme?.light)}>🐐</div>
                          <h3 className="text-base font-bold text-slate-800 truncate">Penyedia Kambing</h3>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                          {penyediaKambing.map((p, i) => (
                            <div key={i} className={cn("flex flex-col justify-between gap-3 p-4 rounded-2xl border transition-colors group", currentTheme?.light, currentTheme?.border, "hover:bg-white")}>
                              <div className="flex-1 min-w-0">
                                <p className="font-bold text-slate-800 text-sm truncate">{p.nama}</p>
                                <p className="text-[11px] text-slate-500 font-medium truncate mt-0.5">{p.wa}</p>
                              </div>
                              <a
                                href={`https://wa.me/${p.link}?text=${encodeURIComponent("Assalamu'alaikum, saya dapat info dari website Musala Al Ukhuwah. Ingin tanya terkait kurban domba/kambing.")}`}
                                target="_blank"
                                className={cn("w-full flex items-center justify-center gap-1.5 px-3 py-2 text-white font-bold text-xs rounded-xl transition-all shadow-sm", currentTheme?.bg, "hover:opacity-90")}
                              >
                                <Phone className="w-3.5 h-3.5" /> Hubungi WA
                              </a>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                <div className="h-32" /> {/* Bottom Spacing for mobile */}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
