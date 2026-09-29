-- ==============================================================================
-- RT Dues System (Sistem Iuran Warga RT) - Database Schema for Neon PostgreSQL
-- Deployment: Vercel + Neon Console (neon.tech)
-- ==============================================================================

-- 1. EXTENSIONS
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. TABLES

-- 2.1 Admins (Pengurus / Bendahara RT)
CREATE TABLE IF NOT EXISTS admins (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email TEXT NOT NULL UNIQUE,
    password TEXT NOT NULL,
    full_name TEXT NOT NULL,
    role TEXT NOT NULL DEFAULT 'treasurer' CHECK (role IN ('admin', 'treasurer', 'head')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 2.2 Blocks (Blok Lingkungan / Referensi)
CREATE TABLE IF NOT EXISTS blocks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL UNIQUE,
    monthly_due_amount NUMERIC(12, 2) NOT NULL DEFAULT 10000 CHECK (monthly_due_amount >= 0),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 2.3 Households (Data Master Rumah & Warga)
-- Sistem Tarif Iuran: Rumah Tetap = Rp 10.000 / bln, Kontrakan = Rp 5.000 / bln
CREATE TABLE IF NOT EXISTS households (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    house_status TEXT NOT NULL DEFAULT 'tetap' CHECK (house_status IN ('tetap', 'kontrakan')),
    block_id UUID REFERENCES blocks(id) ON DELETE SET NULL,
    house_number TEXT NOT NULL UNIQUE,
    head_of_family_name TEXT NOT NULL,
    contact TEXT,
    access_code TEXT NOT NULL UNIQUE,
    is_active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 2.4 Bills (Tagihan Bulanan Warga)
-- Rule: Satu rumah hanya 1 tagihan per periode
CREATE TABLE IF NOT EXISTS bills (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    household_id UUID NOT NULL REFERENCES households(id) ON DELETE CASCADE,
    house_status TEXT NOT NULL DEFAULT 'tetap' CHECK (house_status IN ('tetap', 'kontrakan')),
    block_name TEXT DEFAULT 'Rumah Tetap',
    period TEXT NOT NULL, -- e.g. "September 2026"
    amount NUMERIC(12, 2) NOT NULL CHECK (amount >= 0),
    paid_amount NUMERIC(12, 2) NOT NULL DEFAULT 0 CHECK (paid_amount >= 0),
    status TEXT NOT NULL DEFAULT 'unpaid' CHECK (status IN ('unpaid', 'partial', 'paid')),
    due_date TEXT NOT NULL,
    method TEXT CHECK (method IS NULL OR method IN ('cash', 'transfer')),
    paid_at TEXT,
    proof_file_url TEXT,
    notes TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    CONSTRAINT uq_household_period UNIQUE (household_id, period)
);

-- 2.5 Payments (Riwayat Pembayaran & Bukti Transfer)
CREATE TABLE IF NOT EXISTS payments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    bill_id UUID NOT NULL REFERENCES bills(id) ON DELETE CASCADE,
    paid_amount NUMERIC(12, 2) NOT NULL CHECK (paid_amount > 0),
    payment_date TIMESTAMPTZ NOT NULL DEFAULT now(),
    method TEXT NOT NULL DEFAULT 'cash' CHECK (method IN ('cash', 'transfer')),
    proof_file_url TEXT,
    recorded_by TEXT DEFAULT 'Bendahara RT',
    notes TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 2.6 Fund Usages (Pengeluaran Kas RT untuk Transparansi Publik)
CREATE TABLE IF NOT EXISTS fund_usages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    period TEXT NOT NULL,
    category TEXT NOT NULL,
    amount NUMERIC(12, 2) NOT NULL CHECK (amount > 0),
    description TEXT NOT NULL,
    icon_type TEXT DEFAULT 'shield',
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 2.7 Reminders (Log Pengingat Tunggakan)
CREATE TABLE IF NOT EXISTS reminders (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    bill_id UUID NOT NULL REFERENCES bills(id) ON DELETE CASCADE,
    channel TEXT NOT NULL DEFAULT 'whatsapp',
    sent_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    status TEXT NOT NULL DEFAULT 'Terkirim',
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 3. INDEXES FOR PERFORMANCE
CREATE INDEX IF NOT EXISTS idx_households_access_code ON households(access_code);
CREATE INDEX IF NOT EXISTS idx_households_status ON households(house_status);
CREATE INDEX IF NOT EXISTS idx_households_active ON households(is_active);
CREATE INDEX IF NOT EXISTS idx_bills_household ON bills(household_id);
CREATE INDEX IF NOT EXISTS idx_bills_period ON bills(period);
CREATE INDEX IF NOT EXISTS idx_bills_status ON bills(status);
CREATE INDEX IF NOT EXISTS idx_payments_bill ON payments(bill_id);
CREATE INDEX IF NOT EXISTS idx_fund_usages_period ON fund_usages(period);

-- 4. INITIAL SEED DATA (DATA AWAL SIAP PAKAI)

-- 4.1 Admin Pengurus Default (Email: budi.santoso@rt05.id | Password: password123)
INSERT INTO admins (id, email, password, full_name, role)
VALUES (
    'a0000000-0000-0000-0000-000000000001',
    'budi.santoso@rt05.id',
    'rt05saltsecret12:168a6cc974481f364fb1efa7a4c6732d94ff1f77dc9097b51348ab29b53a7da19169a8755b7ef7bacb6795e8f722d119f70a23340160e7f846d23c525a60a517',
    'Budi Santoso',
    'treasurer'
) ON CONFLICT (email) DO NOTHING;

-- 4.2 Data Master Blok
INSERT INTO blocks (id, name, monthly_due_amount) VALUES
    ('b0000000-0000-0000-0000-000000000001', 'Blok A', 10000),
    ('b0000000-0000-0000-0000-000000000002', 'Blok B', 10000),
    ('b0000000-0000-0000-0000-000000000003', 'Blok C', 5000),
    ('b0000000-0000-0000-0000-000000000004', 'Blok D', 5000)
ON CONFLICT (name) DO NOTHING;

-- 4.3 Data Warga (Rumah Tetap: Rp 10.000 / Kontrakan: Rp 5.000)
INSERT INTO households (id, house_status, block_id, house_number, head_of_family_name, contact, access_code, is_active) VALUES
    ('d0000000-0000-0000-0000-000000000001', 'tetap', 'b0000000-0000-0000-0000-000000000001', 'A-07', 'Joko Pranoto', '0812-3456-7890', 'RH-A7-X8K2', true),
    ('d0000000-0000-0000-0000-000000000002', 'kontrakan', 'b0000000-0000-0000-0000-000000000003', 'C-15', 'Lina Marlina', '0813-2222-1144', 'RH-C15-Q9L4', true),
    ('d0000000-0000-0000-0000-000000000003', 'kontrakan', 'b0000000-0000-0000-0000-000000000002', 'B-03', 'Dedi Setiawan', '0821-6655-8833', 'RH-B3-M2P7', true),
    ('d0000000-0000-0000-0000-000000000004', 'tetap', 'b0000000-0000-0000-0000-000000000002', 'B-12', 'Rudi Hartono', '0819-7788-9900', 'RH-B12-K7N3', true),
    ('d0000000-0000-0000-0000-000000000005', 'tetap', 'b0000000-0000-0000-0000-000000000003', 'C-08', 'Siti Wahyuni', '0857-1122-3344', 'RH-C8-W4E9', true),
    ('d0000000-0000-0000-0000-000000000006', 'kontrakan', 'b0000000-0000-0000-0000-000000000004', 'D-04', 'Andi Firmansyah', '0878-9988-7766', 'RH-D4-R1S5', true)
ON CONFLICT (house_number) DO NOTHING;

-- 4.4 Tagihan September 2026
INSERT INTO bills (id, household_id, house_status, block_name, period, amount, paid_amount, status, due_date, method, paid_at, notes) VALUES
    ('c0000000-0000-0000-0000-000000000001', 'd0000000-0000-0000-0000-000000000001', 'tetap', 'Rumah Tetap', 'September 2026', 10000, 10000, 'paid', '10 Sep 2026', 'transfer', '5 Sep 2026, 14:22', 'Bukti transfer BCA terlampir'),
    ('c0000000-0000-0000-0000-000000000002', 'd0000000-0000-0000-0000-000000000002', 'kontrakan', 'Kontrakan', 'September 2026', 5000, 5000, 'paid', '10 Sep 2026', 'transfer', '8 Sep 2026, 08:18', 'Lunas tepat waktu'),
    ('c0000000-0000-0000-0000-000000000003', 'd0000000-0000-0000-0000-000000000003', 'kontrakan', 'Kontrakan', 'September 2026', 5000, 3000, 'partial', '10 Sep 2026', 'cash', '12 Sep 2026, 17:30', 'Sisa Rp 2.000 dibayar akhir bulan'),
    ('c0000000-0000-0000-0000-000000000004', 'd0000000-0000-0000-0000-000000000004', 'tetap', 'Rumah Tetap', 'September 2026', 10000, 0, 'unpaid', '10 Sep 2026', NULL, NULL, 'Menunggak'),
    ('c0000000-0000-0000-0000-000000000005', 'd0000000-0000-0000-0000-000000000005', 'tetap', 'Rumah Tetap', 'September 2026', 10000, 10000, 'paid', '10 Sep 2026', 'cash', '3 Sep 2026, 10:00', 'Bayar tunai via bendahara'),
    ('c0000000-0000-0000-0000-000000000006', 'd0000000-0000-0000-0000-000000000006', 'kontrakan', 'Kontrakan', 'September 2026', 5000, 0, 'unpaid', '10 Sep 2026', NULL, NULL, NULL)
ON CONFLICT (household_id, period) DO NOTHING;

-- 4.5 Transparansi Pengeluaran Kas RT (September 2026)
INSERT INTO fund_usages (id, period, category, amount, description, icon_type) VALUES
    ('f0000000-0000-0000-0000-000000000001', 'September 2026', 'Keamanan Lingkungan & Satpam', 2500000, 'Gaji 2 petugas jaga malam dan operasional pos satpam', 'shield'),
    ('f0000000-0000-0000-0000-000000000002', 'September 2026', 'Kebersihan & Pengangkutan Sampah', 1400000, 'Retribusi armada angkut sampah RT 3x seminggu', 'trash'),
    ('f0000000-0000-0000-0000-000000000003', 'September 2026', 'Penerangan Jalan & Fasilitas Umum', 1250000, 'Token listrik pos ronda, PJU gang, dan servis pompa air taman', 'zap'),
    ('f0000000-0000-0000-0000-000000000004', 'September 2026', 'Kegiatan Sosial & Warga', 850000, 'Santunan duka warga & konsumsi kerja bakti RT', 'users')
ON CONFLICT (id) DO NOTHING;
