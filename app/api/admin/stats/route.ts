import { NextResponse } from 'next/server';
import { google } from 'googleapis';
import { apiCache } from '@/app/utils/cache';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
export const revalidate = 60; // Revalidate every 60 seconds

export async function GET() {
  try {
    // Try to get stats from cache first (5 minute TTL)
    return await apiCache.getOrSet(
      'admin-stats',
      async () => {
        const auth = new google.auth.GoogleAuth({
          credentials: {
            client_email: process.env.GOOGLE_CLIENT_EMAIL,
            private_key: process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
          },
          scopes: ['https://www.googleapis.com/auth/spreadsheets'],
        });

        const sheets = google.sheets({ version: 'v4', auth });

        const response = await sheets.spreadsheets.values.get({
          spreadsheetId: process.env.GOOGLE_SPREADSHEET_ID,
          range: 'Sheet1!A:F',
        });

        const rows = response.data.values || [];
        
        // Calculate statistics
        const stats = {
          totalMeasurements: rows.length - 1, // Excluding header row
          pendingMeasurements: rows.filter(row => row[5] === 'Pending').length,
          completedMeasurements: rows.filter(row => row[5] === 'Completed').length,
          recentMeasurements: rows.slice(-5), // Last 5 measurements
          lastUpdated: new Date().toISOString(),
        };

        return NextResponse.json(stats, {
          headers: {
            'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=300',
          }
        });
      },
      5 * 60 * 1000 // 5 minutes TTL
    );
  } catch (error) {
    console.error('Admin stats error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch admin statistics' },
      { status: 500 }
    );
  }
}