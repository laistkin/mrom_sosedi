import { NextResponse } from "next/server";
import { sql } from "@/app/lib/db";
import { donationSchema, safeParseJson, formatZodError } from "@/app/lib/validators";

// GET /api/donations — get donations (optionally filtered by campaignId)
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const campaignId = searchParams.get("campaignId");

    let query = `SELECT * FROM donations ORDER BY created_at DESC`;
    const params: string[] = [];
    
    if (campaignId) {
      query += ` WHERE campaign_id = $${params.length + 1}`;
      params.push(campaignId);
    }

    const result = await sql.query(query, params as any[]);

    return NextResponse.json(
      (result as any[]).map((r: any) => ({
        ...r,
        amount: Number(r.amount),
        created_at: r.created_at
      }))
    );
  } catch (err) {
    console.error("GET /api/donations error:", err);
    const message = err instanceof Error ? err.message : "Internal server error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

// POST /api/donations — create a new donation
export async function POST(request: Request) {
  try {
    const body = await request.json();

    // Validate input data with Zod schema
    const validation = safeParseJson(donationSchema, body);
    if (!validation.success) {
      return NextResponse.json({ error: formatZodError(validation.error) }, { status: 400 });
    }

    const { campaignId, amount, donorName, anonymous, method, campaignTitle, userPhone } = validation.data;

    // Check if campaign exists
    const campaigns = await sql`SELECT id FROM campaigns WHERE id = ${campaignId}`;
    if (campaigns.length === 0) {
      return NextResponse.json({ error: "Campaign not found" }, { status: 404 });
    }

    // Create donation record
    const id = `don_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
    
    await sql`
      INSERT INTO donations (id, campaign_id, campaign_title, amount, donor_name, anonymous, method, user_phone)
      VALUES (${id}, ${campaignId}, ${campaignTitle || ""}, ${amount}, ${donorName || ""}, ${anonymous || false}, ${method || "bank_card"}, ${userPhone || ""})
    `;

    // Update campaign collected amount and donors count
    await sql`
      UPDATE campaigns 
      SET collected = collected + ${amount},
          donors = donors + CASE WHEN ${!anonymous} THEN 1 ELSE 0 END
      WHERE id = ${campaignId}
    `;

    return NextResponse.json({ success: true, donationId: id });
  } catch (err) {
    console.error("POST /api/donations error:", err);
    // Check for foreign key constraint violation
    if ((err as any).code === '23503') {
      return NextResponse.json({ error: "Campaign not found" }, { status: 404 });
    }
    const message = err instanceof Error ? err.message : "Internal server error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
