import { NextRequest, NextResponse } from "next/server";
import { getBills } from "@/lib/services/billService";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const period = searchParams.get("period") || "September 2026";
    const houseStatus = searchParams.get("houseStatus") || searchParams.get("block") || "all";

    const bills = await getBills({
      period,
      houseStatus: houseStatus !== "all" ? houseStatus : undefined,
    });

    // Format into CSV for Excel compatibility
    const headers = [
      "No",
      "Nama Kepala Keluarga",
      "Nomor Rumah",
      "Status Rumah",
      "Periode",
      "Nominal (Rp)",
      "Jumlah Terbayar (Rp)",
      "Status",
      "Metode",
      "Tanggal Bayar",
      "Catatan",
    ];

    const rows = bills.map((b, idx) => [
      idx + 1,
      `"${b.household_name.replace(/"/g, '""')}"`,
      `"${b.house_number}"`,
      `"${b.house_status === "kontrakan" ? "Kontrakan" : "Rumah Tetap"}"`,
      `"${b.period}"`,
      b.amount,
      b.paid_amount || 0,
      `"${b.status.toUpperCase()}"`,
      `"${b.method || "-"}"`,
      `"${b.paid_at || "-"}"`,
      `"${(b.notes || "").replace(/"/g, '""')}"`,
    ]);

    const csvContent =
      "\uFEFF" + // UTF-8 BOM for Microsoft Excel
      [headers.join(","), ...rows.map((r) => r.join(","))].join("\r\n");

    const filename = `Rekap-Iuran-RT05-${period.replace(/\s+/g, "-")}.csv`;

    return new NextResponse(csvContent, {
      status: 200,
      headers: {
        "Content-Type": "text/csv; charset=utf-8",
        "Content-Disposition": `attachment; filename="${filename}"`,
      },
    });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err.message || "Gagal mengekspor laporan" },
      { status: 500 }
    );
  }
}
