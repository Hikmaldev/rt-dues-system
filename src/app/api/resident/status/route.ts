import { NextRequest, NextResponse } from "next/server";
import { getHouseholdByAccessCode } from "@/lib/services/householdService";
import { getBillsByHousehold } from "@/lib/services/billService";
import { db } from "@/lib/services/dbStore";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const code = searchParams.get("code");

    if (!code) {
      return NextResponse.json(
        { success: false, error: "Kode akses rumah wajib disertakan" },
        { status: 400 }
      );
    }

    const household = await getHouseholdByAccessCode(code);
    if (!household) {
      return NextResponse.json(
        { success: false, error: "Kode rumah tidak ditemukan" },
        { status: 404 }
      );
    }

    // Fetch this household's bills only (Strict privacy rule FR-RES-04)
    const bills = await getBillsByHousehold(household.id);
    const blocks = await db.blocks.findMany();
    const block = blocks.find((b) => b.id === household.block_id);

    return NextResponse.json({
      success: true,
      data: {
        household: {
          id: household.id,
          house_number: household.house_number,
          head_of_family_name: household.head_of_family_name,
          access_code: household.access_code,
          block_name: block ? block.name : "Blok RT",
        },
        bills,
      },
    });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err.message || "Gagal memuat status warga" },
      { status: 500 }
    );
  }
}
