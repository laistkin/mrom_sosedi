import { NextResponse } from "next/server";
import { sql } from "@/app/lib/db";

// GET /api/donations/[phone] — get donation history for a user by phone
export async function GET(request: Request, { params }: { params: Promise<{ phone: string }> }) {
  try {
    const { phone } = await params;
    
    if (!phone || phone.length < 3) {
      return NextResponse.json({ error: "Некорректный номер телефона" }, { status: 400 });
    }

    const result = await sql`
      SELECT id, campaign_id, campaign_title, amount, donor_name, anonymous, method, created_at
      FROM donations
      WHERE user_phone = ${phone}
      ORDER BY created_at DESC
    `;

    return NextResponse.json(
      (result as any[]).map((r: any) => ({
        ...r,
        amount: Number(r.amount),
        created_at: r.created_at?.toISOString() || new Date().toISOString(),
      }))
    );
  } catch (err) {
    console.error("GET /api/donations/[phone] error:", err);
    const message = err instanceof Error ? err.message : "Internal server error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
