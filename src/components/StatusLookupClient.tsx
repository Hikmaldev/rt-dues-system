"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, ArrowRight, Key } from "lucide-react";
import { Household } from "@/types/database";

interface StatusLookupClientProps {
  initialHouseholds: Household[];
}

export const StatusLookupClient: React.FC<StatusLookupClientProps> = ({
  initialHouseholds,
}) => {
  const [code, setCode] = useState("");
  const router = useRouter();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!code.trim()) return;
    router.push(`/status/${code.trim().toUpperCase()}`);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-between">
      {/* Header */}
      <header className="w-full bg-white border-b border-slate-200 py-4 px-4 sm:px-8 flex justify-between items-center">
        <Link
          href="/"
          className="flex items-center gap-2 text-xs font-bold text-slate-600 hover:text-teal-700"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Kembali ke Beranda</span>
        </Link>
        <span className="text-xs font-bold text-teal-800 bg-teal-50 px-2.5 py-1 rounded-full border border-teal-200">
          RT 05 / RW 02
        </span>
      </header>

      {/* Main Container */}
      <main className="max-w-md mx-auto px-4 py-12 w-full flex-1 flex flex-col justify-center">
        <div className="text-center mb-8">
          <div className="w-12 h-12 rounded-2xl bg-teal-700 text-white flex items-center justify-center mx-auto mb-3 shadow-sm font-bold text-xl">
            R
          </div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">
            Cek Status Iuran Rumah
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Masukkan kode akses rumah Anda untuk melihat tagihan dan riwayat pembayaran.
          </p>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-300 shadow-xl shadow-teal-900/5">
          <form onSubmit={handleSearch} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                Kode Akses Rumah
              </label>
              <div className="relative mt-1">
                <Key className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  required
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  placeholder="Contoh: RH-A7-X8K2"
                  className="w-full pl-9 pr-3 py-2.5 text-xs rounded-xl border border-slate-300 focus:border-teal-600 uppercase font-mono tracking-wider font-bold text-slate-800"
                />
              </div>
              <p className="text-[10px] text-slate-400 mt-1">
                Kode tertera pada selebaran resmi atau pesan WhatsApp dari bendahara RT.
              </p>
            </div>

            <button
              type="submit"
              className="w-full inline-flex items-center justify-center gap-2 py-3 rounded-xl bg-teal-700 hover:bg-teal-800 text-white font-bold text-xs shadow-sm transition active:scale-95"
            >
              <span>Buka Status Iuran</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>
        </div>

        {/* Dynamic Examples from DB */}
        <div className="mt-8 bg-slate-100/80 rounded-xl p-4 border border-slate-200 text-xs text-slate-600">
          <p className="font-bold text-slate-700 mb-2">Contoh Kode Akses Warga RT 05:</p>
          <div className="space-y-1.5">
            {initialHouseholds.slice(0, 4).map((h) => (
              <div key={h.id} className="flex justify-between items-center text-[11px]">
                <span>
                  {h.head_of_family_name} ({h.house_number})
                </span>
                <Link
                  href={`/status/${h.access_code}`}
                  className="font-mono font-bold text-teal-700 hover:underline"
                >
                  {h.access_code} →
                </Link>
              </div>
            ))}
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="w-full py-4 text-center text-xs text-slate-400 border-t border-slate-200">
        © 2026 RTHub · Sistem Iuran RT 05
      </footer>
    </div>
  );
};
