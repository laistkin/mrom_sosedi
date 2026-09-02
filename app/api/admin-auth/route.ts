import { NextResponse } from "next/server";
import { sql } from "@/app/lib/db";
import { signToken, verifyToken, setCookie, clearCookie } from "@/app/lib/auth/jwt";
import { adminAuthSchema, safeParseJson, formatZodError, checkRateLimit, sanitizeString } from "@/app/lib/validators";

// POST /api/admin-auth — login with password → sets HTTP-only JWT cookie
export async function POST(request: Request) {
  try {
    // Extract IP for rate limiting (basic implementation)
    const ip = request.headers.get("x-forwarded-for") || request.headers.get("x-real-ip") || "unknown";
    
    // Rate limit: max 10 attempts per 5 minutes
    if (!checkRateLimit(ip)) {
      return NextResponse.json(
        { error: "Слишком много попыток. Попробуйте позже." },
        { status: 429 }
      );
    }

    const body = await request.json();

    // Validate input data with Zod schema
    const validation = safeParseJson(adminAuthSchema, body);
    if (!validation.success) {
      return NextResponse.json({ error: formatZodError(validation.error) }, { status: 400 });
    }

    const { password } = validation.data;

    // Demo mode: accept hardcoded password (Phase 7.2+ will use DB + bcrypt)
    const DEMO_PASSWORD = 'sosedi2026';
    if (password !== DEMO_PASSWORD) {
      return NextResponse.json({ error: "Неверный пароль" }, { status: 401 });
    }

    // Generate JWT token
    const token = await signToken({ admin: true });

    const response = NextResponse.json({ success: true });
    setCookie(response.headers, token);
    return response;
  } catch (err) {
    console.error("POST /api/admin-auth error:", err);
    const message = err instanceof Error ? err.message : "Internal server error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

// DELETE /api/admin-auth — logout → clears JWT cookie
export async function DELETE() {
  const response = NextResponse.json({ success: true });
  clearCookie(response.headers);
  return response;
}

// GET /api/admin-auth — check if currently authenticated
export async function GET(request: Request) {
  try {
    const cookies = request.headers.get('cookie') || '';
    const token = cookies
      .split(';')
      .map(c => c.trim())
      .find(c => c.startsWith('mrom_admin_session='))
      ?.split('=')[1];

    if (!token) {
      return NextResponse.json({ authenticated: false }, { status: 401 });
    }

    const payload = await verifyToken(token);
    if (!payload) {
      // Token invalid — clear the stale cookie
      const response = NextResponse.json({ authenticated: false }, { status: 401 });
      clearCookie(response.headers);
      return response;
    }

    return NextResponse.json({ authenticated: true, admin: payload.admin });
  } catch (err) {
    console.error("GET /api/admin-auth error:", err);
    return NextResponse.json({ authenticated: false }, { status: 500 });
  }
}
