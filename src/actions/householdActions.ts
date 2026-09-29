"use server";

import { revalidatePath } from "next/cache";
import { createHousehold, toggleHouseholdActive } from "@/lib/services/householdService";
import { HouseholdInput, householdSchema } from "@/lib/validations";

export async function createHouseholdAction(input: HouseholdInput) {
  try {
    const validated = householdSchema.parse(input);
    const created = await createHousehold(validated);
    revalidatePath("/admin/households");
    revalidatePath("/admin/dashboard");
    return { success: true, data: created };
  } catch (err: any) {
    if (err.errors) {
      return { success: false, error: err.errors[0]?.message };
    }
    return { success: false, error: err.message || "Gagal membuat data warga" };
  }
}

export async function toggleHouseholdStatusAction(id: string, isActive: boolean) {
  try {
    const updated = await toggleHouseholdActive(id, isActive);
    revalidatePath("/admin/households");
    revalidatePath("/admin/dashboard");
    return { success: true, data: updated };
  } catch (err: any) {
    return { success: false, error: err.message || "Gagal mengubah status rumah" };
  }
}
