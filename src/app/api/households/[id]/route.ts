import { NextRequest, NextResponse } from "next/server";
import { toggleHouseholdActive } from "@/lib/services/householdService";

export async function PATCH(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;
    const body = await request.json();
    const isActive = body.is_active;

    if (typeof isActive !== "boolean") {
      return NextResponse.json(
        { success: false, error: "is_active harus bertipe boolean" },
        { status: 400 }
      );
    }

    const updated = await toggleHouseholdActive(id, isActive);
    return NextResponse.json({ success: true, data: updated });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err.message || "Gagal mengubah status rumah" },
      { status: 500 }
    );
  }
}
