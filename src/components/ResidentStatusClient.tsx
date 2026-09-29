"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  CheckCircle2,
  AlertTriangle,
  Clock,
  ArrowLeft,
  Copy,
  Check,
  Building,
  CreditCard,
  ShieldCheck,
  Calendar,
  AlertCircle,
} from "lucide-react";
import { Household, Bill } from "@/types/database";
import { formatRupiah } from "@/lib/mockData";

interface ResidentStatusClientProps {
  household: Household;
  currentBill?: Bill;
  blockName: string;
  allBills?: Bill[];
}

export const ResidentStatusClient: React.FC<ResidentStatusClientProps> = ({
  household,
  currentBill,
  blockName,
  allBills,
}) => {
  const [copiedBank, setCopiedBank] = useState(false);

  const bankNumber = "1234567890";

  const handleCopyBank = () => {
    navigator.clipboard.writeText(bankNumber);
    setCopiedBank(true);
    setTimeout(() => setCopiedBank(false), 2000);
  };

  const isPaid = currentBill?.status === "paid";
  const isPartial = currentBill?.status === "partial";
  const isUnpaid = !currentBill || currentBill?.status === "unpaid";

  const isKontrakan =
    household.house_status === "kontrakan" ||
    currentBill?.house_status === "kontrakan" ||
    currentBill?.amount === 5000;
  const standardDueAmount = isKontrakan ? 5000 : 10000;
  const statusBadgeLabel = isKontrakan ? "Kontrakan · Rp 5.000" : "Rumah Tetap · Rp 10.000";

  // Dynamic historical payments from backend with fallback
  const historyList =
    allBills && allBills.length > 0
      ? allBills.map((b) => ({
          period: b.period,
          status: b.status,
          date: b.paid_at || `Jatuh tempo: ${b.due_date}`,
          method: b.method
            ? b.method === "transfer"
              ? "Transfer"
              : "Tunai"
            : "-",
        }))
      : [
          {
            period: currentBill?.period || "September 2026",
            status: currentBill?.status || "paid",
            date: currentBill?.paid_at || "8 Sep 2026",
            method: currentBill?.method || "Transfer",
          },
          {
            period: "Agustus 2026",
            status: "paid",
            date: "5 Agustus 2026",
            method: "Cash",
          },
          {
            period: "Juli 2026",
            status: "paid",
            date: "10 Juli 2026",
            method: "Transfer",
          },
          {
            period: "Juni 2026",
            status: "paid",
            date: "7 Juni 2026",
            method: "Transfer",
          },
        ];

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-between py-6 px-4 sm:px-6">
      <div className="max-w-xl mx-auto w-full space-y-4">
        {/* Navigation Bar */}
        <div className="flex items-center justify-between pb-2">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-teal-700"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Beranda Portal RT</span>
          </Link>
          <span
            className={`text-[11px] font-bold px-2 py-0.5 rounded border ${
              isKontrakan
                ? "text-amber-800 bg-amber-50 border-amber-200"
                : "text-blue-800 bg-blue-50 border-blue-200"
            }`}
          >
            {statusBadgeLabel}
          </span>
        </div>

        {/* Header Branding */}
        <div className="text-center py-2">
          <img
            src="/icon.svg"
            alt="RTHub Logo"
            className="inline-block h-10 w-10 rounded-xl shadow-xs mb-1"
          />
          <h1 className="text-lg font-black text-slate-800 tracking-tight">
            RT<span className="text-teal-700">Hub</span> · Status Iuran Rumah
          </h1>
          <p className="text-[11px] text-slate-400">Lingkungan RT 05 / RW 02 Kelurahan Cempaka</p>
        </div>

        {/* Household Identity Card */}
        <div className="rounded-2xl bg-white border border-slate-300 p-5 shadow-2xs">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-[10px] font-bold tracking-wider text-slate-400 uppercase">
                STATUS IURAN RUMAH
              </p>
              <h2 className="text-xl font-black text-slate-900 mt-0.5">
                Keluarga {household.head_of_family_name}
              </h2>
              <p className="text-xs font-semibold text-slate-500 mt-0.5">
                Rumah No. {household.house_number} ·{" "}
                <span className="font-bold text-slate-700">
                  {isKontrakan ? "Rumah Kontrakan (Tarif Rp 5.000 / bln)" : "Rumah Tetap (Tarif Rp 10.000 / bln)"}
                </span>
              </p>
            </div>
            <div className="text-right">
              <span className="text-[10px] text-slate-400 block">Kode Rumah:</span>
              <span className="font-mono text-xs font-bold text-teal-800 bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
                {household.access_code}
              </span>
            </div>
          </div>

          {/* Current Month Bill Card */}
          <div
            className={`mt-5 p-4 rounded-xl border ${
              isPaid
                ? "bg-emerald-50/70 border-emerald-300"
                : isPartial
                ? "bg-amber-50/70 border-amber-300"
                : "bg-rose-50/70 border-rose-300"
            }`}
          >
            <div className="flex justify-between items-start">
              <div>
                <span className="text-xs font-bold text-slate-600">
                  Tagihan Bulan Ini ({currentBill?.period || "September 2026"})
                </span>
                <h3
                  className={`text-2xl font-black tracking-tight mt-1 ${
                    isPaid
                      ? "text-emerald-950"
                      : isPartial
                      ? "text-amber-950"
                      : "text-rose-950"
                  }`}
                >
                  {formatRupiah(currentBill?.amount || standardDueAmount)}
                </h3>
              </div>

              {isPaid && (
                <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 border border-emerald-300 text-emerald-800">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-700" />
                  Lunas
                </span>
              )}
              {isPartial && (
                <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold bg-amber-100 border border-amber-300 text-amber-900">
                  <Clock className="w-3.5 h-3.5 text-amber-700" />
                  Sebagian
                </span>
              )}
              {isUnpaid && (
                <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold bg-rose-100 border border-rose-300 text-rose-800">
                  <AlertTriangle className="w-3.5 h-3.5 text-rose-700" />
                  Belum Bayar
                </span>
              )}
            </div>

            <p
              className={`text-xs mt-2 font-medium ${
                isPaid
                  ? "text-emerald-800"
                  : isPartial
                  ? "text-amber-900"
                  : "text-rose-800"
              }`}
            >
              {isPaid
                ? `✓ Telah lunas tercatat pada ${currentBill?.paid_at || "8 September 2026"} via ${currentBill?.method || "Transfer"}. Terima kasih!`
                : isPartial
                ? `Tercatat pembayaran sebagian Rp ${currentBill?.paid_amount?.toLocaleString("id-ID")}. Sisa dapat diselesaikan sebelum akhir bulan.`
                : "Jatuh tempo pada 10 September 2026. Silakan melakukan pembayaran secara tunai atau transfer."}
            </p>
          </div>
        </div>

        {/* Payment History */}
        <div className="rounded-2xl bg-white border border-slate-300 p-5 shadow-2xs">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div>
              <h3 className="text-sm font-bold text-slate-900">Riwayat Pembayaran</h3>
              <p className="text-[11px] text-slate-400">Catatan 4 bulan terakhir untuk rumah ini</p>
            </div>
            <span className="text-xs font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
              4 Periode
            </span>
          </div>

          <div className="mt-2 divide-y divide-slate-100">
            {historyList.map((item, idx) => (
              <div key={idx} className="py-3 flex items-center justify-between text-xs">
                <div>
                  <p className="font-bold text-slate-800">{item.period}</p>
                  <p className="text-[11px] text-slate-400">
                    {item.date} · {item.method}
                  </p>
                </div>
                <div>
                  {item.status === "paid" ? (
                    <span className="font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 rounded-full text-[11px]">
                      Lunas
                    </span>
                  ) : item.status === "partial" ? (
                    <span className="font-bold text-amber-700 bg-amber-50 border border-amber-200 px-2.5 py-0.5 rounded-full text-[11px]">
                      Sebagian
                    </span>
                  ) : (
                    <span className="font-bold text-rose-700 bg-rose-50 border border-rose-200 px-2.5 py-0.5 rounded-full text-[11px]">
                      Belum Bayar
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Payment Information Instructions */}
        <div className="rounded-2xl bg-amber-50/70 border border-amber-300 p-5 shadow-2xs">
          <div className="flex items-center justify-between pb-2 border-b border-amber-200/80">
            <h3 className="text-xs font-bold text-amber-950 uppercase tracking-wide flex items-center gap-1.5">
              <CreditCard className="w-4 h-4 text-amber-800" />
              <span>Instruksi Pembayaran Manual</span>
            </h3>
            <button
              onClick={handleCopyBank}
              className="inline-flex items-center gap-1 text-[11px] font-bold text-amber-900 bg-amber-100 hover:bg-amber-200 px-2 py-0.5 rounded transition"
            >
              {copiedBank ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-700" />
                  <span>Tersalin!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>Salin Rekening</span>
                </>
              )}
            </button>
          </div>

          <div className="mt-3 text-xs text-amber-900/90 space-y-2">
            <p>
              Pembayaran iuran dapat dilakukan melalui transfer bank atau setoran langsung tunai ke pengurus RT:
            </p>
            <div className="p-3 bg-white/90 rounded-xl border border-amber-200 font-mono text-xs">
              <p className="font-sans font-bold text-slate-800">Bank Central Asia (BCA)</p>
              <p className="text-base font-black text-slate-900 tracking-wider mt-0.5">
                123 456 7890
              </p>
              <p className="text-[11px] font-sans text-slate-500 mt-0.5">
                a.n. Kas Iuran RT 05 RW 02
              </p>
            </div>
            <p className="text-[11px] text-amber-800">
              *Setelah transfer, harap konfirmasi bukti bayar ke WhatsApp Bendahara Budi Santoso (0812-3456-7890).
            </p>
          </div>
        </div>

        {/* Privacy Note */}
        <div className="text-center pt-2 flex items-center justify-center gap-1.5 text-[11px] text-slate-400">
          <ShieldCheck className="w-3.5 h-3.5 text-teal-700" />
          <span>Privasi terjaga: Halaman hanya menampilkan status rumah Anda.</span>
        </div>
      </div>

      <footer className="text-center py-4 text-xs text-slate-400 border-t border-slate-200 mt-8">
        © 2026 RTHub · Sistem Iuran Warga RT 05
      </footer>
    </div>
  );
};
