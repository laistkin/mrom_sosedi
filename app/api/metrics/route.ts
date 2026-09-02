import { NextResponse } from "next/server";
import { sql } from "@/app/lib/db";

export async function GET() {
  try {
    const donationsResult = await sql`SELECT COUNT(*) as total, COALESCE(SUM(amount), 0) as sum_amount FROM donations`;
    const campaignsResult = await sql`SELECT COUNT(*) as total FROM campaigns WHERE status = 'active'`;
    
    const donations = (donationsResult as any[])[0];
    const campaigns = (campaignsResult as any[])[0];

    return NextResponse.json({
      totalDonations: Number(donations?.total || 0),
      totalAmount: Number(donations?.sum_amount || 0),
      activeCampaigns: Number(campaigns?.total || 0),
    });
  } catch (err) {
    console.error("GET /api/metrics error:", err);
    const message = err instanceof Error ? err.message : "Internal server error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
