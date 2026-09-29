import React from "react";
import Link from "next/link";
import { getHouseholdByAccessCode } from "@/lib/services/householdService";
import { getBillsByHousehold } from "@/lib/services/billService";
import { db } from "@/lib/services/dbStore";
import { ResidentStatusClient } from "@/components/ResidentStatusClient";

export const dynamic = "force-dynamic";

export default async function ResidentStatusPage({
  params,
}: {
  params: Promise<{ accessCode: string }>;
}) {
  const { accessCode } = await params;
  const decodedCode = decodeURIComponent(accessCode).toUpperCase();

  // Find household by access code from backend service
  const household = await getHouseholdByAccessCode(decodedCode);

  // If not found, show helpful error state with link back to lookup
  if (!household) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-2xl border border-slate-300 p-6 text-center shadow-lg">
          <div className="w-12 h-12 rounded-full bg-rose-100 text-rose-700 flex items-center justify-center mx-auto mb-3 font-bold text-lg">
            !
          </div>
          <h2 className="text-xl font-bold text-slate-900">Kode Akses Tidak Ditemukan</h2>
          <p className="text-xs text-slate-500 mt-2">
            Kode rumah <span className="font-mono font-bold text-slate-800">{decodedCode}</span>{" "}
            tidak terdaftar pada data warga RT 05. Pastikan huruf dan angka sesuai.
          </p>

          <div className="mt-6 flex flex-col gap-2">
            <Link
              href="/status"
              className="w-full py-2.5 bg-teal-700 hover:bg-teal-800 text-white rounded-xl font-bold text-xs transition"
            >
              Coba Masukkan Kode Lain
            </Link>
            <Link
              href="/"
              className="w-full py-2.5 border border-slate-200 text-slate-600 hover:bg-slate-50 rounded-xl font-bold text-xs transition"
            >
              Kembali ke Beranda
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Fetch only this household's bills from backend (FR-RES-04 strict privacy)
  const bills = await getBillsByHousehold(household.id);
  const currentBill = bills.length > 0 ? bills[0] : undefined;

  const isKontrakan = household.house_status === "kontrakan";
  const blockName = isKontrakan ? "Rumah Kontrakan" : "Rumah Tetap";

  return (
    <ResidentStatusClient
      household={household}
      currentBill={currentBill}
      blockName={blockName}
      allBills={bills}
    />
  );
}
