import { NextResponse } from "next/server";
import { sql } from "@/app/lib/db";
import { idParamSchema, formatZodError } from "@/app/lib/validators";

// GET /api/campaigns/[id] — get single campaign with donations summary
export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    // Validate ID parameter
    const idResult = idParamSchema.safeParse({ id });
    if (!idResult.success) {
      return NextResponse.json(
        { error: "Invalid campaign ID", details: formatZodError(idResult.error) },
        { status: 400 }
      );
    }

    const campaigns = await sql`SELECT * FROM campaigns WHERE id = ${id}`;
    if (campaigns.length === 0) {
      return NextResponse.json({ error: "Campaign not found" }, { status: 404 });
    }

    // Get donation stats for this campaign
    const donations = await sql`
      SELECT 
        COUNT(*) as total_donations,
        COALESCE(SUM(amount), 0) as total_collected
      FROM donations 
      WHERE campaign_id = ${id} AND anonymous = false
    `;

    // Get recent donations (non-anonymous)
    const recentDonations = await sql`
      SELECT donor_name, amount, created_at 
      FROM donations 
      WHERE campaign_id = ${id} AND anonymous = false
      ORDER BY created_at DESC 
      LIMIT 10
    `;

    return NextResponse.json({
      ...campaigns[0],
      donationStats: {
        totalDonations: Number(donations[0]?.total_donations || 0),
        totalCollected: Number(donations[0]?.total_collected || 0)
      },
      recentDonations: recentDonations.map((r: { donor_name?: string; amount?: number | bigint; created_at?: string | Date }) => ({
        donor_name: r.donor_name,
        amount: Number(r.amount),
        created_at: r.created_at
      }))
    });
  } catch (err) {
    console.error("GET /api/campaigns/[id] error:", err);
    const message = err instanceof Error ? err.message : "Internal server error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

// DELETE /api/campaigns/[id] — delete a campaign (admin only)
export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    // Validate ID parameter
    const idResult = idParamSchema.safeParse({ id });
    if (!idResult.success) {
      return NextResponse.json(
        { error: "Invalid campaign ID", details: formatZodError(idResult.error) },
        { status: 400 }
      );
    }

    await sql`DELETE FROM campaigns WHERE id = ${id}`;
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("DELETE /api/campaigns/[id] error:", err);
    const message = err instanceof Error ? err.message : "Internal server error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
