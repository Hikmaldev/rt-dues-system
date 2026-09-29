"use client";

import React, { useState } from "react";
import {
  PieChart,
  Plus,
  Shield,
  Trash2,
  Zap,
  Users,
  Search,
  CheckCircle2,
} from "lucide-react";
import { formatRupiah } from "@/lib/mockData";
import { FundUsage } from "@/types/database";
import { createFundUsageAction } from "@/actions/fundUsageActions";

interface FundUsageClientProps {
  initialUsages: FundUsage[];
  totalIncome: number;
}

export const FundUsageClient: React.FC<FundUsageClientProps> = ({
  initialUsages,
  totalIncome,
}) => {
  const [usages, setUsages] = useState<FundUsage[]>(initialUsages);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    category: "Keamanan Lingkungan & Satpam",
    amount: "",
    description: "",
    period: "September 2026",
  });

  const totalExpense = usages.reduce((acc, curr) => acc + curr.amount, 0);
  const balance = totalIncome - totalExpense;

  const handleAddUsage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.amount || !formData.description) return;

    const res = await createFundUsageAction({
      period: formData.period,
      category: formData.category,
      amount: Number(formData.amount),
      description: formData.description,
    });

    if (res.success && res.data) {
      setUsages([res.data, ...usages]);
      setIsModalOpen(false);
      setFormData({
        category: "Keamanan Lingkungan & Satpam",
        amount: "",
        description: "",
        period: "September 2026",
      });
    } else {
      alert(res.error || "Gagal menyimpan pengeluaran kas");
    }
  };

  const getIcon = (category: string) => {
    if (category.includes("Keamanan")) return <Shield className="w-4 h-4 text-teal-700" />;
    if (category.includes("Kebersihan")) return <Trash2 className="w-4 h-4 text-emerald-700" />;
    if (category.includes("Penerangan") || category.includes("Listrik"))
      return <Zap className="w-4 h-4 text-amber-700" />;
    return <Users className="w-4 h-4 text-indigo-700" />;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <p className="text-[11px] font-bold tracking-wider text-slate-400 uppercase">
            Transparansi Kas
          </p>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            Catatan Penggunaan Dana RT
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Kelola rincian pengeluaran dana kas RT untuk ditampilkan di halaman publik warga.
          </p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-teal-700 px-4 py-2.5 text-xs font-bold text-white shadow-sm hover:bg-teal-800 transition active:scale-95"
        >
          <Plus className="h-4 w-4" />
          <span>Tambah Pengeluaran</span>
        </button>
      </div>

      {/* 3 Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="rounded-xl bg-white border border-slate-300 p-4 shadow-2xs">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wide">
            Total Iuran Masuk (Bulan Ini)
          </span>
          <h3 className="mt-2 text-2xl font-black text-slate-900 tracking-tight">
            {formatRupiah(totalIncome)}
          </h3>
          <p className="text-xs text-emerald-700 font-semibold mt-1">
            Tersinkronisasi dari penerimaan iuran
          </p>
        </div>

        <div className="rounded-xl bg-white border border-slate-300 p-4 shadow-2xs">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wide">
            Total Pengeluaran Kas
          </span>
          <h3 className="mt-2 text-2xl font-black text-rose-700 tracking-tight">
            {formatRupiah(totalExpense)}
          </h3>
          <p className="text-xs text-slate-500 mt-1">{usages.length} pos kegiatan tercatat</p>
        </div>

        <div className="rounded-xl bg-teal-50/60 border border-teal-300 p-4 shadow-2xs">
          <span className="text-xs font-bold text-teal-900 uppercase tracking-wide">
            Sisa Saldo Kas Berjalan
          </span>
          <h3 className="mt-2 text-2xl font-black text-teal-950 tracking-tight">
            {formatRupiah(balance)}
          </h3>
          <p className="text-xs text-teal-800 font-semibold mt-1">Status surplus kas RT</p>
        </div>
      </div>

      {/* Expenditures Table */}
      <div className="rounded-xl bg-white border border-slate-300 shadow-2xs overflow-hidden">
        <div className="p-4 border-b border-slate-200 flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold text-slate-900">
              Daftar Alokasi Pengeluaran Kas
            </h3>
            <p className="text-xs text-slate-500">
              Data yang dicatat di sini otomatis dapat dilihat warga di halaman Transparansi Publik.
            </p>
          </div>
          <span className="text-xs font-bold text-teal-800 bg-teal-50 px-2.5 py-1 rounded-full border border-teal-200">
            Publikasi Aktif
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 font-bold text-slate-600">
                <th className="py-3 px-4">Kategori Pengeluaran</th>
                <th className="py-3 px-4">Periode</th>
                <th className="py-3 px-4">Deskripsi / Peruntukan</th>
                <th className="py-3 px-4 text-right">Nominal Biaya</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {usages.map((u) => (
                <tr key={u.id} className="hover:bg-slate-50 transition">
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center shrink-0">
                        {getIcon(u.category)}
                      </div>
                      <span className="font-bold text-slate-800">{u.category}</span>
                    </div>
                  </td>
                  <td className="py-3 px-4 text-slate-500 font-medium">{u.period}</td>
                  <td className="py-3 px-4 text-slate-600 max-w-md">{u.description}</td>
                  <td className="py-3 px-4 text-right font-bold text-rose-700">
                    {formatRupiah(u.amount)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Usage Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 backdrop-blur-xs">
          <div className="bg-white rounded-2xl border border-slate-300 max-w-md w-full p-6 shadow-2xl space-y-4 animate-in fade-in zoom-in-95 duration-150">
            <div>
              <h3 className="text-lg font-black text-slate-900">Catat Pengeluaran Kas Baru</h3>
              <p className="text-xs text-slate-500">
                Rincian ini akan tampil secara terbuka pada portal transparansi warga.
              </p>
            </div>

            <form onSubmit={handleAddUsage} className="space-y-3.5">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  Periode Bulan
                </label>
                <input
                  type="text"
                  required
                  value={formData.period}
                  onChange={(e) => setFormData({ ...formData, period: e.target.value })}
                  placeholder="Contoh: September 2026"
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 font-bold"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  Kategori
                </label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 font-semibold text-slate-800"
                >
                  <option value="Keamanan Lingkungan & Satpam">
                    Keamanan Lingkungan & Satpam
                  </option>
                  <option value="Kebersihan & Pengangkutan Sampah">
                    Kebersihan & Pengangkutan Sampah
                  </option>
                  <option value="Penerangan Jalan & Fasilitas Umum">
                    Penerangan Jalan & Fasilitas Umum
                  </option>
                  <option value="Kegiatan Sosial & Warga">Kegiatan Sosial & Warga</option>
                  <option value="Pemeliharaan Infrastruktur RT">
                    Pemeliharaan Infrastruktur RT
                  </option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  Nominal Pengeluaran (Rp)
                </label>
                <input
                  type="number"
                  required
                  min="1000"
                  placeholder="Contoh: 1500000"
                  value={formData.amount}
                  onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 focus:border-teal-600 font-bold"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  Deskripsi / Keterangan Pembelian
                </label>
                <textarea
                  required
                  rows={3}
                  placeholder="Contoh: Gaji satpam jaga malam pos utama..."
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 focus:border-teal-600"
                />
              </div>

              <div className="pt-3 border-t border-slate-100 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-xl transition"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-bold text-white bg-teal-700 hover:bg-teal-800 rounded-xl transition shadow-sm"
                >
                  Simpan Pengeluaran
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
