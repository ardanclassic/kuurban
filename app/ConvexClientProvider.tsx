"use client";

import { ConvexProvider, ConvexReactClient } from "convex/react";
import { ReactNode, useMemo } from "react";

export function ConvexClientProvider({ children }: { children: ReactNode }) {
  const convex = useMemo(() => {
    const url = process.env.NEXT_PUBLIC_CONVEX_URL;
    if (!url) {
      // Kembalikan null saat build/SSR — Convex belum di-setup
      return null;
    }
    return new ConvexReactClient(url);
  }, []);

  if (!convex) {
    // Render children tanpa provider saat env var belum tersedia (build time)
    return <>{children}</>;
  }

  return <ConvexProvider client={convex}>{children}</ConvexProvider>;
}
