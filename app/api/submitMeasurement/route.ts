import { google } from 'googleapis';
import { NextResponse } from 'next/server';
import { sendMeasurementEmail } from '@/app/utils/email';

const SPREADSHEET_ID = process.env.GOOGLE_SPREADSHEET_ID;
const CLIENT_EMAIL = process.env.GOOGLE_CLIENT_EMAIL;
const PRIVATE_KEY = process.env.GOOGLE_PRIVATE_KEY;

export async function POST(req: Request) {
  try {
    if (!SPREADSHEET_ID) throw new Error('Spreadsheet ID is not configured');
    if (!CLIENT_EMAIL) throw new Error('Client email is not configured');
    if (!PRIVATE_KEY) throw new Error('Private key is not configured');

    const body = await req.json();
    const { type, orderNumber, ebayUsername, measurements } = body;

    const auth = new google.auth.GoogleAuth({
      credentials: {
        client_email: CLIENT_EMAIL,
        private_key: PRIVATE_KEY.replace(/\\n/g, '\n'),
      },
      scopes: ['https://www.googleapis.com/auth/spreadsheets'],
    });

    const sheets = google.sheets({ version: 'v4', auth });

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

    // Check if the order number already exists
    const existingRows = await sheets.spreadsheets.values.get({
      spreadsheetId: SPREADSHEET_ID,
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
      spreadsheetId: SPREADSHEET_ID,
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
      spreadsheetId: SPREADSHEET_ID,
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
