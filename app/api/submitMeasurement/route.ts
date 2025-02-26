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

    // Format the date
    const submissionDate = new Date().toLocaleString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });

    // Format measurements without quotes
    const formattedMeasurements = Object.entries(measurements)
      .map(([key, value]) => `${key}: ${value}cm`)
      .join('\n');

    // Use sheets client from the pool
    return await withSheetsClient(async (sheets, spreadsheetId) => {
      try {
        // Check if the order number already exists
        const existingRows = await sheets.spreadsheets.values.get({
          spreadsheetId,
          range: 'Sheet1!A:A',
        });

        const orderExists = existingRows.data.values?.some(
          row => row[0] === orderNumber
        );

        if (orderExists) {
          return NextResponse.json({
            success: false,
            error: 'Order number already exists'
          }, { status: 400 });
        }

        // Append the new row
        const response = await sheets.spreadsheets.values.append({
          spreadsheetId,
          range: 'Sheet1!A:F',
          valueInputOption: 'USER_ENTERED',
          insertDataOption: 'INSERT_ROWS',
          requestBody: {
            values: [[
              orderNumber,
              ebayUsername,
              type || 'N/A',
              formattedMeasurements,
              submissionDate,
              'Submitted'
            ]]
          }
        });

        // Get the row index
        const rowIndex = (response.data.updates?.updatedRange?.match(/\d+/) || ['2'])[0];

        // Format the row
        await sheets.spreadsheets.batchUpdate({
          spreadsheetId,
          requestBody: {
            requests: [{
              updateCells: {
                range: {
                  sheetId: 0,
                  startRowIndex: Number(rowIndex) - 1,
                  endRowIndex: Number(rowIndex),
                  startColumnIndex: 0,
                  endColumnIndex: 6
                },
                rows: [{
                  values: Array(6).fill({
                    userEnteredFormat: {
                      wrapStrategy: 'WRAP',
                      verticalAlignment: 'TOP',
                      textFormat: { fontSize: 11 }
                    }
                  })
                }],
                fields: 'userEnteredFormat'
              }
            }]
          }
        });

        // Clear the admin stats cache since we've added a new measurement
        apiCache.delete('admin-stats');

        // After successfully saving to Google Sheets, send email
        const emailResult = await sendMeasurementEmail(body);
        if (!emailResult.success) {
          console.error('Failed to send email:', emailResult.error);
        }

        return NextResponse.json({ 
          success: true,
          rowIndex: rowIndex,
          updatedRange: response.data.updates?.updatedRange,
          emailSent: emailResult.success
        });
      } catch (error) {
        console.error('Error in Sheets operation:', error);
        throw error; // Re-throw to be caught by the outer try/catch
      }
    });
  } catch (error) {
    console.error('Error in API route:', error);
    return NextResponse.json(
      { 
        success: false,
        error: 'Failed to process request',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
