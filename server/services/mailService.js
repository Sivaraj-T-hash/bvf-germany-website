import 'dotenv/config';
import nodemailer from 'nodemailer';

const mailTransport = String(process.env.MAIL_TRANSPORT || 'smtp')
  .trim()
  .toLowerCase();

const smtpHost = process.env.SMTP_HOST;
const smtpPort = Number(process.env.SMTP_PORT || 0);
const smtpUser = process.env.SMTP_USER;
const smtpPass = process.env.SMTP_PASS;
const mailFrom = process.env.MAIL_FROM;
const smtpSecure = String(process.env.SMTP_SECURE || smtpPort === 465).toLowerCase() === 'true';
const smtpRequireTls = String(process.env.SMTP_REQUIRE_TLS || 'false').toLowerCase() === 'true';
const smtpConnectionTimeout = Number(process.env.SMTP_CONNECTION_TIMEOUT || 10000);
const smtpGreetingTimeout = Number(process.env.SMTP_GREETING_TIMEOUT || 10000);
const smtpSocketTimeout = Number(process.env.SMTP_SOCKET_TIMEOUT || 20000);

const resendApiKey = process.env.RESEND_API_KEY;
const resendApiBase = String(process.env.RESEND_API_BASE || 'https://api.resend.com').replace(/\/+$/, '');

if (!mailFrom) {
  throw new Error('Missing MAIL_FROM in environment.');
}

let transporter = null;
if (mailTransport === 'smtp') {
  if (!smtpHost || !smtpPort || !smtpUser || !smtpPass) {
    throw new Error(
      'MAIL_TRANSPORT=smtp requires SMTP_HOST, SMTP_PORT, SMTP_USER, and SMTP_PASS in environment.',
    );
  }

  transporter = nodemailer.createTransport({
    host: smtpHost,
    port: smtpPort,
    secure: smtpSecure,
    requireTLS: smtpRequireTls,
    connectionTimeout: smtpConnectionTimeout,
    greetingTimeout: smtpGreetingTimeout,
    socketTimeout: smtpSocketTimeout,
    auth: {
      user: smtpUser,
      pass: smtpPass,
    },
  });
}

if (mailTransport === 'resend' && !resendApiKey) {
  throw new Error('MAIL_TRANSPORT=resend requires RESEND_API_KEY in environment.');
}

if (mailTransport !== 'smtp' && mailTransport !== 'resend') {
  throw new Error('Unsupported MAIL_TRANSPORT. Use "smtp" or "resend".');
}

async function sendViaSmtp(message) {
  return transporter.sendMail(message);
}

async function sendViaResend(message) {
  const to = Array.isArray(message.to) ? message.to : [message.to];
  const response = await fetch(`${resendApiBase}/emails`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${resendApiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      from: message.from,
      to,
      subject: message.subject,
      text: message.text,
      html: message.html,
    }),
  });

  if (!response.ok) {
    const errorBody = await response.text();
    throw new Error(`Resend API request failed (${response.status}): ${errorBody}`);
  }

  return response.json();
}

async function sendMail(message) {
  try {
    if (mailTransport === 'resend') {
      return sendViaResend(message);
    }
    return sendViaSmtp(message);
  } catch (error) {
    if (mailTransport === 'smtp' && error?.code === 'ETIMEDOUT') {
      throw new Error(
        'SMTP connection timed out. On Render free web services, outbound SMTP ports are blocked. Use MAIL_TRANSPORT=resend on Render, or move SMTP to an unblocked environment.',
      );
    }
    throw error;
  }
}

const mailFromAddressMatch = /<([^>]+)>/.exec(mailFrom || '');
const mailFromAddress = mailFromAddressMatch?.[1] || mailFrom;
const getAdminNotificationEmail = () => process.env.ADMIN_NOTIFICATION_EMAIL || smtpUser || mailFromAddress;

const escapeHtml = (value) =>
  String(value || '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');

const renderRows = (rows) =>
  rows
    .map(
      (row) => `
        <tr>
          <td style="padding:8px 12px;border:1px solid #e2e8f0;font-weight:600;">${escapeHtml(row.label)}</td>
          <td style="padding:8px 12px;border:1px solid #e2e8f0;">${escapeHtml(row.value)}</td>
        </tr>
      `,
    )
    .join('');

function getTemplateForForm(formType, payload) {
  const baseRows = [
    { label: 'Name', value: payload.name },
    { label: 'Email', value: payload.email },
    { label: 'Phone', value: payload.phone || '-' },
  ];

  if (formType === 'contact') {
    return {
      adminSubject: 'New contact inquiry received',
      userSubject: 'We received your contact inquiry | BVF Germany',
      adminRows: [...baseRows, { label: 'Message', value: payload.message || '-' }],
      userMessage: 'Thank you for contacting BVF Germany. Our team will reach out within 24 hours.',
    };
  }

  if (formType === 'booking') {
    return {
      adminSubject: 'New consultation booking request',
      userSubject: 'Your consultation request is received | BVF Germany',
      adminRows: [
        ...baseRows,
        { label: 'Preferred Date', value: payload.preferredDate || '-' },
        { label: 'Preferred Time', value: payload.preferredTime || '-' },
        { label: 'Notes', value: payload.notes || '-' },
      ],
      userMessage: 'Your consultation request has been submitted successfully. Our team will confirm your slot shortly.',
    };
  }

  return {
    adminSubject: 'New webinar registration received',
    userSubject: 'Your webinar registration is confirmed | BVF Germany',
    adminRows: [
      ...baseRows,
      { label: 'Webinar Title', value: payload.webinarTitle || '-' },
      { label: 'Webinar Date', value: payload.webinarDate || '-' },
      { label: 'Qualification', value: payload.qualification || '-' },
      { label: 'Target Intake', value: payload.intake || '-' },
      { label: 'Planning Year', value: payload.planningYear || '-' },
    ],
    userMessage: `Your registration for ${payload.webinarTitle || 'the webinar'} is successful. You will receive next-step details soon.`,
  };
}

export async function sendTemporaryPasswordEmail(to, tempPassword) {
  return sendMail({
    from: mailFrom,
    to,
    subject: 'Your temporary BVF login password',
    text: `Your temporary password is: ${tempPassword}. Please sign in and change it immediately.`,
    html: `
      <p>Your temporary password is:</p>
      <h2 style="letter-spacing:0.08em;">${tempPassword}</h2>
      <p>Please sign in and change it immediately.</p>
      <p>This password expires in 15 minutes.</p>
    `,
  });
}

export async function sendPasswordResetEmail(to, resetLink) {
  return sendMail({
    from: mailFrom,
    to,
    subject: 'Reset your BVF Germany password',
    text: `Use this secure link to reset your BVF Germany password: ${resetLink}`,
    html: `
      <p>You requested a password reset for your BVF Germany student account.</p>
      <p>
        <a
          href="${escapeHtml(resetLink)}"
          style="display:inline-block;padding:12px 20px;border-radius:999px;background:#0f766e;color:#ffffff;text-decoration:none;font-weight:700;"
        >
          Reset your password
        </a>
      </p>
      <p>If the button does not open, copy and paste this link into your browser:</p>
      <p style="word-break:break-all;">${escapeHtml(resetLink)}</p>
      <p>If you did not request this, you can safely ignore this email.</p>
    `,
  });
}

export async function sendWelcomeEmail(to, name = 'Student') {
  return sendMail({
    from: mailFrom,
    to,
    subject: 'Welcome to BVF Germany',
    text: `Hi ${name}, your account was created successfully. Welcome to BVF Germany.`,
    html: `
      <p>Hi ${escapeHtml(name)},</p>
      <p>Your account was created successfully.</p>
      <p>Welcome to <strong>BVF Germany</strong>. We are excited to support your Germany study journey.</p>
    `,
  });
}

export async function sendFormSubmissionEmails(formType, payload) {
  const template = getTemplateForForm(formType, payload);
  const adminEmail = getAdminNotificationEmail();

  const adminHtml = `
    <p>A new ${escapeHtml(formType)} form was submitted.</p>
    <table style="border-collapse:collapse;border:1px solid #e2e8f0;">${renderRows(template.adminRows)}</table>
  `;

  const userHtml = `
    <p>Hi ${escapeHtml(payload.name || 'Student')},</p>
    <p>${escapeHtml(template.userMessage)}</p>
    <p>Regards,<br/>BVF Germany Team</p>
  `;

  await Promise.all([
    sendMail({
      from: mailFrom,
      to: adminEmail,
      subject: template.adminSubject,
      html: adminHtml,
      text: `${template.adminSubject}\n\n${template.adminRows.map((row) => `${row.label}: ${row.value}`).join('\n')}`,
    }),
    sendMail({
      from: mailFrom,
      to: payload.email,
      subject: template.userSubject,
      html: userHtml,
      text: `Hi ${payload.name || 'Student'},\n\n${template.userMessage}\n\nRegards,\nBVF Germany Team`,
    }),
  ]);
}

export async function sendAdminBroadcastEmails(input) {
  const recipients = Array.isArray(input.recipients)
    ? Array.from(new Set(input.recipients.map((email) => String(email || '').trim().toLowerCase()).filter(Boolean)))
    : [];

  if (!recipients.length) {
    return { sent: 0 };
  }

  const subject = String(input.subject || 'BVF Germany update');
  const title = String(input.title || 'New update from BVF Germany');
  const message = String(input.message || '');
  const ctaUrl = String(input.ctaUrl || '');
  const ctaLabel = String(input.ctaLabel || '');

  const html = `
    <p>Hi Student,</p>
    <p>${escapeHtml(message)}</p>
    ${ctaUrl ? `<p><a href="${escapeHtml(ctaUrl)}">${escapeHtml(ctaLabel || 'View update')}</a></p>` : ''}
    <p>Regards,<br/>BVF Germany Team</p>
  `;
  const text = `Hi Student,\n\n${message}${ctaUrl ? `\n\n${ctaLabel || 'View update'}: ${ctaUrl}` : ''}\n\nRegards,\nBVF Germany Team`;

  let sent = 0;
  for (const recipient of recipients) {
    // Sequential sends avoid provider throttling spikes on smaller SMTP accounts.
    await sendMail({
      from: mailFrom,
      to: recipient,
      subject,
      html,
      text,
    });
    sent += 1;
  }

  return { sent };
}
