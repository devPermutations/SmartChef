const nodemailer = require('nodemailer');

let transporter = null;

function getTransporter() {
  if (transporter) return transporter;

  const host = process.env.SMTP_HOST;
  const port = parseInt(process.env.SMTP_PORT, 10) || 587;
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;

  if (!host || !user || !pass) {
    // No SMTP configured — use console fallback
    return null;
  }

  transporter = nodemailer.createTransport({
    host,
    port,
    secure: port === 465,
    auth: { user, pass },
  });

  return transporter;
}

async function sendOtpEmail(toEmail, otpCode) {
  const transport = getTransporter();

  if (!transport) {
    // Fallback: log to console (dev mode)
    console.log(`[OTP-EMAIL] To: ${toEmail} | Code: ${otpCode}`);
    return { sent: false, fallback: true };
  }

  const fromAddress = process.env.SMTP_FROM || process.env.SMTP_USER;

  await transport.sendMail({
    from: `"SmartChef" <${fromAddress}>`,
    to: toEmail,
    subject: 'Your SmartChef verification code',
    text: `Your verification code is: ${otpCode}\n\nThis code expires in 5 minutes. If you didn't request this, you can ignore this email.`,
    html: `
      <div style="font-family: sans-serif; max-width: 400px; margin: 0 auto; padding: 20px;">
        <h2 style="color: #16a34a;">SmartChef</h2>
        <p>Your verification code is:</p>
        <div style="font-size: 32px; font-weight: bold; letter-spacing: 8px; color: #166534; padding: 16px; background: #f0fdf4; border-radius: 8px; text-align: center; margin: 16px 0;">
          ${otpCode}
        </div>
        <p style="color: #666; font-size: 14px;">This code expires in 5 minutes. If you didn't request this, you can ignore this email.</p>
      </div>
    `,
  });

  return { sent: true };
}

module.exports = { sendOtpEmail };
