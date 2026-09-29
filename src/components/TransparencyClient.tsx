"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  ShieldCheck,
  TrendingUp,
  PieChart,
  ArrowLeft,
  Lock,
  Shield,
  Trash2,
  Zap,
  Users,
} from "lucide-react";
import { formatRupiah } from "@/lib/mockData";
import { FundUsage } from "@/types/database";

interface TransparencyClientProps {
  initialData: {
    period: string;
    summary: {
      totalCollectedMonth: number;
      totalExpenseMonth: number;
      totalCollectedYear: number;
      totalExpenseYear: number;
      currentBalance: number;
    };
    usages: FundUsage[];
  };
}

export const TransparencyClient: React.FC<TransparencyClientProps> = ({
  initialData,
}) => {
  const [data] = useState(initialData);

  const monthlyTrends = [
    { month: "Apr", percent: 45, amount: "Rp 7.8 jt" },
    { month: "Mei", percent: 58, amount: "Rp 8.1 jt" },
    { month: "Jun", percent: 68, amount: "Rp 8.7 jt" },
    { month: "Jul", percent: 62, amount: "Rp 8.3 jt" },
    { month: "Agt", percent: 79, amount: "Rp 9.2 jt" },
    { month: "Sep", percent: 92, amount: "Rp 9.6 jt" },
  ];

  const getIcon = (category: string) => {
    if (category.includes("Keamanan")) return <Shield className="w-4 h-4 text-teal-700" />;
    if (category.includes("Kebersihan")) return <Trash2 className="w-4 h-4 text-emerald-700" />;
    if (category.includes("Penerangan") || category.includes("Listrik"))
      return <Zap className="w-4 h-4 text-amber-700" />;
    return <Users className="w-4 h-4 text-indigo-700" />;
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-between">
      {/* Top Navbar */}
      <header className="w-full bg-white border-b border-slate-200 sticky top-0 z-20">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-xs font-bold text-slate-600 hover:text-teal-700 transition"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Kembali ke Beranda</span>
          </Link>

          <div className="flex items-center gap-3">
            <span className="text-xs font-bold text-teal-800 bg-teal-50 px-2.5 py-1 rounded-full border border-teal-200">
              Laporan Publik RT 05 / RW 02
            </span>
            <Link
              href="/admin/login"
              className="hidden sm:inline-flex items-center gap-1.5 text-xs font-bold text-slate-600 hover:text-teal-700"
            >
              <Lock className="w-3.5 h-3.5" />
              <span>Login Pengurus</span>
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-5xl mx-auto px-4 sm:px-6 py-8 sm:py-12 w-full space-y-8 flex-1">
        {/* Title */}
        <div className="text-center max-w-2xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-100/80 border border-teal-200 text-teal-800 text-xs font-bold mb-3">
            <ShieldCheck className="w-4 h-4 text-teal-700" />
            <span>Transparansi Kas Iuran Warga</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-black text-slate-900 tracking-tight">
            Laporan Terbuka Kas RT 05
          </h1>
          <p className="mt-2 text-xs sm:text-sm text-slate-500">
            Komitmen transparansi pengurus RT 05 / RW 02 dalam mengelola dana iuran warga secara bertanggung jawab dan terbuka.
          </p>
        </div>

        {/* 3 Main Stat Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="p-5 rounded-2xl bg-white border border-slate-300 shadow-2xs">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wide">
              Total Iuran Terkumpul (2026)
            </span>
            <h3 className="mt-2 text-2xl font-black text-slate-900 tracking-tight">
              {formatRupiah(data.summary.totalCollectedYear)}
            </h3>
            <p className="text-xs text-emerald-700 font-semibold mt-1">
              ↑ 12% dibanding tahun 2025
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-white border border-slate-300 shadow-2xs">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wide">
              Total Pengeluaran Kas (2026)
            </span>
            <h3 className="mt-2 text-2xl font-black text-rose-700 tracking-tight">
              {formatRupiah(data.summary.totalExpenseYear)}
            </h3>
            <p className="text-xs text-slate-500 mt-1">Operasional lingkungan & warga</p>
          </div>

          <div className="p-5 rounded-2xl bg-teal-50/70 border border-teal-300 shadow-2xs">
            <span className="text-xs font-bold text-teal-900 uppercase tracking-wide">
              Saldo Kas Tersedia Saat Ini
            </span>
            <h3 className="mt-2 text-2xl font-black text-teal-950 tracking-tight">
              {formatRupiah(data.summary.currentBalance)}
            </h3>
            <p className="text-xs text-teal-800 font-semibold mt-1">
              Tersimpan aman di rekening resmi RT
            </p>
          </div>
        </div>

        {/* Two-Column: Monthly Usage Breakdown & Collection Trend */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Fund Usage Breakdown (7 cols) */}
          <div className="lg:col-span-7 rounded-2xl bg-white border border-slate-300 p-5 sm:p-6 shadow-2xs flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div>
                  <h3 className="text-base font-bold text-slate-900">
                    Rincian Alokasi Dana ({data.period})
                  </h3>
                  <p className="text-xs text-slate-400">
                    Pos pengeluaran yang didanai dari iuran warga
                  </p>
                </div>
                <span className="text-xs font-bold text-slate-600 bg-slate-100 px-2 py-0.5 rounded">
                  Bulan Berjalan
                </span>
              </div>

              <div className="mt-4 divide-y divide-slate-100">
                {data.usages.map((u) => (
                  <div key={u.id} className="py-3.5 flex items-start justify-between gap-4">
                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 rounded-xl bg-slate-100 flex items-center justify-center shrink-0 mt-0.5">
                        {getIcon(u.category)}
                      </div>
                      <div>
                        <h4 className="text-xs font-bold text-slate-800">{u.category}</h4>
                        <p className="text-[11px] text-slate-500 mt-0.5 leading-relaxed">
                          {u.description}
                        </p>
                      </div>
                    </div>
                    <span className="text-xs font-black text-slate-900 shrink-0">
                      {formatRupiah(u.amount)}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-100 flex justify-between items-center text-xs font-bold text-slate-700">
              <span>Total Pengeluaran Bulan Ini:</span>
              <span className="text-sm font-black text-rose-700">
                {formatRupiah(data.summary.totalExpenseMonth)}
              </span>
            </div>
          </div>

          {/* Collection Trend Chart (5 cols) */}
          <div className="lg:col-span-5 rounded-2xl bg-white border border-slate-300 p-5 sm:p-6 shadow-2xs flex flex-col justify-between">
            <div>
              <div className="pb-3 border-b border-slate-100">
                <h3 className="text-base font-bold text-slate-900">
                  Tren Penerimaan Iuran
                </h3>
                <p className="text-xs text-slate-400">
                  Perkembangan penerimaan kas 6 bulan terakhir
                </p>
              </div>

              {/* Bar Chart Visualization */}
              <div className="mt-6 flex items-end justify-between gap-3 h-44 px-2 pb-2 border-b border-slate-200">
                {monthlyTrends.map((item, idx) => (
                  <div key={idx} className="flex-1 flex flex-col items-center gap-2 h-full justify-end">
                    <div
                      className={`w-full rounded-t-lg transition-all duration-500 ${
                        idx === monthlyTrends.length - 1
                          ? "bg-teal-700"
                          : "bg-teal-200 hover:bg-teal-400"
                      }`}
                      style={{ height: `${item.percent}%` }}
                      title={`${item.month}: ${item.amount}`}
                    />
                    <span className="text-[11px] font-bold text-slate-600">
                      {item.month}
                    </span>
                  </div>
                ))}
              </div>

              <div className="mt-4 text-xs text-slate-500 space-y-1">
                <div className="flex justify-between">
                  <span>Tingkat Kepatuhan September:</span>
                  <span className="font-bold text-teal-800">92%</span>
                </div>
                <div className="flex justify-between">
                  <span>Rata-rata Penerimaan / Bulan:</span>
                  <span className="font-bold text-slate-700">Rp 8.600.000</span>
                </div>
              </div>
            </div>

            <div className="mt-6 rounded-xl bg-slate-50 p-3 border border-slate-200 text-[11px] text-slate-500 leading-relaxed">
              <span className="font-bold text-slate-700">Catatan Privasi Warga: </span>
              Laporan publik ini memuat data agregat keuangan RT dan tidak menampilkan identitas pribadi atau alamat warga mana pun.
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="w-full border-t border-slate-200 bg-white py-6">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-400 gap-3">
          <p>© 2026 RTHub · Transparansi Kas Iuran RT 05 / RW 02</p>
          <Link href="/status" className="font-semibold text-teal-700 hover:underline">
            Cek Status Iuran Rumah Anda →
          </Link>
        </div>
      </footer>
    </div>
  );
};
