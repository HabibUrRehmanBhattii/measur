import { google } from 'googleapis';
import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET() {
  console.log('API Route: Starting GET request');
  
  try {
    const spreadsheetId = process.env.GOOGLE_SPREADSHEET_ID;
    const clientEmail = process.env.GOOGLE_CLIENT_EMAIL;
    const privateKey = process.env.GOOGLE_PRIVATE_KEY;

    console.log('Environment variables check:', {
      spreadsheetId: spreadsheetId ? 'Present' : 'Missing',
      clientEmail: clientEmail ? 'Present' : 'Missing',
      privateKey: privateKey ? 'Present' : 'Missing',
    });

    if (!spreadsheetId || !clientEmail || !privateKey) {
      const missingVars = [];
      if (!spreadsheetId) missingVars.push('GOOGLE_SPREADSHEET_ID');
      if (!clientEmail) missingVars.push('GOOGLE_CLIENT_EMAIL');
      if (!privateKey) missingVars.push('GOOGLE_PRIVATE_KEY');
      
      return NextResponse.json({ 
        error: 'Missing environment variables', 
        missingVars 
      }, { status: 500 });
    }

    const auth = new google.auth.GoogleAuth({
      credentials: {
        client_email: clientEmail,
        private_key: privateKey.replace(/\\n/g, '\n'),
      },
      scopes: ['https://www.googleapis.com/auth/spreadsheets'],
    });

    const sheets = google.sheets({ version: 'v4', auth });

    // First, verify spreadsheet access and get metadata
    const spreadsheet = await sheets.spreadsheets.get({
      spreadsheetId: spreadsheetId
    });

    console.log('Spreadsheet metadata:', {
      title: spreadsheet.data.properties?.title,
      sheets: spreadsheet.data.sheets?.length
    });

    // Get all values including the first row
    const response = await sheets.spreadsheets.values.get({
      spreadsheetId: spreadsheetId,
      range: 'Sheet1!A1:F', // Changed from A2 to A1 to include headers
    });

    const rows = response.data.values;
    
    console.log('Raw data retrieved:', {
      rowCount: rows?.length || 0,
      hasData: !!rows?.length,
      firstRow: rows?.[0] || []
    });

    if (!rows || rows.length <= 1) { // Account for header row
      console.log('No data found or only header row present');
      return NextResponse.json([]);
    }

    // Skip header row and process data
    const measurements = rows.slice(1).map(row => ({
      orderNumber: row[0] || '',
      ebayUsername: row[1] || '',
      type: row[2] || '',
      measurements: row[3] || '',
      date: row[4] || '',
      status: row[5] || ''
    })).filter(measurement => 
      // Filter out rows where all values are empty
      Object.values(measurement).some(value => value.trim() !== '')
    );

    console.log('Processed measurements:', {
      count: measurements.length,
      firstMeasurement: measurements[0] || null
    });

    return NextResponse.json(measurements);

  } catch (error: any) {
    console.error('API Route Error:', {
      message: error.message,
      stack: error.stack,
      response: error.response?.data
    });
    
    return NextResponse.json(
      { 
        error: 'Failed to fetch measurements',
        details: error.message,
        stack: error.stack
      }, 
      { status: 500 }
    );
  }
}
