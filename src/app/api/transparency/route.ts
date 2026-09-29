import { NextResponse } from "next/server";
import { getTransparencySummary } from "@/lib/services/transparencyService";

export async function GET() {
  try {
    const summary = await getTransparencySummary();
    return NextResponse.json({ success: true, data: summary });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err.message || "Gagal memuat transparansi dana" },
      { status: 500 }
    );
  }
}
