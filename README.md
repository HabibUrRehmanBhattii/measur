# Measurement Management System

A Next.js application for managing and processing measurement submissions with Google Sheets integration and automated email notifications.

## 🚀 Features

- **Modern Tech Stack**
  - Next.js 15.1.7 with App Router
  - React 19
  - TypeScript
  - TailwindCSS for styling
  - GSAP for animations

- **Measurement Submission**
  - Dynamic form handling
  - Real-time validation
  - Responsive design
  - Loading animations
  - Success/Failure notifications

- **Data Management**
  - Google Sheets integration for data storage
  - Automatic row formatting
  - Duplicate order number prevention
  - Structured data organization

- **Automated Communications**
  - Email notifications using Nodemailer
  - Professional HTML email templates
  - Confirmation emails for submissions
  - Error handling and logging
  
- **Admin Panel**
  - Secure authentication system
  - Protected admin routes
  - Measurement statistics dashboard
  - User-friendly interface

## 🛠️ Technical Implementation

### 1. Google Sheets Integration
```typescript
// Connects to Google Sheets API
const sheets = google.sheets({ version: 'v4', auth });

// Stores measurements with formatting
const response = await sheets.spreadsheets.values.append({
  spreadsheetId: SPREADSHEET_ID,
  range: 'Sheet1!A:F',
  valueInputOption: 'USER_ENTERED',
  insertDataOption: 'INSERT_ROWS',
  requestBody: {
    values: [[orderNumber, ebayUsername, type, measurements, date, status]]
  }
});
```

### 2. Email Notification System
```typescript
// Automated email sending
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_APP_PASSWORD
  },
  pool: true,
  maxConnections: 3
});
```

### 3. API Routes
- `/api/submitMeasurement`: Handles measurement submissions
- Validates data
- Stores in Google Sheets
- Sends confirmation emails

## 🔧 Setup and Configuration

### Prerequisites
- Node.js 18.18.0 or higher
- Google Cloud Platform account
- Gmail account for sending emails

### Environment Variables
Create a `.env.local` file with:
```plaintext
GOOGLE_SPREADSHEET_ID=your_spreadsheet_id
GOOGLE_CLIENT_EMAIL=your_service_account_email
GOOGLE_PRIVATE_KEY=your_private_key
EMAIL_USER=your_gmail
EMAIL_APP_PASSWORD=your_app_specific_password
EMAIL_RECIPIENT=recipient_email
ADMIN_USERNAME=your_admin_username
ADMIN_PASSWORD_HASH=your_admin_password_hash
```

### Admin Authentication Setup
```bash
# Set up admin credentials
npm run setup-admin
```
This interactive script will prompt you for a username and password, then securely hash the password and add both to your `.env.local` file.

### Installation
```bash
# Clone the repository
git clone [repository-url]

# Install dependencies
npm install

# Run development server
npm run dev
```

## 📦 Project Structure

```
├── app/
│   ├── api/
│   │   └── submitMeasurement/
│   │       └── route.ts
│   ├── measurement/
│   │   └── [type]/
│   │       └── page.tsx
│   ├── utils/
│   │   └── email.ts
│   ├── layout.tsx
│   └── page.tsx
├── public/
├── .env.local
├── next.config.ts
└── package.json
```

## 🔐 Security Features

- Environment variable protection
- API route validation
- Error handling and logging
- Rate limiting for email sending
- Connection pooling

## 🎨 UI/UX Features

- Responsive design
- Loading animations
- Success/Failure notifications
- Form validation
- Clean and modern interface
- Mobile-friendly layout

## 📈 Performance Optimizations

- Connection pooling for emails
- Rate limiting for API calls
- Optimized Google Sheets operations
- Efficient error handling
- Response caching

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgments

- Next.js team for the amazing framework
- Google Cloud Platform for Sheets API
- Vercel for hosting and deployment
- TailwindCSS for styling utilities
- GSAP for animations

## 📞 Support

For support, email [your-email] or open an issue in the repository.

---

Built with ❤️ using Next.js and TypeScript

## 📋 TODO & Future Enhancements

### Authentication & Authorization
- [x] Implement user authentication system
- [x] Add admin authentication for secure access
- [ ] Add role-based access control (Admin, User, Viewer)
- [ ] Add OAuth2.0 integration for social logins
- [ ] Implement session management
- [ ] Add two-factor authentication (2FA)

### Data Management
- [ ] Add bulk measurement import/export functionality
- [ ] Implement measurement history tracking
- [ ] Add data versioning system
- [ ] Create automated backup system
- [ ] Implement data archiving functionality
- [ ] Add measurement comparison tools

### UI/UX Improvements
- [ ] Add dark/light theme toggle
- [ ] Implement drag-and-drop measurement input
- [ ] Add interactive measurement visualization
- [ ] Create mobile app version
- [ ] Implement offline functionality
- [ ] Add multi-language support
- [ ] Create printable measurement reports

### Analytics & Reporting
- [ ] Add measurement statistics dashboard
- [ ] Implement data visualization charts
- [ ] Create automated weekly/monthly reports
- [ ] Add export functionality (PDF, CSV, Excel)
- [ ] Implement trend analysis
- [ ] Add custom report builder

### API Enhancements
- [ ] Create public API endpoints
- [ ] Implement API rate limiting
- [ ] Add API documentation using Swagger/OpenAPI
- [ ] Create API versioning system
- [ ] Add webhook support
- [ ] Implement batch processing endpoints

### Performance Optimization
- [ ] Implement Redis caching
- [ ] Add image optimization for measurement diagrams
- [ ] Implement lazy loading for large datasets
- [ ] Add service worker for offline capabilities
- [ ] Optimize database queries
- [ ] Implement CDN integration

### Testing & Quality
- [ ] Add end-to-end testing suite
- [ ] Implement unit tests for all components
- [ ] Add integration tests
- [ ] Implement automated CI/CD pipeline
- [ ] Add performance monitoring
- [ ] Implement error tracking system

### Security Enhancements
- [ ] Add CSRF protection
- [ ] Implement rate limiting for form submissions
- [ ] Add IP blocking functionality
- [ ] Implement audit logging
- [ ] Add security headers
- [ ] Regular security audits automation

### Email System Improvements
- [ ] Add email template customization
- [ ] Implement email scheduling system
- [ ] Add email tracking functionality
- [ ] Create email preference management
- [ ] Add support for multiple email providers
- [ ] Implement email queue system

### Integration Possibilities
- [ ] Add CRM system integration
- [ ] Implement payment gateway integration
- [ ] Add calendar integration for appointments
- [ ] Implement chat support system
- [ ] Add shipping carrier integration
- [ ] Create inventory management system integration

### Documentation
- [ ] Create comprehensive API documentation
- [ ] Add user guide with videos
- [ ] Create developer documentation
- [ ] Add troubleshooting guide
- [ ] Create deployment guide
- [ ] Add contribution guidelines

### Business Features
- [ ] Implement customer management system
- [ ] Add order tracking functionality
- [ ] Create pricing calculator
- [ ] Implement discount system
- [ ] Add loyalty program
- [ ] Create referral system
