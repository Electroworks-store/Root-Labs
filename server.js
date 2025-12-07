const express = require('express');
const cors = require('cors');
const nodemailer = require('nodemailer');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json({ limit: '10mb' }));
app.use(cors({
  origin: process.env.CORS_ORIGIN || '*',
  methods: ['POST', 'OPTIONS']
}));

// In-memory rate limiting (simple)
const rateLimitStore = new Map();
const RATE_LIMIT_WINDOW = 10 * 60 * 1000; // 10 minutes
const RATE_LIMIT_MAX = 5;

function checkRateLimit(ip) {
  const now = Date.now();
  const key = ip;
  
  if (!rateLimitStore.has(key)) {
    rateLimitStore.set(key, { count: 1, resetAt: now + RATE_LIMIT_WINDOW });
    return true;
  }
  
  const record = rateLimitStore.get(key);
  
  // Reset if window expired
  if (now > record.resetAt) {
    rateLimitStore.set(key, { count: 1, resetAt: now + RATE_LIMIT_WINDOW });
    return true;
  }
  
  // Check limit
  if (record.count >= RATE_LIMIT_MAX) {
    return false;
  }
  
  record.count++;
  return true;
}

// Clean up rate limit store periodically
setInterval(() => {
  const now = Date.now();
  for (const [key, record] of rateLimitStore.entries()) {
    if (now > record.resetAt) {
      rateLimitStore.delete(key);
    }
  }
}, 60 * 1000); // Every minute

// Validate email format
function isValidEmail(email) {
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailPattern.test(email);
}

// Configure nodemailer transporter
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: parseInt(process.env.SMTP_PORT || '587'),
  secure: process.env.SMTP_SECURE === 'true', // true for 465, false for other ports
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

// Verify SMTP connection on startup
transporter.verify((error, success) => {
  if (error) {
    console.error('❌ SMTP configuration error:', error.message);
    console.error('Please check your environment variables.');
  } else {
    console.log('✓ SMTP server is ready to send emails');
  }
});

// POST /api/lead endpoint
app.post('/api/lead', async (req, res) => {
  try {
    // Rate limiting
    const clientIp = req.ip || req.connection.remoteAddress;
    if (!checkRateLimit(clientIp)) {
      return res.status(429).json({
        ok: false,
        error: 'Too many requests. Please try again later.'
      });
    }

    const { name, email, message, services, budget, timeline, contactMethod, pricingCall, fileAttachment } = req.body;

    // Reject if file attachment present
    if (fileAttachment) {
      return res.status(400).json({
        ok: false,
        error: 'File attachments are not supported. Please include file links in your message.'
      });
    }

    // Validate required fields
    if (!name || !email || !message) {
      return res.status(400).json({
        ok: false,
        error: 'Missing required fields: name, email, and message are required.'
      });
    }

    // Validate email format
    if (!isValidEmail(email)) {
      return res.status(400).json({
        ok: false,
        error: 'Invalid email address format.'
      });
    }

    // Build email content
    const servicesText = services && services.length > 0 
      ? services.join(', ') 
      : 'None selected';

    const emailBody = `
New Lead Submission from Website

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
CONTACT INFORMATION
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Name: ${name}
Email: ${email}
${contactMethod ? `Preferred Contact: ${contactMethod}` : ''}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
PROJECT DETAILS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Services Interested In: ${servicesText}
${budget ? `Budget: ${budget}` : ''}
${timeline ? `Timeline: ${timeline}` : ''}
${pricingCall ? `Wants Pricing Call: Yes` : ''}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
MESSAGE
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

${message}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Submitted: ${new Date().toLocaleString('en-US', { 
  timeZone: 'America/New_York',
  dateStyle: 'full',
  timeStyle: 'long'
})}
    `.trim();

    const emailHtml = `
<!DOCTYPE html>
<html>
<head>
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
    .header { background: linear-gradient(135deg, #8A3DE6 0%, #38bdf8 100%); color: white; padding: 20px; border-radius: 8px 8px 0 0; }
    .content { background: #f9fafb; padding: 30px; border-radius: 0 0 8px 8px; }
    .section { background: white; padding: 20px; margin-bottom: 20px; border-radius: 8px; border-left: 4px solid #8A3DE6; }
    .label { font-weight: 600; color: #6b7280; font-size: 0.875rem; text-transform: uppercase; letter-spacing: 0.05em; }
    .value { color: #111827; font-size: 1rem; margin-top: 4px; }
    .message-box { background: #f3f4f6; padding: 16px; border-radius: 6px; white-space: pre-wrap; }
    .footer { text-align: center; margin-top: 20px; color: #6b7280; font-size: 0.875rem; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1 style="margin: 0; font-size: 1.5rem;">🎯 New Lead Submission</h1>
      <p style="margin: 8px 0 0 0; opacity: 0.9;">Root Labs Contact Form</p>
    </div>
    <div class="content">
      <div class="section">
        <div class="label">Contact Information</div>
        <div class="value"><strong>Name:</strong> ${name}</div>
        <div class="value"><strong>Email:</strong> <a href="mailto:${email}">${email}</a></div>
        ${contactMethod ? `<div class="value"><strong>Preferred Contact:</strong> ${contactMethod}</div>` : ''}
      </div>

      <div class="section">
        <div class="label">Project Details</div>
        <div class="value"><strong>Services:</strong> ${servicesText}</div>
        ${budget ? `<div class="value"><strong>Budget:</strong> ${budget}</div>` : ''}
        ${timeline ? `<div class="value"><strong>Timeline:</strong> ${timeline}</div>` : ''}
        ${pricingCall ? `<div class="value" style="color: #8A3DE6;"><strong>💼 Wants Pricing Call</strong></div>` : ''}
      </div>

      <div class="section">
        <div class="label">Message</div>
        <div class="message-box">${message}</div>
      </div>

      <div class="footer">
        Submitted: ${new Date().toLocaleString('en-US', { 
          dateStyle: 'full',
          timeStyle: 'long'
        })}
      </div>
    </div>
  </div>
</body>
</html>
    `.trim();

    // Send email
    const mailOptions = {
      from: `"Root Labs Contact Form" <${process.env.FROM_EMAIL}>`,
      to: process.env.TO_EMAIL,
      replyTo: email,
      subject: `New Lead: ${name} - ${servicesText}`,
      text: emailBody,
      html: emailHtml,
    };

    await transporter.sendMail(mailOptions);

    console.log(`✓ Lead email sent successfully from ${email}`);

    res.json({
      ok: true,
      message: 'Lead submitted successfully'
    });

  } catch (error) {
    console.error('❌ Error processing lead:', error);
    res.status(500).json({
      ok: false,
      error: 'Failed to send email. Please try again or contact us directly.'
    });
  }
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Start server
app.listen(PORT, () => {
  console.log(`\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`);
  console.log(`🚀 Contact Form API Server Running`);
  console.log(`━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`);
  console.log(`Port: ${PORT}`);
  console.log(`Endpoint: POST /api/lead`);
  console.log(`\nMake sure environment variables are set:`);
  console.log(`  SMTP_HOST, SMTP_PORT, SMTP_SECURE`);
  console.log(`  SMTP_USER, SMTP_PASS`);
  console.log(`  FROM_EMAIL, TO_EMAIL`);
  console.log(`━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n`);
});
