import { verifyToken } from './jwt';

// Extract cookie string from request headers
export function extractCookie(cookies: string): string | null {
  return cookies
    .split(';')
    .map(c => c.trim())
    .find(c => c.startsWith('mrom_admin_session='))
    ?.split('=')[1] || null;
}

// Verify admin session from request — returns payload or null
export async function getAdminSession(request: Request): Promise<{ admin: true } | null> {
  const cookieHeader = request.headers.get('cookie') || '';
  const token = extractCookie(cookieHeader);
  if (!token) return null;
  return verifyToken(token);
}

// Check if current user is authenticated as admin (for API routes)
export async function requireAdmin(request: Request): Promise<{ response: Response | null; payload: { admin: true } | null }> {
  const payload = await getAdminSession(request);
  if (!payload) {
    return {
      response: new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401, headers: { 'Content-Type': 'application/json' } }),
      payload: null
    };
  }
  return { response: null, payload };
}
