import { NextRequest, NextResponse } from "next/server";
import { loginSchema } from "@/lib/validations";
import { isNeonConfigured, queryNeon } from "@/lib/db/neon";
import {
  verifyPassword,
  createSessionToken,
  SESSION_COOKIE_NAME,
  AdminSession,
} from "@/lib/auth/session";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validated = loginSchema.parse(body);

    if (isNeonConfigured()) {
      const rows = await queryNeon(
        `SELECT id, email, password, full_name, role FROM admins WHERE LOWER(email) = LOWER($1) LIMIT 1`,
        [validated.email]
      );

      if (!rows || rows.length === 0) {
        return NextResponse.json(
          { error: "Akun pengurus tidak terdaftar dalam database." },
          { status: 401 }
        );
      }

      const admin = rows[0];
      const isMatch = verifyPassword(validated.password, admin.password);

      if (!isMatch) {
        return NextResponse.json(
          { error: "Kata sandi yang Anda masukkan salah." },
          { status: 401 }
        );
      }

      const sessionData: AdminSession = {
        id: String(admin.id),
        email: String(admin.email),
        full_name: String(admin.full_name),
        role: String(admin.role || "treasurer"),
      };

      const token = createSessionToken(sessionData);
      const response = NextResponse.json({
        success: true,
        user: sessionData,
      });

      response.cookies.set(SESSION_COOKIE_NAME, token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        path: "/",
        maxAge: 60 * 60 * 24 * 7, // 7 hari
      });

      return response;
    }

    // Demo authentication fallback (when database is not yet connected)
    const demoSession: AdminSession = {
      id: "demo-admin-id",
      email: validated.email,
      full_name: "Budi Santoso",
      role: "treasurer",
    };

    const token = createSessionToken(demoSession);
    const response = NextResponse.json({
      success: true,
      message: "Login demo berhasil",
      user: demoSession,
    });

    response.cookies.set(SESSION_COOKIE_NAME, token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 7,
    });

    return response;
  } catch (err: any) {
    if (err.errors) {
      return NextResponse.json({ error: err.errors[0]?.message }, { status: 400 });
    }
    return NextResponse.json({ error: "Gagal memproses autentikasi" }, { status: 500 });
  }
}
