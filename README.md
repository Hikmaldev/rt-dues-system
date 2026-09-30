# 🏘️ RTHub — Digital RT Neighborhood Dues Management System

![Next.js](https://img.shields.io/badge/Next.js-15-black?logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5.7-3178C6?logo=typescript&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4-06B6D4?logo=tailwindcss&logoColor=white)
![Neon Postgres](https://img.shields.io/badge/Neon-Postgres-00E599?logo=postgresql&logoColor=white)
![Vercel](https://img.shields.io/badge/Vercel-Deployed-000?logo=vercel)
![License](https://img.shields.io/badge/License-MIT-green)

**RTHub** is a full-stack web application that helps neighborhood associations (RT) manage monthly household dues digitally, transparently, and independently. Built with **Next.js 15 App Router**, **Neon Serverless Postgres**, and deployed on **Vercel**.

> *"Check Your Dues Status — Easy, Transparent & Self-Service"*

---

## ✨ Key Features

### 🏠 Resident Portal (Public)
- **Check dues status** with just a household access code (e.g., `RH-A7-X8K2`)
- Current month's bill with payment status (✅ Paid / ⏳ Partial / ❌ Unpaid)
- 4-month payment history
- Bank transfer details with one-click copy button
- **Privacy-first** — only shows data for the household that owns the access code

### 📊 Fund Transparency (Public)
- Open report of the RT's treasury with no resident personal data
- Expense breakdown by category (Security, Sanitation, Lighting, Social)
- 6-month collection trend chart
- Payment compliance stats and available balance

### 🔐 Admin Panel (RT Officials Only)
- **Dashboard** — Monthly metrics: total collected, paid/unpaid houses, payment donut chart, residents needing follow-up
- **Households** — Master data CRUD, auto-generated access codes, occupied/vacant toggle
- **Monthly Bills** — Bulk bill generation, payment recording (cash/transfer), filter by status & house type
- **Fund Usage** — Record RT expenses, automatically published to the public transparency page
- **Reports & Recap** — Filter by period/status, table preview, CSV (Excel) export and PDF print

---

## 💰 Dues Rate System

| House Status | Rate / Month | Badge |
|:---:|:---:|:---:|
| 🏡 Permanent / Owned House | Rp 10,000 | 🔵 Blue |
| 🏠 Rental House | Rp 5,000 | 🟡 Amber |

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| **Framework** | [Next.js 15](https://nextjs.org/) (App Router, Server Components, Server Actions) |
| **Language** | [TypeScript](https://www.typescriptlang.org/) 5.7 |
| **UI** | [React 19](https://react.dev/) + [Tailwind CSS v4](https://tailwindcss.com/) |
| **Icons** | [Lucide React](https://lucide.dev/) |
| **Database** | [Neon Serverless Postgres](https://neon.tech/) (`@neondatabase/serverless`) |
| **Validation** | [Zod](https://zod.dev/) |
| **Authentication** | Custom session-based (HMAC SHA-256 cookie + PBKDF2 password hash) |
| **Hosting** | [Vercel](https://vercel.com/) |
| **CSS Utils** | `clsx` + `tailwind-merge` |

---

## 🗂️ Project Structure

```
RT-Dues-System/
├── neon/
│   └── schema.sql              # DDL + seed data for Neon Postgres
├── scripts/
│   └── migrate-neon.mjs        # Database migration script
├── src/
│   ├── app/
│   │   ├── page.tsx            # Landing / home page
│   │   ├── status/             # Resident dues lookup portal
│   │   ├── transparency/       # Public fund transparency
│   │   ├── admin/
│   │   │   ├── login/          # Admin login page
│   │   │   ├── dashboard/      # Admin dashboard
│   │   │   ├── households/     # Household management
│   │   │   ├── bills/          # Monthly bills
│   │   │   ├── fund-usage/     # Fund usage
│   │   │   └── reports/        # Reports & export
│   │   └── api/                # REST API endpoints
│   ├── components/             # Interactive client components
│   ├── actions/                # Next.js Server Actions
│   ├── lib/
│   │   ├── auth/               # Authentication & session management
│   │   ├── db/                 # Neon Postgres connection
│   │   ├── services/           # Business logic layer
│   │   ├── validations/        # Zod schemas
│   │   └── mockData.ts         # Demo data (fallback without database)
│   └── types/                  # TypeScript interfaces
├── neon.ts                     # Neon deployment config
├── next.config.ts              # Next.js config
└── package.json
```

---

## 🚀 Getting Started

### Prerequisites
- [Node.js](https://nodejs.org/) v18+ (v20+ recommended)
- A [Neon](https://neon.tech/) account (free) — *optional for local development*

### 1. Clone & Install

```bash
git clone https://github.com/Hikmaldev/rt-dues-system.git
cd rt-dues-system
npm install
```

### 2. Setup Environment Variables

Copy the example file and adjust its contents:

```bash
cp .env.example .env.local
```

Edit `.env.local`:

```env
# Neon Database URL (get it from neon.tech → Dashboard → Connection Details)
DATABASE_URL=postgresql://user:password@ep-xxx.aws.neon.tech/dbname?sslmode=require

# Secret key for admin session tokens (use a random string)
AUTH_SECRET=your-random-secret-key-min-32-chars
```

> **💡 No database?** No problem! The app falls back to in-memory demo data, so you can run it immediately without any database configuration.

### 3. Setup Database (Optional)

If you already have a Neon database, apply the schema:

```bash
node scripts/migrate-neon.mjs
```

This creates all tables and seeds the initial demo data.

### 4. Run the Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🌐 Deploy to Vercel + Neon

### Step 1: Create a Database on Neon
1. Sign up / log in at [neon.tech](https://neon.tech)
2. Create a new project → pick the closest region (e.g., Singapore `ap-southeast-1` for Indonesia)
3. Copy the **Connection String** from the Connection Details page

### Step 2: Run the SQL Schema
1. Open the **SQL Editor** in the Neon dashboard
2. Copy and paste the entire contents of `neon/schema.sql`
3. Click **Run** — tables and seed data are created

### Step 3: Deploy to Vercel
1. Push your code to GitHub
2. Go to [vercel.com](https://vercel.com) → Import the repository
3. Add the **Environment Variables**:

   | Key | Value |
   |---|---|
   | `DATABASE_URL` | Your Neon connection string |
   | `AUTH_SECRET` | Random string of at least 32 characters |

4. Click **Deploy** — done! 🎉

---

## 🔑 Demo Account

After running `neon/schema.sql`, these admin credentials are ready to use:

| Field | Value |
|---|---|
| Email | `budi.santoso@rt05.id` |
| Password | `password123` |
| Name | Budi Santoso |
| Role | Treasurer |

Demo resident access codes:

| Access Code | Head of Family | House Number | Status |
|---|---|---|---|
| `RH-A7-X8K2` | Joko Pranoto | A-07 | Permanent |
| `RH-C15-Q9L4` | Lina Marlina | C-15 | Rental |
| `RH-B3-M2P7` | Dedi Setiawan | B-03 | Rental |
| `RH-B12-K7N3` | Rudi Hartono | B-12 | Permanent |
| `RH-C8-W4E9` | Siti Wahyuni | C-08 | Permanent |
| `RH-D4-R1S5` | Andi Firmansyah | D-04 | Rental |

---

## 📡 API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/api/auth/login` | Admin login (email + password) |
| `POST` | `/api/auth/logout` | Admin logout (clear session) |
| `GET` | `/api/households` | List households (filters: status, active, search) |
| `POST` | `/api/households` | Create a new household |
| `PATCH` | `/api/households/[id]` | Toggle occupied/vacant status |
| `GET` | `/api/bills` | List bills (filters: period, status, house type) |
| `POST` | `/api/bills/generate` | Bulk-generate monthly bills |
| `POST` | `/api/payments` | Record a payment |
| `GET` | `/api/resident/status` | Resident dues status lookup (by access code) |
| `GET` | `/api/transparency` | RT fund transparency data (public) |
| `POST` | `/api/fund-usage` | Record an RT expense |
| `GET` | `/api/reports/export` | Export report as CSV |

---

## 🏗️ Architecture

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

**Dual-mode data**: When `DATABASE_URL` is configured, all data operations query Neon Postgres directly. Without `DATABASE_URL`, the app uses an in-memory store seeded with mock data — enabling development with zero setup.

---

## 🔒 Security

- **Admin Authentication**: Session tokens are signed with HMAC SHA-256 and stored in HTTP-only cookies (inaccessible to client-side JavaScript)
- **Password Hashing**: PBKDF2 with SHA-512 and a random 16-byte salt
- **Resident Privacy**: The dues status page only shows data for the household matching the access code (strict household-level isolation)
- **Public Transparency**: The transparency page only shows aggregate data, never resident personal identities
- **Input Validation**: All inputs are validated with Zod schemas on the server side
- **Middleware Guard**: `/admin/*` routes are protected by Next.js middleware that checks for a valid session cookie

---

## 📜 License

This project is licensed under the [MIT License](LICENSE).

---

## 🤝 Contributing

Contributions are welcome! Feel free to open an *issue* or *pull request* for bug fixes, new features, or documentation improvements.

1. Fork this repository
2. Create a feature branch (`git checkout -b feature/your-feature`)
3. Commit your changes (`git commit -m 'Add new feature'`)
4. Push to the branch (`git push origin feature/your-feature`)
5. Open a Pull Request

---

<p align="center">
  Built with ❤️ for the residents of RT 05 / RW 02, Cempaka
</p>