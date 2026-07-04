import { NextResponse } from 'next/server';
import { sendMeasurementEmail } from '@/app/utils/email';
import { withSheetsClient } from '@/app/utils/sheets';
import { apiCache } from '@/app/utils/cache';

export const runtime = 'nodejs';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { type, orderNumber, ebayUsername, measurements } = body;

    // Validate request data
    if (!orderNumber || !ebayUsername || !measurements) {
      return NextResponse.json({
        success: false,
        error: 'Missing required fields'
      }, { status: 400 });
    }

    // Send email FIRST — always, even if Sheets fails
    let emailSent = false;
    try {
      const emailResult = await sendMeasurementEmail(body);
      emailSent = emailResult.success;
      if (!emailResult.success) {
        console.error('Email send failed:', emailResult.error);
      }
    } catch (emailErr) {
      console.error('Email error:', emailErr);
    }

    // Try Google Sheets (optional — don't fail the request if it errors)
    let sheetsSuccess = false;
    let sheetsError = null;
    try {
      await withSheetsClient(async (sheets, spreadsheetId) => {
        const submissionDate = new Date().toLocaleString('en-US', {
          year: 'numeric', month: 'long', day: 'numeric',
          hour: 'numeric', minute: '2-digit', hour12: true
        });
        const formattedMeasurements = Object.entries(measurements)
          .map(([key, value]) => `${key}: ${value}cm`).join('\n');

        // Check for duplicate order number
        const existingRows = await sheets.spreadsheets.values.get({
          spreadsheetId, range: 'Sheet1!A:A',
        });
        const orderExists = existingRows.data.values?.some(row => row[0] === orderNumber);
        if (orderExists) {
          throw new Error('Order number already exists');
        }

        // Append row
        const response = await sheets.spreadsheets.values.append({
          spreadsheetId, range: 'Sheet1!A:F',
          valueInputOption: 'USER_ENTERED',
          insertDataOption: 'INSERT_ROWS',
          requestBody: {
            values: [[orderNumber, ebayUsername, type || 'N/A', formattedMeasurements, submissionDate, 'Submitted']]
          }
        });

        // Format row
        const rowIndex = (response.data.updates?.updatedRange?.match(/\d+/) || ['2'])[0];
        await sheets.spreadsheets.batchUpdate({
          spreadsheetId,
          requestBody: {
            requests: [{
              updateCells: {
                range: { sheetId: 0, startRowIndex: Number(rowIndex) - 1, endRowIndex: Number(rowIndex), startColumnIndex: 0, endColumnIndex: 6 },
                rows: [{ values: Array(6).fill({ userEnteredFormat: { wrapStrategy: 'WRAP', verticalAlignment: 'TOP', textFormat: { fontSize: 11 } } }) }],
                fields: 'userEnteredFormat'
              }
            }]
          }
        });

        apiCache.delete('admin-stats');
        sheetsSuccess = true;
      });
    } catch (sheetsErr) {
      sheetsError = sheetsErr instanceof Error ? sheetsErr.message : 'Sheets unavailable';
      console.error('Sheets error (non-fatal):', sheetsError);
    }

    // Always return success if email was sent
    return NextResponse.json({
      success: emailSent,
      emailSent,
      sheetsSuccess,
      sheetsError
    });

  } catch (error) {
    console.error('Error in API route:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to process request', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
