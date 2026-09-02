import { neon } from "@neondatabase/serverless";

const DATABASE_URL = process.env.DATABASE_URL;
const DATABASE_URL_UNPOOLED = process.env.DATABASE_URL_UNPOOLED;

let sql: ReturnType<typeof neon> | null = null;
try {
  const url = DATABASE_URL || DATABASE_URL_UNPOOLED;
  if (url) {
    sql = neon(url);
  } else {
    console.warn("[db] No DATABASE_URL set — database operations disabled");
  }
} catch (err) {
  console.error("[db] Failed to initialize Neon connection:", err);
}

// Safe template literal: returns empty array if DB is unavailable
const safeSql = Object.assign(
  async function sqlTemplate(strings: TemplateStringsArray, ...values: any[]): Promise<any[]> {
    if (!sql) return [];
    try {
      const result = await sql(strings as any, ...(values as any[]));
      return (result as any[]) ?? [];
    } catch (err) {
      console.error("[db] Query failed:", err);
      return [];
    }
  },
  { raw: () => [] }
) as any;

export const sql = safeSql;
