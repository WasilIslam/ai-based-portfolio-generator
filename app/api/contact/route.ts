import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';
import { saveContactResponse } from '../../firebase/contacts';
import { getPortfolioByPortfolioId } from '../../firebase/portfolios';

const resend = new Resend(process.env.EMAIL_RESEND_API_KEY);

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, email, subject, message, portfolioId, creatorEmail, creatorName } = body;

    // Validate required fields
    if (!name || !email || !subject || !message || !portfolioId || !creatorEmail) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Get IP address from various headers
    const getClientIP = () => {
      return request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
             request.headers.get('x-real-ip') ||
             request.headers.get('cf-connecting-ip') ||
             request.headers.get('x-client-ip') ||
             'Unknown';
    };

    // Generate a unique application ID
    const applicationId = `contact_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

    // Get the portfolio to find the userId
    const portfolio = await getPortfolioByPortfolioId(portfolioId);
    if (!portfolio) {
      return NextResponse.json(
        { error: 'Portfolio not found' },
        { status: 404 }
      );
    }

    // Save to Firebase
    await saveContactResponse({
      portfolioId,
      userId: portfolio.userId,
      name,
      email,
      subject,
      message,
      status: 'sent',
      ipAddress: getClientIP(),
      userAgent: request.headers.get('user-agent') || undefined
    });

    // Create HTML email content
    const htmlEmail = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>New Contact Message - CutHours</title>
        <style>
          body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            line-height: 1.6;
            color: #333;
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
            background-color: #f8f9fa;
          }
          .container {
            background-color: white;
            border-radius: 12px;
            padding: 40px;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
          }
          .header {
            text-align: center;
            margin-bottom: 30px;
            padding-bottom: 20px;
            border-bottom: 2px solid #f0f0f0;
          }
          .logo {
            font-size: 24px;
            font-weight: bold;
            color: #2563eb;
            margin-bottom: 10px;
          }
          .subtitle {
            color: #6b7280;
            font-size: 14px;
          }
          .content {
            margin-bottom: 30px;
          }
          .field {
            margin-bottom: 20px;
          }
          .field-label {
            font-weight: 600;
            color: #374151;
            margin-bottom: 5px;
            font-size: 14px;
          }
          .field-value {
            background-color: #f9fafb;
            padding: 12px;
            border-radius: 8px;
            border-left: 4px solid #2563eb;
            font-size: 14px;
          }
          .footer {
            text-align: center;
            margin-top: 30px;
            padding-top: 20px;
            border-top: 2px solid #f0f0f0;
            color: #6b7280;
            font-size: 12px;
          }
          .highlight {
            background-color: #dbeafe;
            padding: 15px;
            border-radius: 8px;
            margin-bottom: 20px;
            border-left: 4px solid #2563eb;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <div class="logo">CutHours</div>
            <div class="subtitle">Portfolio Contact Form</div>
          </div>
          
          <div class="highlight">
            <strong>🎉 New Contact Message!</strong><br>
            Someone has reached out through your CutHours portfolio.
          </div>
          
          <div class="content">
            <div class="field">
              <div class="field-label">From:</div>
              <div class="field-value">${name} (${email})</div>
            </div>
            
            <div class="field">
              <div class="field-label">Subject:</div>
              <div class="field-value">${subject}</div>
            </div>
            
            <div class="field">
              <div class="field-label">Message:</div>
              <div class="field-value">${message.replace(/\n/g, '<br>')}</div>
            </div>
          </div>
          
          <div class="footer">
            <p>This message was sent from your CutHours portfolio contact form.</p>
            <p>Application ID: ${applicationId}</p>
            <p>© 2024 CutHours. All rights reserved.</p>
          </div>
        </div>
      </body>
      </html>
    `;

    // Send email using Resend
    const { data, error } = await resend.emails.send({
      from: 'CutHours <noreply@cuthours.com>',
      to: [creatorEmail],
      subject: `New Contact Message: ${subject}`,
      html: htmlEmail,
    });

    if (error) {
      console.error('Resend error:', error);
      return NextResponse.json(
        { error: 'Failed to send email' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      messageId: data?.id,
      applicationId
    });

  } catch (error) {
    console.error('Contact API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 