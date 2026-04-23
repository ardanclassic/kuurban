"use client";

import { useState, useMemo, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import {
  ArrowLeft, X, Play, Image as ImageIcon,
  Video as VideoIcon, Calendar, ChevronRight,
  Clapperboard
} from "lucide-react";
import { cn } from "@/lib/utils";

export default function GaleriPublic() {
  const allItems = useQuery(api.galeri.getItems, {});
  const albumMetadata = useQuery(api.galeri.getAlbumMetadata);

  const [activeYear, setActiveYear] = useState<string | null>(null);
  const [selectedMedia, setSelectedMedia] = useState<any>(null);

  // Adaptive Header State
  const [isScrolled, setIsScrolled] = useState(false);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const handleScroll = () => {
    if (scrollContainerRef.current) {
      const scrollY = scrollContainerRef.current.scrollTop;
      setIsScrolled(scrollY > 100);
    }
  };

  const getProxiedUrl = (url: string | undefined) => {
    if (!url) return "";
    if (url.includes("youtube.com") || url.includes("youtu.be")) return url;
    if (url.includes(".r2.dev")) {
      const parts = url.split(".r2.dev/");
      if (parts.length > 1) return `/api/media/${parts[1]}`;
    }
    return url;
  };

  const isYoutube = (url: string) => url.includes("youtube.com") || url.includes("youtu.be");

  const getYoutubeId = (url: string) => {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : null;
  };

  const getYoutubeThumb = (url: string) => {
    const id = getYoutubeId(url);
    return id ? `https://img.youtube.com/vi/${id}/maxresdefault.jpg` : null;
  };

  const YoutubeIcon = ({ className }: { className?: string }) => (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} xmlns="http://www.w3.org/2000/svg">
      <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505a3.017 3.017 0 0 0-2.122 2.136C0 8.055 0 12 0 12s0 3.945.501 5.814a3.017 3.017 0 0 0 2.122 2.136c1.871.505 9.377.505 9.377.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.945 24 12 24 12s0-3.945-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
    </svg>
  );

  // Group items by year
  const galleryStats = useMemo(() => {
    if (!allItems) return {};
    const stats: Record<string, { photos: number; videos: number; items: any[] }> = {};
    allItems.forEach(item => {
      if (!stats[item.year]) {
        stats[item.year] = { photos: 0, videos: 0, items: [] };
      }
      if (item.type === "image") stats[item.year].photos++;
      else stats[item.year].videos++;
      stats[item.year].items.push(item);
    });
    return stats;
  }, [allItems]);

  const displayAlbums = useMemo(() => {
    const yearsWithContent = Object.keys(galleryStats);
    const yearsWithMetadata = albumMetadata?.map(m => m.year) || [];
    const allYears = Array.from(new Set([...yearsWithContent, ...yearsWithMetadata])).sort((a, b) => b.localeCompare(a));

    return allYears.map(year => {
      const meta = albumMetadata?.find(m => m.year === year);
      const stats = galleryStats[year] || { photos: 0, videos: 0, items: [] };

      return {
        year,
        title: meta?.title || `Kurban ${year}`,
        subtitle: meta?.subtitle || "Dokumentasi Kegiatan",
        description: meta?.description || "Koleksi foto dan video pelaksanaan kurban tahun ini.",
        coverUrl: getProxiedUrl(meta?.coverUrl) || "https://images.unsplash.com/photo-1511017049469-e0d1ba0219a6?q=80&w=2070&auto=format&fit=crop",
        stats
      };
    });
  }, [galleryStats, albumMetadata]);

  const currentAlbum = displayAlbums.find(a => a.year === activeYear);

  return (
    <div className="space-y-16 py-10 pb-32">
      {/* ── HEADER ── */}
      <div className="text-center space-y-5 max-w-2xl mx-auto">
        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-indigo-50 border border-indigo-100 text-indigo-600">
          <Clapperboard size={14} className="animate-pulse" />
          <span className="text-[10px] font-bold uppercase tracking-[0.2em]">Arsip & Dokumentasi</span>
        </motion.div>
        <h1 className="text-4xl md:text-6xl font-black text-slate-900 tracking-tight leading-tight ">
          Galeri <span className="text-indigo-600">Kurban</span>
        </h1>
        <p className="text-slate-500 font-medium text-base md:text-lg max-w-xl mx-auto leading-relaxed">
          Menapak tilas perjalanan ibadah kurban dari tahun ke tahun. Setiap foto menyimpan cerita, setiap video merekam keberkahan.
        </p>
      </div>

      {/* ── ALBUM LIST GRID ── */}
      <div className="max-w-7xl mx-auto md:px-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {displayAlbums.map((album, i) => (
            <motion.button
              key={album.year}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              onClick={() => setActiveYear(album.year)}
              className="group relative aspect-[3/4] rounded-3xl overflow-hidden bg-slate-900 shadow-xl hover:shadow-2xl transition-all duration-500 text-left"
            >
              <img src={album.coverUrl} alt={album.year} className="absolute inset-0 w-full h-full object-cover opacity-80 group-hover:scale-110 group-hover:opacity-100 transition-all duration-1000" />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-900/30 to-transparent opacity-90 group-hover:opacity-100 transition-opacity" />
              <div className="absolute inset-0 p-8 flex flex-col justify-between">
                <div className="flex justify-between items-start">
                  <div className="flex gap-2">
                    <div className="bg-black/20 backdrop-blur-md px-3 py-1.5 rounded-full text-[9px] font-bold text-white border border-white/10 flex items-center gap-1.5"><ImageIcon size={10} /> {album.stats.photos}</div>
                    <div className="bg-black/20 backdrop-blur-md px-3 py-1.5 rounded-full text-[9px] font-bold text-white border border-white/10 flex items-center gap-1.5"><VideoIcon size={10} /> {album.stats.videos}</div>
                  </div>
                  <div className="w-10 h-10 rounded-full bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center text-white opacity-0 group-hover:opacity-100 translate-x-4 group-hover:translate-x-0 transition-all"><ChevronRight size={20} /></div>
                </div>
                <div className="space-y-1.5 translate-y-2 group-hover:translate-y-0 transition-transform duration-500">
                  <div className="bg-indigo-600/30 backdrop-blur-sm border border-indigo-500/30 w-fit px-2.5 py-1 rounded-lg text-[8px] font-bold text-indigo-200 uppercase tracking-[0.2em] mb-1">Arsip {album.year}</div>
                  <h3 className="text-xl md:text-2xl font-bold text-white uppercase tracking-tight leading-tight">{album.title}</h3>
                  <p className="text-slate-300 font-bold text-[10px] uppercase tracking-[0.15em] opacity-80 group-hover:opacity-100 transition-opacity line-clamp-2">{album.subtitle}</p>
                </div>
              </div>
            </motion.button>
          ))}
        </div>
      </div>

      {/* ── ALBUM CONTENT POPUP (MODAL) ── */}
      <AnimatePresence>
        {activeYear && currentAlbum && (
          <div className="fixed inset-0 z-[150] flex items-center justify-center h-[100dvh]">
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setActiveYear(null)}
              className="absolute inset-0 bg-slate-950/80 backdrop-blur-xl"
            />

            <motion.div
              initial={{ y: "100%", opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: "100%", opacity: 0 }}
              transition={{ type: "spring", damping: 30, stiffness: 300 }}
              className="relative w-full h-full bg-white flex flex-col z-10 overflow-hidden"
            >
              {/* SMART ADAPTIVE HEADER */}
              <div className={cn(
                "flex justify-between items-center px-6 md:px-12 py-5 absolute top-0 left-0 right-0 z-30 transition-all duration-500",
                isScrolled ? "bg-white/80 backdrop-blur-xl border-b border-slate-100 shadow-sm" : "bg-transparent"
              )}>
                <button onClick={() => setActiveYear(null)} className="flex items-center gap-2 font-bold uppercase text-xs tracking-[0.2em] group">
                  <div className={cn(
                    "w-10 h-10 rounded-full flex items-center justify-center transition-all group-hover:-translate-x-1",
                    isScrolled ? "bg-slate-100 text-slate-900" : "bg-white/10 backdrop-blur-md border border-white/20 text-white shadow-xl"
                  )}>
                    <ArrowLeft size={20} />
                  </div>
                  <span className={cn(
                    "hidden md:inline transition-colors",
                    isScrolled ? "text-slate-900" : "text-white drop-shadow-lg"
                  )}>Kembali</span>
                </button>

                <div className="flex flex-col items-center">
                  <h2 className={cn(
                    "text-[10px] font-black uppercase tracking-[0.4em] transition-colors",
                    isScrolled ? "text-indigo-600" : "text-white/60 drop-shadow-lg"
                  )}>Arsip {activeYear}</h2>
                  {isScrolled && (
                    <h3 className="text-[11px] font-bold text-slate-900 truncate max-w-[200px] mt-0.5">{currentAlbum.title}</h3>
                  )}
                </div>

                <button onClick={() => setActiveYear(null)} className={cn(
                  "p-2.5 rounded-full transition-all",
                  isScrolled ? "hover:bg-slate-100 text-slate-900" : "bg-white/10 backdrop-blur-md border border-white/20 text-white hover:bg-white/20 shadow-xl"
                )}>
                  <X size={24} />
                </button>
              </div>

              {/* Scrollable Content */}
              <div
                ref={scrollContainerRef}
                onScroll={handleScroll}
                className="flex-1 overflow-y-auto relative z-10 scroll-smooth"
              >

                {/* HERO SECTION */}
                <div className="relative h-[65vh] md:h-[75vh] w-full overflow-hidden">
                  <img src={currentAlbum.coverUrl} className="w-full h-full object-cover" alt={currentAlbum.title} />

                  {/* HERO OVERLAYS */}
                  <div className="absolute inset-0 bg-slate-950/40" /> {/* Dimmer */}
                  <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-white" /> {/* Blend */}

                  {/* OVERLAP CONTENT */}
                  <div className="absolute bottom-0 left-0 right-0 px-6 md:px-12 pb-16 md:pb-24">
                    <div className="max-w-7xl mx-auto space-y-4 md:space-y-6">
                      <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }} className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-indigo-600 text-white text-[10px] font-bold uppercase tracking-[0.2em] shadow-lg shadow-indigo-600/20">
                        Dokumentasi {activeYear}
                      </motion.div>
                      <div className="space-y-2">
                        <motion.h2 initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="text-3xl md:text-9xl font-black text-white leading-[0.85] tracking-tighter drop-shadow-2xl mb-6">
                          {currentAlbum.title}
                        </motion.h2>
                        <motion.h3 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="text-xl md:text-5xl font-bold text-indigo-100 italic drop-shadow-[0_4px_12px_rgba(0,0,0,0.5)] leading-tight">
                          "{currentAlbum.subtitle}"
                        </motion.h3>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="max-w-7xl mx-auto px-3 md:px-12 space-y-24 pb-40 pt-12">
                  {/* Description Section */}
                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                    <div className="lg:col-span-12">
                      <p className="text-slate-500 font-medium text-lg md:text-2xl leading-relaxed border-l-8 border-indigo-500/10 pl-3 md:pl-12 italic max-w-5xl">
                        {currentAlbum.description}
                      </p>
                    </div>
                  </div>

                  {/* Media Grid */}
                  {currentAlbum.stats.items.length === 0 ? (
                    <div className="text-center py-20 bg-slate-50 rounded-[2rem] border border-dashed border-slate-200"><p className="text-slate-400 font-bold uppercase tracking-widest text-[10px]">Belum ada media di album ini.</p></div>
                  ) : (
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-6 auto-rows-[180px] md:auto-rows-[240px]">
                      {currentAlbum.stats.items.map((item, idx) => {
                        const isYT = isYoutube(item.url);
                        return (
                          <motion.div
                            key={item._id}
                            initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: idx * 0.05 }}
                            onClick={() => setSelectedMedia(item)}
                            className={cn(
                              "relative group bg-white rounded-3xl overflow-hidden cursor-pointer shadow-sm hover:shadow-2xl transition-all border border-slate-100",
                              isYT ? "col-span-2 row-span-2" : "col-span-1 row-span-1"
                            )}
                          >
                            {isYT ? (
                              <div className="w-full h-full relative">
                                <img src={getYoutubeThumb(item.url) || ""} className="w-full h-full object-cover" />
                                <div className="absolute inset-0 bg-slate-900/20 group-hover:bg-slate-900/0 transition-colors" />
                                <div className="absolute inset-0 flex items-center justify-center">
                                  <div className="w-16 h-16 bg-red-600 rounded-full flex items-center justify-center text-white shadow-xl group-hover:scale-110 transition-transform">
                                    <YoutubeIcon className="w-10 h-10" />
                                  </div>
                                </div>
                              </div>
                            ) : item.type === "video" ? (
                              <div className="w-full h-full bg-slate-900 flex items-center justify-center relative">
                                <video src={getProxiedUrl(item.url)} className="w-full h-full object-cover opacity-80" />
                                <Play size={24} className="text-white absolute" />
                              </div>
                            ) : (
                              <img src={getProxiedUrl(item.url)} alt={item.caption} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                            )}
                            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity p-4 flex flex-col justify-end">
                              <p className="text-white text-[10px] md:text-xs font-bold leading-tight line-clamp-2">{item.caption}</p>
                            </div>
                          </motion.div>
                        );
                      })}
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ── MEDIA LIGHTBOX (IMAGE/VIDEO FULLSCREEN) ── */}
      <AnimatePresence>
        {selectedMedia && (
          <div className="fixed inset-0 z-[300] flex items-center justify-center p-4 md:p-10 h-[100dvh]">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setSelectedMedia(null)} className="absolute inset-0 bg-slate-950/98 backdrop-blur-2xl" />

            <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }} className="relative w-full max-w-5xl max-h-full flex flex-col lg:flex-row items-center gap-8 z-10 pointer-events-none">
              <button onClick={() => setSelectedMedia(null)} className="absolute -top-12 lg:top-0 -right-2 lg:-right-16 text-white/50 hover:text-white p-2 transition-colors pointer-events-auto"><X size={32} /></button>

              {/* Media Section */}
              <div className="w-full lg:w-[70%] bg-black rounded-3xl overflow-hidden shadow-2xl relative border border-white/5 aspect-video pointer-events-auto">
                {isYoutube(selectedMedia.url) ? (
                  <iframe
                    src={`https://www.youtube.com/embed/${getYoutubeId(selectedMedia.url)}?autoplay=1`}
                    className="w-full h-full"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                ) : selectedMedia.type === "video" ? (
                  <video src={getProxiedUrl(selectedMedia.url)} controls autoPlay className="w-full h-full object-contain" />
                ) : (
                  <img src={getProxiedUrl(selectedMedia.url)} alt={selectedMedia.caption} className="w-full h-full object-contain" />
                )}
              </div>

              {/* Info Section (Left Aligned) */}
              <div className="w-full lg:w-[30%] space-y-6 lg:self-start lg:pt-8 px-2 pointer-events-auto text-left">
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-px bg-indigo-500" />
                    <span className="text-indigo-400 font-bold text-[10px] uppercase tracking-[0.3em]">Dokumentasi</span>
                  </div>
                  <h4 className="text-white text-lg md:text-xl font-bold leading-[1.2] tracking-tight">{selectedMedia.caption || ""}</h4>
                </div>

                <div className="flex flex-wrap gap-3">
                  <div className="px-3 py-1.5 bg-white/5 border border-white/10 rounded-full flex items-center gap-2 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                    <Calendar size={12} className="text-indigo-400" />
                    Tahun {selectedMedia.year}
                  </div>
                  <div className="px-3 py-1.5 bg-white/5 border border-white/10 rounded-full flex items-center gap-2 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                    {selectedMedia.type === 'video' ? <VideoIcon size={12} className="text-indigo-400" /> : <ImageIcon size={12} className="text-indigo-400" />}
                    {selectedMedia.type === 'video' ? 'Video' : 'Foto'}
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
