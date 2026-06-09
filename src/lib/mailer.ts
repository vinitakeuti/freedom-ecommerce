import nodemailer from "nodemailer";

export async function sendMail(to: string, subject: string, html: string) {
  const host = process.env.SMTP_HOST || "smtp.hostinger.com";
  const port = parseInt(process.env.SMTP_PORT || "465", 10);
  const secure = process.env.SMTP_SECURE !== "false" && (process.env.SMTP_SECURE === "true" || port === 465);
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;
  const from = process.env.SMTP_FROM || `"${process.env.NEXT_PUBLIC_SITE_NAME || "Freedom E-commerce"}" <${user}>`;

  if (!user || !pass) {
    console.warn("[mailer] SMTP credentials not fully configured (SMTP_USER/SMTP_PASS). Email not sent.");
    return;
  }

  const transporter = nodemailer.createTransport({
    host,
    port,
    secure,
    auth: {
      user,
      pass,
    },
  });

  await transporter.sendMail({
    from,
    to,
    subject,
    html,
  });
}
