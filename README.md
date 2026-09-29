# 🏘️ RTHub — Sistem Iuran Warga RT Digital

![Next.js](https://img.shields.io/badge/Next.js-15-black?logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5.7-3178C6?logo=typescript&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4-06B6D4?logo=tailwindcss&logoColor=white)
![Neon Postgres](https://img.shields.io/badge/Neon-Postgres-00E599?logo=postgresql&logoColor=white)
![Vercel](https://img.shields.io/badge/Vercel-Deployed-000?logo=vercel)
![License](https://img.shields.io/badge/License-MIT-green)

**RTHub** adalah aplikasi web full-stack untuk mengelola iuran bulanan warga RT secara digital, transparan, dan mandiri. Dibangun dengan **Next.js 15 App Router**, **Neon Serverless Postgres**, dan di-deploy ke **Vercel**.

> *"Cek Status Iuran Rumah — Mudah, Terbuka, & Mandiri"*

---

## ✨ Fitur Utama

### 🏠 Portal Warga (Publik)
- **Cek status iuran** hanya dengan kode akses rumah (misal: `RH-A7-X8K2`)
- Tampilan tagihan bulan berjalan dengan status pembayaran (✅ Lunas / ⏳ Sebagian / ❌ Belum Bayar)
- Riwayat pembayaran 4 bulan terakhir
- Informasi rekening transfer dengan tombol salin nomor rekening
- **Privasi terjaga** — hanya menampilkan data rumah pemilik kode akses

### 📊 Transparansi Kas RT (Publik)
- Laporan terbuka keuangan kas RT tanpa data pribadi warga
- Rincian pengeluaran per kategori (Keamanan, Kebersihan, Penerangan, Sosial)
- Grafik tren penerimaan iuran 6 bulan terakhir
- Statistik kepatuhan pembayaran dan saldo kas tersedia

### 🔐 Panel Admin (Khusus Pengurus RT)
- **Dashboard** — Ringkasan metrik bulan berjalan: total terkumpul, rumah lunas/belum bayar, donut chart pembayaran, daftar warga perlu ditindaklanjuti
- **Data Warga** — CRUD master data rumah, generate kode akses otomatis, toggle status berpenghuni/kosong
- **Tagihan Bulanan** — Generate tagihan massal, catat pembayaran (tunai/transfer), filter per status dan tipe rumah
- **Penggunaan Dana** — Catat pengeluaran kas RT, otomatis tampil di halaman transparansi publik
- **Laporan & Rekap** — Filter per periode/status, preview tabel, ekspor CSV (Excel) dan cetak PDF

---

## 💰 Sistem Tarif Iuran

| Status Rumah | Tarif / Bulan | Badge |
|:---:|:---:|:---:|
| 🏡 Rumah Tetap / Milik | Rp 10.000 | 🔵 Biru |
| 🏠 Rumah Kontrakan / Sewa | Rp 5.000 | 🟡 Amber |

---

## 🛠️ Tech Stack

| Layer | Teknologi |
|---|---|
| **Framework** | [Next.js 15](https://nextjs.org/) (App Router, Server Components, Server Actions) |
| **Bahasa** | [TypeScript](https://www.typescriptlang.org/) 5.7 |
| **UI** | [React 19](https://react.dev/) + [Tailwind CSS v4](https://tailwindcss.com/) |
| **Icons** | [Lucide React](https://lucide.dev/) |
| **Database** | [Neon Serverless Postgres](https://neon.tech/) (`@neondatabase/serverless`) |
| **Validasi** | [Zod](https://zod.dev/) |
| **Autentikasi** | Custom session-based (HMAC SHA-256 cookie + PBKDF2 password hash) |
| **Hosting** | [Vercel](https://vercel.com/) |
| **CSS Utils** | `clsx` + `tailwind-merge` |

---

## 🗂️ Struktur Proyek

```
RT-Dues-System/
├── neon/
│   └── schema.sql              # DDL + seed data untuk Neon Postgres
├── scripts/
│   └── migrate-neon.mjs        # Script migrasi database
├── src/
│   ├── app/
│   │   ├── page.tsx            # Landing page / beranda
│   │   ├── status/             # Portal cek iuran warga
│   │   ├── transparency/       # Transparansi kas publik
│   │   ├── admin/
│   │   │   ├── login/          # Halaman login pengurus
│   │   │   ├── dashboard/      # Dashboard admin
│   │   │   ├── households/     # Manajemen data warga
│   │   │   ├── bills/          # Tagihan bulanan
│   │   │   ├── fund-usage/     # Penggunaan dana
│   │   │   └── reports/        # Laporan & ekspor
│   │   └── api/                # REST API endpoints
│   ├── components/             # Client components (UI interaktif)
│   ├── actions/                # Next.js Server Actions
│   ├── lib/
│   │   ├── auth/               # Autentikasi & session management
│   │   ├── db/                 # Koneksi Neon Postgres
│   │   ├── services/           # Business logic layer
│   │   ├── validations/        # Zod schemas
│   │   └── mockData.ts         # Data demo (fallback tanpa database)
│   └── types/                  # TypeScript interfaces
├── neon.ts                     # Neon deployment config
├── next.config.ts              # Next.js config
└── package.json
```

---

## 🚀 Cara Menjalankan

### Prasyarat
- [Node.js](https://nodejs.org/) v18+ (disarankan v20+)
- Akun [Neon](https://neon.tech/) (gratis) — *opsional untuk development lokal*

### 1. Clone & Install

```bash
git clone https://github.com/<username>/rt-dues-system.git
cd rt-dues-system
npm install
```

### 2. Setup Environment Variables

Salin file contoh lalu sesuaikan isinya:

```bash
cp .env.example .env.local
```

Edit `.env.local`:

```env
# Neon Database URL (dapatkan dari neon.tech → Dashboard → Connection Details)
DATABASE_URL=postgresql://user:password@ep-xxx.aws.neon.tech/dbname?sslmode=require

# Secret key untuk token sesi admin (buat string acak)
AUTH_SECRET=buat-kunci-rahasia-minimal-32-karakter
```

> **💡 Tanpa database?** Tidak masalah! Aplikasi otomatis menggunakan data demo in-memory sehingga bisa langsung dijalankan tanpa konfigurasi database.

### 3. Setup Database (Opsional)

Jika sudah memiliki Neon database, jalankan migrasi schema:

```bash
node scripts/migrate-neon.mjs
```

Script ini akan membuat seluruh tabel dan mengisi data awal contoh.

### 4. Jalankan Development Server

```bash
npm run dev
```

Buka [http://localhost:3000](http://localhost:3000) di browser.

---

## 🌐 Deploy ke Vercel + Neon

### Langkah 1: Buat Database di Neon
1. Daftar/login di [neon.tech](https://neon.tech)
2. Buat project baru → pilih region terdekat (Singapore `ap-southeast-1` untuk Indonesia)
3. Salin **Connection String** dari halaman Connection Details

### Langkah 2: Jalankan Schema SQL
1. Buka **SQL Editor** di dashboard Neon
2. Salin dan paste seluruh isi file `neon/schema.sql`
3. Klik **Run** — tabel dan data awal akan terbentuk

### Langkah 3: Deploy ke Vercel
1. Push kode ke GitHub
2. Buka [vercel.com](https://vercel.com) → Import repositori
3. Tambahkan **Environment Variables**:

   | Key | Value |
   |---|---|
   | `DATABASE_URL` | Connection string dari Neon |
   | `AUTH_SECRET` | String acak minimal 32 karakter |

4. Klik **Deploy** — selesai! 🎉

---

## 🔑 Akun Demo

Setelah menjalankan `neon/schema.sql`, akun admin berikut siap digunakan:

| Field | Nilai |
|---|---|
| Email | `budi.santoso@rt05.id` |
| Password | `password123` |
| Nama | Budi Santoso |
| Role | Bendahara RT |

Kode akses warga untuk demo:

| Kode Akses | Nama KK | Nomor Rumah | Status |
|---|---|---|---|
| `RH-A7-X8K2` | Joko Pranoto | A-07 | Rumah Tetap |
| `RH-C15-Q9L4` | Lina Marlina | C-15 | Kontrakan |
| `RH-B3-M2P7` | Dedi Setiawan | B-03 | Kontrakan |
| `RH-B12-K7N3` | Rudi Hartono | B-12 | Rumah Tetap |
| `RH-C8-W4E9` | Siti Wahyuni | C-08 | Rumah Tetap |
| `RH-D4-R1S5` | Andi Firmansyah | D-04 | Kontrakan |

---

## 📡 API Endpoints

| Method | Endpoint | Deskripsi |
|---|---|---|
| `POST` | `/api/auth/login` | Login admin (email + password) |
| `POST` | `/api/auth/logout` | Logout admin (hapus sesi) |
| `GET` | `/api/households` | Daftar data warga (filter: status, aktif, pencarian) |
| `POST` | `/api/households` | Tambah data warga baru |
| `PATCH` | `/api/households/[id]` | Toggle status berpenghuni/kosong |
| `GET` | `/api/bills` | Daftar tagihan (filter: periode, status, tipe rumah) |
| `POST` | `/api/bills/generate` | Generate tagihan bulanan massal |
| `POST` | `/api/payments` | Catat pembayaran |
| `GET` | `/api/resident/status` | Lookup status iuran warga (berdasarkan kode akses) |
| `GET` | `/api/transparency` | Data transparansi kas RT (publik) |
| `POST` | `/api/fund-usage` | Catat pengeluaran kas RT |
| `GET` | `/api/reports/export` | Ekspor laporan CSV |

---

## 🏗️ Arsitektur

```
┌─────────────────────────────────────────────────────────┐
│                    Vercel (Hosting)                      │
│  ┌───────────────────────────────────────────────────┐  │
│  │              Next.js 15 App Router                │  │
│  │  ┌──────────┐  ┌──────────┐  ┌────────────────┐  │  │
│  │  │  Public   │  │  Admin   │  │   API Routes   │  │  │
│  │  │  Pages    │  │  Pages   │  │  /api/*        │  │  │
│  │  └─────┬────┘  └────┬─────┘  └───────┬────────┘  │  │
│  │        │             │               │            │  │
│  │        └─────────────┼───────────────┘            │  │
│  │                      │                            │  │
│  │              ┌───────▼───────┐                    │  │
│  │              │   Services    │                    │  │
│  │              │  (Business    │                    │  │
│  │              │   Logic)      │                    │  │
│  │              └───────┬───────┘                    │  │
│  │                      │                            │  │
│  │         ┌────────────▼────────────┐               │  │
│  │         │  @neondatabase/serverless│               │  │
│  │         └────────────┬────────────┘               │  │
│  └──────────────────────┼────────────────────────────┘  │
└─────────────────────────┼───────────────────────────────┘
                          │ HTTPS
              ┌───────────▼───────────┐
              │   Neon Postgres       │
              │   (Serverless DB)     │
              │   Region: Singapore   │
              └───────────────────────┘
```

**Dual-mode data**: Saat `DATABASE_URL` dikonfigurasi, semua operasi data langsung query ke Neon Postgres. Tanpa `DATABASE_URL`, aplikasi menggunakan in-memory store dengan data mock — memungkinkan development tanpa database.

---

## 🔒 Keamanan

- **Autentikasi Admin**: Session token ditandatangani menggunakan HMAC SHA-256 dan disimpan dalam HTTP-only cookie (tidak dapat diakses dari JavaScript client-side)
- **Password Hashing**: PBKDF2 dengan SHA-512 dan salt acak 16-byte
- **Privasi Warga**: Halaman status iuran hanya menampilkan data rumah sesuai kode akses (strict household-level isolation)
- **Transparansi Publik**: Halaman transparansi hanya menampilkan data agregat tanpa identitas pribadi warga
- **Validasi Input**: Semua input divalidasi menggunakan Zod schema di sisi server
- **Middleware Guard**: Route `/admin/*` dilindungi oleh Next.js middleware yang memeriksa keberadaan session cookie

---

## 📜 Lisensi

Proyek ini dilisensikan di bawah [MIT License](LICENSE).

---

## 🤝 Kontribusi

Kontribusi sangat diterima! Silakan buat *issue* atau *pull request* untuk perbaikan bug, fitur baru, atau peningkatan dokumentasi.

1. Fork repositori ini
2. Buat branch fitur baru (`git checkout -b fitur/nama-fitur`)
3. Commit perubahan (`git commit -m 'Tambah fitur baru'`)
4. Push ke branch (`git push origin fitur/nama-fitur`)
5. Buat Pull Request

---

<p align="center">
  Dibuat dengan ❤️ untuk warga RT 05 / RW 02, Kelurahan Cempaka
</p>
