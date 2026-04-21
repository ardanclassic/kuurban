"use client";

import { ConvexProvider, ConvexReactClient } from "convex/react";
import { ReactNode, useMemo } from "react";

export function ConvexClientProvider({ children }: { children: ReactNode }) {
  const url = process.env.NEXT_PUBLIC_CONVEX_URL;
  
  const convex = useMemo(() => {
    // Gunakan URL dengan format valid .convex.cloud agar tidak fatal error saat build
    return new ConvexReactClient(url || "https://none.convex.cloud");
  }, [url]);

  // Jika di browser dan URL tidak ada, tampilkan pesan error yang jelas
  if (typeof window !== "undefined" && !url) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 p-6 text-center">
        <div className="max-w-md p-8 bg-white rounded-3xl shadow-xl border border-red-100">
          <div className="w-16 h-16 bg-red-50 text-red-500 rounded-2xl flex items-center justify-center mx-auto mb-6 text-2xl">⚠️</div>
          <h1 className="text-xl font-bold text-slate-900 mb-2">Konfigurasi database belum lengkap</h1>
          <p className="text-slate-500 text-sm leading-relaxed mb-6">
            Variabel <code className="bg-slate-100 px-1.5 py-0.5 rounded text-indigo-600 font-bold text-[10px]">NEXT_PUBLIC_CONVEX_URL</code> belum diatur di dashboard Vercel.
          </p>
          <div className="text-xs text-slate-400 font-medium italic">
            Silakan masukkan environment variable tersebut di Vercel Settings lalu lakukan redeploy.
          </div>
        </div>
      </div>
    );
  }

  return <ConvexProvider client={convex}>{children}</ConvexProvider>;
}
