import { NextRequest, NextResponse } from "next/server";
import { getBills } from "@/lib/services/billService";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const period = searchParams.get("period") || undefined;
    const status = searchParams.get("status") || undefined;
    const houseStatus = searchParams.get("houseStatus") || undefined;
    const blockName = searchParams.get("block") || undefined;
    const query = searchParams.get("q") || undefined;

    const bills = await getBills({ period, status, houseStatus, blockName, query });
    return NextResponse.json({ success: true, data: bills });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err.message || "Gagal mengambil data tagihan" },
      { status: 500 }
    );
  }
}
