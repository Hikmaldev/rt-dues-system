"use client";

import React, { useState } from "react";
import { usePathname } from "next/navigation";
import { AdminSidebar } from "@/components/AdminSidebar";
import { AdminHeader } from "@/components/AdminHeader";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // If on login page, render clean without sidebar
  if (pathname === "/admin/login") {
    return <>{children}</>;
  }

  // Derive title from current path
  let pageTitle = "Dashboard";
  let subtitle = "Ringkasan";

  if (pathname.includes("/households")) {
    pageTitle = "Data Warga";
    subtitle = "Master Blok & Rumah";
  } else if (pathname.includes("/bills")) {
    pageTitle = "Tagihan";
    subtitle = "Bulan Berjalan";
  } else if (pathname.includes("/fund-usage")) {
    pageTitle = "Penggunaan Dana";
    subtitle = "Catatan Pengeluaran";
  } else if (pathname.includes("/reports")) {
    pageTitle = "Laporan";
    subtitle = "Rekapitulasi";
  }

  return (
    <div className="flex min-h-screen bg-slate-50">
      <AdminSidebar
        isOpenMobile={isMobileMenuOpen}
        onCloseMobile={() => setIsMobileMenuOpen(false)}
      />
      <div className="flex flex-1 flex-col min-w-0">
        <AdminHeader
          title={pageTitle}
          subtitle={subtitle}
          onOpenMobileMenu={() => setIsMobileMenuOpen(true)}
        />
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
          {children}
        </main>
        <footer className="border-t border-slate-200 py-6 px-4 sm:px-8 text-center sm:text-left flex flex-col sm:flex-row justify-between items-center text-xs text-slate-400 gap-3">
          <p>© 2026 RTHub · Sistem Iuran Warga RT 05 / RW 02</p>
          <div className="flex items-center gap-4">
            <span className="inline-flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-full bg-emerald-500" />
              Sistem Aktif
            </span>
            <span>·</span>
            <span>Versi 1.0 (Next.js & Supabase)</span>
          </div>
        </footer>
      </div>
    </div>
  );
}
