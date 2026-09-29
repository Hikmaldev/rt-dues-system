# Product Requirements Document (PRD)

## RT Dues System (Sistem Iuran Warga RT)

| Item          | Keterangan                                                            |
| ------------- | --------------------------------------------------------------------- |
| Versi dokumen | 1.0 (Draft)                                                           |
| Tanggal       | 25 September 2026                                                     |
| Status        | Draft untuk review                                                    |
| Tech stack    | Next.js (App Router), TypeScript, Tailwind CSS, Supabase, Vercel, PWA |

---

## 1. Ringkasan Produk

RT Dues System adalah aplikasi web untuk mencatat dan memantau iuran warga di lingkungan RT. Sistem ini menggantikan pencatatan manual di buku atau Excel. Admin (bendahara atau ketua RT) mengelola data warga dan tagihan bulanan. Warga melihat status pembayaran mereka sendiri tanpa perlu bertanya ke pengurus.

## 2. Latar Belakang dan Masalah

Pengurus RT umumnya mencatat iuran warga di buku atau Excel. Cara ini menimbulkan beberapa masalah:

- Bendahara merekap ulang data secara manual setiap bulan.
- Warga tidak tahu status bayarnya sendiri kecuali bertanya langsung.
- Bukti transfer tercecer di chat WhatsApp pribadi.
- Pergantian pengurus RT sering kehilangan riwayat data lama.
- Warga curiga soal penggunaan dana karena tidak ada laporan terbuka.
- Bendahara lupa menagih warga yang menunggak.

## 3. Tujuan dan Metrik Keberhasilan

### 3.1 Tujuan

1. Menghilangkan pencatatan iuran manual di buku atau Excel.
2. Memberi warga akses mandiri untuk cek status iuran mereka.
3. Mengurangi waktu rekap bulanan bendahara.
4. Membuka transparansi total dana terkumpul dan penggunaannya.
5. Mengurangi tunggakan lewat pengingat otomatis.

### 3.2 Metrik Keberhasilan

| Metrik                                  | Target                                                | Cara Ukur                                    |
| --------------------------------------- | ----------------------------------------------------- | -------------------------------------------- |
| Waktu rekap bulanan bendahara           | Berkurang dari beberapa jam menjadi di bawah 15 menit | Wawancara bendahara sebelum dan sesudah      |
| Warga yang mengecek status lewat sistem | 70% kepala keluarga dalam 2 bulan pertama             | Log akses halaman warga                      |
| Keterlambatan bayar rata-rata           | Berkurang dibanding periode sebelum sistem            | Bandingkan tanggal bayar sebelum dan sesudah |
| Keluhan soal transparansi dana          | Berkurang signifikan                                  | Survei warga sederhana                       |
| Waktu muat halaman utama                | Kurang dari 2 detik pada koneksi seluler biasa        | Lighthouse atau alat serupa                  |

## 4. Ruang Lingkup

### 4.1 Fase 1, MVP (Dalam Lingkup)

- Data master warga per rumah atau blok.
- Nominal iuran per rumah atau blok (bisa berbeda tiap blok).
- Generate tagihan bulanan otomatis berdasarkan data warga.
- Pembayaran tetap dilakukan secara cash atau transfer manual ke bendahara.
- Admin mengubah status pembayaran per tagihan.
- Admin mengunggah bukti transfer sebagai lampiran opsional.
- Dashboard admin: status bayar seluruh warga bulan berjalan.
- Halaman warga: status iuran milik sendiri.
- Login admin melalui Supabase Auth.

### 4.2 Fase 2 (Setelah MVP Berjalan)

- Reminder otomatis ke warga yang belum bayar, lewat WhatsApp API atau notifikasi di halaman publik.
- Halaman transparansi publik: total dana terkumpul dan penggunaannya, tanpa membuka data pribadi tiap warga.
- Ekspor rekap bulanan dan tahunan ke Excel dan PDF.

### 4.3 Fase 3, Opsional

- Integrasi payment gateway agar warga bisa bayar langsung lewat sistem.

### 4.4 Di Luar Lingkup untuk Seluruh Fase Awal

- Aplikasi mobile native (cukup PWA).
- Manajemen surat menyurat RT (surat pengantar, domisili, dan sejenisnya).
- Manajemen inventaris aset RT (kursi, tenda, sound system).
- Sistem voting atau musyawarah warga.

## 5. Target Pengguna

### 5.1 Persona

**Bendahara atau Ketua RT (Admin)**

- Mengelola data warga dan nominal iuran.
- Mencatat siapa yang sudah dan belum bayar setiap bulan.
- Perlu laporan cepat tanpa menghitung manual.
- Tidak selalu mahir teknologi, jadi antarmuka harus sederhana.

**Warga**

- Ingin tahu status iuran rumahnya sendiri.
- Tidak perlu login rumit. Cukup akses mudah lewat tautan atau kode rumah.
- Membayar tetap secara cash atau transfer seperti biasa.

**Pengunjung Umum (Fase 2)**

- Warga atau pihak luar yang ingin melihat transparansi dana RT secara umum, tanpa data pribadi warga lain.

## 6. Peran dan Hak Akses

| Fitur                           | Admin                     | Warga       | Publik (Fase 2) |
| ------------------------------- | ------------------------- | ----------- | --------------- |
| Login sistem                    | Ya (Supabase Auth)        | Tidak wajib | Tidak perlu     |
| Kelola data warga dan blok      | Ya                        | Tidak       | Tidak           |
| Atur nominal iuran per blok     | Ya                        | Tidak       | Tidak           |
| Generate tagihan bulanan        | Ya (otomatis oleh sistem) | Tidak       | Tidak           |
| Update status pembayaran        | Ya                        | Tidak       | Tidak           |
| Upload bukti transfer           | Ya                        | Tidak       | Tidak           |
| Lihat dashboard seluruh warga   | Ya                        | Tidak       | Tidak           |
| Lihat status iuran sendiri      | Tidak relevan             | Ya          | Tidak           |
| Lihat halaman transparansi dana | Ya                        | Ya          | Ya (Fase 2)     |
| Ekspor laporan                  | Ya                        | Tidak       | Tidak           |

Catatan: warga mengakses status iuran miliknya sendiri lewat tautan unik per rumah atau kode akses sederhana, tanpa proses login penuh. Ini menjaga proses tetap ringan bagi warga yang tidak terbiasa memakai akun online.

## 7. Kebutuhan Fungsional

### 7.1 Autentikasi Admin

| ID         | Kebutuhan                                                               | Prioritas |
| ---------- | ----------------------------------------------------------------------- | --------- |
| FR-AUTH-01 | Admin login memakai email dan password lewat Supabase Auth.             | Must      |
| FR-AUTH-02 | Sistem membatasi seluruh halaman dan aksi admin di balik autentikasi.   | Must      |
| FR-AUTH-03 | Admin dapat mengatur ulang password lewat email.                        | Should    |
| FR-AUTH-04 | Sistem mendukung lebih dari satu akun admin (mis. ketua dan bendahara). | Could     |

### 7.2 Data Master Warga dan Blok

| ID        | Kebutuhan                                                                                                                          | Prioritas |
| --------- | ---------------------------------------------------------------------------------------------------------------------------------- | --------- |
| FR-MST-01 | Admin dapat menambah, mengubah, dan menonaktifkan data rumah atau warga (nama kepala keluarga, alamat, nomor rumah, blok, kontak). | Must      |
| FR-MST-02 | Admin dapat mengelompokkan rumah ke dalam blok atau RT bagian tertentu.                                                            | Must      |
| FR-MST-03 | Admin dapat mengatur nominal iuran per blok, karena nominal bisa berbeda antar blok.                                               | Must      |
| FR-MST-04 | Sistem tidak menghapus data rumah yang sudah punya riwayat tagihan. Sistem hanya menonaktifkannya.                                 | Must      |
| FR-MST-05 | Setiap rumah memiliki kode akses unik untuk halaman cek status warga.                                                              | Must      |

### 7.3 Generate Tagihan Otomatis

| ID         | Kebutuhan                                                                                                   | Prioritas |
| ---------- | ----------------------------------------------------------------------------------------------------------- | --------- |
| FR-BILL-01 | Sistem membuat tagihan bulanan otomatis untuk seluruh rumah aktif, berdasarkan nominal iuran bloknya.       | Must      |
| FR-BILL-02 | Sistem menjalankan proses generate tagihan pada tanggal yang bisa diatur admin (mis. tanggal 1 tiap bulan). | Must      |
| FR-BILL-03 | Sistem tidak membuat tagihan ganda untuk periode yang sama.                                                 | Must      |
| FR-BILL-04 | Admin dapat memicu proses generate tagihan secara manual jika terlewat.                                     | Should    |
| FR-BILL-05 | Admin dapat menyesuaikan atau membatalkan tagihan tertentu (mis. rumah kosong bulan itu).                   | Should    |

### 7.4 Pencatatan Pembayaran

| ID        | Kebutuhan                                                                                         | Prioritas |
| --------- | ------------------------------------------------------------------------------------------------- | --------- |
| FR-PAY-01 | Admin dapat mengubah status tagihan menjadi lunas, belum bayar, atau sebagian.                    | Must      |
| FR-PAY-02 | Admin dapat mencatat tanggal dan metode bayar (cash atau transfer).                               | Must      |
| FR-PAY-03 | Admin dapat mengunggah bukti transfer ke Supabase Storage sebagai lampiran opsional pada tagihan. | Must      |
| FR-PAY-04 | Sistem mencatat siapa admin yang mengubah status dan kapan.                                       | Should    |
| FR-PAY-05 | Admin dapat menambahkan catatan bebas pada satu tagihan.                                          | Could     |

### 7.5 Dashboard Admin

| ID        | Kebutuhan                                                                                                     | Prioritas |
| --------- | ------------------------------------------------------------------------------------------------------------- | --------- |
| FR-DSH-01 | Dashboard menampilkan ringkasan bulan berjalan: jumlah rumah lunas, belum bayar, dan total nominal terkumpul. | Must      |
| FR-DSH-02 | Dashboard menampilkan daftar rumah dengan status bayarnya, dapat difilter per blok dan status.                | Must      |
| FR-DSH-03 | Dashboard menampilkan daftar warga yang menunggak lebih dari satu bulan.                                      | Should    |
| FR-DSH-04 | Dashboard menampilkan grafik tren iuran terkumpul per bulan.                                                  | Could     |

### 7.6 Halaman Status Warga

| ID        | Kebutuhan                                                                                               | Prioritas |
| --------- | ------------------------------------------------------------------------------------------------------- | --------- |
| FR-RES-01 | Warga dapat membuka halaman status iuran rumahnya lewat tautan atau kode akses unik, tanpa login penuh. | Must      |
| FR-RES-02 | Halaman menampilkan riwayat pembayaran beberapa bulan terakhir.                                         | Must      |
| FR-RES-03 | Halaman menampilkan nominal tagihan bulan berjalan dan statusnya.                                       | Must      |
| FR-RES-04 | Halaman tidak menampilkan data warga lain.                                                              | Must      |

### 7.7 Reminder Otomatis (Fase 2)

| ID        | Kebutuhan                                                                                          | Prioritas       |
| --------- | -------------------------------------------------------------------------------------------------- | --------------- |
| FR-REM-01 | Sistem mengirim reminder ke warga yang belum bayar lewat WhatsApp API pada jadwal tertentu.        | Should          |
| FR-REM-02 | Jika WhatsApp API belum tersedia, sistem menampilkan notifikasi status tunggakan di halaman warga. | Must (fallback) |
| FR-REM-03 | Admin dapat mengatur jadwal dan jumlah pengulangan reminder.                                       | Could           |

### 7.8 Halaman Transparansi Publik (Fase 2)

| ID        | Kebutuhan                                                                                | Prioritas |
| --------- | ---------------------------------------------------------------------------------------- | --------- |
| FR-PUB-01 | Halaman publik menampilkan total iuran terkumpul per bulan dan per tahun, tanpa login.   | Must      |
| FR-PUB-02 | Halaman publik menampilkan ringkasan penggunaan dana (kategori pengeluaran dan nominal). | Must      |
| FR-PUB-03 | Halaman publik tidak menampilkan nama warga, alamat, atau status bayar individu.         | Must      |
| FR-PUB-04 | Admin dapat menambah dan mengubah catatan penggunaan dana lewat panel admin.             | Must      |

### 7.9 Ekspor Laporan (Fase 2)

| ID        | Kebutuhan                                             | Prioritas |
| --------- | ----------------------------------------------------- | --------- |
| FR-EXP-01 | Admin dapat mengekspor rekap bulanan ke Excel.        | Should    |
| FR-EXP-02 | Admin dapat mengekspor rekap tahunan ke PDF.          | Should    |
| FR-EXP-03 | Rekap ekspor memuat ringkasan per blok dan per rumah. | Could     |

### 7.10 Payment Gateway (Fase 3, Opsional)

| ID       | Kebutuhan                                                                                              | Prioritas        |
| -------- | ------------------------------------------------------------------------------------------------------ | ---------------- |
| FR-PG-01 | Warga dapat membayar tagihan langsung lewat sistem memakai payment gateway.                            | Won't (fase ini) |
| FR-PG-02 | Sistem memperbarui status tagihan otomatis setelah pembayaran berhasil, lewat webhook payment gateway. | Won't (fase ini) |
| FR-PG-03 | Sistem menyimpan riwayat transaksi payment gateway terpisah dari pencatatan manual.                    | Won't (fase ini) |

## 8. Alur Pengguna Utama

### 8.1 Generate Tagihan dan Pencatatan Bayar (Admin)

1. Admin login ke panel admin.
2. Pada tanggal terjadwal, sistem membuat tagihan bulanan untuk seluruh rumah aktif.
3. Warga membayar cash atau transfer ke bendahara seperti biasa, di luar sistem.
4. Admin membuka daftar tagihan bulan berjalan.
5. Admin mengubah status rumah yang sudah bayar menjadi lunas.
6. Admin mengunggah bukti transfer jika ada.
7. Dashboard admin memperbarui ringkasan secara otomatis.

### 8.2 Cek Status Iuran (Warga)

1. Warga membuka tautan atau memasukkan kode akses rumahnya.
2. Sistem menampilkan status tagihan bulan berjalan.
3. Warga melihat riwayat pembayaran beberapa bulan terakhir.
4. Jika belum bayar, warga melihat nominal dan cara pembayaran manual yang berlaku.

### 8.3 Melihat Transparansi Dana (Publik, Fase 2)

1. Siapa saja membuka halaman transparansi tanpa login.
2. Halaman menampilkan total dana terkumpul bulan dan tahun berjalan.
3. Halaman menampilkan ringkasan pengeluaran per kategori.

## 9. Kebutuhan Non-Fungsional

### 9.1 Performa

- Halaman utama termuat kurang dari 2 detik pada koneksi seluler biasa.
- Sistem tetap responsif untuk RT dengan jumlah rumah sampai beberapa ratus.
- Proses generate tagihan bulanan selesai dalam hitungan detik untuk seluruh rumah.

### 9.2 Keamanan dan Privasi

- Supabase Auth menangani autentikasi admin dengan password yang di-hash.
- Sistem memakai Row Level Security (RLS) di Supabase agar warga hanya bisa membaca data rumahnya sendiri.
- Kode akses warga bersifat unik dan sulit ditebak, bukan angka urut sederhana.
- Halaman publik (Fase 2) tidak boleh membocorkan data pribadi warga lewat celah apa pun, termasuk lewat API yang salah konfigurasi.
- Bukti transfer di Supabase Storage hanya bisa diakses admin dan pemilik rumah terkait.
- Semua input divalidasi dengan Zod di sisi server sebelum masuk database.

### 9.3 Kegunaan

- Antarmuka berbahasa Indonesia dan sederhana untuk pengguna non-teknis.
- Warga tidak perlu membuat akun. Cukup kode akses atau tautan.
- Aplikasi dapat diinstal ke homescreen HP lewat PWA tanpa app store.
- Tampilan mobile-first, karena mayoritas warga mengakses lewat HP.

### 9.4 Ketersediaan

- Target ketersediaan tinggi karena hosting di Vercel dan database di Supabase, keduanya layanan terkelola.
- Backup database otomatis lewat fitur bawaan Supabase, dicek berkala oleh admin.

### 9.5 Kompatibilitas

- Mendukung browser modern di Android dan iOS.
- PWA berjalan baik pada Chrome dan Safari versi terbaru.

### 9.6 Maintainability

- Kode memakai TypeScript untuk mengurangi bug tipe data.
- Struktur folder Next.js App Router yang konsisten antar fitur.
- React Query menangani fetching dan cache data di sisi klien.
- Zod schema dipakai ulang antara validasi form dan validasi server.

## 10. Arsitektur Teknis

### 10.1 Stack

| Lapisan              | Teknologi                               |
| -------------------- | --------------------------------------- |
| Frontend dan backend | Next.js (App Router), TypeScript        |
| Styling              | Tailwind CSS                            |
| Database             | Supabase (Postgres)                     |
| Autentikasi          | Supabase Auth                           |
| Penyimpanan file     | Supabase Storage (bukti transfer)       |
| Validasi input       | Zod                                     |
| Data fetching        | React Query                             |
| Hosting              | Vercel                                  |
| Progressive Web App  | Manifest dan service worker Next.js PWA |

### 10.2 Struktur Komponen

```
[Warga: Browser/PWA] --HTTPS--> [Next.js App Router]
                                       |
                                 [Server Actions / API Routes]
                                       |
                          [Supabase: Postgres, Auth, Storage]

[Admin: Browser] --HTTPS--> [Next.js App Router, halaman admin]
                                       |
                                 [Server Actions / API Routes]
                                       |
                          [Supabase: Postgres, Auth, Storage]
```

### 10.3 Model Data (Ringkas)

| Tabel       | Kolom Utama                                                                                   |
| ----------- | --------------------------------------------------------------------------------------------- |
| admins      | id, email, full_name, role, created_at                                                        |
| blocks      | id, name, monthly_due_amount                                                                  |
| households  | id, block_id, house_number, head_of_family_name, contact, access_code, is_active              |
| bills       | id, household_id, period (bulan-tahun), amount, status (unpaid/partial/paid), due_date        |
| payments    | id, bill_id, paid_amount, paid_at, method (cash/transfer), proof_file_url, recorded_by, notes |
| fund_usages | id, period, category, amount, description, created_by                                         |
| reminders   | id, bill_id, sent_at, channel, status                                                         |

### 10.4 Catatan Struktur Halaman (Ringkas)

| Route (contoh)         | Fungsi                                  | Akses              |
| ---------------------- | --------------------------------------- | ------------------ |
| `/admin/login`         | Login admin                             | Publik             |
| `/admin/dashboard`     | Ringkasan status bayar bulan berjalan   | Admin              |
| `/admin/households`    | Kelola data warga dan blok              | Admin              |
| `/admin/bills`         | Kelola tagihan dan status bayar         | Admin              |
| `/admin/reports`       | Ekspor rekap (Fase 2)                   | Admin              |
| `/admin/fund-usage`    | Kelola catatan penggunaan dana (Fase 2) | Admin              |
| `/status/[accessCode]` | Halaman status iuran warga              | Publik dengan kode |
| `/transparency`        | Halaman transparansi dana (Fase 2)      | Publik             |

### 10.5 Aturan Bisnis Inti

1. Satu rumah hanya punya satu tagihan aktif per periode bulan.
2. Nominal tagihan mengikuti nominal iuran blok saat tagihan dibuat, bukan berubah otomatis jika nominal blok diubah setelahnya.
3. Riwayat tagihan dan pembayaran tidak dihapus. Koreksi dilakukan lewat catatan atau perubahan status, bukan penghapusan data.
4. Halaman warga dan halaman publik tidak pernah menampilkan data pribadi milik rumah lain.
5. Kode akses rumah tidak boleh berupa angka urut yang mudah ditebak (mis. 1, 2, 3).

## 11. Kebutuhan Antarmuka (UI)

### 11.1 Halaman Utama

| Halaman                      | Isi Utama                                               |
| ---------------------------- | ------------------------------------------------------- |
| Login Admin                  | Form email dan password                                 |
| Dashboard Admin              | Ringkasan bulan berjalan, daftar status bayar           |
| Data Warga dan Blok          | Tabel dan form kelola rumah, blok, dan nominal iuran    |
| Tagihan Bulan Berjalan       | Tabel tagihan, tombol ubah status, upload bukti         |
| Status Iuran Warga           | Kartu status tagihan bulan berjalan dan riwayat singkat |
| Reminder (Fase 2)            | Daftar warga menunggak dan status reminder              |
| Transparansi Publik (Fase 2) | Total dana dan ringkasan penggunaan                     |
| Laporan (Fase 2)             | Filter periode dan tombol ekspor                        |

### 11.2 Prinsip Desain

- Prioritas tampilan mobile, karena warga umumnya mengakses lewat HP.
- Warna status konsisten: hijau untuk lunas, merah untuk belum bayar, kuning untuk sebagian.
- Form sesederhana mungkin untuk admin yang tidak terbiasa teknologi.
- Halaman warga tidak menampilkan menu atau elemen yang membingungkan. Fokus pada status dan riwayat.

## 12. Rencana Rilis

| Fase              | Cakupan                                                                                              | Perkiraan Durasi                                             |
| ----------------- | ---------------------------------------------------------------------------------------------------- | ------------------------------------------------------------ |
| Fase 0            | Setup proyek, desain database, desain UI dasar                                                       | 1 minggu                                                     |
| Fase 1 (MVP)      | Auth admin, data warga dan blok, generate tagihan, pencatatan bayar, dashboard, halaman status warga | 3 sampai 4 minggu                                            |
| Fase 2            | Reminder otomatis, halaman transparansi publik, ekspor laporan                                       | 2 sampai 3 minggu                                            |
| Fase 3 (opsional) | Integrasi payment gateway                                                                            | 2 sampai 3 minggu, dikerjakan terpisah setelah Fase 2 stabil |

Total perkiraan MVP sampai Fase 2: 6 sampai 8 minggu untuk satu pengembang, dikerjakan paruh waktu.

## 13. Strategi Pengujian

- **Unit test:** logika generate tagihan dan perhitungan nominal per blok.
- **Integration test:** Server Actions dan Row Level Security Supabase.
- **Uji akses:** pastikan satu kode akses rumah tidak bisa membaca data rumah lain.
- **UAT:** bendahara mencoba mencatat tagihan sebulan penuh, warga mencoba cek status lewat HP.
- **Uji PWA:** instalasi ke homescreen di Android dan iOS.

## 14. Migrasi dan Rollout

- Admin menyiapkan data warga dan nominal iuran per blok sebelum go-live.
- Bulan pertama, sistem dan catatan manual berjalan berdampingan untuk memastikan kecocokan data.
- Admin membagikan tautan atau kode akses ke tiap rumah lewat kertas fisik atau grup WhatsApp RT.
- Setelah data cocok satu bulan penuh, catatan manual dihentikan.

## 15. Risiko dan Mitigasi

| Risiko                                         | Dampak                            | Mitigasi                                                                    |
| ---------------------------------------------- | --------------------------------- | --------------------------------------------------------------------------- |
| Warga lansia sulit memakai sistem digital      | Adopsi rendah pada sebagian warga | Kode akses sederhana, bantuan RT setempat, papan pengumuman fisik tetap ada |
| Kebocoran data pribadi warga di halaman publik | Kepercayaan warga turun           | RLS ketat, halaman publik hanya menampilkan data agregat                    |
| WhatsApp API berbayar atau rumit disiapkan     | Fase 2 reminder tertunda          | Sediakan fallback notifikasi di halaman warga tanpa WhatsApp API            |
| Bendahara lupa update status bayar             | Data tidak akurat                 | Reminder internal untuk admin, tampilan dashboard yang jelas                |
| Kuota gratis Supabase atau Vercel terlampaui   | Sistem berhenti berfungsi         | Pantau penggunaan, siapkan opsi upgrade jika RT berkembang besar            |

## 16. Asumsi dan Ketergantungan

**Asumsi**

- Pembayaran tetap dilakukan secara manual (cash atau transfer) pada MVP dan Fase 2.
- Satu RT memiliki jumlah rumah dalam skala kecil sampai menengah, cukup untuk tingkat gratis Supabase dan Vercel.
- Warga memiliki akses HP dengan browser modern.

**Ketergantungan**

- Admin menyediakan data awal warga dan nominal iuran.
- WhatsApp API (Fase 2) memerlukan penyedia pihak ketiga dan mungkin berbayar.
- Payment gateway (Fase 3) memerlukan akun merchant dan proses verifikasi dari penyedia gateway.

## 17. Pengembangan Masa Depan (Backlog)

- Multi-RT atau multi-RW dalam satu instalasi.
- Manajemen surat menyurat RT.
- Manajemen inventaris aset RT.
- Notifikasi lewat email sebagai alternatif WhatsApp.
- Laporan tahunan otomatis terjadwal, dikirim ke seluruh warga.
- Peran tambahan seperti sekretaris atau pengawas dengan akses terbatas.

## 18. Pertanyaan Terbuka

1. Berapa perkiraan jumlah rumah pada RT yang menjadi target awal?
2. Apakah nominal iuran bisa berubah di tengah tahun, dan bagaimana dampaknya ke tagihan yang sudah dibuat?
3. Siapa yang berhak mengunggah dan mengubah catatan penggunaan dana pada halaman transparansi?
4. Apakah warga perlu notifikasi email selain WhatsApp?
5. Apakah kode akses warga dibagikan sekali di awal atau bisa direset sewaktu-waktu?

## 19. Glosarium

| Istilah                  | Arti                                                                                       |
| ------------------------ | ------------------------------------------------------------------------------------------ |
| Kode akses               | Kode unik per rumah untuk membuka halaman status iuran tanpa login penuh                   |
| RLS (Row Level Security) | Fitur Postgres/Supabase yang membatasi baris data yang bisa dibaca tiap pengguna           |
| PWA                      | Progressive Web App, aplikasi web yang bisa diinstal ke homescreen seperti aplikasi native |
| Fund usage               | Catatan penggunaan dana RT yang ditampilkan di halaman transparansi publik                 |
| UAT                      | User Acceptance Testing, uji penerimaan oleh pengguna (admin dan warga)                    |
