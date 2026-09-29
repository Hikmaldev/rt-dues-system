# Panduan Deploy RT Dues System ke Vercel + Neon Postgres

Dokumen ini berisi panduan lengkap step-by-step untuk melakukan deployment aplikasi **Sistem Iuran Warga RT** menggunakan **Neon Console (PostgreSQL)** sebagai database dan **Vercel** sebagai platform hosting.

---

## Ringkasan Arsitektur
- **Frontend & API**: Next.js 15 (App Router, Tailwind CSS) dideploy di **Vercel**.
- **Database**: Serverless PostgreSQL di **Neon.tech** (menggunakan `@neondatabase/serverless`).
- **Autentikasi**: Secure HTTP-only HMAC Cookie (`AUTH_SECRET`), tidak lagi bergantung pada Supabase Auth.
- **Biaya**: **100% Gratis** (Free tier Vercel Hobby + Neon Free Tier 0.5 GB Postgres).

---

## LANGKAH 1: Setup Database di Neon Console (neon.tech)

1. Buka [https://neon.tech](https://neon.tech) dan login / register (bisa pakai akun GitHub/Google).
2. Di dashboard, klik tombol **"Create Project"**.
   - **Project Name**: `rt-dues-system` (atau nama lain sesuai keinginan).
   - **Postgres Version**: Pilih versi default (Postgres 16 atau 17).
   - **Region**: Pilih region terdekat (misal: `ap-southeast-1` Singapore) untuk latensi tercepat dari Indonesia.
   - Klik **"Create Project"**.
3. Setelah database dibuat, Anda akan melihat halaman **Connection Details**.
   - Salin **Connection String** yang tampil.
   - Formatnya seperti:
     ```text
     postgresql://neondb_owner:npg_xxxxxx@ep-xxxxxx.ap-southeast-1.aws.neon.tech/neondb?sslmode=require
     ```
   - *Simpan connection string ini untuk dimasukkan ke Environment Variables di Langkah 3.*

---

## LANGKAH 2: Eksekusi Schema & Data Awal di Neon SQL Editor

1. Di menu sidebar kiri Neon Console, klik **"SQL Editor"**.
2. Buka file skrip yang sudah kami siapkan di repositori proyek:
   `neon/schema.sql`
3. Salin (**Copy**) seluruh isi file `neon/schema.sql`.
4. Tempel (**Paste**) ke dalam kolom Neon SQL Editor.
5. Klik tombol **"Run"** di pojok kanan atas.
6. Tunggu hingga muncul notifikasi sukses (`Query returned successfully`).

> **Catatan Data Awal yang Terpasang:**
> - Akun Admin:
>   - **Email**: `budi.santoso@rt05.id`
>   - **Password**: `password123`
> - Master Blok: Blok A, B, C, D
> - Tarif Iuran: **Rumah Tetap (Rp 10.000)** dan **Kontrakan (Rp 5.000)**
> - 6 Rumah & Tagihan awal periode September 2026
> - Catatan transparansi pengeluaran kas RT

---

## LANGKAH 3: Push Kode ke GitHub

Jika kode proyek belum berada di GitHub:

1. Buka terminal di folder proyek (`C:\laragon\www\RT-Dues-System`).
2. Jalankan perintah git:
   ```bash
   git init
   git add .
   git commit -m "feat: migrate to neon postgres and prepare vercel deploy"
   ```
3. Buat repositori baru di [GitHub](https://github.com/new) (misal: `rt-dues-system`).
4. Sambungkan dan push:
   ```bash
   git remote add origin https://github.com/username/rt-dues-system.git
   git branch -M main
   git push -u origin main
   ```

---

## LANGKAH 4: Deploy ke Vercel

1. Buka [https://vercel.com](https://vercel.com) dan masuk menggunakan akun GitHub Anda.
2. Klik tombol **"Add New..."** -> **"Project"**.
3. Pilih repositori GitHub `rt-dues-system` dan klik **"Import"**.
4. Di bagian **Configure Project**:
   - **Framework Preset**: Next.js (terdeteksi otomatis).
   - **Root Directory**: `./` (default).
5. Buka bagian **"Environment Variables"** lalu tambahkan variable berikut:

   | Key | Value | Keterangan |
   |---|---|---|
   | `DATABASE_URL` | `postgresql://neondb_owner:xxxx@ep-xxxx.ap-southeast-1.aws.neon.tech/neondb?sslmode=require` | Connection string dari Neon (Langkah 1) |
   | `AUTH_SECRET` | `kunci-rahasia-acak-32-karakter-contoh-d7f9a1b2c3d4e5f6` | String acak bebas untuk enkripsi token login admin |
   | `NEXT_PUBLIC_APP_URL` | `https://nama-proyek-anda.vercel.app` | URL Vercel (bisa diisi setelah deploy pertama atau biarkan default) |

6. Klik tombol **"Deploy"**.
7. Tunggu build selesai (sekitar 1–2 menit).
8. Selesai! Web aplikasi RT Dues System Anda sudah live dan siap digunakan warga maupun pengurus RT.

---

## LANGKAH 5: Verifikasi Setelah Deploy

1. Buka URL domain Vercel Anda (misal `https://rt-dues-system.vercel.app`).
2. **Cek Portal Warga**:
   - Masukkan kode akses contoh: `RH-A7-X8K2` (Joko Pranoto - Rumah Tetap) atau `RH-C15-Q9L4` (Lina Marlina - Kontrakan).
   - Pastikan detail tagihan muncul dengan benar.
3. **Cek Halaman Transparansi**:
   - Buka menu **Transparansi Kas**.
   - Pastikan rincian pengeluaran kas RT tampil.
4. **Cek Portal Admin**:
   - Buka `/admin/login`.
   - Masuk dengan email `budi.santoso@rt05.id` dan password `password123`.
   - Coba generate tagihan atau catat pembayaran untuk memastikan data tersimpan langsung ke database Neon.
