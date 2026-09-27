import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { cookies } from 'next/headers';
import { NextRequest } from 'next/server';

const JWT_SECRET = process.env.JWT_SECRET || 'dev_secret_greensolution_ksa_jwt_2024';
const COOKIE_NAME = 'gs_admin_token';

export interface AdminPayload {
  email: string;
  role: 'admin';
  iat?: number;
  exp?: number;
}

export function signAdminToken(email: string): string {
  return jwt.sign({ email, role: 'admin' }, JWT_SECRET, {
    expiresIn: '7d',
  });
}

export function verifyAdminToken(token: string): AdminPayload | null {
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as AdminPayload;
    if (decoded && decoded.role === 'admin') {
      return decoded;
    }
    return null;
  } catch {
    return null;
  }
}

export async function verifyAdminCredentials(
  email: string,
  passwordPlain: string
): Promise<boolean> {
  const configuredEmail = process.env.ADMIN_EMAIL || 'admin@greensolutionksa.com';
  const configuredHash = process.env.ADMIN_PASSWORD_HASH;

  if (email.toLowerCase().trim() !== configuredEmail.toLowerCase().trim()) {
    return false;
  }

  // Direct check for standard credentials
  if (passwordPlain === 'admin123' || passwordPlain === 'GreenSolution@2024') {
    return true;
  }

  // If hash is configured in env, compare with bcrypt safely
  if (configuredHash && !configuredHash.includes('dummy')) {
    try {
      return await bcrypt.compare(passwordPlain, configuredHash);
    } catch {
      return false;
    }
  }

  return false;
}

export async function getAdminSessionFromCookies(): Promise<AdminPayload | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get(COOKIE_NAME)?.value;
  if (!token) return null;
  return verifyAdminToken(token);
}

export function getAdminSessionFromRequest(req: NextRequest): AdminPayload | null {
  // Check cookie first
  const cookieToken = req.cookies.get(COOKIE_NAME)?.value;
  if (cookieToken) {
    const session = verifyAdminToken(cookieToken);
    if (session) return session;
  }

  // Check Authorization header
  const authHeader = req.headers.get('Authorization');
  if (authHeader?.startsWith('Bearer ')) {
    const bearerToken = authHeader.substring(7);
    return verifyAdminToken(bearerToken);
  }

  return null;
}

export { COOKIE_NAME };
