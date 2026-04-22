"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useMutation, useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import {
  Plus, Upload, Trash2, Image as ImageIcon,
  Video as VideoIcon, Loader2, X, Check, Calendar, Type,
  ChevronRight, BookOpen, Layers, Edit2, ExternalLink, AlertCircle,
  CheckCircle2, Link as LinkIcon, Play, Info
} from "lucide-react";
import { getPresignedUploadUrl, deleteFromR2 } from "@/app/actions/storage";
import { cn } from "@/lib/utils";
import ConfirmDialog from "@/components/ui/ConfirmDialog";

export default function AdminGaleri() {
  const [activeTab, setActiveTab] = useState<"items" | "albums">("items");

  const galeriItems = useQuery(api.galeri.getItems, {});
  const albums = useQuery(api.galeri.getAlbumMetadata);
  const addItem = useMutation(api.galeri.addItem);
  const deleteItem = useMutation(api.galeri.deleteItem);
  const updateItem = useMutation(api.galeri.updateItem);
  const updateAlbum = useMutation(api.galeri.updateAlbumMetadata);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isAlbumModalOpen, setIsAlbumModalOpen] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [showSuccess, setShowSuccess] = useState(false);

  // ── ITEM FORM STATE ──
  const [editingItemId, setEditingItemId] = useState<any>(null);
  const [uploadMode, setUploadMode] = useState<"file" | "youtube">("file");
  const [file, setFile] = useState<File | null>(null);
  const [youtubeUrl, setYoutubeUrl] = useState("");
  const [caption, setCaption] = useState("");
  const [itemYear, setItemYear] = useState("2024");

  // ── ALBUM FORM STATE ──
  const [albumYear, setAlbumYear] = useState("2024");
  const [albumTitle, setAlbumTitle] = useState("");
  const [albumSubtitle, setAlbumSubtitle] = useState("");
  const [albumDesc, setAlbumDesc] = useState("");
  const [albumCoverFile, setAlbumCoverFile] = useState<File | null>(null);
  const [albumCoverPreview, setAlbumCoverPreview] = useState<string | null>(null);
  const [currentAlbumCover, setCurrentAlbumCover] = useState<string | null>(null);

  // ── DELETE CONFIRMATION STATE ──
  const [confirmDeleteItem, setConfirmDeleteItem] = useState<{ id: any, key: string } | null>(null);

  // Preview logic for cover image
  useEffect(() => {
    if (!albumCoverFile) {
      setAlbumCoverPreview(null);
      return;
    }
    const objectUrl = URL.createObjectURL(albumCoverFile);
    setAlbumCoverPreview(objectUrl);
    return () => URL.revokeObjectURL(objectUrl);
  }, [albumCoverFile]);

  const handleSaveItem = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsUploading(true);

    try {
      if (editingItemId) {
        await updateItem({ id: editingItemId, caption, year: itemYear });
      } else {
        if (uploadMode === "youtube") {
          if (!youtubeUrl) throw new Error("Link YouTube wajib diisi");
          await addItem({ caption, url: youtubeUrl, storageKey: "", type: "video", year: itemYear });
        } else {
          if (!file) throw new Error("File wajib dipilih");
          const type = file.type.startsWith("video/") ? "video" : "image";
          const res = await getPresignedUploadUrl(file.name, file.type, type === "video" ? "videos" : "photos");
          if (!res.success || !res.url || !res.key) throw new Error(res.error);

          const xhr = new XMLHttpRequest();
          xhr.open("PUT", res.url, true);
          xhr.setRequestHeader("Content-Type", file.type);
          xhr.upload.onprogress = (event) => {
            if (event.lengthComputable) setUploadProgress(Math.round((event.loaded / event.total) * 100));
          };

          const uploadPromise = new Promise((res, rej) => {
            xhr.onload = () => xhr.status === 200 ? res(true) : rej("Upload failed");
            xhr.onerror = () => rej("Network error");
          });
          xhr.send(file);
          await uploadPromise;

          await addItem({ caption, url: `/api/media/${res.key}`, storageKey: res.key, type, year: itemYear });
        }
      }

      setIsModalOpen(false);
      setFile(null);
      setYoutubeUrl("");
      setCaption("");
      setEditingItemId(null);
      setIsUploading(false);
      setShowSuccess(true);
    } catch (error) {
      console.error(error);
      alert("Error: " + error);
      setIsUploading(false);
    }
  };

  const handleUpdateAlbum = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsUploading(true);

    try {
      let coverUrl: string | undefined = undefined;
      let coverKey: string | undefined = undefined;

      if (albumCoverFile) {
        const res = await getPresignedUploadUrl(albumCoverFile.name, albumCoverFile.type, "album-covers");
        if (!res.success || !res.url || !res.key) throw new Error(res.error);

        const uploadRes = await fetch(res.url, {
          method: "PUT",
          body: albumCoverFile,
          headers: { "Content-Type": albumCoverFile.type }
        });

        if (!uploadRes.ok) throw new Error("Gagal mengupload cover");

        coverUrl = `/api/media/${res.key}`;
        coverKey = res.key;
      }

      await updateAlbum({
        year: albumYear,
        title: albumTitle,
        subtitle: albumSubtitle,
        description: albumDesc,
        coverUrl,
        coverStorageKey: coverKey
      });

      setIsUploading(false);
      setAlbumCoverFile(null);
      setShowSuccess(true);
    } catch (error) {
      console.error(error);
      alert("Error: " + error);
      setIsUploading(false);
    }
  };

  const openEditItem = (item: any) => {
    setEditingItemId(item._id);
    setCaption(item.caption || "");
    setItemYear(item.year);
    setIsModalOpen(true);
  };

  const openNewItem = () => {
    setEditingItemId(null);
    setCaption("");
    setItemYear("2024");
    setFile(null);
    setYoutubeUrl("");
    setIsModalOpen(true);
  };

  const openEditAlbum = (album: any) => {
    setAlbumYear(album.year);
    setAlbumTitle(album.title);
    setAlbumSubtitle(album.subtitle);
    setAlbumDesc(album.description);
    setCurrentAlbumCover(album.coverUrl || null);
    setIsAlbumModalOpen(true);
  };

  const openNewAlbum = () => {
    setAlbumYear("2024");
    setAlbumTitle("");
    setAlbumSubtitle("");
    setAlbumDesc("");
    setCurrentAlbumCover(null);
    setIsAlbumModalOpen(true);
  };

  const handleCloseSuccess = () => {
    setShowSuccess(false);
    setIsAlbumModalOpen(false);
    setIsModalOpen(false);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const isYoutube = (url: string) => url.includes("youtube.com") || url.includes("youtu.be");
  const getYoutubeThumb = (url: string) => {
    const id = url.split("v=")[1]?.split("&")[0] || url.split("youtu.be/")[1]?.split("?")[0];
    return id ? `https://img.youtube.com/vi/${id}/mqdefault.jpg` : null;
  };

  const YoutubeIcon = ({ className }: { className?: string }) => (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} xmlns="http://www.w3.org/2000/svg">
      <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505a3.017 3.017 0 0 0-2.122 2.136C0 8.055 0 12 0 12s0 3.945.501 5.814a3.017 3.017 0 0 0 2.122 2.136c1.871.505 9.377.505 9.377.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.945 24 12 24 12s0-3.945-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
    </svg>
  );

  return (
    <div className="space-y-6 md:space-y-8 max-w-6xl pb-32">

      {/* ── PREMIUM HERO HEADER ── */}
      <div className="relative p-6 md:p-12 bg-slate-950 rounded-b-[1.5rem] md:rounded-b-[2.5rem] overflow-hidden shadow-2xl">
        <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-600/20 blur-[100px] -mr-20 -mt-20 rounded-full" />
        <div className="absolute bottom-0 left-0 w-40 h-40 bg-emerald-500/10 blur-[80px] -ml-10 -mb-10 rounded-full" />

        <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-indigo-500/10 rounded-full border border-indigo-500/20">
              <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 animate-pulse" />
              <span className="text-[10px] font-bold text-indigo-300 uppercase tracking-[0.2em]">Admin Galeri</span>
            </div>
            <h2 className="text-3xl md:text-5xl font-black tracking-tight text-white leading-[1.1]">
              Koleksi <span className="text-indigo-400">Momen</span>
            </h2>
            <p className="text-slate-400 font-medium text-sm md:text-base max-w-md">
              Kelola momen & cerita kurban Al Ukhuwah.
            </p>
          </div>

          <div className="flex items-center gap-4 pt-4 md:pt-0 border-t md:border-t-0 border-white/5 w-full md:w-auto">
            <div className="flex flex-col text-center md:text-left">
              <span className="text-[9px] font-bold text-slate-500 uppercase tracking-widest leading-none mb-1">Items</span>
              <p className="text-xl font-bold text-slate-300">{galeriItems?.length || 0}</p>
            </div>
            <div className="w-px h-8 bg-white/10" />
            <div className="flex flex-col text-center md:text-left">
              <span className="text-[9px] font-bold text-slate-500 uppercase tracking-widest leading-none mb-1">Album</span>
              <p className="text-xl font-bold text-slate-300">{[...new Set(galeriItems?.map(i => i.year))].length || 0}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="flex justify-center px-4">
        <div className="flex bg-white p-1.5 rounded-2xl border border-slate-200 shadow-sm w-full md:w-auto">
          <button onClick={() => setActiveTab("items")} className={cn("flex-1 md:flex-none px-6 py-2.5 rounded-xl text-[11px] font-bold uppercase tracking-widest transition-all flex items-center justify-center gap-2", activeTab === "items" ? "bg-indigo-600 text-white shadow-lg shadow-indigo-600/20" : "text-slate-500 hover:bg-slate-50")}><Layers size={14} /> Media</button>
          <button onClick={() => setActiveTab("albums")} className={cn("flex-1 md:flex-none px-6 py-2.5 rounded-xl text-[11px] font-bold uppercase tracking-widest transition-all flex items-center justify-center gap-2", activeTab === "albums" ? "bg-indigo-600 text-white shadow-lg shadow-indigo-600/20" : "text-slate-500 hover:bg-slate-50")}><BookOpen size={14} /> Album</button>
        </div>
      </div>

      <div className="px-4 md:px-2">
        {activeTab === "items" ? (
          <section className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2"><div className="w-1.5 h-4 bg-indigo-600 rounded-full" /><h3 className="text-[11px] font-bold text-slate-500 uppercase tracking-[0.2em] whitespace-nowrap">Media</h3></div>
              <button onClick={openNewItem} className="flex items-center gap-1.5 px-4 py-2 bg-indigo-600 text-white rounded-xl text-[11px] font-bold uppercase tracking-widest hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-600/10 active:scale-95 whitespace-nowrap"><Plus size={14} /> Tambah</button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {galeriItems?.map((item) => (
                <motion.div
                  key={item._id}
                  initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                  className="group bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-md hover:border-indigo-300 transition-all cursor-pointer"
                  onClick={() => openEditItem(item)}
                >
                  <div className="aspect-video relative overflow-hidden bg-slate-50 pointer-events-none">
                    {isYoutube(item.url) ? (
                      <div className="w-full h-full relative">
                        <img src={getYoutubeThumb(item.url) || ""} className="w-full h-full object-cover" />
                        <div className="absolute inset-0 flex items-center justify-center bg-black/20"><YoutubeIcon className="w-12 h-12 text-red-600" /></div>
                      </div>
                    ) : item.type === "video" ? (
                      <div className="w-full h-full flex items-center justify-center bg-slate-900"><video src={item.url} className="w-full h-full object-cover opacity-50" /><VideoIcon className="absolute text-white/50" size={32} /></div>
                    ) : (
                      <img src={item.url} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                    )}
                    <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-lg text-[9px] font-black tracking-widest text-indigo-600 border border-indigo-100 uppercase">{item.year}</div>
                    <div className="absolute top-3 right-3 text-white opacity-0 group-hover:opacity-100 transition-opacity bg-black/50 p-2 rounded-full backdrop-blur-md">
                      <Edit2 size={12} />
                    </div>
                  </div>
                  <div className="p-4 flex items-center justify-between gap-4">
                    <p className="text-slate-700 font-bold text-xs truncate flex-1">{item.caption || "Tanpa Keterangan"}</p>
                    <button
                      onClick={(e) => { e.stopPropagation(); setConfirmDeleteItem({ id: item._id, key: item.storageKey }); }}
                      className="p-1.5 text-slate-400 hover:text-red-500 transition-colors shrink-0"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>
          </section>
        ) : (
          <section className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2"><div className="w-1.5 h-4 bg-emerald-500 rounded-full" /><h3 className="text-[11px] font-bold text-slate-500 uppercase tracking-[0.2em] whitespace-nowrap">Narasi Album</h3></div>
              <button onClick={openNewAlbum} className="flex items-center gap-1.5 px-4 py-2 bg-white border border-emerald-500 text-emerald-600 rounded-xl text-[11px] font-bold uppercase tracking-widest hover:bg-emerald-50 transition-all active:scale-95 whitespace-nowrap"><Plus size={14} /> Setup</button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {albums?.map((album) => (
                <div key={album._id} onClick={() => openEditAlbum(album)} className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm flex flex-col md:flex-row hover:border-indigo-300 hover:shadow-lg transition-all group text-left cursor-pointer">
                  <div className="w-full md:w-32 h-32 md:h-auto relative bg-slate-50 shrink-0 border-b md:border-b-0 md:border-r border-slate-100 overflow-hidden pointer-events-none">
                    {album.coverUrl ? (<img src={album.coverUrl} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />) : (<div className="w-full h-full flex items-center justify-center text-slate-200"><ImageIcon size={32} /></div>)}
                    <div className="absolute top-2 left-2 bg-indigo-600 text-white px-2 py-0.5 rounded text-[9px] font-black">{album.year}</div>
                  </div>
                  <div className="p-4 flex-1 min-w-0 flex flex-col justify-center relative pointer-events-none">
                    <div className="absolute top-4 right-4 text-slate-300 group-hover:text-indigo-400 transition-colors"><Edit2 size={16} /></div>
                    <div>
                      <h4 className="font-bold text-slate-900 text-sm truncate pr-6">{album.title}</h4>
                      <p className="text-indigo-600 font-bold text-[10px] uppercase tracking-widest mt-0.5">{album.subtitle}</p>
                      <p className="text-slate-500 text-[11px] line-clamp-2 mt-2 leading-relaxed">{album.description}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}
      </div>

      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-[300] flex items-end md:items-center justify-center p-0 md:p-6 h-[100dvh]">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIsModalOpen(false)} className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" />
            <motion.div initial={{ y: "100%", opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: "100%", opacity: 0 }} className="relative w-full h-full md:h-auto md:max-w-md flex flex-col bg-white md:rounded-3xl shadow-2xl overflow-hidden">
              <div className="flex items-center justify-between p-4 border-b border-slate-100 shrink-0"><h3 className="font-bold text-slate-900 text-lg">{editingItemId ? "Edit Media" : "Tambah Media"}</h3><button onClick={() => setIsModalOpen(false)} className="p-2 text-slate-400 hover:text-slate-600 transition-colors rounded-full hover:bg-slate-50"><X size={20} /></button></div>
              <form onSubmit={handleSaveItem} className="flex-1 flex flex-col min-h-0 relative">
                <div className="flex-1 overflow-y-auto p-4 pb-28 space-y-5">
                  {!editingItemId && (
                    <div className="flex bg-slate-50 p-1 rounded-xl border border-slate-200">
                      <button type="button" onClick={() => setUploadMode("file")} className={cn("flex-1 py-2 text-[10px] font-bold uppercase tracking-widest rounded-lg transition-all flex items-center justify-center gap-2", uploadMode === "file" ? "bg-white text-indigo-600 shadow-sm" : "text-slate-500")}><Upload size={14} /> File</button>
                      <button type="button" onClick={() => setUploadMode("youtube")} className={cn("flex-1 py-2 text-[10px] font-bold uppercase tracking-widest rounded-lg transition-all flex items-center justify-center gap-2", uploadMode === "youtube" ? "bg-white text-red-600 shadow-sm" : "text-slate-500")}><YoutubeIcon className="w-4 h-4" /> YouTube</button>
                    </div>
                  )}

                  {!editingItemId && uploadMode === "file" && (
                    <div className={cn("relative border-2 border-dashed rounded-2xl p-8 text-center transition-all", file ? "bg-emerald-50 border-emerald-500" : "border-slate-200")}>
                      <input type="file" required className="absolute inset-0 opacity-0 cursor-pointer" onChange={(e) => setFile(e.target.files?.[0] || null)} />
                      <div className={cn("w-12 h-12 rounded-2xl flex items-center justify-center mx-auto mb-3", file ? "bg-emerald-500 text-white" : "bg-indigo-50 text-indigo-600")}><Upload size={24} /></div>
                      <p className="text-xs font-bold text-slate-700">{file ? file.name : "Ketuk untuk pilih file"}</p>
                    </div>
                  )}

                  {!editingItemId && uploadMode === "youtube" && (
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold tracking-wide text-slate-500 uppercase">Link Video YouTube</label>
                      <div className="relative">
                        <LinkIcon size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                        <input type="url" placeholder="https://youtube.com/watch?v=..." value={youtubeUrl} onChange={(e) => setYoutubeUrl(e.target.value)} required className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none text-sm font-bold text-slate-900" />
                      </div>
                    </div>
                  )}

                  {editingItemId && (
                    <div className="p-4 bg-indigo-50 border border-indigo-100 rounded-xl flex items-center gap-3">
                      <Info size={16} className="text-indigo-600 shrink-0" />
                      <p className="text-[11px] font-bold text-indigo-700 leading-tight">File media tidak bisa diubah setelah diupload. Kamu hanya bisa mengubah Caption dan Tahun kegiatan.</p>
                    </div>
                  )}

                  <div className="space-y-1.5"><label className="text-xs font-bold tracking-wide text-slate-500 uppercase">Caption Media</label><input type="text" placeholder="Contoh: Proses penyembelihan sapi kelompok 1" value={caption} onChange={(e) => setCaption(e.target.value)} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none text-sm font-bold text-slate-900" /></div>
                  <div className="space-y-1.5"><label className="text-xs font-bold tracking-wide text-slate-500 uppercase">Tahun Kegiatan</label><select value={itemYear} onChange={(e) => setItemYear(e.target.value)} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none text-sm font-bold text-slate-900"><option value="2025">Tahun 2025</option><option value="2024">Tahun 2024</option></select></div>
                </div>
                <div className="absolute bottom-0 left-0 right-0 p-4 pt-10 pointer-events-none z-10 bg-gradient-to-t from-white via-white/80 to-transparent"><button type="submit" disabled={isUploading || (!editingItemId && uploadMode === 'file' && !file) || (!editingItemId && uploadMode === 'youtube' && !youtubeUrl)} className="w-full pointer-events-auto bg-indigo-600 text-white py-3.5 rounded-xl font-bold hover:bg-indigo-700 active:scale-95 transition-all text-sm shadow-xl shadow-indigo-600/30">{isUploading ? "Memproses..." : "Konfirmasi & Simpan"}</button></div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isAlbumModalOpen && (
          <div className="fixed inset-0 z-[300] flex items-end md:items-center justify-center p-0 md:p-6 h-[100dvh]">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIsAlbumModalOpen(false)} className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" />
            <motion.div initial={{ y: "100%", opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: "100%", opacity: 0 }} className="relative w-full h-full md:h-auto md:max-w-md flex flex-col bg-white md:rounded-3xl shadow-2xl overflow-hidden">
              <div className="flex items-center justify-between p-4 border-b border-slate-100 shrink-0"><h3 className="font-bold text-slate-900 text-lg">Setup Album</h3><button onClick={() => setIsAlbumModalOpen(false)} className="p-2 text-slate-400 hover:text-slate-600 transition-colors rounded-full hover:bg-slate-50"><X size={20} /></button></div>
              <form onSubmit={handleUpdateAlbum} className="flex-1 flex flex-col min-h-0 relative">
                <div className="flex-1 overflow-y-auto p-4 pb-28 space-y-5">
                  {(albumCoverPreview || currentAlbumCover) && (<div className="relative w-full aspect-video rounded-2xl overflow-hidden bg-slate-100 border border-slate-200"><img src={albumCoverPreview || currentAlbumCover || ""} className="w-full h-full object-cover" alt="Preview" /><div className="absolute top-2 right-2 bg-black/50 text-white px-2 py-1 rounded-md text-[10px] font-bold uppercase">Preview Cover</div></div>)}
                  <div className="grid grid-cols-2 gap-4"><div className="space-y-1.5"><label className="text-xs font-bold tracking-wide text-slate-500 uppercase">Tahun</label><select value={albumYear} onChange={(e) => setAlbumYear(e.target.value)} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none text-sm font-bold text-slate-900"><option value="2025">2025</option><option value="2024">2024</option></select></div><div className="space-y-1.5"><label className="text-xs font-bold tracking-wide text-slate-500 uppercase">Judul Utama</label><input type="text" value={albumTitle} onChange={(e) => setAlbumTitle(e.target.value)} required className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none text-sm font-bold text-slate-900" placeholder="Idul Adha 1445 H" /></div></div>
                  <div className="space-y-1.5"><label className="text-xs font-bold tracking-wide text-slate-500 uppercase">Subtitle / Tema</label><input type="text" value={albumSubtitle} onChange={(e) => setAlbumSubtitle(e.target.value)} required className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none text-sm font-bold text-slate-900" placeholder="Kurban Sinergi & Kebersamaan" /></div>
                  <div className="space-y-1.5"><label className="text-xs font-bold tracking-wide text-slate-500 uppercase">Deskripsi Cerita</label><textarea value={albumDesc} onChange={(e) => setAlbumDesc(e.target.value)} rows={4} required className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none text-sm font-bold text-slate-900 leading-relaxed" placeholder="Tuliskan pengalaman atau cerita menarik pelaksanaan kurban tahun ini..." /></div>
                  <div className="space-y-1.5"><label className="text-xs font-bold tracking-wide text-slate-500 uppercase">{currentAlbumCover ? "Ganti Cover Album" : "Upload Cover Album"}</label><div className={cn("relative border-2 border-dashed rounded-xl p-4 text-center transition-all", albumCoverFile ? "bg-emerald-50 border-emerald-500" : "border-slate-200 hover:border-indigo-500")}><input type="file" className="absolute inset-0 opacity-0 cursor-pointer" onChange={(e) => setAlbumCoverFile(e.target.files?.[0] || null)} /><p className="text-[11px] font-bold text-slate-500">{albumCoverFile ? albumCoverFile.name : "Ketuk untuk pilih foto cover"}</p></div></div>
                </div>
                <div className="absolute bottom-0 left-0 right-0 p-4 pt-10 pointer-events-none z-10 bg-gradient-to-t from-white via-white/80 to-transparent"><button type="submit" disabled={isUploading} className="w-full pointer-events-auto bg-indigo-600 text-white py-3.5 rounded-xl font-bold hover:bg-indigo-700 active:scale-95 transition-all text-sm shadow-xl shadow-indigo-600/30">{isUploading ? "Sedang Menyimpan..." : "Simpan Album"}</button></div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <AnimatePresence>{showSuccess && (<div className="fixed inset-0 z-[500] flex items-center justify-center p-6"><motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 bg-slate-950/40 backdrop-blur-md" /><motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }} className="relative bg-white p-8 rounded-[2rem] shadow-2xl max-w-sm w-full text-center space-y-6 border border-slate-100"><div className="w-20 h-20 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-inner"><CheckCircle2 size={48} strokeWidth={2.5} /></div><div className="space-y-2"><h3 className="text-xl font-black text-slate-900 tracking-tight">Berhasil Disimpan!</h3><p className="text-slate-500 font-medium text-sm leading-relaxed px-4">Data media telah diperbarui dan kini tampil di halaman publik.</p></div><button onClick={handleCloseSuccess} className="w-full py-4 bg-slate-900 text-white rounded-2xl font-bold text-sm hover:bg-slate-800 active:scale-95 transition-all shadow-xl shadow-slate-900/20">Selesai</button></motion.div></div>)}</AnimatePresence>
      <ConfirmDialog isOpen={confirmDeleteItem !== null} title="Hapus Dokumentasi" message="File ini akan dihapus permanen. Lanjutkan?" onConfirm={async () => { if (confirmDeleteItem) { if (confirmDeleteItem.key) await deleteFromR2(confirmDeleteItem.key); await deleteItem({ id: confirmDeleteItem.id }); } setConfirmDeleteItem(null); }} onCancel={() => setConfirmDeleteItem(null)} />
    </div>
  );
}
