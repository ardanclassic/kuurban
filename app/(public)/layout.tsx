import { ReactNode } from "react";
import PublicNavbar from "@/components/layout/PublicNavbar";
import PublicFooter from "@/components/layout/PublicFooter";

export default function PublicLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex flex-col min-h-screen bg-zinc-50 font-sans selection:bg-emerald-200">
      <PublicNavbar />
      <main className="flex-1 w-full mx-auto px-4 py-4 md:py-6 lg:py-8">
        {children}
      </main>
      <PublicFooter />
    </div>
  );
}
