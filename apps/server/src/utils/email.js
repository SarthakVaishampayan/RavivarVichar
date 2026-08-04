const env = require('../config/env');

/**
 * Send an email via Resend's REST API.
 * If RESEND_API_KEY is not configured (e.g. local dev), the email is
 * logged to the console instead so flows remain testable.
 */
async function sendEmail({ to, subject, html, text }) {
  if (!env.RESEND_API_KEY) {
    console.log(
      `[DEV-EMAIL] To: ${to} | Subject: ${subject}\n${text || html || ''}`
    );
    return { dev: true };
  }

  const response = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${env.RESEND_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      from: env.RESEND_FROM,
      to,
      subject,
      html,
      text,
    }),
  });

  if (!response.ok) {
    const body = await response.text().catch(() => '');
    throw new Error(`Resend error ${response.status}: ${body}`);
  }

  return response.json();
}

module.exports = { sendEmail };
