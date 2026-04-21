"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MessageSquare, Calendar, FileText, ChevronRight, X, Info, CheckCircle2, Edit2, Trash2, Plus, GripVertical, ChevronUp, ChevronDown } from "lucide-react";

import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import ConfirmDialog from "@/components/ui/ConfirmDialog";
import { useAuth } from "@/lib/auth-context";

export default function HasilRapatPage() {
  const { role } = useAuth();
  const isAdmin = role === "admin";
  const rawRapatData = useQuery(api.rapat.getAll);
  const createRapat = useMutation(api.rapat.create);
  const updateRapat = useMutation(api.rapat.update);
  const removeRapat = useMutation(api.rapat.remove);

  const rapatData = rawRapatData ? [...rawRapatData].reverse() : undefined;

  type RapatType = {
    _id: Id<"rapat">,
    title: string,
    date: string,
    status: string,
    fullDesc: string,
    points: string[]
  };

  const [selectedRapat, setSelectedRapat] = useState<RapatType | null>(null);

  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<Id<"rapat"> | null>(null);
  const [formData, setFormData] = useState<{ title: string, date: string, status: "Final" | "Internal" | "Draft", fullDesc: string, points: string[] }>({
    title: "",
    date: "",
    status: "Draft",
    fullDesc: "",
    points: [""]
  });

  const [dragIndex, setDragIndex] = useState<number | null>(null);
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);
  const [confirmDeleteRapat, setConfirmDeleteRapat] = useState<Id<"rapat"> | null>(null);
  const [confirmDeletePointIdx, setConfirmDeletePointIdx] = useState<number | null>(null);

  const handleDelete = (e: React.MouseEvent, id: Id<"rapat">) => {
    e.stopPropagation();
    setConfirmDeleteRapat(id);
  };

  const swapPoints = (fromIdx: number, toIdx: number) => {
    if (toIdx < 0 || toIdx >= formData.points.length) return;
    const newPoints = [...formData.points];
    [newPoints[fromIdx], newPoints[toIdx]] = [newPoints[toIdx], newPoints[fromIdx]];
    setFormData({ ...formData, points: newPoints });
  };

  const handleEdit = (e: React.MouseEvent, rapat: any) => {
    e.stopPropagation();
    setFormData({
      title: rapat.title,
      date: rapat.date,
      status: rapat.status as "Final" | "Internal" | "Draft",
      fullDesc: rapat.fullDesc,
      points: rapat.points.length > 0 ? [...rapat.points] : [""]
    });
    setEditingId(rapat._id);
    setIsFormModalOpen(true);
  };

  const handleOpenNew = () => {
    setFormData({
      title: "",
      date: "",
      status: "Draft",
      fullDesc: "",
      points: [""]
    });
    setEditingId(null);
    setIsFormModalOpen(true);
  };

  const handleSubmitForm = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title || !formData.date) return;

    const pointsArray = formData.points.map(p => p.trim()).filter(p => p !== "");

    if (editingId) {
      await updateRapat({
        id: editingId,
        title: formData.title,
        date: formData.date,
        status: formData.status,
        fullDesc: formData.fullDesc,
        points: pointsArray
      });
    } else {
      await createRapat({
        title: formData.title,
        date: formData.date,
        status: formData.status,
        fullDesc: formData.fullDesc,
        points: pointsArray
      })
    }
    setIsFormModalOpen(false);
  };

  return (
    <div className="space-y-6 max-w-4xl pb-10">
      {/* DYNAMIC HERO HEADER */}
      <div className="relative p-6 md:p-12 bg-slate-950 rounded-b-[1.5rem] md:rounded-b-[2.5rem] overflow-hidden shadow-2xl mb-2">
        {/* Decorative elements for depth */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-600/20 blur-[100px] -mr-20 -mt-20 rounded-full" />
        <div className="absolute bottom-0 left-0 w-40 h-40 bg-emerald-500/10 blur-[80px] -ml-10 -mb-10 rounded-full" />

        <div className="relative z-10 flex flex-col gap-4 md:gap-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div className="space-y-3">
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-indigo-500/10 rounded-full border border-indigo-500/20">
                <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 animate-pulse" />
                <span className="text-[10px] font-bold text-indigo-300 uppercase tracking-[0.2em]">Notulensi Digital 1447 H</span>
              </div>
              <h2 className="text-3xl md:text-5xl font-black tracking-tight text-white leading-[1.1]">
                Hasil Putusan <span className="text-indigo-400">Rapat</span>
              </h2>
              <p className="text-slate-400 text-xs md:text-sm font-medium pr-10">
                Klik pada kartu di bawah untuk melihat detail putusan rapat.
              </p>
            </div>

            {isAdmin && (
              <button
                onClick={handleOpenNew}
                className="flex items-center gap-2.5 px-6 py-3.5 bg-indigo-600 text-white rounded-2xl font-bold text-sm shadow-xl shadow-indigo-600/30 hover:bg-indigo-500 active:scale-95 transition-all w-fit shrink-0"
              >
                <Plus className="w-4 h-4" /> Buat Notulensi Baru
              </button>
            )}
          </div>
        </div>
      </div>

      {/* LIST OF CARDS AS BUTTONS */}
      <div className="grid grid-cols-1 gap-3">
        {rapatData === undefined ? (
          <div className="py-10 text-center">
            <p className="text-slate-400 font-bold text-sm animate-pulse">Memuat data rapat...</p>
          </div>
        ) : rapatData.length > 0 ? rapatData.map((rapat, i) => (
          <motion.div
            key={rapat._id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            onClick={() => setSelectedRapat(rapat)}
            className="w-full bg-white p-4 md:p-5 rounded-3xl border border-slate-200 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4 group hover:border-indigo-400 hover:shadow-md transition-all text-left cursor-pointer"
          >
            <div className="flex items-start gap-4 flex-1 min-w-0">
              <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0 group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                <FileText className="w-5 h-5" />
              </div>
              <div className="min-w-0 flex-1 pt-0.5">
                <h3 className="font-bold text-slate-800 text-[15px] md:text-base leading-snug break-words pr-2">{rapat.title}</h3>
                <div className="flex flex-wrap items-center gap-2.5 mt-2">
                  <span className="flex items-center gap-1.5 text-[10px] md:text-xs font-bold text-slate-500 uppercase tracking-wide whitespace-nowrap">
                    <Calendar className="w-3.5 h-3.5" /> {rapat.date}
                  </span>
                  <span className={`text-[9px] font-bold uppercase px-2.5 py-0.5 rounded-md whitespace-nowrap ${rapat.status === 'Final' ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' :
                    rapat.status === 'Internal' ? 'bg-amber-50 text-amber-600 border border-amber-100' : 'bg-slate-50 text-slate-400 border border-slate-100'
                    }`}>
                    {rapat.status}
                  </span>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-end gap-1.5 shrink-0 pt-3 sm:pt-0 border-t border-slate-100 sm:border-none w-full sm:w-auto">
              {isAdmin && (
                <>
                  <button
                    onClick={(e) => handleEdit(e, rapat)}
                    className="flex items-center gap-1.5 px-3 py-2 sm:px-2.5 sm:py-2 text-slate-400 bg-slate-50 sm:bg-transparent rounded-xl hover:text-indigo-600 hover:bg-slate-100 transition-colors"
                    title="Edit"
                  >
                    <Edit2 className="w-4 h-4" /> <span className="text-[10px] font-bold sm:hidden">Edit</span>
                  </button>
                  <button
                    onClick={(e) => handleDelete(e, rapat._id)}
                    className="flex items-center gap-1.5 px-3 py-2 sm:px-2.5 sm:py-2 text-red-400 bg-red-50 sm:bg-transparent rounded-xl hover:text-red-500 hover:bg-red-50 transition-colors"
                    title="Hapus"
                  >
                    <Trash2 className="w-4 h-4" /> <span className="text-[10px] font-bold sm:hidden">Hapus</span>
                  </button>
                </>
              )}
              <ChevronRight className="w-5 h-5 text-slate-200 group-hover:text-indigo-500 transition-all shrink-0 ml-2 hidden sm:block" />
            </div>
          </motion.div>
        )) : (
          <div className="py-10 text-center">
            <p className="text-slate-400 font-bold text-sm">Belum ada putusan rapat.</p>
          </div>
        )}
      </div>

      {/* FULLSCREEN DIALOG FOR DETAIL VIEW */}
      <AnimatePresence>
        {selectedRapat && (
          <div className="fixed inset-0 z-[200] flex items-end md:items-center justify-center p-0 md:p-6 overflow-hidden">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedRapat(null)}
              className="absolute inset-0 bg-indigo-950/80 backdrop-blur-md"
            />

            {/* Modal Content */}
            <motion.div
              initial={{ y: "100%", opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: "100%", opacity: 0 }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="relative w-full h-[100dvh] md:h-auto md:max-h-[90dvh] md:max-w-xl bg-white md:rounded-3xl shadow-2xl flex flex-col overflow-hidden"
            >
              {/* COMPACT & PRO HEADER */}
              <div className="px-4 pt-10 pb-6 border-b border-slate-100 flex items-start justify-between gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2 mb-1.5">
                    <div className="w-2 h-2 rounded-full bg-indigo-600 animate-pulse" />
                    <span className="text-[10px] font-bold text-indigo-600 uppercase tracking-widest">Hasil Putusan Rapat</span>
                  </div>
                  <h3 className="text-lg md:text-xl font-bold text-slate-900 leading-tight pr-4">
                    {selectedRapat.title}
                  </h3>
                  <div className="flex items-center gap-3 pt-2">
                    <p className="text-[11px] font-bold text-slate-400 flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5 text-indigo-400" /> {selectedRapat.date}
                    </p>
                    <span className={`text-[9px] font-black uppercase px-2 py-0.5 rounded-md border ${selectedRapat.status === 'Final' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' :
                      selectedRapat.status === 'Internal' ? 'bg-amber-50 text-amber-600 border-amber-100' : 'bg-slate-50 text-slate-400 border-slate-100'
                      }`}>
                      {selectedRapat.status}
                    </span>
                  </div>
                </div>
                <button
                  onClick={() => setSelectedRapat(null)}
                  className="p-2 text-slate-400 hover:text-slate-900 hover:bg-slate-100 rounded-full transition-all"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Modal Body - Optimized for Readability */}
              <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-6">
                <div className="space-y-4">
                  <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Deskripsi Umum:</h4>
                  <div className="bg-gradient-to-br from-indigo-50 to-white border border-indigo-100 rounded-2xl p-5 shadow-sm">
                    <p className="text-sm md:text-[15px] font-bold text-indigo-900/80 leading-relaxed whitespace-pre-line">
                      {selectedRapat.fullDesc}
                    </p>
                  </div>
                </div>

                {/* Point Points */}
                <div className="space-y-3">
                  <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Kesepakatan Final:</h4>
                  <div className="grid grid-cols-1 gap-2.5">
                    {selectedRapat.points.map((point, idx) => (
                      <div
                        key={idx}
                        className="flex items-start gap-4 p-4 bg-emerald-50/30 border border-emerald-100/50 rounded-2xl hover:bg-emerald-50/50 transition-colors shadow-sm ring-1 ring-emerald-500/5"
                      >
                        <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                        <p className="text-sm font-bold text-slate-700 leading-snug whitespace-pre-line">{point}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* FORM MODAL */}
      <AnimatePresence>
        {isFormModalOpen && (
          <div className="fixed inset-0 z-[300] flex items-end md:items-center justify-center p-0 md:p-6 h-[100dvh]">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
              onClick={() => setIsFormModalOpen(false)}
            />
            <motion.div
              initial={{ y: "100%", opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: "100%", opacity: 0 }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="relative w-full h-full md:h-auto md:max-w-xl flex flex-col bg-white md:rounded-3xl shadow-2xl overflow-hidden"
            >
              <div className="flex items-center justify-between p-4 border-b border-slate-100 shrink-0">
                <h3 className="font-bold text-slate-900 text-lg">{editingId ? 'Edit Notulensi' : 'Notulensi Baru'}</h3>
                <button
                  onClick={() => setIsFormModalOpen(false)}
                  className="p-2 text-slate-400 hover:text-slate-600 transition-colors rounded-full hover:bg-slate-50"
                  type="button"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleSubmitForm} className="flex-1 flex flex-col min-h-0 relative">
                <div className="flex-1 overflow-y-auto p-4 pb-28 space-y-5">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold tracking-wide text-slate-500 uppercase">Judul Rapat</label>
                    <input
                      type="text"
                      required
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all text-sm font-bold text-slate-900 placeholder:text-slate-400 placeholder:font-medium"
                      placeholder="Contoh: Rapat Teknis Lapangan"
                      value={formData.title}
                      onChange={e => setFormData({ ...formData, title: e.target.value })}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold tracking-wide text-slate-500 uppercase">Tanggal</label>
                      <input
                        type="text"
                        required
                        className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all text-sm font-bold text-slate-900 placeholder:text-slate-400 placeholder:font-medium"
                        placeholder="Contoh: 14 April 2026"
                        value={formData.date}
                        onChange={e => setFormData({ ...formData, date: e.target.value })}
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold tracking-wide text-slate-500 uppercase">Status</label>
                      <select
                        className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all text-sm font-bold text-slate-900 placeholder:text-slate-400 placeholder:font-medium appearance-none"
                        value={formData.status}
                        onChange={e => setFormData({ ...formData, status: e.target.value as "Final" | "Internal" | "Draft" })}
                      >
                        <option value="Final">Final</option>
                        <option value="Internal">Internal</option>
                        <option value="Draft">Draft</option>
                      </select>
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold tracking-wide text-slate-500 uppercase">Deskripsi Umum</label>
                    <textarea
                      ref={e => {
                        if (e) {
                          e.style.height = 'auto';
                          e.style.height = e.scrollHeight + 'px';
                        }
                      }}
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all text-sm font-bold text-slate-900 placeholder:text-slate-400 placeholder:font-medium resize-none overflow-hidden"
                      placeholder="Rapat ini membahas langkah awal..."
                      value={formData.fullDesc}
                      onChange={e => {
                        e.target.style.height = 'auto';
                        e.target.style.height = e.target.scrollHeight + 'px';
                        setFormData({ ...formData, fullDesc: e.target.value })
                      }}
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold tracking-wide text-slate-500 uppercase">Poin Kesepakatan</label>
                    <div className="space-y-2">
                      {formData.points.map((point, idx) => (
                        <div
                          key={idx}
                          draggable
                          onDragStart={() => setDragIndex(idx)}
                          onDragOver={(e) => { e.preventDefault(); setDragOverIndex(idx); }}
                          onDragEnd={() => { setDragIndex(null); setDragOverIndex(null); }}
                          onDrop={(e) => {
                            e.preventDefault();
                            if (dragIndex === null || dragIndex === idx) return;
                            const newPoints = [...formData.points];
                            const [moved] = newPoints.splice(dragIndex, 1);
                            newPoints.splice(idx, 0, moved);
                            setFormData({ ...formData, points: newPoints });
                            setDragIndex(null);
                            setDragOverIndex(null);
                          }}
                          className={`flex items-start gap-2 rounded-xl transition-all ${dragOverIndex === idx && dragIndex !== idx
                            ? 'ring-2 ring-indigo-400 bg-indigo-50/50'
                            : ''
                            } ${dragIndex === idx ? 'opacity-40' : 'opacity-100'
                            }`}
                        >
                          {/* TEXTAREA */}
                          <textarea
                            ref={e => {
                              if (e) {
                                e.style.height = 'auto';
                                e.style.height = e.scrollHeight + 'px';
                              }
                            }}
                            value={point}
                            placeholder={`Poin ${idx + 1}...`}
                            onChange={e => {
                              const val = e.target.value;
                              e.target.style.height = 'auto';
                              e.target.style.height = e.target.scrollHeight + 'px';
                              const newPoints = [...formData.points];
                              newPoints[idx] = val;
                              setFormData({ ...formData, points: newPoints });
                            }}
                            onPaste={e => {
                              const pastedText = e.clipboardData.getData('text');
                              if (pastedText.includes('\n')) {
                                e.preventDefault();
                                const lines = pastedText.split('\n');
                                const cleanedLines = lines
                                  .map(line => line.replace(/^[ \t]*([-*•]|\d+[.)])[ \t]+/, '').trim())
                                  .filter(line => line !== "");

                                if (cleanedLines.length > 0) {
                                  const newPoints = [...formData.points];
                                  newPoints.splice(idx, 1, ...cleanedLines);
                                  setFormData({ ...formData, points: newPoints });
                                }
                              }
                            }}
                            className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all text-sm font-bold text-slate-900 placeholder:text-slate-400 placeholder:font-medium resize-none overflow-hidden"
                          />

                          {/* ACTION GROUP: reorder + delete */}
                          <div className="flex flex-col items-center gap-0.5 shrink-0 pt-1">
                            {/* Up */}
                            <button type="button" onClick={() => swapPoints(idx, idx - 1)} disabled={idx === 0}
                              className="p-1.5 text-slate-400 hover:text-indigo-500 disabled:opacity-20 rounded-lg transition-colors">
                              <ChevronUp className="w-3.5 h-3.5" />
                            </button>
                            {/* Drag (desktop) */}
                            <div className="p-1.5 cursor-grab active:cursor-grabbing text-slate-300 hover:text-slate-500 rounded-lg touch-none hidden sm:flex">
                              <GripVertical className="w-3.5 h-3.5" />
                            </div>
                            {/* Down */}
                            <button type="button" onClick={() => swapPoints(idx, idx + 1)} disabled={idx === formData.points.length - 1}
                              className="p-1.5 text-slate-400 hover:text-indigo-500 disabled:opacity-20 rounded-lg transition-colors">
                              <ChevronDown className="w-3.5 h-3.5" />
                            </button>
                            {/* Delete */}
                            <button
                              type="button"
                              onClick={() => setConfirmDeletePointIdx(idx)}
                              className="p-1.5 text-red-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors mt-0.5"
                              title="Hapus poin ini"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      ))}
                      <p className="text-[10px] text-slate-400 font-medium flex items-center gap-1.5 pt-1 pl-1">
                        <ChevronUp className="w-3 h-3" /><ChevronDown className="w-3 h-3" /> Gunakan panah untuk mengubah urutan
                      </p>
                      <button
                        type="button"
                        onClick={() => {
                          const lastItem = formData.points[formData.points.length - 1];
                          if (lastItem === undefined || lastItem.trim() !== "") {
                            setFormData({ ...formData, points: [...formData.points, ""] })
                          }
                        }}
                        className="w-full py-2.5 border border-dashed border-slate-300 rounded-xl text-slate-500 font-bold text-xs hover:border-indigo-300 hover:text-indigo-600 hover:bg-indigo-50 transition-colors flex items-center justify-center gap-2 mt-2"
                      >
                        <Plus className="w-4 h-4" /> Tambah Poin
                      </button>
                    </div>
                  </div>
                </div>

                {/* FLOATING SUBMIT BUTTON */}
                <div className="absolute bottom-0 left-0 right-0 p-4 pt-10 pointer-events-none z-10 bg-gradient-to-t from-white via-white/80 to-transparent">
                  <button
                    type="submit"
                    className="w-full pointer-events-auto bg-indigo-600 text-white py-3.5 rounded-xl font-bold flex items-center justify-center gap-2 shadow-xl shadow-indigo-600/30 ring-1 ring-white/20 active:scale-95 transition-all text-sm"
                  >
                    Simpan Putusan
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* STICKY BOTTOM ACTION */}
      {isAdmin && (
        <div className="fixed bottom-6 left-0 right-0 px-6 z-50 md:relative md:bottom-0 md:px-2 md:mt-8">
          <button
            onClick={handleOpenNew}
            className="w-full py-4 bg-gradient-to-r from-indigo-600 to-indigo-700 text-white rounded-2xl font-bold text-sm shadow-2xl shadow-indigo-600/40 hover:shadow-indigo-600/60 active:scale-[0.98] transition-all flex items-center justify-center gap-2.5 ring-1 ring-white/10"
          >
            <div className="w-8 h-8 rounded-xl bg-white/20 flex items-center justify-center">
              <Plus className="w-5 h-5 text-white" />
            </div>
            Buat Notulensi Baru
          </button>
        </div>
      )}

      <div className="h-20 md:hidden" /> {/* Spacer for sticky button on mobile */}
      {/* CONFIRM: Hapus Notulensi */}
      <ConfirmDialog
        isOpen={confirmDeleteRapat !== null}
        title="Hapus Notulensi Rapat"
        message="Data notulensi ini akan dihapus permanen dan tidak dapat dikembalikan. Lanjutkan?"
        onConfirm={async () => {
          if (confirmDeleteRapat) await removeRapat({ id: confirmDeleteRapat });
          setConfirmDeleteRapat(null);
        }}
        onCancel={() => setConfirmDeleteRapat(null)}
      />

      {/* CONFIRM: Hapus Poin */}
      <ConfirmDialog
        isOpen={confirmDeletePointIdx !== null}
        title="Hapus Poin Kesepakatan"
        message="Poin ini akan dihapus dari daftar kesepakatan rapat. Lanjutkan?"
        onConfirm={() => {
          if (confirmDeletePointIdx === null) return;
          const newPoints = [...formData.points];
          newPoints.splice(confirmDeletePointIdx, 1);
          setFormData({ ...formData, points: newPoints });
          setConfirmDeletePointIdx(null);
        }}
        onCancel={() => setConfirmDeletePointIdx(null)}
      />
    </div>
  );
}
