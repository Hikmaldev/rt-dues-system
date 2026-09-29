"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Search,
  PieChart,
  Lock,
  ArrowRight,
  Home,
  Sparkles,
} from "lucide-react";
import { Household } from "@/types/database";

interface HomeClientProps {
  featuredHouseholds: Household[];
}

export const HomeClient: React.FC<HomeClientProps> = ({ featuredHouseholds }) => {
  const [accessCode, setAccessCode] = useState("");
  const router = useRouter();

  const handleSearchCode = (e: React.FormEvent) => {
    e.preventDefault();
    if (!accessCode.trim()) return;
    const cleanCode = accessCode.trim().toUpperCase();
    router.push(`/status/${cleanCode}`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-teal-50/60 via-slate-50 to-slate-100 flex flex-col justify-between">
      {/* Top Navbar */}
      <header className="w-full border-b border-slate-200/80 bg-white/80 backdrop-blur-md sticky top-0 z-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img
              src="/icon.svg"
              alt="RTHub Logo"
              className="h-9 w-9 rounded-xl shadow-xs"
            />
            <div>
              <span className="text-lg font-black tracking-tight text-slate-800">
                RT<span className="text-teal-700">Hub</span>
              </span>
              <p className="text-[10px] font-medium text-slate-500">RT 05 / RW 02</p>
            </div>
          </div>

          <nav className="flex items-center gap-3 sm:gap-4 text-xs font-semibold">
            <Link
              href="/transparency"
              className="text-slate-600 hover:text-teal-700 hidden sm:inline-block"
            >
              Transparansi Dana
            </Link>
            <Link
              href="/admin/login"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-300 text-slate-700 hover:bg-slate-100 transition"
            >
              <Lock className="w-3.5 h-3.5 text-teal-700" />
              <span>Login Pengurus</span>
            </Link>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <main className="max-w-4xl mx-auto px-4 py-12 sm:py-16 w-full flex-1 flex flex-col justify-center items-center text-center">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-100/80 border border-teal-200 text-teal-800 text-xs font-bold mb-6">
          <Sparkles className="w-3.5 h-3.5 text-teal-600" />
          <span>Sistem Iuran Warga Digital RT 05</span>
        </div>

        <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-slate-900 leading-tight">
          Cek Status Iuran Rumah <br className="hidden sm:inline" />
          <span className="text-teal-700">Mudah, Terbuka, & Mandiri</span>
        </h1>

        <p className="mt-4 text-sm sm:text-base text-slate-600 max-w-xl">
          Warga dapat mengecek riwayat pembayaran tanpa perlu login akun. Pengurus mengelola data
          dengan aman dan transparan.
        </p>

        {/* Access Code Search Box */}
        <div className="mt-8 w-full max-w-md bg-white p-2 sm:p-2.5 rounded-2xl border-2 border-slate-300 shadow-lg shadow-teal-900/5">
          <form onSubmit={handleSearchCode} className="flex flex-col sm:flex-row gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3.5 top-3.5 w-4 h-4 text-slate-400" />
              <input
                type="text"
                value={accessCode}
                onChange={(e) => setAccessCode(e.target.value)}
                placeholder="Masukkan Kode Akses Rumah (mis: RH-A7-X8K2)"
                className="w-full pl-10 pr-4 py-2.5 text-xs sm:text-sm rounded-xl border border-slate-200 focus:outline-hidden focus:border-teal-600 uppercase font-mono tracking-wider font-semibold placeholder:font-sans placeholder:normal-case placeholder:tracking-normal placeholder:font-normal"
              />
            </div>
            <button
              type="submit"
              className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-teal-700 hover:bg-teal-800 text-white font-bold text-xs sm:text-sm shadow-sm transition active:scale-95"
            >
              <span>Periksa</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>
        </div>

        {/* Dynamic Demo Quick Access from Backend */}
        {featuredHouseholds.length > 0 && (
          <div className="mt-4 text-xs text-slate-500 flex flex-wrap justify-center items-center gap-2">
            <span>Contoh kode rumah aktif:</span>
            {featuredHouseholds.slice(0, 3).map((h) => (
              <Link
                key={h.id}
                href={`/status/${h.access_code}`}
                className="font-mono font-bold text-teal-700 hover:underline bg-teal-50 px-2 py-0.5 rounded border border-teal-200"
              >
                {h.access_code} ({h.house_number})
              </Link>
            ))}
          </div>
        )}

        {/* Three Portal Cards */}
        <div className="mt-14 grid grid-cols-1 sm:grid-cols-3 gap-4 w-full text-left">
          <Link
            href="/status"
            className="group p-5 rounded-2xl bg-white border border-slate-300 hover:border-teal-500 shadow-xs hover:shadow-md transition flex flex-col justify-between"
          >
            <div>
              <div className="w-10 h-10 rounded-xl bg-teal-50 border border-teal-200 text-teal-700 flex items-center justify-center font-bold mb-4 group-hover:scale-105 transition">
                <Home className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-sm text-slate-800 group-hover:text-teal-700">
                Portal Warga
              </h3>
              <p className="mt-1 text-xs text-slate-500 leading-relaxed">
                Pantau tagihan bulan berjalan dan riwayat pembayaran iuran rumah Anda.
              </p>
            </div>
            <span className="mt-4 text-xs font-bold text-teal-700 inline-flex items-center gap-1 group-hover:translate-x-1 transition">
              Buka portal <ArrowRight className="w-3.5 h-3.5" />
            </span>
          </Link>

          <Link
            href="/transparency"
            className="group p-5 rounded-2xl bg-white border border-slate-300 hover:border-teal-500 shadow-xs hover:shadow-md transition flex flex-col justify-between"
          >
            <div>
              <div className="w-10 h-10 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-700 flex items-center justify-center font-bold mb-4 group-hover:scale-105 transition">
                <PieChart className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-sm text-slate-800 group-hover:text-teal-700">
                Transparansi Dana
              </h3>
              <p className="mt-1 text-xs text-slate-500 leading-relaxed">
                Laporan terbuka total dana terkumpul dan rincian alokasi pengeluaran RT.
              </p>
            </div>
            <span className="mt-4 text-xs font-bold text-teal-700 inline-flex items-center gap-1 group-hover:translate-x-1 transition">
              Lihat laporan <ArrowRight className="w-3.5 h-3.5" />
            </span>
          </Link>

          <Link
            href="/admin/dashboard"
            className="group p-5 rounded-2xl bg-white border border-slate-300 hover:border-teal-500 shadow-xs hover:shadow-md transition flex flex-col justify-between"
          >
            <div>
              <div className="w-10 h-10 rounded-xl bg-indigo-50 border border-indigo-200 text-indigo-700 flex items-center justify-center font-bold mb-4 group-hover:scale-105 transition">
                <Lock className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-sm text-slate-800 group-hover:text-teal-700">
                Dashboard Admin
              </h3>
              <p className="mt-1 text-xs text-slate-500 leading-relaxed">
                Kelola data warga, update pembayaran, dan ekspor pembukuan RT.
              </p>
            </div>
            <span className="mt-4 text-xs font-bold text-teal-700 inline-flex items-center gap-1 group-hover:translate-x-1 transition">
              Masuk sistem <ArrowRight className="w-3.5 h-3.5" />
            </span>
          </Link>
        </div>
      </main>

      {/* Footer */}
      <footer className="w-full border-t border-slate-200 bg-white py-6">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-3">
          <p>© 2026 RTHub · Sistem Iuran Warga RT 05 / RW 02</p>
          <div className="flex items-center gap-6">
            <Link href="/transparency" className="hover:text-teal-700">
              Laporan Kas RT
            </Link>
            <Link href="/admin/login" className="hover:text-teal-700">
              Login Pengurus
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
};
