"use client";

import React, { useState } from "react";
import {
  Users,
  Search,
  Plus,
  Copy,
  Check,
  Building,
  Filter,
  ExternalLink,
  CheckCircle2,
  XCircle,
} from "lucide-react";
import { formatRupiah } from "@/lib/mockData";
import { Household, Block } from "@/types/database";
import { createHouseholdAction, toggleHouseholdStatusAction } from "@/actions/householdActions";

interface HouseholdsClientProps {
  initialHouseholds: Household[];
  blocks: Block[];
}

export const HouseholdsClient: React.FC<HouseholdsClientProps> = ({
  initialHouseholds,
  blocks,
}) => {
  const [households, setHouseholds] = useState<Household[]>(initialHouseholds);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedHouseStatus, setSelectedHouseStatus] = useState("all");
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  // New Household modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState<{
    house_status: "tetap" | "kontrakan";
    house_number: string;
    head_of_family_name: string;
    contact: string;
  }>({
    house_status: "tetap",
    house_number: "",
    head_of_family_name: "",
    contact: "",
  });

  const handleCopyCode = (code: string) => {
    navigator.clipboard.writeText(`${window.location.origin}/status/${code}`);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  const handleAddHousehold = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.house_number || !formData.head_of_family_name) return;

    try {
      const response = await fetch("/api/households", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          house_status: formData.house_status,
          house_number: formData.house_number,
          head_of_family_name: formData.head_of_family_name,
          contact: formData.contact,
          is_active: true,
        }),
      });
      const result = await response.json();
      if (result.success && result.data) {
        setHouseholds([result.data, ...households]);
        setIsModalOpen(false);
        setFormData({
          house_status: "tetap",
          house_number: "",
          head_of_family_name: "",
          contact: "",
        });
        return;
      }
    } catch (err) {
      console.warn("API household fallback to server action:", err);
    }

    const res = await createHouseholdAction({
      house_status: formData.house_status,
      house_number: formData.house_number,
      head_of_family_name: formData.head_of_family_name,
      contact: formData.contact,
      is_active: true,
    });

    if (res.success && res.data) {
      setHouseholds([res.data, ...households]);
      setIsModalOpen(false);
      setFormData({
        house_status: "tetap",
        house_number: "",
        head_of_family_name: "",
        contact: "",
      });
    } else {
      alert(res.error || "Gagal menambahkan data warga");
    }
  };

  const toggleHouseholdStatus = async (id: string) => {
    const current = households.find((h) => h.id === id);
    if (!current) return;
    const nextStatus = !current.is_active;

    const res = await toggleHouseholdStatusAction(id, nextStatus);
    if (res.success) {
      setHouseholds(
        households.map((h) => (h.id === id ? { ...h, is_active: nextStatus } : h))
      );
    }
  };

  const filteredHouseholds = households.filter((h) => {
    const matchesSearch =
      h.head_of_family_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      h.house_number.toLowerCase().includes(searchQuery.toLowerCase()) ||
      h.access_code.toLowerCase().includes(searchQuery.toLowerCase());

    const currentHouseStatus = h.house_status || "tetap";
    const matchesHouseStatus =
      selectedHouseStatus === "all" || currentHouseStatus === selectedHouseStatus;
    const matchesStatus =
      selectedStatus === "all" ||
      (selectedStatus === "active" ? h.is_active : !h.is_active);

    return matchesSearch && matchesHouseStatus && matchesStatus;
  });

  // Calculate stats by house status
  const tetapHouses = households.filter((h) => (h.house_status || "tetap") === "tetap");
  const tetapActive = tetapHouses.filter((h) => h.is_active).length;

  const kontrakanHouses = households.filter((h) => h.house_status === "kontrakan");
  const kontrakanActive = kontrakanHouses.filter((h) => h.is_active).length;

  const totalActiveHouses = tetapActive + kontrakanActive;
  const potentialMonthlyIncome = tetapActive * 10000 + kontrakanActive * 5000;

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <p className="text-[11px] font-bold tracking-wider text-slate-400 uppercase">
            Data Master
          </p>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            Data Warga & Status Rumah
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Tarif iuran otomatis berdasarkan status: <strong>Rumah Tetap (Rp 10.000)</strong> & <strong>Kontrakan (Rp 5.000)</strong>.
          </p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-teal-700 px-4 py-2.5 text-xs font-bold text-white shadow-sm hover:bg-teal-800 transition active:scale-95"
        >
          <Plus className="h-4 w-4" />
          <span>Tambah Data Rumah</span>
        </button>
      </div>

      {/* House Status Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* Rumah Tetap */}
        <div className="p-4 rounded-xl bg-white border border-slate-300 border-t-4 border-t-blue-600 shadow-2xs hover:border-blue-400 transition">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">
              Rumah Tetap / Milik
            </span>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200">
              Rp 10.000 / bln
            </span>
          </div>
          <div className="mt-3 flex items-baseline justify-between">
            <div>
              <h3 className="text-2xl font-black text-slate-900">{tetapHouses.length}</h3>
              <p className="text-[11px] text-slate-400">Total terdata</p>
            </div>
            <div className="text-right">
              <span className="text-sm font-bold text-emerald-700">{tetapActive}</span>
              <p className="text-[10px] text-slate-400">Aktif membayar</p>
            </div>
          </div>
          <div className="mt-3 pt-2 border-t border-slate-100 text-[11px] text-slate-500 flex justify-between">
            <span>Potensi: {formatRupiah(tetapActive * 10000)}</span>
            <span className="font-semibold text-blue-700">Tarif Warga Tetap</span>
          </div>
        </div>

        {/* Rumah Kontrakan */}
        <div className="p-4 rounded-xl bg-white border border-slate-300 border-t-4 border-t-amber-500 shadow-2xs hover:border-amber-400 transition">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">
              Rumah Kontrakan
            </span>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-50 text-amber-700 border border-amber-200">
              Rp 5.000 / bln
            </span>
          </div>
          <div className="mt-3 flex items-baseline justify-between">
            <div>
              <h3 className="text-2xl font-black text-slate-900">{kontrakanHouses.length}</h3>
              <p className="text-[11px] text-slate-400">Total terdata</p>
            </div>
            <div className="text-right">
              <span className="text-sm font-bold text-emerald-700">{kontrakanActive}</span>
              <p className="text-[10px] text-slate-400">Aktif membayar</p>
            </div>
          </div>
          <div className="mt-3 pt-2 border-t border-slate-100 text-[11px] text-slate-500 flex justify-between">
            <span>Potensi: {formatRupiah(kontrakanActive * 5000)}</span>
            <span className="font-semibold text-amber-700">Tarif Kontrakan</span>
          </div>
        </div>

        {/* Total Keseluruhan */}
        <div className="p-4 rounded-xl bg-white border border-slate-300 border-t-4 border-t-teal-600 shadow-2xs hover:border-teal-400 transition">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">
              Target Kas Bulanan
            </span>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-teal-50 text-teal-700 border border-teal-200">
              {totalActiveHouses} Rumah Aktif
            </span>
          </div>
          <div className="mt-3 flex items-baseline justify-between">
            <div>
              <h3 className="text-2xl font-black text-slate-900">
                {formatRupiah(potentialMonthlyIncome)}
              </h3>
              <p className="text-[11px] text-slate-400">Total per bulan</p>
            </div>
            <div className="text-right">
              <span className="text-sm font-bold text-slate-800">{households.length}</span>
              <p className="text-[10px] text-slate-400">Total rumah terdaftar</p>
            </div>
          </div>
          <div className="mt-3 pt-2 border-t border-slate-100 text-[11px] text-slate-500 flex justify-between">
            <span>Sistem Tarif: Berbasis Status Rumah</span>
          </div>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="p-4 rounded-xl bg-white border border-slate-300 shadow-2xs space-y-3 sm:space-y-0 sm:flex sm:items-center sm:justify-between gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Cari kepala keluarga, nomor rumah, atau kode akses..."
            className="w-full pl-9 pr-4 py-2 text-xs rounded-xl border border-slate-300 focus:outline-hidden focus:border-teal-600 font-medium"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* House Status Filter */}
          <select
            value={selectedHouseStatus}
            onChange={(e) => setSelectedHouseStatus(e.target.value)}
            className="px-3 py-2 text-xs rounded-xl border border-slate-300 bg-white font-semibold text-slate-700"
          >
            <option value="all">Semua Status Rumah</option>
            <option value="tetap">Rumah Tetap (Rp 10.000/bln)</option>
            <option value="kontrakan">Rumah Kontrakan (Rp 5.000/bln)</option>
          </select>

          {/* Status Hunian Filter */}
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="px-3 py-2 text-xs rounded-xl border border-slate-300 bg-white font-semibold text-slate-700"
          >
            <option value="all">Semua Status Hunian</option>
            <option value="active">Rumah Berpenghuni (Aktif)</option>
            <option value="inactive">Rumah Kosong (Nonaktif)</option>
          </select>
        </div>
      </div>

      {/* Households Table */}
      <div className="rounded-xl bg-white border border-slate-300 shadow-2xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 font-bold text-slate-600">
                <th className="py-3 px-4">Nomor Rumah</th>
                <th className="py-3 px-4">Status & Tarif</th>
                <th className="py-3 px-4">Nama Kepala Keluarga</th>
                <th className="py-3 px-4">Kontak / No. WA</th>
                <th className="py-3 px-4">Kode Akses Warga</th>
                <th className="py-3 px-4 text-center">Status Hunian</th>
                <th className="py-3 px-4 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredHouseholds.length > 0 ? (
                filteredHouseholds.map((h) => {
                  const isKontrakan = h.house_status === "kontrakan";
                  return (
                    <tr key={h.id} className="hover:bg-slate-50 transition">
                      <td className="py-3 px-4">
                        <span className="font-mono font-bold text-slate-900 bg-slate-100 px-2.5 py-1 rounded-md border border-slate-200">
                          {h.house_number}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <span
                          className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full font-bold text-[10px] border ${
                            isKontrakan
                              ? "bg-amber-50 text-amber-800 border-amber-200"
                              : "bg-blue-50 text-blue-800 border-blue-200"
                          }`}
                        >
                          {isKontrakan ? "Kontrakan · Rp 5.000" : "Tetap · Rp 10.000"}
                        </span>
                      </td>
                      <td className="py-3 px-4 font-bold text-slate-900">
                        {h.head_of_family_name}
                      </td>
                      <td className="py-3 px-4 text-slate-500">{h.contact || "-"}</td>
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2">
                          <span className="font-mono font-bold text-teal-800 bg-teal-50 px-2 py-0.5 rounded border border-teal-200">
                            {h.access_code}
                          </span>
                          <button
                            onClick={() => handleCopyCode(h.access_code)}
                            title="Salin tautan portal warga"
                            className="p-1 rounded hover:bg-slate-200 text-slate-500 transition"
                          >
                            {copiedCode === h.access_code ? (
                              <Check className="w-3.5 h-3.5 text-emerald-600" />
                            ) : (
                              <Copy className="w-3.5 h-3.5" />
                            )}
                          </button>
                        </div>
                      </td>
                      <td className="py-3 px-4 text-center">
                        <button
                          onClick={() => toggleHouseholdStatus(h.id)}
                          className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold transition ${
                            h.is_active
                              ? "bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100"
                              : "bg-slate-100 text-slate-500 border border-slate-200 hover:bg-slate-200"
                          }`}
                        >
                          {h.is_active ? (
                            <>
                              <CheckCircle2 className="w-3 h-3" />
                              <span>Berpenghuni</span>
                            </>
                          ) : (
                            <>
                              <XCircle className="w-3 h-3" />
                              <span>Rumah Kosong</span>
                            </>
                          )}
                        </button>
                      </td>
                      <td className="py-3 px-4 text-right">
                        <a
                          href={`/status/${h.access_code}`}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg border border-slate-300 text-slate-600 hover:bg-slate-100 font-bold text-[11px] transition"
                        >
                          <ExternalLink className="w-3 h-3 text-teal-700" />
                          <span>Lihat Portal</span>
                        </a>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-xs text-slate-400">
                    Tidak ada data warga yang cocok dengan pencarian Anda.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Household Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 backdrop-blur-xs">
          <div className="bg-white rounded-2xl border border-slate-300 max-w-md w-full p-6 shadow-2xl space-y-4 animate-in fade-in zoom-in-95 duration-150">
            <div>
              <h3 className="text-lg font-black text-slate-900">Tambah Data Warga Baru</h3>
              <p className="text-xs text-slate-500">
                Pilih status kepemilikan rumah untuk menentukan tarif iuran bulanan secara otomatis.
              </p>
            </div>

            <form onSubmit={handleAddHousehold} className="space-y-3.5">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  Status Rumah & Tarif Iuran
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, house_status: "tetap" })}
                    className={`p-2.5 rounded-xl border text-left transition flex flex-col justify-between ${
                      formData.house_status === "tetap"
                        ? "border-blue-600 bg-blue-50/70 text-blue-900 ring-2 ring-blue-500/20"
                        : "border-slate-300 bg-white text-slate-700 hover:border-slate-400"
                    }`}
                  >
                    <span className="text-xs font-bold">Rumah Tetap</span>
                    <span className="text-[11px] text-blue-700 font-semibold mt-1">Rp 10.000 / bln</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, house_status: "kontrakan" })}
                    className={`p-2.5 rounded-xl border text-left transition flex flex-col justify-between ${
                      formData.house_status === "kontrakan"
                        ? "border-amber-600 bg-amber-50/70 text-amber-900 ring-2 ring-amber-500/20"
                        : "border-slate-300 bg-white text-slate-700 hover:border-slate-400"
                    }`}
                  >
                    <span className="text-xs font-bold">Kontrakan</span>
                    <span className="text-[11px] text-amber-700 font-semibold mt-1">Rp 5.000 / bln</span>
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  Nomor Rumah
                </label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: A-15 atau D-18"
                  value={formData.house_number}
                  onChange={(e) => setFormData({ ...formData, house_number: e.target.value })}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 focus:border-teal-600 font-bold"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  Nama Kepala Keluarga
                </label>
                <input
                  type="text"
                  required
                  placeholder="Nama lengkap kepala keluarga"
                  value={formData.head_of_family_name}
                  onChange={(e) =>
                    setFormData({ ...formData, head_of_family_name: e.target.value })
                  }
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 focus:border-teal-600 font-semibold"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  Nomor WhatsApp / Kontak (Opsional)
                </label>
                <input
                  type="text"
                  placeholder="Contoh: 0812-3456-7890"
                  value={formData.contact}
                  onChange={(e) => setFormData({ ...formData, contact: e.target.value })}
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
                  Simpan Data Warga
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
