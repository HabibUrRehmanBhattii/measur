import nodemailer from 'nodemailer';

// Email template generator
export const generateMeasurementEmail = (data: any) => ({
    subject: `Measurement Confirmation - Order #${data.orderNumber}`,
    html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h1 style="color: #333; text-align: center;">Measurement Confirmation</h1>
            <div style="background: #f5f5f5; padding: 20px; border-radius: 8px;">
                <p><strong>Order Number:</strong> ${data.orderNumber}</p>
                <p><strong>eBay Username:</strong> ${data.ebayUsername}</p>
                <p><strong>Product Type:</strong> ${data.type || 'N/A'}</p>
                <h2 style="color: #444;">Measurements:</h2>
                <table style="width: 100%; border-collapse: collapse;">
                    ${Object.entries(data.measurements)
                        .map(([key, value]) => `
                            <tr>
                                <td style="padding: 8px; border: 1px solid #ddd;"><strong>${key}</strong></td>
                                <td style="padding: 8px; border: 1px solid #ddd;">${value}cm</td>
                            </tr>
                        `).join('')}
                </table>
            </div>
            <p style="text-align: center; color: #666; margin-top: 20px;">
                Thank you for your order!
            </p>
        </div>
    `
});

// Create reusable transporter
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_APP_PASSWORD
    },
    pool: true,
    maxConnections: 3,
    rateDelta: 1000,
    rateLimit: 5
});

// Email sender function
export async function sendMeasurementEmail(data: any) {
    try {
        if (!process.env.EMAIL_USER || !process.env.EMAIL_APP_PASSWORD || !process.env.EMAIL_RECIPIENT) {
            throw new Error('Email configuration is missing');
        }

        if (!data.orderNumber || !data.ebayUsername) {
            throw new Error('Missing required measurement data');
        }

        const emailContent = generateMeasurementEmail(data);

        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: process.env.EMAIL_RECIPIENT,
            ...emailContent
        };

        const result = await transporter.sendMail(mailOptions);
        return { success: true, messageId: result.messageId };
    } catch (error) {
        console.error('Email service error:', error);
        return { 
            success: false, 
            error: error instanceof Error ? error.message : 'Unknown email error' 
        };
    }
}