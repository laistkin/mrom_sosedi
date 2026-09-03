let _sql: any = null;
let _initError: Error | null = null;

async function getSql() {
  if (_sql) return _sql;
  if (_initError) throw _initError;
  
  try {
    const { neon } = await import("@neondatabase/serverless");
    const DATABASE_URL = process.env.DATABASE_URL || process.env.DATABASE_URL_UNPOOLED;
    
    if (!DATABASE_URL) {
      console.warn("[db] No DATABASE_URL set — database operations disabled");
      _initError = new Error("No DATABASE_URL");
      throw _initError;
    }
    
    _sql = neon(DATABASE_URL);
    return _sql;
  } catch (err: any) {
    console.error("[db] Failed to initialize Neon connection:", err?.message || err);
    _initError = new Error(err?.message || "Neon init failed");
    throw _initError;
  }
}

// Safe template literal wrapper that returns empty array on failure
const safeSql: any = async function sqlTemplate(strings: TemplateStringsArray, ...values: any[]): Promise<any[]> {
  try {
    const db = await getSql();
    const result = await db(strings as any, ...(values as any[]));
    return (result as any[]) ?? [];
  } catch (err: any) {
    console.error("[db] Query failed:", err?.message || err);
    return [];
  }
};

safeSql.raw = () => [];

export const sql = safeSql;
