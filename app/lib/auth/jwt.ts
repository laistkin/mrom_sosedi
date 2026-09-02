import { SignJWT, jwtVerify } from 'jose';

const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || 'fallback-dev-secret-change-in-production'
);

const COOKIE_NAME = 'mrom_admin_session';
export const COOKIE_MAX_AGE = 60 * 60 * 24; // 24 hours in seconds

// Sign a JWT and return the token string
export async function signToken(payload: { admin: true }): Promise<string> {
  const token = await new SignJWT({ ...payload })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime(`${COOKIE_MAX_AGE}s`)
    .sign(JWT_SECRET);
  return token;
}

// Verify a JWT and return the payload, or null if invalid
export async function verifyToken(token: string): Promise<{ admin: true } | null> {
  try {
    const { payload } = await jwtVerify(token, JWT_SECRET);
    return payload as { admin: true };
  } catch {
    return null;
  }
}

// Cookie options for HTTP-only, Secure (production) or non-secure (dev) cookies
export function setCookie(resHeaders: Headers, token: string): void {
  const isDev = !process.env.VERCEL_URL && !process.env.NEXT_PUBLIC_SITE_URL;
  resHeaders.set(
    'set-cookie',
    `${COOKIE_NAME}=${token}; HttpOnly; Path=/; SameSite=Lax; Max-Age=${COOKIE_MAX_AGE}; ${isDev ? '' : 'Secure; '}Domain=.${getHostname()}`
  );
}

export function clearCookie(resHeaders: Headers): void {
  const isDev = !process.env.VERCEL_URL && !process.env.NEXT_PUBLIC_SITE_URL;
  resHeaders.set(
    'set-cookie',
    `${COOKIE_NAME}=; HttpOnly; Path=/; SameSite=Lax; Max-Age=0; ${isDev ? '' : 'Secure; '}Domain=.${getHostname()}`
  );
}

function getHostname(): string {
  const url = process.env.NEXT_PUBLIC_SITE_URL || '';
  try {
    return new URL(url).hostname.replace(/^www\./, '');
  } catch {
    return '';
  }
}
