"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  TrendingUp,
  CheckCircle2,
  AlertTriangle,
  Home,
  Plus,
  Users,
  Receipt,
  ShieldCheck,
  ChevronRight,
  Calendar,
} from "lucide-react";
import { formatRupiah } from "@/lib/mockData";
import { Block, Household, Bill } from "@/types/database";

interface DashboardData {
  totalHouses: number;
  paidHouses: number;
  unpaidHouses: number;
  partialHouses: number;
  totalCollected: number;
  targetAmount: number;
  paidPercentage: number;
  selectedMonth: string;
  houseStatusStats?: Array<{
    name: string;
    statusKey: string;
    rate: number;
    total: number;
    paid: number;
    percent: number;
    target: number;
    collected: number;
  }>;
  totalTetap?: number;
  totalKontrakan?: number;
  attentionList: Array<{
    name: string;
    house: string;
    overdue: string;
    color: string;
  }>;
  recentActivities: Array<{
    name: string;
    house: string;
    action: string;
    amount: string;
    time: string;
    type: string;
  }>;
  blocks: Block[];
}

export const AdminDashboardClient: React.FC<{ initialData: DashboardData }> = ({
  initialData,
}) => {
  const [data] = useState<DashboardData>(initialData);

  return (
    <div className="space-y-6">
      {/* Top Banner / Welcome */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <p className="text-[11px] font-bold tracking-wider text-slate-400 uppercase">
            Rabu, 25 September 2026
          </p>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight mt-0.5">
            Selamat datang, Budi Santoso <span className="inline-block">👋</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Berikut ringkasan penerimaan iuran warga RT 05 / RW 02 bulan ini.
          </p>
        </div>

        <Link
          href="/admin/bills"
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-teal-700 px-4 py-2.5 text-xs font-bold text-white shadow-sm hover:bg-teal-800 transition active:scale-95 shrink-0"
        >
          <Plus className="h-4 w-4" />
          <span>Catat Pembayaran</span>
        </Link>
      </div>

      {/* Month Filter Selector */}
      <div className="flex items-center gap-3">
        <div className="inline-flex items-center gap-2 rounded-xl border border-slate-300 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 shadow-2xs">
          <Calendar className="w-3.5 h-3.5 text-teal-700" />
          <span>{data.selectedMonth}</span>
        </div>
        <span className="text-[11px] text-slate-400 flex items-center gap-1.5">
          <span className="h-2 w-2 rounded-full bg-emerald-500" />
          Tersinkronisasi dengan Database RT
        </span>
      </div>

      {/* 4 Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Total Terkumpul */}
        <div className="rounded-xl bg-white border border-slate-300 border-t-4 border-t-sky-500 p-4 shadow-2xs flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-500 text-xs font-medium">
            <span>Total Terkumpul</span>
            <div className="h-7 w-7 rounded-lg bg-sky-50 text-sky-700 flex items-center justify-center font-bold">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <h3 className="text-xl sm:text-2xl font-black tracking-tight text-slate-900">
              {formatRupiah(data.totalCollected)}
            </h3>
            <p className="text-[11px] text-emerald-600 font-semibold mt-1">
              ↑ Real-time <span className="text-slate-400 font-normal">pembukuan kas</span>
            </p>
          </div>
          <div className="mt-3 pt-2 border-t border-slate-100 text-[10px] text-slate-400">
            Target: {formatRupiah(data.targetAmount)}
          </div>
        </div>

        {/* Card 2: Sudah Lunas */}
        <div className="rounded-xl bg-white border border-slate-300 border-t-4 border-t-emerald-600 p-4 shadow-2xs flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-500 text-xs font-medium">
            <span>Sudah Lunas</span>
            <div className="h-7 w-7 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center font-bold">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <h3 className="text-xl sm:text-2xl font-black tracking-tight text-slate-900">
              {data.paidHouses}{" "}
              <span className="text-xs font-medium text-slate-400">
                / {data.totalHouses} rumah
              </span>
            </h3>
            <p className="text-[11px] text-emerald-600 font-semibold mt-1">
              {data.paidPercentage}%{" "}
              <span className="text-slate-400 font-normal">tingkat pelunasan</span>
            </p>
          </div>
          <div className="mt-3 w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
            <div
              className="bg-emerald-600 h-full rounded-full transition-all duration-500"
              style={{ width: `${data.paidPercentage}%` }}
            />
          </div>
        </div>

        {/* Card 3: Belum Bayar */}
        <div className="rounded-xl bg-white border border-slate-300 border-t-4 border-t-amber-500 p-4 shadow-2xs flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-500 text-xs font-medium">
            <span>Belum Bayar</span>
            <div className="h-7 w-7 rounded-lg bg-amber-50 text-amber-700 flex items-center justify-center font-bold">
              <AlertTriangle className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <h3 className="text-xl sm:text-2xl font-black tracking-tight text-slate-900">
              {data.unpaidHouses}{" "}
              <span className="text-xs font-medium text-slate-400">rumah</span>
            </h3>
            <p className="text-[11px] text-amber-700 font-semibold mt-1">
              Perlu ditindaklanjuti
            </p>
          </div>
          <div className="mt-3 pt-2 border-t border-slate-100 text-[10px] text-slate-400 flex justify-between">
            <span>Sebagian: {data.partialHouses} rumah</span>
            <span>Jatuh tempo: tgl 10</span>
          </div>
        </div>

        {/* Card 4: Total Rumah Aktif */}
        <div className="rounded-xl bg-white border border-slate-300 border-t-4 border-t-indigo-500 p-4 shadow-2xs flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-500 text-xs font-medium">
            <span>Total Rumah Aktif</span>
            <div className="h-7 w-7 rounded-lg bg-indigo-50 text-indigo-700 flex items-center justify-center font-bold">
              <Home className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <h3 className="text-xl sm:text-2xl font-black tracking-tight text-slate-900">
              {data.totalHouses}{" "}
              <span className="text-xs font-medium text-slate-400">rumah</span>
            </h3>
            <p className="text-[11px] text-indigo-600 font-semibold mt-1">
              {data.totalTetap || 0} Tetap · {data.totalKontrakan || 0} Kontrakan
            </p>
          </div>
          <div className="mt-3 flex flex-wrap gap-1.5 pt-2 border-t border-slate-100">
            <span className="text-[10px] font-bold bg-blue-50 text-blue-700 border border-blue-200 px-2 py-0.5 rounded-full">
              Tetap: Rp 10.000/bln
            </span>
            <span className="text-[10px] font-bold bg-amber-50 text-amber-700 border border-amber-200 px-2 py-0.5 rounded-full">
              Kontrakan: Rp 5.000/bln
            </span>
          </div>
        </div>
      </div>

      {/* Middle Grid: House Status Summary & Residents Attention */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Payment Status per House Status (7 cols) */}
        <div className="lg:col-span-7 rounded-xl bg-white border border-slate-300 p-5 shadow-2xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <h2 className="text-sm font-bold text-slate-900">
                  Status Pembayaran per Kategori Rumah
                </h2>
                <p className="text-[11px] text-slate-500">
                  Pelunasan berdasarkan tarif rumah tetap (Rp 10.000) & kontrakan (Rp 5.000)
                </p>
              </div>
              <Link
                href="/admin/bills"
                className="text-xs font-bold text-teal-700 hover:text-teal-800"
              >
                Lihat detail →
              </Link>
            </div>

            {/* Visual Ring Summary */}
            <div className="mt-4 flex flex-col sm:flex-row items-center gap-6 p-3 bg-slate-50 rounded-xl border border-slate-200">
              <div className="relative flex items-center justify-center shrink-0">
                <div
                  className="w-24 h-24 rounded-full flex items-center justify-center"
                  style={{
                    background: `conic-gradient(#059669 0% ${data.paidPercentage}%, #e11d48 ${data.paidPercentage}% 95%, #d97706 95% 100%)`,
                  }}
                >
                  <div className="w-18 h-18 bg-white rounded-full flex flex-col items-center justify-center">
                    <span className="text-lg font-black text-slate-900">
                      {data.paidPercentage}%
                    </span>
                    <span className="text-[9px] font-semibold text-slate-400">Lunas</span>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2 w-full text-center sm:text-left text-xs">
                <div>
                  <div className="flex items-center gap-1.5 text-slate-500 text-[11px]">
                    <span className="w-2 h-2 rounded-full bg-emerald-600" />
                    <span>Lunas</span>
                  </div>
                  <p className="text-sm font-black text-slate-800 mt-0.5">
                    {data.paidHouses} KK
                  </p>
                </div>
                <div>
                  <div className="flex items-center gap-1.5 text-slate-500 text-[11px]">
                    <span className="w-2 h-2 rounded-full bg-rose-600" />
                    <span>Belum</span>
                  </div>
                  <p className="text-sm font-black text-slate-800 mt-0.5">
                    {data.unpaidHouses} KK
                  </p>
                </div>
                <div>
                  <div className="flex items-center gap-1.5 text-slate-500 text-[11px]">
                    <span className="w-2 h-2 rounded-full bg-amber-500" />
                    <span>Sebagian</span>
                  </div>
                  <p className="text-sm font-black text-slate-800 mt-0.5">
                    {data.partialHouses} KK
                  </p>
                </div>
              </div>
            </div>

            {/* House Status Progress Bars */}
            <div className="mt-5 space-y-4">
              {(data.houseStatusStats || []).map((item) => (
                <div key={item.name} className="p-3.5 rounded-xl border border-slate-200 bg-slate-50/50 space-y-2">
                  <div className="flex justify-between items-center text-xs">
                    <div className="flex items-center gap-2">
                      <span className={`px-2 py-0.5 rounded-full font-bold text-[10px] ${
                        item.statusKey === "kontrakan"
                          ? "bg-amber-100 text-amber-800 border border-amber-200"
                          : "bg-blue-100 text-blue-800 border border-blue-200"
                      }`}>
                        {item.name}
                      </span>
                      <span className="text-slate-500 font-semibold text-[11px]">
                        ({formatRupiah(item.rate)}/bln)
                      </span>
                    </div>
                    <span className="font-bold text-slate-700 text-xs">
                      {item.paid} / {item.total} KK ({item.percent}%)
                    </span>
                  </div>
                  <div className="w-full bg-slate-200 rounded-full h-2.5 overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-300 ${
                        item.statusKey === "kontrakan" ? "bg-amber-600" : "bg-blue-600"
                      }`}
                      style={{ width: `${item.percent}%` }}
                    />
                  </div>
                  <div className="flex justify-between text-[11px] text-slate-500 pt-0.5">
                    <span>Terkumpul: <strong className="text-slate-800">{formatRupiah(item.collected)}</strong></span>
                    <span>Target: <strong className="text-slate-800">{formatRupiah(item.target)}</strong></span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Attention List (5 cols) */}
        <div className="lg:col-span-5 rounded-xl bg-white border border-slate-300 p-5 shadow-2xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <h2 className="text-sm font-bold text-slate-900">Perlu Perhatian</h2>
                <p className="text-[11px] text-slate-500">Warga tertunggak & belum bayar</p>
              </div>
              <span className="rounded-full bg-rose-50 border border-rose-200 px-2.5 py-0.5 text-xs font-bold text-rose-700">
                {data.unpaidHouses} warga
              </span>
            </div>

            <div className="mt-3 divide-y divide-slate-100">
              {data.attentionList.length > 0 ? (
                data.attentionList.map((res, idx) => (
                  <div key={idx} className="py-2.5 flex items-center justify-between gap-3">
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div className="w-8 h-8 rounded-full bg-rose-100 text-rose-800 font-bold text-xs flex items-center justify-center shrink-0">
                        {res.name.substring(0, 2).toUpperCase()}
                      </div>
                      <div className="min-w-0">
                        <p className="text-xs font-bold text-slate-800 truncate">{res.name}</p>
                        <p className="text-[10px] text-rose-600 font-medium truncate">
                          {res.house} · {res.overdue}
                        </p>
                      </div>
                    </div>
                    <Link
                      href="/admin/bills"
                      className="text-[11px] font-bold text-teal-700 hover:underline shrink-0"
                    >
                      Tagih
                    </Link>
                  </div>
                ))
              ) : (
                <p className="text-xs text-slate-400 py-4 text-center">
                  Semua warga sudah melunasi iuran!
                </p>
              )}
            </div>
          </div>

          <Link
            href="/admin/bills"
            className="mt-4 block w-full text-center rounded-lg border border-slate-300 bg-slate-50 py-2 text-xs font-bold text-slate-700 hover:bg-slate-100 transition"
          >
            Lihat semua warga yang belum bayar →
          </Link>
        </div>
      </div>

      {/* Bottom Grid: Recent Activities & Quick Access */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Recent Activities (7 cols) */}
        <div className="lg:col-span-7 rounded-xl bg-white border border-slate-300 p-5 shadow-2xs">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div>
              <h2 className="text-sm font-bold text-slate-900">Aktivitas Pembayaran</h2>
              <p className="text-[11px] text-slate-500">Pembaruan transaksi tercatat hari ini</p>
            </div>
            <Link
              href="/admin/bills"
              className="text-xs font-bold text-teal-700 hover:text-teal-800"
            >
              Lihat semua →
            </Link>
          </div>

          <div className="mt-3 divide-y divide-slate-100">
            {data.recentActivities.length > 0 ? (
              data.recentActivities.map((act, i) => (
                <div key={i} className="py-3 flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center font-bold text-sm shrink-0">
                      ✓
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs font-bold text-slate-800 truncate">{act.name}</p>
                      <p className="text-[11px] text-slate-400 truncate">
                        {act.house} · {act.action}
                      </p>
                    </div>
                  </div>

                  <div className="text-right shrink-0">
                    <p className="text-xs font-bold text-emerald-700">{act.amount}</p>
                    <p className="text-[10px] text-slate-400">{act.time}</p>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-xs text-slate-400 py-4 text-center">
                Belum ada transaksi pembayaran tercatat hari ini.
              </p>
            )}
          </div>
        </div>

        {/* Quick Access (5 cols) */}
        <div className="lg:col-span-5 rounded-xl bg-white border border-slate-300 p-5 shadow-2xs">
          <div className="pb-3 border-b border-slate-100">
            <h2 className="text-sm font-bold text-slate-900">Akses Cepat Pengurus</h2>
            <p className="text-[11px] text-slate-500">Pintasan menu administrasi RT</p>
          </div>

          <div className="mt-3 space-y-2">
            <Link
              href="/admin/households"
              className="flex items-center justify-between p-3 rounded-xl border border-slate-200 hover:border-teal-400 hover:bg-teal-50/30 transition group"
            >
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-8 h-8 rounded-lg bg-teal-50 text-teal-700 flex items-center justify-center shrink-0">
                  <Users className="w-4 h-4" />
                </div>
                <div className="min-w-0">
                  <p className="text-xs font-bold text-slate-800 group-hover:text-teal-800 truncate">
                    Data Warga
                  </p>
                  <p className="text-[10px] text-slate-500 truncate">Kelola rumah & kontak</p>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-teal-700 shrink-0" />
            </Link>

            <Link
              href="/admin/bills"
              className="flex items-center justify-between p-3 rounded-xl border border-slate-200 hover:border-teal-400 hover:bg-teal-50/30 transition group"
            >
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center shrink-0">
                  <Receipt className="w-4 h-4" />
                </div>
                <div className="min-w-0">
                  <p className="text-xs font-bold text-slate-800 group-hover:text-teal-800 truncate">
                    Tagihan Bulanan
                  </p>
                  <p className="text-[10px] text-slate-500 truncate">
                    Buat & catat pembayaran
                  </p>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-teal-700 shrink-0" />
            </Link>

            <Link
              href="/admin/fund-usage"
              className="flex items-center justify-between p-3 rounded-xl border border-slate-200 hover:border-teal-400 hover:bg-teal-50/30 transition group"
            >
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-700 flex items-center justify-center shrink-0">
                  <ShieldCheck className="w-4 h-4" />
                </div>
                <div className="min-w-0">
                  <p className="text-xs font-bold text-slate-800 group-hover:text-teal-800 truncate">
                    Transparansi Dana
                  </p>
                  <p className="text-[10px] text-slate-500 truncate">
                    Catat penggunaan kas RT
                  </p>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-teal-700 shrink-0" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
