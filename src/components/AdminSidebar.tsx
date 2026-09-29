"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  Users,
  ReceiptText,
  FileSpreadsheet,
  PieChart,
  ShieldAlert,
  Search,
  LogOut,
  X,
  HelpCircle,
} from "lucide-react";

interface AdminSidebarProps {
  isOpenMobile?: boolean;
  onCloseMobile?: () => void;
}

export const AdminSidebar: React.FC<AdminSidebarProps> = ({
  isOpenMobile = false,
  onCloseMobile,
}) => {
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
    } catch {
      // ignore
    }
    router.push("/admin/login");
  };

  const navItems = [
    { label: "Dashboard", href: "/admin/dashboard", icon: LayoutDashboard },
    { label: "Data Warga", href: "/admin/households", icon: Users, badge: "128" },
    { label: "Tagihan Bulanan", href: "/admin/bills", icon: ReceiptText },
    { label: "Penggunaan Dana", href: "/admin/fund-usage", icon: PieChart },
    { label: "Laporan & Rekap", href: "/admin/reports", icon: FileSpreadsheet },
  ];

  const secondaryItems = [
    { label: "Transparansi Publik", href: "/transparency", icon: ShieldAlert },
    { label: "Cek Status Warga", href: "/status", icon: Search },
  ];

  return (
    <>
      {/* Mobile backdrop */}
      {isOpenMobile && (
        <div
          className="fixed inset-0 z-40 bg-slate-900/40 backdrop-blur-xs lg:hidden"
          onClick={onCloseMobile}
        />
      )}

      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 flex w-64 flex-col bg-white border-r border-slate-200 p-5 transition-transform duration-200 lg:static lg:translate-x-0 ${
          isOpenMobile ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Brand */}
        <div className="flex items-center justify-between pb-6 border-b border-slate-100">
          <Link href="/admin/dashboard" className="flex items-center gap-3">
            <img
              src="/icon.svg"
              alt="RTHub Logo"
              className="h-9 w-9 rounded-xl shadow-xs"
            />
            <div>
              <span className="text-lg font-black tracking-tight text-slate-800">
                RT<span className="text-teal-700">Hub</span>
              </span>
              <p className="text-[10px] font-medium text-slate-400">Sistem Iuran Warga</p>
            </div>
          </Link>
          {onCloseMobile && (
            <button
              onClick={onCloseMobile}
              className="rounded-lg p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-600 lg:hidden"
            >
              <X className="h-5 w-5" />
            </button>
          )}
        </div>

        {/* RT Unit Badge */}
        <div className="mt-4 flex items-center justify-between rounded-xl bg-slate-50 border border-slate-200/80 p-3">
          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-teal-100 font-bold text-teal-800 text-xs">
              05
            </div>
            <div>
              <h4 className="text-xs font-bold text-slate-800">RT 05 / RW 02</h4>
              <p className="text-[10px] text-slate-500">Kelurahan Cempaka</p>
            </div>
          </div>
          <span className="h-2 w-2 rounded-full bg-emerald-500" />
        </div>

        {/* Navigation */}
        <nav className="mt-6 flex-1 space-y-6 overflow-y-auto pr-1">
          <div>
            <p className="px-3 text-[10px] font-bold tracking-wider text-slate-400 uppercase">
              Menu Utama
            </p>
            <div className="mt-2 space-y-1">
              {navItems.map((item) => {
                const isActive = pathname === item.href;
                const Icon = item.icon;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={onCloseMobile}
                    className={`flex items-center justify-between rounded-lg px-3 py-2 text-xs font-semibold transition-colors ${
                      isActive
                        ? "bg-teal-50 text-teal-800 border border-teal-200"
                        : "text-slate-600 hover:bg-slate-100/80 hover:text-slate-900"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <Icon
                        className={`h-4 w-4 ${
                          isActive ? "text-teal-700" : "text-slate-400"
                        }`}
                      />
                      <span>{item.label}</span>
                    </div>
                    {item.badge && (
                      <span className="rounded-full bg-teal-100/80 px-2 py-0.5 text-[10px] font-bold text-teal-800">
                        {item.badge}
                      </span>
                    )}
                  </Link>
                );
              })}
            </div>
          </div>

          <div>
            <p className="px-3 text-[10px] font-bold tracking-wider text-slate-400 uppercase">
              Halaman Publik
            </p>
            <div className="mt-2 space-y-1">
              {secondaryItems.map((item) => {
                const isActive = pathname === item.href;
                const Icon = item.icon;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={onCloseMobile}
                    className={`flex items-center gap-3 rounded-lg px-3 py-2 text-xs font-semibold transition-colors ${
                      isActive
                        ? "bg-teal-50 text-teal-800 border border-teal-200"
                        : "text-slate-600 hover:bg-slate-100/80 hover:text-slate-900"
                    }`}
                  >
                    <Icon className="h-4 w-4 text-slate-400" />
                    <span>{item.label}</span>
                  </Link>
                );
              })}
            </div>
          </div>
        </nav>

        {/* Help box */}
        <div className="mt-4 rounded-xl bg-teal-50/60 border border-teal-100 p-3.5">
          <div className="flex items-center gap-2 text-teal-800">
            <HelpCircle className="h-4 w-4" />
            <span className="text-xs font-bold">Pusat Bantuan RT</span>
          </div>
          <p className="mt-1 text-[11px] leading-relaxed text-teal-700/80">
            Kunjungi panduan pencatatan iuran & laporan warga.
          </p>
        </div>

        {/* Profile / Logout */}
        <div className="mt-4 pt-4 border-t border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-teal-800 font-bold text-white text-xs">
              BS
            </div>
            <div>
              <p className="text-xs font-bold text-slate-800">Budi Santoso</p>
              <p className="text-[10px] text-slate-500">Bendahara RT</p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            title="Keluar"
            className="rounded-lg p-1.5 text-slate-400 hover:bg-rose-50 hover:text-rose-600 transition cursor-pointer"
          >
            <LogOut className="h-4 w-4" />
          </button>
        </div>
      </aside>
    </>
  );
};
