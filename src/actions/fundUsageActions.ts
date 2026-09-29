"use server";

import { revalidatePath } from "next/cache";
import { createFundUsage } from "@/lib/services/transparencyService";
import { FundUsageInput, fundUsageSchema } from "@/lib/validations";

export async function createFundUsageAction(input: FundUsageInput) {
  try {
    const validated = fundUsageSchema.parse(input);
    const result = await createFundUsage(validated);
    revalidatePath("/admin/fund-usage");
    revalidatePath("/transparency");
    return { success: true, data: result };
  } catch (err: any) {
    if (err.errors) {
      return { success: false, error: err.errors[0]?.message };
    }
    return { success: false, error: err.message || "Gagal menyimpan pengeluaran dana" };
  }
}
