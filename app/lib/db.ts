import { neon } from "@neondatabase/serverless";

const DATABASE_URL = process.env.DATABASE_URL;
const DATABASE_URL_UNPOOLED = process.env.DATABASE_URL_UNPOOLED;

// Use pooled connection for normal queries (better for serverless)
export const sql = neon(DATABASE_URL || DATABASE_URL_UNPOOLED!);
