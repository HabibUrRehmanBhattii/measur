// Simple authentication utility for admin access

import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { createHash } from 'crypto';

// Authentication token expiration time (24 hours)
const TOKEN_EXPIRY = 24 * 60 * 60 * 1000; 

// Hash the password for security
export function hashPassword(password: string): string {
  return createHash('sha256').update(password).digest('hex');
}

// Validate admin credentials
export function validateCredentials(username: string, password: string): boolean {
  const validUsername = process.env.ADMIN_USERNAME;
  const validPasswordHash = process.env.ADMIN_PASSWORD_HASH;
  
  if (!validUsername || !validPasswordHash) {
    console.error('Admin credentials not configured properly in environment variables');
    return false;
  }
  
  const hashedPassword = hashPassword(password);
  return username === validUsername && hashedPassword === validPasswordHash;
}

// Generate an authentication token
export function generateAuthToken(): string {
  const timestamp = Date.now();
  const random = Math.random().toString(36).substring(2);
  const tokenData = `${timestamp}:${random}`;
  
  return createHash('sha256').update(tokenData).digest('hex');
}

// Set the auth token in cookies - Using Response object directly
export async function setAuthCookie(token: string): Promise<void> {
  const cookieStore = cookies();
  
  await cookieStore.set({
    name: 'admin_auth_token',
    value: token,
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    maxAge: TOKEN_EXPIRY / 1000, // Convert to seconds
    path: '/',
    sameSite: 'strict',
  });
  
  // Store token expiry
  await cookieStore.set({
    name: 'admin_token_expiry',
    value: String(Date.now() + TOKEN_EXPIRY),
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    maxAge: TOKEN_EXPIRY / 1000,
    path: '/',
    sameSite: 'strict',
  });
}

// Check if user is authenticated - properly using await with cookies()
export async function isAuthenticated(): Promise<boolean> {
  const cookieStore = cookies();
  const token = await cookieStore.get('admin_auth_token')?.value;
  const expiryTimestamp = await cookieStore.get('admin_token_expiry')?.value;
  
  if (!token || !expiryTimestamp) {
    return false;
  }
  
  // Check if token has expired
  if (Date.now() > parseInt(expiryTimestamp, 10)) {
    return false;
  }
  
  return true;
}

// Clear authentication cookies - properly using await
export async function clearAuthCookies(): Promise<void> {
  const cookieStore = cookies();
  await cookieStore.delete('admin_auth_token');
  await cookieStore.delete('admin_token_expiry');
}

// Redirect to login if not authenticated
export async function requireAuth(): Promise<void> {
  if (!(await isAuthenticated())) {
    redirect('/admin/login');
  }
}