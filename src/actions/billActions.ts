"use server";

import { revalidatePath } from "next/cache";
import { generateMonthlyBills, recordPayment } from "@/lib/services/billService";
import { GenerateBillsInput, RecordPaymentInput, generateBillsSchema, recordPaymentSchema } from "@/lib/validations";

export async function generateBillsAction(input: GenerateBillsInput) {
  try {
    const validated = generateBillsSchema.parse(input);
    const result = await generateMonthlyBills(validated);
    revalidatePath("/admin/bills");
    revalidatePath("/admin/dashboard");
    return { success: true, message: result.message, count: result.createdCount };
  } catch (err: any) {
    if (err.errors) {
      return { success: false, error: err.errors[0]?.message };
    }
    return { success: false, error: err.message || "Gagal men-generate tagihan" };
  }
}

export async function recordPaymentAction(input: RecordPaymentInput) {
  try {
    const validated = recordPaymentSchema.parse(input);
    const result = await recordPayment(validated);
    revalidatePath("/admin/bills");
    revalidatePath("/admin/dashboard");
    revalidatePath("/status");
    return { success: true, data: result };
  } catch (err: any) {
    if (err.errors) {
      return { success: false, error: err.errors[0]?.message };
    }
    return { success: false, error: err.message || "Gagal memperbarui status pembayaran" };
  }
}
