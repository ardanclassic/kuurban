"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Briefcase, Users, Star, Award, ChevronDown, Edit2, Trash2, Plus, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import ConfirmDialog from "@/components/ui/ConfirmDialog";
import { useAuth } from "@/lib/auth-context";
import FullScreenLoader from "@/components/ui/FullScreenLoader";

function DivisionCard({
  d,
  index,
  onOpenDetail,
  isAdmin
}: {
  d: { _id: string, nama: string, koordinator: string, anggota: string[], jobDesc?: string };
  index: number;
  onOpenDetail: (d: any) => void;
  isAdmin: boolean;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      onClick={() => onOpenDetail(d)}
      className="group cursor-pointer bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-md hover:border-indigo-300 transition-all overflow-hidden"
    >
      <div className="flex items-stretch min-h-[100px]">
        {/* Side Accent */}
        <div className="w-1.5 bg-slate-100 border-r border-slate-200 group-hover:bg-indigo-400 transition-colors" />

        <div className="flex-1 p-4 md:p-5 flex flex-col justify-between gap-3">
          <div className="flex items-start justify-between gap-2">
            <div className="space-y-1">
              <h4 className="font-bold text-slate-900 text-sm md:text-base leading-tight group-hover:text-indigo-600 transition-colors">
                {d.nama}
              </h4>
              <div className="flex items-center gap-1.5 w-fit px-2 py-0.5 bg-slate-50 text-slate-400 rounded-md border border-slate-100">
                <Users className="w-3 h-3" />
                <span className="text-[10px] font-bold">{d.anggota.length + 1} Orang</span>
              </div>
            </div>
            <div className="p-2 bg-indigo-50 text-indigo-600 rounded-xl group-hover:bg-indigo-600 group-hover:text-white transition-all">
              <ChevronDown className="w-4 h-4 -rotate-90" />
            </div>
          </div>

          <div className="flex flex-col gap-0.5">
            <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1">
              <Star className="w-2.5 h-2.5 text-amber-500 fill-amber-500" /> Koordinator
            </span>
            <p className="font-bold text-slate-800 text-xs md:text-sm uppercase tracking-tight">
              {d.koordinator}
            </p>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export default function SusunanPanitiaPage() {
  const { role } = useAuth();
  const isAdmin = role === "admin";
  const pengurusData = useQuery(api.panitia.getPengurusHarian);
  const divisiData = useQuery(api.panitia.getDivisiPanitia);
  const isLoading = pengurusData === undefined || divisiData === undefined;

  const createPengurus = useMutation(api.panitia.createPengurus);
  const updatePengurus = useMutation(api.panitia.updatePengurus);
  const removePengurus = useMutation(api.panitia.removePengurus);

  const createDivisi = useMutation(api.panitia.createDivisi);
  const updateDivisi = useMutation(api.panitia.updateDivisi);
  const removeDivisi = useMutation(api.panitia.removeDivisi);

  // Modal Pengurus State
  const [isPengurusModalOpen, setIsPengurusModalOpen] = useState(false);
  const [editingPengurusId, setEditingPengurusId] = useState<Id<"pengurus_harian"> | null>(null);
  const [pengurusForm, setPengurusForm] = useState({ nama: "", jabatan: "" });

  const [confirmDeletePengurusId, setConfirmDeletePengurusId] = useState<Id<"pengurus_harian"> | null>(null);
  const [confirmDeleteDivisiId, setConfirmDeleteDivisiId] = useState<Id<"divisi_panitia"> | null>(null);
  const [confirmDeleteMemberIdx, setConfirmDeleteMemberIdx] = useState<number | null>(null);

  // Modal Divisi State
  const [isDivisiModalOpen, setIsDivisiModalOpen] = useState(false);
  const [editingDivisiId, setEditingDivisiId] = useState<Id<"divisi_panitia"> | null>(null);
  const [divisiForm, setDivisiForm] = useState<{ nama: string, koordinator: string, anggota: string[], jobDesc: string }>({ 
    nama: "", 
    koordinator: "", 
    anggota: [""],
    jobDesc: "" 
  });

  // Detail Modal State
  const [selectedDivisi, setSelectedDivisi] = useState<any | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);

  // CRUD for Pengurus
  const handleOpenPengurusModal = (item?: any) => {
    if (item) {
      setPengurusForm({ nama: item.nama, jabatan: item.jabatan });
      setEditingPengurusId(item._id);
    } else {
      setPengurusForm({ nama: "", jabatan: "" });
      setEditingPengurusId(null);
    }
    setIsPengurusModalOpen(true);
  };

  const handleDeletePengurus = (id: Id<"pengurus_harian">) => {
    setConfirmDeletePengurusId(id);
  };

  const handleSavePengurus = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!pengurusForm.nama || !pengurusForm.jabatan) return;

    if (editingPengurusId) {
      await updatePengurus({
        id: editingPengurusId,
        nama: pengurusForm.nama,
        jabatan: pengurusForm.jabatan
      });
    } else {
      await createPengurus({
        nama: pengurusForm.nama,
        jabatan: pengurusForm.jabatan
      });
    }
    setIsPengurusModalOpen(false);
  };

  // CRUD for Divisi
  const handleOpenDivisiModal = (item?: any) => {
    if (item) {
      setDivisiForm({
        nama: item.nama,
        koordinator: item.koordinator,
        anggota: item.anggota.length > 0 ? [...item.anggota] : [""],
        jobDesc: item.jobDesc || ""
      });
      setEditingDivisiId(item._id as Id<"divisi_panitia">);
    } else {
      setDivisiForm({ nama: "", koordinator: "", anggota: [""], jobDesc: "" });
      setEditingDivisiId(null);
    }
    setIsDivisiModalOpen(true);
  };

  const handleDeleteDivisi = (id: string) => {
    setConfirmDeleteDivisiId(id as Id<"divisi_panitia">);
  };

  const handleSaveDivisi = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!divisiForm.nama || !divisiForm.koordinator) return;

    const anggotaArray = divisiForm.anggota.map(a => a.trim()).filter(a => a !== "");

    if (editingDivisiId) {
      await updateDivisi({
        id: editingDivisiId,
        nama: divisiForm.nama,
        koordinator: divisiForm.koordinator,
        anggota: anggotaArray,
        jobDesc: divisiForm.jobDesc
      });
      // Update selected divisi if open
      if (selectedDivisi && selectedDivisi._id === editingDivisiId) {
        setSelectedDivisi({
          ...selectedDivisi,
          nama: divisiForm.nama,
          koordinator: divisiForm.koordinator,
          anggota: anggotaArray,
          jobDesc: divisiForm.jobDesc
        });
      }
    } else {
      await createDivisi({
        nama: divisiForm.nama,
        koordinator: divisiForm.koordinator,
        anggota: anggotaArray,
        jobDesc: divisiForm.jobDesc
      });
    }
    setIsDivisiModalOpen(false);
  };


  return (
    <>
      <FullScreenLoader isLoading={isLoading} text="Memuat Data Panitia..." />
      <div className={cn("space-y-6 md:space-y-8 max-w-6xl pb-12 transition-opacity duration-500", isLoading ? "opacity-0" : "opacity-100")}>

        {/* DYNAMIC HEADER */}
        <div className="relative p-6 md:p-12 bg-slate-950 rounded-b-[1.5rem] md:rounded-b-[2.5rem] overflow-hidden shadow-2xl">
          {/* Decorative elements for depth */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-600/20 blur-[100px] -mr-20 -mt-20 rounded-full" />
          <div className="absolute bottom-0 left-0 w-40 h-40 bg-emerald-500/10 blur-[80px] -ml-10 -mb-10 rounded-full" />

          <div className="relative z-10 flex flex-col gap-4 md:gap-6">
            <div className="space-y-2">
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-indigo-500/10 rounded-full border border-indigo-500/20">
                <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 animate-pulse" />
                <span className="text-[10px] font-bold text-indigo-300 uppercase tracking-[0.2em]">Manajemen Panitia</span>
              </div>
              <h2 className="text-3xl md:text-5xl font-black tracking-tight text-white leading-[1.1]">
                Susunan <span className="text-indigo-400">Panitia</span>
              </h2>
            </div>

            <div className="flex flex-wrap items-center gap-3 md:gap-6 pt-2 border-t border-white/5">
              <div className="flex flex-col">
                <span className="text-[9px] font-bold text-slate-500 uppercase tracking-widest leading-none mb-1">Kegiatan</span>
                <p className="text-sm font-bold text-slate-300">Idul Adha 1447 H</p>
              </div>
              <div className="w-px h-6 bg-white/10 hidden md:block" />
              <div className="flex flex-col">
                <span className="text-[9px] font-bold text-slate-500 uppercase tracking-widest leading-none mb-1">Lokasi</span>
                <p className="text-sm font-bold text-slate-300">Musala Al Ukhuwah</p>
              </div>
            </div>
          </div>
        </div>

        {/* CORE COMMITTEE / PENGURUS HARIAN */}
        <section className="space-y-4">
          <div className="flex items-center justify-between px-1">
            <div className="flex items-center gap-2">
              <div className="w-1.5 h-4 bg-emerald-500 rounded-full" />
              <h3 className="text-xs font-bold text-slate-500 uppercase tracking-[0.2em]">Pengurus Harian</h3>
            </div>
            {isAdmin && (
              <button
                onClick={() => handleOpenPengurusModal()}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-indigo-50 text-indigo-600 rounded-lg text-xs font-bold hover:bg-indigo-100 transition-colors"
              >
                <Plus className="w-3.5 h-3.5" /> Tambah Pengurus
              </button>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {pengurusData === undefined ? (
              <p className="text-sm font-medium text-slate-400 col-span-full py-4 px-2 animate-pulse">Memuat data pengurus harian...</p>
            ) : pengurusData.map((p) => (
              <motion.div
                key={p._id}
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm group hover:border-indigo-300 hover:shadow-md transition-all flex flex-col gap-3"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <p className="text-[9px] font-bold text-indigo-500 uppercase tracking-widest mb-1.5">{p.jabatan}</p>
                    <h4 className="font-bold text-slate-900 text-sm md:text-[15px] leading-snug break-words">{p.nama}</h4>
                  </div>
                  {isAdmin && (
                    <div className="flex items-center gap-1 shrink-0 opacity-100 sm:opacity-0 group-hover:opacity-100 transition-opacity">
                      <button onClick={() => handleOpenPengurusModal(p)} className="p-1.5 bg-slate-50 text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors">
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button onClick={() => handleDeletePengurus(p._id)} className="p-1.5 bg-slate-50 text-slate-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  )}
                </div>
              </motion.div>
            ))}
            {pengurusData && pengurusData.length === 0 && (
              <p className="text-sm font-medium text-slate-400 col-span-full py-4 px-2">Belum ada pengurus harian</p>
            )}
          </div>
        </section>

        {/* DIVISI DIVISI */}
        <section className="space-y-4 pt-4">
          <div className="flex items-center justify-between px-1">
            <div className="flex items-center gap-2">
              <div className="w-1.5 h-4 bg-indigo-600 rounded-full" />
              <h3 className="text-xs font-bold text-slate-500 uppercase tracking-[0.2em]">Struktur Divisi Kerja</h3>
            </div>
            {isAdmin && (
              <button
                onClick={() => handleOpenDivisiModal(null)}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-indigo-50 text-indigo-600 rounded-lg text-xs font-bold hover:bg-indigo-100 transition-colors"
              >
                <Plus className="w-3.5 h-3.5" /> Tambah Divisi
              </button>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {divisiData === undefined ? (
              <p className="text-sm font-medium text-slate-400 col-span-full py-4 px-2 animate-pulse">Memuat data divisi...</p>
            ) : divisiData.map((d, i) => (
              <DivisionCard
                key={d._id}
                d={d as any}
                index={i}
                onOpenDetail={(item) => {
                  setSelectedDivisi(item);
                  setIsDetailOpen(true);
                }}
                isAdmin={isAdmin}
              />
            ))}
            {divisiData && divisiData.length === 0 && (
              <p className="text-sm font-medium text-slate-400 col-span-full py-4 px-2">Belum ada divisi</p>
            )}
          </div>
        </section>

        {/* PENGURUS HARIAN MODAL */}
        <AnimatePresence>
          {isPengurusModalOpen && (
            <div className="fixed inset-0 z-[500] flex items-end md:items-center justify-center p-0 md:p-6 h-[100dvh]">
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
                onClick={() => setIsPengurusModalOpen(false)}
              />
              <motion.div
                initial={{ y: "100%", opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: "100%", opacity: 0 }}
                transition={{ type: "spring", damping: 25, stiffness: 200 }}
                className="relative w-full h-full md:h-auto md:max-w-sm flex flex-col bg-white md:rounded-3xl shadow-2xl overflow-hidden"
              >
                <div className="flex items-center justify-between p-4 border-b border-slate-100 shrink-0">
                  <h3 className="font-bold text-slate-900 text-lg">{editingPengurusId ? 'Edit Pengurus' : 'Tambah Pengurus'}</h3>
                  <button
                    onClick={() => setIsPengurusModalOpen(false)}
                    className="p-2 text-slate-400 hover:text-slate-600 transition-colors rounded-full hover:bg-slate-50"
                    type="button"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
                <form onSubmit={handleSavePengurus} className="flex-1 flex flex-col min-h-0 relative">
                  <div className="flex-1 overflow-y-auto p-4 pb-28 space-y-5">
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold tracking-wide text-slate-500 uppercase">Nama Lengkap</label>
                      <input
                        type="text"
                        required
                        className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all text-sm font-bold text-slate-900 placeholder:text-slate-400 placeholder:font-medium"
                        placeholder="Contoh: Ir. H. Ahmad Fauzi"
                        value={pengurusForm.nama}
                        onChange={e => setPengurusForm({ ...pengurusForm, nama: e.target.value })}
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold tracking-wide text-slate-500 uppercase">Jabatan</label>
                      <input
                        type="text"
                        required
                        className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all text-sm font-bold text-slate-900 placeholder:text-slate-400 placeholder:font-medium"
                        placeholder="Contoh: Ketua Panitia"
                        value={pengurusForm.jabatan}
                        onChange={e => setPengurusForm({ ...pengurusForm, jabatan: e.target.value })}
                      />
                    </div>
                    <div className="h-4" />
                  </div>

                  {/* FLOATING SUBMIT BUTTON */}
                  <div className="absolute bottom-0 left-0 right-0 p-4 pt-10 pointer-events-none z-10 bg-gradient-to-t from-white via-white/80 to-transparent">
                    <button type="submit" className="w-full pointer-events-auto bg-indigo-600 text-white py-3.5 rounded-xl font-bold hover:bg-indigo-700 active:scale-95 transition-all text-sm shadow-xl shadow-indigo-600/30 ring-1 ring-white/20">
                      Simpan Data
                    </button>
                  </div>
                </form>
              </motion.div>
            </div>
          )}
        </AnimatePresence>

        {/* DIVISI MODAL */}
        <AnimatePresence>
          {isDivisiModalOpen && (
            <div className="fixed inset-0 z-[500] flex items-end md:items-center justify-center p-0 md:p-6 h-[100dvh]">
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
                onClick={() => setIsDivisiModalOpen(false)}
              />
              <motion.div
                initial={{ y: "100%", opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: "100%", opacity: 0 }}
                transition={{ type: "spring", damping: 25, stiffness: 200 }}
                className="relative w-full h-full md:h-auto md:max-w-md flex flex-col bg-white md:rounded-3xl shadow-2xl overflow-hidden"
              >
                <div className="flex items-center justify-between p-4 border-b border-slate-100 shrink-0">
                  <h3 className="font-bold text-slate-900 text-lg">{editingDivisiId ? 'Edit Divisi' : 'Tambah Divisi'}</h3>
                  <button
                    onClick={() => setIsDivisiModalOpen(false)}
                    className="p-2 text-slate-400 hover:text-slate-600 transition-colors rounded-full hover:bg-slate-50"
                    type="button"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
                <form onSubmit={handleSaveDivisi} className="flex-1 flex flex-col min-h-0 relative">
                  <div className="flex-1 overflow-y-auto p-4 pb-28 space-y-5">
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold tracking-wide text-slate-500 uppercase">Nama Divisi</label>
                      <input
                        type="text"
                        required
                        className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all text-sm font-bold text-slate-900 placeholder:text-slate-400 placeholder:font-medium"
                        placeholder="Contoh: Divisi Konsumsi"
                        value={divisiForm.nama}
                        onChange={e => setDivisiForm({ ...divisiForm, nama: e.target.value })}
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold tracking-wide text-slate-500 uppercase">Nama Koordinator</label>
                      <input
                        type="text"
                        required
                        className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all text-sm font-bold text-slate-900 placeholder:text-slate-400 placeholder:font-medium"
                        placeholder="Contoh: Ibu Ratna RT 04"
                        value={divisiForm.koordinator}
                        onChange={e => setDivisiForm({ ...divisiForm, koordinator: e.target.value })}
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold tracking-wide text-slate-500 uppercase">Daftar Anggota</label>
                      <div className="space-y-2">
                        {divisiForm.anggota.map((ang, idx) => (
                          <div key={idx} className="flex items-center gap-2">
                            <input
                              type="text"
                              value={ang}
                              placeholder={`Nama anggota ${idx + 1}`}
                              onChange={e => {
                                const newAnggota = [...divisiForm.anggota];
                                newAnggota[idx] = e.target.value;
                                setDivisiForm({ ...divisiForm, anggota: newAnggota });
                              }}
                              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all text-sm font-bold text-slate-900 placeholder:text-slate-400 placeholder:font-medium"
                            />
                            <button
                              type="button"
                              onClick={() => setConfirmDeleteMemberIdx(idx)}
                              className="p-3 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-colors shrink-0"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        ))}
                        <button
                          type="button"
                          onClick={() => {
                            const lastItem = divisiForm.anggota[divisiForm.anggota.length - 1];
                            if (lastItem === undefined || lastItem.trim() !== "") {
                              setDivisiForm({ ...divisiForm, anggota: [...divisiForm.anggota, ""] })
                            }
                          }}
                          className="w-full py-2.5 border border-dashed border-slate-300 rounded-xl text-slate-500 font-bold text-xs hover:border-indigo-300 hover:text-indigo-600 hover:bg-indigo-50 transition-colors flex items-center justify-center gap-2 mt-2"
                        >
                          <Plus className="w-4 h-4" /> Tambah Anggota
                        </button>
                      </div>
                    </div>
                      <div className="space-y-1.5">
                        <label className="text-xs font-bold tracking-wide text-slate-500 uppercase">Job Description (Tupoksi)</label>
                        <textarea
                          className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all text-sm font-medium text-slate-900 placeholder:text-slate-400 min-h-[120px] resize-none"
                          placeholder="Masukkan detail tugas dan tanggung jawab divisi..."
                          value={divisiForm.jobDesc}
                          onChange={e => setDivisiForm({ ...divisiForm, jobDesc: e.target.value })}
                        />
                      </div>
                      <div className="h-4" />
                  </div>

                  {/* FLOATING SUBMIT BUTTON */}
                  <div className="absolute bottom-0 left-0 right-0 p-4 pt-10 pointer-events-none z-10 bg-gradient-to-t from-white via-white/80 to-transparent">
                    <button type="submit" className="w-full pointer-events-auto bg-indigo-600 text-white py-3.5 rounded-xl font-bold hover:bg-indigo-700 active:scale-95 transition-all text-sm shadow-xl shadow-indigo-600/30 ring-1 ring-white/20">
                      Simpan Divisi
                    </button>
                  </div>
                </form>
              </motion.div>
            </div>
          )}
        </AnimatePresence>

        {/* DETAIL DIVISI MODAL (FULLSCREEN) */}
        <AnimatePresence>
          {isDetailOpen && selectedDivisi && (
            <div className="fixed inset-0 z-[400] flex items-center justify-center p-0 md:p-6 h-[100dvh]">
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 bg-slate-950/80 backdrop-blur-xl"
                onClick={() => setIsDetailOpen(false)}
              />
              <motion.div
                initial={{ y: "100%", opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: "100%", opacity: 0 }}
                className="relative w-full h-full md:max-w-3xl md:h-[90dvh] flex flex-col bg-white md:rounded-[2.5rem] shadow-2xl overflow-hidden"
              >
                {/* Modal Header */}
                <div className="flex flex-col p-5 md:p-7 border-b border-slate-100 shrink-0 gap-3 md:gap-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 px-3 py-1 bg-indigo-50 rounded-lg border border-indigo-100">
                      <Briefcase className="w-3.5 h-3.5 text-indigo-600" />
                      <span className="text-[9px] font-black text-indigo-600 uppercase tracking-[0.2em]">Detail Divisi Kerja</span>
                    </div>
                    <button
                      onClick={() => setIsDetailOpen(false)}
                      className="p-2 text-slate-400 hover:text-slate-900 hover:bg-slate-100 transition-all rounded-full"
                    >
                      <X className="w-6 h-6" />
                    </button>
                  </div>
                  <h3 className="font-black text-slate-900 text-xl md:text-2xl leading-[1.2] px-0.5">
                    {selectedDivisi.nama}
                  </h3>
                </div>

                {/* Modal Content */}
                <div className="flex-1 overflow-y-auto p-5 md:p-7 space-y-6 pb-24">
                  {/* Coordinator & Stats */}
                  <div className="grid grid-cols-2 gap-3">
                    <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 flex flex-col gap-1.5">
                      <div className="flex items-center gap-1.5">
                        <Star className="w-3 h-3 text-amber-500 fill-amber-500" />
                        <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest">Koordinator</span>
                      </div>
                      <p className="font-bold text-slate-900 text-sm md:text-base truncate">{selectedDivisi.koordinator}</p>
                    </div>
                    <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 flex flex-col gap-1.5">
                      <div className="flex items-center gap-1.5">
                        <Users className="w-3 h-3 text-indigo-500" />
                        <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest">Personel</span>
                      </div>
                      <p className="font-bold text-slate-900 text-sm md:text-base">{selectedDivisi.anggota.length + 1} Orang</p>
                    </div>
                  </div>

                  {/* Member List */}
                  <section className="space-y-2.5">
                    <div className="flex items-center gap-2 px-0.5">
                      <Users className="w-3.5 h-3.5 text-slate-400" />
                      <h4 className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Daftar Anggota</h4>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {selectedDivisi.anggota.map((member: string, idx: number) => (
                        <div key={idx} className="flex items-center gap-2.5 p-3.5 bg-slate-50 border border-slate-100 rounded-xl">
                          <div className="w-6 h-6 rounded-lg bg-white border border-slate-200 flex items-center justify-center text-slate-400 font-bold text-[10px]">
                            {idx + 1}
                          </div>
                          <p className="font-bold text-slate-700 text-xs md:text-sm">{member}</p>
                        </div>
                      ))}
                      {selectedDivisi.anggota.length === 0 && (
                        <div className="col-span-full p-6 text-center border border-dashed border-slate-200 rounded-2xl">
                          <p className="text-slate-400 text-xs">Tidak ada anggota tambahan</p>
                        </div>
                      )}
                    </div>
                  </section>

                  {/* Job Description */}
                  <section className="space-y-2.5">
                    <div className="flex items-center gap-2 px-0.5">
                      <Award className="w-3.5 h-3.5 text-indigo-500" />
                      <h4 className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Job Description</h4>
                    </div>
                    <div className="p-5 bg-white rounded-2xl border border-slate-200 shadow-sm min-h-[80px]">
                      {selectedDivisi.jobDesc ? (
                        <div className="text-slate-600 text-sm md:text-[15px] leading-relaxed whitespace-pre-line font-medium">
                          {selectedDivisi.jobDesc}
                        </div>
                      ) : (
                        <p className="text-slate-400 italic text-xs">Belum ada job description.</p>
                      )}
                    </div>
                  </section>
                </div>

                {/* Footer Actions (Admin Only) */}
                {isAdmin && (
                  <div className="absolute bottom-0 left-0 right-0 p-4 md:p-6 flex gap-2 bg-white border-t border-slate-100">
                    <button
                      onClick={() => {
                        handleOpenDivisiModal(selectedDivisi);
                      }}
                      className="flex-1 flex items-center justify-center gap-2 py-3.5 bg-slate-900 text-white rounded-xl font-bold text-xs hover:bg-slate-800 transition-all active:scale-95 shadow-lg shadow-slate-900/10"
                    >
                      <Edit2 className="w-3.5 h-3.5" /> Edit Divisi
                    </button>
                    <button
                      onClick={() => {
                        handleDeleteDivisi(selectedDivisi._id);
                        setIsDetailOpen(false);
                      }}
                      className="w-12 flex items-center justify-center py-3.5 bg-red-50 text-red-500 rounded-xl font-bold hover:bg-red-500 hover:text-white transition-all active:scale-95"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                )}
              </motion.div>
            </div>
          )}
        </AnimatePresence>

        {/* CONFIRM: Hapus Pengurus */}
        <ConfirmDialog
          isOpen={confirmDeletePengurusId !== null}
          title="Hapus Pengurus Harian"
          message="Data pengurus ini akan dihapus dari daftar. Lanjutkan?"
          onConfirm={async () => {
            if (confirmDeletePengurusId) await removePengurus({ id: confirmDeletePengurusId });
            setConfirmDeletePengurusId(null);
          }}
          onCancel={() => setConfirmDeletePengurusId(null)}
        />

        {/* CONFIRM: Hapus Divisi */}
        <ConfirmDialog
          isOpen={confirmDeleteDivisiId !== null}
          title="Hapus Divisi Panitia"
          message="Seluruh data divisi ini termasuk koordinator akan dihapus. Lanjutkan?"
          onConfirm={async () => {
            if (confirmDeleteDivisiId) await removeDivisi({ id: confirmDeleteDivisiId });
            setConfirmDeleteDivisiId(null);
          }}
          onCancel={() => setConfirmDeleteDivisiId(null)}
        />

        {/* CONFIRM: Hapus Anggota */}
        <ConfirmDialog
          isOpen={confirmDeleteMemberIdx !== null}
          title="Hapus Anggota"
          message="Nama anggota ini akan dihapus dari daftar divisi. Lanjutkan?"
          onConfirm={() => {
            if (confirmDeleteMemberIdx === null) return;
            const newAnggota = [...divisiForm.anggota];
            newAnggota.splice(confirmDeleteMemberIdx, 1);
            setDivisiForm({ ...divisiForm, anggota: newAnggota });
            setConfirmDeleteMemberIdx(null);
          }}
          onCancel={() => setConfirmDeleteMemberIdx(null)}
        />
      </div>
    </>
  );
}
