"use client";

import React, { useState } from "react";
import { useSearchParams } from "next/navigation";
import {
  Receipt,
  Search,
  CheckCircle2,
  AlertTriangle,
  Clock,
  Filter,
  Calendar,
  CreditCard,
  ChevronDown,
} from "lucide-react";
import { formatRupiah } from "@/lib/mockData";
import { Bill, PaymentStatus, PaymentMethod, Block } from "@/types/database";
import { StatusBadge } from "@/components/StatusBadge";
import { recordPaymentAction, generateBillsAction } from "@/actions/billActions";

interface BillsClientProps {
  initialBills: Bill[];
  blocks: Block[];
}

export const BillsClient: React.FC<BillsClientProps> = ({ initialBills, blocks }) => {
  const searchParams = useSearchParams();
  const [bills, setBills] = useState<Bill[]>(initialBills);
  const [activeTab, setActiveTab] = useState<string>(
    searchParams.get("status") || "all"
  );
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedHouseStatus, setSelectedHouseStatus] = useState("all");
  const [selectedPeriod, setSelectedPeriod] = useState("September 2026");

  // Payment Recording Modal
  const [selectedBill, setSelectedBill] = useState<Bill | null>(null);
  const [paymentForm, setPaymentForm] = useState<{
    status: PaymentStatus;
    paid_amount: number;
    method: PaymentMethod;
    notes: string;
  }>({
    status: "paid",
    paid_amount: 0,
    method: "transfer",
    notes: "",
  });

  const openPaymentModal = (bill: Bill) => {
    setSelectedBill(bill);
    setPaymentForm({
      status: bill.status === "unpaid" ? "paid" : bill.status,
      paid_amount: bill.paid_amount || bill.amount,
      method: bill.method || "transfer",
      notes: bill.notes || "",
    });
  };

  const handleSavePayment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedBill) return;

    try {
      const response = await fetch("/api/payments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          bill_id: selectedBill.id,
          status: paymentForm.status,
          paid_amount: paymentForm.paid_amount,
          method: paymentForm.method,
          notes: paymentForm.notes,
        }),
      });

      const result = await response.json();
      if (result.success && result.data) {
        setBills((prev) =>
          prev.map((b) => (b.id === selectedBill.id ? result.data : b))
        );
        setSelectedBill(null);
        return;
      }
    } catch (err) {
      console.warn("API payment fallback to server action:", err);
    }

    const res = await recordPaymentAction({
      bill_id: selectedBill.id,
      status: paymentForm.status,
      paid_amount: paymentForm.paid_amount,
      method: paymentForm.method,
      notes: paymentForm.notes,
    });

    if (res.success && res.data) {
      setBills((prev) =>
        prev.map((b) => (b.id === selectedBill.id ? res.data! : b))
      );
      setSelectedBill(null);
    } else {
      alert(res.error || "Gagal memperbarui status pembayaran");
    }
  };

  const handleGenerateNextMonth = async () => {
    const res = await generateBillsAction({
      period: "Oktober 2026",
      due_date: "10 Okt 2026",
    });

    if (res.success) {
      alert(res.message);
      // Fetch fresh bills list from API
      try {
        const fetchRes = await fetch("/api/bills");
        const json = await fetchRes.json();
        if (json.success && json.data) {
          setBills(json.data);
        }
      } catch (err) {
        console.warn("Could not refetch bills:", err);
      }
    } else {
      alert(res.error || "Gagal men-generate tagihan");
    }
  };

  // Dynamic calculations based on live bills
  const totalBillsAmount = bills.reduce((sum, b) => sum + b.amount, 0);
  const totalCollected = bills.reduce((sum, b) => sum + (b.paid_amount || 0), 0);
  const countPaid = bills.filter((b) => b.status === "paid").length;
  const countUnpaid = bills.filter((b) => b.status === "unpaid").length;
  const countPartial = bills.filter((b) => b.status === "partial").length;

  const filteredBills = bills.filter((b) => {
    const matchesTab = activeTab === "all" || b.status === activeTab;
    const matchesSearch =
      b.household_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.house_number.toLowerCase().includes(searchQuery.toLowerCase());
    
    const isKontrakan = b.house_status === "kontrakan" || b.amount === 5000;
    const houseStatusKey = isKontrakan ? "kontrakan" : "tetap";
    const matchesHouseStatus =
      selectedHouseStatus === "all" || houseStatusKey === selectedHouseStatus;

    return matchesTab && matchesSearch && matchesHouseStatus;
  });

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <p className="text-[11px] font-bold tracking-wider text-slate-400 uppercase">
            Keuangan RT 05
          </p>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            Tagihan Bulan Berjalan
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Periode {selectedPeriod} · {bills.length} tagihan terdata di sistem.
          </p>
        </div>

        <button
          onClick={handleGenerateNextMonth}
          className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-xs font-bold text-slate-700 hover:bg-slate-50 shadow-2xs transition"
        >
          <Calendar className="h-4 w-4 text-teal-700" />
          <span>Generate Tagihan Baru</span>
        </button>
      </div>

      {/* 4 Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4 rounded-xl bg-white border border-slate-300 shadow-2xs">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wide">
            Total Target Tagihan
          </span>
          <h3 className="mt-2 text-2xl font-black text-slate-900 tracking-tight">
            {formatRupiah(totalBillsAmount)}
          </h3>
          <p className="text-xs text-slate-400 mt-1">{bills.length} rumah terdaftar</p>
        </div>

        <div className="p-4 rounded-xl bg-white border border-slate-300 shadow-2xs">
          <span className="text-xs font-bold text-emerald-800 uppercase tracking-wide">
            Sudah Lunas
          </span>
          <h3 className="mt-2 text-2xl font-black text-emerald-700 tracking-tight">
            {countPaid}{" "}
            <span className="text-xs font-medium text-slate-400">/ {bills.length} KK</span>
          </h3>
          <p className="text-xs text-emerald-700 font-semibold mt-1">
            Terkumpul: {formatRupiah(totalCollected)}
          </p>
        </div>

        <div className="p-4 rounded-xl bg-white border border-slate-300 shadow-2xs">
          <span className="text-xs font-bold text-rose-800 uppercase tracking-wide">
            Belum Bayar
          </span>
          <h3 className="mt-2 text-2xl font-black text-rose-700 tracking-tight">
            {countUnpaid}{" "}
            <span className="text-xs font-medium text-slate-400">KK</span>
          </h3>
          <p className="text-xs text-rose-700 font-semibold mt-1">Perlu penagihan</p>
        </div>

        <div className="p-4 rounded-xl bg-white border border-slate-300 shadow-2xs">
          <span className="text-xs font-bold text-amber-800 uppercase tracking-wide">
            Bayar Sebagian
          </span>
          <h3 className="mt-2 text-2xl font-black text-amber-700 tracking-tight">
            {countPartial}{" "}
            <span className="text-xs font-medium text-slate-400">KK</span>
          </h3>
          <p className="text-xs text-slate-400 mt-1">Menunggu pelunasan</p>
        </div>
      </div>

      {/* Filter, Search & Tabs */}
      <div className="space-y-3">
        {/* Status Tabs */}
        <div className="flex border-b border-slate-200 gap-2 overflow-x-auto pb-px">
          {[
            { id: "all", label: "Semua Tagihan", count: bills.length },
            { id: "paid", label: "Sudah Lunas", count: countPaid },
            { id: "unpaid", label: "Belum Bayar", count: countUnpaid },
            { id: "partial", label: "Bayar Sebagian", count: countPartial },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`pb-3 px-3 text-xs font-bold transition flex items-center gap-2 border-b-2 whitespace-nowrap ${
                activeTab === tab.id
                  ? "border-teal-700 text-teal-800"
                  : "border-transparent text-slate-500 hover:text-slate-800"
              }`}
            >
              <span>{tab.label}</span>
              <span
                className={`text-[10px] px-1.5 py-0.2 rounded-full font-semibold ${
                  activeTab === tab.id
                    ? "bg-teal-100 text-teal-800"
                    : "bg-slate-100 text-slate-500"
                }`}
              >
                {tab.count}
              </span>
            </button>
          ))}
        </div>

        {/* Search & Block Filter */}
        <div className="p-4 rounded-xl bg-white border border-slate-300 shadow-2xs flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="relative flex-1 w-full max-w-md">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Cari nama kepala keluarga atau nomor rumah..."
              className="w-full pl-9 pr-4 py-2 text-xs rounded-xl border border-slate-300 focus:outline-hidden focus:border-teal-600 font-medium"
            />
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <select
              value={selectedHouseStatus}
              onChange={(e) => setSelectedHouseStatus(e.target.value)}
              className="w-full sm:w-auto px-3 py-2 text-xs rounded-xl border border-slate-300 bg-white font-semibold text-slate-700"
            >
              <option value="all">Semua Status Rumah</option>
              <option value="tetap">Rumah Tetap (Rp 10.000)</option>
              <option value="kontrakan">Rumah Kontrakan (Rp 5.000)</option>
            </select>
          </div>
        </div>
      </div>

      {/* Bills Table */}
      <div className="rounded-xl bg-white border border-slate-300 shadow-2xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 font-bold text-slate-600">
                <th className="py-3 px-4">Nomor Rumah & Status</th>
                <th className="py-3 px-4">Nama Kepala Keluarga</th>
                <th className="py-3 px-4">Periode</th>
                <th className="py-3 px-4">Tarif Wajib</th>
                <th className="py-3 px-4">Terbayar</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4">Metode & Tanggal</th>
                <th className="py-3 px-4 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredBills.length > 0 ? (
                filteredBills.map((bill) => {
                  const isKontrakan = bill.house_status === "kontrakan" || bill.amount === 5000;
                  return (
                    <tr key={bill.id} className="hover:bg-slate-50 transition">
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2">
                          <span className="font-mono font-bold text-slate-900 bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
                            {bill.house_number}
                          </span>
                          <span
                            className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                              isKontrakan
                                ? "bg-amber-50 text-amber-700 border-amber-200"
                                : "bg-blue-50 text-blue-700 border-blue-200"
                            }`}
                          >
                            {isKontrakan ? "Kontrakan" : "Rumah Tetap"}
                          </span>
                        </div>
                      </td>
                      <td className="py-3 px-4 font-bold text-slate-900">
                        {bill.household_name}
                      </td>
                      <td className="py-3 px-4 text-slate-600">{bill.period}</td>
                      <td className="py-3 px-4 font-bold text-slate-900">
                        {formatRupiah(bill.amount)}
                      </td>
                      <td className="py-3 px-4 font-bold text-emerald-700">
                        {formatRupiah(bill.paid_amount || 0)}
                      </td>
                      <td className="py-3 px-4">
                        <StatusBadge status={bill.status} />
                      </td>
                      <td className="py-3 px-4 text-slate-500">
                        {bill.paid_at ? (
                          <div>
                            <p className="font-semibold text-slate-700 capitalize">
                              {bill.method || "Transfer"}
                            </p>
                            <p className="text-[10px] text-slate-400">{bill.paid_at}</p>
                          </div>
                        ) : (
                          <span className="text-slate-400 italic">Jatuh tempo: {bill.due_date}</span>
                        )}
                      </td>
                      <td className="py-3 px-4 text-right">
                        <button
                          onClick={() => openPaymentModal(bill)}
                          className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-teal-700 hover:bg-teal-800 text-white font-bold text-xs shadow-2xs transition"
                        >
                          <CreditCard className="w-3.5 h-3.5" />
                          <span>Update Bayar</span>
                        </button>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={8} className="py-8 text-center text-xs text-slate-400">
                    Tidak ada tagihan yang sesuai kriteria pencarian Anda.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Payment Recording Modal */}
      {selectedBill && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 backdrop-blur-xs">
          <div className="bg-white rounded-2xl border border-slate-300 max-w-md w-full p-6 shadow-2xl space-y-4 animate-in fade-in zoom-in-95 duration-150">
            <div>
              <h3 className="text-lg font-black text-slate-900">Catat Pembayaran Iuran</h3>
              <p className="text-xs text-slate-500">
                Rumah <span className="font-bold text-slate-800">{selectedBill.house_number}</span> (
                {selectedBill.household_name}) ·{" "}
                <span className="font-semibold text-teal-800">
                  {selectedBill.house_status === "kontrakan" || selectedBill.amount === 5000
                    ? "Kontrakan (Rp 5.000/bln)"
                    : "Rumah Tetap (Rp 10.000/bln)"}
                </span>{" "}
                · {selectedBill.period}
              </p>
            </div>

            <form onSubmit={handleSavePayment} className="space-y-3.5">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  Status Pembayaran
                </label>
                <select
                  value={paymentForm.status}
                  onChange={(e) =>
                    setPaymentForm({
                      ...paymentForm,
                      status: e.target.value as PaymentStatus,
                      paid_amount:
                        e.target.value === "paid"
                          ? selectedBill.amount
                          : e.target.value === "unpaid"
                          ? 0
                          : paymentForm.paid_amount,
                    })
                  }
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 font-bold text-slate-800"
                >
                  <option value="paid">Sudah Lunas</option>
                  <option value="partial">Bayar Sebagian (Cicil)</option>
                  <option value="unpaid">Belum Bayar</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  Nominal yang Dibayarkan (Rp)
                </label>
                <input
                  type="number"
                  min="0"
                  max={selectedBill.amount}
                  value={paymentForm.paid_amount}
                  onChange={(e) =>
                    setPaymentForm({ ...paymentForm, paid_amount: Number(e.target.value) })
                  }
                  disabled={paymentForm.status === "unpaid"}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 focus:border-teal-600 font-bold"
                />
                <p className="text-[10px] text-slate-400 mt-1">
                  Total tagihan wajib: {formatRupiah(selectedBill.amount)}
                </p>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  Metode Pembayaran
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setPaymentForm({ ...paymentForm, method: "transfer" })}
                    className={`py-2 text-xs font-bold rounded-xl border transition ${
                      paymentForm.method === "transfer"
                        ? "bg-teal-700 text-white border-teal-700 shadow-xs"
                        : "bg-white text-slate-700 border-slate-300 hover:bg-slate-50"
                    }`}
                  >
                    Transfer Bank / QRIS
                  </button>
                  <button
                    type="button"
                    onClick={() => setPaymentForm({ ...paymentForm, method: "cash" })}
                    className={`py-2 text-xs font-bold rounded-xl border transition ${
                      paymentForm.method === "cash"
                        ? "bg-teal-700 text-white border-teal-700 shadow-xs"
                        : "bg-white text-slate-700 border-slate-300 hover:bg-slate-50"
                    }`}
                  >
                    Tunai (Cash ke Pengurus)
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  Catatan Pembayaran (Opsional)
                </label>
                <input
                  type="text"
                  placeholder="Contoh: Bukti transfer BCA tgl 8 Sep"
                  value={paymentForm.notes}
                  onChange={(e) => setPaymentForm({ ...paymentForm, notes: e.target.value })}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 focus:border-teal-600"
                />
              </div>

              <div className="pt-3 border-t border-slate-100 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setSelectedBill(null)}
                  className="px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-xl transition"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-bold text-white bg-teal-700 hover:bg-teal-800 rounded-xl transition shadow-sm"
                >
                  Simpan Status
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
