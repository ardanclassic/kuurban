import Link from "next/link";
import { Heart, MapPin, Phone, Mail, ArrowRight } from "lucide-react";

export default function PublicFooter() {
  return (
    <footer className="bg-[#0a0f25] text-indigo-100 pt-16 pb-8 mt-auto relative overflow-hidden">
      {/* Background Decor */}
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-indigo-900 via-amber-400 to-indigo-900"></div>
      <div className="absolute top-[-10%] right-[-5%] w-[40%] h-[50%] bg-indigo-900/30 blur-[100px] rounded-full pointer-events-none"></div>

      <div className="max-w-5xl mx-auto px-4 grid grid-cols-1 md:grid-cols-12 gap-12 lg:gap-8 relative z-10">

        {/* BRAND COLUMN */}
        <div className="col-span-1 md:col-span-5 space-y-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-white/10 border border-white/20 backdrop-blur-sm flex items-center justify-center shadow-lg">
              <span className="text-2xl">🐐</span>
            </div>
            <div>
              <span className="font-extrabold text-2xl text-white block tracking-tight">Kuurban</span>
              <span className="text-[10px] text-amber-400 font-bold tracking-widest uppercase">IDUL ADHA 1447 H</span>
            </div>
          </div>
          <p className="text-indigo-200/70 text-sm leading-loose max-w-sm">
            Platform Manajemen Kurban Perumahan. Menghadirkan kemudahan pendaftaran, transparansi kuota, hingga kerapian pelaksanaan secara digital demi mengejar ridho Allah SWT.
          </p>
        </div>

        {/* LINKS COLUMN */}
        <div className="col-span-1 md:col-span-3">
          <h3 className="text-white font-bold mb-6 tracking-widest text-xs uppercase opacity-80">Jelajahi</h3>
          <ul className="space-y-4">
            <li>
              <Link href="/" className="group flex items-center gap-2 text-indigo-200 hover:text-white transition-colors text-sm font-medium">
                <ArrowRight className="w-3 h-3 text-indigo-600 group-hover:text-amber-400 transition-colors" /> Beranda
              </Link>
            </li>
            <li>
              <Link href="/kurban" className="group flex items-center gap-2 text-indigo-200 hover:text-white transition-colors text-sm font-medium">
                <ArrowRight className="w-3 h-3 text-indigo-600 group-hover:text-amber-400 transition-colors" /> Info Kurban
              </Link>
            </li>
            <li>
              <Link href="/jadwal" className="group flex items-center gap-2 text-indigo-200 hover:text-white transition-colors text-sm font-medium">
                <ArrowRight className="w-3 h-3 text-indigo-600 group-hover:text-amber-400 transition-colors" /> Jadwal Acara
              </Link>
            </li>
            <li className="pt-4 mt-4 border-t border-indigo-900/40">
              <Link href="/admin" className="group flex items-center gap-2 text-indigo-400 hover:text-amber-400 transition-colors text-[11px] font-bold uppercase tracking-widest">
                <ArrowRight className="w-2.5 h-2.5" /> Panel Panitia
              </Link>
            </li>
          </ul>
        </div>

        {/* CONTACT COLUMN */}
        <div className="col-span-1 md:col-span-4 space-y-6">
          <h3 className="text-white font-bold mb-6 tracking-widest text-xs uppercase opacity-80">Sekretariat Panitia</h3>
          <div className="space-y-4 text-sm text-indigo-200">

            <a href="https://maps.app.goo.gl" target="_blank" className="flex gap-4 items-start p-4 rounded-2xl bg-indigo-950/50 border border-indigo-900/50 hover:bg-indigo-900 hover:border-indigo-800 transition-colors group">
              <div className="w-10 h-10 rounded-full bg-indigo-900/80 flex items-center justify-center shrink-0 group-hover:bg-indigo-800 transition-colors">
                <MapPin className="w-4 h-4 text-amber-400" />
              </div>
              <div>
                <span className="block text-white font-semibold mb-1">Musala Al Ukhuwah</span>
                <span className="text-xs leading-relaxed text-indigo-300">Gunung Batu Permai, Kec. Sumbersari, Kab. Jember</span>
              </div>
            </a>

            <a href="https://wa.me/6282132440054" target="_blank" className="flex gap-4 items-center p-4 rounded-2xl bg-indigo-950/50 border border-indigo-900/50 hover:bg-indigo-900 hover:border-indigo-800 transition-colors group">
              <div className="w-10 h-10 rounded-full bg-emerald-950/60 flex items-center justify-center shrink-0 group-hover:bg-emerald-900/80 transition-colors">
                <Phone className="w-4 h-4 text-emerald-400" />
              </div>
              <div>
                <span className="block text-white font-semibold mb-1">Andy Firmansyah</span>
                <span className="text-xs text-indigo-300 flex items-center gap-2">
                  +62 821-3244-0054 <span className="px-2 py-0.5 rounded-full bg-indigo-900/80 text-[9px] text-amber-400 font-bold tracking-wider">PANITIA</span>
                </span>
              </div>
            </a>

          </div>
        </div>
      </div>

      {/* BOTTOM COPYRIGHT */}
      <div className="max-w-5xl mx-auto px-4 mt-16">
        <div className="pt-6 border-t border-indigo-900/40 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-xs text-indigo-400/80 font-medium text-center md:text-left">
            &copy; {new Date().getFullYear()} Musala Al Ukhuwah.
          </p>
        </div>
      </div>
    </footer>
  );
}
