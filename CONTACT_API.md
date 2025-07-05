# Contact Form API

## Overview
The contact form API handles form submissions from portfolio contact forms. It sends emails to portfolio creators using Resend and saves responses to Firebase.

## API Endpoint
`POST /api/contact`

## Request Body
```json
{
  "name": "string",
  "email": "string", 
  "subject": "string",
  "message": "string",
  "portfolioId": "string",
  "creatorEmail": "string",
  "creatorName": "string"
}
```

## Response
### Success (200)
```json
{
  "success": true,
  "messageId": "string",
  "applicationId": "string"
}
```

### Error (400/500)
```json
{
  "error": "string"
}
```

## Features
- ✅ Sends beautiful HTML emails to portfolio creators
- ✅ Saves contact responses to Firebase
- ✅ Generates unique application IDs
- ✅ Form validation and error handling
- ✅ Loading states and user feedback

## Environment Variables
- `EMAIL_RESEND_API_KEY`: Resend API key for sending emails

## Firebase Collections
- `contactResponses`: Stores all contact form submissions

## Email Template
The API sends a professionally designed HTML email with:
- CutHours branding
- Contact form details
- Application ID for tracking
- Responsive design

## Usage Example
```javascript
const response = await fetch('/api/contact', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    name: 'John Doe',
    email: 'john@example.com',
    subject: 'Project Inquiry',
    message: 'I would like to discuss a project...',
    portfolioId: 'abc123',
    creatorEmail: 'creator@example.com',
    creatorName: 'Jane Smith'
  })
});
``` 