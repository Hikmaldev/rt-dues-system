import { NextRequest, NextResponse } from "next/server";
import { createFundUsage } from "@/lib/services/transparencyService";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const created = await createFundUsage(body);

    return NextResponse.json({
      success: true,
      message: "Catatan pengeluaran dana berhasil disimpan",
      data: created,
    }, { status: 201 });
  } catch (err: any) {
    if (err.errors) {
      return NextResponse.json(
        { success: false, error: err.errors[0]?.message },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { success: false, error: err.message || "Gagal menyimpan pengeluaran dana" },
      { status: 500 }
    );
  }
}
