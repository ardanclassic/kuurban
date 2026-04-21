"use client";

import { useState } from "react";
import { Plus, Search, Edit2, Trash2, Filter, Calendar, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import ConfirmDialog from "@/components/ui/ConfirmDialog";
import { useAuth } from "@/lib/auth-context";

export default function AdminKurbanPage() {
  const [filter, setFilter] = useState("Semua");
  const [searchQuery, setSearchQuery] = useState("");
  const { role } = useAuth();
  const isAdmin = role === "admin";

  // Data dari Convex
  const rawKurbanData = useQuery(api.shohibulKurban.getAll);
  const createKurban = useMutation(api.shohibulKurban.create);
  const removeKurban = useMutation(api.shohibulKurban.remove);

  const kurbanData = rawKurbanData ? [...rawKurbanData].reverse() : [];

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newKurban, setNewKurban] = useState({
    nama: "",
    jenis: "Sapi Kelompok" as "Sapi Kelompok" | "Sapi Mandiri" | "Kambing",
    kelompok: "Kelompok 1",
    keterangan: ""
  });

  const categories = ["Semua", "Sapi Kelompok", "Sapi Mandiri", "Kambing"];

  const filteredData = kurbanData.filter(item => {
    const matchesFilter = filter === "Semua" || item.jenis === filter;
    const matchesSearch = item.nama.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const [confirmDeleteId, setConfirmDeleteId] = useState<Id<"shohibul_kurban"> | null>(null);

  const handleDelete = (id: Id<"shohibul_kurban">) => {
    setConfirmDeleteId(id);
  };

  const handleAddData = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newKurban.nama) return;

    await createKurban({
      nama: newKurban.nama,
      jenis: newKurban.jenis,
      kelompok: newKurban.jenis === "Sapi Kelompok" ? newKurban.kelompok : undefined,
      keterangan: newKurban.keterangan || undefined
    });

    setIsAddModalOpen(false);
    setNewKurban({ nama: "", jenis: "Sapi Kelompok", kelompok: "Kelompok 1", keterangan: "" });
  };

  const stats = {
    sapi: kurbanData.filter(d => d.jenis.includes("Sapi")).length,
    kambing: kurbanData.filter(d => d.jenis === "Kambing").length
  };

  return (
    <div className="space-y-6 pb-20">

      {/* DYNAMIC HERO HEADER */}
      <div className="relative p-6 md:p-12 bg-slate-950 rounded-b-[1.5rem] md:rounded-b-[2.5rem] overflow-hidden shadow-2xl">
        {/* Decorative elements for depth */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-600/20 blur-[100px] -mr-20 -mt-20 rounded-full" />
        <div className="absolute bottom-0 left-0 w-40 h-40 bg-indigo-500/10 blur-[80px] -ml-10 -mb-10 rounded-full" />

        <div className="relative z-10 flex flex-col gap-5 md:gap-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div className="space-y-3">
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-emerald-500/10 rounded-full border border-emerald-500/20">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                <span className="text-[10px] font-bold text-emerald-300 uppercase tracking-[0.2em]">Data Shohibul 1447 H</span>
              </div>
              <h2 className="text-3xl md:text-5xl font-black tracking-tight text-white leading-[1.1]">
                Data Shohibul <span className="text-emerald-400">Qurban</span>
              </h2>
              <p className="text-slate-400 text-xs md:text-sm font-medium pr-10">
                Manajemen data warga yang berkurban dan pembagian kelompok sapi.
              </p>
            </div>

            {isAdmin && (
              <button
                onClick={() => setIsAddModalOpen(true)}
                className="flex items-center gap-2.5 px-6 py-3.5 bg-indigo-600 text-white rounded-2xl font-bold text-sm shadow-xl shadow-indigo-600/30 hover:bg-indigo-500 active:scale-95 transition-all w-fit shrink-0"
              >
                <Plus className="w-4 h-4" /> Tambah Shohibul Baru
              </button>
            )}
          </div>

          <div className="flex flex-wrap items-center gap-6 pt-6 border-t border-white/5">
            <div className="flex flex-col">
              <span className="text-[9px] font-bold text-slate-500 uppercase tracking-widest leading-none mb-1">Total Sapi</span>
              <p className="text-sm font-bold text-slate-300">{stats.sapi} Ekor</p>
            </div>
            <div className="w-px h-6 bg-white/10 hidden md:block" />
            <div className="flex flex-col">
              <span className="text-[9px] font-bold text-slate-500 uppercase tracking-widest leading-none mb-1">Total Kambing</span>
              <p className="text-sm font-bold text-slate-300">{stats.kambing} Ekor</p>
            </div>
          </div>
        </div>
      </div>

      {/* SEARCH BAR */}
      <div className="relative group">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-indigo-500 transition-colors" />
        <input
          type="text"
          placeholder="Cari nama shohibul kurban..."
          className="w-full pl-12 pr-4 py-3 bg-white border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all text-sm font-medium shadow-sm outline-none"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      {/* CATEGORIES - WRAPPING CHIPS CONCEPT */}
      <div className="flex flex-wrap items-center gap-2">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setFilter(cat)}
            className={cn(
              "px-4 py-2 rounded-xl text-[10px] font-bold uppercase tracking-widest transition-all border",
              filter === cat
                ? "bg-slate-900 text-white border-slate-900 shadow-md shadow-slate-900/10"
                : "bg-white text-slate-500 border-slate-200 hover:border-indigo-200"
            )}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* DATA CARDS - ROBUST WIDTH CONTROL */}
      <div className="grid grid-cols-1 gap-3 w-full">
        {rawKurbanData === undefined ? (
          <div className="py-20 text-center">
            <p className="text-slate-400 font-bold text-sm animate-pulse">Memuat data...</p>
          </div>
        ) : filteredData.length > 0 ? (
          filteredData.map((item, i) => (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              key={item._id}
              className="bg-white p-3 md:p-4 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-3 w-full min-w-0 hover:border-indigo-300 transition-all active:bg-slate-50"
            >
              {/* Visual Icon */}
              <div className={cn(
                "w-9 h-9 md:w-10 md:h-10 rounded-xl flex items-center justify-center shrink-0 shadow-inner border border-slate-100",
                item.jenis === "Kambing" ? "bg-amber-50 text-amber-600" : "bg-indigo-50 text-indigo-600"
              )}>
                <span className="font-bold text-sm md:text-base">{item.jenis === "Kambing" ? "🐐" : "🐄"}</span>
              </div>

              {/* Content Area - Full Name & Status */}
              <div className="flex-1 min-w-0 py-0.5">
                <h4 className="font-bold text-slate-900 text-sm md:text-[15px] leading-tight mb-1.5 flex items-center gap-2">
                  {item.nama}
                </h4>
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-[10px] md:text-[11px] font-bold text-slate-400 border border-slate-100 rounded-md px-2 py-0.5 uppercase tracking-tight">
                    {item.jenis}
                  </span>
                  {item.kelompok && (
                    <span className="text-[10px] md:text-[11px] font-bold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-md uppercase tracking-tight">
                      {item.kelompok}
                    </span>
                  )}
                  {item.keterangan && (
                    <div className="text-[10px] md:text-[11px] italic font-medium text-slate-400 mt-0.5 whitespace-pre-line">
                      {item.keterangan}
                    </div>
                  )}
                </div>
              </div>

              {/* Action Buttons */}
              {isAdmin && (
                <div className="flex items-center gap-1 shrink-0 ml-auto pl-2 border-l border-slate-50">
                  <button
                    onClick={() => handleDelete(item._id)}
                    className="p-2 text-red-400 hover:text-red-500 transition-colors"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              )}
            </motion.div>
          ))
        ) : (
          <div className="py-20 text-center">
            <p className="text-slate-400 font-bold text-sm">Data tidak ditemukan.</p>
          </div>
        )}
      </div>

      {/* COMPACT FOOTER STATS */}
      <div className="bg-slate-950 p-5 rounded-2xl text-center shadow-lg shadow-slate-950/20 w-full overflow-hidden">
        <p className="text-white font-bold text-[9px] uppercase tracking-[0.2em] opacity-80">
          {rawKurbanData === undefined ? "Menghitung..." : `${filteredData.length} Shohibul Terfilter`}
        </p>
      </div>

      {/* ADD MODAL */}
      <AnimatePresence>
        {isAddModalOpen && (
          <div className="fixed inset-0 z-[300] flex items-end md:items-center justify-center p-0 md:p-6 h-[100dvh]">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
              onClick={() => setIsAddModalOpen(false)}
            />
            <motion.div
              initial={{ y: "100%", opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: "100%", opacity: 0 }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="relative w-full h-full md:h-auto md:max-w-md flex flex-col bg-white md:rounded-3xl shadow-2xl overflow-hidden"
            >
              <div className="flex items-center justify-between p-4 border-b border-slate-100 shrink-0">
                <h3 className="font-bold text-slate-900 text-lg">Tambah Shohibul Kurban</h3>
                <button
                  onClick={() => setIsAddModalOpen(false)}
                  className="p-2 text-slate-400 hover:text-slate-600 transition-colors rounded-full hover:bg-slate-50"
                  type="button"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleAddData} className="flex-1 flex flex-col min-h-0 relative">
                <div className="flex-1 overflow-y-auto p-4 pb-28 space-y-5">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold tracking-wide text-slate-500 uppercase">Nama Lengkap</label>
                    <input
                      type="text"
                      required
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all text-sm font-bold text-slate-900 placeholder:text-slate-400 placeholder:font-medium"
                      placeholder="Contoh: Bpk. Budi - RT 01"
                      value={newKurban.nama}
                      onChange={e => setNewKurban({ ...newKurban, nama: e.target.value })}
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold tracking-wide text-slate-500 uppercase">Jenis Kurban</label>
                    <select
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all text-sm font-bold text-slate-900 appearance-none"
                      value={newKurban.jenis}
                      onChange={e => setNewKurban({ ...newKurban, jenis: e.target.value as "Sapi Kelompok" | "Sapi Mandiri" | "Kambing" })}
                    >
                      <option value="Sapi Kelompok">Sapi Kelompok</option>
                      <option value="Sapi Mandiri">Sapi Mandiri</option>
                      <option value="Kambing">Kambing</option>
                    </select>
                  </div>

                  {newKurban.jenis === "Sapi Kelompok" && (
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold tracking-wide text-slate-500 uppercase">Kelompok</label>
                      <input
                        type="text"
                        required
                        className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all text-sm font-bold text-slate-900 placeholder:text-slate-400 placeholder:font-medium"
                        placeholder="Contoh: Kelompok 1"
                        value={newKurban.kelompok}
                        onChange={e => setNewKurban({ ...newKurban, kelompok: e.target.value })}
                      />
                    </div>
                  )}



                  <div className="space-y-1.5">
                    <label className="text-xs font-bold tracking-wide text-slate-500 uppercase">Keterangan (Opsional)</label>
                    <input
                      type="text"
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all text-sm font-bold text-slate-900 placeholder:text-slate-400 placeholder:font-medium"
                      placeholder="Contoh: Atas nama alm. H. Salim"
                      value={newKurban.keterangan}
                      onChange={e => setNewKurban({ ...newKurban, keterangan: e.target.value })}
                    />
                  </div>
                  <div className="h-4" />
                </div>

                {/* FLOATING SUBMIT BUTTON */}
                <div className="absolute bottom-0 left-0 right-0 p-4 pt-10 pointer-events-none z-10 bg-gradient-to-t from-white via-white/80 to-transparent">
                  <button
                    type="submit"
                    className="w-full pointer-events-auto bg-indigo-600 text-white py-3.5 rounded-xl font-bold flex items-center justify-center gap-2 shadow-xl shadow-indigo-600/30 ring-1 ring-white/20 active:scale-95 transition-all text-sm"
                  >
                    <Plus className="w-4 h-4" /> Simpan Data
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <ConfirmDialog
        isOpen={confirmDeleteId !== null}
        title="Hapus Data Shohibul Kurban"
        message="Nama ini akan dihapus permanen dari daftar shohibul kurban. Lanjutkan?"
        onConfirm={async () => {
          if (confirmDeleteId) await removeKurban({ id: confirmDeleteId });
          setConfirmDeleteId(null);
        }}
        onCancel={() => setConfirmDeleteId(null)}
      />
    </div>
  );
}
