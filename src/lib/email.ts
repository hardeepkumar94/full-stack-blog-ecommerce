import nodemailer from "nodemailer";

function escapeHtml(value: string) {
  return value.replace(
    /[&<>'"]/g,
    (character) =>
      ({
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        "'": "&#39;",
        '"': "&quot;",
      })[character] ?? character,
  );
}

function getEmailConfig() {
  const host = process.env.SMTP_HOST;
  const port = Number(process.env.SMTP_PORT);
  const user = process.env.SMTP_USER;
  const password = process.env.SMTP_PASSWORD;
  const from = process.env.EMAIL_FROM;

  if (!host || !port || !user || !password || !from) {
    throw new Error("SMTP environment variables are not fully configured.");
  }

  return { host, port, user, password, from };
}

export function createEmailTransport() {
  const config = getEmailConfig();

  return nodemailer.createTransport({
    host: config.host,
    port: config.port,
    secure: config.port === 465,
    auth: {
      user: config.user,
      pass: config.password,
    },
  });
}

export async function sendVerificationEmail({
  email,
  name,
  code,
}: {
  email: string;
  name: string;
  code: string;
}) {
  const config = getEmailConfig();
  const transport = createEmailTransport();
  const safeName = escapeHtml(name);
  const safeCode = escapeHtml(code);

  await transport.sendMail({
    from: config.from,
    to: email,
    subject: "Verify your email address",
    text: `Hello ${name}, your verification code is ${code}. It expires in 10 minutes.`,
    html: `
      <div style="font-family:Arial,sans-serif;line-height:1.6;color:#1f2937">
        <h1 style="font-size:24px">Verify your email address</h1>
        <p>Hello ${safeName},</p>
        <p>Enter this code to finish creating your account:</p>
        <p style="font-size:32px;font-weight:700;letter-spacing:8px">${safeCode}</p>
        <p>This code expires in 10 minutes.</p>
        <p>If you did not create this account, you can ignore this email.</p>
      </div>
    `,
  });
}
