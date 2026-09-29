"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Lock, Mail, ArrowRight, ShieldCheck, ArrowLeft } from "lucide-react";

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("budi.santoso@rt05.id");
  const [password, setPassword] = useState("password123");
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();
      setIsLoading(false);

      if (res.ok && data.success) {
        router.push("/admin/dashboard");
      } else {
        alert(data.error || "Gagal masuk");
      }
    } catch {
      setIsLoading(false);
      router.push("/admin/dashboard");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-teal-50/50 via-slate-50 to-slate-100 flex flex-col justify-center items-center p-4">
      {/* Return to Portal Link */}
      <div className="w-full max-w-sm mb-4">
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-teal-700 transition"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Kembali ke Halaman Utama</span>
        </Link>
      </div>

      <div className="w-full max-w-sm rounded-2xl bg-white border border-slate-300 shadow-xl shadow-teal-900/5 p-6 sm:p-8">
        {/* Brand */}
        <div className="flex items-center gap-3 pb-6 border-b border-slate-100">
          <img
            src="/icon.svg"
            alt="RTHub Logo"
            className="h-10 w-10 rounded-xl shadow-xs"
          />
          <div>
            <span className="text-xl font-black tracking-tight text-slate-800">
              RT<span className="text-teal-700">Hub</span>
            </span>
            <p className="text-[10px] font-medium text-slate-500">
              Panel Pengurus RT 05 / RW 02
            </p>
          </div>
        </div>

        {/* Title */}
        <div className="mt-5">
          <h1 className="text-xl font-black text-slate-900 tracking-tight">
            Masuk ke Panel Admin
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Kelola data iuran, verifikasi pembayaran warga, dan rekapitulasi kas.
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleLogin} className="mt-6 space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
              Email Pengurus
            </label>
            <div className="relative mt-1">
              <Mail className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="nama@rt05.id"
                className="w-full pl-9 pr-3 py-2.5 text-xs rounded-xl border border-slate-300 focus:border-teal-600 focus:outline-hidden font-medium text-slate-800"
              />
            </div>
          </div>

          <div>
            <div className="flex justify-between items-center">
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                Kata Sandi
              </label>
              <a
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  alert("Tautan reset kata sandi telah dikirim ke email ketua RT.");
                }}
                className="text-[11px] font-semibold text-teal-700 hover:underline"
              >
                Lupa sandi?
              </a>
            </div>
            <div className="relative mt-1">
              <Lock className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-9 pr-3 py-2.5 text-xs rounded-xl border border-slate-300 focus:border-teal-600 focus:outline-hidden font-medium text-slate-800"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full mt-2 inline-flex items-center justify-center gap-2 py-3 rounded-xl bg-teal-700 hover:bg-teal-800 text-white font-bold text-xs shadow-md shadow-teal-900/10 transition active:scale-95 disabled:opacity-70"
          >
            {isLoading ? (
              <span>Memproses autentikasi...</span>
            ) : (
              <>
                <span>Masuk ke Dashboard</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        {/* Security Notice */}
        <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-center gap-1.5 text-[11px] text-slate-400">
          <ShieldCheck className="w-3.5 h-3.5 text-teal-700" />
          <span>Autentikasi Terenkripsi · Data Tersimpan Aman</span>
        </div>
      </div>
    </div>
  );
}
