import nodemailer from 'nodemailer';

const GMAIL_USER = process.env.GMAIL_USER;
const GMAIL_PASS = process.env.GMAIL_PASS;

if (!GMAIL_USER || !GMAIL_PASS) {
  console.error('❌ GMAIL_USER and GMAIL_PASS must be set in environment variables');
  process.exit(1);
}

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: GMAIL_USER,
    pass: GMAIL_PASS,
  },
});

/**
 * Create HTML email body with proper formatting
 * @param {Object} data - Form data
 * @returns {string} - HTML email body
 */
function createHtmlEmail(data) {
  const { name, email, phone, message } = data;
  
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body {
          font-family: Arial, sans-serif;
          line-height: 1.6;
          color: #333;
        }
        .container {
          max-width: 600px;
          margin: 0 auto;
          padding: 20px;
          border: 1px solid #ddd;
          border-radius: 5px;
        }
        .header {
          background-color: #f8f8f8;
          padding: 15px;
          margin-bottom: 20px;
          border-bottom: 2px solid #007bff;
          text-align: center;
        }
        .content {
          padding: 0 15px;
        }
        .field {
          margin-bottom: 15px;
        }
        .label {
          font-weight: bold;
          color: #555;
        }
        .message-box {
          background-color: #f9f9f9;
          padding: 15px;
          border-left: 4px solid #007bff;
          margin: 15px 0;
        }
        .footer {
          margin-top: 30px;
          padding-top: 15px;
          border-top: 1px solid #eee;
          font-size: 0.9em;
          color: #777;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h2>Нове повідомлення від контактної форми</h2>
        </div>
        <div class="content">
          <div class="field">
            <span class="label">Ім'я:</span> ${name}
          </div>
          <div class="field">
            <span class="label">Email:</span> <a href="mailto:${email}">${email}</a>
          </div>
          ${phone ? `<div class="field">
            <span class="label">Телефон:</span> ${phone}
          </div>` : ''}
          <div class="field">
            <span class="label">Повідомлення:</span>
            <div class="message-box">
              ${message.replace(/\n/g, '<br>')}
            </div>
          </div>
        </div>
        <div class="footer">
          Це повідомлення було надіслано автоматично з контактної форми вашого веб-сайту.
        </div>
      </div>
    </body>
    </html>
  `;
}

/**
 * Create plain text email body as fallback
 * @param {Object} data - Form data
 * @returns {string} - Plain text email body
 */
function createTextEmail(data) {
  const { name, email, phone, message } = data;
  
  return `
Нове повідомлення від контактної форми

Ім'я: ${name}
Email: ${email}
${phone ? `Телефон: ${phone}\n` : ''}
Повідомлення:
${message}

Це повідомлення було надіслано автоматично з контактної форми вашого веб-сайту.
  `.trim();
}

/**
 * Send an email
 * @param {Object} options
 * @param {string} options.to - Recipient email
 * @param {string} options.subject - Email subject
 * @param {string} options.text - Plain text body
 * @param {string} options.html - HTML body
 * @param {Object} options.formData - Original form data
 * @returns {Promise<void>}
 */
export async function sendEmail({ 
  to = 'legalexpert.kancelaria@gmail.com', 
  subject, 
  text, 
  html, 
  formData 
}) {
  if (!to || !subject) {
    throw new Error('Missing required email fields');
  }

  // If formData is provided, generate HTML and text versions automatically
  if (formData) {
    html = createHtmlEmail(formData);
    text = createTextEmail(formData);
  } else if (!text && !html) {
    throw new Error('Either formData or text/html content must be provided');
  }

  const mailOptions = {
    from: `"Legal Expert" <${GMAIL_USER}>`,
    to,
    subject,
    text,
    html: html || undefined
  };

  try {
    await transporter.sendMail(mailOptions);
    console.info(`✅ Email sent to ${to}`);
  } catch (error) {
    console.error('❌ Failed to send email:', error);
    throw new Error('Failed to send email');
  }
}