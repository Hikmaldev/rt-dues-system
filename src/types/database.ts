export interface Admin {
  id: string;
  email: string;
  full_name: string;
  role: "admin" | "treasurer" | "head";
  created_at: string;
}

export interface Block {
  id: string;
  name: string;
  monthly_due_amount: number;
  total_houses: number;
}

export type HouseStatus = "tetap" | "kontrakan";

export interface Household {
  id: string;
  house_status: HouseStatus; // "tetap" (Rumah Tetap/Milik, Rp 10.000) | "kontrakan" (Kontrakan, Rp 5.000)
  house_number: string;
  head_of_family_name: string;
  contact: string;
  access_code: string;
  is_active: boolean;
  block_id?: string;
}

export type PaymentStatus = "unpaid" | "partial" | "paid";
export type PaymentMethod = "cash" | "transfer";

export interface Bill {
  id: string;
  household_id: string;
  household_name: string;
  house_number: string;
  house_status?: HouseStatus;
  block_name?: string;
  period: string; // e.g., "September 2026"
  amount: number;
  paid_amount: number;
  status: PaymentStatus;
  due_date: string;
  method?: PaymentMethod;
  paid_at?: string;
  proof_file_url?: string;
  notes?: string;
}

export interface FundUsage {
  id: string;
  period: string;
  category: string;
  amount: number;
  description: string;
  icon_type?: string;
}

export interface Payment {
  id: string;
  bill_id: string;
  paid_amount: number;
  paid_at: string;
  method: PaymentMethod;
  proof_file_url?: string;
  recorded_by?: string;
  notes?: string;
}

export interface ReminderLog {
  id: string;
  bill_id: string;
  household_name: string;
  house_number: string;
  overdue_months: number;
  sent_at: string;
  channel: "WhatsApp" | "Portal Warga";
  status: "Terkirim" | "Menunggu";
}
