import { NextResponse } from 'next/server';
import { clearAuthCookies } from '@/app/utils/auth';

export async function POST() {
  try {
    // Clear authentication cookies
    await clearAuthCookies();
    
    return NextResponse.json(
      { success: true },
      { status: 200 }
    );
  } catch (error) {
    console.error('Logout error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}