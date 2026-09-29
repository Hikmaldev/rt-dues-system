"use client";

import React, { useState } from "react";
import {
  FileSpreadsheet,
  FileText,
  Calendar,
} from "lucide-react";
import { formatRupiah } from "@/lib/mockData";
import { Bill, Block } from "@/types/database";

interface ReportsClientProps {
  initialBills: Bill[];
  blocks: Block[];
}

export const ReportsClient: React.FC<ReportsClientProps> = ({
  initialBills,
  blocks,
}) => {
  const [bills] = useState<Bill[]>(initialBills);
  const [selectedMonth, setSelectedMonth] = useState("September");
  const [selectedYear, setSelectedYear] = useState("2026");
  const [selectedHouseStatus, setSelectedHouseStatus] = useState("all");

  const currentPeriod = `${selectedMonth} ${selectedYear}`;

  const handleExportExcel = () => {
    const url = `/api/reports/export?period=${encodeURIComponent(
      currentPeriod
    )}&houseStatus=${encodeURIComponent(selectedHouseStatus)}`;
    window.location.href = url;
  };

  const handleExportPDF = () => {
    window.print();
  };

  const filteredBills = bills.filter((b) => {
    const matchesPeriod = b.period.toLowerCase() === currentPeriod.toLowerCase();
    const isKontrakan = b.house_status === "kontrakan" || b.amount === 5000;
    const statusKey = isKontrakan ? "kontrakan" : "tetap";
    const matchesStatus =
      selectedHouseStatus === "all" || statusKey === selectedHouseStatus;
    return matchesPeriod && matchesStatus;
  });

  // Dynamic calculations
  const totalHouses = filteredBills.length;
  const targetAmount = filteredBills.reduce((sum, b) => sum + b.amount, 0);
  const paidAmount = filteredBills.reduce(
    (sum, b) => sum + (b.paid_amount || 0),
    0
  );
  const paidCount = filteredBills.filter((b) => b.status === "paid").length;
  const remainingAmount = targetAmount - paidAmount;
  const unpaidCount = filteredBills.filter(
    (b) => b.status === "unpaid" || b.status === "partial"
  ).length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <p className="text-[11px] font-bold tracking-wider text-slate-400 uppercase">
            Laporan Keuangan RT (Fase 2)
          </p>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            Rekapitulasi & Ekspor Laporan
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Unduh rekap bulanan dalam format Excel atau cetak PDF resmi RT.
          </p>
        </div>

        <div className="flex gap-2">
          <button
            onClick={handleExportExcel}
            className="inline-flex items-center gap-2 rounded-xl bg-emerald-700 px-3.5 py-2 text-xs font-bold text-white shadow-sm hover:bg-emerald-800 transition"
          >
            <FileSpreadsheet className="w-4 h-4" />
            <span>Ekspor Excel</span>
          </button>
          <button
            onClick={handleExportPDF}
            className="inline-flex items-center gap-2 rounded-xl border border-slate-300 bg-white px-3.5 py-2 text-xs font-bold text-slate-700 hover:bg-slate-50 transition shadow-2xs"
          >
            <FileText className="w-4 h-4 text-teal-700" />
            <span>Cetak PDF</span>
          </button>
        </div>
      </div>

      {/* Filter Card */}
      <div className="bg-white p-4 rounded-xl border border-slate-300 shadow-2xs flex flex-wrap items-center gap-4">
        <div className="flex items-center gap-2">
          <Calendar className="w-4 h-4 text-teal-700" />
          <span className="text-xs font-bold text-slate-700">Periode:</span>
        </div>

        <select
          value={selectedMonth}
          onChange={(e) => setSelectedMonth(e.target.value)}
          className="px-3 py-1.5 text-xs rounded-lg border border-slate-300 bg-white font-semibold text-slate-700"
        >
          <option value="Januari">Januari</option>
          <option value="Februari">Februari</option>
          <option value="Maret">Maret</option>
          <option value="April">April</option>
          <option value="Mei">Mei</option>
          <option value="Juni">Juni</option>
          <option value="Juli">Juli</option>
          <option value="Agustus">Agustus</option>
          <option value="September">September</option>
          <option value="Oktober">Oktober</option>
          <option value="November">November</option>
          <option value="Desember">Desember</option>
        </select>

        <select
          value={selectedYear}
          onChange={(e) => setSelectedYear(e.target.value)}
          className="px-3 py-1.5 text-xs rounded-lg border border-slate-300 bg-white font-semibold text-slate-700"
        >
          <option value="2026">2026</option>
          <option value="2025">2025</option>
        </select>

        <select
          value={selectedHouseStatus}
          onChange={(e) => setSelectedHouseStatus(e.target.value)}
          className="px-3 py-1.5 text-xs rounded-lg border border-slate-300 bg-white font-semibold text-slate-700"
        >
          <option value="all">Semua Status Rumah</option>
          <option value="tetap">Rumah Tetap (Rp 10.000)</option>
          <option value="kontrakan">Rumah Kontrakan (Rp 5.000)</option>
        </select>
      </div>

      {/* Summary Box */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="p-4 rounded-xl bg-white border border-slate-300 shadow-2xs">
          <p className="text-xs text-slate-500 font-semibold">Total Rumah Terdata</p>
          <h3 className="text-xl font-black text-slate-900 mt-1">{totalHouses} Rumah</h3>
        </div>
        <div className="p-4 rounded-xl bg-white border border-slate-300 shadow-2xs">
          <p className="text-xs text-slate-500 font-semibold">Target Penerimaan</p>
          <h3 className="text-xl font-black text-slate-900 mt-1">
            {formatRupiah(targetAmount)}
          </h3>
        </div>
        <div className="p-4 rounded-xl bg-emerald-50/60 border border-emerald-300 shadow-2xs">
          <p className="text-xs text-emerald-800 font-semibold">Total Telah Lunas</p>
          <h3 className="text-xl font-black text-emerald-950 mt-1">
            {formatRupiah(paidAmount)}{" "}
            <span className="text-xs font-normal">({paidCount} KK)</span>
          </h3>
        </div>
        <div className="p-4 rounded-xl bg-rose-50/60 border border-rose-300 shadow-2xs">
          <p className="text-xs text-rose-800 font-semibold">Sisa Tunggakan</p>
          <h3 className="text-xl font-black text-rose-950 mt-1">
            {formatRupiah(remainingAmount)}{" "}
            <span className="text-xs font-normal">({unpaidCount} KK)</span>
          </h3>
        </div>
      </div>

      {/* Preview Table */}
      <div className="rounded-xl bg-white border border-slate-300 shadow-2xs overflow-hidden">
        <div className="p-4 border-b border-slate-200">
          <h3 className="text-sm font-bold text-slate-900">
            Preview Tabel Rekapitulasi ({currentPeriod})
          </h3>
          <p className="text-xs text-slate-500">
            Daftar ringkas per rumah untuk lampiran arsip musyawarah warga berdasarkan status kepemilikan.
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 font-bold text-slate-600">
                <th className="py-2.5 px-4">No.</th>
                <th className="py-2.5 px-4">Nama Kepala Keluarga</th>
                <th className="py-2.5 px-4">Nomor Rumah</th>
                <th className="py-2.5 px-4">Status Rumah</th>
                <th className="py-2.5 px-4">Tarif Wajib</th>
                <th className="py-2.5 px-4">Terbayar</th>
                <th className="py-2.5 px-4">Status</th>
                <th className="py-2.5 px-4">Tanggal Bayar</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredBills.length > 0 ? (
                filteredBills.map((b, idx) => {
                  const isKontrakan = b.house_status === "kontrakan" || b.amount === 5000;
                  return (
                    <tr key={b.id} className="hover:bg-slate-50">
                      <td className="py-2.5 px-4 text-slate-400">{idx + 1}</td>
                      <td className="py-2.5 px-4 font-bold text-slate-800">
                        {b.household_name}
                      </td>
                      <td className="py-2.5 px-4 font-mono font-semibold">{b.house_number}</td>
                      <td className="py-2.5 px-4">
                        <span
                          className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-bold border ${
                            isKontrakan
                              ? "bg-amber-50 text-amber-700 border-amber-200"
                              : "bg-blue-50 text-blue-700 border-blue-200"
                          }`}
                        >
                          {isKontrakan ? "Kontrakan" : "Rumah Tetap"}
                        </span>
                      </td>
                      <td className="py-2.5 px-4 font-semibold">{formatRupiah(b.amount)}</td>
                      <td className="py-2.5 px-4 font-bold text-emerald-700">
                        {formatRupiah(b.paid_amount || 0)}
                      </td>
                      <td className="py-2.5 px-4 font-semibold">
                        {b.status === "paid" ? (
                          <span className="text-emerald-700">Lunas</span>
                        ) : b.status === "unpaid" ? (
                          <span className="text-rose-700">Belum Bayar</span>
                        ) : (
                          <span className="text-amber-700">Sebagian</span>
                        )}
                      </td>
                      <td className="py-2.5 px-4 text-slate-500">{b.paid_at || "-"}</td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={8} className="py-8 text-center text-xs text-slate-400">
                    Tidak ada data tagihan untuk periode {currentPeriod}.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
