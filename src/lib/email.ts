import nodemailer from 'nodemailer';

export interface ApplicationEmailData {
  full_name: string;
  email: string;
  phone: string;
  age?: number | string;
  occupation: string;
  motivation?: string;
  reason?: string;
}

export async function sendJoinNotificationEmail(data: ApplicationEmailData): Promise<boolean> {
  const recipientEmail = process.env.NOTIFICATION_EMAIL || 'info@rotaractclubofnavimumbai.org, yashsarawgi20@gmail.com';
  const smtpHost = process.env.SMTP_HOST;
  const smtpPort = parseInt(process.env.SMTP_PORT || '465', 10);
  const smtpUser = process.env.SMTP_USER;
  const smtpPass = process.env.SMTP_PASS;

  const applicantMotivation = data.motivation || data.reason || 'No statement provided';
  const applicantAge = data.age || 'Not specified';

  // Construct elegant HTML email body
  const htmlContent = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <style>
          body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #08080b; color: #f8fafc; margin: 0; padding: 20px; }
          .container { max-width: 600px; margin: 0 auto; background: #0f0f15; border: 1px solid #d4af37; border-radius: 16px; padding: 30px; }
          .header { text-align: center; border-b: 1px solid rgba(212, 175, 55, 0.3); padding-bottom: 20px; margin-bottom: 20px; }
          .title { color: #d4af37; font-size: 20px; font-weight: bold; letter-spacing: 1px; margin: 0; }
          .subtitle { color: #94a3b8; font-size: 12px; text-transform: uppercase; letter-spacing: 2px; margin-top: 5px; }
          .field { margin-bottom: 16px; }
          .label { font-size: 11px; text-transform: uppercase; color: #d4af37; letter-spacing: 1px; font-weight: bold; margin-bottom: 4px; }
          .value { font-size: 14px; color: #ffffff; background: #14141c; padding: 10px 14px; border-radius: 8px; border: 1px solid rgba(255,255,255,0.08); }
          .cta-btn { display: block; width: 100%; text-align: center; background: #d4af37; color: #000000; font-weight: bold; padding: 12px 0; text-decoration: none; border-radius: 10px; margin-top: 24px; text-transform: uppercase; letter-spacing: 1px; }
          .footer { text-align: center; margin-top: 24px; font-size: 11px; color: #64748b; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1 class="title">NEW MEMBERSHIP APPLICATION</h1>
            <div class="subtitle">Rotaract Club of Navi Mumbai • 45th Year MAGNUM OPUS</div>
          </div>

          <div class="field">
            <div class="label">Full Name</div>
            <div class="value">${data.full_name}</div>
          </div>

          <div class="field">
            <div class="label">Email Address</div>
            <div class="value"><a href="mailto:${data.email}" style="color: #fde047; text-decoration: none;">${data.email}</a></div>
          </div>

          <div class="field">
            <div class="label">Phone Number</div>
            <div class="value"><a href="tel:${data.phone}" style="color: #fde047; text-decoration: none;">${data.phone}</a></div>
          </div>

          <div class="field">
            <div class="label">Age & Occupation</div>
            <div class="value">${applicantAge} years old • ${data.occupation}</div>
          </div>

          <div class="field">
            <div class="label">Motivation & Statement</div>
            <div class="value" style="white-space: pre-wrap; line-height: 1.6;">${applicantMotivation}</div>
          </div>

          <a href="https://rotaractclubofnavimumbai.org/admin/applications" class="cta-btn">View in Admin CMS Dashboard</a>

          <div class="footer">
            Submitted via Rotaract Club of Navi Mumbai Official Website (/join).
          </div>
        </div>
      </body>
    </html>
  `;

  // If SMTP configuration is provided, send via Nodemailer
  if (smtpHost && smtpUser && smtpPass) {
    try {
      const transporter = nodemailer.createTransport({
        host: smtpHost,
        port: smtpPort,
        secure: smtpPort === 465,
        auth: {
          user: smtpUser,
          pass: smtpPass
        }
      });

      await transporter.sendMail({
        from: `"RCNM Web Portal" <${smtpUser}>`,
        to: recipientEmail,
        replyTo: data.email,
        subject: `[NEW MEMBER APPLICATION] ${data.full_name} - Rotaract Club of Navi Mumbai`,
        html: htmlContent
      });

      console.log(`[RCNM Email] Notification email sent successfully to ${recipientEmail}`);
      return true;
    } catch (error) {
      console.error('[RCNM Email] SMTP dispatch error:', error);
      // Fallback log
    }
  }

  // Fallback log when SMTP credentials are pending configuration
  console.log(`[RCNM Email Log] Simulated email notification to ${recipientEmail}:`);
  console.log(`Applicant: ${data.full_name} (${data.email}, ${data.phone})`);
  return true;
}
