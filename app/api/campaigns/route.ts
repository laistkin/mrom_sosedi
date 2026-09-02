import { NextResponse } from "next/server";
import { sql } from "@/app/lib/db";
import { campaignSchema, safeParseJson, formatZodError } from "@/app/lib/validators";

// GET /api/campaigns — list all campaigns
export async function GET() {
  try {
    const rows = await sql`
      SELECT * FROM campaigns ORDER BY created_at DESC
    `;
    return NextResponse.json(rows);
  } catch (err) {
    console.error("GET /api/campaigns error:", err);
    const message = err instanceof Error ? err.message : "Internal server error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

// POST /api/campaigns — create a new campaign (admin only)
export async function POST(request: Request) {
  try {
    const body = await request.json();

    // Validate input data with Zod schema
    const validation = safeParseJson(campaignSchema, body);
    if (!validation.success) {
      return NextResponse.json({ error: formatZodError(validation.error) }, { status: 400 });
    }

    const { id, title, category, location, status, needed, collected, donors, comments, image, summary, description, documents } = validation.data;

    // Convert arrays to JSON strings for DB storage
    const descStr = typeof description === "string" ? description : JSON.stringify(description);
    const docsStr = typeof documents === "string" ? documents : JSON.stringify(documents);

    await sql`
      INSERT INTO campaigns (id, title, category, location, status, needed, collected, donors, comments, image, summary, description, documents)
      VALUES (${id}, ${title}, ${category || ""}, ${location || ""}, ${status || "active"}, ${needed || 0}, ${collected || 0}, ${donors || 0}, ${comments || 0}, ${image || ""}, ${summary || ""}, ${descStr}, ${docsStr})
      ON CONFLICT (id) DO UPDATE SET
        title = EXCLUDED.title,
        category = EXCLUDED.category,
        location = EXCLUDED.location,
        status = EXCLUDED.status,
        needed = EXCLUDED.needed,
        collected = EXCLUDED.collected,
        donors = EXCLUDED.donors,
        comments = EXCLUDED.comments,
        image = EXCLUDED.image,
        summary = EXCLUDED.summary,
        description = EXCLUDED.description,
        documents = EXCLUDED.documents
    `;

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("POST /api/campaigns error:", err);
    const message = err instanceof Error ? err.message : "Internal server error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
