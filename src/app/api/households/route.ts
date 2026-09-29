import { NextRequest, NextResponse } from "next/server";
import { getHouseholds, createHousehold } from "@/lib/services/householdService";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const houseStatus = searchParams.get("houseStatus") || undefined;
    const blockId = searchParams.get("blockId") || undefined;
    const isActiveParam = searchParams.get("isActive");
    const isActive = isActiveParam !== null ? isActiveParam === "true" : undefined;
    const query = searchParams.get("q") || undefined;

    const households = await getHouseholds({ houseStatus, blockId, isActive, query });
    return NextResponse.json({ success: true, data: households });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err.message || "Gagal mengambil data warga" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const created = await createHousehold(body);
    return NextResponse.json({ success: true, data: created }, { status: 201 });
  } catch (err: any) {
    if (err.errors) {
      return NextResponse.json(
        { success: false, error: err.errors[0]?.message },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { success: false, error: err.message || "Gagal menambahkan data warga" },
      { status: 500 }
    );
  }
}
