"use client";

import React, { useState, useRef, useEffect, useCallback } from 'react';
import Mermaid from './Mermaid';
import { kurbanChartLR, kurbanChartTD } from './KurbanChartDefinitions';
import { AnimatePresence, motion } from 'framer-motion';
import { Maximize2, X, MousePointerClick, Hand, Plus, Minus, Search, MoveHorizontal, MoveVertical, Download } from 'lucide-react';
import { toPng } from 'html-to-image';

export default function WorkflowDiagram() {
  const [viewMode, setViewMode] = useState<'mermaid' | 'ui'>('mermaid');
  const [orientation, setOrientation] = useState<'lr' | 'td'>('lr');
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [zoom, setZoom] = useState(1);
  // Incremented each time modal opens to force Mermaid re-mount
  const [diagramKey, setDiagramKey] = useState(0);

  const mermaidChart = orientation === 'lr' ? kurbanChartLR : kurbanChartTD;

  // Pan state stored in refs — zero React re-renders during drag
  const cardRef = useRef<HTMLDivElement>(null);
  const viewportRef = useRef<HTMLDivElement>(null); // the overflow:hidden pan container
  const panX = useRef(0);
  const panY = useRef(0);
  const isDragging = useRef(false);
  const lastPointer = useRef({ x: 0, y: 0 });
  const velocityRef = useRef({ x: 0, y: 0 });
  const rafRef = useRef<ReturnType<typeof requestAnimationFrame> | null>(null);
  const zoomRef = useRef(1);
  const activePointers = useRef<Map<number, { x: number; y: number }>>(new Map());
  const initialPinchDistance = useRef<number | null>(null);
  const initialPinchZoom = useRef<number>(1);

  const EDGE_PADDING = 200; // px of empty space allowed beyond card edge

  // Compute pan clamp bounds from live DOM measurements
  const getBounds = useCallback(() => {
    if (!cardRef.current || !viewportRef.current) {
      return { minX: -Infinity, maxX: Infinity, minY: -Infinity, maxY: Infinity };
    }
    const vw = viewportRef.current.offsetWidth;
    const vh = viewportRef.current.offsetHeight;
    const z = zoomRef.current;
    const cw = cardRef.current.offsetWidth * z;
    const ch = cardRef.current.offsetHeight * z;
    return {
      maxX: vw / 2 + cw / 2 - EDGE_PADDING,
      minX: -(vw / 2 + cw / 2 - EDGE_PADDING),
      maxY: vh / 2 + ch / 2 - EDGE_PADDING,
      minY: -(vh / 2 + ch / 2 - EDGE_PADDING),
    };
  }, []);


  // Apply CSS transform directly to DOM — zero React involvement
  const applyTransform = useCallback(() => {
    if (!cardRef.current) return;
    cardRef.current.style.transform =
      `translate(calc(-50% + ${panX.current}px), calc(-50% + ${panY.current}px)) scale(${zoomRef.current})`;
  }, []);

  // Inertia: smooth deceleration after release
  const startInertia = useCallback(() => {
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    const friction = 0.88;
    const step = () => {
      velocityRef.current.x *= friction;
      velocityRef.current.y *= friction;
      if (Math.abs(velocityRef.current.x) < 0.4 && Math.abs(velocityRef.current.y) < 0.4) return;
      const { minX, maxX, minY, maxY } = getBounds();
      panX.current = Math.min(Math.max(panX.current + velocityRef.current.x, minX), maxX);
      panY.current = Math.min(Math.max(panY.current + velocityRef.current.y, minY), maxY);
      // Damp velocity at boundaries
      if (panX.current === minX || panX.current === maxX) velocityRef.current.x = 0;
      if (panY.current === minY || panY.current === maxY) velocityRef.current.y = 0;
      applyTransform();
      rafRef.current = requestAnimationFrame(step);
    };
    rafRef.current = requestAnimationFrame(step);
  }, [applyTransform, getBounds]);

  const onPointerDown = useCallback((e: React.PointerEvent) => {
    if (rafRef.current) cancelAnimationFrame(rafRef.current);

    activePointers.current.set(e.pointerId, { x: e.clientX, y: e.clientY });
    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);

    if (activePointers.current.size === 1) {
      isDragging.current = true;
      lastPointer.current = { x: e.clientX, y: e.clientY };
      velocityRef.current = { x: 0, y: 0 };
    } else if (activePointers.current.size === 2) {
      const pts = Array.from(activePointers.current.values());
      const dist = Math.sqrt(
        Math.pow(pts[0].x - pts[1].x, 2) + Math.pow(pts[0].y - pts[1].y, 2)
      );
      initialPinchDistance.current = dist;
      initialPinchZoom.current = zoomRef.current;
      isDragging.current = false; // Disable panning while pinching
    }
  }, []);

  const onPointerMove = useCallback((e: React.PointerEvent) => {
    if (!activePointers.current.has(e.pointerId)) return;
    activePointers.current.set(e.pointerId, { x: e.clientX, y: e.clientY });

    if (activePointers.current.size === 2 && initialPinchDistance.current !== null) {
      const pts = Array.from(activePointers.current.values());
      const dist = Math.sqrt(
        Math.pow(pts[0].x - pts[1].x, 2) + Math.pow(pts[0].y - pts[1].y, 2)
      );

      const ratio = dist / initialPinchDistance.current;
      const newZoom = Math.min(Math.max(initialPinchZoom.current * ratio, 0.3), 4);
      setZoom(parseFloat(newZoom.toFixed(2)));
    } else if (isDragging.current && activePointers.current.size === 1) {
      const dx = e.clientX - lastPointer.current.x;
      const dy = e.clientY - lastPointer.current.y;
      lastPointer.current = { x: e.clientX, y: e.clientY };
      const { minX, maxX, minY, maxY } = getBounds();
      panX.current = Math.min(Math.max(panX.current + dx, minX), maxX);
      panY.current = Math.min(Math.max(panY.current + dy, minY), maxY);
      velocityRef.current = { x: dx, y: dy };
      applyTransform();
    }
  }, [applyTransform, getBounds]);

  const onPointerUp = useCallback((e: React.PointerEvent) => {
    activePointers.current.delete(e.pointerId);

    if (activePointers.current.size === 0) {
      isDragging.current = false;
      initialPinchDistance.current = null;
      startInertia();
    } else if (activePointers.current.size === 1) {
      // Switch back to panning with the remaining finger
      const remaining = activePointers.current.values().next().value;
      if (remaining) {
        lastPointer.current = { x: remaining.x, y: remaining.y };
        isDragging.current = true;
      }
      initialPinchDistance.current = null;
    }
  }, [startInertia]);

  const onWheel = useCallback((e: React.WheelEvent) => {
    const delta = e.deltaY * -0.001;
    const newZoom = Math.min(Math.max(zoom + delta, 0.3), 4);
    setZoom(parseFloat(newZoom.toFixed(2)));
  }, [zoom]);

  // Sync zoom ref so applyTransform uses latest zoom without closure issues
  useEffect(() => {
    zoomRef.current = zoom;
    applyTransform();
  }, [zoom, applyTransform]);

  // Reset pan when modal opens, force Mermaid re-mount with new key
  const openFullscreen = useCallback(() => {
    panX.current = 0;
    panY.current = 0;
    zoomRef.current = 1;
    setZoom(1);
    setDiagramKey(k => k + 1);
    setIsFullscreen(true);
  }, []);

  // After modal + Mermaid renders, set initial X to show left edge of card
  useEffect(() => {
    if (!isFullscreen) return;
    // Wait for Mermaid to finish rendering inside the modal
    const t = setTimeout(() => {
      if (!cardRef.current || !viewportRef.current) return;
      const vw = viewportRef.current.offsetWidth;
      const cw = cardRef.current.offsetWidth;
      // Align left edge of card to 24px from viewport left
      const initialX = cw / 2 - vw / 2 + 24;
      panX.current = initialX;
      panY.current = 0;
      applyTransform();
    }, 500); // 500ms covers Mermaid async render time
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isFullscreen, diagramKey]);

  const handleZoomIn = () => setZoom(p => Math.min(parseFloat((p + 0.25).toFixed(2)), 4));
  const handleZoomOut = () => setZoom(p => Math.max(parseFloat((p - 0.25).toFixed(2)), 0.3));

  const handleDownloadPNG = () => {
    const svgEl = cardRef.current?.querySelector('svg');
    if (!svgEl) return;
    
    const clonedSvg = svgEl.cloneNode(true) as SVGSVGElement;
    
    // Add solid white background
    const bgRect = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
    bgRect.setAttribute('width', '100%');
    bgRect.setAttribute('height', '100%');
    bgRect.setAttribute('fill', '#ffffff');
    clonedSvg.insertBefore(bgRect, clonedSvg.firstChild);
    
    let width = svgEl.clientWidth || svgEl.getBoundingClientRect().width;
    let height = svgEl.clientHeight || svgEl.getBoundingClientRect().height;
    
    // Extract native dimensions to ensure it's not cut off
    const viewBox = clonedSvg.getAttribute('viewBox');
    if (viewBox) {
      const parts = viewBox.split(' ');
      if (parts.length === 4) {
        width = parseFloat(parts[2]);
        height = parseFloat(parts[3]);
        clonedSvg.setAttribute('width', width.toString());
        clonedSvg.setAttribute('height', height.toString());
      }
    }
    
    const serializer = new XMLSerializer();
    const svgString = serializer.serializeToString(clonedSvg);
    
    // Convert to a properly encoded Data URI to prevent Canvas Tainting
    const svgDataUri = 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(svgString);
    
    // Prepare high-res canvas
    const scale = 3; 
    const canvas = document.createElement('canvas');
    canvas.width = width * scale;
    canvas.height = height * scale;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    ctx.scale(scale, scale);
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, width, height);
    
    const img = new Image();
    // Setting crossOrigin helps prevent taint flags in some WebKit browsers
    img.crossOrigin = 'anonymous';
    
    img.onload = () => {
      ctx.drawImage(img, 0, 0, width, height);
      try {
        const pngUrl = canvas.toDataURL('image/png', 1.0);
        const a = document.createElement('a');
        a.download = `Kurban-Diagram-${orientation.toUpperCase()}.png`;
        a.href = pngUrl;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
      } catch (err) {
        console.error('Canvas export failed:', err);
        alert('Browser Anda mencegah konversi gambar karena alasan keamanan (Canvas Tainted). Silakan gunakan browser Chrome versi terbaru.');
      }
    };
    
    img.onerror = (err) => {
      console.error('Image load failed:', err);
      alert('Gagal memuat diagram untuk diekspor.');
    };
    
    img.src = svgDataUri;
  };

  return (
    <div className="w-full max-w-5xl mx-auto py-6 px-1">

      {/* ── View & Orientation Toggle ── */}
      <div className="flex justify-center mb-6">
        <div className="bg-slate-100 p-1 rounded-lg flex flex-wrap justify-center items-center gap-1 border border-slate-200 shadow-inner">
          {(['mermaid', 'ui'] as const).map(v => (
            <button
              key={v}
              onClick={() => setViewMode(v)}
              className={`px-4 py-2 rounded-md text-xs font-bold transition-all duration-300 ${viewMode === v
                ? 'bg-white text-indigo-600 shadow-sm'
                : 'text-slate-500 hover:text-slate-700 hover:bg-slate-50'
                }`}
            >
              {v === 'mermaid' ? 'Diagram' : 'Modern View'}
            </button>
          ))}

          {viewMode === 'mermaid' && (
            <>
              <div className="w-[1px] h-5 bg-slate-300 mx-1"></div>
              <button
                onClick={() => setOrientation('lr')}
                title="Horizontal"
                className={`flex items-center gap-1.5 px-2 sm:px-3 py-2 rounded-md text-xs font-bold transition-all ${
                  orientation === 'lr' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-400 hover:text-slate-600'
                }`}
              >
                <MoveHorizontal className="w-4 h-4 sm:w-3.5 sm:h-3.5" /> <span className="hidden sm:inline">Horizontal</span>
              </button>
              <button
                onClick={() => setOrientation('td')}
                title="Vertikal"
                className={`flex items-center gap-1.5 px-2 sm:px-3 py-2 rounded-md text-xs font-bold transition-all ${
                  orientation === 'td' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-400 hover:text-slate-600'
                }`}
              >
                <MoveVertical className="w-4 h-4 sm:w-3.5 sm:h-3.5" /> <span className="hidden sm:inline">Vertikal</span>
              </button>
            </>
          )}
        </div>
      </div>

      <AnimatePresence mode="wait">
        {viewMode === 'mermaid' ? (

          /* ── Diagram thumbnail ── */
          <motion.div
            key="mermaid"
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.98 }}
          >
            <div
              onClick={openFullscreen}
              className="relative group cursor-pointer bg-white p-4 md:p-8 rounded-2xl border border-slate-200 shadow-sm overflow-hidden transition-all hover:border-indigo-300 hover:shadow-lg"
            >
              <div className="absolute inset-0 z-10 flex items-center justify-center pointer-events-none">
                <div className="bg-white/90 backdrop-blur px-4 py-2 rounded-full shadow-xl border border-slate-200 opacity-0 group-hover:opacity-100 transition-all translate-y-4 group-hover:translate-y-0 flex items-center gap-2">
                  <Maximize2 className="w-4 h-4 text-indigo-600" />
                  <span className="text-xs font-bold text-slate-800">Klik untuk Fullscreen</span>
                </div>
              </div>
              <div className="opacity-60 group-hover:opacity-100 blur-[1px] group-hover:blur-0 scale-90 group-hover:scale-100 transition-all duration-500 pointer-events-none">
                <Mermaid chart={mermaidChart} id="thumbnail" />
              </div>
              <div className="mt-4 flex items-center justify-center gap-2 text-slate-400">
                <MousePointerClick className="w-4 h-4" />
                <span className="text-[11px] font-medium uppercase tracking-widest">Preview — Klik untuk perbesar</span>
              </div>
            </div>
          </motion.div>

        ) : (

          /* ── Modern UI timeline ── */
          <motion.div
            key="ui"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="space-y-10 md:space-y-16"
          >
            {/* Tahap 1 */}
            <div className="relative border-l-2 border-blue-500 pl-6 md:pl-10 pb-2">
              <div className="absolute w-4 h-4 bg-blue-500 rounded-full -left-[9px] top-0 outline outline-4 outline-white" />
              <span className="text-xs font-bold text-blue-600 uppercase tracking-widest">Tahap 1 • Bagian Penerimaan</span>
              <div className="mt-4 bg-white p-5 md:p-6 rounded-2xl shadow-sm border border-slate-100 hover:shadow-md transition-all">
                <h3 className="font-bold text-slate-800 text-lg">Hewan Qurban</h3>
                <ul className="space-y-1.5 text-[13px] text-slate-600 mt-2">
                  <li>• Menerima, memfasilitasi, dan merawat hewan kurban</li>
                  <li>• Mempersiapkan hewan menjelang proses penyembelihan</li>
                </ul>
                <p className="text-[11px] text-blue-700/70 font-medium mt-3 border-t border-blue-100 pt-2">Tim Pengadaan & Penerimaan Hewan Kurban</p>
              </div>
            </div>

            {/* Tahap 2 */}
            <div className="relative border-l-2 border-rose-500 pl-6 md:pl-10 pb-2">
              <div className="absolute w-4 h-4 bg-rose-500 rounded-full -left-[9px] top-0 outline outline-4 outline-white" />
              <span className="text-xs font-bold text-rose-600 uppercase tracking-widest">Tahap 2 • Bagian Pemotongan & Penyembelihan</span>
              <div className="mt-3 space-y-2">
                <div className="bg-rose-50 border border-rose-100 rounded-xl px-4 py-2.5 text-[12px] text-rose-800"><span className="font-bold">Jagal Profesional</span> — Penyembelihan & pemisahan daging dari tulang</div>
                <div className="bg-rose-50 border border-rose-100 rounded-xl px-4 py-2.5 text-[12px] text-rose-800"><span className="font-bold">Tim Penyembelihan & Pemotongan</span> — Pemotongan daging, jeroan & organ menjadi lebih kecil</div>
              </div>
              <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-rose-50 p-5 rounded-2xl border border-rose-100 shadow-sm hover:shadow-md transition-all">
                  <span className="inline-block px-2.5 py-1 bg-rose-200/60 text-rose-800 text-[10px] font-bold uppercase rounded mb-3">Jalur Khusus</span>
                  <p className="font-bold text-rose-900 mb-2">Kepala & Kokot</p>
                  <p className="text-[13px] text-rose-700">Dikelompokkan & ditangani secara khusus.</p>
                  <p className="text-[11px] text-rose-600/70 font-medium mt-3 border-t border-rose-200/50 pt-2">Tim Khusus</p>
                </div>
                <div className="bg-amber-50 p-5 rounded-2xl border border-amber-100 shadow-sm hover:shadow-md transition-all">
                  <span className="inline-block px-2.5 py-1 bg-amber-200/60 text-amber-800 text-[10px] font-bold uppercase rounded mb-3">Jalur Sampil</span>
                  <p className="font-bold text-amber-900 mb-1">Paket Utama</p>
                  <p className="text-[12px] text-amber-800/80 mb-2">• Daging 3.5 kg</p>
                  <p className="font-bold text-amber-900 mb-1">Paket Request</p>
                  <p className="text-[12px] text-amber-800/80">• Iga / Limpa / Hati</p>
                  <p className="text-[11px] text-amber-700/70 font-medium mt-3 border-t border-amber-200/50 pt-2">Tim Pengawasan Sampil & Daging Mudhohi</p>
                </div>
                <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-all">
                  <span className="inline-block px-2.5 py-1 bg-slate-200/60 text-slate-700 text-[10px] font-bold uppercase rounded mb-3">Jalur Umum</span>
                  <p className="font-bold text-slate-900 mb-2">Paket Reguler</p>
                  <ul className="space-y-1.5 text-[12px] text-slate-600/80">
                    <li>• Daging 0.6 kg Sapi / 0.5 kg Kambing</li>
                    <li>• Tambahan: organ lain (lemak / jeroan / tulangan)</li>
                  </ul>
                  <p className="text-[11px] text-slate-500 font-medium mt-3 border-t border-slate-200 pt-2">Tim Penimbangan & Penghitungan Paket</p>
                </div>
              </div>
            </div>

            {/* Tahap 3 */}
            <div className="relative border-l-2 border-emerald-500 pl-6 md:pl-10 pb-2">
              <div className="absolute w-4 h-4 bg-emerald-500 rounded-full -left-[9px] top-0 outline outline-4 outline-white" />
              <span className="text-xs font-bold text-emerald-600 uppercase tracking-widest">Tahap 3 • Bagian Penimbangan & Pengemasan</span>
              <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100 hover:shadow-md transition-all">
                  <span className="inline-block px-2.5 py-1 bg-slate-100 text-slate-700 text-[10px] font-bold uppercase rounded mb-3">Jalur Khusus</span>
                  <p className="text-[13px] text-slate-600 leading-relaxed">Pengelompokan & pengemasan kepala/kokot secara khusus.</p>
                  <p className="text-[11px] text-emerald-700/70 font-medium mt-3 border-t border-emerald-100 pt-2">Tim Khusus</p>
                </div>
                <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100 hover:shadow-md transition-all">
                  <span className="inline-block px-2.5 py-1 bg-slate-100 text-slate-700 text-[10px] font-bold uppercase rounded mb-3">Jalur Sampil</span>
                  <p className="text-[13px] text-slate-600 leading-relaxed">Penimbangan & pengemasan paket sampil sesuai jenisnya.</p>
                  <p className="text-[11px] text-emerald-700/70 font-medium mt-3 border-t border-emerald-100 pt-2">Tim Pengawasan Sampil & Daging untuk Mudhohi</p>
                </div>
                <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100 hover:shadow-md transition-all">
                  <span className="inline-block px-2.5 py-1 bg-slate-100 text-slate-700 text-[10px] font-bold uppercase rounded mb-3">Jalur Umum</span>
                  <p className="text-[13px] text-slate-600 leading-relaxed">Penimbangan & penghitungan jumlah paket daging kurban reguler.</p>
                  <p className="text-[11px] text-emerald-700/70 font-medium mt-3 border-t border-emerald-100 pt-2">Tim Penimbangan & Penghitungan Paket Daging Kurban</p>
                </div>
              </div>
            </div>

            {/* Tahap 4 */}
            <div className="relative pl-6 md:pl-10">
              <div className="absolute w-4 h-4 bg-indigo-500 rounded-full -left-[9px] top-0 outline outline-4 outline-white z-10" />
              <span className="text-xs font-bold text-indigo-600 uppercase tracking-widest">Tahap 4 • Bagian Distribusi</span>
              <h3 className="mt-4 font-bold text-slate-800 text-lg">Serah Terima & Distribusi</h3>
              <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="flex flex-col justify-between bg-rose-50 p-5 rounded-2xl border border-rose-100 gap-3">
                  <div>
                    <span className="text-[11px] font-bold text-rose-600 uppercase tracking-widest">Jalur Khusus</span>
                    <p className="text-[12px] text-rose-800/80 mt-1.5">Serah terima oleh <span className="font-bold">Tim Khusus</span> kepada pihak yang melakukan request.</p>
                  </div>
                  <div className="bg-rose-600 text-white px-4 py-2.5 rounded-xl shadow text-center">
                    <span className="text-[9px] font-bold uppercase tracking-widest block text-rose-200 mb-0.5">Diserahkan ke:</span>
                    <span className="text-xs font-black">PIHAK YANG REQUEST</span>
                  </div>
                </div>
                <div className="flex flex-col justify-between bg-indigo-50 p-5 rounded-2xl border border-indigo-100 gap-3">
                  <div>
                    <span className="text-[11px] font-bold text-indigo-600 uppercase tracking-widest">Jalur Sampil</span>
                    <p className="text-[12px] text-indigo-800/80 mt-1.5">Serah terima oleh <span className="font-bold">Tim Pengawasan Sampil & Daging Mudhohi</span> kepada shohibul qurban.</p>
                  </div>
                  <div className="bg-indigo-600 text-white px-4 py-2.5 rounded-xl shadow text-center">
                    <span className="text-[9px] font-bold uppercase tracking-widest block text-indigo-200 mb-0.5">Diserahkan ke:</span>
                    <span className="text-xs font-black">SHOHIBUL QURBAN</span>
                  </div>
                </div>
                <div className="flex flex-col justify-between bg-emerald-50 p-5 rounded-2xl border border-emerald-100 gap-3">
                  <div>
                    <span className="text-[11px] font-bold text-emerald-600 uppercase tracking-widest">Jalur Umum</span>
                    <p className="text-[12px] text-emerald-800/80 mt-1.5">Serah terima oleh <span className="font-bold">Tim Pendistribusian Daging Kurban</span> kepada warga/mustahiq.</p>
                  </div>
                  <div className="bg-emerald-600 text-white px-4 py-2.5 rounded-xl shadow text-center">
                    <span className="text-[9px] font-bold uppercase tracking-widest block text-emerald-200 mb-0.5">Diserahkan ke:</span>
                    <span className="text-xs font-black">MUSTAHIQ / WARGA</span>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Fullscreen Modal ── */}
      <AnimatePresence>
        {isFullscreen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[9999] bg-slate-950 flex flex-col"
          >
            {/* Header */}
            <div className="flex-none flex items-center justify-between px-4 py-3 md:px-6 border-b border-white/5 bg-black/40 backdrop-blur-md z-20">
              <div className="flex items-center gap-3">
                <div>
                  <h2 className="text-white font-bold text-sm md:text-base leading-tight">Diagram Alur Kerja</h2>
                  <span className="text-slate-500 text-[10px] font-bold uppercase tracking-widest hidden md:block">Geser untuk navigasi</span>
                </div>
                {/* Zoom pill */}
                <div className="flex items-center bg-white/5 rounded-full border border-white/10 p-0.5 ml-3">
                  <button onClick={handleZoomOut} className="p-1.5 text-slate-400 hover:text-white rounded-full hover:bg-white/10 transition-colors">
                    <Minus className="w-3.5 h-3.5" />
                  </button>
                  <span className="w-10 text-center text-[10px] font-bold text-indigo-400 font-mono">{Math.round(zoom * 100)}%</span>
                  <button onClick={handleZoomIn} className="p-1.5 text-slate-400 hover:text-white rounded-full hover:bg-white/10 transition-colors">
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={handleDownloadPNG}
                  className="flex items-center gap-2 px-3 md:px-4 py-1.5 md:py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-full font-bold text-[11px] md:text-xs transition-all shadow hover:shadow-indigo-500/25"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span className="hidden md:inline">Download HD</span>
                </button>
                <button
                  onClick={() => setIsFullscreen(false)}
                  className="p-2 bg-white/5 hover:bg-rose-500/20 hover:text-rose-400 text-slate-400 rounded-full border border-white/10 transition-all"
                >
                  <X className="w-4 h-4 md:w-5 md:h-5" />
                </button>
              </div>
            </div>

            {/* Pan Viewport */}
            <div
              ref={viewportRef}
              className="flex-1 overflow-hidden relative"
              style={{ background: '#0a0f1e', overscrollBehavior: 'none', touchAction: 'none', userSelect: 'none', cursor: 'grab' }}
              onPointerDown={onPointerDown}
              onPointerMove={onPointerMove}
              onPointerUp={onPointerUp}
              onPointerCancel={onPointerUp}
              onWheel={onWheel}
            >
              {/*
                White card — centered via absolute + transform.
                minWidth is CRITICAL: without it, Mermaid's 'w-full' = 0
                (circular CSS sizing in absolute containers).
              */}
              <div
                ref={cardRef}
                className="absolute will-change-transform"
                style={{
                  top: '50%',
                  left: '50%',
                  transform: 'translate(-50%, -50%) scale(1)',
                  transformOrigin: 'center center',
                  minWidth: 1900,
                  padding: '48px 64px',
                  background: '#ffffff',
                  borderRadius: '2rem',
                  boxShadow: '0 8px 80px rgba(0,0,0,0.7)',
                  pointerEvents: 'none',
                }}
              >
                {/* key forces fresh mount every time modal opens */}
                <Mermaid key={diagramKey} chart={mermaidChart} id="fullscreen" />
              </div>
            </div>

            {/* HUD */}
            <div className="absolute bottom-5 left-1/2 -translate-x-1/2 flex items-center gap-4 px-5 py-2.5 bg-slate-900/90 backdrop-blur-xl rounded-full border border-white/5 shadow-2xl pointer-events-none z-20">
              <div className="flex items-center gap-1.5 text-slate-400 text-[9px] font-bold uppercase tracking-widest">
                <Hand className="w-2.5 h-2.5 text-indigo-400" />
                <span>Pan</span>
              </div>
              <div className="w-px h-3 bg-white/10" />
              <div className="flex items-center gap-3 pointer-events-auto">
                <Search className="w-2.5 h-2.5 text-indigo-400" />
                <input
                  type="range"
                  min="0.3"
                  max="4"
                  step="0.1"
                  value={zoom}
                  onChange={(e) => setZoom(parseFloat(e.target.value))}
                  className="w-20 md:w-28 h-1 bg-white/10 rounded-lg appearance-none cursor-pointer accent-indigo-500 hover:bg-white/20 transition-colors"
                />
                <span className="text-indigo-400 font-mono text-[10px] font-bold w-10 text-right">
                  {Math.round(zoom * 100)}%
                </span>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
