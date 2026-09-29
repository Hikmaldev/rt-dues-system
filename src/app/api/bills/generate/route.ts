import { NextRequest, NextResponse } from "next/server";
import { generateMonthlyBills } from "@/lib/services/billService";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const result = await generateMonthlyBills(body);

    return NextResponse.json({
      success: true,
      message: result.message,
      createdCount: result.createdCount,
    });
  } catch (err: any) {
    if (err.errors) {
      return NextResponse.json(
        { success: false, error: err.errors[0]?.message },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { success: false, error: err.message || "Gagal memproses generate tagihan" },
      { status: 500 }
    );
  }
}
