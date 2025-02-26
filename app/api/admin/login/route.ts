import { NextResponse } from 'next/server';
import { validateCredentials, generateAuthToken, setAuthCookie, clearAuthCookies } from '@/app/utils/auth';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { username, password } = body;
    
    // Validate that credentials were provided
    if (!username || !password) {
      return NextResponse.json(
        { error: 'Username and password are required' },
        { status: 400 }
      );
    }
    
    // Validate credentials against environment variables
    if (!validateCredentials(username, password)) {
      // Use a generic error message to prevent username enumeration
      return NextResponse.json(
        { error: 'Invalid username or password' },
        { status: 401 }
      );
    }
    
    // Generate authentication token
    const token = generateAuthToken();
    
    // Create response first
    const response = NextResponse.json(
      { success: true },
      { status: 200 }
    );
    
    // Set cookies using the updated setAuthCookie function
    // Using the correct method for cookies in Next.js 15+
    await setAuthCookie(token);
    
    return response;
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// Handle logout requests with proper cookie clearing
export async function DELETE() {
  try {
    // Clear auth cookies using the updated function
    await clearAuthCookies();
    
    return NextResponse.json(
      { success: true },
      { status: 200 }
    );
  } catch (error) {
    console.error('Logout error:', error);
    return NextResponse.json(
      { error: 'Failed to logout' },
      { status: 500 }
    );
  }
}