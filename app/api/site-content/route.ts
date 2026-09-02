import { NextResponse } from "next/server";
import { sql } from "@/app/lib/db";
import { siteContentSchema, safeParseJson, formatZodError } from "@/app/lib/validators";

// GET /api/site-content — get all site content
export async function GET() {
  try {
    const rows = await sql`SELECT * FROM site_content WHERE id = 'default'`;
    
    if (rows.length === 0) {
      // Return default empty content
      return NextResponse.json({
        about: "",
        hero: {},
        helpSteps: [],
        faq: [],
        gallery: [],
        team: [],
        reports: []
      });
    }

    return NextResponse.json(rows[0]);
  } catch (err) {
    console.error("GET /api/site-content error:", err);
    const message = err instanceof Error ? err.message : "Internal server error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

// POST /api/site-content — update site content
export async function POST(request: Request) {
  try {
    const body = await request.json();

    // Validate input data with Zod schema (partial update allowed)
    const validation = safeParseJson(siteContentSchema, body);
    if (!validation.success) {
      return NextResponse.json({ error: formatZodError(validation.error) }, { status: 400 });
    }

    // Merge with existing data or create new row
    const existing = await sql`SELECT * FROM site_content WHERE id = 'default'`;
    
    if (existing.length === 0) {
      const heroJson = JSON.stringify(validation.data.hero || {});
      const helpStepsJson = JSON.stringify(validation.data.helpSteps || []);
      await sql`
        INSERT INTO site_content (id, about, hero, help_steps, faq, gallery, team, reports)
        VALUES ('default', ${validation.data.about || ""}, ${heroJson}, 
                ${helpStepsJson}, ${JSON.stringify(validation.data.faq || [])},
                ${JSON.stringify(validation.data.gallery || [])}, ${JSON.stringify(validation.data.team || [])},
                ${JSON.stringify(validation.data.reports || [])})
      `;
    } else {
      // Update only provided fields
      const updates: { dbKey: string; value: any }[] = [];
      const jsonKeys = ["hero", "helpSteps", "faq", "gallery", "team", "reports"];
      for (const key of ["about", "hero", "helpSteps", "faq", "gallery", "team", "reports"]) {
        if ((validation.data as any)[key] !== undefined) {
          const dbKey = key === "helpSteps" ? "help_steps" : key;
          const isJson = jsonKeys.includes(key);
          updates.push({
            dbKey,
            value: isJson ? JSON.stringify((validation.data as any)[key]) : (validation.data as any)[key],
          });
        }
      }

      if (updates.length > 0) {
        const setClauses = updates.map((u, i) => `${u.dbKey} = $${i + 1}`).join(", ");
        const setValues = updates.map(u => u.value);
        await sql`UPDATE site_content SET ${setClauses} WHERE id = 'default'`, setValues as any[];
      }
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("POST /api/site-content error:", err);
    return NextResponse.json({ error: "Failed to update site content" }, { status: 500 });
  }
}
