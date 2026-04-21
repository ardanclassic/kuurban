"use client";

import { ConvexProvider, ConvexReactClient } from "convex/react";
import { ReactNode, useMemo } from "react";

export function ConvexClientProvider({ children }: { children: ReactNode }) {
  const convex = useMemo(() => {
    // Gunakan URL dummy jika env var belum ada (saat build time) 
    // agar useQuery tidak crash mencari provider.
    const url = process.env.NEXT_PUBLIC_CONVEX_URL || "https://dummy-url.convex.cloud";
    return new ConvexReactClient(url);
  }, []);

  return <ConvexProvider client={convex}>{children}</ConvexProvider>;
}
