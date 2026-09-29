import { z } from "zod";

// 1. Auth Validation
export const loginSchema = z.object({
  email: z.string().email("Format email pengurus tidak valid"),
  password: z.string().min(6, "Kata sandi minimal 6 karakter"),
});

export type LoginInput = z.infer<typeof loginSchema>;

// 2. Household Validation (FR-MST-01)
export const householdSchema = z.object({
  house_status: z.enum(["tetap", "kontrakan"]).default("tetap"),
  house_number: z
    .string()
    .min(1, "Nomor rumah wajib diisi")
    .max(20, "Nomor rumah maksimal 20 karakter"),
  head_of_family_name: z
    .string()
    .min(2, "Nama kepala keluarga minimal 2 karakter")
    .max(100, "Nama kepala keluarga terlalu panjang"),
  contact: z
    .string()
    .regex(/^[0-9\-\+\s]{7,20}$/, "Format nomor telepon tidak valid")
    .optional()
    .or(z.literal("")),
  is_active: z.boolean().default(true),
  block_id: z.string().optional(),
});

export type HouseholdInput = z.infer<typeof householdSchema>;

// 3. Bill Generation Schema (FR-BILL-01, FR-BILL-02)
export const generateBillsSchema = z.object({
  period: z
    .string()
    .min(3, "Periode wajib diisi (contoh: 'September 2026')"),
  due_date: z
    .string()
    .min(5, "Tanggal jatuh tempo wajib diisi"),
});

export type GenerateBillsInput = z.infer<typeof generateBillsSchema>;

// 4. Payment Recording Schema (FR-PAY-01, FR-PAY-02, FR-PAY-03)
export const recordPaymentSchema = z.object({
  bill_id: z.string().min(1, "ID tagihan wajib ada"),
  status: z.enum(["unpaid", "partial", "paid"]),
  paid_amount: z
    .number()
    .min(0, "Nominal pembayaran tidak boleh negatif"),
  method: z.enum(["cash", "transfer"]).default("transfer"),
  proof_file_url: z.string().url().optional().or(z.literal("")),
  notes: z.string().max(255, "Catatan maksimal 255 karakter").optional().or(z.literal("")),
});

export type RecordPaymentInput = z.infer<typeof recordPaymentSchema>;

// 5. Fund Usage Schema (FR-PUB-04)
export const fundUsageSchema = z.object({
  period: z.string().min(1, "Periode bulan wajib diisi"),
  category: z.string().min(2, "Kategori pengeluaran wajib diisi"),
  amount: z.number().positive("Nominal pengeluaran harus lebih besar dari 0"),
  description: z
    .string()
    .min(3, "Deskripsi pengeluaran minimal 3 karakter")
    .max(500, "Deskripsi maksimal 500 karakter"),
});

export type FundUsageInput = z.infer<typeof fundUsageSchema>;

// 6. Access Code Schema (FR-RES-01)
export const accessCodeSchema = z
  .string()
  .min(4, "Kode akses minimal 4 karakter")
  .max(30, "Kode akses maksimal 30 karakter")
  .transform((val) => val.trim().toUpperCase());
