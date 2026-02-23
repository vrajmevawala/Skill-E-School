import nodemailer from "nodemailer";

const isSmtpConfigured =
    process.env.SMTP_USER &&
    process.env.SMTP_PASS &&
    process.env.SMTP_USER !== "your-email@gmail.com";

const transporter = isSmtpConfigured
    ? nodemailer.createTransport({
          host: process.env.SMTP_HOST || "smtp.gmail.com",
          port: Number(process.env.SMTP_PORT) || 587,
          secure: false,
          auth: {
              user: process.env.SMTP_USER,
              pass: process.env.SMTP_PASS,
          },
      })
    : null;

export async function sendOtpEmail(to: string, otp: string) {
    // Always log to console so OTP is visible in dev
    console.log(`\n========================================`);
    console.log(`  OTP for ${to}: ${otp}`);
    console.log(`========================================\n`);

    if (!transporter) {
        console.log(`  [DEV MODE] SMTP not configured — use the OTP above.`);
        return;
    }

    await transporter.sendMail({
        from: `"Skill E-School" <${process.env.SMTP_USER}>`,
        to,
        subject: "Your Verification Code - Skill E-School",
        html: `
      <div style="font-family:Arial,sans-serif;max-width:480px;margin:0 auto;padding:32px;border:1px solid #e5e7eb;border-radius:12px;">
        <h2 style="color:#1e293b;margin-bottom:8px;">Email Verification</h2>
        <p style="color:#64748b;">Use the code below to verify your email address. It expires in ${process.env.OTP_EXPIRY_MINUTES || 5} minutes.</p>
        <div style="text-align:center;margin:24px 0;">
          <span style="display:inline-block;font-size:32px;font-weight:bold;letter-spacing:8px;color:#2563eb;background:#eff6ff;padding:16px 32px;border-radius:8px;">${otp}</span>
        </div>
        <p style="color:#94a3b8;font-size:13px;">If you didn't request this, please ignore this email.</p>
      </div>
    `,
    });
}
