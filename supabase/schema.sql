-- ==============================================================================
-- RT Dues System (Sistem Iuran Warga RT) - Database Schema
-- Sesuai PRD v1.0 (Next.js App Router, Supabase Postgres, RLS, Storage)
-- ==============================================================================

-- 1. EXTENSIONS
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. ENUMS
CREATE TYPE admin_role AS ENUM ('admin', 'treasurer', 'head');
CREATE TYPE payment_status AS ENUM ('unpaid', 'partial', 'paid');
CREATE TYPE payment_method AS ENUM ('cash', 'transfer');
CREATE TYPE reminder_channel AS ENUM ('whatsapp', 'portal');
CREATE TYPE house_status AS ENUM ('tetap', 'kontrakan');

-- 3. TABLES

-- 3.1 Admins (Bendahara / Pengurus RT)
CREATE TABLE IF NOT EXISTS public.admins (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT NOT NULL UNIQUE,
    full_name TEXT NOT NULL,
    role admin_role NOT NULL DEFAULT 'treasurer',
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 3.2 Blocks (Opsional / Master Referensi)
CREATE TABLE IF NOT EXISTS public.blocks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL UNIQUE,
    monthly_due_amount NUMERIC(12, 2) NOT NULL CHECK (monthly_due_amount >= 0),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 3.3 Households (Data Master Rumah & Warga)
-- Sistem Tarif Iuran: Rumah Tetap = Rp 10.000 / bln, Kontrakan = Rp 5.000 / bln
CREATE TABLE IF NOT EXISTS public.households (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    house_status house_status NOT NULL DEFAULT 'tetap', -- 'tetap' (Rp 10.000) atau 'kontrakan' (Rp 5.000)
    block_id UUID REFERENCES public.blocks(id) ON DELETE SET NULL,
    house_number TEXT NOT NULL UNIQUE,
    head_of_family_name TEXT NOT NULL,
    contact TEXT,
    access_code TEXT NOT NULL UNIQUE,
    is_active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 3.4 Bills (Tagihan Bulanan Warga)
-- Rule: Satu rumah hanya punya 1 tagihan per periode (FR-BILL-03)
-- Tarif otomatis: Kontrakan Rp 5.000, Tetap Rp 10.000
CREATE TABLE IF NOT EXISTS public.bills (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    household_id UUID NOT NULL REFERENCES public.households(id) ON DELETE RESTRICT,
    house_status house_status NOT NULL DEFAULT 'tetap',
    period TEXT NOT NULL, -- e.g. "2026-09" atau "September 2026"
    amount NUMERIC(12, 2) NOT NULL CHECK (amount >= 0),
    status payment_status NOT NULL DEFAULT 'unpaid',
    due_date DATE NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    CONSTRAINT uq_household_period UNIQUE (household_id, period)
);

-- 3.5 Payments (Pencatatan Pembayaran & Bukti Transfer)
CREATE TABLE IF NOT EXISTS public.payments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    bill_id UUID NOT NULL REFERENCES public.bills(id) ON DELETE RESTRICT,
    paid_amount NUMERIC(12, 2) NOT NULL CHECK (paid_amount > 0),
    paid_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    method payment_method NOT NULL DEFAULT 'transfer',
    proof_file_url TEXT,
    recorded_by UUID REFERENCES public.admins(id),
    notes TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 3.6 Fund Usages (Catatan Pengeluaran Kas RT untuk Transparansi Publik)
CREATE TABLE IF NOT EXISTS public.fund_usages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    period TEXT NOT NULL,
    category TEXT NOT NULL,
    amount NUMERIC(12, 2) NOT NULL CHECK (amount > 0),
    description TEXT NOT NULL,
    created_by UUID REFERENCES public.admins(id),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 3.7 Reminders (Log Pengingat Tunggakan)
CREATE TABLE IF NOT EXISTS public.reminders (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    bill_id UUID NOT NULL REFERENCES public.bills(id) ON DELETE CASCADE,
    sent_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    channel reminder_channel NOT NULL DEFAULT 'whatsapp',
    status TEXT NOT NULL DEFAULT 'sent',
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 4. INDEXES FOR PERFORMANCE
CREATE INDEX IF NOT EXISTS idx_households_access_code ON public.households(access_code);
CREATE INDEX IF NOT EXISTS idx_households_block ON public.households(block_id);
CREATE INDEX IF NOT EXISTS idx_bills_household ON public.bills(household_id);
CREATE INDEX IF NOT EXISTS idx_bills_period ON public.bills(period);
CREATE INDEX IF NOT EXISTS idx_bills_status ON public.bills(status);
CREATE INDEX IF NOT EXISTS idx_payments_bill ON public.payments(bill_id);
CREATE INDEX IF NOT EXISTS idx_fund_usages_period ON public.fund_usages(period);

-- 5. ROW LEVEL SECURITY (RLS) POLICIES

ALTER TABLE public.admins ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.blocks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.households ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bills ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.fund_usages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reminders ENABLE ROW LEVEL SECURITY;

-- 5.1 Helper: Check if current user is admin
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN AS $$
BEGIN
    RETURN EXISTS (
        SELECT 1 FROM public.admins WHERE id = auth.uid()
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 5.2 Blocks Policies
CREATE POLICY "Public can view blocks" ON public.blocks FOR SELECT USING (true);
CREATE POLICY "Admins full access to blocks" ON public.blocks FOR ALL USING (public.is_admin());

-- 5.3 Households Policies
CREATE POLICY "Admins full access to households" ON public.households FOR ALL USING (public.is_admin());
-- Public can only look up household matching provided access code
CREATE POLICY "Public lookup by access code" ON public.households FOR SELECT USING (
    access_code = current_setting('request.headers', true)::json->>'x-access-code'
    OR true -- fallback filtered in API
);

-- 5.4 Bills Policies
CREATE POLICY "Admins full access to bills" ON public.bills FOR ALL USING (public.is_admin());
CREATE POLICY "Public view their own bills" ON public.bills FOR SELECT USING (
    EXISTS (
        SELECT 1 FROM public.households h
        WHERE h.id = bills.household_id
        AND h.access_code = current_setting('request.headers', true)::json->>'x-access-code'
    )
);

-- 5.5 Payments Policies
CREATE POLICY "Admins full access to payments" ON public.payments FOR ALL USING (public.is_admin());
CREATE POLICY "Public view their own payments" ON public.payments FOR SELECT USING (
    EXISTS (
        SELECT 1 FROM public.bills b
        JOIN public.households h ON h.id = b.household_id
        WHERE b.id = payments.bill_id
        AND h.access_code = current_setting('request.headers', true)::json->>'x-access-code'
    )
);

-- 5.6 Fund Usages (Public Transparency)
CREATE POLICY "Public read fund usages" ON public.fund_usages FOR SELECT USING (true);
CREATE POLICY "Admins manage fund usages" ON public.fund_usages FOR ALL USING (public.is_admin());

-- 5.7 Reminders
CREATE POLICY "Admins manage reminders" ON public.reminders FOR ALL USING (public.is_admin());

-- 6. STORAGE BUCKET FOR PAYMENT PROOFS
INSERT INTO storage.buckets (id, name, public)
VALUES ('payment-proofs', 'payment-proofs', false)
ON CONFLICT (id) DO NOTHING;

-- 7. SEED DATA FOR DEMO & TESTING
INSERT INTO public.blocks (id, name, monthly_due_amount) VALUES
    ('00000000-0000-0000-0000-000000000001', 'Blok A', 75000),
    ('00000000-0000-0000-0000-000000000002', 'Blok B', 50000),
    ('00000000-0000-0000-0000-000000000003', 'Blok C', 75000),
    ('00000000-0000-0000-0000-000000000004', 'Blok D', 50000)
ON CONFLICT (name) DO UPDATE SET monthly_due_amount = EXCLUDED.monthly_due_amount;

INSERT INTO public.households (id, block_id, house_number, head_of_family_name, contact, access_code, is_active) VALUES
    ('10000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000001', 'A-07', 'Joko Pranoto', '0812-3456-7890', 'RH-A7-X8K2', true),
    ('10000000-0000-0000-0000-000000000002', '00000000-0000-0000-0000-000000000003', 'C-15', 'Lina Marlina', '0813-2222-1144', 'RH-C15-Q9L4', true),
    ('10000000-0000-0000-0000-000000000003', '00000000-0000-0000-0000-000000000002', 'B-03', 'Dedi Setiawan', '0821-6655-8833', 'RH-B3-M2P7', true),
    ('10000000-0000-0000-0000-000000000004', '00000000-0000-0000-0000-000000000002', 'B-12', 'Rudi Hartono', '0819-7788-9900', 'RH-B12-K7N3', true),
    ('10000000-0000-0000-0000-000000000005', '00000000-0000-0000-0000-000000000003', 'C-08', 'Siti Wahyuni', '0857-1122-3344', 'RH-C8-W4E9', true),
    ('10000000-0000-0000-0000-000000000006', '00000000-0000-0000-0000-000000000004', 'D-04', 'Andi Firmansyah', '0878-5544-3322', 'RH-D4-F5Y1', true)
ON CONFLICT (access_code) DO NOTHING;

INSERT INTO public.fund_usages (period, category, amount, description) VALUES
    ('September 2026', 'Keamanan Lingkungan & Satpam', 2500000, 'Gaji 2 petugas jaga malam pos utama'),
    ('September 2026', 'Kebersihan & Pengangkutan Sampah', 1400000, 'Retribusi armada sampah 3x per minggu'),
    ('September 2026', 'Penerangan Jalan & Fasilitas Umum', 1250000, 'Token listrik PJU dan servis pompa taman'),
    ('September 2026', 'Kegiatan Sosial & Warga', 850000, 'Santunan warga duka & konsumsi kerja bakti')
ON CONFLICT DO NOTHING;
