import { google, sheets_v4 } from 'googleapis';

// Connection pool for Google Sheets clients
class SheetsConnectionPool {
  private static instance: SheetsConnectionPool;
  private pool: sheets_v4.Sheets[] = [];
  private maxPoolSize: number = 5;
  private inUse: Set<sheets_v4.Sheets> = new Set();

  private constructor() {
    // Initialize the pool with connections
    this.initializePool();
  }

  /**
   * Get the singleton instance
   */
  public static getInstance(): SheetsConnectionPool {
    if (!SheetsConnectionPool.instance) {
      SheetsConnectionPool.instance = new SheetsConnectionPool();
    }
    return SheetsConnectionPool.instance;
  }

  /**
   * Initialize the connection pool
   */
  private initializePool(): void {
    for (let i = 0; i < this.maxPoolSize; i++) {
      this.addConnectionToPool();
    }
  }

  /**
   * Create and add a new sheets connection to the pool
   */
  private addConnectionToPool(): void {
    try {
      const auth = new google.auth.GoogleAuth({
        credentials: {
          client_email: process.env.GOOGLE_CLIENT_EMAIL,
          private_key: process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
        },
        scopes: ['https://www.googleapis.com/auth/spreadsheets'],
      });

      const sheetsClient = google.sheets({ version: 'v4', auth });
      this.pool.push(sheetsClient);
    } catch (error) {
      console.error('Error creating sheets connection:', error);
    }
  }

  /**
   * Get a sheets client from the pool
   */
  public getConnection(): sheets_v4.Sheets {
    // Try to find an available connection
    for (const connection of this.pool) {
      if (!this.inUse.has(connection)) {
        this.inUse.add(connection);
        return connection;
      }
    }

    // If all connections are in use, create a new one
    const auth = new google.auth.GoogleAuth({
      credentials: {
        client_email: process.env.GOOGLE_CLIENT_EMAIL,
        private_key: process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
      },
      scopes: ['https://www.googleapis.com/auth/spreadsheets'],
    });

    const newConnection = google.sheets({ version: 'v4', auth });
    this.inUse.add(newConnection);
    
    return newConnection;
  }

  /**
   * Release a connection back to the pool
   */
  public releaseConnection(connection: sheets_v4.Sheets): void {
    this.inUse.delete(connection);
  }
}

/**
 * Get the spreadsheet ID from environment variables
 */
export function getSpreadsheetId(): string {
  const spreadsheetId = process.env.GOOGLE_SPREADSHEET_ID;
  if (!spreadsheetId) {
    throw new Error('Spreadsheet ID is not configured');
  }
  return spreadsheetId;
}

/**
 * Execute an operation with a Google Sheets client from the pool
 */
export async function withSheetsClient<T>(
  operation: (sheets: sheets_v4.Sheets, spreadsheetId: string) => Promise<T>
): Promise<T> {
  const pool = SheetsConnectionPool.getInstance();
  const client = pool.getConnection();
  const spreadsheetId = getSpreadsheetId();
  
  try {
    return await operation(client, spreadsheetId);
  } finally {
    pool.releaseConnection(client);
  }
}