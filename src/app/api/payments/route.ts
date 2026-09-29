import { NextRequest, NextResponse } from "next/server";
import { recordPayment } from "@/lib/services/billService";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const updated = await recordPayment(body);

    return NextResponse.json({
      success: true,
      message: "Status pembayaran berhasil diperbarui",
      data: updated,
    });
  } catch (err: any) {
    if (err.errors) {
      return NextResponse.json(
        { success: false, error: err.errors[0]?.message },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { success: false, error: err.message || "Gagal mencatat pembayaran" },
      { status: 500 }
    );
  }
}
